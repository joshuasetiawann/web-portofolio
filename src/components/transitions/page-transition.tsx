"use client";

// Enter-only route transition, keyed on the pathname so each route's content
// lifts in on navigation. TRANSFORM-ONLY (no opacity gate): content is always
// painted at full opacity, so it is never invisible on first load, never delays
// LCP, and remains visible with JS disabled. Transform-based motion does not
// contribute to CLS. Fully bypassed under reduced motion.

import { usePathname } from "next/navigation";
import { m } from "framer-motion";
import type { ReactNode } from "react";

import { DURATION, EASE } from "@/animations/easings";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <m.div
      key={pathname}
      initial={{ y: 8 }}
      animate={{ y: 0 }}
      transition={{ duration: DURATION.base, ease: [...EASE.out] }}
    >
      {children}
    </m.div>
  );
}
