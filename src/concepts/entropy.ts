import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'La entropía mide la incertidumbre media de una variable aleatoria: cuánta información, en promedio, aporta conocer su valor. De ella salen la entropía cruzada y la divergencia KL.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: 'Una moneda equilibrada es impredecible: cada lanzamiento aporta información. Una moneda que sale cara el 99 % de las veces casi nunca sorprende. La entropía cuantifica esa sorpresa media: es máxima cuando todos los resultados son igual de probables y vale cero cuando uno es seguro.' },
          { key: String.raw`La sorpresa de un resultado de probabilidad $p$ es $-\log p$. La entropía es la sorpresa esperada.` },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { p: String.raw`Para una variable discreta $X$ con probabilidades $p(x)$:` },
          { math: String.raw`H(X) = -\sum_{x} p(x)\,\log p(x)` },
          { p: String.raw`Con logaritmo en base 2 se mide en bits; con logaritmo natural, en nats (1 bit $= \ln 2 \approx 0{,}693$ nats). Por convenio, $0 \log 0 = 0$.` },
          {
            list: [
              String.raw`$H(X) \ge 0$, y vale 0 solo si un resultado tiene probabilidad 1.`,
              String.raw`Con $K$ resultados posibles, $H(X) \le \log K$, con igualdad para la distribución uniforme.`,
            ],
          },
        ],
      },
      {
        id: 'valores',
        title: 'Algunos valores',
        blocks: [
          {
            table: {
              head: ['Variable', 'Entropía (bits)'],
              rows: [
                ['Moneda equilibrada', '1'],
                [String.raw`Moneda con $P(\text{cara}) = 0{,}9$`, '0,469'],
                [String.raw`Moneda con $P(\text{cara}) = 0{,}99$`, '0,081'],
                ['Dado equilibrado de 6 caras', String.raw`$\log_2 6 \approx 2{,}585$`],
                ['Uniforme sobre 8 valores', '3'],
              ],
              numeric: [1],
            },
          },
          { p: String.raw`Para variables continuas se define la entropía diferencial, $h(X) = -\int p(x)\log p(x)\,dx$. Puede ser negativa y cambia al cambiar de unidades, así que no es un simple límite de la discreta.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Más entropía significa más información útil.»', fix: 'Significa más incertidumbre sobre el valor antes de observarlo. La información que una variable aporta sobre otra es la [[mutual-information|información mutua]].' },
      { claim: '«La entropía diferencial se comporta como la discreta.»', fix: 'Puede ser negativa y depende de las unidades. La divergencia KL y la información mutua sí conservan su sentido en el caso continuo.' },
      { claim: '«La entropía depende de los valores que toma la variable.»', fix: 'Solo depende de sus probabilidades: una variable que vale 1 o 1000 con probabilidad 0,5 cada uno tiene 1 bit, igual que una moneda.' },
    ],
    dl: [
      { title: 'Pérdida de partida.', text: String.raw`Un clasificador de $K$ clases que al empezar asigna casi la misma probabilidad a todas tiene una entropía cruzada de $\ln K$: 2,303 nats con 10 clases y 6,908 nats con 1000. Si tu pérdida inicial se aleja mucho de ese valor, revisa la inicialización o las etiquetas.` },
      { title: 'Incertidumbre de una predicción.', text: String.raw`La entropía de la salida softmax resume lo segura que está la red: $[0{,}7;\ 0{,}2;\ 0{,}1]$ tiene 1,157 bits, frente a un máximo de $\log_2 3 \approx 1{,}585$. Pero una red puede estar muy segura y equivocarse: ver [[calibration]].` },
      { title: 'Regularización con entropía.', text: 'Algunas técnicas añaden la entropía de la salida a la función objetivo, para penalizar predicciones demasiado seguras o, en aprendizaje por refuerzo, para fomentar la exploración.' },
    ],
    quiz: [
      {
        prompt: '¿Cuál es la entropía, en bits, de un dado equilibrado de 8 caras?',
        options: [{ text: '2' }, { text: '3', correct: true }, { text: '8' }],
        explain: String.raw`$\log_2 8 = 3$: la uniforme sobre $K$ valores tiene entropía $\log_2 K$.`,
      },
      {
        prompt: 'Una moneda sale cara con probabilidad 0,9. Su entropía es:',
        options: [{ text: 'Mayor que 1 bit.' }, { text: 'Unos 0,469 bits.', correct: true }, { text: '0,9 bits.' }],
        explain: String.raw`$-0{,}9\log_2 0{,}9 - 0{,}1\log_2 0{,}1 \approx 0{,}469$ bits: menos que una moneda equilibrada, porque es más predecible.`,
      },
      {
        prompt: 'Tu clasificador de 1000 clases empieza a entrenar con una entropía cruzada de 6,9. ¿Qué indica?',
        options: [
          { text: 'Que algo va mal: debería empezar cerca de 0.' },
          { text: String.raw`Que es lo esperable: con predicciones casi uniformes, la pérdida es $\ln 1000 \approx 6{,}9$.`, correct: true },
          { text: 'Que la red ya ha aprendido la mitad de las clases.' },
        ],
        explain: String.raw`Si la clase correcta recibe probabilidad $1/1000$, la pérdida es $-\ln(1/1000) = \ln 1000 \approx 6{,}908$ nats.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§6.1 (entropía discreta, entropía cruzada, conjunta y condicional, perplejidad y entropía diferencial).' },
      { book: 'pml2', where: '§5.2 (entropía).' },
    ],
  },
  en: {
    lede: 'Entropy measures the average uncertainty of a random variable: how much information, on average, learning its value provides. Cross-entropy and KL divergence are built from it.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: 'A fair coin is unpredictable: every toss brings information. A coin that lands heads 99% of the time hardly ever surprises. Entropy quantifies that average surprise: it is largest when all outcomes are equally likely and zero when one outcome is certain.' },
          { key: String.raw`The surprise of an outcome with probability $p$ is $-\log p$. Entropy is the expected surprise.` },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { p: String.raw`For a discrete variable $X$ with probabilities $p(x)$:` },
          { math: String.raw`H(X) = -\sum_{x} p(x)\,\log p(x)` },
          { p: String.raw`With base-2 logarithms it is measured in bits; with natural logarithms, in nats (1 bit $= \ln 2 \approx 0.693$ nats). By convention, $0 \log 0 = 0$.` },
          {
            list: [
              String.raw`$H(X) \ge 0$, and it is 0 only if one outcome has probability 1.`,
              String.raw`With $K$ possible outcomes, $H(X) \le \log K$, with equality for the uniform distribution.`,
            ],
          },
        ],
      },
      {
        id: 'values',
        title: 'Some values',
        blocks: [
          {
            table: {
              head: ['Variable', 'Entropy (bits)'],
              rows: [
                ['Fair coin', '1'],
                [String.raw`Coin with $P(\text{heads}) = 0.9$`, '0.469'],
                [String.raw`Coin with $P(\text{heads}) = 0.99$`, '0.081'],
                ['Fair 6-sided die', String.raw`$\log_2 6 \approx 2.585$`],
                ['Uniform over 8 values', '3'],
              ],
              numeric: [1],
            },
          },
          { p: String.raw`For continuous variables one defines the differential entropy, $h(X) = -\int p(x)\log p(x)\,dx$. It can be negative and changes when you change units, so it is not simply a limit of the discrete one.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“More entropy means more useful information.”', fix: 'It means more uncertainty about the value before observing it. The information one variable carries about another is the [[mutual-information|mutual information]].' },
      { claim: '“Differential entropy behaves like discrete entropy.”', fix: 'It can be negative and depends on the units. KL divergence and mutual information do keep their meaning in the continuous case.' },
      { claim: '“Entropy depends on the values the variable takes.”', fix: 'It only depends on their probabilities: a variable that equals 1 or 1000 with probability 0.5 each has 1 bit, just like a coin.' },
    ],
    dl: [
      { title: 'Starting loss.', text: String.raw`A $K$-class classifier that initially assigns nearly the same probability to every class has a cross-entropy of $\ln K$: 2.303 nats with 10 classes and 6.908 nats with 1000. If your initial loss is far from that value, check the initialization or the labels.` },
      { title: 'Uncertainty of a prediction.', text: String.raw`The entropy of the softmax output summarizes how confident the network is: $[0.7,\ 0.2,\ 0.1]$ has 1.157 bits, against a maximum of $\log_2 3 \approx 1.585$. But a network can be very confident and wrong: see [[calibration]].` },
      { title: 'Entropy regularization.', text: 'Some techniques add the entropy of the output to the objective, to penalize overconfident predictions or, in reinforcement learning, to encourage exploration.' },
    ],
    quiz: [
      {
        prompt: 'What is the entropy, in bits, of a fair 8-sided die?',
        options: [{ text: '2' }, { text: '3', correct: true }, { text: '8' }],
        explain: String.raw`$\log_2 8 = 3$: the uniform distribution over $K$ values has entropy $\log_2 K$.`,
      },
      {
        prompt: 'A coin lands heads with probability 0.9. Its entropy is:',
        options: [{ text: 'More than 1 bit.' }, { text: 'About 0.469 bits.', correct: true }, { text: '0.9 bits.' }],
        explain: String.raw`$-0.9\log_2 0.9 - 0.1\log_2 0.1 \approx 0.469$ bits: less than a fair coin, because it is more predictable.`,
      },
      {
        prompt: 'Your 1000-class classifier starts training with a cross-entropy of 6.9. What does that tell you?',
        options: [
          { text: 'Something is wrong: it should start near 0.' },
          { text: String.raw`It is expected: with nearly uniform predictions, the loss is $\ln 1000 \approx 6.9$.`, correct: true },
          { text: 'The network has already learned half of the classes.' },
        ],
        explain: String.raw`If the correct class gets probability $1/1000$, the loss is $-\ln(1/1000) = \ln 1000 \approx 6.908$ nats.`,
      },
    ],
    further: [
      { book: 'pml1', where: '§6.1 (discrete entropy, cross-entropy, joint and conditional entropy, perplexity and differential entropy).' },
      { book: 'pml2', where: '§5.2 (entropy).' },
    ],
  },
};

export default content;
