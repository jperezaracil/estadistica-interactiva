import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Cómo resumir los aciertos y los errores de un clasificador: la matriz de confusión, las tasas que se calculan con ella y las curvas que muestran qué pasa al mover el umbral de decisión.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Una enfermedad afecta al 1 % de la población. Un clasificador que siempre dice «sano» acierta el 99 % de las veces y no sirve para nada. Otro, con sensibilidad 0,90 y especificidad 0,95, aplicado a 10 000 personas, detecta a 90 de los 100 enfermos, pero da 495 falsos positivos: solo el 15 % de sus positivos están enfermos (90 de 585), y su accuracy, del 94,95 %, es menor que la del clasificador inútil.' },
          { key: 'La sensibilidad y la especificidad se calculan dentro de cada clase real; la precisión, dentro de cada predicción. Por eso la precisión depende de lo frecuente que sea la clase positiva, como enseña el [[bayes-rule|teorema de Bayes]].' },
        ],
      },
      {
        id: 'matriz',
        title: 'La matriz de confusión',
        blocks: [
          {
            table: {
              head: ['Clase real', 'Predicción positiva', 'Predicción negativa'],
              rows: [
                ['Positiva', 'VP (verdadero positivo)', 'FN (falso negativo)'],
                ['Negativa', 'FP (falso positivo)', 'VN (verdadero negativo)'],
              ],
            },
          },
          {
            list: [
              String.raw`**Sensibilidad** (recall, tasa de verdaderos positivos): $\mathrm{VP}/(\mathrm{VP}+\mathrm{FN}) = P(\hat y = 1 \mid y = 1)$.`,
              String.raw`**Especificidad:** $\mathrm{VN}/(\mathrm{VN}+\mathrm{FP})$. Su complemento es la tasa de falsos positivos, $\mathrm{FPR} = P(\hat y = 1 \mid y = 0)$.`,
              String.raw`**Precisión** (valor predictivo positivo): $\mathrm{VP}/(\mathrm{VP}+\mathrm{FP}) = P(y = 1 \mid \hat y = 1)$.`,
              String.raw`**F1:** media armónica de precisión y sensibilidad, $2\,\mathrm{VP}/(2\,\mathrm{VP}+\mathrm{FP}+\mathrm{FN})$. No usa los verdaderos negativos.`,
            ],
          },
          { p: String.raw`Si «positivo» significa rechazar la hipótesis nula, la FPR es el nivel $\alpha$ y la sensibilidad, la [[errors-power|potencia]]. En verificación de pronósticos, la sensibilidad es la tasa de aciertos (hit rate) y la FPR, la tasa de falsas alarmas; no la confundas con la razón de falsas alarmas (false alarm ratio), que es 1 menos la precisión.` },
        ],
      },
      {
        id: 'roc',
        title: 'Curvas ROC y AUC',
        blocks: [
          { p: String.raw`Un clasificador probabilístico da una puntuación $s(\mathbf{x})$ y predice «positivo» si supera un umbral $t$. Cada umbral da un punto (FPR, sensibilidad), y al recorrerlos todos se obtiene la curva ROC, de $(0, 0)$ a $(1, 1)$; la diagonal es decidir al azar. El área bajo la curva tiene una lectura directa:` },
          { math: String.raw`\mathrm{AUC} = P\big(s^+ > s^-\big) + \tfrac{1}{2}\,P\big(s^+ = s^-\big)` },
          { p: String.raw`donde $s^+$ y $s^-$ son las puntuaciones de un positivo y de un negativo elegidos al azar. Es el estadístico $U$ de Mann-Whitney dividido entre el número de pares positivo-negativo (ver [[nonparametric-tests|tests no paramétricos]]), y solo depende del orden de las puntuaciones. Con clases muy desequilibradas, complétala con la curva precisión-sensibilidad: con un 1 % de positivos, una FPR del 1 % supone 99 falsos positivos por cada 100 positivos reales.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Una accuracy del 99 % indica un buen clasificador.»', fix: 'Depende de la proporción de clases: con un 1 % de positivos, decir siempre «negativo» ya da el 99 %. Compárala con esa referencia y mira también la sensibilidad y la precisión.' },
      { claim: '«Una sensibilidad del 90 % significa que el 90 % de los positivos predichos son correctos.»', fix: String.raw`Eso es la precisión. La sensibilidad es $P(\hat y = 1 \mid y = 1)$ y la precisión, $P(y = 1 \mid \hat y = 1)$; confundirlas es la falacia de la tasa base.` },
      { claim: '«Una AUC alta garantiza probabilidades fiables.»', fix: 'La AUC no cambia si transformas las puntuaciones con cualquier función estrictamente creciente, así que no dice si una puntuación de 0,8 significa un 80 %. Eso es la [[calibration|calibración]].' },
      { claim: '«El umbral correcto es 0,5.»', fix: String.raw`Depende de los costes. Si un falso negativo cuesta $C_{\mathrm{FN}}$, un falso positivo cuesta $C_{\mathrm{FP}}$ y las probabilidades están calibradas, conviene predecir positivo cuando $p > C_{\mathrm{FP}}/(C_{\mathrm{FP}} + C_{\mathrm{FN}})$.` },
    ],
    dl: [
      { title: 'El umbral se elige en validación.', text: 'La red da probabilidades, y el umbral que maximiza F1 o que garantiza una sensibilidad mínima se fija con el conjunto de validación, nunca con el de test. Con clases desequilibradas suele quedar lejos de 0,5.' },
      { title: 'Métricas no diferenciables.', text: 'La accuracy, F1 y la AUC dependen de umbrales o de órdenes, así que su gradiente respecto a los pesos es nulo en casi todas partes o no existe. Por eso se entrena con entropía cruzada, una [[erm-loss|pérdida sustituta]] diferenciable, y estas métricas se vigilan en validación.' },
      { title: 'Macro y micro.', text: String.raw`Con $K$ clases se calculan precisión y sensibilidad por clase y se promedian. El promedio macro da el mismo peso a cada clase, así que las clases raras cuentan tanto como las frecuentes; el micro da el mismo peso a cada ejemplo. En clasificación multiclase con una sola etiqueta por ejemplo, el F1 micro coincide con la accuracy.` },
    ],
    quiz: [
      {
        prompt: 'Una enfermedad afecta al 5 % de los pacientes. Un test tiene sensibilidad 0,80 y especificidad 0,90. ¿Qué fracción de los positivos del test están enfermos?',
        options: [
          { text: 'Un 80 %.' },
          { text: 'Un 90 %.' },
          { text: 'Alrededor del 30 %.', correct: true },
        ],
        explain: String.raw`Por cada 1000 pacientes hay 40 verdaderos positivos (el 80 % de 50) y 95 falsos positivos (el 10 % de 950). Precisión: $40/135 \approx 0{,}30$.`,
      },
      {
        prompt: 'Un clasificador tiene una AUC de 0,5. ¿Qué significa?',
        options: [
          { text: 'Que acierta la mitad de las veces.' },
          { text: 'Que ordena positivos y negativos como el azar.', correct: true },
          { text: 'Que su mejor umbral es 0,5.' },
        ],
        explain: 'La AUC es la probabilidad de que un positivo reciba más puntuación que un negativo. Con 0,5, en conjunto, las puntuaciones no ordenan mejor que el azar, aunque la accuracy puede ser alta si una clase domina.',
      },
      {
        prompt: 'Un falso negativo cuesta 9 veces más que un falso positivo y las probabilidades están calibradas. ¿Qué umbral minimiza el coste esperado?',
        options: [{ text: '0,5' }, { text: '0,9' }, { text: '0,1', correct: true }],
        explain: String.raw`Predecir positivo cuesta en promedio $(1-p)\,C_{\mathrm{FP}}$, y predecir negativo, $p\,C_{\mathrm{FN}}$. Conviene positivo si $p > 1/(1+9) = 0{,}1$.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§5.1.2 (la clasificación como decisión: pérdida 0-1, costes asimétricos y opción de rechazo), §5.1.3 (matriz de confusión, curva ROC, AUC y desequilibrio de clases) y §5.1.4 (curvas precisión-sensibilidad, F-scores y precisión media).' },
      { book: 'wilks', where: '§9.2.1–9.2.5 (tabla de contingencia 2×2: medidas, puntuaciones de habilidad y cómo convertir probabilidades en predicciones sí/no) y §9.4.6 (diagrama ROC).' },
    ],
    extra: [
      { text: 'Fawcett, T. (2006). An introduction to ROC analysis. Pattern Recognition Letters, 27(8), 861–874.', url: 'https://doi.org/10.1016/j.patrec.2005.10.010' },
    ],
  },
  en: {
    lede: 'How to summarize what a classifier gets right and wrong: the confusion matrix, the rates computed from it and the curves that show what happens as you move the decision threshold.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'A disease affects 1% of the population. A classifier that always says “healthy” is right 99% of the time and is useless. Another one, with sensitivity 0.90 and specificity 0.95, applied to 10,000 people, detects 90 of the 100 sick people but produces 495 false positives: only 15% of its positives are sick (90 of 585), and its accuracy, 94.95%, is lower than that of the useless classifier.' },
          { key: 'Sensitivity and specificity are computed within each true class; precision, within each prediction. That is why precision depends on how common the positive class is, as [[bayes-rule|Bayes’ rule]] shows.' },
        ],
      },
      {
        id: 'matrix',
        title: 'The confusion matrix',
        blocks: [
          {
            table: {
              head: ['True class', 'Predicted positive', 'Predicted negative'],
              rows: [
                ['Positive', 'TP (true positive)', 'FN (false negative)'],
                ['Negative', 'FP (false positive)', 'TN (true negative)'],
              ],
            },
          },
          {
            list: [
              String.raw`**Sensitivity** (recall, true positive rate): $\mathrm{TP}/(\mathrm{TP}+\mathrm{FN}) = P(\hat y = 1 \mid y = 1)$.`,
              String.raw`**Specificity:** $\mathrm{TN}/(\mathrm{TN}+\mathrm{FP})$. Its complement is the false positive rate, $\mathrm{FPR} = P(\hat y = 1 \mid y = 0)$.`,
              String.raw`**Precision** (positive predictive value): $\mathrm{TP}/(\mathrm{TP}+\mathrm{FP}) = P(y = 1 \mid \hat y = 1)$.`,
              String.raw`**F1:** harmonic mean of precision and sensitivity, $2\,\mathrm{TP}/(2\,\mathrm{TP}+\mathrm{FP}+\mathrm{FN})$. It does not use the true negatives.`,
            ],
          },
          { p: String.raw`If “positive” means rejecting the null hypothesis, the FPR is the level $\alpha$ and the sensitivity is the [[errors-power|power]]. In forecast verification, sensitivity is the hit rate and the FPR the false alarm rate; do not confuse it with the false alarm ratio, which is 1 minus the precision.` },
        ],
      },
      {
        id: 'roc',
        title: 'ROC curves and AUC',
        blocks: [
          { p: String.raw`A probabilistic classifier gives a score $s(\mathbf{x})$ and predicts “positive” if it exceeds a threshold $t$. Each threshold gives a point (FPR, sensitivity), and sweeping through all of them traces the ROC curve, from $(0, 0)$ to $(1, 1)$; the diagonal is deciding at random. The area under the curve has a direct reading:` },
          { math: String.raw`\mathrm{AUC} = P\big(s^+ > s^-\big) + \tfrac{1}{2}\,P\big(s^+ = s^-\big)` },
          { p: String.raw`where $s^+$ and $s^-$ are the scores of a positive and a negative chosen at random. It is the Mann–Whitney $U$ statistic divided by the number of positive–negative pairs (see [[nonparametric-tests|nonparametric tests]]), and it only depends on the order of the scores. With highly imbalanced classes, complement it with the precision–recall curve: with 1% positives, an FPR of 1% means 99 false positives for every 100 real positives.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“An accuracy of 99% means a good classifier.”', fix: 'It depends on the class proportions: with 1% positives, always saying “negative” already gives 99%. Compare it with that baseline and also look at sensitivity and precision.' },
      { claim: '“A sensitivity of 90% means that 90% of the predicted positives are correct.”', fix: String.raw`That is precision. Sensitivity is $P(\hat y = 1 \mid y = 1)$ and precision is $P(y = 1 \mid \hat y = 1)$; confusing them is the base rate fallacy.` },
      { claim: '“A high AUC guarantees reliable probabilities.”', fix: 'The AUC does not change if you transform the scores with any strictly increasing function, so it does not tell you whether a score of 0.8 means 80%. That is [[calibration|calibration]].' },
      { claim: '“The right threshold is 0.5.”', fix: String.raw`It depends on the costs. If a false negative costs $C_{\mathrm{FN}}$, a false positive costs $C_{\mathrm{FP}}$ and the probabilities are calibrated, it pays to predict positive when $p > C_{\mathrm{FP}}/(C_{\mathrm{FP}} + C_{\mathrm{FN}})$.` },
    ],
    dl: [
      { title: 'The threshold is chosen on validation data.', text: 'The network outputs probabilities, and the threshold that maximizes F1 or guarantees a minimum sensitivity is set on the validation set, never on the test set. With imbalanced classes it is often far from 0.5.' },
      { title: 'Non-differentiable metrics.', text: 'Accuracy, F1 and AUC depend on thresholds or rankings, so their gradient with respect to the weights is zero almost everywhere or does not exist. That is why networks are trained with cross-entropy, a differentiable [[erm-loss|surrogate loss]], and these metrics are monitored on validation data.' },
      { title: 'Macro and micro.', text: String.raw`With $K$ classes, precision and recall are computed per class and averaged. The macro average gives each class the same weight, so rare classes count as much as frequent ones; the micro average gives each example the same weight. In single-label multiclass classification, micro-averaged F1 equals accuracy.` },
    ],
    quiz: [
      {
        prompt: 'A disease affects 5% of patients. A test has sensitivity 0.80 and specificity 0.90. What fraction of the test’s positives are sick?',
        options: [
          { text: 'About 80%.' },
          { text: 'About 90%.' },
          { text: 'About 30%.', correct: true },
        ],
        explain: String.raw`For every 1000 patients there are 40 true positives (80% of 50) and 95 false positives (10% of 950). Precision: $40/135 \approx 0.30$.`,
      },
      {
        prompt: 'A classifier has an AUC of 0.5. What does it mean?',
        options: [
          { text: 'It is right half of the time.' },
          { text: 'It ranks positives and negatives no better than chance.', correct: true },
          { text: 'Its best threshold is 0.5.' },
        ],
        explain: 'The AUC is the probability that a positive gets a higher score than a negative. At 0.5, taken as a whole, the scores rank no better than chance, although the accuracy may be high if one class dominates.',
      },
      {
        prompt: 'A false negative costs 9 times as much as a false positive, and the probabilities are calibrated. Which threshold minimizes the expected cost?',
        options: [{ text: '0.5' }, { text: '0.9' }, { text: '0.1', correct: true }],
        explain: String.raw`Predicting positive costs $(1-p)\,C_{\mathrm{FP}}$ on average, and predicting negative, $p\,C_{\mathrm{FN}}$. Positive pays off if $p > 1/(1+9) = 0.1$.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§5.1.2 (classification as a decision problem: 0-1 loss, asymmetric costs and the reject option), §5.1.3 (confusion matrix, ROC curve, AUC and class imbalance) and §5.1.4 (precision–recall curves, F-scores and average precision).' },
      { book: 'wilks', where: '§9.2.1–9.2.5 (the 2×2 contingency table: its measures, skill scores and how to turn probabilities into yes/no forecasts) and §9.4.6 (the ROC diagram).' },
    ],
    extra: [
      { text: 'Fawcett, T. (2006). An introduction to ROC analysis. Pattern Recognition Letters, 27(8), 861–874.', url: 'https://doi.org/10.1016/j.patrec.2005.10.010' },
    ],
  },
};

export default content;
