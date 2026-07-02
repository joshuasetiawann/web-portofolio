// Research — DATUM "THE LEDGER": two hairline bands (featured / archive) of write-ups,
// preprints, and notes filed under RES-###, each row carrying its status tags, spec strip
// (area · venue · authors), filing date, and mono PDF / SRC / DOI source links.
import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { LedgerList, LedgerRow } from "@/components/layout/ledger-row";
import { Calibration } from "@/components/motion/calibration";
import { ExternalLink } from "@/components/shared/external-link";
import { EmptyState } from "@/components/shared/empty-state";
import { getAllResearch, getFeaturedResearch, researchCategories } from "@/data/research";
import type { Research } from "@/types/research";
import { buildMetadata } from "@/lib/metadata";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/utils/format-date";

export const metadata: Metadata = buildMetadata({
  title: "Research",
  description:
    "Notes, preprints, and explorations across design engineering, graphics, and distributed systems — practical research that feeds back into the work.",
  path: ROUTES.research,
});

const STATUS_LABEL: Record<Research["status"], string> = {
  published: "Published",
  preprint: "Preprint",
  wip: "Work in progress",
};

const READING_LABEL: Record<NonNullable<Research["readingStatus"]>, string> = {
  reading: "Reading",
  implemented: "Implemented",
  exploring: "Exploring",
};

// Mono PDF / SRC / DOI source links, filed into the row's right-hand slot. The row itself
// is not a link (research has no detail page), so each artifact stays independently reachable.
function ResearchLinks({ item }: { item: Research }) {
  const { pdf, doi, code } = item.links;
  return (
    <span className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-mono-meta font-normal normal-case">
      {pdf ? (
        <ExternalLink
          href={pdf}
          className="text-foreground-muted uppercase"
          aria-label={`Read the PDF of ${item.title}`}
        >
          PDF
        </ExternalLink>
      ) : null}
      {code ? (
        <ExternalLink
          href={code}
          className="text-foreground-muted uppercase"
          aria-label={`Browse the source for ${item.title}`}
        >
          SRC
        </ExternalLink>
      ) : null}
      {doi ? (
        <ExternalLink
          href={doi}
          className="text-foreground-muted uppercase"
          aria-label={`View the DOI record for ${item.title}`}
        >
          DOI
        </ExternalLink>
      ) : null}
    </span>
  );
}

function ResearchRow({ item, filing }: { item: Research; filing: number }) {
  const statusTags = [
    STATUS_LABEL[item.status],
    item.readingStatus ? READING_LABEL[item.readingStatus] : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const specs = [statusTags, item.category, item.venue, item.authors.join(", ")].filter(
    Boolean,
  ) as string[];

  const { pdf, doi, code } = item.links;
  const hasLinks = Boolean(pdf || doi || code);

  return (
    <LedgerRow
      prefix="RES"
      index={filing}
      title={item.title}
      specs={specs}
      timestamp={formatDate(item.date)}
      metric={hasLinks ? { value: <ResearchLinks item={item} /> } : undefined}
    />
  );
}

export default function ResearchPage() {
  const all = getAllResearch();
  const featured = getFeaturedResearch();
  // Stable filing numbers shared across both bands (newest = RES-001).
  const filing = new Map(all.map((item, index) => [item.slug, index + 1]));

  const ledgerHeader = (
    <>
      <span className="w-16 shrink-0">Index</span>
      <span className="min-w-0 flex-1">Work · Status · Area · Venue · Authors</span>
      <span className="hidden md:block">Date</span>
      <span>Links</span>
    </>
  );

  return (
    <>
      <PageHero
        eyebrow="Index · RES"
        title="Research & Explorations"
        description="Write-ups, preprints, and working notes where I dig into the problems behind the products — color science, GPU performance, and the architecture of realtime systems."
      >
        {researchCategories.length > 0 ? (
          <ul
            className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-mono-label tracking-wider text-foreground-muted uppercase"
            aria-label="Research areas"
          >
            {researchCategories.map((category) => (
              <li key={category}>
                <span className="text-foreground-subtle">AREA:</span> {category}
              </li>
            ))}
          </ul>
        ) : null}
      </PageHero>

      {featured.length > 0 ? (
        <Section index="01" label="Featured">
          <Container>
            <SectionHeader
              eyebrow="Featured"
              title="Highlighted work"
              description="The threads I keep pulling on."
            />
            <Calibration className="mt-10">
              <LedgerList label="Featured research" header={ledgerHeader}>
                {featured.map((item) => (
                  <ResearchRow key={item.slug} item={item} filing={filing.get(item.slug) ?? 0} />
                ))}
              </LedgerList>
            </Calibration>
          </Container>
        </Section>
      ) : null}

      <Section index="02" label="Archive" rule>
        <Container>
          <SectionHeader
            eyebrow="Archive"
            title="All research"
            description="Every note and preprint, filed newest first."
          />
          <div className="mt-10">
            {all.length > 0 ? (
              <LedgerList label="All research" header={ledgerHeader}>
                {all.map((item) => (
                  <ResearchRow key={item.slug} item={item} filing={filing.get(item.slug) ?? 0} />
                ))}
              </LedgerList>
            ) : (
              <EmptyState
                icon={FlaskConical}
                title="No research published yet"
                description="Write-ups and preprints will appear here as they're released. Check back soon."
              />
            )}
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
