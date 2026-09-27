import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'La covarianza mide si dos variables tienden a desviarse de su media en el mismo sentido o en sentidos opuestos; la correlación es esa misma medida en una escala de −1 a 1. Solo captan relaciones lineales, y no dicen nada sobre causas.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'En verano, los días más calurosos son también los de más consumo eléctrico, por el aire acondicionado: cuando la temperatura está por encima de su media, el consumo también suele estarlo. La **covarianza** promedia el producto de las dos desviaciones respecto a la media; sale positiva si las variables tienden a desviarse en el mismo sentido y negativa si lo hacen en sentidos opuestos. Pero si miras el año entero, el consumo sube tanto en los días fríos (calefacción) como en los calurosos: la relación es fuerte, pero tiene forma de U, y la covarianza puede salir casi nula.' },
          { key: 'La correlación mide cuánto se parece la relación entre dos variables a una recta, no cuánto dependen una de otra.' },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { math: String.raw`\operatorname{Cov}(X, Y) = \mathbb{E}\big[(X - \mu_X)(Y - \mu_Y)\big] = \mathbb{E}[XY] - \mu_X \mu_Y, \qquad \rho_{XY} = \frac{\operatorname{Cov}(X, Y)}{\sigma_X\,\sigma_Y}` },
          { p: 'La correlación requiere varianzas finitas y no nulas. Sus propiedades principales:' },
          {
            list: [
              String.raw`$\operatorname{Cov}(X, X) = \operatorname{Var}(X)$, y la covarianza es simétrica y bilineal: $\operatorname{Cov}(aX + b, cY + d) = ac\,\operatorname{Cov}(X, Y)$.`,
              'La covarianza depende de las unidades; la correlación no (solo cambia de signo si una de las escalas se invierte).',
              String.raw`$-1 \le \rho_{XY} \le 1$, y $|\rho_{XY}| = 1$ solo si $Y = aX + b$ exactamente, con probabilidad 1.`,
              String.raw`Para un vector $\mathbf{x}$ con media $\boldsymbol\mu$, la **matriz de covarianzas** $\Sigma = \mathbb{E}\big[(\mathbf{x} - \boldsymbol\mu)(\mathbf{x} - \boldsymbol\mu)^\top\big]$ tiene las varianzas en la diagonal y es simétrica y semidefinida positiva. Bajo una transformación lineal, $\operatorname{Cov}(A\mathbf{x} + \mathbf{b}) = A\,\Sigma\,A^\top$: la base de la [[mvn|normal multivariante]] y del [[pca|PCA]].`,
            ],
          },
        ],
      },
      {
        id: 'valores',
        title: 'Algunos valores',
        blocks: [
          { p: String.raw`Con $X$ y $\varepsilon$ normales estándar e independientes:` },
          {
            table: {
              head: ['Relación', String.raw`$\rho_{XY}$`],
              rows: [
                [String.raw`$Y = 2X$`, '1'],
                [String.raw`$Y = 0{,}1\,X$`, '1'],
                [String.raw`$Y = X + \varepsilon$`, '0,707'],
                [String.raw`$Y = X + 2\varepsilon$`, '0,447'],
                [String.raw`$Y = -X + 0{,}5\,\varepsilon$`, String.raw`$-0{,}894$`],
                [String.raw`$Y = X^2$`, '0'],
              ],
              numeric: [1],
            },
          },
          { p: String.raw`La pendiente no influye: $Y = 2X$ e $Y = 0{,}1\,X$ tienen correlación 1. Lo que la reduce es el ruido alrededor de la recta. Y con $Y = X^2$, aunque $Y$ esté totalmente determinada por $X$, la correlación es 0, porque la relación no tiene tendencia lineal: $\operatorname{Cov}(X, X^2) = \mathbb{E}[X^3] = 0$ por simetría.` },
        ],
      },
      {
        id: 'limites',
        title: 'Lo que la correlación no dice',
        blocks: [
          {
            list: [
              String.raw`**Incorrelación no es independencia.** La independencia implica covarianza nula (si las varianzas son finitas), pero no al revés. Otro ejemplo: si eliges un punto al azar en una circunferencia, $X = \cos\Theta$ e $Y = \sin\Theta$ tienen covarianza nula y, sin embargo, $X^2 + Y^2 = 1$. Para medir cualquier tipo de dependencia está la [[mutual-information|información mutua]].`,
              '**Paradoja de Simpson.** Una asociación puede invertirse al juntar grupos. El modelo A acierta el 95 % de 100 imágenes fáciles y el 60 % de 400 difíciles; el B, el 90 % de 400 fáciles y el 55 % de 100 difíciles. A gana en los dos grupos, pero en total acierta el 67 % frente al 83 % de B, porque se evaluó con muchas más imágenes difíciles.',
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Correlación cero significa que las variables son independientes.»', fix: String.raw`Solo significa que no hay tendencia lineal. $Y = X^2$, con $X$ normal estándar, tiene correlación nula con $X$ y depende por completo de ella.` },
      { claim: '«Una correlación alta indica un efecto grande.»', fix: String.raw`La correlación no mide la pendiente: $Y = 0{,}1\,X$ tiene correlación 1 y un efecto pequeño. La pendiente de la recta de regresión de $Y$ sobre $X$ es $\rho_{XY}\,\sigma_Y/\sigma_X$: ver [[linear-regression]].` },
      { claim: '«Si X e Y están correlacionadas, una causa la otra.»', fix: 'Puede haber una causa común: las ventas de paraguas y los atascos están correlacionados porque los dos aumentan con la lluvia, y prohibir los paraguas no arreglaría el tráfico. También puede haber causalidad en sentido contrario o simple casualidad en una muestra pequeña. Para hablar de causas hace falta un experimento o un modelo causal.' },
      { claim: '«Si dos variables son normales e incorreladas, son independientes.»', fix: String.raw`Hace falta que sean **conjuntamente** normales. Si $X$ es normal estándar e $Y = SX$, con $S = \pm 1$ al azar e independiente de $X$, entonces $Y$ también es normal estándar y $\operatorname{Cov}(X, Y) = 0$, pero $|Y| = |X|$ siempre.` },
    ],
    dl: [
      { title: 'Ensembles y errores correlacionados.', text: String.raw`Si promedias $M$ modelos cuyos errores tienen varianza $\sigma^2$ y correlación $\rho$ entre cada par, la varianza del promedio es $\rho\,\sigma^2 + (1 - \rho)\,\sigma^2/M$. Con $\rho = 0{,}5$ y $M = 5$ queda en $0{,}6\,\sigma^2$, frente a $0{,}2\,\sigma^2$ si fueran independientes, y por muchos modelos que añadas no baja de $\rho\,\sigma^2$. Por eso un ensemble gana más cuanto más diversos son sus miembros.` },
      { title: 'Representaciones decorrelacionadas.', text: 'Métodos autosupervisados como Barlow Twins o VICReg penalizan los elementos fuera de la diagonal de la matriz de correlaciones cruzadas (Barlow Twins) o de covarianzas (VICReg) de los embeddings, para que cada dimensión aporte información distinta y la representación no colapse. El blanqueado con [[pca|PCA]] persigue lo mismo de forma lineal.' },
    ],
    quiz: [
      {
        prompt: String.raw`Si $\operatorname{Cov}(X, Y) = 6$, $\sigma_X = 2$ y $\sigma_Y = 5$, ¿cuánto vale $\rho_{XY}$?`,
        options: [{ text: '0,6', correct: true }, { text: '6' }, { text: '1,2' }],
        explain: String.raw`$\rho_{XY} = 6/(2 \cdot 5) = 0{,}6$. La covarianza por sí sola no está acotada, y dividir solo por $\sigma_Y$ daría 1,2, un valor imposible para una correlación.`,
      },
      {
        prompt: 'Pasas X de metros a centímetros. ¿Qué ocurre?',
        options: [
          { text: 'Cambian la covarianza y la correlación.' },
          { text: 'Cambia la covarianza, pero no la correlación.', correct: true },
          { text: 'No cambia ninguna de las dos.' },
        ],
        explain: String.raw`$\operatorname{Cov}(100X, Y) = 100\,\operatorname{Cov}(X, Y)$, pero también $\sigma_{100X} = 100\,\sigma_X$, y el factor se cancela en la correlación.`,
      },
      {
        prompt: String.raw`Promedias muchísimos modelos cuyos errores tienen varianza $\sigma^2$ y correlación 0,3 entre cada par. ¿A qué tiende la varianza del promedio?`,
        options: [{ text: 'A 0.' }, { text: String.raw`A $0{,}3\,\sigma^2$.`, correct: true }, { text: String.raw`A $\sigma^2$.` }],
        explain: String.raw`La varianza del promedio es $\rho\,\sigma^2 + (1 - \rho)\,\sigma^2/M$, que tiende a $\rho\,\sigma^2 = 0{,}3\,\sigma^2$ cuando $M$ crece. La parte común de los errores no se cancela al promediar.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§3.1.1–3.1.2 (covarianza, matriz de covarianzas y correlación) y §3.1.3–3.1.5 (incorrelación frente a independencia, correlación frente a causalidad y paradoja de Simpson).' },
      { book: 'wilks', where: '§11.4.1 y §11.4.3 (vector de medias, matriz de covarianzas y covarianza de combinaciones lineales).' },
    ],
    extra: [
      { text: 'Simpson, E. H. (1951). The interpretation of interaction in contingency tables. Journal of the Royal Statistical Society: Series B, 13(2), 238–241. Artículo clásico sobre cómo cambian las asociaciones al agregar tablas, el fenómeno que hoy se conoce como paradoja de Simpson.', url: 'https://doi.org/10.1111/j.2517-6161.1951.tb00088.x' },
    ],
  },
  en: {
    lede: 'Covariance measures whether two variables tend to deviate from their means in the same direction or in opposite ones; correlation is the same measure on a scale from −1 to 1. Both capture only linear relationships, and neither says anything about causes.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'In summer, the hottest days are also the days with the highest electricity consumption, because of air conditioning: when temperature is above its mean, consumption usually is too. **Covariance** averages the product of the two deviations from the mean; it is positive if the variables tend to deviate in the same direction and negative if they deviate in opposite ones. But over a whole year, consumption rises on cold days (heating) as well as on hot ones: the relationship is strong but U-shaped, and the covariance can come out close to zero.' },
          { key: 'Correlation measures how much the relationship between two variables looks like a straight line, not how much one depends on the other.' },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { math: String.raw`\operatorname{Cov}(X, Y) = \mathbb{E}\big[(X - \mu_X)(Y - \mu_Y)\big] = \mathbb{E}[XY] - \mu_X \mu_Y, \qquad \rho_{XY} = \frac{\operatorname{Cov}(X, Y)}{\sigma_X\,\sigma_Y}` },
          { p: 'Correlation requires finite, non-zero variances. Its main properties:' },
          {
            list: [
              String.raw`$\operatorname{Cov}(X, X) = \operatorname{Var}(X)$, and covariance is symmetric and bilinear: $\operatorname{Cov}(aX + b, cY + d) = ac\,\operatorname{Cov}(X, Y)$.`,
              'Covariance depends on the units; correlation does not (it only changes sign if one of the scales is reversed).',
              String.raw`$-1 \le \rho_{XY} \le 1$, and $|\rho_{XY}| = 1$ only if $Y = aX + b$ exactly, with probability 1.`,
              String.raw`For a vector $\mathbf{x}$ with mean $\boldsymbol\mu$, the **covariance matrix** $\Sigma = \mathbb{E}\big[(\mathbf{x} - \boldsymbol\mu)(\mathbf{x} - \boldsymbol\mu)^\top\big]$ has the variances on its diagonal and is symmetric and positive semidefinite. Under a linear map, $\operatorname{Cov}(A\mathbf{x} + \mathbf{b}) = A\,\Sigma\,A^\top$: the basis of the [[mvn|multivariate normal]] and of [[pca|PCA]].`,
            ],
          },
        ],
      },
      {
        id: 'values',
        title: 'Some values',
        blocks: [
          { p: String.raw`With $X$ and $\varepsilon$ independent standard normals:` },
          {
            table: {
              head: ['Relationship', String.raw`$\rho_{XY}$`],
              rows: [
                [String.raw`$Y = 2X$`, '1'],
                [String.raw`$Y = 0.1\,X$`, '1'],
                [String.raw`$Y = X + \varepsilon$`, '0.707'],
                [String.raw`$Y = X + 2\varepsilon$`, '0.447'],
                [String.raw`$Y = -X + 0.5\,\varepsilon$`, String.raw`$-0.894$`],
                [String.raw`$Y = X^2$`, '0'],
              ],
              numeric: [1],
            },
          },
          { p: String.raw`The slope plays no role: $Y = 2X$ and $Y = 0.1\,X$ both have correlation 1. What lowers it is the noise around the line. And with $Y = X^2$, even though $Y$ is completely determined by $X$, the correlation is 0, because the relationship has no linear trend: $\operatorname{Cov}(X, X^2) = \mathbb{E}[X^3] = 0$ by symmetry.` },
        ],
      },
      {
        id: 'limits',
        title: 'What correlation does not tell you',
        blocks: [
          {
            list: [
              String.raw`**Uncorrelated is not independent.** Independence implies zero covariance (if the variances are finite), but not the other way round. Another example: if you pick a point at random on a circle, $X = \cos\Theta$ and $Y = \sin\Theta$ have zero covariance, and yet $X^2 + Y^2 = 1$. To measure any kind of dependence there is [[mutual-information|mutual information]].`,
              '**Simpson’s paradox.** An association can reverse when groups are pooled. Model A is right on 95% of 100 easy images and 60% of 400 hard ones; model B on 90% of 400 easy ones and 55% of 100 hard ones. A wins in both groups, but overall it is right 67% of the time against 83% for B, because it was evaluated on many more hard images.',
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '“Zero correlation means the variables are independent.”', fix: String.raw`It only means there is no linear trend. $Y = X^2$, with $X$ standard normal, has zero correlation with $X$ and depends on it completely.` },
      { claim: '“A high correlation means a large effect.”', fix: String.raw`Correlation does not measure the slope: $Y = 0.1\,X$ has correlation 1 and a small effect. The slope of the regression line of $Y$ on $X$ is $\rho_{XY}\,\sigma_Y/\sigma_X$: see [[linear-regression]].` },
      { claim: '“If X and Y are correlated, one causes the other.”', fix: 'There may be a common cause: umbrella sales and traffic jams are correlated because both go up with rain, and banning umbrellas would not fix the traffic. There may also be causation in the opposite direction or plain chance in a small sample. To talk about causes you need an experiment or a causal model.' },
      { claim: '“If two variables are normal and uncorrelated, they are independent.”', fix: String.raw`They must be **jointly** normal. If $X$ is standard normal and $Y = SX$, with $S = \pm 1$ at random and independent of $X$, then $Y$ is also standard normal and $\operatorname{Cov}(X, Y) = 0$, but $|Y| = |X|$ always.` },
    ],
    dl: [
      { title: 'Ensembles and correlated errors.', text: String.raw`If you average $M$ models whose errors have variance $\sigma^2$ and correlation $\rho$ between each pair, the variance of the average is $\rho\,\sigma^2 + (1 - \rho)\,\sigma^2/M$. With $\rho = 0.5$ and $M = 5$ it stays at $0.6\,\sigma^2$, against $0.2\,\sigma^2$ if they were independent, and no matter how many models you add it never drops below $\rho\,\sigma^2$. That is why an ensemble gains more the more diverse its members are.` },
      { title: 'Decorrelated representations.', text: 'Self-supervised methods such as Barlow Twins or VICReg penalize the off-diagonal entries of the cross-correlation matrix (Barlow Twins) or of the covariance matrix (VICReg) of the embeddings, so that each dimension carries different information and the representation does not collapse. Whitening with [[pca|PCA]] pursues the same goal linearly.' },
    ],
    quiz: [
      {
        prompt: String.raw`If $\operatorname{Cov}(X, Y) = 6$, $\sigma_X = 2$ and $\sigma_Y = 5$, what is $\rho_{XY}$?`,
        options: [{ text: '0.6', correct: true }, { text: '6' }, { text: '1.2' }],
        explain: String.raw`$\rho_{XY} = 6/(2 \cdot 5) = 0.6$. Covariance on its own is not bounded, and dividing by $\sigma_Y$ alone would give 1.2, an impossible value for a correlation.`,
      },
      {
        prompt: 'You convert X from meters to centimeters. What happens?',
        options: [
          { text: 'Both the covariance and the correlation change.' },
          { text: 'The covariance changes, but the correlation does not.', correct: true },
          { text: 'Neither of them changes.' },
        ],
        explain: String.raw`$\operatorname{Cov}(100X, Y) = 100\,\operatorname{Cov}(X, Y)$, but also $\sigma_{100X} = 100\,\sigma_X$, and the factor cancels in the correlation.`,
      },
      {
        prompt: String.raw`You average a huge number of models whose errors have variance $\sigma^2$ and correlation 0.3 between each pair. What does the variance of the average tend to?`,
        options: [{ text: 'To 0.' }, { text: String.raw`To $0.3\,\sigma^2$.`, correct: true }, { text: String.raw`To $\sigma^2$.` }],
        explain: String.raw`The variance of the average is $\rho\,\sigma^2 + (1 - \rho)\,\sigma^2/M$, which tends to $\rho\,\sigma^2 = 0.3\,\sigma^2$ as $M$ grows. The shared part of the errors does not cancel out when averaging.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§3.1.1–3.1.2 (covariance, covariance matrix and correlation) and §3.1.3–3.1.5 (uncorrelated versus independent, correlation versus causation and Simpson’s paradox).' },
      { book: 'wilks', where: '§11.4.1 and §11.4.3 (mean vector, covariance matrix and covariance of linear combinations).' },
    ],
    extra: [
      { text: 'Simpson, E. H. (1951). The interpretation of interaction in contingency tables. Journal of the Royal Statistical Society: Series B, 13(2), 238–241. A classic paper on how associations change when tables are pooled, the phenomenon now known as Simpson’s paradox.', url: 'https://doi.org/10.1111/j.2517-6161.1951.tb00088.x' },
    ],
  },
};

export default content;
