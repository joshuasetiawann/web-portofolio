import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Type-safe, validated environment variables.
 * Importing this module fails the build if required vars are missing/invalid.
 * Server vars are never exposed to the client; only `NEXT_PUBLIC_*` are.
 */
export const env = createEnv({
  server: {
    GITHUB_TOKEN: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    CONTACT_TO_EMAIL: z.email().optional(),
    CONTACT_FROM_EMAIL: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
    NEXT_PUBLIC_SITE_NAME: z.string().min(1).default("Joshua Setiawan"),
    NEXT_PUBLIC_GITHUB_USERNAME: z.string().min(1).default("joshuasetiawann"),
  },
  runtimeEnv: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_GITHUB_USERNAME: process.env.NEXT_PUBLIC_GITHUB_USERNAME,
  },
  emptyStringAsUndefined: true,
});
