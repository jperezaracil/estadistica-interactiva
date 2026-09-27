import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Antes de calcular probabilidades hay que fijar qué puede ocurrir (el espacio muestral) y sobre qué se pregunta (los sucesos). Tres axiomas bastan para que una asignación de probabilidades sea coherente, y de ellos se deducen todas las demás reglas.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Eliges al azar una imagen de un conjunto de 1000: 300 contienen un perro, 200 un gato y 50 contienen los dos. El **espacio muestral** $\Omega$ son las 1000 imágenes, y un **suceso** es cualquier subconjunto de ellas sobre el que te puedas preguntar, como «aparece un perro». Si todas las imágenes son igual de probables, la probabilidad de un suceso es la fracción de imágenes que lo cumplen: $P(\text{perro}) = 0{,}3$. ¿Y la de que aparezca un perro o un gato? Sumar $0{,}3 + 0{,}2$ contaría dos veces las 50 imágenes con ambos; la respuesta correcta es $0{,}45$.` },
          { key: 'Una probabilidad reparte una masa total de 1 entre los resultados posibles, y la probabilidad de un suceso es la masa que contiene. Casi todas las reglas de la probabilidad consisten en no contar dos veces la misma masa.' },
        ],
      },
      {
        id: 'axiomas',
        title: 'Los axiomas',
        blocks: [
          { p: String.raw`Una probabilidad $P$ asigna a cada suceso $A \subseteq \Omega$ un número que cumple los tres **axiomas de Kolmogórov**:` },
          { math: String.raw`\begin{gathered} P(A) \ge 0, \qquad P(\Omega) = 1, \\ P\Big(\bigcup_{i} A_i\Big) = \sum_{i} P(A_i) \ \text{ si los } A_i \text{ son disjuntos dos a dos} \end{gathered}` },
          { p: String.raw`El tercero, la **aditividad**, vale para una colección finita o numerable de sucesos incompatibles, es decir, que no pueden ocurrir a la vez: $A_i \cap A_j = \varnothing$. Cuando $\Omega$ es continuo, $P$ no se define sobre todos los subconjuntos, sino sobre una familia cerrada bajo complementos y uniones numerables (una $\sigma$-álgebra); cualquier suceso que vayas a usar en la práctica pertenece a ella.` },
        ],
      },
      {
        id: 'consecuencias',
        title: 'Reglas que se deducen',
        blocks: [
          {
            list: [
              String.raw`**Complemento:** $P(A^c) = 1 - P(A)$. En particular, $P(\varnothing) = 0$.`,
              String.raw`**Monotonía:** si $A \subseteq B$, entonces $P(A) \le P(B)$; por eso ninguna probabilidad supera 1.`,
              String.raw`**Regla de la suma:** $P(A \cup B) = P(A) + P(B) - P(A \cap B)$. En el ejemplo, $0{,}3 + 0{,}2 - 0{,}05 = 0{,}45$.`,
              String.raw`**Leyes de De Morgan:** $(A \cup B)^c = A^c \cap B^c$ y $(A \cap B)^c = A^c \cup B^c$. La probabilidad de que no haya ni perro ni gato es $1 - 0{,}45 = 0{,}55$.`,
              String.raw`**Cota de la unión:** $P(A_1 \cup \dots \cup A_k) \le P(A_1) + \dots + P(A_k)$, sean o no incompatibles.`,
            ],
          },
        ],
      },
      {
        id: 'interpretaciones',
        title: '¿Qué significa una probabilidad?',
        blocks: [
          { p: String.raw`Los axiomas dicen cómo se combinan las probabilidades, no qué son. En la **interpretación frecuentista**, $P(A)$ es la frecuencia relativa con la que ocurriría $A$ si repitieras el experimento muchas veces; la [[lln-clt|ley de los grandes números]] explica por qué esa frecuencia se estabiliza. En la **interpretación bayesiana**, $P(A)$ mide tu grado de creencia en $A$ con la información que tienes, y tiene sentido aunque el experimento no se pueda repetir, como la probabilidad de que un parámetro esté en cierto intervalo.` },
          { p: 'Las dos cumplen los mismos axiomas, así que las reglas de cálculo son idénticas. Lo que cambia es a qué se le puede asignar una probabilidad: ver [[prior-posterior]].' },
        ],
      },
    ],
    pitfalls: [
      { claim: '«La probabilidad de A o B es P(A) + P(B).»', fix: String.raw`Solo si $P(A \cap B) = 0$; por ejemplo, si $A$ y $B$ son incompatibles. En general hay que restar $P(A \cap B)$: con los perros y los gatos, la suma da 0,5 en vez de 0,45, y con sucesos muy solapados puede incluso superar 1.` },
      { claim: '«Si dos sucesos son incompatibles, son independientes.»', fix: 'Es casi lo contrario: si A y B no pueden ocurrir a la vez y los dos tienen probabilidad positiva, saber que ocurrió A te asegura que B no ocurrió. La independencia se trata en [[conditional-independence]].' },
      { claim: '«Las probabilidades de todos los sucesos tienen que sumar 1.»', fix: String.raw`Suman 1 las de los sucesos de una **partición**: incompatibles entre sí y que cubren todo $\Omega$. En el ejemplo, $P(\text{perro}) + P(\text{gato}) + P(\text{ninguno}) = 1{,}05$, porque perro y gato se solapan; una partición correcta es «solo perro» (0,25), «solo gato» (0,15), «los dos» (0,05) y «ninguno» (0,55).` },
      { claim: '«Probabilidad cero significa imposible.»', fix: String.raw`No en espacios continuos. Si $X$ es uniforme entre 0 y 1, cada valor concreto tiene probabilidad 0 y, aun así, alguno sale. $P(A) = 0$ no implica $A = \varnothing$.` },
    ],
    dl: [
      { title: 'Softmax o sigmoides.', text: 'Un clasificador con softmax reparte la probabilidad entre clases **incompatibles**: sus salidas son no negativas y suman 1, como exige la aditividad sobre una partición. Si una imagen puede contener un perro y un gato a la vez (clasificación multietiqueta), las etiquetas no son incompatibles y se usa una sigmoide por etiqueta, cuyas salidas no tienen por qué sumar 1.' },
      { title: 'La cota de la unión al comparar modelos.', text: String.raw`Si comparas 10 configuraciones con un contraste a nivel 0,05 cada una y ninguna es mejor de verdad, la probabilidad de obtener al menos un falso positivo es como mucho $10 \cdot 0{,}05 = 0{,}5$ (si los contrastes fueran independientes, sería $1 - 0{,}95^{10} \approx 0{,}401$). Es la idea detrás de la corrección de Bonferroni: ver [[multiple-testing]].` },
    ],
    quiz: [
      {
        prompt: String.raw`Si $P(A) = 0{,}5$, $P(B) = 0{,}4$ y $P(A \cap B) = 0{,}1$, ¿cuánto vale $P(A \cup B)$?`,
        options: [{ text: '0,9' }, { text: '0,8', correct: true }, { text: '0,7' }],
        explain: String.raw`$P(A \cup B) = 0{,}5 + 0{,}4 - 0{,}1 = 0{,}8$. Con 0,9 cuentas dos veces la intersección; 0,7 saldría si supusieras independencia, $P(A \cap B) = 0{,}2$, que no es el caso.`,
      },
      {
        prompt: String.raw`Con $\Omega = \{a, b, c\}$, ¿cuál de estas asignaciones viola los axiomas?`,
        options: [
          { text: String.raw`$P(\{a\}) = P(\{b\}) = P(\{c\}) = 1/3$.` },
          { text: String.raw`$P(\{a\}) = 0$ y $P(\{b, c\}) = 1$.` },
          { text: String.raw`$P(\{a\}) = 0{,}6$ y $P(\{a, b\}) = 0{,}5$.`, correct: true },
        ],
        explain: String.raw`Como $\{a\} \subseteq \{a, b\}$, la monotonía exige $P(\{a, b\}) \ge P(\{a\})$. Las otras dos son válidas: un resultado puede tener probabilidad 0.`,
      },
      {
        prompt: String.raw`Si $P(A) = 0{,}7$ y $P(B) = 0{,}6$, ¿qué puedes asegurar sobre $P(A \cap B)$ sin más información?`,
        options: [{ text: 'Que vale 0,42.' }, { text: 'Que vale al menos 0,3.', correct: true }, { text: 'Que puede valer 0.' }],
        explain: String.raw`Como $P(A \cup B) \le 1$, se tiene $P(A \cap B) = P(A) + P(B) - P(A \cup B) \ge 0{,}7 + 0{,}6 - 1 = 0{,}3$. El valor 0,42 solo sería cierto si fueran independientes, y 0 es imposible: dos sucesos cuyas probabilidades suman más de 1 tienen que solaparse.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§2.2 (sucesos, espacio muestral y axiomas), §2.3 (interpretaciones frecuentista y bayesiana) y §2.4.1–2.4.2 (complementos, uniones y leyes de De Morgan).' },
      { book: 'pml1', where: '§2.1.1 (qué significa una probabilidad: frecuencias o incertidumbre) y §2.1.3.1–2.1.3.3 (probabilidad de un suceso, de una conjunción y de una unión).' },
      { book: 'pml2', where: '§2.1.1 y §2.1.4 (espacio de probabilidad y axiomas de Kolmogórov, con las reglas del complemento y de la suma).' },
    ],
  },
  en: {
    lede: 'Before computing probabilities you have to fix what can happen (the sample space) and what you ask about (the events). Three axioms are enough to make an assignment of probabilities coherent, and every other rule follows from them.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`You pick an image at random from a set of 1000: 300 contain a dog, 200 a cat and 50 contain both. The **sample space** $\Omega$ is the 1000 images, and an **event** is any subset of them you can ask about, such as “there is a dog”. If every image is equally likely, the probability of an event is the fraction of images that satisfy it: $P(\text{dog}) = 0.3$. What about a dog or a cat? Adding $0.3 + 0.2$ would count the 50 images with both twice; the correct answer is $0.45$.` },
          { key: 'A probability spreads a total mass of 1 over the possible outcomes, and the probability of an event is the mass it contains. Almost every rule of probability boils down to not counting the same mass twice.' },
        ],
      },
      {
        id: 'axioms',
        title: 'The axioms',
        blocks: [
          { p: String.raw`A probability $P$ assigns to each event $A \subseteq \Omega$ a number that satisfies the three **Kolmogorov axioms**:` },
          { math: String.raw`\begin{gathered} P(A) \ge 0, \qquad P(\Omega) = 1, \\ P\Big(\bigcup_{i} A_i\Big) = \sum_{i} P(A_i) \ \text{ if the } A_i \text{ are pairwise disjoint} \end{gathered}` },
          { p: String.raw`The third one, **additivity**, holds for a finite or countable collection of mutually exclusive events, that is, events that cannot happen together: $A_i \cap A_j = \varnothing$. When $\Omega$ is continuous, $P$ is not defined on every subset but on a family closed under complements and countable unions (a $\sigma$-algebra); any event you will use in practice belongs to it.` },
        ],
      },
      {
        id: 'consequences',
        title: 'Rules that follow',
        blocks: [
          {
            list: [
              String.raw`**Complement:** $P(A^c) = 1 - P(A)$. In particular, $P(\varnothing) = 0$.`,
              String.raw`**Monotonicity:** if $A \subseteq B$, then $P(A) \le P(B)$; that is why no probability exceeds 1.`,
              String.raw`**Addition rule:** $P(A \cup B) = P(A) + P(B) - P(A \cap B)$. In the example, $0.3 + 0.2 - 0.05 = 0.45$.`,
              String.raw`**De Morgan’s laws:** $(A \cup B)^c = A^c \cap B^c$ and $(A \cap B)^c = A^c \cup B^c$. The probability that there is neither a dog nor a cat is $1 - 0.45 = 0.55$.`,
              String.raw`**Union bound:** $P(A_1 \cup \dots \cup A_k) \le P(A_1) + \dots + P(A_k)$, whether or not they are mutually exclusive.`,
            ],
          },
        ],
      },
      {
        id: 'interpretations',
        title: 'What does a probability mean?',
        blocks: [
          { p: String.raw`The axioms say how probabilities combine, not what they are. In the **frequentist interpretation**, $P(A)$ is the relative frequency with which $A$ would occur if you repeated the experiment many times; the [[lln-clt|law of large numbers]] explains why that frequency settles down. In the **Bayesian interpretation**, $P(A)$ measures your degree of belief in $A$ given the information you have, and it makes sense even when the experiment cannot be repeated, such as the probability that a parameter lies in a certain interval.` },
          { p: 'Both satisfy the same axioms, so the rules of calculation are identical. What changes is what you are allowed to assign a probability to: see [[prior-posterior]].' },
        ],
      },
    ],
    pitfalls: [
      { claim: '“The probability of A or B is P(A) + P(B).”', fix: String.raw`Only if $P(A \cap B) = 0$; for example, if $A$ and $B$ are mutually exclusive. In general you must subtract $P(A \cap B)$: with the dogs and cats the sum gives 0.5 instead of 0.45, and with heavily overlapping events it can even exceed 1.` },
      { claim: '“If two events are mutually exclusive, they are independent.”', fix: 'It is almost the opposite: if A and B cannot happen together and both have positive probability, knowing that A happened tells you for sure that B did not. Independence is covered in [[conditional-independence]].' },
      { claim: '“The probabilities of all events must add up to 1.”', fix: String.raw`The events of a **partition** add up to 1: mutually exclusive and covering all of $\Omega$. In the example, $P(\text{dog}) + P(\text{cat}) + P(\text{neither}) = 1.05$, because dog and cat overlap; a correct partition is “dog only” (0.25), “cat only” (0.15), “both” (0.05) and “neither” (0.55).` },
      { claim: '“Probability zero means impossible.”', fix: String.raw`Not in continuous spaces. If $X$ is uniform between 0 and 1, every single value has probability 0, and yet one of them comes out. $P(A) = 0$ does not imply $A = \varnothing$.` },
    ],
    dl: [
      { title: 'Softmax or sigmoids.', text: 'A softmax classifier spreads probability over **mutually exclusive** classes: its outputs are non-negative and add up to 1, as additivity over a partition requires. If an image can contain a dog and a cat at the same time (multi-label classification), the labels are not mutually exclusive and you use one sigmoid per label, whose outputs need not add up to 1.' },
      { title: 'The union bound when comparing models.', text: String.raw`If you compare 10 configurations with a test at level 0.05 each and none is truly better, the probability of getting at least one false positive is at most $10 \cdot 0.05 = 0.5$ (if the tests were independent, it would be $1 - 0.95^{10} \approx 0.401$). This is the idea behind the Bonferroni correction: see [[multiple-testing]].` },
    ],
    quiz: [
      {
        prompt: String.raw`If $P(A) = 0.5$, $P(B) = 0.4$ and $P(A \cap B) = 0.1$, what is $P(A \cup B)$?`,
        options: [{ text: '0.9' }, { text: '0.8', correct: true }, { text: '0.7' }],
        explain: String.raw`$P(A \cup B) = 0.5 + 0.4 - 0.1 = 0.8$. With 0.9 you count the intersection twice; 0.7 would follow from assuming independence, $P(A \cap B) = 0.2$, which is not the case.`,
      },
      {
        prompt: String.raw`With $\Omega = \{a, b, c\}$, which of these assignments violates the axioms?`,
        options: [
          { text: String.raw`$P(\{a\}) = P(\{b\}) = P(\{c\}) = 1/3$.` },
          { text: String.raw`$P(\{a\}) = 0$ and $P(\{b, c\}) = 1$.` },
          { text: String.raw`$P(\{a\}) = 0.6$ and $P(\{a, b\}) = 0.5$.`, correct: true },
        ],
        explain: String.raw`Since $\{a\} \subseteq \{a, b\}$, monotonicity requires $P(\{a, b\}) \ge P(\{a\})$. The other two are valid: an outcome may have probability 0.`,
      },
      {
        prompt: String.raw`If $P(A) = 0.7$ and $P(B) = 0.6$, what can you guarantee about $P(A \cap B)$ without further information?`,
        options: [{ text: 'That it equals 0.42.' }, { text: 'That it is at least 0.3.', correct: true }, { text: 'That it may be 0.' }],
        explain: String.raw`Since $P(A \cup B) \le 1$, we get $P(A \cap B) = P(A) + P(B) - P(A \cup B) \ge 0.7 + 0.6 - 1 = 0.3$. The value 0.42 would only hold under independence, and 0 is impossible: two events whose probabilities add up to more than 1 must overlap.`,
      },
    ],
    further: [
      { book: 'wilks', where: '§2.2 (events, sample space and axioms), §2.3 (frequentist and Bayesian interpretations) and §2.4.1–2.4.2 (complements, unions and De Morgan’s laws).' },
      { book: 'pml1', where: '§2.1.1 (what a probability means: frequencies or uncertainty) and §2.1.3.1–2.1.3.3 (probability of an event, of a conjunction and of a union).' },
      { book: 'pml2', where: '§2.1.1 and §2.1.4 (probability space and the Kolmogorov axioms, with the complement and addition rules).' },
    ],
  },
};

export default content;
