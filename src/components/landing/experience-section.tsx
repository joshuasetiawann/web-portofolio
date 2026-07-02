// Experience: hairline-separated rows — period/company/location label column,
// role + summary + dash-bulleted highlights + stack chips content column —
// straight from src/data/experience.ts.
import { LandingReveal as Reveal } from "./landing-reveal";
import { experience } from "@/data/experience";
import { LandingSectionHeader } from "./landing-section-header";

function periodLabel(start: string, end: string): string {
  const startYear = start.slice(0, 4);
  const endYear = end === "Present" ? "Now" : end.slice(0, 4);
  return `${startYear} – ${endYear}`;
}

export function ExperienceSection() {
  return (
    <section id="experience" className="l-section relative">
      <div className="l-container">
        <Reveal className="max-w-[680px]">
          <LandingSectionHeader eyebrow="Experience — 03" title="Where I've been building." />
        </Reveal>

        <div className="mt-11">
          {experience.map((item, i) => (
            <Reveal key={`${item.company}-${item.role}`} delay={i * 0.05}>
              <div className="flex flex-wrap gap-x-11 gap-y-7 border-t border-border py-[34px]">
                <div className="min-w-[180px] flex-[0_0_200px]">
                  <div className="font-gm inline-flex items-center gap-[9px] text-xs tracking-[0.06em] text-accent-2 tabular-nums">
                    <span className="size-[7px] rounded-full bg-accent-2" aria-hidden="true" />
                    {periodLabel(item.start, item.end)}
                  </div>
                  <div className="font-sg mt-3 text-[19px] font-semibold tracking-[-0.01em] text-foreground">
                    {item.company}
                  </div>
                  {item.location ? (
                    <div className="font-gm mt-[5px] text-xs text-foreground-subtle">
                      {item.location}
                    </div>
                  ) : null}
                </div>

                <div className="min-w-[280px] flex-[1_1_380px]">
                  <h3 className="font-sg text-[21px] font-semibold tracking-[-0.01em] text-foreground">
                    {item.role}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-[1.6] text-foreground-muted">
                    {item.summary}
                  </p>
                  <ul className="mt-[18px] flex flex-col gap-[9px]">
                    {item.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex gap-3 text-sm leading-[1.55] text-foreground-muted"
                      >
                        <span className="mt-px text-accent" aria-hidden="true">
                          —
                        </span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-[18px] flex flex-wrap gap-[7px]">
                    {item.stack.map((tech) => (
                      <span key={tech} className="l-chip-round l-chip-dim">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
