// Writing & research band: hover-indent rows merging real blog posts (Essay)
// and research entries (Research), newest first.
import { LandingReveal as Reveal } from "./landing-reveal";
import { getAllResearch } from "@/data/research";
import { getAllPosts } from "@/lib/content";
import { formatDate } from "@/utils/format-date";
import { LandingSectionHeader } from "./landing-section-header";

interface WritingRow {
  date: string;
  kind: "Essay" | "Research";
  title: string;
  blurb: string;
  href: string;
}

function collectRows(limit = 5): WritingRow[] {
  const posts: WritingRow[] = getAllPosts().map((post) => ({
    date: post.date,
    kind: "Essay",
    title: post.title,
    blurb: post.description,
    href: post.url,
  }));
  const research: WritingRow[] = getAllResearch().map((item) => ({
    date: item.date,
    kind: "Research",
    title: item.title,
    blurb: item.abstract,
    href: `/research/${item.slug}`,
  }));
  return [...posts, ...research]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export function WritingSection() {
  const rows = collectRows();

  return (
    <section id="writing" className="l-band relative">
      <div className="l-container">
        <Reveal>
          <LandingSectionHeader eyebrow="Writing & research — 04" title="Notes on the craft." />
        </Reveal>

        <div className="mt-10">
          {rows.map((row, i) => (
            <Reveal key={row.href} delay={i * 0.04}>
              <a href={row.href} className="l-writing-row">
                <span className="font-gm flex-[0_0_92px] text-[13px] text-foreground-subtle tabular-nums">
                  {formatDate(row.date, { year: "numeric", month: "short" })}
                </span>
                <span className="l-kind-pill">{row.kind}</span>
                <span className="min-w-[220px] flex-[1_1_320px]">
                  <span className="font-sg block text-[19px] font-semibold tracking-[-0.01em] text-foreground">
                    {row.title}
                  </span>
                  <span className="mt-[5px] block text-sm leading-normal text-foreground-muted">
                    {row.blurb}
                  </span>
                </span>
                <span className="flex-none text-lg text-foreground-subtle" aria-hidden="true">
                  →
                </span>
              </a>
            </Reveal>
          ))}
          <div className="border-t border-border" />
        </div>
      </div>
    </section>
  );
}
