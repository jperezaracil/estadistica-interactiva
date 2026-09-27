import type { Lang } from './areas';

export type BookId = 'wilks' | 'pml1' | 'pml2';

export interface Book {
  short: string;
  full: Record<Lang, string>;
  url?: string;
}

export const books: Record<BookId, Book> = {
  wilks: {
    short: 'Wilks',
    full: {
      es: 'Wilks, D. S. (2019). Statistical Methods in the Atmospheric Sciences (4.ª ed.). Elsevier.',
      en: 'Wilks, D. S. (2019). Statistical Methods in the Atmospheric Sciences (4th ed.). Elsevier.',
    },
  },
  pml1: {
    short: 'PML1',
    full: {
      es: 'Murphy, K. P. (2022). Probabilistic Machine Learning: An Introduction. MIT Press.',
      en: 'Murphy, K. P. (2022). Probabilistic Machine Learning: An Introduction. MIT Press.',
    },
    url: 'https://probml.github.io/pml-book/book1.html',
  },
  pml2: {
    short: 'PML2',
    full: {
      es: 'Murphy, K. P. (2023). Probabilistic Machine Learning: Advanced Topics. MIT Press.',
      en: 'Murphy, K. P. (2023). Probabilistic Machine Learning: Advanced Topics. MIT Press.',
    },
    url: 'https://probml.github.io/pml-book/book2.html',
  },
};

/** A pointer into a book: sections ("§5.1") or whole chapters. */
export interface Ref {
  book: BookId;
  sec?: string[];
  ch?: string;
}

export function formatRef(ref: Ref, lang: Lang): string {
  const b = books[ref.book].short;
  if (ref.ch) return `${b}, ${lang === 'es' ? 'cap.' : 'ch.'} ${ref.ch}`;
  return `${b}, ${(ref.sec ?? []).map((s) => '§' + s).join(', ')}`;
}
