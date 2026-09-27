import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Condicionar es restringirte a los casos en que ha ocurrido algo y volver a medir proporciones dentro de ellos. Dos sucesos son independientes cuando saber uno no cambia la probabilidad del otro, y esa independencia puede aparecer o desaparecer al condicionar a un tercero.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Tu modelo se equivoca en el 7,5 % de las imágenes de validación. Pero si te quedas solo con las nocturnas, que son el 10 % del total, se equivoca en el 30 %. Condicionar a «es de noche» es exactamente eso: restringir el espacio muestral a las imágenes nocturnas y medir proporciones dentro de él. Como $0{,}3 \ne 0{,}075$, el error y la hora del día no son independientes: saber una cosa cambia lo que esperas de la otra.` },
          { key: String.raw`Condicionar a $B$ es tomar $B$ como nuevo espacio muestral: $P(A \mid B)$ es la fracción de $B$ que también cumple $A$.` },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición y probabilidad total',
        blocks: [
          { p: String.raw`Si $P(B) > 0$, la probabilidad de $A$ condicionada a $B$ es:` },
          { math: String.raw`P(A \mid B) = \frac{P(A \cap B)}{P(B)}` },
          { p: String.raw`Despejando sale la **regla del producto**, $P(A \cap B) = P(A \mid B)\,P(B)$, y de ella la **ley de la probabilidad total**: si $B_1, \dots, B_k$ forman una partición de $\Omega$ (son incompatibles y lo cubren entero), entonces` },
          { math: String.raw`P(A) = \sum_{j=1}^{k} P(A \mid B_j)\,P(B_j)` },
          { p: String.raw`En el ejemplo, si el modelo falla en el 5 % de las imágenes diurnas, $P(\text{error}) = 0{,}3 \cdot 0{,}1 + 0{,}05 \cdot 0{,}9 = 0{,}075$: la tasa global es la media de las tasas de cada grupo, ponderada por el peso de cada grupo.` },
        ],
      },
      {
        id: 'independencia',
        title: 'Independencia',
        blocks: [
          { p: String.raw`$A$ y $B$ son **independientes** si $P(A \cap B) = P(A)\,P(B)$. Si $P(B) > 0$, equivale a $P(A \mid B) = P(A)$: saber que ocurrió $B$ no cambia la probabilidad de $A$. Con más de dos sucesos, la **independencia mutua** exige que la probabilidad de la intersección factorice para cualquier subconjunto de ellos, no solo para cada par.` },
          { p: String.raw`**Independencia condicional.** $A$ y $B$ son independientes dado $C$, y se escribe $A \perp\!\!\!\perp B \mid C$, si $P(A \cap B \mid C) = P(A \mid C)\,P(B \mid C)$. Ni implica la independencia ni se deduce de ella.` },
          { p: String.raw`Ejemplo: dos anotadores etiquetan imágenes que contienen un perro la mitad de las veces; cada uno acierta el 90 % de las veces, con errores independientes dada la clase real. Conocida la clase, sus etiquetas son independientes. Sin conocerla, no lo son: los dos dicen «perro» con probabilidad 0,41, frente a $0{,}5 \cdot 0{,}5 = 0{,}25$, porque ambos siguen a la misma clase real.` },
        ],
      },
    ],
    pitfalls: [
      { claim: String.raw`«$P(A \mid B)$ y $P(B \mid A)$ son lo mismo.»`, fix: String.raw`En general son distintas. En el ejemplo, $P(\text{error} \mid \text{noche}) = 0{,}3$, pero $P(\text{noche} \mid \text{error}) = 0{,}03/0{,}075 = 0{,}4$. Para pasar de una a otra está el [[bayes-rule|teorema de Bayes]].` },
      { claim: '«Si cada par de sucesos es independiente, todos lo son a la vez.»', fix: String.raw`No. Lanza dos monedas equilibradas y sean $A$ = «la primera sale cara», $B$ = «la segunda sale cara» y $C$ = «las dos coinciden». Cada par es independiente (todas las intersecciones dobles tienen probabilidad $1/4$), pero $P(A \cap B \cap C) = 1/4$ y no $1/8$: si sabes $A$ y $B$, conoces $C$.` },
      { claim: '«Dos sucesos independientes siguen siéndolo cuando sabes algo más.»', fix: String.raw`Condicionar puede crear dependencia. Con las mismas dos monedas, sea $D$ = «al menos una cara». Entonces $P(A \mid D) = 2/3$, pero si además sabes que la segunda salió cara, $P(A \mid B \cap D) = 1/2$: saber $B$ ya «explica» $D$ y cambia lo que crees sobre $A$.` },
      { claim: '«Si dos variables están relacionadas, una influye en la otra.»', fix: 'Pueden depender solo a través de una causa común, como las etiquetas de los dos anotadores: coinciden porque ambas siguen a la clase real, y son independientes en cuanto la conoces. Ver también [[covariance-correlation]].' },
    ],
    dl: [
      { title: 'Por qué la pérdida es una suma.', text: String.raw`Al entrenar se supone que los ejemplos son independientes dados los parámetros, $p(y_1, \dots, y_n \mid x_1, \dots, x_n, \theta) = \prod_i p(y_i \mid x_i, \theta)$; el logaritmo convierte ese producto en una suma de pérdidas por ejemplo. Si hay grupos de ejemplos dependientes (fotogramas de un mismo vídeo, imágenes de un mismo paciente), repartirlos al azar entre entrenamiento y test hace que la métrica de test salga optimista: hay que separar por grupos.` },
      { title: 'Etiquetas independientes dada la entrada.', text: String.raw`Una cabeza multietiqueta con una sigmoide por etiqueta modela $p(y_1, \dots, y_K \mid x) = \prod_k p(y_k \mid x)$: supone que las etiquetas son condicionalmente independientes dada la entrada. No puede representar dependencias entre etiquetas que la entrada no explique, como que dos sean incompatibles cuando ambas son plausibles.` },
    ],
    quiz: [
      {
        prompt: 'El 30 % de las imágenes de un conjunto son de exterior. Un modelo acierta en el 95 % de las de interior y en el 80 % de las de exterior. ¿Qué exactitud global tiene?',
        options: [{ text: '0,875' }, { text: '0,905', correct: true }, { text: '0,8' }],
        explain: String.raw`Por la probabilidad total, $0{,}7 \cdot 0{,}95 + 0{,}3 \cdot 0{,}80 = 0{,}905$. La media simple, 0,875, olvida que hay más imágenes de interior que de exterior.`,
      },
      {
        prompt: 'Lanzas dos dados. A = «el primero sale par» y B = «la suma es 7». ¿Son independientes?',
        options: [
          { text: 'No: la suma depende del primer dado.' },
          { text: String.raw`Sí: $P(A \cap B) = 1/12 = P(A)\,P(B)$.`, correct: true },
          { text: 'No se puede saber sin más datos.' },
        ],
        explain: String.raw`$P(A) = 1/2$, $P(B) = 6/36 = 1/6$ y $P(A \cap B) = 3/36 = 1/12$. Aunque la suma dependa de los dos dados, salga lo que salga el primero hay exactamente un valor del segundo que da 7.`,
      },
      {
        prompt: 'Dos sensores miden la misma temperatura, que es desconocida y varía de un día a otro, con ruidos independientes. ¿Cómo son sus lecturas?',
        options: [
          { text: 'Independientes, porque los ruidos lo son.' },
          { text: 'Dependientes, pero independientes dada la temperatura real.', correct: true },
          { text: 'Dependientes, incluso si conoces la temperatura real.' },
        ],
        explain: 'Las dos lecturas comparten la temperatura real, así que una informa sobre la otra. Una vez fijada la temperatura, solo quedan los ruidos, que son independientes.',
      },
    ],
    further: [
      { book: 'wilks', where: '§2.4.3 (probabilidad condicional), §2.4.4 (independencia) y §2.4.5 (ley de la probabilidad total).' },
      { book: 'pml1', where: '§2.1.3.4–2.1.3.6 (condicional, independencia e independencia condicional de sucesos) y §2.2.4 (lo mismo para variables aleatorias, incluida la independencia mutua).' },
      { book: 'pml2', where: '§2.1.5 (probabilidad condicional, regla del producto, independencia, independencia condicional y probabilidad total).' },
    ],
    extra: [
      { text: 'Dawid, A. P. (1979). Conditional independence in statistical theory. Journal of the Royal Statistical Society: Series B, 41(1), 1–31. Artículo clásico sobre las propiedades de la independencia condicional y su papel en la teoría estadística.', url: 'https://doi.org/10.1111/j.2517-6161.1979.tb01052.x' },
    ],
  },
  en: {
    lede: 'Conditioning means restricting yourself to the cases where something has happened and measuring proportions again within them. Two events are independent when knowing one does not change the probability of the other, and that independence can appear or vanish when you condition on a third one.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`Your model gets 7.5% of the validation images wrong. But if you keep only the night-time ones, which are 10% of the total, it gets 30% of them wrong. Conditioning on “it is night” is exactly that: restricting the sample space to the night-time images and measuring proportions within it. Since $0.3 \ne 0.075$, errors and time of day are not independent: knowing one changes what you expect of the other.` },
          { key: String.raw`Conditioning on $B$ means taking $B$ as the new sample space: $P(A \mid B)$ is the fraction of $B$ that also satisfies $A$.` },
        ],
      },
      {
        id: 'definition',
        title: 'Definition and total probability',
        blocks: [
          { p: String.raw`If $P(B) > 0$, the probability of $A$ conditional on $B$ is:` },
          { math: String.raw`P(A \mid B) = \frac{P(A \cap B)}{P(B)}` },
          { p: String.raw`Rearranging gives the **product rule**, $P(A \cap B) = P(A \mid B)\,P(B)$, and from it the **law of total probability**: if $B_1, \dots, B_k$ form a partition of $\Omega$ (they are mutually exclusive and cover all of it), then` },
          { math: String.raw`P(A) = \sum_{j=1}^{k} P(A \mid B_j)\,P(B_j)` },
          { p: String.raw`In the example, if the model fails on 5% of the daytime images, $P(\text{error}) = 0.3 \cdot 0.1 + 0.05 \cdot 0.9 = 0.075$: the overall rate is the average of the per-group rates, weighted by the size of each group.` },
        ],
      },
      {
        id: 'independence',
        title: 'Independence',
        blocks: [
          { p: String.raw`$A$ and $B$ are **independent** if $P(A \cap B) = P(A)\,P(B)$. If $P(B) > 0$, this is equivalent to $P(A \mid B) = P(A)$: knowing that $B$ happened does not change the probability of $A$. With more than two events, **mutual independence** requires the probability of the intersection to factorize for every subset of them, not just for each pair.` },
          { p: String.raw`**Conditional independence.** $A$ and $B$ are independent given $C$, written $A \perp\!\!\!\perp B \mid C$, if $P(A \cap B \mid C) = P(A \mid C)\,P(B \mid C)$. It neither implies independence nor follows from it.` },
          { p: String.raw`Example: two annotators label images that contain a dog half of the time; each is right 90% of the time, with errors that are independent given the true class. Given the class, their labels are independent. Without knowing it, they are not: both say “dog” with probability 0.41, against $0.5 \cdot 0.5 = 0.25$, because both follow the same true class.` },
        ],
      },
    ],
    pitfalls: [
      { claim: String.raw`“$P(A \mid B)$ and $P(B \mid A)$ are the same thing.”`, fix: String.raw`In general they differ. In the example, $P(\text{error} \mid \text{night}) = 0.3$, but $P(\text{night} \mid \text{error}) = 0.03/0.075 = 0.4$. To go from one to the other you need [[bayes-rule|Bayes’ rule]].` },
      { claim: '“If every pair of events is independent, they are all independent together.”', fix: String.raw`No. Toss two fair coins and let $A$ = “the first is heads”, $B$ = “the second is heads” and $C$ = “both match”. Each pair is independent (every double intersection has probability $1/4$), but $P(A \cap B \cap C) = 1/4$, not $1/8$: if you know $A$ and $B$, you know $C$.` },
      { claim: '“Two independent events stay independent when you learn something else.”', fix: String.raw`Conditioning can create dependence. With the same two coins, let $D$ = “at least one heads”. Then $P(A \mid D) = 2/3$, but if you also learn that the second coin was heads, $P(A \mid B \cap D) = 1/2$: knowing $B$ already “explains” $D$ and changes what you believe about $A$.` },
      { claim: '“If two variables are related, one influences the other.”', fix: 'They may depend on each other only through a common cause, like the labels of the two annotators: they agree because both follow the true class, and they are independent as soon as you know it. See also [[covariance-correlation]].' },
    ],
    dl: [
      { title: 'Why the loss is a sum.', text: String.raw`Training assumes that the examples are independent given the parameters, $p(y_1, \dots, y_n \mid x_1, \dots, x_n, \theta) = \prod_i p(y_i \mid x_i, \theta)$; the logarithm turns that product into a sum of per-example losses. If there are groups of dependent examples (frames from the same video, images of the same patient), splitting them at random between training and test makes the test metric optimistic: you have to split by group.` },
      { title: 'Labels independent given the input.', text: String.raw`A multi-label head with one sigmoid per label models $p(y_1, \dots, y_K \mid x) = \prod_k p(y_k \mid x)$: it assumes the labels are conditionally independent given the input. It cannot represent dependencies between labels that the input does not explain, such as two labels being mutually exclusive when both are plausible.` },
    ],
    quiz: [
      {
        prompt: 'In a dataset, 30% of the images are outdoor scenes. A model is right on 95% of the indoor images and on 80% of the outdoor ones. What is its overall accuracy?',
        options: [{ text: '0.875' }, { text: '0.905', correct: true }, { text: '0.8' }],
        explain: String.raw`By total probability, $0.7 \cdot 0.95 + 0.3 \cdot 0.80 = 0.905$. The plain average, 0.875, ignores that there are more indoor than outdoor images.`,
      },
      {
        prompt: 'You roll two dice. A = “the first is even” and B = “the sum is 7”. Are they independent?',
        options: [
          { text: 'No: the sum depends on the first die.' },
          { text: String.raw`Yes: $P(A \cap B) = 1/12 = P(A)\,P(B)$.`, correct: true },
          { text: 'It cannot be decided without more data.' },
        ],
        explain: String.raw`$P(A) = 1/2$, $P(B) = 6/36 = 1/6$ and $P(A \cap B) = 3/36 = 1/12$. Even though the sum depends on both dice, whatever the first one shows there is exactly one value of the second that gives 7.`,
      },
      {
        prompt: 'Two sensors measure the same temperature, which is unknown and varies from day to day, with independent noise. What about their readings?',
        options: [
          { text: 'They are independent, because the noises are.' },
          { text: 'They are dependent, but independent given the true temperature.', correct: true },
          { text: 'They are dependent, even if you know the true temperature.' },
        ],
        explain: 'Both readings share the true temperature, so one is informative about the other. Once the temperature is fixed, only the noises remain, and they are independent.',
      },
    ],
    further: [
      { book: 'wilks', where: '§2.4.3 (conditional probability), §2.4.4 (independence) and §2.4.5 (law of total probability).' },
      { book: 'pml1', where: '§2.1.3.4–2.1.3.6 (conditional probability, independence and conditional independence of events) and §2.2.4 (the same for random variables, including mutual independence).' },
      { book: 'pml2', where: '§2.1.5 (conditional probability, product rule, independence, conditional independence and total probability).' },
    ],
    extra: [
      { text: 'Dawid, A. P. (1979). Conditional independence in statistical theory. Journal of the Royal Statistical Society: Series B, 41(1), 1–31. A classic paper on the properties of conditional independence and its role in statistical theory.', url: 'https://doi.org/10.1111/j.2517-6161.1979.tb01052.x' },
    ],
  },
};

export default content;
