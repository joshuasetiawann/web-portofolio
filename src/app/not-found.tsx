import type { Metadata } from "next";
import { NotFoundState } from "@/components/shared/not-found-state";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="grid min-h-dvh place-items-center px-6">
      <NotFoundState />
    </main>
  );
}
