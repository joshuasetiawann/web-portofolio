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
                "flex items-center justify-center rounded-lg border border-border bg-surface-1 text-foreground-muted transition-colors hover:border-border-strong hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                sizing,
              )}
            >
              {Icon ? (
                <Icon className={iconSize} aria-hidden="true" />
              ) : (
                <span className="text-xs font-medium">{link.label.charAt(0)}</span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
