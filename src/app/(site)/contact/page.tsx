import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Rule } from "@/components/layout/rule";
import { DefinitionList } from "@/components/layout/definition-list";
import { Calibration } from "@/components/motion/calibration";
import { ContactForm } from "@/components/forms/contact-form";
import { SocialLinks } from "@/components/common/social-links";
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

      {/* Hero — the transmission title (one word rationed to Signal Orange). */}
      <Section index="01" label="TRANSMISSION" className="pb-0">
        <Container>
          <Calibration className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-3 font-mono text-mono-eyebrow text-signal uppercase">
              <Rule signal />
              <span className="tabular text-foreground-subtle">TX</span>
              <span>Transmission</span>
            </span>

            <h1 className="font-display text-display-xl text-balance text-foreground">
              Let&rsquo;s <span className="text-signal">talk.</span>
            </h1>

            <p className="max-w-[720px] text-body-lg text-pretty text-foreground-muted">
              Tell me about your project, your team, or the problem you&rsquo;re trying to solve. I
              read every message and reply personally — usually within 1&ndash;2 business days.
            </p>
          </Calibration>
        </Container>
      </Section>

      {/* Channel — transmission form + instrument aside. */}
      <Section index="02" label="CHANNEL" rule>
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            {/* Left: the transmission form. */}
            <ContactForm />

            {/* Right: mono instrument aside. */}
            <aside className="flex flex-col gap-8">
              <h2 className="sr-only">Contact details</h2>

              <p className="font-mono tabular text-mono-status uppercase">
                <span className="text-foreground-subtle">STATUS: </span>
                <span className="text-signal">OPEN</span>
              </p>

              <DefinitionList
                items={[
                  {
                    field: "Email",
                    value: (
                      <a
                        href={`mailto:${siteConfig.links.email}`}
                        className="font-mono text-foreground-muted underline-offset-4 transition-colors hover:text-signal hover:underline"
                      >
                        {siteConfig.links.email}
                      </a>
                    ),
                  },
                  { field: "Latency", value: "1–2 business days" },
                  {
                    field: "Channels",
                    value: <SocialLinks size="sm" className="mt-1" />,
                  },
                ]}
              />

              <p className="border-t border-border pt-6 font-mono text-mono-meta text-foreground-subtle">
                Your details are used only to reply to your message — never shared, never added to a
                list. Prefer another channel? Reach out via{" "}
                <Link
                  href={ROUTES.github}
                  className="text-foreground-muted underline-offset-4 transition-colors hover:text-signal hover:underline"
                >
                  GitHub
                </Link>
                .
              </p>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
