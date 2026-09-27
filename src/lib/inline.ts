// Renders the small inline markup used in src/concepts/*.ts to HTML (at build time).
import katex from 'katex';
import type { Lang } from '../data/areas';
import { conceptById } from '../data/concepts';
import { conceptUrl, mapUrl } from './paths';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export function tex(expr: string, display = false): string {
  return katex.renderToString(expr, { displayMode: display, throwOnError: true });
}

export function inline(text: string, lang: Lang): string {
  // Split on $...$; odd indexes are math.
  const parts = text.split(/\$([^$]+)\$/g);
  return parts
    .map((part, i) => {
      if (i % 2 === 1) return tex(part);
      let s = esc(part);
      // Spanish: keep "10 000" and "95 %" on one line.
      if (lang === 'es') s = s.replace(/(\d) (?=\d{3}(?!\d))/g, '$1 ').replace(/(\d) %/g, '$1 %');
      s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (_m, id: string, label?: string) => {
        const c = conceptById[id];
        if (!c) throw new Error(`Unknown concept link [[${id}]]`);
        const href = conceptUrl(c, lang) ?? mapUrl(lang, id);
        return `<a href="${href}">${label ?? esc(c.title[lang])}</a>`;
      });
      s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>');
      return s;
    })
    .join('');
}
