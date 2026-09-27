import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Cuando trabajas con varias variables a la vez, su distribución conjunta lo contiene todo. De ella salen las marginales, que describen cada variable por separado, y las condicionales, que describen una variable cuando conoces el valor de otra.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Evalúas un clasificador de tres clases (gato, perro, zorro) y cuentas cuántas imágenes caen en cada par (clase real, clase predicha). Divididas por el total, esas proporciones son la **distribución conjunta** de dos variables: la matriz de confusión normalizada. Sumando cada fila obtienes la proporción de imágenes de cada clase real, una **marginal**; sumando cada columna, la proporción que el modelo asigna a cada clase, la otra marginal. Y si te quedas con una fila y la renormalizas, tienes la distribución de la predicción dada la clase real: una **condicional**.' },
          { key: 'La conjunta lo contiene todo. Marginalizar es sumar sobre lo que no te interesa; condicionar es quedarte con una rebanada y renormalizarla para que sume 1.' },
        ],
      },
      {
        id: 'reglas',
        title: 'Las reglas',
        blocks: [
          { p: String.raw`Para dos variables discretas con PMF conjunta $p(x, y) = P(X = x, Y = y)$:` },
          { math: String.raw`p(x) = \sum_{y} p(x, y), \qquad p(y \mid x) = \frac{p(x, y)}{p(x)}, \qquad p(x, y) = p(x)\,p(y \mid x)` },
          { p: String.raw`La primera es la **regla de la suma** (marginalizar), la segunda define la condicional cuando $p(x) > 0$ y la tercera es la **regla del producto**. Con variables continuas, las sumas pasan a ser integrales: $p(x) = \int p(x, y)\,dy$. Aplicando el producto una y otra vez se obtiene la **regla de la cadena**, válida en cualquier orden y sin ninguna hipótesis:` },
          { math: String.raw`p(x_1, \dots, x_n) = p(x_1)\,p(x_2 \mid x_1)\,p(x_3 \mid x_1, x_2) \cdots p(x_n \mid x_1, \dots, x_{n-1})` },
          { p: String.raw`$X$ e $Y$ son [[conditional-independence|independientes]] si la conjunta es el producto de las marginales, $p(x, y) = p(x)\,p(y)$ para todo $x$ e $y$; equivale a que $p(y \mid x)$ no dependa de $x$.` },
        ],
      },
      {
        id: 'ejemplo',
        title: 'Un ejemplo con números',
        blocks: [
          { p: 'Esta es la conjunta del clasificador, con las marginales en los márgenes (de ahí su nombre):' },
          {
            table: {
              head: ['Real / predicha', 'Gato', 'Perro', 'Zorro', 'Total'],
              rows: [
                ['Gato', '0,30', '0,05', '0,05', '0,40'],
                ['Perro', '0,04', '0,32', '0,04', '0,40'],
                ['Zorro', '0,02', '0,03', '0,15', '0,20'],
                ['Total', '0,36', '0,40', '0,24', '1'],
              ],
              numeric: [1, 2, 3, 4],
            },
          },
          { p: String.raw`La exactitud es la suma de la diagonal, 0,77. Las dos condicionales responden a preguntas distintas: $P(\text{pred. gato} \mid \text{real gato}) = 0{,}30/0{,}40 = 0{,}75$ es la sensibilidad (recall) de la clase gato, mientras que $P(\text{real gato} \mid \text{pred. gato}) = 0{,}30/0{,}36 \approx 0{,}833$ es su precisión. Para el zorro la sensibilidad también es 0,75, pero la precisión baja a $0{,}15/0{,}24 = 0{,}625$. Ver [[classification-metrics]].` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Con las marginales puedo reconstruir la conjunta.»', fix: String.raw`Solo si las variables son independientes. Si $X$ es una moneda equilibrada, tomar $Y = X$ o tomar como $Y$ otra moneda independiente da las mismas marginales, pero conjuntas muy distintas.` },
      { claim: String.raw`«$p(y \mid x)$ es una distribución sobre $x$.»`, fix: String.raw`Es una distribución sobre $y$ para cada valor fijo de $x$: suma 1 al recorrer $y$, no al recorrer $x$. En la tabla, al renormalizar las filas cada fila suma 1, pero las columnas no tienen por qué.` },
      { claim: '«Marginalizar es fijar la otra variable en su valor más probable, o en su media.»', fix: String.raw`Marginalizar es promediar sobre todos sus valores, ponderados por su probabilidad. Fijar un valor da una condicional, que puede parecerse muy poco a la marginal: $p(x \mid z)$ evaluada en el $z$ medio no es $p(x) = \int p(x \mid z)\,p(z)\,dz$.` },
    ],
    dl: [
      { title: 'Modelos autorregresivos.', text: String.raw`Un modelo de lenguaje factoriza la probabilidad conjunta de un texto con la regla de la cadena, $p(x_1, \dots, x_T) = \prod_t p(x_t \mid x_{<t})$, y la red aprende cada condicional: la distribución del siguiente token. La factorización es exacta; la aproximación está en la red.` },
      { title: 'Variables latentes.', text: String.raw`Un [[mixtures|modelo de mezcla]] o un [[vae|VAE]] definen la conjunta $p(x, z) = p(z)\,p(x \mid z)$, y la verosimilitud de un dato es la marginal $p(x)$. En la mezcla, $z$ es discreta y la marginal es una suma sencilla; en un VAE, con una red como $p(x \mid z)$, la integral $\int p(x \mid z)\,p(z)\,dz$ no tiene forma cerrada, y de ahí la cota ELBO: ver [[variational-inference]].` },
      { title: 'Discriminativo frente a generativo.', text: String.raw`Un clasificador modela solo la condicional $p(y \mid x)$, no la marginal $p(x)$. Por eso no sabe, por sí solo, si una entrada es rara o ajena a los datos de entrenamiento, y puede dar predicciones muy seguras sobre ella.` },
    ],
    quiz: [
      {
        prompt: String.raw`La conjunta de dos variables binarias es $p(0, 0) = 0{,}1$; $p(0, 1) = 0{,}3$; $p(1, 0) = 0{,}2$ y $p(1, 1) = 0{,}4$, con $p(x, y) = P(X = x, Y = y)$. ¿Cuánto vale $P(Y = 1 \mid X = 0)$?`,
        options: [{ text: '0,3' }, { text: '0,75', correct: true }, { text: '0,43' }],
        explain: String.raw`$P(X = 0) = 0{,}1 + 0{,}3 = 0{,}4$, así que $P(Y = 1 \mid X = 0) = 0{,}3/0{,}4 = 0{,}75$. El 0,3 es la conjunta sin renormalizar, y 0,43 es la condicional al revés, $P(X = 0 \mid Y = 1) = 0{,}3/0{,}7$.`,
      },
      {
        prompt: 'Conoces las distribuciones marginales de X y de Y. ¿Qué puedes decir de su conjunta?',
        options: [
          { text: 'Que es el producto de las marginales.' },
          { text: 'Que no queda determinada: depende de cómo se relacionen X e Y.', correct: true },
          { text: 'Que es la suma de las marginales.' },
        ],
        explain: 'Muchas conjuntas distintas comparten las mismas marginales. Solo si X e Y son independientes la conjunta es el producto de las marginales.',
      },
      {
        prompt: String.raw`En un modelo con una variable latente continua $z$, ¿cómo se obtiene la verosimilitud $p(x)$ de un dato?`,
        options: [
          { text: String.raw`Evaluando $p(x \mid z)$ en el $z$ más probable.` },
          { text: String.raw`Con $p(z \mid x)$.` },
          { text: String.raw`Integrando: $p(x) = \int p(x \mid z)\,p(z)\,dz$.`, correct: true },
        ],
        explain: String.raw`La marginal promedia sobre todos los valores de la latente, ponderados por su probabilidad. Evaluar en un solo $z$ da una condicional, y $p(z \mid x)$ es una distribución sobre $z$, no sobre $x$.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§2.2.3 (conjunta, marginal y condicional; reglas de la suma, del producto y de la cadena), §2.2.4 (factorización bajo independencia) y §3.1 (medidas de dependencia dentro de una conjunta: covarianza y correlación).' },
      { book: 'wilks', where: '§4.4.2, apartado de la normal bivariante (una conjunta continua, con marginales y condicionales normales).' },
      { book: 'pml2', where: '§4.2.1 (cómo un grafo dirigido factoriza una conjunta en un producto de condicionales).' },
    ],
  },
  en: {
    lede: 'When you work with several variables at once, their joint distribution contains everything. From it come the marginals, which describe each variable on its own, and the conditionals, which describe one variable once you know the value of another.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'You evaluate a three-class classifier (cat, dog, fox) and count how many images fall into each pair (true class, predicted class). Divided by the total, those proportions are the **joint distribution** of two variables: the normalized confusion matrix. Summing each row gives the proportion of images of each true class, a **marginal**; summing each column gives the proportion the model assigns to each class, the other marginal. And if you keep one row and renormalize it, you get the distribution of the prediction given the true class: a **conditional**.' },
          { key: 'The joint contains everything. Marginalizing is summing over what you do not care about; conditioning is keeping one slice and renormalizing it so that it adds up to 1.' },
        ],
      },
      {
        id: 'rules',
        title: 'The rules',
        blocks: [
          { p: String.raw`For two discrete variables with joint PMF $p(x, y) = P(X = x, Y = y)$:` },
          { math: String.raw`p(x) = \sum_{y} p(x, y), \qquad p(y \mid x) = \frac{p(x, y)}{p(x)}, \qquad p(x, y) = p(x)\,p(y \mid x)` },
          { p: String.raw`The first is the **sum rule** (marginalizing), the second defines the conditional when $p(x) > 0$ and the third is the **product rule**. With continuous variables, sums become integrals: $p(x) = \int p(x, y)\,dy$. Applying the product rule over and over gives the **chain rule**, valid in any order and without any assumption:` },
          { math: String.raw`p(x_1, \dots, x_n) = p(x_1)\,p(x_2 \mid x_1)\,p(x_3 \mid x_1, x_2) \cdots p(x_n \mid x_1, \dots, x_{n-1})` },
          { p: String.raw`$X$ and $Y$ are [[conditional-independence|independent]] if the joint is the product of the marginals, $p(x, y) = p(x)\,p(y)$ for all $x$ and $y$; equivalently, $p(y \mid x)$ does not depend on $x$.` },
        ],
      },
      {
        id: 'example',
        title: 'A worked example',
        blocks: [
          { p: 'This is the joint distribution of the classifier, with the marginals in the margins (hence the name):' },
          {
            table: {
              head: ['True / predicted', 'Cat', 'Dog', 'Fox', 'Total'],
              rows: [
                ['Cat', '0.30', '0.05', '0.05', '0.40'],
                ['Dog', '0.04', '0.32', '0.04', '0.40'],
                ['Fox', '0.02', '0.03', '0.15', '0.20'],
                ['Total', '0.36', '0.40', '0.24', '1'],
              ],
              numeric: [1, 2, 3, 4],
            },
          },
          { p: String.raw`Accuracy is the sum of the diagonal, 0.77. The two conditionals answer different questions: $P(\text{pred. cat} \mid \text{true cat}) = 0.30/0.40 = 0.75$ is the recall of the cat class, whereas $P(\text{true cat} \mid \text{pred. cat}) = 0.30/0.36 \approx 0.833$ is its precision. For the fox, recall is also 0.75, but precision drops to $0.15/0.24 = 0.625$. See [[classification-metrics]].` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“From the marginals I can rebuild the joint.”', fix: String.raw`Only if the variables are independent. If $X$ is a fair coin, taking $Y = X$ or taking as $Y$ another independent coin gives the same marginals but very different joints.` },
      { claim: String.raw`“$p(y \mid x)$ is a distribution over $x$.”`, fix: String.raw`It is a distribution over $y$ for each fixed value of $x$: it sums to 1 over $y$, not over $x$. In the table, after renormalizing the rows each row sums to 1, but the columns need not.` },
      { claim: '“Marginalizing means fixing the other variable at its most probable value, or at its mean.”', fix: String.raw`Marginalizing means averaging over all its values, weighted by their probability. Fixing one value gives a conditional, which may look very little like the marginal: $p(x \mid z)$ evaluated at the mean $z$ is not $p(x) = \int p(x \mid z)\,p(z)\,dz$.` },
    ],
    dl: [
      { title: 'Autoregressive models.', text: String.raw`A language model factorizes the joint probability of a text with the chain rule, $p(x_1, \dots, x_T) = \prod_t p(x_t \mid x_{<t})$, and the network learns each conditional: the distribution of the next token. The factorization is exact; the approximation lies in the network.` },
      { title: 'Latent variables.', text: String.raw`A [[mixtures|mixture model]] or a [[vae|VAE]] defines the joint $p(x, z) = p(z)\,p(x \mid z)$, and the likelihood of a data point is the marginal $p(x)$. In the mixture, $z$ is discrete and the marginal is a simple sum; in a VAE, with a network as $p(x \mid z)$, the integral $\int p(x \mid z)\,p(z)\,dz$ has no closed form, hence the ELBO bound: see [[variational-inference]].` },
      { title: 'Discriminative versus generative.', text: String.raw`A classifier models only the conditional $p(y \mid x)$, not the marginal $p(x)$. That is why, on its own, it cannot tell whether an input is unusual or unlike the training data, and it may give very confident predictions on it.` },
    ],
    quiz: [
      {
        prompt: String.raw`The joint distribution of two binary variables is $p(0, 0) = 0.1$, $p(0, 1) = 0.3$, $p(1, 0) = 0.2$ and $p(1, 1) = 0.4$, with $p(x, y) = P(X = x, Y = y)$. What is $P(Y = 1 \mid X = 0)$?`,
        options: [{ text: '0.3' }, { text: '0.75', correct: true }, { text: '0.43' }],
        explain: String.raw`$P(X = 0) = 0.1 + 0.3 = 0.4$, so $P(Y = 1 \mid X = 0) = 0.3/0.4 = 0.75$. The 0.3 is the joint without renormalizing, and 0.43 is the reverse conditional, $P(X = 0 \mid Y = 1) = 0.3/0.7$.`,
      },
      {
        prompt: 'You know the marginal distributions of X and of Y. What can you say about their joint distribution?',
        options: [
          { text: 'That it is the product of the marginals.' },
          { text: 'That it is not determined: it depends on how X and Y are related.', correct: true },
          { text: 'That it is the sum of the marginals.' },
        ],
        explain: 'Many different joints share the same marginals. Only if X and Y are independent is the joint the product of the marginals.',
      },
      {
        prompt: String.raw`In a model with a continuous latent variable $z$, how do you get the likelihood $p(x)$ of a data point?`,
        options: [
          { text: String.raw`By evaluating $p(x \mid z)$ at the most probable $z$.` },
          { text: String.raw`With $p(z \mid x)$.` },
          { text: String.raw`By integrating: $p(x) = \int p(x \mid z)\,p(z)\,dz$.`, correct: true },
        ],
        explain: String.raw`The marginal averages over all values of the latent variable, weighted by their probability. Evaluating at a single $z$ gives a conditional, and $p(z \mid x)$ is a distribution over $z$, not over $x$.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§2.2.3 (joint, marginal and conditional distributions; sum, product and chain rules), §2.2.4 (factorization under independence) and §3.1 (measures of dependence within a joint distribution: covariance and correlation).' },
      { book: 'wilks', where: '§4.4.2, the part on the bivariate normal (a continuous joint distribution, with normal marginals and conditionals).' },
      { book: 'pml2', where: '§4.2.1 (how a directed graph factorizes a joint distribution into a product of conditionals).' },
    ],
  },
};

export default content;
