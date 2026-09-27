import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Una variable aleatoria asigna un número a cada resultado de un experimento. Su distribución se describe con la función de masa (PMF) si es discreta, con la densidad (PDF) si es continua y, en los dos casos, con la función de distribución (CDF).',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Si lanzas un dado, $X$ = «el número que sale» toma seis valores, cada uno con probabilidad $1/6$; esa lista de probabilidades es su **función de masa**. Si llegas a la parada a una hora al azar y el autobús pasa cada 10 minutos, tu espera $Y$ puede ser cualquier número entre 0 y 10, y la probabilidad de esperar exactamente 3 minutos es 0. Lo que tiene sentido es la probabilidad de un intervalo, como $P(Y \le 3) = 0{,}3$, y para eso sirve una **densidad**: la probabilidad de un intervalo es el área bajo ella.` },
          { key: String.raw`Una variable discreta concentra la probabilidad en puntos; una continua la extiende como una densidad, y solo los intervalos tienen probabilidad positiva. La CDF, $F(x) = P(X \le x)$, sirve para las dos.` },
        ],
      },
      {
        id: 'definicion',
        title: 'PMF, PDF y CDF',
        blocks: [
          { p: String.raw`Formalmente, una variable aleatoria es una función $X: \Omega \to \mathbb{R}$, y la probabilidad de que tome valores en un conjunto $B$ es la del suceso formado por los resultados que llevan a él: $P(X \in B) = P(\{\omega : X(\omega) \in B\})$. Su distribución se puede describir de tres formas:` },
          {
            list: [
              String.raw`**PMF** (discreta): $p(x) = P(X = x)$, con $p(x) \ge 0$ y $\sum_x p(x) = 1$.`,
              String.raw`**PDF** (continua): una función $f(x) \ge 0$ con $\int_{-\infty}^{\infty} f(x)\,dx = 1$ que da probabilidades al integrarla.`,
              String.raw`**CDF** (cualquiera): $F(x) = P(X \le x)$. Es no decreciente, va de 0 a 1 y es continua por la derecha; en una variable discreta es una escalera con saltos de altura $p(x)$.`,
            ],
          },
          { math: String.raw`P(a < X \le b) = F(b) - F(a) = \int_a^b f(x)\,dx` },
          { p: String.raw`Es decir, la CDF es el área acumulada bajo la densidad, y la densidad es la derivada de la CDF, $f = F'$, allí donde esta es derivable.` },
        ],
      },
      {
        id: 'discreta-continua',
        title: 'Discreta frente a continua',
        blocks: [
          {
            table: {
              head: ['Propiedad', 'Discreta', 'Continua'],
              rows: [
                ['Se describe con', String.raw`PMF, $p(x) = P(X = x)$`, String.raw`PDF, $f(x)$`],
                ['Normalización', String.raw`$\sum_x p(x) = 1$`, String.raw`$\int f(x)\,dx = 1$`],
                [String.raw`$P(X = x)$`, String.raw`$p(x)$`, '0'],
                [String.raw`$P(X \le x)$`, String.raw`$\sum_{t \le x} p(t)$`, String.raw`$\int_{-\infty}^{x} f(t)\,dt$`],
                ['¿Puede valer más de 1?', 'No', 'Sí: es una densidad, no una probabilidad'],
              ],
            },
          },
          { p: String.raw`Una densidad puede superar 1 porque lo que tiene que valer 1 es su área: la uniforme en $[0;\ 0{,}5]$ tiene densidad 2. Hay además variables **mixtas**, como la lluvia diaria, que vale exactamente 0 con probabilidad positiva y se reparte de forma continua entre los valores positivos. No se describen bien ni con una PMF ni con una PDF, pero sí con su CDF, que da un salto en 0.` },
        ],
      },
      {
        id: 'cuantiles',
        title: 'Cuantiles',
        blocks: [
          { p: String.raw`La inversa de la CDF da los **cuantiles**: el cuantil $q$ es el menor valor $x_q$ con $F(x_q) \ge q$; si $F$ es continua y creciente, es simplemente el que cumple $F(x_q) = q$. La mediana es $x_{0{,}5}$.` },
          { p: String.raw`Ejemplo: si el tiempo hasta la siguiente petición a un servidor es exponencial con media 10 ms, su CDF es $F(x) = 1 - e^{-x/10}$. Entonces $P(X \le 5) = 1 - e^{-0{,}5} \approx 0{,}393$, la mediana es $10 \ln 2 \approx 6{,}93$ ms y el cuantil 0,9 es $10 \ln 10 \approx 23{,}03$ ms. La mediana queda por debajo de la media porque la distribución tiene una cola larga a la derecha.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Una densidad no puede valer más de 1.»', fix: 'No es una probabilidad; solo sus áreas lo son. Una normal con desviación típica 0,1 alcanza una densidad de 3,99 en su centro.' },
      { claim: String.raw`«Si $X$ es continua, $P(X = x) = f(x)$.»`, fix: String.raw`Para una variable continua, $P(X = x) = 0$ para todo $x$. El producto $f(x)\,\Delta x$ aproxima la probabilidad de un intervalo pequeño $[x, x + \Delta x]$.` },
      { claim: '«La CDF solo tiene sentido para variables continuas.»', fix: 'Está definida para cualquier variable: en una discreta es una escalera, y es la única de las tres descripciones que funciona para variables mixtas, como la lluvia diaria.' },
      { claim: '«La mediana es el valor más probable.»', fix: 'El valor de mayor probabilidad o densidad es la moda. En el tiempo entre peticiones, la moda es 0, la mediana 6,93 ms y la media 10 ms: en una distribución asimétrica no coinciden.' },
    ],
    dl: [
      { title: 'Salidas que son distribuciones.', text: 'La softmax de un clasificador es una PMF sobre las clases. Una red de regresión puede dar los parámetros de una densidad, por ejemplo la media y la varianza de una normal, y entrenarse con su log-verosimilitud negativa. Como las densidades pueden superar 1, esa pérdida puede salir negativa sin que nada vaya mal: ver [[losses-likelihoods]].' },
      { title: 'La CDF normal dentro de GELU.', text: String.raw`La activación GELU, habitual en transformers como BERT o GPT, es $x\,\Phi(x)$, donde $\Phi$ es la CDF de la normal estándar: cada entrada se multiplica por la probabilidad de que una $\mathcal{N}(0, 1)$ quede por debajo de ella. Así, $\mathrm{GELU}(1) \approx 0{,}841$ y $\mathrm{GELU}(-1) \approx -0{,}159$.` },
      { title: 'Muestrear con la CDF.', text: String.raw`Para generar un token con un modelo de lenguaje basta un número $U$ uniforme en $(0, 1)$: se elige la primera clase cuya probabilidad acumulada supera $U$. Es el método de la inversa de la CDF, un caso de [[transformations|transformación de variables]].` },
    ],
    quiz: [
      {
        prompt: String.raw`$X$ es uniforme en $[0;\ 0{,}25]$. ¿Cuánto vale su densidad en $x = 0{,}1$?`,
        options: [{ text: '0,1' }, { text: '0,25' }, { text: '4', correct: true }],
        explain: String.raw`La densidad es constante e igual a $1/0{,}25 = 4$, para que el área total sea 1. Que supere 1 no es un problema: no es una probabilidad.`,
      },
      {
        prompt: 'El tiempo hasta la siguiente petición es exponencial con media 10 ms. ¿Qué probabilidad hay de esperar más de 20 ms?',
        options: [{ text: '0,135', correct: true }, { text: '0,5' }, { text: '0,865' }],
        explain: String.raw`$P(X > 20) = 1 - F(20) = e^{-20/10} = e^{-2} \approx 0{,}135$. El valor 0,865 es $F(20)$, la probabilidad de esperar como mucho 20 ms.`,
      },
      {
        prompt: String.raw`Para una variable continua con densidad $f$, ¿qué afirmación es correcta?`,
        options: [
          { text: String.raw`$P(X = x) = f(x)$.` },
          { text: String.raw`$P(X = x) = 0$ para todo $x$, aunque $f(x) > 0$.`, correct: true },
          { text: String.raw`$f(x) \le 1$ para todo $x$.` },
        ],
        explain: 'Un punto no tiene área, así que su probabilidad es 0. La densidad solo da probabilidades al integrarla sobre intervalos, y puede valer más de 1.',
      },
    ],
    further: [
      { book: 'wilks', where: '§4.1.4 (distribuciones discretas frente a continuas) y §4.4.1 (PDF, CDF y función cuantil de una variable continua).' },
      { book: 'pml1', where: '§2.2.1 (variables discretas y PMF) y §2.2.2 (variables continuas: CDF, PDF y cuantiles).' },
      { book: 'pml2', where: '§2.1.2–2.1.3 (la variable aleatoria como función sobre el espacio muestral; PMF, PDF y CDF).' },
    ],
    extra: [
      { text: String.raw`Hendrycks, D. y Gimpel, K. (2016). Gaussian Error Linear Units (GELUs). Preprint en arXiv. Propone la activación $x\,\Phi(x)$.`, url: 'https://arxiv.org/abs/1606.08415' },
    ],
  },
  en: {
    lede: 'A random variable assigns a number to each outcome of an experiment. Its distribution is described by the probability mass function (PMF) if it is discrete, by the density (PDF) if it is continuous and, in both cases, by the cumulative distribution function (CDF).',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`If you roll a die, $X$ = “the number that comes up” takes six values, each with probability $1/6$; that list of probabilities is its **mass function**. If you arrive at the bus stop at a random time and the bus comes every 10 minutes, your wait $Y$ can be any number between 0 and 10, and the probability of waiting exactly 3 minutes is 0. What makes sense is the probability of an interval, such as $P(Y \le 3) = 0.3$, and that is what a **density** is for: the probability of an interval is the area under it.` },
          { key: String.raw`A discrete variable concentrates probability on points; a continuous one spreads it out as a density, and only intervals have positive probability. The CDF, $F(x) = P(X \le x)$, works for both.` },
        ],
      },
      {
        id: 'definition',
        title: 'PMF, PDF and CDF',
        blocks: [
          { p: String.raw`Formally, a random variable is a function $X: \Omega \to \mathbb{R}$, and the probability that it takes values in a set $B$ is that of the event made of the outcomes that lead there: $P(X \in B) = P(\{\omega : X(\omega) \in B\})$. Its distribution can be described in three ways:` },
          {
            list: [
              String.raw`**PMF** (discrete): $p(x) = P(X = x)$, with $p(x) \ge 0$ and $\sum_x p(x) = 1$.`,
              String.raw`**PDF** (continuous): a function $f(x) \ge 0$ with $\int_{-\infty}^{\infty} f(x)\,dx = 1$ that gives probabilities when integrated.`,
              String.raw`**CDF** (any variable): $F(x) = P(X \le x)$. It is non-decreasing, goes from 0 to 1 and is right-continuous; for a discrete variable it is a staircase with jumps of height $p(x)$.`,
            ],
          },
          { math: String.raw`P(a < X \le b) = F(b) - F(a) = \int_a^b f(x)\,dx` },
          { p: String.raw`That is, the CDF is the accumulated area under the density, and the density is the derivative of the CDF, $f = F'$, wherever the latter is differentiable.` },
        ],
      },
      {
        id: 'discrete-continuous',
        title: 'Discrete versus continuous',
        blocks: [
          {
            table: {
              head: ['Property', 'Discrete', 'Continuous'],
              rows: [
                ['Described by', String.raw`PMF, $p(x) = P(X = x)$`, String.raw`PDF, $f(x)$`],
                ['Normalization', String.raw`$\sum_x p(x) = 1$`, String.raw`$\int f(x)\,dx = 1$`],
                [String.raw`$P(X = x)$`, String.raw`$p(x)$`, '0'],
                [String.raw`$P(X \le x)$`, String.raw`$\sum_{t \le x} p(t)$`, String.raw`$\int_{-\infty}^{x} f(t)\,dt$`],
                ['Can it exceed 1?', 'No', 'Yes: it is a density, not a probability'],
              ],
            },
          },
          { p: String.raw`A density can exceed 1 because what must equal 1 is its area: the uniform on $[0, 0.5]$ has density 2. There are also **mixed** variables, such as daily rainfall, which is exactly 0 with positive probability and spreads continuously over the positive values. They are not well described by a PMF or by a PDF, but they are by their CDF, which jumps at 0.` },
        ],
      },
      {
        id: 'quantiles',
        title: 'Quantiles',
        blocks: [
          { p: String.raw`The inverse of the CDF gives the **quantiles**: the $q$ quantile is the smallest value $x_q$ with $F(x_q) \ge q$; if $F$ is continuous and increasing, it is simply the one satisfying $F(x_q) = q$. The median is $x_{0.5}$.` },
          { p: String.raw`Example: if the time until the next request to a server is exponential with mean 10 ms, its CDF is $F(x) = 1 - e^{-x/10}$. Then $P(X \le 5) = 1 - e^{-0.5} \approx 0.393$, the median is $10 \ln 2 \approx 6.93$ ms and the 0.9 quantile is $10 \ln 10 \approx 23.03$ ms. The median lies below the mean because the distribution has a long right tail.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“A density cannot be greater than 1.”', fix: 'It is not a probability; only its areas are. A normal with standard deviation 0.1 reaches a density of 3.99 at its center.' },
      { claim: String.raw`“If $X$ is continuous, $P(X = x) = f(x)$.”`, fix: String.raw`For a continuous variable, $P(X = x) = 0$ for every $x$. The product $f(x)\,\Delta x$ approximates the probability of a small interval $[x, x + \Delta x]$.` },
      { claim: '“The CDF only makes sense for continuous variables.”', fix: 'It is defined for any variable: for a discrete one it is a staircase, and it is the only one of the three descriptions that works for mixed variables, such as daily rainfall.' },
      { claim: '“The median is the most probable value.”', fix: 'The value with the highest probability or density is the mode. For the time between requests, the mode is 0, the median 6.93 ms and the mean 10 ms: in a skewed distribution they do not coincide.' },
    ],
    dl: [
      { title: 'Outputs that are distributions.', text: 'The softmax of a classifier is a PMF over the classes. A regression network can output the parameters of a density, for example the mean and variance of a normal, and be trained with its negative log-likelihood. Since densities can exceed 1, that loss can become negative without anything being wrong: see [[losses-likelihoods]].' },
      { title: 'The normal CDF inside GELU.', text: String.raw`The GELU activation, common in transformers such as BERT or GPT, is $x\,\Phi(x)$, where $\Phi$ is the CDF of the standard normal: each input is multiplied by the probability that an $\mathcal{N}(0, 1)$ falls below it. Thus $\mathrm{GELU}(1) \approx 0.841$ and $\mathrm{GELU}(-1) \approx -0.159$.` },
      { title: 'Sampling with the CDF.', text: String.raw`To generate a token with a language model, a single number $U$ uniform on $(0, 1)$ is enough: you pick the first class whose cumulative probability exceeds $U$. This is the inverse-CDF method, a case of [[transformations|transformation of variables]].` },
    ],
    quiz: [
      {
        prompt: String.raw`$X$ is uniform on $[0, 0.25]$. What is its density at $x = 0.1$?`,
        options: [{ text: '0.1' }, { text: '0.25' }, { text: '4', correct: true }],
        explain: String.raw`The density is constant and equal to $1/0.25 = 4$, so that the total area is 1. Exceeding 1 is not a problem: it is not a probability.`,
      },
      {
        prompt: 'The time until the next request is exponential with mean 10 ms. What is the probability of waiting more than 20 ms?',
        options: [{ text: '0.135', correct: true }, { text: '0.5' }, { text: '0.865' }],
        explain: String.raw`$P(X > 20) = 1 - F(20) = e^{-20/10} = e^{-2} \approx 0.135$. The value 0.865 is $F(20)$, the probability of waiting at most 20 ms.`,
      },
      {
        prompt: String.raw`For a continuous variable with density $f$, which statement is correct?`,
        options: [
          { text: String.raw`$P(X = x) = f(x)$.` },
          { text: String.raw`$P(X = x) = 0$ for every $x$, even though $f(x) > 0$.`, correct: true },
          { text: String.raw`$f(x) \le 1$ for every $x$.` },
        ],
        explain: 'A point has no area, so its probability is 0. The density only gives probabilities when integrated over intervals, and it can exceed 1.',
      },
    ],
    further: [
      { book: 'wilks', where: '§4.1.4 (discrete versus continuous distributions) and §4.4.1 (PDF, CDF and quantile function of a continuous variable).' },
      { book: 'pml1', where: '§2.2.1 (discrete variables and the PMF) and §2.2.2 (continuous variables: CDF, PDF and quantiles).' },
      { book: 'pml2', where: '§2.1.2–2.1.3 (the random variable as a function on the sample space; PMF, PDF and CDF).' },
    ],
    extra: [
      { text: String.raw`Hendrycks, D. and Gimpel, K. (2016). Gaussian Error Linear Units (GELUs). arXiv preprint. Introduces the activation $x\,\Phi(x)$.`, url: 'https://arxiv.org/abs/1606.08415' },
    ],
  },
};

export default content;
