// DATUM Rule — the only elevation device besides z-order. A hairline separator;
// `signal` renders a short orange registration tick instead of a full rule.
import { cn } from "@/lib/utils";

interface RuleProps {
  orientation?: "horizontal" | "vertical";
  weight?: "hair" | "strong";
  /** Orange registration tick (short) rather than a full-length hairline. */
  signal?: boolean;
  className?: string;
}

export function Rule({
  orientation = "horizontal",
  weight = "hair",
  signal = false,
  className,
}: RuleProps) {
  const color = signal ? "bg-signal" : weight === "strong" ? "bg-rule-strong" : "bg-rule";
  return (
    <span
      role="separator"
      aria-orientation={orientation}
      className={cn(
        orientation === "horizontal"
          ? signal
            ? "block h-px w-6"
            : "block h-px w-full"
          : signal
            ? "block h-6 w-px"
            : "block h-full w-px",
        color,
        className,
      )}
    />
  );
}
