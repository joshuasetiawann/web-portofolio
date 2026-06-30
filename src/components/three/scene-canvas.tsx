"use client";

// Lazy, SSR-disabled entry point for all WebGL scenes.
// Mounts the R3F canvas only when motion is allowed AND WebGL is supported;
// otherwise renders a static poster fallback. Pauses rendering when scrolled
// out of view to conserve battery and GPU.

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Code-split the WebGL bundle; never render it on the server.
const R3FCanvas = dynamic(() => import("@/three/components/r3f-canvas").then((m) => m.R3FCanvas), {
  ssr: false,
});

/** Feature-detect WebGL availability without leaking the test context. */
function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

export interface SceneCanvasProps {
  children?: ReactNode;
  className?: string;
  /** Static fallback shown when WebGL is disabled or motion is reduced. */
  poster?: ReactNode;
}

export function SceneCanvas({ children, className, poster }: SceneCanvasProps) {
  const reducedMotion = useReducedMotion();
  const [webglSupported, setWebglSupported] = useState(false);
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWebglSupported(detectWebGL());
  }, []);

  // Pause the render loop when the canvas leaves the viewport.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "120px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shouldRenderWebGL = !reducedMotion && webglSupported;

  return (
    <div ref={containerRef} className={cn("relative h-full w-full overflow-hidden", className)}>
      {shouldRenderWebGL ? (
        <R3FCanvas frameloop={visible ? "always" : "never"}>{children}</R3FCanvas>
      ) : (
        <div aria-hidden className="absolute inset-0">
          {poster}
        </div>
      )}
    </div>
  );
}

export default SceneCanvas;
