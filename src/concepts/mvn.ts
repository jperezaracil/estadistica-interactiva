import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'La normal multivariante describe un vector de variables que, por separado y en cualquier combinación lineal, son normales. Queda determinada por un vector de medias y una matriz de covarianzas, y sus curvas de nivel son elipses.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Piensa en las temperaturas máximas diarias de dos estaciones meteorológicas cercanas. Cada una por separado es aproximadamente normal, pero además suben y bajan juntas: un día caluroso en una suele serlo también en la otra. La normal bivariante recoge las dos cosas con dos medias, dos varianzas y una covarianza, y los pares de valores forman una nube elíptica, inclinada en la dirección en la que varían juntos.' },
          { key: String.raw`La matriz de covarianzas $\boldsymbol{\Sigma}$ determina toda la forma de la distribución: sus autovectores dan las direcciones de los ejes de las elipses, y sus autovalores, la varianza a lo largo de cada eje.` },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { p: String.raw`Un vector $\mathbf{x} \in \mathbb{R}^D$ sigue una normal multivariante de media $\boldsymbol{\mu}$ y covarianza $\boldsymbol{\Sigma}$, simétrica y definida positiva, si su densidad es:` },
          { math: String.raw`\mathcal{N}(\mathbf{x} \mid \boldsymbol{\mu}, \boldsymbol{\Sigma}) = \frac{1}{(2\pi)^{D/2}\, |\boldsymbol{\Sigma}|^{1/2}} \exp\!\left(-\tfrac{1}{2}\, (\mathbf{x}-\boldsymbol{\mu})^{\top} \boldsymbol{\Sigma}^{-1} (\mathbf{x}-\boldsymbol{\mu})\right)` },
          { p: String.raw`La forma cuadrática del exponente es el cuadrado de la distancia de Mahalanobis, $d^2$: la distancia a la media medida en desviaciones típicas y teniendo en cuenta las correlaciones. Los puntos con la misma $d$ tienen la misma densidad, así que las curvas de nivel son elipses (elipsoides en más dimensiones). Además, $d^2$ sigue una $\chi^2$ con $D$ grados de libertad: en 2D, la elipse que contiene el 95 % de la probabilidad es la de $d^2 = 5{,}99$.` },
        ],
      },
      {
        id: 'propiedades',
        title: 'Propiedades',
        blocks: [
          {
            list: [
              String.raw`**Marginales:** cualquier subconjunto de componentes es normal; basta con quedarse con sus medias y con el bloque correspondiente de $\boldsymbol{\Sigma}$.`,
              String.raw`**Transformaciones lineales:** $\mathbf{A}\mathbf{x} + \mathbf{b} \sim \mathcal{N}(\mathbf{A}\boldsymbol{\mu} + \mathbf{b},\ \mathbf{A}\boldsymbol{\Sigma}\mathbf{A}^{\top})$. Así se generan muestras: con la factorización de Cholesky $\boldsymbol{\Sigma} = \mathbf{L}\mathbf{L}^{\top}$, se toma $\mathbf{x} = \boldsymbol{\mu} + \mathbf{L}\mathbf{z}$ con $\mathbf{z} \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$.`,
              '**Incorrelación e independencia:** dentro de un vector normal multivariante, covarianza cero equivale a independencia.',
              String.raw`**Condicionadas:** fijar unas componentes, $\mathbf{x}_2$, deja una normal para las demás, $\mathbf{x}_1$. Su media depende linealmente del valor observado y su covarianza no depende de él:`,
            ],
          },
          { math: String.raw`\boldsymbol{\mu}_{1 \mid 2} = \boldsymbol{\mu}_1 + \boldsymbol{\Sigma}_{12}\boldsymbol{\Sigma}_{22}^{-1}(\mathbf{x}_2 - \boldsymbol{\mu}_2), \qquad \boldsymbol{\Sigma}_{1 \mid 2} = \boldsymbol{\Sigma}_{11} - \boldsymbol{\Sigma}_{12}\boldsymbol{\Sigma}_{22}^{-1}\boldsymbol{\Sigma}_{21}` },
        ],
      },
      {
        id: 'ejemplo',
        title: 'Condicionar en la práctica',
        blocks: [
          { p: 'Supón que la máxima de la estación A tiene media 20 °C y desviación típica 4 °C; la de B, media 22 °C y desviación típica 5 °C, y que su correlación es 0,8. Si hoy B marca 30 °C, las fórmulas anteriores dan para A:' },
          { math: String.raw`\mu_{A \mid B} = 20 + 0{,}8 \cdot \tfrac{4}{5}\,(30 - 22) = 25{,}12, \qquad \sigma_{A \mid B} = 4\sqrt{1 - 0{,}8^2} = 2{,}4` },
          { p: 'Sin saber nada de B, el intervalo del 95 % para A iría de 12,2 a 27,8 °C; sabiendo que B marca 30 °C, va de 20,4 a 29,8 °C. La media se desplaza hacia arriba y la incertidumbre baja, y bajaría lo mismo con cualquier otro valor de B.' },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Dos variables normales incorreladas son independientes.»', fix: String.raw`Solo si son conjuntamente normales. Si $X \sim \mathcal{N}(0, 1)$ e $Y = SX$, con un signo $S = \pm 1$ al azar e independiente de $X$, las dos son normales estándar e incorreladas, pero $|Y| = |X|$ siempre, así que son dependientes, y el vector $(X, Y)$ no es normal multivariante.` },
      { claim: '«En 2D, la elipse de una desviación típica contiene el 68 % de la probabilidad, como en 1D.»', fix: 'La elipse con distancia de Mahalanobis 1 contiene solo el 39,3 % en 2D, y el 19,9 % en 3D, porque la probabilidad se reparte en más direcciones. Para el 95 % en 2D hace falta llegar a una distancia de 2,45.' },
      { claim: '«Cualquier matriz simétrica con unos en la diagonal sirve como matriz de correlaciones.»', fix: String.raw`Tiene que ser semidefinida positiva. Correlaciones de 0,9 entre A y B y entre A y C, con −0,9 entre B y C, son imposibles: esa matriz tiene un autovalor igual a −0,8. Por eso, cuando una red predice una covarianza, suele predecir un factor de Cholesky con la diagonal positiva.` },
      { claim: '«En alta dimensión, la mayoría de las muestras están cerca de la media, donde la densidad es máxima.»', fix: String.raw`La densidad es máxima en la media, pero allí hay muy poco volumen. Las muestras de $\mathcal{N}(\mathbf{0}, \mathbf{I})$ en dimensión 100 están casi todas a una distancia de unos 10 del origen, con una desviación típica de 0,7; quedar a menos de 5 tiene una probabilidad del orden de $10^{-15}$.` },
    ],
    dl: [
      { title: 'El codificador de un VAE.', text: String.raw`Devuelve una media y una varianza por dimensión, es decir, una normal con covarianza diagonal, y se muestrea con $\mathbf{z} = \boldsymbol{\mu} + \boldsymbol{\sigma} \odot \boldsymbol{\varepsilon}$, $\boldsymbol{\varepsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$, para que el gradiente atraviese el muestreo. La divergencia KL con el prior $\mathcal{N}(\mathbf{0}, \mathbf{I})$ tiene forma cerrada: ver [[vae]] y [[kl-divergence]].` },
      { title: 'Detección de entradas fuera de distribución.', text: 'Una técnica sencilla ajusta una normal por clase, con covarianza compartida, a las características internas de una red ya entrenada (de la penúltima capa o de varias), y marca como sospechosas las entradas cuya distancia de Mahalanobis a la clase más cercana es grande.' },
      { title: 'Interpolar en el espacio latente.', text: String.raw`Como las muestras de $\mathcal{N}(\mathbf{0}, \mathbf{I})$ se concentran en una corteza de radio cercano a $\sqrt{D}$, el punto medio entre dos códigos latentes tiene una norma atípicamente pequeña, de unos $\sqrt{D/2}$. Por eso en modelos generativos se usa a menudo interpolación esférica en lugar de lineal.` },
    ],
    quiz: [
      {
        prompt: String.raw`$(X_1, X_2)$ es normal bivariante, con medias 0, varianzas 1 y correlación 0,6. ¿Cómo se distribuye $X_1 + X_2$?`,
        options: [
          { text: String.raw`$\mathcal{N}(0;\ 2)$` },
          { text: String.raw`$\mathcal{N}(0;\ 3{,}2)$`, correct: true },
          { text: 'No tiene por qué ser normal.' },
        ],
        explain: String.raw`Es una combinación lineal de un vector normal multivariante, así que es normal, con varianza $1 + 1 + 2 \cdot 0{,}6 = 3{,}2$. Ignorar la covarianza daría 2.`,
      },
      {
        prompt: String.raw`En una normal bivariante de variables estandarizadas con correlación 0,8, observas $X_2 = 1$. ¿Cuánto vale $\mathbb{E}[X_1 \mid X_2 = 1]$?`,
        options: [{ text: '0,8', correct: true }, { text: '1' }, { text: '0' }],
        explain: String.raw`Con variables estandarizadas, $\mu_{1 \mid 2} = \rho\, x_2 = 0{,}8$: la predicción queda más cerca de la media que el valor observado. La varianza condicionada es $1 - 0{,}8^2 = 0{,}36$.`,
      },
      {
        prompt: String.raw`Tomas muestras de $\mathcal{N}(\mathbf{0}, \mathbf{I})$ en dimensión 400. ¿A qué distancia del origen suelen estar?`,
        options: [
          { text: 'Cerca de 0, donde la densidad es máxima.' },
          { text: 'Cerca de 400.' },
          { text: 'Cerca de 20.', correct: true },
        ],
        explain: String.raw`La distancia al cuadrado es la suma de 400 cuadrados de normales estándar, con media 400, así que la distancia ronda $\sqrt{400} = 20$, con una desviación típica de solo 0,7.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§3.2.1 (definición y tipos de covarianza: completa, diagonal y esférica), §3.2.2 (distancia de Mahalanobis y geometría de las elipses), §3.2.3 (marginales y condicionadas) y §3.2.4 (ejemplo en 2D).' },
      { book: 'pml2', where: '§2.3.1.2 (en alta dimensión, la probabilidad se concentra en una corteza) y §2.3.1.3–§2.3.1.4 (marginales, condicionadas y forma de información).' },
      { book: 'wilks', where: '§12.1 (definición y elipses de probabilidad a partir de la χ²), §12.2 (cuatro propiedades: subconjuntos, combinaciones lineales, independencia y condicionadas), §12.3 (cómo evaluar la normalidad multivariante) y §12.4 (simulación con una raíz cuadrada de la matriz de covarianzas).' },
    ],
    extra: [
      { text: 'Lee, K., Lee, K., Lee, H. y Shin, J. (2018). A Simple Unified Framework for Detecting Out-of-Distribution Samples and Adversarial Attacks. Advances in Neural Information Processing Systems 31 (NeurIPS).', url: 'https://proceedings.neurips.cc/paper/2018/hash/abdeb6f575ac5c6676b747bca8d09cc2-Abstract.html' },
    ],
  },
  en: {
    lede: 'The multivariate normal distribution describes a vector of variables that are normal individually and in any linear combination. It is determined by a mean vector and a covariance matrix, and its contour lines are ellipses.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'Think of the daily maximum temperatures at two nearby weather stations. Each one on its own is approximately normal, but they also rise and fall together: a hot day at one is usually hot at the other too. The bivariate normal captures both things with two means, two variances and one covariance, and the pairs of values form an elliptical cloud, tilted in the direction in which they vary together.' },
          { key: String.raw`The covariance matrix $\boldsymbol{\Sigma}$ determines the whole shape of the distribution: its eigenvectors give the directions of the axes of the ellipses, and its eigenvalues the variance along each axis.` },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { p: String.raw`A vector $\mathbf{x} \in \mathbb{R}^D$ follows a multivariate normal distribution with mean $\boldsymbol{\mu}$ and covariance $\boldsymbol{\Sigma}$, symmetric and positive definite, if its density is:` },
          { math: String.raw`\mathcal{N}(\mathbf{x} \mid \boldsymbol{\mu}, \boldsymbol{\Sigma}) = \frac{1}{(2\pi)^{D/2}\, |\boldsymbol{\Sigma}|^{1/2}} \exp\!\left(-\tfrac{1}{2}\, (\mathbf{x}-\boldsymbol{\mu})^{\top} \boldsymbol{\Sigma}^{-1} (\mathbf{x}-\boldsymbol{\mu})\right)` },
          { p: String.raw`The quadratic form in the exponent is the squared Mahalanobis distance, $d^2$: the distance to the mean measured in standard deviations and taking the correlations into account. Points with the same $d$ have the same density, so the contour lines are ellipses (ellipsoids in more dimensions). Moreover, $d^2$ follows a $\chi^2$ distribution with $D$ degrees of freedom: in 2D, the ellipse containing 95% of the probability is the one with $d^2 = 5.99$.` },
        ],
      },
      {
        id: 'properties',
        title: 'Properties',
        blocks: [
          {
            list: [
              String.raw`**Marginals:** any subset of the components is normal; just keep their means and the corresponding block of $\boldsymbol{\Sigma}$.`,
              String.raw`**Linear transformations:** $\mathbf{A}\mathbf{x} + \mathbf{b} \sim \mathcal{N}(\mathbf{A}\boldsymbol{\mu} + \mathbf{b},\ \mathbf{A}\boldsymbol{\Sigma}\mathbf{A}^{\top})$. This is how samples are generated: with the Cholesky factorization $\boldsymbol{\Sigma} = \mathbf{L}\mathbf{L}^{\top}$, take $\mathbf{x} = \boldsymbol{\mu} + \mathbf{L}\mathbf{z}$ with $\mathbf{z} \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$.`,
              '**Uncorrelatedness and independence:** within a multivariate normal vector, zero covariance is equivalent to independence.',
              String.raw`**Conditionals:** fixing some components, $\mathbf{x}_2$, leaves a normal distribution for the others, $\mathbf{x}_1$. Its mean depends linearly on the observed value and its covariance does not depend on it:`,
            ],
          },
          { math: String.raw`\boldsymbol{\mu}_{1 \mid 2} = \boldsymbol{\mu}_1 + \boldsymbol{\Sigma}_{12}\boldsymbol{\Sigma}_{22}^{-1}(\mathbf{x}_2 - \boldsymbol{\mu}_2), \qquad \boldsymbol{\Sigma}_{1 \mid 2} = \boldsymbol{\Sigma}_{11} - \boldsymbol{\Sigma}_{12}\boldsymbol{\Sigma}_{22}^{-1}\boldsymbol{\Sigma}_{21}` },
        ],
      },
      {
        id: 'example',
        title: 'Conditioning in practice',
        blocks: [
          { p: 'Suppose the maximum temperature at station A has mean 20 °C and standard deviation 4 °C; at B, mean 22 °C and standard deviation 5 °C, and their correlation is 0.8. If B reads 30 °C today, the formulas above give for A:' },
          { math: String.raw`\mu_{A \mid B} = 20 + 0.8 \cdot \tfrac{4}{5}\,(30 - 22) = 25.12, \qquad \sigma_{A \mid B} = 4\sqrt{1 - 0.8^2} = 2.4` },
          { p: 'Knowing nothing about B, the 95% interval for A would run from 12.2 to 27.8 °C; knowing that B reads 30 °C, it runs from 20.4 to 29.8 °C. The mean shifts upwards and the uncertainty shrinks, and it would shrink by the same amount for any other value of B.' },
        ],
      },
    ],
    pitfalls: [
      { claim: '“Two uncorrelated normal variables are independent.”', fix: String.raw`Only if they are jointly normal. If $X \sim \mathcal{N}(0, 1)$ and $Y = SX$, with a random sign $S = \pm 1$ independent of $X$, both are standard normal and uncorrelated, but $|Y| = |X|$ always, so they are dependent, and the vector $(X, Y)$ is not multivariate normal.` },
      { claim: '“In 2D, the one-standard-deviation ellipse contains 68% of the probability, as in 1D.”', fix: 'The ellipse at Mahalanobis distance 1 contains only 39.3% in 2D, and 19.9% in 3D, because the probability is spread over more directions. For 95% in 2D you need to go out to a distance of 2.45.' },
      { claim: '“Any symmetric matrix with ones on the diagonal is a valid correlation matrix.”', fix: String.raw`It must be positive semidefinite. Correlations of 0.9 between A and B and between A and C, with −0.9 between B and C, are impossible: that matrix has an eigenvalue of −0.8. That is why, when a network predicts a covariance, it usually predicts a Cholesky factor with a positive diagonal.` },
      { claim: '“In high dimension, most samples lie near the mean, where the density is highest.”', fix: String.raw`The density is highest at the mean, but there is very little volume there. Samples from $\mathcal{N}(\mathbf{0}, \mathbf{I})$ in dimension 100 are almost all at a distance of about 10 from the origin, with a standard deviation of 0.7; landing within 5 has a probability of the order of $10^{-15}$.` },
    ],
    dl: [
      { title: 'The encoder of a VAE.', text: String.raw`It outputs a mean and a variance per dimension, that is, a normal distribution with diagonal covariance, and samples with $\mathbf{z} = \boldsymbol{\mu} + \boldsymbol{\sigma} \odot \boldsymbol{\varepsilon}$, $\boldsymbol{\varepsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$, so that the gradient flows through the sampling step. The KL divergence to the prior $\mathcal{N}(\mathbf{0}, \mathbf{I})$ has a closed form: see [[vae]] and [[kl-divergence]].` },
      { title: 'Out-of-distribution detection.', text: 'A simple technique fits one normal distribution per class, with a shared covariance, to the internal features of an already trained network (from the penultimate layer or from several layers), and flags as suspicious the inputs whose Mahalanobis distance to the nearest class is large.' },
      { title: 'Interpolating in latent space.', text: String.raw`Since samples from $\mathcal{N}(\mathbf{0}, \mathbf{I})$ concentrate on a shell of radius close to $\sqrt{D}$, the midpoint between two latent codes has an atypically small norm, about $\sqrt{D/2}$. That is why generative models often use spherical rather than linear interpolation.` },
    ],
    quiz: [
      {
        prompt: String.raw`$(X_1, X_2)$ is bivariate normal, with means 0, variances 1 and correlation 0.6. How is $X_1 + X_2$ distributed?`,
        options: [
          { text: String.raw`$\mathcal{N}(0, 2)$` },
          { text: String.raw`$\mathcal{N}(0, 3.2)$`, correct: true },
          { text: 'It need not be normal.' },
        ],
        explain: String.raw`It is a linear combination of a multivariate normal vector, so it is normal, with variance $1 + 1 + 2 \cdot 0.6 = 3.2$. Ignoring the covariance would give 2.`,
      },
      {
        prompt: String.raw`In a bivariate normal distribution of standardized variables with correlation 0.8, you observe $X_2 = 1$. What is $\mathbb{E}[X_1 \mid X_2 = 1]$?`,
        options: [{ text: '0.8', correct: true }, { text: '1' }, { text: '0' }],
        explain: String.raw`With standardized variables, $\mu_{1 \mid 2} = \rho\, x_2 = 0.8$: the prediction stays closer to the mean than the observed value. The conditional variance is $1 - 0.8^2 = 0.36$.`,
      },
      {
        prompt: String.raw`You draw samples from $\mathcal{N}(\mathbf{0}, \mathbf{I})$ in dimension 400. How far from the origin do they typically lie?`,
        options: [
          { text: 'Close to 0, where the density is highest.' },
          { text: 'Close to 400.' },
          { text: 'Close to 20.', correct: true },
        ],
        explain: String.raw`The squared distance is the sum of 400 squared standard normals, with mean 400, so the distance is around $\sqrt{400} = 20$, with a standard deviation of only 0.7.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§3.2.1 (definition and types of covariance: full, diagonal and spherical), §3.2.2 (Mahalanobis distance and the geometry of the ellipses), §3.2.3 (marginals and conditionals) and §3.2.4 (a 2D example).' },
      { book: 'pml2', where: '§2.3.1.2 (in high dimension, the probability concentrates on a shell) and §2.3.1.3–§2.3.1.4 (marginals, conditionals and the information form).' },
      { book: 'wilks', where: '§12.1 (definition and probability ellipses from the χ² distribution), §12.2 (four properties: subsets, linear combinations, independence and conditionals), §12.3 (how to assess multivariate normality) and §12.4 (simulation with a square root of the covariance matrix).' },
    ],
    extra: [
      { text: 'Lee, K., Lee, K., Lee, H. and Shin, J. (2018). A Simple Unified Framework for Detecting Out-of-Distribution Samples and Adversarial Attacks. Advances in Neural Information Processing Systems 31 (NeurIPS).', url: 'https://proceedings.neurips.cc/paper/2018/hash/abdeb6f575ac5c6676b747bca8d09cc2-Abstract.html' },
    ],
  },
};

export default content;
