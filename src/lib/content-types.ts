// Format of a concept page written as data (see src/concepts/*.ts).
// Inline text supports: $...$ (KaTeX), **bold**, [[concept-id]] or [[concept-id|text]]
// (link to another concept), and [text](https://...) (external link).

export type Block =
  | { p: string } // paragraph
  | { math: string } // display formula (TeX; write it with String.raw)
  | { list: string[] } // bullet list
  | { key: string } // "Idea clave / Key idea" callout
  | { note: string } // neutral callout
  | { table: { head: string[]; rows: string[][]; numeric?: number[] } }; // numeric = right-aligned column indexes

export interface Section {
  id: string; // anchor, unique within the page (ascii, kebab-case)
  title: string;
  blocks: Block[];
}

export interface QuizQuestion {
  prompt: string;
  options: { text: string; correct?: boolean }[]; // exactly one correct
  explain: string;
}

export interface LangContent {
  lede: string; // one or two sentences under the title
  sections: Section[]; // first one is always the intuition ("La idea" / "The idea")
  pitfalls: { claim: string; fix: string }[]; // 3–4 common mistakes
  dl: { title: string; text: string }[]; // 2–3 bullets on deep learning (may be empty)
  quiz: QuizQuestion[]; // 3 questions
  further: { book: 'wilks' | 'pml1' | 'pml2'; where: string }[]; // precise sections with a short description
  extra?: { text: string; url: string }[]; // external references (papers), full citation in text
}

export interface ConceptContent {
  es: LangContent;
  en: LangContent;
}
