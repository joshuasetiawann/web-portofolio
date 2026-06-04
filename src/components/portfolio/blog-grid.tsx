// BlogGrid — responsive 1/2/3-column grid of BlogCard.
import { BlogCard } from "@/components/portfolio/blog-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { Post } from "@/lib/content";

interface BlogGridProps {
  posts: Post[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return <EmptyState title="No posts yet" description="Check back soon for new writing." />;
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <BlogCard post={post} />
        </li>
      ))}
    </ul>
  );
}
