import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: String.raw`El método de Monte Carlo aproxima esperanzas y probabilidades promediando sobre muestras aleatorias simuladas. Su error baja como $1/\sqrt S$ con el número de muestras $S$, un ritmo que no depende de la dimensión del problema.`,
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`¿Cuál es la activación media de una ReLU, $\max(0, z)$, cuando su entrada $z$ es normal estándar? Puedes resolver la integral, o puedes generar 10 000 valores de $z$, aplicarles la ReLU y promediar. El promedio saldrá muy cerca del valor exacto, $1/\sqrt{2\pi} \approx 0{,}399$, y el mismo procedimiento funciona cuando la integral no se puede resolver: una red entera, una simulación física o un modelo con miles de variables.` },
          { key: 'Una esperanza es un promedio sobre una distribución: con muestras de esa distribución, la sustituyes por un promedio sobre las muestras. Una probabilidad es la esperanza de un indicador, así que se estima con la fracción de simulaciones en que ocurre el suceso.' },
        ],
      },
      {
        id: 'estimador',
        title: 'El estimador y su error',
        blocks: [
          { p: String.raw`Con muestras independientes $x_1, \dots, x_S$ de $p(x)$:` },
          { math: String.raw`\mathbb{E}[f(X)] \approx \hat\mu_S = \frac{1}{S}\sum_{s=1}^{S} f(x_s), \qquad \mathrm{EE}(\hat\mu_S) = \frac{\sigma_f}{\sqrt S}` },
          { p: String.raw`donde $\sigma_f$ es la desviación típica de $f(X)$. El estimador es insesgado, la [[lln-clt|ley de los grandes números]] garantiza que converge al valor real y, si $\sigma_f$ es finita, el teorema central del límite da su error estándar, que se estima con la desviación típica de las propias muestras. La tasa $1/\sqrt S$ no depende de la dimensión de $X$ (aunque $\sigma_f$ sí puede depender), y por eso Monte Carlo se impone a las rejillas de integración cuando hay muchas variables.` },
          { p: String.raw`Para simular hace falta saber muestrear de $p(x)$: por inversión de la función de distribución, por rechazo o, cuando $p$ solo se conoce salvo una constante y hay muchas dimensiones, con [[mcmc|MCMC]].` },
        ],
      },
      {
        id: 'precision',
        title: 'Cuántas muestras hacen falta',
        blocks: [
          { p: String.raw`En el ejemplo de la ReLU, $\sigma_f \approx 0{,}584$:` },
          {
            table: {
              head: [String.raw`Muestras $S$`, 'Error estándar'],
              rows: [
                ['100', '0,058'],
                ['10 000', '0,0058'],
                ['1 000 000', '0,00058'],
              ],
              numeric: [0, 1],
            },
          },
          { p: String.raw`Cada cifra decimal más de precisión cuesta 100 veces más muestras. Los sucesos raros son el caso difícil: al estimar una probabilidad $p$, el error relativo es $\sqrt{(1-p)/(pS)}$, así que con $p = 0{,}001$ y 10 000 muestras ronda el 32 %. Para ellos se usa el muestreo por importancia, que simula más a menudo la zona que interesa y corrige el sesgo con pesos.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Con suficientes muestras, Monte Carlo da el valor exacto.»', fix: String.raw`Da una estimación con un error aleatorio del orden de $\sigma_f/\sqrt S$. Informa de ese error estándar junto al resultado, y fija la semilla si necesitas reproducirlo.` },
      { claim: '«Duplicar las muestras reduce el error a la mitad.»', fix: String.raw`Lo reduce en un factor $\sqrt 2 \approx 1{,}41$. Para reducirlo a la mitad hacen falta cuatro veces más muestras.` },
      { claim: '«Para un suceso raro basta con el número habitual de simulaciones.»', fix: String.raw`El error relativo crece cuando $p$ es pequeña: con $p = 0{,}001$ hace falta un millón de muestras para bajarlo al 3 %. Y si ninguna simulación produce el suceso, la estimación es 0, lo que no significa que sea imposible.` },
      { claim: '«Las muestras de una cadena MCMC cuentan como independientes.»', fix: String.raw`Están correlacionadas, así que el error estándar real es mayor que $\sigma_f/\sqrt S$. Hay que usar el tamaño efectivo de muestra: ver [[mcmc]].` },
    ],
    dl: [
      { title: 'El gradiente estocástico.', text: String.raw`El gradiente de un minibatch es una estimación de Monte Carlo del gradiente sobre todo el conjunto de entrenamiento: insesgada si los ejemplos se eligen al azar, y con una varianza que baja aproximadamente como $1/B$ con el tamaño del lote $B$. Ese ruido es parte de lo que hace oscilar la curva de pérdida.` },
      { title: 'Esperanzas dentro de la pérdida.', text: String.raw`La pérdida de un [[vae|VAE]] incluye una esperanza sobre el código latente que se estima con una o pocas muestras en cada paso. Para poder derivar a través de ese muestreo se escribe $z = \mu + \sigma\varepsilon$, con $\varepsilon \sim \mathcal{N}(0, 1)$: el truco de reparametrización.` },
      { title: 'Predicciones promediadas.', text: 'Hacer varias pasadas con el dropout activo en inferencia (MC dropout) y promediar las salidas es una estimación de Monte Carlo de la predicción media sobre las redes que genera el dropout; la dispersión entre pasadas da una medida de incertidumbre: ver [[uncertainty]].' },
    ],
    quiz: [
      {
        prompt: String.raw`Estimas una esperanza con 2500 muestras independientes, y la desviación típica de $f(X)$ es 3. ¿Cuál es el error estándar de la estimación?`,
        options: [{ text: '0,0012' }, { text: '0,06', correct: true }, { text: '0,6' }],
        explain: String.raw`$\sigma_f/\sqrt S = 3/\sqrt{2500} = 3/50 = 0{,}06$. El valor 0,0012 divide entre $S$ en lugar de entre $\sqrt S$.`,
      },
      {
        prompt: 'Para dividir entre 10 el error de una estimación de Monte Carlo, ¿por cuánto multiplicas el número de muestras?',
        options: [{ text: '10' }, { text: '100', correct: true }, { text: '1000' }],
        explain: String.raw`El error es proporcional a $1/\sqrt S$: multiplicar $S$ por 100 divide el error entre $\sqrt{100} = 10$.`,
      },
      {
        prompt: 'Necesitas una integral en 100 dimensiones. ¿Por qué usar Monte Carlo y no una rejilla de puntos?',
        options: [
          { text: String.raw`Porque su error baja como $1/\sqrt S$, a un ritmo que no depende de la dimensión, mientras que el número de puntos de una rejilla crece exponencialmente con ella.`, correct: true },
          { text: 'Porque Monte Carlo da el resultado exacto.' },
          { text: 'Porque no necesita evaluar la función que se integra.' },
        ],
        explain: String.raw`Una rejilla con solo 10 puntos por eje tendría $10^{100}$ puntos en 100 dimensiones. Monte Carlo mantiene la tasa $1/\sqrt S$, aunque la constante $\sigma_f$ puede crecer con la dimensión.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§4.7 (simulación estadística: generadores de números uniformes, inversión de la función de distribución, rechazo, método de Box-Muller y simulación de mezclas).' },
      { book: 'pml1', where: '§2.8.7 (aproximación de Monte Carlo de la distribución de una función de una variable aleatoria).' },
      { book: 'pml2', where: '§11.2 (integración de Monte Carlo y su precisión), §11.5 (muestreo por importancia), §11.6 (técnicas de reducción de la varianza) y §6.3.4–6.3.5 (estimadores del gradiente de una esperanza: REINFORCE y reparametrización).' },
    ],
    extra: [
      { text: 'Metropolis, N. y Ulam, S. (1949). The Monte Carlo Method. Journal of the American Statistical Association, 44(247), 335–341.', url: 'https://doi.org/10.1080/01621459.1949.10483310' },
    ],
  },
  en: {
    lede: String.raw`The Monte Carlo method approximates expectations and probabilities by averaging over simulated random samples. Its error falls as $1/\sqrt S$ with the number of samples $S$, a rate that does not depend on the dimension of the problem.`,
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`What is the mean activation of a ReLU, $\max(0, z)$, when its input $z$ is standard normal? You can solve the integral, or you can draw 10,000 values of $z$, apply the ReLU and average. The average will land very close to the exact value, $1/\sqrt{2\pi} \approx 0.399$, and the same procedure works when the integral cannot be solved: a whole network, a physical simulation or a model with thousands of variables.` },
          { key: 'An expectation is an average over a distribution: with samples from that distribution, you replace it by an average over the samples. A probability is the expectation of an indicator, so it is estimated by the fraction of simulations in which the event occurs.' },
        ],
      },
      {
        id: 'estimator',
        title: 'The estimator and its error',
        blocks: [
          { p: String.raw`With independent samples $x_1, \dots, x_S$ from $p(x)$:` },
          { math: String.raw`\mathbb{E}[f(X)] \approx \hat\mu_S = \frac{1}{S}\sum_{s=1}^{S} f(x_s), \qquad \mathrm{SE}(\hat\mu_S) = \frac{\sigma_f}{\sqrt S}` },
          { p: String.raw`where $\sigma_f$ is the standard deviation of $f(X)$. The estimator is unbiased, the [[lln-clt|law of large numbers]] guarantees that it converges to the true value and, if $\sigma_f$ is finite, the central limit theorem gives its standard error, which is estimated with the standard deviation of the samples themselves. The $1/\sqrt S$ rate does not depend on the dimension of $X$ (although $\sigma_f$ may), which is why Monte Carlo beats integration grids when there are many variables.` },
          { p: String.raw`To simulate you need to be able to sample from $p(x)$: by inverting the distribution function, by rejection or, when $p$ is only known up to a constant and there are many dimensions, with [[mcmc|MCMC]].` },
        ],
      },
      {
        id: 'precision',
        title: 'How many samples you need',
        blocks: [
          { p: String.raw`In the ReLU example, $\sigma_f \approx 0.584$:` },
          {
            table: {
              head: [String.raw`Samples $S$`, 'Standard error'],
              rows: [
                ['100', '0.058'],
                ['10,000', '0.0058'],
                ['1,000,000', '0.00058'],
              ],
              numeric: [0, 1],
            },
          },
          { p: String.raw`Each extra decimal digit of precision costs 100 times more samples. Rare events are the hard case: when estimating a probability $p$, the relative error is $\sqrt{(1-p)/(pS)}$, so with $p = 0.001$ and 10,000 samples it is around 32%. For them you use importance sampling, which simulates the region of interest more often and corrects the bias with weights.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“With enough samples, Monte Carlo gives the exact value.”', fix: String.raw`It gives an estimate with a random error of order $\sigma_f/\sqrt S$. Report that standard error along with the result, and fix the seed if you need to reproduce it.` },
      { claim: '“Doubling the samples halves the error.”', fix: String.raw`It reduces it by a factor of $\sqrt 2 \approx 1.41$. Halving it takes four times as many samples.` },
      { claim: '“For a rare event, the usual number of simulations is enough.”', fix: String.raw`The relative error grows as $p$ gets small: with $p = 0.001$ it takes a million samples to bring it down to 3%. And if no simulation produces the event, the estimate is 0, which does not mean the event is impossible.` },
      { claim: '“Samples from an MCMC chain count as independent.”', fix: String.raw`They are correlated, so the true standard error is larger than $\sigma_f/\sqrt S$. You need the effective sample size: see [[mcmc]].` },
    ],
    dl: [
      { title: 'The stochastic gradient.', text: String.raw`The gradient on a minibatch is a Monte Carlo estimate of the gradient over the whole training set: unbiased if the examples are drawn at random, with a variance that falls roughly as $1/B$ with the batch size $B$. That noise is part of what makes the loss curve jitter.` },
      { title: 'Expectations inside the loss.', text: String.raw`The loss of a [[vae|VAE]] contains an expectation over the latent code that is estimated with one or a few samples at each step. To differentiate through that sampling you write $z = \mu + \sigma\varepsilon$, with $\varepsilon \sim \mathcal{N}(0, 1)$: the reparameterization trick.` },
      { title: 'Averaged predictions.', text: 'Running several forward passes with dropout active at inference time (MC dropout) and averaging the outputs is a Monte Carlo estimate of the average prediction over the networks that dropout generates; the spread across passes gives a measure of uncertainty: see [[uncertainty]].' },
    ],
    quiz: [
      {
        prompt: String.raw`You estimate an expectation with 2500 independent samples, and the standard deviation of $f(X)$ is 3. What is the standard error of the estimate?`,
        options: [{ text: '0.0012' }, { text: '0.06', correct: true }, { text: '0.6' }],
        explain: String.raw`$\sigma_f/\sqrt S = 3/\sqrt{2500} = 3/50 = 0.06$. The value 0.0012 divides by $S$ instead of $\sqrt S$.`,
      },
      {
        prompt: 'To divide the error of a Monte Carlo estimate by 10, by how much do you multiply the number of samples?',
        options: [{ text: '10' }, { text: '100', correct: true }, { text: '1000' }],
        explain: String.raw`The error is proportional to $1/\sqrt S$: multiplying $S$ by 100 divides the error by $\sqrt{100} = 10$.`,
      },
      {
        prompt: 'You need an integral in 100 dimensions. Why use Monte Carlo rather than a grid of points?',
        options: [
          { text: String.raw`Because its error falls as $1/\sqrt S$, at a rate that does not depend on the dimension, whereas the number of grid points grows exponentially with it.`, correct: true },
          { text: 'Because Monte Carlo gives the exact result.' },
          { text: 'Because it does not need to evaluate the function being integrated.' },
        ],
        explain: String.raw`A grid with only 10 points per axis would have $10^{100}$ points in 100 dimensions. Monte Carlo keeps the $1/\sqrt S$ rate, although the constant $\sigma_f$ may grow with the dimension.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§4.7 (statistical simulation: uniform random number generators, inversion of the distribution function, rejection, the Box–Muller method and simulating from mixtures).' },
      { book: 'pml1', where: '§2.8.7 (Monte Carlo approximation of the distribution of a function of a random variable).' },
      { book: 'pml2', where: '§11.2 (Monte Carlo integration and its accuracy), §11.5 (importance sampling), §11.6 (variance reduction techniques) and §6.3.4–6.3.5 (gradient estimators for an expectation: REINFORCE and reparameterization).' },
    ],
    extra: [
      { text: 'Metropolis, N. and Ulam, S. (1949). The Monte Carlo Method. Journal of the American Statistical Association, 44(247), 335–341.', url: 'https://doi.org/10.1080/01621459.1949.10483310' },
    ],
  },
};

export default content;
