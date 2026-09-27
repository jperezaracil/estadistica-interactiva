import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: String.raw`El teorema de Bayes invierte una probabilidad condicional: pasa de lo que se puede medir, $P(\text{datos} \mid \text{causa})$, a lo que quieres saber, $P(\text{causa} \mid \text{datos})$. Para hacerlo necesita un ingrediente que a menudo se olvida: la probabilidad previa de cada causa.`,
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Un sistema de visión inspecciona piezas en una fábrica. Detecta el 95 % de las defectuosas y da falsa alarma solo en el 5 % de las buenas. Suena fiable, pero únicamente el 1 % de las piezas son defectuosas. Piensa en 10 000 piezas: 100 son defectuosas y el sistema marca 95; de las 9900 buenas marca 495. De las 590 alarmas, solo 95 son defectos reales: un **16 %**. Casi todas las alarmas son falsas porque hay muchísimas más piezas buenas que malas.' },
          { key: 'Una prueba muy precisa puede dar sobre todo falsas alarmas si lo que busca es raro. El resultado combina lo que dice la prueba con la probabilidad previa, y la previa pesa tanto como la prueba.' },
        ],
      },
      {
        id: 'formula',
        title: 'La fórmula',
        blocks: [
          { p: String.raw`Para una hipótesis $H$ y unos datos $D$ con $P(D) > 0$:` },
          { math: String.raw`P(H \mid D) = \frac{P(D \mid H)\,P(H)}{P(D)}, \qquad P(D) = \sum_{j} P(D \mid H_j)\,P(H_j)` },
          { p: String.raw`$P(H)$ es el **prior** (lo que crees antes de ver los datos), $P(D \mid H)$ la **verosimilitud**, $P(H \mid D)$ el **posterior** y $P(D)$ la **evidencia**, que se calcula con la [[conditional-independence|probabilidad total]] sobre hipótesis $H_j$ que formen una partición. La fórmula sale de escribir $P(H \cap D)$ de las dos formas que permite la regla del producto.` },
          { p: String.raw`Con dos hipótesis, $H$ y su contraria $\bar H$, suele ser más cómodo trabajar con la razón de probabilidades (en inglés, odds): la razón posterior es la razón de verosimilitudes por la razón previa.` },
          { math: String.raw`\frac{P(H \mid D)}{P(\bar H \mid D)} = \frac{P(D \mid H)}{P(D \mid \bar H)} \cdot \frac{P(H)}{P(\bar H)}` },
          { p: String.raw`En el ejemplo, la razón de verosimilitudes es $0{,}95/0{,}05 = 19$ y la previa, $1/99$. La razón posterior es $19/99$, es decir, $P(\text{defecto} \mid \text{alarma}) = 19/118 \approx 0{,}161$.` },
        ],
      },
      {
        id: 'prior',
        title: 'Cuánto pesa el prior',
        blocks: [
          { p: 'Con la misma prueba (95 % de detección y 5 % de falsas alarmas), el posterior cambia mucho según lo frecuente que sea el defecto:' },
          {
            table: {
              head: [String.raw`Prevalencia $P(H)$`, String.raw`$P(H \mid \text{alarma})$`],
              rows: [
                ['0,1 %', '0,019'],
                ['1 %', '0,161'],
                ['10 %', '0,679'],
                ['50 %', '0,95'],
              ],
              numeric: [1],
            },
          },
          { p: String.raw`**Actualización secuencial.** El posterior de un paso es el prior del siguiente. Si una segunda inspección igual de precisa, cuyo error es independiente del de la primera dado el estado real de la pieza, también da alarma, la razón se vuelve a multiplicar por 19: $P(\text{defecto} \mid \text{dos alarmas}) = 361/460 \approx 0{,}785$.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Si la prueba acierta el 95 % de las veces, una alarma es correcta con probabilidad 0,95.»', fix: String.raw`Confunde $P(\text{alarma} \mid \text{defecto})$ con $P(\text{defecto} \mid \text{alarma})$. Con una prevalencia del 1 %, la segunda vale 0,161. Es la **falacia de la tasa base**.` },
      { claim: '«El prior es subjetivo, así que es mejor ignorarlo.»', fix: String.raw`Ignorarlo equivale a suponer que todas las hipótesis son igual de probables de antemano, que también es un prior. En el ejemplo daría $P(\text{defecto} \mid \text{alarma}) = 0{,}95$ en lugar de 0,161.` },
      { claim: '«El teorema de Bayes es cosa de la estadística bayesiana.»', fix: 'Es una consecuencia directa de la definición de probabilidad condicional y vale en cualquier interpretación. Lo propio de la estadística bayesiana es aplicarlo también a parámetros desconocidos: ver [[prior-posterior]].' },
      { claim: '«Cada nueva alarma multiplica la evidencia por lo mismo.»', fix: 'Solo si los resultados son condicionalmente independientes dado el estado real. Si las dos inspecciones fallan con el mismo tipo de pieza, por ejemplo porque usan el mismo modelo, la segunda alarma aporta mucho menos que otro factor 19.' },
    ],
    dl: [
      { title: 'Cambio de prior entre entrenamiento y uso.', text: String.raw`Un clasificador entrenado con clases equilibradas estima $p_{\text{ent}}(y \mid x)$. Si en producción las clases tienen otras frecuencias y $p(x \mid y)$ no cambia, Bayes da la corrección: $p_{\text{nuevo}}(y \mid x) \propto p_{\text{ent}}(y \mid x)\,p_{\text{nuevo}}(y)/p_{\text{ent}}(y)$, renormalizando sobre las clases.` },
      { title: 'La precisión depende de la prevalencia.', text: String.raw`La precisión de un detector, la fracción de alarmas que son reales, es justo $P(H \mid \text{alarma})$. Con la misma sensibilidad y especificidad, cae cuando la clase se vuelve más rara, como en la tabla. Por eso hay que dar la precisión junto con la prevalencia del conjunto de test: ver [[classification-metrics]].` },
      { title: 'De sucesos a parámetros.', text: String.raw`Aplicado a los parámetros de una red, Bayes da $p(\theta \mid \mathcal{D}) \propto p(\mathcal{D} \mid \theta)\,p(\theta)$. De ahí salen la [[map-estimation|estimación MAP]] (la penalización L2, que con SGD es el weight decay, equivale a un prior gaussiano) y las redes neuronales bayesianas.` },
    ],
    quiz: [
      {
        prompt: 'El 10 % del correo que recibes es spam. Tu filtro marca el 90 % del spam y, por error, el 10 % del correo legítimo. Si un correo está marcado, ¿qué probabilidad hay de que sea spam?',
        options: [{ text: '0,9' }, { text: '0,5', correct: true }, { text: '0,1' }],
        explain: String.raw`$P(\text{spam} \mid \text{marcado}) = \frac{0{,}9 \cdot 0{,}1}{0{,}9 \cdot 0{,}1 + 0{,}1 \cdot 0{,}9} = 0{,}5$: el filtro marca tantos correos legítimos como spam, porque hay nueve veces más correos legítimos.`,
      },
      {
        prompt: 'Mantienes la misma prueba, pero lo que busca se vuelve diez veces más raro. ¿Qué le pasa a la probabilidad de que un positivo sea real?',
        options: [
          { text: 'No cambia: la prueba es igual de buena.' },
          { text: 'Disminuye, porque el prior es menor.', correct: true },
          { text: 'Aumenta, porque cada positivo es más informativo.' },
        ],
        explain: String.raw`La verosimilitud es la misma, pero el prior baja, y con él el posterior. En la tabla, pasar de una prevalencia del 1 % al 0,1 % hace caer $P(H \mid \text{alarma})$ de 0,161 a 0,019.`,
      },
      {
        prompt: String.raw`Antes de ver un dato, $H$ y su contraria te parecían igual de probables. El dato es 4 veces más probable si $H$ es cierta que si no lo es. ¿Cuánto vale ahora $P(H \mid D)$?`,
        options: [{ text: '0,8', correct: true }, { text: '0,25' }, { text: '0,4' }],
        explain: String.raw`La razón posterior es la razón de verosimilitudes por la previa, $4 \cdot 1 = 4$, así que $P(H \mid D) = 4/(4 + 1) = 0{,}8$.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§2.4.5 (ley de la probabilidad total) y §2.4.6 (teorema de Bayes).' },
      { book: 'pml1', where: '§2.3 (prior, verosimilitud, posterior y evidencia), con los ejemplos de §2.3.1 (una prueba diagnóstica) y §2.3.2 (el problema de Monty Hall).' },
      { book: 'pml2', where: '§2.1.6 (regla de Bayes para variables discretas y continuas).' },
    ],
    extra: [
      { text: 'Bayes, T. (1763). An essay towards solving a problem in the doctrine of chances. Philosophical Transactions of the Royal Society of London, 53, 370–418. El ensayo original, publicado tras su muerte por Richard Price.', url: 'https://doi.org/10.1098/rstl.1763.0053' },
      { text: 'Saerens, M., Latinne, P. y Decaestecker, C. (2002). Adjusting the outputs of a classifier to new a priori probabilities: a simple procedure. Neural Computation, 14(1), 21–41. Cómo corregir las salidas de un clasificador cuando cambian las frecuencias de las clases, incluso si no se conocen.', url: 'https://doi.org/10.1162/089976602753284446' },
    ],
  },
  en: {
    lede: String.raw`Bayes’ rule inverts a conditional probability: it goes from what you can measure, $P(\text{data} \mid \text{cause})$, to what you want to know, $P(\text{cause} \mid \text{data})$. To do so it needs an ingredient that is often forgotten: the prior probability of each cause.`,
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'A vision system inspects parts in a factory. It detects 95% of the defective ones and raises a false alarm on only 5% of the good ones. It sounds reliable, but only 1% of the parts are defective. Think of 10,000 parts: 100 are defective and the system flags 95; of the 9900 good ones it flags 495. Of the 590 alarms, only 95 are real defects: **16%**. Almost all alarms are false because there are far more good parts than bad ones.' },
          { key: 'A very accurate test can produce mostly false alarms if what it looks for is rare. The result combines what the test says with the prior probability, and the prior weighs as much as the test.' },
        ],
      },
      {
        id: 'formula',
        title: 'The formula',
        blocks: [
          { p: String.raw`For a hypothesis $H$ and data $D$ with $P(D) > 0$:` },
          { math: String.raw`P(H \mid D) = \frac{P(D \mid H)\,P(H)}{P(D)}, \qquad P(D) = \sum_{j} P(D \mid H_j)\,P(H_j)` },
          { p: String.raw`$P(H)$ is the **prior** (what you believe before seeing the data), $P(D \mid H)$ the **likelihood**, $P(H \mid D)$ the **posterior** and $P(D)$ the **evidence**, computed by [[conditional-independence|total probability]] over hypotheses $H_j$ that form a partition. The formula comes from writing $P(H \cap D)$ in the two ways the product rule allows.` },
          { p: String.raw`With two hypotheses, $H$ and its complement $\bar H$, it is often easier to work with odds: the posterior odds are the likelihood ratio times the prior odds.` },
          { math: String.raw`\frac{P(H \mid D)}{P(\bar H \mid D)} = \frac{P(D \mid H)}{P(D \mid \bar H)} \cdot \frac{P(H)}{P(\bar H)}` },
          { p: String.raw`In the example, the likelihood ratio is $0.95/0.05 = 19$ and the prior odds are $1/99$. The posterior odds are $19/99$, that is, $P(\text{defect} \mid \text{alarm}) = 19/118 \approx 0.161$.` },
        ],
      },
      {
        id: 'prior',
        title: 'How much the prior matters',
        blocks: [
          { p: 'With the same test (95% detection and 5% false alarms), the posterior changes a lot depending on how common the defect is:' },
          {
            table: {
              head: [String.raw`Prevalence $P(H)$`, String.raw`$P(H \mid \text{alarm})$`],
              rows: [
                ['0.1%', '0.019'],
                ['1%', '0.161'],
                ['10%', '0.679'],
                ['50%', '0.95'],
              ],
              numeric: [1],
            },
          },
          { p: String.raw`**Sequential updating.** Today’s posterior is tomorrow’s prior. If a second, equally accurate inspection, whose error is independent of the first one given the true state of the part, also raises an alarm, the odds are multiplied by 19 again: $P(\text{defect} \mid \text{two alarms}) = 361/460 \approx 0.785$.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“If the test is right 95% of the time, an alarm is correct with probability 0.95.”', fix: String.raw`It confuses $P(\text{alarm} \mid \text{defect})$ with $P(\text{defect} \mid \text{alarm})$. With a prevalence of 1%, the latter is 0.161. This is the **base rate fallacy**.` },
      { claim: '“The prior is subjective, so it is better to ignore it.”', fix: String.raw`Ignoring it amounts to assuming that all hypotheses are equally likely beforehand, which is also a prior. In the example it would give $P(\text{defect} \mid \text{alarm}) = 0.95$ instead of 0.161.` },
      { claim: '“Bayes’ rule belongs to Bayesian statistics.”', fix: 'It follows directly from the definition of conditional probability and holds under any interpretation. What is specific to Bayesian statistics is applying it to unknown parameters as well: see [[prior-posterior]].' },
      { claim: '“Each new alarm multiplies the evidence by the same factor.”', fix: 'Only if the results are conditionally independent given the true state. If both inspections fail on the same kind of part, for instance because they use the same model, the second alarm adds much less than another factor of 19.' },
    ],
    dl: [
      { title: 'Prior shift between training and deployment.', text: String.raw`A classifier trained on balanced classes estimates $p_{\text{train}}(y \mid x)$. If the class frequencies are different in production and $p(x \mid y)$ does not change, Bayes gives the correction: $p_{\text{new}}(y \mid x) \propto p_{\text{train}}(y \mid x)\,p_{\text{new}}(y)/p_{\text{train}}(y)$, renormalized over the classes.` },
      { title: 'Precision depends on prevalence.', text: String.raw`The precision of a detector, the fraction of alarms that are real, is exactly $P(H \mid \text{alarm})$. With the same sensitivity and specificity, it drops when the class becomes rarer, as in the table. That is why precision must be reported together with the prevalence in the test set: see [[classification-metrics]].` },
      { title: 'From events to parameters.', text: String.raw`Applied to the parameters of a network, Bayes gives $p(\theta \mid \mathcal{D}) \propto p(\mathcal{D} \mid \theta)\,p(\theta)$. This leads to [[map-estimation|MAP estimation]] (an L2 penalty, which with SGD is weight decay, is equivalent to a Gaussian prior) and to Bayesian neural networks.` },
    ],
    quiz: [
      {
        prompt: 'Of the email you receive, 10% is spam. Your filter flags 90% of the spam and, by mistake, 10% of the legitimate email. If an email is flagged, what is the probability that it is spam?',
        options: [{ text: '0.9' }, { text: '0.5', correct: true }, { text: '0.1' }],
        explain: String.raw`$P(\text{spam} \mid \text{flagged}) = \frac{0.9 \cdot 0.1}{0.9 \cdot 0.1 + 0.1 \cdot 0.9} = 0.5$: the filter flags as many legitimate emails as spam ones, because there are nine times more legitimate emails.`,
      },
      {
        prompt: 'You keep the same test, but what it looks for becomes ten times rarer. What happens to the probability that a positive is real?',
        options: [
          { text: 'Nothing: the test is just as good.' },
          { text: 'It decreases, because the prior is smaller.', correct: true },
          { text: 'It increases, because each positive is more informative.' },
        ],
        explain: String.raw`The likelihood is the same, but the prior drops, and the posterior with it. In the table, going from a prevalence of 1% to 0.1% makes $P(H \mid \text{alarm})$ fall from 0.161 to 0.019.`,
      },
      {
        prompt: String.raw`Before seeing a datum, $H$ and its complement seemed equally likely to you. The datum is 4 times more probable if $H$ is true than if it is not. What is $P(H \mid D)$ now?`,
        options: [{ text: '0.8', correct: true }, { text: '0.25' }, { text: '0.4' }],
        explain: String.raw`The posterior odds are the likelihood ratio times the prior odds, $4 \cdot 1 = 4$, so $P(H \mid D) = 4/(4 + 1) = 0.8$.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§2.4.5 (law of total probability) and §2.4.6 (Bayes’ theorem).' },
      { book: 'pml1', where: '§2.3 (prior, likelihood, posterior and evidence), with the examples in §2.3.1 (a diagnostic test) and §2.3.2 (the Monty Hall problem).' },
      { book: 'pml2', where: '§2.1.6 (Bayes’ rule for discrete and continuous variables).' },
    ],
    extra: [
      { text: 'Bayes, T. (1763). An essay towards solving a problem in the doctrine of chances. Philosophical Transactions of the Royal Society of London, 53, 370–418. The original essay, published after his death by Richard Price.', url: 'https://doi.org/10.1098/rstl.1763.0053' },
      { text: 'Saerens, M., Latinne, P. and Decaestecker, C. (2002). Adjusting the outputs of a classifier to new a priori probabilities: a simple procedure. Neural Computation, 14(1), 21–41. How to correct the outputs of a classifier when the class frequencies change, even when they are unknown.', url: 'https://doi.org/10.1162/089976602753284446' },
    ],
  },
};

export default content;
