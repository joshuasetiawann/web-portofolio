// Layout container: constrains content width and applies responsive gutters.
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
  className?: string;
  children: ReactNode;
}

export function Container({ as = "div", size = "content", className, children }: ContainerProps) {
  return createElement(
    as,
    { className: cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizeClasses[size], className) },
    children,
  );
}
