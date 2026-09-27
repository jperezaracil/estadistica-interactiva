import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: String.raw`Si conoces la distribución de $X$, ¿cuál es la de $Y = g(X)$? Para variables continuas, la respuesta es la fórmula del cambio de variable, que corrige la densidad según cuánto estira o comprime $g$ el eje. Es la base de los flujos normalizadores y del truco de reparametrización.`,
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Generas cuadrados cuyo lado $L$ es uniforme entre 0 y 1. Los lados se reparten por igual, pero las áreas $A = L^2$ no: la mitad de los cuadrados tienen lado menor que 0,5 y, por tanto, área menor que 0,25. La transformación comprime los lados pequeños en un rango de áreas todavía más pequeño, y la probabilidad se amontona cerca de 0. La densidad de $A$ tiene que reflejar ese amontonamiento.` },
          { key: 'La probabilidad se conserva; la densidad, no. Donde la transformación comprime el eje, la densidad sube; donde lo estira, baja.' },
        ],
      },
      {
        id: 'cambio-de-variable',
        title: 'El cambio de variable',
        blocks: [
          { p: String.raw`El camino seguro es pasar por la CDF: $F_Y(y) = P(g(X) \le y)$, la probabilidad del conjunto de valores $x$ con $g(x) \le y$. Si $g$ es estrictamente monótona y derivable con $g' \ne 0$, derivando se llega a` },
          { math: String.raw`f_Y(y) = f_X\big(g^{-1}(y)\big)\,\left|\frac{d\,g^{-1}(y)}{dy}\right|` },
          { p: String.raw`En el ejemplo, $g^{-1}(a) = \sqrt{a}$ y $f_A(a) = \frac{1}{2\sqrt{a}}$ para $0 < a \le 1$, que se dispara cerca de 0. En varias dimensiones, con $g$ biyectiva y diferenciable, y con inversa también diferenciable, el factor pasa a ser el valor absoluto del determinante del jacobiano de la inversa, que mide cuánto cambia el volumen:` },
          { math: String.raw`p_Y(\mathbf{y}) = p_X\big(g^{-1}(\mathbf{y})\big)\,\big|\det J_{g^{-1}}(\mathbf{y})\big|` },
          { p: String.raw`Si $X$ es discreta no hay jacobiano: $P(Y = y)$ es la suma de $P(X = x)$ sobre todos los $x$ con $g(x) = y$.` },
        ],
      },
      {
        id: 'que-se-conserva',
        title: 'Qué se conserva y qué no',
        blocks: [
          { p: String.raw`Con $X \sim \mathcal{N}(0, 1)$ e $Y = e^X$ (una lognormal), los resúmenes de $X$ se transforman así:` },
          {
            table: {
              head: ['Resumen', String.raw`$X$`, String.raw`$Y = e^X$`, String.raw`$e$ elevado al resumen de $X$`],
              rows: [
                ['Mediana', '0', '1', '1'],
                ['Media', '0', '1,649', '1'],
                ['Moda', '0', '0,368', '1'],
              ],
              numeric: [1, 2, 3],
            },
          },
          { p: String.raw`Con $g$ creciente, los cuantiles se transforman directamente, porque $P(Y \le g(x)) = P(X \le x)$: por eso la mediana de $Y$ es $g$ de la mediana de $X$. La media no, salvo que $g$ sea lineal ($\mathbb{E}[e^X] = e^{1/2} > e^0$, como predice la desigualdad de Jensen; ver [[expectation-moments]]), y la moda tampoco, porque el jacobiano desplaza el máximo de la densidad.` },
        ],
      },
      {
        id: 'casos',
        title: 'Casos útiles',
        blocks: [
          {
            list: [
              String.raw`**Lineal.** Si $Y = aX + b$ con $a \ne 0$, $f_Y(y) = f_X\big((y - b)/a\big)/|a|$: la forma no cambia, solo se desplaza y se reescala. Estandarizar, $Z = (X - \mu)/\sigma$, es el caso más habitual.`,
              String.raw`**Transformada integral de probabilidad.** Si $X$ es continua con CDF $F$, entonces $F(X)$ es uniforme en $(0, 1)$. Al revés, si $U$ es uniforme, $F^{-1}(U)$ tiene CDF $F$: así se generan muestras de muchas distribuciones. Por ejemplo, $-\ln(1 - U)/\lambda$ es exponencial de tasa $\lambda$.`,
              String.raw`**Sumas.** Si $X$ e $Y$ son independientes, la densidad de $X + Y$ es la convolución $f_{X+Y}(z) = \int f_X(x)\,f_Y(z - x)\,dx$. Repetida muchas veces, lleva al [[lln-clt|teorema central del límite]].`,
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: String.raw`«La densidad de $Y = g(X)$ es $f_X(g^{-1}(y))$.»`, fix: String.raw`Falta el jacobiano, y sin él la densidad ni siquiera integra 1 en general. En el ejemplo del cuadrado daría un área uniforme, que contradice $P(A \le 0{,}25) = 0{,}5$.` },
      { claim: '«La media (o la moda) de g(X) es g aplicada a la media (o la moda) de X.»', fix: String.raw`Solo los cuantiles pasan directamente, y solo con $g$ monótona creciente. Con $Y = e^X$ y $X$ normal estándar, $g$ de la media y de la moda de $X$ vale 1, pero la media de $Y$ es 1,649 y su moda, 0,368.` },
      { claim: '«El cambio de variable vale para cualquier g.»', fix: String.raw`La fórmula necesita $g$ invertible y diferenciable. Si no es inyectiva, hay que sumar sobre todas las preimágenes: para $Y = X^2$, $f_Y(y) = \big(f_X(\sqrt{y}) + f_X(-\sqrt{y})\big)/(2\sqrt{y})$. Si $g$ reduce la dimensión, como $X_1 + X_2$, no hay un jacobiano cuadrado y hay que marginalizar o pasar por la CDF.` },
    ],
    dl: [
      { title: 'Flujos normalizadores.', text: String.raw`Un flujo transforma una variable simple $\mathbf{z} \sim \mathcal{N}(\mathbf{0}, I)$ con una red invertible, $\mathbf{x} = g(\mathbf{z})$, y obtiene la log-verosimilitud exacta: $\log p_X(\mathbf{x}) = \log p_Z\big(g^{-1}(\mathbf{x})\big) + \log\big|\det J_{g^{-1}}(\mathbf{x})\big|$. Sus capas (de acoplamiento, autorregresivas) se diseñan para que el jacobiano sea triangular y su determinante sea el producto de la diagonal.` },
      { title: 'Truco de reparametrización.', text: String.raw`Para muestrear $z \sim \mathcal{N}(\mu, \sigma^2)$ sin cortar el gradiente respecto a $\mu$ y $\sigma$, se escribe $z = \mu + \sigma\,\varepsilon$ con $\varepsilon \sim \mathcal{N}(0, 1)$: una transformación lineal de un ruido con distribución fija. Es lo que hace un [[vae|VAE]] con la salida de su codificador.` },
      { title: 'Verosimilitudes en escalas distintas.', text: String.raw`Si un modelo predice $\log y$ y otro predice $y$, sus log-verosimilitudes no son comparables sin el jacobiano: $\log p_Y(y) = \log p_{\log Y}(\log y) - \log y$. Lo mismo ocurre al reescalar los píxeles de $[0, 255]$ a $[0, 1]$ en un modelo generativo: la log-verosimilitud cambia en una constante.` },
    ],
    quiz: [
      {
        prompt: String.raw`$X$ es uniforme en $[0, 1]$ e $Y = 3X + 2$. ¿Cuál es la densidad de $Y$?`,
        options: [
          { text: String.raw`1 en $[2, 5]$.` },
          { text: String.raw`$1/3$ en $[2, 5]$.`, correct: true },
          { text: String.raw`3 en $[2, 5]$.` },
        ],
        explain: String.raw`$f_Y(y) = f_X\big((y - 2)/3\big)/3 = 1/3$ en $[2, 5]$: el intervalo se estira por 3, así que la densidad se divide por 3 para que el área siga siendo 1.`,
      },
      {
        prompt: String.raw`Aplicas a $X$ una función $g$ estrictamente creciente. ¿Qué resumen de $g(X)$ obtienes aplicando $g$ al de $X$?`,
        options: [{ text: 'La media.' }, { text: 'La mediana.', correct: true }, { text: 'La moda.' }],
        explain: String.raw`Como $g$ es creciente, $P(g(X) \le g(m)) = P(X \le m) = 0{,}5$ si $m$ es la mediana de $X$, así que la mediana pasa directamente. La media y la moda, en general, no.`,
      },
      {
        prompt: String.raw`$U$ es uniforme en $(0, 1)$. ¿Qué distribución tiene $-\ln(1 - U)$?`,
        options: [{ text: String.raw`Uniforme en $(0, 1)$.` }, { text: 'Exponencial de media 1.', correct: true }, { text: 'Normal estándar.' }],
        explain: String.raw`Es $F^{-1}(U)$ con $F(x) = 1 - e^{-x}$, la CDF de una exponencial de tasa 1: $P(-\ln(1 - U) \le x) = P(U \le 1 - e^{-x}) = 1 - e^{-x}$.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§2.8.1–2.8.3 (caso discreto, caso continuo y cambio de variable escalar y multivariante), §2.8.4 (momentos de una transformación lineal) y §2.8.5 (suma de variables independientes y convolución).' },
      { book: 'pml2', where: '§2.5 (cambio de variable con jacobiano, aproximación de Monte Carlo y transformada integral de probabilidad), §6.3.5 (truco de reparametrización) y §23.1 (flujos normalizadores: definición y entrenamiento).' },
      { book: 'wilks', where: '§4.7.2 (generación de números aleatorios por inversión de la CDF).' },
    ],
    extra: [
      { text: 'Kingma, D. P. y Welling, M. (2014). Auto-Encoding Variational Bayes. ICLR 2014. Presenta el autocodificador variacional y el truco de reparametrización.', url: 'https://arxiv.org/abs/1312.6114' },
      { text: 'Papamakarios, G., Nalisnick, E., Rezende, D. J., Mohamed, S. y Lakshminarayanan, B. (2021). Normalizing flows for probabilistic modeling and inference. Journal of Machine Learning Research, 22(57), 1–64. Revisión de referencia sobre flujos normalizadores.', url: 'https://jmlr.org/papers/v22/19-1028.html' },
    ],
  },
  en: {
    lede: String.raw`If you know the distribution of $X$, what is the distribution of $Y = g(X)$? For continuous variables, the answer is the change-of-variables formula, which corrects the density according to how much $g$ stretches or compresses the axis. It is the basis of normalizing flows and of the reparameterization trick.`,
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`You generate squares whose side $L$ is uniform between 0 and 1. The sides are spread evenly, but the areas $A = L^2$ are not: half of the squares have a side shorter than 0.5 and therefore an area smaller than 0.25. The transformation squeezes the small sides into an even smaller range of areas, and probability piles up near 0. The density of $A$ has to reflect that pile-up.` },
          { key: 'Probability is preserved; density is not. Where the transformation compresses the axis, the density goes up; where it stretches it, the density goes down.' },
        ],
      },
      {
        id: 'change-of-variables',
        title: 'Change of variables',
        blocks: [
          { p: String.raw`The safe route goes through the CDF: $F_Y(y) = P(g(X) \le y)$, the probability of the set of values $x$ with $g(x) \le y$. If $g$ is strictly monotonic and differentiable with $g' \ne 0$, differentiating gives` },
          { math: String.raw`f_Y(y) = f_X\big(g^{-1}(y)\big)\,\left|\frac{d\,g^{-1}(y)}{dy}\right|` },
          { p: String.raw`In the example, $g^{-1}(a) = \sqrt{a}$ and $f_A(a) = \frac{1}{2\sqrt{a}}$ for $0 < a \le 1$, which blows up near 0. In several dimensions, with $g$ bijective and differentiable, and with a differentiable inverse, the factor becomes the absolute value of the determinant of the Jacobian of the inverse, which measures how volume changes:` },
          { math: String.raw`p_Y(\mathbf{y}) = p_X\big(g^{-1}(\mathbf{y})\big)\,\big|\det J_{g^{-1}}(\mathbf{y})\big|` },
          { p: String.raw`If $X$ is discrete there is no Jacobian: $P(Y = y)$ is the sum of $P(X = x)$ over all $x$ with $g(x) = y$.` },
        ],
      },
      {
        id: 'what-carries-over',
        title: 'What carries over and what does not',
        blocks: [
          { p: String.raw`With $X \sim \mathcal{N}(0, 1)$ and $Y = e^X$ (a lognormal), the summaries of $X$ transform as follows:` },
          {
            table: {
              head: ['Summary', String.raw`$X$`, String.raw`$Y = e^X$`, String.raw`$e$ raised to the summary of $X$`],
              rows: [
                ['Median', '0', '1', '1'],
                ['Mean', '0', '1.649', '1'],
                ['Mode', '0', '0.368', '1'],
              ],
              numeric: [1, 2, 3],
            },
          },
          { p: String.raw`With an increasing $g$, quantiles transform directly, because $P(Y \le g(x)) = P(X \le x)$: that is why the median of $Y$ is $g$ of the median of $X$. The mean does not, unless $g$ is linear ($\mathbb{E}[e^X] = e^{1/2} > e^0$, as Jensen’s inequality predicts; see [[expectation-moments]]), and neither does the mode, because the Jacobian shifts the peak of the density.` },
        ],
      },
      {
        id: 'useful-cases',
        title: 'Useful cases',
        blocks: [
          {
            list: [
              String.raw`**Linear.** If $Y = aX + b$ with $a \ne 0$, $f_Y(y) = f_X\big((y - b)/a\big)/|a|$: the shape does not change, it is only shifted and rescaled. Standardizing, $Z = (X - \mu)/\sigma$, is the most common case.`,
              String.raw`**Probability integral transform.** If $X$ is continuous with CDF $F$, then $F(X)$ is uniform on $(0, 1)$. Conversely, if $U$ is uniform, $F^{-1}(U)$ has CDF $F$: this is how samples from many distributions are generated. For example, $-\ln(1 - U)/\lambda$ is exponential with rate $\lambda$.`,
              String.raw`**Sums.** If $X$ and $Y$ are independent, the density of $X + Y$ is the convolution $f_{X+Y}(z) = \int f_X(x)\,f_Y(z - x)\,dx$. Repeated many times, it leads to the [[lln-clt|central limit theorem]].`,
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: String.raw`“The density of $Y = g(X)$ is $f_X(g^{-1}(y))$.”`, fix: String.raw`The Jacobian is missing, and without it the density does not even integrate to 1 in general. In the square example it would give a uniform area, which contradicts $P(A \le 0.25) = 0.5$.` },
      { claim: '“The mean (or the mode) of g(X) is g applied to the mean (or the mode) of X.”', fix: String.raw`Only quantiles carry over directly, and only with a monotonically increasing $g$. With $Y = e^X$ and $X$ standard normal, $g$ of the mean and of the mode of $X$ is 1, but the mean of $Y$ is 1.649 and its mode is 0.368.` },
      { claim: '“The change-of-variables formula works for any g.”', fix: String.raw`The formula needs $g$ to be invertible and differentiable. If it is not injective, you must sum over all preimages: for $Y = X^2$, $f_Y(y) = \big(f_X(\sqrt{y}) + f_X(-\sqrt{y})\big)/(2\sqrt{y})$. If $g$ reduces the dimension, as in $X_1 + X_2$, there is no square Jacobian, and you have to marginalize or go through the CDF.` },
    ],
    dl: [
      { title: 'Normalizing flows.', text: String.raw`A flow transforms a simple variable $\mathbf{z} \sim \mathcal{N}(\mathbf{0}, I)$ with an invertible network, $\mathbf{x} = g(\mathbf{z})$, and gets the exact log-likelihood: $\log p_X(\mathbf{x}) = \log p_Z\big(g^{-1}(\mathbf{x})\big) + \log\big|\det J_{g^{-1}}(\mathbf{x})\big|$. Its layers (coupling, autoregressive) are designed so that the Jacobian is triangular and its determinant is the product of the diagonal.` },
      { title: 'Reparameterization trick.', text: String.raw`To sample $z \sim \mathcal{N}(\mu, \sigma^2)$ without cutting the gradient with respect to $\mu$ and $\sigma$, you write $z = \mu + \sigma\,\varepsilon$ with $\varepsilon \sim \mathcal{N}(0, 1)$: a linear transformation of noise with a fixed distribution. This is what a [[vae|VAE]] does with the output of its encoder.` },
      { title: 'Likelihoods on different scales.', text: String.raw`If one model predicts $\log y$ and another predicts $y$, their log-likelihoods are not comparable without the Jacobian: $\log p_Y(y) = \log p_{\log Y}(\log y) - \log y$. The same happens when rescaling pixels from $[0, 255]$ to $[0, 1]$ in a generative model: the log-likelihood shifts by a constant.` },
    ],
    quiz: [
      {
        prompt: String.raw`$X$ is uniform on $[0, 1]$ and $Y = 3X + 2$. What is the density of $Y$?`,
        options: [
          { text: String.raw`1 on $[2, 5]$.` },
          { text: String.raw`$1/3$ on $[2, 5]$.`, correct: true },
          { text: String.raw`3 on $[2, 5]$.` },
        ],
        explain: String.raw`$f_Y(y) = f_X\big((y - 2)/3\big)/3 = 1/3$ on $[2, 5]$: the interval is stretched by 3, so the density is divided by 3 to keep the area equal to 1.`,
      },
      {
        prompt: String.raw`You apply a strictly increasing function $g$ to $X$. Which summary of $g(X)$ do you get by applying $g$ to that of $X$?`,
        options: [{ text: 'The mean.' }, { text: 'The median.', correct: true }, { text: 'The mode.' }],
        explain: String.raw`Since $g$ is increasing, $P(g(X) \le g(m)) = P(X \le m) = 0.5$ if $m$ is the median of $X$, so the median carries over directly. The mean and the mode, in general, do not.`,
      },
      {
        prompt: String.raw`$U$ is uniform on $(0, 1)$. What is the distribution of $-\ln(1 - U)$?`,
        options: [{ text: String.raw`Uniform on $(0, 1)$.` }, { text: 'Exponential with mean 1.', correct: true }, { text: 'Standard normal.' }],
        explain: String.raw`It is $F^{-1}(U)$ with $F(x) = 1 - e^{-x}$, the CDF of an exponential with rate 1: $P(-\ln(1 - U) \le x) = P(U \le 1 - e^{-x}) = 1 - e^{-x}$.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§2.8.1–2.8.3 (discrete case, continuous case and scalar and multivariate change of variables), §2.8.4 (moments of a linear transformation) and §2.8.5 (sums of independent variables and convolution).' },
      { book: 'pml2', where: '§2.5 (change of variables with the Jacobian, Monte Carlo approximation and the probability integral transform), §6.3.5 (reparameterization trick) and §23.1 (normalizing flows: definition and training).' },
      { book: 'wilks', where: '§4.7.2 (random number generation by inverting the CDF).' },
    ],
    extra: [
      { text: 'Kingma, D. P. and Welling, M. (2014). Auto-Encoding Variational Bayes. ICLR 2014. Introduces the variational autoencoder and the reparameterization trick.', url: 'https://arxiv.org/abs/1312.6114' },
      { text: 'Papamakarios, G., Nalisnick, E., Rezende, D. J., Mohamed, S. and Lakshminarayanan, B. (2021). Normalizing flows for probabilistic modeling and inference. Journal of Machine Learning Research, 22(57), 1–64. The reference review on normalizing flows.', url: 'https://jmlr.org/papers/v22/19-1028.html' },
    ],
  },
};

export default content;
