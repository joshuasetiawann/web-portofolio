// Per-project OG image.
import { renderOgImage, ogSize, ogContentType } from "@/lib/og";
import { projects, getProjectBySlug } from "@/data/projects";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Project by Joshua Setiawan";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return renderOgImage({
    eyebrow: project?.category ?? "Work",
    title: project?.title ?? "Project",
    subtitle: project?.summary,
  });
}
