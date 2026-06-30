// Isomorphic layout effect: useLayoutEffect on the client, useEffect on the server.
// Avoids the React "useLayoutEffect does nothing on the server" warning during SSR.
import { useEffect, useLayoutEffect } from "react";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
