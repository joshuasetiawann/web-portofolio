// metadata.ts — root Metadata + buildMetadata() helper for per-page SEO.
// Centralizes title templates, OpenGraph, Twitter, and robots.
// OG/Twitter images are provided by the `opengraph-image` file convention
// (app/opengraph-image.tsx + per-[slug] routes), so they are NOT set here.
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { defaultMetadataConfig } from "@/config/seo";
import { absoluteUrl } from "@/lib/seo";
import { env } from "@/lib/env";

export const rootMetadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: defaultMetadataConfig.defaultTitle,
    template: defaultMetadataConfig.titleTemplate,
  },
  description: defaultMetadataConfig.description,
  keywords: [...defaultMetadataConfig.keywords],
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: defaultMetadataConfig.defaultTitle,
    description: defaultMetadataConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultMetadataConfig.defaultTitle,
    description: defaultMetadataConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export interface BuildMetadataInput {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article" | "profile";
}

/**
 * Compose page-level Metadata, inheriting sensible defaults from rootMetadata.
 * OG/Twitter images come from the nearest `opengraph-image` route.
 */
export function buildMetadata(input: BuildMetadataInput = {}): Metadata {
  const {
    title,
    description = defaultMetadataConfig.description,
    path = "/",
    type = "website",
  } = input;
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: title ?? defaultMetadataConfig.defaultTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? defaultMetadataConfig.defaultTitle,
      description,
    },
  };
}
