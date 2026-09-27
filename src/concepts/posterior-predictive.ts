import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'La predictiva posterior predice un dato nuevo promediando las predicciones de todos los valores del parámetro, ponderadas por su probabilidad posterior. Los intervalos de credibilidad resumen el posterior con un rango que contiene el parámetro con la probabilidad indicada, dados los datos y el prior.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Has cronometrado 4 trayectos por una ruta nueva: de media, 30 minutos. Sabes que el tiempo varía de un día a otro con desviación $\sigma = 4$ min. Para predecir el de mañana podrías fijar la media en 30 y usar $\mathcal{N}(30;\ 4^2)$. Pero con 4 datos la media real es incierta (su error estándar es $4/\sqrt 4 = 2$ min), y esa incertidumbre también debe entrar en la predicción. La predictiva posterior la incluye: con un prior plano para la media, su desviación es $\sqrt{4^2 + 2^2} \approx 4{,}47$ min.` },
          { key: 'Predecir con la predictiva posterior es promediar sobre lo que no sabes del parámetro, en vez de actuar como si lo conocieras.' },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { p: String.raw`Para un dato futuro $\tilde x$, se promedian las predicciones de cada valor de $\theta$, ponderadas por el [[prior-posterior|posterior]]:` },
          { math: String.raw`p(\tilde x \mid D) = \int p(\tilde x \mid \theta)\, p(\theta \mid D)\, d\theta` },
          {
            list: [
              String.raw`**Bernoulli** con posterior beta: $P(\tilde x = 1 \mid D) = \mathbb{E}[\theta \mid D]$. Con prior uniforme y 16 caras de 20, $17/22 \approx 0{,}773$, algo menos que el 0,8 del EMV.`,
              String.raw`**Normal** con $\sigma$ conocida y $\mu \mid D \sim \mathcal{N}(\mu_n, \tau_n^2)$: $\tilde x \mid D \sim \mathcal{N}(\mu_n,\ \sigma^2 + \tau_n^2)$. La varianza suma el ruido de los datos ($\sigma^2$, que no desaparece) y la incertidumbre sobre el parámetro ($\tau_n^2$, que se reduce al crecer $n$).`,
            ],
          },
          { p: String.raw`En el ejemplo del trayecto, el intervalo predictivo del 95 % va de 21,2 a 38,8 min. El que fija la media, de 22,2 a 37,8 min, es demasiado estrecho: si repitieras el experimento muchas veces, los intervalos construidos así solo contendrían el trayecto siguiente el 92 % de las veces. Con 100 trayectos la diferencia casi desaparece: la desviación predictiva baja a 4,02 min, muy cerca de $\sigma$.` },
        ],
      },
      {
        id: 'intervalos',
        title: 'Intervalos de credibilidad',
        blocks: [
          { p: String.raw`Un intervalo de credibilidad del 95 % contiene el 95 % de la probabilidad posterior: dados los datos y el prior, $P(\theta \in I \mid D) = 0{,}95$. Hay dos formas habituales de elegirlo:` },
          {
            list: [
              '**Central**: entre los cuantiles 2,5 % y 97,5 % del posterior.',
              '**De máxima densidad (HPD)**: el más corto posible; todos sus puntos tienen más densidad posterior que cualquier punto de fuera. Con posteriores asimétricos se desplaza hacia la moda.',
            ],
          },
          {
            table: {
              head: ['16 caras de 20', 'Intervalo del 95 %'],
              rows: [
                [String.raw`Credibilidad central (prior uniforme, posterior $\text{Beta}(17;\ 5)$)`, '[0,581; 0,918]'],
                ['Credibilidad HPD (mismo posterior)', '[0,601; 0,931]'],
                ['Confianza exacta (Clopper-Pearson)', '[0,563; 0,943]'],
              ],
              numeric: [1],
            },
          },
          { p: String.raw`Los números se parecen, pero se leen distinto: el de credibilidad es una afirmación de probabilidad sobre $\theta$; el de [[confidence-intervals|confianza]] describe con qué frecuencia acierta el método si repites el experimento.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Un intervalo de credibilidad del 95 % y uno de confianza del 95 % dicen lo mismo.»', fix: 'El de credibilidad dice que θ está dentro con probabilidad 0,95, dados los datos y el prior. El de confianza dice que el método cubre el valor real en el 95 % de las repeticiones, pero no da una probabilidad para el intervalo concreto que has obtenido. A veces coinciden en los números, nunca en el significado.' },
      { claim: '«Para predecir basta con usar la mejor estimación del parámetro.»', fix: 'Esa predicción plug-in ignora la incertidumbre sobre el parámetro y sale demasiado estrecha con pocos datos: en el ejemplo, su intervalo «del 95 %» acierta solo el 92 % de las veces. Con muchos datos la diferencia se vuelve pequeña.' },
      { claim: '«Con datos suficientes, la incertidumbre de la predicción desaparece.»', fix: String.raw`Solo desaparece la parte debida al parámetro: $\tau_n^2 \to 0$. El ruido propio de los datos, $\sigma^2$, se queda. Con infinitos trayectos seguirías sin saber exactamente cuánto tardarás mañana.` },
      { claim: '«El intervalo central siempre es el mejor resumen.»', fix: String.raw`Con posteriores muy asimétricos puede dejar fuera los valores más probables. Si un modelo no falla en 19 pruebas, con prior uniforme su tasa de error tiene posterior $\text{Beta}(1;\ 20)$, cuya moda es 0: el intervalo central, [0,001; 0,168], excluye el 0; el HPD, [0; 0,139], lo incluye y es más corto.` },
    ],
    dl: [
      { title: 'Promediar sobre los pesos.', text: String.raw`Una red neuronal bayesiana predice con $p(y \mid x, D) \approx \frac{1}{S}\sum_{s=1}^{S} p(y \mid x, \mathbf{w}_s)$, donde los $\mathbf{w}_s$ son muestras aproximadas del posterior. Los conjuntos de redes (deep ensembles) y MC dropout, que deja el dropout activo al predecir, son formas prácticas de hacer este promedio, y suelen dar predicciones mejor [[calibration|calibradas]] que una sola red.` },
      { title: 'Dos fuentes de incertidumbre.', text: 'Como en el caso normal, la varianza predictiva se descompone en el ruido de los datos (incertidumbre aleatoria) y el desacuerdo entre muestras del posterior (epistémica). Solo la segunda se reduce con más datos: ver [[uncertainty]].' },
    ],
    quiz: [
      {
        prompt: 'Con prior uniforme observas 7 caras en 10 lanzamientos. ¿Qué probabilidad da la predictiva posterior a que el siguiente lanzamiento sea cara?',
        options: [{ text: '0,7' }, { text: '0,667', correct: true }, { text: '0,5' }],
        explain: String.raw`El posterior es $\text{Beta}(8;\ 4)$ y la probabilidad predictiva es su media: $8/12 \approx 0{,}667$. El 0,7 es la predicción plug-in con el EMV.`,
      },
      {
        prompt: String.raw`Un intervalo de credibilidad del 95 % para $\theta$ va de 0,58 a 0,92. ¿Qué significa?`,
        options: [
          { text: String.raw`Que el 95 % de los intervalos calculados así contienen el $\theta$ real.` },
          { text: 'Que el 95 % de los datos futuros caerán en él.' },
          { text: String.raw`Que, dados los datos y el prior, $\theta$ está en él con probabilidad 0,95.`, correct: true },
        ],
        explain: String.raw`Es una afirmación de probabilidad sobre $\theta$, condicionada a los datos. La primera opción describe un intervalo de confianza; la segunda, un intervalo predictivo.`,
      },
      {
        prompt: String.raw`Con $\sigma$ conocida y posterior $\mu \mid D \sim \mathcal{N}(\mu_n, \tau_n^2)$, ¿cuál es la varianza de la predictiva posterior de un dato nuevo?`,
        options: [
          { text: String.raw`$\sigma^2 + \tau_n^2$`, correct: true },
          { text: String.raw`$\sigma^2$` },
          { text: String.raw`$\tau_n^2$` },
        ],
        explain: String.raw`Se suman el ruido del dato nuevo, $\sigma^2$, y la incertidumbre sobre $\mu$, $\tau_n^2$. Al crecer $n$, $\tau_n^2 \to 0$ y queda $\sigma^2$.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§6.2.2 (resúmenes del posterior e intervalos de credibilidad central y HPD) y §6.2.4 (distribución predictiva).' },
      { book: 'pml1', where: '§4.6.6 (intervalos de credibilidad central y HPD), §4.6.7 (aproximación plug-in frente a predictiva posterior), §4.7.5 (por qué un intervalo de confianza no es de credibilidad) y §11.7.4 (predictiva posterior en regresión lineal bayesiana: ruido más incertidumbre de los parámetros).' },
      { book: 'pml2', where: '§17.3.10 (cómo aproximar la predictiva posterior en redes neuronales bayesianas).' },
    ],
  },
  en: {
    lede: 'The posterior predictive distribution predicts a new data point by averaging the predictions of every parameter value, weighted by its posterior probability. Credible intervals summarize the posterior with a range that contains the parameter with the stated probability, given the data and the prior.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`You have timed 4 trips along a new route: 30 minutes on average. You know the time varies from day to day with standard deviation $\sigma = 4$ min. To predict tomorrow’s trip you could fix the mean at 30 and use $\mathcal{N}(30, 4^2)$. But with 4 data points the true mean is uncertain (its standard error is $4/\sqrt 4 = 2$ min), and that uncertainty should also enter the prediction. The posterior predictive includes it: with a flat prior on the mean, its standard deviation is $\sqrt{4^2 + 2^2} \approx 4.47$ min.` },
          { key: 'Predicting with the posterior predictive means averaging over what you do not know about the parameter, instead of acting as if you knew it.' },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { p: String.raw`For a future data point $\tilde x$, the predictions of every value of $\theta$ are averaged, weighted by the [[prior-posterior|posterior]]:` },
          { math: String.raw`p(\tilde x \mid D) = \int p(\tilde x \mid \theta)\, p(\theta \mid D)\, d\theta` },
          {
            list: [
              String.raw`**Bernoulli** with a beta posterior: $P(\tilde x = 1 \mid D) = \mathbb{E}[\theta \mid D]$. With a uniform prior and 16 heads out of 20, $17/22 \approx 0.773$, somewhat less than the MLE’s 0.8.`,
              String.raw`**Normal** with known $\sigma$ and $\mu \mid D \sim \mathcal{N}(\mu_n, \tau_n^2)$: $\tilde x \mid D \sim \mathcal{N}(\mu_n,\ \sigma^2 + \tau_n^2)$. The variance adds the noise in the data ($\sigma^2$, which never goes away) and the uncertainty about the parameter ($\tau_n^2$, which shrinks as $n$ grows).`,
            ],
          },
          { p: String.raw`In the trip example, the 95% predictive interval runs from 21.2 to 38.8 min. The one that fixes the mean, from 22.2 to 37.8 min, is too narrow: if you repeated the experiment many times, intervals built this way would contain the next trip only 92% of the time. With 100 trips the difference almost disappears: the predictive standard deviation drops to 4.02 min, very close to $\sigma$.` },
        ],
      },
      {
        id: 'intervals',
        title: 'Credible intervals',
        blocks: [
          { p: String.raw`A 95% credible interval contains 95% of the posterior probability: given the data and the prior, $P(\theta \in I \mid D) = 0.95$. There are two common ways to choose it:` },
          {
            list: [
              '**Central**: between the 2.5% and 97.5% quantiles of the posterior.',
              '**Highest posterior density (HPD)**: the shortest possible one; every point inside has higher posterior density than any point outside. With skewed posteriors it shifts towards the mode.',
            ],
          },
          {
            table: {
              head: ['16 heads out of 20', '95% interval'],
              rows: [
                [String.raw`Central credible (uniform prior, posterior $\text{Beta}(17, 5)$)`, '[0.581, 0.918]'],
                ['HPD credible (same posterior)', '[0.601, 0.931]'],
                ['Exact confidence (Clopper–Pearson)', '[0.563, 0.943]'],
              ],
              numeric: [1],
            },
          },
          { p: String.raw`The numbers look alike, but they are read differently: the credible interval is a probability statement about $\theta$; the [[confidence-intervals|confidence interval]] describes how often the method is right if you repeat the experiment.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“A 95% credible interval and a 95% confidence interval say the same thing.”', fix: 'The credible interval says that θ lies inside with probability 0.95, given the data and the prior. The confidence interval says that the method covers the true value in 95% of repetitions, but gives no probability for the particular interval you obtained. They sometimes agree in the numbers, never in the meaning.' },
      { claim: '“To predict, just plug in the best estimate of the parameter.”', fix: 'That plug-in prediction ignores the uncertainty about the parameter and comes out too narrow with little data: in the example, its “95%” interval is right only 92% of the time. With a lot of data the difference becomes small.' },
      { claim: '“With enough data, the uncertainty of a prediction disappears.”', fix: String.raw`Only the part due to the parameter disappears: $\tau_n^2 \to 0$. The noise in the data itself, $\sigma^2$, remains. With infinitely many trips you would still not know exactly how long tomorrow’s will take.` },
      { claim: '“The central interval is always the best summary.”', fix: String.raw`With very skewed posteriors it can leave out the most probable values. If a model makes no errors in 19 tests, with a uniform prior its error rate has a $\text{Beta}(1, 20)$ posterior, whose mode is 0: the central interval, [0.001, 0.168], excludes 0; the HPD interval, [0, 0.139], includes it and is shorter.` },
    ],
    dl: [
      { title: 'Averaging over the weights.', text: String.raw`A Bayesian neural network predicts with $p(y \mid x, D) \approx \frac{1}{S}\sum_{s=1}^{S} p(y \mid x, \mathbf{w}_s)$, where the $\mathbf{w}_s$ are approximate samples from the posterior. Deep ensembles and MC dropout, which keeps dropout active at prediction time, are practical ways to compute this average, and they usually give better [[calibration|calibrated]] predictions than a single network.` },
      { title: 'Two sources of uncertainty.', text: 'As in the normal case, the predictive variance splits into the noise in the data (aleatoric uncertainty) and the disagreement between posterior samples (epistemic uncertainty). Only the second shrinks with more data: see [[uncertainty]].' },
    ],
    quiz: [
      {
        prompt: 'With a uniform prior you observe 7 heads in 10 tosses. What probability does the posterior predictive give to the next toss being heads?',
        options: [{ text: '0.7' }, { text: '0.667', correct: true }, { text: '0.5' }],
        explain: String.raw`The posterior is $\text{Beta}(8, 4)$ and the predictive probability is its mean: $8/12 \approx 0.667$. The 0.7 is the plug-in prediction with the MLE.`,
      },
      {
        prompt: String.raw`A 95% credible interval for $\theta$ runs from 0.58 to 0.92. What does it mean?`,
        options: [
          { text: String.raw`That 95% of the intervals computed this way contain the true $\theta$.` },
          { text: 'That 95% of future data will fall inside it.' },
          { text: String.raw`That, given the data and the prior, $\theta$ lies inside it with probability 0.95.`, correct: true },
        ],
        explain: String.raw`It is a probability statement about $\theta$, conditional on the data. The first option describes a confidence interval; the second, a predictive interval.`,
      },
      {
        prompt: String.raw`With known $\sigma$ and posterior $\mu \mid D \sim \mathcal{N}(\mu_n, \tau_n^2)$, what is the variance of the posterior predictive for a new data point?`,
        options: [
          { text: String.raw`$\sigma^2 + \tau_n^2$`, correct: true },
          { text: String.raw`$\sigma^2$` },
          { text: String.raw`$\tau_n^2$` },
        ],
        explain: String.raw`The noise of the new data point, $\sigma^2$, and the uncertainty about $\mu$, $\tau_n^2$, add up. As $n$ grows, $\tau_n^2 \to 0$ and $\sigma^2$ remains.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§6.2.2 (summaries of the posterior, and central and HPD credible intervals) and §6.2.4 (the predictive distribution).' },
      { book: 'pml1', where: '§4.6.6 (central and HPD credible intervals), §4.6.7 (plug-in approximation versus posterior predictive), §4.7.5 (why a confidence interval is not a credible interval) and §11.7.4 (posterior predictive in Bayesian linear regression: noise plus parameter uncertainty).' },
      { book: 'pml2', where: '§17.3.10 (how to approximate the posterior predictive in Bayesian neural networks).' },
    ],
  },
};

export default content;
