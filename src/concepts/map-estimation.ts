import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'La estimación MAP (máximo a posteriori) elige el valor del parámetro con mayor densidad posterior. Al tomar logaritmos, el prior se convierte en una penalización: por eso la regularización L2 equivale a un prior gaussiano y la L1, a uno de Laplace.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Un jugador nuevo mete sus 4 primeros tiros libres. El [[mle|EMV]] de su probabilidad de acierto es $4/4 = 1$, que nadie se cree. Si sabes que en la liga el acierto ronda el 75 %, puedes expresarlo con un prior $\text{Beta}(15;\ 5)$ y quedarte con el valor más probable del [[prior-posterior|posterior]]: $\hat\theta_{\text{MAP}} = 18/22 \approx 0{,}818$. Es un compromiso entre los datos y lo que ya sabías, igual que una [[regularization|regularización]].` },
          { key: 'MAP = máxima verosimilitud + penalización: el logaritmo del prior hace de término de regularización.' },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { p: String.raw`Como $p(D)$ no depende de $\theta$, maximizar el posterior es maximizar verosimilitud por prior. Con logaritmos, y cambiando de signo:` },
          { math: String.raw`\hat\theta_{\text{MAP}} = \arg\max_\theta\, p(\theta \mid D) = \arg\min_\theta \big[-\log p(D \mid \theta) - \log p(\theta)\big]` },
          {
            list: [
              String.raw`**Prior gaussiano**, $w_j \sim \mathcal{N}(0, \tau^2)$: $-\log p(\mathbf{w}) = \frac{1}{2\tau^2}\lVert\mathbf{w}\rVert_2^2 + \text{cte.}$ Es la penalización L2 (ridge o weight decay).`,
              String.raw`**Prior de Laplace**, $p(w_j) \propto e^{-|w_j|/b}$: $-\log p(\mathbf{w}) = \frac{1}{b}\lVert\mathbf{w}\rVert_1 + \text{cte.}$ Es la penalización L1 (lasso), que lleva muchos pesos exactamente a cero.`,
              '**Prior uniforme**: no penaliza nada, y el MAP coincide con el EMV.',
            ],
          },
          { p: String.raw`Las redes minimizan la pérdida media sobre $n$ ejemplos. Si esa pérdida es la log-verosimilitud negativa media (por ejemplo, la entropía cruzada), todo queda dividido entre $n$: sumar $\frac{\lambda}{2}\lVert\mathbf{w}\rVert_2^2$ a la pérdida media equivale a un prior $\mathcal{N}(0, \tau^2)$ con $\lambda = 1/(n\tau^2)$.` },
        ],
      },
      {
        id: 'comparacion',
        title: 'MAP, EMV y media posterior',
        blocks: [
          { p: String.raw`Con un prior $\text{Beta}(a, b)$ y $k$ aciertos en $n$ intentos, el posterior es $\text{Beta}(a + k,\ b + n - k)$ y su moda es:` },
          { math: String.raw`\hat\theta_{\text{MAP}} = \frac{k + a - 1}{n + a + b - 2}` },
          {
            table: {
              head: ['Aciertos / intentos', 'EMV', 'MAP', 'Media posterior'],
              rows: [
                ['4 / 4', '1', '0,818', '0,792'],
                ['36 / 40', '0,9', '0,862', '0,850'],
                ['360 / 400', '0,9', '0,895', '0,893'],
              ],
              numeric: [1, 2, 3],
            },
          },
          { p: String.raw`Con el prior $\text{Beta}(15;\ 5)$ de antes: al crecer $n$ el prior pesa menos y los tres estimadores se acercan entre sí. Con pocos datos, el MAP y la media posterior no coinciden, porque el posterior es asimétrico.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«El MAP es la media del posterior.»', fix: 'Es su moda. Con 4 aciertos de 4, el MAP es 0,818 y la media posterior, 0,792. Coinciden cuando el posterior es simétrico y unimodal, como uno gaussiano, pero no en general.' },
      { claim: '«Usar el MAP es hacer inferencia bayesiana.»', fix: 'El MAP se queda con un único punto y descarta la incertidumbre del posterior: en la práctica es un EMV regularizado. Para intervalos o predicciones que tengan en cuenta la incertidumbre hace falta el posterior completo: ver [[posterior-predictive]].' },
      { claim: '«El MAP no depende de cómo parametrices el modelo.»', fix: String.raw`Sí depende, a diferencia del EMV: al cambiar de variable, la densidad se multiplica por un jacobiano y su moda se mueve. El posterior $\text{Beta}(19;\ 5)$ del jugador tiene la moda en $\theta = 0{,}818$, pero si lo escribes en log-odds, la moda corresponde a $\theta = 0{,}792$.` },
      { claim: '«Cuanto más fuerte es el prior, mejor generaliza el modelo.»', fix: 'Un prior demasiado fuerte (λ grande) arrastra los pesos hacia cero y produce infraajuste. La fuerza de la regularización es un hiperparámetro que se elige con datos de validación: ver [[cross-validation]].' },
    ],
    dl: [
      { title: 'El weight decay es un prior gaussiano.', text: String.raw`Con $n = 50\,000$ ejemplos, $\lambda = 5 \cdot 10^{-4}$ y una pérdida que sea la log-verosimilitud negativa media (como la entropía cruzada), el weight decay equivale a un prior $\mathcal{N}(0;\ 0{,}2^2)$ sobre cada peso, porque $\tau^2 = 1/(n\lambda) = 0{,}04$. Si duplicas los datos y mantienes $\lambda$, el prior implícito se vuelve más estrecho.` },
      { title: 'Adam y AdamW.', text: 'Con SGD simple, sumar la penalización L2 a la pérdida y aplicar weight decay es lo mismo. Con Adam no: el gradiente de la penalización se reescala igual que el de la pérdida. AdamW (Loshchilov y Hutter, 2019) desacopla el decaimiento de ese reescalado y suele generalizar mejor, aunque entonces ya no minimiza exactamente el objetivo MAP con prior gaussiano.' },
      { title: 'No todo se regulariza.', text: 'Es habitual no aplicar weight decay a los sesgos ni a los parámetros de las capas de normalización: un prior que los empuja hacia 0 no tiene sentido para ellos (la escala de una normalización empieza en 1).' },
    ],
    quiz: [
      {
        prompt: String.raw`Con un prior $\text{Beta}(3;\ 3)$ observas 5 éxitos en 5 intentos. ¿Cuál es el MAP?`,
        options: [{ text: '1' }, { text: '0,778', correct: true }, { text: '0,727' }],
        explain: String.raw`El posterior es $\text{Beta}(8;\ 3)$ y su moda es $(8 - 1)/(8 + 3 - 2) = 7/9 \approx 0{,}778$. El 0,727 es la media posterior, $8/11$; el 1 es el EMV.`,
      },
      {
        prompt: '¿Qué prior sobre los pesos corresponde a la penalización L1?',
        options: [{ text: 'Gaussiano' }, { text: 'Uniforme' }, { text: 'Laplace', correct: true }],
        explain: String.raw`Menos el logaritmo de una densidad de Laplace es proporcional a $|w|$; sumado sobre los pesos da $\lVert\mathbf{w}\rVert_1$. El gaussiano da L2 y el uniforme no penaliza.`,
      },
      {
        prompt: String.raw`Minimizas la entropía cruzada media sobre $n = 10\,000$ ejemplos más $\frac{\lambda}{2}\lVert\mathbf{w}\rVert_2^2$, con $\lambda = 10^{-3}$. ¿Qué prior gaussiano estás usando?`,
        options: [
          { text: String.raw`Uno de varianza $\tau^2 = 0{,}1$.`, correct: true },
          { text: String.raw`Uno de varianza $\tau^2 = 1000$.` },
          { text: String.raw`Uno de varianza $\tau^2 = 0{,}001$.` },
        ],
        explain: String.raw`$\tau^2 = 1/(n\lambda) = 1/(10\,000 \cdot 10^{-3}) = 0{,}1$. Si tomas $\lambda$ como $1/\tau^2$ olvidas el factor $n$ que introduce promediar la pérdida.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§4.5 (la regularización como estimación MAP), §4.5.1 (MAP de una Bernoulli con prior beta), §4.5.3 (weight decay como prior gaussiano), §11.3.1 (regresión ridge) y §11.4.1 (lasso como MAP con prior de Laplace).' },
      { book: 'pml2', where: '§7.4.1 (limitaciones del MAP: no mide la incertidumbre, puede ser poco representativo del posterior y depende de la parametrización).' },
    ],
  },
  en: {
    lede: 'MAP (maximum a posteriori) estimation picks the parameter value with the highest posterior density. Taking logarithms turns the prior into a penalty: that is why L2 regularization is equivalent to a Gaussian prior and L1 to a Laplace prior.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`A new player makes their first 4 free throws. The [[mle|MLE]] of their success rate is $4/4 = 1$, which nobody believes. If you know that players in the league make around 75%, you can express that with a $\text{Beta}(15, 5)$ prior and take the most probable value of the [[prior-posterior|posterior]]: $\hat\theta_{\text{MAP}} = 18/22 \approx 0.818$. It is a compromise between the data and what you already knew, just like [[regularization|regularization]].` },
          { key: 'MAP = maximum likelihood + penalty: the logarithm of the prior acts as the regularization term.' },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { p: String.raw`Since $p(D)$ does not depend on $\theta$, maximizing the posterior means maximizing likelihood times prior. Taking logarithms and flipping the sign:` },
          { math: String.raw`\hat\theta_{\text{MAP}} = \arg\max_\theta\, p(\theta \mid D) = \arg\min_\theta \big[-\log p(D \mid \theta) - \log p(\theta)\big]` },
          {
            list: [
              String.raw`**Gaussian prior**, $w_j \sim \mathcal{N}(0, \tau^2)$: $-\log p(\mathbf{w}) = \frac{1}{2\tau^2}\lVert\mathbf{w}\rVert_2^2 + \text{const.}$ This is the L2 penalty (ridge or weight decay).`,
              String.raw`**Laplace prior**, $p(w_j) \propto e^{-|w_j|/b}$: $-\log p(\mathbf{w}) = \frac{1}{b}\lVert\mathbf{w}\rVert_1 + \text{const.}$ This is the L1 penalty (lasso), which drives many weights exactly to zero.`,
              '**Uniform prior**: it penalizes nothing, and the MAP estimate coincides with the MLE.',
            ],
          },
          { p: String.raw`Networks minimize the mean loss over $n$ examples. If that loss is the mean negative log-likelihood (for example, cross-entropy), everything is divided by $n$: adding $\frac{\lambda}{2}\lVert\mathbf{w}\rVert_2^2$ to the mean loss is equivalent to a $\mathcal{N}(0, \tau^2)$ prior with $\lambda = 1/(n\tau^2)$.` },
        ],
      },
      {
        id: 'comparison',
        title: 'MAP, MLE and posterior mean',
        blocks: [
          { p: String.raw`With a $\text{Beta}(a, b)$ prior and $k$ successes in $n$ attempts, the posterior is $\text{Beta}(a + k,\ b + n - k)$ and its mode is:` },
          { math: String.raw`\hat\theta_{\text{MAP}} = \frac{k + a - 1}{n + a + b - 2}` },
          {
            table: {
              head: ['Successes / attempts', 'MLE', 'MAP', 'Posterior mean'],
              rows: [
                ['4 / 4', '1', '0.818', '0.792'],
                ['36 / 40', '0.9', '0.862', '0.850'],
                ['360 / 400', '0.9', '0.895', '0.893'],
              ],
              numeric: [1, 2, 3],
            },
          },
          { p: String.raw`With the same $\text{Beta}(15, 5)$ prior: as $n$ grows the prior weighs less and the three estimators get closer to each other. With little data, the MAP estimate and the posterior mean differ, because the posterior is skewed.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“The MAP estimate is the posterior mean.”', fix: 'It is the mode. With 4 successes out of 4, the MAP estimate is 0.818 and the posterior mean is 0.792. They coincide when the posterior is symmetric and unimodal, like a Gaussian one, but not in general.' },
      { claim: '“Using MAP is doing Bayesian inference.”', fix: 'MAP keeps a single point and throws away the uncertainty in the posterior: in practice it is a regularized MLE. For intervals or predictions that account for uncertainty you need the full posterior: see [[posterior-predictive]].' },
      { claim: '“The MAP estimate does not depend on how you parameterize the model.”', fix: String.raw`It does, unlike the MLE: when you change variables, the density is multiplied by a Jacobian and its mode moves. The player’s $\text{Beta}(19, 5)$ posterior has its mode at $\theta = 0.818$, but if you write it in log-odds, the mode corresponds to $\theta = 0.792$.` },
      { claim: '“The stronger the prior, the better the model generalizes.”', fix: 'A prior that is too strong (large λ) drags the weights towards zero and causes underfitting. The strength of the regularization is a hyperparameter chosen on validation data: see [[cross-validation]].' },
    ],
    dl: [
      { title: 'Weight decay is a Gaussian prior.', text: String.raw`With $n = 50{,}000$ examples, $\lambda = 5 \cdot 10^{-4}$ and a loss that is the mean negative log-likelihood (such as cross-entropy), weight decay is equivalent to a $\mathcal{N}(0, 0.2^2)$ prior on each weight, because $\tau^2 = 1/(n\lambda) = 0.04$. If you double the data and keep $\lambda$, the implied prior becomes narrower.` },
      { title: 'Adam and AdamW.', text: 'With plain SGD, adding the L2 penalty to the loss and applying weight decay are the same thing. With Adam they are not: the gradient of the penalty is rescaled just like that of the loss. AdamW (Loshchilov and Hutter, 2019) decouples the decay from that rescaling and usually generalizes better, although it then no longer minimizes exactly the MAP objective with a Gaussian prior.' },
      { title: 'Not everything is regularized.', text: 'It is common not to apply weight decay to biases or to the parameters of normalization layers: a prior that pushes them towards 0 makes no sense for them (the scale of a normalization layer starts at 1).' },
    ],
    quiz: [
      {
        prompt: String.raw`With a $\text{Beta}(3, 3)$ prior you observe 5 successes in 5 attempts. What is the MAP estimate?`,
        options: [{ text: '1' }, { text: '0.778', correct: true }, { text: '0.727' }],
        explain: String.raw`The posterior is $\text{Beta}(8, 3)$ and its mode is $(8 - 1)/(8 + 3 - 2) = 7/9 \approx 0.778$. The 0.727 is the posterior mean, $8/11$; the 1 is the MLE.`,
      },
      {
        prompt: 'Which prior on the weights corresponds to the L1 penalty?',
        options: [{ text: 'Gaussian' }, { text: 'Uniform' }, { text: 'Laplace', correct: true }],
        explain: String.raw`Minus the logarithm of a Laplace density is proportional to $|w|$; summed over the weights it gives $\lVert\mathbf{w}\rVert_1$. The Gaussian gives L2 and the uniform penalizes nothing.`,
      },
      {
        prompt: String.raw`You minimize the mean cross-entropy over $n = 10{,}000$ examples plus $\frac{\lambda}{2}\lVert\mathbf{w}\rVert_2^2$, with $\lambda = 10^{-3}$. Which Gaussian prior are you using?`,
        options: [
          { text: String.raw`One with variance $\tau^2 = 0.1$.`, correct: true },
          { text: String.raw`One with variance $\tau^2 = 1000$.` },
          { text: String.raw`One with variance $\tau^2 = 0.001$.` },
        ],
        explain: String.raw`$\tau^2 = 1/(n\lambda) = 1/(10{,}000 \cdot 10^{-3}) = 0.1$. If you take $\lambda$ to be $1/\tau^2$ you forget the factor $n$ introduced by averaging the loss.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§4.5 (regularization as MAP estimation), §4.5.1 (MAP for a Bernoulli with a beta prior), §4.5.3 (weight decay as a Gaussian prior), §11.3.1 (ridge regression) and §11.4.1 (lasso as MAP with a Laplace prior).' },
      { book: 'pml2', where: '§7.4.1 (limitations of MAP: no measure of uncertainty, it can be untypical of the posterior and it depends on the parameterization).' },
    ],
  },
};

export default content;
