// DATUM gutter context — sections register themselves so the IndexGutter rail and
// the StatusBar can show `SECT n/total` and the active line item. Document-ordered;
// active section tracked via a single IntersectionObserver band. Safe no-op default
// so consumers never crash outside a provider (e.g. global-error).
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface GutterSection {
  id: string;
  index: string;
  label?: string;
}

interface GutterContextValue {
  sections: GutterSection[];
  activeId: string | null;
  activeOrdinal: number; // 1-based; 0 when none
  register: (section: GutterSection, element: HTMLElement) => void;
  unregister: (id: string) => void;
}

const NOOP: GutterContextValue = {
  sections: [],
  activeId: null,
  activeOrdinal: 0,
  register: () => {},
  unregister: () => {},
};

const GutterContext = createContext<GutterContextValue | null>(null);

export function useGutter(): GutterContextValue {
  return useContext(GutterContext) ?? NOOP;
}

export function GutterProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<GutterSection[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const entries = useRef(new Map<string, { section: GutterSection; element: HTMLElement }>());
  const sectionsRef = useRef<GutterSection[]>([]);
  const visible = useRef(new Set<string>());
  const observer = useRef<IntersectionObserver | null>(null);

  const recomputeOrder = useCallback(() => {
    const ordered = Array.from(entries.current.values())
      .sort((a, b) =>
        a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      )
      .map((e) => e.section);
    sectionsRef.current = ordered;
    setSections(ordered);
  }, []);

  const recomputeActive = useCallback(() => {
    const active = sectionsRef.current.find((s) => visible.current.has(s.id))?.id ?? null;
    setActiveId(active);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (obsEntries) => {
        for (const entry of obsEntries) {
          const id = (entry.target as HTMLElement).dataset.gutterId;
          if (!id) continue;
          if (entry.isIntersecting) visible.current.add(id);
          else visible.current.delete(id);
        }
        recomputeActive();
      },
      { rootMargin: "-45% 0px -55% 0px", threshold: 0 },
    );
    observer.current = io;
    for (const { element } of entries.current.values()) io.observe(element);
    return () => {
      io.disconnect();
      observer.current = null;
    };
  }, [recomputeActive]);

  const register = useCallback(
    (section: GutterSection, element: HTMLElement) => {
      element.dataset.gutterId = section.id;
      entries.current.set(section.id, { section, element });
      observer.current?.observe(element);
      recomputeOrder();
    },
    [recomputeOrder],
  );

  const unregister = useCallback(
    (id: string) => {
      const entry = entries.current.get(id);
      if (entry) observer.current?.unobserve(entry.element);
      entries.current.delete(id);
      visible.current.delete(id);
      recomputeOrder();
      recomputeActive();
    },
    [recomputeOrder, recomputeActive],
  );

  const activeOrdinal = activeId ? sections.findIndex((s) => s.id === activeId) + 1 : 0;

  const value = useMemo<GutterContextValue>(
    () => ({ sections, activeId, activeOrdinal, register, unregister }),
    [sections, activeId, activeOrdinal, register, unregister],
  );

  return <GutterContext.Provider value={value}>{children}</GutterContext.Provider>;
}
