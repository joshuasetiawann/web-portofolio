// Gallery tile that opens a Dialog lightbox; renders a graphite grid placeholder until real media exists.
"use client";

import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";

import { DURATION, EASE } from "@/animations/easings";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format-date";
import { getIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { GalleryItem as GalleryItemData } from "@/data/gallery";

interface GalleryItemProps {
  item: GalleryItemData;
}

export function GalleryItem({ item }: GalleryItemProps) {
  const reducedMotion = useReducedMotion();

  const ratio = item.height > 0 ? item.width / item.height : 16 / 9;
  const MediaIcon = getIcon(item.type === "video" ? "Rocket" : "Images") ?? getIcon("Images");
  const formattedDate = formatDate(`${item.date}-01`, { year: "numeric", month: "long" });

  const visual = (
    <>
      {item.src ? (
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="relative flex h-full w-full items-center justify-center bg-surface-1"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
          {MediaIcon ? <MediaIcon className="relative size-7 text-foreground-subtle" /> : null}
        </div>
      )}
    </>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "group relative flex w-full flex-col overflow-hidden rounded-none border border-border text-left",
            "transition-colors hover:border-border-strong",
            "focus-visible:border-primary",
          )}
          aria-label={`Open ${item.title}`}
        >
          <span className="relative block w-full overflow-hidden" style={{ aspectRatio: ratio }}>
            {visual}
          </span>
          <span className="flex flex-col gap-2 border-t border-border p-4">
            <span className="flex items-start justify-between gap-2">
              <span className="font-display text-sm font-medium text-foreground transition-colors group-hover:text-signal">
                {item.title}
              </span>
              <Badge variant="secondary" className="shrink-0">
                {item.category}
              </Badge>
            </span>
            <span className="flex items-center gap-2 font-mono text-mono-meta text-foreground-subtle">
              <time dateTime={item.date} className="tabular">
                {item.date}
              </time>
              <span aria-hidden="true">·</span>
              <span className="tabular">
                {item.width}×{item.height}
              </span>
            </span>
            {item.caption ? (
              <span className="text-sm text-foreground-muted">{item.caption}</span>
            ) : null}
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl gap-4">
        <AnimatePresence>
          <m.div
            key="lightbox-body"
            className="flex flex-col gap-4"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 0.98 }}
            transition={{ duration: DURATION.base, ease: [...EASE.out] }}
          >
            <div className="relative overflow-hidden rounded-none border border-border">
              <div className="relative w-full" style={{ aspectRatio: ratio }}>
                {visual}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{item.category}</Badge>
                {formattedDate ? (
                  <span className="font-mono tabular text-mono-meta text-foreground-subtle">
                    {formattedDate}
                  </span>
                ) : null}
              </div>
              <DialogTitle className="font-display text-lg">{item.title}</DialogTitle>
              <DialogDescription>{item.caption ?? item.alt}</DialogDescription>
            </div>
          </m.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
