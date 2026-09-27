// Validates concept data files in src/concepts/: structure, es/en parity, KaTeX, links.
// Usage: node scripts/check-content.mjs [id ...]      (no ids = all files)
import katex from 'katex';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'src/concepts');
const { concepts } = await import(pathToFileURL(path.join(root, 'src/data/concepts.ts')).href);
const ids = new Set(concepts.map((c) => c.id));
const RESERVED = ['errores', 'pitfalls', 'deep-learning', 'repaso', 'review', 'profundizar', 'further'];

const args = process.argv.slice(2);
const files = readdirSync(dir)
  .filter((f) => f.endsWith('.ts'))
  .filter((f) => !args.length || args.includes(f.replace(/\.ts$/, '')));

let errors = 0, warnings = 0;
const err = (id, m) => { errors++; console.log(`✗ ${id}: ${m}`); };
const warn = (id, m) => { warnings++; console.log(`! ${id}: ${m}`); };

function katexOk(id, where, expr, display) {
  try { katex.renderToString(expr, { displayMode: display, throwOnError: true }); }
  catch (e) { err(id, `${where}: KaTeX ${String(e.message).split('\n')[0]}`); }
}

function text(id, lang, where, s) {
  const w = `${lang} ${where}`;
  if (typeof s !== 'string' || !s.trim()) return err(id, `${w}: empty or not a string`);
  if (/[\t\n\r\f\v\b]/.test(s)) err(id, `${w}: control character found — a backslash was eaten (use String.raw\`...\`)`);
  if ((s.match(/\$/g) || []).length % 2) err(id, `${w}: unbalanced $`);
  s.split(/\$([^$]+)\$/g).forEach((part, i) => {
    if (i % 2) return katexOk(id, w, part, false);
    for (const m of part.matchAll(/\[\[([a-z0-9-]+)(?:\|[^\]]+)?\]\]/g)) if (!ids.has(m[1])) err(id, `${w}: unknown link [[${m[1]}]]`);
    if (/\bTODO\b|\bXXX\b|lorem ipsum/.test(part)) err(id, `${w}: placeholder text`);
    part = part.replace(/§[\d.,–-]+/g, '§');
    if (lang === 'es' && /\d\.\d/.test(part)) warn(id, `${w}: decimal point in Spanish text: "${part.match(/\S*\d\.\d\S*/)[0]}"`);
    if (lang === 'en' && /\d,\d(?!\d\d)/.test(part)) warn(id, `${w}: decimal comma in English text: "${part.match(/\S*\d,\d\S*/)[0]}"`);
  });
}

for (const f of files) {
  const id = f.replace(/\.ts$/, '');
  if (!ids.has(id)) { err(id, 'file name does not match any concept id in src/data/concepts.ts'); continue; }
  let c;
  try { c = (await import(pathToFileURL(path.join(dir, f)).href)).default; }
  catch (e) { err(id, `cannot import: ${e.message}`); continue; }
  for (const lang of ['es', 'en']) {
    const L = c?.[lang];
    if (!L) { err(id, `missing "${lang}"`); continue; }
    text(id, lang, 'lede', L.lede);
    if (!Array.isArray(L.sections) || L.sections.length < 2) err(id, `${lang}: needs at least 2 sections`);
    const seen = new Set();
    (L.sections || []).forEach((s, i) => {
      if (!/^[a-z0-9-]+$/.test(s.id || '')) err(id, `${lang} section ${i}: bad id "${s.id}"`);
      if (seen.has(s.id)) err(id, `${lang}: duplicate section id "${s.id}"`);
      if (RESERVED.includes(s.id)) err(id, `${lang}: section id "${s.id}" is reserved`);
      seen.add(s.id);
      text(id, lang, `section "${s.id}" title`, s.title);
      if (!Array.isArray(s.blocks) || !s.blocks.length) err(id, `${lang} section "${s.id}": no blocks`);
      (s.blocks || []).forEach((b, j) => {
        const w = `section "${s.id}" block ${j}`;
        if ('p' in b) text(id, lang, w, b.p);
        else if ('math' in b) {
          if (/[\t\n\r\f\v\b]/.test(b.math)) err(id, `${lang} ${w}: control character in formula (use String.raw)`);
          katexOk(id, `${lang} ${w}`, b.math, true);
        } else if ('list' in b) b.list.forEach((x, k) => text(id, lang, `${w} item ${k}`, x));
        else if ('key' in b) text(id, lang, w, b.key);
        else if ('note' in b) text(id, lang, w, b.note);
        else if ('table' in b) {
          b.table.head.forEach((x) => text(id, lang, `${w} head`, x));
          b.table.rows.forEach((r, k) => {
            if (r.length !== b.table.head.length) err(id, `${lang} ${w}: row ${k} has ${r.length} cells`);
            r.forEach((x) => text(id, lang, `${w} row ${k}`, x));
          });
        } else err(id, `${lang} ${w}: unknown block ${JSON.stringify(Object.keys(b))}`);
      });
    });
    if (!Array.isArray(L.pitfalls) || L.pitfalls.length < 3) err(id, `${lang}: needs at least 3 pitfalls`);
    (L.pitfalls || []).forEach((x, k) => { text(id, lang, `pitfall ${k} claim`, x.claim); text(id, lang, `pitfall ${k} fix`, x.fix); });
    if (!Array.isArray(L.dl)) err(id, `${lang}: "dl" must be an array`);
    (L.dl || []).forEach((x, k) => { text(id, lang, `dl ${k} title`, x.title); text(id, lang, `dl ${k} text`, x.text); });
    if (!Array.isArray(L.quiz) || L.quiz.length !== 3) err(id, `${lang}: needs exactly 3 quiz questions`);
    (L.quiz || []).forEach((q, k) => {
      text(id, lang, `quiz ${k} prompt`, q.prompt);
      text(id, lang, `quiz ${k} explain`, q.explain);
      if (!Array.isArray(q.options) || q.options.length < 3) err(id, `${lang} quiz ${k}: needs at least 3 options`);
      const n = (q.options || []).filter((o) => o.correct).length;
      if (n !== 1) err(id, `${lang} quiz ${k}: ${n} correct options (must be 1)`);
      (q.options || []).forEach((o, m) => text(id, lang, `quiz ${k} option ${m}`, o.text));
    });
    if (!Array.isArray(L.further) || !L.further.length) err(id, `${lang}: needs at least one "further" reference`);
    (L.further || []).forEach((x, k) => {
      if (!['wilks', 'pml1', 'pml2'].includes(x.book)) err(id, `${lang} further ${k}: unknown book "${x.book}"`);
      text(id, lang, `further ${k}`, x.where);
    });
    (L.extra || []).forEach((x, k) => {
      if (!/^https?:\/\//.test(x.url || '')) err(id, `${lang} extra ${k}: bad url`);
      text(id, lang, `extra ${k}`, x.text);
      if (/\[\[|\]\(/.test(x.text || '')) err(id, `${lang} extra ${k}: no links inside the text (it is already a link)`);
    });
  }
  if (c?.es && c?.en) {
    for (const k of ['sections', 'pitfalls', 'dl', 'quiz', 'further']) {
      if ((c.es[k] || []).length !== (c.en[k] || []).length) err(id, `es/en have a different number of ${k}`);
    }
    (c.es.sections || []).forEach((s, i) => {
      const t = c.en.sections?.[i];
      if (t && s.blocks?.length !== t.blocks?.length) warn(id, `section ${i}: es/en have a different number of blocks`);
    });
    (c.es.quiz || []).forEach((q, i) => {
      const t = c.en.quiz?.[i];
      if (t && q.options.findIndex((o) => o.correct) !== t.options.findIndex((o) => o.correct)) err(id, `quiz ${i}: correct option differs between es and en`);
    });
    numberParity(id, c.es, c.en, '');
  }
}

// The same numbers must appear in each es/en pair of strings (10 000 ≡ 10,000; 0,5 ≡ 0.5).
function numbers(s, lang) {
  let t = s.replace(/\{,\}/g, lang === 'es' ? ',' : '').replace(/\\[,!]/g, '');
  t = lang === 'es'
    ? t.replace(/(\d)[   ](?=\d{3}(?!\d))/g, '$1').replace(/(\d),(\d)/g, '$1.$2')
    : t.replace(/(\d),(?=\d{3}(?!\d))/g, '$1');
  return (t.match(/\d+(?:\.\d+)?/g) || []).map(Number).sort((a, b) => a - b).join(' ');
}
function numberParity(id, a, b, where) {
  if (typeof a === 'string' && typeof b === 'string') {
    if (!where.endsWith('.url') && numbers(a, 'es') !== numbers(b, 'en')) warn(id, `${where}: different numbers in es [${numbers(a, 'es')}] and en [${numbers(b, 'en')}]`);
  } else if (Array.isArray(a) && Array.isArray(b)) a.forEach((x, i) => numberParity(id, x, b[i], `${where}[${i}]`));
  else if (a && b && typeof a === 'object' && typeof b === 'object') for (const k of Object.keys(a)) if (k !== 'id') numberParity(id, a[k], b[k], `${where}.${k}`);
}
console.log(`${files.length} file(s) · ${errors} error(s) · ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
