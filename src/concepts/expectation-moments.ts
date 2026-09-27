import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'La esperanza es el valor medio de una variable aleatoria, ponderado por las probabilidades; la varianza mide cuánto se aleja la variable de ese valor, en promedio al cuadrado. Junto con los momentos de orden superior, resumen la forma de una distribución.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Juegas a lanzar un dado: si sale 6 ganas 10 €, y si no, pierdes 1 €. En una partida puedes ganar o perder, pero si juegas muchas, tu ganancia media por partida se acerca a $10 \cdot \tfrac{1}{6} - 1 \cdot \tfrac{5}{6} = \tfrac{5}{6} \approx 0{,}83$ €. Ese promedio ponderado por las probabilidades es la **esperanza**. No dice cuánto oscilan los resultados: aquí la **desviación típica** es de unos 4,10 €, casi cinco veces la esperanza.` },
          { key: 'La esperanza es el centro de masas de la distribución, y la varianza es su momento de inercia respecto a ese centro.' },
        ],
      },
      {
        id: 'definiciones',
        title: 'Definiciones',
        blocks: [
          { p: String.raw`Para una variable discreta con PMF $p(x)$, o continua con densidad $f(x)$:` },
          { math: String.raw`\begin{aligned} \mathbb{E}[X] &= \sum_x x\,p(x) \quad \text{o} \quad \int x\,f(x)\,dx \\ \operatorname{Var}(X) &= \mathbb{E}\big[(X - \mathbb{E}[X])^2\big] = \mathbb{E}[X^2] - \mathbb{E}[X]^2 \end{aligned}` },
          { p: String.raw`La **desviación típica** $\sigma = \sqrt{\operatorname{Var}(X)}$ tiene las mismas unidades que $X$. Para calcular la esperanza de una función no hace falta conocer la distribución de $g(X)$: $\mathbb{E}[g(X)] = \sum_x g(x)\,p(x)$, o la integral análoga. La esperanza solo existe si esa suma o integral converge absolutamente, $\mathbb{E}|X| < \infty$; la distribución de Cauchy, por ejemplo, no tiene media.` },
          { p: String.raw`Más en general, $\mathbb{E}[X^k]$ es el **momento** de orden $k$ y $\mathbb{E}[(X - \mu)^k]$, el momento central. Divididos por $\sigma^k$, el tercero mide la **asimetría** y el cuarto la **curtosis**, que refleja sobre todo el peso de las colas.` },
        ],
      },
      {
        id: 'propiedades',
        title: 'Propiedades',
        blocks: [
          {
            list: [
              String.raw`**Linealidad:** $\mathbb{E}[aX + bY + c] = a\,\mathbb{E}[X] + b\,\mathbb{E}[Y] + c$, siempre, sean o no independientes.`,
              String.raw`**Cambio de escala:** $\operatorname{Var}(aX + b) = a^2 \operatorname{Var}(X)$; desplazar no cambia la dispersión.`,
              String.raw`**Suma:** $\operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y) + 2\operatorname{Cov}(X, Y)$ ([[covariance-correlation|covarianza]]). Si están incorreladas, por ejemplo por ser independientes, las varianzas se suman; por eso la media de $n$ variables independientes con varianza $\sigma^2$ tiene varianza $\sigma^2/n$ (ver [[lln-clt]]).`,
              String.raw`**Producto:** si $X$ e $Y$ son independientes, $\mathbb{E}[XY] = \mathbb{E}[X]\,\mathbb{E}[Y]$ (basta con que estén incorreladas).`,
              String.raw`**Esperanza total:** $\mathbb{E}[X] = \mathbb{E}\big[\mathbb{E}[X \mid Y]\big]$: la media global es la media de las medias de cada grupo, ponderada por el peso del grupo.`,
              String.raw`**Desigualdad de Jensen:** si $g$ es convexa, $\mathbb{E}[g(X)] \ge g(\mathbb{E}[X])$. Con $g(x) = x^2$ se obtiene $\mathbb{E}[X^2] \ge \mathbb{E}[X]^2$, es decir, $\operatorname{Var}(X) \ge 0$.`,
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: String.raw`«$\mathbb{E}[g(X)] = g(\mathbb{E}[X])$.»`, fix: String.raw`Solo si $g$ es lineal (afín). Si $X$ vale $-1$ o $1$ con probabilidad $1/2$, $\mathbb{E}[X^2] = 1$, pero $\mathbb{E}[X]^2 = 0$. Si $g$ es convexa, Jensen dice hacia dónde va la diferencia.` },
      { claim: '«La varianza de una suma es la suma de las varianzas.»', fix: String.raw`Solo si las variables están incorreladas. En el caso extremo, $\operatorname{Var}(X + X) = \operatorname{Var}(2X) = 4\operatorname{Var}(X)$, no $2\operatorname{Var}(X)$.` },
      { claim: '«La esperanza es el valor que cabe esperar en una observación.»', fix: String.raw`Puede ser un valor imposible: en el juego del dado ganas 10 € o pierdes 1 €, nunca ganas 0,83 €, y la cara media de un dado es 3,5. El valor más probable es la moda.` },
      { claim: '«Toda distribución tiene media y varianza.»', fix: String.raw`La de Cauchy no tiene media, y la media de n observaciones suyas no converge a nada. Una t de Student con 2 grados de libertad tiene media, pero varianza infinita, así que no se le aplica el teorema central del límite clásico (con varianza finita y escala $\sqrt{n}$): ver [[lln-clt]].` },
    ],
    dl: [
      { title: 'Inicialización de pesos.', text: String.raw`Para una neurona $y = \sum_{i=1}^{n} w_i x_i$ con pesos independientes, de media cero e independientes de las entradas, $\operatorname{Var}(y) = n\,\operatorname{Var}(w)\,\mathbb{E}[x^2]$. Para que las activaciones no crezcan ni se apaguen capa a capa se toma $\operatorname{Var}(w) = 1/n$ (LeCun; Glorot promedia entradas y salidas) o $2/n$ con ReLU (He), porque la ReLU anula la parte negativa y deja $\mathbb{E}[x^2]$ en la mitad de la varianza de su entrada.` },
      { title: 'Dropout sin cambiar la esperanza.', text: String.raw`En el dropout invertido, cada activación se anula con probabilidad $p$ y las que sobreviven se multiplican por $1/(1-p)$. Así la esperanza no cambia, $\mathbb{E}[m\,x/(1-p)] = x$ con $m \sim \mathrm{Bernoulli}(1-p)$, y en inferencia basta con desactivar el dropout. La varianza, en cambio, sí aumenta.` },
      { title: 'Adam estima momentos.', text: 'El optimizador Adam mantiene medias móviles exponenciales del gradiente y de su cuadrado elemento a elemento: estimaciones del primer momento y del segundo momento sin centrar. Cada paso divide la primera por la raíz de la segunda, de modo que el tamaño del paso se adapta a la escala del gradiente de cada parámetro.' },
    ],
    quiz: [
      {
        prompt: String.raw`$X$ vale 0, 1 o 2 con probabilidades 0,5; 0,3 y 0,2. ¿Cuánto vale $\mathbb{E}[X]$?`,
        options: [{ text: '1' }, { text: '0,7', correct: true }, { text: '1,1' }],
        explain: String.raw`$\mathbb{E}[X] = 0 \cdot 0{,}5 + 1 \cdot 0{,}3 + 2 \cdot 0{,}2 = 0{,}7$. El 1 sería la media de los valores sin ponderar, y 1,1 es $\mathbb{E}[X^2]$.`,
      },
      {
        prompt: String.raw`Si $\operatorname{Var}(X) = 4$, ¿cuánto vale $\operatorname{Var}(3X + 5)$?`,
        options: [{ text: '17' }, { text: '12' }, { text: '36', correct: true }],
        explain: String.raw`$\operatorname{Var}(aX + b) = a^2 \operatorname{Var}(X) = 9 \cdot 4 = 36$. El desplazamiento no cambia la dispersión, y el factor entra al cuadrado.`,
      },
      {
        prompt: String.raw`$X$ e $Y$ son independientes, cada una con varianza 1. ¿Cuánto vale $\operatorname{Var}(X - Y)$?`,
        options: [{ text: '0' }, { text: '2', correct: true }, { text: '1' }],
        explain: String.raw`$\operatorname{Var}(X - Y) = \operatorname{Var}(X) + (-1)^2 \operatorname{Var}(Y) = 2$. Las varianzas de variables independientes se suman aunque las variables se resten.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§4.3 (esperanza de una variable aleatoria discreta y de una función suya) y §4.4.1 (esperanzas de variables continuas).' },
      { book: 'pml1', where: '§2.2.5 (media, varianza, moda y momentos condicionales, con las leyes de la esperanza y la varianza totales), §2.2.6 (por qué unos pocos momentos no bastan para describir unos datos) y §13.4.5 (inicialización de pesos a partir de la varianza de una suma).' },
    ],
    extra: [
      { text: 'Glorot, X. y Bengio, Y. (2010). Understanding the difficulty of training deep feedforward neural networks. AISTATS 2010, PMLR 9, 249–256.', url: 'https://proceedings.mlr.press/v9/glorot10a.html' },
      { text: 'He, K., Zhang, X., Ren, S. y Sun, J. (2015). Delving deep into rectifiers: surpassing human-level performance on ImageNet classification. ICCV 2015, 1026–1034.', url: 'https://doi.org/10.1109/ICCV.2015.123' },
    ],
  },
  en: {
    lede: 'The expectation is the average value of a random variable, weighted by the probabilities; the variance measures how far the variable strays from that value, on average and squared. Together with the higher-order moments, they summarize the shape of a distribution.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`You play a dice game: if a 6 comes up you win €10, otherwise you lose €1. In a single round you may win or lose, but if you play many, your average gain per round approaches $10 \cdot \tfrac{1}{6} - 1 \cdot \tfrac{5}{6} = \tfrac{5}{6} \approx 0.83$ euros. That probability-weighted average is the **expectation**. It does not say how much the results fluctuate: here the **standard deviation** is about €4.10, almost five times the expectation.` },
          { key: 'The expectation is the center of mass of the distribution, and the variance is its moment of inertia about that center.' },
        ],
      },
      {
        id: 'definitions',
        title: 'Definitions',
        blocks: [
          { p: String.raw`For a discrete variable with PMF $p(x)$, or a continuous one with density $f(x)$:` },
          { math: String.raw`\begin{aligned} \mathbb{E}[X] &= \sum_x x\,p(x) \quad \text{or} \quad \int x\,f(x)\,dx \\ \operatorname{Var}(X) &= \mathbb{E}\big[(X - \mathbb{E}[X])^2\big] = \mathbb{E}[X^2] - \mathbb{E}[X]^2 \end{aligned}` },
          { p: String.raw`The **standard deviation** $\sigma = \sqrt{\operatorname{Var}(X)}$ has the same units as $X$. To compute the expectation of a function you do not need the distribution of $g(X)$: $\mathbb{E}[g(X)] = \sum_x g(x)\,p(x)$, or the analogous integral. The expectation only exists if that sum or integral converges absolutely, $\mathbb{E}|X| < \infty$; the Cauchy distribution, for example, has no mean.` },
          { p: String.raw`More generally, $\mathbb{E}[X^k]$ is the **moment** of order $k$ and $\mathbb{E}[(X - \mu)^k]$ the central moment. Divided by $\sigma^k$, the third one measures **skewness** and the fourth **kurtosis**, which mostly reflects how heavy the tails are.` },
        ],
      },
      {
        id: 'properties',
        title: 'Properties',
        blocks: [
          {
            list: [
              String.raw`**Linearity:** $\mathbb{E}[aX + bY + c] = a\,\mathbb{E}[X] + b\,\mathbb{E}[Y] + c$, always, whether or not they are independent.`,
              String.raw`**Rescaling:** $\operatorname{Var}(aX + b) = a^2 \operatorname{Var}(X)$; shifting does not change the spread.`,
              String.raw`**Sum:** $\operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y) + 2\operatorname{Cov}(X, Y)$ ([[covariance-correlation|covariance]]). If they are uncorrelated, for instance because they are independent, the variances add up; that is why the mean of $n$ independent variables with variance $\sigma^2$ has variance $\sigma^2/n$ (see [[lln-clt]]).`,
              String.raw`**Product:** if $X$ and $Y$ are independent, $\mathbb{E}[XY] = \mathbb{E}[X]\,\mathbb{E}[Y]$ (being uncorrelated is enough).`,
              String.raw`**Total expectation:** $\mathbb{E}[X] = \mathbb{E}\big[\mathbb{E}[X \mid Y]\big]$: the overall mean is the mean of the group means, weighted by the size of each group.`,
              String.raw`**Jensen’s inequality:** if $g$ is convex, $\mathbb{E}[g(X)] \ge g(\mathbb{E}[X])$. With $g(x) = x^2$ you get $\mathbb{E}[X^2] \ge \mathbb{E}[X]^2$, that is, $\operatorname{Var}(X) \ge 0$.`,
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: String.raw`“$\mathbb{E}[g(X)] = g(\mathbb{E}[X])$.”`, fix: String.raw`Only if $g$ is linear (affine). If $X$ is $-1$ or $1$ with probability $1/2$, $\mathbb{E}[X^2] = 1$, but $\mathbb{E}[X]^2 = 0$. If $g$ is convex, Jensen tells you which way the difference goes.` },
      { claim: '“The variance of a sum is the sum of the variances.”', fix: String.raw`Only if the variables are uncorrelated. In the extreme case, $\operatorname{Var}(X + X) = \operatorname{Var}(2X) = 4\operatorname{Var}(X)$, not $2\operatorname{Var}(X)$.` },
      { claim: '“The expectation is the value you should expect in one observation.”', fix: 'It may be an impossible value: in the dice game you either win €10 or lose €1, never win €0.83, and the average face of a die is 3.5. The most probable value is the mode.' },
      { claim: '“Every distribution has a mean and a variance.”', fix: String.raw`The Cauchy distribution has no mean, and the average of n observations from it does not converge to anything. A Student t with 2 degrees of freedom has a mean but infinite variance, so the classical central limit theorem (finite variance, $\sqrt{n}$ scaling) does not apply to it: see [[lln-clt]].` },
    ],
    dl: [
      { title: 'Weight initialization.', text: String.raw`For a neuron $y = \sum_{i=1}^{n} w_i x_i$ with independent zero-mean weights that are also independent of the inputs, $\operatorname{Var}(y) = n\,\operatorname{Var}(w)\,\mathbb{E}[x^2]$. To keep activations from growing or dying out layer after layer, one takes $\operatorname{Var}(w) = 1/n$ (LeCun; Glorot averages fan-in and fan-out) or $2/n$ with ReLU (He), because ReLU zeroes the negative part and leaves $\mathbb{E}[x^2]$ at half the variance of its input.` },
      { title: 'Dropout without changing the expectation.', text: String.raw`In inverted dropout, each activation is zeroed with probability $p$ and the survivors are multiplied by $1/(1-p)$. The expectation is then unchanged, $\mathbb{E}[m\,x/(1-p)] = x$ with $m \sim \mathrm{Bernoulli}(1-p)$, and at inference you simply switch dropout off. The variance, however, does increase.` },
      { title: 'Adam estimates moments.', text: 'The Adam optimizer keeps exponential moving averages of the gradient and of its elementwise square: estimates of the first moment and of the uncentered second moment. Each step divides the former by the square root of the latter, so the step size adapts to the scale of each parameter’s gradient.' },
    ],
    quiz: [
      {
        prompt: String.raw`$X$ takes the values 0, 1 or 2 with probabilities 0.5, 0.3 and 0.2. What is $\mathbb{E}[X]$?`,
        options: [{ text: '1' }, { text: '0.7', correct: true }, { text: '1.1' }],
        explain: String.raw`$\mathbb{E}[X] = 0 \cdot 0.5 + 1 \cdot 0.3 + 2 \cdot 0.2 = 0.7$. The value 1 would be the unweighted mean of the values, and 1.1 is $\mathbb{E}[X^2]$.`,
      },
      {
        prompt: String.raw`If $\operatorname{Var}(X) = 4$, what is $\operatorname{Var}(3X + 5)$?`,
        options: [{ text: '17' }, { text: '12' }, { text: '36', correct: true }],
        explain: String.raw`$\operatorname{Var}(aX + b) = a^2 \operatorname{Var}(X) = 9 \cdot 4 = 36$. The shift does not change the spread, and the factor enters squared.`,
      },
      {
        prompt: String.raw`$X$ and $Y$ are independent, each with variance 1. What is $\operatorname{Var}(X - Y)$?`,
        options: [{ text: '0' }, { text: '2', correct: true }, { text: '1' }],
        explain: String.raw`$\operatorname{Var}(X - Y) = \operatorname{Var}(X) + (-1)^2 \operatorname{Var}(Y) = 2$. Variances of independent variables add up even when the variables are subtracted.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§4.3 (expectation of a discrete random variable and of a function of it) and §4.4.1 (expectations of continuous variables).' },
      { book: 'pml1', where: '§2.2.5 (mean, variance, mode and conditional moments, with the laws of total expectation and total variance), §2.2.6 (why a few moments are not enough to describe a dataset) and §13.4.5 (weight initialization from the variance of a sum).' },
    ],
    extra: [
      { text: 'Glorot, X. and Bengio, Y. (2010). Understanding the difficulty of training deep feedforward neural networks. AISTATS 2010, PMLR 9, 249–256.', url: 'https://proceedings.mlr.press/v9/glorot10a.html' },
      { text: 'He, K., Zhang, X., Ren, S. and Sun, J. (2015). Delving deep into rectifiers: surpassing human-level performance on ImageNet classification. ICCV 2015, 1026–1034.', url: 'https://doi.org/10.1109/ICCV.2015.123' },
    ],
  },
};

export default content;
