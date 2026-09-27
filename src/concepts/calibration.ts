import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Un modelo está calibrado si sus probabilidades coinciden con las frecuencias observadas: de todas las veces que dice 70 %, el suceso ocurre alrededor del 70 %. Es una propiedad distinta de acertar mucho.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Un servicio meteorológico anuncia «70 % de probabilidad de lluvia» en 200 días. Si llovió en unos 140, sus probabilidades significan lo que dicen. Una red que clasifica imágenes puede acertar mucho y, aun así, estar mal calibrada: si da confianzas del 99 % y acierta el 90 % de esos casos, es demasiado segura.' },
          { key: String.raw`Calibración: $P(Y = 1 \mid \hat p = p) = p$ para todo $p$. No basta con eso: predecir siempre la frecuencia media está perfectamente calibrado, pero no distingue un caso de otro.` },
        ],
      },
      {
        id: 'medir',
        title: 'Diagrama de fiabilidad y ECE',
        blocks: [
          { p: 'Agrupa las predicciones en intervalos según la probabilidad anunciada y compara, en cada uno, la probabilidad media con la frecuencia observada. El diagrama de fiabilidad las enfrenta, y la diagonal es la calibración perfecta. En multiclase se suele usar la confianza (la probabilidad de la clase predicha) frente a la accuracy; los puntos por debajo de la diagonal indican exceso de confianza. El error de calibración esperado (ECE) resume las distancias:' },
          { math: String.raw`\mathrm{ECE} = \sum_{b=1}^{B} \frac{n_b}{n}\,\big|\mathrm{acc}_b - \mathrm{conf}_b\big|` },
          {
            table: {
              head: ['Confianza media', 'Casos', 'Accuracy'],
              rows: [
                ['0,55', '200', '0,52'],
                ['0,75', '300', '0,66'],
                ['0,95', '500', '0,81'],
              ],
              numeric: [0, 1, 2],
            },
          },
          { p: String.raw`Aquí el ECE vale 0,103: la confianza media es 0,81 y la accuracy, 0,707. El ECE depende del número de intervalos y, con pocos casos por intervalo, tiende a sobrestimar el error. Para predicciones continuas se usa el histograma PIT: si el modelo está calibrado, los valores $F_i(y_i)$ son uniformes.` },
        ],
      },
      {
        id: 'descomposicion',
        title: 'Fiabilidad y resolución',
        blocks: [
          { p: String.raw`Para sucesos binarios, la [[scoring-rules|puntuación de Brier]] se descompone de forma exacta cuando las predicciones toman unos pocos valores $p_b$:` },
          { math: String.raw`\mathrm{BS} = \underbrace{\frac{1}{n}\sum_{b} n_b\,(p_b - \bar o_b)^2}_{\text{fiabilidad}} - \underbrace{\frac{1}{n}\sum_{b} n_b\,(\bar o_b - \bar o)^2}_{\text{resolución}} + \underbrace{\bar o\,(1 - \bar o)}_{\text{incertidumbre}}` },
          { p: String.raw`Aquí $n_b$ es el número de veces que se predijo $p_b$, $\bar o_b$ la frecuencia del suceso en esas veces y $\bar o$ la global. La fiabilidad mide la calibración, y la resolución, cuánto se alejan de la media las frecuencias de cada grupo. Predecir siempre $\bar o$ tiene fiabilidad y resolución nulas: su Brier es la incertidumbre.` },
        ],
      },
      {
        id: 'recalibrar',
        title: 'Recalibrar',
        blocks: [
          { p: String.raw`Un modelo mal calibrado se puede corregir después de entrenar, con un conjunto de validación: el **escalado de Platt** ajusta una regresión logística sobre la puntuación; la **regresión isotónica**, una función creciente cualquiera; y el **escalado de temperatura** divide todos los logits por un único $T > 0$, elegido minimizando la log-verosimilitud negativa en validación:` },
          { math: String.raw`\hat{\mathbf{p}} = \mathrm{softmax}(\mathbf{z}/T)` },
          { p: String.raw`Con $T > 1$ las probabilidades se suavizan: los logits $[2;\ 1;\ 0]$ dan $[0{,}665;\ 0{,}245;\ 0{,}090]$ con $T = 1$ y $[0{,}506;\ 0{,}307;\ 0{,}186]$ con $T = 2$. La clase más probable no cambia, así que la accuracy tampoco.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Si el modelo acierta mucho, sus probabilidades son fiables.»', fix: 'Accuracy y calibración son cosas distintas. Muchas redes profundas entrenadas con entropía cruzada dan confianzas mayores que su tasa de aciertos, aunque depende de la arquitectura y del entrenamiento: hay que medirlo.' },
      { claim: '«Un modelo calibrado es un buen modelo.»', fix: 'Predecir siempre la frecuencia media está calibrado y no sirve para nada. Lo que se busca es la máxima resolución, o nitidez, sin perder la calibración.' },
      { claim: '«El escalado de temperatura mejora la accuracy.»', fix: 'Divide todos los logits por el mismo número positivo, así que no cambia el orden de las clases ni la predicción. Solo cambia la confianza.' },
      { claim: '«Un ECE bajo demuestra que el modelo está calibrado.»', fix: 'Depende de los intervalos elegidos, en multiclase solo mira la clase predicha, y dentro de un intervalo se compensan predicciones demasiado seguras con otras demasiado prudentes. Úsalo junto con el diagrama de fiabilidad y una regla propia.' },
    ],
    dl: [
      { title: 'Escalado de temperatura.', text: 'Es la corrección más sencilla: un solo parámetro, ajustado en validación, que no cambia la clase predicha. Guo et al. (2017) mostraron que muchas redes modernas eran demasiado confiadas y que este método corregía gran parte del problema.' },
      { title: 'Entrenamiento y calibración.', text: 'Los ensembles de redes y algunas técnicas como el suavizado de etiquetas o mixup suelen reducir el exceso de confianza, pero el efecto varía de un caso a otro: mide siempre la calibración en validación.' },
      { title: 'Cambio de distribución.', text: 'Una calibración ajustada con datos de validación de la misma distribución no tiene por qué mantenerse cuando cambian los datos (otro hospital, otro sensor, otra estación del año): la accuracy suele bajar más deprisa que la confianza. Ver [[uncertainty]].' },
    ],
    quiz: [
      {
        prompt: 'De todas las veces que tu modelo predice 0,8, el suceso ocurre el 60 %. En ese nivel, el modelo:',
        options: [
          { text: 'Es demasiado confiado.', correct: true },
          { text: 'Es poco confiado.' },
          { text: 'Está calibrado.' },
        ],
        explain: 'Anuncia más probabilidad (0,8) de la que se observa (0,6): en el diagrama de fiabilidad, el punto queda por debajo de la diagonal.',
      },
      {
        prompt: String.raw`Ajustas el escalado de temperatura en validación y obtienes $T = 1{,}8$. ¿Qué indica?`,
        options: [
          { text: 'Que el modelo era poco confiado.' },
          { text: 'Que el modelo era demasiado confiado.', correct: true },
          { text: 'Que su accuracy va a mejorar.' },
        ],
        explain: String.raw`Con $T > 1$ las probabilidades se vuelven menos extremas, y el ajuste solo lo elige si así baja la log-verosimilitud negativa en validación: el modelo daba confianzas demasiado altas. La accuracy no cambia, porque el orden de los logits se mantiene.`,
      },
      {
        prompt: 'Llueve el 30 % de los días y un modelo anuncia siempre «30 % de probabilidad de lluvia». ¿Qué puedes decir?',
        options: [
          { text: 'Que está mal calibrado.' },
          { text: 'Que es el mejor pronóstico posible.' },
          { text: 'Que está calibrado pero no tiene resolución: su Brier es 0,21, la incertidumbre.', correct: true },
        ],
        explain: String.raw`Su fiabilidad y su resolución son nulas, así que $\mathrm{BS} = 0{,}3 \cdot 0{,}7 = 0{,}21$. Cualquier modelo que distinga días más y menos lluviosos sin perder calibración lo mejora.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§9.4.3 (descomposición del Brier en fiabilidad, resolución e incertidumbre), §9.4.4 (diagrama de fiabilidad) y §9.5.4 (histograma PIT para distribuciones continuas).' },
      { book: 'pml2', where: '§14.2.2 (ECE, diagramas de fiabilidad y formas de mejorar la calibración: escalado de Platt, histogramas, regresión isotónica, escalado de temperatura, suavizado de etiquetas y métodos bayesianos).' },
    ],
    extra: [
      { text: 'Guo, C., Pleiss, G., Sun, Y. y Weinberger, K. Q. (2017). On calibration of modern neural networks. Proceedings of the 34th International Conference on Machine Learning, PMLR 70, 1321–1330.', url: 'https://proceedings.mlr.press/v70/guo17a.html' },
    ],
  },
  en: {
    lede: 'A model is calibrated if its probabilities match the observed frequencies: of all the times it says 70%, the event happens about 70% of the time. That is a different property from being accurate.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'A weather service announces “70% chance of rain” on 200 days. If it rained on about 140 of them, its probabilities mean what they say. An image classification network can be very accurate and still be poorly calibrated: if it gives 99% confidence and is right on 90% of those cases, it is overconfident.' },
          { key: String.raw`Calibration: $P(Y = 1 \mid \hat p = p) = p$ for every $p$. That is not enough: always predicting the average frequency is perfectly calibrated, but it does not tell one case from another.` },
        ],
      },
      {
        id: 'measuring',
        title: 'Reliability diagram and ECE',
        blocks: [
          { p: 'Group the predictions into bins according to the announced probability and compare, in each bin, the mean probability with the observed frequency. The reliability diagram plots one against the other, and the diagonal is perfect calibration. For multiclass models, confidence (the probability of the predicted class) is usually plotted against accuracy; points below the diagonal indicate overconfidence. The expected calibration error (ECE) summarizes the distances:' },
          { math: String.raw`\mathrm{ECE} = \sum_{b=1}^{B} \frac{n_b}{n}\,\big|\mathrm{acc}_b - \mathrm{conf}_b\big|` },
          {
            table: {
              head: ['Mean confidence', 'Cases', 'Accuracy'],
              rows: [
                ['0.55', '200', '0.52'],
                ['0.75', '300', '0.66'],
                ['0.95', '500', '0.81'],
              ],
              numeric: [0, 1, 2],
            },
          },
          { p: String.raw`Here the ECE is 0.103: the mean confidence is 0.81 and the accuracy 0.707. The ECE depends on the number of bins and, with few cases per bin, it tends to overestimate the error. For continuous predictions the PIT histogram is used: if the model is calibrated, the values $F_i(y_i)$ are uniform.` },
        ],
      },
      {
        id: 'decomposition',
        title: 'Reliability and resolution',
        blocks: [
          { p: String.raw`For binary events, the [[scoring-rules|Brier score]] decomposes exactly when the predictions take a few values $p_b$:` },
          { math: String.raw`\mathrm{BS} = \underbrace{\frac{1}{n}\sum_{b} n_b\,(p_b - \bar o_b)^2}_{\text{reliability}} - \underbrace{\frac{1}{n}\sum_{b} n_b\,(\bar o_b - \bar o)^2}_{\text{resolution}} + \underbrace{\bar o\,(1 - \bar o)}_{\text{uncertainty}}` },
          { p: String.raw`Here $n_b$ is the number of times $p_b$ was predicted, $\bar o_b$ the frequency of the event on those occasions and $\bar o$ the overall one. Reliability measures calibration, and resolution how far the frequencies of each group are from the mean. Always predicting $\bar o$ has zero reliability and resolution terms: its Brier score is the uncertainty.` },
        ],
      },
      {
        id: 'recalibrating',
        title: 'Recalibrating',
        blocks: [
          { p: String.raw`A poorly calibrated model can be corrected after training, with a validation set: **Platt scaling** fits a logistic regression on the score; **isotonic regression**, any increasing function; and **temperature scaling** divides all the logits by a single $T > 0$, chosen by minimizing the negative log-likelihood on validation data:` },
          { math: String.raw`\hat{\mathbf{p}} = \mathrm{softmax}(\mathbf{z}/T)` },
          { p: String.raw`With $T > 1$ the probabilities become softer: the logits $[2,\ 1,\ 0]$ give $[0.665,\ 0.245,\ 0.090]$ with $T = 1$ and $[0.506,\ 0.307,\ 0.186]$ with $T = 2$. The most probable class does not change, so neither does the accuracy.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“If the model is very accurate, its probabilities are reliable.”', fix: 'Accuracy and calibration are different things. Many deep networks trained with cross-entropy give confidences higher than their hit rate, although it depends on the architecture and the training: you have to measure it.' },
      { claim: '“A calibrated model is a good model.”', fix: 'Always predicting the average frequency is calibrated and useless. What you want is maximum resolution, or sharpness, without losing calibration.' },
      { claim: '“Temperature scaling improves accuracy.”', fix: 'It divides all the logits by the same positive number, so it does not change the order of the classes or the prediction. It only changes the confidence.' },
      { claim: '“A low ECE proves that the model is calibrated.”', fix: 'It depends on the chosen bins, in the multiclass case it only looks at the predicted class, and within a bin overconfident predictions cancel out underconfident ones. Use it together with the reliability diagram and a proper scoring rule.' },
    ],
    dl: [
      { title: 'Temperature scaling.', text: 'It is the simplest fix: a single parameter, fitted on validation data, that does not change the predicted class. Guo et al. (2017) showed that many modern networks were overconfident and that this method removed much of the problem.' },
      { title: 'Training and calibration.', text: 'Ensembles of networks and some techniques such as label smoothing or mixup usually reduce overconfidence, but the effect varies from case to case: always measure calibration on validation data.' },
      { title: 'Distribution shift.', text: 'A calibration fitted on validation data from the same distribution need not hold when the data change (another hospital, another sensor, another season): accuracy usually drops faster than confidence. See [[uncertainty]].' },
    ],
    quiz: [
      {
        prompt: 'Of all the times your model predicts 0.8, the event happens 60% of the time. At that level, the model:',
        options: [
          { text: 'Is overconfident.', correct: true },
          { text: 'Is underconfident.' },
          { text: 'Is calibrated.' },
        ],
        explain: 'It announces a higher probability (0.8) than the one observed (0.6): in the reliability diagram, the point lies below the diagonal.',
      },
      {
        prompt: String.raw`You fit temperature scaling on validation data and get $T = 1.8$. What does it indicate?`,
        options: [
          { text: 'That the model was underconfident.' },
          { text: 'That the model was overconfident.', correct: true },
          { text: 'That its accuracy will improve.' },
        ],
        explain: String.raw`With $T > 1$ the probabilities become less extreme, and the fit only chooses it if that lowers the negative log-likelihood on validation data: the model’s confidences were too high. Accuracy does not change, because the order of the logits is preserved.`,
      },
      {
        prompt: 'It rains on 30% of days and a model always announces “30% chance of rain”. What can you say?',
        options: [
          { text: 'That it is miscalibrated.' },
          { text: 'That it is the best possible forecast.' },
          { text: 'That it is calibrated but has no resolution: its Brier score is 0.21, the uncertainty term.', correct: true },
        ],
        explain: String.raw`Its reliability and resolution terms are zero, so $\mathrm{BS} = 0.3 \cdot 0.7 = 0.21$. Any model that tells rainier days from drier ones without losing calibration beats it.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§9.4.3 (decomposition of the Brier score into reliability, resolution and uncertainty), §9.4.4 (the reliability diagram) and §9.5.4 (the PIT histogram for continuous distributions).' },
      { book: 'pml2', where: '§14.2.2 (ECE, reliability diagrams and ways to improve calibration: Platt scaling, histogram binning, isotonic regression, temperature scaling, label smoothing and Bayesian methods).' },
    ],
    extra: [
      { text: 'Guo, C., Pleiss, G., Sun, Y. and Weinberger, K. Q. (2017). On calibration of modern neural networks. Proceedings of the 34th International Conference on Machine Learning, PMLR 70, 1321–1330.', url: 'https://proceedings.mlr.press/v70/guo17a.html' },
    ],
  },
};

export default content;
