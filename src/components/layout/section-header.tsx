// Section header: eyebrow, title, and optional description with alignment options.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "mx-auto max-w-2xl items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "inline-flex items-center gap-2 font-mono text-sm tracking-widest text-accent-2 uppercase",
            align === "center" && "justify-center",
          )}
        >
          <span aria-hidden="true" className="h-px w-6 bg-accent-2/60" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base text-pretty text-foreground-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
