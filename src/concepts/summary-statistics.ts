import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Unos pocos números resumen dónde están los datos, cuánto se dispersan y qué forma tienen. Elegir cuáles usar depende sobre todo de cómo reaccionan a los valores extremos.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Mides diez veces el tiempo de inferencia de una red. Nueve medidas están entre 21 y 24 ms, pero la primera tarda 140 ms porque incluye el calentamiento de la GPU. La media sale 34,1 ms, un valor al que no se parece ninguna medida; la mediana, 22,5 ms, sigue describiendo una ejecución típica. Si esa primera medida hubiera sido de 25 ms, la media habría bajado a 22,6 ms y la mediana no se habría movido.' },
          { key: 'La media, la desviación típica y la asimetría usan el valor exacto de cada dato, así que un solo valor extremo puede arrastrarlas. La mediana y el rango intercuartílico se calculan con los datos ordenados y solo dependen de los valores centrales: son **resistentes** a los atípicos.' },
        ],
      },
      {
        id: 'definiciones',
        title: 'Las medidas',
        blocks: [
          { p: String.raw`Para datos $x_1, \dots, x_n$, las medidas clásicas de centro y de dispersión son la media y la desviación típica:` },
          { math: String.raw`\bar x = \frac{1}{n}\sum_{i=1}^{n} x_i, \qquad s = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n} (x_i - \bar x)^2}` },
          { p: String.raw`La desviación típica tiene las unidades de los datos. Con los momentos centrados $m_k = \frac{1}{n}\sum_i (x_i - \bar x)^k$, la **asimetría** es $g_1 = m_3/m_2^{3/2}$ (positiva si la cola larga está a la derecha) y la **curtosis en exceso** es $g_2 = m_4/m_2^2 - 3$, que vale 0 para la normal y mide sobre todo el peso de las colas.` },
          { p: String.raw`Las medidas resistentes usan los datos ordenados. El **cuantil** $q_p$ deja por debajo, aproximadamente, una fracción $p$ de los datos: la **mediana** es $q_{0{,}5}$ y los **cuartiles** son $q_{0{,}25}$ y $q_{0{,}75}$. La dispersión se mide con el **rango intercuartílico**, $\mathrm{RIC} = q_{0{,}75} - q_{0{,}25}$, o con la **desviación absoluta mediana**, $\mathrm{MAD} = \operatorname{mediana}_i |x_i - q_{0{,}5}|$.` },
          { note: String.raw`Las dos medidas de centro resuelven un problema de optimización: la media minimiza $\sum_i (x_i - c)^2$ y la mediana minimiza $\sum_i |x_i - c|$. Como en la suma de cuadrados cada desviación cuenta al cuadrado, un valor lejano tira mucho más de la media que de la mediana.` },
        ],
      },
      {
        id: 'ejemplo',
        title: 'El ejemplo en números',
        blocks: [
          { p: 'Las diez medidas del tiempo de inferencia, con la primera a 25 ms o a 140 ms:' },
          {
            table: {
              head: ['Medida', 'Primera a 25 ms', 'Primera a 140 ms'],
              rows: [
                ['Media', '22,6', '34,1'],
                ['Mediana', '22,5', '22,5'],
                ['Desviación típica', '1,26', '37,2'],
                ['Rango intercuartílico', '1', '1'],
                ['MAD', '0,5', '0,5'],
                ['Asimetría $g_1$', '0,46', '2,66'],
              ],
              numeric: [1, 2],
            },
          },
          { p: String.raw`Los cuartiles se han calculado con interpolación lineal, la opción por defecto de NumPy. Hay otras definiciones de cuantil muestral y, con pocos datos, dan valores algo distintos: con esta muestra, otra convención frecuente da cuartiles de 21,75 y 23,25 ms. Para datos normales, $\mathrm{RIC} \approx 1{,}349\,\sigma$ y $\mathrm{MAD} \approx 0{,}674\,\sigma$, así que $\mathrm{RIC}/1{,}349$ y $1{,}483\,\mathrm{MAD}$ estiman $\sigma$ de forma resistente. Aquí ambas dan 0,74 ms, con o sin el valor atípico.` },
        ],
      },
      {
        id: 'cual-usar',
        title: 'Cuál usar',
        blocks: [
          {
            list: [
              String.raw`**Datos simétricos y sin atípicos:** media y desviación típica. Con datos normales, la media es más precisa: en muestras grandes, la mediana necesita unas $\pi/2 \approx 1{,}57$ veces más datos para lograr el mismo error estándar.`,
              '**Datos asimétricos o con atípicos** (tiempos, ingresos, lluvia): mediana y cuantiles. Las latencias se suelen dar con los percentiles 50, 95 y 99.',
              String.raw`**Valores en escalas distintas:** la puntuación típica $z = (x - \bar x)/s$ mide a cuántas desviaciones típicas de la media está cada valor.`,
              '**Siempre, además, un gráfico:** conjuntos de datos muy distintos pueden compartir media, varianza y correlación. Ver [[histograms-kde]] y [[boxplots-qq]].',
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '«La media es el valor típico de los datos.»', fix: 'Solo si la distribución es más o menos simétrica. Con la medida de calentamiento, 9 de las 10 medidas quedan por debajo de la media. Con datos asimétricos, la mediana describe mejor un valor típico.' },
      { claim: '«Como divide entre n − 1, la desviación típica muestral es insesgada.»', fix: String.raw`Lo es la varianza $s^2$ (con datos independientes), pero no su raíz: $\mathbb{E}[s] < \sigma$. Con 5 datos normales, $\mathbb{E}[s] \approx 0{,}94\,\sigma$. Ver [[estimators]].` },
      { claim: '«Una curtosis alta significa un pico más puntiagudo.»', fix: 'La curtosis depende sobre todo de las colas: una curtosis en exceso positiva indica más valores extremos que en una normal, y dice muy poco sobre la forma del pico.' },
      { claim: '«Entre la media menos y más dos desviaciones típicas está el 95 % de los datos.»', fix: String.raw`Eso vale para datos aproximadamente normales; en general solo se garantiza el 75 % (desigualdad de Chebyshev). Con la medida de calentamiento, el intervalo $\bar x \pm 2s$ va de $-40{,}3$ a $108{,}5$ ms: incluye tiempos negativos y deja fuera justo el dato atípico.` },
    ],
    dl: [
      { title: 'La pérdida decide qué estadístico predices.', text: 'Una red de regresión entrenada con error cuadrático medio aprende, en el óptimo, a predecir la media condicional de la respuesta; con error absoluto (L1), la mediana condicional, y con la pérdida pinball, un cuantil. Si la respuesta tiene colas pesadas o atípicos, la elección cambia mucho el resultado: ver [[losses-likelihoods]].' },
      { title: 'Normalización.', text: String.raw`Estandarizar las entradas, $z = (x - \bar x)/s$, con la media y la desviación típica del conjunto de entrenamiento (no de todos los datos) es un preprocesado habitual. Dentro de la red, batch normalization hace lo mismo con cada activación usando, durante el entrenamiento, la media y la varianza del lote; layer normalization usa las de cada ejemplo.` },
      { title: 'Resultados con varias semillas.', text: String.raw`Al dar «media ± desviación típica» sobre pocas semillas, recuerda que la desviación típica es muy imprecisa: con 5 semillas y una métrica aproximadamente normal, el intervalo de confianza al 95 % para $\sigma$ va de $0{,}60\,s$ a $2{,}87\,s$. Si la métrica es asimétrica o alguna ejecución falla, da también la mediana y el rango.` },
    ],
    quiz: [
      {
        prompt: 'Para los datos 4, 5, 5, 6 y 30, ¿cuánto valen la media y la mediana?',
        options: [{ text: 'Media 10 y mediana 5.', correct: true }, { text: 'Media 5 y mediana 10.' }, { text: 'Media 10 y mediana 6.' }],
        explain: 'La media es 50/5 = 10, arrastrada por el 30; la mediana es el valor central de los datos ordenados, 5.',
      },
      {
        prompt: 'Una variable tiene una curtosis en exceso claramente positiva. ¿Qué indica sobre todo?',
        options: [
          { text: 'Que su pico es más plano que el de una normal.' },
          { text: 'Que es asimétrica a la derecha.' },
          { text: 'Que tiene colas más pesadas que una normal: más valores extremos.', correct: true },
        ],
        explain: 'La curtosis en exceso compara el peso de las colas con el de la normal, que tiene 0. La asimetría la mide $g_1$, no $g_2$.',
      },
      {
        prompt: 'Entrenas una red de regresión con pérdida L1 (error absoluto). Si para una misma entrada la respuesta puede tomar valores muy distintos, ¿qué tiende a predecir?',
        options: [{ text: 'La media condicional.' }, { text: 'La mediana condicional.', correct: true }, { text: 'El valor más frecuente, la moda.' }],
        explain: String.raw`El valor $c$ que minimiza $\mathbb{E}\,|Y - c|$ es la mediana de $Y$. Con error cuadrático, el mínimo está en la media.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§3.1 (robustez y resistencia; cuantiles y estadísticos de orden) y §3.2 (medidas de centro, dispersión, simetría y curtosis, con alternativas resistentes como la media recortada, la MAD y el índice de Yule-Kendall).' },
      { book: 'pml1', where: '§2.2.5 (media, varianza y moda de una distribución), §2.2.6 (límites de los estadísticos resumen: el cuarteto de Anscombe y el Datasaurus) y §5.1.5 (la media y la mediana como predicciones óptimas con pérdida cuadrática y absoluta).' },
    ],
    extra: [
      { text: 'Hyndman, R. J. y Fan, Y. (1996). Sample quantiles in statistical packages. The American Statistician, 50(4), 361–365. Compara las definiciones de cuantil muestral que usan los programas estadísticos.', url: 'https://doi.org/10.1080/00031305.1996.10473566' },
    ],
  },
  en: {
    lede: 'A few numbers summarize where the data sit, how spread out they are and what shape they have. Which ones to use depends mostly on how they react to extreme values.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'You time a network’s inference ten times. Nine measurements lie between 21 and 24 ms, but the first one takes 140 ms because it includes the GPU warm-up. The mean comes out at 34.1 ms, a value that looks like none of the measurements; the median, 22.5 ms, still describes a typical run. Had that first measurement been 25 ms, the mean would have dropped to 22.6 ms and the median would not have moved.' },
          { key: 'The mean, the standard deviation and the skewness use the exact value of every data point, so a single extreme value can drag them. The median and the interquartile range are computed from the sorted data and depend only on the central values: they are **resistant** to outliers.' },
        ],
      },
      {
        id: 'definitions',
        title: 'The measures',
        blocks: [
          { p: String.raw`For data $x_1, \dots, x_n$, the classic measures of location and spread are the mean and the standard deviation:` },
          { math: String.raw`\bar x = \frac{1}{n}\sum_{i=1}^{n} x_i, \qquad s = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n} (x_i - \bar x)^2}` },
          { p: String.raw`The standard deviation has the units of the data. With the central moments $m_k = \frac{1}{n}\sum_i (x_i - \bar x)^k$, the **skewness** is $g_1 = m_3/m_2^{3/2}$ (positive when the long tail is on the right) and the **excess kurtosis** is $g_2 = m_4/m_2^2 - 3$, which is 0 for the normal and mostly measures the weight of the tails.` },
          { p: String.raw`Resistant measures use the sorted data. The **quantile** $q_p$ leaves approximately a fraction $p$ of the data below it: the **median** is $q_{0.5}$ and the **quartiles** are $q_{0.25}$ and $q_{0.75}$. Spread is measured with the **interquartile range**, $\mathrm{IQR} = q_{0.75} - q_{0.25}$, or with the **median absolute deviation**, $\mathrm{MAD} = \operatorname{median}_i |x_i - q_{0.5}|$.` },
          { note: String.raw`The two measures of location solve an optimization problem: the mean minimizes $\sum_i (x_i - c)^2$ and the median minimizes $\sum_i |x_i - c|$. Because each deviation counts squared in the sum of squares, a distant value pulls much harder on the mean than on the median.` },
        ],
      },
      {
        id: 'example',
        title: 'The example in numbers',
        blocks: [
          { p: 'The ten inference times, with the first one at 25 ms or at 140 ms:' },
          {
            table: {
              head: ['Measure', 'First at 25 ms', 'First at 140 ms'],
              rows: [
                ['Mean', '22.6', '34.1'],
                ['Median', '22.5', '22.5'],
                ['Standard deviation', '1.26', '37.2'],
                ['Interquartile range', '1', '1'],
                ['MAD', '0.5', '0.5'],
                ['Skewness $g_1$', '0.46', '2.66'],
              ],
              numeric: [1, 2],
            },
          },
          { p: String.raw`The quartiles were computed with linear interpolation, NumPy’s default. There are other definitions of the sample quantile and, with few data, they give slightly different values: for this sample, another common convention gives quartiles of 21.75 and 23.25 ms. For normal data, $\mathrm{IQR} \approx 1.349\,\sigma$ and $\mathrm{MAD} \approx 0.674\,\sigma$, so $\mathrm{IQR}/1.349$ and $1.483\,\mathrm{MAD}$ are resistant estimates of $\sigma$. Here both give 0.74 ms, with or without the outlier.` },
        ],
      },
      {
        id: 'which-to-use',
        title: 'Which one to use',
        blocks: [
          {
            list: [
              String.raw`**Symmetric data without outliers:** mean and standard deviation. With normal data the mean is more precise: in large samples, the median needs about $\pi/2 \approx 1.57$ times as much data to reach the same standard error.`,
              '**Skewed data or data with outliers** (times, incomes, rainfall): median and quantiles. Latencies are usually reported with the 50th, 95th and 99th percentiles.',
              String.raw`**Values on different scales:** the standard score $z = (x - \bar x)/s$ measures how many standard deviations a value lies from the mean.`,
              '**Always, in addition, a plot:** very different datasets can share their mean, variance and correlation. See [[histograms-kde]] and [[boxplots-qq]].',
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '“The mean is the typical value of the data.”', fix: 'Only if the distribution is roughly symmetric. With the warm-up measurement, 9 of the 10 measurements fall below the mean. With skewed data, the median describes a typical value better.' },
      { claim: '“Because it divides by n − 1, the sample standard deviation is unbiased.”', fix: String.raw`The variance $s^2$ is (for independent data), but its square root is not: $\mathbb{E}[s] < \sigma$. With 5 normal data points, $\mathbb{E}[s] \approx 0.94\,\sigma$. See [[estimators]].` },
      { claim: '“High kurtosis means a sharper peak.”', fix: 'Kurtosis depends mostly on the tails: a positive excess kurtosis indicates more extreme values than in a normal, and it says very little about the shape of the peak.' },
      { claim: '“The mean plus or minus two standard deviations contains 95% of the data.”', fix: String.raw`That holds for roughly normal data; in general only 75% is guaranteed (Chebyshev’s inequality). With the warm-up measurement, the interval $\bar x \pm 2s$ runs from $-40.3$ to $108.5$ ms: it includes negative times and leaves out exactly the outlier.` },
    ],
    dl: [
      { title: 'The loss decides which statistic you predict.', text: 'A regression network trained with mean squared error learns, at the optimum, to predict the conditional mean of the response; with absolute error (L1), the conditional median; and with the pinball loss, a quantile. If the response has heavy tails or outliers, the choice changes the result a lot: see [[losses-likelihoods]].' },
      { title: 'Normalization.', text: String.raw`Standardizing the inputs, $z = (x - \bar x)/s$, with the mean and standard deviation of the training set (not of all the data) is common preprocessing. Inside the network, batch normalization does the same with each activation using, during training, the batch mean and variance; layer normalization uses those of each example.` },
      { title: 'Results over several seeds.', text: String.raw`When reporting “mean ± standard deviation” over a few seeds, remember that the standard deviation is very imprecise: with 5 seeds and a roughly normal metric, the 95% confidence interval for $\sigma$ runs from $0.60\,s$ to $2.87\,s$. If the metric is skewed or some run fails, also report the median and the range.` },
    ],
    quiz: [
      {
        prompt: 'For the data 4, 5, 5, 6 and 30, what are the mean and the median?',
        options: [{ text: 'Mean 10 and median 5.', correct: true }, { text: 'Mean 5 and median 10.' }, { text: 'Mean 10 and median 6.' }],
        explain: 'The mean is 50/5 = 10, dragged up by the 30; the median is the middle value of the sorted data, 5.',
      },
      {
        prompt: 'A variable has a clearly positive excess kurtosis. What does it mainly indicate?',
        options: [
          { text: 'That its peak is flatter than a normal’s.' },
          { text: 'That it is skewed to the right.' },
          { text: 'That it has heavier tails than a normal: more extreme values.', correct: true },
        ],
        explain: 'Excess kurtosis compares the weight of the tails with that of the normal, which has 0. Skewness is measured by $g_1$, not $g_2$.',
      },
      {
        prompt: 'You train a regression network with L1 loss (absolute error). If for the same input the response can take very different values, what does it tend to predict?',
        options: [{ text: 'The conditional mean.' }, { text: 'The conditional median.', correct: true }, { text: 'The most frequent value, the mode.' }],
        explain: String.raw`The value $c$ that minimizes $\mathbb{E}\,|Y - c|$ is the median of $Y$. With squared error, the minimum is at the mean.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§3.1 (robustness and resistance; quantiles and order statistics) and §3.2 (measures of location, spread, symmetry and kurtosis, with resistant alternatives such as the trimmed mean, the MAD and the Yule–Kendall index).' },
      { book: 'pml1', where: '§2.2.5 (mean, variance and mode of a distribution), §2.2.6 (limitations of summary statistics: Anscombe’s quartet and the Datasaurus) and §5.1.5 (the mean and the median as optimal predictions under squared and absolute loss).' },
    ],
    extra: [
      { text: 'Hyndman, R. J. and Fan, Y. (1996). Sample quantiles in statistical packages. The American Statistician, 50(4), 361–365. Compares the definitions of the sample quantile used by statistical software.', url: 'https://doi.org/10.1080/00031305.1996.10473566' },
    ],
  },
};

export default content;
