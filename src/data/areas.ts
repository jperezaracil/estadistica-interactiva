export type Lang = 'es' | 'en';

export interface Area {
  id: string;
  es: string;
  en: string;
  /** Categorical color slot (1–8), fixed order; see --area-N in global.css. */
  slot: number;
}

export const areas: Area[] = [
  { id: 'prob', es: 'Probabilidad', en: 'Probability', slot: 1 },
  { id: 'dist', es: 'Distribuciones', en: 'Distributions', slot: 2 },
  { id: 'desc', es: 'Estadística descriptiva', en: 'Descriptive statistics', slot: 3 },
  { id: 'est', es: 'Estimación', en: 'Estimation', slot: 4 },
  { id: 'freq', es: 'Inferencia frecuentista', en: 'Frequentist inference', slot: 5 },
  { id: 'bayes', es: 'Inferencia bayesiana', en: 'Bayesian inference', slot: 6 },
  { id: 'info', es: 'Teoría de la información', en: 'Information theory', slot: 7 },
  { id: 'models', es: 'Modelos y evaluación', en: 'Models and evaluation', slot: 8 },
];

export const areaById = Object.fromEntries(areas.map((a) => [a.id, a])) as Record<string, Area>;
