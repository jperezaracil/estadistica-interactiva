import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: String.raw`La información mutua $I(X; Y)$ mide cuánto reduce, en promedio, conocer una variable la incertidumbre sobre la otra. Vale 0 si y solo si las variables son independientes y, a diferencia de la correlación, detecta cualquier tipo de dependencia.`,
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Por la mañana miras si el cielo está nublado. ¿Te dice algo sobre si lloverá? Supón que llueve el 35 % de los días: la incertidumbre sobre la lluvia es su [[entropy|entropía]], 0,934 bits. Pero los días nublados (el 40 %) llueve el 75 % de las veces, y los despejados, solo uno de cada doce. Después de mirar el cielo quedan, en promedio, 0,573 bits de incertidumbre. La diferencia, 0,361 bits, es la información mutua entre el cielo y la lluvia.' },
          { key: String.raw`$I(X; Y) = H(Y) - H(Y \mid X)$: la reducción media de la incertidumbre sobre $Y$ al conocer $X$. Es simétrica y vale 0 solo si $X$ e $Y$ son independientes.` },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { p: String.raw`Es la [[kl-divergence|divergencia KL]] entre la distribución conjunta y la que tendrían las variables si fueran independientes, el producto de las [[joint-marginal|marginales]]:` },
          { math: String.raw`\begin{aligned} I(X; Y) &= \mathrm{KL}\big(p(x, y) \,\Vert\, p(x)\,p(y)\big) = \sum_{x, y} p(x, y)\,\log\frac{p(x, y)}{p(x)\,p(y)} \\ &= H(X) + H(Y) - H(X, Y) \end{aligned}` },
          {
            list: [
              String.raw`$I(X; Y) \ge 0$, con igualdad si y solo si $X$ e $Y$ son independientes.`,
              String.raw`Es simétrica, $I(X; Y) = I(Y; X)$, y para variables discretas $I(X; X) = H(X)$.`,
              String.raw`No cambia si transformas $X$ o $Y$ con funciones invertibles, tampoco en el caso continuo.`,
              String.raw`**Desigualdad del procesamiento de datos:** si $Z$ se calcula a partir de $X$ (en general, si $Y \to X \to Z$ es una cadena de Markov), entonces $I(Y; Z) \le I(Y; X)$.`,
            ],
          },
        ],
      },
      {
        id: 'correlacion',
        title: 'Más allá de la correlación',
        blocks: [
          { p: String.raw`Si $X$ vale $-1$, 0 o 1 con la misma probabilidad e $Y = X^2$, la [[covariance-correlation|correlación]] entre ambas es 0, pero $Y$ depende por completo de $X$: $I(X; Y) = H(Y) \approx 0{,}918$ bits. En una normal bivariante con correlación $\rho$, en cambio, toda la dependencia está en $\rho$:` },
          { math: String.raw`I(X; Y) = -\tfrac12 \log_2\!\big(1 - \rho^2\big)\ \text{bits}` },
          {
            table: {
              head: [String.raw`Correlación $\rho$`, 'Información mutua (bits)'],
              rows: [
                ['0,5', '0,208'],
                ['0,9', '1,198'],
                ['0,99', '2,826'],
              ],
              numeric: [0, 1],
            },
          },
          { p: String.raw`Crece sin límite cuando $|\rho| \to 1$: con variables continuas, la información mutua no está acotada.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Si la correlación es 0, la información mutua también.»', fix: String.raw`La correlación solo mide dependencia lineal. Con $Y = X^2$ la correlación es 0 y la información mutua, 0,918 bits. Solo en casos especiales, como la normal bivariante, correlación nula implica independencia.` },
      { claim: '«Procesar bien los datos puede aumentar la información que contienen sobre la etiqueta.»', fix: 'La desigualdad del procesamiento de datos lo impide: ninguna función de X, tampoco una red, tiene más información sobre Y que la propia X. Una buena representación hace esa información más fácil de usar, no más abundante.' },
      { claim: '«La información mutua está entre 0 y 1, como una correlación.»', fix: String.raw`Se mide en bits o nats. Para variables discretas está acotada por $\min(H(X), H(Y))$; para continuas puede ser arbitrariamente grande. Si necesitas una escala de 0 a 1, hay versiones normalizadas.` },
      { claim: '«Se estima fácilmente a partir de una muestra.»', fix: 'Estimarla es difícil, sobre todo con variables continuas o de alta dimensión. El estimador ingenuo con histogramas suele sobrestimarla con muestras pequeñas (da valores positivos incluso con variables independientes), aunque con variables continuas unas celdas demasiado anchas pueden sesgarla a la baja. Los estimadores basados en redes dan cotas que pueden tener mucha varianza o quedarse cortas.' },
    ],
    dl: [
      { title: 'Aprendizaje contrastivo.', text: String.raw`Minimizar la pérdida InfoNCE, la base de CPC, SimCLR y CLIP, maximiza una cota inferior de la información mutua entre dos vistas del mismo dato (en CLIP, una imagen y su texto). Esa cota no puede superar $\log N$, con $N$ los ejemplos que compiten en el lote, y se ha visto que el éxito de estos métodos no se explica solo por la información mutua.` },
      { title: 'Selección de variables.', text: 'Ordenar las variables de entrada por su información mutua con la salida detecta también relaciones no lineales. Para variables continuas, scikit-learn la estima con métodos basados en vecinos más próximos (mutual_info_classif y mutual_info_regression).' },
      { title: 'Árboles de decisión.', text: 'Con el criterio de entropía, la ganancia de información con que un árbol elige cada división es la información mutua entre la división y la etiqueta, calculada con los datos del nodo; scikit-learn usa por defecto el índice de Gini.' },
    ],
    quiz: [
      {
        prompt: String.raw`Si $X$ e $Y$ son independientes, $I(X; Y)$ vale:`,
        options: [{ text: '0', correct: true }, { text: String.raw`$H(X)$` }, { text: '1' }],
        explain: String.raw`Si son independientes, $p(x, y) = p(x)\,p(y)$ y la KL entre ambas es 0: conocer $X$ no reduce en nada la incertidumbre sobre $Y$.`,
      },
      {
        prompt: String.raw`Una red calcula una representación $Z = f(X)$ de la entrada. ¿Qué relación hay entre $I(Z; Y)$ e $I(X; Y)$, con $Y$ la etiqueta?`,
        options: [
          { text: String.raw`$I(Z; Y) > I(X; Y)$ si la red está bien entrenada.` },
          { text: String.raw`$I(Z; Y) \le I(X; Y)$ siempre.`, correct: true },
          { text: 'Depende de la dimensión de Z.' },
        ],
        explain: String.raw`Como $Y \to X \to Z$ es una cadena de Markov, la desigualdad del procesamiento de datos da $I(Y; Z) \le I(Y; X)$. Entrenar puede hacer esa información más accesible, pero no crearla.`,
      },
      {
        prompt: String.raw`En una normal bivariante con $\rho = 0{,}9$ la información mutua es 1,198 bits. ¿Y con $\rho = -0{,}9$?`,
        options: [{ text: '−1,198 bits' }, { text: '1,198 bits', correct: true }, { text: '0 bits' }],
        explain: String.raw`Solo depende de $\rho^2$: la dependencia es igual de fuerte aunque cambie de signo. Además, la información mutua nunca es negativa.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§6.3.1–6.3.3 (definición, interpretación y un ejemplo), §6.3.5 (la información mutua como «coeficiente de correlación generalizado») y §6.3.8 (desigualdad del procesamiento de datos).' },
      { book: 'pml2', where: '§5.3.1–5.3.3 (definición, interpretación y procesamiento de datos) y §5.3.6 (cotas variacionales, incluida InfoNCE).' },
    ],
    extra: [
      { text: 'Shannon, C. E. (1948). A Mathematical Theory of Communication. The Bell System Technical Journal, 27(3), 379–423.', url: 'https://doi.org/10.1002/j.1538-7305.1948.tb01338.x' },
    ],
  },
  en: {
    lede: String.raw`Mutual information $I(X; Y)$ measures how much knowing one variable reduces, on average, the uncertainty about the other. It is 0 if and only if the variables are independent and, unlike correlation, it detects any kind of dependence.`,
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'In the morning you check whether the sky is cloudy. Does it tell you anything about whether it will rain? Suppose it rains on 35% of days: the uncertainty about rain is its [[entropy|entropy]], 0.934 bits. But on cloudy days (40% of them) it rains 75% of the time, and on clear days only one day in twelve. After looking at the sky, 0.573 bits of uncertainty remain on average. The difference, 0.361 bits, is the mutual information between sky and rain.' },
          { key: String.raw`$I(X; Y) = H(Y) - H(Y \mid X)$: the average reduction in uncertainty about $Y$ from knowing $X$. It is symmetric, and it is 0 only if $X$ and $Y$ are independent.` },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { p: String.raw`It is the [[kl-divergence|KL divergence]] between the joint distribution and the one the variables would have if they were independent, the product of the [[joint-marginal|marginals]]:` },
          { math: String.raw`\begin{aligned} I(X; Y) &= \mathrm{KL}\big(p(x, y) \,\Vert\, p(x)\,p(y)\big) = \sum_{x, y} p(x, y)\,\log\frac{p(x, y)}{p(x)\,p(y)} \\ &= H(X) + H(Y) - H(X, Y) \end{aligned}` },
          {
            list: [
              String.raw`$I(X; Y) \ge 0$, with equality if and only if $X$ and $Y$ are independent.`,
              String.raw`It is symmetric, $I(X; Y) = I(Y; X)$, and for discrete variables $I(X; X) = H(X)$.`,
              String.raw`It does not change if you transform $X$ or $Y$ with invertible functions, in the continuous case too.`,
              String.raw`**Data processing inequality:** if $Z$ is computed from $X$ (more generally, if $Y \to X \to Z$ is a Markov chain), then $I(Y; Z) \le I(Y; X)$.`,
            ],
          },
        ],
      },
      {
        id: 'correlation',
        title: 'Beyond correlation',
        blocks: [
          { p: String.raw`If $X$ takes the values $-1$, 0 or 1 with equal probability and $Y = X^2$, the [[covariance-correlation|correlation]] between them is 0, yet $Y$ depends entirely on $X$: $I(X; Y) = H(Y) \approx 0.918$ bits. In a bivariate normal with correlation $\rho$, on the other hand, all the dependence is in $\rho$:` },
          { math: String.raw`I(X; Y) = -\tfrac12 \log_2\!\big(1 - \rho^2\big)\ \text{bits}` },
          {
            table: {
              head: [String.raw`Correlation $\rho$`, 'Mutual information (bits)'],
              rows: [
                ['0.5', '0.208'],
                ['0.9', '1.198'],
                ['0.99', '2.826'],
              ],
              numeric: [0, 1],
            },
          },
          { p: String.raw`It grows without bound as $|\rho| \to 1$: with continuous variables, mutual information is not bounded.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“If the correlation is 0, so is the mutual information.”', fix: String.raw`Correlation only measures linear dependence. With $Y = X^2$ the correlation is 0 and the mutual information is 0.918 bits. Only in special cases, such as the bivariate normal, does zero correlation imply independence.` },
      { claim: '“Processing the data cleverly can increase the information it holds about the label.”', fix: 'The data processing inequality rules that out: no function of X, a network included, has more information about Y than X itself. A good representation makes that information easier to use, not more plentiful.' },
      { claim: '“Mutual information lies between 0 and 1, like a correlation.”', fix: String.raw`It is measured in bits or nats. For discrete variables it is bounded by $\min(H(X), H(Y))$; for continuous ones it can be arbitrarily large. If you need a 0-to-1 scale, there are normalized versions.` },
      { claim: '“It is easy to estimate from a sample.”', fix: 'Estimating it is hard, especially with continuous or high-dimensional variables. The naive histogram estimator tends to overestimate it with small samples (it gives positive values even for independent variables), although with continuous variables overly coarse bins can bias it downwards. Network-based estimators give bounds that can have high variance or fall short.' },
    ],
    dl: [
      { title: 'Contrastive learning.', text: String.raw`Minimizing the InfoNCE loss, the basis of CPC, SimCLR and CLIP, maximizes a lower bound on the mutual information between two views of the same data point (in CLIP, an image and its caption). That bound cannot exceed $\log N$, with $N$ the examples competing in the batch, and the success of these methods has been shown not to be explained by mutual information alone.` },
      { title: 'Feature selection.', text: 'Ranking the input variables by their mutual information with the output also detects nonlinear relationships. For continuous variables, scikit-learn estimates it with nearest-neighbor methods (mutual_info_classif and mutual_info_regression).' },
      { title: 'Decision trees.', text: 'With the entropy criterion, the information gain a tree uses to choose each split is the mutual information between the split and the label, computed on the data in the node; scikit-learn uses the Gini index by default.' },
    ],
    quiz: [
      {
        prompt: String.raw`If $X$ and $Y$ are independent, $I(X; Y)$ equals:`,
        options: [{ text: '0', correct: true }, { text: String.raw`$H(X)$` }, { text: '1' }],
        explain: String.raw`If they are independent, $p(x, y) = p(x)\,p(y)$ and the KL between the two is 0: knowing $X$ does not reduce the uncertainty about $Y$ at all.`,
      },
      {
        prompt: String.raw`A network computes a representation $Z = f(X)$ of the input. How are $I(Z; Y)$ and $I(X; Y)$ related, with $Y$ the label?`,
        options: [
          { text: String.raw`$I(Z; Y) > I(X; Y)$ if the network is well trained.` },
          { text: String.raw`$I(Z; Y) \le I(X; Y)$, always.`, correct: true },
          { text: 'It depends on the dimension of Z.' },
        ],
        explain: String.raw`Since $Y \to X \to Z$ is a Markov chain, the data processing inequality gives $I(Y; Z) \le I(Y; X)$. Training can make that information more accessible, but it cannot create it.`,
      },
      {
        prompt: String.raw`In a bivariate normal with $\rho = 0.9$ the mutual information is 1.198 bits. What about $\rho = -0.9$?`,
        options: [{ text: '−1.198 bits' }, { text: '1.198 bits', correct: true }, { text: '0 bits' }],
        explain: String.raw`It only depends on $\rho^2$: the dependence is just as strong even though its sign changes. Besides, mutual information is never negative.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§6.3.1–6.3.3 (definition, interpretation and an example), §6.3.5 (mutual information as a “generalized correlation coefficient”) and §6.3.8 (data processing inequality).' },
      { book: 'pml2', where: '§5.3.1–5.3.3 (definition, interpretation and data processing) and §5.3.6 (variational bounds, including InfoNCE).' },
    ],
    extra: [
      { text: 'Shannon, C. E. (1948). A Mathematical Theory of Communication. The Bell System Technical Journal, 27(3), 379–423.', url: 'https://doi.org/10.1002/j.1538-7305.1948.tb01338.x' },
    ],
  },
};

export default content;
