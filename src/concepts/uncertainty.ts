import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'La incertidumbre de una predicción tiene dos orígenes: el ruido propio de los datos (aleatoria), que no disminuye con más datos, y lo que el modelo no sabe (epistémica), que sí disminuye. Distinguirlas indica si merece la pena conseguir más datos.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Lanzas una moneda de la que no sabes nada. Tras 3 lanzamientos no puedes descartar que esté muy trucada: buena parte de tu incertidumbre es sobre la propia moneda (epistémica). Tras 3000 sabes que sale cara en torno al 60 % de las veces, pero sigues sin poder predecir el siguiente lanzamiento: lo que queda es azar (aleatoria). En una red, lejos de los datos de entrenamiento domina la epistémica, y donde hay muchos datos pero las clases se solapan, la aleatoria.' },
          { key: 'La incertidumbre epistémica se reduce con más datos de la zona adecuada; la aleatoria no, salvo que las entradas aporten información nueva.' },
        ],
      },
      {
        id: 'separar',
        title: 'Cómo se separan',
        blocks: [
          { p: String.raw`Hace falta una distribución sobre los parámetros, $p(\theta \mid \mathcal{D})$, o una aproximación a ella: varias redes o muestras de un posterior aproximado. La [[posterior-predictive|predictiva posterior]] promedia las predicciones de todos los modelos plausibles, y en clasificación su [[entropy|entropía]] se descompone así:` },
          { math: String.raw`\underbrace{H\big[\mathbb{E}_{\theta}\, p(y \mid \mathbf{x}, \theta)\big]}_{\text{total}} = \underbrace{\mathbb{E}_{\theta}\, H\big[p(y \mid \mathbf{x}, \theta)\big]}_{\text{aleatoria}} + \underbrace{I(y; \theta \mid \mathbf{x}, \mathcal{D})}_{\text{epistémica}}` },
          { p: String.raw`La parte aleatoria es la entropía media de cada modelo; la epistémica es la [[mutual-information|información mutua]] entre la salida y los parámetros, que mide cuánto discrepan los modelos entre sí. En regresión, la ley de la varianza total hace lo mismo: la varianza predictiva es la varianza media del ruido, $\mathbb{E}_\theta[\sigma^2_\theta(\mathbf{x})]$, más la varianza de las medias, $\mathrm{Var}_\theta[\mu_\theta(\mathbf{x})]$.` },
        ],
      },
      {
        id: 'ejemplo',
        title: 'Un ejemplo con dos modelos',
        blocks: [
          { p: String.raw`Dos redes clasifican la misma entrada en dos clases. En los dos casos la predicción media es $[0{,}5;\ 0{,}5]$, pero el origen de la incertidumbre es distinto (valores en bits):` },
          {
            table: {
              head: ['Caso', 'Predicciones', 'Total', 'Aleatoria', 'Epistémica'],
              rows: [
                ['A', String.raw`$[0{,}5;\ 0{,}5]$ y $[0{,}5;\ 0{,}5]$`, '1', '1', '0'],
                ['B', String.raw`$[0{,}95;\ 0{,}05]$ y $[0{,}05;\ 0{,}95]$`, '1', '0,286', '0,714'],
              ],
              numeric: [2, 3, 4],
            },
          },
          { p: 'En A, los dos modelos coinciden en que la entrada es ambigua: más datos no ayudarían. En B, cada modelo está seguro, pero se contradicen: es una entrada que el modelo no conoce bien, y ahí sí servirían más datos o una revisión humana.' },
        ],
      },
    ],
    pitfalls: [
      { claim: '«La entropía de la softmax mide lo que la red no sabe.»', fix: 'Una sola red da una sola distribución y no puede separar las dos fuentes. Además, lejos de los datos de entrenamiento puede dar probabilidades muy altas. La incertidumbre epistémica necesita varios modelos plausibles: un ensemble o muestras de un posterior.' },
      { claim: '«Con datos suficientes desaparece toda la incertidumbre.»', fix: 'Solo desaparece la epistémica. La aleatoria refleja lo que las entradas no determinan (ruido de medida, clases que se solapan) y solo baja si añades información a las entradas.' },
      { claim: '«La incertidumbre aleatoria es igual en todas partes.»', fix: String.raw`Puede depender de la entrada. Una red puede aprender $\sigma(\mathbf{x})$ minimizando la log-verosimilitud gaussiana: ver [[losses-likelihoods]].` },
      { claim: '«Si separo las dos incertidumbres, los números son exactos.»', fix: 'Dependen de la aproximación al posterior (cuántas redes, qué método) y del modelo elegido. Son estimaciones que conviene contrastar, por ejemplo comprobando la [[calibration|calibración]] y la cobertura de los intervalos.' },
    ],
    dl: [
      { title: 'Ensembles profundos.', text: 'Entrenar varias redes con distintas inicializaciones y promediar sus predicciones es una alternativa sencilla y muy competitiva a las redes neuronales bayesianas (Lakshminarayanan et al., 2017), que también puede leerse como una aproximación a la predictiva posterior. El desacuerdo entre las redes estima la parte epistémica, y cada una puede predecir además una varianza para la aleatoria.' },
      { title: 'Dropout de Monte Carlo.', text: 'Mantener el dropout activo al predecir y promediar varias pasadas da muestras baratas de modelos distintos, una forma de [[monte-carlo|Monte Carlo]]. Es fácil de aplicar, pero su calidad como aproximación bayesiana se discute: compáralo con un ensemble cuando puedas.' },
      { title: 'Para qué sirve.', text: 'La incertidumbre epistémica ayuda a elegir qué ejemplos etiquetar en aprendizaje activo (el criterio BALD es precisamente esa información mutua), a detectar entradas fuera de distribución y a pasar a una persona los casos dudosos. La aleatoria indica dónde más datos no van a ayudar.' },
    ],
    quiz: [
      {
        prompt: 'Cinco redes de regresión predicen para una entrada medias muy distintas entre sí, cada una con una varianza pequeña. ¿Qué incertidumbre domina?',
        options: [
          { text: 'La aleatoria.' },
          { text: 'La epistémica.', correct: true },
          { text: 'Ninguna: cada red está segura.' },
        ],
        explain: 'La varianza predictiva es la media de las varianzas (pequeña: la parte aleatoria) más la varianza de las medias (grande: la parte epistémica). Que las redes discrepen indica que los datos no bastan para fijar la predicción en esa zona.',
      },
      {
        prompt: '¿Qué puede reducir la incertidumbre aleatoria de una predicción?',
        options: [
          { text: 'Entrenar con más ejemplos parecidos.' },
          { text: 'Promediar más redes en el ensemble.' },
          { text: 'Añadir a las entradas una variable que aporte información nueva.', correct: true },
        ],
        explain: 'La aleatoria mide lo que las entradas no determinan. Más ejemplos o más redes actúan, como mucho, sobre la parte epistémica.',
      },
      {
        prompt: String.raw`Dos modelos predicen $[0{,}9;\ 0{,}1]$ y $[0{,}1;\ 0{,}9]$. La entropía de su media es 1 bit, y la de cada uno, 0,469 bits. ¿Cuánto vale la parte epistémica?`,
        options: [
          { text: '0 bits.' },
          { text: '1 bit.' },
          { text: 'Unos 0,531 bits.', correct: true },
        ],
        explain: String.raw`Es la total menos la aleatoria: $1 - 0{,}469 = 0{,}531$ bits. Más de la mitad de la incertidumbre viene del desacuerdo entre los modelos.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§2.1.2 (tipos de incertidumbre: epistémica y aleatoria).' },
      { book: 'pml2', where: '§17.1, §17.3.1 y §17.3.9 (redes neuronales bayesianas: predictiva posterior, dropout de Monte Carlo y ensembles profundos), §14.2.3 (dos modelos con la misma predicción pueden tener incertidumbres de distinto tipo) y §34.7.3 (BALD: la información mutua aísla la parte epistémica).' },
    ],
    extra: [
      { text: 'Kendall, A. y Gal, Y. (2017). What uncertainties do we need in Bayesian deep learning for computer vision? Advances in Neural Information Processing Systems 30.', url: 'https://proceedings.neurips.cc/paper/2017/hash/2650d6089a6d640c5e85b2b88265dc2b-Abstract.html' },
      { text: 'Lakshminarayanan, B., Pritzel, A. y Blundell, C. (2017). Simple and scalable predictive uncertainty estimation using deep ensembles. Advances in Neural Information Processing Systems 30.', url: 'https://proceedings.neurips.cc/paper/2017/hash/9ef2ed4b7fd2c810847ffa5fa85bce38-Abstract.html' },
    ],
  },
  en: {
    lede: 'The uncertainty of a prediction has two sources: the noise inherent in the data (aleatoric), which does not shrink with more data, and what the model does not know (epistemic), which does. Telling them apart tells you whether getting more data is worth it.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'You toss a coin you know nothing about. After 3 tosses you cannot rule out that it is heavily biased: a good part of your uncertainty is about the coin itself (epistemic). After 3000 you know it lands heads about 60% of the time, but you still cannot predict the next toss: what remains is chance (aleatoric). In a network, far from the training data the epistemic part dominates, and where there are plenty of data but the classes overlap, the aleatoric part does.' },
          { key: 'Epistemic uncertainty shrinks with more data from the right region; aleatoric uncertainty does not, unless the inputs bring new information.' },
        ],
      },
      {
        id: 'separating',
        title: 'How to separate them',
        blocks: [
          { p: String.raw`You need a distribution over the parameters, $p(\theta \mid \mathcal{D})$, or an approximation to it: several networks, or samples from an approximate posterior. The [[posterior-predictive|posterior predictive]] averages the predictions of all plausible models, and in classification its [[entropy|entropy]] decomposes as follows:` },
          { math: String.raw`\underbrace{H\big[\mathbb{E}_{\theta}\, p(y \mid \mathbf{x}, \theta)\big]}_{\text{total}} = \underbrace{\mathbb{E}_{\theta}\, H\big[p(y \mid \mathbf{x}, \theta)\big]}_{\text{aleatoric}} + \underbrace{I(y; \theta \mid \mathbf{x}, \mathcal{D})}_{\text{epistemic}}` },
          { p: String.raw`The aleatoric part is the average entropy of each model; the epistemic part is the [[mutual-information|mutual information]] between the output and the parameters, which measures how much the models disagree. In regression, the law of total variance does the same: the predictive variance is the average noise variance, $\mathbb{E}_\theta[\sigma^2_\theta(\mathbf{x})]$, plus the variance of the means, $\mathrm{Var}_\theta[\mu_\theta(\mathbf{x})]$.` },
        ],
      },
      {
        id: 'example',
        title: 'An example with two models',
        blocks: [
          { p: String.raw`Two networks classify the same input into two classes. In both cases the average prediction is $[0.5,\ 0.5]$, but the source of the uncertainty is different (values in bits):` },
          {
            table: {
              head: ['Case', 'Predictions', 'Total', 'Aleatoric', 'Epistemic'],
              rows: [
                ['A', String.raw`$[0.5,\ 0.5]$ and $[0.5,\ 0.5]$`, '1', '1', '0'],
                ['B', String.raw`$[0.95,\ 0.05]$ and $[0.05,\ 0.95]$`, '1', '0.286', '0.714'],
              ],
              numeric: [2, 3, 4],
            },
          },
          { p: 'In A, both models agree that the input is ambiguous: more data would not help. In B, each model is confident, but they contradict each other: the model does not know this kind of input well, and there more data or a human review would help.' },
        ],
      },
    ],
    pitfalls: [
      { claim: '“The entropy of the softmax measures what the network does not know.”', fix: 'A single network gives a single distribution and cannot separate the two sources. Besides, far from the training data it can output very high probabilities. Epistemic uncertainty needs several plausible models: an ensemble or samples from a posterior.' },
      { claim: '“With enough data, all uncertainty disappears.”', fix: 'Only the epistemic part disappears. The aleatoric part reflects what the inputs do not determine (measurement noise, overlapping classes) and only decreases if you add information to the inputs.' },
      { claim: '“Aleatoric uncertainty is the same everywhere.”', fix: String.raw`It can depend on the input. A network can learn $\sigma(\mathbf{x})$ by minimizing the Gaussian negative log-likelihood: see [[losses-likelihoods]].` },
      { claim: '“Once I separate the two uncertainties, the numbers are exact.”', fix: 'They depend on the approximation to the posterior (how many networks, which method) and on the chosen model. They are estimates worth checking, for example by looking at [[calibration|calibration]] and at the coverage of the intervals.' },
    ],
    dl: [
      { title: 'Deep ensembles.', text: 'Training several networks from different initializations and averaging their predictions is a simple and very competitive alternative to Bayesian neural networks (Lakshminarayanan et al., 2017) that can also be read as an approximation to the posterior predictive. The disagreement between the networks estimates the epistemic part, and each one can also predict a variance for the aleatoric part.' },
      { title: 'Monte Carlo dropout.', text: 'Keeping dropout active at prediction time and averaging several passes gives cheap samples of different models, a form of [[monte-carlo|Monte Carlo]]. It is easy to apply, but its quality as a Bayesian approximation is debated: compare it with an ensemble when you can.' },
      { title: 'What it is for.', text: 'Epistemic uncertainty helps choose which examples to label in active learning (the BALD criterion is precisely that mutual information), detect out-of-distribution inputs and hand doubtful cases over to a person. Aleatoric uncertainty tells you where more data will not help.' },
    ],
    quiz: [
      {
        prompt: 'Five regression networks predict very different means for an input, each with a small variance. Which uncertainty dominates?',
        options: [
          { text: 'Aleatoric.' },
          { text: 'Epistemic.', correct: true },
          { text: 'Neither: each network is confident.' },
        ],
        explain: 'The predictive variance is the mean of the variances (small: the aleatoric part) plus the variance of the means (large: the epistemic part). The disagreement means that the data are not enough to pin down the prediction in that region.',
      },
      {
        prompt: 'What can reduce the aleatoric uncertainty of a prediction?',
        options: [
          { text: 'Training on more similar examples.' },
          { text: 'Averaging more networks in the ensemble.' },
          { text: 'Adding an input variable that brings new information.', correct: true },
        ],
        explain: 'Aleatoric uncertainty measures what the inputs do not determine. More examples or more networks act, at most, on the epistemic part.',
      },
      {
        prompt: String.raw`Two models predict $[0.9,\ 0.1]$ and $[0.1,\ 0.9]$. The entropy of their average is 1 bit, and that of each one is 0.469 bits. What is the epistemic part?`,
        options: [
          { text: '0 bits.' },
          { text: '1 bit.' },
          { text: 'About 0.531 bits.', correct: true },
        ],
        explain: String.raw`It is the total minus the aleatoric part: $1 - 0.469 = 0.531$ bits. More than half of the uncertainty comes from the disagreement between the models.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§2.1.2 (types of uncertainty: epistemic and aleatoric).' },
      { book: 'pml2', where: '§17.1, §17.3.1 and §17.3.9 (Bayesian neural networks: posterior predictive, Monte Carlo dropout and deep ensembles), §14.2.3 (two models with the same prediction can have different kinds of uncertainty) and §34.7.3 (BALD: mutual information isolates the epistemic part).' },
    ],
    extra: [
      { text: 'Kendall, A. and Gal, Y. (2017). What uncertainties do we need in Bayesian deep learning for computer vision? Advances in Neural Information Processing Systems 30.', url: 'https://proceedings.neurips.cc/paper/2017/hash/2650d6089a6d640c5e85b2b88265dc2b-Abstract.html' },
      { text: 'Lakshminarayanan, B., Pritzel, A. and Blundell, C. (2017). Simple and scalable predictive uncertainty estimation using deep ensembles. Advances in Neural Information Processing Systems 30.', url: 'https://proceedings.neurips.cc/paper/2017/hash/9ef2ed4b7fd2c810847ffa5fa85bce38-Abstract.html' },
    ],
  },
};

export default content;
