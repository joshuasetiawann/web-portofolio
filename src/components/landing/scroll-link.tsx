// ScrollLink: in-page anchor that scrolls to a landing section with the 60px
// header offset, honoring the scene motion switch for smooth vs instant.
"use client";

import type { ReactNode } from "react";

import { useSectionScroll } from "./use-section-scroll";

export function ScrollLink({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: ReactNode;
}) {
  const { toSection } = useSectionScroll();
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        toSection(to);
      }}
    >
      {children}
    </a>
  );
}
