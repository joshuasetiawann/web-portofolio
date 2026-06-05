import type { Metadata } from "next";
import { Compass, Gauge, HeartHandshake, Layers, ShieldCheck, Sparkles } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { AvailabilityBadge } from "@/components/common/availability-badge";
import { SocialLinks } from "@/components/common/social-links";
import { StatCard } from "@/components/common/stat-card";
import { TechStackList } from "@/components/portfolio/tech-stack-list";
import { skills } from "@/data/skills";
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
    icon: Compass,
    title: "Clarity over cleverness",
    body: "The best code reads like an explanation. I optimise for the next person to open the file — often a future version of myself — and treat a confusing abstraction as a bug, not a flex.",
  },
  {
    icon: ShieldCheck,
    title: "Accessibility is non-negotiable",
    body: "Semantic HTML, keyboard paths, focus states, and reduced-motion support aren't a final pass. They're load-bearing decisions I make while the component is still a sketch.",
  },
  {
    icon: Gauge,
    title: "Performance is a feature",
    body: "A beautiful interface that stutters has already failed. I budget for the main thread, ship the smallest sensible bundle, and treat every animation as something the device has to afford.",
  },
  {
    icon: Layers,
    title: "Systems, not screens",
    body: "I'd rather build the tokens, primitives, and patterns once and compose them everywhere. Consistency falls out for free when the system is the source of truth.",
  },
  {
    icon: HeartHandshake,
    title: "Build with people in mind",
    body: "Software is a conversation with whoever uses it and whoever maintains it. I write for both audiences and assume good code is a courtesy, not a given.",
  },
  {
    icon: Sparkles,
    title: "Craft is in the details",
    body: "The 50ms of easing, the empty state nobody asked for, the focus ring that lands exactly right — the small, unglamorous details are usually what make a product feel considered.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="I build interfaces that feel as good as they look."
        description="I'm Joshua Setiawan — a creative developer and software engineer drawn to the space where rigorous engineering meets expressive design. I care about the pixels and the architecture in equal measure."
        actions={
          <>
            <AvailabilityBadge available label="Open to new work" />
            <SocialLinks />
          </>
        }
      />

      {/* Intro / personal story */}
      <Section>
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
        </Container>
      </Section>

      {/* Technical identity */}
      <Section className="bg-surface-1/40">
        <Container>
          <SectionHeader
            eyebrow="Technical identity"
            title="A front-end engineer who thinks in systems"
            description="I live closest to the interface, but I care about the whole path a request takes to get there — and the whole life a component lives after I ship it."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Core focus"
              value="Front-end"
              icon="Code2"
              description="React, Next.js, and the design systems that hold them together."
            />
            <StatCard
              label="Primary language"
              value="TypeScript"
              icon="FileText"
              description="Strict mode, expressive types, failures made explicit."
            />
            <StatCard
              label="Specialty"
              value="Motion & 3D"
              icon="Sparkles"
              description="Three.js and shaders, used with restraint and a performance budget."
            />
            <StatCard
              label="Bias"
              value="Accessible"
              icon="ShieldCheck"
              description="Inclusive, keyboard-first interfaces — by default, not by request."
            />
          </div>
          <div className="mt-8 max-w-3xl text-base leading-relaxed text-foreground-muted">
            <p>
              In practice that means I&apos;m the person who&apos;ll obsess over the shape of a prop
              API and the curve of an easing function in the same afternoon. I think of an interface
              as a system of states, not a static composition — empty, loading, error, and success
              all deserve to be designed, and the gaps between them are where the craft hides.
            </p>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow="What I value"
            title="The principles I don't compromise on"
            description="Tools and trends rotate. These are the things that stay constant in how I work."
          />
          <Reveal className="mt-10">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <li
                    key={value.title}
                    className="group rounded-2xl border border-border bg-surface-1 p-6 transition-colors hover:border-border-strong"
                  >
                    <span className="flex size-10 items-center justify-center rounded-xl bg-surface-2 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                      {value.body}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* Skills */}
      <Section className="bg-surface-1/40">
        <Container>
          <SectionHeader
            eyebrow="Toolbox"
            title="What I reach for"
            description="A working set, not a wishlist — these are the tools I use often enough to have strong opinions about."
          />
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {skills.map((group) => (
              <div
                key={group.category}
                className="rounded-2xl border border-border bg-surface-1 p-6"
              >
                <h3 className="font-mono text-xs tracking-[0.2em] text-foreground-subtle uppercase">
                  {group.category}
                </h3>
                <TechStackList stack={group.items} className="mt-4" />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Working style */}
      <Section>
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

      {/* Beyond code / personality */}
      <Section className="bg-surface-1/40">
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
            <p>
              Mostly, I like making things that feel good to use and being honest about the parts
              that don&apos;t yet. That&apos;s the whole job, really.
            </p>
          </div>
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
