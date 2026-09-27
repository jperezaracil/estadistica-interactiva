import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Un estimador es la regla con la que conviertes una muestra en una estimación de un parámetro. Se juzga por cómo se comporta sobre todas las muestras posibles: cuánto se desvía en promedio (sesgo) y cuánto fluctúa de una muestra a otra (varianza).',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Con una muestra calculas un número que aproxima una cantidad desconocida: la media muestral para la media de la población, o la accuracy en test para la accuracy real de un modelo. La regla de cálculo es el estimador, y el número que sale, la estimación. Como la muestra es aleatoria, la estimación también lo es: con otra muestra saldría otro número.' },
          { p: 'Hay dos maneras de equivocarse, como con dos básculas defectuosas: una marca siempre unos 50 g de más; la otra acierta en promedio, pero cada lectura se desvía bastante hacia un lado u otro. La primera tiene **sesgo**, un error sistemático; la segunda tiene mucha **varianza**, un error que cambia de una medida a otra.' },
          { key: 'Un estimador se evalúa por lo que haría con todas las muestras que podrías haber obtenido, no por el valor que da con la tuya. El error cuadrático medio reúne las dos fuentes de error: el sesgo al cuadrado más la varianza.' },
        ],
      },
      {
        id: 'definicion',
        title: 'Definiciones',
        blocks: [
          { p: String.raw`Sea $\hat\theta$ un estimador del parámetro $\theta$. Las esperanzas se calculan sobre las muestras posibles, con $\theta$ fijo:` },
          { math: String.raw`\operatorname{sesgo}(\hat\theta) = \mathbb{E}[\hat\theta] - \theta, \qquad \operatorname{Var}(\hat\theta) = \mathbb{E}\big[(\hat\theta - \mathbb{E}[\hat\theta])^2\big]` },
          { p: String.raw`El error cuadrático medio (ECM; en inglés, MSE) es la distancia cuadrática media al valor real, y se descompone exactamente en esas dos partes:` },
          { math: String.raw`\operatorname{ECM}(\hat\theta) = \mathbb{E}\big[(\hat\theta - \theta)^2\big] = \operatorname{sesgo}(\hat\theta)^2 + \operatorname{Var}(\hat\theta)` },
          { p: String.raw`El estimador es **insesgado** si su sesgo es cero, y **consistente** si se acerca a $\theta$ (en probabilidad) al crecer $n$; para esto basta con que el ECM tienda a cero. La raíz de la varianza es el error estándar, que resume la [[sampling-distribution|distribución muestral]] del estimador.` },
        ],
      },
      {
        id: 'ejemplo',
        title: 'Tres estimadores de la varianza',
        blocks: [
          { p: String.raw`Con $n$ datos normales, sea $S = \sum_i (x_i - \bar x)^2$. Dividir $S$ entre $n-1$, entre $n$ (el [[mle|EMV]]) o entre $n+1$ da tres estimadores de $\sigma^2$. Con $n = 5$ y $\sigma^2 = 1$:` },
          {
            table: {
              head: ['Divisor', 'Sesgo', 'Varianza', 'ECM'],
              rows: [
                [String.raw`$n-1 = 4$`, '0', '0,500', '0,500'],
                [String.raw`$n = 5$`, '−0,200', '0,320', '0,360'],
                [String.raw`$n+1 = 6$`, '−0,333', '0,222', '0,333'],
              ],
              numeric: [1, 2, 3],
            },
          },
          { p: String.raw`El único insesgado es el que peor ECM tiene. Dividir entre $n+1$ acepta un sesgo a la baja a cambio de bastante menos varianza, y con datos normales es el que minimiza el ECM entre todos los que dividen $S$ entre una constante. Es el **compromiso sesgo-varianza**, y la [[regularization|regularización]] aplica la misma idea a los parámetros de un modelo.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Un estimador insesgado siempre es preferible a uno sesgado.»', fix: String.raw`No necesariamente: puede tener tanta varianza que uno ligeramente sesgado quede, en promedio, más cerca del valor real. En la tabla, dividir entre $n+1$ gana en ECM a dividir entre $n-1$.` },
      { claim: '«Si mi estimación coincide con el valor real, el estimador es insesgado.»', fix: 'El sesgo es una propiedad del procedimiento, promediada sobre todas las muestras posibles. Una estimación concreta puede acertar por suerte con un estimador sesgado, o fallar con uno insesgado.' },
      { claim: String.raw`«Si $s^2$ es insesgado para $\sigma^2$, $s$ es insesgado para $\sigma$.»`, fix: String.raw`El sesgo no se conserva con transformaciones no lineales. Como la raíz cuadrada es cóncava, $s$ subestima $\sigma$ en promedio: con 5 datos normales, $\mathbb{E}[s] \approx 0{,}940\,\sigma$.` },
      { claim: '«Con más datos, cualquier estimador acaba acertando.»', fix: 'Más datos reducen la varianza, pero no un sesgo que no depende del tamaño de la muestra. Si estimas la accuracy de un modelo que se usará de día y de noche con imágenes solo diurnas, añadir más imágenes diurnas reduce el error estándar, pero no el sesgo.' },
    ],
    dl: [
      { title: 'Sesgo y varianza de un modelo.', text: String.raw`La misma descomposición se aplica a las predicciones: con pérdida cuadrática, el error esperado en un punto es el sesgo al cuadrado, más la varianza (entre los conjuntos de entrenamiento posibles), más el ruido irreducible. Los modelos muy flexibles tienen poco sesgo y mucha varianza, y la regularización y los ensembles reducen la varianza. En redes muy sobreparametrizadas el error de test no siempre dibuja la clásica curva en U (doble descenso), pero la descomposición sigue siendo válida.` },
      { title: 'La corrección de sesgo de Adam.', text: String.raw`Adam estima la media y el segundo momento de los gradientes con medias móviles exponenciales que empiezan en cero, así que al principio están sesgadas hacia cero. Por eso las divide entre $1 - \beta^t$: sin esa corrección, tras 10 pasos con $\beta_2 = 0{,}999$, la estimación del segundo momento valdría en promedio un 1 % de su valor real (si la escala de los gradientes se mantiene estable).` },
      { title: 'Elegir con el test sesga la estimación.', text: 'La accuracy en test es un estimador insesgado de la accuracy real si el test es una muestra representativa y no se ha usado para decidir nada. Si comparas varios modelos y te quedas con el que mejor sale, su resultado tiene un sesgo optimista: el máximo de varias estimaciones ruidosas tiende a pasarse. Por eso se elige con validación y se informa con un test aparte: ver [[cross-validation]].' },
    ],
    quiz: [
      {
        prompt: 'Un estimador tiene un sesgo de 0,3 y una varianza de 0,16. ¿Cuál es su error cuadrático medio?',
        options: [{ text: '0,16' }, { text: '0,25', correct: true }, { text: '0,46' }],
        explain: String.raw`$\text{ECM} = \text{sesgo}^2 + \text{varianza} = 0{,}09 + 0{,}16 = 0{,}25$. La opción 0,46 suma el sesgo sin elevarlo al cuadrado, y 0,16 lo ignora.`,
      },
      {
        prompt: String.raw`¿Qué afirmación sobre la media muestral $\bar x$ de $n$ datos independientes con media $\mu$ y varianza $\sigma^2$ es correcta?`,
        options: [
          { text: String.raw`Es insesgada y su varianza es $\sigma^2/n$.`, correct: true },
          { text: String.raw`Es insesgada y su varianza es $\sigma^2$.` },
          { text: String.raw`Es sesgada, aunque el sesgo desaparece al crecer $n$.` },
        ],
        explain: String.raw`$\mathbb{E}[\bar x] = \mu$ por la linealidad de la esperanza, y $\operatorname{Var}(\bar x) = n\sigma^2/n^2 = \sigma^2/n$, porque la varianza de una suma de variables independientes es la suma de sus varianzas. Como su ECM tiende a cero, además es consistente.`,
      },
      {
        prompt: 'El estimador A es insesgado y tiene varianza 4. El estimador B tiene sesgo 1 y varianza 1. ¿Cuál tiene menor ECM?',
        options: [
          { text: 'A, porque es insesgado.' },
          { text: 'B: su ECM es 2, frente a 4.', correct: true },
          { text: 'Tienen el mismo ECM.' },
        ],
        explain: String.raw`$\text{ECM}_A = 0 + 4 = 4$ y $\text{ECM}_B = 1^2 + 1 = 2$. Un poco de sesgo compensa si reduce mucho la varianza.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§4.7.6 (sesgo y varianza de un estimador, cota de Cramér-Rao, compromiso sesgo-varianza y ejemplos con estimación MAP) y §5.3.1–5.3.2 (el riesgo de un estimador, con el ECM como caso particular, y la consistencia).' },
      { book: 'wilks', where: '§4.6.1 (el EMV de la desviación típica normal tiende a quedarse corto) y la introducción de §7.5 (descomposición del ECM en varianza y sesgo al cuadrado, y por qué un estimador sesgado puede ser más preciso).' },
    ],
    extra: [
      { text: 'Geman, S., Bienenstock, E. y Doursat, R. (1992). Neural Networks and the Bias/Variance Dilemma. Neural Computation, 4(1), 1–58.', url: 'https://doi.org/10.1162/neco.1992.4.1.1' },
    ],
  },
  en: {
    lede: 'An estimator is the rule you use to turn a sample into an estimate of a parameter. It is judged by how it behaves over all possible samples: how far off it is on average (bias) and how much it fluctuates from sample to sample (variance).',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'From a sample you compute a number that approximates an unknown quantity: the sample mean for the population mean, or test accuracy for a model’s true accuracy. The rule is the estimator, and the number it produces is the estimate. Since the sample is random, so is the estimate: another sample would give another number.' },
          { p: 'There are two ways to be wrong, as with two faulty scales: one always reads about 50 g too much; the other is right on average, but each reading strays quite a bit in one direction or the other. The first has **bias**, a systematic error; the second has high **variance**, an error that changes from one reading to the next.' },
          { key: 'An estimator is assessed by what it would do with every sample you could have obtained, not by the value it gives with yours. The mean squared error combines both sources of error: squared bias plus variance.' },
        ],
      },
      {
        id: 'definition',
        title: 'Definitions',
        blocks: [
          { p: String.raw`Let $\hat\theta$ be an estimator of the parameter $\theta$. Expectations are taken over the possible samples, with $\theta$ fixed:` },
          { math: String.raw`\operatorname{bias}(\hat\theta) = \mathbb{E}[\hat\theta] - \theta, \qquad \operatorname{Var}(\hat\theta) = \mathbb{E}\big[(\hat\theta - \mathbb{E}[\hat\theta])^2\big]` },
          { p: String.raw`The mean squared error (MSE) is the average squared distance to the true value, and it splits exactly into those two parts:` },
          { math: String.raw`\operatorname{MSE}(\hat\theta) = \mathbb{E}\big[(\hat\theta - \theta)^2\big] = \operatorname{bias}(\hat\theta)^2 + \operatorname{Var}(\hat\theta)` },
          { p: String.raw`The estimator is **unbiased** if its bias is zero, and **consistent** if it approaches $\theta$ (in probability) as $n$ grows; an MSE that tends to zero is enough for that. The square root of the variance is the standard error, which summarizes the estimator’s [[sampling-distribution|sampling distribution]].` },
        ],
      },
      {
        id: 'example',
        title: 'Three variance estimators',
        blocks: [
          { p: String.raw`With $n$ normal data points, let $S = \sum_i (x_i - \bar x)^2$. Dividing $S$ by $n-1$, by $n$ (the [[mle|MLE]]) or by $n+1$ gives three estimators of $\sigma^2$. With $n = 5$ and $\sigma^2 = 1$:` },
          {
            table: {
              head: ['Divisor', 'Bias', 'Variance', 'MSE'],
              rows: [
                [String.raw`$n-1 = 4$`, '0', '0.500', '0.500'],
                [String.raw`$n = 5$`, '−0.200', '0.320', '0.360'],
                [String.raw`$n+1 = 6$`, '−0.333', '0.222', '0.333'],
              ],
              numeric: [1, 2, 3],
            },
          },
          { p: String.raw`The only unbiased one has the worst MSE. Dividing by $n+1$ accepts a downward bias in exchange for much less variance, and with normal data it minimizes the MSE among all estimators that divide $S$ by a constant. This is the **bias–variance trade-off**, and [[regularization|regularization]] applies the same idea to the parameters of a model.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“An unbiased estimator is always better than a biased one.”', fix: String.raw`Not necessarily: it can have so much variance that a slightly biased one ends up, on average, closer to the true value. In the table, dividing by $n+1$ beats dividing by $n-1$ in MSE.` },
      { claim: '“If my estimate matches the true value, the estimator is unbiased.”', fix: 'Bias is a property of the procedure, averaged over all possible samples. A particular estimate can be right by luck with a biased estimator, or wrong with an unbiased one.' },
      { claim: String.raw`“If $s^2$ is unbiased for $\sigma^2$, then $s$ is unbiased for $\sigma$.”`, fix: String.raw`Bias is not preserved by nonlinear transformations. Since the square root is concave, $s$ underestimates $\sigma$ on average: with 5 normal data points, $\mathbb{E}[s] \approx 0.940\,\sigma$.` },
      { claim: '“With more data, any estimator ends up right.”', fix: 'More data reduce the variance, but not a bias that does not depend on the sample size. If you estimate the accuracy of a model that will run day and night using daytime images only, adding more daytime images shrinks the standard error but not the bias.' },
    ],
    dl: [
      { title: 'Bias and variance of a model.', text: String.raw`The same decomposition applies to predictions: with squared loss, the expected error at a point is the squared bias, plus the variance (across possible training sets), plus the irreducible noise. Very flexible models have low bias and high variance, and regularization and ensembles reduce the variance. In heavily overparameterized networks the test error does not always trace the classic U-shaped curve (double descent), but the decomposition still holds.` },
      { title: 'Adam’s bias correction.', text: String.raw`Adam estimates the mean and the second moment of the gradients with exponential moving averages that start at zero, so early on they are biased towards zero. That is why it divides them by $1 - \beta^t$: without that correction, after 10 steps with $\beta_2 = 0.999$, the second-moment estimate would on average be 1% of its true value (if the scale of the gradients stays stable).` },
      { title: 'Selecting on the test set biases the estimate.', text: 'Test accuracy is an unbiased estimator of true accuracy if the test set is a representative sample and has not been used to decide anything. If you compare several models and keep the one that scores best, its score is optimistically biased: the maximum of several noisy estimates tends to overshoot. That is why you select with validation and report on a separate test set: see [[cross-validation]].' },
    ],
    quiz: [
      {
        prompt: 'An estimator has a bias of 0.3 and a variance of 0.16. What is its mean squared error?',
        options: [{ text: '0.16' }, { text: '0.25', correct: true }, { text: '0.46' }],
        explain: String.raw`$\text{MSE} = \text{bias}^2 + \text{variance} = 0.09 + 0.16 = 0.25$. The option 0.46 adds the bias without squaring it, and 0.16 ignores it.`,
      },
      {
        prompt: String.raw`Which statement about the sample mean $\bar x$ of $n$ independent data points with mean $\mu$ and variance $\sigma^2$ is correct?`,
        options: [
          { text: String.raw`It is unbiased and its variance is $\sigma^2/n$.`, correct: true },
          { text: String.raw`It is unbiased and its variance is $\sigma^2$.` },
          { text: String.raw`It is biased, although the bias vanishes as $n$ grows.` },
        ],
        explain: String.raw`$\mathbb{E}[\bar x] = \mu$ by linearity of expectation, and $\operatorname{Var}(\bar x) = n\sigma^2/n^2 = \sigma^2/n$, because the variance of a sum of independent variables is the sum of their variances. Since its MSE tends to zero, it is also consistent.`,
      },
      {
        prompt: 'Estimator A is unbiased with variance 4. Estimator B has bias 1 and variance 1. Which one has the lower MSE?',
        options: [
          { text: 'A, because it is unbiased.' },
          { text: 'B: its MSE is 2, against 4.', correct: true },
          { text: 'They have the same MSE.' },
        ],
        explain: String.raw`$\text{MSE}_A = 0 + 4 = 4$ and $\text{MSE}_B = 1^2 + 1 = 2$. A little bias pays off if it cuts the variance a lot.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§4.7.6 (bias and variance of an estimator, the Cramér–Rao bound, the bias–variance trade-off and examples with MAP estimation) and §5.3.1–5.3.2 (the risk of an estimator, with the MSE as a special case, and consistency).' },
      { book: 'wilks', where: '§4.6.1 (the MLE of a normal standard deviation tends to fall short) and the introduction to §7.5 (the MSE as variance plus squared bias, and why a biased estimator can be more accurate).' },
    ],
    extra: [
      { text: 'Geman, S., Bienenstock, E. and Doursat, R. (1992). Neural Networks and the Bias/Variance Dilemma. Neural Computation, 4(1), 1–58.', url: 'https://doi.org/10.1162/neco.1992.4.1.1' },
    ],
  },
};

export default content;
