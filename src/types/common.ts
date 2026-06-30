// Shared utility and primitive types used across the app.

/** Flattens an intersection/mapped type into a clean object for better DX. */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/** A value that may be present, null, or undefined. */
export type Maybe<T> = T | null | undefined;

/** A Lucide icon component reference. */
export type Icon = import("lucide-react").LucideIcon;
