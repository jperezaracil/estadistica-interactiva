import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Dos gráficos basados en cuantiles: el diagrama de caja resume y compara distribuciones de un vistazo, y el gráfico Q-Q comprueba si unos datos siguen un modelo, como la normal, y muestra dónde se apartan de él.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Has entrenado cinco configuraciones de una red con diez semillas cada una. Un diagrama de caja por configuración muestra a la vez el resultado típico (la mediana), la variabilidad entre semillas (la caja) y las semillas raras (puntos sueltos). Y si quieres saber si los residuos de tu modelo son normales, como supone la verosimilitud gaussiana asociada al error cuadrático, un gráfico Q-Q enfrenta sus cuantiles con los de una normal: si los puntos caen sobre una recta, encajan.' },
          { key: 'Los dos gráficos se construyen con cuantiles. El diagrama de caja resume una distribución en cinco números; el gráfico Q-Q compara los cuantiles de los datos con los de un modelo, y la forma en que se aparta de la recta dice cómo falla el modelo.' },
        ],
      },
      {
        id: 'diagrama-de-caja',
        title: 'El diagrama de caja',
        blocks: [
          { p: String.raw`La caja va del primer cuartil $Q_1$ al tercero $Q_3$, y una línea marca la mediana. En la versión de Tukey, la que usan por defecto las librerías habituales, los bigotes llegan hasta el dato más extremo dentro del intervalo` },
          { math: String.raw`\bigl[\,Q_1 - 1{,}5\,\mathrm{RIC};\; Q_3 + 1{,}5\,\mathrm{RIC}\,\bigr], \qquad \mathrm{RIC} = Q_3 - Q_1` },
          { p: 'y los datos que quedan fuera se dibujan uno a uno como posibles atípicos. Que un punto quede fuera no significa que sea un error: depende de las colas de la distribución. Con muestras grandes, la fracción de puntos que se dibujan aparte es:' },
          {
            table: {
              head: ['Distribución', 'Puntos fuera de los bigotes'],
              rows: [
                ['Uniforme', '0 %'],
                ['Normal', '0,70 %'],
                ['Exponencial', '4,8 %'],
                ['t de Student con 3 grados de libertad', '5,5 %'],
              ],
              numeric: [1],
            },
          },
          { p: 'En la normal, esos límites quedan a unas 2,70 desviaciones típicas de la media: en 1000 datos normales cabe esperar unos 7 puntos fuera sin que pase nada raro.' },
        ],
      },
      {
        id: 'grafico-qq',
        title: 'El gráfico Q-Q',
        blocks: [
          { p: String.raw`Ordena los datos, $x_{(1)} \le \dots \le x_{(n)}$, asigna a cada uno una probabilidad acumulada $p_i = (i - 0{,}5)/n$ (hay variantes parecidas) y dibuja los puntos` },
          { math: String.raw`\bigl(F^{-1}(p_i);\; x_{(i)}\bigr), \qquad i = 1, \dots, n` },
          { p: String.raw`donde $F^{-1}$ es la función cuantil del modelo, en el eje horizontal. Si los datos siguen el modelo, los puntos caen cerca de una recta. Para familias de posición y escala, como la normal, basta la normal estándar: si los datos son $\mathcal{N}(\mu, \sigma^2)$, la recta tiene pendiente $\sigma$ y ordenada en el origen $\mu$, así que no hace falta estimar los parámetros antes.` },
          {
            table: {
              head: ['Lo que ves', 'Lo que indica'],
              rows: [
                ['Puntos sobre la recta', 'El modelo describe bien la forma de los datos.'],
                ['Extremo izquierdo por debajo de la recta y derecho por encima', 'Colas más pesadas que las del modelo.'],
                ['Extremo izquierdo por encima y derecho por debajo', 'Colas más ligeras que las del modelo.'],
                ['Curva convexa: los dos extremos por encima', 'Asimetría a la derecha (cola larga de valores altos).'],
                ['Curva cóncava: los dos extremos por debajo', 'Asimetría a la izquierda.'],
                ['Escalones horizontales', 'Datos redondeados o discretos, con muchos valores repetidos.'],
              ],
            },
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Los puntos fuera de los bigotes son errores y hay que quitarlos.»', fix: 'El límite de 1,5 RIC es una convención. Con datos normales queda fuera el 0,7 % (unos 7 de cada 1000), y con datos asimétricos o de colas pesadas, muchos más. Investígalos antes de decidir nada.' },
      { claim: '«Si las cajas de dos grupos se solapan, la diferencia entre ellos no es significativa.»', fix: 'La caja muestra la dispersión de los datos, no la incertidumbre de la mediana. Con muchos datos, dos grupos pueden diferir claramente aunque sus cajas se solapen casi por completo. Para comparar, usa intervalos de confianza o un contraste: ver [[confidence-intervals]] y [[hypothesis-testing]].' },
      { claim: '«Un diagrama de caja muestra la forma de la distribución.»', fix: 'Solo muestra cinco números y los atípicos: una distribución con dos picos y otra con uno pueden tener la misma caja. Complétalo con un histograma, una KDE o un gráfico de violín: ver [[histograms-kde]].' },
      { claim: '«Si el gráfico Q-Q no es una recta perfecta, los datos no son normales.»', fix: 'Con pocos datos, los puntos se apartan de la recta por azar, sobre todo en los extremos; con muchísimos, se ven desviaciones mínimas que quizá no importan. Compáralo con gráficos de datos simulados del modelo y pregúntate si la desviación afecta a tu análisis.' },
    ],
    dl: [
      { title: 'Residuos de una red de regresión.', text: 'Un gráfico Q-Q de los residuos de validación frente a una normal dice si es razonable interpretar el error cuadrático como una verosimilitud gaussiana, es decir, suponer ruido gaussiano. Si las colas son más pesadas, unos pocos errores grandes dominan el gradiente, y una pérdida de Huber, una L1 o una verosimilitud t de Student pueden funcionar mejor: ver [[losses-likelihoods]].' },
      { title: 'Comparar ejecuciones.', text: 'Un diagrama de caja por configuración, con el resultado de cada semilla o de cada partición, muestra si la mejora de una configuración supera la variabilidad debida a la inicialización y al orden de los datos. Para una conclusión formal, usa un contraste de permutación: ver [[nonparametric-tests]].' },
      { title: 'Calibración de predicciones probabilísticas.', text: String.raw`Si una red predice una distribución completa, con función de distribución $F_i$ para el caso $i$, y está bien calibrada, los valores $u_i = F_i(y_i)$ son uniformes en $[0;\ 1]$. Un gráfico Q-Q de los $u_i$ frente a la uniforme, o su histograma (el histograma PIT), muestra si la red es demasiado confiada o demasiado prudente: ver [[calibration]].` },
    ],
    quiz: [
      {
        prompt: String.raw`En un diagrama de caja, $Q_1 = 10$ y $Q_3 = 18$. ¿Por encima de qué valor se dibuja aparte un dato?`,
        options: [{ text: '26' }, { text: '30', correct: true }, { text: '42' }],
        explain: String.raw`El RIC es $18 - 10 = 8$ y el límite superior, $Q_3 + 1{,}5 \cdot 8 = 30$. 26 sería $Q_3 + \mathrm{RIC}$, y 42, $Q_3 + 3\,\mathrm{RIC}$.`,
      },
      {
        prompt: 'En un gráfico Q-Q frente a la normal, los puntos del extremo izquierdo quedan por debajo de la recta y los del derecho, por encima. ¿Qué indica?',
        options: [
          { text: 'Colas más pesadas que las de la normal.', correct: true },
          { text: 'Colas más ligeras que las de la normal.' },
          { text: 'Asimetría a la izquierda.' },
        ],
        explain: 'Los valores más pequeños son más bajos, y los más grandes más altos, de lo que predice la normal: hay más valores extremos que en una normal.',
      },
      {
        prompt: 'En un gráfico Q-Q frente a la normal estándar, los puntos siguen una recta de pendiente 2 y ordenada en el origen 5. ¿Qué sugiere?',
        options: [
          { text: 'Que los datos no son normales, porque la pendiente no es 1.' },
          { text: 'Que son aproximadamente normales con media 2 y desviación típica 5.' },
          { text: 'Que son aproximadamente normales con media 5 y desviación típica 2.', correct: true },
        ],
        explain: String.raw`Si $X \sim \mathcal{N}(\mu, \sigma^2)$, sus cuantiles son $\mu + \sigma z_p$: la ordenada en el origen estima $\mu$ y la pendiente, $\sigma$.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§3.3.2–3.3.4 (diagrama de caja, gráfico esquemático con límites para atípicos y variantes con muescas o anchura variable), §4.5 (comparación gráfica de los datos con una distribución ajustada, con gráficos Q-Q y P-P) y §5.2.5 (contrastes de bondad de ajuste, entre ellos el de Filliben, basado en la correlación del gráfico Q-Q).' },
      { book: 'pml2', where: '§2.5.3 (transformación integral de probabilidad: por qué $F(X)$ es uniforme y cómo sirve para comparar datos con una distribución).' },
    ],
    extra: [
      { text: 'Wilk, M. B. y Gnanadesikan, R. (1968). Probability plotting methods for the analysis of data. Biometrika, 55(1), 1–17. El artículo clásico sobre los gráficos Q-Q y P-P.', url: 'https://doi.org/10.1093/biomet/55.1.1' },
      { text: 'McGill, R., Tukey, J. W. y Larsen, W. A. (1978). Variations of box plots. The American Statistician, 32(1), 12–16. Propone los diagramas de caja con muescas y de anchura variable.', url: 'https://doi.org/10.1080/00031305.1978.10479236' },
    ],
  },
  en: {
    lede: 'Two plots built on quantiles: the box plot summarizes and compares distributions at a glance, and the Q-Q plot checks whether data follow a model, such as the normal, and shows where they depart from it.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'You have trained five configurations of a network with ten seeds each. One box plot per configuration shows at once the typical result (the median), the variability across seeds (the box) and the odd seeds (separate points). And if you want to know whether your model’s residuals are normal, as the Gaussian likelihood behind squared error assumes, a Q-Q plot sets their quantiles against those of a normal: if the points fall on a straight line, they fit.' },
          { key: 'Both plots are built from quantiles. The box plot summarizes a distribution in five numbers; the Q-Q plot compares the quantiles of the data with those of a model, and the way it departs from the line tells you how the model fails.' },
        ],
      },
      {
        id: 'box-plot',
        title: 'The box plot',
        blocks: [
          { p: String.raw`The box runs from the first quartile $Q_1$ to the third $Q_3$, and a line marks the median. In Tukey’s version, the default in common libraries, the whiskers reach the most extreme data point inside the interval` },
          { math: String.raw`\bigl[\,Q_1 - 1.5\,\mathrm{IQR},\; Q_3 + 1.5\,\mathrm{IQR}\,\bigr], \qquad \mathrm{IQR} = Q_3 - Q_1` },
          { p: 'and the points outside it are drawn one by one as possible outliers. A point outside does not mean an error: it depends on the tails of the distribution. In large samples, the fraction of points drawn separately is:' },
          {
            table: {
              head: ['Distribution', 'Points beyond the whiskers'],
              rows: [
                ['Uniform', '0%'],
                ['Normal', '0.70%'],
                ['Exponential', '4.8%'],
                ['Student’s t with 3 degrees of freedom', '5.5%'],
              ],
              numeric: [1],
            },
          },
          { p: 'For the normal, those limits lie about 2.70 standard deviations from the mean: in 1000 normal data points you should expect about 7 points outside without anything being wrong.' },
        ],
      },
      {
        id: 'qq-plot',
        title: 'The Q-Q plot',
        blocks: [
          { p: String.raw`Sort the data, $x_{(1)} \le \dots \le x_{(n)}$, give each one a cumulative probability $p_i = (i - 0.5)/n$ (there are similar variants) and plot the points` },
          { math: String.raw`\bigl(F^{-1}(p_i),\; x_{(i)}\bigr), \qquad i = 1, \dots, n` },
          { p: String.raw`where $F^{-1}$ is the quantile function of the model, on the horizontal axis. If the data follow the model, the points fall close to a straight line. For location–scale families, such as the normal, the standard normal is enough: if the data are $\mathcal{N}(\mu, \sigma^2)$, the line has slope $\sigma$ and intercept $\mu$, so you do not need to estimate the parameters first.` },
          {
            table: {
              head: ['What you see', 'What it indicates'],
              rows: [
                ['Points on the line', 'The model describes the shape of the data well.'],
                ['Left end below the line and right end above it', 'Heavier tails than the model’s.'],
                ['Left end above and right end below', 'Lighter tails than the model’s.'],
                ['Convex curve: both ends above', 'Right skew (long tail of high values).'],
                ['Concave curve: both ends below', 'Left skew.'],
                ['Horizontal steps', 'Rounded or discrete data, with many repeated values.'],
              ],
            },
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '“Points beyond the whiskers are errors and should be removed.”', fix: 'The 1.5 IQR limit is a convention. With normal data 0.7% fall outside (about 7 in 1000), and with skewed or heavy-tailed data, many more. Investigate them before deciding anything.' },
      { claim: '“If the boxes of two groups overlap, the difference between them is not significant.”', fix: 'The box shows the spread of the data, not the uncertainty of the median. With a lot of data, two groups can differ clearly even if their boxes overlap almost completely. To compare them, use confidence intervals or a test: see [[confidence-intervals]] and [[hypothesis-testing]].' },
      { claim: '“A box plot shows the shape of the distribution.”', fix: 'It only shows five numbers and the outliers: a distribution with two peaks and one with a single peak can have the same box. Complement it with a histogram, a KDE or a violin plot: see [[histograms-kde]].' },
      { claim: '“If the Q-Q plot is not a perfect straight line, the data are not normal.”', fix: 'With little data, points depart from the line by chance, especially at the ends; with huge amounts of data, tiny departures become visible that may not matter. Compare with plots of data simulated from the model and ask whether the departure affects your analysis.' },
    ],
    dl: [
      { title: 'Residuals of a regression network.', text: 'A Q-Q plot of the validation residuals against a normal tells you whether it is reasonable to read squared error as a Gaussian likelihood, that is, to assume Gaussian noise. If the tails are heavier, a few large errors dominate the gradient, and a Huber loss, an L1 loss or a Student’s t likelihood may work better: see [[losses-likelihoods]].' },
      { title: 'Comparing runs.', text: 'One box plot per configuration, with the result of each seed or each fold, shows whether the improvement of a configuration exceeds the variability due to initialization and data order. For a formal conclusion, use a permutation test: see [[nonparametric-tests]].' },
      { title: 'Calibration of probabilistic predictions.', text: String.raw`If a network predicts a full distribution, with distribution function $F_i$ for case $i$, and it is well calibrated, the values $u_i = F_i(y_i)$ are uniform on $[0, 1]$. A Q-Q plot of the $u_i$ against the uniform, or their histogram (the PIT histogram), shows whether the network is overconfident or underconfident: see [[calibration]].` },
    ],
    quiz: [
      {
        prompt: String.raw`In a box plot, $Q_1 = 10$ and $Q_3 = 18$. Above which value is a data point drawn separately?`,
        options: [{ text: '26' }, { text: '30', correct: true }, { text: '42' }],
        explain: String.raw`The IQR is $18 - 10 = 8$ and the upper limit is $Q_3 + 1.5 \cdot 8 = 30$. 26 would be $Q_3 + \mathrm{IQR}$, and 42, $Q_3 + 3\,\mathrm{IQR}$.`,
      },
      {
        prompt: 'In a normal Q-Q plot, the points at the left end fall below the line and those at the right end above it. What does it indicate?',
        options: [
          { text: 'Heavier tails than the normal’s.', correct: true },
          { text: 'Lighter tails than the normal’s.' },
          { text: 'Left skew.' },
        ],
        explain: 'The smallest values are lower, and the largest higher, than the normal predicts: there are more extreme values than in a normal.',
      },
      {
        prompt: 'In a Q-Q plot against the standard normal, the points follow a line with slope 2 and intercept 5. What does it suggest?',
        options: [
          { text: 'That the data are not normal, because the slope is not 1.' },
          { text: 'That they are roughly normal with mean 2 and standard deviation 5.' },
          { text: 'That they are roughly normal with mean 5 and standard deviation 2.', correct: true },
        ],
        explain: String.raw`If $X \sim \mathcal{N}(\mu, \sigma^2)$, its quantiles are $\mu + \sigma z_p$: the intercept estimates $\mu$ and the slope, $\sigma$.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§3.3.2–3.3.4 (the boxplot, the schematic plot with its outlier limits, and notched or variable-width variants), §4.5 (graphical comparison of the data with a fitted distribution, with Q-Q and P-P plots) and §5.2.5 (goodness-of-fit tests, including Filliben’s test, based on the correlation of the Q-Q plot).' },
      { book: 'pml2', where: '§2.5.3 (the probability integral transform: why $F(X)$ is uniform and how it helps compare data with a distribution).' },
    ],
    extra: [
      { text: 'Wilk, M. B. and Gnanadesikan, R. (1968). Probability plotting methods for the analysis of data. Biometrika, 55(1), 1–17. The classic paper on Q-Q and P-P plots.', url: 'https://doi.org/10.1093/biomet/55.1.1' },
      { text: 'McGill, R., Tukey, J. W. and Larsen, W. A. (1978). Variations of box plots. The American Statistician, 32(1), 12–16. Proposes notched and variable-width box plots.', url: 'https://doi.org/10.1080/00031305.1978.10479236' },
    ],
  },
};

export default content;
