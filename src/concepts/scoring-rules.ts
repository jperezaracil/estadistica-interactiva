import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Una regla de puntuación compara una predicción probabilística con lo que ocurrió. Si es propia, la mejor puntuación esperada se consigue diciendo las probabilidades que de verdad crees: premia la honestidad, no la exageración.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Crees que mañana lloverá con probabilidad 0,7. Si te puntúan con el error absoluto $|p - y|$, con $y = 1$ si llueve, anunciar 0,7 te cuesta en promedio 0,42, pero anunciar 1 solo te cuesta 0,30: esa regla premia exagerar. Con el error al cuadrado, $(p - y)^2$, anunciar 0,7 cuesta en promedio 0,21, y anunciar 1 sigue costando 0,30: ahora lo mejor es decir lo que crees.` },
          { key: String.raw`Una regla es propia si, cuando tus probabilidades son $q$, anunciar $q$ optimiza la puntuación esperada, y estrictamente propia si es la única manera de optimizarla.` },
        ],
      },
      {
        id: 'reglas',
        title: 'Tres reglas propias',
        blocks: [
          {
            list: [
              String.raw`**Brier:** para un suceso binario, $\mathrm{BS} = \frac{1}{n}\sum_i (p_i - y_i)^2$, el error cuadrático medio de la probabilidad; va de 0 a 1. Con $K$ clases se suman los cuadrados de la diferencia con el vector one-hot (algunos textos dividen además entre $K$).`,
              String.raw`**Logarítmica** (log-loss, ignorancia): $-\frac{1}{n}\sum_i \log p_i(y_i)$, donde $p_i(y_i)$ es la probabilidad que diste a lo que ocurrió. Es la [[cross-entropy|entropía cruzada]] y no está acotada: dar una probabilidad casi nula a algo que ocurre cuesta muchísimo.`,
            ],
          },
          { p: String.raw`**CRPS:** para una variable continua, compara la función de distribución predicha $F$ con el escalón que salta en el valor observado $y$:` },
          { math: String.raw`\mathrm{CRPS}(F, y) = \int_{-\infty}^{\infty} \big(F(z) - \mathbb{I}(z \ge y)\big)^2\,dz = \mathbb{E}_F|Y - y| - \tfrac{1}{2}\,\mathbb{E}_F|Y - Y'|` },
          { p: String.raw`donde $Y$ e $Y'$ son dos valores independientes de $F$ (la segunda forma vale si $F$ tiene media finita). Se mide en las unidades de $y$ y, para una predicción puntual, se reduce al error absoluto.` },
        ],
      },
      {
        id: 'propiedades',
        title: 'Propiedades',
        blocks: [
          {
            list: [
              '**Cuáles son propias:** el Brier, la logarítmica y el CRPS son estrictamente propias. El error absoluto sobre probabilidades no es propio, y la accuracy tras aplicar un umbral es propia pero no estrictamente: da igual anunciar 0,51 que 0,99.',
              String.raw`**Sensibilidad a los extremos:** si el suceso ocurre y dijiste 0,001, el Brier te cobra 0,998 y la logarítmica, $-\ln 0{,}001 \approx 6{,}9$ nats. La logarítmica castiga mucho más los errores muy confiados.`,
              '**Calibración y resolución:** una regla propia premia a la vez que las probabilidades sean fiables y que distingan unos casos de otros; la descomposición del Brier separa las dos partes (ver [[calibration]]).',
              String.raw`**Habilidad:** para interpretar una puntuación $S$ se compara con la de una referencia, como predecir siempre la frecuencia media: $1 - S/S_{\mathrm{ref}}$ es positiva si mejoras a la referencia.`,
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Si el modelo da probabilidades, basta con medir la accuracy.»', fix: 'La accuracy solo mira de qué lado del umbral cae cada probabilidad: acertar con 0,51 o con 0,99 cuenta igual, y fallar también. Una regla estrictamente propia distingue esos casos.' },
      { claim: '«El log-loss y el Brier siempre ordenan igual los modelos.»', fix: 'Los dos son propios, pero pueden discrepar: la logarítmica castiga sin límite los errores muy confiados y el Brier está acotado. Un solo caso con probabilidad 0,001 para algo que ocurrió puede decidir la comparación en log-loss.' },
      { claim: '«Una regla propia garantiza que el modelo esté calibrado.»', fix: 'Garantiza que decir la verdad es la mejor estrategia en promedio, no que tu modelo lo consiga. Una buena puntuación global puede esconder zonas mal calibradas: mira también el diagrama de fiabilidad ([[calibration]]).' },
      { claim: '«El CRPS solo sirve para ensembles meteorológicos.»', fix: 'Sirve para cualquier predicción de una variable continua: una normal, unos cuantiles o un conjunto de muestras. Y como con una predicción puntual se reduce al error absoluto, compara modelos deterministas y probabilísticos en las mismas unidades.' },
    ],
    dl: [
      { title: 'Entrenar con una regla propia.', text: 'La entropía cruzada es la regla logarítmica, así que minimizarla empuja al modelo hacia las probabilidades reales. Pero con redes grandes y datos finitos, la pérdida de entrenamiento puede seguir bajando a base de exagerar la confianza, y la log-loss de test puede subir mientras la accuracy mejora: ver [[calibration]].' },
      { title: 'Evaluar con más de una.', text: 'Además de la accuracy, informa de la log-verosimilitud negativa y del Brier en test. La primera es muy sensible a unos pocos errores con mucha confianza y el segundo es más robusto; si discrepan, revisa esos casos.' },
      { title: 'El CRPS como pérdida.', text: 'En regresión probabilística, por ejemplo al posprocesar pronósticos meteorológicos o de producción renovable, el CRPS se usa también como pérdida de entrenamiento: tiene fórmula cerrada para salidas normales y se puede estimar con muestras cuando la red genera escenarios.' },
    ],
    quiz: [
      {
        prompt: String.raw`Crees que un suceso ocurrirá con probabilidad 0,2 y te puntúan con el error absoluto $|p - y|$. ¿Qué anuncio minimiza tu puntuación esperada?`,
        options: [
          { text: '0,2, lo que crees.' },
          { text: '0', correct: true },
          { text: '0,5, por prudencia.' },
        ],
        explain: String.raw`La puntuación esperada es $0{,}2\,(1-p) + 0{,}8\,p = 0{,}2 + 0{,}6\,p$, mínima en $p = 0$: vale 0,2, frente a 0,32 si anuncias 0,2. El error absoluto no es propio: premia exagerar.`,
      },
      {
        prompt: 'Tu modelo dio probabilidad 0,01 a un suceso que ocurrió. ¿Cuánto vale la log-loss de ese caso, en nats?',
        options: [
          { text: 'Unos 4,6.', correct: true },
          { text: 'Unos 0,98.' },
          { text: '0,01' },
        ],
        explain: String.raw`$-\ln 0{,}01 \approx 4{,}605$. El Brier del mismo caso sería $(0{,}01 - 1)^2 \approx 0{,}98$: la logarítmica castiga mucho más los errores confiados.`,
      },
      {
        prompt: 'Un modelo predice una distribución para la temperatura de mañana, en °C. ¿En qué unidades se mide su CRPS?',
        options: [
          { text: 'En nats.' },
          { text: 'Sin unidades, entre 0 y 1.' },
          { text: 'En °C.', correct: true },
        ],
        explain: String.raw`Es una integral sobre los valores de $y$ de diferencias de probabilidades al cuadrado, así que tiene las unidades de $y$, como el error absoluto al que se reduce con una predicción puntual. La logarítmica se mide en nats o bits, y el Brier va de 0 a 1.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§9.4.2 (puntuación de Brier), §9.4.7 (puntuación logarítmica o de ignorancia), §9.4.8 (reglas estrictamente propias y por qué no se pueden manipular) y §9.5.1 (CRPS).' },
      { book: 'pml1', where: '§5.1.6 (predicción probabilística: KL, entropía cruzada, log-loss, reglas propias y Brier).' },
      { book: 'pml2', where: '§14.2.1 (reglas de puntuación propias para evaluar modelos predictivos).' },
    ],
    extra: [
      { text: 'Gneiting, T. y Raftery, A. E. (2007). Strictly proper scoring rules, prediction, and estimation. Journal of the American Statistical Association, 102(477), 359–378.', url: 'https://doi.org/10.1198/016214506000001437' },
    ],
  },
  en: {
    lede: 'A scoring rule compares a probabilistic prediction with what actually happened. If it is proper, the best expected score is obtained by stating the probabilities you actually believe: it rewards honesty, not exaggeration.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`You believe it will rain tomorrow with probability 0.7. If you are scored with the absolute error $|p - y|$, with $y = 1$ if it rains, announcing 0.7 costs you 0.42 on average, but announcing 1 costs you only 0.30: that rule rewards exaggeration. With the squared error, $(p - y)^2$, announcing 0.7 costs 0.21 on average, and announcing 1 still costs 0.30: now the best thing to do is to say what you believe.` },
          { key: String.raw`A rule is proper if, when your probabilities are $q$, announcing $q$ optimizes the expected score, and strictly proper if it is the only way to optimize it.` },
        ],
      },
      {
        id: 'rules',
        title: 'Three proper rules',
        blocks: [
          {
            list: [
              String.raw`**Brier:** for a binary event, $\mathrm{BS} = \frac{1}{n}\sum_i (p_i - y_i)^2$, the mean squared error of the probability; it ranges from 0 to 1. With $K$ classes you add up the squared differences with the one-hot vector (some texts also divide by $K$).`,
              String.raw`**Logarithmic** (log loss, ignorance): $-\frac{1}{n}\sum_i \log p_i(y_i)$, where $p_i(y_i)$ is the probability you gave to what happened. It is the [[cross-entropy|cross-entropy]] and it is unbounded: giving an almost zero probability to something that happens costs a great deal.`,
            ],
          },
          { p: String.raw`**CRPS:** for a continuous variable, it compares the predicted distribution function $F$ with the step that jumps at the observed value $y$:` },
          { math: String.raw`\mathrm{CRPS}(F, y) = \int_{-\infty}^{\infty} \big(F(z) - \mathbb{I}(z \ge y)\big)^2\,dz = \mathbb{E}_F|Y - y| - \tfrac{1}{2}\,\mathbb{E}_F|Y - Y'|` },
          { p: String.raw`where $Y$ and $Y'$ are two independent draws from $F$ (the second form holds if $F$ has a finite mean). It is measured in the units of $y$ and, for a point forecast, it reduces to the absolute error.` },
        ],
      },
      {
        id: 'properties',
        title: 'Properties',
        blocks: [
          {
            list: [
              '**Which ones are proper:** Brier, logarithmic and CRPS are strictly proper. The absolute error on probabilities is not proper, and accuracy after thresholding is proper but not strictly: announcing 0.51 or 0.99 makes no difference.',
              String.raw`**Sensitivity to extremes:** if the event happens and you said 0.001, the Brier score charges you 0.998 and the logarithmic score $-\ln 0.001 \approx 6.9$ nats. The logarithmic score punishes very confident mistakes much more.`,
              '**Calibration and resolution:** a proper rule rewards both probabilities that are reliable and probabilities that tell cases apart; the Brier decomposition separates the two parts (see [[calibration]]).',
              String.raw`**Skill:** to interpret a score $S$, you compare it with that of a reference, such as always predicting the average frequency: $1 - S/S_{\mathrm{ref}}$ is positive if you beat the reference.`,
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '“If the model outputs probabilities, measuring accuracy is enough.”', fix: 'Accuracy only looks at which side of the threshold each probability falls on: being right with 0.51 or with 0.99 counts the same, and so does being wrong. A strictly proper rule tells those cases apart.' },
      { claim: '“Log loss and the Brier score always rank models the same way.”', fix: 'Both are proper, but they can disagree: the logarithmic score punishes very confident mistakes without limit, while the Brier score is bounded. A single case with probability 0.001 for something that happened can decide the comparison in log loss.' },
      { claim: '“A proper rule guarantees that the model is calibrated.”', fix: 'It guarantees that telling the truth is the best strategy on average, not that your model manages to do so. A good overall score can hide poorly calibrated regions: also look at the reliability diagram ([[calibration]]).' },
      { claim: '“CRPS is only for weather ensembles.”', fix: 'It works for any prediction of a continuous variable: a normal distribution, a set of quantiles or a set of samples. And since for a point forecast it reduces to the absolute error, it compares deterministic and probabilistic models in the same units.' },
    ],
    dl: [
      { title: 'Training with a proper rule.', text: 'Cross-entropy is the logarithmic rule, so minimizing it pushes the model towards the true probabilities. But with large networks and finite data, the training loss can keep falling by exaggerating confidence, and the test log loss can rise while accuracy improves: see [[calibration]].' },
      { title: 'Evaluating with more than one.', text: 'Besides accuracy, report the negative log-likelihood and the Brier score on the test set. The former is very sensitive to a few highly confident mistakes and the latter is more robust; if they disagree, inspect those cases.' },
      { title: 'CRPS as a loss.', text: 'In probabilistic regression, for example when post-processing weather or renewable-energy forecasts, CRPS is also used as a training loss: it has a closed form for normal outputs and can be estimated from samples when the network generates scenarios.' },
    ],
    quiz: [
      {
        prompt: String.raw`You believe an event will happen with probability 0.2 and you are scored with the absolute error $|p - y|$. Which announcement minimizes your expected score?`,
        options: [
          { text: '0.2, what you believe.' },
          { text: '0', correct: true },
          { text: '0.5, to be cautious.' },
        ],
        explain: String.raw`The expected score is $0.2\,(1-p) + 0.8\,p = 0.2 + 0.6\,p$, minimal at $p = 0$: it equals 0.2, against 0.32 if you announce 0.2. The absolute error is not proper: it rewards exaggeration.`,
      },
      {
        prompt: 'Your model gave probability 0.01 to an event that happened. What is the log loss for that case, in nats?',
        options: [
          { text: 'About 4.6.', correct: true },
          { text: 'About 0.98.' },
          { text: '0.01' },
        ],
        explain: String.raw`$-\ln 0.01 \approx 4.605$. The Brier score of the same case would be $(0.01 - 1)^2 \approx 0.98$: the logarithmic score punishes confident mistakes much more.`,
      },
      {
        prompt: 'A model predicts a distribution for tomorrow’s temperature, in °C. In what units is its CRPS measured?',
        options: [
          { text: 'In nats.' },
          { text: 'Unitless, between 0 and 1.' },
          { text: 'In °C.', correct: true },
        ],
        explain: String.raw`It is an integral over the values of $y$ of squared differences of probabilities, so it has the units of $y$, like the absolute error it reduces to for a point forecast. The logarithmic score is measured in nats or bits, and the Brier score ranges from 0 to 1.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§9.4.2 (the Brier score), §9.4.7 (the logarithmic or ignorance score), §9.4.8 (strictly proper scoring rules and why they cannot be hedged) and §9.5.1 (CRPS).' },
      { book: 'pml1', where: '§5.1.6 (probabilistic prediction: KL, cross-entropy, log loss, proper scoring rules and the Brier score).' },
      { book: 'pml2', where: '§14.2.1 (proper scoring rules to evaluate predictive models).' },
    ],
    extra: [
      { text: 'Gneiting, T. and Raftery, A. E. (2007). Strictly proper scoring rules, prediction, and estimation. Journal of the American Statistical Association, 102(477), 359–378.', url: 'https://doi.org/10.1198/016214506000001437' },
    ],
  },
};

export default content;
