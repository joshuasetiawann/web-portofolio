// About — DATUM "PAPER DATASHEET": long-form prose on a prose measure, oversized
// flush-left pull-quotes, gutter footnote indices. AvailabilityBadge+SocialLinks collapse
// into a mono status line; technical-identity StatCards → DefinitionList metric tiles;
// values → flush-left numbered entries (†0N). One calibration: a pull-quote scan.
import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { DefinitionList } from "@/components/layout/definition-list";
import { Rule } from "@/components/layout/rule";
import { Calibration } from "@/components/motion/calibration";
import { skills } from "@/data/skills";
import { socialLinks } from "@/data/social-links";
import { buildMetadata } from "@/lib/metadata";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "I'm Joshua Setiawan — a creative developer and software engineer who builds fast, accessible, and quietly ambitious interfaces. Here's how I think, what I value, and the tools I reach for.",
  path: ROUTES.about,
  type: "profile",
});

const values = [
  {
    title: "Clarity over cleverness",
    body: "The best code reads like an explanation. I optimise for the next person to open the file — often a future version of myself — and treat a confusing abstraction as a bug, not a flex.",
  },
  {
    title: "Accessibility is non-negotiable",
    body: "Semantic HTML, keyboard paths, focus states, and reduced-motion support aren't a final pass. They're load-bearing decisions I make while the component is still a sketch.",
  },
  {
    title: "Performance is a feature",
    body: "A beautiful interface that stutters has already failed. I budget for the main thread, ship the smallest sensible bundle, and treat every animation as something the device has to afford.",
  },
  {
    title: "Systems, not screens",
    body: "I'd rather build the tokens, primitives, and patterns once and compose them everywhere. Consistency falls out for free when the system is the source of truth.",
  },
  {
    title: "Build with people in mind",
    body: "Software is a conversation with whoever uses it and whoever maintains it. I write for both audiences and assume good code is a courtesy, not a given.",
  },
  {
    title: "Craft is in the details",
    body: "The 50ms of easing, the empty state nobody asked for, the focus ring that lands exactly right — the small, unglamorous details are usually what make a product feel considered.",
  },
];

// Technical-identity spec tiles (formerly StatCards) — data-as-decoration.
const identity = [
  { field: "Core focus", value: "Front-end" },
  { field: "Primary language", value: "TypeScript" },
  { field: "Specialty", value: "Motion & 3D" },
  { field: "Bias", value: "Accessible" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Index · About"
        title="I build interfaces that feel as good as they look."
        description="I'm Joshua Setiawan — a creative developer and software engineer drawn to the space where rigorous engineering meets expressive design. I care about the pixels and the architecture in equal measure."
        actions={
          <div className="flex flex-col gap-4 font-mono text-mono-status uppercase">
            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="text-foreground-subtle">Status</span>
              <span aria-hidden="true" className="text-foreground-subtle">
                /
              </span>
              <span className="text-signal">Open</span>
              <span aria-hidden="true" className="text-foreground-subtle">
                ·
              </span>
              <span className="text-foreground-muted normal-case">Open to new work</span>
            </p>
            <ul
              aria-label="Social links"
              className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-foreground-subtle"
            >
              {socialLinks.map((link) => {
                const external = /^https?:\/\//.test(link.href);
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="transition-colors hover:text-signal"
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        }
      />

      {/* 01 — Intro / personal story */}
      <Section index="01" label="Story" rule>
        <Container size="prose">
          <SectionHeader eyebrow="The story" title="How I got here" />
          <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground-muted sm:text-lg">
            <p>
              I started where a lot of developers do — view-source on a page that felt like magic,
              then an evening that turned into a decade of asking &ldquo;but how does <em>that</em>{" "}
              work?&rdquo; What hooked me wasn&apos;t any single language. It was the loop: imagine
              something, make it real on a screen, and watch a person reach through the glass and
              actually use it.
            </p>
            <p>
              Over time my taste sharpened in two directions at once. I fell for the expressive side
              of the web — motion, depth, the kind of detail that makes an interface feel alive —
              and equally for the unglamorous discipline underneath it: types that hold, boundaries
              that make sense, and code that still reads cleanly six months later. I&apos;ve never
              accepted that you have to choose between the two.
            </p>
            <p>
              Today I build production interfaces for the web, lean on TypeScript and React the way
              other people lean on muscle memory, and spend a suspicious amount of time getting a
              single transition to feel right. I&apos;m happiest on problems that are equal parts
              design and engineering — where the answer has to be correct <em>and</em> feel good.
            </p>
          </div>

          {/* The one calibration moment: an oversized pull-quote the scan sweeps once. */}
          <Calibration className="mt-14">
            <blockquote className="flex flex-col gap-6 py-2">
              <Rule signal />
              <p className="max-w-[20ch] font-display text-display-md text-balance text-foreground">
                Imagine something, make it real on a screen, and watch a person reach through the
                glass and actually use it.
              </p>
            </blockquote>
          </Calibration>
        </Container>
      </Section>

      {/* 02 — Technical identity */}
      <Section index="02" label="Identity" rule className="bg-surface-1/40">
        <Container>
          <SectionHeader
            eyebrow="Technical identity"
            title="A front-end engineer who thinks in systems"
            description="I live closest to the interface, but I care about the whole path a request takes to get there — and the whole life a component lives after I ship it."
          />
          <DefinitionList className="mt-10" layout="grid" items={identity} />
          <div className="mt-10 max-w-[720px] text-base leading-relaxed text-foreground-muted">
            <p>
              In practice that means I&apos;m the person who&apos;ll obsess over the shape of a prop
              API and the curve of an easing function in the same afternoon. I think of an interface
              as a system of states, not a static composition — empty, loading, error, and success
              all deserve to be designed, and the gaps between them are where the craft hides.
            </p>
          </div>
        </Container>
      </Section>

      {/* 03 — Values → flush-left numbered footnote entries */}
      <Section index="03" label="Values" rule>
        <Container>
          <SectionHeader
            eyebrow="What I value"
            title="The principles I don't compromise on"
            description="Tools and trends rotate. These are the things that stay constant in how I work."
          />
          <ol className="mt-12 space-y-10 sm:space-y-12">
            {values.map((value, index) => (
              <li key={value.title} className="grid gap-x-8 gap-y-3 sm:grid-cols-[auto_1fr]">
                <span className="font-mono tabular text-mono-label text-foreground-subtle">
                  &dagger;{String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-display-sm text-balance text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-3 max-w-[60ch] text-pretty text-foreground-muted">
                    {value.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 04 — Toolbox → datasheet definition rows */}
      <Section index="04" label="Toolbox" rule className="bg-surface-1/40">
        <Container>
          <SectionHeader
            eyebrow="Toolbox"
            title="What I reach for"
            description="A working set, not a wishlist — these are the tools I use often enough to have strong opinions about."
          />
          <DefinitionList
            className="mt-10"
            items={skills.map((group) => ({
              field: group.category,
              value: (
                <span className="font-mono text-mono-body text-foreground-muted">
                  {group.items.join("  /  ")}
                </span>
              ),
            }))}
          />
        </Container>
      </Section>

      {/* 05 — Working style (two-col, asymmetric) */}
      <Section index="05" label="Method" rule>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <SectionHeader
              eyebrow="How I work"
              title="Small steps, tight loops, real feedback"
              description="My process is less about ceremony and more about shortening the distance between an idea and seeing it run."
            />
            <div className="space-y-6 text-base leading-relaxed text-foreground-muted">
              <p>
                I start by getting something on the screen as fast as honestly possible — a rough
                but real slice I can click through — because nothing clarifies a problem like a
                working version of the wrong answer. From there I iterate in small, reviewable steps
                rather than disappearing for a week and surfacing with a monolith.
              </p>
              <p>
                I lean on types and tests as a conversation with my future self, write commit
                messages I&apos;d want to read, and treat code review as the main event, not a
                formality. I&apos;d rather over-communicate a tradeoff up front than defend a
                surprise later. And when something feels off — a slow transition, an awkward API, a
                state I can&apos;t name — I&apos;ve learned to trust that instinct and dig in rather
                than ship around it.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 06 — Beyond code / personality */}
      <Section index="06" label="Off-clock" rule className="bg-surface-1/40">
        <Container size="prose">
          <SectionHeader
            eyebrow="Off the clock"
            title="When I'm not shipping"
            description="The context that quietly shapes how I build."
          />
          <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground-muted sm:text-lg">
            <p>
              A lot of my taste comes from outside the editor. I&apos;m drawn to well-made things in
              general — typography, industrial design, films that respect their audience — and I
              notice the same instinct that makes a good interface in all of them: restraint,
              intention, and a point of view.
            </p>
            <p>
              I read widely about how teams build software, tinker with side projects that exist
              purely to learn something new, and genuinely enjoy explaining hard ideas in plain
              language. If you catch me deep in a shader playground or rewriting a perfectly fine
              function for the third time, it&apos;s probably not because it&apos;s broken —
              it&apos;s because it could be clearer.
            </p>
          </div>

          <blockquote className="mt-14 flex flex-col gap-6">
            <Rule signal />
            <p className="max-w-[22ch] font-display text-display-md text-balance text-foreground">
              Mostly, I like making things that{" "}
              <span className="text-signal">feel good to use</span> — and being honest about the
              parts that don&apos;t yet.
            </p>
            <footer className="font-mono text-mono-label text-foreground-subtle uppercase">
              — that&apos;s the whole job, really
            </footer>
          </blockquote>
        </Container>
      </Section>

      <CTASection
        title="Let's build something worth caring about."
        description="I'm currently open to new work and collaborations. If you have a problem that lives between design and engineering, I'd love to hear it."
        secondaryLabel="See my work"
        secondaryHref={ROUTES.projects}
      />
    </>
  );
}
