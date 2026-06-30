// Blog index — featured writing, tag index, and the full post grid.
import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { BlogCard } from "@/components/portfolio/blog-card";
import { BlogGrid } from "@/components/portfolio/blog-grid";
import { TagList } from "@/components/common/tag-list";
import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/motion/reveal";
import { getAllPosts, getFeaturedPosts, getAllPostTags } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Notes and essays on creative development, software engineering, design systems, and the craft of building for the web.",
  path: ROUTES.blog,
});

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = getFeaturedPosts();
  const tags = getAllPostTags();

  return (
    <>
      <PageHero
        eyebrow="Writing"
        title="Blog"
        description="Notes and essays on creative development, software engineering, design systems, and the craft of building for the web."
      />

      {posts.length === 0 ? (
        <Section>
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
            <Section>
              <Container>
                <SectionHeader
                  eyebrow="Featured"
                  title="Selected reading"
                  description="A few pieces worth starting with."
                />
                <Reveal className="mt-10">
                  <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {featured.map((post) => (
                      <li key={post.slug}>
                        <BlogCard post={post} />
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </Container>
            </Section>
          ) : null}

          {tags.length > 0 ? (
            <Section>
              <Container>
                <SectionHeader
                  eyebrow="Topics"
                  title="Browse by tag"
                  description="Filter the archive by the topics I write about most."
                />
                <div className="mt-8">
                  <TagList tags={tags} basePath={ROUTES.blog} />
                </div>
              </Container>
            </Section>
          ) : null}

          <Section>
            <Container>
              <SectionHeader
                eyebrow="Archive"
                title="All posts"
                description="Everything I've published, newest first."
              />
              <Reveal className="mt-10">
                <BlogGrid posts={posts} />
              </Reveal>
            </Container>
          </Section>
        </>
      )}
    </>
  );
}
