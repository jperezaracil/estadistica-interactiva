import type { Lang } from '../data/areas';
import type { Concept } from '../data/concepts';

const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');

/** Absolute URL path inside the site, e.g. url('es/') -> /estadistica-interactiva/es/ */
export function url(path = ''): string {
  return BASE + path.replace(/^\//, '');
}

export function mapUrl(lang: Lang, conceptId?: string): string {
  return url(`${lang}/`) + (conceptId ? `#${conceptId}` : '');
}

export function conceptUrl(c: Concept, lang: Lang): string | undefined {
  if (!c.slug) return undefined;
  return url(lang === 'es' ? `es/conceptos/${c.slug.es}/` : `en/concepts/${c.slug.en}/`);
}

/** Locale-aware number formatting (decimal comma in Spanish). */
export function fmt(x: number, digits: number, lang: Lang): string {
  const s = x.toFixed(digits);
  return lang === 'es' ? s.replace('.', ',') : s;
}
