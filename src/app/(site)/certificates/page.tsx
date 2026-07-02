// Certificates — DATUM "THE LEDGER": one continuous hairline ledger of credentials
// (CERT-###), each row filing issuer · date · skills, pinning the credentialId as a
// mono coordinate and exposing the verification URL as a mono VERIFY link. Terminates
// on the ledger + StatusBar (no CTA).
import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { LedgerList, LedgerRow } from "@/components/layout/ledger-row";
import { Calibration } from "@/components/motion/calibration";
import { ExternalLink } from "@/components/shared/external-link";
import { EmptyState } from "@/components/shared/empty-state";
import { certificates } from "@/data/certificates";
import { formatDate } from "@/utils/format-date";
import { buildMetadata } from "@/lib/metadata";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = buildMetadata({
  title: "Certificates",
  description:
    "Professional certifications and credentials — verified courses and programs across React, cloud, and creative engineering.",
  path: ROUTES.certificates,
});

export default function CertificatesPage() {
  return (
    <>
      <PageHero
        eyebrow="Index · CERT"
        title="Credentials & certifications"
        description="A record of the courses and programs I've completed — each one earned, verifiable, and tied to the skills I build with."
      />

      <Section index="01" label="Index" rule>
        <Container>
          <SectionHeader
            eyebrow="Credentials"
            title="Certificate ledger"
            description="Every credential, filed by index. Hover a row to trace it; verify any entry against its issuer."
          />
          <div className="mt-10">
            {certificates.length > 0 ? (
              <Calibration>
                <LedgerList
                  label="Certificates"
                  header={
                    <>
                      <span className="w-16 shrink-0">Index</span>
                      <span className="min-w-0 flex-1">Credential · Issuer · Date · Skills</span>
                      <span className="hidden md:block">Credential ID</span>
                      <span>Verify</span>
                    </>
                  }
                >
                  {certificates.map((certificate, i) => (
                    <LedgerRow
                      key={`${certificate.name}-${certificate.issuer}`}
                      prefix="CERT"
                      index={i + 1}
                      title={certificate.name}
                      specs={[
                        certificate.issuer,
                        formatDate(certificate.date, { month: "short", year: "numeric" }) ||
                          certificate.date,
                        certificate.skills.join(" / "),
                      ].filter(Boolean)}
                      coordinate={certificate.credentialId}
                      metric={
                        certificate.url
                          ? {
                              value: (
                                <ExternalLink
                                  href={certificate.url}
                                  className="font-mono text-mono-label font-medium tracking-wider text-foreground-muted uppercase"
                                >
                                  Verify →
                                </ExternalLink>
                              ),
                            }
                          : undefined
                      }
                    />
                  ))}
                </LedgerList>
              </Calibration>
            ) : (
              <EmptyState
                title="No certificates yet"
                description="Certifications will appear here as they're earned."
              />
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
