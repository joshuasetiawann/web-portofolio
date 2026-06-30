import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CardSkeleton, GridSkeleton } from "@/components/shared/loading-skeleton";

export default function GitHubLoading() {
  return (
    <>
      <PageHero
        eyebrow="GitHub"
        title="Live from GitHub"
        description="Profile, repositories, and recent activity pulled directly from the GitHub API."
      />
      <Section className="pt-0">
        <Container>
          <div className="flex flex-col gap-12">
            <CardSkeleton />
            <GridSkeleton count={6} />
          </div>
        </Container>
      </Section>
    </>
  );
}
