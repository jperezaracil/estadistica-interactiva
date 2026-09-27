import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'La inferencia variacional aproxima un posterior intratable con la distribución más parecida de una familia sencilla, y la encuentra optimizando en lugar de muestreando. El objetivo que se maximiza, el ELBO, es una cota inferior del logaritmo de la evidencia.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`[[mcmc|MCMC]] da muestras exactas a la larga, pero puede ser muy lento. La inferencia variacional cambia de estrategia: elige una familia manejable $q_\phi(\theta)$, por ejemplo gaussianas con covarianza diagonal, y ajusta sus parámetros $\phi$ hasta que $q_\phi$ se parezca lo más posible al [[prior-posterior|posterior]]. El parecido se mide con la [[kl-divergence|divergencia KL]] $\mathrm{KL}(q \,\Vert\, p(\theta \mid D))$, que no se puede calcular directamente porque depende de $p(D)$. El truco es que no hace falta calcularla.` },
          { key: String.raw`$\log p(D) = \text{ELBO}(q) + \mathrm{KL}(q \,\Vert\, p(\theta \mid D))$. Como el lado izquierdo no depende de $q$, subir el ELBO es acercar $q$ al posterior.` },
        ],
      },
      {
        id: 'elbo',
        title: 'El ELBO',
        blocks: [
          { p: 'El ELBO (evidence lower bound) solo necesita la verosimilitud y el prior:' },
          { math: String.raw`\text{ELBO}(q) = \mathbb{E}_{q}\big[\log p(D \mid \theta)\big] - \mathrm{KL}\big(q(\theta) \,\Vert\, p(\theta)\big) \;\le\; \log p(D)` },
          {
            list: [
              String.raw`El primer término premia que $q$ ponga su masa donde los datos son probables (ajuste).`,
              String.raw`El segundo penaliza que $q$ se aleje del prior (regularización).`,
              String.raw`Como la KL nunca es negativa, el ELBO es una cota inferior de $\log p(D)$, y la diferencia es exactamente $\mathrm{KL}(q \,\Vert\, p(\theta \mid D))$.`,
            ],
          },
          { p: String.raw`En aprendizaje profundo se suele maximizar con gradientes estocásticos. Para derivar a través del muestreo se usa el truco de la reparametrización: si $q = \mathcal{N}(\mu, \sigma^2)$, se escribe $\theta = \mu + \sigma\varepsilon$ con $\varepsilon \sim \mathcal{N}(0;\ 1)$, y el gradiente llega a $\mu$ y a $\sigma$. Con minibatches escala a conjuntos de datos grandes.` },
        ],
      },
      {
        id: 'ejemplo',
        title: 'Campo medio en un caso gaussiano',
        blocks: [
          { p: String.raw`Supón que el posterior es una [[mvn|normal bivariante]] con varianzas 1 y correlación $\rho$, y lo aproximas con una $q$ de **campo medio** (mean field), con componentes independientes: $q(\theta_1, \theta_2) = q_1(\theta_1)\,q_2(\theta_2)$. El óptimo de $\mathrm{KL}(q \,\Vert\, p)$ acierta la media, pero cada $q_i$ tiene varianza $1 - \rho^2$ en lugar de 1:` },
          {
            table: {
              head: [String.raw`Correlación $\rho$`, 'Desviación real', String.raw`Desviación de $q$`],
              rows: [
                ['0', '1', '1'],
                ['0,5', '1', '0,866'],
                ['0,9', '1', '0,436'],
                ['0,99', '1', '0,141'],
              ],
              numeric: [0, 1, 2],
            },
          },
          { p: String.raw`Cuanto más correlacionado está el posterior, más se infravalora la incertidumbre. Es un efecto típico de minimizar la KL en este sentido: $q$ prefiere quedarse dentro de las zonas de alta probabilidad del posterior antes que cubrirlo entero.` },
        ],
      },
      {
        id: 'frente-mcmc',
        title: 'Frente a MCMC',
        blocks: [
          {
            list: [
              '**Velocidad:** la inferencia variacional convierte la inferencia en optimización, aprovecha GPU y minibatches, y escala a millones de datos y parámetros. MCMC suele ser mucho más lento.',
              '**Exactitud:** MCMC es exacto en el límite de infinitas iteraciones; la inferencia variacional tiene un sesgo que no desaparece si el posterior real no está en la familia elegida.',
              '**Resultado:** la inferencia variacional da una distribución con fórmula, fácil de evaluar y de muestrear, y una cota de la evidencia; MCMC da muestras.',
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '«El ELBO es la log-verosimilitud del modelo.»', fix: String.raw`Es una cota inferior: $\log p(D) = \text{ELBO} + \mathrm{KL}(q \,\Vert\, p(\theta \mid D))$. Comparar modelos por su ELBO puede engañar si la aproximación es peor en unos que en otros.` },
      { claim: String.raw`«La inferencia variacional minimiza $\mathrm{KL}(p \,\Vert\, q)$, como la máxima verosimilitud.»`, fix: String.raw`Minimiza la KL en el otro sentido, $\mathrm{KL}(q \,\Vert\, p)$. Esa versión castiga que $q$ ponga masa donde el posterior casi no tiene, así que $q$ tiende a concentrarse en un modo y a infravalorar la varianza: ver [[kl-divergence]].` },
      { claim: '«Con suficientes iteraciones, la inferencia variacional da el posterior exacto.»', fix: 'Solo si el posterior exacto pertenece a la familia de q. Si no, queda una diferencia que no se reduce optimizando más, a diferencia de MCMC.' },
      { claim: '«Una aproximación de campo medio supone que el posterior no tiene correlaciones.»', fix: 'La independencia es una restricción sobre q, no una propiedad del posterior. Las correlaciones siguen ahí; q simplemente no puede representarlas, y por eso infravalora la incertidumbre, como muestra la tabla.' },
    ],
    dl: [
      { title: 'Autocodificadores variacionales.', text: 'La pérdida de un [[vae|VAE]] es el ELBO cambiado de signo. Un codificador predice los parámetros de q para cada dato (inferencia amortizada), y la reparametrización permite entrenarlo con retropropagación.' },
      { title: 'Pesos con incertidumbre.', text: 'Bayes by Backprop (Blundell et al., 2015) aprende una media y una desviación para cada peso de la red maximizando el ELBO. Duplica el número de parámetros, y la restricción de campo medio limita lo bien que aproxima el posterior.' },
      { title: 'Modelos de difusión.', text: 'Su función de pérdida se deduce de un ELBO sobre la verosimilitud de los datos (Ho et al., 2020), aunque en la práctica se entrenan con una versión reponderada y más simple.' },
    ],
    quiz: [
      {
        prompt: String.raw`Si $\log p(D) = -118{,}0$ y el ELBO de tu $q$ vale $-120{,}5$, ¿cuánto vale $\mathrm{KL}(q \,\Vert\, p(\theta \mid D))$?`,
        options: [{ text: '−2,5' }, { text: '2,5', correct: true }, { text: '238,5' }],
        explain: String.raw`$\mathrm{KL} = \log p(D) - \text{ELBO} = -118{,}0 - (-120{,}5) = 2{,}5$ nats. La KL nunca es negativa.`,
      },
      {
        prompt: '¿Qué suele ocurrir con la varianza cuando aproximas un posterior con correlaciones fuertes mediante una q de campo medio?',
        options: [{ text: 'Se sobrestima.' }, { text: 'Se estima exactamente.' }, { text: 'Se infravalora.', correct: true }],
        explain: String.raw`Minimizar $\mathrm{KL}(q \,\Vert\, p)$ con componentes independientes da las varianzas condicionales, más pequeñas que las marginales: con $\rho = 0{,}9$, desviación 0,436 frente a 1.`,
      },
      {
        prompt: '¿Qué término del ELBO actúa como regularizador?',
        options: [
          { text: String.raw`$\mathrm{KL}(q(\theta) \,\Vert\, p(\theta))$`, correct: true },
          { text: String.raw`$\mathbb{E}_q[\log p(D \mid \theta)]$` },
          { text: String.raw`$\log p(D)$` },
        ],
        explain: String.raw`La KL respecto al prior penaliza que $q$ se aleje de lo que el prior considera plausible. El otro término mide el ajuste a los datos, y $\log p(D)$ no depende de $q$.`,
      },
    ],
    further: [
      { book: 'pml2', where: '§10.1.1 (el objetivo variacional y el ELBO), §10.1.2 (familias para q: campo medio y formas fijas), §10.1.4–10.1.5 (inferencia variacional estocástica y amortizada), §10.2.1 (inferencia variacional con reparametrización) y §10.3 (ascenso por coordenadas, CAVI). El sentido de la KL se discute en §5.1.4.' },
      { book: 'pml1', where: '§4.6.8 (visión rápida de las aproximaciones al posterior: rejilla, Laplace, variacional y MCMC).' },
    ],
    extra: [
      { text: 'Blei, D. M., Kucukelbir, A. y McAuliffe, J. D. (2017). Variational Inference: A Review for Statisticians. Journal of the American Statistical Association, 112(518), 859–877.', url: 'https://doi.org/10.1080/01621459.2017.1285773' },
    ],
  },
  en: {
    lede: 'Variational inference approximates an intractable posterior with the closest distribution from a simple family, and finds it by optimizing instead of sampling. The objective it maximizes, the ELBO, is a lower bound on the log evidence.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`[[mcmc|MCMC]] gives exact samples in the long run, but it can be very slow. Variational inference changes strategy: it picks a tractable family $q_\phi(\theta)$, for example Gaussians with diagonal covariance, and tunes its parameters $\phi$ until $q_\phi$ is as close as possible to the [[prior-posterior|posterior]]. Closeness is measured with the [[kl-divergence|KL divergence]] $\mathrm{KL}(q \,\Vert\, p(\theta \mid D))$, which cannot be computed directly because it depends on $p(D)$. The trick is that you do not need to compute it.` },
          { key: String.raw`$\log p(D) = \text{ELBO}(q) + \mathrm{KL}(q \,\Vert\, p(\theta \mid D))$. Since the left-hand side does not depend on $q$, raising the ELBO brings $q$ closer to the posterior.` },
        ],
      },
      {
        id: 'elbo',
        title: 'The ELBO',
        blocks: [
          { p: 'The ELBO (evidence lower bound) only needs the likelihood and the prior:' },
          { math: String.raw`\text{ELBO}(q) = \mathbb{E}_{q}\big[\log p(D \mid \theta)\big] - \mathrm{KL}\big(q(\theta) \,\Vert\, p(\theta)\big) \;\le\; \log p(D)` },
          {
            list: [
              String.raw`The first term rewards $q$ for putting its mass where the data are probable (fit).`,
              String.raw`The second penalizes $q$ for moving away from the prior (regularization).`,
              String.raw`Since the KL is never negative, the ELBO is a lower bound on $\log p(D)$, and the gap is exactly $\mathrm{KL}(q \,\Vert\, p(\theta \mid D))$.`,
            ],
          },
          { p: String.raw`In deep learning it is usually maximized with stochastic gradients. To differentiate through the sampling, the reparameterization trick is used: if $q = \mathcal{N}(\mu, \sigma^2)$, write $\theta = \mu + \sigma\varepsilon$ with $\varepsilon \sim \mathcal{N}(0, 1)$, and the gradient reaches $\mu$ and $\sigma$. With minibatches it scales to large datasets.` },
        ],
      },
      {
        id: 'example',
        title: 'Mean field on a Gaussian',
        blocks: [
          { p: String.raw`Suppose the posterior is a [[mvn|bivariate normal]] with variances 1 and correlation $\rho$, and you approximate it with a **mean-field** $q$, with independent components: $q(\theta_1, \theta_2) = q_1(\theta_1)\,q_2(\theta_2)$. The optimum of $\mathrm{KL}(q \,\Vert\, p)$ gets the mean right, but each $q_i$ has variance $1 - \rho^2$ instead of 1:` },
          {
            table: {
              head: [String.raw`Correlation $\rho$`, 'True standard deviation', String.raw`Standard deviation of $q$`],
              rows: [
                ['0', '1', '1'],
                ['0.5', '1', '0.866'],
                ['0.9', '1', '0.436'],
                ['0.99', '1', '0.141'],
              ],
              numeric: [0, 1, 2],
            },
          },
          { p: String.raw`The more correlated the posterior, the more the uncertainty is underestimated. It is a typical effect of minimizing the KL in this direction: $q$ prefers to stay inside the high-probability regions of the posterior rather than cover all of it.` },
        ],
      },
      {
        id: 'versus-mcmc',
        title: 'Versus MCMC',
        blocks: [
          {
            list: [
              '**Speed:** variational inference turns inference into optimization, exploits GPUs and minibatches, and scales to millions of data points and parameters. MCMC is usually much slower.',
              '**Accuracy:** MCMC is exact in the limit of infinitely many iterations; variational inference has a bias that does not go away if the true posterior is not in the chosen family.',
              '**Output:** variational inference gives a distribution with a formula, easy to evaluate and to sample from, and a bound on the evidence; MCMC gives samples.',
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '“The ELBO is the log-likelihood of the model.”', fix: String.raw`It is a lower bound: $\log p(D) = \text{ELBO} + \mathrm{KL}(q \,\Vert\, p(\theta \mid D))$. Comparing models by their ELBO can mislead if the approximation is worse for some of them than for others.` },
      { claim: String.raw`“Variational inference minimizes $\mathrm{KL}(p \,\Vert\, q)$, like maximum likelihood.”`, fix: String.raw`It minimizes the KL in the other direction, $\mathrm{KL}(q \,\Vert\, p)$. That version punishes $q$ for putting mass where the posterior has almost none, so $q$ tends to concentrate on one mode and to underestimate the variance: see [[kl-divergence]].` },
      { claim: '“With enough iterations, variational inference gives the exact posterior.”', fix: 'Only if the exact posterior belongs to the family of q. Otherwise a gap remains that further optimization cannot close, unlike MCMC.' },
      { claim: '“A mean-field approximation assumes the posterior has no correlations.”', fix: 'Independence is a restriction on q, not a property of the posterior. The correlations are still there; q simply cannot represent them, which is why it underestimates the uncertainty, as the table shows.' },
    ],
    dl: [
      { title: 'Variational autoencoders.', text: 'The loss of a [[vae|VAE]] is the negative ELBO. An encoder predicts the parameters of q for each data point (amortized inference), and the reparameterization trick lets it be trained with backpropagation.' },
      { title: 'Weights with uncertainty.', text: 'Bayes by Backprop (Blundell et al., 2015) learns a mean and a standard deviation for every weight of the network by maximizing the ELBO. It doubles the number of parameters, and the mean-field restriction limits how well it approximates the posterior.' },
      { title: 'Diffusion models.', text: 'Their loss function is derived from an ELBO on the likelihood of the data (Ho et al., 2020), although in practice they are trained with a simpler, reweighted version.' },
    ],
    quiz: [
      {
        prompt: String.raw`If $\log p(D) = -118.0$ and the ELBO of your $q$ is $-120.5$, what is $\mathrm{KL}(q \,\Vert\, p(\theta \mid D))$?`,
        options: [{ text: '−2.5' }, { text: '2.5', correct: true }, { text: '238.5' }],
        explain: String.raw`$\mathrm{KL} = \log p(D) - \text{ELBO} = -118.0 - (-120.5) = 2.5$ nats. The KL is never negative.`,
      },
      {
        prompt: 'What usually happens to the variance when you approximate a strongly correlated posterior with a mean-field q?',
        options: [{ text: 'It is overestimated.' }, { text: 'It is estimated exactly.' }, { text: 'It is underestimated.', correct: true }],
        explain: String.raw`Minimizing $\mathrm{KL}(q \,\Vert\, p)$ with independent components gives the conditional variances, which are smaller than the marginal ones: with $\rho = 0.9$, a standard deviation of 0.436 instead of 1.`,
      },
      {
        prompt: 'Which term of the ELBO acts as a regularizer?',
        options: [
          { text: String.raw`$\mathrm{KL}(q(\theta) \,\Vert\, p(\theta))$`, correct: true },
          { text: String.raw`$\mathbb{E}_q[\log p(D \mid \theta)]$` },
          { text: String.raw`$\log p(D)$` },
        ],
        explain: String.raw`The KL to the prior penalizes $q$ for moving away from what the prior considers plausible. The other term measures the fit to the data, and $\log p(D)$ does not depend on $q$.`,
      },
    ],
    further: [
      { book: 'pml2', where: '§10.1.1 (the variational objective and the ELBO), §10.1.2 (families for q: mean field and fixed forms), §10.1.4–10.1.5 (stochastic and amortized variational inference), §10.2.1 (reparameterized variational inference) and §10.3 (coordinate ascent, CAVI). The direction of the KL is discussed in §5.1.4.' },
      { book: 'pml1', where: '§4.6.8 (a quick overview of posterior approximations: grid, Laplace, variational and MCMC).' },
    ],
    extra: [
      { text: 'Blei, D. M., Kucukelbir, A. and McAuliffe, J. D. (2017). Variational Inference: A Review for Statisticians. Journal of the American Statistical Association, 112(518), 859–877.', url: 'https://doi.org/10.1080/01621459.2017.1285773' },
    ],
  },
};

export default content;
