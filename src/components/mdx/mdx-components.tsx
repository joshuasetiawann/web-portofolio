// MDX component registry mapping markdown elements to themed, accessible React components.
import Link from "next/link";
import {
  isValidElement,
  type AnchorHTMLAttributes,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";

import { CodeBlock } from "@/components/shared/code-block";
import { ExternalLink } from "@/components/shared/external-link";
import type { MDXComponents } from "@/lib/mdx";
import { cn } from "@/lib/utils";

function MdxH1({ className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "mt-2 scroll-m-20 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
        className,
      )}
      {...props}
    />
  );
}

function MdxH2({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b border-border pb-2 font-display text-2xl font-semibold tracking-tight text-foreground first:mt-0",
        className,
      )}
      {...props}
    />
  );
}

function MdxH3({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "mt-8 scroll-m-20 font-sans text-xl font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function MdxH4({ className, ...props }: ComponentProps<"h4">) {
  return (
    <h4
      className={cn(
        "mt-6 scroll-m-20 font-sans text-lg font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function MdxParagraph({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("leading-7 text-foreground-muted [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  );
}

function MdxAnchor({
  href = "",
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const linkClass = cn(
    "font-medium text-foreground underline underline-offset-4 transition-colors hover:text-signal focus-visible:text-signal",
    className,
  );

  const isHttp = /^https?:\/\//i.test(href) || href.startsWith("//");
  const isMailOrTel = href.startsWith("mailto:") || href.startsWith("tel:");

  if (isHttp) {
    return (
      <ExternalLink href={href} className={linkClass} {...props}>
        {children}
      </ExternalLink>
    );
  }

  if (isMailOrTel) {
    return (
      <a href={href} className={linkClass} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClass} {...props}>
      {children}
    </Link>
  );
}

function MdxUl({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "my-6 ml-6 list-disc text-foreground-muted marker:text-foreground-subtle [&>li]:mt-2",
        className,
      )}
      {...props}
    />
  );
}

function MdxOl({ className, ...props }: ComponentProps<"ol">) {
  return (
    <ol
      className={cn(
        "my-6 ml-6 list-decimal text-foreground-muted marker:text-foreground-subtle [&>li]:mt-2",
        className,
      )}
      {...props}
    />
  );
}

function MdxLi({ className, ...props }: ComponentProps<"li">) {
  return <li className={cn("leading-7", className)} {...props} />;
}

function MdxBlockquote({ className, ...props }: ComponentProps<"blockquote">) {
  return (
    <blockquote
      className={cn("mt-6 border-l border-primary pl-4 text-foreground-muted italic", className)}
      {...props}
    />
  );
}

function MdxHr({ className, ...props }: ComponentProps<"hr">) {
  return <hr className={cn("my-8 h-px w-full border-0 bg-rule", className)} {...props} />;
}

function MdxStrong({ className, ...props }: ComponentProps<"strong">) {
  return <strong className={cn("font-semibold text-foreground", className)} {...props} />;
}

function MdxEm({ className, ...props }: ComponentProps<"em">) {
  return <em className={cn("italic", className)} {...props} />;
}

function MdxCode({ className, ...props }: ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "rounded-none border border-border px-[0.4em] py-[0.2em] font-code text-sm text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function MdxPre({ children, className, ...props }: ComponentProps<"pre">) {
  // A fenced code block compiles to <pre><code class="language-x">...</code></pre>.
  // Extract the inner code element and delegate to the themed CodeBlock.
  if (isValidElement(children)) {
    const codeElement = children as ReactElement<{
      className?: string;
      children?: ReactNode;
    }>;
    const language = codeElement.props.className?.match(/language-([\w-]+)/)?.[1];
    const raw = codeElement.props.children;
    const code = typeof raw === "string" ? raw.replace(/\n$/, "") : "";

    if (code) {
      return <CodeBlock code={code} language={language} />;
    }
  }

  return (
    <pre
      className={cn("my-6 overflow-x-auto border border-border p-4 font-code text-sm", className)}
      {...props}
    >
      {children}
    </pre>
  );
}

function MdxImage({ className, alt = "", ...props }: ComponentProps<"img">) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- MDX images have unknown intrinsic dimensions; next/image is not viable here.
    <img
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn("my-6 rounded-none border border-border", className)}
      {...props}
    />
  );
}

export const mdxComponents = {
  h1: MdxH1,
  h2: MdxH2,
  h3: MdxH3,
  h4: MdxH4,
  p: MdxParagraph,
  a: MdxAnchor,
  ul: MdxUl,
  ol: MdxOl,
  li: MdxLi,
  blockquote: MdxBlockquote,
  hr: MdxHr,
  strong: MdxStrong,
  em: MdxEm,
  pre: MdxPre,
  code: MdxCode,
  img: MdxImage,
} satisfies MDXComponents;

/** Returns the registry, optionally merged with caller overrides. */
export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components };
}
