// Returns true once the component has mounted on the client.
// Useful for gating client-only UI to avoid hydration mismatches.
// Uses useSyncExternalStore so the server snapshot is deterministically `false`.
"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false, // server snapshot
  );
}
