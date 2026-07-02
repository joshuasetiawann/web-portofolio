// Default SEO/metadata configuration consumed by lib/metadata.

import { SITE_DESCRIPTION, SITE_NAME } from "@/constants/site";

export const defaultMetadataConfig = {
  titleTemplate: "%s — Joshua Setiawan",
  defaultTitle: `${SITE_NAME} — AI Engineer & Software Developer`,
  description: SITE_DESCRIPTION,
  keywords: [
    "Joshua Setiawan",
    "AI Engineer",
    "Software Developer",
    "Machine Learning",
    "Computer Vision",
    "YOLOv8",
    "OS Development",
    "Linux",
    "Portfolio",
    "Python",
    "Next.js",
    "TypeScript",
    "IoT",
  ],
} as const;

export type DefaultMetadataConfig = typeof defaultMetadataConfig;
