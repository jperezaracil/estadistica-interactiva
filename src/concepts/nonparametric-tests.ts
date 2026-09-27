import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Los tests no paramétricos no suponen una forma concreta para la distribución de los datos: trabajan con rangos, signos o permutaciones. Son la opción natural con muestras pequeñas, valores atípicos o estadísticos cuya distribución no tiene fórmula.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Entrenas un modelo 5 veces con una técnica de aumento de datos y 5 veces sin ella, con semillas distintas. Las tasas de acierto (%) son 91,2; 90,8; 91,5; 91,0 y 91,3 con aumento, y 90,4; 90,9; 90,1; 90,6 y 90,5 sin él: las medias difieren en 0,66 puntos. Si la técnica no influyera, las etiquetas «con» y «sin» serían intercambiables, y cualquier reparto de los 10 resultados en dos grupos de 5 sería igual de probable. De los 252 repartos posibles, solo 4 dan una diferencia de medias de al menos 0,66 puntos en valor absoluto: p = 4/252 ≈ 0,016.' },
          { key: 'Si H₀ hace intercambiables las etiquetas, la distribución del estadístico bajo H₀ se obtiene reordenándolas. El p-valor es la fracción de reordenaciones cuyo estadístico es al menos tan extremo como el observado.' },
        ],
      },
      {
        id: 'permutacion',
        title: 'Tests de permutación',
        blocks: [
          {
            list: [
              'Calcula el estadístico con los datos: diferencia de medias, de medianas, de F1… el que responda a tu pregunta.',
              'Reordena al azar las etiquetas de forma compatible con H₀: entre grupos, si son independientes, o intercambiando los dos valores de cada par, si los datos están emparejados.',
              String.raw`Repite $B$ veces, o recorre todas las reordenaciones si son pocas, y calcula el p-valor:`,
            ],
          },
          { math: String.raw`p = \frac{1 + \#\{b : |T^*_b| \ge |T_{\text{obs}}|\}}{1 + B}` },
          { p: String.raw`Con reordenaciones al azar, sumar 1 arriba y abajo cuenta la observada y evita p-valores iguales a cero; si recorres todas, como en el ejemplo, basta con la fracción. El test es válido para cualquier estadístico, pero el p-valor tiene una resolución limitada: con 5 frente a 5 datos, el menor p-valor bilateral posible es $2/252 \approx 0{,}008$.` },
        ],
      },
      {
        id: 'rangos',
        title: 'Tests de rangos',
        blocks: [
          { p: 'Los tests no paramétricos clásicos sustituyen los datos por sus rangos (su posición al ordenarlos) y comparan esos rangos con lo que cabría esperar si H₀ fuera cierta:' },
          {
            list: [
              String.raw`**Wilcoxon-Mann-Whitney** (dos muestras independientes): suma los rangos de un grupo en la muestra conjunta. Su estadístico $U$, dividido entre $n_1 n_2$, estima la probabilidad de que un valor del primer grupo supere a uno del segundo. En el ejemplo, $U/(n_1 n_2) = 0{,}96$, y el p-valor exacto vuelve a ser 0,016.`,
              '**Wilcoxon de rangos con signo** (datos emparejados): ordena los valores absolutos de las diferencias y compara la suma de los rangos de las positivas con la de las negativas.',
              '**Test del signo** (datos emparejados): cuenta cuántas diferencias son positivas y lo compara con una binomial de probabilidad 1/2.',
            ],
          },
          { p: String.raw`Con datos normales, los de Wilcoxon pierden poco frente al test t (su eficiencia relativa asintótica es $3/\pi \approx 0{,}955$; la del test del signo baja a $2/\pi \approx 0{,}64$), y con colas pesadas o valores atípicos pueden ser bastante más potentes. Para comparar más de dos grupos existen versiones análogas, como los tests de Kruskal-Wallis y de Friedman.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Los tests no paramétricos no tienen supuestos.»', fix: 'Suponen independencia, o al menos que las etiquetas son intercambiables si H₀ es cierta. Y, sin más supuestos, el de Mann-Whitney contrasta si un grupo tiende a dar valores mayores que el otro, no si las medianas son iguales.' },
      { claim: '«Son mucho menos potentes que los paramétricos.»', fix: 'Con datos normales, los de Wilcoxon pierden poco: su eficiencia asintótica frente al t es 0,955. Con colas pesadas o valores atípicos suelen ser más potentes.' },
      { claim: '«En un test de permutación se pueden reordenar los datos de cualquier manera.»', fix: 'Solo de las maneras que H₀ hace equivalentes. Con datos emparejados se intercambia dentro de cada par, y con series temporales una reordenación libre rompe la dependencia y da p-valores demasiado pequeños.' },
      { claim: '«El bootstrap y los tests de permutación son lo mismo.»', fix: 'La permutación reordena sin reemplazo para obtener la distribución del estadístico si H₀ fuera cierta. El [[bootstrap|bootstrap]] remuestrea con reemplazo para estimar la variabilidad de un estadístico, sin suponer H₀.' },
    ],
    dl: [
      { title: 'La AUC empírica es un estadístico de Mann-Whitney.', text: String.raw`La AUC de un clasificador es la probabilidad de que un positivo al azar reciba mayor puntuación que un negativo al azar. Su estimación con una muestra, el área bajo la curva ROC empírica, es exactamente $U/(n_+ n_-)$, contando los empates como 1/2. La hipótesis nula del test de Mann-Whitney es que positivos y negativos tienen la misma distribución de puntuaciones: eso implica una AUC de 0,5, pero una AUC de 0,5 no implica distribuciones iguales. Ver [[classification-metrics]].` },
      { title: 'Comparar métodos en varios conjuntos de datos.', text: String.raw`Para comparar dos métodos en $N$ conjuntos de datos, el test de Wilcoxon de rangos con signo sobre las diferencias por conjunto es más fiable que un t, porque esas diferencias tienen escalas distintas y valores atípicos. Con más de dos métodos se usa el test de Friedman, que ordena los métodos dentro de cada conjunto.` },
      { title: 'Métricas complejas.', text: 'Para saber si la mejora en BLEU o en F1 de un sistema es real, intercambia al azar, ejemplo a ejemplo, las salidas de los dos sistemas, recalcula la métrica en cada reordenación y mira con qué frecuencia la diferencia es tan grande como la observada. Es un test de permutación emparejado, habitual en procesamiento del lenguaje natural.' },
    ],
    quiz: [
      {
        prompt: 'En un test de permutación con dos grupos de 4 observaciones, ¿cuántos repartos distintos de las etiquetas hay?',
        options: [{ text: '16' }, { text: '70', correct: true }, { text: '40 320' }],
        explain: String.raw`Hay que elegir qué 4 de las 8 observaciones forman el primer grupo: $\binom{8}{4} = 70$. El valor 40 320 es $8!$, que cuenta también el orden dentro de cada grupo, y ese orden no cambia el estadístico.`,
      },
      {
        prompt: '¿Qué hace el test de Wilcoxon-Mann-Whitney con los datos?',
        options: [
          { text: 'Los sustituye por sus rangos en la muestra conjunta.', correct: true },
          { text: 'Los estandariza restando la media y dividiendo entre la desviación típica.' },
          { text: 'Elimina los valores atípicos y aplica un test t.' },
        ],
        explain: 'Trabaja con las posiciones de los datos al ordenar las dos muestras juntas. Por eso un valor extremo pesa lo mismo que cualquier otro que ocupe la última posición.',
      },
      {
        prompt: 'Tienes la pérdida de un método con y sin un cambio en 12 conjuntos de datos, y en uno de ellos la diferencia es enorme. ¿Qué test es el más apropiado?',
        options: [
          { text: 'Un test t de dos muestras independientes.' },
          { text: 'El test de Wilcoxon de rangos con signo sobre las diferencias.', correct: true },
          { text: 'Un χ² de bondad de ajuste.' },
        ],
        explain: 'Los datos están emparejados por conjunto, y el valor atípico dominaría un test t. El de rangos con signo usa el orden de las diferencias, no su magnitud, así que la influencia del conjunto extremo queda acotada.',
      },
    ],
    further: [
      { book: 'wilks', where: '§5.3.1 (tests clásicos de rangos: suma de rangos de Wilcoxon-Mann-Whitney y rangos con signo), §5.3.2 (test de tendencia de Mann-Kendall) y §5.3.3–5.3.4 (tests de remuestreo y de permutación).' },
      { book: 'pml2', where: '§3.10.3.1 (aproximar los tests no paramétricos aplicando tests lineales a los rangos).' },
    ],
    extra: [
      { text: 'Demšar, J. (2006). Statistical Comparisons of Classifiers over Multiple Data Sets. Journal of Machine Learning Research, 7, 1–30.', url: 'https://jmlr.org/papers/v7/demsar06a.html' },
    ],
  },
  en: {
    lede: 'Nonparametric tests assume no particular shape for the distribution of the data: they work with ranks, signs or permutations. They are the natural choice with small samples, outliers, or statistics whose distribution has no formula.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'You train a model 5 times with a data augmentation technique and 5 times without it, with different seeds. The accuracies (%) are 91.2, 90.8, 91.5, 91.0 and 91.3 with augmentation, and 90.4, 90.9, 90.1, 90.6 and 90.5 without it: the means differ by 0.66 points. If the technique had no effect, the labels “with” and “without” would be exchangeable, and any split of the 10 results into two groups of 5 would be equally likely. Of the 252 possible splits, only 4 give a difference in means of at least 0.66 points in absolute value: p = 4/252 ≈ 0.016.' },
          { key: 'If H₀ makes the labels exchangeable, the distribution of the statistic under H₀ is obtained by shuffling them. The p-value is the fraction of shuffles whose statistic is at least as extreme as the observed one.' },
        ],
      },
      {
        id: 'permutation',
        title: 'Permutation tests',
        blocks: [
          {
            list: [
              'Compute the statistic on the data: difference in means, in medians, in F1… whichever answers your question.',
              'Shuffle the labels at random in a way compatible with H₀: across groups, if they are independent, or swapping the two values within each pair, if the data are paired.',
              String.raw`Repeat $B$ times, or go through every shuffle if there are few, and compute the p-value:`,
            ],
          },
          { math: String.raw`p = \frac{1 + \#\{b : |T^*_b| \ge |T_{\text{obs}}|\}}{1 + B}` },
          { p: String.raw`With random shuffles, adding 1 at the top and bottom counts the observed arrangement and avoids p-values of zero; if you go through all of them, as in the example, the plain fraction is enough. The test is valid for any statistic, but the p-value has limited resolution: with 5 against 5 data points, the smallest possible two-sided p-value is $2/252 \approx 0.008$.` },
        ],
      },
      {
        id: 'ranks',
        title: 'Rank tests',
        blocks: [
          { p: 'The classic nonparametric tests replace the data by their ranks (their positions when sorted) and compare those ranks with what would be expected if H₀ were true:' },
          {
            list: [
              String.raw`**Wilcoxon–Mann–Whitney** (two independent samples): adds up the ranks of one group in the combined sample. Its statistic $U$, divided by $n_1 n_2$, estimates the probability that a value from the first group exceeds one from the second. In the example, $U/(n_1 n_2) = 0.96$, and the exact p-value is again 0.016.`,
              '**Wilcoxon signed-rank** (paired data): ranks the absolute values of the differences and compares the sum of the ranks of the positive ones with that of the negative ones.',
              '**Sign test** (paired data): counts how many differences are positive and compares that with a binomial with probability 1/2.',
            ],
          },
          { p: String.raw`With normal data, the Wilcoxon tests lose little against the t-test (their asymptotic relative efficiency is $3/\pi \approx 0.955$; that of the sign test drops to $2/\pi \approx 0.64$), and with heavy tails or outliers they can be considerably more powerful. For more than two groups there are analogous versions, such as the Kruskal–Wallis and Friedman tests.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“Nonparametric tests have no assumptions.”', fix: 'They assume independence, or at least that the labels are exchangeable if H₀ is true. And, without further assumptions, the Mann–Whitney test checks whether one group tends to give larger values than the other, not whether the medians are equal.' },
      { claim: '“They are much less powerful than parametric tests.”', fix: 'With normal data, the Wilcoxon tests lose little: their asymptotic efficiency relative to the t-test is 0.955. With heavy tails or outliers they are often more powerful.' },
      { claim: '“In a permutation test the data can be shuffled in any way.”', fix: 'Only in the ways that H₀ makes equivalent. With paired data you swap within each pair, and with time series a free shuffle breaks the dependence and gives p-values that are too small.' },
      { claim: '“The bootstrap and permutation tests are the same thing.”', fix: 'Permutation reshuffles without replacement to obtain the distribution of the statistic if H₀ were true. The [[bootstrap|bootstrap]] resamples with replacement to estimate the variability of a statistic, without assuming H₀.' },
    ],
    dl: [
      { title: 'The empirical AUC is a Mann–Whitney statistic.', text: String.raw`A classifier’s AUC is the probability that a random positive gets a higher score than a random negative. Its estimate from a sample, the area under the empirical ROC curve, is exactly $U/(n_+ n_-)$, counting ties as 1/2. The null hypothesis of the Mann–Whitney test is that positives and negatives have the same score distribution: that implies an AUC of 0.5, but an AUC of 0.5 does not imply equal distributions. See [[classification-metrics]].` },
      { title: 'Comparing methods across datasets.', text: String.raw`To compare two methods on $N$ datasets, the Wilcoxon signed-rank test on the per-dataset differences is more reliable than a t-test, because those differences have different scales and outliers. With more than two methods you use the Friedman test, which ranks the methods within each dataset.` },
      { title: 'Complex metrics.', text: 'To find out whether one system’s improvement in BLEU or F1 is real, randomly swap the two systems’ outputs, example by example, recompute the metric for each shuffle and see how often the difference is as large as the observed one. It is a paired permutation test, common in natural language processing.' },
    ],
    quiz: [
      {
        prompt: 'In a permutation test with two groups of 4 observations, how many distinct label splits are there?',
        options: [{ text: '16' }, { text: '70', correct: true }, { text: '40,320' }],
        explain: String.raw`You choose which 4 of the 8 observations form the first group: $\binom{8}{4} = 70$. The value 40,320 is $8!$, which also counts the order within each group, and that order does not change the statistic.`,
      },
      {
        prompt: 'What does the Wilcoxon–Mann–Whitney test do with the data?',
        options: [
          { text: 'It replaces them by their ranks in the combined sample.', correct: true },
          { text: 'It standardizes them by subtracting the mean and dividing by the standard deviation.' },
          { text: 'It removes the outliers and applies a t-test.' },
        ],
        explain: 'It works with the positions of the data when both samples are sorted together. That is why an extreme value weighs the same as any other value in the last position.',
      },
      {
        prompt: 'You have the loss of a method with and without a change on 12 datasets, and on one of them the difference is huge. Which test is most appropriate?',
        options: [
          { text: 'A two-sample t-test for independent samples.' },
          { text: 'The Wilcoxon signed-rank test on the differences.', correct: true },
          { text: 'A χ² goodness-of-fit test.' },
        ],
        explain: 'The data are paired by dataset, and the outlier would dominate a t-test. The signed-rank test uses the order of the differences, not their size, so the influence of the extreme dataset is bounded.',
      },
    ],
    further: [
      { book: 'wilks', where: '§5.3.1 (classic rank tests: Wilcoxon–Mann–Whitney rank-sum and signed-rank tests), §5.3.2 (the Mann–Kendall trend test) and §5.3.3–5.3.4 (resampling and permutation tests).' },
      { book: 'pml2', where: '§3.10.3.1 (approximating nonparametric tests by applying linear-model tests to ranks).' },
    ],
    extra: [
      { text: 'Demšar, J. (2006). Statistical Comparisons of Classifiers over Multiple Data Sets. Journal of Machine Learning Research, 7, 1–30.', url: 'https://jmlr.org/papers/v7/demsar06a.html' },
    ],
  },
};

export default content;
