// Signal Field: the hero's 2D-canvas constellation. Drifting points joined by
// hairlines whose alpha falls off with distance; node + line color lerped
// azure→teal by x-position; the pointer gently repels points and brightens
// nearby links. One rAF loop, paused off-view (IntersectionObserver), DPR
// capped at 2. Reduced motion / paused scene → a single static frame.
// Interaction math ported 1:1 from design baru/design_handoff_portfolio.
"use client";

import { useEffect, useRef, type RefObject } from "react";

import { useLandingMotion } from "./landing-scene";

// Raw hexes are intentional: canvas pixels can't read CSS variables.
// Mirrors --accent / --accent-2 in the .landing token block (tokens.css).
const AZURE: Rgb = [94, 139, 255]; // #5e8bff
const TEAL: Rgb = [56, 232, 200]; // #38e8c8

type Rgb = [number, number, number];

export interface FieldPointer {
  x: number;
  y: number;
  active: boolean;
}

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

function mix(t: number, alpha: number): string {
  const r = Math.round(AZURE[0] + (TEAL[0] - AZURE[0]) * t);
  const g = Math.round(AZURE[1] + (TEAL[1] - AZURE[1]) * t);
  const b = Math.round(AZURE[2] + (TEAL[2] - AZURE[2]) * t);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function SignalField({
  pointer,
  density = 64,
}: {
  /** Mutable pointer state owned by the hero (shared with the spotlight). */
  pointer: RefObject<FieldPointer>;
  /** Point density, scaled by canvas area and clamped to 24–150. */
  density?: number;
}) {
  const { motionOn } = useLandingMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let points: Point[] = [];
    let raf = 0;
    let visible = true;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rebuild = () => {
      const area = (w || 1200) * (h || 800);
      const n = Math.max(24, Math.min(150, Math.round(density * (area / (1280 * 760)))));
      points = Array.from({ length: n }, () => ({
        x: Math.random() * (w || 1200),
        y: Math.random() * (h || 800),
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.5 + 0.7,
      }));
    };

    const draw = (animate: boolean) => {
      ctx.clearRect(0, 0, w, h);
      const maxDist = Math.min(160, Math.max(96, w * 0.11));
      const ptr = pointer.current;

      if (animate) {
        for (const p of points) {
          p.x += p.vx;
          p.y += p.vy;
          if (ptr.active) {
            const dx = p.x - ptr.x;
            const dy = p.y - ptr.y;
            const d = Math.hypot(dx, dy);
            if (d < 150 && d > 0.5) {
              const f = ((150 - d) / 150) * 0.5;
              p.x += (dx / d) * f;
              p.y += (dy / d) * f;
            }
          }
          if (p.x < -30) p.x = w + 30;
          else if (p.x > w + 30) p.x = -30;
          if (p.y < -30) p.y = h + 30;
          else if (p.y > h + 30) p.y = -30;
        }
      }

      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < maxDist) {
            const t = a.x / (w || 1);
            let alpha = (1 - d / maxDist) * 0.5;
            if (ptr.active) {
              const near = Math.min(
                Math.hypot(a.x - ptr.x, a.y - ptr.y),
                Math.hypot(b.x - ptr.x, b.y - ptr.y),
              );
              if (near < 170) alpha = Math.min(0.85, alpha * (1 + ((170 - near) / 170) * 1.4));
            }
            ctx.strokeStyle = mix(t, alpha);
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of points) {
        ctx.fillStyle = mix(p.x / (w || 1), 0.92);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const start = () => {
      if (raf || !motionOn || !visible) return;
      const loop = () => {
        draw(true);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    resize();
    rebuild();
    if (motionOn) start();
    else draw(false);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    observer.observe(parent);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      rebuild();
      if (!motionOn) draw(false);
    });
    resizeObserver.observe(parent);

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [motionOn, density, pointer]);

  return <canvas ref={canvasRef} className="l-hero-canvas" aria-hidden="true" tabIndex={-1} />;
}
