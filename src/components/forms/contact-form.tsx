// Accessible contact form: react-hook-form + zod client validation wired to the submitContact server action.
"use client";

import { useActionState, useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { m, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";

import { submitContact, initialContactState, type ContactFormState } from "@/actions/contact";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { DURATION, EASE } from "@/animations/easings";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(
    submitContact,
    initialContactState,
  );

  // Captured once on mount (lazy initializer); used by the server's anti-spam fill-time check.
  const [startedAt] = useState<number>(() => Date.now());

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", message: "", company: "" },
  });

  // Reflect server-side outcomes back into the field state and reset on success.
  useEffect(() => {
    if (state.status === "error" && state.fieldErrors) {
      for (const [key, message] of Object.entries(state.fieldErrors)) {
        form.setError(key as keyof ContactInput, { type: "server", message });
      }
    }
    if (state.status === "success") {
      form.reset();
    }
  }, [state, form]);

  // RHF validates on the client first, then dispatches a FormData payload to the action.
  const onValid = (values: ContactInput) => {
    const data = new FormData();
    data.set("name", values.name);
    data.set("email", values.email);
    data.set("message", values.message);
    data.set("company", values.company ?? "");
    data.set("startedAt", String(startedAt));
    formAction(data);
  };

  const isSuccess = state.status === "success";
  const isError = state.status === "error" && !!state.message;

  // Motion is gated on the user's reduced-motion preference: transform + fade when
  // allowed, opacity-only (or none) otherwise. transform/opacity only — no layout props.
  const reduced = useReducedMotion();
  const tapFeedback = reduced ? { opacity: 0.7 } : { scale: 0.97 };
  const statusMotion = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: DURATION.fast },
      }
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: {
          duration: DURATION.base,
          ease: [...EASE.out] as [number, number, number, number],
        },
      };

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onValid)}
        className="flex flex-col gap-6 rounded-2xl border border-border bg-surface-1 p-6 sm:p-8"
        aria-busy={isPending}
      >
        <FormField name="name" label="Name" required>
          {(field) => (
            <Input
              {...field}
              {...form.register("name")}
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              disabled={isPending}
            />
          )}
        </FormField>

        <FormField name="email" label="Email" required>
          {(field) => (
            <Input
              {...field}
              {...form.register("email")}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="jane@example.com"
              disabled={isPending}
            />
          )}
        </FormField>

        <FormField
          name="message"
          label="Message"
          required
          description="Tell me a little about your project, role, or question."
        >
          {(field) => (
            <Textarea
              {...field}
              {...form.register("message")}
              rows={6}
              placeholder="What can I help you build?"
              className="min-h-32 resize-y"
              disabled={isPending}
            />
          )}
        </FormField>

        {/* Honeypot: hidden from real users; bots that fill it are silently rejected. */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="contact-company">Company (leave blank)</label>
          <input
            {...form.register("company")}
            id="contact-company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-4">
          <m.div
            className="w-full sm:w-auto"
            whileTap={isPending ? undefined : tapFeedback}
            transition={{
              duration: DURATION.fast,
              ease: [...EASE.out] as [number, number, number, number],
            }}
          >
            <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                <>
                  <Send aria-hidden="true" />
                  Send message
                </>
              )}
            </Button>
          </m.div>

          {/* Persistent live region for the submission outcome. */}
          <div aria-live="polite" role="status">
            <AnimatePresence initial={false} mode="wait">
              {isSuccess ? (
                <m.p
                  key="contact-success"
                  className="flex items-start gap-2 text-sm font-medium text-success"
                  initial={statusMotion.initial}
                  animate={statusMotion.animate}
                  exit={statusMotion.exit}
                  transition={statusMotion.transition}
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{state.message}</span>
                </m.p>
              ) : isError ? (
                <m.p
                  key="contact-error"
                  className="flex items-start gap-2 text-sm font-medium text-destructive"
                  initial={statusMotion.initial}
                  animate={statusMotion.animate}
                  exit={statusMotion.exit}
                  transition={statusMotion.transition}
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{state.message}</span>
                </m.p>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <p className={cn("text-xs text-foreground-subtle")}>
          Your details are used only to reply to your message and are never shared.
        </p>
      </form>
    </FormProvider>
  );
}
