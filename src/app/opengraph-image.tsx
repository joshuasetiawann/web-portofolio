// Default site OG image (inherited by every route without its own).
import { renderOgImage, ogSize, ogContentType } from "@/lib/og";
import { siteConfig } from "@/config/site";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = siteConfig.title;

export default function Image() {
  return renderOgImage({
    eyebrow: "Creative Developer · Software Engineer",
    title: siteConfig.name,
    subtitle: "Immersive, performant, accessible software — design and engineering in one.",
  });
}
