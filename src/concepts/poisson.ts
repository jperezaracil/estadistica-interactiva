import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'La distribución de Poisson modela cuántas veces ocurre un suceso en un intervalo de tiempo o de espacio, cuando los sucesos son independientes y llegan a un ritmo medio constante. Tiene un solo parámetro, que es a la vez su media y su varianza.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Un servicio web recibe de media 4 peticiones por segundo, que llegan de forma independiente. En un segundo concreto pueden llegar 0, 4 o 9. La Poisson de media 4 dice que un segundo queda vacío con probabilidad 0,018 y que llegan 8 o más peticiones con probabilidad 0,051. Si el servidor solo puede atender 7 por segundo, se saturará más o menos en uno de cada 20 segundos.' },
          { key: String.raw`La Poisson es el límite de la binomial cuando hay muchísimas oportunidades ($n$ grande), cada una con una probabilidad muy pequeña ($p$ pequeña), y la media $\lambda = np$ se mantiene fija. Un único parámetro, $\lambda$, fija la media y la varianza.` },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { p: String.raw`Una variable $X$ con valores $0, 1, 2, \dots$ sigue una Poisson de parámetro $\lambda > 0$ si:` },
          { math: String.raw`P(X = k) = \frac{\lambda^{k} e^{-\lambda}}{k!}, \qquad k = 0, 1, 2, \dots` },
          { p: String.raw`Su media y su varianza valen $\lambda$, que es una tasa: el número esperado de sucesos por intervalo. Es el modelo adecuado cuando:` },
          {
            list: [
              '**Los sucesos son independientes:** que ocurra uno no hace más ni menos probable el siguiente.',
              '**La tasa es constante** a lo largo del intervalo.',
              '**No hay sucesos simultáneos:** en un intervalo muy corto ocurre, como mucho, uno.',
            ],
          },
          { p: String.raw`Dos propiedades muy útiles: la suma de variables de Poisson independientes es otra Poisson, con la suma de las tasas, y la tasa es proporcional a la longitud del intervalo. Así, 4 peticiones por segundo son una Poisson de media 240 por minuto.` },
        ],
      },
      {
        id: 'limite',
        title: 'Límite de la binomial',
        blocks: [
          { p: String.raw`Imagina 1000 usuarios que, cada uno con probabilidad 0,003 y de forma independiente, abren hoy una incidencia. El número de incidencias es $\text{Bin}(1000;\ 0{,}003)$, pero una Poisson de media $\lambda = 1000 \cdot 0{,}003 = 3$ da prácticamente las mismas probabilidades:` },
          {
            table: {
              head: [String.raw`$k$`, 'Binomial', 'Poisson'],
              rows: [
                ['0', '0,0496', '0,0498'],
                ['1', '0,1491', '0,1494'],
                ['3', '0,2244', '0,2240'],
                ['5', '0,1009', '0,1008'],
                ['6 o más', '0,0836', '0,0839'],
              ],
              numeric: [1, 2],
            },
          },
          { p: String.raw`Por eso la Poisson aparece cada vez que se cuentan sucesos raros entre muchas oportunidades: piezas defectuosas en un lote, mutaciones en un tramo de ADN o erratas en un libro. Para $\lambda$ grande se parece a una [[gaussian|normal]] de media y varianza $\lambda$.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Cualquier recuento sigue una Poisson.»', fix: 'Solo si los sucesos son independientes y la tasa es constante. Si la varianza de tus recuentos supera claramente a la media (sobredispersión, típica cuando los sucesos llegan en rachas o la tasa cambia de una unidad a otra), usa una binomial negativa, que equivale a una Poisson cuya tasa varía según una [[gamma-beta|gamma]].' },
      { claim: String.raw`«$\lambda$ es una probabilidad.»`, fix: String.raw`Es una tasa: el número esperado de sucesos por intervalo. Tiene unidades (sucesos por segundo, por kilómetro…) y puede ser mayor que 1. La probabilidad de que ocurra al menos un suceso es $1 - e^{-\lambda}$.` },
      { claim: '«Si no se observa ningún suceso, la tasa es cero.»', fix: String.raw`Con $\lambda = 1$, no ocurre ningún suceso el 36,8 % de las veces. Un intervalo vacío es perfectamente compatible con una tasa positiva, sobre todo si es pequeña.` },
      { claim: '«La Poisson es simétrica alrededor de su media.»', fix: String.raw`Tiene asimetría positiva, de valor $1/\sqrt{\lambda}$: marcada con tasas pequeñas y casi nula con tasas grandes, cuando ya se parece a una normal.` },
    ],
    dl: [
      { title: 'Regresión de Poisson.', text: String.raw`Si el objetivo es un recuento (pedidos, visitas, células en una imagen), la red puede predecir $\log\lambda(\mathbf{x})$ y entrenarse con la log-verosimilitud negativa de la Poisson, $\lambda - y\log\lambda$ más un término que no depende de los parámetros; es lo que calcula PoissonNLLLoss en PyTorch. El error cuadrático, en cambio, supone la misma varianza para todos los recuentos, mientras que en una Poisson la varianza crece con la media: ver [[losses-likelihoods]].` },
      { title: 'Recuentos con sobredispersión.', text: 'Los modelos probabilísticos de previsión de series temporales, como DeepAR, usan una verosimilitud binomial negativa para series de recuentos, porque los datos reales suelen tener más varianza de la que permite la Poisson.' },
    ],
    quiz: [
      {
        prompt: 'A un buzón llegan de media 2 correos por hora, de forma independiente. ¿Qué probabilidad hay de que en una hora no llegue ninguno?',
        options: [{ text: 'Unos 0,135.', correct: true }, { text: '0, porque se esperan 2.' }, { text: 'Unos 0,5.' }],
        explain: String.raw`$P(X = 0) = e^{-\lambda} = e^{-2} \approx 0{,}135$.`,
      },
      {
        prompt: 'Registras recuentos diarios con media 5 y varianza 20. ¿Qué sugiere?',
        options: [
          { text: 'Que la Poisson encaja bien.' },
          { text: 'Que hay un error, porque la varianza no puede superar a la media.' },
          { text: 'Sobredispersión: una binomial negativa encajará mejor que una Poisson.', correct: true },
        ],
        explain: 'En una Poisson, la media y la varianza coinciden. Una varianza cuatro veces mayor indica que los sucesos no son independientes o que la tasa varía. Con esa media y esa varianza, la binomial negativa da a un día sin sucesos una probabilidad de 0,099, frente a 0,0067 con la Poisson.',
      },
      {
        prompt: 'Un servidor recibe de media 3 peticiones por segundo, independientes y a ritmo constante. ¿Cómo se distribuye el número de peticiones en 10 segundos?',
        options: [
          { text: 'Poisson de media 3.' },
          { text: 'Poisson de media 30.', correct: true },
          { text: 'Normal de media 30 y varianza 3.' },
        ],
        explain: String.raw`La tasa es proporcional a la longitud del intervalo: $\lambda = 3 \cdot 10 = 30$. Su varianza también es 30, así que la desviación típica es $\sqrt{30} \approx 5{,}5$.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§4.2.5 (distribución de Poisson: condiciones del proceso de Poisson y ajuste por el método de los momentos) y §4.2.3 (binomial negativa, un modelo más flexible para recuentos).' },
      { book: 'pml2', where: '§2.2.1.3 (Poisson) y §2.2.1.4 (binomial negativa: más varianza que la Poisson, que es su caso límite).' },
      { book: 'pml1', where: '§12.2.3 (regresión de Poisson como modelo lineal generalizado).' },
    ],
  },
  en: {
    lede: 'The Poisson distribution models how many times an event occurs in an interval of time or space, when the events are independent and arrive at a constant average rate. It has a single parameter, which is both its mean and its variance.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'A web service receives on average 4 requests per second, arriving independently. In a given second, 0, 4 or 9 may arrive. The Poisson distribution with mean 4 says that a second stays empty with probability 0.018 and that 8 or more requests arrive with probability 0.051. If the server can only handle 7 per second, it will be overloaded in roughly one second out of 20.' },
          { key: String.raw`The Poisson distribution is the limit of the binomial when there are very many opportunities ($n$ large), each with a very small probability ($p$ small), and the mean $\lambda = np$ stays fixed. A single parameter, $\lambda$, sets both the mean and the variance.` },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { p: String.raw`A variable $X$ taking values $0, 1, 2, \dots$ follows a Poisson distribution with parameter $\lambda > 0$ if:` },
          { math: String.raw`P(X = k) = \frac{\lambda^{k} e^{-\lambda}}{k!}, \qquad k = 0, 1, 2, \dots` },
          { p: String.raw`Its mean and variance are both $\lambda$, which is a rate: the expected number of events per interval. It is the right model when:` },
          {
            list: [
              '**Events are independent:** one occurring does not make the next more or less likely.',
              '**The rate is constant** throughout the interval.',
              '**There are no simultaneous events:** in a very short interval, at most one occurs.',
            ],
          },
          { p: String.raw`Two very useful properties: the sum of independent Poisson variables is another Poisson variable, with the sum of the rates, and the rate is proportional to the length of the interval. So 4 requests per second are a Poisson distribution with mean 240 per minute.` },
        ],
      },
      {
        id: 'limit',
        title: 'Limit of the binomial',
        blocks: [
          { p: String.raw`Imagine 1000 users who, each with probability 0.003 and independently, open a support ticket today. The number of tickets is $\text{Bin}(1000, 0.003)$, but a Poisson distribution with mean $\lambda = 1000 \cdot 0.003 = 3$ gives practically the same probabilities:` },
          {
            table: {
              head: [String.raw`$k$`, 'Binomial', 'Poisson'],
              rows: [
                ['0', '0.0496', '0.0498'],
                ['1', '0.1491', '0.1494'],
                ['3', '0.2244', '0.2240'],
                ['5', '0.1009', '0.1008'],
                ['6 or more', '0.0836', '0.0839'],
              ],
              numeric: [1, 2],
            },
          },
          { p: String.raw`That is why the Poisson distribution appears whenever rare events are counted among many opportunities: defective parts in a batch, mutations in a stretch of DNA or typos in a book. For large $\lambda$ it looks like a [[gaussian|normal distribution]] with mean and variance $\lambda$.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“Any count follows a Poisson distribution.”', fix: 'Only if the events are independent and the rate is constant. If the variance of your counts clearly exceeds the mean (overdispersion, typical when events come in bursts or the rate changes from one unit to another), use a negative binomial, which is equivalent to a Poisson distribution whose rate varies according to a [[gamma-beta|gamma distribution]].' },
      { claim: String.raw`“$\lambda$ is a probability.”`, fix: String.raw`It is a rate: the expected number of events per interval. It has units (events per second, per kilometer…) and can be larger than 1. The probability of at least one event is $1 - e^{-\lambda}$.` },
      { claim: '“If no event is observed, the rate is zero.”', fix: String.raw`With $\lambda = 1$, no event occurs 36.8% of the time. An empty interval is perfectly compatible with a positive rate, especially a small one.` },
      { claim: '“The Poisson distribution is symmetric around its mean.”', fix: String.raw`It is positively skewed, with skewness $1/\sqrt{\lambda}$: pronounced for small rates and almost zero for large ones, when it already looks like a normal distribution.` },
    ],
    dl: [
      { title: 'Poisson regression.', text: String.raw`If the target is a count (orders, visits, cells in an image), the network can predict $\log\lambda(\mathbf{x})$ and be trained with the Poisson negative log-likelihood, $\lambda - y\log\lambda$ plus a term that does not depend on the parameters; that is what PoissonNLLLoss computes in PyTorch. Squared error, by contrast, assumes the same variance for every count, whereas in a Poisson distribution the variance grows with the mean: see [[losses-likelihoods]].` },
      { title: 'Overdispersed counts.', text: 'Probabilistic time-series forecasting models such as DeepAR use a negative binomial likelihood for count series, because real data usually have more variance than the Poisson distribution allows.' },
    ],
    quiz: [
      {
        prompt: 'A mailbox receives on average 2 emails per hour, independently. What is the probability that none arrives in an hour?',
        options: [{ text: 'About 0.135.', correct: true }, { text: '0, because 2 are expected.' }, { text: 'About 0.5.' }],
        explain: String.raw`$P(X = 0) = e^{-\lambda} = e^{-2} \approx 0.135$.`,
      },
      {
        prompt: 'You record daily counts with mean 5 and variance 20. What does that suggest?',
        options: [
          { text: 'That the Poisson distribution fits well.' },
          { text: 'That there is a mistake, because the variance cannot exceed the mean.' },
          { text: 'Overdispersion: a negative binomial will fit better than a Poisson distribution.', correct: true },
        ],
        explain: 'In a Poisson distribution, the mean and variance are equal. A variance four times larger indicates that the events are not independent or that the rate varies. With that mean and variance, the negative binomial gives a day without events a probability of 0.099, against 0.0067 under the Poisson distribution.',
      },
      {
        prompt: 'A server receives on average 3 requests per second, independent and at a constant rate. How is the number of requests in 10 seconds distributed?',
        options: [
          { text: 'Poisson with mean 3.' },
          { text: 'Poisson with mean 30.', correct: true },
          { text: 'Normal with mean 30 and variance 3.' },
        ],
        explain: String.raw`The rate is proportional to the length of the interval: $\lambda = 3 \cdot 10 = 30$. Its variance is also 30, so the standard deviation is $\sqrt{30} \approx 5.5$.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§4.2.5 (Poisson distribution: conditions of the Poisson process and fitting by the method of moments) and §4.2.3 (negative binomial, a more flexible model for counts).' },
      { book: 'pml2', where: '§2.2.1.3 (Poisson) and §2.2.1.4 (negative binomial: more variance than the Poisson distribution, which is its limiting case).' },
      { book: 'pml1', where: '§12.2.3 (Poisson regression as a generalized linear model).' },
    ],
  },
};

export default content;
