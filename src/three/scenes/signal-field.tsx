"use client";

// Signal Field — the hero's WebGL centerpiece.
// A GPU-light cloud of additive points in an azure→teal gradient, slowly drifting
// and parallaxing toward the pointer. No custom shaders (PointsMaterial), no lights,
// no textures — cheap to render and safe to fall back from. Positions are generated
// with a deterministic seeded PRNG (pure → no render-time impurity, stable layout).

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Color, MathUtils, type Points } from "three";

/** Deterministic pseudo-random in [0, 1) from a numeric seed (pure). */
function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

export interface SignalFieldProps {
  /** Point count — pass a lower value on small/low-power devices. */
  count?: number;
}

export function SignalField({ count = 3800 }: SignalFieldProps) {
  const ref = useRef<Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const azure = new Color("#5e8bff");
    const teal = new Color("#38e8c8");
    const tmp = new Color();

    for (let i = 0; i < count; i += 1) {
      const r1 = rand(i + 1);
      const r2 = rand(i + 101);
      const r3 = rand(i + 211);
      const r4 = rand(i + 331);

      // Even-ish distribution through a flattened spherical shell.
      const radius = 2 + Math.cbrt(r1) * 2.6;
      const theta = r2 * Math.PI * 2;
      const phi = Math.acos(2 * r3 - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.72;
      positions[i * 3 + 2] = radius * Math.cos(phi);

      tmp.copy(azure).lerp(teal, r4);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }

    return [positions, colors] as const;
  }, [count]);

  useFrame((state, delta) => {
    const points = ref.current;
    if (!points) return;
    // Continuous slow drift + eased pointer parallax (transform-only on the GPU).
    points.rotation.y += delta * 0.045;
    points.rotation.x = MathUtils.lerp(points.rotation.x, state.pointer.y * 0.18, 0.04);
    points.position.x = MathUtils.lerp(points.position.x, state.pointer.x * 0.4, 0.04);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        sizeAttenuation
        transparent
        vertexColors
        depthWrite={false}
        opacity={0.85}
        blending={AdditiveBlending}
      />
    </points>
  );
}
