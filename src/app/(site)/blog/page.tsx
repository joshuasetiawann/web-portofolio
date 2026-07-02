// Blog index — DATUM dated ledger: a highlighted band, a mono TOPIC strip, and the full
// hairline archive filed under NOTE-###, newest first (date = mono coordinate,
// spec strip = reading time · topics).
import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { LedgerList, LedgerRow } from "@/components/layout/ledger-row";
import { Calibration } from "@/components/motion/calibration";
import { TagList } from "@/components/common/tag-list";
import { EmptyState } from "@/components/shared/empty-state";
import { getAllPosts, getFeaturedPosts, getAllPostTags, type Post } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/utils/format-date";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Notes and essays on creative development, software engineering, design systems, and the craft of building for the web.",
  path: ROUTES.blog,
});

function NoteRow({ post, filing }: { post: Post; filing: number }) {
  const specs = [`${post.readingTime} min read`, post.tags.join(" / ")].filter(Boolean) as string[];
  return (
    <LedgerRow
      prefix="NOTE"
      index={filing}
      title={post.title}
      href={post.url}
      coordinate={formatDate(post.date)}
      specs={specs}
    />
  );
}

const ledgerHeader = (
  <>
    <span className="w-16 shrink-0">Index</span>
    <span className="min-w-0 flex-1">Note · Read · Topics</span>
    <span className="hidden md:block">Date</span>
  </>
);

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = getFeaturedPosts();
  const tags = getAllPostTags();
  // Stable filing numbers across bands (newest = NOTE-001).
  const filing = new Map(posts.map((post, index) => [post.slug, index + 1]));

  // Sequential section indices for whichever bands actually render.
  let sectionCount = 0;
  const nextIndex = () => String(++sectionCount).padStart(2, "0");

  return (
    <>
      <PageHero
        eyebrow="Index · NOTE"
        title="Blog"
        description="Notes and essays on creative development, software engineering, design systems, and the craft of building for the web."
      />

      {posts.length === 0 ? (
        <Section index={nextIndex()} label="Archive">
          <Container>
            <EmptyState
              title="No posts yet"
              description="New writing is on the way — check back soon."
            />
          </Container>
        </Section>
      ) : (
        <>
          {featured.length > 0 ? (
            <Section index={nextIndex()} label="Featured">
              <Container>
                <SectionHeader
                  eyebrow="Featured"
                  title="Selected reading"
                  description="A few pieces worth starting with."
                />
                <Calibration className="mt-10">
                  <LedgerList label="Featured posts" header={ledgerHeader}>
                    {featured.map((post) => (
                      <NoteRow key={post.slug} post={post} filing={filing.get(post.slug) ?? 0} />
                    ))}
                  </LedgerList>
                </Calibration>
              </Container>
            </Section>
          ) : null}

          {tags.length > 0 ? (
            <Section index={nextIndex()} label="Topics" rule>
              <Container>
                <SectionHeader
                  eyebrow="Topics"
                  title="Browse by tag"
                  description="Filter the archive by the topics I write about most."
                />
                <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-3">
                  <span className="font-mono text-mono-label tracking-wider text-foreground-subtle uppercase">
                    Topic /
                  </span>
                  <TagList tags={tags} basePath={ROUTES.blog} />
                </div>
              </Container>
            </Section>
          ) : null}

          <Section index={nextIndex()} label="Archive" rule>
            <Container>
              <SectionHeader
                eyebrow="Archive"
                title="All posts"
                description="Everything I've published, filed newest first."
              />
              <div className="mt-10">
                <LedgerList label="All posts" header={ledgerHeader}>
                  {posts.map((post) => (
                    <NoteRow key={post.slug} post={post} filing={filing.get(post.slug) ?? 0} />
                  ))}
                </LedgerList>
              </div>
            </Container>
          </Section>
        </>
      )}
    </>
  );
}
