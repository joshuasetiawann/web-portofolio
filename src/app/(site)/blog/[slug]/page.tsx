// Blog detail — full article with table of contents, MDX body, and related reading.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Clock } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { TagList } from "@/components/common/tag-list";
import { BlogCard } from "@/components/portfolio/blog-card";
import { CTASection } from "@/components/sections/cta-section";
import { MDXContent } from "@/components/mdx/mdx-content";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/motion/reveal";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/utils/format-date";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

interface TocEntry {
  title: string;
  url: string;
  items: TocEntry[];
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return buildMetadata({ title: "Post not found", path: `${ROUTES.blog}/${slug}` });
  }

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: post.url,
    type: "article",
  });
}

function TocList({ items }: { items: TocEntry[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.url}>
          <a
            href={item.url}
            className="rounded-sm text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {item.title}
          </a>
          {item.items.length > 0 ? (
            <div className="mt-2 border-l border-border pl-4">
              <TocList items={item.items} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const toc = post.toc as TocEntry[];
  const related = getRelatedPosts(post.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    url: absoluteUrl(post.url),
    mainEntityOfPage: absoluteUrl(post.url),
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <Section>
        <Container size="prose">
          <Breadcrumbs
            items={[
              { label: "Home", href: ROUTES.landing },
              { label: "Blog", href: ROUTES.blog },
              { label: post.title },
            ]}
          />

          <article className="mt-8">
            <header className="flex flex-col gap-4">
              <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
                {post.title}
              </h1>

              <p className="text-base leading-relaxed text-pretty text-foreground-muted sm:text-lg">
                {post.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground-subtle">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  <time dateTime={String(post.date)}>{formatDate(post.date)}</time>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" aria-hidden="true" />
                  {post.readingTime} min read
                </span>
              </div>

              {post.tags.length > 0 ? <TagList tags={post.tags} basePath={ROUTES.blog} /> : null}
            </header>

            {toc.length > 0 ? (
              <nav
                aria-label="Table of contents"
                className="mt-10 rounded-2xl border border-border bg-surface-1 p-5 text-sm"
              >
                <p className="font-mono text-xs tracking-[0.2em] text-foreground-muted uppercase">
                  On this page
                </p>
                <div className="mt-4">
                  <TocList items={toc} />
                </div>
              </nav>
            ) : null}

            <div className="prose mt-10 max-w-none prose-invert">
              <MDXContent code={post.body} />
            </div>
          </article>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section>
          <Container>
            <SectionHeader
              eyebrow="Keep reading"
              title="Related posts"
              description="More writing on adjacent topics."
            />
            <Reveal className="mt-10">
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <BlogCard post={item} />
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      <CTASection />
    </>
  );
}
