// Banco de perguntas sobre teoremas da matemática do ensino secundário.
// A primeira resposta de cada lista ("a") é sempre a correta — o jogo baralha a ordem.
window.QUESTIONS = [
  {
    t: "Teorema de Pitágoras",
    q: "Num triângulo retângulo, os catetos medem 6 cm e 8 cm. Quanto mede a hipotenusa?",
    a: ["10 cm", "14 cm", "12 cm", "√28 cm"],
    e: "6² + 8² = 36 + 64 = 100, logo a hipotenusa mede √100 = 10 cm."
  },
  {
    t: "Teorema de Pitágoras",
    q: "Num triângulo retângulo de hipotenusa c e catetos a e b, o Teorema de Pitágoras afirma que…",
    a: ["c² = a² + b²", "c = a + b", "c² = a² − b²", "c² = 2ab"],
    e: "O quadrado da hipotenusa é igual à soma dos quadrados dos catetos."
  },
  {
    t: "Recíproco do Teorema de Pitágoras",
    q: "Qual destes ternos de comprimentos forma um triângulo retângulo?",
    a: ["5, 12 e 13", "4, 5 e 6", "6, 7 e 9", "2, 3 e 4"],
    e: "5² + 12² = 25 + 144 = 169 = 13². Pelo recíproco do Teorema de Pitágoras, o triângulo é retângulo."
  },
  {
    t: "Teorema de Tales",
    q: "Duas retas paralelas cortam duas secantes. Numa secante, os segmentos medem 3 e 6; na outra, o segmento correspondente ao 3 mede 4. Quanto mede o outro?",
    a: ["8", "7", "9", "4,5"],
    e: "Pelo Teorema de Tales os segmentos são proporcionais: 3/6 = 4/x, logo x = 8."
  },
  {
    t: "Soma dos ângulos internos",
    q: "Qual é a soma das amplitudes dos ângulos internos de um triângulo?",
    a: ["180°", "360°", "90°", "270°"],
    e: "Em qualquer triângulo (geometria euclidiana) a soma dos ângulos internos é 180°."
  },
  {
    t: "Soma dos ângulos internos",
    q: "Qual é a soma das amplitudes dos ângulos internos de um hexágono convexo?",
    a: ["720°", "540°", "1080°", "900°"],
    e: "Num polígono convexo de n lados a soma é (n − 2) × 180°. Para n = 6: 4 × 180° = 720°."
  },
  {
    t: "Teorema do ângulo externo",
    q: "Num triângulo, a amplitude de um ângulo externo é igual…",
    a: [
      "à soma dos dois ângulos internos não adjacentes",
      "ao ângulo interno adjacente",
      "à diferença dos dois ângulos internos não adjacentes",
      "a 180° menos a soma dos três ângulos internos"
    ],
    e: "O ângulo externo e o interno adjacente somam 180°, tal como os três internos; daí o resultado."
  },
  {
    t: "Ângulo inscrito",
    q: "Um ângulo inscrito numa circunferência compreende um arco de 140°. Qual é a sua amplitude?",
    a: ["70°", "140°", "280°", "40°"],
    e: "A amplitude de um ângulo inscrito é metade da amplitude do arco compreendido entre os seus lados."
  },
  {
    t: "Ângulo inscrito numa semicircunferência",
    q: "Um triângulo inscrito numa circunferência tem um lado que é diâmetro. O ângulo oposto a esse lado é…",
    a: ["reto (90°)", "agudo de 60°", "obtuso", "raso (180°)"],
    e: "O arco compreendido é uma semicircunferência (180°); o ângulo inscrito mede metade: 90°."
  },
  {
    t: "Desigualdade triangular",
    q: "Um triângulo tem dois lados com 3 cm e 5 cm. Qual destes NÃO pode ser o comprimento do terceiro lado?",
    a: ["9 cm", "3 cm", "5 cm", "7 cm"],
    e: "Cada lado tem de ser menor que a soma dos outros dois: o terceiro lado tem de estar entre 2 e 8 cm."
  },
  {
    t: "Lei dos cossenos",
    q: "Num triângulo de lados a, b, c, com α o ângulo oposto a a, a lei dos cossenos diz que…",
    a: ["a² = b² + c² − 2bc·cos α", "a² = b² + c² + 2bc·cos α", "a = b·cos α + c", "a² = b² + c² − bc·sen α"],
    e: "Generaliza o Teorema de Pitágoras: quando α = 90°, cos α = 0 e obtém-se a² = b² + c²."
  },
  {
    t: "Lei dos senos",
    q: "Num triângulo de lados a, b, c e ângulos opostos A, B, C, a lei dos senos diz que…",
    a: ["a / sen A = b / sen B = c / sen C", "a · sen A = b · sen B = c · sen C", "sen A + sen B + sen C = 1", "a / sen B = b / sen C = c / sen A"],
    e: "Os lados são proporcionais aos senos dos ângulos opostos."
  },
  {
    t: "Teorema de Bolzano-Cauchy",
    q: "Se f é contínua em [a, b] e f(a) · f(b) < 0, então…",
    a: [
      "existe c ∈ ]a, b[ tal que f(c) = 0",
      "f é crescente em [a, b]",
      "f tem um máximo em c = (a + b)/2",
      "f'(c) = 0 para algum c ∈ ]a, b["
    ],
    e: "Corolário do Teorema de Bolzano-Cauchy: se a função muda de sinal num intervalo onde é contínua, tem pelo menos um zero."
  },
  {
    t: "Teorema de Bolzano-Cauchy",
    q: "Qual é a hipótese essencial do Teorema de Bolzano-Cauchy (valores intermédios) sobre f em [a, b]?",
    a: ["f é contínua em [a, b]", "f é derivável em ]a, b[", "f é monótona em [a, b]", "f(a) = f(b)"],
    e: "Basta a continuidade em [a, b]: f assume todos os valores entre f(a) e f(b)."
  },
  {
    t: "Teorema de Weierstrass",
    q: "O Teorema de Weierstrass garante que uma função contínua num intervalo fechado e limitado [a, b]…",
    a: [
      "tem máximo e mínimo absolutos",
      "tem pelo menos um zero",
      "é derivável em ]a, b[",
      "é estritamente monótona"
    ],
    e: "Uma função contínua num intervalo fechado e limitado atinge sempre um máximo e um mínimo absolutos."
  },
  {
    t: "Teorema de Lagrange",
    q: "Se f é contínua em [a, b] e derivável em ]a, b[, o Teorema de Lagrange garante que existe c ∈ ]a, b[ tal que…",
    a: ["f'(c) = (f(b) − f(a)) / (b − a)", "f(c) = 0", "f'(c) = 0", "f(c) = (f(a) + f(b)) / 2"],
    e: "Teorema do valor médio: existe um ponto onde a reta tangente é paralela à reta secante que une (a, f(a)) a (b, f(b))."
  },
  {
    t: "Teorema de Rolle",
    q: "Se f é contínua em [a, b], derivável em ]a, b[ e f(a) = f(b), então existe c ∈ ]a, b[ tal que…",
    a: ["f'(c) = 0", "f(c) = 0", "f''(c) = 0", "f(c) = f'(c)"],
    e: "Pelo Teorema de Rolle, há um ponto onde a tangente ao gráfico é horizontal."
  },
  {
    t: "Teorema de Fermat",
    q: "Se f é derivável em c e f tem um extremo relativo em c, então…",
    a: ["f'(c) = 0", "f(c) = 0", "f''(c) > 0", "f não é contínua em c"],
    e: "Nos extremos relativos de uma função derivável, a derivada anula-se. O recíproco é falso (ex.: x³ em 0)."
  },
  {
    t: "Teorema do resto",
    q: "Qual é o resto da divisão de P(x) = x³ − 2x + 5 por (x − 2)?",
    a: ["9", "5", "1", "13"],
    e: "Pelo Teorema do resto, o resto é P(2) = 8 − 4 + 5 = 9."
  },
  {
    t: "Teorema do resto",
    q: "Um polinómio P(x) é divisível por (x − a) se e só se…",
    a: ["P(a) = 0", "P(0) = a", "P(−a) = 0", "o grau de P é a"],
    e: "O resto da divisão por (x − a) é P(a); é zero exatamente quando a é raiz de P."
  },
  {
    t: "Teorema Fundamental da Álgebra",
    q: "Quantas raízes complexas (contando multiplicidades) tem um polinómio de grau 5?",
    a: ["Exatamente 5", "No máximo 4", "Pelo menos 6", "Depende dos coeficientes"],
    e: "Todo o polinómio de grau n ≥ 1 tem exatamente n raízes em ℂ, contadas com a respetiva multiplicidade."
  },
  {
    t: "Binómio de Newton",
    q: "Qual é o coeficiente de x² no desenvolvimento de (x + 1)⁵?",
    a: ["10", "5", "20", "25"],
    e: "O termo é ⁵C₂ · x² · 1³ = 10x²."
  },
  {
    t: "Binómio de Newton",
    q: "Quantos termos tem o desenvolvimento de (a + b)ⁿ?",
    a: ["n + 1", "n", "2n", "2ⁿ"],
    e: "Os termos são ⁿCₖ aⁿ⁻ᵏ bᵏ com k = 0, 1, …, n: n + 1 termos."
  },
  {
    t: "Triângulo de Pascal",
    q: "Qual é a soma de todos os elementos da linha n = 5 do Triângulo de Pascal (1 5 10 10 5 1)?",
    a: ["32", "25", "30", "64"],
    e: "A soma dos elementos da linha n é 2ⁿ. Para n = 5: 2⁵ = 32."
  },
  {
    t: "Fórmula de De Moivre",
    q: "Pela fórmula de De Moivre, (cos θ + i sen θ)ⁿ é igual a…",
    a: ["cos(nθ) + i sen(nθ)", "n·cos θ + i·n·sen θ", "cosⁿθ + i senⁿθ", "cos(θⁿ) + i sen(θⁿ)"],
    e: "Elevar um complexo de módulo 1 a n multiplica o argumento por n."
  },
  {
    t: "Teorema das sucessões enquadradas",
    q: "Se uₙ ≤ vₙ ≤ wₙ para todo o n e lim uₙ = lim wₙ = 3, então…",
    a: ["lim vₙ = 3", "lim vₙ não existe", "lim vₙ = 0", "vₙ é constante"],
    e: "Teorema das sucessões enquadradas: vₙ fica \"apertada\" entre duas sucessões com o mesmo limite."
  },
  {
    t: "Sucessões monótonas",
    q: "Uma sucessão monótona e limitada é sempre…",
    a: ["convergente", "divergente", "constante", "periódica"],
    e: "Toda a sucessão monótona e limitada é convergente."
  },
  {
    t: "Regra de Laplace",
    q: "Lança-se um dado equilibrado. Qual é a probabilidade de sair um número primo?",
    a: ["1/2", "1/3", "2/3", "1/6"],
    e: "Primos possíveis: 2, 3 e 5. Regra de Laplace: casos favoráveis / casos possíveis = 3/6 = 1/2."
  },
  {
    t: "Teorema de Pitágoras no espaço",
    q: "Qual é o comprimento da diagonal espacial de um cubo de aresta 1?",
    a: ["√3", "√2", "2", "3"],
    e: "Aplicando Pitágoras duas vezes: d² = 1² + 1² + 1² = 3, logo d = √3."
  },
  {
    t: "Fórmula fundamental da trigonometria",
    q: "Para qualquer ângulo α, quanto vale sen²α + cos²α?",
    a: ["1", "0", "2", "tg α"],
    e: "Resulta do Teorema de Pitágoras aplicado no círculo trigonométrico (raio 1)."
  }
];
