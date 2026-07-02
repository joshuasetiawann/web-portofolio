// SocialLinks — row of accessible icon buttons linking to social/contact profiles.
import { socialLinks, type SocialLink } from "@/data/social-links";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface SocialLinksProps {
  links?: SocialLink[];
  className?: string;
  size?: "sm" | "md";
}

export function SocialLinks({ links = socialLinks, className, size = "md" }: SocialLinksProps) {
  if (links.length === 0) return null;

  const sizing = size === "sm" ? "size-8" : "size-10";
  const iconSize = size === "sm" ? "size-4" : "size-5";

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {links.map((link) => {
        const Icon = getIcon(link.icon);
        const isExternal = /^https?:\/\//.test(link.href);

        return (
          <li key={link.label}>
            <a
              href={link.href}
              aria-label={link.label}
              title={link.label}
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={cn(
                "flex items-center justify-center border border-border text-foreground-muted transition-colors hover:text-signal",
                sizing,
              )}
            >
              {Icon ? (
                <Icon className={iconSize} aria-hidden="true" />
              ) : (
                <span className="font-mono text-xs">{link.label.charAt(0)}</span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
