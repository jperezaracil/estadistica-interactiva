import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Detrás de las funciones de pérdida habituales hay un modelo probabilístico de la salida: minimizar la pérdida media equivale a maximizar la verosimilitud de ese modelo. Elegir una pérdida es elegir qué supones sobre el ruido.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Una red que predice un número no tiene por qué dar un solo valor: puedes verla como una máquina que, para cada entrada, devuelve los parámetros de una distribución sobre la salida. Si esa distribución es una normal centrada en la predicción, la parte de $-\log p(y \mid \mathbf{x})$ que depende de la red es proporcional al error al cuadrado; si es una Laplace, al error absoluto; si es una Bernoulli o una categórica, es la entropía cruzada.` },
          { key: String.raw`Pérdida $= -\log p(y \mid \mathbf{x}, \theta)$, salvo constantes. Minimizar la pérdida media en entrenamiento es hacer [[mle|máxima verosimilitud]] con ese modelo de la salida.` },
        ],
      },
      {
        id: 'correspondencia',
        title: 'La correspondencia',
        blocks: [
          { p: String.raw`Si la red produce $f_\theta(\mathbf{x})$ y el modelo de la salida es $p(y \mid f_\theta(\mathbf{x}))$, la pérdida de máxima verosimilitud es la log-verosimilitud negativa media:` },
          { math: String.raw`\mathcal{L}(\theta) = -\frac{1}{n}\sum_{i=1}^{n} \log p\big(y_i \mid f_\theta(\mathbf{x}_i)\big)` },
          {
            table: {
              head: ['Modelo de la salida', 'Pérdida (salvo constantes)', 'El óptimo predice'],
              rows: [
                [String.raw`Normal, $\sigma$ fija`, String.raw`$(y - \mu)^2$ (MSE)`, 'La media condicional'],
                ['Laplace, escala fija', String.raw`$|y - \mu|$ (MAE)`, 'La mediana condicional'],
                ['Bernoulli', String.raw`$-y\log p - (1-y)\log(1-p)$`, String.raw`$P(y = 1 \mid \mathbf{x})$`],
                ['Categórica', String.raw`$-\log p_y$ (entropía cruzada)`, String.raw`$P(y = k \mid \mathbf{x})$`],
                [String.raw`Normal, $\sigma(\mathbf{x})$ aprendida`, String.raw`$\frac{(y - \mu)^2}{2\sigma^2} + \log\sigma$`, 'La media y la varianza'],
              ],
            },
          },
        ],
      },
      {
        id: 'optimo',
        title: 'Qué predice el óptimo',
        blocks: [
          { p: String.raw`Con datos suficientes y un modelo flexible, lo que aprende la red lo decide la pérdida. Si ante un obstáculo un conductor gira a la izquierda ($y = -1$) o a la derecha ($y = 1$) con la misma probabilidad, una red entrenada con MSE aprende a predecir la media, 0: seguir recto. La MAE no lo arregla, porque cualquier valor entre $-1$ y 1 minimiza el error absoluto esperado. Para una salida con varios modos, la red tiene que predecir una distribución multimodal, por ejemplo una [[mixtures|mezcla]].` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Minimizar la MSE da la predicción más probable.»', fix: 'Da la media condicional. Coincide con la moda cuando la distribución de la salida es simétrica y unimodal, pero con salidas asimétricas o con varios modos pueden estar muy lejos.' },
      { claim: '«La MSE no supone nada sobre los datos.»', fix: 'Vista como verosimilitud, equivale a suponer ruido gaussiano con la misma varianza en todas partes. Sin esa hipótesis sigue estimando la media condicional, pero ya no es la máxima verosimilitud. Con valores atípicos, un solo error grande domina la suma de cuadrados; una pérdida de Laplace (MAE) o de Huber es más robusta.' },
      { claim: '«Con regularización sigo haciendo máxima verosimilitud.»', fix: String.raw`Haces estimación MAP: la penalización es $-\log$ del prior. L2 corresponde a un prior gaussiano y L1 a uno de Laplace: ver [[map-estimation]].` },
      { claim: '«Las constantes que se omiten en la pérdida nunca importan.»', fix: String.raw`No cambian el óptimo mientras el resto del modelo esté fijo. Sí importan cuando la red aprende también $\sigma$, o cuando comparas la verosimilitud de modelos con distinto supuesto de ruido, por ejemplo normal frente a Laplace.` },
    ],
    dl: [
      { title: 'Salidas que parametrizan distribuciones.', text: 'La red puede predecir la media y la log-varianza de una normal (pérdida gaussiana heterocedástica), la tasa de una Poisson para recuentos, o los pesos, medias y varianzas de una mezcla (redes de densidad de mezcla). La pérdida es siempre la log-verosimilitud negativa, y predecir la varianza permite estimar la [[uncertainty|incertidumbre aleatoria]].' },
      { title: 'Suavizado de etiquetas.', text: String.raw`Con label smoothing, el one-hot se mezcla con la distribución uniforme: con $\varepsilon = 0{,}1$ y 10 clases, el objetivo es 0,91 para la clase correcta y 0,01 para cada una de las demás. Ya no es la verosimilitud de las etiquetas observadas: equivale a añadirle un término que acerca las predicciones a la uniforme.` },
      { title: 'Pesos por clase.', text: 'Ponderar la entropía cruzada por clase cambia el modelo implícito: el óptimo pasa a ser proporcional al peso por la probabilidad real. Con peso 9 para los positivos, un caso con probabilidad real 0,1 se predice como 0,5. Sirve para mover la frontera, pero las probabilidades dejan de estar calibradas: ver [[calibration]].' },
    ],
    quiz: [
      {
        prompt: 'Entrenas una red de regresión con pérdida L1 (MAE). Con datos y capacidad suficientes, ¿qué aprende a predecir?',
        options: [
          { text: 'La media condicional.' },
          { text: 'La mediana condicional.', correct: true },
          { text: 'La moda condicional.' },
        ],
        explain: 'El error absoluto esperado se minimiza en la mediana. Es la pérdida de máxima verosimilitud para un ruido de Laplace.',
      },
      {
        prompt: '¿Qué pérdida es la log-verosimilitud negativa de una salida Bernoulli?',
        options: [
          { text: 'La entropía cruzada binaria.', correct: true },
          { text: 'El error cuadrático medio.' },
          { text: 'El error absoluto medio.' },
        ],
        explain: String.raw`Para $y \in \{0, 1\}$, $-\log p(y) = -y\log p - (1-y)\log(1-p)$. La MSE y la MAE corresponden a ruido normal y de Laplace, que no describen una salida que solo vale 0 o 1.`,
      },
      {
        prompt: 'Para una misma entrada, la salida vale 0 con probabilidad 0,6 y 10 con probabilidad 0,4. ¿Qué predice un modelo ideal entrenado con MSE?',
        options: [{ text: '0' }, { text: '10' }, { text: '4', correct: true }],
        explain: String.raw`La media, $0{,}6 \cdot 0 + 0{,}4 \cdot 10 = 4$, un valor que nunca ocurre. Con MAE predeciría la mediana, 0.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§4.2.7 (EMV de la regresión lineal y suma de cuadrados), §5.1.5 (pérdidas L2, L1 y de Huber: media y mediana), §5.1.6 (predicción probabilística y log-loss) y §11.6 (regresión robusta: verosimilitudes de Laplace y t de Student).' },
      { book: 'pml2', where: '§14.1.2 (riesgo empírico, máxima verosimilitud y MAP, con la penalización como menos el logaritmo del prior).' },
    ],
  },
  en: {
    lede: 'Behind the usual loss functions there is a probabilistic model of the output: minimizing the average loss is equivalent to maximizing the likelihood of that model. Choosing a loss means choosing what you assume about the noise.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`A network that predicts a number need not give a single value: you can see it as a machine that, for each input, returns the parameters of a distribution over the output. If that distribution is a normal centered on the prediction, the part of $-\log p(y \mid \mathbf{x})$ that depends on the network is proportional to the squared error; if it is a Laplace, to the absolute error; if it is a Bernoulli or a categorical, it is the cross-entropy.` },
          { key: String.raw`Loss $= -\log p(y \mid \mathbf{x}, \theta)$, up to constants. Minimizing the average training loss is doing [[mle|maximum likelihood]] with that model of the output.` },
        ],
      },
      {
        id: 'correspondence',
        title: 'The correspondence',
        blocks: [
          { p: String.raw`If the network produces $f_\theta(\mathbf{x})$ and the model of the output is $p(y \mid f_\theta(\mathbf{x}))$, the maximum likelihood loss is the mean negative log-likelihood:` },
          { math: String.raw`\mathcal{L}(\theta) = -\frac{1}{n}\sum_{i=1}^{n} \log p\big(y_i \mid f_\theta(\mathbf{x}_i)\big)` },
          {
            table: {
              head: ['Model of the output', 'Loss (up to constants)', 'The optimum predicts'],
              rows: [
                [String.raw`Normal, fixed $\sigma$`, String.raw`$(y - \mu)^2$ (MSE)`, 'The conditional mean'],
                ['Laplace, fixed scale', String.raw`$|y - \mu|$ (MAE)`, 'The conditional median'],
                ['Bernoulli', String.raw`$-y\log p - (1-y)\log(1-p)$`, String.raw`$P(y = 1 \mid \mathbf{x})$`],
                ['Categorical', String.raw`$-\log p_y$ (cross-entropy)`, String.raw`$P(y = k \mid \mathbf{x})$`],
                [String.raw`Normal, learned $\sigma(\mathbf{x})$`, String.raw`$\frac{(y - \mu)^2}{2\sigma^2} + \log\sigma$`, 'The mean and the variance'],
              ],
            },
          },
        ],
      },
      {
        id: 'optimum',
        title: 'What the optimum predicts',
        blocks: [
          { p: String.raw`With enough data and a flexible model, what the network learns is decided by the loss. If, facing an obstacle, a driver turns left ($y = -1$) or right ($y = 1$) with the same probability, a network trained with MSE learns to predict the mean, 0: go straight ahead. MAE does not fix it, because any value between $-1$ and 1 minimizes the expected absolute error. For an output with several modes, the network has to predict a multimodal distribution, for example a [[mixtures|mixture]].` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“Minimizing MSE gives the most probable prediction.”', fix: 'It gives the conditional mean. It equals the mode when the distribution of the output is symmetric and unimodal, but with skewed or multimodal outputs they can be far apart.' },
      { claim: '“MSE assumes nothing about the data.”', fix: 'Seen as a likelihood, it amounts to assuming Gaussian noise with the same variance everywhere. Without that assumption it still estimates the conditional mean, but it is no longer maximum likelihood. With outliers, a single large error dominates the sum of squares; a Laplace (MAE) or Huber loss is more robust.' },
      { claim: '“With regularization I am still doing maximum likelihood.”', fix: String.raw`You are doing MAP estimation: the penalty is $-\log$ of the prior. L2 corresponds to a Gaussian prior and L1 to a Laplace prior: see [[map-estimation]].` },
      { claim: '“The constants dropped from the loss never matter.”', fix: String.raw`They do not change the optimum as long as the rest of the model is fixed. They do matter when the network also learns $\sigma$, or when you compare the likelihood of models with different noise assumptions, for example normal versus Laplace.` },
    ],
    dl: [
      { title: 'Outputs that parameterize distributions.', text: 'The network can predict the mean and log-variance of a normal (heteroscedastic Gaussian loss), the rate of a Poisson for counts, or the weights, means and variances of a mixture (mixture density networks). The loss is always the negative log-likelihood, and predicting the variance lets you estimate the [[uncertainty|aleatoric uncertainty]].' },
      { title: 'Label smoothing.', text: String.raw`With label smoothing, the one-hot target is mixed with the uniform distribution: with $\varepsilon = 0.1$ and 10 classes, the target is 0.91 for the correct class and 0.01 for each of the others. It is no longer the likelihood of the observed labels: it amounts to adding a term that pulls the predictions towards the uniform.` },
      { title: 'Class weights.', text: 'Weighting the cross-entropy by class changes the implicit model: the optimum becomes proportional to the weight times the true probability. With weight 9 for the positives, a case with true probability 0.1 is predicted as 0.5. It is useful to move the decision boundary, but the probabilities are no longer calibrated: see [[calibration]].' },
    ],
    quiz: [
      {
        prompt: 'You train a regression network with the L1 loss (MAE). With enough data and capacity, what does it learn to predict?',
        options: [
          { text: 'The conditional mean.' },
          { text: 'The conditional median.', correct: true },
          { text: 'The conditional mode.' },
        ],
        explain: 'The expected absolute error is minimized at the median. It is the maximum likelihood loss for Laplace noise.',
      },
      {
        prompt: 'Which loss is the negative log-likelihood of a Bernoulli output?',
        options: [
          { text: 'Binary cross-entropy.', correct: true },
          { text: 'Mean squared error.' },
          { text: 'Mean absolute error.' },
        ],
        explain: String.raw`For $y \in \{0, 1\}$, $-\log p(y) = -y\log p - (1-y)\log(1-p)$. MSE and MAE correspond to normal and Laplace noise, which do not describe an output that can only be 0 or 1.`,
      },
      {
        prompt: 'For a given input, the output is 0 with probability 0.6 and 10 with probability 0.4. What does an ideal model trained with MSE predict?',
        options: [{ text: '0' }, { text: '10' }, { text: '4', correct: true }],
        explain: String.raw`The mean, $0.6 \cdot 0 + 0.4 \cdot 10 = 4$, a value that never occurs. With MAE it would predict the median, 0.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§4.2.7 (MLE of linear regression and the sum of squares), §5.1.5 (L2, L1 and Huber losses: mean and median), §5.1.6 (probabilistic prediction and log loss) and §11.6 (robust regression: Laplace and Student t likelihoods).' },
      { book: 'pml2', where: '§14.1.2 (empirical risk, maximum likelihood and MAP, with the penalty as minus the log of the prior).' },
    ],
  },
};

export default content;
