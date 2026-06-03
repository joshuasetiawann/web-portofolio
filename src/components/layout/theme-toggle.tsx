"use client";

// Theme toggle: switches between dark and light themes via next-themes.
import { AnimatePresence, m } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { DURATION, EASE } from "@/animations/easings";
import { useMounted } from "@/hooks/use-mounted";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const reducedMotion = useReducedMotion();

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";
  const showSun = mounted && isDark;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={mounted ? label : "Toggle theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {reducedMotion ? (
        showSun ? (
          <Sun className="size-5" aria-hidden="true" />
        ) : (
          <Moon className="size-5" aria-hidden="true" />
        )
      ) : (
        <AnimatePresence initial={false} mode="wait">
          <m.span
            key={showSun ? "sun" : "moon"}
            className="inline-flex"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: DURATION.base, ease: [...EASE.out] }}
          >
            {showSun ? (
              <Sun className="size-5" aria-hidden="true" />
            ) : (
              <Moon className="size-5" aria-hidden="true" />
            )}
          </m.span>
        </AnimatePresence>
      )}
    </Button>
  );
}
