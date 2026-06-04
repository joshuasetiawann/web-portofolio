// CodeSnippet — labelled code block pairing a filename header bar with the shared CodeBlock body.
import { CodeBlock } from "@/components/shared/code-block";
import { cn } from "@/lib/utils";

interface CodeSnippetProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeSnippet({ code, language, filename, className }: CodeSnippetProps) {
  return (
    <CodeBlock code={code} language={language} filename={filename} className={cn(className)} />
  );
}
