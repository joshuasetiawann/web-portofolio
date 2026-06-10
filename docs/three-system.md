# WebGL / Three.js System

The portfolio ships one WebGL surface — the landing hero's **Signal Field** — but it
is structured as a reusable, performance-safe pipeline so additional scenes can be
added without re-deriving the guards. Three.js and `@react-three/fiber` are **never**
in the first-load bundle; they download only when a capable, motion-allowing client
actually mounts a canvas.

**Stack:** Three.js `0.185`, `@react-three/fiber` `9` (React 19). `@react-three/drei`
was removed in Phase 5 as unused — the scene uses only core R3F + Three primitives.

**Layer overview**

```
HeroScene  (section)                 src/components/sections/hero-scene.tsx
  └─ SceneCanvas  (mount guard)      src/components/three/scene-canvas.tsx
       └─ R3FCanvas  (perf wrapper)  src/three/components/r3f-canvas.tsx   [dynamic, ssr:false]
            └─ SignalField (scene)   src/three/scenes/signal-field.tsx     [dynamic, ssr:false]
  shared constants                   src/three/constants.ts
```

---

## 1. `SceneCanvas` — the mount guard

[`src/components/three/scene-canvas.tsx`](../src/components/three/scene-canvas.tsx) is
the single entry point for any WebGL scene. It decides **whether** WebGL runs and
renders a poster otherwise. Responsibilities:

### Lazy + SSR-disabled

```ts
const R3FCanvas = dynamic(
  () => import("@/three/components/r3f-canvas").then((m) => m.R3FCanvas),
  { ssr: false },
);
```

`next/dynamic` with `ssr: false` code-splits the entire WebGL bundle and guarantees
it never executes on the server (Three needs a real DOM/GL context).

### WebGL + reduced-motion guard

The canvas renders only when **both** conditions hold:

```ts
const shouldRenderWebGL = !reducedMotion && webglSupported;
```

- `reducedMotion` comes from `useReducedMotion()` (OS pref **or** the in-app motion
  toggle — see `docs/animation-system.md` §7).
- `webglSupported` is set after mount by `detectWebGL()`, which creates a throwaway
  `<canvas>` and probes `webgl2` → `webgl` → `experimental-webgl` inside a
  `try/catch`. The test context is discarded immediately and never leaks.

When `shouldRenderWebGL` is false, the component renders the **`poster`** node inside
an `aria-hidden` layer instead. Because `webglSupported` starts `false` and is only
flipped on the client, SSR/first paint always shows the poster, then upgrades.

### Offscreen pause

An `IntersectionObserver` (`rootMargin: "120px"`) tracks the container's
`visible` state and passes it down as the frameloop mode:

```ts
<R3FCanvas frameloop={visible ? "always" : "never"}>{children}</R3FCanvas>
```

When the hero scrolls out of view the render loop is set to `"never"` — zero GPU/CPU
work — and resumes (`"always"`) when it returns, conserving battery.

### Props

| Prop | Purpose |
| --- | --- |
| `children` | The scene to render (e.g. `<SignalField />`) |
| `className` | Container classes (the container is `relative h-full w-full overflow-hidden`) |
| `poster` | Static fallback shown when WebGL is unavailable or motion is reduced |

---

## 2. `R3FCanvas` — the performance wrapper

[`src/three/components/r3f-canvas.tsx`](../src/three/components/r3f-canvas.tsx) is a
thin wrapper over R3F's `<Canvas>` that applies the shared performance-safe defaults
from [`src/three/constants.ts`](../src/three/constants.ts). It renders no scene of its
own — feature scenes are passed as children.

```tsx
<Canvas
  frameloop={FRAMELOOP}                 // "demand" by default (SceneCanvas overrides)
  dpr={[DPR_RANGE[0], DPR_RANGE[1]]}     // [1, 1.75]
  camera={{ ...DEFAULT_CAMERA, ...camera }}
  gl={{ ...GL_DEFAULTS, ...gl }}
  aria-hidden tabIndex={-1}             // decorative: out of a11y tree + tab order
/>
```

### Shared constants (`src/three/constants.ts`)

| Constant | Value | Why |
| --- | --- | --- |
| `DPR_RANGE` | `[1, 1.75]` | Clamp device-pixel-ratio: never blurrier than 1×, never burn GPU above ~1.75× on retina/4K |
| `FRAMELOOP` | `"demand"` | Render on-demand by default to save battery; `SceneCanvas` swaps to `always`/`never` by visibility |
| `DEFAULT_CAMERA` | `pos [0,0,6]`, `fov 45`, `near 0.1`, `far 100` | Shared perspective camera |
| `GL_DEFAULTS` | `antialias`, `alpha`, `powerPreference:"high-performance"`, `stencil:false`, `depth:true` | Crisp transparent output; drop the unused stencil buffer |
| `QUALITY_TIERS` / `QUALITY_TIER_ORDER` | `low \| medium \| high` | Discrete tiers for scaling scene complexity by device capability |

Any per-scene `camera` / `gl` props are merged over these defaults, so a scene can
override individual fields without losing the safe baseline.

---

## 3. `SignalField` — the hero scene

[`src/three/scenes/signal-field.tsx`](../src/three/scenes/signal-field.tsx) is a
GPU-light point cloud: an additive azure→teal cloud that slowly drifts and parallaxes
toward the pointer.

**Design choices that keep it cheap and fallback-safe:**

- **`PointsMaterial`, no custom shaders, no lights, no textures.** Just additive,
  vertex-colored points — trivial to render and to fall back from.
- **Deterministic seeded PRNG** (`rand(seed)` via `sin` hash). Positions/colors are
  built in a `useMemo` keyed on `count` — pure, so there's no render-time impurity
  and the layout is stable across renders.
- **Geometry:** points distributed through a flattened spherical shell (`radius
  2 + cbrt(r)*2.6`, y-axis scaled `0.72`). Color is `azure(#5e8bff)` lerped to
  `teal(#38e8c8)` per point. Material: `size 0.03`, `sizeAttenuation`, `transparent`,
  `vertexColors`, `depthWrite={false}`, `opacity 0.85`, `AdditiveBlending`.
- **Animation** runs in `useFrame` and is **transform-only on the GPU**: continuous
  slow `rotation.y` drift plus eased (`MathUtils.lerp`) `rotation.x` / `position.x`
  parallax toward `state.pointer`. No per-frame allocation.

### Adaptive point count

`SignalField` takes a `count` prop (default `3800`).
[`HeroScene`](../src/components/sections/hero-scene.tsx) scales it down on small
screens via `useMediaQuery("(max-width: 640px)")`:

```tsx
<SignalField count={isSmall ? 1600 : 3800} />
```

---

## 4. `HeroScene` — how it's wired together

[`src/components/sections/hero-scene.tsx`](../src/components/sections/hero-scene.tsx)
composes the layers and supplies the fallback. It is **decorative** (`aria-hidden`) —
the hero's actual copy lives in the DOM and is never gated behind WebGL.

```tsx
const SignalField = dynamic(
  () => import("@/three/scenes/signal-field").then((m) => m.SignalField),
  { ssr: false },
);

<SceneCanvas
  poster={/* two radial-gradient layers in primary + accent-2 */}>
  <SignalField count={isSmall ? 1600 : 3800} />
</SceneCanvas>
```

The scene itself is **also** dynamically imported (`ssr: false`) so `three` /
`@react-three/fiber` stay out of the landing first-load bundle — they download only
when the canvas truly mounts.

**The poster** is a pure-CSS gradient (two `radial-gradient` layers using
`--color-primary` and `--color-accent-2` via `color-mix`). It is the graceful
fallback shown whenever WebGL is unavailable or motion is reduced, and it's what
SSR/first paint renders before the client upgrade.

---

## 5. Performance & accessibility safeguards (summary)

| Safeguard | Mechanism | Layer |
| --- | --- | --- |
| Off critical path | `next/dynamic` `ssr:false` on both `R3FCanvas` and the scene | `SceneCanvas`, `HeroScene` |
| No server execution | `ssr: false` | `SceneCanvas` |
| Capability gate | `detectWebGL()` probe → poster on failure | `SceneCanvas` |
| Reduced-motion gate | `useReducedMotion()` (OS + in-app toggle) → poster | `SceneCanvas` |
| Offscreen pause | `IntersectionObserver` → `frameloop` `always`/`never` | `SceneCanvas` |
| DPR clamp | `dpr={[1, 1.75]}` | `R3FCanvas` |
| Adaptive load | `count` scaled by viewport (`3800` → `1600`) | `HeroScene` |
| GPU-light scene | `PointsMaterial`, no shaders/lights/textures, no per-frame alloc | `SignalField` |
| A11y | `aria-hidden` + `tabIndex={-1}`; copy lives in DOM | `R3FCanvas`, `HeroScene` |

---

## 6. Adding a new scene

1. **Create the scene** in `src/three/scenes/<name>.tsx` as a client component that
   returns R3F primitives. Keep it GPU-light: prefer `Points`/instancing over
   per-object meshes, memoize geometry/attributes, and do transform-only work in
   `useFrame` with no per-frame allocation. Accept a `count`/quality-style prop so
   callers can scale it down.
2. **Dynamically import it** with `{ ssr: false }` wherever it's used, so Three stays
   out of that route's first-load bundle.
3. **Wrap it in `SceneCanvas`**, passing a static `poster` (CSS gradient, image, or
   any DOM node) for the WebGL-off / reduced-motion path. You get the capability
   gate, reduced-motion gate, and offscreen pause for free.
4. **Lean on the shared defaults** in `R3FCanvas` (DPR clamp, camera, GL options).
   Override only the specific `camera` / `gl` fields you need — they merge over the
   safe baseline. Use `QUALITY_TIERS` if you want to branch complexity by device.
5. **Keep it decorative.** Never put information only in the canvas; mirror anything
   meaningful in the DOM, since the scene is `aria-hidden` and may never mount.
