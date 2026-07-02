// Jump Menu: full-screen overlay nav (⌘K). Radix Dialog supplies focus trap,
// Esc handling, scroll lock, and aria; rendered inline (no portal) so it stays
// inside the `.landing` token scope. Section scrolls run after the exit
// animation completes — the Radix scroll lock would swallow them mid-close.
"use client";

import { useRef } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Dialog as DialogPrimitive } from "radix-ui";

import { socialLinks } from "@/data/social-links";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useSectionScroll } from "./use-section-scroll";

export const JUMP_NAV = [
  { label: "Work", id: "work" },
  { label: "Philosophy", id: "philosophy" },
  { label: "Experience", id: "experience" },
  { label: "Writing", id: "writing" },
  { label: "Contact", id: "contact" },
] as const;

export function JumpMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toSection } = useSectionScroll();
  const reducedMotion = useReducedMotion();
  const pendingTarget = useRef<string | null>(null);

  const duration = reducedMotion ? 0 : 0.4;

  const handleNavigate = (id: string) => {
    pendingTarget.current = id;
    onOpenChange(false);
  };

  const handleExitComplete = () => {
    if (pendingTarget.current) {
      toSection(pendingTarget.current);
      pendingTarget.current = null;
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence onExitComplete={handleExitComplete}>
        {open ? (
          <>
            <DialogPrimitive.Overlay forceMount asChild>
              <m.div
                className="l-menu-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration, ease: "easeInOut" }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content forceMount asChild aria-describedby={undefined}>
              <m.div
                className="l-menu-content"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: duration * 1.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-between">
                  <DialogPrimitive.Title asChild>
                    <span className="l-eyebrow text-foreground-subtle">Jump anywhere</span>
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Close className="l-menu-close" aria-label="Close menu">
                    ✕
                  </DialogPrimitive.Close>
                </div>

                <nav className="flex flex-1 flex-col justify-center gap-1 py-6">
                  {JUMP_NAV.map((item, i) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="l-menu-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate(item.id);
                      }}
                    >
                      <span className="l-menu-link-index">0{i + 1}</span>
                      <span className="l-menu-link-label">{item.label}</span>
                    </a>
                  ))}
                </nav>

                <div className="font-gm flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[13px]">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="l-menu-social"
                    >
                      {social.label} <span className="opacity-60">↗</span>
                    </a>
                  ))}
                </div>
              </m.div>
            </DialogPrimitive.Content>
          </>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
