// Hero poster (RSC, inline SVG) — the LCP-safe / reduced-motion / no-WebGL fallback for
// the Calibration Field. Paints from the initial HTML (no fetch/decode/JS) and traces the
// SAME Lissajous curve at time 0, so swapping to the live canvas has no visual jump.
import { samplePoints, LISSAJOUS_BOUNDS } from "@/three/scenes/lissajous";

function tracePoints(): string {
  const n = 420;
  const pts = samplePoints(n, 0);
  const rangeX = LISSAJOUS_BOUNDS.x * 2;
  const rangeY = LISSAJOUS_BOUNDS.y * 2;
  const coords: string[] = [];
  for (let i = 0; i < n; i += 1) {
    const x = pts[i * 3];
    const y = pts[i * 3 + 1];
    const sx = ((x + LISSAJOUS_BOUNDS.x) / rangeX) * 100;
    const sy = (1 - (y + LISSAJOUS_BOUNDS.y) / rangeY) * 100;
    coords.push(`${sx.toFixed(2)},${sy.toFixed(2)}`);
  }
  return coords.join(" ");
}

export function HeroPoster() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <pattern id="datum-hero-grid" width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M5 0H0V5" fill="none" stroke="var(--rule)" strokeWidth="0.25" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="var(--surface-1)" />
      <rect width="100" height="100" fill="url(#datum-hero-grid)" opacity="0.7" />
      <line x1="50" y1="0" x2="50" y2="100" stroke="var(--border-strong)" strokeWidth="0.3" />
      <line x1="0" y1="50" x2="100" y2="50" stroke="var(--border-strong)" strokeWidth="0.3" />
      <polyline
        points={tracePoints()}
        fill="none"
        stroke="var(--signal)"
        strokeWidth="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
