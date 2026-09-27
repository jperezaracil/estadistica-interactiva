import type { ConceptContent } from '../lib/content-types';

const content: ConceptContent = {
  es: {
    lede: 'El análisis de componentes principales resume muchas variables correlacionadas en unas pocas direcciones nuevas, incorreladas entre sí, que recogen la mayor parte de la varianza. Es el método lineal de reducción de dimensión más usado.',
    sections: [
      {
        id: 'idea',
        title: 'La idea',
        blocks: [
          { p: String.raw`Mides la altura y la envergadura (brazos extendidos) de muchas personas y estandarizas las dos variables. Supón que su correlación es $\rho = 0{,}9$: los puntos forman una elipse alargada a lo largo de la diagonal. Casi toda la variación va en la dirección «tamaño», $(z_1 + z_2)/\sqrt{2}$, y muy poca en la perpendicular «proporción», $(z_1 - z_2)/\sqrt{2}$: la primera recoge el 95 % de la varianza total. PCA encuentra esas direcciones automáticamente, con cualquier número de variables.` },
          { key: 'Las componentes principales son las direcciones ortogonales de máxima varianza: los autovectores de la matriz de covarianzas. El autovalor de cada una es la varianza que recoge.' },
        ],
      },
      {
        id: 'definicion',
        title: 'Definición',
        blocks: [
          { p: String.raw`Centra los datos restando a cada variable su media y calcula la matriz de covarianzas muestral $S$, de tamaño $d \times d$. Su descomposición espectral da autovalores $\lambda_1 \ge \dots \ge \lambda_d \ge 0$ y autovectores ortonormales $\mathbf{v}_1, \dots, \mathbf{v}_d$:` },
          { math: String.raw`S\,\mathbf{v}_j = \lambda_j\,\mathbf{v}_j, \qquad \mathbf{v}_1 = \arg\max_{\lVert \mathbf{v} \rVert = 1} \mathbf{v}^\top S\,\mathbf{v}, \qquad z_{ij} = \mathbf{v}_j^\top (\mathbf{x}_i - \bar{\mathbf{x}})` },
          { p: String.raw`La puntuación $z_{ij}$ es la proyección de la observación $i$ sobre la dirección $\mathbf{v}_j$. Cada $\mathbf{v}_j$ maximiza la varianza entre las direcciones ortogonales a las anteriores. Las componentes son incorreladas, la varianza de la $j$-ésima es $\lambda_j$ y la fracción de varianza que recogen las $k$ primeras es $\sum_{j \le k} \lambda_j / \sum_{j} \lambda_j$.` },
          { p: String.raw`Proyectar sobre las $k$ primeras direcciones da además la mejor aproximación de los datos en un subespacio de dimensión $k$, en error cuadrático: maximizar la varianza proyectada equivale a minimizar el error de reconstrucción. En la práctica se calcula con la SVD de la matriz de datos centrada, $X = U \Sigma V^\top$: las columnas de $V$ son los $\mathbf{v}_j$ y $\lambda_j = \sigma_j^2/(n-1)$.` },
        ],
      },
      {
        id: 'covarianzas-o-correlaciones',
        title: '¿Covarianzas o correlaciones?',
        blocks: [
          { p: String.raw`PCA depende de las unidades. Toma dos variables con correlación 0,5, una con desviación típica 10 y otra con desviación típica 1, por ejemplo porque se miden en unidades distintas. Su matriz de covarianzas es $\begin{pmatrix} 100 & 5 \\ 5 & 1 \end{pmatrix}$. Estandarizarlas, es decir, usar la matriz de correlaciones, cambia el resultado por completo:` },
          {
            table: {
              head: ['Resultado', 'Matriz de covarianzas', 'Matriz de correlaciones'],
              rows: [
                ['Autovalores', '100,25 y 0,75', '1,5 y 0,5'],
                ['Varianza que recoge la primera componente', '99,3 %', '75 %'],
                ['Dirección de la primera componente', String.raw`$(0{,}999;\ 0{,}050)$`, String.raw`$(0{,}707;\ 0{,}707)$`],
              ],
              numeric: [1, 2],
            },
          },
          { p: 'Con covarianzas, la primera componente es casi la primera variable, solo porque sus números son más grandes. Si las variables están en unidades distintas, estandariza. Si están en las mismas unidades y sus varianzas importan (por ejemplo, los píxeles de una imagen), puede tener sentido usar las covarianzas.' },
        ],
      },
      {
        id: 'cuantas-componentes',
        title: '¿Cuántas componentes?',
        blocks: [
          {
            list: [
              'Las necesarias para recoger una fracción de la varianza fijada de antemano, según cuánta información puedas permitirte perder.',
              'Las que quedan antes del «codo» del gráfico de sedimentación, que muestra los autovalores ordenados de mayor a menor: el punto en que dejan de caer deprisa.',
              'Si PCA es un paso previo a otro modelo, el número que dé mejor resultado en validación: ver [[cross-validation]].',
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '«PCA no depende de las unidades de las variables.»', fix: 'Maximiza varianza, y la varianza depende de las unidades: pasar una variable de centímetros a milímetros multiplica su varianza por 100 y la hace dominar la primera componente. Con unidades distintas, estandariza antes.' },
      { claim: '«Las componentes con más varianza son las más útiles para predecir.»', fix: 'PCA no mira la variable respuesta. La dirección que separa dos clases puede tener poca varianza y quedar entre las componentes que descartas. Si el objetivo es predecir, elige el número de componentes por validación o usa un método supervisado.' },
      { claim: '«Las componentes principales son variables independientes con un significado propio.»', fix: 'Son incorreladas, pero solo está garantizado que sean independientes si los datos son [[mvn|normales multivariantes]]. Además, el signo de cada autovector es arbitrario y, si dos autovalores son casi iguales, sus direcciones están mal determinadas: interprétalas con cautela.' },
      { claim: '«No hace falta centrar los datos antes de la SVD.»', fix: 'Sin centrar, el primer vector singular tiende a apuntar hacia la media de los datos, sobre todo si está lejos del origen, en lugar de hacia la dirección de máxima varianza. Algunas implementaciones de SVD truncada, pensadas para matrices dispersas, no centran: compruébalo.' },
    ],
    dl: [
      { title: 'Un autocodificador lineal hace PCA.', text: 'Un autocodificador con codificador y decodificador lineales y un cuello de botella de $k$ unidades, entrenado con error cuadrático sobre datos centrados, alcanza en el óptimo el mismo subespacio que las $k$ primeras componentes principales, aunque no necesariamente los mismos vectores. Los autocodificadores no lineales y los [[vae|VAE]] generalizan esta idea.' },
      { title: 'Visualizar representaciones.', text: 'Proyectar los embeddings o las activaciones de una capa sobre las dos primeras componentes es una forma rápida de ver si las clases se separan. También es habitual reducir primero con PCA a unas decenas de dimensiones antes de aplicar métodos no lineales como t-SNE o UMAP.' },
      { title: 'Detectar colapso dimensional.', text: 'En aprendizaje autosupervisado, el espectro de autovalores de la matriz de covarianzas de los embeddings muestra si la red aprovecha todas sus dimensiones. Si unos pocos autovalores recogen casi toda la varianza y el resto son casi cero, la representación ha colapsado a un subespacio pequeño.' },
    ],
    quiz: [
      {
        prompt: 'Dos variables estandarizadas tienen correlación 0,8. ¿Qué fracción de la varianza total recoge la primera componente principal?',
        options: [{ text: '80 %' }, { text: '90 %', correct: true }, { text: '64 %' }],
        explain: String.raw`Los autovalores de $\begin{pmatrix} 1 & \rho \\ \rho & 1 \end{pmatrix}$ son $1 \pm \rho$, es decir, 1,8 y 0,2. La primera componente recoge $1{,}8/2 = 0{,}9$ de la varianza total.`,
      },
      {
        prompt: 'Los autovalores de una PCA son 4; 2; 1; 0,5 y 0,5. ¿Cuántas componentes necesitas para recoger al menos el 85 % de la varianza?',
        options: [{ text: '2' }, { text: '3', correct: true }, { text: '4' }],
        explain: 'La varianza total es 8. Las dos primeras componentes recogen 6/8 = 75 % y las tres primeras, 7/8 = 87,5 %.',
      },
      {
        prompt: 'Tus variables están en unidades distintas (euros, años, metros). ¿Qué haces antes de aplicar PCA?',
        options: [
          { text: 'Estandarizar cada variable, es decir, usar la matriz de correlaciones.', correct: true },
          { text: 'Nada: PCA no depende de las unidades.' },
          { text: 'Eliminar la variable con más varianza.' },
        ],
        explain: 'Con unidades distintas, las varianzas dependen de una elección arbitraria y la variable con números más grandes dominaría las primeras componentes. Estandarizadas, todas pesan lo mismo.',
      },
    ],
    further: [
      { book: 'wilks', where: '§13.1.1 (definición con los autovectores de la matriz de covarianzas y fórmulas de análisis y síntesis), §13.1.2 (PCA con la matriz de covarianzas o con la de correlaciones), §13.3 (criterios para decidir cuántas componentes conservar) y §13.6.2 (cálculo mediante la SVD).' },
      { book: 'pml1', where: '§20.1 (derivación como mínimo error de reconstrucción y máxima varianza, cálculo con la SVD y elección del número de dimensiones), §20.2.2 (PCA probabilístico) y §20.3.1 (un autocodificador lineal equivale a PCA).' },
    ],
    extra: [
      { text: 'Pearson, K. (1901). On lines and planes of closest fit to systems of points in space. The London, Edinburgh, and Dublin Philosophical Magazine and Journal of Science, 2(11), 559–572. Busca el plano que mejor se ajusta a una nube de puntos: la idea geométrica de PCA.', url: 'https://doi.org/10.1080/14786440109462720' },
      { text: 'Hotelling, H. (1933). Analysis of a complex of statistical variables into principal components. Journal of Educational Psychology, 24(6), 417–441. Da nombre a las componentes principales y las obtiene maximizando la varianza.', url: 'https://doi.org/10.1037/h0071325' },
    ],
  },
  en: {
    lede: 'Principal component analysis summarizes many correlated variables in a few new directions, uncorrelated with each other, that capture most of the variance. It is the most widely used linear method for dimensionality reduction.',
    sections: [
      {
        id: 'idea',
        title: 'The idea',
        blocks: [
          { p: String.raw`You measure the height and the arm span of many people and standardize both variables. Suppose their correlation is $\rho = 0.9$: the points form an elongated ellipse along the diagonal. Almost all the variation lies in the “size” direction, $(z_1 + z_2)/\sqrt{2}$, and very little in the perpendicular “proportion” direction, $(z_1 - z_2)/\sqrt{2}$: the first one captures 95% of the total variance. PCA finds those directions automatically, with any number of variables.` },
          { key: 'The principal components are the orthogonal directions of maximum variance: the eigenvectors of the covariance matrix. The eigenvalue of each one is the variance it captures.' },
        ],
      },
      {
        id: 'definition',
        title: 'Definition',
        blocks: [
          { p: String.raw`Center the data by subtracting from each variable its mean and compute the sample covariance matrix $S$, of size $d \times d$. Its eigendecomposition gives eigenvalues $\lambda_1 \ge \dots \ge \lambda_d \ge 0$ and orthonormal eigenvectors $\mathbf{v}_1, \dots, \mathbf{v}_d$:` },
          { math: String.raw`S\,\mathbf{v}_j = \lambda_j\,\mathbf{v}_j, \qquad \mathbf{v}_1 = \arg\max_{\lVert \mathbf{v} \rVert = 1} \mathbf{v}^\top S\,\mathbf{v}, \qquad z_{ij} = \mathbf{v}_j^\top (\mathbf{x}_i - \bar{\mathbf{x}})` },
          { p: String.raw`The score $z_{ij}$ is the projection of observation $i$ onto direction $\mathbf{v}_j$. Each $\mathbf{v}_j$ maximizes the variance among the directions orthogonal to the previous ones. The components are uncorrelated, the variance of the $j$-th one is $\lambda_j$ and the fraction of variance captured by the first $k$ is $\sum_{j \le k} \lambda_j / \sum_{j} \lambda_j$.` },
          { p: String.raw`Projecting onto the first $k$ directions also gives the best approximation of the data in a $k$-dimensional subspace, in squared error: maximizing the projected variance is equivalent to minimizing the reconstruction error. In practice it is computed with the SVD of the centered data matrix, $X = U \Sigma V^\top$: the columns of $V$ are the $\mathbf{v}_j$ and $\lambda_j = \sigma_j^2/(n-1)$.` },
        ],
      },
      {
        id: 'covariance-or-correlation',
        title: 'Covariances or correlations?',
        blocks: [
          { p: String.raw`PCA depends on the units. Take two variables with correlation 0.5, one with standard deviation 10 and the other with standard deviation 1, for example because they are measured in different units. Their covariance matrix is $\begin{pmatrix} 100 & 5 \\ 5 & 1 \end{pmatrix}$. Standardizing them, that is, using the correlation matrix, changes the result completely:` },
          {
            table: {
              head: ['Result', 'Covariance matrix', 'Correlation matrix'],
              rows: [
                ['Eigenvalues', '100.25 and 0.75', '1.5 and 0.5'],
                ['Variance captured by the first component', '99.3%', '75%'],
                ['Direction of the first component', String.raw`$(0.999, 0.050)$`, String.raw`$(0.707, 0.707)$`],
              ],
              numeric: [1, 2],
            },
          },
          { p: 'With covariances, the first component is almost the first variable, only because its numbers are larger. If the variables are in different units, standardize. If they are in the same units and their variances matter (for example, the pixels of an image), using the covariances can make sense.' },
        ],
      },
      {
        id: 'how-many',
        title: 'How many components?',
        blocks: [
          {
            list: [
              'As many as needed to capture a fraction of the variance fixed in advance, depending on how much information you can afford to lose.',
              'Those before the “elbow” of the scree plot, which shows the eigenvalues sorted from largest to smallest: the point where they stop falling quickly.',
              'If PCA is a step before another model, the number that gives the best validation result: see [[cross-validation]].',
            ],
          },
        ],
      },
    ],
    pitfalls: [
      { claim: '“PCA does not depend on the units of the variables.”', fix: 'It maximizes variance, and variance depends on the units: converting a variable from centimeters to millimeters multiplies its variance by 100 and makes it dominate the first component. With different units, standardize first.' },
      { claim: '“The components with the most variance are the most useful for prediction.”', fix: 'PCA does not look at the response variable. The direction that separates two classes may have little variance and end up among the components you discard. If the goal is prediction, choose the number of components by validation or use a supervised method.' },
      { claim: '“Principal components are independent variables with a meaning of their own.”', fix: 'They are uncorrelated, but they are only guaranteed to be independent if the data are [[mvn|multivariate normal]]. Moreover, the sign of each eigenvector is arbitrary and, if two eigenvalues are nearly equal, their directions are poorly determined: interpret them with caution.' },
      { claim: '“There is no need to center the data before the SVD.”', fix: 'Without centering, the first singular vector tends to point towards the mean of the data, especially if it is far from the origin, instead of towards the direction of maximum variance. Some truncated SVD implementations, designed for sparse matrices, do not center: check.' },
    ],
    dl: [
      { title: 'A linear autoencoder does PCA.', text: 'An autoencoder with a linear encoder and decoder and a bottleneck of $k$ units, trained with squared error on centered data, reaches at its optimum the same subspace as the first $k$ principal components, though not necessarily the same vectors. Nonlinear autoencoders and [[vae|VAEs]] generalize this idea.' },
      { title: 'Visualizing representations.', text: 'Projecting the embeddings or the activations of a layer onto the first two components is a quick way to see whether the classes separate. It is also common to reduce first with PCA to a few tens of dimensions before applying nonlinear methods such as t-SNE or UMAP.' },
      { title: 'Detecting dimensional collapse.', text: 'In self-supervised learning, the eigenvalue spectrum of the covariance matrix of the embeddings shows whether the network uses all its dimensions. If a few eigenvalues capture almost all the variance and the rest are nearly zero, the representation has collapsed to a small subspace.' },
    ],
    quiz: [
      {
        prompt: 'Two standardized variables have correlation 0.8. What fraction of the total variance does the first principal component capture?',
        options: [{ text: '80%' }, { text: '90%', correct: true }, { text: '64%' }],
        explain: String.raw`The eigenvalues of $\begin{pmatrix} 1 & \rho \\ \rho & 1 \end{pmatrix}$ are $1 \pm \rho$, that is, 1.8 and 0.2. The first component captures $1.8/2 = 0.9$ of the total variance.`,
      },
      {
        prompt: 'The eigenvalues of a PCA are 4, 2, 1, 0.5 and 0.5. How many components do you need to capture at least 85% of the variance?',
        options: [{ text: '2' }, { text: '3', correct: true }, { text: '4' }],
        explain: 'The total variance is 8. The first two components capture 6/8 = 75% and the first three, 7/8 = 87.5%.',
      },
      {
        prompt: 'Your variables are in different units (euros, years, meters). What do you do before applying PCA?',
        options: [
          { text: 'Standardize each variable, that is, use the correlation matrix.', correct: true },
          { text: 'Nothing: PCA does not depend on the units.' },
          { text: 'Remove the variable with the largest variance.' },
        ],
        explain: 'With different units, the variances depend on an arbitrary choice and the variable with the largest numbers would dominate the first components. Once standardized, they all weigh the same.',
      },
    ],
    further: [
      { book: 'wilks', where: '§13.1.1 (definition through the eigenvectors of the covariance matrix, and the analysis and synthesis formulas), §13.1.2 (PCA on the covariance matrix or on the correlation matrix), §13.3 (criteria for deciding how many components to keep) and §13.6.2 (computation via the SVD).' },
      { book: 'pml1', where: '§20.1 (derivation as minimum reconstruction error and maximum variance, computation with the SVD and choice of the number of dimensions), §20.2.2 (probabilistic PCA) and §20.3.1 (a linear autoencoder is equivalent to PCA).' },
    ],
    extra: [
      { text: 'Pearson, K. (1901). On lines and planes of closest fit to systems of points in space. The London, Edinburgh, and Dublin Philosophical Magazine and Journal of Science, 2(11), 559–572. Looks for the plane that best fits a cloud of points: the geometric idea of PCA.', url: 'https://doi.org/10.1080/14786440109462720' },
      { text: 'Hotelling, H. (1933). Analysis of a complex of statistical variables into principal components. Journal of Educational Psychology, 24(6), 417–441. Names the principal components and obtains them by maximizing variance.', url: 'https://doi.org/10.1037/h0071325' },
    ],
  },
};

export default content;
