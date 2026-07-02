import { PageShell } from "@/components/layout/page-shell";
import { StatusBar } from "@/components/layout/status-bar";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { PageTransition } from "@/components/transitions/page-transition";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <PageShell>
        <PageTransition>{children}</PageTransition>
      </PageShell>
      <StatusBar />
    </>
  );
}
