// Philosophy: 3-up grid of big gradient indices over strong hairlines.
// Principles are the real ones (see /philosophy for the long-form versions).
import { LandingReveal as Reveal } from "./landing-reveal";
import { LandingSectionHeader } from "./landing-section-header";

const PRINCIPLES = [
  {
    no: "01",
    title: "Understand, then build",
    body: "From USB datasheets to model weights, I build from first principles — the fastest path to something that works is knowing exactly why it works.",
  },
  {
    no: "02",
    title: "Verify, don't assume",
    body: "My OS boots in CI on every push; my money math is unit-tested to the decimal. Evidence over optimism, in every layer of the stack.",
  },
  {
    no: "03",
    title: "Local-first by default",
    body: "AI platforms that run against a database you own, with every risky action gated behind human approval. Privacy is architecture, not a setting.",
  },
] as const;

export function PhilosophySection() {
  return (
    <section id="philosophy" className="l-section relative">
      <div className="l-container">
        <Reveal className="max-w-[680px]">
          <LandingSectionHeader
            eyebrow="How I work — 02"
            title="Principles I don't compromise on."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[clamp(24px,4vw,56px)]">
          {PRINCIPLES.map((principle, i) => (
            <Reveal key={principle.no} delay={i * 0.07}>
              <div className="border-t border-border-strong pt-[26px]">
                <div className="l-grad-text font-sg text-[clamp(2.6rem,4.6vw,3.6rem)] leading-none font-semibold tracking-[-0.02em]">
                  {principle.no}
                </div>
                <h3 className="font-sg mt-5 text-[22px] font-semibold tracking-[-0.01em] text-foreground">
                  {principle.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.68] text-foreground-muted">
                  {principle.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
