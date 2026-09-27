# Estadística interactiva — project guide

Bilingual (ES/EN) interactive map of probability and statistics, with bridges to deep learning.
Audience: Jorge (review) and his Deep Learning students in the MUIA master's at Universidad de Alcalá.
Primary device: **iPad** (Safari, installed to the home screen). Hosted on GitHub Pages.

## Stack

- **Astro 7**, static output, no framework islands. Site: `https://jperezaracil.github.io/estadistica-interactiva/` (`base: '/estadistica-interactiva'`, `trailingSlash: 'always'`).
- **No Markdown/MDX pipeline.** Math is rendered at build time with KaTeX: `src/components/Tex.astro` in hand-written pages, `src/lib/inline.ts` for data-driven pages.
- **Offline / PWA:** `public/manifest.webmanifest` + `scripts/build-sw.mjs` (Workbox `generateSW` runs after `astro build`, precaching the whole site).
- Fonts: Source Serif 4 (prose, headings) and Inter (UI), self-hosted via Fontsource.
- Deploy: `.github/workflows/deploy.yml` (official `withastro/action`). Repo setting required once: *Settings → Pages → Source: GitHub Actions*.

Commands: `npm run dev` · `npm run build` (includes the service worker) · `npm run preview` · `npm run icons` (re-render PNG icons from the SVG generator) · `node scripts/check-content.mjs [id ...]` (validate concept data files; run it before every build).

## Structure

- `src/data/areas.ts` — the 8 areas (fixed order; `slot` = categorical color `--area-N`).
- `src/data/concepts.ts` — every concept on the map: bilingual title/short text, prerequisites, `dl` flag, book refs (coarse, shown in the map panel and the page rail). Slugs are generated from the titles unless a `slug: { es, en }` is given; changing a title changes its URL.
- `src/data/books.ts` — Wilks (2019), Murphy PML1 (2022), PML2 (2023). Refs are section numbers (`§5.1`) or chapters.
- `src/i18n/ui.ts` — UI strings for both languages.
- `src/components/MapPage.astro` — the map (islands grid, prerequisite arrows drawn on selection, side panel / bottom sheet, DL route, "Interactivo" badge).
- `src/components/ConceptLayout.astro` — shell of every concept page (breadcrumb, header, rail with TOC, prerequisites, dependents, refs).
- `src/lib/available.ts` — which concepts have a page: a data file in `src/concepts/` or an id in `richIds` (hand-written pages). `isInteractive` = in `richIds`.

Two kinds of concept pages:

1. **Data-driven pages (most concepts).** Content lives in `src/concepts/<id>.ts` (`ConceptContent`, types in `src/lib/content-types.ts`), one object per language. The dynamic routes `src/pages/es/conceptos/[slug].astro` and `src/pages/en/concepts/[slug].astro` render them with `src/components/BasicConcept.astro`. Adding a file is enough for the page to exist and for the map to link it.
2. **Hand-written pages with interactives** (`richIds`: hypothesis-testing, confidence-intervals, errors-power): `src/pages/es/conceptos/<slug>.astro` and `src/pages/en/concepts/<slug>.astro`, using `Tex`, `Callout`, `Quiz` and widgets (`PValueExplorer`, `CICoverage`, `PowerExplorer`, `FDRCalculator`). To turn a data page into one of these, write both `.astro` pages, add the id to `richIds` and delete its data file (the build fails if both exist).

### Inline markup in `src/concepts/*.ts`

`$...$` KaTeX · `**bold**` · `[[concept-id]]` (renders the concept's title, capitalized) or `[[concept-id|label]]` (use this mid-sentence) · `[text](https://...)`. Anything containing a backslash must be written as ``String.raw`...` ``. Blocks: `p`, `math` (display), `list`, `key` (key-idea callout), `note`, `table` (`numeric` = right-aligned columns). `extra` entries are already links: no links inside their text.

## Concept page template (keep it consistent)

1. **La idea / The idea** — intuition with a concrete, original example, plus a "Idea clave / Key idea" callout.
2. Definitions and formulas; core section(s) with the formal statement; worked numbers (table) when useful.
3. **Pruébalo / Try it** — one touch-first interactive (hand-written pages only, for now).
4. **Errores frecuentes / Common mistakes** — claim → fix (at least 3).
5. **En aprendizaje profundo / In deep learning** — where it shows up when training or evaluating networks.
6. **Autoevaluación / Self-check** — exactly 3 questions, one correct option each, with explanations. Data pages shuffle the options at build time (seeded by id, same order in both languages), so write them in any order.
7. **Para profundizar / Further reading** — book sections (precise §, checked against the PDFs), plus key papers with DOI links in `extra`.

## Rules

- **Accuracy:** every number shown (p-values, intervals, probabilities) must be computed, not recalled. Check with a script (Python/scipy) before writing it. State the variant when a result depends on it (e.g. McNemar with or without continuity correction) and the conditions of theorems (CLT, MLE asymptotics).
- **Copyright:** the book PDFs are reference material only and are never committed. Write original explanations, examples and exercises; never copy text, figures or exercises from the books. Cite them by section.
- **Bilingual:** every page and UI string exists in ES and EN, with the same structure and the same numbers (the checker compares both; write numbers as digits in both languages, e.g. "8-sided die"). Spanish uses decimal comma (`0,05`, KaTeX `0{,}05`), a space for thousands (`10 000`; `inline.ts` makes it non-breaking) and semicolons between parameters that contain decimals (`\text{Bin}(10;\ 0{,}9)`); English uses a point and `10,000`.
- **Spanish terms:** moneda/dado *equilibrado* (not "justo"); *la* AUC; *autorregresivo*; keep common English ML terms (softmax, dropout, weight decay) when they are the usual ones.
- **iPad:** tap targets ≥ 44 px; nothing depends on hover (hover may add, tap must work); layouts must work at 820×1180 and 1180×820 (and 1024×1366); no horizontal page scroll, and display formulas must fit the text column (split long ones with `aligned`/`gathered`). Test both themes.
- **Astro 7 gotcha:** string attributes process backslash escapes (`"\text"` becomes a tab). Always pass TeX as `expr={String.raw`...`}`.
- `compressHTML: true` is set on purpose (Astro 7 defaults to JSX whitespace rules).
- Colors: use the CSS tokens in `src/styles/global.css` (light + dark). Area colors only as identity markers; charts use `--chart-emph` / `--chart-rest`.
