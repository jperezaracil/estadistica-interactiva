import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'La distribución muestral de un estadístico describe cómo cambiaría su valor si repitieras el experimento con muestras nuevas. Su desviación típica, el error estándar, es la medida básica de la precisión de una estimación.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Evalúas un clasificador con 400 ejemplos de test y acierta 360: accuracy 0,90. Con otros 400 ejemplos del mismo origen habrías obtenido otro valor, quizá 0,88 o 0,92. Si pudieras repetir la evaluación muchas veces con muestras nuevas, esos valores formarían una distribución: la **distribución muestral** de la accuracy. Su centro dice si el [[estimators|estimador]] acierta en promedio, y su anchura, cuánto te puedes fiar de un único valor.' },
          { key: 'Los datos tienen una distribución, y cada estadístico calculado con ellos, otra. El error estándar es la desviación típica de esa segunda distribución, no la de los datos.' },
        ],
      },
      {
        id: 'media-muestral',
        title: 'La media muestral',
        blocks: [
          { p: String.raw`Si $x_1, \dots, x_n$ son independientes, con media $\mu$ y varianza $\sigma^2$, la media muestral $\bar x$ cumple:` },
          { math: String.raw`\mathbb{E}[\bar x] = \mu, \qquad \operatorname{Var}(\bar x) = \frac{\sigma^2}{n}, \qquad \mathrm{EE}(\bar x) = \frac{\sigma}{\sqrt n}` },
          { p: String.raw`Además, por el [[lln-clt|teorema central del límite]], su distribución es aproximadamente normal para $n$ grande, aunque los datos no lo sean (basta con que $\sigma^2$ sea finita). En la práctica $\sigma$ se sustituye por la desviación típica muestral: $\widehat{\mathrm{EE}} = s/\sqrt n$. Otros estadísticos tienen sus propias fórmulas:` },
          {
            list: [
              String.raw`**Proporción** (como la accuracy): $\mathrm{EE} = \sqrt{p(1-p)/n}$. Con $p = 0{,}9$ y $n = 400$, $\mathrm{EE} = 0{,}015$.`,
              String.raw`**Mediana** de datos normales, con $n$ grande: $\mathrm{EE} \approx 1{,}253\,\sigma/\sqrt n$, algo mayor que el de la media.`,
              String.raw`**Estimador de máxima verosimilitud:** aproximadamente normal, con un error estándar que sale de la información de Fisher: ver [[mle]].`,
              String.raw`**Cualquier otro** (F1, AUC, un percentil): se aproxima con el [[bootstrap|bootstrap]], que sirve para todos ellos; para la AUC también hay fórmulas aproximadas, como la de DeLong.`,
            ],
          },
        ],
      },
      {
        id: 'raiz-de-n',
        title: 'La raíz de n',
        blocks: [
          { p: 'El error estándar baja con la raíz cuadrada del tamaño de la muestra. Para una accuracy cercana a 0,90:' },
          {
            table: {
              head: ['Ejemplos de test', 'Error estándar', '±2 EE'],
              rows: [
                ['100', '0,030', '±0,060'],
                ['400', '0,015', '±0,030'],
                ['1600', '0,0075', '±0,015'],
                ['10 000', '0,003', '±0,006'],
              ],
              numeric: [0, 1, 2],
            },
          },
          { p: 'Multiplicar por cuatro los datos reduce el error estándar a la mitad. Con 100 ejemplos, el ruido de la propia estimación es de unos ±6 puntos de accuracy; con 10 000, de ±0,6 puntos. El error estándar es la pieza con la que se construyen los [[confidence-intervals|intervalos de confianza]] y los [[hypothesis-testing|contrastes de hipótesis]].' },
        ],
      },
    ],
    pitfalls: [
      { claim: '«El error estándar es la desviación típica de los datos.»', fix: String.raw`La desviación típica describe cuánto varían los datos y no baja al tener más; el error estándar describe cuánto varía la estimación y baja como $1/\sqrt n$. Con 100 datos, el error estándar de la media es la décima parte de la desviación típica.` },
      { claim: String.raw`«Con $n$ grande, los datos se vuelven normales.»`, fix: 'El teorema central del límite habla de la distribución de la media (y de otros promedios), no de la de los datos, que conservan su forma por muchos que tengas.' },
      { claim: String.raw`«La fórmula $s/\sqrt n$ vale siempre.»`, fix: String.raw`Supone observaciones independientes. Con datos correlacionados, como días consecutivos de una serie, el error estándar real es mayor: con una autocorrelación de 0,5 entre días contiguos (un proceso AR(1)) y $n$ grande, es unas $\sqrt 3 \approx 1{,}73$ veces el de la fórmula.` },
      { claim: '«Un error estándar pequeño garantiza una estimación correcta.»', fix: 'Solo mide la variabilidad aleatoria de muestra a muestra. No detecta sesgos: un test que no representa los datos reales, o que se ha filtrado al entrenamiento, da estimaciones precisas pero erróneas.' },
    ],
    dl: [
      { title: 'Datos agrupados.', text: String.raw`Si el test contiene varios ejemplos de un mismo paciente, hablante o vídeo, los ejemplos no son independientes y $s/\sqrt n$ subestima el error estándar. Calcula la métrica por grupo, o remuestrea grupos enteros con el [[bootstrap|bootstrap]].` },
      { title: 'Semillas.', text: 'El error estándar calculado con el test solo recoge la variabilidad del conjunto de test. Reentrenar con otra semilla cambia también el modelo, y esa segunda fuente de variación solo se ve repitiendo el entrenamiento.' },
      { title: 'Curvas de entrenamiento ruidosas.', text: String.raw`La pérdida que se registra en cada paso es la media de un minibatch. Con lotes de 32 ejemplos, su error estándar es $s/\sqrt{32} \approx 0{,}18\,s$, con $s$ la desviación típica de la pérdida por ejemplo: por eso la curva oscila tanto y se suele suavizar con medias móviles.` },
    ],
    quiz: [
      {
        prompt: 'Tus datos tienen una desviación típica de 10 y tienes 400 observaciones independientes. ¿Cuál es el error estándar de la media?',
        options: [{ text: '10' }, { text: '0,5', correct: true }, { text: '0,025' }],
        explain: String.raw`$\mathrm{EE} = \sigma/\sqrt n = 10/\sqrt{400} = 10/20 = 0{,}5$. El valor 0,025 divide entre $n$ en lugar de entre $\sqrt n$.`,
      },
      {
        prompt: 'Quieres reducir a la mitad el error estándar de la accuracy que mides en test. ¿Cuántos ejemplos necesitas?',
        options: [
          { text: 'El doble.' },
          { text: 'El cuádruple.', correct: true },
          { text: 'Los mismos, repitiendo la evaluación dos veces.' },
        ],
        explain: String.raw`El error estándar es proporcional a $1/\sqrt n$, así que para dividirlo entre 2 hay que multiplicar $n$ por 4. Repetir la evaluación con los mismos ejemplos no aporta información nueva.`,
      },
      {
        prompt: 'Tus datos son asimétricos, pero con varianza finita, y tienes 200 observaciones independientes. ¿Qué puedes decir de la media muestral?',
        options: [
          { text: 'Su distribución muestral es aproximadamente normal, aunque los datos no lo sean.', correct: true },
          { text: 'Los datos pasan a ser aproximadamente normales.' },
          { text: 'Nada: el teorema central del límite exige datos normales.' },
        ],
        explain: String.raw`El teorema central del límite se aplica a la media de variables independientes con varianza finita, sea cual sea su distribución. Con asimetrías muy fuertes hace falta un $n$ mayor para que la aproximación sea buena.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§5.1.2 (la distribución muestral como variación de un estadístico entre lotes de datos), §5.2.1 (varianza de la media muestral y estadístico t) y §5.2.4 (cómo la dependencia serial aumenta la varianza de una media temporal).' },
      { book: 'pml1', where: '§4.7.1 (distribuciones muestrales) y §4.7.2 (aproximación gaussiana de la distribución muestral del EMV mediante la información de Fisher).' },
      { book: 'pml2', where: '§3.3.1 (distribuciones muestrales) y §3.3.3–3.3.4 (normalidad asintótica del EMV y matriz de información de Fisher).' },
    ],
  },
  en: {
    lede: 'The sampling distribution of a statistic describes how its value would change if you repeated the experiment with new samples. Its standard deviation, the standard error, is the basic measure of how precise an estimate is.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'You evaluate a classifier on 400 test examples and it gets 360 right: accuracy 0.90. With another 400 examples from the same source you would have obtained a different value, perhaps 0.88 or 0.92. If you could repeat the evaluation many times with new samples, those values would form a distribution: the **sampling distribution** of the accuracy. Its center tells you whether the [[estimators|estimator]] is right on average, and its width how far you can trust a single value.' },
          { key: 'The data have a distribution, and every statistic computed from them has another. The standard error is the standard deviation of that second distribution, not of the data.' },
        ],
      },
      {
        id: 'sample-mean',
        title: 'The sample mean',
        blocks: [
          { p: String.raw`If $x_1, \dots, x_n$ are independent, with mean $\mu$ and variance $\sigma^2$, the sample mean $\bar x$ satisfies:` },
          { math: String.raw`\mathbb{E}[\bar x] = \mu, \qquad \operatorname{Var}(\bar x) = \frac{\sigma^2}{n}, \qquad \mathrm{SE}(\bar x) = \frac{\sigma}{\sqrt n}` },
          { p: String.raw`Moreover, by the [[lln-clt|central limit theorem]], its distribution is approximately normal for large $n$, even if the data are not (a finite $\sigma^2$ is enough). In practice $\sigma$ is replaced by the sample standard deviation: $\widehat{\mathrm{SE}} = s/\sqrt n$. Other statistics have their own formulas:` },
          {
            list: [
              String.raw`**Proportion** (such as accuracy): $\mathrm{SE} = \sqrt{p(1-p)/n}$. With $p = 0.9$ and $n = 400$, $\mathrm{SE} = 0.015$.`,
              String.raw`**Median** of normal data, for large $n$: $\mathrm{SE} \approx 1.253\,\sigma/\sqrt n$, somewhat larger than that of the mean.`,
              String.raw`**Maximum likelihood estimator:** approximately normal, with a standard error given by the Fisher information: see [[mle]].`,
              String.raw`**Anything else** (F1, AUC, a percentile): approximate it with the [[bootstrap|bootstrap]], which works for all of them; for the AUC there are also approximate formulas, such as DeLong’s.`,
            ],
          },
        ],
      },
      {
        id: 'root-n',
        title: 'The square root of n',
        blocks: [
          { p: 'The standard error falls with the square root of the sample size. For an accuracy close to 0.90:' },
          {
            table: {
              head: ['Test examples', 'Standard error', '±2 SE'],
              rows: [
                ['100', '0.030', '±0.060'],
                ['400', '0.015', '±0.030'],
                ['1600', '0.0075', '±0.015'],
                ['10,000', '0.003', '±0.006'],
              ],
              numeric: [0, 1, 2],
            },
          },
          { p: 'Four times the data halves the standard error. With 100 examples, the noise in the estimate itself is about ±6 accuracy points; with 10,000, about ±0.6 points. The standard error is the building block of [[confidence-intervals|confidence intervals]] and [[hypothesis-testing|hypothesis tests]].' },
        ],
      },
    ],
    pitfalls: [
      { claim: '“The standard error is the standard deviation of the data.”', fix: String.raw`The standard deviation describes how much the data vary and does not shrink as you collect more; the standard error describes how much the estimate varies and falls as $1/\sqrt n$. With 100 data points, the standard error of the mean is a tenth of the standard deviation.` },
      { claim: String.raw`“With large $n$, the data become normal.”`, fix: 'The central limit theorem is about the distribution of the mean (and other averages), not of the data, which keep their shape however many you have.' },
      { claim: String.raw`“The formula $s/\sqrt n$ always works.”`, fix: String.raw`It assumes independent observations. With correlated data, such as consecutive days of a series, the true standard error is larger: with a correlation of 0.5 between neighboring days (an AR(1) process) and large $n$, it is about $\sqrt 3 \approx 1.73$ times the formula’s value.` },
      { claim: '“A small standard error guarantees a correct estimate.”', fix: 'It only measures random sample-to-sample variability. It does not detect bias: a test set that does not represent real data, or that has leaked into training, gives precise but wrong estimates.' },
    ],
    dl: [
      { title: 'Grouped data.', text: String.raw`If the test set contains several examples from the same patient, speaker or video, the examples are not independent and $s/\sqrt n$ underestimates the standard error. Compute the metric per group, or resample whole groups with the [[bootstrap|bootstrap]].` },
      { title: 'Seeds.', text: 'The standard error computed from the test set only captures the variability of the test set. Retraining with another seed also changes the model, and that second source of variation only shows up when you repeat the training.' },
      { title: 'Noisy training curves.', text: String.raw`The loss logged at each step is the mean over a minibatch. With batches of 32 examples, its standard error is $s/\sqrt{32} \approx 0.18\,s$, where $s$ is the standard deviation of the per-example loss: that is why the curve jitters so much and is usually smoothed with moving averages.` },
    ],
    quiz: [
      {
        prompt: 'Your data have a standard deviation of 10 and you have 400 independent observations. What is the standard error of the mean?',
        options: [{ text: '10' }, { text: '0.5', correct: true }, { text: '0.025' }],
        explain: String.raw`$\mathrm{SE} = \sigma/\sqrt n = 10/\sqrt{400} = 10/20 = 0.5$. The value 0.025 divides by $n$ instead of $\sqrt n$.`,
      },
      {
        prompt: 'You want to halve the standard error of the accuracy you measure on the test set. How many examples do you need?',
        options: [
          { text: 'Twice as many.' },
          { text: 'Four times as many.', correct: true },
          { text: 'The same ones, evaluated twice.' },
        ],
        explain: String.raw`The standard error is proportional to $1/\sqrt n$, so dividing it by 2 requires multiplying $n$ by 4. Repeating the evaluation on the same examples brings no new information.`,
      },
      {
        prompt: 'Your data are skewed, but with finite variance, and you have 200 independent observations. What can you say about the sample mean?',
        options: [
          { text: 'Its sampling distribution is approximately normal, even though the data are not.', correct: true },
          { text: 'The data become approximately normal.' },
          { text: 'Nothing: the central limit theorem requires normal data.' },
        ],
        explain: String.raw`The central limit theorem applies to the mean of independent variables with finite variance, whatever their distribution. With very strong skewness a larger $n$ is needed for the approximation to be good.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§5.1.2 (the sampling distribution as the batch-to-batch variation of a statistic), §5.2.1 (variance of the sample mean and the t statistic) and §5.2.4 (how serial dependence inflates the variance of a time average).' },
      { book: 'pml1', where: '§4.7.1 (sampling distributions) and §4.7.2 (Gaussian approximation of the sampling distribution of the MLE through the Fisher information).' },
      { book: 'pml2', where: '§3.3.1 (sampling distributions) and §3.3.3–3.3.4 (asymptotic normality of the MLE and the Fisher information matrix).' },
    ],
  },
};

export default content;
