import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'Un VAE es un modelo generativo con variables latentes cuyo decodificador es una red neuronal, entrenado junto con un codificador que aproxima el posterior de las latentes. Los dos se ajustan a la vez maximizando el ELBO: es inferencia variacional amortizada.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Quieres generar imágenes nuevas. El modelo es sencillo de escribir: se sortea un código latente $z \sim \mathcal{N}(\mathbf{0}, I)$ y una red, el **decodificador**, lo convierte en una distribución sobre imágenes, $p_\theta(x \mid z)$. Entrenarlo por [[mle|máxima verosimilitud]] exigiría $p_\theta(x) = \int p_\theta(x \mid z)\,p(z)\,dz$, una integral intratable. La solución es otra red, el **codificador**, que para cada imagen propone qué códigos pudieron generarla: una aproximación $q_\phi(z \mid x)$ al posterior.` },
          { key: String.raw`Un VAE es [[variational-inference|inferencia variacional]] amortizada: en vez de optimizar una $q$ distinta para cada dato, una red produce los parámetros de $q_\phi(z \mid x)$ para cualquier $x$.` },
        ],
      },
      {
        id: 'perdida',
        title: 'Función de pérdida',
        blocks: [
          { p: 'Para cada ejemplo se minimiza el ELBO cambiado de signo:' },
          { math: String.raw`\mathcal{L}(x) = \underbrace{-\,\mathbb{E}_{q_\phi(z \mid x)}\big[\log p_\theta(x \mid z)\big]}_{\text{reconstrucción}} + \underbrace{\mathrm{KL}\big(q_\phi(z \mid x) \,\Vert\, p(z)\big)}_{\text{regularización}}` },
          {
            list: [
              String.raw`**Codificador:** devuelve $\boldsymbol\mu_\phi(x)$ y $\boldsymbol\sigma_\phi(x)$, y $q_\phi(z \mid x) = \mathcal{N}(\boldsymbol\mu, \operatorname{diag}\boldsymbol\sigma^2)$.`,
              String.raw`**Reparametrización:** $z = \boldsymbol\mu + \boldsymbol\sigma \odot \boldsymbol\varepsilon$, con $\boldsymbol\varepsilon \sim \mathcal{N}(\mathbf{0}, I)$, para que el gradiente atraviese el muestreo.`,
              String.raw`**Reconstrucción:** con un decodificador gaussiano de varianza fija es un error cuadrático escalado; con uno de Bernoulli, la [[cross-entropy|entropía cruzada]] binaria.`,
              String.raw`**Término KL:** con prior $\mathcal{N}(\mathbf{0}, I)$ tiene forma cerrada, $\tfrac12 \sum_j \big(\mu_j^2 + \sigma_j^2 - 1 - \log \sigma_j^2\big)$.`,
            ],
          },
        ],
      },
      {
        id: 'numeros',
        title: 'Un vistazo a los números',
        blocks: [
          { p: String.raw`Con un latente de dos dimensiones, si el codificador devuelve $\boldsymbol\mu = [1;\ 0]$ y $\boldsymbol\sigma = [0{,}5;\ 1]$, el término KL vale 0,818 nats, y todo lo aporta la primera dimensión: la segunda coincide con el prior, así que no transmite información sobre ese $x$. Si una dimensión da una KL casi nula para todos los datos, el modelo no la está usando.` },
          { p: String.raw`Para **generar**, el codificador sobra: se sortea $z \sim \mathcal{N}(\mathbf{0}, I)$ y se decodifica. Funciona porque el término KL empuja los códigos de los datos a ocupar la región donde el prior pone su masa.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '«Un VAE es un autocodificador al que se le añade ruido.»', fix: 'Es un modelo probabilístico generativo. El término KL empuja los códigos a ocupar la región del prior, de modo que decodificar un z sorteado del prior suele dar datos plausibles; un autocodificador corriente no garantiza nada de eso.' },
      { claim: '«La pérdida de un VAE es la log-verosimilitud negativa.»', fix: String.raw`Es el ELBO cambiado de signo, una cota superior de $-\log p_\theta(x)$. Para estimar $\log p_\theta(x)$ se suele usar muestreo de importancia con muchas muestras de $q$, por ejemplo la cota IWAE.` },
      { claim: '«Si el término KL baja casi a 0, el modelo va bien.»', fix: String.raw`Puede ser un colapso del posterior: $q_\phi(z \mid x) \approx p(z)$ para todo $x$, y el decodificador ignora las latentes. Pasa sobre todo con decodificadores muy potentes; se mitiga subiendo poco a poco el peso de la KL (KL annealing) o con free bits.` },
      { claim: '«Para generar datos nuevos, se codifica una imagen y se decodifica.»', fix: 'Eso es reconstruir. Para generar se muestrea z del prior y se decodifica; el codificador solo hace falta para entrenar o para obtener el código de un dato concreto.' },
    ],
    dl: [
      { title: 'Difusión en el espacio latente.', text: 'Stable Diffusion (Rombach et al., 2022) no trabaja sobre píxeles: primero comprime las imágenes con un autocodificador regularizado con un término KL pequeño, como el de un VAE, y el modelo de difusión opera en ese espacio latente.' },
      { title: 'β-VAE.', text: String.raw`Multiplicar el término KL por $\beta > 1$ (Higgins et al., 2017) empeora la reconstrucción, pero favorece latentes más independientes entre sí; con $\beta < 1$ se reconstruye mejor, pero el espacio latente se parece menos al prior.` },
      { title: 'Cuidado con la verosimilitud como detector.', text: 'Usar el ELBO para detectar datos anómalos es tentador, pero los modelos generativos profundos pueden dar más verosimilitud a datos de otra distribución que a los suyos (Nalisnick et al., 2019).' },
    ],
    quiz: [
      {
        prompt: String.raw`Para un latente de una dimensión, el codificador devuelve $\mu = 0$ y $\sigma = 1$. ¿Cuánto vale el término KL?`,
        options: [{ text: '0', correct: true }, { text: '0,5' }, { text: '1' }],
        explain: String.raw`$\tfrac12(0 + 1 - 1 - \log 1) = 0$: $q$ coincide con el prior $\mathcal{N}(0;\ 1)$, así que esa latente no transmite información sobre ese $x$.`,
      },
      {
        prompt: '¿Para qué sirve el truco de la reparametrización?',
        options: [
          { text: 'Para que el término KL tenga forma cerrada.' },
          { text: 'Para que el gradiente pueda atravesar el muestreo de z.', correct: true },
          { text: 'Para que el decodificador sea más rápido.' },
        ],
        explain: String.raw`Escribir $z = \mu + \sigma\varepsilon$, con $\varepsilon$ independiente de los parámetros, convierte el muestreo en una función derivable de $\mu$ y $\sigma$. La forma cerrada de la KL se debe a que $q$ y el prior son gaussianos.`,
      },
      {
        prompt: '¿Cómo generas una imagen nueva con un VAE ya entrenado?',
        options: [
          { text: 'Codificas una imagen de entrenamiento y decodificas su media.' },
          { text: 'Pasas ruido aleatorio por el codificador.' },
          { text: 'Muestreas z del prior y lo decodificas.', correct: true },
        ],
        explain: 'La primera opción reconstruye una imagen existente, y el codificador no genera nada. La generación usa solo el prior y el decodificador.',
      },
    ],
    further: [
      { book: 'pml2', where: '§21.2 (supuestos del modelo, ajuste y diferencias con un autocodificador), §21.3.1 (β-VAE) y §21.4 (el colapso del posterior y cómo evitarlo).' },
      { book: 'pml1', where: '§20.3.5 (introducción a los VAE y al truco de la reparametrización).' },
    ],
    extra: [
      { text: 'Kingma, D. P. y Welling, M. (2014). Auto-Encoding Variational Bayes. ICLR 2014.', url: 'https://arxiv.org/abs/1312.6114' },
    ],
  },
  en: {
    lede: 'A VAE is a latent-variable generative model whose decoder is a neural network, trained together with an encoder that approximates the posterior of the latents. Both are fitted at once by maximizing the ELBO: it is amortized variational inference.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`You want to generate new images. The model is easy to write down: draw a latent code $z \sim \mathcal{N}(\mathbf{0}, I)$ and let a network, the **decoder**, turn it into a distribution over images, $p_\theta(x \mid z)$. Training it by [[mle|maximum likelihood]] would require $p_\theta(x) = \int p_\theta(x \mid z)\,p(z)\,dz$, an intractable integral. The solution is another network, the **encoder**, which for each image proposes which codes could have generated it: an approximation $q_\phi(z \mid x)$ to the posterior.` },
          { key: String.raw`A VAE is amortized [[variational-inference|variational inference]]: instead of optimizing a different $q$ for each data point, a network outputs the parameters of $q_\phi(z \mid x)$ for any $x$.` },
        ],
      },
      {
        id: 'loss',
        title: 'Loss function',
        blocks: [
          { p: 'For each example, the negative ELBO is minimized:' },
          { math: String.raw`\mathcal{L}(x) = \underbrace{-\,\mathbb{E}_{q_\phi(z \mid x)}\big[\log p_\theta(x \mid z)\big]}_{\text{reconstruction}} + \underbrace{\mathrm{KL}\big(q_\phi(z \mid x) \,\Vert\, p(z)\big)}_{\text{regularization}}` },
          {
            list: [
              String.raw`**Encoder:** outputs $\boldsymbol\mu_\phi(x)$ and $\boldsymbol\sigma_\phi(x)$, and $q_\phi(z \mid x) = \mathcal{N}(\boldsymbol\mu, \operatorname{diag}\boldsymbol\sigma^2)$.`,
              String.raw`**Reparameterization:** $z = \boldsymbol\mu + \boldsymbol\sigma \odot \boldsymbol\varepsilon$, with $\boldsymbol\varepsilon \sim \mathcal{N}(\mathbf{0}, I)$, so that the gradient can pass through the sampling.`,
              String.raw`**Reconstruction:** with a Gaussian decoder of fixed variance it is a scaled squared error; with a Bernoulli decoder, the binary [[cross-entropy|cross-entropy]].`,
              String.raw`**KL term:** with a $\mathcal{N}(\mathbf{0}, I)$ prior it has a closed form, $\tfrac12 \sum_j \big(\mu_j^2 + \sigma_j^2 - 1 - \log \sigma_j^2\big)$.`,
            ],
          },
        ],
      },
      {
        id: 'numbers',
        title: 'A look at the numbers',
        blocks: [
          { p: String.raw`With a two-dimensional latent, if the encoder outputs $\boldsymbol\mu = [1,\ 0]$ and $\boldsymbol\sigma = [0.5,\ 1]$, the KL term is 0.818 nats, all of it from the first dimension: the second matches the prior, so it carries no information about that $x$. If a dimension gives an almost zero KL for every data point, the model is not using it.` },
          { p: String.raw`To **generate**, the encoder is not needed: draw $z \sim \mathcal{N}(\mathbf{0}, I)$ and decode it. This works because the KL term pushes the codes of the data to occupy the region where the prior puts its mass.` },
        ],
      },
    ],
    pitfalls: [
      { claim: '“A VAE is an autoencoder with added noise.”', fix: 'It is a probabilistic generative model. The KL term pushes the codes to occupy the region of the prior, so that decoding a z drawn from the prior usually gives plausible data; an ordinary autoencoder guarantees nothing of the sort.' },
      { claim: '“The loss of a VAE is the negative log-likelihood.”', fix: String.raw`It is the negative ELBO, an upper bound on $-\log p_\theta(x)$. To estimate $\log p_\theta(x)$, the usual approach is importance sampling with many samples from $q$, for example the IWAE bound.` },
      { claim: '“If the KL term drops almost to 0, the model is doing well.”', fix: String.raw`It may be posterior collapse: $q_\phi(z \mid x) \approx p(z)$ for every $x$, and the decoder ignores the latents. It happens mostly with very powerful decoders; it is mitigated by slowly increasing the weight of the KL (KL annealing) or with free bits.` },
      { claim: '“To generate new data, you encode an image and decode it.”', fix: 'That is reconstruction. To generate, sample z from the prior and decode it; the encoder is only needed for training or to get the code of a particular data point.' },
    ],
    dl: [
      { title: 'Diffusion in latent space.', text: 'Stable Diffusion (Rombach et al., 2022) does not work on pixels: it first compresses the images with an autoencoder regularized with a small KL term, like that of a VAE, and the diffusion model operates in that latent space.' },
      { title: 'β-VAE.', text: String.raw`Multiplying the KL term by $\beta > 1$ (Higgins et al., 2017) worsens the reconstruction but favors latents that are more independent of each other; with $\beta < 1$ the reconstruction improves, but the latent space resembles the prior less.` },
      { title: 'Beware of likelihood as a detector.', text: 'Using the ELBO to detect anomalous data is tempting, but deep generative models can assign higher likelihood to data from another distribution than to their own (Nalisnick et al., 2019).' },
    ],
    quiz: [
      {
        prompt: String.raw`For a one-dimensional latent, the encoder outputs $\mu = 0$ and $\sigma = 1$. What is the KL term?`,
        options: [{ text: '0', correct: true }, { text: '0.5' }, { text: '1' }],
        explain: String.raw`$\tfrac12(0 + 1 - 1 - \log 1) = 0$: $q$ matches the $\mathcal{N}(0, 1)$ prior, so that latent carries no information about that $x$.`,
      },
      {
        prompt: 'What is the reparameterization trick for?',
        options: [
          { text: 'To give the KL term a closed form.' },
          { text: 'To let the gradient pass through the sampling of z.', correct: true },
          { text: 'To make the decoder faster.' },
        ],
        explain: String.raw`Writing $z = \mu + \sigma\varepsilon$, with $\varepsilon$ independent of the parameters, turns the sampling into a differentiable function of $\mu$ and $\sigma$. The closed form of the KL comes from $q$ and the prior both being Gaussian.`,
      },
      {
        prompt: 'How do you generate a new image with a trained VAE?',
        options: [
          { text: 'Encode a training image and decode its mean.' },
          { text: 'Feed random noise through the encoder.' },
          { text: 'Sample z from the prior and decode it.', correct: true },
        ],
        explain: 'The first option reconstructs an existing image, and the encoder does not generate anything. Generation uses only the prior and the decoder.',
      },
    ],
    further: [
      { book: 'pml2', where: '§21.2 (model assumptions, fitting and differences from an autoencoder), §21.3.1 (β-VAE) and §21.4 (posterior collapse and how to avoid it).' },
      { book: 'pml1', where: '§20.3.5 (introduction to VAEs and the reparameterization trick).' },
    ],
    extra: [
      { text: 'Kingma, D. P. and Welling, M. (2014). Auto-Encoding Variational Bayes. ICLR 2014.', url: 'https://arxiv.org/abs/1312.6114' },
    ],
  },
};

export default content;
