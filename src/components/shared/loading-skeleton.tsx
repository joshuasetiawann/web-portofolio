// Reusable loading-state skeletons (card, grid, text) built on the base Skeleton primitive.
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-border bg-surface-1 p-5",
        className,
      )}
    >
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}

function GridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div
      role="status"
      className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div role="status" className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className={cn("h-4 w-full", index === lines - 1 && "w-2/3")} />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export { CardSkeleton, GridSkeleton, TextSkeleton };
