import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, ShieldCheck } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { AvailabilityBadge } from "@/components/common/availability-badge";
import { SocialLinks } from "@/components/common/social-links";
import { ExternalLink } from "@/components/shared/external-link";
import { JsonLd } from "@/components/shared/json-ld";
import { buildMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Have a project, role, or question in mind? Send me a message and I'll get back to you — usually within a couple of business days.",
  path: ROUTES.contact,
});

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact",
  url: absoluteUrl(ROUTES.contact),
  description: "Get in touch with Joshua Setiawan about projects, roles, and collaboration.",
  mainEntity: {
    "@type": "Person",
    name: siteConfig.author.name,
    email: `mailto:${siteConfig.links.email}`,
    url: siteConfig.url,
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactJsonLd} />

      <PageHero
        eyebrow="Contact"
        title="Let’s build something"
        description="Tell me about your project, your team, or the problem you're trying to solve. I read every message and reply personally."
      />

      <Section className="pt-0">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            {/* Form */}
            <Reveal>
              <ContactForm />
            </Reveal>

            {/* Aside */}
            <Reveal delay={0.05}>
              <aside className="flex flex-col gap-8">
                <AvailabilityBadge className="w-fit" />

                <div className="flex flex-col gap-4">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Other ways to reach me
                  </h2>
                  <ul className="flex flex-col gap-3 text-sm">
                    <li className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-primary"
                      >
                        <Mail className="size-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className="font-medium text-foreground">Email</span>
                        <ExternalLink
                          href={`mailto:${siteConfig.links.email}`}
                          className="text-foreground-muted"
                        >
                          {siteConfig.links.email}
                        </ExternalLink>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-primary"
                      >
                        <Clock className="size-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className="font-medium text-foreground">Response time</span>
                        <span className="text-foreground-muted">
                          Usually within 1–2 business days.
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Find me online
                  </h2>
                  <SocialLinks />
                </div>

                <p className="flex items-start gap-2 border-t border-border pt-6 text-xs text-foreground-subtle">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>
                    Your details are used only to reply to your message and are never shared or
                    added to a mailing list. Prefer a different channel? Reach out via{" "}
                    <Link href={ROUTES.github} className="underline-offset-4 hover:underline">
                      GitHub
                    </Link>
                    .
                  </span>
                </p>
              </aside>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
