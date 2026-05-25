# Three.js / WebGL Strategy

> Purpose: Define exactly where Three.js belongs (and does not) across the 18 routes, the React Three Fiber architecture, the single-persistent-canvas model, and the performance/accessibility guarantees that keep WebGL a *premium accent* rather than a liability.

Related docs: [creative-direction](./creative-direction.md) · [animation-strategy](./animation-strategy.md) · [design-tokens](./design-tokens.md) · [design-system](./design-system.md) · [page-specifications](./page-specifications.md) · [responsive-strategy](./responsive-strategy.md) · [component-inventory](./component-inventory.md) · [information-architecture](./information-architecture.md)

---

## 1. Governing Principles

WebGL on this portfolio is **selective craft, never decoration**. It exists to demonstrate engineering depth through interactive surfaces, not to slow the site down. Eight non-negotiable rules govern every Three.js decision below.

| # | Principle | Consequence |
|---|-----------|-------------|
| 1 | **Three is NEVER the LCP.** | The static poster (AVIF) is always the LCP element; WebGL fades in *after* paint. |
| 2 | **Single persistent `<Canvas>`.** | One WebGL context for the whole app, mounted once, portaled into via tunnel-rat. No per-route canvases. |
| 3 | **`frameloop="demand"` by default.** | The GPU sleeps unless something requests a frame (pointer, scroll, animation, store change). |
| 4 | **Content is never gated behind WebGL.** | Every route renders complete, readable, and interactive with JS off or WebGL unavailable. |
| 5 | **Reduced-motion / low-end / no-WebGL → poster.** | A single resolved capability tier decides scene vs. poster *before* the scene mounts. |
| 6 | **Zero `three` in any first-load chunk.** | The canvas + all scenes are dynamically imported `ssr: false`; budgets in [responsive-strategy](./responsive-strategy.md) are enforced. |
| 7 | **Prefer procedural over assets.** | Particles, shaders, and math beat GLTF/textures. Draco/KTX2 only appear if a real model is unavoidable. |
| 8 | **Dispose everything.** | Geometries, materials, textures, render targets, and event listeners are released on scene unmount; the context is reused, never leaked. |

These map directly to the mandated stack: **Three.js + React Three Fiber + Drei**, `@react-three/postprocessing` **deferred for v1** (glow comes from emissive materials + sprites), and a **single rAF** where `gsap.ticker` drives Lenis and Lenis drives `ScrollTrigger` (see [animation-strategy](./animation-strategy.md)).

---

## 2. Where Three.js SHOULD and SHOULD NOT Be Used (18-Page Map)

The default is **no WebGL**. A page earns a scene only when interactive depth materially raises perceived craft *and* the page is not on the tightest performance budget. The persistent canvas means "use here" = "a scene is portaled into the shared canvas while this route's trigger element is in view," not "a new canvas mounts."

| # | Route | WebGL? | Scene / Feature | Rationale & Budget Note |
|---|-------|:------:|-----------------|-------------------------|
| 1 | `/` Landing | ✅ **Hero** | **Signal Field** (instanced curl-noise particles) | Flagship moment. Poster is the LCP; field fades in post-paint. Light-route budget (≤160KB) excludes three from first load. |
| 2 | `/about` | ✅ Accent | **Aurora gradient-mesh** (full-screen shader plane, low cost) | Calm ambient depth behind the bio. Pauses off-screen. |
| 3 | `/philosophy` | ⚠️ Optional | **Subtle background depth** (faint drifting field, very low density) | Light-route budget; ship only if it stays under budget, else CSS gradient. *Assumption: ship CSS-only at launch, WebGL as a fast-follow.* |
| 4 | `/projects` | ✅ Accent | **Project showcase depth layer** (per-card cover hover shader on hover/focus) | Shader runs only for the hovered/focused card; demand frames. |
| 5 | `/projects/[slug]` | ✅ Accent | **Cover hover shader** + optional depth parallax on the hero cover | Detail-route budget (≤175KB); scene scoped to the hero region only. |
| 6 | `/research` (+ `[slug]`) | ❌ No | — | Reading-first, dense routes. CSS/SVG only. |
| 7 | `/open-source` | ❌ No | — | Data-driven cards; live data via TanStack Query, no 3D. |
| 8 | `/blog` | ❌ No | — | Reading route; protect INP and JS budget. |
| 9 | `/blog/[slug]` | ❌ No | — | Long-form reading; absolutely no WebGL. |
| 10 | `/experience` | ❌ No | — | Timeline/list; SVG connectors, GSAP only. |
| 11 | `/timeline` | ❌ No | — | Scroll-pinned GSAP horizontal scroll, not WebGL. |
| 12 | `/gallery` | ⚠️ Optional | **Interactive lighting** (pointer-reactive light on a hovered tile, deferred) | Only if it stays within budget; default is CSS transform + image. *Assumption: CSS-only v1.* |
| 13 | `/certificates` | ❌ No | — | Card grid; no 3D. |
| 14 | `/achievements` | ❌ No | — | Card grid; no 3D. |
| 15 | `/github` Dashboard | ✅ **Optional** | **Contribution depth / constellation** (heightmapped calendar, or 2D fallback) | Heaviest budget (≤200KB) deliberately reserved for this. Falls back to a flat SVG heatmap. |
| 16 | `/contact` | ❌ No | — | Form-first; protect INP and a11y. CSS gradient only. |
| 17 | `not-found.tsx` (404) | ⚠️ Optional | Reuse the **Signal Field** at low density as a playful 404 backdrop | Reuses the already-loaded hero scene module; never blocks. |
| 18 | `loading.tsx` (skeletons) | ❌ No | — | Skeletons must paint instantly; no WebGL in a loading state. |

Additionally: the **technology graph / constellation** (Section 12.2) is a reusable scene that may appear on `/about` and/or `/philosophy` as a "how I think about systems" visual — never on more than one route per viewport.

**Hard rule:** if a route is not in the ✅/⚠️ rows above, the canvas portal renders nothing for that route and the GPU stays idle.

---

## 3. React Three Fiber Architecture

### 3.1 Layer model

```
<Providers>                         // Theme, Query, Motion, Tooltip, SmoothScroll
 ├─ <SceneCanvas />                 // ONE persistent <Canvas>, dynamic ssr:false, frameloop="demand"
 │   └─ <r3f.Out />                 // tunnel-rat OUTLET — scenes render here
 └─ <RouteTree>                     // normal DOM/RSC pages
     └─ <HeroSignalField />         // calls <r3f.In> to portal a scene INTO the shared canvas
```

- **`three/`** (target folder) holds all WebGL: `SceneCanvas`, scene components, shaders (`.glsl` as string modules or inline), materials, hooks, and the capability resolver.
- **`features/`** islands own the *DOM* side (poster `<img>`, captions, controls) and conditionally render the tunnel `<r3f.In>` child.
- **`providers/`** owns `SmoothScroll` (Lenis) and the shared rAF wiring; the canvas reads scroll/pointer from a **Zustand** store, it never subscribes to React re-renders for per-frame data.

### 3.2 tunnel-rat portal

A single `tunnel-rat` instance (`export const r3f = tunnel()`) bridges DOM-tree-located scene declarations into the one canvas:

| Side | Where | Responsibility |
|------|-------|----------------|
| `<r3f.Out />` | Inside `<Canvas>`, mounted once in the root layout shell | The only child of the canvas; renders whatever is currently tunneled in. |
| `<r3f.In>…</r3f.In>` | Inside a route/feature island (e.g. `HeroSignalField`) | Declares the active scene where it conceptually belongs in the page tree, while it actually renders in the canvas. |

This gives us **co-located authoring** (the hero scene "lives" in the hero island) with a **single GL context** (the canvas never unmounts on navigation). On route change, the previous `<r3f.In>` unmounts → its scene disposes → the new route's scene (if any) mounts.

### 3.3 Canvas configuration (canonical)

```
<Canvas
  frameloop="demand"
  dpr={[1, 1.75]}                       // clamp; see Performance
  gl={{ antialias: true, alpha: true, powerPreference: 'high-performance',
        preserveDrawingBuffer: false, stencil: false, depth: true }}
  camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 100 }}
  eventSource={documentRootRef}         // pointer events from the whole document
  eventPrefix="client"
  style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
/>
```

- **`position: fixed`, `zIndex: 0`, `pointerEvents: none`** — the canvas is an ambient backdrop layer beneath content; specific scenes opt back into pointer events via `eventSource`/raycast where interaction is wanted.
- **`alpha: true`** — the canvas is transparent so the DOM `--background` (`#05070D` dark / `#F7F8FB` light) shows through; scenes tint via additive/emissive color, not an opaque clear.
- **`demand`** — paired with `invalidate()` calls from interaction and animation drivers (Section 8).

### 3.4 State & per-frame data flow

```
pointer / scroll  ─▶  Zustand store (non-reactive getters)  ─▶  useFrame reads ref values
Lenis scroll      ─▶  store.scrollProgress                  ─▶  shader uniforms / camera
gsap.ticker       ─▶  lenis.raf  ─▶  ScrollTrigger.update   ─▶  invalidate() on change
```

Per-frame values **never** flow through React state (no re-renders at 60fps). `useFrame` and uniform updates read from refs/store. This is the same "single scroll authority" contract documented in [animation-strategy](./animation-strategy.md).

---

## 4. Scene Structure

Each scene is a self-contained component that owns its geometry, material, lights, and cleanup. A shared shape keeps them predictable.

```
<Scene>
 ├─ <SceneFrame>            // PerformanceMonitor + IntersectionObserver gate + adaptive DPR
 │   ├─ <Lights />          // scene-specific (often none — emissive does the work)
 │   ├─ <Subject />         // the instanced mesh / shader plane / graph
 │   │   ├─ geometry        // useMemo, disposed on unmount
 │   │   ├─ material        // useMemo (shaderMaterial), disposed on unmount
 │   │   └─ uniforms        // ref object, mutated in useFrame
 │   └─ <Effects? />        // emissive sprites / bloom-via-sprite (NO postprocessing v1)
 └─ <Fallback />            // poster path when tier !== 'full' (rendered in DOM, not canvas)
```

| Concern | Convention |
|---------|------------|
| Geometry | Created in `useMemo`; instanced (`InstancedMesh` / instanced buffer attributes) for any count > ~200. |
| Material | Custom `ShaderMaterial` via Drei `shaderMaterial` helper; uniforms held in a stable ref. |
| Animation | `useFrame((state, delta) => …)` mutating uniforms/instances; respects `delta` for frame-rate independence. |
| Mount/unmount | Scene mounts only when its `<r3f.In>` is present AND tier === 'full' AND in view. |
| Cleanup | `useEffect` return disposes geometry/material/textures and removes listeners (Section 11). |

---

## 5. Lighting Strategy

The aesthetic is **dark-first, glow-as-light**. We avoid expensive realtime lighting wherever a shader or emissive material can fake it more cheaply and more on-brand.

| Approach | Used by | Notes |
|----------|---------|-------|
| **Emissive / additive color** (default) | Signal Field, constellation, depth layers | Particles and lines emit color directly using token hues; no scene lights needed. Cheapest and matches the `--glow` look. |
| **Single ambient + one directional** | Aurora mesh, GitHub depth (if lit) | Soft fill + one key light for gentle surface shading; intensities low to preserve the dark mood. |
| **Sprite-based bloom** | Accent "hot points" | Additive radial sprites stand in for postprocessing bloom (which is **deferred for v1**). Sized in clip space, capped count. |
| **Theme-aware uniforms** | All scenes | Light/dark swaps a `uColorA/uColorB` pair and background alpha via the `next-themes` value read once per theme change (not per frame). |

**Color sourcing (from [design-tokens](./design-tokens.md), verbatim):**

| Token | Dark | Light | Scene use |
|-------|------|-------|-----------|
| `--primary` | `#5E8BFF` | `#3D5BE0` | Signal Field core, graph edges (`uColorA`). |
| `--accent` | `#38E8C8` | `#0FA98C` | Field tips, constellation nodes, gradient sweep end (`uColorB`). |
| `--glow` | `#6E9BFF` | `#9AB2FF` | Sprite bloom tint, additive halos. |
| `--background` | `#05070D` | `#F7F8FB` | Canvas reads through (alpha); scenes never paint a solid clear. |

Heat-ramp scenes (GitHub depth) use the canonical contribution ramp: `#10131F → #1F3A5F → #2F6FB0 → #4F9BFF → #8FC2FF` mapped to contribution intensity.

---

## 6. Camera Strategy

| Property | Value | Reason |
|----------|-------|--------|
| Type | `PerspectiveCamera` | Subtle depth/parallax; orthographic reserved for the optional flat constellation. |
| FOV | 35° | Narrow FOV = restrained, cinematic perspective; avoids fisheye distortion on wide hero fields. |
| Position | `[0, 0, 6]` baseline | Field sits centered; per-scene overrides allowed. |
| Movement | **Damped pointer parallax only** | Camera (or a parent group) lerps toward a small target offset from normalized pointer; max excursion ≈ ±0.4 units. No orbit, no scroll-jacking. |
| Scroll coupling | Optional, scrubbed | Hero may push the field slightly on `scrollProgress` (read from store); always within reduced-motion gate. |
| Damping | `MathUtils.damp` per axis, factor ~4 | Smooth, never twitchy; respects `delta`. |
| Reduced motion | **Frozen camera** | No parallax, no scrub; static composition matching the poster framing. |

The camera is the *primary* interaction surface for ambient scenes (cheap, GPU-light) — pointer-driven parallax reads premium without raycasting geometry.

---

## 7. Interaction Strategy

Interaction is **opt-in per scene** and always demand-driven (each meaningful input calls `invalidate()`).

| Scene | Input | Effect | Cost control |
|-------|-------|--------|--------------|
| Signal Field | Pointer move | Curl-noise flow field bends toward/away from a pointer attractor; camera parallax. | Pointer sampled, throttled to frame; no per-particle raycast. |
| Project cover shader | Hover / focus of a card | Displacement + chromatic shimmer on that card's cover only. | One material active at a time; idle cards = static `<Image>`. |
| Tech graph / constellation | Hover a node | Node highlights, connected edges brighten, tooltip (DOM) shows label. | Raycast only the (small) node set; edges are non-interactive lines. |
| Aurora mesh (About) | Scroll progress | Slow hue/flow drift as the section enters. | Time + scroll uniforms only; no pointer. |
| GitHub depth | Hover a day-cell | Cell lifts, tooltip shows count/date. | Instanced cells; raycast resolves instanceId. |

**Accessibility coupling** (see [responsive-strategy](./responsive-strategy.md) and the global a11y rules):

- All WebGL is **decorative**: canvas is `aria-hidden` and `tabindex="-1"`; no information is conveyed by the scene alone.
- Anything *meaningful* shown on hover in a scene (e.g., a repo name on the GitHub depth, a node label in the graph) has a **DOM, keyboard-reachable equivalent** beside/under the canvas — the WebGL is the flourish, the DOM list is the source of truth.
- Pointer interactions never trap focus or steal scroll; the canvas is `pointerEvents: none` except where a scene explicitly enables raycast.

---

## 8. Performance Budget & Enforcement

WebGL must respect the same envelope as the rest of the site: **CWV p75 mobile LCP ≤2.5s, INP ≤200ms, CLS ≤0.02**, and **zero three/gsap/framer in any first-load chunk** (see [responsive-strategy](./responsive-strategy.md)).

### 8.1 Frame & resolution controls

| Lever | Setting | Detail |
|-------|---------|--------|
| `frameloop` | `"demand"` | GPU idles at 0fps until `invalidate()`. Pointer parallax, scroll scrub, and any active `useFrame` animation call it; once motion settles, frames stop. |
| Continuous loops | Gated | Ambient drift (Signal Field, aurora) runs `frameloop` "always" **only while visible and tier === 'full'**, otherwise demand. IntersectionObserver flips it off-screen. |
| DPR | `dpr={[1, 1.75]}` | Clamps device pixel ratio so retina phones don't render 3×; Drei `<AdaptiveDpr pixelated={false} />` lowers it under load. |
| `PerformanceMonitor` | Drei | On sustained low FPS → step DPR down, reduce particle count uniform, or drop to poster as a last resort; on recovery, step partway back (with hysteresis to avoid flapping). |
| Particle count | Tiered | Desktop full ~30–60k instanced points; tablet ~12–20k; never on mobile-low (poster). Count is a uniform/attribute size chosen at mount from the resolved tier. |
| Pixel work | Minimized | No postprocessing pass (v1); bloom faked with capped additive sprites; shaders kept ALU-light, no heavy loops in fragment stage. |

### 8.2 Visibility & lifecycle

```
IntersectionObserver(triggerEl)
  ├─ entering view  → mount scene (if tier full) → frameloop active → invalidate()
  └─ leaving view   → pause loop (frameloop demand, no invalidate) → after grace period, unmount + dispose
document.visibilitychange (hidden) → pause all loops, cancel rAF
PerformanceMonitor (sustained low fps) → degrade → (worst case) swap to poster for the session
```

### 8.3 Bundle & loading budget

| Rule | Mechanism |
|------|-----------|
| No `three` in first-load JS | `SceneCanvas` and every scene = `dynamic(() => import(...), { ssr: false })`; verified by the chunk-content CI assertion in [responsive-strategy](./responsive-strategy.md). |
| Per-route ceilings | Light routes ≤160KB, detail ≤175KB, **GitHub/3D-heavy ≤200KB** (the only route given the larger budget). Enforced by `@next/bundle-analyzer` + `size-limit`. |
| Idle import | Scenes import on `requestIdleCallback` / when the trigger nears viewport, after the poster has painted — never blocking LCP. |
| Field RUM | `web-vitals` attribution confirms WebGL routes still hit INP/LCP targets in the wild. |

---

## 9. Fallback Tiers (Single Capability Resolver)

One resolver runs once (client, post-hydration) and returns a tier that decides scene vs. poster **before** any scene mounts. This mirrors the single reduced-motion gate in [animation-strategy](./animation-strategy.md).

```
resolveTier(): 'full' | 'lite' | 'poster'
  inputs:
    - prefers-reduced-motion (OS) OR in-app motion toggle OR navigator.connection.saveData
    - WebGL2 availability (probe; getContext('webgl2'))
    - deviceMemory / hardwareConcurrency / coarse-pointer heuristics (device tier)
    - viewport class (mobile/tablet/desktop)
  rules:
    reduced-motion OR saveData                 → 'poster'
    no WebGL(2) context                        → 'poster'
    low device tier OR mobile-low              → 'poster'  (or 'lite' if marginal)
    mid tier (tablet / modest desktop)         → 'lite'    (reduced particle count, no ambient loop)
    high tier desktop                          → 'full'
```

| Tier | What renders | Notes |
|------|--------------|-------|
| **full** | Complete scene, ambient loops, pointer parallax, full particle count | High-end desktop. |
| **lite** | Scene with reduced density, demand-only (no ambient drift), parallax optional | Mid devices; preserves the look at lower cost. |
| **poster** | **Static AVIF poster only** (the LCP element); no canvas content for that route | Mobile-low, no-WebGL, reduced-motion, or save-data. |

### 9.1 Reduced-motion fallback (poster)

- Resolves to **poster** tier: the scene never mounts; the AVIF poster (which *is* the LCP) simply stays.
- Posters are authored per scene at desktop/tablet/mobile crops, ≤120KB AVIF (LCP image budget), with `blurDataURL` placeholders.
- The explicit **Pause-motion control (WCAG 2.2.2)** also forces poster on any running scene at runtime, disposing it.

### 9.2 Mobile fallback

- Default mobile experience = **poster**, except where a scene is provably cheap and within budget. The Signal Field hero ships **poster on phones**; the WebGL field is a desktop/tablet enhancement. (See [responsive-strategy](./responsive-strategy.md) for the device matrix.)

### 9.3 Low-end device fallback

- Device-tier heuristics (deviceMemory ≤4, hardwareConcurrency ≤4, coarse pointer) → poster or lite.
- `PerformanceMonitor` provides a **runtime** safety net: a device that passes the static check but stutters degrades live (DPR ↓ → density ↓ → poster).

### 9.4 No-WebGL fallback

- WebGL2 probe fails (blocked context, headless, ancient GPU) → poster; no canvas is created at all, so there is no wasted context.

---

## 10. Lazy Loading, Suspense & Asset Optimization

### 10.1 Lazy loading & Suspense

| Boundary | Strategy |
|----------|----------|
| `SceneCanvas` | `next/dynamic`, `ssr: false`, imported after first paint near the trigger. The DOM poster renders immediately as fallback. |
| Per-scene module | Each scene is its own dynamic import; navigating away never keeps unused scene code resident. |
| `<Suspense>` | Drei async resources (any texture/model) sit under `<Suspense fallback={<PosterMesh/>}>`; the DOM poster covers the gap so users never see a blank canvas. |
| Hydration order | Poster `<img>` (RSC/SSG) → hydrate island → idle import canvas → resolve tier → mount scene (if full/lite). Each step is non-blocking. |

### 10.2 Asset optimization

| Asset | Policy |
|-------|--------|
| **Models (GLTF)** | **Avoid.** Prefer procedural geometry. *If* a model is unavoidable: Draco-compress geometry + KTX2/Basis textures, loaded via Drei `useGLTF`/`useKTX2` under Suspense, preloaded only on the route that uses it. |
| **Textures** | Prefer none. If required: KTX2 (GPU-compressed), power-of-two, mipmapped, sized to actual on-screen footprint; dispose on unmount. |
| **Shaders** | Inline GLSL strings or `.glsl` modules; kept short, no dynamic branching in hot fragment paths. |
| **Posters** | AVIF, ≤120KB, responsive crops, `blurDataURL`; generated at build time alongside OG images (see [page-specifications](./page-specifications.md)). |
| **Sprites** | Tiny additive radial PNGs/procedural — a handful, reused across scenes. |

**Default stance:** the entire v1 WebGL surface is achievable **with zero downloaded 3D assets** — particles, lines, and full-screen shader planes only. Draco/KTX2 tooling is documented here for completeness but is **not expected to ship in v1**.

---

## 11. Memory & Context Cleanup

The persistent canvas means the **context is reused, never destroyed** on navigation — but every *scene* must leave it pristine. Leaks here are the #1 risk of a single long-lived context.

| Resource | Cleanup on scene unmount |
|----------|--------------------------|
| Geometry | `geometry.dispose()` (incl. instanced buffer attributes). |
| Material | `material.dispose()` (and any `material.uniforms` textures). |
| Textures / render targets | `texture.dispose()`, `renderTarget.dispose()`. |
| Event listeners | Remove pointer/scroll/visibility/resize listeners; cancel any rAF/idle callbacks. |
| Drei caches | Call the matching `clear`/`dispose` for cached loaders if a model/texture was used. |
| Store subscriptions | Unsubscribe Zustand selectors used in `useFrame` wiring. |

Practices:

- Centralize disposal in a `useEffect(() => () => disposeScene(refs), [])` plus R3F's automatic disposal of objects removed from the tree; treat auto-disposal as a backstop, not the plan.
- After scene unmount, optionally call `gl.renderLists.dispose()` and let the GPU memory settle; **do not** dispose the renderer/context itself.
- `PerformanceMonitor` "demote to poster" path must fully dispose the active scene, not merely hide it.
- A dev-only `WebGLRenderer.info` watcher asserts `geometries`/`textures`/`programs` return to baseline after navigating away — a leak tripwire during development.

---

## 12. Feature Concepts (Detailed)

### 12.1 Hero "Signal Field" — `/` (flagship)

- **Concept:** A volumetric field of GPU-instanced points flowing along a **curl-noise vertex shader**, reading like a calm signal/data field — the engineering-meets-creative thesis in one image. The signature azure→teal sweep (`--primary` → `--accent`) colors flow speed/depth.
- **Implementation:** `InstancedMesh` / instanced buffer geometry; position displaced in the vertex shader by 3D curl noise; color from a velocity/depth ramp; additive blending; emissive (no lights, no postprocessing). Pointer adds an attractor/repulsor to the flow; camera does damped pointer parallax.
- **Counts:** full ~30–60k, lite ~12–20k, poster on mobile/low/reduced.
- **LCP guarantee:** the **poster is the LCP**; the field fades in afterward via demand frames.

### 12.2 Technology Graph / Constellation — `/about` and/or `/philosophy`

- **Concept:** A force-laid graph of technologies/disciplines as glowing nodes connected by edges — "how the system thinks." Hovering a node brightens its neighborhood; a DOM list mirrors the data for keyboard/SR users.
- **Implementation:** Points (nodes) + line segments (edges); positions precomputed (static layout JSON) or a light spring relaxation on mount; node hover via raycast on the small point set; perspective or orthographic. Emissive node colors from `chart-1…6`.
- **Budget:** mid-cost; ship on **one** route only.

### 12.3 Particle Constellation (ambient depth)

- **Concept:** A sparse, slow star/particle constellation used as **subtle background depth** behind certain sections (About aurora pairing, optional Philosophy). Distinct from the dense hero field — quiet, not the star of the page.
- **Implementation:** Low-count points, slow time-driven drift, parallax-linked to scroll; demand frames; pauses off-screen.

### 12.4 Subtle Background Depth — `/about`, optional `/philosophy`

- **Concept:** A **full-screen shader plane** rendering a slow aurora/gradient-mesh in brand hues — depth without geometry. The cheapest WebGL surface we ship; a single quad + fragment shader.
- **Implementation:** Fullscreen triangle/quad; fragment shader blends `uColorA`/`uColorB` with flowing noise; time + scroll uniforms; theme-aware colors. No lights, no raycast.

### 12.5 Interactive Lighting — optional, `/gallery`

- **Concept:** A pointer-reactive light/glow that follows the cursor across a hovered tile for a tactile, lit-surface feel.
- **Implementation:** A single light (or a shader spotlight uniform) tracking damped pointer position over the active tile's plane; demand frames; **deferred** — CSS transform/`box-shadow` is the v1 default, WebGL is a fast-follow only if within the gallery's budget.

### 12.6 Project Showcase Depth Layer — `/projects`, `/projects/[slug]`

- **Concept:** On hover/focus, a project's **cover image** gains a shader-driven depth/parallax + a faint chromatic shimmer, making the card feel like a window rather than a flat tile.
- **Implementation:** The hovered card's cover is sampled into a `ShaderMaterial` (texture + displacement/parallax from pointer + subtle aberration); only **one** card's material is active at a time; idle cards are plain optimized `<Image>`. Detail page scopes the effect to the hero cover region.

### 12.7 GitHub Contribution Depth / Constellation — optional, `/github`

- **Concept:** The contribution calendar rendered as a **heightmapped 3D field** (each day a cell whose height/emissive intensity encodes contribution count), or a node-link constellation of repos/languages. The dashboard's "wow," justified by its larger 200KB budget.
- **Implementation:** `InstancedMesh` of cells; height + color from the contribution ramp (`#10131F → … → #8FC2FF`); hover raycast resolves `instanceId` → DOM tooltip (count/date). **2D fallback is mandatory**: a flat SVG/Canvas heatmap is the source of truth and the default on lite/poster tiers, so the page is fully functional with no WebGL.
- **Data:** live GitHub API via server fetch + ISR (revalidate ~3600s) + optional TanStack Query client refresh — the WebGL is a *view* over already-fetched, already-rendered data, never a data dependency.

---

## 13. Implementation Checklist (Phase-2 Handoff)

> Phase 1 is documentation only. This checklist is the contract for when code begins.

- [ ] `three/SceneCanvas` — single `<Canvas>`, `frameloop="demand"`, `dpr={[1,1.75]}`, `alpha`, fixed/z-0/pointer-none, `<r3f.Out/>` as sole child.
- [ ] `three/r3f` — one `tunnel-rat` instance shared app-wide.
- [ ] `resolveTier()` capability resolver (reduced-motion ∪ saveData ∪ no-WebGL ∪ device-tier → poster/lite/full).
- [ ] Every scene: dynamic `ssr:false`, `useMemo` geometry/material, `useFrame` uniform updates, full disposal `useEffect`.
- [ ] `<SceneFrame>` wrapper: `PerformanceMonitor` + `AdaptiveDpr` + IntersectionObserver pause + visibilitychange pause.
- [ ] Posters authored per scene (AVIF ≤120KB, responsive, `blurDataURL`) — verified as the LCP element.
- [ ] CI: chunk-content assertion (no `three` in first-load) + `size-limit` per-route budgets + dev `WebGLRenderer.info` leak tripwire.
- [ ] a11y: canvas `aria-hidden` + `tabindex="-1"`; DOM equivalents for any hover-revealed data; Pause-motion control forces poster.
- [ ] Single rAF wiring confirmed (`gsap.ticker → lenis.raf → ScrollTrigger.update`, store-driven uniforms) per [animation-strategy](./animation-strategy.md).

---

## 14. Cross-References

| Topic | Doc |
|-------|-----|
| Motion division of labor, single rAF, reduced-motion gate | [animation-strategy](./animation-strategy.md) |
| Canonical colors / glow / gradients | [design-tokens](./design-tokens.md) |
| Per-route JS budgets, device matrix, breakpoints | [responsive-strategy](./responsive-strategy.md) |
| Where scenes sit in each page's layout | [page-specifications](./page-specifications.md) · [wireframes](./wireframes.md) |
| Visual language / cinematic dark + 3D intent | [creative-direction](./creative-direction.md) |
| Components that host posters/canvas islands | [component-inventory](./component-inventory.md) |
