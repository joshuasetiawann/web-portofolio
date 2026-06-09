// Per-post OG image.
import { renderOgImage, ogSize, ogContentType } from "@/lib/og";
import { getAllPosts, getPostBySlug } from "@/lib/content";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Blog post by Joshua Setiawan";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return renderOgImage({
    eyebrow: "Writing",
    title: post?.title ?? "Blog",
    subtitle: post?.description,
  });
}
