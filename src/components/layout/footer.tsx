// Site footer: closing CTA, navigation sections, social row, and copyright (RSC).
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { getIcon } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { SocialLinks } from "@/components/common/social-links";

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href) || href.startsWith("mailto:");
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface-1">
      <Container className="py-12 sm:py-16">
        {/* Closing CTA */}
        <div className="flex flex-col gap-6 border-b border-border pb-10 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-mono-eyebrow tracking-widest text-signal uppercase">
              Let&apos;s connect
            </span>
            <h2 className="max-w-md font-display text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
              Have an idea worth building?{" "}
              <span className="text-foreground-muted">Let&apos;s talk.</span>
            </h2>
          </div>
          <a
            href={`mailto:${siteConfig.links.email}`}
            className="group inline-flex items-center gap-2 rounded-lg font-display text-base font-medium text-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:text-lg"
          >
            <Mail
              className="size-4 text-foreground-muted transition-colors group-hover:text-primary"
              aria-hidden="true"
            />
            {siteConfig.links.email}
          </a>
        </div>

        {/* Navigation grid */}
        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-3 lg:col-span-2">
            <Link
              href="/"
              className="w-fit rounded-lg font-display text-lg font-semibold text-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {siteConfig.name}
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-foreground-muted">
              {siteConfig.description}
            </p>
          </div>

          {footerNav.map((section) => (
            <nav key={section.title} aria-label={section.title} className="flex flex-col gap-3">
              <h2 className="font-mono text-xs tracking-widest text-foreground-subtle uppercase">
                {section.title}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {section.items.map((item) => {
                  const external = isExternal(item.href);
                  const Icon = getIcon(item.icon);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group inline-flex items-center gap-2 rounded-md text-sm text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        {Icon ? (
                          <Icon
                            className="size-4 shrink-0 text-foreground-subtle transition-colors group-hover:text-foreground"
                            aria-hidden="true"
                          />
                        ) : null}
                        <span>{item.label}</span>
                        {external ? (
                          <ArrowUpRight
                            className="size-3 text-foreground-subtle opacity-0 transition-opacity group-hover:opacity-100"
                            aria-hidden="true"
                          />
                        ) : null}
                        {external ? <span className="sr-only"> (opens in new tab)</span> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-foreground-muted">
            &copy; {year} {siteConfig.author.name}. All rights reserved.
          </p>
          <SocialLinks size="sm" />
        </div>
      </Container>
    </footer>
  );
}
