// Default SEO/metadata configuration consumed by lib/metadata.

import { SITE_DESCRIPTION, SITE_NAME } from "@/constants/site";

export const defaultMetadataConfig = {
  titleTemplate: "%s — Joshua Setiawan",
  defaultTitle: `${SITE_NAME} — Creative Developer & Software Engineer`,
  description: SITE_DESCRIPTION,
  keywords: [
    "Joshua Setiawan",
    "Creative Developer",
    "Software Engineer",
    "Frontend Engineer",
    "Portfolio",
    "Next.js",
    "React",
    "TypeScript",
    "WebGL",
    "Three.js",
    "Interactive Design",
  ],
} as const;

export type DefaultMetadataConfig = typeof defaultMetadataConfig;
