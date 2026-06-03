// Accessible form message primitive plus the field context that flags error state.
"use client";

import { createContext, useContext, type ReactNode } from "react";
import { m } from "framer-motion";

import { DURATION, EASE } from "@/animations/easings";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface FormFieldContextValue {
  invalid: boolean;
  messageId?: string;
}

/**
 * Shared between FormField (provider) and FormMessage (consumer). When a field
 * is invalid, FormMessage upgrades to a role="alert" live region; otherwise it
 * renders as plain help text. FormMessage is safe to use without a provider.
 */
export const FormFieldContext = createContext<FormFieldContextValue | null>(null);

interface FormMessageProps {
  children?: ReactNode;
  id?: string;
  className?: string;
}

export function FormMessage({ children, id, className }: FormMessageProps) {
  const field = useContext(FormFieldContext);
  const reduced = useReducedMotion();
  const isError = field?.invalid ?? false;
  const resolvedId = id ?? field?.messageId;

  if (children == null || children === "") {
    return null;
  }

  // Height-safe enter/exit: opacity (+ tiny y when motion is allowed), never animated
  // height, so surrounding layout never reflows. Reduced motion → opacity only.
  const motionProps = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: DURATION.fast },
      }
    : {
        initial: { opacity: 0, y: -4 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -4 },
        transition: {
          duration: DURATION.base,
          ease: [...EASE.out] as [number, number, number, number],
        },
      };

  return (
    <m.p
      id={resolvedId}
      data-slot="form-message"
      role={isError ? "alert" : undefined}
      className={cn(
        "text-sm leading-snug",
        isError ? "text-destructive" : "text-foreground-muted",
        className,
      )}
      initial={motionProps.initial}
      animate={motionProps.animate}
      exit={motionProps.exit}
      transition={motionProps.transition}
    >
      {children}
    </m.p>
  );
}
