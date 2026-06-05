import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { GalleryItem } from "@/components/portfolio/gallery-item";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
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
        eyebrow="Gallery"
        title="A visual archive"
        description="Experiments, interfaces, and behind-the-scenes moments — from GPU particle fields to design-token boards."
      >
        {galleryCategories.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {galleryCategories.map((category) => (
              <li key={category}>
                <Badge variant="secondary">{category}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </PageHero>

      <Section>
        <Container>
          {gallery.length > 0 ? (
            <Reveal>
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((item) => (
                  <li key={item.id} className="flex">
                    <GalleryItem item={item} />
                  </li>
                ))}
              </ul>
            </Reveal>
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
