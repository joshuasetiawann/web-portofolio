// mdx.ts — MDX foundation (types only).
// NOTE: This module intentionally avoids the heavy @mdx-js/react runtime.
// The actual MDXComponents registry (mapping HTML/custom tags to React
// components) lives in a dedicated client component elsewhere. Here we only
// expose a lightweight type alias so other foundation modules can reference
// the shape without pulling in a runtime dependency.
export type MDXComponents = Record<string, unknown>;
