import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Un prior es conjugado de una verosimilitud cuando el posterior pertenece a la misma familia que el prior. Así, actualizar con datos se reduce a cambiar unos pocos parámetros, a menudo sumando recuentos.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Si tu prior sobre la probabilidad de cara es una $\text{Beta}(a, b)$ y observas $k$ caras y $n - k$ cruces, el posterior es otra beta: $\text{Beta}(a + k,\ b + n - k)$. No hay que integrar nada: se suman las caras a $a$ y las cruces a $b$. Por eso $a$ y $b$ se interpretan como **pseudo-recuentos**: el prior pesa como $a + b$ lanzamientos imaginarios.` },
          { key: 'Con un prior conjugado, actualizar es sumar: el posterior es de la misma familia que el prior y solo cambian sus parámetros.' },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { p: String.raw`Una familia de distribuciones $\mathcal{F}$ es **conjugada** de una verosimilitud $p(x \mid \theta)$ si, para cualquier prior de $\mathcal{F}$ y cualesquiera datos, el [[prior-posterior|posterior]] también está en $\mathcal{F}$. En el caso beta-binomial basta con multiplicar:` },
          { math: String.raw`\underbrace{\theta^{k}(1-\theta)^{n-k}}_{\text{verosimilitud}}\;\underbrace{\theta^{a-1}(1-\theta)^{b-1}}_{\text{prior}} \;\propto\; \theta^{a+k-1}(1-\theta)^{b+n-k-1}` },
          { p: String.raw`La media posterior es una media ponderada de la media del prior y del EMV, con pesos proporcionales a $a + b$ y a $n$:` },
          { math: String.raw`\mathbb{E}[\theta \mid D] = \frac{a + k}{a + b + n} = \frac{a + b}{a + b + n}\cdot\frac{a}{a + b} + \frac{n}{a + b + n}\cdot\frac{k}{n}` },
          { p: 'Con pocos datos manda el prior; con muchos, el EMV. Y da igual actualizar de golpe o por tandas: el resultado es el mismo.' },
        ],
      },
      {
        id: 'pares',
        title: 'Pares habituales',
        blocks: [
          {
            table: {
              head: ['Datos', 'Parámetro', 'Prior', 'Posterior'],
              rows: [
                ['Bernoulli o binomial', String.raw`$\theta$`, String.raw`$\text{Beta}(a, b)$`, String.raw`$\text{Beta}(a + k,\ b + n - k)$`],
                ['Categórica o multinomial', String.raw`$\boldsymbol\pi$`, String.raw`$\text{Dir}(\boldsymbol\alpha)$`, String.raw`$\text{Dir}(\boldsymbol\alpha + \mathbf{n})$`],
                ['Poisson', String.raw`$\lambda$`, String.raw`$\text{Gamma}(\alpha, \beta)$`, String.raw`$\text{Gamma}\big(\alpha + \textstyle\sum_i x_i,\ \beta + n\big)$`],
                [String.raw`Normal con $\sigma^2$ conocida`, String.raw`$\mu$`, String.raw`$\mathcal{N}(\mu_0, \tau_0^2)$`, String.raw`$\mathcal{N}(\mu_n, \tau_n^2)$`],
              ],
            },
          },
          { p: String.raw`Aquí $\mathbf{n}$ es el vector de recuentos por categoría y $\beta$ es el parámetro de tasa de la gamma. En el caso normal, las precisiones (inversas de las varianzas) se suman, y la media posterior pondera $\mu_0$ y $\bar x$ por sus precisiones:` },
          { math: String.raw`\frac{1}{\tau_n^2} = \frac{1}{\tau_0^2} + \frac{n}{\sigma^2}, \qquad \mu_n = \tau_n^2\left(\frac{\mu_0}{\tau_0^2} + \frac{n\,\bar x}{\sigma^2}\right)` },
          { p: String.raw`Por ejemplo, con prior $\mathcal{N}(0;\ 1)$, ruido $\sigma = 2$ y $n = 4$ datos de media $\bar x = 3$, el prior y los datos tienen la misma precisión, 1. El posterior es $\mathcal{N}(1{,}5;\ 0{,}5)$: a medio camino entre ambos y con la mitad de varianza que el prior. Su intervalo de credibilidad del 95 % va de 0,11 a 2,89.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«El prior conjugado es el prior correcto.»', fix: 'Se elige por comodidad de cálculo, no porque refleje mejor lo que sabes. Si ninguna distribución de la familia encaja con tu conocimiento, usa otro prior y calcula el posterior numéricamente: con una rejilla, con [[mcmc|MCMC]] o con [[variational-inference|inferencia variacional]].' },
      { claim: '«Un prior conjugado es poco informativo.»', fix: String.raw`Depende de sus parámetros: $\text{Beta}(50;\ 50)$ pesa como 100 lanzamientos y cuesta mucho moverla. La fuerza del prior es $a + b$, que se compara con el tamaño muestral $n$.` },
      { claim: '«Ser conjugado es una propiedad del prior.»', fix: 'Es una propiedad del par prior–verosimilitud. La beta es conjugada de la Bernoulli, pero la verosimilitud de una regresión logística no tiene un prior conjugado práctico: su posterior hay que aproximarlo.' },
    ],
    dl: [
      { title: 'Exactitud con incertidumbre.', text: String.raw`Si tu modelo acierta 92 de 100 ejemplos de test, con prior uniforme el posterior de su exactitud es $\text{Beta}(93;\ 9)$, con un intervalo de credibilidad del 95 % de 0,850 a 0,958. Con 920 aciertos de 1000 se estrecha a 0,902–0,935. Un conjunto de test pequeño deja mucha incertidumbre.` },
      { title: 'Suavizado de recuentos.', text: String.raw`Estimar probabilidades con frecuencias (n-gramas, naive Bayes) da probabilidad 0 a lo que no aparece en los datos. Con un prior $\text{Dir}(\alpha, \dots, \alpha)$ sobre $K$ categorías, la media posterior es $(n_k + \alpha)/(N + K\alpha)$; con $\alpha = 1$ es el suavizado de Laplace, que suma uno a cada recuento.` },
      { title: 'Una última capa bayesiana.', text: 'Con prior gaussiano y ruido gaussiano, el posterior de un modelo lineal tiene forma cerrada. Un truco práctico es tratar la última capa de una red como una regresión lineal bayesiana sobre las características aprendidas: se obtiene incertidumbre a bajo coste.' },
    ],
    quiz: [
      {
        prompt: String.raw`Tu prior es $\text{Beta}(2;\ 2)$ y observas 7 caras en 10 lanzamientos. ¿Cuál es el posterior?`,
        options: [
          { text: String.raw`$\text{Beta}(7;\ 3)$` },
          { text: String.raw`$\text{Beta}(9;\ 5)$`, correct: true },
          { text: String.raw`$\text{Beta}(9;\ 12)$` },
        ],
        explain: String.raw`Se suman las caras a $a$ y las cruces a $b$: $\text{Beta}(2 + 7;\ 2 + 3) = \text{Beta}(9;\ 5)$.`,
      },
      {
        prompt: String.raw`Con un prior beta de fuerza $a + b = 10$ y $n = 90$ datos, ¿cuánto pesa la media del prior en la media posterior?`,
        options: [{ text: '0,1', correct: true }, { text: '0,5' }, { text: '0,9' }],
        explain: String.raw`El peso del prior es $(a + b)/(a + b + n) = 10/100 = 0{,}1$; el del EMV, 0,9.`,
      },
      {
        prompt: '¿Cuál de estos pares prior–verosimilitud es conjugado?',
        options: [
          { text: 'Prior normal para los pesos de una regresión logística.' },
          { text: 'Prior beta para la media de una normal.' },
          { text: 'Prior gamma para la tasa de una Poisson.', correct: true },
        ],
        explain: String.raw`$\lambda^{\alpha-1}e^{-\beta\lambda}$ por $\lambda^{\sum_i x_i}e^{-n\lambda}$ vuelve a tener forma de gamma. La beta vive entre 0 y 1 y no sirve para una media que puede ser cualquier número real; la logística no tiene un prior conjugado práctico.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§6.3.1 (definición), §6.3.2 (datos binomiales con prior beta), §6.3.3 (datos de Poisson con prior gamma) y §6.3.4 (datos gaussianos con prior gaussiano).' },
      { book: 'pml1', where: '§4.6.1 (definición), §4.6.2 (beta-binomial: moda, media, varianza y predictiva del posterior), §4.6.3 (Dirichlet-multinomial) y §4.6.4 (gaussiana-gaussiana).' },
      { book: 'pml2', where: '§3.4 (priors conjugados de los modelos binomial, multinomial y gaussiano, y el caso general de la familia exponencial).' },
    ],
  },
  en: {
    lede: 'A prior is conjugate to a likelihood when the posterior belongs to the same family as the prior. Updating with data then reduces to changing a few parameters, often by adding counts.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`If your prior on the probability of heads is a $\text{Beta}(a, b)$ and you observe $k$ heads and $n - k$ tails, the posterior is another beta: $\text{Beta}(a + k,\ b + n - k)$. Nothing needs to be integrated: the heads are added to $a$ and the tails to $b$. That is why $a$ and $b$ are read as **pseudo-counts**: the prior weighs as much as $a + b$ imaginary tosses.` },
          { key: 'With a conjugate prior, updating is adding: the posterior belongs to the same family as the prior and only its parameters change.' },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { p: String.raw`A family of distributions $\mathcal{F}$ is **conjugate** to a likelihood $p(x \mid \theta)$ if, for any prior in $\mathcal{F}$ and any data, the [[prior-posterior|posterior]] is also in $\mathcal{F}$. In the beta-binomial case it is enough to multiply:` },
          { math: String.raw`\underbrace{\theta^{k}(1-\theta)^{n-k}}_{\text{likelihood}}\;\underbrace{\theta^{a-1}(1-\theta)^{b-1}}_{\text{prior}} \;\propto\; \theta^{a+k-1}(1-\theta)^{b+n-k-1}` },
          { p: String.raw`The posterior mean is a weighted average of the prior mean and the MLE, with weights proportional to $a + b$ and to $n$:` },
          { math: String.raw`\mathbb{E}[\theta \mid D] = \frac{a + k}{a + b + n} = \frac{a + b}{a + b + n}\cdot\frac{a}{a + b} + \frac{n}{a + b + n}\cdot\frac{k}{n}` },
          { p: 'With little data the prior dominates; with a lot, the MLE does. And it makes no difference whether you update all at once or in batches: the result is the same.' },
        ],
      },
      {
        id: 'pairs',
        title: 'Common pairs',
        blocks: [
          {
            table: {
              head: ['Data', 'Parameter', 'Prior', 'Posterior'],
              rows: [
                ['Bernoulli or binomial', String.raw`$\theta$`, String.raw`$\text{Beta}(a, b)$`, String.raw`$\text{Beta}(a + k,\ b + n - k)$`],
                ['Categorical or multinomial', String.raw`$\boldsymbol\pi$`, String.raw`$\text{Dir}(\boldsymbol\alpha)$`, String.raw`$\text{Dir}(\boldsymbol\alpha + \mathbf{n})$`],
                ['Poisson', String.raw`$\lambda$`, String.raw`$\text{Gamma}(\alpha, \beta)$`, String.raw`$\text{Gamma}\big(\alpha + \textstyle\sum_i x_i,\ \beta + n\big)$`],
                [String.raw`Normal with known $\sigma^2$`, String.raw`$\mu$`, String.raw`$\mathcal{N}(\mu_0, \tau_0^2)$`, String.raw`$\mathcal{N}(\mu_n, \tau_n^2)$`],
              ],
            },
          },
          { p: String.raw`Here $\mathbf{n}$ is the vector of counts per category and $\beta$ is the rate parameter of the gamma. In the normal case the precisions (inverse variances) add up, and the posterior mean weights $\mu_0$ and $\bar x$ by their precisions:` },
          { math: String.raw`\frac{1}{\tau_n^2} = \frac{1}{\tau_0^2} + \frac{n}{\sigma^2}, \qquad \mu_n = \tau_n^2\left(\frac{\mu_0}{\tau_0^2} + \frac{n\,\bar x}{\sigma^2}\right)` },
          { p: String.raw`For example, with prior $\mathcal{N}(0, 1)$, noise $\sigma = 2$ and $n = 4$ data points with mean $\bar x = 3$, the prior and the data have the same precision, 1. The posterior is $\mathcal{N}(1.5, 0.5)$: halfway between the two and with half the prior’s variance. Its 95% credible interval runs from 0.11 to 2.89.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“The conjugate prior is the correct prior.”', fix: 'It is chosen for computational convenience, not because it better reflects what you know. If no distribution in the family matches your knowledge, use another prior and compute the posterior numerically: on a grid, with [[mcmc|MCMC]] or with [[variational-inference|variational inference]].' },
      { claim: '“A conjugate prior is weakly informative.”', fix: String.raw`It depends on its parameters: $\text{Beta}(50, 50)$ weighs as much as 100 tosses and is hard to move. The strength of the prior is $a + b$, to be compared with the sample size $n$.` },
      { claim: '“Being conjugate is a property of the prior.”', fix: 'It is a property of the prior–likelihood pair. The beta is conjugate to the Bernoulli, but the likelihood of a logistic regression has no practical conjugate prior: its posterior must be approximated.' },
    ],
    dl: [
      { title: 'Accuracy with uncertainty.', text: String.raw`If your model gets 92 of 100 test examples right, with a uniform prior the posterior of its accuracy is $\text{Beta}(93, 9)$, with a 95% credible interval from 0.850 to 0.958. With 920 correct out of 1000 it narrows to 0.902–0.935. A small test set leaves a lot of uncertainty.` },
      { title: 'Smoothing counts.', text: String.raw`Estimating probabilities with frequencies (n-grams, naive Bayes) gives probability 0 to anything absent from the data. With a $\text{Dir}(\alpha, \dots, \alpha)$ prior over $K$ categories, the posterior mean is $(n_k + \alpha)/(N + K\alpha)$; with $\alpha = 1$ this is Laplace smoothing, which adds one to every count.` },
      { title: 'A Bayesian last layer.', text: 'With a Gaussian prior and Gaussian noise, the posterior of a linear model has a closed form. A practical trick is to treat the last layer of a network as a Bayesian linear regression on the learned features: you get uncertainty at low cost.' },
    ],
    quiz: [
      {
        prompt: String.raw`Your prior is $\text{Beta}(2, 2)$ and you observe 7 heads in 10 tosses. What is the posterior?`,
        options: [
          { text: String.raw`$\text{Beta}(7, 3)$` },
          { text: String.raw`$\text{Beta}(9, 5)$`, correct: true },
          { text: String.raw`$\text{Beta}(9, 12)$` },
        ],
        explain: String.raw`The heads are added to $a$ and the tails to $b$: $\text{Beta}(2 + 7,\ 2 + 3) = \text{Beta}(9, 5)$.`,
      },
      {
        prompt: String.raw`With a beta prior of strength $a + b = 10$ and $n = 90$ data points, how much weight does the prior mean get in the posterior mean?`,
        options: [{ text: '0.1', correct: true }, { text: '0.5' }, { text: '0.9' }],
        explain: String.raw`The weight of the prior is $(a + b)/(a + b + n) = 10/100 = 0.1$; the MLE gets 0.9.`,
      },
      {
        prompt: 'Which of these prior–likelihood pairs is conjugate?',
        options: [
          { text: 'A normal prior for the weights of a logistic regression.' },
          { text: 'A beta prior for the mean of a normal.' },
          { text: 'A gamma prior for the rate of a Poisson.', correct: true },
        ],
        explain: String.raw`$\lambda^{\alpha-1}e^{-\beta\lambda}$ times $\lambda^{\sum_i x_i}e^{-n\lambda}$ again has the form of a gamma. The beta lives between 0 and 1 and cannot describe a mean that may be any real number; the logistic model has no practical conjugate prior.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§6.3.1 (definition), §6.3.2 (binomial data with a beta prior), §6.3.3 (Poisson data with a gamma prior) and §6.3.4 (Gaussian data with a Gaussian prior).' },
      { book: 'pml1', where: '§4.6.1 (definition), §4.6.2 (beta-binomial: posterior mode, mean, variance and predictive), §4.6.3 (Dirichlet-multinomial) and §4.6.4 (Gaussian-Gaussian).' },
      { book: 'pml2', where: '§3.4 (conjugate priors for the binomial, multinomial and Gaussian models, and the general exponential-family case).' },
    ],
  },
};

export default content;
