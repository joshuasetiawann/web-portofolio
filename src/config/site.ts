// Central site configuration object. Composed from constants + validated env.

import { env } from "@/lib/env";
import { SITE_DESCRIPTION, SITE_LOCALE, SITE_NAME, SITE_SHORT_NAME } from "@/constants/site";

export const siteConfig = {
  name: SITE_NAME,
  shortName: SITE_SHORT_NAME,
  title: `${SITE_NAME} — AI Engineer & Software Developer`,
  description: SITE_DESCRIPTION,
  url: env.NEXT_PUBLIC_SITE_URL,
  locale: SITE_LOCALE,
  author: {
    name: SITE_NAME,
    jobTitle: "AI Engineer & Software Developer",
  },
  links: {
    github: "https://github.com/joshuasetiawann",
    email: "thunityai@gmail.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
