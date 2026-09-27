import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Estimar un parámetro eligiendo el valor que hace más probables los datos observados. Es el principio que hay detrás de casi todas las funciones de pérdida del aprendizaje profundo.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Lanzas una moneda 20 veces y salen 16 caras. ¿Qué probabilidad de cara, $\theta$, es más creíble? Si fuera $\theta = 0{,}5$, sacar 16 caras sería raro; con $\theta = 0{,}8$ es mucho más probable. La máxima verosimilitud formaliza esa intuición: se queda con el valor de $\theta$ bajo el que los datos observados son más probables.` },
          { key: 'La verosimilitud es la probabilidad de los datos vista como función del parámetro, con los datos fijos. No es una distribución de probabilidad sobre el parámetro.' },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { p: String.raw`Para datos independientes $x_1, \dots, x_n$ con densidad o probabilidad $p(x \mid \theta)$, la verosimilitud y su logaritmo son:` },
          { math: String.raw`L(\theta) = \prod_{i=1}^{n} p(x_i \mid \theta), \qquad \ell(\theta) = \sum_{i=1}^{n} \log p(x_i \mid \theta)` },
          { p: String.raw`El estimador de máxima verosimilitud (EMV; en inglés, MLE) es el valor que la maximiza: $\hat\theta = \arg\max_\theta \ell(\theta)$. Se trabaja con el logaritmo porque convierte productos en sumas, es más estable numéricamente y tiene el mismo máximo.` },
        ],
      },
      {
        id: 'ejemplos',
        title: 'Dos ejemplos',
        blocks: [
          { p: String.raw`**Bernoulli.** Con $k$ caras en $n$ lanzamientos, $\ell(\theta) = k \log\theta + (n-k)\log(1-\theta)$. Derivando e igualando a cero:` },
          { math: String.raw`\hat\theta = \frac{k}{n} = \frac{16}{20} = 0{,}8` },
          { p: String.raw`Los datos son unas 47 veces más probables con $\theta = 0{,}8$ que con $\theta = 0{,}5$.` },
          { p: String.raw`**Normal.** Para una muestra de $\mathcal{N}(\mu, \sigma^2)$, el EMV de la media es la media muestral $\bar x$, y el de la varianza es $\hat\sigma^2 = \frac{1}{n}\sum_i (x_i - \bar x)^2$. Divide entre $n$ y no entre $n-1$, así que está sesgado a la baja por un factor $(n-1)/n$: con $n = 5$, su esperanza es el 80 % de la varianza real.` },
        ],
      },
      {
        id: 'propiedades',
        title: 'Propiedades',
        blocks: [
          {
            list: [
              String.raw`**Consistencia:** si el modelo es correcto e identificable (valores distintos de $\theta$ dan distribuciones distintas), $\hat\theta$ se acerca al valor real al crecer $n$.`,
              String.raw`**Normalidad asintótica:** en condiciones de regularidad, para $n$ grande, $\hat\theta$ es aproximadamente normal, con un error estándar que sale de la curvatura de $\ell$ en el máximo (la información de Fisher observada). En el ejemplo de la moneda, $\sqrt{\hat\theta(1-\hat\theta)/n} \approx 0{,}089$.`,
              String.raw`**Invarianza:** el EMV de una función $g(\theta)$ es $g(\hat\theta)$.`,
              String.raw`**Cuidado con pocos datos:** puede estar sesgado, como la varianza de la normal, y sobreajustar cuando hay muchos parámetros. Ahí entra la [[regularization|regularización]].`,
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '«La verosimilitud es la probabilidad de que el parámetro valga θ.»', fix: 'Es la probabilidad de los datos para cada valor de θ, y no suma 1 sobre θ. Para hablar de la probabilidad del parámetro hace falta un prior: ver [[prior-posterior]].' },
      { claim: '«El EMV siempre es insesgado.»', fix: 'No: el de la varianza de una normal divide entre n y subestima la varianza real. El sesgo desaparece al crecer n.' },
      { claim: '«Aunque el modelo esté mal especificado, el EMV estima el parámetro real.»', fix: 'Estima el parámetro del modelo que más se acerca a los datos en [[kl-divergence|divergencia KL]], que puede no corresponder a ningún mecanismo real.' },
      { claim: '«Al EMV siempre se le puede poner el intervalo ±1,96 errores estándar.»', fix: 'Con pocos datos, la aproximación normal falla. Con 16 caras de 20, ese intervalo va de 0,62 a 0,98, mientras que el exacto va de 0,56 a 0,94.' },
    ],
    dl: [
      { title: 'Las pérdidas son log-verosimilitudes.', text: 'Minimizar el error cuadrático medio equivale a maximizar la verosimilitud con ruido gaussiano de varianza constante, y minimizar la entropía cruzada equivale a maximizarla con una salida categórica. Entrenar una red con esas pérdidas es hacer máxima verosimilitud: ver [[losses-likelihoods]].' },
      { title: 'Sobreajuste.', text: 'Con millones de parámetros, maximizar la verosimilitud en entrenamiento puede llevar a memorizar los datos. La regularización y la validación son la respuesta práctica; la penalización L2 (el weight decay con SGD) equivale además a una [[map-estimation|estimación MAP]] con prior gaussiano.' },
      { title: 'Media, no suma.', text: 'Las librerías minimizan la log-verosimilitud negativa media por ejemplo, no la suma. El óptimo es el mismo, pero así la escala de la pérdida y del gradiente no depende del tamaño del lote.' },
    ],
    quiz: [
      {
        prompt: 'En 50 lanzamientos salen 35 caras. ¿Cuál es el EMV de la probabilidad de cara?',
        options: [{ text: '0,5' }, { text: '0,7', correct: true }, { text: '35' }],
        explain: String.raw`Para una Bernoulli, $\hat\theta = k/n = 35/50 = 0{,}7$.`,
      },
      {
        prompt: '¿Qué relación hay entre el error cuadrático medio (MSE) y la máxima verosimilitud?',
        options: [
          { text: 'Ninguna: son criterios distintos.' },
          { text: 'Minimizar el MSE equivale a maximizar la verosimilitud si el ruido es gaussiano con varianza constante.', correct: true },
          { text: 'Minimizar el MSE equivale a maximizar la verosimilitud para cualquier distribución del ruido.' },
        ],
        explain: String.raw`Con ruido $\mathcal{N}(0, \sigma^2)$, $-\log p(y \mid x)$ es $(y - f(x))^2/(2\sigma^2)$ más una constante. Con otro ruido, la pérdida equivalente cambia.`,
      },
      {
        prompt: 'Estimas la varianza de 5 datos con la fórmula del EMV. ¿Qué ocurre en promedio?',
        options: [
          { text: 'La sobrestimas.' },
          { text: 'La subestimas: su esperanza es el 80 % de la varianza real.', correct: true },
          { text: 'Aciertas en promedio.' },
        ],
        explain: String.raw`El EMV divide entre $n$; su esperanza es $\frac{n-1}{n}\sigma^2$, que con $n = 5$ es $0{,}8\,\sigma^2$.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§4.2 (definición, justificación y ejemplos: Bernoulli, categórica, normal y regresión lineal) y §4.7.2 (distribución muestral aproximada del EMV).' },
      { book: 'wilks', where: '§4.6 (ajuste de parámetros por máxima verosimilitud).' },
    ],
  },
  en: {
    lede: 'Estimating a parameter by choosing the value that makes the observed data most probable. It is the principle behind almost every loss function in deep learning.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`You toss a coin 20 times and get 16 heads. Which probability of heads, $\theta$, is most plausible? If it were $\theta = 0.5$, 16 heads would be unusual; with $\theta = 0.8$ it is far more likely. Maximum likelihood formalizes that intuition: it keeps the value of $\theta$ under which the observed data are most probable.` },
          { key: 'The likelihood is the probability of the data seen as a function of the parameter, with the data held fixed. It is not a probability distribution over the parameter.' },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { p: String.raw`For independent data $x_1, \dots, x_n$ with density or probability $p(x \mid \theta)$, the likelihood and its logarithm are:` },
          { math: String.raw`L(\theta) = \prod_{i=1}^{n} p(x_i \mid \theta), \qquad \ell(\theta) = \sum_{i=1}^{n} \log p(x_i \mid \theta)` },
          { p: String.raw`The maximum likelihood estimator (MLE) is the value that maximizes it: $\hat\theta = \arg\max_\theta \ell(\theta)$. We work with the logarithm because it turns products into sums, is numerically more stable and has the same maximum.` },
        ],
      },
      {
        id: 'examples',
        title: 'Two examples',
        blocks: [
          { p: String.raw`**Bernoulli.** With $k$ heads in $n$ tosses, $\ell(\theta) = k \log\theta + (n-k)\log(1-\theta)$. Setting the derivative to zero:` },
          { math: String.raw`\hat\theta = \frac{k}{n} = \frac{16}{20} = 0.8` },
          { p: String.raw`The data are about 47 times more probable with $\theta = 0.8$ than with $\theta = 0.5$.` },
          { p: String.raw`**Normal.** For a sample from $\mathcal{N}(\mu, \sigma^2)$, the MLE of the mean is the sample mean $\bar x$, and the MLE of the variance is $\hat\sigma^2 = \frac{1}{n}\sum_i (x_i - \bar x)^2$. It divides by $n$ rather than $n-1$, so it is biased downwards by a factor $(n-1)/n$: with $n = 5$, its expectation is 80% of the true variance.` },
        ],
      },
      {
        id: 'properties',
        title: 'Properties',
        blocks: [
          {
            list: [
              String.raw`**Consistency:** if the model is correct and identifiable (different values of $\theta$ give different distributions), $\hat\theta$ approaches the true value as $n$ grows.`,
              String.raw`**Asymptotic normality:** under regularity conditions, for large $n$, $\hat\theta$ is approximately normal, with a standard error given by the curvature of $\ell$ at the maximum (the observed Fisher information). In the coin example, $\sqrt{\hat\theta(1-\hat\theta)/n} \approx 0.089$.`,
              String.raw`**Invariance:** the MLE of a function $g(\theta)$ is $g(\hat\theta)$.`,
              String.raw`**Careful with little data:** it can be biased, like the normal variance, and it overfits when there are many parameters. That is where [[regularization|regularization]] comes in.`,
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '“The likelihood is the probability that the parameter equals θ.”', fix: 'It is the probability of the data for each value of θ, and it does not sum to 1 over θ. To talk about the probability of the parameter you need a prior: see [[prior-posterior]].' },
      { claim: '“The MLE is always unbiased.”', fix: 'No: the MLE of a normal variance divides by n and underestimates the true variance. The bias vanishes as n grows.' },
      { claim: '“Even if the model is misspecified, the MLE estimates the true parameter.”', fix: 'It estimates the parameter of the model that comes closest to the data in [[kl-divergence|KL divergence]], which may not correspond to any real mechanism.' },
      { claim: '“You can always attach the ±1.96 standard error interval to the MLE.”', fix: 'With little data the normal approximation breaks down. With 16 heads out of 20, that interval runs from 0.62 to 0.98, whereas the exact one runs from 0.56 to 0.94.' },
    ],
    dl: [
      { title: 'Losses are log-likelihoods.', text: 'Minimizing mean squared error is equivalent to maximizing the likelihood with constant-variance Gaussian noise, and minimizing cross-entropy is equivalent to maximizing it with a categorical output. Training a network with those losses is maximum likelihood: see [[losses-likelihoods]].' },
      { title: 'Overfitting.', text: 'With millions of parameters, maximizing the training likelihood can end up memorizing the data. Regularization and validation are the practical answer; an L2 penalty (weight decay with SGD) is also equivalent to [[map-estimation|MAP estimation]] with a Gaussian prior.' },
      { title: 'Mean, not sum.', text: 'Libraries minimize the mean negative log-likelihood per example, not the sum. The optimum is the same, but the scale of the loss and of the gradient no longer depends on the batch size.' },
    ],
    quiz: [
      {
        prompt: 'In 50 tosses you get 35 heads. What is the MLE of the probability of heads?',
        options: [{ text: '0.5' }, { text: '0.7', correct: true }, { text: '35' }],
        explain: String.raw`For a Bernoulli, $\hat\theta = k/n = 35/50 = 0.7$.`,
      },
      {
        prompt: 'How is mean squared error (MSE) related to maximum likelihood?',
        options: [
          { text: 'It is not: they are different criteria.' },
          { text: 'Minimizing MSE is equivalent to maximizing the likelihood when the noise is Gaussian with constant variance.', correct: true },
          { text: 'Minimizing MSE is equivalent to maximizing the likelihood for any noise distribution.' },
        ],
        explain: String.raw`With $\mathcal{N}(0, \sigma^2)$ noise, $-\log p(y \mid x)$ is $(y - f(x))^2/(2\sigma^2)$ plus a constant. With other noise, the equivalent loss changes.`,
      },
      {
        prompt: 'You estimate the variance of 5 data points with the MLE formula. What happens on average?',
        options: [
          { text: 'You overestimate it.' },
          { text: 'You underestimate it: its expectation is 80% of the true variance.', correct: true },
          { text: 'You get it right on average.' },
        ],
        explain: String.raw`The MLE divides by $n$; its expectation is $\frac{n-1}{n}\sigma^2$, which for $n = 5$ is $0.8\,\sigma^2$.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§4.2 (definition, justification and examples: Bernoulli, categorical, normal and linear regression) and §4.7.2 (approximate sampling distribution of the MLE).' },
      { book: 'wilks', where: '§4.6 (parameter fitting using maximum likelihood).' },
    ],
  },
};

export default content;
