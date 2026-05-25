# Brand Identity

> Purpose: define who the Joshua Setiawan brand is and how it sounds and looks — personality, brand and visual keywords, voice and tone, wordmark direction, Lucide icon style, illustration and imagery style, UI personality, and microcopy style with concrete do/don't examples — so every word and component reads as one intelligent, calm, precise, technical, creative, trustworthy, premium, future-facing voice.

This is the brand's source of truth for *feel and language*. The art direction that renders this brand lives in [creative-direction](./creative-direction.md); the literal design values live in [design-tokens](./design-tokens.md), [color-system](./design-tokens.md), and [typography](./typography-system.md); the longer editorial voice guide is [editorial-voice-tone](./brand-identity.md); icon/imagery specifics are in [iconography-imagery](./brand-identity.md).

---

## 1. Brand in one line

**Joshua Setiawan is a creative developer and software engineer whose engineering depth shows up as interactive craft.** The brand is the calm confidence of someone who can both *build the system* and *make it feel inevitable* — and who would rather show you than tell you.

---

## 2. Brand personality

If the brand were a person in the room: **the quietly brilliant engineer who also has taste.** Precise but not cold. Creative but not chaotic. Confident but never loud. The kind of person whose work makes others trust them quickly.

| Trait | Means | Does NOT mean |
|---|---|---|
| **Intelligent** | Substance, accuracy, considered decisions, shows the *why*. | Jargon for its own sake; talking down. |
| **Calm** | Unhurried, spacious, certain; lets work speak. | Sleepy, passive, or boring. |
| **Precise** | Exact words, exact pixels, exact numbers. | Pedantic, rigid, or fussy. |
| **Technical** | Credible engineering signal — live data, metrics, real code. | Cold, robotic, or impenetrable. |
| **Creative** | Motion, 3D, editorial design with intent. | Decorative, gimmicky, or random. |
| **Trustworthy** | Honest claims, verifiable proof, no dark patterns. | Salesy, hype-y, or vague. |
| **Premium** | Polished, restrained, every detail finished. | Flashy, maximalist, or expensive-looking-for-its-own-sake. |
| **Future-facing** | Modern stack, forward aesthetic, current. | Trend-chasing or sci-fi cosplay. |

**Brand archetypes:** primarily **The Creator** (craft, vision, making) with a strong **The Sage** undercurrent (knowledge, clarity, truth). Never the Jester, never the Hero-who-boasts.

---

## 3. Brand keywords

The eight locked attributes, in priority order, are the words every decision is checked against:

**Intelligent · Calm · Precise · Technical · Creative · Trustworthy · Premium · Future-facing.**

If a design, animation, or sentence does not advance at least one of these — and contradicts none — it is wrong.

---

## 4. Visual keywords

The translation of personality into things you can see (the full rendering is in [creative-direction](./creative-direction.md)):

- **Immersive dark** — near-black `--background #05070D` stage; light comes to the eye.
- **Cinematic depth** — layered surfaces, parallax, one persistent 3D field; not flat, not busy.
- **Azure→teal signal** — the single `--gradient-accent` (#5E8BFF→#38E8C8) used as light, never paint.
- **Editorial type** — Space Grotesk display as composition; generous whitespace; sharp hierarchy.
- **Engineered surfaces** — hairline borders, glass at 12px blur, glow as spotlight, instrument-readout numerals.
- **Restrained motion** — physical, authored, purposeful; calm by default.
- **Honest craft** — real screenshots, real metrics, real code, real photograph.

Anti-keywords (the brand is the opposite of these): cluttered, neon, glossy, corporate-stock, trend-salad, loud, gimmicky, generic-AI-gradient.

---

## 5. Voice and tone

### 5.1 Voice (constant)

The voice is **plainspoken expert.** Clear, confident, warm-but-economical. It respects the reader's intelligence and their time. It explains complex things simply because it understands them deeply. It never hypes, never hedges, never pads.

Principles:

- **Clarity over cleverness.** A clever line that obscures the point loses to a plain line that lands.
- **Show, then claim.** Lead with the artifact or number; let the claim follow, earned.
- **First person, singular, human.** "I build…", not "We leverage…". One real person.
- **Specific beats grand.** "Cut LCP from 4.1s to 1.9s" beats "blazing-fast performance".
- **Confidence without arrogance.** State facts calmly; let restraint read as certainty.

### 5.2 Tone (flexes by context)

| Context | Tone dial | Example feeling |
|---|---|---|
| **Hero / Landing** | Confident, spare, a little cinematic. | "Here's who I am — in one breath." |
| **About / Philosophy** | Warm, reflective, first-person. | "Here's how I think and why." |
| **Projects / Research** | Precise, evidence-led, technical. | "Here's what I built and what it did." |
| **GitHub / Open Source** | Factual, instrument-readout. | "Here's the proof, live." |
| **Contact** | Direct, generous, reassuring. | "Here's how to reach me; it's easy." |
| **Errors / 404 / empty** | Calm, helpful, lightly human. | "Something's off — here's the way back." |
| **Microcopy / toasts** | Brief, kind, exact. | "Sent. I'll reply soon." |

The voice never changes; only the *amount of warmth and the density of technical detail* moves along these dials.

---

## 6. Wordmark direction

The logo is **a wordmark, not a symbol** — the name *is* the mark, fitting an editorial-engineering brand built on one person's credibility.

| Aspect | Direction |
|---|---|
| **Primary lockup** | "Joshua Setiawan" set in **Space Grotesk**, tight tracking (≈−0.02em), foreground `#EAEDF5` on dark / `#11141C` on light. Confident, even, no flourish. |
| **Monogram** | "JS" — collapses from the full wordmark **on scroll** (header). Same type, same weight; the two letterforms are spaced and balanced as a unit. |
| **Behavior** | Wordmark in the resting header; smooth collapse to "JS" monogram once scrolled (Framer layout transition). Never both at once. |
| **Accent use** | The wordmark stays monochrome by default; the azure→teal accent may appear as a **single hairline underline or a dot/period mark**, never as gradient-filled letters. |
| **Clear space** | Minimum clear space = the cap-height of "J" on all sides; never crowd it. |
| **Don't** | Don't add a tagline lockup in the header; don't skew, outline, or 3D-extrude it; don't recolor the letterforms with the gradient; don't use a generic `</>` or initials-in-a-circle avatar mark. |

Rationale: a person-brand wins by owning their name (see the SEO goal in [product-strategy](./product-strategy.md)). The wordmark *is* the brand asset.

---

## 7. Icon style (Lucide)

Icons are **Lucide**, used as a quiet wayfinding and labeling layer — never as decoration.

| Rule | Spec |
|---|---|
| **Library** | Lucide only, for visual consistency (single stroke language). |
| **Stroke** | Default ~1.5–2px stroke; consistent across the app; thin and precise to match hairline borders. |
| **Sizing** | Align to the 4px scale (16 / 20 / 24); paired with text at matching cap height. |
| **Color** | Inherit `currentColor` — typically `--foreground-muted #A4ABBD`, brightening to `--foreground` or `--accent` on active/hover. |
| **Meaning** | Functional only: navigation, status, links (live/repo/case-study), social, command-palette affordances. |
| **Pairing** | Icon + text label by default; **icon-only** allowed only with an accessible name (`aria-label`) and a tooltip. |
| **Don't** | Don't mix icon sets; don't use filled/duotone novelty icons; don't size-mismatch within a row; don't rely on an icon alone to convey state (never color/shape alone — pair with text). |

See [iconography-imagery](./brand-identity.md) for the icon inventory and usage map.

---

## 8. Illustration style

The brand's "illustration" is **generative and systemic, not hand-drawn.** We do not use character mascots, flat-vector blobs, or isometric clip-art.

- **Abstract system visuals** — node-and-edge constellations, particle/field systems, gradient-mesh aurora — share one visual DNA with the hero "Signal Field" (see [creative-direction](./creative-direction.md#37-abstract-system-visuals--diagrams-of-thought)).
- **Palette** — accent azure→teal and the foreground-muted greys on dark; low contrast, behind content.
- **Meaning** — every abstract piece implies *structure, connection, or signal-from-noise* — the work of an engineer — never random ambient art.
- **Diagrams** — where explanation helps (architecture, philosophy), use clean thin-line diagrams: hairline strokes, small nodes, mono labels, accent for the one thing that matters.
- **Accessibility** — decorative system visuals are `aria-hidden` + `tabindex="-1"`; informative diagrams get real alt text / descriptions.

Don't: stock illustration packs, gradient blob backgrounds, emoji-as-illustration, 3D for the sake of 3D.

---

## 9. Imagery style

| Image type | Direction |
|---|---|
| **Portrait / personal** | One strong, real photograph of Joshua — natural, dark-compatible, slightly cinematic grade. Human warmth that balances the technical voice. Authentic over glamour. |
| **Project shots** | Real product UI in a quiet dark mat; consistent aspect ratios; AVIF, ≤120KB LCP-class, `blurDataURL` for zero CLS. Presented like a gallery, not a slideshow. |
| **Gallery** | Curated, captioned, categorized (`src,alt,caption,category,…,blurDataURL`); cohesive grade so a varied set reads as one body of work. |
| **Certificates / proof** | Crisp, legible, honestly presented; trust over polish. |
| **Grade & treatment** | Cohesive cool-leaning grade that sits on the dark palette; subtle, never oversaturated; gradient/glow only as an accent light, never a filter over faces. |
| **Don't** | No corporate stock, no watermarks, no heavy duotone over everything, no forced 16:9 letterboxing, no mockup-glamour hiding weak work. |

Imagery's job: make the technical brand feel **human and real**. A genuine photo and an honest screenshot do more for trust than any effect.

---

## 10. UI personality

The interface itself has a personality — it should feel like **a precise, calm instrument that rewards attention.**

- **Composed, not busy.** Generous space, one focal point per view, hairline structure, glass surfaces.
- **Responsive and physical.** Magnetic affordances (≤18px), soft hover lifts, spotlight focus, instant honest feedback (`sonner` toasts) — interactions feel *built*, not bolted on.
- **Powerful but unintimidating.** A `cmdk` Cmd+K palette and an Explore mega-menu signal depth for power users while primary nav (Projects · About · Blog · Contact + theme + palette) stays effortless.
- **Quietly technical.** Mono labels, tabular numerals, monospaced hashes and timestamps, live data — the chrome itself signals engineering.
- **Trustworthy by construction.** No dark patterns, no fake urgency, no cookie-wall friction (cookieless analytics), accessible by default, fast by default.
- **Consistent.** shadcn/ui primitives + `cva` variants + one motion vocabulary mean the same control behaves the same everywhere.

The UI should make a recruiter or founder think, within seconds: *"this person sweats the details — I trust their work."*

---

## 11. Microcopy style

Microcopy is where the brand is felt most often. Rules: **brief, exact, kind, human, never hype.** Sentence case. No exclamation-point spam. Specific over grand. Active over passive. Respect the reader's time.

### 11.1 Principles with do / don't

| Principle | Do | Don't |
|---|---|---|
| **Lead with the artifact** | "Cut p75 LCP from 4.1s to 1.9s." | "Blazing-fast, next-gen performance." |
| **Be plainspoken** | "Some things I've built." | "Curated showcase of my digital craftsmanship." |
| **Be generous on Contact** | "Tell me about it — I usually reply within a couple of days." | "Submit your inquiry and we will be in touch." |
| **Be calm on errors** | "That page moved or never existed. Here's the way back." | "Oops!! 404 — you broke the internet 😅" |
| **Confirm honestly** | "Sent. I'll be in touch soon." | "Success!!! Your message is super important to me!" |
| **Label precisely** | "Live · Repo · Case study" | "Check it out →" everywhere |
| **No hedging** | "I focus on performance and accessibility." | "I try to maybe focus a bit on performance I guess." |

### 11.2 Sample microcopy (canonical strings)

| Surface | Copy |
|---|---|
| **Hero eyebrow** | `CREATIVE DEVELOPER / SOFTWARE ENGINEER` (Geist Mono, uppercase) |
| **Hero sub** | "I build fast, accessible, and quietly ambitious software — and the occasional thing that moves." |
| **Primary CTA** | "See the work" / secondary: "Get in touch" |
| **Projects intro** | "Selected work. Real problems, measured outcomes." |
| **Project links** | "Live" · "Repo" · "Case study" |
| **GitHub dashboard** | "Live from GitHub. Refreshed hourly." |
| **Open source** | "Code I maintain and contribute to, in the open." |
| **Empty state (blog)** | "No posts here yet. The first one is in progress." |
| **Contact heading** | "Let's talk." |
| **Contact helper** | "A short note is plenty. Tell me what you're working on." |
| **Form success** | "Sent. I'll reply soon — usually within a couple of days." |
| **Form error (field)** | "Add a valid email so I can reply." |
| **Form error (summary)** | "Two fields need a quick fix before this sends." |
| **404 heading** | "Lost the thread." |
| **404 body** | "That page moved or never existed. Try the work, the writing, or head home." |
| **Loading / skeleton** | "Loading…" (silent skeletons preferred; words only when needed) |
| **Cmd+K hint** | "Press ⌘K to jump anywhere." |
| **Reduced-motion toggle** | "Pause motion" / "Resume motion" |
| **Cookieless analytics note** | "Privacy-friendly analytics. No cookies, no tracking." |
| **Footer sign-off** | "Built by Joshua Setiawan. Designed and engineered end to end." |

### 11.3 Words we use / words we avoid

- **Use:** build, ship, measured, considered, fast, accessible, in the open, the work, real, honest, precise.
- **Avoid:** synergy, leverage, blazing/lightning, ninja/rockstar/guru, revolutionary, cutting-edge (show it instead), "passionate about", excessive emoji, exclamation spam, ALL-CAPS-SHOUTING (except deliberate mono eyebrows), "click here".

---

## 12. Brand check (the test every artifact passes)

Before anything ships, it must answer **yes** to all:

1. Does it advance at least one brand keyword (intelligent, calm, precise, technical, creative, trustworthy, premium, future-facing) and contradict none?
2. Does it *show* before it *claims*?
3. Is it honest and verifiable (no hype, no dark patterns)?
4. Is it calm — one focal point, restrained, spacious?
5. Is it precise — exact words, exact pixels, exact numbers, no layout shift?
6. Would a smart recruiter or founder trust the person behind it more after seeing it?

If any answer is no, it is off-brand.

---

### Related documents

[creative-direction](./creative-direction.md) · [editorial-voice-tone](./brand-identity.md) · [design-tokens](./design-tokens.md) · [color-system](./design-tokens.md) · [typography](./typography-system.md) · [iconography-imagery](./brand-identity.md) · [interaction-microinteractions](./interaction-plan.md) · [product-strategy](./product-strategy.md) · [target-audience](./target-audience.md)
