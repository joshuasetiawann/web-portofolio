"use client";

// Calibration Field — the hero's WebGL centerpiece (DATUM).
// A single Signal-Orange oscilloscope trace: points sampled along a Lissajous+curl
// curve, redrawn each frame. No custom shaders, no lights, no textures — cheap and
// safe to fall back from (the SVG poster reproduces frame 0). frameloop is gated to
// "always" only while the hero is on-screen (see scene-canvas), so this is the single
// continuous animation on the site.

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, type BufferAttribute, type Points } from "three";

import { lissajous, samplePoints } from "@/three/scenes/lissajous";

export interface CalibrationFieldProps {
  /** Point count along the trace — pass a lower value on small/low-power devices. */
  count?: number;
}

export function CalibrationField({ count = 1600 }: CalibrationFieldProps) {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => samplePoints(count, 0), [count]);

  useFrame((state) => {
    const points = ref.current;
    if (!points) return;
    const time = state.clock.elapsedTime;
    const attr = points.geometry.getAttribute("position") as BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i += 1) {
      const [x, y] = lissajous(i / (count - 1), time);
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
    }
    attr.needsUpdate = true;
    // Gentle pointer parallax (transform-only), keeps the trace feeling "measured".
    points.position.x += (state.pointer.x * 0.25 - points.position.x) * 0.05;
    points.position.y += (state.pointer.y * 0.15 - points.position.y) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        sizeAttenuation
        transparent
        color="#6e8bff"
        depthWrite={false}
        opacity={0.95}
        blending={AdditiveBlending}
      />
    </points>
  );
}
