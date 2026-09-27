// Which concepts have a page. Basic pages are data files in src/concepts/;
// rich pages (with their own interactive) are explicit .astro files.
const basic = import.meta.glob('../concepts/*.ts');

export const basicIds = new Set(Object.keys(basic).map((p) => p.split('/').pop()!.replace(/\.ts$/, '')));
export const richIds = new Set(['hypothesis-testing', 'confidence-intervals', 'errors-power']);

export const isAvailable = (id: string) => basicIds.has(id) || richIds.has(id);
export const isInteractive = (id: string) => richIds.has(id);
