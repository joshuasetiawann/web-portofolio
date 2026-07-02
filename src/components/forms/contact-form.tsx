// TRANSMISSION console — react-hook-form + zod client validation wired to the submitContact
// server action. DATUM-styled: mono TX field labels, hairline bottom-rule inputs, and a
// status-bar submit console (TRANSMIT / SENDING… / TX OK / TX FAIL) with an aria-live outcome.
// The useActionState / zod / honeypot logic is unchanged from the accessible baseline.
"use client";

import { useActionState, useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { m, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

import { submitContact, initialContactState, type ContactFormState } from "@/actions/contact";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Rule } from "@/components/layout/rule";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { DURATION, EASE } from "@/animations/easings";
import { cn } from "@/lib/utils";

// Hairline bottom-rule field: strips the box, keeps a single orange-on-focus underline.
const HAIRLINE_FIELD =
  "rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:border-signal";

function pad3(n: number): string {
  return String(n).padStart(3, "0");
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(
    submitContact,
    initialContactState,
  );

  // Captured once on mount (lazy initializer); used by the server's anti-spam fill-time check.
  const [startedAt] = useState<number>(() => Date.now());
  // Transmission tally — steps 000 → 001 → … on each accepted transmission.
  const [txCount, setTxCount] = useState(0);

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", message: "", company: "" },
  });

  // Reflect server-side outcomes back into the field state and reset/step on success.
  useEffect(() => {
    if (state.status === "error" && state.fieldErrors) {
      for (const [key, message] of Object.entries(state.fieldErrors)) {
        form.setError(key as keyof ContactInput, { type: "server", message });
      }
    }
    if (state.status === "success") {
      form.reset();
      setTxCount((n) => n + 1);
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

  // Motion is gated on the user's reduced-motion preference (opacity-only when reduced).
  const reduced = useReducedMotion();
  const outcomeMotion = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: DURATION.fast },
      }
    : {
        initial: { opacity: 0, y: 4 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -4 },
        transition: {
          duration: DURATION.base,
          ease: [...EASE.snap] as [number, number, number, number],
        },
      };

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onValid)}
        className="flex flex-col gap-8"
        aria-busy={isPending}
      >
        <FormField name="name" label="TX-01 · Name" required>
          {(field) => (
            <Input
              {...field}
              {...form.register("name")}
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              disabled={isPending}
              className={HAIRLINE_FIELD}
            />
          )}
        </FormField>

        <FormField name="email" label="TX-02 · Email" required>
          {(field) => (
            <Input
              {...field}
              {...form.register("email")}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="jane@example.com"
              disabled={isPending}
              className={HAIRLINE_FIELD}
            />
          )}
        </FormField>

        <FormField
          name="message"
          label="TX-03 · Message"
          required
          description="Tell me a little about your project, role, or question."
        >
          {(field) => (
            <Textarea
              {...field}
              {...form.register("message")}
              rows={6}
              placeholder="What can I help you build?"
              className={cn(HAIRLINE_FIELD, "min-h-32 resize-y")}
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

        {/* Transmission console: status-bar-style submit + separate aria-live outcome. */}
        <div className="flex flex-col gap-3">
          <div className="relative overflow-hidden">
            <Rule />

            {/* On success one orange band sweeps top→bottom; on error the rule flashes once.
                Purely decorative — the TX OK / TX FAIL text carries the meaning for AT. */}
            {reduced ? null : (
              <AnimatePresence>
                {isSuccess ? (
                  <m.span
                    key="tx-sweep"
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-transparent via-signal/30 to-transparent"
                    initial={{ y: "-120%" }}
                    animate={{ y: "260%" }}
                    transition={{
                      duration: 0.6,
                      ease: [...EASE.gantry] as [number, number, number, number],
                    }}
                  />
                ) : isError ? (
                  <m.span
                    key="tx-flash"
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-signal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.45, ease: "linear" }}
                  />
                ) : null}
              </AnimatePresence>
            )}

            <div className="flex items-stretch font-mono tabular text-mono-status">
              <button
                type="submit"
                disabled={isPending}
                className="group flex flex-1 items-center gap-2 py-3 text-left text-foreground uppercase transition-colors hover:text-signal disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span aria-hidden="true" className="text-signal">
                  {">"}
                </span>
                {isPending ? (
                  <>
                    <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden="true" />
                    <span>SENDING…</span>
                  </>
                ) : (
                  <span>TRANSMIT</span>
                )}
              </button>

              <Rule orientation="vertical" className="h-auto self-stretch" />

              <span className="flex items-center gap-1.5 px-3 uppercase" aria-hidden="true">
                <span className="text-foreground-subtle">TX</span>
                <span className={cn("text-foreground", isSuccess && "text-signal")}>
                  {pad3(txCount)}
                </span>
              </span>
            </div>
          </div>

          {/* Persistent live region for the submission outcome. */}
          <div
            aria-live="polite"
            role="status"
            className="min-h-[1.5rem] font-mono text-mono-status uppercase"
          >
            <AnimatePresence initial={false} mode="wait">
              {isSuccess ? (
                <m.p
                  key="tx-ok"
                  className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
                  initial={outcomeMotion.initial}
                  animate={outcomeMotion.animate}
                  exit={outcomeMotion.exit}
                  transition={outcomeMotion.transition}
                >
                  <span className="text-signal">TX OK</span>
                  <span aria-hidden="true" className="text-foreground-subtle">
                    ·
                  </span>
                  <span className="font-sans text-sm tracking-normal text-foreground-muted normal-case">
                    {state.message}
                  </span>
                </m.p>
              ) : isError ? (
                <m.p
                  key="tx-fail"
                  className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
                  initial={outcomeMotion.initial}
                  animate={outcomeMotion.animate}
                  exit={outcomeMotion.exit}
                  transition={outcomeMotion.transition}
                >
                  <span className="text-destructive">TX FAIL</span>
                  <span aria-hidden="true" className="text-foreground-subtle">
                    ·
                  </span>
                  <span className="font-sans text-sm tracking-normal text-foreground-muted normal-case">
                    {state.message}
                  </span>
                </m.p>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <p className="font-mono text-mono-meta text-foreground-subtle">
          Your details are used only to reply to your message and are never shared.
        </p>
      </form>
    </FormProvider>
  );
}
