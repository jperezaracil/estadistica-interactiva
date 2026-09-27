import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Dos formas de medir, a partir de datos, cómo varían juntas dos variables: la correlación de Pearson mide cuánto se parece la nube de puntos a una recta, y la de Spearman, cuánto se parece a una relación monótona.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Entrenas ocho modelos, de 1 a 128 millones de parámetros, duplicando el tamaño cada vez, y el error de test baja del 40 % al 3,5 %: cada vez que el modelo se hace cuatro veces mayor, el error se reduce a la mitad. La relación es perfecta, pero no es una recta. La correlación de Pearson entre tamaño y error es $-0{,}67$; la de Spearman, que solo mira el orden, es $-1$. Si tomas logaritmos de las dos variables, la relación se vuelve una recta y Pearson también da $-1$.` },
          { key: 'Pearson mide asociación lineal y cambia si transformas las variables de forma no lineal; Spearman mide asociación monótona y no cambia con ninguna transformación creciente. Ninguna de las dos mide dependencia en general.' },
        ],
      },
      {
        id: 'definiciones',
        title: 'Definiciones',
        blocks: [
          { p: String.raw`Para $n$ pares $(x_i, y_i)$, la **correlación de Pearson** es la versión muestral de $\operatorname{corr}(X, Y)$ (ver [[covariance-correlation]]):` },
          { math: String.raw`r = \frac{\sum_{i=1}^{n} (x_i - \bar x)(y_i - \bar y)}{\sqrt{\sum_{i=1}^{n} (x_i - \bar x)^2}\,\sqrt{\sum_{i=1}^{n} (y_i - \bar y)^2}}` },
          { p: String.raw`Cumple $-1 \le r \le 1$, vale $\pm 1$ solo si los puntos están exactamente sobre una recta y no cambia al pasar a otras unidades. En regresión lineal simple, $r^2$ es la fracción de la varianza de $y$ que explica la recta de mínimos cuadrados.` },
          { p: String.raw`La **correlación de Spearman**, $r_s$, es la de Pearson calculada sobre los rangos, es decir, sobre la posición de cada dato al ordenarlos. Sin empates se simplifica a $r_s = 1 - \frac{6\sum_i d_i^2}{n(n^2-1)}$, donde $d_i$ es la diferencia entre los rangos del par $i$. La **τ de Kendall** es otra medida basada en el orden: la proporción de pares de observaciones concordantes menos la de discordantes.` },
        ],
      },
      {
        id: 'comparacion',
        title: 'Pearson frente a Spearman',
        blocks: [
          {
            table: {
              head: ['Datos', 'Pearson', 'Spearman'],
              rows: [
                [String.raw`$y = x^3$, con $x = 1, \dots, 10$`, '0,93', '1'],
                [String.raw`$y = x^2$, con $x = -3, \dots, 3$`, '0', '0'],
                [String.raw`$x$ e $y$ con los valores del 1 al 9, ordenados de forma que $r = 0$, más el punto $(20;\ 20)$`, '0,77', '0,27'],
              ],
              numeric: [1, 2],
            },
          },
          { p: 'La primera fila muestra que Pearson infravalora una relación monótona pero curva. La segunda, que ninguna de las dos detecta una dependencia perfecta que no es monótona. La tercera, que un solo punto alejado puede fabricar una correlación de Pearson alta; Spearman, al usar rangos, es mucho más resistente.' },
        ],
      },
      {
        id: 'incertidumbre',
        title: 'Cuánto fiarse de r',
        blocks: [
          { p: String.raw`Con pocos datos, $r$ varía mucho de una muestra a otra. Suponiendo normalidad bivariante, el contraste de $\rho = 0$ usa el estadístico` },
          { math: String.raw`t = \frac{r\,\sqrt{n-2}}{\sqrt{1-r^2}} \;\sim\; t_{n-2} \quad \text{si } \rho = 0` },
          { p: String.raw`y el intervalo de confianza se obtiene con la transformación de Fisher, $z = \operatorname{artanh} r$, que es aproximadamente normal con desviación típica $1/\sqrt{n-3}$. Con $n = 10$ y $r = 0{,}6$, el p-valor bilateral es 0,067 y el intervalo al 95 % para $\rho$ va de $-0{,}05$ a $0{,}89$: los datos son compatibles tanto con ninguna correlación como con una muy fuerte. Con $n = 100$, en cambio, $r = 0{,}2$ ya da $p \approx 0{,}046$: significativo, pero una relación débil. Ver [[hypothesis-testing]] y [[confidence-intervals]].` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Si r = 0, las variables son independientes.»', fix: String.raw`Solo indica que no hay asociación lineal. Con $y = x^2$ y $x$ simétrico respecto a 0, $r = 0$ aunque $y$ depende por completo de $x$. La [[mutual-information|información mutua]], en cambio, solo vale 0 con independencia.` },
      { claim: '«Un r alto demuestra una relación fuerte en todos los datos.»', fix: 'Puede deberse a un solo punto alejado, como en la tabla: 0,77 con nueve puntos sin relación lineal y uno lejano. Dibuja siempre el diagrama de dispersión y compara con Spearman.' },
      { claim: '«La correlación es una propiedad fija de las dos variables.»', fix: String.raw`Depende de la población y del rango observado. Si dos variables con distribución normal bivariante tienen $\rho = 0{,}7$ y solo miras los casos con $x$ por encima de su media, la correlación en ese subgrupo baja a $0{,}51$. Pasa, por ejemplo, al comparar solo los mejores modelos de una búsqueda de hiperparámetros.` },
      { claim: '«Spearman siempre es mejor, porque es robusta.»', fix: String.raw`Solo capta relaciones monótonas y, si la relación es lineal con ruido normal, desaprovecha información: en muestras grandes, para la misma potencia al contrastar independencia necesita unas $\pi^2/9 \approx 1{,}10$ veces más datos que Pearson.` },
    ],
    dl: [
      { title: 'Métricas de evaluación.', text: 'Algunas tareas se evalúan con la correlación entre la predicción del modelo y una puntuación humana. En STS-B, del banco de pruebas GLUE, se usan Pearson y Spearman entre la similitud de frases predicha y la anotada; en similitud de palabras suele usarse Spearman, con la que solo importa ordenar bien los pares, no la escala.' },
      { title: 'Decorrelar representaciones.', text: 'En aprendizaje autosupervisado, Barlow Twins calcula sobre el lote la matriz de correlaciones de Pearson entre las características de dos vistas aumentadas de los mismos ejemplos y la empuja hacia la identidad: unos en la diagonal (invarianza a la aumentación) y ceros fuera de ella (características no redundantes).' },
      { title: 'Comparar configuraciones por su orden.', text: 'En búsqueda de hiperparámetros o de arquitecturas se usa la τ de Kendall o la correlación de Spearman para medir si una evaluación barata (pocas épocas, un modelo reducido) ordena las configuraciones igual que el entrenamiento completo. Si la correlación es alta, puedes descartar pronto las peores.' },
    ],
    quiz: [
      {
        prompt: String.raw`Para $x = -3, \dots, 3$ e $y = x^2$, la correlación de Pearson es 0. ¿Qué puedes concluir?`,
        options: [
          { text: 'Que $x$ e $y$ son independientes.' },
          { text: 'Que no hay asociación lineal, aunque puede haber otra dependencia.', correct: true },
          { text: 'Que hay un error de cálculo, porque $y$ depende de $x$.' },
        ],
        explain: 'Aquí $y$ está determinada por $x$, pero la relación no es lineal ni monótona: la mitad izquierda baja y la derecha sube, y sus contribuciones a la covarianza se cancelan.',
      },
      {
        prompt: 'Aplicas un logaritmo a una de las dos variables, que es positiva. ¿Qué correlaciones pueden cambiar?',
        options: [{ text: 'Solo la de Pearson.', correct: true }, { text: 'Solo la de Spearman.' }, { text: 'Las dos.' }],
        explain: 'El logaritmo es creciente, así que no cambia el orden de los datos ni, por tanto, sus rangos: Spearman queda igual. Pearson mide linealidad y en general cambia.',
      },
      {
        prompt: 'Con n = 10 pares obtienes r = 0,6. ¿Es significativamente distinta de 0 al 5 %?',
        options: [
          { text: 'Sí, porque 0,6 es una correlación alta.' },
          { text: 'No se puede saber sin conocer las unidades.' },
          { text: 'No: el p-valor bilateral es 0,067.', correct: true },
        ],
        explain: String.raw`$t = 0{,}6\sqrt{8}/\sqrt{1 - 0{,}36} \approx 2{,}12$ con 8 grados de libertad, que da $p \approx 0{,}067$. Con $n = 10$ hace falta $|r| > 0{,}63$ para rechazar al 5 %.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§3.5.1 (diagramas de dispersión y el cuarteto de Anscombe), §3.5.2 (correlación de Pearson: propiedades y falta de robustez), §3.5.3 (correlación de Spearman y τ de Kendall), §3.4.2 (transformación Z de Fisher) y §3.6.4 (matriz de correlaciones).' },
      { book: 'pml1', where: '§3.1.2 (coeficiente y matriz de correlación), §3.1.3–3.1.5 (incorrelación no implica independencia, correlación no implica causalidad, paradoja de Simpson) y §6.3.5 (la información mutua como coeficiente de correlación generalizado).' },
    ],
    extra: [
      { text: 'Spearman, C. (1904). The proof and measurement of association between two things. The American Journal of Psychology, 15(1), 72–101. El origen de la correlación de rangos.', url: 'https://doi.org/10.2307/1412159' },
      { text: 'Anscombe, F. J. (1973). Graphs in statistical analysis. The American Statistician, 27(1), 17–21. Cuatro conjuntos de datos con la misma correlación y aspectos muy distintos.', url: 'https://doi.org/10.1080/00031305.1973.10478966' },
    ],
  },
  en: {
    lede: 'Two ways of measuring, from data, how two variables vary together: Pearson correlation measures how much the point cloud resembles a straight line, and Spearman correlation, how much it resembles a monotonic relationship.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`You train eight models, from 1 to 128 million parameters, doubling the size each time, and the test error drops from 40% to 3.5%: every time the model gets four times larger, the error halves. The relationship is perfect, but it is not a straight line. The Pearson correlation between size and error is $-0.67$; the Spearman correlation, which only looks at the order, is $-1$. If you take logarithms of both variables, the relationship becomes a straight line and Pearson also gives $-1$.` },
          { key: 'Pearson measures linear association and changes when you transform the variables nonlinearly; Spearman measures monotonic association and does not change under any increasing transformation. Neither of them measures dependence in general.' },
        ],
      },
      {
        id: 'definitions',
        title: 'Definitions',
        blocks: [
          { p: String.raw`For $n$ pairs $(x_i, y_i)$, the **Pearson correlation** is the sample version of $\operatorname{corr}(X, Y)$ (see [[covariance-correlation]]):` },
          { math: String.raw`r = \frac{\sum_{i=1}^{n} (x_i - \bar x)(y_i - \bar y)}{\sqrt{\sum_{i=1}^{n} (x_i - \bar x)^2}\,\sqrt{\sum_{i=1}^{n} (y_i - \bar y)^2}}` },
          { p: String.raw`It satisfies $-1 \le r \le 1$, equals $\pm 1$ only if the points lie exactly on a line and does not change when you switch units. In simple linear regression, $r^2$ is the fraction of the variance of $y$ explained by the least-squares line.` },
          { p: String.raw`The **Spearman correlation**, $r_s$, is the Pearson correlation computed on the ranks, that is, on the position of each data point once sorted. Without ties it simplifies to $r_s = 1 - \frac{6\sum_i d_i^2}{n(n^2-1)}$, where $d_i$ is the difference between the ranks of pair $i$. **Kendall’s τ** is another order-based measure: the proportion of concordant pairs of observations minus that of discordant ones.` },
        ],
      },
      {
        id: 'comparison',
        title: 'Pearson versus Spearman',
        blocks: [
          {
            table: {
              head: ['Data', 'Pearson', 'Spearman'],
              rows: [
                [String.raw`$y = x^3$, with $x = 1, \dots, 10$`, '0.93', '1'],
                [String.raw`$y = x^2$, with $x = -3, \dots, 3$`, '0', '0'],
                [String.raw`$x$ and $y$ taking the values 1 to 9, ordered so that $r = 0$, plus the point $(20, 20)$`, '0.77', '0.27'],
              ],
              numeric: [1, 2],
            },
          },
          { p: 'The first row shows that Pearson underrates a relationship that is monotonic but curved. The second, that neither of them detects a perfect dependence that is not monotonic. The third, that a single distant point can manufacture a high Pearson correlation; Spearman, since it uses ranks, is much more resistant.' },
        ],
      },
      {
        id: 'uncertainty',
        title: 'How much to trust r',
        blocks: [
          { p: String.raw`With little data, $r$ varies a lot from one sample to another. Assuming bivariate normality, the test of $\rho = 0$ uses the statistic` },
          { math: String.raw`t = \frac{r\,\sqrt{n-2}}{\sqrt{1-r^2}} \;\sim\; t_{n-2} \quad \text{if } \rho = 0` },
          { p: String.raw`and the confidence interval comes from Fisher’s transformation, $z = \operatorname{artanh} r$, which is approximately normal with standard deviation $1/\sqrt{n-3}$. With $n = 10$ and $r = 0.6$, the two-sided p-value is 0.067 and the 95% interval for $\rho$ runs from $-0.05$ to $0.89$: the data are compatible both with no correlation and with a very strong one. With $n = 100$, on the other hand, $r = 0.2$ already gives $p \approx 0.046$: significant, but a weak relationship. See [[hypothesis-testing]] and [[confidence-intervals]].` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“If r = 0, the variables are independent.”', fix: String.raw`It only says there is no linear association. With $y = x^2$ and $x$ symmetric about 0, $r = 0$ even though $y$ depends entirely on $x$. The [[mutual-information|mutual information]], by contrast, is 0 only under independence.` },
      { claim: '“A high r proves a strong relationship across all the data.”', fix: 'It can be due to a single distant point, as in the table: 0.77 with nine points with no linear relationship and one far away. Always draw the scatter plot and compare with Spearman.' },
      { claim: '“Correlation is a fixed property of the two variables.”', fix: String.raw`It depends on the population and on the observed range. If two variables with a bivariate normal distribution have $\rho = 0.7$ and you only look at the cases with $x$ above its mean, the correlation in that subgroup drops to $0.51$. This happens, for example, when you compare only the best models of a hyperparameter search.` },
      { claim: '“Spearman is always better, because it is robust.”', fix: String.raw`It only captures monotonic relationships and, if the relationship is linear with normal noise, it wastes information: in large samples, for the same power when testing independence it needs about $\pi^2/9 \approx 1.10$ times as much data as Pearson.` },
    ],
    dl: [
      { title: 'Evaluation metrics.', text: 'Some tasks are evaluated with the correlation between the model’s prediction and a human score. In STS-B, from the GLUE benchmark, Pearson and Spearman are used between the predicted and the annotated sentence similarity; word similarity usually uses Spearman, for which only ranking the pairs correctly matters, not the scale.' },
      { title: 'Decorrelating representations.', text: 'In self-supervised learning, Barlow Twins computes over the batch the matrix of Pearson correlations between the features of two augmented views of the same examples and pushes it towards the identity: ones on the diagonal (invariance to augmentation) and zeros off it (non-redundant features).' },
      { title: 'Comparing configurations by their order.', text: 'In hyperparameter or architecture search, Kendall’s τ or the Spearman correlation is used to measure whether a cheap evaluation (a few epochs, a scaled-down model) ranks the configurations like full training does. If the correlation is high, you can discard the worst ones early.' },
    ],
    quiz: [
      {
        prompt: String.raw`For $x = -3, \dots, 3$ and $y = x^2$, the Pearson correlation is 0. What can you conclude?`,
        options: [
          { text: 'That $x$ and $y$ are independent.' },
          { text: 'That there is no linear association, although there may be another kind of dependence.', correct: true },
          { text: 'That there is a calculation error, because $y$ depends on $x$.' },
        ],
        explain: 'Here $y$ is determined by $x$, but the relationship is neither linear nor monotonic: the left half goes down and the right half goes up, and their contributions to the covariance cancel out.',
      },
      {
        prompt: 'You apply a logarithm to one of the two variables, which is positive. Which correlations can change?',
        options: [{ text: 'Only Pearson’s.', correct: true }, { text: 'Only Spearman’s.' }, { text: 'Both.' }],
        explain: 'The logarithm is increasing, so it does not change the order of the data and hence their ranks: Spearman stays the same. Pearson measures linearity and in general changes.',
      },
      {
        prompt: 'With n = 10 pairs you get r = 0.6. Is it significantly different from 0 at the 5% level?',
        options: [
          { text: 'Yes, because 0.6 is a high correlation.' },
          { text: 'You cannot tell without knowing the units.' },
          { text: 'No: the two-sided p-value is 0.067.', correct: true },
        ],
        explain: String.raw`$t = 0.6\sqrt{8}/\sqrt{1 - 0.36} \approx 2.12$ with 8 degrees of freedom, which gives $p \approx 0.067$. With $n = 10$ you need $|r| > 0.63$ to reject at 5%.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§3.5.1 (scatterplots and Anscombe’s quartet), §3.5.2 (Pearson correlation: properties and lack of robustness), §3.5.3 (Spearman rank correlation and Kendall’s τ), §3.4.2 (the Fisher Z transformation) and §3.6.4 (the correlation matrix).' },
      { book: 'pml1', where: '§3.1.2 (correlation coefficient and correlation matrix), §3.1.3–3.1.5 (uncorrelated does not imply independent, correlation does not imply causation, Simpson’s paradox) and §6.3.5 (mutual information as a generalized correlation coefficient).' },
    ],
    extra: [
      { text: 'Spearman, C. (1904). The proof and measurement of association between two things. The American Journal of Psychology, 15(1), 72–101. The origin of rank correlation.', url: 'https://doi.org/10.2307/1412159' },
      { text: 'Anscombe, F. J. (1973). Graphs in statistical analysis. The American Statistician, 27(1), 17–21. Four datasets with the same correlation and very different appearances.', url: 'https://doi.org/10.1080/00031305.1973.10478966' },
    ],
  },
};

export default content;
