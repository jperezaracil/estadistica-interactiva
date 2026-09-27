import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: String.raw`La divergencia $\mathrm{KL}(p \,\Vert\, q)$ mide cuánta sorpresa extra, en promedio, te cuesta usar $q$ para describir datos que vienen de $p$. Nunca es negativa, vale 0 solo si $p = q$ y no es simétrica.`,
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Una moneda sale cara el 90 % de las veces, $p = [0{,}9;\ 0{,}1]$, pero tu modelo la cree equilibrada, $q = [0{,}5;\ 0{,}5]$. Tu sorpresa media, la [[cross-entropy|entropía cruzada]], es de 1 bit; la de alguien que conoce $p$ es su [[entropy|entropía]], 0,469 bits. La diferencia, 0,531 bits, es $\mathrm{KL}(p \,\Vert\, q)$: lo que pagas por usar el modelo equivocado. Al revés, si la moneda estuviera equilibrada y creyeras que sale cara el 90 %, pagarías 0,737 bits.` },
          { key: String.raw`$\mathrm{KL}(p \,\Vert\, q) = H(p, q) - H(p)$: el coste extra de usar $q$ en lugar de $p$. No es una distancia, porque no es simétrica.` },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { p: String.raw`Para dos distribuciones $p$ y $q$ sobre los mismos valores:` },
          { math: String.raw`\mathrm{KL}(p \,\Vert\, q) = \sum_x p(x)\,\log\frac{p(x)}{q(x)} \qquad \Big(\text{caso continuo: } \int p(x)\log\frac{p(x)}{q(x)}\,dx\Big)` },
          {
            list: [
              String.raw`$\mathrm{KL}(p \,\Vert\, q) \ge 0$, con igualdad solo si $p = q$ (desigualdad de Gibbs).`,
              'No es simétrica ni cumple la desigualdad triangular, así que no es una distancia.',
              String.raw`Es infinita si $q(x) = 0$ en algún $x$ con $p(x) > 0$.`,
              String.raw`A diferencia de la entropía diferencial, no cambia si transformas $x$ con una función invertible, y conserva su sentido con variables continuas.`,
            ],
          },
          { p: 'Entre dos normales tiene fórmula cerrada:' },
          { math: String.raw`\mathrm{KL}\big(\mathcal{N}(\mu_1, \sigma_1^2) \,\Vert\, \mathcal{N}(\mu_2, \sigma_2^2)\big) = \log\frac{\sigma_2}{\sigma_1} + \frac{\sigma_1^2 + (\mu_1 - \mu_2)^2}{2\sigma_2^2} - \frac12` },
          { p: String.raw`Por ejemplo, $\mathrm{KL}\big(\mathcal{N}(0;\ 1) \,\Vert\, \mathcal{N}(0;\ 2^2)\big) \approx 0{,}318$ nats, pero en el sentido contrario vale 0,807 nats.` },
        ],
      },
      {
        id: 'sentido',
        title: 'Hacia delante o inversa',
        blocks: [
          { p: String.raw`Cuando ajustas una $q$ sencilla a una $p$ complicada, el sentido de la KL cambia el resultado. Ajusta una normal a la mezcla $p = \tfrac12\mathcal{N}(-3;\ 1) + \tfrac12\mathcal{N}(3;\ 1)$, que tiene dos modos:` },
          {
            table: {
              head: ['Qué minimizas', 'Normal óptima', 'Comportamiento'],
              rows: [
                [String.raw`$\mathrm{KL}(p \,\Vert\, q)$, hacia delante`, String.raw`$\mathcal{N}(0;\ 3{,}16^2)$`, String.raw`Cubre los dos modos, pero pone el 25 % de su masa en $|x| < 1$, donde $p$ apenas tiene el 2 %.`],
                [String.raw`$\mathrm{KL}(q \,\Vert\, p)$, inversa`, String.raw`$\mathcal{N}(2{,}98;\ 1{,}02^2)$`, 'Se queda con un modo e ignora el otro (o con el simétrico, según dónde empiece la optimización).'],
              ],
            },
          },
          { p: String.raw`La KL hacia delante castiga que $q$ sea casi 0 donde $p$ tiene masa, así que $q$ lo cubre todo. La inversa castiga que $q$ ponga masa donde $p$ casi no tiene, así que $q$ se refugia en un modo. La [[mle|máxima verosimilitud]] minimiza la primera; la [[variational-inference|inferencia variacional]], la segunda.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«La KL es una distancia entre distribuciones.»', fix: 'No es simétrica: en la moneda, 0,531 bits en un sentido y 0,737 en el otro. Tampoco cumple la desigualdad triangular. Si necesitas simetría, la divergencia de Jensen-Shannon es simétrica, y su raíz cuadrada sí es una distancia.' },
      { claim: String.raw`«Da igual minimizar $\mathrm{KL}(p \,\Vert\, q)$ o $\mathrm{KL}(q \,\Vert\, p)$.»`, fix: 'Con una familia de q limitada llevan a aproximaciones distintas: la primera cubre toda la masa de p; la segunda se concentra en un modo, como muestra la tabla.' },
      { claim: '«Minimizar la KL y maximizar la verosimilitud son cosas distintas.»', fix: String.raw`Con $p$ la distribución empírica de los datos, minimizar $\mathrm{KL}(p \,\Vert\, q_\theta)$ en $\theta$ equivale a minimizar $-\frac1n\sum_i \log q_\theta(x_i)$, porque la entropía de $p$ no depende de $\theta$. Es exactamente el [[mle|EMV]].` },
      { claim: '«La KL siempre es finita.»', fix: String.raw`Si el modelo da probabilidad 0 a algo que ocurre, $\mathrm{KL}(p \,\Vert\, q) = \infty$. Por eso un modelo que se ajusta con esta KL nunca debe asignar probabilidad exactamente 0 a lo que puede pasar.` },
    ],
    dl: [
      { title: 'Entrenar es minimizar una KL.', text: String.raw`Con la entropía cruzada o cualquier log-verosimilitud negativa, entrenar minimiza $\mathrm{KL}(p_{\text{datos}} \,\Vert\, q_\theta)$, la KL hacia delante entre la distribución de los datos y el modelo. Por eso un modelo entrenado así tiende a repartir probabilidad por todos los datos, aunque sea a costa de dejar algo en zonas vacías.` },
      { title: 'La KL en los VAE y en la inferencia variacional.', text: String.raw`La pérdida de un [[vae|VAE]] incluye $\mathrm{KL}(q(z \mid x) \,\Vert\, \mathcal{N}(\mathbf{0}, I))$, que tiene fórmula cerrada, y la [[variational-inference|inferencia variacional]] minimiza la KL inversa respecto al posterior.` },
      { title: 'Mantener dos modelos cerca.', text: 'En destilación, el estudiante imita las probabilidades suavizadas del profesor minimizando una KL (Hinton et al., 2015). En el ajuste con RLHF se penaliza la KL entre el modelo ajustado y el de referencia para que no se aleje demasiado de él.' },
    ],
    quiz: [
      {
        prompt: String.raw`¿Cuánto vale $\mathrm{KL}(p \,\Vert\, p)$?`,
        options: [{ text: '0', correct: true }, { text: '1' }, { text: String.raw`Depende de la entropía de $p$.` }],
        explain: String.raw`El cociente $p(x)/p(x)$ vale 1 y su logaritmo, 0. La KL solo es 0 cuando las dos distribuciones coinciden.`,
      },
      {
        prompt: String.raw`La inferencia variacional aproxima el posterior $p$ con $q$ minimizando:`,
        options: [
          { text: String.raw`$\mathrm{KL}(p \,\Vert\, q)$` },
          { text: String.raw`$\mathrm{KL}(q \,\Vert\, p)$`, correct: true },
          { text: 'La suma de las dos KL.' },
        ],
        explain: String.raw`Minimiza la KL inversa, $\mathrm{KL}(q \,\Vert\, p)$, sobre todo porque basta con la conjunta sin normalizar $p(x, z)$: la evidencia $p(x)$, que es intratable, solo aporta una constante. Además, las esperanzas son respecto a $q$, que sí se puede muestrear. Con esta KL, $q$ tiende a concentrarse en un modo.`,
      },
      {
        prompt: String.raw`Tu modelo da probabilidad 0 a un resultado que en realidad ocurre con probabilidad 0,01. ¿Cuánto vale $\mathrm{KL}(p \,\Vert\, q)$?`,
        options: [{ text: '0,01' }, { text: 'Un valor pequeño, porque el resultado es raro.' }, { text: 'Infinito.', correct: true }],
        explain: String.raw`El término $p(x)\log\frac{p(x)}{q(x)}$ con $q(x) = 0$ y $p(x) > 0$ es infinito, por pequeño que sea $p(x)$.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§6.2.1–6.2.6 (definición, interpretación, KL entre gaussianas, no negatividad, relación con el EMV y KL hacia delante frente a inversa) y §4.2.2 (el EMV como minimización de la KL respecto a la distribución empírica).' },
      { book: 'pml2', where: '§5.1.3–5.1.6 (cómo interpretar la KL, minimizarla en cada sentido, sus propiedades y su relación con el EMV) y §5.1.8.1 (KL entre dos gaussianas).' },
    ],
    extra: [
      { text: 'Kullback, S. y Leibler, R. A. (1951). On Information and Sufficiency. The Annals of Mathematical Statistics, 22(1), 79–86.', url: 'https://doi.org/10.1214/aoms/1177729694' },
    ],
  },
  en: {
    lede: String.raw`The divergence $\mathrm{KL}(p \,\Vert\, q)$ measures how much extra surprise, on average, it costs you to use $q$ to describe data that come from $p$. It is never negative, it is 0 only if $p = q$, and it is not symmetric.`,
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`A coin lands heads 90% of the time, $p = [0.9,\ 0.1]$, but your model believes it is fair, $q = [0.5,\ 0.5]$. Your average surprise, the [[cross-entropy|cross-entropy]], is 1 bit; that of someone who knows $p$ is its [[entropy|entropy]], 0.469 bits. The difference, 0.531 bits, is $\mathrm{KL}(p \,\Vert\, q)$: what you pay for using the wrong model. The other way round, if the coin were fair and you believed it lands heads 90% of the time, you would pay 0.737 bits.` },
          { key: String.raw`$\mathrm{KL}(p \,\Vert\, q) = H(p, q) - H(p)$: the extra cost of using $q$ instead of $p$. It is not a distance, because it is not symmetric.` },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { p: String.raw`For two distributions $p$ and $q$ over the same values:` },
          { math: String.raw`\mathrm{KL}(p \,\Vert\, q) = \sum_x p(x)\,\log\frac{p(x)}{q(x)} \qquad \Big(\text{continuous case: } \int p(x)\log\frac{p(x)}{q(x)}\,dx\Big)` },
          {
            list: [
              String.raw`$\mathrm{KL}(p \,\Vert\, q) \ge 0$, with equality only if $p = q$ (Gibbs’ inequality).`,
              'It is not symmetric and does not satisfy the triangle inequality, so it is not a distance.',
              String.raw`It is infinite if $q(x) = 0$ at some $x$ with $p(x) > 0$.`,
              String.raw`Unlike differential entropy, it does not change if you transform $x$ with an invertible function, and it keeps its meaning for continuous variables.`,
            ],
          },
          { p: 'Between two normals it has a closed form:' },
          { math: String.raw`\mathrm{KL}\big(\mathcal{N}(\mu_1, \sigma_1^2) \,\Vert\, \mathcal{N}(\mu_2, \sigma_2^2)\big) = \log\frac{\sigma_2}{\sigma_1} + \frac{\sigma_1^2 + (\mu_1 - \mu_2)^2}{2\sigma_2^2} - \frac12` },
          { p: String.raw`For example, $\mathrm{KL}\big(\mathcal{N}(0, 1) \,\Vert\, \mathcal{N}(0, 2^2)\big) \approx 0.318$ nats, but in the opposite direction it is 0.807 nats.` },
        ],
      },
      {
        id: 'direction',
        title: 'Forward or reverse',
        blocks: [
          { p: String.raw`When you fit a simple $q$ to a complicated $p$, the direction of the KL changes the result. Fit a normal to the mixture $p = \tfrac12\mathcal{N}(-3, 1) + \tfrac12\mathcal{N}(3, 1)$, which has two modes:` },
          {
            table: {
              head: ['What you minimize', 'Best normal', 'Behavior'],
              rows: [
                [String.raw`$\mathrm{KL}(p \,\Vert\, q)$, forward`, String.raw`$\mathcal{N}(0, 3.16^2)$`, String.raw`It covers both modes, but puts 25% of its mass on $|x| < 1$, where $p$ has barely 2%.`],
                [String.raw`$\mathrm{KL}(q \,\Vert\, p)$, reverse`, String.raw`$\mathcal{N}(2.98, 1.02^2)$`, 'It settles on one mode and ignores the other (or on the mirror-image mode, depending on where the optimization starts).'],
              ],
            },
          },
          { p: String.raw`The forward KL punishes $q$ for being almost 0 where $p$ has mass, so $q$ covers everything. The reverse KL punishes $q$ for putting mass where $p$ has almost none, so $q$ retreats into one mode. [[mle|Maximum likelihood]] minimizes the first; [[variational-inference|variational inference]], the second.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“The KL is a distance between distributions.”', fix: 'It is not symmetric: for the coin, 0.531 bits one way and 0.737 the other. Nor does it satisfy the triangle inequality. If you need symmetry, the Jensen–Shannon divergence is symmetric, and its square root is a true distance.' },
      { claim: String.raw`“Minimizing $\mathrm{KL}(p \,\Vert\, q)$ or $\mathrm{KL}(q \,\Vert\, p)$ makes no difference.”`, fix: 'With a limited family for q they lead to different approximations: the first covers all the mass of p; the second concentrates on one mode, as the table shows.' },
      { claim: '“Minimizing the KL and maximizing the likelihood are different things.”', fix: String.raw`With $p$ the empirical distribution of the data, minimizing $\mathrm{KL}(p \,\Vert\, q_\theta)$ over $\theta$ is equivalent to minimizing $-\frac1n\sum_i \log q_\theta(x_i)$, because the entropy of $p$ does not depend on $\theta$. It is exactly the [[mle|MLE]].` },
      { claim: '“The KL is always finite.”', fix: String.raw`If the model gives probability 0 to something that happens, $\mathrm{KL}(p \,\Vert\, q) = \infty$. That is why a model fitted with this KL must never assign probability exactly 0 to what can happen.` },
    ],
    dl: [
      { title: 'Training is minimizing a KL.', text: String.raw`With cross-entropy or any negative log-likelihood, training minimizes $\mathrm{KL}(p_{\text{data}} \,\Vert\, q_\theta)$, the forward KL between the data distribution and the model. That is why a model trained this way tends to spread probability over all the data, even at the cost of leaving some in empty regions.` },
      { title: 'The KL in VAEs and variational inference.', text: String.raw`The loss of a [[vae|VAE]] includes $\mathrm{KL}(q(z \mid x) \,\Vert\, \mathcal{N}(\mathbf{0}, I))$, which has a closed form, and [[variational-inference|variational inference]] minimizes the reverse KL to the posterior.` },
      { title: 'Keeping two models close.', text: 'In distillation, the student imitates the teacher’s softened probabilities by minimizing a KL (Hinton et al., 2015). In fine-tuning with RLHF, the KL between the fine-tuned model and the reference model is penalized so that it does not drift too far from it.' },
    ],
    quiz: [
      {
        prompt: String.raw`What is $\mathrm{KL}(p \,\Vert\, p)$?`,
        options: [{ text: '0', correct: true }, { text: '1' }, { text: String.raw`It depends on the entropy of $p$.` }],
        explain: String.raw`The ratio $p(x)/p(x)$ is 1 and its logarithm is 0. The KL is 0 only when the two distributions coincide.`,
      },
      {
        prompt: String.raw`Variational inference approximates the posterior $p$ with $q$ by minimizing:`,
        options: [
          { text: String.raw`$\mathrm{KL}(p \,\Vert\, q)$` },
          { text: String.raw`$\mathrm{KL}(q \,\Vert\, p)$`, correct: true },
          { text: 'The sum of both KLs.' },
        ],
        explain: String.raw`It minimizes the reverse KL, $\mathrm{KL}(q \,\Vert\, p)$, mainly because the unnormalized joint $p(x, z)$ is enough: the evidence $p(x)$, which is intractable, only adds a constant. Also, the expectations are under $q$, which can be sampled. With this KL, $q$ tends to concentrate on one mode.`,
      },
      {
        prompt: String.raw`Your model gives probability 0 to an outcome that actually happens with probability 0.01. What is $\mathrm{KL}(p \,\Vert\, q)$?`,
        options: [{ text: '0.01' }, { text: 'A small value, because the outcome is rare.' }, { text: 'Infinite.', correct: true }],
        explain: String.raw`The term $p(x)\log\frac{p(x)}{q(x)}$ with $q(x) = 0$ and $p(x) > 0$ is infinite, however small $p(x)$ is.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§6.2.1–6.2.6 (definition, interpretation, KL between Gaussians, non-negativity, link with the MLE and forward versus reverse KL) and §4.2.2 (the MLE as minimizing the KL to the empirical distribution).' },
      { book: 'pml2', where: '§5.1.3–5.1.6 (how to think about the KL, minimizing it in each direction, its properties and its link with the MLE) and §5.1.8.1 (KL between two Gaussians).' },
    ],
    extra: [
      { text: 'Kullback, S. and Leibler, R. A. (1951). On Information and Sufficiency. The Annals of Mathematical Statistics, 22(1), 79–86.', url: 'https://doi.org/10.1214/aoms/1177729694' },
    ],
  },
};

export default content;
