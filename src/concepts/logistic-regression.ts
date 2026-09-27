import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Un clasificador lineal que devuelve probabilidades: una combinación lineal de las entradas pasa por una sigmoide (dos clases) o por una softmax (varias). Es lo mismo que hace la última capa de una red de clasificación.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Quieres estimar la probabilidad de que un correo sea spam a partir de algunas de sus características. Una combinación lineal $z = \mathbf{w}^\top\mathbf{x} + b$ puede valer cualquier número real, así que hay que convertirla en una probabilidad. La regresión logística usa la sigmoide, $\sigma(z) = 1/(1 + e^{-z})$, que lleva $z = 0$ a 0,5 y los valores muy positivos o muy negativos cerca de 1 o de 0.` },
          { key: String.raw`La regresión logística modela como función lineal de las entradas el logaritmo de las odds, el cociente $p/(1-p)$: $\log\frac{p}{1-p} = \mathbf{w}^\top\mathbf{x} + b$. La frontera de decisión, $p = 0{,}5$, es el hiperplano $\mathbf{w}^\top\mathbf{x} + b = 0$.` },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición y ajuste',
        blocks: [
          { p: String.raw`Con $K$ clases, cada clase tiene su propia puntuación lineal o logit, $z_k = \mathbf{w}_k^\top\mathbf{x} + b_k$, y la softmax las convierte en probabilidades positivas que suman 1:` },
          { math: String.raw`p(y = k \mid \mathbf{x}) = \mathrm{softmax}(\mathbf{z})_k = \frac{e^{z_k}}{\sum_{j=1}^{K} e^{z_j}}` },
          { p: String.raw`Con dos clases, la softmax se reduce a la sigmoide de la diferencia de logits. Los pesos se estiman por [[mle|máxima verosimilitud]]: la log-verosimilitud negativa es la [[cross-entropy|entropía cruzada]], $-\sum_i \log p(y_i \mid \mathbf{x}_i)$. No tiene solución cerrada, pero es convexa, así que el descenso de gradiente llega al óptimo global cuando existe. En el caso binario, el gradiente es $\sum_i (p_i - y_i)\,\mathbf{x}_i$: el error de cada predicción por su entrada.` },
        ],
      },
      {
        id: 'propiedades',
        title: 'Interpretación y propiedades',
        blocks: [
          {
            list: [
              String.raw`**Coeficientes:** aumentar $x_j$ en una unidad suma $w_j$ a las log-odds, es decir, multiplica las odds por $e^{w_j}$. Con $w_j = 0{,}7$, las odds se multiplican por $e^{0{,}7} \approx 2{,}01$.`,
              String.raw`**Efecto sobre la probabilidad:** depende del punto de partida. La pendiente de la sigmoide es $p(1-p)$, máxima en $p = 0{,}5$: allí, cada unidad de $x_j$ cambia la probabilidad en unos $w_j/4$; cerca de 0 o de 1, mucho menos.`,
              String.raw`**Invarianza:** sumar la misma constante a todos los logits no cambia la softmax. Los logits $[2;\ 1;\ 0]$ y $[12;\ 11;\ 10]$ dan los dos $[0{,}665;\ 0{,}245;\ 0{,}090]$.`,
              String.raw`**Datos separables:** si un hiperplano separa perfectamente las clases, el EMV no existe: la verosimilitud sigue creciendo al multiplicar los pesos por un número cada vez mayor. La [[regularization|regularización]] lo evita.`,
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: String.raw`«El coeficiente $w_j$ es lo que sube la probabilidad al aumentar $x_j$ una unidad.»`, fix: String.raw`Es lo que suben las log-odds. El cambio en la probabilidad depende de dónde estés en la sigmoide, y como mucho es $|w_j|/4$, cerca de $p = 0{,}5$.` },
      { claim: '«Si las clases son separables, la regresión logística encuentra la solución perfecta.»', fix: 'Sin regularización, los pesos crecen sin límite y las probabilidades se van a 0 y a 1: el modelo se vuelve arbitrariamente confiado. La regularización L2 o la parada temprana lo evitan.' },
      { claim: '«La frontera de decisión de una regresión logística siempre es lineal.»', fix: 'Es lineal en las características que le das. Con características polinómicas, o con las que aprende una red, la frontera en el espacio de las entradas originales puede ser tan curva como haga falta.' },
      { claim: '«Como las salidas suman 1, son probabilidades fiables.»', fix: 'Sumar 1 es una propiedad de la softmax, no una garantía. Con término independiente, el EMV iguala en entrenamiento la suma de las probabilidades predichas de cada clase con su número de casos, pero con datos nuevos pueden estar mal calibradas: ver [[calibration]].' },
    ],
    dl: [
      { title: 'La última capa.', text: 'Una red de clasificación es un extractor de características seguido de una regresión logística multinomial: la última capa lineal produce los logits, y la softmax con entropía cruzada es exactamente su log-verosimilitud negativa. Entrenar solo esa capa sobre una red preentrenada y congelada (linear probing) es ajustar una regresión logística.' },
      { title: 'Un gradiente que no se satura.', text: String.raw`El gradiente de la entropía cruzada respecto a los logits es $\mathbf{p} - \mathbf{y}$: acotado y proporcional al error. Con MSE sobre una sigmoide, el gradiente se multiplica además por $\sigma'(z)$, casi nulo cuando la salida está saturada, aunque sea en el valor equivocado: el aprendizaje se frena justo cuando la predicción es muy mala.` },
      { title: 'Logits, no probabilidades.', text: 'Las librerías calculan estas pérdidas a partir de los logits (en PyTorch, CrossEntropyLoss y BCEWithLogitsLoss) con el truco log-sum-exp, que evita desbordamientos y logaritmos de cero. Por eso la red no debe aplicar antes la softmax.' },
    ],
    quiz: [
      {
        prompt: String.raw`Con dos clases y logits $z_0$ y $z_1$, ¿qué probabilidad da la softmax a la clase 1?`,
        options: [
          { text: String.raw`$\sigma(z_1 - z_0)$`, correct: true },
          { text: String.raw`$\sigma(z_1)$` },
          { text: String.raw`$z_1/(z_0 + z_1)$` },
        ],
        explain: String.raw`Dividiendo numerador y denominador entre $e^{z_1}$: $e^{z_1}/(e^{z_0} + e^{z_1}) = 1/(1 + e^{-(z_1 - z_0)})$. Por eso, con dos clases, basta un solo logit.`,
      },
      {
        prompt: String.raw`En una regresión logística binaria, $w_j = -0{,}5$. Si $x_j$ aumenta una unidad y lo demás no cambia, las odds de la clase positiva:`,
        options: [
          { text: 'Disminuyen en 0,5.' },
          { text: String.raw`Se multiplican por $e^{-0{,}5} \approx 0{,}61$.`, correct: true },
          { text: 'Se multiplican por 0,5.' },
        ],
        explain: String.raw`Las log-odds bajan 0,5, así que las odds se multiplican por $e^{-0{,}5} \approx 0{,}61$: bajan un 39 %. La probabilidad cambia menos, y cuánto depende del punto de partida.`,
      },
      {
        prompt: 'Entrenas una regresión logística sin regularización con datos linealmente separables. ¿Qué ocurre?',
        options: [
          { text: 'Converge a unos pesos finitos con pérdida cero.' },
          { text: 'El optimizador no puede avanzar desde el principio.' },
          { text: 'La norma de los pesos crece sin parar y la pérdida tiende a cero sin alcanzarlo.', correct: true },
        ],
        explain: 'Escalar unos pesos que separan las clases siempre aumenta la verosimilitud, así que no hay un máximo finito. Las predicciones se acercan cada vez más a 0 y a 1.',
      },
    ],
    further: [
      { book: 'pml1', where: '§10.2 (regresión logística binaria: EMV, descenso de gradiente, IRLS, estimación MAP y estandarización), §10.3 (caso multinomial) y §2.5.2–2.5.4 (softmax y truco log-sum-exp).' },
      { book: 'wilks', where: '§7.6.2 (regresión logística como modelo lineal generalizado para pronósticos de probabilidad).' },
    ],
  },
  en: {
    lede: 'A linear classifier that outputs probabilities: a linear combination of the inputs goes through a sigmoid (two classes) or a softmax (several). It is what the last layer of a classification network does.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`You want to estimate the probability that an email is spam from some of its features. A linear combination $z = \mathbf{w}^\top\mathbf{x} + b$ can take any real value, so it has to be turned into a probability. Logistic regression uses the sigmoid, $\sigma(z) = 1/(1 + e^{-z})$, which sends $z = 0$ to 0.5 and very positive or very negative values close to 1 or 0.` },
          { key: String.raw`Logistic regression models the logarithm of the odds, the ratio $p/(1-p)$, as a linear function of the inputs: $\log\frac{p}{1-p} = \mathbf{w}^\top\mathbf{x} + b$. The decision boundary, $p = 0.5$, is the hyperplane $\mathbf{w}^\top\mathbf{x} + b = 0$.` },
        ],
      },
      {
        id: 'definition',
        title: 'Definition and fitting',
        blocks: [
          { p: String.raw`With $K$ classes, each class has its own linear score or logit, $z_k = \mathbf{w}_k^\top\mathbf{x} + b_k$, and the softmax turns them into positive probabilities that add up to 1:` },
          { math: String.raw`p(y = k \mid \mathbf{x}) = \mathrm{softmax}(\mathbf{z})_k = \frac{e^{z_k}}{\sum_{j=1}^{K} e^{z_j}}` },
          { p: String.raw`With two classes, the softmax reduces to the sigmoid of the difference of the logits. The weights are estimated by [[mle|maximum likelihood]]: the negative log-likelihood is the [[cross-entropy|cross-entropy]], $-\sum_i \log p(y_i \mid \mathbf{x}_i)$. It has no closed-form solution, but it is convex, so gradient descent reaches the global optimum when it exists. In the binary case, the gradient is $\sum_i (p_i - y_i)\,\mathbf{x}_i$: the error of each prediction times its input.` },
        ],
      },
      {
        id: 'properties',
        title: 'Interpretation and properties',
        blocks: [
          {
            list: [
              String.raw`**Coefficients:** increasing $x_j$ by one unit adds $w_j$ to the log-odds, that is, it multiplies the odds by $e^{w_j}$. With $w_j = 0.7$, the odds are multiplied by $e^{0.7} \approx 2.01$.`,
              String.raw`**Effect on the probability:** it depends on the starting point. The slope of the sigmoid is $p(1-p)$, largest at $p = 0.5$: there, each unit of $x_j$ changes the probability by about $w_j/4$; near 0 or 1, by much less.`,
              String.raw`**Invariance:** adding the same constant to all the logits does not change the softmax. The logits $[2,\ 1,\ 0]$ and $[12,\ 11,\ 10]$ both give $[0.665,\ 0.245,\ 0.090]$.`,
              String.raw`**Separable data:** if a hyperplane separates the classes perfectly, the MLE does not exist: the likelihood keeps growing as the weights are multiplied by ever larger numbers. [[regularization|Regularization]] prevents it.`,
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: String.raw`“The coefficient $w_j$ is how much the probability rises when $x_j$ increases by one unit.”`, fix: String.raw`It is how much the log-odds rise. The change in probability depends on where you are on the sigmoid, and it is at most $|w_j|/4$, near $p = 0.5$.` },
      { claim: '“If the classes are separable, logistic regression finds the perfect solution.”', fix: 'Without regularization, the weights grow without bound and the probabilities go to 0 and 1: the model becomes arbitrarily confident. L2 regularization or early stopping prevents it.' },
      { claim: '“The decision boundary of a logistic regression is always linear.”', fix: 'It is linear in the features you give it. With polynomial features, or with the ones a network learns, the boundary in the space of the original inputs can be as curved as needed.' },
      { claim: '“Since the outputs add up to 1, they are reliable probabilities.”', fix: 'Adding up to 1 is a property of the softmax, not a guarantee. With an intercept, the MLE makes the predicted probabilities of each class add up to its number of training cases, but on new data they can be miscalibrated: see [[calibration]].' },
    ],
    dl: [
      { title: 'The last layer.', text: 'A classification network is a feature extractor followed by a multinomial logistic regression: the last linear layer produces the logits, and the softmax with cross-entropy is exactly its negative log-likelihood. Training only that layer on top of a frozen pretrained network (linear probing) is fitting a logistic regression.' },
      { title: 'A gradient that does not saturate.', text: String.raw`The gradient of the cross-entropy with respect to the logits is $\mathbf{p} - \mathbf{y}$: bounded and proportional to the error. With MSE on a sigmoid, the gradient is also multiplied by $\sigma'(z)$, almost zero when the output is saturated, even at the wrong value: learning stalls precisely when the prediction is very wrong.` },
      { title: 'Logits, not probabilities.', text: 'Libraries compute these losses from the logits (in PyTorch, CrossEntropyLoss and BCEWithLogitsLoss) with the log-sum-exp trick, which avoids overflows and logarithms of zero. That is why the network should not apply the softmax first.' },
    ],
    quiz: [
      {
        prompt: String.raw`With two classes and logits $z_0$ and $z_1$, what probability does the softmax give to class 1?`,
        options: [
          { text: String.raw`$\sigma(z_1 - z_0)$`, correct: true },
          { text: String.raw`$\sigma(z_1)$` },
          { text: String.raw`$z_1/(z_0 + z_1)$` },
        ],
        explain: String.raw`Dividing numerator and denominator by $e^{z_1}$: $e^{z_1}/(e^{z_0} + e^{z_1}) = 1/(1 + e^{-(z_1 - z_0)})$. That is why, with two classes, a single logit is enough.`,
      },
      {
        prompt: String.raw`In a binary logistic regression, $w_j = -0.5$. If $x_j$ increases by one unit and nothing else changes, the odds of the positive class:`,
        options: [
          { text: 'Decrease by 0.5.' },
          { text: String.raw`Are multiplied by $e^{-0.5} \approx 0.61$.`, correct: true },
          { text: 'Are multiplied by 0.5.' },
        ],
        explain: String.raw`The log-odds drop by 0.5, so the odds are multiplied by $e^{-0.5} \approx 0.61$: they fall by 39%. The probability changes less, and by how much depends on the starting point.`,
      },
      {
        prompt: 'You train an unregularized logistic regression on linearly separable data. What happens?',
        options: [
          { text: 'It converges to finite weights with zero loss.' },
          { text: 'The optimizer cannot make any progress from the start.' },
          { text: 'The norm of the weights keeps growing and the loss tends to zero without reaching it.', correct: true },
        ],
        explain: 'Scaling up weights that separate the classes always increases the likelihood, so there is no finite maximum. The predictions get ever closer to 0 and 1.',
      },
    ],
    further: [
      { book: 'pml1', where: '§10.2 (binary logistic regression: MLE, gradient descent, IRLS, MAP estimation and standardization), §10.3 (the multinomial case) and §2.5.2–2.5.4 (softmax and the log-sum-exp trick).' },
      { book: 'wilks', where: '§7.6.2 (logistic regression as a generalized linear model for probability forecasts).' },
    ],
  },
};

export default content;
