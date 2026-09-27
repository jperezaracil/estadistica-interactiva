import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Entrenar un modelo es elegir los parámetros que minimizan la pérdida media sobre los datos de entrenamiento: el riesgo empírico. Lo que importa, sin embargo, es la pérdida esperada con datos nuevos, y la función de pérdida decide qué aprende el modelo.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Quieres predecir la demanda eléctrica de mañana. Primero decides cuánto cuesta cada error: ¿es igual de grave quedarse corto que pasarse?, ¿un error doble es el doble de malo o cuatro veces peor? Esa es la **función de pérdida**. Lo ideal sería minimizar la pérdida media sobre todos los días futuros, pero solo tienes los pasados: minimizas la media sobre ellos y confías en que las dos medias se parezcan.' },
          { key: 'El riesgo empírico es una estimación del riesgo real hecha con los datos de entrenamiento. Al minimizarlo con esos mismos datos, la estimación se vuelve optimista: por eso el error se mide con datos aparte.' },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { p: String.raw`Una pérdida $\ell(y, \hat y)$ mide el coste de predecir $\hat y$ cuando el valor real es $y$. El **riesgo** de un modelo $f_\theta$ es su pérdida esperada sobre la distribución real de los datos, que no conoces; el **riesgo empírico** es su media sobre los $n$ ejemplos de entrenamiento:` },
          { math: String.raw`R(\theta) = \mathbb{E}_{(x, y)}\big[\ell(y, f_\theta(x))\big], \qquad \hat R_n(\theta) = \frac{1}{n}\sum_{i=1}^{n} \ell\big(y_i, f_\theta(x_i)\big)` },
          { p: String.raw`La minimización del riesgo empírico (ERM) elige $\hat\theta = \arg\min_\theta \hat R_n(\theta)$. Si la pérdida es la log-verosimilitud negativa, $\ell = -\log p(y \mid x, \theta)$, la ERM coincide con la [[mle|máxima verosimilitud]]. Para un $\theta$ fijo, $\hat R_n(\theta)$ es un estimador insesgado de $R(\theta)$ si los ejemplos son una muestra aleatoria de la distribución de los datos; para el $\hat\theta$ ajustado con esos mismos ejemplos, no: $\hat R_n(\hat\theta)$ tiende a quedar por debajo de $R(\hat\theta)$, y la diferencia es la brecha de generalización.` },
        ],
      },
      {
        id: 'perdidas',
        title: 'Qué aprende cada pérdida',
        blocks: [
          {
            table: {
              head: ['Pérdida', String.raw`$\ell(y, \hat y)$`, 'El óptimo predice'],
              rows: [
                ['Cuadrática', String.raw`$(y - \hat y)^2$`, 'La media condicional'],
                ['Absoluta', String.raw`$|y - \hat y|$`, 'La mediana condicional'],
                ['Entropía cruzada', String.raw`$-\log \hat p(y)$`, 'La probabilidad real de cada clase'],
                ['0-1', String.raw`$\mathbf{1}[y \ne \hat y]$`, 'La clase más probable'],
              ],
            },
          },
          { p: String.raw`Si para una misma entrada has visto los valores 1, 2, 3, 4 y 20, la mejor predicción constante con pérdida cuadrática es su media, 6, y con pérdida absoluta, su mediana, 3. La pérdida decide qué resumen de la distribución de $y$ aprende el modelo y cuánto pesan los valores atípicos. La 0-1 sirve para evaluar pero no para entrenar: es constante a trozos y su gradiente es cero casi en todas partes, así que se sustituye por una pérdida derivable, como la [[cross-entropy|entropía cruzada]].` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«El objetivo es que la pérdida de entrenamiento sea lo más baja posible.»', fix: 'Es un medio. El objetivo es el riesgo con datos nuevos: un modelo que memoriza el entrenamiento tiene un riesgo empírico casi nulo y puede generalizar muy mal.' },
      { claim: '«La pérdida de entrenamiento final estima el error que tendrá el modelo en producción.»', fix: 'Está sesgada a la baja, porque los parámetros se ajustaron a esos mismos datos. Estima el error con datos de validación o de test que no hayas usado para ajustar nada.' },
      { claim: '«Da igual qué pérdida uses mientras baje.»', fix: 'Cada pérdida lleva a predecir un resumen distinto de la distribución: la cuadrática, la media; la absoluta, la mediana. Con colas pesadas o asimetría, la diferencia puede ser grande.' },
      { claim: '«Si lo que me importa es la accuracy, debería entrenar con la pérdida 0-1.»', fix: 'Su gradiente es cero casi en todas partes, así que el descenso de gradiente no puede usarla. Se entrena con una pérdida sustituta derivable, como la entropía cruzada, y se evalúa con la accuracy.' },
    ],
    dl: [
      { title: 'Entrenamiento frente a validación.', text: 'La diferencia entre la pérdida de validación y la de entrenamiento estima la brecha de generalización. Cuando la de validación deja de bajar mientras la de entrenamiento sigue bajando, el modelo empieza a sobreajustar: ver [[regularization]].' },
      { title: 'Pérdida y métrica no son lo mismo.', text: 'Se entrena con entropía cruzada porque es derivable y premia las probabilidades honestas (es una [[scoring-rules|regla de puntuación propia]]), y se informa de accuracy, F1 o AUC, que no se pueden optimizar directamente por gradiente. Mejorar una no garantiza mejorar la otra.' },
      { title: 'Pérdidas a medida.', text: String.raw`Cambiar la pérdida cambia lo que predice la red. Con la pérdida cuantil (pinball) de nivel $\tau$, la red aprende el cuantil condicional $\tau$ de $y$ en lugar de su media: con dos salidas entrenadas con $\tau = 0{,}1$ y $\tau = 0{,}9$ obtienes un intervalo de predicción con una cobertura nominal del 80 %, que conviene comprobar con datos de validación. La pérdida de Huber, cuadrática para errores pequeños y lineal para los grandes, reduce el peso de los atípicos.` },
    ],
    quiz: [
      {
        prompt: 'Para una misma entrada has observado los valores 2, 4, 5, 6 y 33. ¿Qué predicción constante minimiza la pérdida absoluta media?',
        options: [{ text: '5', correct: true }, { text: '10' }, { text: '17,5' }],
        explain: 'La pérdida absoluta se minimiza con la mediana, 5. La media, 10, minimizaría la pérdida cuadrática, y 17,5, el punto medio entre el mínimo y el máximo, minimizaría el mayor de los errores absolutos.',
      },
      {
        prompt: 'Tu modelo tiene una pérdida de 0,02 en entrenamiento y de 0,45 en validación. ¿Qué indica?',
        options: [
          { text: 'Que generaliza bien, porque la pérdida de entrenamiento es muy baja.' },
          { text: 'Que sobreajusta: el riesgo empírico es una estimación muy optimista del riesgo real.', correct: true },
          { text: 'Que la pérdida de validación está mal calculada, porque debería coincidir con la de entrenamiento.' },
        ],
        explain: 'Una brecha tan grande entre entrenamiento y validación es la señal típica del sobreajuste. El error con datos nuevos lo estima la validación, no el entrenamiento.',
      },
      {
        prompt: '¿Por qué no se entrena un clasificador minimizando directamente la tasa de error (pérdida 0-1)?',
        options: [
          { text: 'Porque no se puede calcular con los datos de entrenamiento.' },
          { text: 'Porque es constante a trozos: su gradiente es cero casi en todas partes.', correct: true },
          { text: 'Porque siempre lleva al mismo modelo que la entropía cruzada.' },
        ],
        explain: 'La tasa de error solo cambia cuando una predicción cruza la frontera de decisión, así que no indica en qué dirección mejorar. La entropía cruzada es una sustituta derivable que sí lo indica.',
      },
    ],
    further: [
      { book: 'pml1', where: '§4.3 (la ERM como generalización del EMV, pérdida 0-1 y pérdidas sustitutas), §5.1.5 (pérdidas L2, L1 y de Huber en regresión) y §5.4 (riesgo empírico y poblacional, error de aproximación frente a error de estimación, riesgo regularizado y teoría del aprendizaje estadístico).' },
      { book: 'wilks', where: '§9.3.1 (error absoluto medio y error cuadrático medio, y por qué la medida de evaluación debe ser coherente con cómo se construyó la predicción) y §9.6.1 (la puntuación cuantil, que coincide con la pérdida pinball).' },
    ],
    extra: [
      { text: 'Vapnik, V. (1991). Principles of Risk Minimization for Learning Theory. Advances in Neural Information Processing Systems 4, 831–838.', url: 'https://proceedings.neurips.cc/paper/1991/hash/ff4d5fbbafdf976cfdc032e3bde78de5-Abstract.html' },
    ],
  },
  en: {
    lede: 'Training a model means choosing the parameters that minimize the average loss over the training data: the empirical risk. What matters, however, is the expected loss on new data, and the loss function decides what the model learns.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'You want to forecast tomorrow’s electricity demand. First you decide how much each error costs: is falling short as bad as overshooting? Is an error twice as large twice as bad, or four times worse? That is the **loss function**. Ideally you would minimize the average loss over all future days, but you only have past ones: you minimize the average over them and hope the two are alike.' },
          { key: 'The empirical risk is an estimate of the true risk made with the training data. Minimizing it on those same data makes the estimate optimistic: that is why error is measured on separate data.' },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { p: String.raw`A loss $\ell(y, \hat y)$ measures the cost of predicting $\hat y$ when the true value is $y$. The **risk** of a model $f_\theta$ is its expected loss under the true data distribution, which you do not know; the **empirical risk** is its average over the $n$ training examples:` },
          { math: String.raw`R(\theta) = \mathbb{E}_{(x, y)}\big[\ell(y, f_\theta(x))\big], \qquad \hat R_n(\theta) = \frac{1}{n}\sum_{i=1}^{n} \ell\big(y_i, f_\theta(x_i)\big)` },
          { p: String.raw`Empirical risk minimization (ERM) picks $\hat\theta = \arg\min_\theta \hat R_n(\theta)$. If the loss is the negative log-likelihood, $\ell = -\log p(y \mid x, \theta)$, ERM is exactly [[mle|maximum likelihood]]. For a fixed $\theta$, $\hat R_n(\theta)$ is an unbiased estimator of $R(\theta)$ if the examples are a random sample from the data distribution; for the $\hat\theta$ fitted on those same examples, it is not: $\hat R_n(\hat\theta)$ tends to fall below $R(\hat\theta)$, and the difference is the generalization gap.` },
        ],
      },
      {
        id: 'losses',
        title: 'What each loss learns',
        blocks: [
          {
            table: {
              head: ['Loss', String.raw`$\ell(y, \hat y)$`, 'The optimum predicts'],
              rows: [
                ['Squared', String.raw`$(y - \hat y)^2$`, 'The conditional mean'],
                ['Absolute', String.raw`$|y - \hat y|$`, 'The conditional median'],
                ['Cross-entropy', String.raw`$-\log \hat p(y)$`, 'The true probability of each class'],
                ['0-1', String.raw`$\mathbf{1}[y \ne \hat y]$`, 'The most probable class'],
              ],
            },
          },
          { p: String.raw`If for the same input you have seen the values 1, 2, 3, 4 and 20, the best constant prediction under squared loss is their mean, 6, and under absolute loss their median, 3. The loss decides which summary of the distribution of $y$ the model learns and how much outliers weigh. The 0-1 loss is for evaluating, not for training: it is piecewise constant and its gradient is zero almost everywhere, so it is replaced by a differentiable loss such as [[cross-entropy|cross-entropy]].` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“The goal is to make the training loss as low as possible.”', fix: 'It is a means. The goal is the risk on new data: a model that memorizes the training set has an empirical risk close to zero and can generalize very badly.' },
      { claim: '“The final training loss estimates the error the model will have in production.”', fix: 'It is biased downwards, because the parameters were fitted to those same data. Estimate the error on validation or test data that you have not used to fit anything.' },
      { claim: '“Any loss will do as long as it goes down.”', fix: 'Each loss leads to predicting a different summary of the distribution: squared loss, the mean; absolute loss, the median. With heavy tails or skewness, the difference can be large.' },
      { claim: '“If what I care about is accuracy, I should train with the 0-1 loss.”', fix: 'Its gradient is zero almost everywhere, so gradient descent cannot use it. You train with a differentiable surrogate loss, such as cross-entropy, and evaluate with accuracy.' },
    ],
    dl: [
      { title: 'Training versus validation.', text: 'The difference between the validation loss and the training loss estimates the generalization gap. When the validation loss stops falling while the training loss keeps going down, the model is starting to overfit: see [[regularization]].' },
      { title: 'Loss and metric are not the same thing.', text: 'You train with cross-entropy because it is differentiable and rewards honest probabilities (it is a [[scoring-rules|proper scoring rule]]), and you report accuracy, F1 or AUC, which cannot be optimized directly by gradient descent. Improving one does not guarantee improving the other.' },
      { title: 'Custom losses.', text: String.raw`Changing the loss changes what the network predicts. With the quantile (pinball) loss at level $\tau$, the network learns the conditional $\tau$-quantile of $y$ instead of its mean: with two outputs trained at $\tau = 0.1$ and $\tau = 0.9$ you get a prediction interval with nominal 80% coverage, which is worth checking on validation data. The Huber loss, quadratic for small errors and linear for large ones, reduces the weight of outliers.` },
    ],
    quiz: [
      {
        prompt: 'For the same input you have observed the values 2, 4, 5, 6 and 33. Which constant prediction minimizes the mean absolute loss?',
        options: [{ text: '5', correct: true }, { text: '10' }, { text: '17.5' }],
        explain: 'Absolute loss is minimized by the median, 5. The mean, 10, would minimize squared loss, and 17.5, the midpoint between the minimum and the maximum, would minimize the largest absolute error.',
      },
      {
        prompt: 'Your model has a training loss of 0.02 and a validation loss of 0.45. What does that indicate?',
        options: [
          { text: 'That it generalizes well, because the training loss is very low.' },
          { text: 'That it overfits: the empirical risk is a very optimistic estimate of the true risk.', correct: true },
          { text: 'That the validation loss is wrong, because it should match the training loss.' },
        ],
        explain: 'Such a large gap between training and validation is the typical sign of overfitting. The error on new data is estimated by validation, not by training.',
      },
      {
        prompt: 'Why is a classifier not trained by directly minimizing the error rate (0-1 loss)?',
        options: [
          { text: 'Because it cannot be computed on the training data.' },
          { text: 'Because it is piecewise constant: its gradient is zero almost everywhere.', correct: true },
          { text: 'Because it always leads to the same model as cross-entropy.' },
        ],
        explain: 'The error rate only changes when a prediction crosses the decision boundary, so it gives no direction of improvement. Cross-entropy is a differentiable surrogate that does.',
      },
    ],
    further: [
      { book: 'pml1', where: '§4.3 (ERM as a generalization of the MLE, 0-1 loss and surrogate losses), §5.1.5 (L2, L1 and Huber losses in regression) and §5.4 (empirical and population risk, approximation versus estimation error, regularized risk and statistical learning theory).' },
      { book: 'wilks', where: '§9.3.1 (mean absolute error and mean squared error, and why the evaluation measure should be consistent with how the forecast was built) and §9.6.1 (the quantile score, which is the pinball loss).' },
    ],
    extra: [
      { text: 'Vapnik, V. (1991). Principles of Risk Minimization for Learning Theory. Advances in Neural Information Processing Systems 4, 831–838.', url: 'https://proceedings.neurips.cc/paper/1991/hash/ff4d5fbbafdf976cfdc032e3bde78de5-Abstract.html' },
    ],
  },
};

export default content;
