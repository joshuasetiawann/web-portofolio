import type { Metadata } from "next";
import {
  Accessibility,
  Boxes,
  GitBranch,
  Gauge,
  Lightbulb,
  Network,
  Sparkles,
  Target,
} from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { CodeSnippet } from "@/components/common/code-snippet";
import { buildMetadata } from "@/lib/metadata";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = buildMetadata({
  title: "Engineering Philosophy",
  description:
    "How I think about building software — the principles, architecture values, and quality beliefs that guide the interfaces and systems I ship.",
  path: ROUTES.philosophy,
});

const principles = [
  {
    icon: Lightbulb,
    title: "Make the simple thing first",
    body: "Most problems don't need the clever solution yet. I build the obvious version, let it teach me where the real complexity lives, and only then reach for abstraction — earned, not anticipated.",
  },
  {
    icon: Target,
    title: "Optimise for the reader",
    body: "Code is written once and read constantly. I'd trade a few keystrokes for a name that explains itself every single time. The audience is the next maintainer, and they're usually tired.",
  },
  {
    icon: GitBranch,
    title: "Make failure states explicit",
    body: "The interesting part of any feature is what happens when things go wrong. I'd rather model errors in the type system than discover them in production logs.",
  },
  {
    icon: Sparkles,
    title: "Delete more than you add",
    body: "The best pull requests often remove code. Less surface area means fewer bugs, faster builds, and a system small enough to actually hold in your head.",
  },
];

export default function PhilosophyPage() {
  return (
    <>
      <PageHero
        eyebrow="Engineering Philosophy"
        title="Good software is honest, legible, and kind to the next person."
        description="I've spent enough time in other people's codebases to know what I want mine to feel like. These are the beliefs that survive contact with real deadlines — the principles I actually code by, not just the ones that sound good on a slide."
      />

      {/* Engineering principles */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow="Principles"
            title="The rules I keep coming back to"
            description="Not laws — defaults. They're the position I start from before a problem gives me a reason to move."
          />
          <Reveal className="mt-10">
            <ol className="grid gap-4 sm:grid-cols-2">
              {principles.map((principle, index) => {
                const Icon = principle.icon;
                return (
                  <li
                    key={principle.title}
                    className="group relative rounded-2xl border border-border bg-surface-1 p-6 transition-colors hover:border-border-strong"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-surface-2 text-primary">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-xs text-foreground-subtle">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-foreground">
                      {principle.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                      {principle.body}
                    </p>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </Container>
      </Section>

      {/* Architecture values */}
      <Section className="bg-surface-1/40">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <SectionHeader
              eyebrow="Architecture"
              title="Boundaries are a feature"
              description="The shape of a codebase is a design decision, and it ages faster than any single line inside it."
            />
            <div className="space-y-6 text-base leading-relaxed text-foreground-muted">
              <p>
                I think about software in layers with clear seams: data that doesn&apos;t know about
                the UI, components that don&apos;t know where their data came from, and a thin,
                boring glue layer between them. When the boundaries are honest, you can replace one
                side without holding your breath about the other.
              </p>
              <p>
                I&apos;m wary of premature structure — a folder hierarchy invented before the
                problem is understood is just a guess with extra steps. So I let architecture{" "}
                <em>emerge</em>: start flat, watch where the friction collects, and refactor toward
                the boundary the code is asking for. The goal isn&apos;t a clever diagram. It&apos;s
                a system where the right change is also the easy change.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Product thinking */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <SectionHeader
              eyebrow="Product thinking"
              title="Ship the outcome, not the feature"
              description="Engineering exists to serve a person on the other side of the screen. I try not to forget who they are."
            />
            <div className="space-y-6 text-base leading-relaxed text-foreground-muted">
              <p>
                A ticket describes a solution; my job is to understand the problem underneath it.
                Before I write much code I want to know what the user is actually trying to
                accomplish and what &ldquo;done&rdquo; feels like from their side. Often the most
                valuable thing I can do is push back on a requirement that&apos;s solving the wrong
                thing well.
              </p>
              <p>
                I treat scope as a tool, not a constraint to resent. Cutting the right corner — a
                manual step now instead of an automated one later, a sensible default instead of a
                settings panel — is how good products ship. The discipline is being honest about
                which corners those are, and leaving a note for the version of us that comes back to
                them.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Performance mindset */}
      <Section className="bg-surface-1/40">
        <Container>
          <SectionHeader
            eyebrow="Performance"
            title="Speed is part of the design"
            description="A slow interface isn't a polished one with a flaw — it's a different, worse product."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface-1 p-6">
              <Gauge className="size-5 text-primary" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-foreground">
                Budget, then build
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                I set a rough cost ceiling for a screen — bundle weight, main-thread work, network
                round-trips — before I add to it. A budget turns &ldquo;is this fast?&rdquo; into a
                question with an answer.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-1 p-6">
              <Sparkles className="size-5 text-primary" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-foreground">
                Animation has a price
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                Motion is something the device has to afford. I stay on the compositor, avoid
                animating layout, and let go of an effect the moment it costs more than it gives.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-1 p-6">
              <Target className="size-5 text-primary" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-foreground">
                Measure on the slow device
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                The site is fast on my laptop by accident. What matters is the mid-range phone on a
                flaky network — that&apos;s the user I tune for, because that&apos;s the user most
                likely to be there.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Accessibility mindset */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <SectionHeader
              eyebrow="Accessibility"
              title="An interface only some people can use is unfinished"
              description="Accessibility isn't a checklist I run at the end. It's a set of decisions I make while the thing is still being built."
            />
            <div className="space-y-6 text-base leading-relaxed text-foreground-muted">
              <p>
                I start from semantic HTML and let the platform do its job — a real button, a real
                heading order, a real label — before I reach for ARIA to patch the gaps I created.
                The keyboard is the first input device I test, not the last, because if it works
                without a mouse it usually works for everyone.
              </p>
              <p>
                I respect the signals people give their devices:
                <code className="mx-1 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm">
                  prefers-reduced-motion
                </code>
                turns my animations off, contrast holds up in both themes, and focus is always
                visible and never trapped. None of this is charity — it&apos;s just what
                &ldquo;done&rdquo; means.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Code quality beliefs */}
      <Section className="bg-surface-1/40">
        <Container>
          <SectionHeader
            eyebrow="Code quality"
            title="What I believe about good code"
            description="Quality isn't a coat of paint at the end. It's a hundred small choices made while no one's watching."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Boxes,
                title: "Names carry the design",
                body: "If I can't name something cleanly, I usually don't understand it yet. A good name is a finished thought; a vague one is a deferred bug.",
              },
              {
                icon: GitBranch,
                title: "Types are documentation that can't lie",
                body: "I lean on strict TypeScript to encode the rules of a system so the compiler enforces what a comment could only suggest.",
              },
              {
                icon: Accessibility,
                title: "Tests describe intent",
                body: "I test behaviour, not implementation. A good test reads like a promise about what the code does — and stays true when the internals change.",
              },
              {
                icon: Lightbulb,
                title: "Consistency beats brilliance",
                body: "A predictable codebase is a fast one to work in. I'll take the boring pattern used everywhere over the elegant one used once.",
              },
            ].map((belief) => {
              const Icon = belief.icon;
              return (
                <div
                  key={belief.title}
                  className="flex gap-4 rounded-2xl border border-border bg-surface-1 p-6"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
                      {belief.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">
                      {belief.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Systems thinking */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <SectionHeader
              eyebrow="Systems thinking"
              title="Build the system once, compose it everywhere"
              description="The most leverage I've ever had came from solving a problem in a place where it stays solved."
            />
            <div className="space-y-6 text-base leading-relaxed text-foreground-muted">
              <p>
                <Network
                  className="mr-2 inline size-5 align-text-bottom text-primary"
                  aria-hidden="true"
                />
                I look for the layer where a decision can be made once — a design token, a shared
                primitive, a single source of truth for routes — instead of re-deciding it in fifty
                components that will inevitably drift apart. Consistency stops being a thing you
                police and starts being a thing the system gives you for free.
              </p>
              <p>
                That same lens applies past the code. I think about the whole life of a feature: how
                it&apos;s discovered, how it fails, how it&apos;s observed in production, and how
                the next person extends it. A change is rarely local — and designing as if it is, is
                how systems quietly rot.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Practical examples */}
      <Section className="bg-surface-1/40">
        <Container>
          <SectionHeader
            eyebrow="In practice"
            title="What this looks like in code"
            description="Principles are cheap. Here are two small patterns where the beliefs above turn into real lines I write."
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                Make failure explicit
              </h3>
              <p className="mt-2 mb-4 text-sm leading-relaxed text-foreground-muted">
                A typed <code className="font-mono">Result</code> forces every caller to acknowledge
                the unhappy path — no silent throws, no forgotten branch.
              </p>
              <CodeSnippet
                filename="lib/result.ts"
                language="ts"
                code={`type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function loadProject(slug: string): Promise<Result<Project>> {
  const project = await db.projects.find(slug);
  if (!project) {
    return { ok: false, error: new Error(\`Unknown project: \${slug}\`) };
  }
  return { ok: true, value: project };
}

// The caller can't ignore the error case — the type won't let them.
const result = await loadProject(slug);
if (!result.ok) return notFound();
render(result.value);`}
              />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                Motion is an enhancement
              </h3>
              <p className="mt-2 mb-4 text-sm leading-relaxed text-foreground-muted">
                Animation layers on top of a working, accessible baseline — and steps aside entirely
                when the user asks it to.
              </p>
              <CodeSnippet
                filename="components/reveal.tsx"
                language="tsx"
                code={`export function Reveal({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  // Respect the user's setting: render the content, skip the motion.
  if (reducedMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  );
}`}
              />
            </div>
          </div>
        </Container>
      </Section>

      <CTASection
        title="If any of this resonates, let's talk."
        description="I work best with people who care about the same details. Tell me what you're building."
        secondaryLabel="More about me"
        secondaryHref={ROUTES.about}
      />
    </>
  );
}
