import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'La inferencia bayesiana trata un parámetro desconocido como una cantidad incierta: parte de lo que crees antes de ver los datos (el prior), lo combina con la verosimilitud y obtiene el posterior, una distribución completa sobre el parámetro.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Vuelve a la moneda de [[mle|máxima verosimilitud]]: 16 caras en 20 lanzamientos. El EMV se queda con $\hat\theta = 0{,}8$ y no usa nada más. Pero antes de lanzar ya sabías algo: la mayoría de las monedas están casi equilibradas. La inferencia bayesiana expresa ese conocimiento como una distribución sobre $\theta$, el **prior**, y la actualiza con los datos. El resultado, el **posterior**, queda entre lo que creías y lo que dicen los datos, y se acerca a los datos a medida que llegan más.` },
          { key: String.raw`Posterior $\propto$ verosimilitud $\times$ prior. Los datos no sustituyen a lo que sabías: lo actualizan, y cuantos más datos hay, menos pesa el prior.` },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { p: String.raw`Para un parámetro $\theta$ y unos datos $D$, el [[bayes-rule|teorema de Bayes]] da la distribución posterior:` },
          { math: String.raw`p(\theta \mid D) = \frac{p(D \mid \theta)\, p(\theta)}{p(D)}, \qquad p(D) = \int p(D \mid \theta)\, p(\theta)\, d\theta` },
          {
            list: [
              String.raw`**Prior** $p(\theta)$: lo que crees sobre $\theta$ antes de ver los datos.`,
              String.raw`**Verosimilitud** $p(D \mid \theta)$: la misma función que maximiza el EMV; aquí pondera cada valor de $\theta$ según lo bien que explica los datos.`,
              String.raw`**Evidencia** o verosimilitud marginal $p(D)$: no depende de $\theta$, solo normaliza. Salvo en casos sencillos como los [[conjugate-priors|conjugados]], no suele tener forma cerrada, y por eso el posterior se suele aproximar con [[mcmc|MCMC]] o con [[variational-inference|inferencia variacional]].`,
              String.raw`**Posterior** $p(\theta \mid D)$: todo lo que sabes de $\theta$ tras ver los datos. De él salen estimaciones puntuales (la media, o la moda: [[map-estimation|MAP]]), [[posterior-predictive|intervalos de credibilidad y predicciones]].`,
            ],
          },
        ],
      },
      {
        id: 'ejemplo',
        title: 'La moneda, paso a paso',
        blocks: [
          { p: String.raw`Con un prior $\text{Beta}(a, b)$ y $k$ caras en $n$ lanzamientos, el posterior es $\text{Beta}(a + k,\ b + n - k)$, con media $(a + k)/(a + b + n)$; el porqué está en [[conjugate-priors|priors conjugados]]. Toma $a = b = 5$: un prior centrado en 0,5 que da un 95 % de probabilidad a $\theta$ entre 0,21 y 0,79. Así evoluciona el posterior con datos que tienen siempre un 80 % de caras:` },
          {
            table: {
              head: ['Caras / lanzamientos', 'Posterior', 'Media posterior', 'Intervalo de credibilidad del 95 % (central)'],
              rows: [
                ['4 / 5', String.raw`$\text{Beta}(9;\ 6)$`, '0,600', '[0,351; 0,823]'],
                ['16 / 20', String.raw`$\text{Beta}(21;\ 9)$`, '0,700', '[0,528; 0,847]'],
                ['80 / 100', String.raw`$\text{Beta}(85;\ 25)$`, '0,773', '[0,690; 0,846]'],
                ['800 / 1000', String.raw`$\text{Beta}(805;\ 205)$`, '0,797', '[0,772; 0,821]'],
              ],
              numeric: [2, 3],
            },
          },
          { p: String.raw`El EMV vale 0,8 en todas las filas. Con 5 lanzamientos el prior aún pesa más que los datos; con 1000, el posterior casi coincide con el EMV y el intervalo se estrecha. Además, el posterior responde preguntas directas sobre el parámetro: con 16 caras de 20, $P(\theta > 0{,}5 \mid D) \approx 0{,}988$. Un [[hypothesis-testing|p-valor]] no da una probabilidad así.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«El prior vuelve arbitrario el resultado.»', fix: 'El prior es una hipótesis explícita, como la verosimilitud, y se puede discutir. Con pocos datos influye, así que conviene probar varios priors razonables y ver si cambian las conclusiones; con muchos datos su efecto se diluye, como en la tabla.' },
      { claim: '«Un prior uniforme no aporta información.»', fix: String.raw`Ser plano depende de la parametrización: si $\theta$ es uniforme entre 0 y 1, sus log-odds $\log\frac{\theta}{1-\theta}$ no lo son: siguen una distribución logística, con forma de campana centrada en 0. Todo prior afirma algo.` },
      { claim: String.raw`«La evidencia $p(D)$ no importa.»`, fix: 'Para inferir θ dentro de un modelo es solo una constante, pero es la cantidad con la que se comparan modelos distintos. Y es su integral la que suele impedir calcular el posterior de forma exacta.' },
      { claim: '«Con suficientes datos se corrige cualquier prior.»', fix: 'No si el prior da probabilidad cero a una zona: el posterior también será cero allí, digan lo que digan los datos. A lo que no sea imposible, dale una probabilidad pequeña pero positiva.' },
    ],
    dl: [
      { title: 'Redes neuronales bayesianas.', text: String.raw`Ponen un prior sobre los pesos (normalmente gaussiano) y buscan el posterior $p(\mathbf{w} \mid D)$. Con millones de pesos no se puede calcular de forma exacta, así que se aproxima: [[variational-inference|inferencia variacional]], [[mcmc|MCMC]], aproximación de Laplace o conjuntos de redes. Lo que se gana es una medida de la [[uncertainty|incertidumbre epistémica]].` },
      { title: 'El weight decay es un prior.', text: 'Entrenar con penalización L2 equivale a buscar el máximo del posterior con un prior gaussiano sobre los pesos: ver [[map-estimation]]. Pero así te quedas con un único punto y descartas la incertidumbre.' },
      { title: 'El posterior de hoy es el prior de mañana.', text: 'Con datos que llegan por partes, el posterior tras un lote sirve de prior para el siguiente. Es la idea de elastic weight consolidation (EWC) en aprendizaje continuo: una aproximación gaussiana del posterior de la tarea anterior actúa como prior y penaliza alejarse de los pesos que eran importantes para ella.' },
    ],
    quiz: [
      {
        prompt: String.raw`Con un prior $\text{Beta}(2;\ 2)$ observas 8 caras en 10 lanzamientos. ¿Cuál es la media posterior de $\theta$?`,
        options: [{ text: '0,8' }, { text: '0,714', correct: true }, { text: '0,5' }],
        explain: String.raw`El posterior es $\text{Beta}(10;\ 4)$, con media $10/14 \approx 0{,}714$: entre la media del prior (0,5) y el EMV (0,8).`,
      },
      {
        prompt: String.raw`Tu prior da probabilidad 0 a $\theta > 0{,}9$. Lanzas la moneda 100 veces y salen 100 caras. ¿Qué probabilidad posterior tiene $\theta > 0{,}9$?`,
        options: [{ text: 'Casi 1: los datos mandan.' }, { text: '0,5' }, { text: '0', correct: true }],
        explain: 'El posterior es proporcional a verosimilitud × prior: donde el prior vale 0, el posterior también, sean cuales sean los datos.',
      },
      {
        prompt: String.raw`¿Qué papel tiene $p(D)$ al calcular el posterior de $\theta$ dentro de un modelo?`,
        options: [
          { text: String.raw`Es una constante de normalización: no depende de $\theta$.`, correct: true },
          { text: 'Es un segundo prior que hay que elegir.' },
          { text: String.raw`Es la probabilidad de que el valor estimado de $\theta$ sea el correcto.` },
        ],
        explain: String.raw`$p(D) = \int p(D \mid \theta)\,p(\theta)\,d\theta$ no depende de $\theta$: solo hace que el posterior integre 1. Importa al comparar modelos, no al comparar valores de $\theta$.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§6.2.1 (teorema de Bayes para parámetros continuos y actualización secuencial), §6.2.2 (cómo resumir el posterior) y §6.2.3 (el papel del prior: priors difusos, impropios y con probabilidad cero).' },
      { book: 'pml1', where: '§4.6 (prior, verosimilitud, posterior y verosimilitud marginal) y §4.6.2 (el modelo beta-binomial desarrollado paso a paso).' },
      { book: 'pml2', where: '§3.2.1 (análisis bayesiano completo de una moneda), §3.2.3 (cómo elegir el prior) y §3.5 (priors no informativos).' },
    ],
  },
  en: {
    lede: 'Bayesian inference treats an unknown parameter as an uncertain quantity: it starts from what you believe before seeing the data (the prior), combines it with the likelihood and obtains the posterior, a full distribution over the parameter.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`Go back to the coin from [[mle|maximum likelihood]]: 16 heads in 20 tosses. The MLE settles on $\hat\theta = 0.8$ and uses nothing else. But before tossing you already knew something: most coins are close to fair. Bayesian inference expresses that knowledge as a distribution over $\theta$, the **prior**, and updates it with the data. The result, the **posterior**, lies between what you believed and what the data say, and moves towards the data as more of them arrive.` },
          { key: String.raw`Posterior $\propto$ likelihood $\times$ prior. The data do not replace what you knew: they update it, and the more data there are, the less the prior weighs.` },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { p: String.raw`For a parameter $\theta$ and data $D$, [[bayes-rule|Bayes’ rule]] gives the posterior distribution:` },
          { math: String.raw`p(\theta \mid D) = \frac{p(D \mid \theta)\, p(\theta)}{p(D)}, \qquad p(D) = \int p(D \mid \theta)\, p(\theta)\, d\theta` },
          {
            list: [
              String.raw`**Prior** $p(\theta)$: what you believe about $\theta$ before seeing the data.`,
              String.raw`**Likelihood** $p(D \mid \theta)$: the same function the MLE maximizes; here it weights each value of $\theta$ by how well it explains the data.`,
              String.raw`**Evidence** or marginal likelihood $p(D)$: it does not depend on $\theta$, it only normalizes. Except in simple cases such as [[conjugate-priors|conjugate models]], it rarely has a closed form, which is why the posterior is usually approximated with [[mcmc|MCMC]] or [[variational-inference|variational inference]].`,
              String.raw`**Posterior** $p(\theta \mid D)$: everything you know about $\theta$ after seeing the data. Point estimates (the mean, or the mode: [[map-estimation|MAP]]), [[posterior-predictive|credible intervals and predictions]] all come from it.`,
            ],
          },
        ],
      },
      {
        id: 'example',
        title: 'The coin, step by step',
        blocks: [
          { p: String.raw`With a $\text{Beta}(a, b)$ prior and $k$ heads in $n$ tosses, the posterior is $\text{Beta}(a + k,\ b + n - k)$, with mean $(a + k)/(a + b + n)$; the reason is explained in [[conjugate-priors|conjugate priors]]. Take $a = b = 5$: a prior centered on 0.5 that gives $\theta$ a 95% probability of lying between 0.21 and 0.79. This is how the posterior evolves with data that always have 80% heads:` },
          {
            table: {
              head: ['Heads / tosses', 'Posterior', 'Posterior mean', '95% credible interval (central)'],
              rows: [
                ['4 / 5', String.raw`$\text{Beta}(9, 6)$`, '0.600', '[0.351, 0.823]'],
                ['16 / 20', String.raw`$\text{Beta}(21, 9)$`, '0.700', '[0.528, 0.847]'],
                ['80 / 100', String.raw`$\text{Beta}(85, 25)$`, '0.773', '[0.690, 0.846]'],
                ['800 / 1000', String.raw`$\text{Beta}(805, 205)$`, '0.797', '[0.772, 0.821]'],
              ],
              numeric: [2, 3],
            },
          },
          { p: String.raw`The MLE is 0.8 in every row. With 5 tosses the prior still weighs more than the data; with 1000, the posterior almost matches the MLE and the interval narrows. The posterior also answers direct questions about the parameter: with 16 heads out of 20, $P(\theta > 0.5 \mid D) \approx 0.988$. A [[hypothesis-testing|p-value]] does not give a probability like that.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“The prior makes the result arbitrary.”', fix: 'The prior is an explicit assumption, like the likelihood, and it can be debated. With little data it matters, so it is good practice to try several reasonable priors and check whether the conclusions change; with a lot of data its effect fades, as in the table.' },
      { claim: '“A uniform prior carries no information.”', fix: String.raw`Being flat depends on the parameterization: if $\theta$ is uniform between 0 and 1, its log-odds $\log\frac{\theta}{1-\theta}$ are not: they follow a logistic distribution, bell-shaped and centered on 0. Every prior says something.` },
      { claim: String.raw`“The evidence $p(D)$ does not matter.”`, fix: 'For inferring θ within one model it is just a constant, but it is the quantity used to compare different models. And its integral is what usually prevents computing the posterior exactly.' },
      { claim: '“With enough data, any prior gets corrected.”', fix: 'Not if the prior gives zero probability to a region: the posterior will also be zero there, whatever the data say. Give anything that is not impossible a small but positive probability.' },
    ],
    dl: [
      { title: 'Bayesian neural networks.', text: String.raw`They place a prior on the weights (usually Gaussian) and seek the posterior $p(\mathbf{w} \mid D)$. With millions of weights it cannot be computed exactly, so it is approximated: [[variational-inference|variational inference]], [[mcmc|MCMC]], the Laplace approximation or ensembles of networks. What you gain is a measure of [[uncertainty|epistemic uncertainty]].` },
      { title: 'Weight decay is a prior.', text: 'Training with an L2 penalty is equivalent to finding the maximum of the posterior under a Gaussian prior on the weights: see [[map-estimation]]. But that keeps a single point and throws away the uncertainty.' },
      { title: 'Today’s posterior is tomorrow’s prior.', text: 'When data arrive in batches, the posterior after one batch serves as the prior for the next. This is the idea behind elastic weight consolidation (EWC) in continual learning: a Gaussian approximation to the posterior of the previous task acts as a prior and penalizes moving away from the weights that mattered for it.' },
    ],
    quiz: [
      {
        prompt: String.raw`With a $\text{Beta}(2, 2)$ prior you observe 8 heads in 10 tosses. What is the posterior mean of $\theta$?`,
        options: [{ text: '0.8' }, { text: '0.714', correct: true }, { text: '0.5' }],
        explain: String.raw`The posterior is $\text{Beta}(10, 4)$, with mean $10/14 \approx 0.714$: between the prior mean (0.5) and the MLE (0.8).`,
      },
      {
        prompt: String.raw`Your prior gives probability 0 to $\theta > 0.9$. You toss the coin 100 times and get 100 heads. What posterior probability does $\theta > 0.9$ have?`,
        options: [{ text: 'Almost 1: the data win.' }, { text: '0.5' }, { text: '0', correct: true }],
        explain: 'The posterior is proportional to likelihood × prior: wherever the prior is 0, so is the posterior, whatever the data.',
      },
      {
        prompt: String.raw`What role does $p(D)$ play when computing the posterior of $\theta$ within one model?`,
        options: [
          { text: String.raw`It is a normalizing constant: it does not depend on $\theta$.`, correct: true },
          { text: 'It is a second prior that you have to choose.' },
          { text: String.raw`It is the probability that the estimated value of $\theta$ is correct.` },
        ],
        explain: String.raw`$p(D) = \int p(D \mid \theta)\,p(\theta)\,d\theta$ does not depend on $\theta$: it only makes the posterior integrate to 1. It matters when comparing models, not when comparing values of $\theta$.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§6.2.1 (Bayes’ theorem for continuous parameters and sequential updating), §6.2.2 (how to summarize the posterior) and §6.2.3 (the role of the prior: diffuse, improper and zero-probability priors).' },
      { book: 'pml1', where: '§4.6 (prior, likelihood, posterior and marginal likelihood) and §4.6.2 (the beta-binomial model worked out step by step).' },
      { book: 'pml2', where: '§3.2.1 (a full Bayesian analysis of a coin), §3.2.3 (how to choose the prior) and §3.5 (noninformative priors).' },
    ],
  },
};

export default content;
