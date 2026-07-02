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
    "I'm Joshua Setiawan — an AI engineer and software developer who builds intelligent systems, from a from-scratch x86 kernel to local-first AI platforms. Here's how I think, what I value, and the tools I reach for.",
  path: ROUTES.about,
  type: "profile",
});

const values = [
  {
    title: "Understand it, then build it",
    body: "I don't ship what I can't explain. Before a line of code, I want the why — the datasheet, the protocol, the algorithm underneath. Writing a kernel from scratch is the extreme version of a habit I apply everywhere.",
  },
  {
    title: "Verify, don't assume",
    body: '"It should work" isn\'t a status. THUOS boots in CI on every push, money math in my sales app is unit-tested to the decimal, and a screenshot of the real running thing beats a promise every time.',
  },
  {
    title: "Local-first, user-owned",
    body: "Your data shouldn't have to leave your machine to be useful. AllHaven and ThuAI both run their AI against a database the user owns — and any cloud call is explicit, labelled, and approved by a human.",
  },
  {
    title: "Performance is a feature",
    body: "From a cooperative scheduler in kernel space to a frame budget in the browser, the discipline is the same: measure, budget, and treat every cycle as something the machine has to afford.",
  },
  {
    title: "Ship real things",
    body: "A repo with a README, screenshots of the actual app, a live URL where it makes sense — projects are done when someone else can run them, not when the idea is interesting.",
  },
  {
    title: "Function deserves good form",
    body: "I'm a systems person who cares how things look. A warehouse tracker gets a proper design system; an OS gets a themed desktop. If people have to use it, it should feel considered.",
  },
];

// Technical-identity spec tiles (formerly StatCards) — data-as-decoration.
const identity = [
  { field: "Core focus", value: "AI & systems" },
  { field: "Languages", value: "Python · TS · C" },
  { field: "Specialty", value: "Agents & CV" },
  { field: "Daily driver", value: "Arch Linux" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Index · About"
        title="I build intelligent systems, from bare metal to the browser."
        description="I'm Joshua Setiawan — an AI engineer and software developer from Indonesia. I've written an x86 kernel from scratch, built local-first AI platforms, trained vision models, and shipped production web apps. What connects them: I like knowing exactly how things work."
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
              I started with the web — company profiles, an e-commerce build in plain PHP — and kept
              pulling on the thread of &ldquo;but how does <em>that</em> work?&rdquo; That question
              took me from websites down to IoT boards, into computer vision with YOLOv8, and
              eventually all the way to the bottom of the stack: an operating system written from
              scratch in C and assembly, because the only way to really understand a machine is to
              boot your own code on it.
            </p>
            <p>
              Along the way I went deep on Linux — Arch with a tiled Hyprland setup is home — and
              the terminal became my primary interface. That comfort with the low level is exactly
              what makes the high level click: when you&apos;ve scheduled tasks in kernel space, an
              async runtime stops being magic; when you&apos;ve parsed a USB descriptor, an API
              contract is just another datasheet.
            </p>
            <p>
              Today my center of gravity is AI engineering: local-first AI platforms with
              multi-agent workflows, a provider-agnostic terminal coding agent, and vision models
              that actually run. I&apos;m happiest on problems where intelligence meets systems —
              where the answer has to be correct, fast, <em>and</em> private.
            </p>
          </div>

          {/* The one calibration moment: an oversized pull-quote the scan sweeps once. */}
          <Calibration className="mt-14">
            <blockquote className="flex flex-col gap-6 py-2">
              <Rule signal />
              <p className="max-w-[20ch] font-display text-display-md text-balance text-foreground">
                Build fast. Ship faster. Stay curious.
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
            title="A builder who works the whole stack"
            description="Kernel space to user space, model weights to UI states — I care about the entire path a request takes, because I've built most of the layers it crosses at least once."
          />
          <DefinitionList className="mt-10" layout="grid" items={identity} />
          <div className="mt-10 max-w-[720px] text-base leading-relaxed text-foreground-muted">
            <p>
              In practice that means I&apos;m the person who&apos;ll debug an xHCI interrupt in the
              morning and tune a design token in the afternoon. I think in systems: an app is states
              and boundaries, an AI agent is a loop with permissions, an OS is the same idea with
              fewer safety nets. The layers differ; the discipline doesn&apos;t.
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
                I build in staged, versioned increments — THUOS grew through twenty releases from
                VGA text to a USB-driven desktop, and my agent CLI ships stage by stage the same
                way. Each slice is small enough to verify honestly: boot it, click it, measure it.
                Nothing clarifies a problem like a working version of the wrong answer.
              </p>
              <p>
                I automate the checking — CI that actually boots the kernel, unit tests on the money
                math, screenshots of the real running app in every README — because &ldquo;works on
                my machine&rdquo; isn&apos;t evidence. And when something feels off, I&apos;ve
                learned to dig for the root cause instead of shipping around it; the bug you
                understand once is the class of bug you never ship again.
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
              Off the clock usually still means a terminal. I rice my Linux setup more than I&apos;d
              like to admit, wire up IoT experiments, and keep a side project running purely to
              learn something new — the OS started exactly that way. The line between
              &ldquo;hobby&rdquo; and &ldquo;work&rdquo; is mostly which repo I have open.
            </p>
            <p>
              I&apos;m also building real tools for real people close to me — warehouse tracking and
              sales apps that a family business actually runs on. Shipping for users who sit across
              the dinner table is its own kind of code review: honest, immediate, and impossible to
              ignore.
            </p>
          </div>

          <blockquote className="mt-14 flex flex-col gap-6">
            <Rule signal />
            <p className="max-w-[22ch] font-display text-display-md text-balance text-foreground">
              Mostly, I like building things{" "}
              <span className="text-signal">from first principles</span> — and being honest about
              the parts I don&apos;t understand yet.
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
