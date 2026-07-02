// Gallery: editorial masonry — featured 2×2 cell, one tall, two standard, one
// wide — with bottom scrims carrying category + title. Real screenshots from
// src/data/gallery.ts; missing sources fall back to the gradient panel.
import Image from "next/image";
import Link from "next/link";

import { LandingReveal as Reveal } from "./landing-reveal";
import { gallery, type GalleryItem } from "@/data/gallery";
import { ROUTES } from "@/constants/routes";
import { LandingSectionHeader } from "./landing-section-header";

// Span rhythm for the 5 cells, in order: featured, tall, standard ×2, wide.
const CELL_SPANS = [
  "sm:col-span-2 sm:row-span-2",
  "sm:row-span-2",
  "",
  "",
  "sm:col-span-2",
] as const;

function GalleryCell({ item, span, large }: { item: GalleryItem; span: string; large: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-[20px] border border-border ${span}`}>
      {item.src ? (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      ) : (
        <div className="l-cover-fallback" aria-hidden="true" />
      )}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-[18px]"
        style={{ background: "linear-gradient(0deg, rgba(var(--header-rgb), 0.85), transparent)" }}
      >
        <div
          className={`font-gm tracking-[0.1em] text-accent-2 uppercase ${large ? "text-[11px]" : "text-[10px]"}`}
        >
          {item.category}
        </div>
        <div
          className={`font-sg mt-1 font-semibold text-foreground ${large ? "text-lg" : "text-[15px]"}`}
        >
          {item.title}
        </div>
      </div>
    </div>
  );
}

export function GallerySection() {
  const items = gallery.slice(0, CELL_SPANS.length);

  return (
    <section id="gallery" className="l-section relative">
      <div className="l-container">
        <Reveal className="max-w-[600px]">
          <LandingSectionHeader eyebrow="Gallery" title="Selected visuals." />
        </Reveal>

        <Reveal amount={0.1}>
          <div className="mt-11 grid auto-rows-[210px] grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
            {items.map((item, i) => (
              <GalleryCell key={item.id} item={item} span={CELL_SPANS[i]} large={i === 0} />
            ))}
          </div>
        </Reveal>

        <div className="mt-8">
          <Link href={ROUTES.gallery} className="l-card-link l-card-link-primary">
            View the full gallery <span className="text-sm">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
