// Blog detail — DATUM "CASE STUDY / paper": a DefinitionList spec header (DATE / UPDATED /
// READ / TAGS) above Archivo MDX prose on a 720 measure, a mono INDEX table of contents,
// the spec header as the one calibration moment, code blocks in Geist Mono, and related
// reading filed as a NOTE ledger.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { DefinitionList, type DefinitionItem } from "@/components/layout/definition-list";
import { GutterIndex } from "@/components/layout/gutter-index";
import { Rule } from "@/components/layout/rule";
import { LedgerList, LedgerRow } from "@/components/layout/ledger-row";
import { TagList } from "@/components/common/tag-list";
import { CTASection } from "@/components/sections/cta-section";
import { MDXContent } from "@/components/mdx/mdx-content";
import { JsonLd } from "@/components/shared/json-ld";
import { Calibration } from "@/components/motion/calibration";
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
            className="rounded-none text-foreground-muted transition-colors hover:text-signal focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
  const posts = getAllPosts();
  const filingOf = new Map(posts.map((entry, index) => [entry.slug, index + 1]));
  const filing = filingOf.get(post.slug) ?? 0;
  const related = getRelatedPosts(post.slug);

  const specItems: DefinitionItem[] = [
    {
      field: "Date",
      value: <time dateTime={String(post.date)}>{formatDate(post.date)}</time>,
      numeric: true,
    },
    ...(post.updated
      ? [
          {
            field: "Updated",
            value: <time dateTime={String(post.updated)}>{formatDate(post.updated)}</time>,
            numeric: true,
          },
        ]
      : []),
    { field: "Read", value: `${post.readingTime} min`, numeric: true },
    ...(post.tags.length > 0
      ? [{ field: "Tags", value: <TagList tags={post.tags} basePath={ROUTES.blog} /> }]
      : []),
  ];

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

      <Section index="01" label="Note" className="pt-24 sm:pt-28 lg:pt-32">
        <Container size="prose">
          <nav
            aria-label="Breadcrumb"
            className="font-mono text-mono-label tracking-wider text-foreground-subtle uppercase"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href={ROUTES.landing} className="transition-colors hover:text-signal">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={ROUTES.blog} className="transition-colors hover:text-signal">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">
                {post.slug}
              </li>
            </ol>
          </nav>

          <article className="mt-8">
            <header className="flex flex-col gap-6">
              <span className="inline-flex items-center gap-3 font-mono text-mono-eyebrow text-signal uppercase">
                <Rule signal />
                <GutterIndex prefix="NOTE" index={filing} />
                {post.tags[0] ? (
                  <span className="text-foreground-subtle">{post.tags[0]}</span>
                ) : null}
              </span>

              <h1 className="font-display text-display-xl text-balance text-foreground">
                {post.title}
              </h1>

              <p className="text-pretty text-foreground-muted sm:text-lg">{post.description}</p>

              <Calibration>
                <DefinitionList items={specItems} className="max-w-xl" />
              </Calibration>
            </header>

            {toc.length > 0 ? (
              <nav
                aria-label="Table of contents"
                className="mt-10 rounded-none border border-border bg-surface-1 p-5 text-sm"
              >
                <p className="inline-flex items-center gap-2 font-mono text-mono-label tracking-wider text-foreground-subtle uppercase">
                  <Rule signal />
                  Index
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
        <Section index="02" label="Related" rule>
          <Container>
            <SectionHeader
              eyebrow="Keep reading"
              title="Related posts"
              description="More writing on adjacent topics."
            />
            <div className="mt-10">
              <LedgerList label="Related posts">
                {related.map((item) => (
                  <LedgerRow
                    key={item.slug}
                    prefix="NOTE"
                    index={filingOf.get(item.slug) ?? 0}
                    title={item.title}
                    href={item.url}
                    coordinate={formatDate(item.date)}
                    specs={
                      [`${item.readingTime} min read`, item.tags.join(" / ")].filter(
                        Boolean,
                      ) as string[]
                    }
                  />
                ))}
              </LedgerList>
            </div>
          </Container>
        </Section>
      ) : null}

      <CTASection />
    </>
  );
}
