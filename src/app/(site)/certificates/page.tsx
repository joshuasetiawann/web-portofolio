import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { CertificateCard } from "@/components/portfolio/certificate-card";
import { EmptyState } from "@/components/shared/empty-state";
import { certificates } from "@/data/certificates";
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
        eyebrow="Certificates"
        title="Credentials & certifications"
        description="A record of the courses and programs I've completed — each one earned, verifiable, and tied to the skills I build with."
      />

      <Section>
        <Container>
          {certificates.length > 0 ? (
            <Reveal>
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {certificates.map((certificate) => (
                  <li key={`${certificate.name}-${certificate.issuer}`} className="flex">
                    <CertificateCard certificate={certificate} />
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : (
            <EmptyState
              title="No certificates yet"
              description="Certifications will appear here as they're earned."
            />
          )}
        </Container>
      </Section>
    </>
  );
}
