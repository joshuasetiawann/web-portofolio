// Safe external anchor that opens in a new tab with a visually-hidden screen-reader hint.
import type { AnchorHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export function ExternalLink({ href, children, className, ...props }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "underline-offset-4 transition-colors hover:text-signal hover:underline focus-visible:underline",
        className,
      )}
      {...props}
    >
      {children}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}
