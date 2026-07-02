// Registers its parent <section> with the GutterContext so the rail + StatusBar can
// index it. Renders an inert anchor only; no visible output.
"use client";

import { useEffect, useRef } from "react";

import { useGutter } from "@/components/layout/gutter-context";

interface SectionRegistrarProps {
  id: string;
  index: string;
  label?: string;
}

export function SectionRegistrar({ id, index, label }: SectionRegistrarProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const { register, unregister } = useGutter();

  useEffect(() => {
    const el = anchor.current?.closest("section");
    if (!el) return;
    register({ id, index, label }, el);
    return () => unregister(id);
  }, [id, index, label, register, unregister]);

  return <span ref={anchor} aria-hidden="true" className="sr-only" />;
}
