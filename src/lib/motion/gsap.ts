// Lazy GSAP + ScrollTrigger accessor. Imported ONLY by route-level scroll
// components (e.g. the Timeline), so GSAP never enters the shared/first-load bundle.
// Registers ScrollTrigger once on the client.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function getGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export { gsap, ScrollTrigger };
