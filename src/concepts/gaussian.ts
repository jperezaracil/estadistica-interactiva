import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'La distribución normal describe magnitudes que se reparten de forma simétrica alrededor de una media, con colas que caen muy deprisa. Aparece al sumar muchos efectos pequeños e independientes, y está detrás del error cuadrático medio, de la inicialización de los pesos y del ruido de muchos modelos generativos.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Mides muchas veces la misma temperatura con un termómetro digital. Las lecturas se agrupan alrededor de un valor: las desviaciones pequeñas son frecuentes y las grandes, muy raras. Cada lectura acumula muchas perturbaciones pequeñas e independientes (ruido electrónico, corrientes de aire, redondeo), y el [[lln-clt|teorema central del límite]] explica por qué la suma de muchas perturbaciones así tiende a tener forma de campana.' },
          { key: String.raw`Dos parámetros la determinan por completo: la media $\mu$ fija el centro y la desviación típica $\sigma$, la anchura. Cualquier normal es una normal estándar desplazada y escalada: $X = \mu + \sigma Z$, con $Z \sim \mathcal{N}(0, 1)$.` },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { p: String.raw`La densidad de una normal de media $\mu$ y varianza $\sigma^2$ es:` },
          { math: String.raw`\mathcal{N}(x \mid \mu, \sigma^2) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)` },
          { p: String.raw`Solo depende de $x$ a través de la distancia a la media medida en desviaciones típicas, $z = (x-\mu)/\sigma$, y cae como $e^{-z^2/2}$. Por eso se estandariza: si $X \sim \mathcal{N}(\mu, \sigma^2)$, entonces $Z = (X-\mu)/\sigma$ es una normal estándar. Su función de distribución, $\Phi$, no tiene una expresión cerrada y se calcula numéricamente.` },
        ],
      },
      {
        id: 'probabilidades',
        title: 'Cuánta probabilidad hay cerca de la media',
        blocks: [
          {
            table: {
              head: ['Intervalo', 'Probabilidad'],
              rows: [
                [String.raw`$\mu \pm \sigma$`, '68,3 %'],
                [String.raw`$\mu \pm 1{,}96\,\sigma$`, '95,0 %'],
                [String.raw`$\mu \pm 2\sigma$`, '95,4 %'],
                [String.raw`$\mu \pm 3\sigma$`, '99,7 %'],
              ],
              numeric: [1],
            },
          },
          { p: 'Las colas se estrechan muy deprisa: un valor a más de 4 desviaciones típicas de la media aparece una vez de cada 15 800, y uno a más de 5, una vez de cada 1,7 millones.' },
        ],
      },
      {
        id: 'propiedades',
        title: 'Propiedades',
        blocks: [
          {
            list: [
              String.raw`**Transformaciones lineales:** si $X \sim \mathcal{N}(\mu, \sigma^2)$, entonces $aX + b \sim \mathcal{N}(a\mu + b,\ a^2\sigma^2)$.`,
              '**Sumas:** la suma de normales independientes es normal; las medias se suman, y las varianzas también (no las desviaciones típicas).',
              '**Teorema central del límite:** la media de muchas variables independientes con varianza finita, sin que ninguna domine la suma (p. ej., i.i.d.), es aproximadamente normal, aunque cada una de ellas no lo sea: ver [[lln-clt]].',
              String.raw`**Máxima entropía:** entre todas las distribuciones en $\mathbb{R}$ con una media y una varianza dadas, la normal es la de mayor [[entropy|entropía]], es decir, la que menos supuestos añade.`,
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '«La densidad es una probabilidad, así que no puede pasar de 1.»', fix: String.raw`La densidad es probabilidad por unidad de longitud; la probabilidad es el área bajo la curva. Una normal con $\sigma = 0{,}1$ tiene una densidad de 3,99 en su máximo.` },
      { claim: '«Con muchos datos, cualquier variable acaba siendo normal, por el teorema central del límite.»', fix: 'El teorema habla de sumas y medias, no de los datos: la distribución de los ingresos o de los tiempos de espera no cambia por tener más observaciones. Además, exige varianza finita.' },
      { claim: '«Los datos reales tienen colas como las de la normal.»', fix: 'A menudo las tienen más pesadas. Con una normal, alejarse más de 4 desviaciones típicas tiene probabilidad 0,00006; con una Laplace de la misma varianza, 0,0035, unas 55 veces más. Si hay valores atípicos, el error cuadrático, que supone ruido normal, les da demasiado peso; pérdidas como L1 o Huber son más robustas.' },
      { claim: '«Una normal sirve para cualquier magnitud continua.»', fix: 'Asigna probabilidad a todos los valores reales, también a los negativos. Para magnitudes positivas y muy asimétricas, como precipitaciones o tiempos de espera, suele encajar mejor una gamma o una lognormal: ver [[gamma-beta]].' },
    ],
    dl: [
      { title: 'Error cuadrático y regresión.', text: String.raw`Con ruido normal de varianza constante, minimizar el error cuadrático medio equivale a maximizar la verosimilitud. Si la red predice además la varianza $\sigma^2(\mathbf{x})$ (con una softplus o una exponencial para que sea positiva), se minimiza la log-verosimilitud negativa completa, $\log\sigma + (y-\mu)^2/(2\sigma^2)$ más una constante, como hace GaussianNLLLoss en PyTorch: ver [[losses-likelihoods]].` },
      { title: 'Inicialización de pesos.', text: String.raw`Los pesos se inicializan con valores aleatorios de media 0, a menudo normales, y una varianza elegida para que la varianza de las activaciones no crezca ni se apague de capa en capa: $2/n_{\text{in}}$ en la inicialización de He, pensada para ReLU, y $2/(n_{\text{in}} + n_{\text{out}})$ en la de Glorot. Con 512 entradas, la de He usa una desviación típica de 0,0625.` },
      { title: 'Ruido gaussiano en modelos generativos.', text: String.raw`Los VAE muestrean $\mathbf{z} = \boldsymbol{\mu} + \boldsymbol{\sigma} \odot \boldsymbol{\varepsilon}$ con $\boldsymbol{\varepsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$, de modo que el gradiente atraviesa el muestreo (el truco de reparametrización), y los modelos de difusión aprenden a invertir un proceso que añade ruido gaussiano poco a poco: ver [[vae]] y [[mvn]].` },
    ],
    quiz: [
      {
        prompt: 'Una magnitud sigue una normal de media 100 y desviación típica 15. ¿Qué fracción de los valores supera 130?',
        options: [{ text: 'Un 5 %.' }, { text: 'Un 0,3 %.' }, { text: 'Un 2,3 %.', correct: true }],
        explain: String.raw`130 está $z = (130-100)/15 = 2$ desviaciones típicas por encima de la media, y $P(Z > 2) \approx 0{,}023$. El 5 % correspondería a las dos colas más allá de 1,96, y el 0,3 %, a las dos colas más allá de 3.`,
      },
      {
        prompt: String.raw`$X \sim \mathcal{N}(1;\ 4)$ e $Y \sim \mathcal{N}(2;\ 9)$ son independientes (el segundo parámetro es la varianza). ¿Cómo se distribuye $X + Y$?`,
        options: [
          { text: String.raw`$\mathcal{N}(3;\ 13)$`, correct: true },
          { text: String.raw`$\mathcal{N}(3;\ 25)$` },
          { text: String.raw`$\mathcal{N}(1{,}5;\ 6{,}5)$` },
        ],
        explain: String.raw`Las medias se suman, $1 + 2 = 3$, y las varianzas también, $4 + 9 = 13$. Sumar las desviaciones típicas ($2 + 3 = 5$, varianza 25) solo sería correcto si las dos variables estuvieran perfectamente correlacionadas.`,
      },
      {
        prompt: '¿Qué afirma el teorema central del límite?',
        options: [
          { text: 'Que, con suficientes datos, cualquier variable pasa a ser normal.' },
          { text: 'Que la media de muchas variables independientes con varianza finita, sin que ninguna domine la suma (p. ej., i.i.d.), es aproximadamente normal.', correct: true },
          { text: 'Que toda variable continua y simétrica es normal.' },
        ],
        explain: 'Habla de sumas y medias, no de los datos individuales, y necesita varianza finita y que ninguna variable domine la suma, como ocurre con variables i.i.d. La media de variables de Cauchy, por ejemplo, sigue siendo una Cauchy por muchas que se promedien.',
      },
    ],
    further: [
      { book: 'pml1', where: '§2.6.1 y §2.6.2 (función de distribución y densidad), §2.6.3 (regresión con varianza fija o dependiente de la entrada), §2.6.4 (por qué es tan usada) y §2.7.1–§2.7.3 (alternativas con colas pesadas: t de Student, Cauchy y Laplace).' },
      { book: 'wilks', where: '§4.4.2 (distribución gaussiana: estandarización, cálculo de probabilidades y cuantiles, y la normal bivariante).' },
    ],
    extra: [
      { text: 'Glorot, X. y Bengio, Y. (2010). Understanding the difficulty of training deep feedforward neural networks. Proceedings of the 13th International Conference on Artificial Intelligence and Statistics (AISTATS), PMLR 9, 249–256.', url: 'https://proceedings.mlr.press/v9/glorot10a.html' },
      { text: 'He, K., Zhang, X., Ren, S. y Sun, J. (2015). Delving Deep into Rectifiers: Surpassing Human-Level Performance on ImageNet Classification. Proceedings of the IEEE International Conference on Computer Vision (ICCV), 1026–1034.', url: 'https://doi.org/10.1109/ICCV.2015.123' },
    ],
  },
  en: {
    lede: 'The normal distribution describes quantities spread symmetrically around a mean, with tails that fall off very quickly. It appears when many small independent effects add up, and it is behind mean squared error, weight initialization and the noise in many generative models.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'You measure the same temperature many times with a digital thermometer. The readings cluster around a value: small deviations are frequent and large ones very rare. Each reading accumulates many small independent disturbances (electronic noise, air currents, rounding), and the [[lln-clt|central limit theorem]] explains why the sum of many such disturbances tends to be bell-shaped.' },
          { key: String.raw`Two parameters determine it completely: the mean $\mu$ sets the center and the standard deviation $\sigma$ the width. Every normal distribution is a shifted and scaled standard normal: $X = \mu + \sigma Z$, with $Z \sim \mathcal{N}(0, 1)$.` },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { p: String.raw`The density of a normal distribution with mean $\mu$ and variance $\sigma^2$ is:` },
          { math: String.raw`\mathcal{N}(x \mid \mu, \sigma^2) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)` },
          { p: String.raw`It depends on $x$ only through the distance to the mean measured in standard deviations, $z = (x-\mu)/\sigma$, and falls off like $e^{-z^2/2}$. That is why we standardize: if $X \sim \mathcal{N}(\mu, \sigma^2)$, then $Z = (X-\mu)/\sigma$ is a standard normal. Its cumulative distribution function, $\Phi$, has no closed form and is computed numerically.` },
        ],
      },
      {
        id: 'probabilities',
        title: 'How much probability lies near the mean',
        blocks: [
          {
            table: {
              head: ['Interval', 'Probability'],
              rows: [
                [String.raw`$\mu \pm \sigma$`, '68.3%'],
                [String.raw`$\mu \pm 1.96\,\sigma$`, '95.0%'],
                [String.raw`$\mu \pm 2\sigma$`, '95.4%'],
                [String.raw`$\mu \pm 3\sigma$`, '99.7%'],
              ],
              numeric: [1],
            },
          },
          { p: 'The tails thin out very quickly: a value more than 4 standard deviations from the mean occurs once in 15,800 draws, and one more than 5 away, once in 1.7 million.' },
        ],
      },
      {
        id: 'properties',
        title: 'Properties',
        blocks: [
          {
            list: [
              String.raw`**Linear transformations:** if $X \sim \mathcal{N}(\mu, \sigma^2)$, then $aX + b \sim \mathcal{N}(a\mu + b,\ a^2\sigma^2)$.`,
              '**Sums:** the sum of independent normal variables is normal; the means add up, and so do the variances (not the standard deviations).',
              '**Central limit theorem:** the mean of many independent variables with finite variance, none of which dominates the sum (e.g., i.i.d.), is approximately normal, even if each of them is not: see [[lln-clt]].',
              String.raw`**Maximum entropy:** among all distributions on $\mathbb{R}$ with a given mean and variance, the normal has the largest [[entropy|entropy]], that is, it adds the fewest assumptions.`,
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '“A density is a probability, so it cannot exceed 1.”', fix: String.raw`A density is probability per unit length; probability is the area under the curve. A normal distribution with $\sigma = 0.1$ has a density of 3.99 at its peak.` },
      { claim: '“With enough data, any variable ends up normal, because of the central limit theorem.”', fix: 'The theorem is about sums and means, not about the data: the distribution of incomes or of waiting times does not change because you have more observations. It also requires finite variance.' },
      { claim: '“Real data have tails like those of the normal distribution.”', fix: 'They are often heavier. Under a normal distribution, landing more than 4 standard deviations away has probability 0.00006; under a Laplace distribution with the same variance, 0.0035, about 55 times more. With outliers, squared error, which assumes normal noise, gives them too much weight; losses such as L1 or Huber are more robust.' },
      { claim: '“A normal distribution works for any continuous quantity.”', fix: 'It gives probability to every real value, including negative ones. For positive and strongly skewed quantities, such as precipitation or waiting times, a gamma or a lognormal distribution usually fits better: see [[gamma-beta]].' },
    ],
    dl: [
      { title: 'Squared error and regression.', text: String.raw`With normal noise of constant variance, minimizing mean squared error is equivalent to maximizing the likelihood. If the network also predicts the variance $\sigma^2(\mathbf{x})$ (through a softplus or an exponential to keep it positive), you minimize the full negative log-likelihood, $\log\sigma + (y-\mu)^2/(2\sigma^2)$ plus a constant, as GaussianNLLLoss does in PyTorch: see [[losses-likelihoods]].` },
      { title: 'Weight initialization.', text: String.raw`Weights are initialized with random values of mean 0, often normal, and a variance chosen so that the variance of the activations neither grows nor dies out from layer to layer: $2/n_{\text{in}}$ in He initialization, designed for ReLU, and $2/(n_{\text{in}} + n_{\text{out}})$ in Glorot initialization. With 512 inputs, He initialization uses a standard deviation of 0.0625.` },
      { title: 'Gaussian noise in generative models.', text: String.raw`VAEs sample $\mathbf{z} = \boldsymbol{\mu} + \boldsymbol{\sigma} \odot \boldsymbol{\varepsilon}$ with $\boldsymbol{\varepsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$, so that the gradient flows through the sampling step (the reparameterization trick), and diffusion models learn to invert a process that gradually adds Gaussian noise: see [[vae]] and [[mvn]].` },
    ],
    quiz: [
      {
        prompt: 'A quantity follows a normal distribution with mean 100 and standard deviation 15. What fraction of the values exceeds 130?',
        options: [{ text: 'About 5%.' }, { text: 'About 0.3%.' }, { text: 'About 2.3%.', correct: true }],
        explain: String.raw`130 lies $z = (130-100)/15 = 2$ standard deviations above the mean, and $P(Z > 2) \approx 0.023$. 5% would correspond to both tails beyond 1.96, and 0.3% to both tails beyond 3.`,
      },
      {
        prompt: String.raw`$X \sim \mathcal{N}(1, 4)$ and $Y \sim \mathcal{N}(2, 9)$ are independent (the second parameter is the variance). How is $X + Y$ distributed?`,
        options: [
          { text: String.raw`$\mathcal{N}(3, 13)$`, correct: true },
          { text: String.raw`$\mathcal{N}(3, 25)$` },
          { text: String.raw`$\mathcal{N}(1.5, 6.5)$` },
        ],
        explain: String.raw`The means add up, $1 + 2 = 3$, and so do the variances, $4 + 9 = 13$. Adding the standard deviations ($2 + 3 = 5$, variance 25) would only be correct if the two variables were perfectly correlated.`,
      },
      {
        prompt: 'What does the central limit theorem state?',
        options: [
          { text: 'That, with enough data, any variable becomes normal.' },
          { text: 'That the mean of many independent variables with finite variance, none of which dominates the sum (e.g., i.i.d.), is approximately normal.', correct: true },
          { text: 'That every continuous symmetric variable is normal.' },
        ],
        explain: 'It is about sums and means, not about individual data points, and it needs finite variance and no variable dominating the sum, as with i.i.d. variables. The mean of Cauchy variables, for example, is still Cauchy no matter how many you average.',
      },
    ],
    further: [
      { book: 'pml1', where: '§2.6.1 and §2.6.2 (cumulative distribution function and density), §2.6.3 (regression with fixed or input-dependent variance), §2.6.4 (why it is so widely used) and §2.7.1–§2.7.3 (heavy-tailed alternatives: Student t, Cauchy and Laplace).' },
      { book: 'wilks', where: '§4.4.2 (Gaussian distribution: standardization, computing probabilities and quantiles, and the bivariate normal).' },
    ],
    extra: [
      { text: 'Glorot, X. and Bengio, Y. (2010). Understanding the difficulty of training deep feedforward neural networks. Proceedings of the 13th International Conference on Artificial Intelligence and Statistics (AISTATS), PMLR 9, 249–256.', url: 'https://proceedings.mlr.press/v9/glorot10a.html' },
      { text: 'He, K., Zhang, X., Ren, S. and Sun, J. (2015). Delving Deep into Rectifiers: Surpassing Human-Level Performance on ImageNet Classification. Proceedings of the IEEE International Conference on Computer Vision (ICCV), 1026–1034.', url: 'https://doi.org/10.1109/ICCV.2015.123' },
    ],
  },
};

export default content;
