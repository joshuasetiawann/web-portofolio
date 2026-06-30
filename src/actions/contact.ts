// Server Action for the contact form: validates input + honeypot, returns a typed result state.
"use server";

import { contactSchema } from "@/lib/validations/contact";

/** Result shape consumed by the client form via useActionState. */
export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

export const initialContactState: ContactFormState = { status: "idle" };

/**
 * Validate a contact submission and report the outcome.
 *
 * Phase 3: this does NOT send an email. It validates the payload, rejects bot
 * submissions (honeypot + minimum fill-time), and returns a friendly success
 * message. Wiring to Resend (or another transactional provider) happens later —
 * the validated values are already available here as `data`.
 */
export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot: a real, hidden-from-users field that must stay empty.
  const company = (formData.get("company") ?? "").toString();
  if (company.trim().length > 0) {
    // Pretend success so bots get no useful signal about the trap.
    return { status: "success", message: "Thanks! Your message has been received." };
  }

  // Optional anti-spam time check: forms completed implausibly fast are likely
  // automated. The hidden "startedAt" timestamp is set when the form mounts.
  const startedAtRaw = formData.get("startedAt");
  if (startedAtRaw) {
    const startedAt = Number(startedAtRaw);
    if (Number.isFinite(startedAt) && Date.now() - startedAt < 1200) {
      return { status: "success", message: "Thanks! Your message has been received." };
    }
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    company,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors,
    };
  }

  // TODO(phase-4): send `parsed.data` via Resend (or similar) before returning.
  // Intentionally left as validation-only for Phase 3.

  return {
    status: "success",
    message: "Thanks for reaching out — I'll get back to you shortly.",
  };
}
