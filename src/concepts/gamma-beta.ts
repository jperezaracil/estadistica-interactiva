import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Tres familias continuas para variables con un rango restringido: la exponencial y la gamma, para magnitudes positivas como tiempos de espera o cantidades de lluvia, y la beta, para proporciones y probabilidades entre 0 y 1.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Un servidor recibe de media 4 peticiones por segundo, según un proceso de [[poisson|Poisson]]. Si en vez de contar peticiones mides cuánto tardan en llegar, el tiempo hasta la siguiente es exponencial, con media 1/4 de segundo, y el tiempo hasta la tercera, que es la suma de tres esperas así, sigue una gamma. Otra situación: tras ver 7 clics en 20 impresiones de un anuncio, tu incertidumbre sobre su tasa de clics, un número entre 0 y 1, se describe bien con una beta.` },
          { key: String.raw`La exponencial es una gamma de forma 1, y una gamma de forma entera $\alpha$ es la suma de $\alpha$ exponenciales independientes con la misma tasa. La beta vive en $[0, 1]$ y es la distribución natural para una probabilidad desconocida.` },
        ],
      },
      {
        id: 'exponencial-gamma',
        title: 'Exponencial y gamma',
        blocks: [
          { p: String.raw`La **exponencial** de tasa $\lambda > 0$ tiene densidad $p(x) = \lambda e^{-\lambda x}$ para $x \ge 0$, media $1/\lambda$ y varianza $1/\lambda^2$. Es la única distribución continua sin memoria: $P(X > s + t \mid X > s) = P(X > t)$, así que lo que ya has esperado no cambia lo que te queda. La **gamma** de forma $\alpha > 0$ y tasa $\beta > 0$ la generaliza:` },
          { math: String.raw`p(x) = \frac{\beta^{\alpha}}{\Gamma(\alpha)}\, x^{\alpha-1} e^{-\beta x}, \quad x > 0, \qquad \mathbb{E}[X] = \frac{\alpha}{\beta}, \qquad \operatorname{Var}(X) = \frac{\alpha}{\beta^2}` },
          { p: String.raw`Con $\alpha = 1$ es la exponencial, y con $\alpha = \nu/2$ y $\beta = 1/2$, la $\chi^2$ con $\nu$ grados de libertad. Es asimétrica a la derecha: con $\alpha \le 1$ su moda está en 0, y con $\alpha > 1$, en $(\alpha - 1)/\beta$, siempre por debajo de la media.` },
          { p: String.raw`En el servidor, la probabilidad de esperar más de medio segundo a la siguiente petición es $e^{-4 \cdot 0{,}5} = e^{-2} \approx 0{,}135$, y sigue siéndolo aunque ya lleves medio segundo esperando. El tiempo hasta la tercera petición es una gamma con $\alpha = 3$ y $\beta = 4$: su media es 0,75 s y supera 1 s con probabilidad 0,238, la misma con la que llegan como mucho 2 peticiones en un segundo.` },
        ],
      },
      {
        id: 'beta',
        title: 'Beta',
        blocks: [
          { p: String.raw`La **beta** de parámetros $a, b > 0$ está definida en $[0, 1]$:` },
          { math: String.raw`p(x) = \frac{x^{a-1}(1-x)^{b-1}}{B(a, b)}, \qquad \mathbb{E}[X] = \frac{a}{a+b}, \qquad \operatorname{Var}(X) = \frac{ab}{(a+b)^2(a+b+1)}` },
          { p: String.raw`$B(a, b)$ es la constante que hace que la densidad integre 1. Con $a = b = 1$ es la uniforme; con $a, b > 1$ tiene una sola moda, en $(a-1)/(a+b-2)$; con $a, b < 1$ tiene forma de U, con la masa cerca de 0 y de 1. Para una media dada, cuanto mayor es $a + b$, más concentrada está.` },
          { p: String.raw`Si antes de ver datos consideras igual de plausible cualquier tasa de clics, una $\text{Beta}(1, 1)$, tras 7 clics en 20 impresiones tu incertidumbre pasa a ser una $\text{Beta}(8, 14)$: media 0,364 y un 95 % de probabilidad entre 0,18 y 0,57. Con 70 clics en 200 sería una $\text{Beta}(71, 131)$, con el 95 % entre 0,29 y 0,42. Este paso de una beta a otra es el ejemplo clásico de [[conjugate-priors|prior conjugado]].` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Todas las librerías parametrizan la gamma igual.»', fix: String.raw`Unas usan la tasa $\beta$ y otras la escala $\theta = 1/\beta$. SciPy y NumPy usan la escala (en SciPy hay que pasarla como scale, porque su segundo argumento posicional es un desplazamiento), y PyTorch, la tasa. Una gamma de forma 3 y tasa 2 tiene media 1,5 y varianza 0,75; si pasas el 2 como escala, obtienes media 6 y varianza 12.` },
      { claim: '«Si llevo mucho rato esperando, el siguiente suceso tiene que estar al caer.»', fix: 'Con llegadas de Poisson, la espera es exponencial y no tiene memoria: el tiempo que te queda tiene la misma distribución que al principio. Eso solo vale si la tasa es constante; la vida útil de una pieza que se desgasta, por ejemplo, no es exponencial.' },
      { claim: '«La media de una gamma es su valor más probable.»', fix: 'Es asimétrica a la derecha: su moda queda por debajo de la mediana, y esta, por debajo de la media. Con forma 2 y tasa 1, la moda es 1, la mediana 1,68 y la media 2.' },
      { claim: String.raw`«Una beta con $a = b$ es siempre una campana centrada en 0,5.»`, fix: String.raw`Es simétrica, pero con $a = b < 1$ tiene forma de U, con la masa cerca de 0 y de 1; con $a = b = 1$ es plana, y solo con $a = b > 1$ tiene un máximo en 0,5.` },
    ],
    dl: [
      { title: 'Mixup.', text: String.raw`Esta técnica de aumento de datos entrena con combinaciones de pares de ejemplos y de sus etiquetas, $\lambda \mathbf{x}_i + (1-\lambda)\mathbf{x}_j$, con $\lambda \sim \text{Beta}(\alpha, \alpha)$. Con $\alpha$ pequeño, la beta tiene forma de U y la mayoría de las mezclas se parecen a uno de los dos ejemplos: con $\alpha = 0{,}2$, $\lambda$ cae fuera de $[0{,}1;\ 0{,}9]$ el 67 % de las veces.` },
      { title: 'Salidas positivas o acotadas.', text: 'Si el objetivo es positivo y asimétrico (la cantidad de lluvia de un día lluvioso, el tiempo hasta un evento), la red puede predecir los dos parámetros de una gamma, pasados por una softplus para que sean positivos, y minimizar su log-verosimilitud negativa; si es una proporción, los de una beta. Así se obtiene una distribución predictiva completa, no solo un valor: ver [[losses-likelihoods]].' },
    ],
    quiz: [
      {
        prompt: 'Un autobús pasa según un proceso de Poisson, de media uno cada 10 minutos. Llevas 15 minutos esperando. ¿Cuánto te queda de media?',
        options: [
          { text: '10 minutos.', correct: true },
          { text: 'Menos de 10, porque ya has esperado más que la media.' },
          { text: 'Más de 10, porque este autobús va con retraso.' },
        ],
        explain: String.raw`La espera es exponencial y no tiene memoria: $P(T > 15 + t \mid T > 15) = P(T > t)$, así que el tiempo restante tiene la misma media, 10 minutos.`,
      },
      {
        prompt: String.raw`Con la tasa como segundo parámetro, $X \sim \text{Gamma}(3, 2)$. ¿Cuáles son su media y su varianza?`,
        options: [{ text: '6 y 12.' }, { text: '1,5 y 0,75.', correct: true }, { text: '1,5 y 1,5.' }],
        explain: String.raw`Media $\alpha/\beta = 3/2 = 1{,}5$ y varianza $\alpha/\beta^2 = 3/4 = 0{,}75$. 6 y 12 serían la media y la varianza si el 2 fuera la escala.`,
      },
      {
        prompt: '¿Qué distribución usarías para la fracción de un campo afectada por una plaga, un número entre 0 y 1?',
        options: [{ text: 'Exponencial.' }, { text: 'Normal.' }, { text: 'Beta.', correct: true }],
        explain: String.raw`La beta está definida en $[0, 1]$ y, con sus dos parámetros, puede adoptar formas muy distintas. La exponencial no está acotada por arriba y la normal puede dar valores negativos o mayores que 1.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§2.7.4 (beta: formas según sus parámetros, media, moda y varianza) y §2.7.5 (gamma, con la exponencial, la χ² y la gamma inversa como casos relacionados).' },
      { book: 'wilks', where: '§4.4.5 (gamma, con la exponencial y la χ² como casos particulares, y su ajuste a datos de precipitación) y §4.4.6 (beta).' },
      { book: 'pml2', where: String.raw`§2.2.3 (distribuciones en $\mathbb{R}^+$: gamma, exponencial, χ², gamma inversa y Pareto) y §2.2.4 (beta).` },
    ],
    extra: [
      { text: 'Zhang, H., Cisse, M., Dauphin, Y. N. y Lopez-Paz, D. (2018). mixup: Beyond Empirical Risk Minimization. International Conference on Learning Representations (ICLR).', url: 'https://arxiv.org/abs/1710.09412' },
    ],
  },
  en: {
    lede: 'Three continuous families for variables with a restricted range: the exponential and gamma distributions, for positive quantities such as waiting times or rainfall amounts, and the beta distribution, for proportions and probabilities between 0 and 1.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`A server receives on average 4 requests per second, following a [[poisson|Poisson]] process. If instead of counting requests you measure how long they take to arrive, the time until the next one is exponential, with mean 1/4 of a second, and the time until the third one, which is the sum of three such waits, follows a gamma distribution. Another situation: after seeing 7 clicks in 20 impressions of an ad, your uncertainty about its click-through rate, a number between 0 and 1, is well described by a beta distribution.` },
          { key: String.raw`The exponential is a gamma distribution with shape 1, and a gamma with integer shape $\alpha$ is the sum of $\alpha$ independent exponentials with the same rate. The beta lives on $[0, 1]$ and is the natural distribution for an unknown probability.` },
        ],
      },
      {
        id: 'exponential-gamma',
        title: 'Exponential and gamma',
        blocks: [
          { p: String.raw`The **exponential** distribution with rate $\lambda > 0$ has density $p(x) = \lambda e^{-\lambda x}$ for $x \ge 0$, mean $1/\lambda$ and variance $1/\lambda^2$. It is the only memoryless continuous distribution: $P(X > s + t \mid X > s) = P(X > t)$, so the time you have already waited does not change what is left. The **gamma** distribution with shape $\alpha > 0$ and rate $\beta > 0$ generalizes it:` },
          { math: String.raw`p(x) = \frac{\beta^{\alpha}}{\Gamma(\alpha)}\, x^{\alpha-1} e^{-\beta x}, \quad x > 0, \qquad \mathbb{E}[X] = \frac{\alpha}{\beta}, \qquad \operatorname{Var}(X) = \frac{\alpha}{\beta^2}` },
          { p: String.raw`With $\alpha = 1$ it is the exponential, and with $\alpha = \nu/2$ and $\beta = 1/2$, the $\chi^2$ distribution with $\nu$ degrees of freedom. It is right-skewed: with $\alpha \le 1$ its mode is at 0, and with $\alpha > 1$, at $(\alpha - 1)/\beta$, always below the mean.` },
          { p: String.raw`For the server, the probability of waiting more than half a second for the next request is $e^{-4 \cdot 0.5} = e^{-2} \approx 0.135$, and it stays the same even if you have already waited half a second. The time until the third request is a gamma with $\alpha = 3$ and $\beta = 4$: its mean is 0.75 s and it exceeds 1 s with probability 0.238, the same probability with which at most 2 requests arrive in one second.` },
        ],
      },
      {
        id: 'beta',
        title: 'Beta',
        blocks: [
          { p: String.raw`The **beta** distribution with parameters $a, b > 0$ is defined on $[0, 1]$:` },
          { math: String.raw`p(x) = \frac{x^{a-1}(1-x)^{b-1}}{B(a, b)}, \qquad \mathbb{E}[X] = \frac{a}{a+b}, \qquad \operatorname{Var}(X) = \frac{ab}{(a+b)^2(a+b+1)}` },
          { p: String.raw`$B(a, b)$ is the constant that makes the density integrate to 1. With $a = b = 1$ it is the uniform distribution; with $a, b > 1$ it has a single mode, at $(a-1)/(a+b-2)$; with $a, b < 1$ it is U-shaped, with its mass near 0 and 1. For a given mean, the larger $a + b$, the more concentrated it is.` },
          { p: String.raw`If before seeing any data you find every click-through rate equally plausible, a $\text{Beta}(1, 1)$, then after 7 clicks in 20 impressions your uncertainty becomes a $\text{Beta}(8, 14)$: mean 0.364 and a 95% probability between 0.18 and 0.57. With 70 clicks in 200 it would be a $\text{Beta}(71, 131)$, with 95% between 0.29 and 0.42. This update from one beta to another is the classic example of a [[conjugate-priors|conjugate prior]].` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“Every library parameterizes the gamma distribution the same way.”', fix: String.raw`Some use the rate $\beta$ and others the scale $\theta = 1/\beta$. SciPy and NumPy use the scale (in SciPy it must be passed as scale, because its second positional argument is a shift), and PyTorch uses the rate. A gamma with shape 3 and rate 2 has mean 1.5 and variance 0.75; if you pass the 2 as the scale, you get mean 6 and variance 12.` },
      { claim: '“If I have been waiting for a long time, the next event must be about to happen.”', fix: 'With Poisson arrivals, the waiting time is exponential and memoryless: the time left has the same distribution as at the start. That only holds if the rate is constant; the lifetime of a part that wears out, for example, is not exponential.' },
      { claim: '“The mean of a gamma distribution is its most probable value.”', fix: 'It is right-skewed: its mode lies below the median, and the median below the mean. With shape 2 and rate 1, the mode is 1, the median 1.68 and the mean 2.' },
      { claim: String.raw`“A beta distribution with $a = b$ is always a bell centered at 0.5.”`, fix: String.raw`It is symmetric, but with $a = b < 1$ it is U-shaped, with its mass near 0 and 1; with $a = b = 1$ it is flat, and only with $a = b > 1$ does it have a peak at 0.5.` },
    ],
    dl: [
      { title: 'Mixup.', text: String.raw`This data augmentation technique trains on combinations of pairs of examples and of their labels, $\lambda \mathbf{x}_i + (1-\lambda)\mathbf{x}_j$, with $\lambda \sim \text{Beta}(\alpha, \alpha)$. With small $\alpha$, the beta is U-shaped and most mixtures look like one of the two examples: with $\alpha = 0.2$, $\lambda$ falls outside $[0.1, 0.9]$ 67% of the time.` },
      { title: 'Positive or bounded outputs.', text: 'If the target is positive and skewed (the rainfall amount on a rainy day, the time until an event), the network can predict the two parameters of a gamma distribution, passed through a softplus to keep them positive, and minimize its negative log-likelihood; if it is a proportion, those of a beta distribution. This gives a full predictive distribution, not just a single value: see [[losses-likelihoods]].' },
    ],
    quiz: [
      {
        prompt: 'A bus arrives according to a Poisson process, on average once every 10 minutes. You have been waiting for 15 minutes. How long is left, on average?',
        options: [
          { text: '10 minutes.', correct: true },
          { text: 'Less than 10, because you have already waited longer than the mean.' },
          { text: 'More than 10, because this bus is running late.' },
        ],
        explain: String.raw`The waiting time is exponential and memoryless: $P(T > 15 + t \mid T > 15) = P(T > t)$, so the remaining time has the same mean, 10 minutes.`,
      },
      {
        prompt: String.raw`With the rate as the second parameter, $X \sim \text{Gamma}(3, 2)$. What are its mean and variance?`,
        options: [{ text: '6 and 12.' }, { text: '1.5 and 0.75.', correct: true }, { text: '1.5 and 1.5.' }],
        explain: String.raw`Mean $\alpha/\beta = 3/2 = 1.5$ and variance $\alpha/\beta^2 = 3/4 = 0.75$. 6 and 12 would be the mean and variance if the 2 were the scale.`,
      },
      {
        prompt: 'Which distribution would you use for the fraction of a field affected by a pest, a number between 0 and 1?',
        options: [{ text: 'Exponential.' }, { text: 'Normal.' }, { text: 'Beta.', correct: true }],
        explain: String.raw`The beta distribution is defined on $[0, 1]$ and, with its two parameters, can take very different shapes. The exponential is unbounded above and the normal can give negative values or values above 1.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§2.7.4 (beta: shapes depending on its parameters, mean, mode and variance) and §2.7.5 (gamma, with the exponential, the χ² and the inverse gamma as related cases).' },
      { book: 'wilks', where: '§4.4.5 (gamma, with the exponential and the χ² as special cases, and fitting it to precipitation data) and §4.4.6 (beta).' },
      { book: 'pml2', where: String.raw`§2.2.3 (distributions on $\mathbb{R}^+$: gamma, exponential, χ², inverse gamma and Pareto) and §2.2.4 (beta).` },
    ],
    extra: [
      { text: 'Zhang, H., Cisse, M., Dauphin, Y. N. and Lopez-Paz, D. (2018). mixup: Beyond Empirical Risk Minimization. International Conference on Learning Representations (ICLR).', url: 'https://arxiv.org/abs/1710.09412' },
    ],
  },
};

export default content;
