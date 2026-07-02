// Contact: giant gradient "Let's talk." with the magnetic email pill and the
// socials row, over a bottom radial glow.
"use client";

import { Magnetic } from "@/components/motion/magnetic";
import { LandingReveal as Reveal } from "./landing-reveal";
import { siteConfig } from "@/config/site";
import { socialLinks } from "@/data/social-links";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-border py-[clamp(90px,12vw,180px)]"
    >
      <div
        className="absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 120%, rgba(var(--glow-rgb), 0.16), transparent 60%)",
        }}
      />
      <div className="l-container relative z-1 w-full">
        <Reveal className="max-w-[760px]">
          <div className="l-section-eyebrow">
            <span className="l-diamond rounded-[1px]" aria-hidden="true" />
            Contact — 05
          </div>
          <h2 className="font-sg mt-5 text-[clamp(3rem,9vw,7rem)] leading-[0.98] font-semibold tracking-[-0.03em] text-foreground">
            Let&apos;s <span className="l-grad-text">talk.</span>
          </h2>
          <p className="mt-[26px] max-w-[560px] text-[clamp(1.05rem,1.4vw,1.2rem)] leading-[1.65] text-foreground-muted">
            A short note is plenty — tell me what you&apos;re working on. I&apos;m currently open to
            new work and usually reply within a couple of days.
          </p>

          <div className="mt-[38px] flex flex-wrap gap-3.5">
            <Magnetic>
              <a
                href={`mailto:${siteConfig.links.email}`}
                className="l-pill l-pill-gradient gap-2.5 !px-7 !py-4 text-[15px] shadow-[0_10px_34px_rgba(var(--glow-rgb),0.32)] hover:shadow-[0_16px_48px_rgba(var(--glow-rgb),0.46)] hover:brightness-[1.08]"
              >
                {siteConfig.links.email} <span className="text-base">↗</span>
              </a>
            </Magnetic>
          </div>

          <div className="font-gm mt-[34px] flex flex-wrap gap-x-6 gap-y-2.5 text-sm">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 text-foreground-muted transition-colors hover:text-foreground"
              >
                {social.label} <span className="opacity-55">↗</span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
