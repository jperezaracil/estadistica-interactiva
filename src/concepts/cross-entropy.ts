import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: String.raw`La entropía cruzada $H(p, q)$ es la sorpresa media que te llevas cuando los resultados siguen $p$ pero tú les asignas probabilidades con un modelo $q$. Con etiquetas one-hot se reduce a menos el logaritmo de la probabilidad asignada a la clase correcta: es la pérdida estándar de clasificación.`,
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Un servicio meteorológico da cada día una probabilidad de lluvia. Si dice 90 % y llueve, la sorpresa es pequeña, $-\log_2 0{,}9 \approx 0{,}152$ bits; si no llueve, es grande, $-\log_2 0{,}1 \approx 3{,}32$ bits. La entropía cruzada promedia esas sorpresas según lo que ocurre de verdad. Si llueve el 30 % de los días, quien anuncia siempre un 30 % obtiene de media 0,881 bits, que es la [[entropy|entropía]] de la lluvia; quien anuncia un 50 % obtiene 1 bit, y quien anuncia un 10 %, 1,103 bits.` },
          { key: String.raw`La entropía cruzada nunca es menor que la entropía: $H(p, q) \ge H(p)$, con igualdad solo si $q = p$. Lo que sobra es el precio de usar un modelo equivocado.` },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { p: String.raw`Para distribuciones discretas $p$ (la real) y $q$ (el modelo):` },
          { math: String.raw`H(p, q) = -\sum_x p(x)\,\log q(x) = H(p) + \mathrm{KL}(p \,\Vert\, q)` },
          { p: String.raw`El sobrecoste es la [[kl-divergence|divergencia KL]]. Como $H(p)$ no depende de $q$, minimizar la entropía cruzada respecto a $q$ es minimizar la KL.` },
          {
            list: [
              String.raw`**Clasificación:** con una etiqueta one-hot, $p$ pone toda la masa en la clase correcta $y$, y $H(p, q) = -\log q(y)$. Promediada sobre los datos es la log-verosimilitud negativa media: entrenar con ella es hacer [[mle|máxima verosimilitud]].`,
              String.raw`**Caso binario:** $-\big[y \log q + (1 - y)\log(1 - q)\big]$, con $q$ la probabilidad predicha de la clase 1.`,
            ],
          },
        ],
      },
      {
        id: 'ejemplo',
        title: 'La pérdida, predicción a predicción',
        blocks: [
          { p: 'Hay tres clases y la correcta es la primera. Con etiqueta one-hot, la pérdida solo depende de la probabilidad que recibe la clase correcta:' },
          {
            table: {
              head: [String.raw`Predicción $q$`, 'Probabilidad de la clase correcta', 'Pérdida (nats)'],
              rows: [
                [String.raw`$[0{,}7;\ 0{,}2;\ 0{,}1]$`, '0,7', '0,357'],
                [String.raw`$[\tfrac13;\ \tfrac13;\ \tfrac13]$`, '0,333', '1,099'],
                [String.raw`$[0{,}2;\ 0{,}7;\ 0{,}1]$`, '0,2', '1,609'],
                [String.raw`$[0{,}01;\ 0{,}98;\ 0{,}01]$`, '0,01', '4,605'],
              ],
              numeric: [1, 2],
            },
          },
          { p: String.raw`Un error cometido con mucha seguridad cuesta mucho más que una duda: la pérdida crece sin límite cuando $q(y) \to 0$. Por eso la entropía cruzada castiga el exceso de confianza.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«La entropía cruzada es simétrica.»', fix: String.raw`No: $p$ pondera los resultados y $q$ les asigna probabilidades. Con $p = [0{,}9;\ 0{,}1]$ y $q = [0{,}5;\ 0{,}5]$, $H(p, q) = 1$ bit, pero $H(q, p) \approx 1{,}737$ bits.` },
      { claim: '«La pérdida mínima siempre es 0.»', fix: String.raw`Solo con etiquetas one-hot, y aun así haría falta dar probabilidad 1, es decir, logits infinitos. Con etiquetas suaves (label smoothing, destilación) el mínimo es $H(p) > 0$: con un suavizado de 0,1 y 10 clases, 0,500 nats si los objetivos son 0,91 y 0,01, como en PyTorch (0,545 si el 0,1 se reparte solo entre las otras 9 clases).` },
      { claim: '«Si la exactitud no cambia, la entropía cruzada tampoco.»', fix: 'La entropía cruzada también mide la confianza. Es habitual que la pérdida de validación suba mientras la exactitud se mantiene: el modelo se vuelve cada vez más seguro en los ejemplos que falla. Ver [[calibration]].' },
    ],
    dl: [
      { title: 'Es la pérdida de clasificación.', text: 'Minimizar la entropía cruzada media con etiquetas one-hot es maximizar la verosimilitud de un modelo categórico, y equivale a minimizar la KL entre la distribución empírica de las etiquetas y el modelo: ver [[losses-likelihoods]].' },
      { title: 'Logits, no probabilidades.', text: 'En PyTorch, nn.CrossEntropyLoss recibe logits y aplica internamente log-softmax con el truco log-sum-exp, que es numéricamente estable. Si le pasas la salida de un softmax, aplicas el softmax dos veces y el entrenamiento empeora sin que salte ningún error.' },
      { title: 'Perplejidad.', text: String.raw`En modelos de lenguaje se suele dar la perplejidad, $\exp(H)$, con $H$ la entropía cruzada media por token en nats. Una pérdida de 2,0 nats equivale a una perplejidad de $e^2 \approx 7{,}39$: tanta incertidumbre como elegir al azar entre unos 7,4 tokens.` },
    ],
    quiz: [
      {
        prompt: 'Tu modelo da probabilidad 0,25 a la clase correcta. ¿Cuánto vale la pérdida de entropía cruzada en nats?',
        options: [{ text: '2' }, { text: '1,386', correct: true }, { text: '0,75' }],
        explain: String.raw`$-\ln 0{,}25 \approx 1{,}386$ nats. El 2 es la misma pérdida medida en bits, $-\log_2 0{,}25$.`,
      },
      {
        prompt: String.raw`Con la distribución real $p$ fija, minimizar $H(p, q)$ respecto a $q$ equivale a:`,
        options: [
          { text: String.raw`Minimizar $\mathrm{KL}(p \,\Vert\, q)$.`, correct: true },
          { text: String.raw`Maximizar $H(p)$.` },
          { text: String.raw`Minimizar $H(q)$.` },
        ],
        explain: String.raw`$H(p, q) = H(p) + \mathrm{KL}(p \,\Vert\, q)$, y $H(p)$ no depende de $q$.`,
      },
      {
        prompt: 'Un modelo de lenguaje tiene una entropía cruzada media de 3 bits por token. ¿Cuál es su perplejidad?',
        options: [{ text: '3' }, { text: '20,1' }, { text: '8', correct: true }],
        explain: String.raw`Con la pérdida en bits, la perplejidad es $2^{H} = 2^3 = 8$. El 20,1 sale de calcular $e^3$ con una pérdida que está en bits.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§6.1.2 (definición), §6.1.5 (perplejidad), §5.1.6.1 (KL, entropía cruzada y log-loss) y §10.3.2.1 (la entropía cruzada como log-verosimilitud negativa de la regresión logística multinomial).' },
      { book: 'pml2', where: '§5.2.4 (entropía cruzada y perplejidad).' },
    ],
  },
  en: {
    lede: String.raw`Cross-entropy $H(p, q)$ is the average surprise you get when outcomes follow $p$ but you assign them probabilities with a model $q$. With one-hot labels it reduces to minus the logarithm of the probability given to the correct class: it is the standard classification loss.`,
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`A weather service gives a probability of rain every day. If it says 90% and it rains, the surprise is small, $-\log_2 0.9 \approx 0.152$ bits; if it does not rain, it is large, $-\log_2 0.1 \approx 3.32$ bits. Cross-entropy averages those surprises according to what really happens. If it rains on 30% of days, a forecaster who always announces 30% gets 0.881 bits on average, which is the [[entropy|entropy]] of the rain; one who announces 50% gets 1 bit, and one who announces 10%, 1.103 bits.` },
          { key: String.raw`Cross-entropy is never smaller than entropy: $H(p, q) \ge H(p)$, with equality only if $q = p$. The excess is the price of using the wrong model.` },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { p: String.raw`For discrete distributions $p$ (the true one) and $q$ (the model):` },
          { math: String.raw`H(p, q) = -\sum_x p(x)\,\log q(x) = H(p) + \mathrm{KL}(p \,\Vert\, q)` },
          { p: String.raw`The excess cost is the [[kl-divergence|KL divergence]]. Since $H(p)$ does not depend on $q$, minimizing the cross-entropy with respect to $q$ is minimizing the KL.` },
          {
            list: [
              String.raw`**Classification:** with a one-hot label, $p$ puts all its mass on the correct class $y$, and $H(p, q) = -\log q(y)$. Averaged over the data it is the mean negative log-likelihood: training with it is [[mle|maximum likelihood]].`,
              String.raw`**Binary case:** $-\big[y \log q + (1 - y)\log(1 - q)\big]$, with $q$ the predicted probability of class 1.`,
            ],
          },
        ],
      },
      {
        id: 'example',
        title: 'The loss, prediction by prediction',
        blocks: [
          { p: 'There are three classes and the correct one is the first. With a one-hot label, the loss only depends on the probability given to the correct class:' },
          {
            table: {
              head: [String.raw`Prediction $q$`, 'Probability of the correct class', 'Loss (nats)'],
              rows: [
                [String.raw`$[0.7,\ 0.2,\ 0.1]$`, '0.7', '0.357'],
                [String.raw`$[\tfrac13,\ \tfrac13,\ \tfrac13]$`, '0.333', '1.099'],
                [String.raw`$[0.2,\ 0.7,\ 0.1]$`, '0.2', '1.609'],
                [String.raw`$[0.01,\ 0.98,\ 0.01]$`, '0.01', '4.605'],
              ],
              numeric: [1, 2],
            },
          },
          { p: String.raw`A confident mistake costs much more than a hesitant one: the loss grows without bound as $q(y) \to 0$. That is why cross-entropy punishes overconfidence.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“Cross-entropy is symmetric.”', fix: String.raw`No: $p$ weights the outcomes and $q$ assigns them probabilities. With $p = [0.9,\ 0.1]$ and $q = [0.5,\ 0.5]$, $H(p, q) = 1$ bit, but $H(q, p) \approx 1.737$ bits.` },
      { claim: '“The minimum loss is always 0.”', fix: String.raw`Only with one-hot labels, and even then it would take probability 1, that is, infinite logits. With soft labels (label smoothing, distillation) the minimum is $H(p) > 0$: with smoothing of 0.1 and 10 classes, 0.500 nats if the targets are 0.91 and 0.01, as in PyTorch (0.545 if the 0.1 is spread only over the other 9 classes).` },
      { claim: '“If accuracy does not change, cross-entropy does not either.”', fix: 'Cross-entropy also measures confidence. It is common for the validation loss to rise while accuracy stays flat: the model becomes more and more confident on the examples it gets wrong. See [[calibration]].' },
    ],
    dl: [
      { title: 'It is the classification loss.', text: 'Minimizing the mean cross-entropy with one-hot labels is maximizing the likelihood of a categorical model, and it is equivalent to minimizing the KL between the empirical distribution of the labels and the model: see [[losses-likelihoods]].' },
      { title: 'Logits, not probabilities.', text: 'In PyTorch, nn.CrossEntropyLoss takes logits and internally applies log-softmax with the log-sum-exp trick, which is numerically stable. If you pass it the output of a softmax, you apply softmax twice and training gets worse without any error being raised.' },
      { title: 'Perplexity.', text: String.raw`Language models usually report the perplexity, $\exp(H)$, with $H$ the mean cross-entropy per token in nats. A loss of 2.0 nats corresponds to a perplexity of $e^2 \approx 7.39$: as much uncertainty as choosing at random among about 7.4 tokens.` },
    ],
    quiz: [
      {
        prompt: 'Your model gives probability 0.25 to the correct class. What is the cross-entropy loss in nats?',
        options: [{ text: '2' }, { text: '1.386', correct: true }, { text: '0.75' }],
        explain: String.raw`$-\ln 0.25 \approx 1.386$ nats. The 2 is the same loss measured in bits, $-\log_2 0.25$.`,
      },
      {
        prompt: String.raw`With the true distribution $p$ fixed, minimizing $H(p, q)$ with respect to $q$ is equivalent to:`,
        options: [
          { text: String.raw`Minimizing $\mathrm{KL}(p \,\Vert\, q)$.`, correct: true },
          { text: String.raw`Maximizing $H(p)$.` },
          { text: String.raw`Minimizing $H(q)$.` },
        ],
        explain: String.raw`$H(p, q) = H(p) + \mathrm{KL}(p \,\Vert\, q)$, and $H(p)$ does not depend on $q$.`,
      },
      {
        prompt: 'A language model has a mean cross-entropy of 3 bits per token. What is its perplexity?',
        options: [{ text: '3' }, { text: '20.1' }, { text: '8', correct: true }],
        explain: String.raw`With the loss in bits, the perplexity is $2^{H} = 2^3 = 8$. The 20.1 comes from computing $e^3$ with a loss that is in bits.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§6.1.2 (definition), §6.1.5 (perplexity), §5.1.6.1 (KL, cross-entropy and log loss) and §10.3.2.1 (cross-entropy as the negative log-likelihood of multinomial logistic regression).' },
      { book: 'pml2', where: '§5.2.4 (cross-entropy and perplexity).' },
    ],
  },
};

export default content;
