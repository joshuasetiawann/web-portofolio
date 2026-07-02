// DATUM GutterIndex — a mono line-item index label, e.g. `PRJ-014`. Zero-pads
// numeric indices to 3. The recurring "data-as-decoration" wayfinding token.
import { cn } from "@/lib/utils";

interface GutterIndexProps {
  prefix?: string;
  index: string | number;
  className?: string;
}

export function GutterIndex({ prefix, index, className }: GutterIndexProps) {
  const num = typeof index === "number" ? String(index).padStart(3, "0") : index;
  return (
    <span
      className={cn(
        "font-mono tabular text-mono-label whitespace-nowrap text-foreground-subtle uppercase",
        className,
      )}
    >
      {prefix ? `${prefix}-${num}` : num}
    </span>
  );
}
