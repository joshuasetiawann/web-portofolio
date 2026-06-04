// CertificateCard — a credential card that opens a dialog with full details (skills, credential id, verification link).
"use client";

import { ArrowUpRight, Award, Calendar } from "lucide-react";

import { SkillBadge } from "@/components/common/skill-badge";
import { ExternalLink } from "@/components/shared/external-link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Certificate } from "@/data/certificates";
import { formatDate } from "@/utils/format-date";

interface CertificateCardProps {
  certificate: Certificate;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const date = formatDate(certificate.date, { month: "long", year: "numeric" }) || certificate.date;
  const hasDetails = Boolean(certificate.credentialId || certificate.url);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group flex h-full w-full flex-col gap-3 rounded-2xl border border-border bg-surface-1 p-6 text-left transition-[transform,border-color] hover:-translate-y-0.5 hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface-2 text-primary"
          >
            <Award className="size-5" />
          </span>

          <span className="flex flex-col gap-1">
            <span className="font-display text-base leading-snug font-semibold text-foreground">
              {certificate.name}
            </span>
            <span className="text-sm text-foreground-muted">{certificate.issuer}</span>
          </span>

          <span className="mt-auto inline-flex items-center gap-1.5 pt-1 font-mono text-xs text-foreground-subtle">
            <Calendar className="size-3" aria-hidden="true" />
            {date}
          </span>
          <span className="sr-only">View certificate details</span>
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">{certificate.name}</DialogTitle>
          <DialogDescription>
            Issued by {certificate.issuer} · {date}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {certificate.skills.length > 0 ? (
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-medium tracking-wide text-foreground-subtle uppercase">
                Skills
              </h4>
              <ul className="flex flex-wrap gap-1.5">
                {certificate.skills.map((skill) => (
                  <li key={skill}>
                    <SkillBadge label={skill} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {hasDetails ? <Separator /> : null}

          {certificate.credentialId ? (
            <div className="flex flex-col gap-1">
              <h4 className="text-xs font-medium tracking-wide text-foreground-subtle uppercase">
                Credential ID
              </h4>
              <p className="font-mono text-sm break-all text-foreground-muted">
                {certificate.credentialId}
              </p>
            </div>
          ) : null}

          {certificate.url ? (
            <ExternalLink
              href={certificate.url}
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary"
            >
              Verify credential
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </ExternalLink>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
