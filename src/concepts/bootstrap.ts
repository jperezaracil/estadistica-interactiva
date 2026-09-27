import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'El bootstrap aproxima la distribución muestral de un estadístico remuestreando con reemplazo tus propios datos. Sirve para calcular errores estándar e intervalos de confianza cuando no hay una fórmula disponible.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Quieres un [[confidence-intervals|intervalo de confianza]] para la F1 de un modelo en su conjunto de test, y no hay una fórmula sencilla para su error estándar. Lo ideal sería evaluar el modelo en muchos conjuntos de test nuevos y ver cuánto varía la F1, pero solo tienes uno. El bootstrap los sustituye por muchos conjuntos artificiales del mismo tamaño, formados sacando ejemplos al azar y con reemplazo de tu test, y recalcula la F1 en cada uno.' },
          { key: 'La muestra hace de población. La variación de un estadístico entre remuestras aproxima su variación entre muestras reales, es decir, su [[sampling-distribution|distribución muestral]].' },
        ],
      },
      {
        id: 'algoritmo',
        title: 'El algoritmo',
        blocks: [
          {
            list: [
              String.raw`Saca $n$ observaciones de tus $n$ datos, al azar y con reemplazo: algunas se repiten y otras no salen.`,
              String.raw`Calcula el estadístico en esa remuestra: $\hat\theta^*_b$.`,
              String.raw`Repite $B$ veces; entre 1000 y 10 000 remuestras suele bastar.`,
            ],
          },
          { p: String.raw`El error estándar bootstrap es la desviación típica de las $B$ réplicas, y el **intervalo percentil** al 95 % va del percentil 2,5 al 97,5 de las réplicas, $q_{0{,}025}$ y $q_{0{,}975}$:` },
          { math: String.raw`\widehat{\mathrm{EE}}_{\text{boot}} = \sqrt{\frac{1}{B-1}\sum_{b=1}^{B}\big(\hat\theta^*_b - \bar\theta^*\big)^2}, \qquad \mathrm{IC}_{95\,\%} = \big[\,q_{0{,}025},\ q_{0{,}975}\,\big]` },
          { p: String.raw`Cada remuestra deja fuera aproximadamente el 36,8 % de los datos originales: la probabilidad de que un dato concreto no salga en $n$ extracciones es $(1 - 1/n)^n \approx e^{-1}$. Hay variantes más precisas del intervalo, como el BCa, que corrige el sesgo y la asimetría de la distribución bootstrap.` },
        ],
      },
      {
        id: 'ejemplo',
        title: 'Un ejemplo: la mediana de una latencia',
        blocks: [
          { p: 'Mides el tiempo de inferencia de un modelo en 15 peticiones (en ms): 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 30, 32, 36, 45 y 63. Con muchas remuestras se obtiene:' },
          {
            table: {
              head: ['Estadístico', 'Estimación', 'EE con fórmula', 'EE bootstrap'],
              rows: [
                ['Media', '29,3 ms', String.raw`$s/\sqrt n = 3{,}0$ ms`, '2,9 ms'],
                ['Mediana', '26 ms', '—', '2,2 ms'],
              ],
              numeric: [1, 2, 3],
            },
          },
          { p: String.raw`Para la media, el bootstrap casi reproduce la fórmula clásica; sale un poco menor porque, al tratar la muestra como población, su varianza se calcula dividiendo entre $n$ y no entre $n-1$. Para la mediana no hay una fórmula sencilla, pero el procedimiento es idéntico: su intervalo percentil al 95 % va de 22 a 32 ms. La mediana, a la que apenas afectan las dos peticiones lentas, es además más estable que la media.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«El bootstrap crea datos nuevos, así que funciona con muestras muy pequeñas.»', fix: 'Solo reutiliza la información que ya hay. Con muy pocos datos, la muestra representa mal la población y los intervalos suelen salir demasiado estrechos.' },
      { claim: '«Siempre se puede remuestrear observación a observación.»', fix: 'Solo si las observaciones son independientes. Con series temporales hay que remuestrear bloques de observaciones contiguas, y con datos agrupados (varias imágenes por paciente), grupos enteros.' },
      { claim: String.raw`«Aumentar el número de remuestras $B$ reduce la incertidumbre de la estimación.»`, fix: String.raw`$B$ solo reduce el error de Monte Carlo del propio cálculo. La incertidumbre de fondo depende del tamaño de la muestra, $n$: con infinitas remuestras seguirías teniendo el mismo error estándar.` },
      { claim: '«El bootstrap funciona con cualquier estadístico.»', fix: String.raw`Falla con estadísticos que dependen de valores extremos, como el máximo: con $n$ grande, cerca del 63 % de las remuestras repiten el máximo de la muestra original, y la distribución bootstrap no se parece a la real.` },
    ],
    dl: [
      { title: 'Intervalos para cualquier métrica.', text: 'Para F1, AUC, BLEU o mAP no hay una fórmula sencilla del error estándar (para la AUC hay fórmulas aproximadas, como la de DeLong, pero el bootstrap sirve para cualquiera de estas métricas): remuestrea los ejemplos de test, recalcula la métrica en cada remuestra y toma los percentiles 2,5 y 97,5.' },
      { title: 'Comparar dos modelos.', text: 'Usa los mismos índices remuestreados para los dos modelos y calcula en cada remuestra la diferencia de la métrica (bootstrap emparejado). Así se conserva la correlación entre sus aciertos, y el intervalo de la diferencia suele salir más estrecho que si los trataras por separado.' },
      { title: 'Bagging.', text: 'Entrenar varios modelos, cada uno con una remuestra bootstrap de los datos, y promediar sus predicciones reduce la varianza: es la base de los bosques aleatorios. En redes profundas suele funcionar mejor entrenar cada miembro del ensemble con todos los datos y cambiar solo la semilla.' },
    ],
    quiz: [
      {
        prompt: String.raw`¿Cómo se genera una remuestra bootstrap a partir de $n$ datos?`,
        options: [
          { text: String.raw`Sacando $n$ datos al azar y con reemplazo de la muestra original.`, correct: true },
          { text: String.raw`Reordenando al azar los $n$ datos.` },
          { text: String.raw`Sacando $n/2$ datos al azar y sin reemplazo.` },
        ],
        explain: 'Con reemplazo, unos datos se repiten y otros no salen, y el estadístico cambia de una remuestra a otra. Reordenar no cambia ni la media ni la mediana, y sacar la mitad de los datos sin reemplazo es otra técnica de remuestreo (el submuestreo), no el bootstrap.',
      },
      {
        prompt: 'En una remuestra bootstrap de un test de 1000 ejemplos, ¿qué fracción de los ejemplos originales no aparece, aproximadamente?',
        options: [{ text: '0 %' }, { text: '36,8 %', correct: true }, { text: '50 %' }],
        explain: String.raw`La probabilidad de que un ejemplo concreto no salga en 1000 extracciones es $(1 - 1/1000)^{1000} \approx e^{-1} \approx 0{,}368$.`,
      },
      {
        prompt: 'Tu intervalo bootstrap al 95 % para la AUC es muy ancho. ¿Qué reduciría de verdad la incertidumbre sobre la AUC?',
        options: [
          { text: String.raw`Aumentar el número de remuestras $B$.` },
          { text: 'Usar un conjunto de test más grande.', correct: true },
          { text: 'Calcular el intervalo al 90 % en lugar de al 95 %.' },
        ],
        explain: String.raw`La anchura refleja la variabilidad que corresponde al tamaño de tu test; $B$ solo reduce el ruido de la simulación. Bajar al 90 % estrecha el intervalo a costa de confianza, pero no reduce la incertidumbre.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§5.3.5 (bootstrap: principio de sustitución, intervalos percentil y BCa, bootstrap paramétrico y por bloques para datos autocorrelacionados) y §5.3.3 (introducción a los tests de remuestreo).' },
      { book: 'pml1', where: '§4.7.3 (aproximación bootstrap de la distribución muestral de cualquier estimador, y su parecido con un posterior) y §18.3 (bagging).' },
      { book: 'pml2', where: '§3.3.2 (bootstrap paramétrico y no paramétrico).' },
    ],
    extra: [
      { text: 'Efron, B. (1979). Bootstrap Methods: Another Look at the Jackknife. The Annals of Statistics, 7(1), 1–26.', url: 'https://doi.org/10.1214/aos/1176344552' },
    ],
  },
  en: {
    lede: 'The bootstrap approximates the sampling distribution of a statistic by resampling your own data with replacement. It gives standard errors and confidence intervals when no formula is available.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'You want a [[confidence-intervals|confidence interval]] for a model’s F1 on its test set, and there is no simple formula for its standard error. Ideally you would evaluate the model on many new test sets and see how much the F1 varies, but you only have one. The bootstrap replaces them with many artificial sets of the same size, built by drawing examples at random and with replacement from your test set, and recomputes the F1 on each.' },
          { key: 'The sample stands in for the population. The variation of a statistic across resamples approximates its variation across real samples, that is, its [[sampling-distribution|sampling distribution]].' },
        ],
      },
      {
        id: 'algorithm',
        title: 'The algorithm',
        blocks: [
          {
            list: [
              String.raw`Draw $n$ observations from your $n$ data points, at random and with replacement: some are repeated and others are left out.`,
              String.raw`Compute the statistic on that resample: $\hat\theta^*_b$.`,
              String.raw`Repeat $B$ times; between 1000 and 10,000 resamples is usually enough.`,
            ],
          },
          { p: String.raw`The bootstrap standard error is the standard deviation of the $B$ replicates, and the 95% **percentile interval** runs from the 2.5th to the 97.5th percentile of the replicates, $q_{0.025}$ and $q_{0.975}$:` },
          { math: String.raw`\widehat{\mathrm{SE}}_{\text{boot}} = \sqrt{\frac{1}{B-1}\sum_{b=1}^{B}\big(\hat\theta^*_b - \bar\theta^*\big)^2}, \qquad \mathrm{CI}_{95\%} = \big[\,q_{0.025},\ q_{0.975}\,\big]` },
          { p: String.raw`Each resample leaves out about 36.8% of the original data: the probability that a given point is not drawn in $n$ draws is $(1 - 1/n)^n \approx e^{-1}$. There are more accurate versions of the interval, such as BCa, which corrects for the bias and skewness of the bootstrap distribution.` },
        ],
      },
      {
        id: 'example',
        title: 'An example: median latency',
        blocks: [
          { p: 'You measure a model’s inference time on 15 requests (in ms): 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 30, 32, 36, 45 and 63. With many resamples you get:' },
          {
            table: {
              head: ['Statistic', 'Estimate', 'SE by formula', 'Bootstrap SE'],
              rows: [
                ['Mean', '29.3 ms', String.raw`$s/\sqrt n = 3.0$ ms`, '2.9 ms'],
                ['Median', '26 ms', '—', '2.2 ms'],
              ],
              numeric: [1, 2, 3],
            },
          },
          { p: String.raw`For the mean, the bootstrap almost reproduces the classic formula; it comes out slightly smaller because, by treating the sample as the population, it computes the variance dividing by $n$ rather than $n-1$. For the median there is no simple formula, but the procedure is identical: its 95% percentile interval runs from 22 to 32 ms. The median, which the two slow requests barely affect, is also more stable than the mean.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“The bootstrap creates new data, so it works with very small samples.”', fix: 'It only reuses the information already there. With very little data, the sample represents the population poorly and the intervals tend to be too narrow.' },
      { claim: '“You can always resample one observation at a time.”', fix: 'Only if the observations are independent. With time series you have to resample blocks of consecutive observations, and with grouped data (several images per patient), whole groups.' },
      { claim: String.raw`“Increasing the number of resamples $B$ reduces the uncertainty of the estimate.”`, fix: String.raw`$B$ only reduces the Monte Carlo error of the computation itself. The underlying uncertainty depends on the sample size, $n$: with infinitely many resamples you would still have the same standard error.` },
      { claim: '“The bootstrap works for any statistic.”', fix: String.raw`It fails for statistics that depend on extreme values, such as the maximum: with large $n$, about 63% of the resamples repeat the maximum of the original sample, and the bootstrap distribution looks nothing like the real one.` },
    ],
    dl: [
      { title: 'Intervals for any metric.', text: 'For F1, AUC, BLEU or mAP there is no simple standard-error formula (for the AUC there are approximate ones, such as DeLong’s, but the bootstrap works for any of these metrics): resample the test examples, recompute the metric on each resample and take the 2.5th and 97.5th percentiles.' },
      { title: 'Comparing two models.', text: 'Use the same resampled indices for both models and compute the difference in the metric on each resample (paired bootstrap). That keeps the correlation between their correct answers, and the interval for the difference usually comes out narrower than if you treated them separately.' },
      { title: 'Bagging.', text: 'Training several models, each on a bootstrap resample of the data, and averaging their predictions reduces variance: it is the basis of random forests. In deep networks it usually works better to train each ensemble member on all the data and change only the seed.' },
    ],
    quiz: [
      {
        prompt: String.raw`How is a bootstrap resample generated from $n$ data points?`,
        options: [
          { text: String.raw`By drawing $n$ points at random and with replacement from the original sample.`, correct: true },
          { text: String.raw`By shuffling the order of the $n$ points.` },
          { text: String.raw`By drawing $n/2$ points at random without replacement.` },
        ],
        explain: 'With replacement, some points are repeated and others are left out, so the statistic changes from one resample to the next. Shuffling changes neither the mean nor the median, and drawing half of the data without replacement is a different resampling technique (subsampling), not the bootstrap.',
      },
      {
        prompt: 'In a bootstrap resample of a 1000-example test set, roughly what fraction of the original examples does not appear?',
        options: [{ text: '0%' }, { text: '36.8%', correct: true }, { text: '50%' }],
        explain: String.raw`The probability that a given example is not drawn in 1000 draws is $(1 - 1/1000)^{1000} \approx e^{-1} \approx 0.368$.`,
      },
      {
        prompt: 'Your 95% bootstrap interval for the AUC is very wide. What would genuinely reduce the uncertainty about the AUC?',
        options: [
          { text: String.raw`Increasing the number of resamples $B$.` },
          { text: 'Using a larger test set.', correct: true },
          { text: 'Computing a 90% interval instead of a 95% one.' },
        ],
        explain: String.raw`The width reflects the variability that goes with the size of your test set; $B$ only reduces the simulation noise. Going down to 90% narrows the interval at the cost of confidence, but does not reduce the uncertainty.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§5.3.5 (the bootstrap: plug-in principle, percentile and BCa intervals, parametric bootstrap and block bootstrap for autocorrelated data) and §5.3.3 (introduction to resampling tests).' },
      { book: 'pml1', where: '§4.7.3 (bootstrap approximation of the sampling distribution of any estimator, and its resemblance to a posterior) and §18.3 (bagging).' },
      { book: 'pml2', where: '§3.3.2 (parametric and nonparametric bootstrap).' },
    ],
    extra: [
      { text: 'Efron, B. (1979). Bootstrap Methods: Another Look at the Jackknife. The Annals of Statistics, 7(1), 1–26.', url: 'https://doi.org/10.1214/aos/1176344552' },
    ],
  },
};

export default content;
