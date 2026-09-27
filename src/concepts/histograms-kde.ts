import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Un histograma y una estimación kernel de la densidad (KDE) muestran la forma de los datos: dónde se concentran, si hay varios picos, cómo son las colas. Los dos dependen de un parámetro de suavizado que eliges tú.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Piensa en los tiempos de respuesta de un servicio de inferencia: las peticiones que se sirven desde la caché son rápidas y las que ejecutan el modelo, lentas. La distribución tiene dos picos. Un histograma con pocas barras anchas puede fundirlos en uno; con muchas barras estrechas aparecen picos y huecos que son solo ruido. La KDE cambia las barras por una curva suave: coloca una pequeña campana sobre cada dato y las suma.' },
          { key: 'El histograma y la KDE estiman la densidad de la que vienen los datos. Lo que más cambia el resultado no es la forma de las barras o del kernel, sino su anchura: el ancho de barra en el histograma y el ancho de banda en la KDE.' },
        ],
      },
      {
        id: 'definiciones',
        title: 'Del histograma a la KDE',
        blocks: [
          { p: String.raw`Un **histograma de densidad** divide el eje en intervalos de ancho $h$; si $n_k$ de los $n$ datos caen en el intervalo $k$, dibuja sobre él una barra de altura $n_k/(nh)$. Así el área total es 1 y el área de cada barra es la fracción de datos que contiene.` },
          { p: String.raw`La **estimación kernel de la densidad** sustituye cada dato por un kernel $K$ (una densidad simétrica centrada en 0) escalado por el **ancho de banda** $h$:` },
          { math: String.raw`\hat f_h(x) = \frac{1}{n h}\sum_{i=1}^{n} K\!\left(\frac{x - x_i}{h}\right)` },
          { p: String.raw`Por ejemplo, con los datos 0, 1 y 3, kernel normal y $h = 1$, la estimación en $x = 1$ es $\tfrac{1}{3}\left[\varphi(1) + \varphi(0) + \varphi(-2)\right] \approx \tfrac{1}{3}(0{,}242 + 0{,}399 + 0{,}054) \approx 0{,}232$, donde $\varphi$ es la densidad normal estándar.` },
          { p: String.raw`La forma del kernel importa poco. La tabla da la eficiencia de varios kernels frente al de Epanechnikov, que es el óptimo en muestras grandes: con eficiencia 0,95 necesitas unas $1/0{,}95 \approx 1{,}05$ veces más datos para lograr el mismo error cuadrático integrado, usando en cada caso el mejor ancho de banda.` },
          {
            table: {
              head: ['Kernel', '$K(t)$', 'Eficiencia'],
              rows: [
                ['Epanechnikov', String.raw`$\tfrac{3}{4}(1 - t^2)$ si $|t| \le 1$`, '1'],
                ['Triangular', String.raw`$1 - |t|$ si $|t| \le 1$`, '0,986'],
                ['Gaussiano', String.raw`$\tfrac{1}{\sqrt{2\pi}}\,e^{-t^2/2}$`, '0,951'],
                ['Uniforme', String.raw`$\tfrac{1}{2}$ si $|t| \le 1$`, '0,930'],
              ],
              numeric: [2],
            },
          },
        ],
      },
      {
        id: 'ancho-de-banda',
        title: 'Elegir el ancho',
        blocks: [
          { p: String.raw`Un $h$ pequeño da una estimación con poco sesgo pero mucha varianza, llena de picos espurios; uno grande hace lo contrario: borra detalles y puede fundir modas. Dos reglas habituales son la de Freedman-Diaconis para el ancho de barra y la de referencia normal para la KDE con kernel gaussiano, que es la óptima si los datos son normales:` },
          { math: String.raw`h_{\text{hist}} = 2\,\mathrm{RIC}\; n^{-1/3}, \qquad h_{\text{KDE}} = \left(\tfrac{4}{3}\right)^{1/5} \hat\sigma\, n^{-1/5} \approx 1{,}06\,\hat\sigma\, n^{-1/5}` },
          { p: String.raw`Con el ancho óptimo, el error cuadrático integrado medio de la KDE decrece como $n^{-4/5}$, más deprisa que el del histograma ($n^{-2/3}$), aunque más despacio que el $n^{-1}$ de un modelo paramétrico correcto. En $d$ dimensiones, el de la KDE decrece como $n^{-4/(4+d)}$: con muchas dimensiones hacen falta cantidades enormes de datos.` },
          { p: String.raw`Si vas a usar la densidad estimada para algo más que mirarla, conviene elegir $h$ por validación cruzada, por ejemplo el que maximiza la verosimilitud de los datos que se dejan fuera al estimar.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«La altura de cada barra es la probabilidad de ese intervalo.»', fix: String.raw`En un histograma de densidad, la probabilidad es el área, altura por ancho, y las alturas pueden pasar de 1: si todos los datos caen en $[0;\ 0{,}1]$, la altura media sobre ese intervalo es 10.` },
      { claim: '«El ancho de banda por defecto de la librería sirve siempre.»', fix: 'Las reglas automáticas suponen datos parecidos a una normal. Con varias modas o colas largas tienden a suavizar de más y pueden fundir dos picos en uno. Prueba varios anchos o elígelo por validación cruzada.' },
      { claim: '«La KDE respeta el rango posible de los datos.»', fix: String.raw`Con un kernel gaussiano, la estimación da probabilidad a valores imposibles, como tiempos negativos o probabilidades fuera de $[0;\ 1]$. Transforma antes los datos (logaritmo, logit) y deshaz después la transformación, o usa una corrección de frontera como la reflexión.` },
      { claim: '«Con suficientes datos, la KDE funciona igual en cualquier dimensión.»', fix: String.raw`Su error decrece como $n^{-4/(4+d)}$: en dimensión alta casi todos los puntos están lejos de los demás y la estimación es mala con cualquier tamaño de muestra razonable. Para imágenes o texto se usan modelos paramétricos, como los generativos profundos.` },
    ],
    dl: [
      { title: 'Histogramas de activaciones y gradientes.', text: 'TensorBoard y herramientas parecidas muestran durante el entrenamiento histogramas de los pesos, las activaciones y los gradientes de cada capa. Un pico en 0 tras una ReLU es normal, pero si acapara casi toda la masa apunta a neuronas muertas; mucha masa cerca de ±1 tras una tanh, a saturación; y un histograma de gradientes que se estrecha capa a capa hacia la entrada, a gradientes que se desvanecen.' },
      { title: 'Calibración por intervalos.', text: 'El diagrama de fiabilidad y el error de calibración esperado (ECE) agrupan las predicciones según su confianza, en intervalos, como un histograma. El valor del ECE depende del número de intervalos y de si tienen igual ancho o igual número de ejemplos, igual que un histograma depende del ancho de barra: ver [[calibration]].' },
      { title: 'La atención como suavizado kernel.', text: String.raw`La atención softmax devuelve una media de los valores ponderada por la similitud entre la consulta y cada clave, igual que el estimador de Nadaraya-Watson, que sale de una KDE. Si las claves tienen norma constante, los pesos $\propto \exp(\mathbf{q}^\top \mathbf{k}_i/\tau)$ son los de un kernel gaussiano de ancho $\sqrt{\tau}$ aplicado a la distancia $\lVert \mathbf{q} - \mathbf{k}_i \rVert$.` },
    ],
    quiz: [
      {
        prompt: 'En un histograma de densidad, una barra de ancho 0,5 tiene altura 0,6. ¿Qué fracción de los datos cae en ese intervalo?',
        options: [{ text: '0,6' }, { text: '0,3', correct: true }, { text: '1,2' }],
        explain: String.raw`En un histograma de densidad, la fracción es el área de la barra: $0{,}5 \times 0{,}6 = 0{,}3$.`,
      },
      {
        prompt: 'Aumentas mucho el ancho de banda de una KDE. ¿Qué ocurre?',
        options: [
          { text: 'Aparecen más picos.' },
          { text: 'La curva deja de integrar 1.' },
          { text: 'La curva se suaviza y dos modas cercanas pueden fundirse en una.', correct: true },
        ],
        explain: 'Un ancho mayor promedia sobre más datos: menos varianza y más sesgo. La integral sigue valiendo 1, porque cada kernel escalado es una densidad.',
      },
      {
        prompt: 'Con la regla de referencia normal, ¿cómo cambia el ancho de banda si tienes 32 veces más datos?',
        options: [{ text: 'Se divide entre 2.', correct: true }, { text: 'Se divide entre 32.' }, { text: String.raw`Se divide entre $\sqrt{32} \approx 5{,}7$.` }],
        explain: String.raw`El ancho es proporcional a $n^{-1/5}$, y $32^{1/5} = 2$.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§3.3.5 (histogramas y elección del ancho de barra) y §3.3.6 (suavizado kernel: kernels habituales, ancho de banda, estimación multivariante, gráficos de violín y el estimador de Nadaraya-Watson).' },
      { book: 'pml1', where: '§16.3 (estimación kernel de la densidad: kernels, estimador de ventana de Parzen, elección del ancho de banda y regresión kernel) y §15.4.2 (la atención como regresión kernel no paramétrica).' },
    ],
    extra: [
      { text: 'Rosenblatt, M. (1956). Remarks on some nonparametric estimates of a density function. The Annals of Mathematical Statistics, 27(3), 832–837. Propone los estimadores kernel de la densidad.', url: 'https://doi.org/10.1214/aoms/1177728190' },
      { text: 'Parzen, E. (1962). On estimation of a probability density function and mode. The Annals of Mathematical Statistics, 33(3), 1065–1076. Estudia su consistencia y su normalidad asintótica; de ahí el nombre de ventana de Parzen.', url: 'https://doi.org/10.1214/aoms/1177704472' },
    ],
  },
  en: {
    lede: 'A histogram and a kernel density estimate (KDE) show the shape of the data: where they concentrate, whether there are several peaks, what the tails look like. Both depend on a smoothing parameter that you choose.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'Think of the response times of an inference service: requests served from the cache are fast and those that run the model are slow. The distribution has two peaks. A histogram with a few wide bars can merge them into one; with many narrow bars, peaks and gaps appear that are just noise. The KDE replaces the bars with a smooth curve: it places a small bump on each data point and adds them up.' },
          { key: 'The histogram and the KDE estimate the density the data come from. What changes the result most is not the shape of the bars or of the kernel, but their width: the bin width in the histogram and the bandwidth in the KDE.' },
        ],
      },
      {
        id: 'definitions',
        title: 'From histogram to KDE',
        blocks: [
          { p: String.raw`A **density histogram** splits the axis into bins of width $h$; if $n_k$ of the $n$ data points fall in bin $k$, it draws a bar of height $n_k/(nh)$ over it. The total area is then 1, and the area of each bar is the fraction of data it contains.` },
          { p: String.raw`The **kernel density estimate** replaces each data point with a kernel $K$ (a symmetric density centered at 0) scaled by the **bandwidth** $h$:` },
          { math: String.raw`\hat f_h(x) = \frac{1}{n h}\sum_{i=1}^{n} K\!\left(\frac{x - x_i}{h}\right)` },
          { p: String.raw`For example, with the data 0, 1 and 3, a normal kernel and $h = 1$, the estimate at $x = 1$ is $\tfrac{1}{3}\left[\varphi(1) + \varphi(0) + \varphi(-2)\right] \approx \tfrac{1}{3}(0.242 + 0.399 + 0.054) \approx 0.232$, where $\varphi$ is the standard normal density.` },
          { p: String.raw`The shape of the kernel matters little. The table gives the efficiency of several kernels relative to the Epanechnikov kernel, which is optimal in large samples: with efficiency 0.95 you need about $1/0.95 \approx 1.05$ times as much data to reach the same integrated squared error, using the best bandwidth in each case.` },
          {
            table: {
              head: ['Kernel', '$K(t)$', 'Efficiency'],
              rows: [
                ['Epanechnikov', String.raw`$\tfrac{3}{4}(1 - t^2)$ if $|t| \le 1$`, '1'],
                ['Triangular', String.raw`$1 - |t|$ if $|t| \le 1$`, '0.986'],
                ['Gaussian', String.raw`$\tfrac{1}{\sqrt{2\pi}}\,e^{-t^2/2}$`, '0.951'],
                ['Uniform', String.raw`$\tfrac{1}{2}$ if $|t| \le 1$`, '0.930'],
              ],
              numeric: [2],
            },
          },
        ],
      },
      {
        id: 'bandwidth',
        title: 'Choosing the width',
        blocks: [
          { p: String.raw`A small $h$ gives an estimate with little bias but a lot of variance, full of spurious peaks; a large one does the opposite: it erases details and can merge modes. Two common rules are the Freedman–Diaconis rule for the bin width and the normal reference rule for a KDE with a Gaussian kernel, which is optimal if the data are normal:` },
          { math: String.raw`h_{\text{hist}} = 2\,\mathrm{IQR}\; n^{-1/3}, \qquad h_{\text{KDE}} = \left(\tfrac{4}{3}\right)^{1/5} \hat\sigma\, n^{-1/5} \approx 1.06\,\hat\sigma\, n^{-1/5}` },
          { p: String.raw`With the optimal width, the mean integrated squared error of the KDE decreases as $n^{-4/5}$, faster than that of the histogram ($n^{-2/3}$), though more slowly than the $n^{-1}$ of a correct parametric model. In $d$ dimensions, the KDE’s error decreases as $n^{-4/(4+d)}$: with many dimensions you need enormous amounts of data.` },
          { p: String.raw`If you will use the estimated density for more than looking at it, choose $h$ by cross-validation, for example the one that maximizes the likelihood of the data left out of the estimate.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“The height of each bar is the probability of that bin.”', fix: String.raw`In a density histogram, probability is area, height times width, and heights can exceed 1: if all the data fall in $[0, 0.1]$, the average height over that interval is 10.` },
      { claim: '“The library’s default bandwidth always works.”', fix: 'Automatic rules assume data that look roughly normal. With several modes or long tails they tend to oversmooth and can merge two peaks into one. Try several widths or choose it by cross-validation.' },
      { claim: '“A KDE respects the possible range of the data.”', fix: String.raw`With a Gaussian kernel, the estimate gives probability to impossible values, such as negative times or probabilities outside $[0, 1]$. Transform the data first (logarithm, logit) and undo the transformation afterwards, or use a boundary correction such as reflection.` },
      { claim: '“With enough data, a KDE works equally well in any dimension.”', fix: String.raw`Its error decreases as $n^{-4/(4+d)}$: in high dimension almost every point is far from all the others, and the estimate is poor for any reasonable sample size. For images or text one uses parametric models, such as deep generative models.` },
    ],
    dl: [
      { title: 'Histograms of activations and gradients.', text: 'TensorBoard and similar tools show histograms of the weights, activations and gradients of each layer during training. A spike at 0 after a ReLU is normal, but if it takes almost all the mass it points to dead neurons; a lot of mass near ±1 after a tanh, to saturation; and a gradient histogram that narrows layer by layer towards the input, to vanishing gradients.' },
      { title: 'Calibration by bins.', text: 'The reliability diagram and the expected calibration error (ECE) group predictions by their confidence into bins, like a histogram. The value of the ECE depends on the number of bins and on whether they have equal width or an equal number of examples, just as a histogram depends on the bin width: see [[calibration]].' },
      { title: 'Attention as kernel smoothing.', text: String.raw`Softmax attention returns an average of the values weighted by the similarity between the query and each key, just like the Nadaraya–Watson estimator, which comes from a KDE. If the keys have constant norm, the weights $\propto \exp(\mathbf{q}^\top \mathbf{k}_i/\tau)$ are those of a Gaussian kernel of width $\sqrt{\tau}$ applied to the distance $\lVert \mathbf{q} - \mathbf{k}_i \rVert$.` },
    ],
    quiz: [
      {
        prompt: 'In a density histogram, a bar of width 0.5 has height 0.6. What fraction of the data falls in that bin?',
        options: [{ text: '0.6' }, { text: '0.3', correct: true }, { text: '1.2' }],
        explain: String.raw`In a density histogram, the fraction is the area of the bar: $0.5 \times 0.6 = 0.3$.`,
      },
      {
        prompt: 'You increase the bandwidth of a KDE a lot. What happens?',
        options: [
          { text: 'More peaks appear.' },
          { text: 'The curve no longer integrates to 1.' },
          { text: 'The curve gets smoother and two nearby modes can merge into one.', correct: true },
        ],
        explain: 'A larger width averages over more data: less variance and more bias. The integral is still 1, because each scaled kernel is a density.',
      },
      {
        prompt: 'With the normal reference rule, how does the bandwidth change if you have 32 times as much data?',
        options: [{ text: 'It is divided by 2.', correct: true }, { text: 'It is divided by 32.' }, { text: String.raw`It is divided by $\sqrt{32} \approx 5.7$.` }],
        explain: String.raw`The width is proportional to $n^{-1/5}$, and $32^{1/5} = 2$.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§3.3.5 (histograms and the choice of bin width) and §3.3.6 (kernel density smoothing: common kernels, bandwidth, multivariate estimates, violin plots and the Nadaraya–Watson estimator).' },
      { book: 'pml1', where: '§16.3 (kernel density estimation: kernels, the Parzen window estimator, choice of bandwidth and kernel regression) and §15.4.2 (attention as non-parametric kernel regression).' },
    ],
    extra: [
      { text: 'Rosenblatt, M. (1956). Remarks on some nonparametric estimates of a density function. The Annals of Mathematical Statistics, 27(3), 832–837. Proposes kernel density estimators.', url: 'https://doi.org/10.1214/aoms/1177728190' },
      { text: 'Parzen, E. (1962). On estimation of a probability density function and mode. The Annals of Mathematical Statistics, 33(3), 1065–1076. Studies their consistency and asymptotic normality; hence the name Parzen window.', url: 'https://doi.org/10.1214/aoms/1177704472' },
    ],
  },
};

export default content;
