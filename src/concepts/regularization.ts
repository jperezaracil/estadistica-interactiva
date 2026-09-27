import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Regularizar es añadir al entrenamiento una preferencia por modelos más simples, a cambio de ajustar algo peor los datos de entrenamiento. Se acepta un poco de sesgo para reducir mucho la varianza y generalizar mejor.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Quieres predecir el consumo diario de un edificio con 40 variables de sensores y solo 60 días de datos. Mínimos cuadrados encuentra unos coeficientes que explican muy bien esos 60 días, aprovechando también su ruido, y que fallan con los días siguientes. Si además penalizas los coeficientes grandes, el modelo renuncia a explicar parte del ruido a cambio de coeficientes más estables: ajusta peor el pasado y predice mejor el futuro.' },
          { key: 'La regularización cambia varianza por sesgo: el modelo se vuelve menos sensible a los detalles concretos de la muestra de entrenamiento. Cuánto regularizar se decide con datos de validación, nunca con los de entrenamiento.' },
        ],
      },
      {
        id: 'penalizaciones',
        title: 'Penalizaciones',
        blocks: [
          { p: String.raw`La forma más común añade al [[erm-loss|riesgo empírico]] una penalización $\Omega(\theta)$, con un peso $\lambda \ge 0$:` },
          { math: String.raw`\hat\theta_\lambda = \arg\min_\theta \; \frac{1}{n}\sum_{i=1}^{n} \ell\big(y_i, f_\theta(x_i)\big) + \lambda\,\Omega(\theta)` },
          {
            list: [
              String.raw`**L2** (ridge; en redes, weight decay): $\Omega(\theta) = \|\theta\|_2^2 = \sum_j \theta_j^2$. Encoge el vector de coeficientes hacia cero, sin anular ninguno.`,
              String.raw`**L1** (lasso): $\Omega(\theta) = \|\theta\|_1 = \sum_j |\theta_j|$. Anula exactamente los coeficientes menos útiles y deja un modelo disperso: selecciona variables.`,
              '**Parada temprana:** detener el entrenamiento cuando el error de validación deja de mejorar. Limita cuánto se alejan los parámetros de su valor inicial; en modelos lineales con pérdida cuadrática actúa de forma parecida a L2.',
            ],
          },
          { p: String.raw`Con $\lambda = 0$ se recupera el ajuste sin regularizar; con $\lambda$ muy grande, los coeficientes tienden a cero y el modelo ya no capta ni la señal. Entre medias está el compromiso de [[estimators|sesgo y varianza]]. Desde el punto de vista bayesiano, L2 equivale a un prior gaussiano sobre los parámetros y L1, a uno de Laplace: ver [[map-estimation]].` },
        ],
      },
      {
        id: 'l1-l2',
        title: 'L1 frente a L2, coeficiente a coeficiente',
        blocks: [
          { p: String.raw`Si las variables son ortonormales y se minimiza $\tfrac12\|y - Xw\|^2 + \lambda\,\Omega(w)$, con $\Omega = \tfrac12\|w\|_2^2$ para L2 y $\Omega = \|w\|_1$ para L1, cada coeficiente se obtiene directamente del de mínimos cuadrados, $b_j$:` },
          { math: String.raw`w_j^{\text{L2}} = \frac{b_j}{1+\lambda}, \qquad w_j^{\text{L1}} = \operatorname{signo}(b_j)\,\max\big(|b_j| - \lambda;\ 0\big)` },
          {
            table: {
              head: ['Mínimos cuadrados', String.raw`L2 ($\lambda = 0{,}5$)`, String.raw`L1 ($\lambda = 0{,}5$)`],
              rows: [
                ['3', '2', '2,5'],
                ['0,8', '0,533', '0,3'],
                ['−0,3', '−0,2', '0'],
              ],
              numeric: [0, 1, 2],
            },
          },
          { p: 'L2 divide todos los coeficientes entre el mismo factor, así que ninguno llega a cero. L1 resta la misma cantidad a todos y anula los que no la superan: por eso produce modelos dispersos.' },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Si la pérdida de entrenamiento sube al regularizar, el modelo ha empeorado.»', fix: 'Es lo esperado: la regularización sacrifica ajuste a los datos de entrenamiento para mejorar con datos nuevos. Se juzga con la pérdida de validación.' },
      { claim: String.raw`«$\lambda$ se elige minimizando la pérdida de entrenamiento.»`, fix: String.raw`Con ese criterio siempre saldría $\lambda = 0$. Se elige con un conjunto de validación o con [[cross-validation|validación cruzada]].` },
      { claim: '«La escala de las variables no importa.»', fix: 'La penalización trata igual a todos los coeficientes, pero el tamaño de cada uno depende de las unidades de su variable: medir en milímetros en vez de en metros hace el coeficiente mil veces menor, y apenas se penaliza. Estandariza las variables antes de usar ridge o lasso, y no penalices el término independiente.' },
      { claim: '«L1 y L2 hacen lo mismo con distinta intensidad.»', fix: 'L2 encoge el vector de coeficientes sin anular ninguno; L1 anula los pequeños y selecciona variables. En la tabla, el coeficiente −0,3 queda en −0,2 con L2 y en 0 con L1.' },
    ],
    dl: [
      { title: 'Weight decay y AdamW.', text: String.raw`Con SGD, multiplicar los pesos por $1 - \eta\lambda$ en cada paso (weight decay, con tasa de aprendizaje $\eta$) equivale a añadir $\tfrac{\lambda}{2}\|w\|^2$ a la pérdida. Con Adam no: el término L2 pasa por la normalización adaptativa de cada parámetro, y los pesos con gradientes grandes se regularizan menos. AdamW aplica el decaimiento por separado y es la opción habitual para entrenar transformers.` },
      { title: 'Dropout y aumento de datos.', text: 'Apagar neuronas al azar durante el entrenamiento, o entrenar con versiones transformadas de cada imagen (recortes, giros, cambios de color), impide que la red dependa de detalles concretos de cada ejemplo. No añaden un término a la pérdida, pero cumplen la misma función.' },
      { title: 'Parada temprana.', text: 'Guardar el modelo con menor pérdida de validación y parar cuando deja de mejorar es la regularización más barata. Conviene esperar unas cuantas épocas antes de parar (la «paciencia»), porque la curva de validación es ruidosa.' },
    ],
    quiz: [
      {
        prompt: String.raw`Con variables ortonormales, un coeficiente de mínimos cuadrados vale 0,4. ¿Cuánto vale con L1 y $\lambda = 0{,}5$?`,
        options: [{ text: '0,27' }, { text: '0', correct: true }, { text: '−0,1' }],
        explain: String.raw`L1 resta $\lambda$ al valor absoluto y anula el coeficiente si no lo supera: $\max(0{,}4 - 0{,}5;\ 0) = 0$. El valor 0,27 es el de L2, $0{,}4/1{,}5$, y −0,1 resulta de restar sin anular.`,
      },
      {
        prompt: String.raw`¿Cómo se debe elegir el peso de la regularización, $\lambda$?`,
        options: [
          { text: 'Minimizando la pérdida de entrenamiento.' },
          { text: 'Con un conjunto de validación o con validación cruzada.', correct: true },
          { text: 'Tomando el mayor valor posible, para evitar el sobreajuste.' },
        ],
        explain: String.raw`La pérdida de entrenamiento siempre prefiere $\lambda = 0$, y un $\lambda$ demasiado grande produce subajuste. El valor adecuado es el que minimiza el error con datos que no se han usado para ajustar los parámetros.`,
      },
      {
        prompt: String.raw`¿Qué ocurre al aumentar mucho $\lambda$ en una regresión ridge?`,
        options: [
          { text: 'Aumenta el sesgo, disminuye la varianza y los coeficientes tienden a cero.', correct: true },
          { text: 'Disminuyen tanto el sesgo como la varianza.' },
          { text: 'Los coeficientes pequeños se anulan exactamente y los grandes no cambian.' },
        ],
        explain: 'La penalización L2 encoge el vector de coeficientes: el modelo varía menos de una muestra a otra, pero se aleja de la relación real. Anular coeficientes exactamente es propio de L1, no de L2.',
      },
    ],
    further: [
      { book: 'wilks', where: '§7.5.1 (regresión ridge) y §7.5.2 (lasso), con la introducción de §7.5 sobre por qué un estimador sesgado puede predecir mejor.' },
      { book: 'pml1', where: String.raw`§4.5 (regularización: estimación MAP, weight decay, elección de $\lambda$ con validación, parada temprana y más datos), §11.3–11.4 (ridge y lasso, y por qué L1 da soluciones dispersas) y §13.5 (regularización de redes: parada temprana, weight decay y dropout).` },
    ],
    extra: [
      { text: 'Tibshirani, R. (1996). Regression Shrinkage and Selection via the Lasso. Journal of the Royal Statistical Society: Series B (Methodological), 58(1), 267–288.', url: 'https://doi.org/10.1111/j.2517-6161.1996.tb02080.x' },
      { text: 'Srivastava, N. et al. (2014). Dropout: A Simple Way to Prevent Neural Networks from Overfitting. Journal of Machine Learning Research, 15(56), 1929–1958.', url: 'https://jmlr.org/papers/v15/srivastava14a.html' },
      { text: 'Loshchilov, I. y Hutter, F. (2019). Decoupled Weight Decay Regularization. International Conference on Learning Representations (ICLR).', url: 'https://openreview.net/forum?id=Bkg6RiCqY7' },
    ],
  },
  en: {
    lede: 'Regularizing means adding a preference for simpler models to training, at the price of fitting the training data somewhat worse. You accept a little bias to cut variance a lot and generalize better.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'You want to predict a building’s daily energy use from 40 sensor variables and only 60 days of data. Least squares finds coefficients that explain those 60 days very well, exploiting their noise too, and that fail on the following days. If you also penalize large coefficients, the model gives up explaining part of the noise in exchange for more stable coefficients: it fits the past worse and predicts the future better.' },
          { key: 'Regularization trades variance for bias: the model becomes less sensitive to the particular details of the training sample. How much to regularize is decided with validation data, never with the training data.' },
        ],
      },
      {
        id: 'penalties',
        title: 'Penalties',
        blocks: [
          { p: String.raw`The most common form adds a penalty $\Omega(\theta)$ to the [[erm-loss|empirical risk]], with a weight $\lambda \ge 0$:` },
          { math: String.raw`\hat\theta_\lambda = \arg\min_\theta \; \frac{1}{n}\sum_{i=1}^{n} \ell\big(y_i, f_\theta(x_i)\big) + \lambda\,\Omega(\theta)` },
          {
            list: [
              String.raw`**L2** (ridge; in networks, weight decay): $\Omega(\theta) = \|\theta\|_2^2 = \sum_j \theta_j^2$. It shrinks the coefficient vector towards zero, without setting any coefficient to zero.`,
              String.raw`**L1** (lasso): $\Omega(\theta) = \|\theta\|_1 = \sum_j |\theta_j|$. It sets the least useful coefficients exactly to zero and leaves a sparse model: it selects variables.`,
              '**Early stopping:** stop training when the validation error stops improving. It limits how far the parameters move from their initial values; in linear models with squared loss it acts much like L2.',
            ],
          },
          { p: String.raw`With $\lambda = 0$ you get the unregularized fit back; with a very large $\lambda$, the coefficients go to zero and the model no longer captures even the signal. In between lies the [[estimators|bias–variance]] trade-off. From a Bayesian point of view, L2 amounts to a Gaussian prior on the parameters and L1 to a Laplace prior: see [[map-estimation]].` },
        ],
      },
      {
        id: 'l1-l2',
        title: 'L1 versus L2, coefficient by coefficient',
        blocks: [
          { p: String.raw`If the variables are orthonormal and you minimize $\tfrac12\|y - Xw\|^2 + \lambda\,\Omega(w)$, with $\Omega = \tfrac12\|w\|_2^2$ for L2 and $\Omega = \|w\|_1$ for L1, each coefficient follows directly from the least-squares one, $b_j$:` },
          { math: String.raw`w_j^{\text{L2}} = \frac{b_j}{1+\lambda}, \qquad w_j^{\text{L1}} = \operatorname{sign}(b_j)\,\max\big(|b_j| - \lambda,\ 0\big)` },
          {
            table: {
              head: ['Least squares', String.raw`L2 ($\lambda = 0.5$)`, String.raw`L1 ($\lambda = 0.5$)`],
              rows: [
                ['3', '2', '2.5'],
                ['0.8', '0.533', '0.3'],
                ['−0.3', '−0.2', '0'],
              ],
              numeric: [0, 1, 2],
            },
          },
          { p: 'L2 divides every coefficient by the same factor, so none reaches zero. L1 subtracts the same amount from all of them and zeroes those that do not exceed it: that is why it produces sparse models.' },
        ],
      },
    ],
    pitfalls: [
      { claim: '“If the training loss goes up when I regularize, the model got worse.”', fix: 'That is expected: regularization sacrifices fit to the training data to do better on new data. Judge it by the validation loss.' },
      { claim: String.raw`“$\lambda$ is chosen by minimizing the training loss.”`, fix: String.raw`With that criterion you would always get $\lambda = 0$. Choose it with a validation set or with [[cross-validation|cross-validation]].` },
      { claim: '“The scale of the variables does not matter.”', fix: 'The penalty treats all coefficients alike, but the size of each one depends on the units of its variable: measuring in millimeters instead of meters makes the coefficient a thousand times smaller, and it is hardly penalized. Standardize the variables before using ridge or lasso, and do not penalize the intercept.' },
      { claim: '“L1 and L2 do the same thing with different strength.”', fix: 'L2 shrinks the coefficient vector without zeroing any coefficient; L1 zeroes the small ones and selects variables. In the table, the coefficient −0.3 becomes −0.2 with L2 and 0 with L1.' },
    ],
    dl: [
      { title: 'Weight decay and AdamW.', text: String.raw`With SGD, multiplying the weights by $1 - \eta\lambda$ at each step (weight decay, with learning rate $\eta$) is equivalent to adding $\tfrac{\lambda}{2}\|w\|^2$ to the loss. With Adam it is not: the L2 term goes through each parameter’s adaptive normalization, and weights with large gradients are regularized less. AdamW applies the decay separately and is the usual choice for training transformers.` },
      { title: 'Dropout and data augmentation.', text: 'Switching off random neurons during training, or training on transformed versions of each image (crops, flips, color changes), keeps the network from relying on specific details of each example. They add no term to the loss, but they do the same job.' },
      { title: 'Early stopping.', text: 'Keeping the model with the lowest validation loss and stopping when it no longer improves is the cheapest regularizer. It pays to wait a few epochs before stopping (the “patience”), because the validation curve is noisy.' },
    ],
    quiz: [
      {
        prompt: String.raw`With orthonormal variables, a least-squares coefficient equals 0.4. What is it with L1 and $\lambda = 0.5$?`,
        options: [{ text: '0.27' }, { text: '0', correct: true }, { text: '−0.1' }],
        explain: String.raw`L1 subtracts $\lambda$ from the absolute value and zeroes the coefficient if it does not exceed it: $\max(0.4 - 0.5,\ 0) = 0$. The value 0.27 is the L2 one, $0.4/1.5$, and −0.1 comes from subtracting without zeroing.`,
      },
      {
        prompt: String.raw`How should the regularization weight $\lambda$ be chosen?`,
        options: [
          { text: 'By minimizing the training loss.' },
          { text: 'With a validation set or with cross-validation.', correct: true },
          { text: 'By taking the largest possible value, to avoid overfitting.' },
        ],
        explain: String.raw`The training loss always prefers $\lambda = 0$, and too large a $\lambda$ causes underfitting. The right value is the one that minimizes the error on data not used to fit the parameters.`,
      },
      {
        prompt: String.raw`What happens when you increase $\lambda$ a lot in ridge regression?`,
        options: [
          { text: 'Bias goes up, variance goes down and the coefficients go to zero.', correct: true },
          { text: 'Both bias and variance go down.' },
          { text: 'Small coefficients become exactly zero and large ones do not change.' },
        ],
        explain: 'The L2 penalty shrinks the coefficient vector: the model varies less from sample to sample, but drifts away from the true relationship. Setting coefficients exactly to zero is what L1 does, not L2.',
      },
    ],
    further: [
      { book: 'wilks', where: '§7.5.1 (ridge regression) and §7.5.2 (the lasso), with the introduction to §7.5 on why a biased estimator can predict better.' },
      { book: 'pml1', where: String.raw`§4.5 (regularization: MAP estimation, weight decay, choosing $\lambda$ with validation, early stopping and more data), §11.3–11.4 (ridge and lasso, and why L1 gives sparse solutions) and §13.5 (regularizing networks: early stopping, weight decay and dropout).` },
    ],
    extra: [
      { text: 'Tibshirani, R. (1996). Regression Shrinkage and Selection via the Lasso. Journal of the Royal Statistical Society: Series B (Methodological), 58(1), 267–288.', url: 'https://doi.org/10.1111/j.2517-6161.1996.tb02080.x' },
      { text: 'Srivastava, N. et al. (2014). Dropout: A Simple Way to Prevent Neural Networks from Overfitting. Journal of Machine Learning Research, 15(56), 1929–1958.', url: 'https://jmlr.org/papers/v15/srivastava14a.html' },
      { text: 'Loshchilov, I. and Hutter, F. (2019). Decoupled Weight Decay Regularization. International Conference on Learning Representations (ICLR).', url: 'https://openreview.net/forum?id=Bkg6RiCqY7' },
    ],
  },
};

export default content;
