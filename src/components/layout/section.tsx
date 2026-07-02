// Section wrapper: consistent vertical rhythm. DATUM adds opt-in instrument hooks —
// a top hairline `rule`, a `showGrid` overlay, and gutter registration via `index`
// (which also renders an inline mono tick below lg where the rail is hidden).
// All new props are additive; a bare <Section> behaves exactly as before.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Rule } from "@/components/layout/rule";
import { GridOverlay } from "@/components/layout/grid-overlay";
import { SectionRegistrar } from "@/components/layout/section-registrar";

interface SectionProps {
  id?: string;
  /** Gutter index token, e.g. "01" — registers the section and shows a mobile tick. */
  index?: string;
  label?: string;
  /** Top hairline rule across the section. */
  rule?: boolean;
  /** Faint 12-col grid overlay behind the section. */
  showGrid?: boolean;
  className?: string;
  children: ReactNode;
}

export function Section({
  id,
  index,
  label,
  rule = false,
  showGrid = false,
  className,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn("relative py-[var(--spacing-section)]", className)}>
      {rule ? <Rule className="absolute inset-x-0 top-0" /> : null}
      {showGrid ? <GridOverlay className="absolute inset-0 -z-10" /> : null}
      {index ? (
        <>
          <SectionRegistrar id={id ?? index} index={index} label={label} />
          <span className="mb-6 block font-mono text-mono-label text-signal uppercase lg:hidden">
            {index}
            {label ? ` · ${label}` : ""}
          </span>
        </>
      ) : null}
      {children}
    </section>
  );
}
