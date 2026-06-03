// react-hook-form-aware field wrapper: renders label, control, help/error text with ARIA wiring.
"use client";

import { useId, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { AnimatePresence } from "framer-motion";

import { FormFieldContext, FormMessage } from "@/components/forms/form-message";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Props handed to the render function so the control can be wired for a11y. */
export interface FormFieldRenderProps {
  id: string;
  name: string;
  "aria-invalid": boolean | undefined;
  "aria-describedby": string | undefined;
  "aria-required": boolean | undefined;
}

interface FormFieldProps {
  /** Field path registered with react-hook-form (must match the form schema). */
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  className?: string;
  children: (field: FormFieldRenderProps) => ReactNode;
}

export function FormField({
  name,
  label,
  description,
  required,
  className,
  children,
}: FormFieldProps) {
  const uid = useId();
  const fieldId = `${uid}-field`;
  const descriptionId = `${uid}-description`;
  const messageId = `${uid}-message`;

  const { formState, getFieldState } = useFormContext();
  const fieldState = getFieldState(name, formState);
  const invalid = fieldState.invalid;
  const errorMessage =
    typeof fieldState.error?.message === "string" ? fieldState.error.message : undefined;

  const describedBy =
    [description ? descriptionId : null, invalid ? messageId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <FormFieldContext.Provider value={{ invalid, messageId }}>
      <div data-slot="form-field" className={cn("group flex flex-col gap-2", className)}>
        {label ? (
          <Label htmlFor={fieldId} className="transition-colors group-focus-within:text-primary">
            {label}
            {required ? (
              <span className="text-destructive" aria-hidden="true">
                *
              </span>
            ) : null}
          </Label>
        ) : null}

        {children({
          id: fieldId,
          name,
          "aria-invalid": invalid || undefined,
          "aria-describedby": describedBy,
          "aria-required": required || undefined,
        })}

        {description ? (
          <p id={descriptionId} className="text-sm text-foreground-muted">
            {description}
          </p>
        ) : null}

        <AnimatePresence initial={false}>
          {invalid && errorMessage ? (
            <FormMessage key="form-message" id={messageId}>
              {errorMessage}
            </FormMessage>
          ) : null}
        </AnimatePresence>
      </div>
    </FormFieldContext.Provider>
  );
}
