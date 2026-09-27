import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: String.raw`La ley de los grandes números dice que la media de muchas observaciones independientes se acerca a la esperanza; el teorema central del límite, que sus fluctuaciones alrededor de ella son aproximadamente normales, con una anchura que decrece como $1/\sqrt{n}$. Juntos explican por qué funcionan los promedios, los intervalos de confianza y el método de Monte Carlo.`,
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Lanza una moneda equilibrada 10 veces y la proporción de caras puede salir 0,3 o menos, o 0,7 o más, sin que pase nada raro: ocurre un 34 % de las veces. Lánzala 10 000 veces y la proporción caerá entre 0,49 y 0,51 con probabilidad 0,96. La **ley de los grandes números** dice que la media se estabiliza en la esperanza; el **teorema central del límite** describe las fluctuaciones que quedan: son aproximadamente normales y cada vez más estrechas.' },
          { key: String.raw`La media de $n$ observaciones independientes tiene la misma esperanza que cada una, pero su desviación típica es $\sigma/\sqrt{n}$: para dividir el error entre 10 hacen falta 100 veces más datos.` },
        ],
      },
      {
        id: 'teoremas',
        title: 'Los dos teoremas',
        blocks: [
          { p: String.raw`Sean $X_1, \dots, X_n$ independientes e idénticamente distribuidas (i.i.d.), con media $\mu$ y varianza $\sigma^2$, y sea $\bar X_n = \frac{1}{n}\sum_i X_i$. Entonces $\mathbb{E}[\bar X_n] = \mu$ y $\operatorname{Var}(\bar X_n) = \sigma^2/n$; la desviación típica $\sigma/\sqrt{n}$ es el **error estándar** de la media (ver [[sampling-distribution]]).` },
          { p: String.raw`**Ley de los grandes números.** Si $\mathbb{E}|X| < \infty$, $\bar X_n \to \mu$ cuando $n \to \infty$. La ley débil dice que $P(|\bar X_n - \mu| > \varepsilon) \to 0$ para todo $\varepsilon > 0$; la fuerte, que la convergencia ocurre con probabilidad 1. Con varianza finita, la desigualdad de Chebyshev da una cota explícita: $P(|\bar X_n - \mu| \ge \varepsilon) \le \sigma^2/(n\varepsilon^2)$.` },
          { p: String.raw`**Teorema central del límite.** Si además $0 < \sigma^2 < \infty$:` },
          { math: String.raw`\frac{\bar X_n - \mu}{\sigma/\sqrt{n}} \xrightarrow{d} \mathcal{N}(0, 1), \qquad \text{es decir,} \quad \bar X_n \approx \mathcal{N}\!\left(\mu, \frac{\sigma^2}{n}\right) \ \text{para } n \text{ grande}` },
          { p: String.raw`Lo que converge es la distribución de $\bar X_n$, no los datos. Y el teorema no dice a partir de qué $n$ la aproximación es buena: eso depende sobre todo de lo asimétrica que sea $X$ y de lo pesadas que sean sus colas.` },
        ],
      },
      {
        id: 'rapidez',
        title: 'Cuánto tarda',
        blocks: [
          { p: String.raw`Los tiempos exponenciales de media 1 son muy asimétricos (asimetría 2). Si la media de $n$ de ellos fuera exactamente normal, la probabilidad de quedar por encima de $\mu + 1{,}645\,\sigma/\sqrt{n}$ sería 0,05, y también la de quedar por debajo de $\mu - 1{,}645\,\sigma/\sqrt{n}$. Los valores reales son:` },
          {
            table: {
              head: [String.raw`$n$`, 'Asimetría de la media', 'P(por encima)', 'P(por debajo)'],
              rows: [
                ['1', '2', '0,071', '0'],
                ['5', '0,894', '0,067', '0,011'],
                ['30', '0,365', '0,059', '0,037'],
                ['100', '0,2', '0,055', '0,044'],
                ['1000', '0,063', '0,052', '0,048'],
              ],
              numeric: [0, 1, 2, 3],
            },
          },
          { p: String.raw`La asimetría de la media decrece como $2/\sqrt{n}$ y las dos colas se acercan a 0,05, pero con 30 datos la aproximación aún se equivoca en ambas, y en sentidos opuestos. Con sucesos raros es peor: la media de 30 variables de Bernoulli con $p = 0{,}01$ vale exactamente 0 el 74 % de las veces, algo que ninguna normal describe.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Tras muchas cruces seguidas es más probable que salga cara: la ley de los grandes números compensa.»', fix: 'Los lanzamientos son independientes, y la probabilidad de cara sigue siendo 0,5. La proporción se acerca a 0,5 porque las rachas iniciales quedan diluidas entre muchos lanzamientos nuevos, no porque se corrijan. Es la falacia del jugador.' },
      { claim: '«El teorema central del límite dice que, con muchos datos, los datos se vuelven normales.»', fix: 'Habla de la distribución de la media (o de la suma), no de los datos. El histograma de una muestra grande se parece a la distribución de X, sea cual sea; lo que se vuelve normal es cómo varía la media de una muestra a otra.' },
      { claim: '«Con n ≥ 30 la aproximación normal siempre es buena.»', fix: 'Es una regla orientativa. Con datos exponenciales y n = 30, las colas reales son 0,059 y 0,037 en lugar de 0,05; con datos más asimétricos o con sucesos raros hace falta mucho más, y con varianza infinita el teorema no se aplica.' },
      { claim: '«Cualquier promedio acaba convergiendo.»', fix: 'Hace falta que exista la media: la media de n observaciones de una Cauchy tiene la misma distribución que una sola observación. Y con datos dependientes, como una serie temporal con autocorrelación positiva, la convergencia es más lenta: el tamaño muestral efectivo es menor que n.' },
    ],
    dl: [
      { title: 'El ruido del minibatch.', text: String.raw`El gradiente de un minibatch es la media de $B$ gradientes por ejemplo: una estimación insesgada del gradiente completo cuya desviación típica decrece como $1/\sqrt{B}$ si los ejemplos se eligen de forma independiente. Duplicar el lote reduce el ruido solo en un factor $\sqrt{2} \approx 1{,}41$; para reducirlo a la mitad hay que cuadruplicarlo.` },
      { title: 'La incertidumbre de una métrica de test.', text: String.raw`La exactitud en $n$ ejemplos de test es una media de ceros y unos, así que su error estándar es $\sqrt{p(1-p)/n}$. Con 10 000 ejemplos y una exactitud de 0,90 vale 0,003, y el intervalo del 95 % es de unos $\pm 0{,}6$ puntos porcentuales. Antes de declarar ganador a un modelo por unas décimas, ten en cuenta ese margen (ver [[confidence-intervals]]); para comparar dos modelos en el mismo test, mejor un contraste pareado.` },
      { title: 'Estimaciones de Monte Carlo.', text: String.raw`Promediar muestras aleatorias es la forma estándar de aproximar esperanzas que no se pueden calcular: la predicción con dropout activo en inferencia (MC dropout), la ELBO de un VAE o el retorno en aprendizaje por refuerzo. La ley de los grandes números garantiza la convergencia, y el error decrece como $1/\sqrt{S}$ con $S$ muestras: ver [[monte-carlo]].` },
    ],
    quiz: [
      {
        prompt: 'La desviación típica de una observación es 10. ¿Cuál es la de la media de 100 observaciones independientes?',
        options: [{ text: '0,1' }, { text: '1', correct: true }, { text: '10' }],
        explain: String.raw`$\sigma/\sqrt{n} = 10/\sqrt{100} = 1$. Dividir por $n$ en vez de por $\sqrt{n}$ daría 0,1.`,
      },
      {
        prompt: '¿Qué afirma el teorema central del límite?',
        options: [
          { text: 'Que, con muchos datos, su histograma se parece a una normal.' },
          { text: 'Que la distribución de la media muestral se acerca a una normal.', correct: true },
          { text: String.raw`Que la media muestral es exactamente $\mu$ a partir de $n = 30$.` },
        ],
        explain: 'Habla de la media, no de los datos, y es una aproximación que mejora al crecer n: no hay ningún n a partir del cual sea exacta.',
      },
      {
        prompt: 'Un modelo acierta en el 80 % de 2500 ejemplos de test. ¿Cuál es, aproximadamente, el error estándar de esa exactitud?',
        options: [{ text: '0,008', correct: true }, { text: '0,016' }, { text: '0,000064' }],
        explain: String.raw`$\sqrt{0{,}8 \cdot 0{,}2/2500} = 0{,}4/50 = 0{,}008$. El 0,016 es casi la semianchura del intervalo del 95 % ($1{,}96 \cdot 0{,}008 \approx 0{,}0157$), y 0,000064 es la varianza, no la desviación típica.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§2.3.1 (la ley de los grandes números como base de la interpretación frecuentista), §4.4.2 (el teorema central del límite y por qué tantas variables son aproximadamente normales) y §5.2.4 (cómo la dependencia serial reduce el tamaño muestral efectivo).' },
      { book: 'pml1', where: '§2.8.6 (teorema central del límite) y §2.8.7 (aproximación de Monte Carlo).' },
    ],
  },
  en: {
    lede: String.raw`The law of large numbers says that the mean of many independent observations approaches the expectation; the central limit theorem, that its fluctuations around it are approximately normal, with a width that shrinks like $1/\sqrt{n}$. Together they explain why averages, confidence intervals and the Monte Carlo method work.`,
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'Toss a fair coin 10 times and the proportion of heads may come out at 0.3 or less, or 0.7 or more, without anything odd going on: that happens 34% of the time. Toss it 10,000 times and the proportion will fall between 0.49 and 0.51 with probability 0.96. The **law of large numbers** says that the mean settles at the expectation; the **central limit theorem** describes the fluctuations that remain: they are approximately normal and ever narrower.' },
          { key: String.raw`The mean of $n$ independent observations has the same expectation as each of them, but its standard deviation is $\sigma/\sqrt{n}$: to divide the error by 10 you need 100 times more data.` },
        ],
      },
      {
        id: 'theorems',
        title: 'The two theorems',
        blocks: [
          { p: String.raw`Let $X_1, \dots, X_n$ be independent and identically distributed (i.i.d.), with mean $\mu$ and variance $\sigma^2$, and let $\bar X_n = \frac{1}{n}\sum_i X_i$. Then $\mathbb{E}[\bar X_n] = \mu$ and $\operatorname{Var}(\bar X_n) = \sigma^2/n$; the standard deviation $\sigma/\sqrt{n}$ is the **standard error** of the mean (see [[sampling-distribution]]).` },
          { p: String.raw`**Law of large numbers.** If $\mathbb{E}|X| < \infty$, $\bar X_n \to \mu$ as $n \to \infty$. The weak law says that $P(|\bar X_n - \mu| > \varepsilon) \to 0$ for every $\varepsilon > 0$; the strong law, that convergence happens with probability 1. With finite variance, Chebyshev’s inequality gives an explicit bound: $P(|\bar X_n - \mu| \ge \varepsilon) \le \sigma^2/(n\varepsilon^2)$.` },
          { p: String.raw`**Central limit theorem.** If in addition $0 < \sigma^2 < \infty$:` },
          { math: String.raw`\frac{\bar X_n - \mu}{\sigma/\sqrt{n}} \xrightarrow{d} \mathcal{N}(0, 1), \qquad \text{that is,} \quad \bar X_n \approx \mathcal{N}\!\left(\mu, \frac{\sigma^2}{n}\right) \ \text{for large } n` },
          { p: String.raw`What converges is the distribution of $\bar X_n$, not the data. And the theorem does not say from which $n$ on the approximation is good: that depends mostly on how skewed $X$ is and how heavy its tails are.` },
        ],
      },
      {
        id: 'how-fast',
        title: 'How fast',
        blocks: [
          { p: String.raw`Exponential times with mean 1 are very skewed (skewness 2). If the mean of $n$ of them were exactly normal, the probability of landing above $\mu + 1.645\,\sigma/\sqrt{n}$ would be 0.05, and so would the probability of landing below $\mu - 1.645\,\sigma/\sqrt{n}$. The actual values are:` },
          {
            table: {
              head: [String.raw`$n$`, 'Skewness of the mean', 'P(above)', 'P(below)'],
              rows: [
                ['1', '2', '0.071', '0'],
                ['5', '0.894', '0.067', '0.011'],
                ['30', '0.365', '0.059', '0.037'],
                ['100', '0.2', '0.055', '0.044'],
                ['1000', '0.063', '0.052', '0.048'],
              ],
              numeric: [0, 1, 2, 3],
            },
          },
          { p: String.raw`The skewness of the mean decreases like $2/\sqrt{n}$ and both tails approach 0.05, but with 30 data points the approximation is still off in both, and in opposite directions. With rare events it is worse: the mean of 30 Bernoulli variables with $p = 0.01$ is exactly 0 in 74% of cases, something no normal distribution describes.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“After many tails in a row, heads is more likely: the law of large numbers compensates.”', fix: 'The tosses are independent, and the probability of heads is still 0.5. The proportion approaches 0.5 because the early streaks get diluted among many new tosses, not because they are corrected. This is the gambler’s fallacy.' },
      { claim: '“The central limit theorem says that with lots of data, the data become normal.”', fix: 'It is about the distribution of the mean (or the sum), not of the data. The histogram of a large sample looks like the distribution of X, whatever it is; what becomes normal is how the mean varies from one sample to another.' },
      { claim: '“With n ≥ 30 the normal approximation is always good.”', fix: 'It is a rule of thumb. With exponential data and n = 30, the actual tails are 0.059 and 0.037 instead of 0.05; with more skewed data or rare events you need far more, and with infinite variance the theorem does not apply.' },
      { claim: '“Any average eventually converges.”', fix: 'The mean has to exist: the average of n observations from a Cauchy distribution has the same distribution as a single observation. And with dependent data, such as a time series with positive autocorrelation, convergence is slower: the effective sample size is smaller than n.' },
    ],
    dl: [
      { title: 'Minibatch noise.', text: String.raw`The gradient of a minibatch is the mean of $B$ per-example gradients: an unbiased estimate of the full gradient whose standard deviation shrinks like $1/\sqrt{B}$ if the examples are drawn independently. Doubling the batch reduces the noise only by a factor $\sqrt{2} \approx 1.41$; to halve it you have to quadruple it.` },
      { title: 'The uncertainty of a test metric.', text: String.raw`Accuracy on $n$ test examples is a mean of zeros and ones, so its standard error is $\sqrt{p(1-p)/n}$. With 10,000 examples and an accuracy of 0.90 it is 0.003, and the 95% interval is about $\pm 0.6$ percentage points. Before declaring a model the winner by a few tenths of a point, keep that margin in mind (see [[confidence-intervals]]); to compare two models on the same test set, a paired test is better.` },
      { title: 'Monte Carlo estimates.', text: String.raw`Averaging random samples is the standard way to approximate expectations you cannot compute: predicting with dropout switched on at inference (MC dropout), the ELBO of a VAE or the return in reinforcement learning. The law of large numbers guarantees convergence, and the error shrinks like $1/\sqrt{S}$ with $S$ samples: see [[monte-carlo]].` },
    ],
    quiz: [
      {
        prompt: 'The standard deviation of one observation is 10. What is that of the mean of 100 independent observations?',
        options: [{ text: '0.1' }, { text: '1', correct: true }, { text: '10' }],
        explain: String.raw`$\sigma/\sqrt{n} = 10/\sqrt{100} = 1$. Dividing by $n$ instead of $\sqrt{n}$ would give 0.1.`,
      },
      {
        prompt: 'What does the central limit theorem state?',
        options: [
          { text: 'That with lots of data, their histogram looks like a normal.' },
          { text: 'That the distribution of the sample mean approaches a normal.', correct: true },
          { text: String.raw`That the sample mean equals $\mu$ exactly from $n = 30$ on.` },
        ],
        explain: 'It is about the mean, not the data, and it is an approximation that improves as n grows: there is no n from which it becomes exact.',
      },
      {
        prompt: 'A model is right on 80% of 2500 test examples. What is, approximately, the standard error of that accuracy?',
        options: [{ text: '0.008', correct: true }, { text: '0.016' }, { text: '0.000064' }],
        explain: String.raw`$\sqrt{0.8 \cdot 0.2/2500} = 0.4/50 = 0.008$. The value 0.016 is roughly the half-width of the 95% interval ($1.96 \cdot 0.008 \approx 0.0157$), and 0.000064 is the variance, not the standard deviation.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§2.3.1 (the law of large numbers as the basis of the frequentist interpretation), §4.4.2 (the central limit theorem and why so many variables are approximately normal) and §5.2.4 (how serial dependence reduces the effective sample size).' },
      { book: 'pml1', where: '§2.8.6 (central limit theorem) and §2.8.7 (Monte Carlo approximation).' },
    ],
  },
};

export default content;
