// Gallery — DATUM contact sheet: a rigid grid of hairline frames, each stamped with a
// mono FIG-### index + timestamp caption. Categories render as a mono filter index; the
// whole sheet powers on with a single calibration sweep.
import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { GutterIndex } from "@/components/layout/gutter-index";
import { Calibration } from "@/components/motion/calibration";
import { GalleryItem } from "@/components/portfolio/gallery-item";
import { EmptyState } from "@/components/shared/empty-state";
import { gallery, galleryCategories } from "@/data/gallery";
import { buildMetadata } from "@/lib/metadata";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = buildMetadata({
  title: "Gallery",
  description:
    "A visual archive of experiments, interfaces, and behind-the-scenes moments — WebGL studies, design systems, and product work.",
  path: ROUTES.gallery,
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Index · FIG"
        title="A visual archive"
        description="Experiments, interfaces, and behind-the-scenes moments — from GPU particle fields to design-token boards."
      >
        {galleryCategories.length > 0 ? (
          <ul
            className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-mono-label tracking-wider text-foreground-muted uppercase"
            aria-label="Gallery categories"
          >
            {galleryCategories.map((category) => (
              <li key={category}>
                <span className="text-foreground-subtle">CAT:</span> {category}
              </li>
            ))}
          </ul>
        ) : null}
      </PageHero>

      <Section index="01" label="Contact sheet" rule>
        <Container>
          {gallery.length > 0 ? (
            <Calibration>
              <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((item, i) => (
                  <li key={item.id} className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <GutterIndex prefix="FIG" index={i + 1} />
                      <time
                        dateTime={item.date}
                        className="font-mono tabular text-mono-meta text-foreground-subtle"
                      >
                        {item.date}
                      </time>
                    </div>
                    <GalleryItem item={item} />
                  </li>
                ))}
              </ul>
            </Calibration>
          ) : (
            <EmptyState
              title="Nothing here yet"
              description="The gallery is being curated. Check back soon for new visual work."
            />
          )}
        </Container>
      </Section>
    </>
  );
}
