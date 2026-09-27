import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Un modelo de mezcla combina varias distribuciones sencillas con unos pesos. Sirve para datos que provienen de varios grupos o mecanismos, y para aproximar formas que ninguna distribución estándar describe, como densidades con varias modas.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Los tiempos de respuesta de un servicio tienen dos orígenes: el 70 % de las peticiones se sirve desde una caché y tarda unos 20 ms, y el 30 % restante consulta una base de datos y tarda unos 100 ms. El histograma muestra dos jorobas, y ni una normal ni una gamma lo describen bien. Una mezcla de dos normales sí: primero se elige el origen de cada petición, con probabilidades 0,7 y 0,3, y después se genera su tiempo con la normal de ese origen.' },
          { key: String.raw`Generar de una mezcla es un proceso en dos pasos: primero se elige un componente $z$ con probabilidades $\pi_k$ (una [[categorical-multinomial|categórica]]) y luego se genera $x$ con la distribución de ese componente. La densidad resultante es la media ponderada de las densidades de los componentes.` },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { p: String.raw`Una mezcla de $K$ componentes tiene densidad:` },
          { math: String.raw`p(\mathbf{x}) = \sum_{k=1}^{K} \pi_k\, p_k(\mathbf{x}), \qquad \pi_k \ge 0, \quad \sum_{k=1}^{K} \pi_k = 1` },
          { p: String.raw`En una mezcla de gaussianas (GMM), cada componente es una [[mvn|normal multivariante]], $p_k(\mathbf{x}) = \mathcal{N}(\mathbf{x} \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)$, y con suficientes componentes puede aproximar cualquier densidad suave. Dado un punto, el [[bayes-rule|teorema de Bayes]] da la probabilidad de que venga de cada componente, su **responsabilidad**:` },
          { math: String.raw`r_k(\mathbf{x}) = P(z = k \mid \mathbf{x}) = \frac{\pi_k\, p_k(\mathbf{x})}{\sum_{j=1}^{K} \pi_j\, p_j(\mathbf{x})}` },
          { p: 'Las responsabilidades dan un agrupamiento blando: cada punto pertenece en parte a cada grupo. K-means es el caso límite con covarianzas esféricas iguales que tienden a cero, en el que cada punto se asigna por completo al centro más cercano.' },
        ],
      },
      {
        id: 'ejemplo',
        title: 'Media, varianza y responsabilidades',
        blocks: [
          { p: String.raw`En el ejemplo de los tiempos de respuesta, $0{,}7\,\mathcal{N}(20, 5^2) + 0{,}3\,\mathcal{N}(100, 20^2)$ en milisegundos, la media es la media ponderada de las medias, $0{,}7 \cdot 20 + 0{,}3 \cdot 100 = 44$ ms. La varianza suma la varianza dentro de cada componente y la dispersión entre sus medias:` },
          { math: String.raw`\sigma^2 = \sum_{k} \pi_k \sigma_k^2 + \sum_{k} \pi_k (\mu_k - \mu)^2 = 137{,}5 + 1344 = 1481{,}5` },
          { p: 'La desviación típica es de 38,5 ms, casi toda debida a la separación entre los grupos. La media, 44 ms, cae en una zona casi vacía: solo el 0,15 % de las peticiones tarda entre 40 y 50 ms. Las responsabilidades cambian deprisa entre un grupo y otro: una petición de 35 ms viene de la caché con probabilidad 0,95, una de 40 ms solo con probabilidad 0,22, y el empate está en unos 38,6 ms.' },
        ],
      },
      {
        id: 'ajuste',
        title: 'Ajuste con el algoritmo EM',
        blocks: [
          { p: String.raw`La log-verosimilitud de una mezcla tiene una suma dentro del logaritmo y no se puede maximizar en forma cerrada. El algoritmo EM (esperanza-maximización) alterna dos pasos: el paso E calcula las responsabilidades con los parámetros actuales, y el paso M reestima cada componente por [[mle|máxima verosimilitud]] ponderando cada punto por su responsabilidad. Así, $\pi_k$ pasa a ser la responsabilidad media, $\boldsymbol{\mu}_k$ la media ponderada de los datos y $\boldsymbol{\Sigma}_k$ su covarianza ponderada.` },
          { p: 'Ninguna iteración empeora la verosimilitud, pero EM solo garantiza llegar a un punto estacionario (normalmente un máximo local), así que se suele inicializar con K-means y repetir desde varios puntos de partida. El número de componentes se elige con un criterio como el BIC o con la verosimilitud en un conjunto de validación.' },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Una mezcla de normales es una normal, igual que una suma de normales.»', fix: 'Mezclar no es sumar. La suma de variables normales independientes es normal; la mezcla elige una u otra al azar, y su densidad es una media ponderada de campanas, que puede tener varias modas y colas más pesadas que una normal.' },
      { claim: '«Una mezcla de dos normales siempre tiene dos picos.»', fix: String.raw`Con pesos iguales y la misma desviación típica $\sigma$, solo es bimodal si las medias están separadas más de $2\sigma$; con menos separación tiene un único pico, más ancho que el de cada componente.` },
      { claim: '«Si la log-verosimilitud de una GMM sigue subiendo, el ajuste va cada vez mejor.»', fix: 'Puede crecer sin límite si un componente se colapsa sobre un único punto y su varianza tiende a cero: es una solución degenerada, no un buen modelo. Se evita sumando un valor pequeño a la diagonal de las covarianzas o con un prior, es decir, con una [[map-estimation|estimación MAP]].' },
      { claim: '«Cada componente corresponde a un grupo real de los datos.»', fix: 'Los componentes son una herramienta de modelado. Un único grupo asimétrico puede necesitar varios componentes normales, y los componentes pueden intercambiarse sin cambiar la verosimilitud, así que sus etiquetas no significan nada por sí mismas.' },
    ],
    dl: [
      { title: 'Redes de densidad de mezcla.', text: 'Cuando para una misma entrada hay varias salidas plausibles (un peatón que puede girar a la izquierda o a la derecha), el error cuadrático predice la media de las opciones, que puede no corresponder a ninguna de ellas: seguir recto. Una red de densidad de mezcla predice los pesos (con una softmax), las medias y las varianzas de una mezcla de gaussianas y minimiza su log-verosimilitud negativa: ver [[losses-likelihoods]].' },
      { title: 'Mezcla de expertos.', text: 'Una red de compuerta con softmax reparte cada entrada entre varias subredes expertas. El modelo original es una mezcla condicional de distribuciones; en los grandes modelos de lenguaje con capas de mezcla de expertos, cada token se envía solo a unos pocos expertos y se combinan sus salidas, no sus densidades.' },
      { title: 'Anomalías y agrupamiento.', text: 'Una GMM ajustada a las representaciones internas de una red da una densidad sobre ese espacio: las entradas con densidad baja son candidatas a anomalías, y las responsabilidades sirven para agrupar datos sin etiquetas.' },
    ],
    quiz: [
      {
        prompt: String.raw`Considera la mezcla $0{,}5\,\mathcal{N}(0, 1) + 0{,}5\,\mathcal{N}(4, 1)$. ¿Cuáles son su media y su varianza?`,
        options: [{ text: 'Media 2 y varianza 1.' }, { text: 'Media 2 y varianza 5.', correct: true }, { text: 'Media 4 y varianza 2.' }],
        explain: String.raw`La media es $0{,}5 \cdot 0 + 0{,}5 \cdot 4 = 2$. La varianza suma la de dentro de los componentes, 1, y la de entre sus medias, $0{,}5 \cdot 2^2 + 0{,}5 \cdot 2^2 = 4$: en total, 5.`,
      },
      {
        prompt: String.raw`En una mezcla de gaussianas, ¿qué es la responsabilidad $r_k(\mathbf{x})$?`,
        options: [
          { text: String.raw`La probabilidad, dado $\mathbf{x}$, de que venga del componente $k$.`, correct: true },
          { text: String.raw`El peso $\pi_k$ del componente $k$.` },
          { text: String.raw`La densidad del componente $k$ en $\mathbf{x}$.` },
        ],
        explain: String.raw`Es la probabilidad posterior $P(z = k \mid \mathbf{x})$, que combina el peso $\pi_k$ (el prior) con la densidad $p_k(\mathbf{x})$ (la verosimilitud) mediante el teorema de Bayes.`,
      },
      {
        prompt: 'Ajustas una GMM por máxima verosimilitud y la log-verosimilitud crece sin parar. ¿Qué ha pasado probablemente?',
        options: [
          { text: 'Que el modelo ha encontrado un ajuste excelente.' },
          { text: 'Que faltan componentes.' },
          { text: 'Que un componente se ha colapsado sobre un punto y su varianza tiende a cero.', correct: true },
        ],
        explain: 'La densidad de ese componente en el punto crece sin límite y arrastra la verosimilitud. Se corrige regularizando las covarianzas o con un prior (estimación MAP).',
      },
    ],
    further: [
      { book: 'pml1', where: '§3.5.1 (mezclas de gaussianas y agrupamiento blando con responsabilidades), §8.7.3 (algoritmo EM para una GMM, con estimación MAP y el problema de los máximos locales), §21.4.1 (K-means como caso particular de EM, no identificabilidad e intercambio de etiquetas, y selección del modelo) y §13.6.2 (mezclas de expertos y redes de densidad de mezcla).' },
      { book: 'wilks', where: '§4.4.9 (distribuciones de mezcla: media y varianza de una mezcla y mezclas de exponenciales) y §4.6.3 (el algoritmo EM).' },
      { book: 'pml2', where: '§28.2.1 (mezclas de gaussianas) y §28.2.3 (mezclas de escala gaussianas: la t de Student y la Laplace como mezclas continuas de normales).' },
    ],
    extra: [
      { text: 'Dempster, A. P., Laird, N. M. y Rubin, D. B. (1977). Maximum Likelihood from Incomplete Data via the EM Algorithm. Journal of the Royal Statistical Society: Series B, 39(1), 1–22.', url: 'https://doi.org/10.1111/j.2517-6161.1977.tb01600.x' },
      { text: 'Bishop, C. M. (1994). Mixture Density Networks. Informe técnico NCRG/94/004, Aston University.', url: 'https://research.aston.ac.uk/en/publications/mixture-density-networks/' },
    ],
  },
  en: {
    lede: 'A mixture model combines several simple distributions with weights. It is used for data that come from several groups or mechanisms, and to approximate shapes that no standard distribution describes, such as densities with several modes.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'The response times of a service have two origins: 70% of the requests are served from a cache and take about 20 ms, and the remaining 30% query a database and take about 100 ms. The histogram shows two humps, and neither a normal nor a gamma distribution describes it well. A mixture of two normal distributions does: first the origin of each request is chosen, with probabilities 0.7 and 0.3, and then its time is generated from the normal distribution of that origin.' },
          { key: String.raw`Generating from a mixture is a two-step process: first a component $z$ is chosen with probabilities $\pi_k$ (a [[categorical-multinomial|categorical distribution]]), and then $x$ is generated from that component's distribution. The resulting density is the weighted average of the component densities.` },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { p: String.raw`A mixture of $K$ components has density:` },
          { math: String.raw`p(\mathbf{x}) = \sum_{k=1}^{K} \pi_k\, p_k(\mathbf{x}), \qquad \pi_k \ge 0, \quad \sum_{k=1}^{K} \pi_k = 1` },
          { p: String.raw`In a Gaussian mixture model (GMM), each component is a [[mvn|multivariate normal]], $p_k(\mathbf{x}) = \mathcal{N}(\mathbf{x} \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)$, and with enough components it can approximate any smooth density. Given a point, [[bayes-rule|Bayes’ rule]] gives the probability that it comes from each component, its **responsibility**:` },
          { math: String.raw`r_k(\mathbf{x}) = P(z = k \mid \mathbf{x}) = \frac{\pi_k\, p_k(\mathbf{x})}{\sum_{j=1}^{K} \pi_j\, p_j(\mathbf{x})}` },
          { p: 'The responsibilities give a soft clustering: each point belongs partly to each group. K-means is the limiting case with equal spherical covariances shrinking to zero, in which each point is assigned entirely to the nearest center.' },
        ],
      },
      {
        id: 'example',
        title: 'Mean, variance and responsibilities',
        blocks: [
          { p: String.raw`In the response-time example, $0.7\,\mathcal{N}(20, 5^2) + 0.3\,\mathcal{N}(100, 20^2)$ in milliseconds, the mean is the weighted average of the means, $0.7 \cdot 20 + 0.3 \cdot 100 = 44$ ms. The variance adds the variance within each component and the spread between their means:` },
          { math: String.raw`\sigma^2 = \sum_{k} \pi_k \sigma_k^2 + \sum_{k} \pi_k (\mu_k - \mu)^2 = 137.5 + 1344 = 1481.5` },
          { p: 'The standard deviation is 38.5 ms, almost all of it due to the separation between the groups. The mean, 44 ms, falls in an almost empty region: only 0.15% of the requests take between 40 and 50 ms. The responsibilities switch quickly from one group to the other: a request of 35 ms comes from the cache with probability 0.95, one of 40 ms only with probability 0.22, and the tie is at about 38.6 ms.' },
        ],
      },
      {
        id: 'fitting',
        title: 'Fitting with the EM algorithm',
        blocks: [
          { p: String.raw`The log-likelihood of a mixture has a sum inside the logarithm and cannot be maximized in closed form. The EM (expectation-maximization) algorithm alternates two steps: the E step computes the responsibilities with the current parameters, and the M step re-estimates each component by [[mle|maximum likelihood]], weighting each point by its responsibility. So $\pi_k$ becomes the average responsibility, $\boldsymbol{\mu}_k$ the weighted mean of the data and $\boldsymbol{\Sigma}_k$ their weighted covariance.` },
          { p: 'No iteration decreases the likelihood, but EM is only guaranteed to reach a stationary point (usually a local maximum), so it is typically initialized with K-means and restarted from several starting points. The number of components is chosen with a criterion such as BIC or with the likelihood on a validation set.' },
        ],
      },
    ],
    pitfalls: [
      { claim: '“A mixture of normal distributions is normal, just like a sum of normal variables.”', fix: 'Mixing is not adding. The sum of independent normal variables is normal; a mixture picks one or the other at random, and its density is a weighted average of bells, which can have several modes and heavier tails than a normal distribution.' },
      { claim: '“A mixture of two normal distributions always has two peaks.”', fix: String.raw`With equal weights and the same standard deviation $\sigma$, it is bimodal only if the means are more than $2\sigma$ apart; with less separation it has a single peak, wider than that of each component.` },
      { claim: '“If the log-likelihood of a GMM keeps going up, the fit keeps getting better.”', fix: 'It can grow without bound if a component collapses onto a single point and its variance goes to zero: that is a degenerate solution, not a good model. It is avoided by adding a small value to the diagonal of the covariances or with a prior, that is, with [[map-estimation|MAP estimation]].' },
      { claim: '“Each component corresponds to a real group in the data.”', fix: 'Components are a modeling tool. A single skewed group may need several normal components, and the components can be swapped without changing the likelihood, so their labels mean nothing by themselves.' },
    ],
    dl: [
      { title: 'Mixture density networks.', text: 'When the same input admits several plausible outputs (a pedestrian who may turn left or right), squared error predicts the average of the options, which may match none of them: going straight on. A mixture density network predicts the weights (through a softmax), the means and the variances of a Gaussian mixture and minimizes its negative log-likelihood: see [[losses-likelihoods]].' },
      { title: 'Mixture of experts.', text: 'A gating network with a softmax distributes each input among several expert subnetworks. The original model is a conditional mixture of distributions; in large language models with mixture-of-experts layers, each token is sent to only a few experts and their outputs are combined, not their densities.' },
      { title: 'Anomalies and clustering.', text: 'A GMM fitted to the internal representations of a network gives a density over that space: inputs with low density are candidate anomalies, and the responsibilities can be used to cluster unlabeled data.' },
    ],
    quiz: [
      {
        prompt: String.raw`Consider the mixture $0.5\,\mathcal{N}(0, 1) + 0.5\,\mathcal{N}(4, 1)$. What are its mean and variance?`,
        options: [{ text: 'Mean 2 and variance 1.' }, { text: 'Mean 2 and variance 5.', correct: true }, { text: 'Mean 4 and variance 2.' }],
        explain: String.raw`The mean is $0.5 \cdot 0 + 0.5 \cdot 4 = 2$. The variance adds the within-component variance, 1, and the between-means variance, $0.5 \cdot 2^2 + 0.5 \cdot 2^2 = 4$: 5 in total.`,
      },
      {
        prompt: String.raw`In a Gaussian mixture, what is the responsibility $r_k(\mathbf{x})$?`,
        options: [
          { text: String.raw`The probability, given $\mathbf{x}$, that it comes from component $k$.`, correct: true },
          { text: String.raw`The weight $\pi_k$ of component $k$.` },
          { text: String.raw`The density of component $k$ at $\mathbf{x}$.` },
        ],
        explain: String.raw`It is the posterior probability $P(z = k \mid \mathbf{x})$, which combines the weight $\pi_k$ (the prior) with the density $p_k(\mathbf{x})$ (the likelihood) through Bayes’ rule.`,
      },
      {
        prompt: 'You fit a GMM by maximum likelihood and the log-likelihood keeps increasing without end. What has probably happened?',
        options: [
          { text: 'The model has found an excellent fit.' },
          { text: 'There are too few components.' },
          { text: 'A component has collapsed onto a point and its variance is going to zero.', correct: true },
        ],
        explain: 'The density of that component at the point grows without bound and drags the likelihood with it. It is fixed by regularizing the covariances or with a prior (MAP estimation).',
      },
    ],
    further: [
      { book: 'pml1', where: '§3.5.1 (Gaussian mixtures and soft clustering with responsibilities), §8.7.3 (the EM algorithm for a GMM, with MAP estimation and the problem of local maxima), §21.4.1 (K-means as a special case of EM, unidentifiability and label switching, and model selection) and §13.6.2 (mixtures of experts and mixture density networks).' },
      { book: 'wilks', where: '§4.4.9 (mixture distributions: mean and variance of a mixture, and mixtures of exponentials) and §4.6.3 (the EM algorithm).' },
      { book: 'pml2', where: '§28.2.1 (Gaussian mixture models) and §28.2.3 (Gaussian scale mixtures: the Student t and the Laplace distributions as continuous mixtures of normals).' },
    ],
    extra: [
      { text: 'Dempster, A. P., Laird, N. M. and Rubin, D. B. (1977). Maximum Likelihood from Incomplete Data via the EM Algorithm. Journal of the Royal Statistical Society: Series B, 39(1), 1–22.', url: 'https://doi.org/10.1111/j.2517-6161.1977.tb01600.x' },
      { text: 'Bishop, C. M. (1994). Mixture Density Networks. Technical Report NCRG/94/004, Aston University.', url: 'https://research.aston.ac.uk/en/publications/mixture-density-networks/' },
    ],
  },
};

export default content;
