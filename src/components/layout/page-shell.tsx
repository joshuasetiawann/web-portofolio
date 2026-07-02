// Page shell: skip link, instrument gutter rail, header, main landmark, and footer
// for app routes (RSC). Content is padded clear of the fixed left rail on lg+.
import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { IndexGutter } from "@/components/layout/index-gutter";

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative flex min-h-dvh flex-col lg:pl-[var(--gutter-w)]">
      <a
        href="#main-content"
        className="sr-only bg-accent px-4 py-2 text-sm font-medium text-accent-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]"
      >
        Skip to main content
      </a>
      <IndexGutter />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}
