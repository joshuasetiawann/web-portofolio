// The hero's oscilloscope curve — a pure, deterministic Lissajous+curl function shared
// by the live WebGL trace and the static SVG poster, so the poster matches frame 0 exactly.

const TAU = Math.PI * 2;
const AX = 2.2;
const AY = 1.45;
const FX = 3;
const FY = 2;

/** Point on the curve at parameter t∈[0,1] and animation time (seconds). */
export function lissajous(t: number, time: number): [number, number] {
  const phase = 0.35 * time;
  const curl = 0.1 * Math.sin(TAU * (t * 2 + time * 0.08));
  return [AX * Math.sin(FX * TAU * t + phase), AY * Math.sin(FY * TAU * t) + curl];
}

/** N points along the curve as a flat xyz Float32Array (z=0). */
export function samplePoints(n: number, time: number): Float32Array {
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i += 1) {
    const [x, y] = lissajous(i / (n - 1), time);
    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = 0;
  }
  return arr;
}

/** Curve extents (for mapping into a poster viewBox). */
export const LISSAJOUS_BOUNDS = { x: AX + 0.4, y: AY + 0.45 } as const;
