# public/ — static assets

Nothing in the code references local files here yet: project covers and gallery
images load from `raw.githubusercontent.com`, the GitHub avatar comes from the
API, OG images are generated at build time (`src/app/opengraph-image.tsx` and
the per-route variants), and the favicon lives in `src/app/` (`favicon.ico`,
`icon.svg`).

Drop real assets into these folders as they become available:

| Folder      | Intended contents                                              |
| ----------- | -------------------------------------------------------------- |
| `images/`   | Headshot/portrait (hi-res + duotone-friendly), local covers    |
| `og/`       | Hand-made OG overrides, if any (auto-generation covers v1)     |
| `icons/`    | Extra icon sizes if a raster app icon is ever needed           |
| `fonts/`    | Self-hosted fonts (currently all via `next/font` — leave empty)|
| `models/`   | 3D assets for the R3F layer                                    |
| `textures/` | Texture maps for the R3F layer                                 |

Still needed from Joshua (content, not code):

- [ ] Headshot/portrait — hi-res, plus a version that works as duotone/dark
- [ ] Final résumé/CV PDF (`/resume.pdf` suggested) + a link decision (About/Contact)
