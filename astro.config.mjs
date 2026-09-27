import { defineConfig } from 'astro/config';

// GitHub Pages (project site): https://jperezaracil.github.io/estadistica-interactiva/
export default defineConfig({
  site: 'https://jperezaracil.github.io',
  base: '/estadistica-interactiva',
  trailingSlash: 'always',
  // Keep HTML whitespace semantics (Astro 7 defaults to JSX-style stripping).
  compressHTML: true,
  build: { format: 'directory' },
});
