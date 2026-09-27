# Estadística interactiva — project guide

Bilingual (ES/EN) interactive map of probability and statistics, with bridges to deep learning.
Audience: Jorge (review) and his Deep Learning students in the MUIA master's at Universidad de Alcalá.
Primary device: **iPad** (Safari, installed to the home screen). Hosted on GitHub Pages.

## Stack

- **Astro 7**, static output, no framework islands. Site: `https://jperezaracil.github.io/estadistica-interactiva/` (`base: '/estadistica-interactiva'`, `trailingSlash: 'always'`).
- **No Markdown/MDX pipeline.** Concept pages are `.astro` files. Math is rendered at build time with KaTeX through `src/components/Tex.astro`.
- **Offline / PWA:** `public/manifest.webmanifest` + `scripts/build-sw.mjs` (Workbox `generateSW` runs after `astro build`, precaching the whole site).
- Fonts: Source Serif 4 (prose, headings) and Inter (UI), self-hosted via Fontsource.
- Deploy: `.github/workflows/deploy.yml` (official `withastro/action`). Repo setting required once: *Settings → Pages → Source: GitHub Actions*.

Commands: `npm run dev` · `npm run build` (includes the service worker) · `npm run preview` · `npm run icons` (re-render PNG icons from the SVG generator).

## Structure

- `src/data/areas.ts` — the 8 areas (fixed order; `slot` = categorical color `--area-N`).
- `src/data/concepts.ts` — every concept on the map: bilingual title/short text, prerequisites, `dl` flag, book refs. Add `slug: { es, en }` **only when the page exists**; the map then shows it as available.
- `src/data/books.ts` — Wilks (2019), Murphy PML1 (2022), PML2 (2023). Refs are section numbers (`§5.1`) or chapters.
- `src/i18n/ui.ts` — UI strings for both languages.
- `src/components/MapPage.astro` — the map (islands grid, prerequisite arrows drawn on selection, side panel / bottom sheet, DL route).
- `src/components/ConceptLayout.astro` — shell of every concept page (breadcrumb, header, rail with TOC, prerequisites, dependents, refs).
- `src/components/` — `Tex`, `Callout`, `Quiz`, and interactives (e.g. `PValueExplorer`).
- Pages: `src/pages/es/conceptos/<slug-es>.astro` and `src/pages/en/concepts/<slug-en>.astro` (one file per language, same structure).

## Concept page template (keep it consistent)

1. **La idea / The idea** — intuition with a concrete example, plus a "Idea clave / Key idea" callout.
2. **Ingredientes / Definitions** — `dl.defs` cards and formulas.
3. Core section(s) with the formal statement.
4. **Pruébalo / Try it** — one interactive, touch-first.
5. Worked numbers (table) when useful.
6. **Errores frecuentes / Common mistakes** — `ul.pitfalls` (claim → fix).
7. **En aprendizaje profundo / In deep learning** — where it shows up when training or evaluating networks.
8. **Autoevaluación / Self-check** — `Quiz` with 3 questions and explanations.
9. **Para profundizar / Further reading** — book sections (precise §), plus key papers with DOI links.

## Rules

- **Accuracy:** every number shown (p-values, intervals, probabilities) must be computed, not recalled. Check with a script (Python/scipy) before writing it.
- **Copyright:** the book PDFs are reference material only and are never committed. Write original explanations, examples and exercises; never copy text, figures or exercises from the books. Cite them by section.
- **Bilingual:** every page and UI string exists in ES and EN. Spanish uses decimal comma (`0,05`, KaTeX `0{,}05`); English uses a point.
- **iPad:** tap targets ≥ 44 px; nothing depends on hover (hover may add, tap must work); layouts must work at 820×1180 and 1180×820 (and 1024×1366); no horizontal page scroll. Test both themes.
- **Astro 7 gotcha:** string attributes process backslash escapes (`"\text"` becomes a tab). Always pass TeX as `expr={String.raw`...`}`.
- `compressHTML: true` is set on purpose (Astro 7 defaults to JSX whitespace rules).
- Colors: use the CSS tokens in `src/styles/global.css` (light + dark). Area colors only as identity markers; charts use `--chart-emph` / `--chart-rest`.
