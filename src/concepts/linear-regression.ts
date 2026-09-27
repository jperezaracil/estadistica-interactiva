import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Modelar una respuesta como una combinación lineal de las entradas más un ruido. Si el ruido es gaussiano, independiente y de varianza constante, ajustar por mínimos cuadrados es exactamente estimar por máxima verosimilitud.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Quieres predecir la potencia de una planta fotovoltaica a partir de la irradiancia y de la temperatura de los paneles. La regresión lineal supone que la potencia es una suma ponderada de las entradas más un ruido que recoge todo lo demás: nubes, suciedad, errores de medida. Los pesos se eligen minimizando la suma de los cuadrados de los residuos. ¿Por qué cuadrados? Porque, si el ruido es normal, independiente y de varianza constante, esos pesos son los que hacen más probables los datos.' },
          { key: 'Mínimos cuadrados es máxima verosimilitud con ruido gaussiano, independiente y de varianza constante. Si esas hipótesis fallan, el ajuste se puede calcular igual, pero deja de ser el EMV y sus errores estándar pueden engañar.' },
        ],
      },
      {
        id: 'modelo',
        title: 'El modelo',
        blocks: [
          { p: String.raw`Con $n$ observaciones y $p$ coeficientes, cada respuesta es una combinación lineal de sus entradas más un ruido:` },
          { math: String.raw`y_i = \mathbf{w}^\top \mathbf{x}_i + \varepsilon_i, \qquad \varepsilon_i \sim \mathcal{N}(0, \sigma^2) \ \text{independientes}` },
          { p: String.raw`El vector $\mathbf{x}_i$ incluye un 1 para la ordenada en el origen. La log-verosimilitud negativa es $\frac{1}{2\sigma^2}\sum_i (y_i - \mathbf{w}^\top\mathbf{x}_i)^2 + \frac{n}{2}\log(2\pi\sigma^2)$, así que, sea cual sea $\sigma$, el mejor $\mathbf{w}$ minimiza la suma de cuadrados de los residuos ($\mathrm{RSS}$). Si las columnas de la matriz de diseño $X$ son linealmente independientes, la solución es única:` },
          { math: String.raw`\hat{\mathbf{w}} = (X^\top X)^{-1} X^\top \mathbf{y}, \qquad \hat\sigma^2 = \frac{1}{n}\sum_{i=1}^{n} \big(y_i - \hat{\mathbf{w}}^\top \mathbf{x}_i\big)^2` },
          { p: String.raw`«Lineal» se refiere a los parámetros, no a las entradas: puedes usar $x^2$, $\log x$ o productos de variables como columnas de $X$ y el modelo sigue siendo una regresión lineal.` },
        ],
      },
      {
        id: 'propiedades',
        title: 'Propiedades e interpretación',
        blocks: [
          {
            list: [
              String.raw`**Coeficientes:** $w_j$ es el cambio esperado en $y$ cuando $x_j$ aumenta una unidad y las demás entradas no cambian.`,
              String.raw`**Bondad de ajuste:** $R^2 = 1 - \mathrm{RSS}/\mathrm{TSS}$, con $\mathrm{TSS} = \sum_i (y_i - \bar y)^2$, es la fracción de la varianza de $y$ que el modelo explica en la muestra. En entrenamiento nunca baja al añadir variables.`,
              String.raw`**Varianza del ruido:** si el modelo es correcto, $\mathbb{E}[\mathrm{RSS}] = (n-p)\,\sigma^2$, así que $\hat\sigma^2$ está sesgado a la baja y se usa $\mathrm{RSS}/(n-p)$. Con 10 coeficientes y 20 datos, $\mathrm{RSS}/n$ vale en promedio la mitad de $\sigma^2$.`,
              String.raw`**Incertidumbre:** cada coeficiente tiene un error estándar; con ruido gaussiano, de ahí salen [[confidence-intervals|intervalos de confianza]] y [[hypothesis-testing|contrastes]] $t$ exactos. El intervalo de predicción de una observación nueva es más ancho que el de la media, porque incluye además el ruido.`,
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Regresión lineal significa ajustar una recta.»', fix: String.raw`Significa lineal en los parámetros. Con $x$, $x^2$ y $x^3$ como entradas ajustas una cúbica, y sigue siendo regresión lineal: la misma fórmula y las mismas propiedades.` },
      { claim: '«Para usar mínimos cuadrados, los datos tienen que ser normales.»', fix: String.raw`Las hipótesis son sobre el ruido condicionado a las entradas, no sobre la distribución de $x$ o de $y$. Sin normalidad, los coeficientes siguen siendo insesgados si el modelo es correcto; la normalidad hace falta para que sean el EMV y para que los intervalos $t$ sean exactos con pocos datos.` },
      { claim: String.raw`«Un $R^2$ alto demuestra que el modelo es correcto.»`, fix: 'Solo mide la varianza explicada en la muestra. Puede ser alto con una relación claramente curva o con residuos correlacionados, y no dice nada sobre causalidad. Mira los residuos y evalúa con datos nuevos: ver [[cross-validation]].' },
      { claim: '«Si un coeficiente es grande, esa variable es la más importante.»', fix: 'Su tamaño depende de las unidades: medir una distancia en kilómetros en vez de en metros multiplica su coeficiente por 1000. Con entradas correlacionadas, además, puede cambiar mucho, incluso de signo, al añadir o quitar variables. Estandariza las entradas y mira los errores estándar.' },
    ],
    dl: [
      { title: 'La última capa.', text: 'Una red de regresión entrenada con MSE suele terminar en una capa lineal: con las características de la penúltima capa fijas, esa capa es una regresión lineal y sus pesos óptimos son los de mínimos cuadrados. Algunos métodos de incertidumbre tratan de forma bayesiana solo esa capa.' },
      { title: 'Entradas en la misma escala.', text: String.raw`La MSE de un modelo lineal es un cuenco cuadrático cuya forma depende de $X^\top X$. Con entradas de escalas muy distintas, el cuenco es muy alargado y el descenso de gradiente avanza despacio; estandarizarlas suele redondearlo. Es una de las razones para estandarizar las entradas de una red.` },
      { title: 'Predecir la media.', text: String.raw`Con MSE, el óptimo es la media condicional $\mathbb{E}[y \mid \mathbf{x}]$. Si una misma entrada admite varias respuestas, la red predice su promedio, que puede no parecerse a ninguna (fotogramas borrosos al predecir vídeo, por ejemplo). Ver [[losses-likelihoods]].` },
    ],
    quiz: [
      {
        prompt: String.raw`En una regresión lineal con ruido gaussiano de varianza $\sigma^2$ conocida, ¿qué pesos da la máxima verosimilitud?`,
        options: [
          { text: 'Los que minimizan la suma de los errores absolutos.' },
          { text: 'Los que minimizan la suma de los errores al cuadrado.', correct: true },
          { text: String.raw`Depende del valor de $\sigma^2$.` },
        ],
        explain: String.raw`La log-verosimilitud negativa es $\mathrm{RSS}/(2\sigma^2)$ más una constante: $\sigma^2$ solo escala el objetivo y no mueve su mínimo. Los errores absolutos corresponderían a un ruido de Laplace.`,
      },
      {
        prompt: String.raw`Ajustas $y = w_0 + w_1 x + w_2 x^2$ por mínimos cuadrados. ¿Es una regresión lineal?`,
        options: [
          { text: String.raw`Sí, porque es lineal en $w_0$, $w_1$ y $w_2$.`, correct: true },
          { text: 'No, porque el resultado es una parábola.' },
          { text: String.raw`Solo si $x$ sigue una distribución normal.` },
        ],
        explain: String.raw`Basta usar $x$ y $x^2$ como columnas de la matriz de diseño: la solución sigue siendo $(X^\top X)^{-1}X^\top\mathbf{y}$.`,
      },
      {
        prompt: String.raw`Ajustas 10 coeficientes con 20 datos y obtienes $\mathrm{RSS}/n = 2$. ¿Qué estimación insesgada de $\sigma^2$ corresponde?`,
        options: [{ text: '2' }, { text: '1' }, { text: '4', correct: true }],
        explain: String.raw`$\mathrm{RSS} = 40$ y, como $\mathbb{E}[\mathrm{RSS}] = (n-p)\,\sigma^2$, la estimación insesgada es $40/(20-10) = 4$. Dividir entre $n$ la reduce a la mitad.`,
      },
    ],
    further: [
      { book: 'pml1', where: String.raw`§11.2 (mínimos cuadrados: ecuaciones normales, otras formas de calcular el EMV, residuos y $R^2$) y §11.3 (regresión ridge como estimación MAP).` },
      { book: 'wilks', where: '§7.2 (regresión simple: residuos, tabla ANOVA, bondad de ajuste, distribución muestral de los coeficientes e intervalos de predicción) y §7.3 (regresión múltiple y predictores derivados).' },
    ],
  },
  en: {
    lede: 'Modeling a response as a linear combination of the inputs plus noise. If the noise is Gaussian, independent and of constant variance, fitting by least squares is exactly maximum likelihood estimation.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'You want to predict the power output of a solar plant from the irradiance and the panel temperature. Linear regression assumes that the output is a weighted sum of the inputs plus a noise term that collects everything else: clouds, dirt, measurement errors. The weights are chosen by minimizing the sum of squared residuals. Why squares? Because, if the noise is normal, independent and of constant variance, those weights are the ones that make the data most probable.' },
          { key: 'Least squares is maximum likelihood with Gaussian, independent, constant-variance noise. If those assumptions fail, the fit can still be computed, but it is no longer the MLE and its standard errors can mislead.' },
        ],
      },
      {
        id: 'model',
        title: 'The model',
        blocks: [
          { p: String.raw`With $n$ observations and $p$ coefficients, each response is a linear combination of its inputs plus noise:` },
          { math: String.raw`y_i = \mathbf{w}^\top \mathbf{x}_i + \varepsilon_i, \qquad \varepsilon_i \sim \mathcal{N}(0, \sigma^2) \ \text{independent}` },
          { p: String.raw`The vector $\mathbf{x}_i$ includes a 1 for the intercept. The negative log-likelihood is $\frac{1}{2\sigma^2}\sum_i (y_i - \mathbf{w}^\top\mathbf{x}_i)^2 + \frac{n}{2}\log(2\pi\sigma^2)$, so, whatever $\sigma$ is, the best $\mathbf{w}$ minimizes the residual sum of squares ($\mathrm{RSS}$). If the columns of the design matrix $X$ are linearly independent, the solution is unique:` },
          { math: String.raw`\hat{\mathbf{w}} = (X^\top X)^{-1} X^\top \mathbf{y}, \qquad \hat\sigma^2 = \frac{1}{n}\sum_{i=1}^{n} \big(y_i - \hat{\mathbf{w}}^\top \mathbf{x}_i\big)^2` },
          { p: String.raw`“Linear” refers to the parameters, not to the inputs: you can use $x^2$, $\log x$ or products of variables as columns of $X$ and the model is still a linear regression.` },
        ],
      },
      {
        id: 'properties',
        title: 'Properties and interpretation',
        blocks: [
          {
            list: [
              String.raw`**Coefficients:** $w_j$ is the expected change in $y$ when $x_j$ increases by one unit and the other inputs stay fixed.`,
              String.raw`**Goodness of fit:** $R^2 = 1 - \mathrm{RSS}/\mathrm{TSS}$, with $\mathrm{TSS} = \sum_i (y_i - \bar y)^2$, is the fraction of the variance of $y$ that the model explains in the sample. On the training data it never decreases when you add variables.`,
              String.raw`**Noise variance:** if the model is correct, $\mathbb{E}[\mathrm{RSS}] = (n-p)\,\sigma^2$, so $\hat\sigma^2$ is biased downwards and $\mathrm{RSS}/(n-p)$ is used instead. With 10 coefficients and 20 data points, $\mathrm{RSS}/n$ is on average half of $\sigma^2$.`,
              String.raw`**Uncertainty:** each coefficient has a standard error; with Gaussian noise, it gives exact [[confidence-intervals|confidence intervals]] and $t$ [[hypothesis-testing|tests]]. The prediction interval for a new observation is wider than the one for the mean, because it also includes the noise.`,
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '“Linear regression means fitting a straight line.”', fix: String.raw`It means linear in the parameters. With $x$, $x^2$ and $x^3$ as inputs you fit a cubic, and it is still linear regression: same formula, same properties.` },
      { claim: '“To use least squares, the data must be normal.”', fix: String.raw`The assumptions are about the noise given the inputs, not about the distribution of $x$ or $y$. Without normality, the coefficients are still unbiased if the model is correct; normality is needed for them to be the MLE and for $t$ intervals to be exact with little data.` },
      { claim: String.raw`“A high $R^2$ proves that the model is right.”`, fix: 'It only measures the variance explained in the sample. It can be high with a clearly curved relationship or with correlated residuals, and it says nothing about causation. Look at the residuals and evaluate on new data: see [[cross-validation]].' },
      { claim: '“If a coefficient is large, that variable is the most important one.”', fix: 'Its size depends on the units: measuring a distance in kilometers instead of meters multiplies its coefficient by 1000. With correlated inputs it can also change a lot, even flip sign, when you add or remove variables. Standardize the inputs and look at the standard errors.' },
    ],
    dl: [
      { title: 'The last layer.', text: 'A regression network trained with MSE usually ends in a linear layer: with the features of the penultimate layer held fixed, that layer is a linear regression and its optimal weights are the least-squares ones. Some uncertainty methods treat only that layer in a Bayesian way.' },
      { title: 'Inputs on the same scale.', text: String.raw`The MSE of a linear model is a quadratic bowl whose shape depends on $X^\top X$. With inputs on very different scales, the bowl is very elongated and gradient descent progresses slowly; standardizing them usually makes it rounder. It is one of the reasons to standardize the inputs of a network.` },
      { title: 'Predicting the mean.', text: String.raw`With MSE, the optimum is the conditional mean $\mathbb{E}[y \mid \mathbf{x}]$. If the same input admits several responses, the network predicts their average, which may look like none of them (blurry frames when predicting video, for example). See [[losses-likelihoods]].` },
    ],
    quiz: [
      {
        prompt: String.raw`In a linear regression with Gaussian noise of known variance $\sigma^2$, which weights does maximum likelihood give?`,
        options: [
          { text: 'The ones that minimize the sum of absolute errors.' },
          { text: 'The ones that minimize the sum of squared errors.', correct: true },
          { text: String.raw`It depends on the value of $\sigma^2$.` },
        ],
        explain: String.raw`The negative log-likelihood is $\mathrm{RSS}/(2\sigma^2)$ plus a constant: $\sigma^2$ only scales the objective and does not move its minimum. Absolute errors would correspond to Laplace noise.`,
      },
      {
        prompt: String.raw`You fit $y = w_0 + w_1 x + w_2 x^2$ by least squares. Is it a linear regression?`,
        options: [
          { text: String.raw`Yes, because it is linear in $w_0$, $w_1$ and $w_2$.`, correct: true },
          { text: 'No, because the result is a parabola.' },
          { text: String.raw`Only if $x$ follows a normal distribution.` },
        ],
        explain: String.raw`Just use $x$ and $x^2$ as columns of the design matrix: the solution is still $(X^\top X)^{-1}X^\top\mathbf{y}$.`,
      },
      {
        prompt: String.raw`You fit 10 coefficients to 20 data points and get $\mathrm{RSS}/n = 2$. What is the corresponding unbiased estimate of $\sigma^2$?`,
        options: [{ text: '2' }, { text: '1' }, { text: '4', correct: true }],
        explain: String.raw`$\mathrm{RSS} = 40$ and, since $\mathbb{E}[\mathrm{RSS}] = (n-p)\,\sigma^2$, the unbiased estimate is $40/(20-10) = 4$. Dividing by $n$ halves it.`,
      },
    ],
    further: [
      { book: 'pml1', where: String.raw`§11.2 (least squares: normal equations, other ways of computing the MLE, residuals and $R^2$) and §11.3 (ridge regression as MAP estimation).` },
      { book: 'wilks', where: '§7.2 (simple regression: residuals, ANOVA table, goodness of fit, sampling distributions of the coefficients and prediction intervals) and §7.3 (multiple regression and derived predictors).' },
    ],
  },
};

export default content;
