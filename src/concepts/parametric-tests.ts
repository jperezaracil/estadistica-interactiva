import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Los contrastes paramétricos clásicos comparan un estadístico con una distribución de referencia conocida: la normal, la t de Student o la χ². Esa referencia es válida si se cumplen ciertos supuestos sobre los datos, sobre todo la independencia.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Un modelo de predicción de temperatura debería acertar en promedio. En 25 días de validación, su error medio es de +1,2 °C, con una desviación típica de 2,5 °C. ¿Es un sesgo real o ruido? El test t lo mide en errores estándar: $\mathrm{EE} = 2{,}5/\sqrt{25} = 0{,}5$ °C, así que $t = 1{,}2/0{,}5 = 2{,}4$. Si el modelo no tuviera sesgo, un valor tan alejado de 0 aparecería con probabilidad 0,025 ([[hypothesis-testing|p-valor]] bilateral, con una t de Student de 24 grados de libertad).` },
          { key: 'Muchos estadísticos de contraste (z, t, Wald) tienen la misma forma: (estimación − valor bajo H₀) / error estándar. Lo que cambia de un test a otro es la distribución de referencia y los supuestos que la justifican.' },
        ],
      },
      {
        id: 'estadisticos',
        title: 'Los estadísticos',
        blocks: [
          { p: String.raw`Para medias, con $s$ la desviación típica muestral:` },
          {
            list: [
              String.raw`**z:** $z = (\bar x - \mu_0)/(\sigma/\sqrt n)$, con $\sigma$ conocida o con $n$ grande. Referencia: $\mathcal{N}(0, 1)$. Para una proporción, $z = (\hat p - p_0)/\sqrt{p_0(1-p_0)/n}$.`,
              String.raw`**t de una muestra:** $t = (\bar x - \mu_0)/(s/\sqrt n)$. Referencia: $t_{n-1}$. Con $n$ pequeño sus valores críticos son mayores que los de la normal: el bilateral al 95 % es 2,78 con 4 grados de libertad, frente a 1,96.`,
              String.raw`**t emparejado:** el de una muestra aplicado a las diferencias $d_i = x_i - y_i$, cuando se miden los mismos casos dos veces.`,
              String.raw`**t de Welch** (dos muestras independientes): $t = (\bar x_1 - \bar x_2)/\sqrt{s_1^2/n_1 + s_2^2/n_2}$, con unos grados de libertad aproximados que no exigen varianzas iguales.`,
            ],
          },
          { p: String.raw`Para recuentos, el estadístico $\chi^2$ compara las frecuencias observadas, $O_k$, con las esperadas si H₀ fuera cierta, $E_k$:` },
          { math: String.raw`\chi^2 = \sum_{k} \frac{(O_k - E_k)^2}{E_k}` },
          { p: String.raw`En un test de bondad de ajuste con $K$ categorías y probabilidades fijadas de antemano, la referencia es $\chi^2_{K-1}$; para contrastar la independencia en una tabla de $r \times c$, $\chi^2_{(r-1)(c-1)}$. La aproximación es buena si ninguna frecuencia esperada es pequeña (regla habitual: al menos 5).` },
        ],
      },
      {
        id: 'ejemplo',
        title: 'Un ejemplo con recuentos',
        blocks: [
          { p: 'Un generador de datos sintéticos debería producir cuatro clases con la misma frecuencia. En 200 muestras salen 62, 45, 48 y 45, frente a 50 esperadas en cada una:' },
          { math: String.raw`\chi^2 = \frac{12^2 + 5^2 + 2^2 + 5^2}{50} = 3{,}96, \qquad p = P\big(\chi^2_3 \ge 3{,}96\big) = 0{,}27` },
          { p: 'Los datos son compatibles con clases equilibradas, pero eso no demuestra que lo estén: con 200 muestras, si una clase saliera el 30 % de las veces en lugar del 25 % y las otras tres se repartieran el resto por igual, este test solo lo detectaría en una de cada cuatro repeticiones. Ver [[errors-power]].' },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Si los datos no son normales, no se puede usar el test t.»', fix: 'Con muestras moderadas o grandes, el teorema central del límite hace que la media sea aproximadamente normal y el test t funciona bien. Lo que de verdad importa es la independencia y que no haya valores extremos que dominen la media; con pocos datos y muy asimétricos, usa un [[nonparametric-tests|test no paramétrico o de permutación]].' },
      { claim: '«Los errores de días consecutivos cuentan como observaciones independientes.»', fix: String.raw`Si están autocorrelacionados positivamente, como suele ocurrir, $s/\sqrt n$ subestima el error estándar y los p-valores salen demasiado pequeños. En el ejemplo de la temperatura habría que corregir por la autocorrelación de los errores, o agrupar los días en bloques.` },
      { claim: '«El t de Student con varianzas iguales sirve siempre para comparar dos grupos.»', fix: 'Si las varianzas y los tamaños difieren, su tasa de falsos positivos puede alejarse mucho de α: con 10 datos de desviación típica 3 frente a 40 de desviación típica 1, llega al 26 % en lugar del 5 %. El test de Welch no supone varianzas iguales y pierde muy poco cuando sí lo son.' },
      { claim: '«El test χ² se puede aplicar a porcentajes, o con cualquier tamaño de muestra.»', fix: 'Necesita recuentos de observaciones independientes: con porcentajes, el valor del estadístico depende de la escala que elijas. Y la aproximación falla si hay frecuencias esperadas pequeñas; en ese caso, usa un test exacto: el multinomial exacto en bondad de ajuste, o el de Fisher en tablas de contingencia.' },
    ],
    dl: [
      { title: 'McNemar para comparar dos clasificadores.', text: String.raw`Si A y B se evalúan con los mismos ejemplos, cuenta en cuántos acierta solo A ($b$) y en cuántos solo B ($c$). Si H₀ es cierta, $(b-c)^2/(b+c)$ sigue aproximadamente una $\chi^2_1$: con $b = 30$ y $c = 15$ vale 5,0 y $p = 0{,}025$, sin corrección de continuidad; el test binomial exacto, el que usa statsmodels por defecto, da $p \approx 0{,}036$. Los ejemplos en que ambos aciertan o ambos fallan no informan sobre la diferencia.` },
      { title: 'Varias semillas por configuración.', text: 'Comparar las métricas medias de dos configuraciones entrenadas con varias semillas es un test t de dos muestras; usa el de Welch. Con 3 o 5 semillas por grupo la potencia es baja, y el supuesto de normalidad pesa más.' },
      { title: 'Cambios de distribución.', text: 'Un χ² que compare la frecuencia de cada clase, o de cada categoría de una variable, en producción y en entrenamiento es una alarma sencilla de deriva de datos. Con millones de ejemplos saltará por diferencias irrelevantes, así que mira también el tamaño del cambio.' },
    ],
    quiz: [
      {
        prompt: String.raw`Tienes 25 observaciones con media 10,8 y desviación típica 2, y contrastas $\mu = 10$. ¿Cuánto vale el estadístico t?`,
        options: [{ text: '0,4' }, { text: '2', correct: true }, { text: '10' }],
        explain: String.raw`$t = (10{,}8 - 10)/(2/\sqrt{25}) = 0{,}8/0{,}4 = 2$. El valor 0,4 divide entre la desviación típica de los datos en lugar de entre el error estándar, y 10 divide entre $s/n$ en lugar de entre $s/\sqrt n$.`,
      },
      {
        prompt: 'Evalúas dos modelos con los mismos 1000 ejemplos de test. ¿Qué test es el adecuado para comparar sus tasas de acierto?',
        options: [
          { text: 'Un test z para dos proporciones independientes.' },
          { text: 'Un test emparejado, como el de McNemar, basado en los ejemplos en que discrepan.', correct: true },
          { text: 'Un χ² de bondad de ajuste sobre los aciertos de cada modelo.' },
        ],
        explain: 'Los resultados están emparejados: cada ejemplo se evalúa con los dos modelos. McNemar usa solo los ejemplos en que discrepan, que son los que informan de la diferencia; tratar las dos tasas como independientes ignora ese emparejamiento.',
      },
      {
        prompt: '¿Cuándo es dudosa la aproximación χ² en un test de bondad de ajuste?',
        options: [
          { text: 'Cuando alguna frecuencia esperada es pequeña (menos de 5, como regla habitual).', correct: true },
          { text: 'Cuando hay más de tres categorías.' },
          { text: 'Cuando las frecuencias observadas se alejan mucho de las esperadas.' },
        ],
        explain: 'La distribución χ² es una aproximación para muestras grandes, y falla cuando hay celdas con muy pocos casos esperados. Que las frecuencias observadas se alejen de las esperadas no es un problema: es justo lo que el test detecta.',
      },
    ],
    further: [
      { book: 'wilks', where: '§5.2.1–5.2.3 (test t de una muestra y de diferencia de medias con muestras independientes y emparejadas), §5.2.4 (medias con dependencia serial), §5.2.5 (bondad de ajuste: χ², Kolmogorov-Smirnov y Lilliefors) y §5.2.6 (tests de razón de verosimilitudes).' },
      { book: 'pml1', where: '§5.5.1 (test de razón de verosimilitudes) y §5.5.3 (contraste de hipótesis nula y p-valores).' },
      { book: 'pml2', where: '§3.10.3 (los tests clásicos, como el t, el ANOVA y el χ², vistos como inferencia en modelos lineales).' },
    ],
    extra: [
      { text: 'Student (1908). The Probable Error of a Mean. Biometrika, 6(1), 1–25.', url: 'https://doi.org/10.1093/biomet/6.1.1' },
      { text: 'Dietterich, T. G. (1998). Approximate Statistical Tests for Comparing Supervised Classification Learning Algorithms. Neural Computation, 10(7), 1895–1923.', url: 'https://doi.org/10.1162/089976698300017197' },
    ],
  },
  en: {
    lede: 'The classic parametric tests compare a statistic with a known reference distribution: the normal, Student’s t or the χ². That reference is valid if certain assumptions about the data hold, above all independence.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`A temperature forecasting model should be right on average. Over 25 validation days, its mean error is +1.2 °C, with a standard deviation of 2.5 °C. Is that a real bias or noise? The t-test measures it in standard errors: $\mathrm{SE} = 2.5/\sqrt{25} = 0.5$ °C, so $t = 1.2/0.5 = 2.4$. If the model had no bias, a value that far from 0 would occur with probability 0.025 (two-sided [[hypothesis-testing|p-value]], with a Student t with 24 degrees of freedom).` },
          { key: 'Many test statistics (z, t, Wald) have the same form: (estimate − value under H₀) / standard error. What changes from one test to another is the reference distribution and the assumptions that justify it.' },
        ],
      },
      {
        id: 'statistics',
        title: 'The statistics',
        blocks: [
          { p: String.raw`For means, with $s$ the sample standard deviation:` },
          {
            list: [
              String.raw`**z:** $z = (\bar x - \mu_0)/(\sigma/\sqrt n)$, with known $\sigma$ or large $n$. Reference: $\mathcal{N}(0, 1)$. For a proportion, $z = (\hat p - p_0)/\sqrt{p_0(1-p_0)/n}$.`,
              String.raw`**One-sample t:** $t = (\bar x - \mu_0)/(s/\sqrt n)$. Reference: $t_{n-1}$. With small $n$ its critical values are larger than the normal ones: the two-sided 95% value is 2.78 with 4 degrees of freedom, against 1.96.`,
              String.raw`**Paired t:** the one-sample test applied to the differences $d_i = x_i - y_i$, when the same cases are measured twice.`,
              String.raw`**Welch’s t** (two independent samples): $t = (\bar x_1 - \bar x_2)/\sqrt{s_1^2/n_1 + s_2^2/n_2}$, with approximate degrees of freedom that do not require equal variances.`,
            ],
          },
          { p: String.raw`For counts, the $\chi^2$ statistic compares the observed frequencies, $O_k$, with those expected if H₀ were true, $E_k$:` },
          { math: String.raw`\chi^2 = \sum_{k} \frac{(O_k - E_k)^2}{E_k}` },
          { p: String.raw`In a goodness-of-fit test with $K$ categories and probabilities fixed in advance, the reference is $\chi^2_{K-1}$; to test independence in an $r \times c$ table, $\chi^2_{(r-1)(c-1)}$. The approximation is good if no expected frequency is small (usual rule: at least 5).` },
        ],
      },
      {
        id: 'example',
        title: 'An example with counts',
        blocks: [
          { p: 'A synthetic data generator should produce four classes equally often. In 200 samples you get 62, 45, 48 and 45, against 50 expected in each:' },
          { math: String.raw`\chi^2 = \frac{12^2 + 5^2 + 2^2 + 5^2}{50} = 3.96, \qquad p = P\big(\chi^2_3 \ge 3.96\big) = 0.27` },
          { p: 'The data are compatible with balanced classes, but that does not prove they are: with 200 samples, if one class came up 30% of the time instead of 25% and the other three shared the rest equally, this test would detect it in only one repetition out of four. See [[errors-power]].' },
        ],
      },
    ],
    pitfalls: [
      { claim: '“If the data are not normal, the t-test cannot be used.”', fix: 'With moderate or large samples, the central limit theorem makes the mean approximately normal and the t-test works well. What really matters is independence and the absence of extreme values that dominate the mean; with little and very skewed data, use a [[nonparametric-tests|nonparametric or permutation test]].' },
      { claim: '“Errors on consecutive days count as independent observations.”', fix: String.raw`If they are positively autocorrelated, as they usually are, $s/\sqrt n$ underestimates the standard error and the p-values come out too small. In the temperature example you would have to correct for the autocorrelation of the errors, or group the days into blocks.` },
      { claim: '“Student’s t with equal variances always works for comparing two groups.”', fix: 'If both the variances and the sizes differ, its false-positive rate can drift far from α: with 10 points with standard deviation 3 against 40 with standard deviation 1, it reaches 26% instead of 5%. Welch’s test does not assume equal variances and loses very little when they are equal.' },
      { claim: '“The χ² test can be applied to percentages, or with any sample size.”', fix: 'It needs counts of independent observations: with percentages, the value of the statistic depends on the scale you choose. And the approximation fails when expected frequencies are small; in that case, use an exact test: the exact multinomial test for goodness of fit, or Fisher’s test for contingency tables.' },
    ],
    dl: [
      { title: 'McNemar to compare two classifiers.', text: String.raw`If A and B are evaluated on the same examples, count how many only A gets right ($b$) and how many only B gets right ($c$). If H₀ is true, $(b-c)^2/(b+c)$ approximately follows a $\chi^2_1$: with $b = 30$ and $c = 15$ it equals 5.0 and $p = 0.025$, without continuity correction; the exact binomial test, statsmodels’ default, gives $p \approx 0.036$. Examples that both get right or both get wrong carry no information about the difference.` },
      { title: 'Several seeds per configuration.', text: 'Comparing the mean metrics of two configurations trained with several seeds is a two-sample t-test; use Welch’s. With 3 or 5 seeds per group, power is low and the normality assumption matters more.' },
      { title: 'Distribution shift.', text: 'A χ² comparing the frequency of each class, or of each category of a variable, in production and in training is a simple data-drift alarm. With millions of examples it will fire for irrelevant differences, so look at the size of the change too.' },
    ],
    quiz: [
      {
        prompt: String.raw`You have 25 observations with mean 10.8 and standard deviation 2, and you test $\mu = 10$. What is the t statistic?`,
        options: [{ text: '0.4' }, { text: '2', correct: true }, { text: '10' }],
        explain: String.raw`$t = (10.8 - 10)/(2/\sqrt{25}) = 0.8/0.4 = 2$. The value 0.4 divides by the standard deviation of the data instead of the standard error, and 10 divides by $s/n$ instead of $s/\sqrt n$.`,
      },
      {
        prompt: 'You evaluate two models on the same 1000 test examples. Which test is appropriate to compare their accuracies?',
        options: [
          { text: 'A z-test for two independent proportions.' },
          { text: 'A paired test, such as McNemar’s, based on the examples where they disagree.', correct: true },
          { text: 'A χ² goodness-of-fit test on each model’s correct answers.' },
        ],
        explain: 'The results are paired: each example is evaluated with both models. McNemar uses only the examples where they disagree, which are the ones that inform about the difference; treating the two accuracies as independent ignores that pairing.',
      },
      {
        prompt: 'When is the χ² approximation in a goodness-of-fit test doubtful?',
        options: [
          { text: 'When some expected frequency is small (below 5, as a usual rule).', correct: true },
          { text: 'When there are more than three categories.' },
          { text: 'When the observed frequencies are far from the expected ones.' },
        ],
        explain: 'The χ² distribution is a large-sample approximation, and it fails when there are cells with very few expected cases. Observed frequencies far from the expected ones are not a problem: that is exactly what the test detects.',
      },
    ],
    further: [
      { book: 'wilks', where: '§5.2.1–5.2.3 (one-sample t-test and tests for differences of means with independent and paired samples), §5.2.4 (means under serial dependence), §5.2.5 (goodness of fit: χ², Kolmogorov–Smirnov and Lilliefors) and §5.2.6 (likelihood ratio tests).' },
      { book: 'pml1', where: '§5.5.1 (likelihood ratio test) and §5.5.3 (null hypothesis significance testing and p-values).' },
      { book: 'pml2', where: '§3.10.3 (classic tests such as the t-test, ANOVA and χ², seen as inference in linear models).' },
    ],
    extra: [
      { text: 'Student (1908). The Probable Error of a Mean. Biometrika, 6(1), 1–25.', url: 'https://doi.org/10.1093/biomet/6.1.1' },
      { text: 'Dietterich, T. G. (1998). Approximate Statistical Tests for Comparing Supervised Classification Learning Algorithms. Neural Computation, 10(7), 1895–1923.', url: 'https://doi.org/10.1162/089976698300017197' },
    ],
  },
};

export default content;
