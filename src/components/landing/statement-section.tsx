// Statement band: the point-of-view pull-quote on the alt band, with a single
// gradient phrase. Copy carried over from the real DATUM statement.
import { LandingReveal as Reveal } from "./landing-reveal";

export function StatementSection() {
  return (
    <section className="l-band relative">
      <div className="l-container">
        <Reveal className="max-w-[1000px]">
          <div className="l-eyebrow text-foreground-subtle">Point of view</div>
          <blockquote>
            <p className="font-sg mt-[22px] text-[clamp(1.7rem,4.4vw,3.4rem)] leading-[1.16] font-medium tracking-[-0.02em] text-balance text-foreground">
              I don&apos;t ship what I <span className="l-grad-text">can&apos;t explain</span> —
              from kernel space to the browser, understanding is the real deliverable.
            </p>
            <footer className="font-gm mt-[26px] text-[13px] tracking-[0.04em] text-foreground-muted">
              — how I approach every build
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
