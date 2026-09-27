import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Estimar cómo funcionará un modelo con datos nuevos usando solo los que tienes: se entrena con una parte, se evalúa con otra y se rota. Sirve para elegir hiperparámetros, aunque la puntuación del modelo elegido sale optimista.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`El error en los datos de entrenamiento es optimista: el modelo se ha ajustado precisamente a ellos. Un caso exacto: en una [[linear-regression|regresión lineal]] correcta con 10 coeficientes y 20 datos, el error cuadrático medio de entrenamiento vale en promedio $0{,}5\,\sigma^2$, y con respuestas nuevas en esas mismas entradas, $1{,}5\,\sigma^2$: el triple. Para saber cómo generaliza un modelo hay que evaluarlo con datos que no ha visto.` },
          { key: String.raw`En la validación cruzada con $K$ pliegues, cada dato se usa para evaluar exactamente una vez, y siempre con un modelo que no lo vio al entrenar.` },
        ],
      },
      {
        id: 'procedimiento',
        title: 'Cómo se hace',
        blocks: [
          { p: String.raw`Divides los $n$ datos en $K$ pliegues, normalmente 5 o 10. Para cada pliegue $F_k$ entrenas con los otros $K-1$ y evalúas en él; la estimación es la pérdida media sobre todos los datos:` },
          { math: String.raw`\widehat{\mathrm{Err}}_{\mathrm{CV}} = \frac{1}{n}\sum_{k=1}^{K}\sum_{i \in F_k} L\big(y_i, \hat f^{(-k)}(\mathbf{x}_i)\big)` },
          { p: String.raw`Aquí $\hat f^{(-k)}$ es el modelo entrenado sin el pliegue $F_k$; con $K = n$ se obtiene la validación dejando uno fuera (LOO). Como cada modelo se entrena con una fracción $(K-1)/K$ de los datos, la estimación suele ser algo pesimista para el modelo final. Y todo lo que se ajusta con los datos (estandarizar, seleccionar variables, imputar) debe repetirse dentro de cada pliegue, con su parte de entrenamiento.` },
        ],
      },
      {
        id: 'seleccion',
        title: 'Elegir y evaluar',
        blocks: [
          { p: 'Si pruebas muchas configuraciones y te quedas con la de mejor puntuación de validación, esa puntuación es optimista: la ganadora lo es en parte por suerte, como en las [[multiple-testing|comparaciones múltiples]]. Si 20 configuraciones tuvieran todas una accuracy real de 0,80 y se evaluaran de forma independiente con 500 ejemplos, la mejor mostraría en promedio unos 0,833.' },
          { p: 'Por eso se separan tres papeles: entrenamiento (ajustar parámetros), validación (elegir hiperparámetros) y test (medir el resultado final, una sola vez). Con pocos datos se usa la **validación cruzada anidada**: un bucle interno elige los hiperparámetros y otro externo evalúa el procedimiento completo.' },
        ],
      },
    ],
    pitfalls: [
      { claim: '«La puntuación de validación del mejor modelo es una estimación honesta de su rendimiento.»', fix: 'Es optimista, porque se usó para elegirlo. Mide el modelo final en un test que no hayas tocado, o usa validación cruzada anidada.' },
      { claim: '«Puedo estandarizar o seleccionar variables con todos los datos antes de la validación cruzada.»', fix: 'Así se filtra información de los pliegues de evaluación. Seleccionar variables mirando las etiquetas de todos los datos puede dar un error de validación bajo aunque las variables sean ruido puro.' },
      { claim: '«Dividir al azar siempre sirve.»', fix: 'Si los datos no son independientes (series temporales, varias imágenes del mismo paciente, estaciones vecinas), una división aleatoria pone datos casi iguales a ambos lados. Divide por grupos o por bloques de tiempo y, si predices, evalúa sobre el futuro.' },
      { claim: '«La dispersión entre pliegues da el error estándar de la estimación.»', fix: 'Los pliegues comparten la mayor parte de sus datos de entrenamiento, así que sus errores no son independientes y esa cuenta suele infravalorar la incertidumbre real.' },
    ],
    dl: [
      { title: 'Un solo conjunto de validación.', text: String.raw`Entrenar una red $K$ veces suele ser demasiado caro, así que se usa una sola partición de validación para la parada temprana y los hiperparámetros. La época elegida también se decide con esa validación, así que su pérdida de validación es optimista.` },
      { title: 'El test se gasta.', text: 'Cada vez que miras el test para decidir algo (una arquitectura, un umbral, cuándo parar), deja de ser una estimación independiente. En los benchmarks públicos, muchas decisiones tomadas mirando el mismo test pueden acabar sobreajustándolo.' },
      { title: 'Fugas típicas.', text: 'Imágenes casi duplicadas a ambos lados de la división, el mismo paciente o hablante en entrenamiento y en test, aumentación de datos aplicada antes de dividir, o datos horarios de una serie repartidos al azar. En todos los casos el test sale mejor de lo que será el rendimiento real.' },
    ],
    quiz: [
      {
        prompt: 'Con 1000 ejemplos y validación cruzada de 5 pliegues, ¿con cuántos se entrena y con cuántos se evalúa cada modelo?',
        options: [
          { text: 'Se entrena con 800 y se evalúa con 200.', correct: true },
          { text: 'Se entrena con 1000 y se evalúa con 200.' },
          { text: 'Se entrena con 200 y se evalúa con 800.' },
        ],
        explain: 'Cada pliegue tiene 200 ejemplos y cada modelo se entrena con los otros 4; al final, cada ejemplo se evalúa una vez.',
      },
      {
        prompt: 'Eliges con todos los datos las 20 variables más correlacionadas con la etiqueta y luego haces validación cruzada con ellas. ¿Qué le pasa a la estimación del error?',
        options: [
          { text: 'Nada: la validación cruzada viene después.' },
          { text: 'Es optimista, incluso mucho, aunque las variables sean ruido puro.', correct: true },
          { text: 'Es pesimista, porque usas menos variables.' },
        ],
        explain: 'La selección ya vio las etiquetas de los pliegues de evaluación. Para que la estimación valga, hay que repetirla dentro de cada pliegue.',
      },
      {
        prompt: 'Pruebas 50 configuraciones de hiperparámetros y la mejor obtiene 0,91 de accuracy en validación. ¿Qué esperas en datos nuevos?',
        options: [
          { text: 'Exactamente 0,91.' },
          { text: 'Más de 0,91, porque el modelo final usa más datos.' },
          { text: 'Probablemente algo menos: hay que medirlo en un test aparte.', correct: true },
        ],
        explain: 'La mejor de 50 estimaciones ruidosas suele estar inflada por la suerte. Solo un test que no intervino en la elección da una estimación sin ese sesgo.',
      },
    ],
    further: [
      { book: 'pml1', where: '§4.5.4–4.5.6 (conjunto de validación, validación cruzada con la regla de un error estándar y parada temprana) y §5.4.2–5.4.3 (por qué el error de entrenamiento es optimista y cómo lo corrige la validación).' },
      { book: 'wilks', where: '§7.4.4 (validación cruzada en regresión: repetir todo el ajuste en cada partición y dejar fuera bloques cuando hay correlación serial).' },
    ],
    extra: [
      { text: 'Cawley, G. C. y Talbot, N. L. C. (2010). On over-fitting in model selection and subsequent selection bias in performance evaluation. Journal of Machine Learning Research, 11, 2079–2107.', url: 'https://www.jmlr.org/papers/v11/cawley10a.html' },
    ],
  },
  en: {
    lede: 'Estimating how a model will perform on new data using only the data you have: train on one part, evaluate on another and rotate. It is used to choose hyperparameters, although the score of the chosen model comes out optimistic.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`The error on the training data is optimistic: the model was fitted precisely to them. An exact case: in a correct [[linear-regression|linear regression]] with 10 coefficients and 20 data points, the training mean squared error is on average $0.5\,\sigma^2$, and with new responses at those same inputs it is $1.5\,\sigma^2$: three times as much. To know how a model generalizes, you have to evaluate it on data it has not seen.` },
          { key: String.raw`In $K$-fold cross-validation, each data point is used for evaluation exactly once, and always by a model that did not see it during training.` },
        ],
      },
      {
        id: 'procedure',
        title: 'How it works',
        blocks: [
          { p: String.raw`You split the $n$ data points into $K$ folds, usually 5 or 10. For each fold $F_k$ you train on the other $K-1$ and evaluate on it; the estimate is the mean loss over all the data:` },
          { math: String.raw`\widehat{\mathrm{Err}}_{\mathrm{CV}} = \frac{1}{n}\sum_{k=1}^{K}\sum_{i \in F_k} L\big(y_i, \hat f^{(-k)}(\mathbf{x}_i)\big)` },
          { p: String.raw`Here $\hat f^{(-k)}$ is the model trained without fold $F_k$; with $K = n$ you get leave-one-out cross-validation (LOO). Since each model is trained on a fraction $(K-1)/K$ of the data, the estimate tends to be slightly pessimistic for the final model. And everything that is fitted to the data (standardizing, selecting variables, imputing) must be repeated inside each fold, on its training part.` },
        ],
      },
      {
        id: 'selection',
        title: 'Selecting and evaluating',
        blocks: [
          { p: 'If you try many configurations and keep the one with the best validation score, that score is optimistic: the winner won partly by luck, as in [[multiple-testing|multiple comparisons]]. If 20 configurations all had a true accuracy of 0.80 and were evaluated independently on 500 examples, the best one would show about 0.833 on average.' },
          { p: 'That is why three roles are kept apart: training (fitting the parameters), validation (choosing the hyperparameters) and test (measuring the final result, only once). With little data, **nested cross-validation** is used: an inner loop chooses the hyperparameters and an outer loop evaluates the whole procedure.' },
        ],
      },
    ],
    pitfalls: [
      { claim: '“The validation score of the best model is an honest estimate of its performance.”', fix: 'It is optimistic, because it was used to choose the model. Measure the final model on a test set you have not touched, or use nested cross-validation.' },
      { claim: '“I can standardize or select variables using all the data before cross-validation.”', fix: 'That leaks information from the evaluation folds. Selecting variables by looking at the labels of all the data can give a low validation error even if the variables are pure noise.' },
      { claim: '“A random split always works.”', fix: 'If the data are not independent (time series, several images of the same patient, neighboring stations), a random split puts nearly identical data on both sides. Split by groups or by blocks of time and, for forecasting, evaluate on the future.' },
      { claim: '“The spread across folds gives the standard error of the estimate.”', fix: 'The folds share most of their training data, so their errors are not independent and that calculation usually underestimates the real uncertainty.' },
    ],
    dl: [
      { title: 'A single validation set.', text: String.raw`Training a network $K$ times is usually too expensive, so a single validation split is used for early stopping and hyperparameters. The chosen epoch is also decided with that validation set, so its validation loss is optimistic.` },
      { title: 'The test set wears out.', text: 'Every time you look at the test set to decide something (an architecture, a threshold, when to stop), it stops being an independent estimate. In public benchmarks, many decisions made by looking at the same test set can end up overfitting it.' },
      { title: 'Typical leaks.', text: 'Near-duplicate images on both sides of the split, the same patient or speaker in training and test, data augmentation applied before splitting, or hourly data from a time series shuffled at random. In every case the test result looks better than the real performance will be.' },
    ],
    quiz: [
      {
        prompt: 'With 1000 examples and 5-fold cross-validation, how many examples is each model trained on, and how many is it evaluated on?',
        options: [
          { text: 'Trained on 800 and evaluated on 200.', correct: true },
          { text: 'Trained on 1000 and evaluated on 200.' },
          { text: 'Trained on 200 and evaluated on 800.' },
        ],
        explain: 'Each fold has 200 examples and each model is trained on the other 4; in the end, each example is evaluated once.',
      },
      {
        prompt: 'Using all the data, you pick the 20 variables most correlated with the label, and then run cross-validation with them. What happens to the error estimate?',
        options: [
          { text: 'Nothing: the cross-validation comes afterwards.' },
          { text: 'It is optimistic, possibly very much so, even if the variables are pure noise.', correct: true },
          { text: 'It is pessimistic, because you use fewer variables.' },
        ],
        explain: 'The selection has already seen the labels of the evaluation folds. For the estimate to be valid, it has to be repeated inside each fold.',
      },
      {
        prompt: 'You try 50 hyperparameter configurations and the best one reaches a validation accuracy of 0.91. What do you expect on new data?',
        options: [
          { text: 'Exactly 0.91.' },
          { text: 'More than 0.91, because the final model uses more data.' },
          { text: 'Probably somewhat less: it has to be measured on a separate test set.', correct: true },
        ],
        explain: 'The best of 50 noisy estimates has usually been inflated by luck. Only a test set that played no part in the choice gives an estimate without that bias.',
      },
    ],
    further: [
      { book: 'pml1', where: '§4.5.4–4.5.6 (validation set, cross-validation with the one-standard-error rule, and early stopping) and §5.4.2–5.4.3 (why the training error is optimistic and how validation corrects it).' },
      { book: 'wilks', where: '§7.4.4 (cross-validation in regression: repeating the whole fitting in each split, and leaving out blocks when there is serial correlation).' },
    ],
    extra: [
      { text: 'Cawley, G. C. and Talbot, N. L. C. (2010). On over-fitting in model selection and subsequent selection bias in performance evaluation. Journal of Machine Learning Research, 11, 2079–2107.', url: 'https://www.jmlr.org/papers/v11/cawley10a.html' },
    ],
  },
};

export default content;
