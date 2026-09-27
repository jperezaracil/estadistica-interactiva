import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'La distribución categórica generaliza la Bernoulli a $K$ resultados posibles: un solo ensayo y un vector de probabilidades que suma 1. La multinomial cuenta cuántas veces sale cada resultado en $n$ ensayos independientes. La salida softmax de un clasificador es una distribución categórica.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Un clasificador de imágenes con tres clases (gato, perro y pájaro) devuelve para una foto el vector $[0{,}7;\ 0{,}2;\ 0{,}1]$. Eso es una distribución categórica: un único resultado entre $K = 3$ posibles, con una probabilidad para cada uno. Si sorteas 100 veces, de forma independiente, una clase con esas probabilidades, los recuentos de cada clase siguen una multinomial, con media $[70;\ 20;\ 10]$.` },
          { key: String.raw`Categórica: un ensayo, $K$ resultados y unas probabilidades $\pi_1, \dots, \pi_K$ que suman 1. Multinomial: los recuentos de cada resultado en $n$ ensayos independientes. Con $K = 2$ se recuperan la [[bernoulli-binomial|Bernoulli y la binomial]].` },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { p: String.raw`Si codificas el resultado como un vector one-hot $\mathbf{y}$, con un 1 en la posición de la clase y 0 en el resto, la categórica se escribe:` },
          { math: String.raw`P(\mathbf{y}) = \prod_{k=1}^{K} \pi_k^{\,y_k}, \qquad \pi_k \ge 0, \quad \sum_{k=1}^{K} \pi_k = 1` },
          { p: String.raw`Solo hay $K-1$ parámetros libres, porque el último queda fijado por la suma. Si $N_k$ cuenta las veces que sale el resultado $k$ en $n$ ensayos independientes, el vector de recuentos es multinomial:` },
          { math: String.raw`P(N_1 = n_1, \dots, N_K = n_K) = \frac{n!}{n_1! \cdots n_K!} \prod_{k=1}^{K} \pi_k^{\,n_k}, \qquad \sum_{k=1}^{K} n_k = n` },
          { p: String.raw`Cada $N_k$ por separado es binomial, con media $n\pi_k$ y varianza $n\pi_k(1-\pi_k)$. Pero los recuentos no son independientes: como suman $n$, compiten entre sí, y su covarianza es negativa, $\operatorname{Cov}(N_j, N_k) = -n\pi_j\pi_k$ para $j \ne k$.` },
        ],
      },
      {
        id: 'softmax',
        title: 'De logits a probabilidades: softmax',
        blocks: [
          { p: String.raw`Una red no produce probabilidades directamente, sino un vector de logits $\mathbf{a} \in \mathbb{R}^K$ sin restricciones. La función softmax los convierte en los parámetros de una categórica:` },
          { math: String.raw`\pi_k = \operatorname{softmax}(\mathbf{a})_k = \frac{e^{a_k}}{\sum_{j=1}^{K} e^{a_j}}` },
          { p: String.raw`Sumar la misma constante a todos los logits no cambia el resultado. Dividirlos por una temperatura $T$ controla lo concentrada que queda la distribución. Para los logits $[2;\ 1;\ 0]$:` },
          {
            table: {
              head: ['Temperatura', 'Probabilidades'],
              rows: [
                [String.raw`$T = 0{,}5$`, String.raw`$[0{,}867;\ 0{,}117;\ 0{,}016]$`],
                [String.raw`$T = 1$`, String.raw`$[0{,}665;\ 0{,}245;\ 0{,}090]$`],
                [String.raw`$T = 2$`, String.raw`$[0{,}506;\ 0{,}307;\ 0{,}186]$`],
              ],
            },
          },
          { p: String.raw`Cuando $T \to 0$, la softmax concentra toda la probabilidad en el logit mayor, como un argmax; cuando $T \to \infty$, tiende a la uniforme. El orden de las clases no cambia nunca. Si la clase correcta es la primera, la pérdida de entropía cruzada con $T = 1$ vale $-\ln 0{,}665 \approx 0{,}408$.` },
        ],
      },
    ],
    pitfalls: [
      { claim: String.raw`«Con $K$ clases hay $K$ probabilidades libres.»`, fix: String.raw`Solo $K-1$: la última queda fijada porque suman 1. Los $K$ logits de una softmax tienen, por tanto, un grado de libertad de sobra: sumar una constante a todos no cambia nada, y con dos clases la softmax equivale a una sigmoide de la diferencia de logits, $\sigma(a_1 - a_2)$.` },
      { claim: '«Los recuentos de una multinomial son independientes, porque los ensayos lo son.»', fix: String.raw`Los ensayos son independientes, pero los recuentos suman $n$: si una clase sale más, quedan menos ensayos para las demás. Con 100 ensayos y $\pi = [0{,}7;\ 0{,}2;\ 0{,}1]$, la covarianza entre los dos primeros recuentos es −14 y su correlación, −0,76.` },
      { claim: '«La softmax sirve para cualquier problema con varias etiquetas.»', fix: 'La softmax supone clases mutuamente excluyentes: exactamente una es la correcta. Si una imagen puede contener a la vez un perro y un coche, el problema es multietiqueta y se modela con una Bernoulli independiente por etiqueta: ver [[bernoulli-binomial]].' },
      { claim: '«Las probabilidades softmax miden la confianza real del modelo.»', fix: 'Solo si el modelo está calibrado, y las redes profundas suelen ser demasiado confiadas. La temperatura cambia las probabilidades sin cambiar la clase predicha; de hecho, ajustar una sola temperatura en un conjunto de validación es una forma sencilla de recalibrar una red: ver [[calibration]].' },
    ],
    dl: [
      { title: 'Clasificación multiclase.', text: String.raw`La última capa produce logits, la softmax los convierte en una categórica y la entropía cruzada es su [[mle|log-verosimilitud negativa]], $-\log \pi_y$. Como $e^{a}$ desborda con logits grandes, las librerías calculan el logaritmo de la softmax restando antes el logit máximo (el truco log-sum-exp). Por eso CrossEntropyLoss de PyTorch espera logits, no probabilidades ya pasadas por una softmax.` },
      { title: 'Muestreo en modelos de lenguaje.', text: String.raw`Cada token se elige de una categórica sobre todo el vocabulario. La temperatura la afila ($T < 1$) o la aplana ($T > 1$), y técnicas como top-$k$ o top-$p$ la truncan a los tokens más probables antes de muestrear. Cuando $T \to 0$, el muestreo se reduce a elegir siempre el token más probable (decodificación voraz).` },
      { title: 'Suavizado de etiquetas.', text: String.raw`En vez del objetivo one-hot, se entrena con uno que da $1-\varepsilon$ a la clase correcta y reparte $\varepsilon$ a partes iguales entre las $K$ clases. Con $\varepsilon = 0{,}1$ y 10 clases, el objetivo es 0,91 para la correcta y 0,01 para cada una de las demás. Penaliza los logits extremos, reduce el exceso de confianza y a menudo mejora la generalización: ver [[cross-entropy]].` },
    ],
    quiz: [
      {
        prompt: 'Sumas 5 a todos los logits de una red de 3 clases. ¿Qué les pasa a las probabilidades softmax?',
        options: [{ text: 'Aumentan todas.' }, { text: 'Se vuelven uniformes.' }, { text: 'No cambian.', correct: true }],
        explain: String.raw`El factor $e^{5}$ aparece en el numerador y en el denominador y se cancela: la softmax solo depende de las diferencias entre logits.`,
      },
      {
        prompt: 'Lanzas 60 veces un dado equilibrado. ¿Cuál es la covarianza entre el número de unos y el número de doses?',
        options: [
          { text: '0, porque los lanzamientos son independientes.' },
          { text: 'Unos −1,67.', correct: true },
          { text: 'Unos +1,67.' },
        ],
        explain: String.raw`$\operatorname{Cov}(N_1, N_2) = -n\pi_1\pi_2 = -60 \cdot \tfrac{1}{6} \cdot \tfrac{1}{6} \approx -1{,}67$. Es negativa porque un lanzamiento que da un uno ya no puede dar un dos.`,
      },
      {
        prompt: 'Un modelo debe indicar qué objetos aparecen en una foto (perro, gato, coche), y pueden aparecer varios a la vez. ¿Qué salida es adecuada?',
        options: [
          { text: 'Una sigmoide por clase: una Bernoulli independiente por etiqueta.', correct: true },
          { text: 'Una softmax sobre las tres clases.' },
          { text: 'Una única sigmoide para todo el vector.' },
        ],
        explain: 'La softmax obliga a que las probabilidades sumen 1, como si solo hubiera una clase correcta. En un problema multietiqueta, cada etiqueta es un sí o no propio.',
      },
    ],
    further: [
      { book: 'pml1', where: '§2.5.1 (categórica y multinomial, con codificación one-hot), §2.5.2 (softmax y temperatura), §2.5.3 (regresión logística multiclase) y §2.5.4 (el truco log-sum-exp); §4.2.4 (el EMV de una categórica son las frecuencias relativas).' },
      { book: 'wilks', where: '§4.2.4 (distribución multinomial como extensión de la binomial a más de dos sucesos).' },
    ],
    extra: [
      { text: 'Bridle, J. S. (1990). Probabilistic Interpretation of Feedforward Classification Network Outputs, with Relationships to Statistical Pattern Recognition. En Neurocomputing (NATO ASI Series F, vol. 68), 227–236. Springer.', url: 'https://doi.org/10.1007/978-3-642-76153-9_28' },
    ],
  },
  en: {
    lede: 'The categorical distribution generalizes the Bernoulli to $K$ possible outcomes: a single trial and a vector of probabilities that sums to 1. The multinomial counts how many times each outcome occurs in $n$ independent trials. The softmax output of a classifier is a categorical distribution.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`An image classifier with three classes (cat, dog and bird) returns the vector $[0.7,\ 0.2,\ 0.1]$ for a photo. That is a categorical distribution: a single outcome among $K = 3$ possible ones, with a probability for each. If you draw a class 100 times, independently, with those probabilities, the counts of each class follow a multinomial distribution, with mean $[70,\ 20,\ 10]$.` },
          { key: String.raw`Categorical: one trial, $K$ outcomes and probabilities $\pi_1, \dots, \pi_K$ that sum to 1. Multinomial: the counts of each outcome in $n$ independent trials. With $K = 2$ you recover the [[bernoulli-binomial|Bernoulli and binomial distributions]].` },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { p: String.raw`If you encode the outcome as a one-hot vector $\mathbf{y}$, with a 1 in the position of the class and 0 elsewhere, the categorical distribution reads:` },
          { math: String.raw`P(\mathbf{y}) = \prod_{k=1}^{K} \pi_k^{\,y_k}, \qquad \pi_k \ge 0, \quad \sum_{k=1}^{K} \pi_k = 1` },
          { p: String.raw`There are only $K-1$ free parameters, because the last one is fixed by the sum. If $N_k$ counts how many times outcome $k$ occurs in $n$ independent trials, the vector of counts is multinomial:` },
          { math: String.raw`P(N_1 = n_1, \dots, N_K = n_K) = \frac{n!}{n_1! \cdots n_K!} \prod_{k=1}^{K} \pi_k^{\,n_k}, \qquad \sum_{k=1}^{K} n_k = n` },
          { p: String.raw`Each $N_k$ on its own is binomial, with mean $n\pi_k$ and variance $n\pi_k(1-\pi_k)$. But the counts are not independent: since they add up to $n$, they compete with each other, and their covariance is negative, $\operatorname{Cov}(N_j, N_k) = -n\pi_j\pi_k$ for $j \ne k$.` },
        ],
      },
      {
        id: 'softmax',
        title: 'From logits to probabilities: softmax',
        blocks: [
          { p: String.raw`A network does not output probabilities directly, but an unconstrained vector of logits $\mathbf{a} \in \mathbb{R}^K$. The softmax function turns them into the parameters of a categorical distribution:` },
          { math: String.raw`\pi_k = \operatorname{softmax}(\mathbf{a})_k = \frac{e^{a_k}}{\sum_{j=1}^{K} e^{a_j}}` },
          { p: String.raw`Adding the same constant to all logits does not change the result. Dividing them by a temperature $T$ controls how concentrated the distribution is. For the logits $[2,\ 1,\ 0]$:` },
          {
            table: {
              head: ['Temperature', 'Probabilities'],
              rows: [
                [String.raw`$T = 0.5$`, String.raw`$[0.867,\ 0.117,\ 0.016]$`],
                [String.raw`$T = 1$`, String.raw`$[0.665,\ 0.245,\ 0.090]$`],
                [String.raw`$T = 2$`, String.raw`$[0.506,\ 0.307,\ 0.186]$`],
              ],
            },
          },
          { p: String.raw`As $T \to 0$, the softmax puts all the probability on the largest logit, like an argmax; as $T \to \infty$, it tends to the uniform distribution. The ranking of the classes never changes. If the correct class is the first one, the cross-entropy loss at $T = 1$ is $-\ln 0.665 \approx 0.408$.` },
        ],
      },
    ],
    pitfalls: [
      { claim: String.raw`“With $K$ classes there are $K$ free probabilities.”`, fix: String.raw`Only $K-1$: the last one is fixed because they sum to 1. The $K$ logits of a softmax therefore have one degree of freedom to spare: adding a constant to all of them changes nothing, and with two classes the softmax is equivalent to a sigmoid of the difference of the logits, $\sigma(a_1 - a_2)$.` },
      { claim: '“The counts of a multinomial are independent, because the trials are.”', fix: String.raw`The trials are independent, but the counts add up to $n$: if one class occurs more often, fewer trials are left for the others. With 100 trials and $\pi = [0.7,\ 0.2,\ 0.1]$, the covariance between the first two counts is −14 and their correlation −0.76.` },
      { claim: '“Softmax works for any problem with several labels.”', fix: 'Softmax assumes mutually exclusive classes: exactly one is correct. If an image can contain both a dog and a car, the problem is multi-label and is modeled with one independent Bernoulli per label: see [[bernoulli-binomial]].' },
      { claim: '“Softmax probabilities measure the true confidence of the model.”', fix: 'Only if the model is calibrated, and deep networks tend to be overconfident. The temperature changes the probabilities without changing the predicted class; in fact, fitting a single temperature on a validation set is a simple way to recalibrate a network: see [[calibration]].' },
    ],
    dl: [
      { title: 'Multi-class classification.', text: String.raw`The last layer outputs logits, the softmax turns them into a categorical distribution and the cross-entropy is its [[mle|negative log-likelihood]], $-\log \pi_y$. Since $e^{a}$ overflows for large logits, libraries compute the log of the softmax after subtracting the largest logit (the log-sum-exp trick). That is why PyTorch's CrossEntropyLoss expects logits, not probabilities that have already gone through a softmax.` },
      { title: 'Sampling in language models.', text: String.raw`Each token is drawn from a categorical distribution over the whole vocabulary. The temperature sharpens it ($T < 1$) or flattens it ($T > 1$), and techniques such as top-$k$ or top-$p$ truncate it to the most probable tokens before sampling. As $T \to 0$, sampling reduces to always picking the most probable token (greedy decoding).` },
      { title: 'Label smoothing.', text: String.raw`Instead of the one-hot target, the network is trained with one that gives $1-\varepsilon$ to the correct class and spreads $\varepsilon$ evenly over the $K$ classes. With $\varepsilon = 0.1$ and 10 classes, the target is 0.91 for the correct class and 0.01 for each of the others. It penalizes extreme logits, reduces overconfidence and often improves generalization: see [[cross-entropy]].` },
    ],
    quiz: [
      {
        prompt: 'You add 5 to all the logits of a 3-class network. What happens to the softmax probabilities?',
        options: [{ text: 'They all increase.' }, { text: 'They become uniform.' }, { text: 'They do not change.', correct: true }],
        explain: String.raw`The factor $e^{5}$ appears in the numerator and in the denominator and cancels out: the softmax only depends on the differences between logits.`,
      },
      {
        prompt: 'You roll a fair die 60 times. What is the covariance between the number of ones and the number of twos?',
        options: [
          { text: '0, because the rolls are independent.' },
          { text: 'About −1.67.', correct: true },
          { text: 'About +1.67.' },
        ],
        explain: String.raw`$\operatorname{Cov}(N_1, N_2) = -n\pi_1\pi_2 = -60 \cdot \tfrac{1}{6} \cdot \tfrac{1}{6} \approx -1.67$. It is negative because a roll that gives a one can no longer give a two.`,
      },
      {
        prompt: 'A model must say which objects appear in a photo (dog, cat, car), and several can appear at once. Which output is appropriate?',
        options: [
          { text: 'One sigmoid per class: an independent Bernoulli per label.', correct: true },
          { text: 'A softmax over the three classes.' },
          { text: 'A single sigmoid for the whole vector.' },
        ],
        explain: 'Softmax forces the probabilities to sum to 1, as if only one class could be correct. In a multi-label problem, each label is its own yes-or-no question.',
      },
    ],
    further: [
      { book: 'pml1', where: '§2.5.1 (categorical and multinomial distributions, with one-hot encoding), §2.5.2 (softmax and temperature), §2.5.3 (multiclass logistic regression) and §2.5.4 (the log-sum-exp trick); §4.2.4 (the MLE of a categorical distribution is the vector of relative frequencies).' },
      { book: 'wilks', where: '§4.2.4 (the multinomial distribution as an extension of the binomial to more than two events).' },
    ],
    extra: [
      { text: 'Bridle, J. S. (1990). Probabilistic Interpretation of Feedforward Classification Network Outputs, with Relationships to Statistical Pattern Recognition. In Neurocomputing (NATO ASI Series F, vol. 68), 227–236. Springer.', url: 'https://doi.org/10.1007/978-3-642-76153-9_28' },
    ],
  },
};

export default content;
