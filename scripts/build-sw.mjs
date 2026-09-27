// Generates dist/sw.js after `astro build` so the whole site works offline
// once it has been opened (and when installed on the iPad home screen).
import { generateSW } from 'workbox-build';

const BASE = '/estadistica-interactiva/';

const { count, size, warnings } = await generateSW({
  globDirectory: 'dist',
  globPatterns: ['**/*.{html,css,js,svg,png,webmanifest,woff2}'],
  // Font subsets we never use (keep latin, latin-ext and greek).
  globIgnores: ['**/*cyrillic*', '**/*vietnamese*', 'sw.js', 'workbox-*.js'],
  swDest: 'dist/sw.js',
  modifyURLPrefix: { '': BASE },
  directoryIndex: 'index.html',
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
  inlineWorkboxRuntime: true,
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
});

for (const w of warnings) console.warn('[sw]', w);
console.log(`[sw] precached ${count} files, ${(size / 1024).toFixed(0)} KiB`);
