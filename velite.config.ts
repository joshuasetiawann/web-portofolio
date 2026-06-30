import { defineConfig, defineCollection, s } from "velite";

/**
 * Velite content pipeline — blog posts only.
 * Projects, research, and all other structured content live in `src/data/*`.
 * Generates typed collections + compiled MDX into `.velite` (gitignored),
 * imported via the `#site/content` alias and wrapped by `src/lib/content.ts`.
 */

const posts = defineCollection({
  name: "Post",
  pattern: "blog/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      description: s.string().max(300),
      date: s.isodate(),
      updated: s.isodate().optional(),
      tags: s.array(s.string()).default([]),
      draft: s.boolean().default(false),
      featured: s.boolean().default(false),
      cover: s.string().optional(),
      metadata: s.metadata(),
      toc: s.toc(),
      body: s.mdx(),
    })
    .transform((data, { meta }) => {
      const slug = (meta.path.split(/[\\/]/).pop() ?? "post").replace(/\.mdx$/, "");
      return {
        ...data,
        slug,
        url: `/blog/${slug}`,
        readingTime: Math.max(1, Math.round(data.metadata.readingTime)),
      };
    }),
});

export default defineConfig({
  root: "src/content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts },
});
