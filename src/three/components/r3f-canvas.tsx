"use client";

// Thin, performance-safe wrapper around the react-three-fiber <Canvas>.
// Applies shared DPR clamp, on-demand frameloop, and accessible canvas attributes.
// Renders no real scene — feature scenes are passed as children.

import { Canvas, type CanvasProps } from "@react-three/fiber";
import type { ReactNode } from "react";
import { DEFAULT_CAMERA, DPR_RANGE, FRAMELOOP, GL_DEFAULTS } from "@/three/constants";

export interface R3FCanvasProps extends Omit<CanvasProps, "children"> {
  children?: ReactNode;
}

export function R3FCanvas({ children, gl, camera, ...props }: R3FCanvasProps) {
  return (
    <Canvas
      frameloop={FRAMELOOP}
      dpr={[DPR_RANGE[0], DPR_RANGE[1]]}
      camera={{ ...DEFAULT_CAMERA, ...camera } as CanvasProps["camera"]}
      gl={{ ...GL_DEFAULTS, ...gl }}
      // The canvas is decorative; keep it out of the accessibility tree and tab order.
      aria-hidden
      tabIndex={-1}
      {...props}
    >
      {children}
    </Canvas>
  );
}
