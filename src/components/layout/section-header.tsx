// Section header — DATUM instrument style: mono eyebrow led by an orange registration
// tick, optional gutter index, an Archivo Expanded display title, and right-pinnable
// meta. Flush-left always (the legacy `align` prop is accepted but coerced to left).
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Rule } from "@/components/layout/rule";

interface SectionHeaderProps {
  index?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  /** @deprecated DATUM is flush-left; retained for API compatibility, coerced to left. */
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  meta,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col items-start gap-3 text-left", className)}>
      {eyebrow || index ? (
        <span className="inline-flex items-center gap-2 font-mono text-mono-eyebrow text-signal uppercase">
          <Rule signal />
          {index ? <span className="tabular text-foreground-subtle">{index}</span> : null}
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-display-lg text-balance text-foreground">{title}</h2>
      {description ? (
        <p className="max-w-[720px] text-pretty text-foreground-muted">{description}</p>
      ) : null}
      {meta ? <div className="font-mono text-mono-label text-foreground-subtle">{meta}</div> : null}
    </div>
  );
}
