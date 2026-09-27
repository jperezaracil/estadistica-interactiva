import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Si haces muchos contrastes, algunos saldrán significativos por azar aunque no haya ningún efecto. Las correcciones controlan la probabilidad de cometer algún falso positivo (FWER) o la proporción esperada de falsos positivos entre los descubrimientos (FDR).',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Buscas en qué subgrupos de usuarios (por país, idioma o dispositivo) rinde peor tu modelo, y haces un contraste en cada uno de 50 subgrupos, con $\alpha = 0{,}05$. Aunque el modelo rindiera igual en todos, esperarías 2,5 subgrupos «significativos», y si los contrastes fueran independientes, la probabilidad de encontrar al menos uno sería $1 - 0{,}95^{50} \approx 0{,}92$. Encontrar alguno no es, por sí solo, evidencia de nada.` },
          { key: String.raw`$\alpha$ controla el error de cada contraste por separado, no el del conjunto. Cuantos más contrastes miras, más exigente tiene que ser el criterio para cada uno.` },
        ],
      },
      {
        id: 'correcciones',
        title: 'Dos formas de controlar el error',
        blocks: [
          { p: String.raw`Con $m$ contrastes, sea $V$ el número de falsos positivos y $R$ el total de hipótesis rechazadas:` },
          { math: String.raw`\text{FWER} = P(V \ge 1), \qquad \text{FDR} = \mathbb{E}\!\left[\frac{V}{\max(R,\ 1)}\right]` },
          {
            list: [
              String.raw`**Bonferroni** (FWER): rechaza si $p_i \le \alpha/m$. Vale con cualquier dependencia entre los contrastes, pero con $m$ grande es muy conservador.`,
              String.raw`**Holm** (FWER): ordena los p-valores de menor a mayor y compara el $i$-ésimo con $\alpha/(m - i + 1)$, parando en el primero que no pasa. Da la misma garantía que Bonferroni y nunca rechaza menos.`,
              String.raw`**Benjamini-Hochberg** (FDR al nivel $q$): ordena los p-valores, busca el mayor $k$ con $p_{(k)} \le \tfrac{k}{m}\,q$ y rechaza las $k$ hipótesis con los p-valores más pequeños. Garantiza la FDR con contrastes independientes o con dependencia positiva.`,
            ],
          },
        ],
      },
      {
        id: 'ejemplo',
        title: 'Un ejemplo con 10 p-valores',
        blocks: [
          { p: String.raw`Diez contrastes dan, ordenados, estos p-valores: 0,001; 0,004; 0,006; 0,012; 0,021; 0,038; 0,09; 0,27; 0,52 y 0,88. Con $\alpha = q = 0{,}05$:` },
          {
            table: {
              head: ['Método', 'Criterio', 'Rechazos'],
              rows: [
                ['Sin corregir', String.raw`$p \le 0{,}05$`, '6'],
                ['Bonferroni', String.raw`$p \le 0{,}005$`, '2'],
                ['Holm', String.raw`$p_{(i)} \le 0{,}05/(11 - i)$`, '3'],
                ['Benjamini-Hochberg', String.raw`$p_{(k)} \le 0{,}005\,k$`, '5'],
              ],
              numeric: [2],
            },
          },
          { p: String.raw`Holm rechaza también 0,006 porque su tercer umbral es $0{,}05/8 = 0{,}00625$. Benjamini-Hochberg llega hasta 0,021, por debajo de $5 \cdot 0{,}005 = 0{,}025$; el siguiente, 0,038, supera su umbral de 0,030, y los posteriores también superan los suyos. Controlar la FDR tolera algún falso descubrimiento a cambio de bastante más [[errors-power|potencia]], y suele ser lo razonable cuando se exploran muchas hipótesis.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Si cada contraste usa α = 0,05, el conjunto también tiene un 5 % de falsos positivos.»', fix: 'El 5 % es por contraste. Con 50 contrastes independientes y todas las hipótesis nulas ciertas, la probabilidad de algún falso positivo es 0,92.' },
      { claim: '«Bonferroni siempre es la opción segura.»', fix: 'Controla la FWER, pero con muchos contrastes es tan exigente que puede perder mucha potencia. Holm da la misma garantía con más potencia, y si puedes tolerar una pequeña fracción de falsos descubrimientos, controla la FDR.' },
      { claim: '«Con la FDR al 5 %, cada descubrimiento tiene un 5 % de probabilidad de ser falso.»', fix: 'Garantiza que la proporción esperada de falsos descubrimientos, en promedio sobre repeticiones del estudio, no supera el 5 %; no es la probabilidad de cada uno. Los descubrimientos con p-valores cercanos al umbral tienen más probabilidad de ser falsos que los que tienen p-valores minúsculos.' },
      { claim: '«Solo cuentan los contrastes que publico.»', fix: 'Cuentan todos los que has mirado: los subgrupos descartados, las métricas que no mostraste y las variantes del análisis que probaste antes de elegir una. Si no se pueden contar, trata los hallazgos como hipótesis que hay que confirmar con datos nuevos.' },
    ],
    dl: [
      { title: 'Búsqueda de hiperparámetros.', text: 'Quedarse con la mejor de muchas configuraciones infla su resultado: el máximo de muchas estimaciones ruidosas tiende a quedar por encima de su valor real. Si 100 configuraciones tuvieran la misma accuracy real y sus estimaciones en validación fueran independientes y normales, con un error estándar de 0,5 puntos, la mejor aparentaría de media 1,25 puntos más. Evalúa la elegida en un test que no hayas usado para elegir.' },
      { title: 'Análisis por subgrupos.', text: 'Al buscar en qué subgrupos falla un modelo, corrige por el número de subgrupos analizados, por ejemplo con Benjamini-Hochberg, o confirma los hallazgos con datos nuevos antes de actuar.' },
      { title: 'Muchas métricas, muchos benchmarks.', text: 'Informar solo de las métricas o de los conjuntos de datos en que tu modelo gana es comparar muchas veces y quedarte con los éxitos. Decide de antemano qué vas a medir y publica todos los resultados.' },
    ],
    quiz: [
      {
        prompt: 'Haces 30 contrastes independientes con α = 0,05 y todas las hipótesis nulas son ciertas. ¿Cuál es la probabilidad de obtener al menos un falso positivo?',
        options: [{ text: '0,05' }, { text: '0,785', correct: true }, { text: '1,5' }],
        explain: String.raw`$1 - 0{,}95^{30} \approx 0{,}785$. El valor 1,5 es el número esperado de falsos positivos, $30 \cdot 0{,}05$, no una probabilidad.`,
      },
      {
        prompt: 'Con Bonferroni, 10 contrastes y α = 0,05 para el conjunto, ¿qué umbral usa cada contraste?',
        options: [{ text: '0,05' }, { text: '0,005', correct: true }, { text: '0,5' }],
        explain: String.raw`Bonferroni divide $\alpha$ entre el número de contrastes: $0{,}05/10 = 0{,}005$. Así, la probabilidad de algún falso positivo no supera 0,05, sea cual sea la dependencia entre los contrastes.`,
      },
      {
        prompt: 'Ordenas 8 p-valores y el tercero más pequeño es 0,017. Con Benjamini-Hochberg y q = 0,05, ¿qué puedes asegurar?',
        options: [
          { text: String.raw`Que se rechazan al menos las tres primeras hipótesis, porque $0{,}017 \le \tfrac{3}{8} \cdot 0{,}05 = 0{,}01875$.`, correct: true },
          { text: String.raw`Que la tercera no se rechaza, porque $0{,}017 > 0{,}05/8$.` },
          { text: 'Nada: Benjamini-Hochberg no usa el orden de los p-valores.' },
        ],
        explain: String.raw`Benjamini-Hochberg rechaza todas las hipótesis hasta el mayor $k$ que cumple $p_{(k)} \le \tfrac{k}{m}\,q$. Como $k = 3$ lo cumple, ese mayor $k$ es al menos 3. El umbral $0{,}05/8$ es el de Bonferroni.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§5.4.1 (el problema de la multiplicidad con contrastes independientes), §5.4.2 (significación de campo y control de la FDR con el procedimiento de Benjamini-Hochberg), §5.4.3 (efecto de la correlación espacial entre contrastes) y §5.5.1 (Bonferroni y el test de Tukey para comparar varias medias tras un ANOVA).' },
    ],
    extra: [
      { text: 'Benjamini, Y. y Hochberg, Y. (1995). Controlling the False Discovery Rate: A Practical and Powerful Approach to Multiple Testing. Journal of the Royal Statistical Society: Series B (Methodological), 57(1), 289–300.', url: 'https://doi.org/10.1111/j.2517-6161.1995.tb02031.x' },
      { text: 'Holm, S. (1979). A Simple Sequentially Rejective Multiple Test Procedure. Scandinavian Journal of Statistics, 6(2), 65–70.', url: 'https://www.jstor.org/stable/4615733' },
    ],
  },
  en: {
    lede: 'If you run many tests, some will come out significant by chance even when there is no effect at all. Corrections control either the probability of making any false positive (FWER) or the expected proportion of false positives among the discoveries (FDR).',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`You look for user subgroups (by country, language or device) where your model performs worse, and you run a test in each of 50 subgroups, with $\alpha = 0.05$. Even if the model performed equally in all of them, you would expect 2.5 “significant” subgroups, and if the tests were independent, the probability of finding at least one would be $1 - 0.95^{50} \approx 0.92$. Finding one is not, on its own, evidence of anything.` },
          { key: String.raw`$\alpha$ controls the error of each test separately, not of the whole set. The more tests you look at, the stricter the criterion for each one must be.` },
        ],
      },
      {
        id: 'corrections',
        title: 'Two ways to control errors',
        blocks: [
          { p: String.raw`With $m$ tests, let $V$ be the number of false positives and $R$ the total number of rejected hypotheses:` },
          { math: String.raw`\text{FWER} = P(V \ge 1), \qquad \text{FDR} = \mathbb{E}\!\left[\frac{V}{\max(R,\ 1)}\right]` },
          {
            list: [
              String.raw`**Bonferroni** (FWER): reject if $p_i \le \alpha/m$. It holds under any dependence between the tests, but with large $m$ it is very conservative.`,
              String.raw`**Holm** (FWER): sort the p-values from smallest to largest and compare the $i$-th with $\alpha/(m - i + 1)$, stopping at the first one that fails. It gives the same guarantee as Bonferroni and never rejects fewer.`,
              String.raw`**Benjamini–Hochberg** (FDR at level $q$): sort the p-values, find the largest $k$ with $p_{(k)} \le \tfrac{k}{m}\,q$ and reject the $k$ hypotheses with the smallest p-values. It guarantees the FDR for independent or positively dependent tests.`,
            ],
          },
        ],
      },
      {
        id: 'example',
        title: 'An example with 10 p-values',
        blocks: [
          { p: String.raw`Ten tests give, in order, these p-values: 0.001, 0.004, 0.006, 0.012, 0.021, 0.038, 0.09, 0.27, 0.52 and 0.88. With $\alpha = q = 0.05$:` },
          {
            table: {
              head: ['Method', 'Criterion', 'Rejections'],
              rows: [
                ['Uncorrected', String.raw`$p \le 0.05$`, '6'],
                ['Bonferroni', String.raw`$p \le 0.005$`, '2'],
                ['Holm', String.raw`$p_{(i)} \le 0.05/(11 - i)$`, '3'],
                ['Benjamini–Hochberg', String.raw`$p_{(k)} \le 0.005\,k$`, '5'],
              ],
              numeric: [2],
            },
          },
          { p: String.raw`Holm also rejects 0.006 because its third threshold is $0.05/8 = 0.00625$. Benjamini–Hochberg goes up to 0.021, below $5 \cdot 0.005 = 0.025$; the next one, 0.038, exceeds its threshold of 0.030, and the later ones exceed theirs too. Controlling the FDR tolerates the odd false discovery in exchange for much more [[errors-power|power]], and it is usually the sensible choice when exploring many hypotheses.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“If each test uses α = 0.05, the whole set also has 5% false positives.”', fix: 'The 5% is per test. With 50 independent tests and all null hypotheses true, the probability of some false positive is 0.92.' },
      { claim: '“Bonferroni is always the safe choice.”', fix: 'It controls the FWER, but with many tests it is so strict that it can lose a lot of power. Holm gives the same guarantee with more power, and if you can tolerate a small fraction of false discoveries, control the FDR.' },
      { claim: '“With the FDR at 5%, each discovery has a 5% probability of being false.”', fix: 'It guarantees that the expected proportion of false discoveries, on average over repetitions of the study, does not exceed 5%; it is not the probability for each one. Discoveries with p-values close to the threshold are more likely to be false than those with tiny p-values.' },
      { claim: '“Only the tests I publish count.”', fix: 'Every test you looked at counts: the discarded subgroups, the metrics you did not show and the analysis variants you tried before picking one. If they cannot be counted, treat the findings as hypotheses to be confirmed on new data.' },
    ],
    dl: [
      { title: 'Hyperparameter search.', text: 'Keeping the best of many configurations inflates its score: the maximum of many noisy estimates tends to lie above its true value. If 100 configurations had the same true accuracy and their validation estimates were independent and normal, with a standard error of 0.5 points, the best one would look 1.25 points better on average. Evaluate the chosen one on a test set you did not use for choosing.' },
      { title: 'Subgroup analysis.', text: 'When looking for the subgroups where a model fails, correct for the number of subgroups analyzed, for example with Benjamini–Hochberg, or confirm the findings on new data before acting on them.' },
      { title: 'Many metrics, many benchmarks.', text: 'Reporting only the metrics or datasets where your model wins is comparing many times and keeping the successes. Decide in advance what you will measure and publish all the results.' },
    ],
    quiz: [
      {
        prompt: 'You run 30 independent tests at α = 0.05 and all null hypotheses are true. What is the probability of getting at least one false positive?',
        options: [{ text: '0.05' }, { text: '0.785', correct: true }, { text: '1.5' }],
        explain: String.raw`$1 - 0.95^{30} \approx 0.785$. The value 1.5 is the expected number of false positives, $30 \cdot 0.05$, not a probability.`,
      },
      {
        prompt: 'With Bonferroni, 10 tests and α = 0.05 for the whole set, what threshold does each test use?',
        options: [{ text: '0.05' }, { text: '0.005', correct: true }, { text: '0.5' }],
        explain: String.raw`Bonferroni divides $\alpha$ by the number of tests: $0.05/10 = 0.005$. That way the probability of any false positive does not exceed 0.05, whatever the dependence between the tests.`,
      },
      {
        prompt: 'You sort 8 p-values and the third smallest is 0.017. With Benjamini–Hochberg and q = 0.05, what can you be sure of?',
        options: [
          { text: String.raw`That at least the first three hypotheses are rejected, because $0.017 \le \tfrac{3}{8} \cdot 0.05 = 0.01875$.`, correct: true },
          { text: String.raw`That the third one is not rejected, because $0.017 > 0.05/8$.` },
          { text: 'Nothing: Benjamini–Hochberg does not use the order of the p-values.' },
        ],
        explain: String.raw`Benjamini–Hochberg rejects every hypothesis up to the largest $k$ satisfying $p_{(k)} \le \tfrac{k}{m}\,q$. Since $k = 3$ satisfies it, that largest $k$ is at least 3. The threshold $0.05/8$ is Bonferroni’s.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§5.4.1 (the multiplicity problem for independent tests), §5.4.2 (field significance and FDR control with the Benjamini–Hochberg procedure), §5.4.3 (the effect of spatial correlation between tests) and §5.5.1 (Bonferroni and Tukey’s test to compare several means after an ANOVA).' },
    ],
    extra: [
      { text: 'Benjamini, Y. and Hochberg, Y. (1995). Controlling the False Discovery Rate: A Practical and Powerful Approach to Multiple Testing. Journal of the Royal Statistical Society: Series B (Methodological), 57(1), 289–300.', url: 'https://doi.org/10.1111/j.2517-6161.1995.tb02031.x' },
      { text: 'Holm, S. (1979). A Simple Sequentially Rejective Multiple Test Procedure. Scandinavian Journal of Statistics, 6(2), 65–70.', url: 'https://www.jstor.org/stable/4615733' },
    ],
  },
};

export default content;
