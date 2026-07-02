// DATUM LedgerRow / LedgerList — the declassified instrument ledger behind every index
// route. Full-bleed hairline rows (index · coord/timestamp · title · spec strip · caret),
// no cards/fills/radius. LedgerRow is pure RSC markup; LedgerList (client) runs a single
// delegated GSAP hover scan-line and is reduced-motion / coarse-pointer safe.
"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { GutterIndex } from "@/components/layout/gutter-index";
import { getGsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface LedgerRowProps {
  prefix?: string;
  index: string | number;
  coordinate?: string;
  timestamp?: string;
  title: ReactNode;
  href?: string;
  external?: boolean;
  specs?: string[];
  metric?: { value: ReactNode; suffix?: string };
  active?: boolean;
  className?: string;
}

export function LedgerRow({
  prefix,
  index,
  coordinate,
  timestamp,
  title,
  href,
  external,
  specs,
  metric,
  active,
  className,
}: LedgerRowProps) {
  const meta = coordinate ?? timestamp;
  const inner = (
    <>
      <GutterIndex
        prefix={prefix}
        index={index}
        className={cn(
          "w-16 shrink-0 self-start pt-1.5 transition-colors",
          active && "text-signal",
          href && "group-hover:text-signal",
        )}
      />
      <div className="min-w-0 flex-1">
        <h3
          className={cn(
            "truncate font-sans text-lg text-foreground transition-colors md:text-xl",
            href && "group-hover:text-signal",
          )}
        >
          {title}
        </h3>
        {specs?.length ? (
          <p className="mt-1 truncate font-mono tabular text-mono-meta text-foreground-muted">
            {specs.join(" · ")}
          </p>
        ) : null}
      </div>
      {meta ? (
        <span className="hidden shrink-0 self-start pt-2 font-mono tabular text-mono-meta text-foreground-subtle md:block">
          {meta}
        </span>
      ) : null}
      {metric ? (
        <span className="shrink-0 self-start pt-1 font-mono tabular text-mono-metric text-foreground">
          {metric.value}
          {metric.suffix ? <span className="text-foreground-subtle">{metric.suffix}</span> : null}
        </span>
      ) : null}
      {href ? (
        <ArrowUpRight
          className="size-4 shrink-0 self-center text-foreground-subtle transition-colors group-hover:text-signal"
          aria-hidden="true"
        />
      ) : null}
    </>
  );

  return (
    <li data-ledger-row className={cn("group relative border-t border-border", className)}>
      <span
        aria-hidden="true"
        className="ledger-scan pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-signal"
      />
      {href ? (
        <Link
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="flex items-baseline gap-4 py-5 md:gap-6"
        >
          {inner}
        </Link>
      ) : (
        <div className="flex items-baseline gap-4 py-5 md:gap-6">{inner}</div>
      )}
    </li>
  );
}

interface LedgerListProps {
  /** Optional mono column-header row (e.g. INDEX · COORD · TITLE · SPEC). */
  header?: ReactNode;
  children: ReactNode;
  className?: string;
  label?: string;
}

export function LedgerList({ header, children, className, label }: LedgerListProps) {
  const ref = useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const list = ref.current;
    if (!list || reducedMotion) return;
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) return;

    const { gsap } = getGsap();
    let current: Element | null = null;

    const scanOf = (row: Element | null) => row?.querySelector<HTMLElement>(".ledger-scan") ?? null;
    const forward = (row: Element) => {
      const scan = scanOf(row);
      if (scan) gsap.to(scan, { scaleX: 1, duration: 0.24, ease: "power3.out", overwrite: true });
    };
    const reverse = (row: Element) => {
      const scan = scanOf(row);
      if (scan) gsap.to(scan, { scaleX: 0, duration: 0.12, ease: "power2.in", overwrite: true });
    };

    const onOver = (event: PointerEvent) => {
      const row = (event.target as HTMLElement | null)?.closest("[data-ledger-row]");
      if (!row || row === current) return;
      if (current) reverse(current);
      current = row;
      forward(row);
    };
    const onOut = (event: PointerEvent) => {
      const next = event.relatedTarget as Node | null;
      if (next && list.contains(next)) return;
      if (current) reverse(current);
      current = null;
    };

    list.addEventListener("pointerover", onOver);
    list.addEventListener("pointerout", onOut);
    return () => {
      list.removeEventListener("pointerover", onOver);
      list.removeEventListener("pointerout", onOut);
    };
  }, [reducedMotion]);

  return (
    <div className={cn("border-b border-border", className)}>
      {header ? (
        <div className="flex items-baseline gap-4 border-b border-border pb-2 font-mono text-mono-label tracking-wider text-foreground-subtle uppercase md:gap-6">
          {header}
        </div>
      ) : null}
      <ul ref={ref} role="list" aria-label={label}>
        {children}
      </ul>
    </div>
  );
}
