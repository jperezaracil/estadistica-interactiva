import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Los métodos MCMC (Markov chain Monte Carlo) construyen una cadena de Markov cuya distribución estacionaria es el posterior. Tras un periodo de calentamiento, sus estados son muestras correlacionadas del posterior, y para generarlas basta con conocerlo salvo una constante.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Salvo en casos sencillos como los [[conjugate-priors|conjugados]], el [[prior-posterior|posterior]] $p(\theta \mid D)$ no suele poder calcularse, porque la evidencia $p(D)$ es una integral intratable. Pero el producto $p(D \mid \theta)\,p(\theta)$ sí se puede evaluar en cualquier punto. MCMC aprovecha eso: un caminante propone moverse a un punto cercano; si allí el posterior es mayor, se mueve; si es menor, se mueve solo a veces, con probabilidad igual al cociente de los dos valores. A la larga, el tiempo que pasa en cada zona es proporcional a su probabilidad posterior, y sus posiciones sirven para hacer [[monte-carlo|Monte Carlo]].` },
          { key: String.raw`MCMC solo necesita el posterior salvo una constante: $p(D)$ se cancela en el cociente que decide si se acepta cada paso.` },
        ],
      },
      {
        id: 'algoritmo',
        title: 'El algoritmo de Metropolis-Hastings',
        blocks: [
          { p: String.raw`Llama $\tilde p(\theta) = p(D \mid \theta)\,p(\theta)$ al posterior sin normalizar. Desde el estado actual $\theta$, propón $\theta'$ con una distribución $q(\theta' \mid \theta)$, por ejemplo $\theta' = \theta + \varepsilon$ con $\varepsilon$ normal, y acéptalo con probabilidad` },
          { math: String.raw`\alpha = \min\left(1,\ \frac{\tilde p(\theta')\, q(\theta \mid \theta')}{\tilde p(\theta)\, q(\theta' \mid \theta)}\right)` },
          { p: String.raw`Si aceptas, el siguiente estado es $\theta'$; si no, la cadena se queda en $\theta$ y lo cuenta otra vez. Con una propuesta simétrica, como el paseo aleatorio normal, los términos $q$ se cancelan (algoritmo de Metropolis). Las primeras iteraciones, aún influidas por el punto de partida, se descartan como calentamiento (burn-in).` },
          {
            list: [
              '**Gibbs**: actualiza cada parámetro muestreando de su distribución condicionada a los demás. Es un caso particular de Metropolis-Hastings en el que siempre se acepta.',
              String.raw`**Hamiltonian Monte Carlo (HMC)** y su variante adaptativa NUTS: usan el gradiente de $\log \tilde p$ para proponer saltos largos con alta probabilidad de aceptación. Es el método por defecto en Stan y PyMC.`,
            ],
          },
        ],
      },
      {
        id: 'ejemplo',
        title: 'Un caso con solución conocida',
        blocks: [
          { p: String.raw`Para comprobar que funciona, aplícalo al posterior $\text{Beta}(21;\ 9)$ de [[prior-posterior|la moneda]], cuya media exacta es 0,700. Con 20 000 iteraciones, tras descartar 1000 de calentamiento, y una propuesta normal de desviación $s = 0{,}1$, la media de la cadena sale 0,70 y sus cuantiles del 2,5 % y del 97,5 % quedan a menos de 0,01 de los exactos (0,528 y 0,847). Pero el tamaño del paso importa mucho:` },
          {
            table: {
              head: [String.raw`Paso $s$ de la propuesta`, 'Propuestas aceptadas', 'Tamaño muestral efectivo'],
              rows: [
                ['0,01', '96 %', '≈ 80'],
                ['0,1', '66 %', '≈ 3000'],
                ['1', '10 %', '≈ 1400'],
              ],
              numeric: [0, 1, 2],
            },
          },
          { p: 'Con pasos diminutos casi todo se acepta, pero la cadena apenas avanza; con pasos enormes casi todo se rechaza y la cadena se queda quieta. En los dos casos las muestras consecutivas se parecen mucho, y las 20 000 iteraciones valen por muchas menos muestras independientes: eso es lo que mide el tamaño muestral efectivo (ESS). Los valores son aproximados, de simulaciones con varias semillas.' },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Las muestras de MCMC son independientes.»', fix: 'Los estados consecutivos están correlacionados, y la precisión de tus estimaciones depende del tamaño muestral efectivo, no del número de iteraciones. Aclarar la cadena (thinning: quedarte con una muestra de cada k) ahorra memoria, pero no añade información.' },
      { claim: '«Si la traza parece estable, la cadena ha convergido.»', fix: String.raw`Una cadena puede quedarse atrapada en un modo y parecer estable. Lanza varias cadenas desde puntos dispersos y compáralas: el diagnóstico $\hat R$ debe salir muy cerca de 1. Los diagnósticos detectan problemas, pero no demuestran la convergencia.` },
      { claim: '«Cuantas más propuestas se aceptan, mejor.»', fix: 'En el ejemplo, aceptar el 96 % con pasos diminutos deja unas 80 muestras efectivas de 20 000. Importa cuánto explora la cadena, no cuánto acepta.' },
    ],
    dl: [
      { title: 'Langevin con gradientes estocásticos.', text: 'SGLD (Welling y Teh, 2011) añade ruido gaussiano a cada paso de SGD y reduce el paso poco a poco; así los pesos no convergen a un punto, sino que recorren aproximadamente el posterior. Es la forma más directa de hacer MCMC con redes grandes, aunque sus muestras están muy correlacionadas.' },
      { title: 'Generar con el gradiente.', text: String.raw`Los modelos basados en energía y los generativos basados en score muestrean con dinámica de Langevin, un MCMC que avanza siguiendo $\nabla_x \log p(x)$ más ruido. En los modelos basados en score, ese gradiente lo estima una red (Song y Ermon, 2019).` },
      { title: 'Una referencia para los métodos aproximados.', text: 'HMC es demasiado caro para redes grandes, pero en redes pequeñas sirve como referencia para comprobar si una aproximación (variacional, Laplace, conjuntos de redes) captura bien el posterior.' },
    ],
    quiz: [
      {
        prompt: String.raw`¿Por qué Metropolis-Hastings no necesita calcular la evidencia $p(D)$?`,
        options: [
          { text: 'Porque se cancela en el cociente de aceptación.', correct: true },
          { text: 'Porque vale 1 en los modelos bayesianos.' },
          { text: 'Porque se estima durante el calentamiento.' },
        ],
        explain: String.raw`El cociente $\tilde p(\theta')/\tilde p(\theta)$ es igual a $p(\theta' \mid D)/p(\theta \mid D)$: $p(D)$ aparece arriba y abajo.`,
      },
      {
        prompt: 'En una iteración se rechaza la propuesta. ¿Qué hace la cadena?',
        options: [
          { text: 'Descarta la iteración sin guardar nada.' },
          { text: 'Propone de nuevo hasta que alguna propuesta se acepte.' },
          { text: 'Se queda en el estado actual y lo registra otra vez.', correct: true },
        ],
        explain: 'Repetir el estado actual es parte del algoritmo: así las zonas de alta probabilidad, donde la cadena se queda más tiempo, reciben el peso que les corresponde. Si descartaras los rechazos, las muestras seguirían una distribución incorrecta.',
      },
      {
        prompt: 'Una cadena de 10 000 iteraciones tiene una autocorrelación positiva fuerte. Su tamaño muestral efectivo es:',
        options: [
          { text: 'Mayor que 10 000.' },
          { text: 'Mucho menor que 10 000.', correct: true },
          { text: 'Exactamente 10 000.' },
        ],
        explain: 'Con autocorrelación positiva, cada iteración aporta menos información nueva que una muestra independiente, así que el ESS es menor que el número de iteraciones.',
      },
    ],
    further: [
      { book: 'wilks', where: '§6.4.1 (idea de MCMC, calentamiento y aclarado de la cadena), §6.4.2 (algoritmo de Metropolis-Hastings) y §6.4.3 (muestreador de Gibbs y modelos jerárquicos).' },
      { book: 'pml2', where: '§12.2 (Metropolis-Hastings: idea, por qué funciona y elección de la propuesta), §12.3 (Gibbs), §12.5 (Hamiltonian Monte Carlo), §12.6 (convergencia, diagnósticos y tamaño muestral efectivo) y §12.7.1 (SGLD).' },
    ],
    extra: [
      { text: 'Metropolis, N. et al. (1953). Equation of State Calculations by Fast Computing Machines. The Journal of Chemical Physics, 21(6), 1087–1092.', url: 'https://doi.org/10.1063/1.1699114' },
      { text: 'Hastings, W. K. (1970). Monte Carlo sampling methods using Markov chains and their applications. Biometrika, 57(1), 97–109.', url: 'https://doi.org/10.1093/biomet/57.1.97' },
    ],
  },
  en: {
    lede: 'MCMC (Markov chain Monte Carlo) methods build a Markov chain whose stationary distribution is the posterior. After a warm-up period, its states are correlated samples from the posterior, and generating them only requires knowing the posterior up to a constant.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`Except in simple cases such as [[conjugate-priors|conjugate models]], the [[prior-posterior|posterior]] $p(\theta \mid D)$ can rarely be computed, because the evidence $p(D)$ is an intractable integral. But the product $p(D \mid \theta)\,p(\theta)$ can be evaluated at any point. MCMC takes advantage of that: a walker proposes a move to a nearby point; if the posterior is higher there, it moves; if it is lower, it moves only sometimes, with probability equal to the ratio of the two values. In the long run, the time it spends in each region is proportional to its posterior probability, and its positions can be used for [[monte-carlo|Monte Carlo]].` },
          { key: String.raw`MCMC only needs the posterior up to a constant: $p(D)$ cancels in the ratio that decides whether each step is accepted.` },
        ],
      },
      {
        id: 'algorithm',
        title: 'The Metropolis–Hastings algorithm',
        blocks: [
          { p: String.raw`Call $\tilde p(\theta) = p(D \mid \theta)\,p(\theta)$ the unnormalized posterior. From the current state $\theta$, propose $\theta'$ from a distribution $q(\theta' \mid \theta)$, for example $\theta' = \theta + \varepsilon$ with normal $\varepsilon$, and accept it with probability` },
          { math: String.raw`\alpha = \min\left(1,\ \frac{\tilde p(\theta')\, q(\theta \mid \theta')}{\tilde p(\theta)\, q(\theta' \mid \theta)}\right)` },
          { p: String.raw`If you accept, the next state is $\theta'$; if not, the chain stays at $\theta$ and counts it again. With a symmetric proposal, such as the normal random walk, the $q$ terms cancel (the Metropolis algorithm). The first iterations, still influenced by the starting point, are discarded as warm-up (burn-in).` },
          {
            list: [
              '**Gibbs**: updates each parameter by sampling from its distribution conditional on the others. It is a special case of Metropolis–Hastings in which every proposal is accepted.',
              String.raw`**Hamiltonian Monte Carlo (HMC)** and its adaptive variant NUTS: they use the gradient of $\log \tilde p$ to propose long jumps with a high acceptance probability. It is the default method in Stan and PyMC.`,
            ],
          },
        ],
      },
      {
        id: 'example',
        title: 'A case with a known answer',
        blocks: [
          { p: String.raw`To check that it works, apply it to the $\text{Beta}(21, 9)$ posterior of [[prior-posterior|the coin]], whose exact mean is 0.700. With 20,000 iterations after discarding 1000 of warm-up, and a normal proposal with standard deviation $s = 0.1$, the chain’s mean comes out at 0.70 and its 2.5% and 97.5% quantiles are within 0.01 of the exact ones (0.528 and 0.847). But the step size matters a lot:` },
          {
            table: {
              head: [String.raw`Proposal step $s$`, 'Proposals accepted', 'Effective sample size'],
              rows: [
                ['0.01', '96%', '≈ 80'],
                ['0.1', '66%', '≈ 3000'],
                ['1', '10%', '≈ 1400'],
              ],
              numeric: [0, 1, 2],
            },
          },
          { p: 'With tiny steps almost everything is accepted, but the chain barely moves; with huge steps almost everything is rejected and the chain stands still. In both cases consecutive samples are very similar, and the 20,000 iterations are worth far fewer independent samples: that is what the effective sample size (ESS) measures. The values are approximate, from simulations with several seeds.' },
        ],
      },
    ],
    pitfalls: [
      { claim: '“MCMC samples are independent.”', fix: 'Consecutive states are correlated, and the precision of your estimates depends on the effective sample size, not on the number of iterations. Thinning the chain (keeping one sample in every k) saves memory, but adds no information.' },
      { claim: '“If the trace looks stable, the chain has converged.”', fix: String.raw`A chain can get stuck in one mode and look stable. Run several chains from dispersed starting points and compare them: the $\hat R$ diagnostic should be very close to 1. Diagnostics detect problems, but they do not prove convergence.` },
      { claim: '“The more proposals are accepted, the better.”', fix: 'In the example, accepting 96% with tiny steps leaves about 80 effective samples out of 20,000. What matters is how much the chain explores, not how much it accepts.' },
    ],
    dl: [
      { title: 'Langevin with stochastic gradients.', text: 'SGLD (Welling and Teh, 2011) adds Gaussian noise to each SGD step and slowly decreases the step size; the weights then do not converge to a point but approximately wander over the posterior. It is the most direct way to do MCMC with large networks, although its samples are strongly correlated.' },
      { title: 'Generating with the gradient.', text: String.raw`Energy-based models and score-based generative models sample with Langevin dynamics, an MCMC method that moves along $\nabla_x \log p(x)$ plus noise. In score-based models that gradient is estimated by a network (Song and Ermon, 2019).` },
      { title: 'A reference for approximate methods.', text: 'HMC is too expensive for large networks, but on small ones it serves as a reference to check whether an approximation (variational, Laplace, ensembles) captures the posterior well.' },
    ],
    quiz: [
      {
        prompt: String.raw`Why does Metropolis–Hastings not need to compute the evidence $p(D)$?`,
        options: [
          { text: 'Because it cancels in the acceptance ratio.', correct: true },
          { text: 'Because it equals 1 in Bayesian models.' },
          { text: 'Because it is estimated during warm-up.' },
        ],
        explain: String.raw`The ratio $\tilde p(\theta')/\tilde p(\theta)$ equals $p(\theta' \mid D)/p(\theta \mid D)$: $p(D)$ appears in the numerator and in the denominator.`,
      },
      {
        prompt: 'At some iteration the proposal is rejected. What does the chain do?',
        options: [
          { text: 'It discards the iteration and stores nothing.' },
          { text: 'It keeps proposing until some proposal is accepted.' },
          { text: 'It stays at the current state and records it again.', correct: true },
        ],
        explain: 'Repeating the current state is part of the algorithm: that is how high-probability regions, where the chain lingers, get the weight they deserve. If you discarded the rejections, the samples would follow the wrong distribution.',
      },
      {
        prompt: 'A chain of 10,000 iterations has strong positive autocorrelation. Its effective sample size is:',
        options: [
          { text: 'Larger than 10,000.' },
          { text: 'Much smaller than 10,000.', correct: true },
          { text: 'Exactly 10,000.' },
        ],
        explain: 'With positive autocorrelation, each iteration brings less new information than an independent sample, so the ESS is smaller than the number of iterations.',
      },
    ],
    further: [
      { book: 'wilks', where: '§6.4.1 (the idea of MCMC, burn-in and thinning), §6.4.2 (the Metropolis–Hastings algorithm) and §6.4.3 (the Gibbs sampler and hierarchical models).' },
      { book: 'pml2', where: '§12.2 (Metropolis–Hastings: basic idea, why it works and choice of proposal), §12.3 (Gibbs), §12.5 (Hamiltonian Monte Carlo), §12.6 (convergence, diagnostics and effective sample size) and §12.7.1 (SGLD).' },
    ],
    extra: [
      { text: 'Metropolis, N. et al. (1953). Equation of State Calculations by Fast Computing Machines. The Journal of Chemical Physics, 21(6), 1087–1092.', url: 'https://doi.org/10.1063/1.1699114' },
      { text: 'Hastings, W. K. (1970). Monte Carlo sampling methods using Markov chains and their applications. Biometrika, 57(1), 97–109.', url: 'https://doi.org/10.1093/biomet/57.1.97' },
    ],
  },
};

export default content;
