// Server Action for the contact form: validates input + honeypot, delivers via
// Resend when configured, and returns a typed result state.
"use server";

import { siteConfig } from "@/config/site";
import { env } from "@/lib/env";
import { contactSchema } from "@/lib/validations/contact";

/** Result shape consumed by the client form via useActionState. */
export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

export const initialContactState: ContactFormState = { status: "idle" };

/**
 * Deliver a validated submission through the Resend HTTP API (no SDK needed).
 * Returns true on success. Senders without a verified domain can use Resend's
 * onboarding address — override with CONTACT_FROM_EMAIL once a domain is set up.
 */
async function sendViaResend(data: { name: string; email: string; message: string }) {
  const to = env.CONTACT_TO_EMAIL ?? siteConfig.links.email;
  const from = env.CONTACT_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: data.email,
      subject: `Portfolio contact — ${data.name}`,
      text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
    }),
  });

  if (!res.ok) {
    console.error("contact: Resend delivery failed", res.status, await res.text());
    return false;
  }
  return true;
}

/**
 * Validate a contact submission, reject bot submissions (honeypot + minimum
 * fill-time), and deliver it via Resend when RESEND_API_KEY is configured.
 * Without a key the submission is logged server-side only.
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

  if (env.RESEND_API_KEY) {
    const delivered = await sendViaResend(parsed.data).catch((error: unknown) => {
      console.error("contact: Resend delivery threw", error);
      return false;
    });
    if (!delivered) {
      return {
        status: "error",
        message: `Something went wrong sending your message — please email me directly at ${siteConfig.links.email}.`,
      };
    }
  } else {
    // Delivery not configured yet: keep the submission visible in server logs
    // so nothing is silently lost.
    console.warn("contact: RESEND_API_KEY not set — submission logged only", {
      name: parsed.data.name,
      email: parsed.data.email,
    });
  }

  return {
    status: "success",
    message: "Thanks for reaching out — I'll get back to you shortly.",
  };
}
