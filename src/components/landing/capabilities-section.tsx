// Capabilities band: card per skill group — teal mono category label + chips —
// fed from the real toolkit in src/data/skills.ts.
import { LandingReveal as Reveal } from "./landing-reveal";
import { skills } from "@/data/skills";
import { LandingSectionHeader } from "./landing-section-header";

export function CapabilitiesSection() {
  return (
    <section className="l-band relative !border-b-0">
      <div className="l-container">
        <Reveal>
          <LandingSectionHeader
            eyebrow="Capabilities"
            title="A pragmatic, modern toolkit."
            action={
              <p className="max-w-[340px] text-[15px] leading-[1.65] text-foreground-muted">
                A working set, not a wishlist — tools I use often enough to have strong opinions
                about.
              </p>
            }
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[18px]">
          {skills.map((group, i) => (
            <Reveal key={group.category} delay={i * 0.06} className="h-full">
              <div className="l-cap-card h-full">
                <div className="font-gm text-[11px] tracking-[0.16em] text-accent-2 uppercase">
                  {group.category}
                </div>
                <div className="mt-[18px] flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="l-cap-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
