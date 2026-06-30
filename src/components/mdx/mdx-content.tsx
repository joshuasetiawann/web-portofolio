// Renders a Velite-compiled MDX body string against the themed component registry.
// Server component: the MDX is evaluated at build/SSR time; client components
// referenced by the registry (CodeBlock, ExternalLink, …) form their own boundaries.
import * as runtime from "react/jsx-runtime";
import type { ComponentType } from "react";

import { mdxComponents } from "@/components/mdx/mdx-components";

type MDXModule = {
  default: ComponentType<{ components?: Partial<typeof mdxComponents> }>;
};

function getMDXComponent(code: string): MDXModule["default"] {
  // Velite compiles MDX to a function body that returns the module given the JSX runtime.
  // `code` is our own MDX, compiled at build time — never user input, never interpolated.
  const run = new Function(code) as (scope: typeof runtime) => MDXModule;
  return run({ ...runtime }).default;
}

export function MDXContent({ code }: { code: string }) {
  const Component = getMDXComponent(code);
  return <Component components={mdxComponents} />;
}
