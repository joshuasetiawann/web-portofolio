// Zod v4 schema and inferred type for the contact form. Schema only — no UI, no server action.
import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters).")
    .max(80, "Name must be 80 characters or fewer."),
  email: z.email("Please enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message must be 2000 characters or fewer."),
  // Honeypot: hidden from real users and must remain empty. A non-empty value
  // signals an automated submission and fails validation.
  company: z.string().max(0, "Unexpected value.").optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
