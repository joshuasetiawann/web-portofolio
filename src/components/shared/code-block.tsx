// Foundation code block rendering pre/code with an optional filename header and copy button.
import { CopyButton } from "@/components/shared/copy-button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language, filename, className }: CodeBlockProps) {
  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-surface-1",
        className,
      )}
    >
      {filename ? (
        <figcaption className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-xs text-foreground-muted">
          <span className="truncate">{filename}</span>
          {language ? (
            <span className="tracking-wide text-foreground-subtle uppercase">{language}</span>
          ) : null}
        </figcaption>
      ) : null}
      <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <CopyButton value={code} label="Copy code" />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-foreground" data-language={language ?? undefined}>
          {code}
        </code>
      </pre>
    </figure>
  );
}
