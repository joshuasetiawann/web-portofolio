// Layout container: constrains content width and applies responsive gutters.
// `grid` opts into the DATUM 12-column field.
import { createElement, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerSize = "content" | "wide" | "prose";

const sizeClasses: Record<ContainerSize, string> = {
  content: "max-w-[1280px]",
  wide: "max-w-[1440px]",
  prose: "max-w-[720px]",
};

export interface ContainerProps {
  as?: ElementType;
  size?: ContainerSize;
  /** Opt into the 12-column instrument field. */
  grid?: boolean;
  className?: string;
  children: ReactNode;
}

export function Container({
  as = "div",
  size = "content",
  grid = false,
  className,
  children,
}: ContainerProps) {
  return createElement(
    as,
    {
      className: cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        grid && "grid grid-cols-12 gap-x-[var(--grid-gutter)]",
        className,
      ),
    },
    children,
  );
}
