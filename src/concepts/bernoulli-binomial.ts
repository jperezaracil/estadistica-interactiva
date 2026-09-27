import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'La Bernoulli describe un único ensayo con dos resultados, éxito o fracaso; la binomial cuenta los éxitos en $n$ ensayos independientes con la misma probabilidad. Modelan la salida sigmoide de un clasificador binario y el número de aciertos en un conjunto de test.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Cada ejemplo de un conjunto de test es un pequeño experimento: tu clasificador acierta o falla. Si su exactitud real es del 90 % y los ejemplos son independientes, cada predicción es un ensayo de Bernoulli con $p = 0{,}9$, y el número de aciertos en 100 ejemplos sigue una binomial. En promedio acertará 90, pero más del 95 % de las veces el recuento caerá en algún punto entre 84 y 95, sin que el modelo haya cambiado.` },
          { key: String.raw`Bernoulli: un ensayo con dos resultados y un solo parámetro, la probabilidad de éxito $p$. Binomial: el número de éxitos en $n$ ensayos independientes con la misma $p$, es decir, una suma de $n$ variables de Bernoulli.` },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { p: String.raw`Una variable de Bernoulli vale 1 (éxito) con probabilidad $p$ y 0 (fracaso) con probabilidad $1-p$. En una sola fórmula, $P(X = x) = p^{x}(1-p)^{1-x}$ para $x \in \{0, 1\}$; su media es $p$ y su varianza, $p(1-p)$. Si $X$ cuenta los éxitos en $n$ de estos ensayos, $X \sim \text{Bin}(n, p)$:` },
          { math: String.raw`P(X = k) = \binom{n}{k}\, p^{k}(1-p)^{n-k}, \qquad k = 0, 1, \dots, n` },
          { p: String.raw`El coeficiente binomial $\binom{n}{k}$ cuenta cuántas secuencias de resultados tienen exactamente $k$ éxitos. Como $X$ es una suma de $n$ Bernoulli independientes, su media y su varianza son $n$ veces las de un ensayo: $\mathbb{E}[X] = np$ y $\operatorname{Var}(X) = np(1-p)$. La varianza es máxima con $p = 0{,}5$ y nula si $p$ vale 0 o 1. El modelo exige tres condiciones:` },
          {
            list: [
              String.raw`**Número de ensayos fijo:** $n$ no depende de los resultados.`,
              '**Independencia:** el resultado de un ensayo no cambia la probabilidad de los demás.',
              String.raw`**Probabilidad constante:** la misma $p$ en todos los ensayos.`,
            ],
          },
        ],
      },
      {
        id: 'exactitud',
        title: 'Cuánto varía una exactitud medida',
        blocks: [
          { p: String.raw`La exactitud observada es la proporción de aciertos, $\hat p = X/n$. Al dividir por $n$, la varianza se divide por $n^2$, así que su desviación típica es:` },
          { math: String.raw`\sigma_{\hat p} = \sqrt{\frac{p(1-p)}{n}}` },
          {
            table: {
              head: ['Ejemplos de test', String.raw`Desviación típica de $\hat p$`, String.raw`Rango de $\hat p$ (95 %)`],
              rows: [
                ['100', '3,0 puntos', '84 %–95 %'],
                ['1000', '0,95 puntos', '88,1 %–91,8 %'],
                ['10 000', '0,30 puntos', '89,4 %–90,6 %'],
              ],
              numeric: [0, 1, 2],
            },
          },
          { p: String.raw`La tabla supone una exactitud real del 90 %; la última columna deja como mucho un 2,5 % de probabilidad a cada lado y está calculada con la binomial exacta. Para reducir la desviación típica a la mitad hacen falta cuatro veces más ejemplos. Cuando $np$ y $n(1-p)$ son grandes, la binomial se parece a una [[gaussian|normal]] con la misma media y varianza; cuando $n$ es grande y $p$ pequeña, a una [[poisson|Poisson]] de media $np$.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Si la probabilidad de éxito es 0,9, en 10 intentos saldrán 9 éxitos.»', fix: String.raw`Nueve es el valor esperado, no un resultado garantizado. Con $\text{Bin}(10;\ 0{,}9)$, $P(X = 9) \approx 0{,}387$, $P(X = 10) \approx 0{,}349$ y $P(X \le 8) \approx 0{,}264$.` },
      { claim: '«Cualquier recuento de éxitos sigue una binomial.»', fix: String.raw`Hacen falta independencia y la misma probabilidad en cada ensayo. Si el test contiene muchos fotogramas del mismo vídeo o varias imágenes del mismo paciente, los aciertos están correlacionados, la varianza real supera $np(1-p)$ y la barra de error binomial se queda corta.` },
      { claim: '«Los sucesos raros tienen poca varianza, así que su tasa se estima con precisión.»', fix: String.raw`La varianza absoluta $p(1-p)$ es pequeña, pero el error relativo crece: $\sigma_{\hat p}/p = \sqrt{(1-p)/(np)}$. Para estimar una tasa de error del 1 % con un error relativo del 10 % hacen falta unos 9900 ejemplos.` },
      { claim: '«Una salida sigmoide de 0,8 significa que el ejemplo es positivo con probabilidad 0,8.»', fix: 'Es el parámetro de la Bernoulli que predice el modelo. Solo coincide con la frecuencia real de positivos si el modelo está calibrado, y las redes profundas suelen pecar de exceso de confianza: ver [[calibration]].' },
    ],
    dl: [
      { title: 'Salida sigmoide y entropía cruzada binaria.', text: String.raw`Un clasificador binario produce un logit $a$ y lo convierte en $p = \sigma(a)$, el parámetro de una Bernoulli. La entropía cruzada binaria, $-[y \log p + (1-y)\log(1-p)]$, es exactamente su [[mle|log-verosimilitud negativa]]. En clasificación multietiqueta se usa una Bernoulli independiente por etiqueta. Conviene pasar los logits directamente a la pérdida (por ejemplo, BCEWithLogitsLoss en PyTorch), que la calcula de forma numéricamente estable.` },
      { title: 'Dropout.', text: String.raw`Durante el entrenamiento, cada unidad se anula con probabilidad $p$ según una máscara de Bernoulli independiente, y las que sobreviven se multiplican por $1/(1-p)$ para que la activación esperada no cambie: con $p = 0{,}5$, se duplican. En inferencia no se aplica ninguna máscara. Es la convención de PyTorch; en Srivastava et al. (2014), $p$ es la probabilidad de conservar la unidad y el reescalado se hace en test.` },
      { title: 'Barras de error en evaluación.', text: String.raw`Si los ejemplos de test son independientes, el número de aciertos es binomial y la exactitud medida tiene una desviación típica de $\sqrt{p(1-p)/n}$: casi un punto con 1000 ejemplos y una exactitud del 90 %. Una mejora de unas décimas en un test así no es concluyente por sí sola; para comparar dos modelos sobre los mismos ejemplos, usa un contraste pareado, por ejemplo de [[nonparametric-tests|permutación]], o el [[bootstrap|bootstrap]].` },
    ],
    quiz: [
      {
        prompt: 'Un clasificador con una exactitud real de 0,8 se evalúa en 400 ejemplos independientes. ¿Cuál es la desviación típica del número de aciertos?',
        options: [{ text: '64' }, { text: '8', correct: true }, { text: '320' }],
        explain: String.raw`$\sqrt{np(1-p)} = \sqrt{400 \cdot 0{,}8 \cdot 0{,}2} = \sqrt{64} = 8$. 64 es la varianza y 320, la media.`,
      },
      {
        prompt: '¿Cuál de estas condiciones **no** hace falta para que un recuento de éxitos sea binomial?',
        options: [
          { text: 'Que la probabilidad de éxito esté cerca de 0,5.', correct: true },
          { text: 'Que los ensayos sean independientes.' },
          { text: 'Que la probabilidad de éxito sea la misma en todos los ensayos.' },
        ],
        explain: String.raw`La binomial vale para cualquier $p$ entre 0 y 1. Lo que exige es un número fijo de ensayos, independencia y la misma $p$ en todos.`,
      },
      {
        prompt: 'La entropía cruzada binaria que se usa con una salida sigmoide es:',
        options: [
          { text: 'El error cuadrático entre la etiqueta y la probabilidad predicha.' },
          { text: 'La log-verosimilitud negativa de una normal.' },
          { text: 'La log-verosimilitud negativa de una Bernoulli.', correct: true },
        ],
        explain: String.raw`Con $P(y \mid p) = p^{y}(1-p)^{1-y}$, se tiene $-\log P(y \mid p) = -[y \log p + (1-y)\log(1-p)]$, que es la entropía cruzada binaria.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§2.4.1 (definición de la Bernoulli y la binomial), §2.4.2 (función sigmoide y log-odds) y §2.4.3 (regresión logística binaria como Bernoulli condicionada a la entrada).' },
      { book: 'wilks', where: '§4.2.1 (distribución binomial: condiciones de aplicación y ajuste a datos) y §4.3 (esperanza y varianza, con una tabla que reúne la media y la varianza de las distribuciones discretas).' },
    ],
    extra: [
      { text: 'Srivastava, N. et al. (2014). Dropout: A Simple Way to Prevent Neural Networks from Overfitting. Journal of Machine Learning Research, 15(56), 1929–1958.', url: 'https://jmlr.org/papers/v15/srivastava14a.html' },
    ],
  },
  en: {
    lede: 'The Bernoulli distribution describes a single trial with two outcomes, success or failure; the binomial counts the successes in $n$ independent trials with the same probability. They model the sigmoid output of a binary classifier and the number of correct predictions on a test set.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`Each example in a test set is a small experiment: your classifier is either right or wrong. If its true accuracy is 90% and the examples are independent, each prediction is a Bernoulli trial with $p = 0.9$, and the number of correct predictions on 100 examples follows a binomial distribution. On average it will get 90 right, but more than 95% of the time the count will land somewhere between 84 and 95, without the model having changed at all.` },
          { key: String.raw`Bernoulli: one trial with two outcomes and a single parameter, the probability of success $p$. Binomial: the number of successes in $n$ independent trials with the same $p$, that is, a sum of $n$ Bernoulli variables.` },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { p: String.raw`A Bernoulli variable equals 1 (success) with probability $p$ and 0 (failure) with probability $1-p$. In a single formula, $P(X = x) = p^{x}(1-p)^{1-x}$ for $x \in \{0, 1\}$; its mean is $p$ and its variance $p(1-p)$. If $X$ counts the successes in $n$ such trials, $X \sim \text{Bin}(n, p)$:` },
          { math: String.raw`P(X = k) = \binom{n}{k}\, p^{k}(1-p)^{n-k}, \qquad k = 0, 1, \dots, n` },
          { p: String.raw`The binomial coefficient $\binom{n}{k}$ counts how many sequences of outcomes have exactly $k$ successes. Since $X$ is a sum of $n$ independent Bernoulli variables, its mean and variance are $n$ times those of one trial: $\mathbb{E}[X] = np$ and $\operatorname{Var}(X) = np(1-p)$. The variance is largest at $p = 0.5$ and zero when $p$ is 0 or 1. The model requires three conditions:` },
          {
            list: [
              String.raw`**Fixed number of trials:** $n$ does not depend on the outcomes.`,
              '**Independence:** the outcome of one trial does not change the probability of the others.',
              String.raw`**Constant probability:** the same $p$ in every trial.`,
            ],
          },
        ],
      },
      {
        id: 'accuracy',
        title: 'How much a measured accuracy varies',
        blocks: [
          { p: String.raw`The observed accuracy is the proportion of correct predictions, $\hat p = X/n$. Dividing by $n$ divides the variance by $n^2$, so its standard deviation is:` },
          { math: String.raw`\sigma_{\hat p} = \sqrt{\frac{p(1-p)}{n}}` },
          {
            table: {
              head: ['Test examples', String.raw`Standard deviation of $\hat p$`, String.raw`Range of $\hat p$ (95%)`],
              rows: [
                ['100', '3.0 points', '84%–95%'],
                ['1000', '0.95 points', '88.1%–91.8%'],
                ['10,000', '0.30 points', '89.4%–90.6%'],
              ],
              numeric: [0, 1, 2],
            },
          },
          { p: String.raw`The table assumes a true accuracy of 90%; the last column leaves at most 2.5% probability on each side and is computed with the exact binomial. Halving the standard deviation takes four times as many examples. When $np$ and $n(1-p)$ are large, the binomial looks like a [[gaussian|normal distribution]] with the same mean and variance; when $n$ is large and $p$ small, like a [[poisson|Poisson distribution]] with mean $np$.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“If the probability of success is 0.9, 10 attempts will give 9 successes.”', fix: String.raw`Nine is the expected value, not a guaranteed outcome. With $\text{Bin}(10, 0.9)$, $P(X = 9) \approx 0.387$, $P(X = 10) \approx 0.349$ and $P(X \le 8) \approx 0.264$.` },
      { claim: '“Any count of successes follows a binomial distribution.”', fix: String.raw`It needs independence and the same probability in every trial. If the test set contains many frames from the same video or several images from the same patient, the correct predictions are correlated, the true variance exceeds $np(1-p)$ and the binomial error bar is too narrow.` },
      { claim: '“Rare events have little variance, so their rate is estimated precisely.”', fix: String.raw`The absolute variance $p(1-p)$ is small, but the relative error grows: $\sigma_{\hat p}/p = \sqrt{(1-p)/(np)}$. Estimating an error rate of 1% with a relative error of 10% takes about 9900 examples.` },
      { claim: '“A sigmoid output of 0.8 means the example is positive with probability 0.8.”', fix: 'It is the parameter of the Bernoulli distribution the model predicts. It matches the actual frequency of positives only if the model is calibrated, and deep networks tend to be overconfident: see [[calibration]].' },
    ],
    dl: [
      { title: 'Sigmoid output and binary cross-entropy.', text: String.raw`A binary classifier produces a logit $a$ and turns it into $p = \sigma(a)$, the parameter of a Bernoulli distribution. The binary cross-entropy, $-[y \log p + (1-y)\log(1-p)]$, is exactly its [[mle|negative log-likelihood]]. Multi-label classification uses one independent Bernoulli per label. It is best to pass the logits straight to the loss (for example, BCEWithLogitsLoss in PyTorch), which computes it in a numerically stable way.` },
      { title: 'Dropout.', text: String.raw`During training, each unit is zeroed with probability $p$ according to an independent Bernoulli mask, and the surviving units are multiplied by $1/(1-p)$ so that the expected activation does not change: with $p = 0.5$, they are doubled. No mask is applied at inference time. This is the PyTorch convention; in Srivastava et al. (2014), $p$ is the probability of keeping a unit and the rescaling is done at test time.` },
      { title: 'Error bars in evaluation.', text: String.raw`If the test examples are independent, the number of correct predictions is binomial and the measured accuracy has a standard deviation of $\sqrt{p(1-p)/n}$: almost one point with 1000 examples and 90% accuracy. An improvement of a few tenths on such a test set is not conclusive on its own; to compare two models on the same examples, use a paired test, for example a [[nonparametric-tests|permutation test]], or the [[bootstrap|bootstrap]].` },
    ],
    quiz: [
      {
        prompt: 'A classifier with a true accuracy of 0.8 is evaluated on 400 independent examples. What is the standard deviation of the number of correct predictions?',
        options: [{ text: '64' }, { text: '8', correct: true }, { text: '320' }],
        explain: String.raw`$\sqrt{np(1-p)} = \sqrt{400 \cdot 0.8 \cdot 0.2} = \sqrt{64} = 8$. 64 is the variance and 320 the mean.`,
      },
      {
        prompt: 'Which of these conditions is **not** needed for a count of successes to be binomial?',
        options: [
          { text: 'The probability of success must be close to 0.5.', correct: true },
          { text: 'The trials must be independent.' },
          { text: 'The probability of success must be the same in every trial.' },
        ],
        explain: String.raw`The binomial works for any $p$ between 0 and 1. What it requires is a fixed number of trials, independence and the same $p$ in all of them.`,
      },
      {
        prompt: 'The binary cross-entropy used with a sigmoid output is:',
        options: [
          { text: 'The squared error between the label and the predicted probability.' },
          { text: 'The negative log-likelihood of a normal distribution.' },
          { text: 'The negative log-likelihood of a Bernoulli distribution.', correct: true },
        ],
        explain: String.raw`With $P(y \mid p) = p^{y}(1-p)^{1-y}$, we get $-\log P(y \mid p) = -[y \log p + (1-y)\log(1-p)]$, which is the binary cross-entropy.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§2.4.1 (definition of the Bernoulli and binomial distributions), §2.4.2 (sigmoid function and log-odds) and §2.4.3 (binary logistic regression as a Bernoulli conditioned on the input).' },
      { book: 'wilks', where: '§4.2.1 (binomial distribution: conditions for its use and fitting it to data) and §4.3 (expected value and variance, with a table of the means and variances of the discrete distributions).' },
    ],
    extra: [
      { text: 'Srivastava, N. et al. (2014). Dropout: A Simple Way to Prevent Neural Networks from Overfitting. Journal of Machine Learning Research, 15(56), 1929–1958.', url: 'https://jmlr.org/papers/v15/srivastava14a.html' },
    ],
  },
};

export default content;
