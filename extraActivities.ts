import { PedagogicalActivity } from '../types/pedagogical';

export const EXTRA_PEDAGOGICAL_ACTIVITIES: PedagogicalActivity[] = [
  // ================= JANEIRO (restantes jogos) =================
  {
    id: 'jan-comboio-palavras',
    number: 15,
    title: 'Leitura repetida e segmentação silábica',
    gameTitle: 'O comboio das palavras',
    month: 'janeiro',
    competency: 'fluencia_leitora',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Desenvolver a fluência e automatização da leitura de palavras.',
    simpleInstruction: 'Ouve a palavra e escolhe a divisão correta em sílabas.',
    demonstrationExample: 'Exemplo: "ca-sa" tem duas sílabas.',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'jan-15-1',
          prompt: 'Como se divide a palavra "janela" em sílabas?',
          audioText: 'Janela',
          visualEmoji: '🪟',
          options: ['ja-ne-la', 'jan-el-a', 'ja-nel-a'],
          correctAnswer: 'ja-ne-la',
          hint: 'Bate palmas ao dizer: ja - ne - la.',
        },
      ],
      2: [
        {
          id: 'jan-15-2',
          prompt: 'Como se divide a palavra "borboleta" em sílabas?',
          audioText: 'Borboleta',
          visualEmoji: '🦋',
          options: ['bor-bo-le-ta', 'bo-rbo-le-ta', 'bor-bol-e-ta'],
          correctAnswer: 'bor-bo-le-ta',
          hint: 'São quatro sílabas: bor - bo - le - ta.',
        },
      ],
      3: [
        {
          id: 'jan-15-3',
          prompt: 'Qual destas palavras tem exatamente três sílabas?',
          audioText: 'Qual destas palavras tem exatamente três sílabas?',
          options: ['es-co-la', 'sol', 'a-vi-ão-zi-nho'],
          correctAnswer: 'es-co-la',
          hint: 'Conta as sílabas de cada opção.',
        },
      ],
    },
  },
  {
    id: 'jan-familias-palavras',
    number: 19,
    title: 'Correspondência de famílias de palavras',
    gameTitle: 'Famílias de palavras',
    month: 'janeiro',
    competency: 'relacoes_semanticas',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Associar palavras da mesma família lexical.',
    simpleInstruction: 'Liga cada palavra da esquerda à palavra da mesma família à direita.',
    demonstrationExample: 'Exemplo: "flor" liga com "florista".',
    type: 'matching',
    levels: {
      1: [
        {
          id: 'jan-fam-1',
          prompt: 'Associa cada palavra à sua família:',
          pairs: [
            { left: 'livro', right: 'livraria' },
            { left: 'pão', right: 'padaria' },
            { left: 'mar', right: 'marinheiro' },
          ],
          hint: 'Procura as palavras que partilham a mesma raiz.',
        },
      ],
      2: [
        {
          id: 'jan-fam-2',
          prompt: 'Associa as palavras da mesma família:',
          pairs: [
            { left: 'jardim', right: 'jardineiro' },
            { left: 'carta', right: 'carteiro' },
            { left: 'peixe', right: 'peixaria' },
          ],
          hint: 'Pensa na profissão ou loja ligada a cada palavra.',
        },
      ],
      3: [
        {
          id: 'jan-fam-3',
          prompt: 'Liga as palavras derivadas da mesma família:',
          pairs: [
            { left: 'terra', right: 'terrestre' },
            { left: 'chuva', right: 'chuvoso' },
            { left: 'pedra', right: 'pedregulho' },
          ],
          hint: 'Observa o início comum de cada par.',
        },
      ],
    },
  },
  {
    id: 'jan-verbos-acao',
    number: 21,
    title: 'Identificação de verbos de ação',
    gameTitle: 'O que tens de fazer?',
    month: 'janeiro',
    competency: 'compreensao_instrucoes',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Identificar o verbo de ação numa instrução ou frase.',
    simpleInstruction: 'Descobre qual é a palavra que indica a ação a realizar.',
    demonstrationExample: 'Exemplo: Na frase "Pinta o círculo", a ação é "Pinta".',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'jan-21-1',
          prompt: 'Na instrução "Recorta a imagem com cuidado", qual é a ação?',
          audioText: 'Recorta a imagem com cuidado',
          visualEmoji: '✂️',
          options: ['Recorta', 'Imagem', 'Cuidado'],
          correctAnswer: 'Recorta',
          hint: 'O que tens de fazer com a tesoura?',
        },
      ],
      2: [
        {
          id: 'jan-21-2',
          prompt: 'Na frase "Os alunos sublinharam as respostas certas", qual é o verbo de ação?',
          audioText: 'Os alunos sublinharam as respostas certas',
          options: ['Sublinharam', 'Alunos', 'Certas'],
          correctAnswer: 'Sublinharam',
          hint: 'Procura a palavra que indica o que os alunos fizeram.',
        },
      ],
      3: [
        {
          id: 'jan-21-3',
          prompt: 'Na instrução "Compara os dois textos e escreve a diferença", quais são as duas ações?',
          audioText: 'Compara os dois textos e escreve a diferença',
          options: ['Compara e escreve', 'Dois e textos', 'Diferença'],
          correctAnswer: 'Compara e escreve',
          hint: 'São os dois verbos que dão ordens na frase.',
        },
      ],
    },
  },
  {
    id: 'jan-palavra-chave',
    number: 22,
    title: 'Identificação de palavras-chave',
    gameTitle: 'Descobre a palavra-chave',
    month: 'janeiro',
    competency: 'vocabulario',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Identificar a palavra mais importante para o sentido da frase.',
    simpleInstruction: 'Escolhe a palavra-chave que completa corretamente a frase.',
    demonstrationExample: 'Exemplo: "Para atravessar a rua olhamos para o semáforo."',
    type: 'fill_blank',
    levels: {
      1: [
        {
          id: 'jan-22-1',
          prompt: 'Completa: "Quando temos sede bebemos ________."',
          audioText: 'Quando temos sede bebemos...',
          options: ['água', 'pedras', 'cadernos'],
          correctAnswer: 'água',
          hint: 'O que matamos quando temos sede?',
        },
      ],
      2: [
        {
          id: 'jan-22-2',
          prompt: 'Completa: "Na biblioteca devemos falar em ________."',
          audioText: 'Na biblioteca devemos falar em...',
          options: ['silêncio', 'corrida', 'barulho'],
          correctAnswer: 'silêncio',
          hint: 'Como devemos estar num espaço de leitura?',
        },
      ],
      3: [
        {
          id: 'jan-22-3',
          prompt: 'Completa: "As plantas precisam de luz ________ para crescerem saudáveis."',
          audioText: 'As plantas precisam de luz...',
          options: ['solar', 'elétrica', 'lunar'],
          correctAnswer: 'solar',
          hint: 'Qual é a luz que vem do Sol?',
        },
      ],
    },
  },

  // ================= FEVEREIRO (restantes jogos) =================
  {
    id: 'fev-primeiro',
    number: 30,
    title: 'Organização temporal — Início',
    gameTitle: 'O que aconteceu primeiro?',
    month: 'fevereiro',
    competency: 'organizacao_discurso',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Identificar o acontecimento inicial numa sequência.',
    simpleInstruction: 'Escolhe o que acontece em primeiro lugar.',
    demonstrationExample: 'Exemplo: Antes de comer a fruta, lavamo-la.',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'fev-30-1',
          prompt: 'O que acontece primeiro quando vais dormir?',
          audioText: 'O que acontece primeiro quando vais dormir?',
          visualEmoji: '🌙',
          options: [
            'Vestir o pijama e lavar os dentes',
            'Acordar de manhã',
            'Tomar o pequeno-almoço',
          ],
          correctAnswer: 'Vestir o pijama e lavar os dentes',
          hint: 'Pensa no que fazes antes de te deitares na cama.',
        },
      ],
      2: [
        {
          id: 'fev-30-2',
          prompt: 'Numa viagem de comboio, o que acontece primeiro?',
          audioText: 'Numa viagem de comboio, o que acontece primeiro?',
          options: [
            'Comprar o bilhete na estação',
            'Sair na estação de destino',
            'Arrumar a mala em casa depois da viagem',
          ],
          correctAnswer: 'Comprar o bilhete na estação',
          hint: 'Sem bilhete não podemos entrar no comboio!',
        },
      ],
      3: [
        {
          id: 'fev-30-3',
          prompt: 'Para fazer um desenho, qual é a primeira etapa?',
          audioText: 'Para fazer um desenho, qual é a primeira etapa?',
          options: [
            'Escolher o tema e preparar o papel e os lápis',
            'Assinar o nome no canto da folha já pintada',
            'Guardar os lápis na caixa',
          ],
          correctAnswer: 'Escolher o tema e preparar o papel e os lápis',
          hint: 'O que fazemos antes de começar a riscar a folha?',
        },
      ],
    },
  },
  {
    id: 'fev-depois',
    number: 30,
    title: 'Sequenciação lógica — Continuidade',
    gameTitle: 'O que aconteceu depois?',
    month: 'fevereiro',
    competency: 'organizacao_discurso',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Antecipar e identificar o acontecimento seguinte.',
    simpleInstruction: 'Lê o início da situação e escolhe o que acontece depois.',
    demonstrationExample: 'Exemplo: Começou a chover -> As pessoas abriram os guarda-chuvas.',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'fev-dep-1',
          prompt: 'O Diogo deixou cair o copo de água no chão. O que aconteceu depois?',
          audioText: 'O Diogo deixou cair o copo de água no chão. O que aconteceu depois?',
          options: [
            'O chão ficou molhado e ele foi buscar um pano',
            'O copo voou pela janela',
            'Começou a nevar na cozinha',
          ],
          correctAnswer: 'O chão ficou molhado e ele foi buscar um pano',
          hint: 'O que acontece quando a água cai no chão?',
        },
      ],
      2: [
        {
          id: 'fev-dep-2',
          prompt: 'Tocou a campainha para o fim do recreio. O que aconteceu depois?',
          audioText: 'Tocou a campainha para o fim do recreio. O que aconteceu depois?',
          options: [
            'Os alunos formaram fila para entrar na sala de aula',
            'Os alunos foram dormir a sesta',
            'A escola fechou para férias',
          ],
          correctAnswer: 'Os alunos formaram fila para entrar na sala de aula',
          hint: 'O que fazemos quando termina o recreio?',
        },
      ],
      3: [
        {
          id: 'fev-dep-3',
          prompt: 'A Leonor terminou de ler o livro da biblioteca. O que deve fazer depois?',
          audioText: 'A Leonor terminou de ler o livro da biblioteca. O que deve fazer depois?',
          options: [
            'Devolver o livro na biblioteca para outros colegas lerem',
            'Esconder o livro na mochila para sempre',
            'Rasgar as páginas',
          ],
          correctAnswer: 'Devolver o livro na biblioteca para outros colegas lerem',
          hint: 'Os livros da biblioteca são partilhados por todos.',
        },
      ],
    },
  },
  {
    id: 'fev-completa-historia',
    number: 23,
    title: 'Reconto e completamento narrativo',
    gameTitle: 'Completa a história',
    month: 'fevereiro',
    competency: 'organizacao_discurso',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Completar narrativas curtas mantendo a coerência.',
    simpleInstruction: 'Escolhe a frase que completa melhor o final da história.',
    demonstrationExample: 'Exemplo: O cão perdeu o osso, procurou no jardim e encontrou-o.',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'fev-23-1',
          prompt: 'A gatinha Mimi subiu à árvore e teve medo de descer. Então, o bombeiro...',
          audioText: 'A gatinha Mimi subiu à árvore e teve medo de descer. Então, o bombeiro...',
          options: [
            'usou uma escada e ajudou a Mimi a descer em segurança',
            'subiu também e ficou lá a dormir',
            'foi comprar um gelado',
          ],
          correctAnswer: 'usou uma escada e ajudou a Mimi a descer em segurança',
          hint: 'Como ajudam os bombeiros quando um animal está num sítio alto?',
        },
      ],
      2: [
        {
          id: 'fev-23-2',
          prompt: 'O Rui queria fazer um bolo, mas faltavam ovos. Por isso, ele...',
          audioText: 'O Rui queria fazer um bolo, mas faltavam ovos. Por isso, ele...',
          options: [
            'foi à mercearia comprar ovos antes de começar',
            'colocou pedras na massa',
            'desistiu e foi jogar à bola',
          ],
          correctAnswer: 'foi à mercearia comprar ovos antes de começar',
          hint: 'O que fazemos quando falta um ingrediente?',
        },
      ],
      3: [
        {
          id: 'fev-23-3',
          prompt: 'Durante o passeio na serra, o grupo encontrou um trilho marcado com setas amarelas. Seguiram as setas e...',
          audioText: 'Durante o passeio na serra, o grupo encontrou um trilho marcado com setas amarelas. Seguiram as setas e...',
          options: [
            'chegaram ao miradouro onde observaram toda a paisagem',
            'perderam-se no fundo do mar',
            'encontraram um aeroporto',
          ],
          correctAnswer: 'chegaram ao miradouro onde observaram toda a paisagem',
          hint: 'Para onde costumam levar os trilhos na serra?',
        },
      ],
    },
  },
  {
    id: 'fev-lembra-responde',
    number: 26,
    title: 'Memória verbal auditiva',
    gameTitle: 'Lembra-te e responde',
    month: 'fevereiro',
    competency: 'memoria_verbal',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Reter sequências de palavras ouvidas e evocá-las.',
    simpleInstruction: 'Ouve a lista de palavras e responde qual delas foi dita.',
    demonstrationExample: 'Exemplo: "Maçã, pão, leite" -> Foi dita a palavra "pão".',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'fev-mem-1',
          prompt: 'Ouve com atenção: "Sol, mar, areia." — Qual destas palavras ouviste?',
          audioText: 'Sol, mar, areia.',
          options: ['Areia', 'Montanha', 'Neve'],
          correctAnswer: 'Areia',
          hint: 'Todas as palavras eram sobre a praia.',
        },
      ],
      2: [
        {
          id: 'fev-mem-2',
          prompt: 'Ouve: "Caderno, lápis, borracha, régua." — Qual destas NÃO estava na lista?',
          audioText: 'Caderno, lápis, borracha, régua.',
          options: ['Tesoura', 'Borracha', 'Régua'],
          correctAnswer: 'Tesoura',
          hint: 'Ouve outra vez e conta os quatro objetos.',
        },
      ],
      3: [
        {
          id: 'fev-mem-3',
          prompt: 'Ouve: "Segunda-feira, quarta-feira, sexta-feira." — Que dias foram ditos?',
          audioText: 'Segunda-feira, quarta-feira, sexta-feira.',
          options: [
            'Segunda, quarta e sexta',
            'Terça, quinta e sábado',
            'Segunda, terça e quarta',
          ],
          correctAnswer: 'Segunda, quarta e sexta',
          hint: 'São dias alternados da semana.',
        },
      ],
    },
  },
  {
    id: 'fev-conta-me',
    number: 24,
    title: 'Reconto de experiências e descrição guiada',
    gameTitle: 'Conta-me o que aconteceu',
    month: 'fevereiro',
    competency: 'organizacao_discurso',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Produzir enunciados completos sobre experiências pessoais.',
    simpleInstruction: 'Usa as perguntas orientadoras para contar uma experiência tua.',
    demonstrationExample: 'Exemplo: "No domingo fui ao parque com o meu pai e andei de baloiço."',
    type: 'guided_writing',
    levels: {
      1: [
        {
          id: 'fev-24-1',
          prompt: 'Conta o que fizeste no último fim de semana.',
          audioText: 'Conta o que fizeste no último fim de semana.',
          hint: 'Responde primeiro a "Onde foste?" e depois a "Com quem?".',
          guidingQuestions: [
            'Onde foste?',
            'Com quem estiveste?',
            'O que mais gostaste de fazer?',
          ],
          wordBank: ['No fim de semana', 'fui', 'com', 'brinquei', 'gostei muito'],
          sentenceStarter: 'No fim de semana, ',
          checklist: [
            'Disse onde estive?',
            'Disse o que fiz?',
          ],
        },
      ],
      2: [
        {
          id: 'fev-24-2',
          prompt: 'Descreve uma brincadeira de que gostas muito no recreio.',
          audioText: 'Descreve uma brincadeira de que gostas muito no recreio.',
          hint: 'Explica as regras simples da brincadeira.',
          guidingQuestions: [
            'Qual é o nome do jogo ou brincadeira?',
            'Quantos amigos participam?',
            'Como se joga?',
          ],
          wordBank: ['No recreio', 'gosto de jogar', 'amigos', 'primeiro', 'depois'],
          sentenceStarter: 'No recreio, gosto muito de ',
          checklist: [
            'Expliquei como se joga?',
            'Usei palavras para ordenar (primeiro, depois)?',
          ],
        },
      ],
      3: [
        {
          id: 'fev-24-3',
          prompt: 'Relata uma visita de estudo ou passeio marcante.',
          audioText: 'Relata uma visita de estudo ou passeio marcante.',
          hint: 'Organiza o relato por ordem temporal.',
          guidingQuestions: [
            'Onde foi a visita e quando aconteceu?',
            'O que observaste ou aprendeste?',
            'Porque foi importante para ti?',
          ],
          wordBank: ['Visitámos', 'observámos', 'aprendi que', 'no final'],
          sentenceStarter: 'Numa visita de estudo, ',
          checklist: [
            'Indiquei o local e o momento?',
            'Partilhei o que aprendi?',
          ],
        },
      ],
    },
  },
  {
    id: 'fev-organiza-imagens',
    number: 29,
    title: 'Mapas de ideias e associação visual',
    gameTitle: 'Organiza as imagens',
    month: 'fevereiro',
    competency: 'organizacao_discurso',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Associar cenários aos elementos que lhes pertencem.',
    simpleInstruction: 'Liga cada lugar ao elemento que lá encontramos.',
    demonstrationExample: 'Exemplo: "Praia" liga com "Conchas".',
    type: 'matching',
    levels: {
      1: [
        {
          id: 'fev-img-1',
          prompt: 'Liga cada lugar ao seu elemento:',
          pairs: [
            { left: '🏖️ Praia', right: 'Conchas e ondas' },
            { left: '🏫 Escola', right: 'Quadros e livros' },
            { left: '🌳 Floresta', right: 'Árvores e esquilos' },
          ],
          hint: 'Imagina cada cenário na tua cabeça.',
        },
      ],
      2: [
        {
          id: 'fev-img-2',
          prompt: 'Associa cada momento do dia à atividade habitual:',
          pairs: [
            { left: '🌅 Manhã', right: 'Tomar o pequeno-almoço' },
            { left: '☀️ Tarde', right: 'Fazer os trabalhos de casa' },
            { left: '🌙 Noite', right: 'Ler uma história antes de dormir' },
          ],
          hint: 'Pensa na rotina do dia.',
        },
      ],
      3: [
        {
          id: 'fev-img-3',
          prompt: 'Associa cada estação do ano à sua característica:',
          pairs: [
            { left: '🌸 Primavera', right: 'Florescem as árvores' },
            { left: '☀️ Verão', right: 'Dias longos e quentes' },
            { left: '🍂 Outono', right: 'Caem as folhas secas' },
          ],
          hint: 'Observa as mudanças na natureza.',
        },
      ],
    },
  },

  // ================= MARÇO (restantes jogos) =================
  {
    id: 'mar-o-que-e-pedido',
    number: 31,
    title: 'Compreensão da pergunta do problema',
    gameTitle: 'Descobre o que é pedido',
    month: 'marco',
    competency: 'compreensao_textos',
    curriculumArea: 'Matemática',
    pedagogicalObjective: 'Identificar exatamente o que o enunciado pede para descobrir.',
    simpleInstruction: 'Lê o enunciado e seleciona a pergunta correta.',
    demonstrationExample: 'Exemplo: Se queremos saber o total, perguntamos "Quantos há ao todo?".',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'mar-31-1',
          prompt: 'A Sofia tinha 6 cromos e deu 2 ao irmão. O que queremos descobrir?',
          audioText: 'A Sofia tinha 6 cromos e deu 2 ao irmão. O que queremos descobrir?',
          options: [
            'Com quantos cromos ficou a Sofia',
            'Qual é a cor dos cromos',
            'Onde mora o irmão',
          ],
          correctAnswer: 'Com quantos cromos ficou a Sofia',
          hint: 'Se ela deu cromos, queremos saber com quantos ficou.',
        },
      ],
      2: [
        {
          id: 'mar-31-2',
          prompt: 'Num autocarro viajavam 18 passageiros. Na paragem entraram mais 5. O que é pedido?',
          audioText: 'Num autocarro viajavam 18 passageiros. Na paragem entraram mais 5. O que é pedido?',
          options: [
            'Quantos passageiros ficaram no autocarro',
            'Qual é o nome do motorista',
            'A que horas partiu o autocarro',
          ],
          correctAnswer: 'Quantos passageiros ficaram no autocarro',
          hint: 'Os números dizem respeito aos passageiros.',
        },
      ],
      3: [
        {
          id: 'mar-31-3',
          prompt: 'O Pedro leu 12 páginas ontem e 15 páginas hoje. O que podemos calcular com estes dados?',
          audioText: 'O Pedro leu 12 páginas ontem e 15 páginas hoje. O que podemos calcular com estes dados?',
          options: [
            'Quantas páginas leu o Pedro nos dois dias',
            'Quantos livros tem a biblioteca',
            'Qual é o título do livro',
          ],
          correctAnswer: 'Quantas páginas leu o Pedro nos dois dias',
          hint: 'Temos o número de páginas de ontem e de hoje.',
        },
      ],
    },
  },
  {
    id: 'mar-le-pensa-responde',
    number: 31,
    title: 'Compreensão explícita de textos',
    gameTitle: 'Lê, pensa e responde',
    month: 'marco',
    competency: 'compreensao_textos',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Localizar informação explícita num texto curto.',
    simpleInstruction: 'Lê o texto com atenção e responde à pergunta.',
    demonstrationExample: 'Exemplo: A resposta está escrita diretamente no texto.',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'mar-lpr-1',
          prompt: 'Texto: "O camaleão muda de cor para se esconder dos predadores." — Porque muda de cor o camaleão?',
          audioText: 'O camaleão muda de cor para se esconder dos predadores. Porque muda de cor o camaleão?',
          options: [
            'Para se esconder dos predadores',
            'Para dormir melhor',
            'Para nadar mais depressa',
          ],
          correctAnswer: 'Para se esconder dos predadores',
          hint: 'Lê a segunda metade da frase.',
        },
      ],
      2: [
        {
          id: 'mar-lpr-2',
          prompt: 'Texto: "As abelhas recolhem o néctar das flores para produzir mel na colmeia." — Onde produzem o mel?',
          audioText: 'As abelhas recolhem o néctar das flores para produzir mel na colmeia. Onde produzem o mel?',
          options: ['Na colmeia', 'Debaixo da terra', 'No rio'],
          correctAnswer: 'Na colmeia',
          hint: 'Procura as duas últimas palavras da frase.',
        },
      ],
      3: [
        {
          id: 'mar-lpr-3',
          prompt: 'Texto: "Os castores constroem diques nos rios usando ramos de árvores e lama." — Que materiais usam os castores?',
          audioText: 'Os castores constroem diques nos rios usando ramos de árvores e lama. Que materiais usam os castores?',
          options: [
            'Ramos de árvores e lama',
            'Pedras e cimento',
            'Folhas secas e areia',
          ],
          correctAnswer: 'Ramos de árvores e lama',
          hint: 'Vê o que vem a seguir à palavra "usando".',
        },
      ],
    },
  },
  {
    id: 'mar-organiza-informacao',
    number: 35,
    title: 'Utilização de esquemas e divisão em etapas',
    gameTitle: 'Organiza a informação',
    month: 'marco',
    competency: 'compreensao_textos',
    curriculumArea: 'Estudo do Meio',
    pedagogicalObjective: 'Organizar informação curricular por categorias.',
    simpleInstruction: 'Liga cada ser vivo ao seu grupo.',
    demonstrationExample: 'Exemplo: "Sardinha" liga com "Peixe".',
    type: 'matching',
    levels: {
      1: [
        {
          id: 'mar-org-1',
          prompt: 'Associa cada animal ao seu grupo:',
          pairs: [
            { left: '🦅 Águia', right: 'Ave (tem penas)' },
            { left: '🐕 Cão', right: 'Mamífero (tem pelo)' },
            { left: '🐟 Sardinha', right: 'Peixe (tem escamas)' },
          ],
          hint: 'Observa como está coberto o corpo de cada animal.',
        },
      ],
      2: [
        {
          id: 'mar-org-2',
          prompt: 'Associa cada órgão dos sentidos à sua função:',
          pairs: [
            { left: '👁️ Olhos', right: 'Visão (ver cores e formas)' },
            { left: '👂 Ouvidos', right: 'Audição (ouvir sons)' },
            { left: '👃 Nariz', right: 'Olfato (sentir cheiros)' },
          ],
          hint: 'Pensa no sentido ligado a cada órgão.',
        },
      ],
      3: [
        {
          id: 'mar-org-3',
          prompt: 'Associa cada resíduo ao ecoponto correto:',
          pairs: [
            { left: 'Caixa de cartão', right: 'Ecoponto Azul' },
            { left: 'Garrafa de plástico', right: 'Ecoponto Amarelo' },
            { left: 'Frasco de vidro', right: 'Ecoponto Verde' },
          ],
          hint: 'Azul = papel/cartão; Amarelo = embalagens; Verde = vidro.',
        },
      ],
    },
  },
  {
    id: 'mar-resolve-passo',
    number: 36,
    title: 'Resolução orientada de problemas',
    gameTitle: 'Resolve passo a passo',
    month: 'marco',
    competency: 'compreensao_textos',
    curriculumArea: 'Matemática',
    pedagogicalObjective: 'Ordenar as etapas de resolução de um problema.',
    simpleInstruction: 'Ordena os passos para resolver um problema sem erros.',
    demonstrationExample: 'Exemplo: 1. Ler -> 2. Sublinhar dados -> 3. Calcular -> 4. Responder.',
    type: 'sequence_order',
    levels: {
      1: [
        {
          id: 'mar-pas-1',
          prompt: 'Ordena os 3 passos para resolver um problema:',
          scrambledItems: [
            'Escrever a resposta completa.',
            'Ler o problema com atenção.',
            'Fazer a conta.',
          ],
          correctOrder: [
            'Ler o problema com atenção.',
            'Fazer a conta.',
            'Escrever a resposta completa.',
          ],
          hint: 'Primeiro lemos, depois calculamos e no fim respondemos.',
        },
      ],
      2: [
        {
          id: 'mar-pas-2',
          prompt: 'Ordena as etapas de resolução:',
          scrambledItems: [
            'Verificar se a resposta faz sentido.',
            'Sublinhar os dados importantes e a pergunta.',
            'Escolher a operação (somar ou subtrair).',
          ],
          correctOrder: [
            'Sublinhar os dados importantes e a pergunta.',
            'Escolher a operação (somar ou subtrair).',
            'Verificar se a resposta faz sentido.',
          ],
          hint: 'A verificação faz-se sempre no final.',
        },
      ],
      3: [
        {
          id: 'mar-pas-3',
          prompt: 'Ordena o plano completo de resolução:',
          scrambledItems: [
            'Redigir a resposta final.',
            'Ler o enunciado e dividir em etapas.',
            'Identificar os dados relevantes.',
            'Executar a estratégia escolhida.',
          ],
          correctOrder: [
            'Ler o enunciado e dividir em etapas.',
            'Identificar os dados relevantes.',
            'Executar a estratégia escolhida.',
            'Redigir a resposta final.',
          ],
          hint: 'Começa pela leitura e termina na redação da resposta.',
        },
      ],
    },
  },
  {
    id: 'mar-qual-pergunta',
    number: 33,
    title: 'Distinção entre dados e pergunta',
    gameTitle: 'Qual é a pergunta?',
    month: 'marco',
    competency: 'compreensao_textos',
    curriculumArea: 'Matemática',
    pedagogicalObjective: 'Completar um problema escolhendo a pergunta adequada.',
    simpleInstruction: 'Lê os dados e escolhe a pergunta que faz sentido.',
    demonstrationExample: 'Exemplo: "Tenho 3 maçãs e 2 peras." -> "Quantas frutas tenho ao todo?"',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'mar-qp-1',
          prompt: 'Dados: "A Maria tem 5 lápis de cor e 3 lápis de carvão." — Qual é a pergunta?',
          options: [
            'Quantos lápis tem a Maria ao todo?',
            'Quantas borrachas tem o João?',
            'De que cor é a mochila?',
          ],
          correctAnswer: 'Quantos lápis tem a Maria ao todo?',
          hint: 'Os dados falam apenas dos lápis da Maria.',
        },
      ],
      2: [
        {
          id: 'mar-qp-2',
          prompt: 'Dados: "Numa árvore estavam 10 pássaros. Voaram 4 pássaros." — Qual é a pergunta?',
          options: [
            'Quantos pássaros ficaram na árvore?',
            'Quantas folhas tinha a árvore?',
            'Para onde voaram?',
          ],
          correctAnswer: 'Quantos pássaros ficaram na árvore?',
          hint: 'Sabemos quantos estavam e quantos voaram.',
        },
      ],
      3: [
        {
          id: 'mar-qp-3',
          prompt: 'Dados: "Cada caixa leva 6 ovos. A avó comprou 3 caixas." — Qual é a pergunta?',
          options: [
            'Quantos ovos comprou a avó ao todo?',
            'Quanto custou o pão?',
            'A que horas abriu a loja?',
          ],
          correctAnswer: 'Quantos ovos comprou a avó ao todo?',
          hint: 'Temos o número de caixas e quantos ovos leva cada uma.',
        },
      ],
    },
  },
  {
    id: 'mar-explica-pensaste',
    number: 37,
    title: 'Explicação do raciocínio',
    gameTitle: 'Explica como pensaste',
    month: 'marco',
    competency: 'organizacao_discurso',
    curriculumArea: 'Matemática',
    pedagogicalObjective: 'Explicar por palavras próprias o raciocínio usado.',
    simpleInstruction: 'Lê o problema e explica como chegaste à resposta.',
    demonstrationExample: 'Exemplo: "Como tinha 5 e ganhou 2, juntei 5 + 2 = 7."',
    type: 'guided_writing',
    levels: {
      1: [
        {
          id: 'mar-exp-1',
          prompt: 'O Tiago tinha 4 berlindes e ganhou mais 3. Ficou com 7. Explica como pensaste.',
          guidingQuestions: ['Quantos tinha no início?', 'Juntaste ou tiraste?'],
          wordBank: ['Primeiro', 'tinha', 'ganhou', 'juntei', 'ficou com'],
          sentenceStarter: 'Primeiro o Tiago tinha ',
          checklist: ['Expliquei se juntei ou tirei?'],
          hint: 'Usa as palavras "tinha", "ganhou" e "juntei".',
        },
      ],
      2: [
        {
          id: 'mar-exp-2',
          prompt: 'Num cesto havia 12 pães e venderam-se 5. Sobraram 7. Explica o teu raciocínio.',
          guidingQuestions: ['Qual era o total inicial?', 'Que operação usaste?'],
          wordBank: ['Havia', 'venderam-se', 'subtraí', 'sobraram'],
          sentenceStarter: 'Como havia 12 pães e ',
          checklist: ['Indiquei os dados e o resultado?'],
          hint: 'Explica porque usaste a subtração.',
        },
      ],
      3: [
        {
          id: 'mar-exp-3',
          prompt: 'Explica como descobres a ideia principal de um texto de Estudo do Meio.',
          guidingQuestions: ['O que fazes primeiro?', 'Como identificas as palavras-chave?'],
          wordBank: ['Primeiro leio', 'sublinho', 'palavras-chave', 'resumo'],
          sentenceStarter: 'Para descobrir a ideia principal, ',
          checklist: ['Descrevi os passos por ordem?'],
          hint: 'Fala sobre ler, sublinhar e resumir.',
        },
      ],
    },
  },

  // ================= ABRIL (restantes jogos) =================
  {
    id: 'abr-organiza-palavras',
    number: 43,
    title: 'Ordenação sintática',
    gameTitle: 'Organiza as palavras',
    month: 'abril',
    competency: 'producao_escrita',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Ordenar palavras para formar frases corretas.',
    simpleInstruction: 'Clica nas palavras pela ordem certa.',
    demonstrationExample: 'Exemplo: [O] [sol] [brilha.] -> "O sol brilha."',
    type: 'word_order',
    levels: {
      1: [
        {
          id: 'abr-org-1',
          prompt: 'Ordena as palavras:',
          scrambledItems: ['flores.', 'As', 'abrem', 'na', 'primavera'],
          correctOrder: ['As', 'flores', 'abrem', 'na', 'primavera.'],
          hint: 'Começa por "As" (maiúscula) e acaba em "primavera.".',
        },
      ],
      2: [
        {
          id: 'abr-org-2',
          prompt: 'Ordena as palavras:',
          scrambledItems: ['biblioteca.', 'Lemos', 'livros', 'na', 'novos'],
          correctOrder: ['Lemos', 'novos', 'livros', 'na', 'biblioteca.'],
          hint: 'Começa pelo verbo "Lemos".',
        },
      ],
      3: [
        {
          id: 'abr-org-3',
          prompt: 'Ordena as palavras:',
          scrambledItems: [
            'atentamente',
            'Os',
            'ouviram',
            'história.',
            'alunos',
            'a',
          ],
          correctOrder: [
            'Os',
            'alunos',
            'ouviram',
            'atentamente',
            'a',
            'história.',
          ],
          hint: 'Sujeito: "Os alunos". Verbo: "ouviram".',
        },
      ],
    },
  },
  {
    id: 'abr-completa-texto',
    number: 44,
    title: 'Utilização de estruturas-modelo',
    gameTitle: 'Completa o texto',
    month: 'abril',
    competency: 'producao_escrita',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Completar textos curtos usando conectores adequados.',
    simpleInstruction: 'Escolhe a expressão que completa o texto com sentido.',
    demonstrationExample: 'Exemplo: "Era uma vez um gato. Um dia, ele encontrou um rato."',
    type: 'fill_blank',
    levels: {
      1: [
        {
          id: 'abr-44-1',
          prompt: 'Completa: "________, a Maria acordou cedo e foi para a escola."',
          options: ['De manhã', 'À meia-noite', 'No próximo ano'],
          correctAnswer: 'De manhã',
          hint: 'A que altura do dia vamos para a escola?',
        },
      ],
      2: [
        {
          id: 'abr-44-2',
          prompt: 'Completa: "O João procurou o livro na mochila. ________, encontrou-o debaixo da mesa."',
          options: ['Finalmente', 'Ontem', 'Nunca'],
          correctAnswer: 'Finalmente',
          hint: 'Que palavra usamos quando conseguimos encontrar algo depois de procurar?',
        },
      ],
      3: [
        {
          id: 'abr-44-3',
          prompt: 'Completa: "Estava muito vento; ________, os alunos decidiram lanchar dentro da sala."',
          options: ['por isso', 'antes disso', 'apesar'],
          correctAnswer: 'por isso',
          hint: 'Indica a consequência de estar muito vento.',
        },
      ],
    },
  },
  {
    id: 'abr-palavra-falta',
    number: 41,
    title: 'Bancos de palavras em contexto',
    gameTitle: 'Descobre a palavra que falta',
    month: 'abril',
    competency: 'vocabulario',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Selecionar o vocabulário adequado ao contexto da frase.',
    simpleInstruction: 'Escolhe a palavra que completa corretamente a frase.',
    demonstrationExample: 'Exemplo: "O padeiro faz o pão no forno."',
    type: 'fill_blank',
    levels: {
      1: [
        {
          id: 'abr-41-1',
          prompt: 'Completa: "O ________ trata dos animais doentes."',
          options: ['veterinário', 'bombeiro', 'carteiro'],
          correctAnswer: 'veterinário',
          hint: 'Qual é o médico dos animais?',
        },
      ],
      2: [
        {
          id: 'abr-41-2',
          prompt: 'Completa: "Usamos o ________ para procurar o significado das palavras."',
          options: ['dicionário', 'compasso', 'termómetro'],
          correctAnswer: 'dicionário',
          hint: 'É um livro onde as palavras estão por ordem alfabética.',
        },
      ],
      3: [
        {
          id: 'abr-41-3',
          prompt: 'Completa: "Antes de entregar o texto, devemos ________ a ortografia."',
          options: ['rever', 'esquecer', 'apagar'],
          correctAnswer: 'rever',
          hint: 'O que fazemos na última etapa da escrita?',
        },
      ],
    },
  },
  {
    id: 'abr-ordena-escreve',
    number: 38,
    title: 'Planos de texto e sequências',
    gameTitle: 'Ordena e escreve',
    month: 'abril',
    competency: 'producao_escrita',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Organizar as partes de um texto (Introdução, Desenvolvimento, Conclusão).',
    simpleInstruction: 'Ordena as três partes de uma pequena história.',
    demonstrationExample: 'Exemplo: 1. Início -> 2. Acontecimento -> 3. Fim.',
    type: 'sequence_order',
    levels: {
      1: [
        {
          id: 'abr-38-1',
          prompt: 'Ordena as partes da história:',
          scrambledItems: [
            'Por fim, voltaram para casa felizes.',
            'Era uma vez dois amigos que foram ao parque.',
            'Lá, encontraram um cãozinho perdido e ajudaram-no.',
          ],
          correctOrder: [
            'Era uma vez dois amigos que foram ao parque.',
            'Lá, encontraram um cãozinho perdido e ajudaram-no.',
            'Por fim, voltaram para casa felizes.',
          ],
          hint: 'Começa por "Era uma vez" e termina com "Por fim".',
        },
      ],
      2: [
        {
          id: 'abr-38-2',
          prompt: 'Ordena a estrutura de um texto informativo:',
          scrambledItems: [
            'Conclusão: Importância de proteger este animal.',
            'Introdução: Apresentação do animal e onde vive.',
            'Desenvolvimento: O que come e como se desloca.',
          ],
          correctOrder: [
            'Introdução: Apresentação do animal e onde vive.',
            'Desenvolvimento: O que come e como se desloca.',
            'Conclusão: Importância de proteger este animal.',
          ],
          hint: 'Introdução -> Desenvolvimento -> Conclusão.',
        },
      ],
      3: [
        {
          id: 'abr-38-3',
          prompt: 'Ordena as etapas da planificação escrita:',
          scrambledItems: [
            'Rever o texto com a lista de verificação.',
            'Escolher o tema e anotar ideias no plano.',
            'Escrever o rascunho ligando as frases.',
          ],
          correctOrder: [
            'Escolher o tema e anotar ideias no plano.',
            'Escrever o rascunho ligando as frases.',
            'Rever o texto com a lista de verificação.',
          ],
          hint: 'Planear -> Escrever -> Rever.',
        },
      ],
    },
  },
  {
    id: 'abr-quem-que-onde',
    number: 40,
    title: 'Expansão frásica guiada',
    gameTitle: 'Quem? O quê? Onde?',
    month: 'abril',
    competency: 'producao_escrita',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Construir frases completas respondendo a Quem, O quê e Onde.',
    simpleInstruction: 'Escreve uma frase completa usando as três pistas.',
    demonstrationExample: 'Exemplo: Quem: A Marta | O quê: pinta um quadro | Onde: na sala.',
    type: 'guided_writing',
    levels: {
      1: [
        {
          id: 'abr-40-1',
          prompt: 'Constrói uma frase com: Quem (O gato) + O quê (dorme) + Onde (no sofá).',
          guidingQuestions: ['Quem?', 'O que faz?', 'Onde?'],
          wordBank: ['O gato', 'dorme', 'no sofá', 'macio'],
          sentenceStarter: 'O gato ',
          checklist: ['Usei letra maiúscula no início e ponto final?'],
          hint: 'Junta as três partes numa frase seguida.',
        },
      ],
      2: [
        {
          id: 'abr-40-2',
          prompt: 'Expande a frase dizendo Quando, Quem, O quê e Onde.',
          guidingQuestions: ['Quando?', 'Quem?', 'O quê?', 'Onde?'],
          wordBank: ['De manhã', 'os alunos', 'leem', 'na biblioteca'],
          sentenceStarter: 'De manhã, ',
          checklist: ['Respondi às quatro perguntas?'],
          hint: 'Começa por "De manhã, os alunos...".',
        },
      ],
      3: [
        {
          id: 'abr-40-3',
          prompt: 'Cria duas frases ligadas sobre uma atividade na escola.',
          guidingQuestions: ['Quem participou e onde?', 'O que descobriram?'],
          wordBank: ['Na aula de Estudo do Meio', 'observámos', 'plantas', 'descobrimos'],
          sentenceStarter: 'Na aula de Estudo do Meio, ',
          checklist: ['As duas frases têm sentido e pontuação?'],
          hint: 'Usa os verbos "observámos" e "descobrimos".',
        },
      ],
    },
  },
  {
    id: 'abr-detetives-escrita',
    number: 46,
    title: 'Revisão com lista de verificação',
    gameTitle: 'Detetives da escrita',
    month: 'abril',
    competency: 'producao_escrita',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Identificar e corrigir erros simples de pontuação e ortografia.',
    simpleInstruction: 'Descobre qual das frases está escrita corretamente.',
    demonstrationExample: 'Exemplo: "O cão ladra." (com maiúscula e ponto final).',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'abr-46-1',
          prompt: 'Qual destas frases está escrita corretamente?',
          options: [
            'A Beatriz gosta de ler.',
            'a beatriz gosta de ler',
            'A Beatriz gosta deler.',
          ],
          correctAnswer: 'A Beatriz gosta de ler.',
          hint: 'Verifica a letra maiúscula no início e o ponto final.',
        },
      ],
      2: [
        {
          id: 'abr-46-2',
          prompt: 'Qual destas frases tem a pontuação correta?',
          options: [
            'Comprei maçãs, peras e bananas.',
            'Comprei maçãs peras e bananas',
            'comprei maçãs, peras, e bananas',
          ],
          correctAnswer: 'Comprei maçãs, peras e bananas.',
          hint: 'Nas enumerações usamos vírgula entre os primeiros elementos.',
        },
      ],
      3: [
        {
          id: 'abr-46-3',
          prompt: 'Qual destas frases está totalmente correta?',
          options: [
            'Ontem, os meninos foram ao jardim.',
            'Ontem, os meninos foi ao jardim.',
            'ontem os meninos foram ao jardim.',
          ],
          correctAnswer: 'Ontem, os meninos foram ao jardim.',
          hint: 'Verifica a concordância entre "os meninos" e o verbo.',
        },
      ],
    },
  },

  // ================= MAIO (restantes jogos) =================
  {
    id: 'mai-recurso-certo',
    number: 48,
    title: 'Seleção de recursos de apoio',
    gameTitle: 'Descobre o recurso certo',
    month: 'maio',
    competency: 'autonomia',
    curriculumArea: 'Transversal',
    pedagogicalObjective: 'Escolher o recurso de apoio mais adequado a cada necessidade.',
    simpleInstruction: 'Liga cada necessidade ao recurso que melhor ajuda.',
    demonstrationExample: 'Exemplo: "Não sei o significado" -> "Glossário".',
    type: 'matching',
    levels: {
      1: [
        {
          id: 'mai-48-1',
          prompt: 'Liga cada situação ao recurso certo:',
          pairs: [
            { left: 'Não conheço uma palavra', right: 'Consultar o Glossário' },
            { left: 'Canso-me a ler um texto longo', right: 'Usar o Apoio Áudio' },
            { left: 'Não sei como começar a escrever', right: 'Usar um Guião de Escrita' },
          ],
          hint: 'Pensa no que cada ferramenta faz.',
        },
      ],
      2: [
        {
          id: 'mai-48-2',
          prompt: 'Associa cada tarefa ao organizador adequado:',
          pairs: [
            { left: 'Ordenar factos no tempo', right: 'Linha Temporal' },
            { left: 'Rever um texto escrito', right: 'Lista de Verificação' },
            { left: 'Escolher palavras novas', right: 'Banco de Palavras' },
          ],
          hint: 'Cada recurso apoia uma fase do trabalho.',
        },
      ],
      3: [
        {
          id: 'mai-48-3',
          prompt: 'Associa cada dificuldade à estratégia autónoma:',
          pairs: [
            { left: 'Enunciado complexo', right: 'Dividir em etapas' },
            { left: 'Dúvida ortográfica', right: 'Consultar o dicionário' },
            { left: 'Preparar apresentação oral', right: 'Fazer mapa de ideias' },
          ],
          hint: 'Pensa em como resolverias sozinho(a).',
        },
      ],
    },
  },
  {
    id: 'mai-consulta-glossario',
    number: 47,
    title: 'Uso do glossário pessoal',
    gameTitle: 'Consulta o teu glossário',
    month: 'maio',
    competency: 'vocabulario',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Associar palavras curriculares às suas definições.',
    simpleInstruction: 'Liga cada palavra ao seu significado.',
    demonstrationExample: 'Exemplo: "Autonomia" -> "Capacidade de realizar tarefas com independência".',
    type: 'matching',
    levels: {
      1: [
        {
          id: 'mai-47-1',
          prompt: 'Associa cada palavra ao seu significado:',
          pairs: [
            { left: 'Sinónimo', right: 'Palavra com significado semelhante' },
            { left: 'Antónimo', right: 'Palavra com significado contrário' },
            { left: 'Reconto', right: 'Contar uma história por palavras próprias' },
          ],
          hint: 'Lembra-te das atividades de Janeiro e Fevereiro.',
        },
      ],
      2: [
        {
          id: 'mai-47-2',
          prompt: 'Associa os termos escolares:',
          pairs: [
            { left: 'Enunciado', right: 'Texto que explica o que é pedido' },
            { left: 'Estratégia', right: 'Plano para resolver um desafio' },
            { left: 'Parágrafo', right: 'Parte de um texto com uma ideia' },
          ],
          hint: 'Lê com atenção cada definição.',
        },
      ],
      3: [
        {
          id: 'mai-47-3',
          prompt: 'Associa os conceitos de leitura e escrita:',
          pairs: [
            { left: 'Fluência', right: 'Leitura expressiva e com ritmo' },
            { left: 'Coerência', right: 'Ligação lógica entre as ideias' },
            { left: 'Revisão', right: 'Verificação e melhoria do texto' },
          ],
          hint: 'Pensa no que significa cada competência.',
        },
      ],
    },
  },
  {
    id: 'mai-resolve-etapas',
    number: 50,
    title: 'Problemas lidos com apoio áudio',
    gameTitle: 'Resolve por etapas',
    month: 'maio',
    competency: 'compreensao_textos',
    curriculumArea: 'Matemática',
    pedagogicalObjective: 'Compreender problemas ouvidos e resolver por etapas.',
    simpleInstruction: 'Ouve o problema com atenção e escolhe a resposta certa.',
    demonstrationExample: 'Exemplo: Ouve os números, pensa na pergunta e responde.',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'mai-50-1',
          prompt: 'Ouve: "A Ana tinha 8 lápis e emprestou 3 ao colega. Com quantos lápis ficou?"',
          audioText: 'A Ana tinha 8 lápis e emprestou 3 ao colega. Com quantos lápis ficou?',
          options: ['5 lápis', '11 lápis', '3 lápis'],
          correctAnswer: '5 lápis',
          hint: 'Se emprestou 3, tira 3 a 8.',
        },
      ],
      2: [
        {
          id: 'mai-50-2',
          prompt: 'Ouve: "Numa prateleira há 10 livros de aventuras e 7 livros de poesia. Quantos livros há ao todo?"',
          audioText: 'Numa prateleira há 10 livros de aventuras e 7 livros de poesia. Quantos livros há ao todo?',
          options: ['17 livros', '3 livros', '10 livros'],
          correctAnswer: '17 livros',
          hint: 'Junta 10 com 7.',
        },
      ],
      3: [
        {
          id: 'mai-50-3',
          prompt: 'Ouve: "O Duarte leu 6 páginas na segunda-feira e o dobro na terça-feira. Quantas páginas leu na terça-feira?"',
          audioText: 'O Duarte leu 6 páginas na segunda-feira e o dobro na terça-feira. Quantas páginas leu na terça-feira?',
          options: ['12 páginas', '8 páginas', '3 páginas'],
          correctAnswer: '12 páginas',
          hint: 'O dobro de 6 é 6 + 6.',
        },
      ],
    },
  },
  {
    id: 'mai-explica-fizeste',
    number: 51,
    title: 'Apresentações orais e procedimentos',
    gameTitle: 'Explica como fizeste',
    month: 'maio',
    competency: 'autonomia',
    curriculumArea: 'Transversal',
    pedagogicalObjective: 'Explicar procedimentos realizados com menor dependência do adulto.',
    simpleInstruction: 'Prepara uma pequena explicação sobre como realizaste uma tarefa.',
    demonstrationExample: 'Exemplo: "Primeiro li a instrução, depois usei o banco de palavras."',
    type: 'guided_writing',
    levels: {
      1: [
        {
          id: 'mai-51-1',
          prompt: 'Explica a um colega como usas o apoio áudio na plataforma.',
          guidingQuestions: ['Onde clicas para ouvir?', 'Como te ajuda?'],
          wordBank: ['Clico no botão', 'ouvir', 'ajuda-me a', 'compreender'],
          sentenceStarter: 'Para ouvir as instruções, eu ',
          checklist: ['Expliquei o passo de forma clara?'],
          hint: 'Diz onde clicas e para que serve.',
        },
      ],
      2: [
        {
          id: 'mai-51-2',
          prompt: 'Explica como organizas as tuas ideias antes de escrever um texto.',
          guidingQuestions: ['Que recursos escolhes?', 'Qual é a ordem dos passos?'],
          wordBank: ['Primeiro', 'escolho', 'banco de palavras', 'depois escrevo'],
          sentenceStarter: 'Antes de escrever um texto, ',
          checklist: ['Indiquei pelo menos dois passos?'],
          hint: 'Fala sobre o plano e o banco de palavras.',
        },
      ],
      3: [
        {
          id: 'mai-51-3',
          prompt: 'Apresenta uma estratégia que aprendeste este ano e que usas noutras disciplinas.',
          guidingQuestions: ['Qual é a estratégia?', 'Em que disciplina a usas?'],
          wordBank: ['A estratégia de', 'uso em', 'Matemática', 'Estudo do Meio', 'ajuda-me'],
          sentenceStarter: 'Uma estratégia muito útil que aprendi é ',
          checklist: ['Expliquei onde aplico a estratégia?'],
          hint: 'Dá um exemplo prático.',
        },
      ],
    },
  },
  {
    id: 'mai-tres-etapas',
    number: 49,
    title: 'Organizadores gráficos em três etapas',
    gameTitle: 'O desafio das três etapas',
    month: 'maio',
    competency: 'autonomia',
    curriculumArea: 'Transversal',
    pedagogicalObjective: 'Estruturar qualquer tarefa escolar em Antes, Durante e Depois.',
    simpleInstruction: 'Ordena as ações nas três etapas do trabalho autónomo.',
    demonstrationExample: 'Exemplo: 1. Antes (Preparar) -> 2. Durante (Executar) -> 3. Depois (Rever).',
    type: 'sequence_order',
    levels: {
      1: [
        {
          id: 'mai-49-1',
          prompt: 'Ordena as 3 etapas de uma tarefa:',
          scrambledItems: [
            'Depois: Rever o que fiz.',
            'Antes: Ler a instrução com calma.',
            'Durante: Resolver passo a passo.',
          ],
          correctOrder: [
            'Antes: Ler a instrução com calma.',
            'Durante: Resolver passo a passo.',
            'Depois: Rever o que fiz.',
          ],
          hint: 'Antes -> Durante -> Depois.',
        },
      ],
      2: [
        {
          id: 'mai-49-2',
          prompt: 'Ordena as etapas de uma leitura autónoma:',
          scrambledItems: [
            'Depois: Explicar a ideia principal.',
            'Antes: Observar o título e as imagens.',
            'Durante: Sublinhar palavras-chave.',
          ],
          correctOrder: [
            'Antes: Observar o título e as imagens.',
            'Durante: Sublinhar palavras-chave.',
            'Depois: Explicar a ideia principal.',
          ],
          hint: 'O título observa-se antes de ler o texto.',
        },
      ],
      3: [
        {
          id: 'mai-49-3',
          prompt: 'Ordena as etapas de um projeto de grupo:',
          scrambledItems: [
            'Depois: Apresentar o trabalho à turma.',
            'Antes: Distribuir tarefas pelos colegas.',
            'Durante: Pesquisar e organizar a informação.',
          ],
          correctOrder: [
            'Antes: Distribuir tarefas pelos colegas.',
            'Durante: Pesquisar e organizar a informação.',
            'Depois: Apresentar o trabalho à turma.',
          ],
          hint: 'Primeiro combinam-se as tarefas, depois pesquisa-se e no fim apresenta-se.',
        },
      ],
    },
  },
  {
    id: 'mai-aprende-aplica',
    number: 54,
    title: 'Aplicação das aprendizagens em novos contextos',
    gameTitle: 'Aprende e aplica',
    month: 'maio',
    competency: 'autonomia',
    curriculumArea: 'Estudo do Meio',
    pedagogicalObjective: 'Transferir estratégias de leitura para situações do dia a dia.',
    simpleInstruction: 'Lê o aviso real e responde à pergunta.',
    demonstrationExample: 'Exemplo: Ler horários, receitas ou avisos da escola.',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'mai-54-1',
          prompt: 'Aviso na porta: "A biblioteca abre às 9h30." — A que horas podes entrar?',
          audioText: 'A biblioteca abre às nove e meia. A que horas podes entrar?',
          options: ['Às 9h30', 'Às 8h00', 'Às 12h00'],
          correctAnswer: 'Às 9h30',
          hint: 'Procura a hora indicada no aviso.',
        },
      ],
      2: [
        {
          id: 'mai-54-2',
          prompt: 'Rótulo: "Sumo natural de laranja. Conservar no frigorífico depois de abrir." — Onde guardar depois de abrir?',
          audioText: 'Sumo natural de laranja. Conservar no frigorífico depois de abrir.',
          options: ['No frigorífico', 'Ao sol', 'No armário dos livros'],
          correctAnswer: 'No frigorífico',
          hint: 'Lê a segunda frase do rótulo.',
        },
      ],
      3: [
        {
          id: 'mai-54-3',
          prompt: 'Cartaz: "Visita ao Jardim Botânico — Trazer chapéu, água e calçado confortável." — O que é obrigatório levar?',
          audioText: 'Visita ao Jardim Botânico. Trazer chapéu, água e calçado confortável.',
          options: [
            'Chapéu, água e calçado confortável',
            'Guarda-chuva e patins',
            'Computador portátil',
          ],
          correctAnswer: 'Chapéu, água e calçado confortável',
          hint: 'Vê a lista a seguir a "Trazer".',
        },
      ],
    },
  },
  {
    id: 'mai-missoes-autonomia',
    number: 53,
    title: 'Autorregulação e transferência',
    gameTitle: 'Missões de autonomia',
    month: 'maio',
    competency: 'autonomia',
    curriculumArea: 'Transversal',
    pedagogicalObjective: 'Tomar decisões autónomas perante desafios escolares.',
    simpleInstruction: 'Escolhe a atitude que demonstra maior autonomia.',
    demonstrationExample: 'Exemplo: Tentar resolver primeiro com os recursos disponíveis antes de pedir ajuda.',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'mai-mis-1',
          prompt: 'Não percebeste uma instrução à primeira leitura. O que fazes?',
          options: [
            'Leio novamente devagar ou ouço o áudio',
            'Fico parado sem fazer nada',
            'Fecho o caderno',
          ],
          correctAnswer: 'Leio novamente devagar ou ouço o áudio',
          hint: 'Reler ou ouvir de novo ajuda quase sempre!',
        },
      ],
      2: [
        {
          id: 'mai-mis-2',
          prompt: 'Terminaste um exercício antes do tempo. O que podes fazer com autonomia?',
          options: [
            'Rever as minhas respostas para ter a certeza de que estão completas',
            'Distrair os colegas do lado',
            'Arrumar tudo sem verificar',
          ],
          correctAnswer: 'Rever as minhas respostas para ter a certeza de que estão completas',
          hint: 'Rever é uma marca de grande autonomia.',
        },
      ],
      3: [
        {
          id: 'mai-mis-3',
          prompt: 'Tens de estudar um tema novo de Estudo do Meio. Qual é o melhor plano?',
          options: [
            'Ler por partes, sublinhar o essencial e fazer um pequeno esquema',
            'Tentar decorar tudo de uma só vez sem perceber',
            'Ler apenas a última linha',
          ],
          correctAnswer: 'Ler por partes, sublinhar o essencial e fazer um pequeno esquema',
          hint: 'Dividir e esquematizar facilita a memória.',
        },
      ],
    },
  },

  // ================= JUNHO (restantes jogos) =================
  {
    id: 'jun-autoavaliacao',
    number: 60,
    title: 'Autoavaliação orientada',
    gameTitle: 'O que já consigo fazer?',
    month: 'junho',
    competency: 'autonomia',
    curriculumArea: 'Transversal',
    pedagogicalObjective: 'Refletir sobre as próprias aprendizagens e conquistas.',
    simpleInstruction: 'Reflete sobre o que já consegues fazer com confiança e escreve a tua autoavaliação.',
    demonstrationExample: 'Exemplo: "Já consigo ler pequenos textos com mais segurança e sublinhar palavras-chave."',
    type: 'guided_writing',
    levels: {
      1: [
        {
          id: 'jun-60-1',
          prompt: 'Completa a tua autoavaliação: O que já consegues fazer melhor agora?',
          guidingQuestions: ['O que aprendeste na leitura?', 'De que atividade gostaste mais?'],
          wordBank: ['Já consigo', 'ler melhor', 'descobrir palavras', 'estou contente'],
          sentenceStarter: 'Agora já consigo ',
          checklist: ['Partilhei uma conquista minha?'],
          hint: 'Pensa no que era difícil em janeiro e agora já consegues fazer!',
        },
      ],
      2: [
        {
          id: 'jun-60-2',
          prompt: 'Avalia o teu percurso: Que estratégias já usas sozinho(a)?',
          guidingQuestions: ['Que apoios usas?', 'O que ainda queres melhorar?'],
          wordBank: ['Aprendi a', 'sublinhar', 'organizar ideias', 'quero continuar a'],
          sentenceStarter: 'Ao longo deste percurso, aprendi a ',
          checklist: ['Indiquei uma estratégia que uso e um objetivo futuro?'],
          hint: 'Valoriza o teu esforço!',
        },
      ],
      3: [
        {
          id: 'jun-60-3',
          prompt: 'Faz o balanço final do teu ano de aprendizagens.',
          guidingQuestions: ['Quais são os teus pontos fortes?', 'O que queres alcançar no próximo ano?'],
          wordBank: ['Sinto-me mais autónomo(a)', 'consigo compreender', 'no próximo ano'],
          sentenceStarter: 'No final deste percurso, sinto que ',
          checklist: ['Refleti sobre leitura, escrita e autonomia?'],
          hint: 'Escreve com orgulho sobre a tua evolução.',
        },
      ],
    },
  },
  {
    id: 'jun-desafio-leitura',
    number: 56,
    title: 'Leitura de textos adequados ao nível',
    gameTitle: 'O desafio da leitura',
    month: 'junho',
    competency: 'fluencia_leitora',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Demonstrar fluência e compreensão na leitura de textos.',
    simpleInstruction: 'Lê o texto com ritmo e responde à questão final.',
    demonstrationExample: 'Exemplo: Lê cada frase até ao ponto final antes de responder.',
    type: 'guided_reading',
    levels: {
      1: [
        {
          id: 'jun-56-1',
          prompt: 'Lê o texto sobre o verão:',
          readingText: 'Em junho chegam os dias compridos e quentes. As andorinhas voam alto no céu azul.',
          keywords: ['junho', 'dias compridos', 'andorinhas'],
          hint: 'Procura o nome das aves referidas no texto.',
          comprehensionCheck: {
            question: 'Que aves voam alto no céu azul?',
            options: ['As andorinhas', 'Os pinguins', 'As corujas'],
            answer: 'As andorinhas',
          },
        },
      ],
      2: [
        {
          id: 'jun-56-2',
          prompt: 'Lê o texto sobre a festa da escola:',
          readingText: 'Na festa de final de ano, os alunos apresentaram peças de teatro, canções e exposições de trabalhos.',
          keywords: ['festa', 'teatro', 'canções', 'exposições'],
          hint: 'Vê as três coisas que os alunos apresentaram.',
          comprehensionCheck: {
            question: 'O que apresentaram os alunos na festa?',
            options: [
              'Peças de teatro, canções e exposições',
              'Jogos de futebol',
              'Receitas de cozinha',
            ],
            answer: 'Peças de teatro, canções e exposições',
          },
        },
      ],
      3: [
        {
          id: 'jun-56-3',
          prompt: 'Lê o texto sobre a importância da leitura:',
          readingText: 'Ler todos os dias abre portas para novos mundos, enriquece o nosso vocabulário e ajuda-nos a escrever com maior clareza.',
          keywords: ['Ler', 'novos mundos', 'vocabulário', 'clareza'],
          hint: 'Identifica os benefícios da leitura referidos no texto.',
          comprehensionCheck: {
            question: 'Segundo o texto, o que faz a leitura diária?',
            options: [
              'Enriquece o vocabulário e ajuda a escrever com maior clareza',
              'Faz-nos correr mais depressa',
              'Substitui o recreio',
            ],
            answer: 'Enriquece o vocabulário e ajuda a escrever com maior clareza',
          },
        },
      ],
    },
  },
  {
    id: 'jun-minha-historia',
    number: 57,
    title: 'Recolha de amostras de escrita',
    gameTitle: 'A minha história',
    month: 'junho',
    competency: 'producao_escrita',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Produzir uma amostra final de escrita autónoma e revista.',
    simpleInstruction: 'Escreve uma pequena história original aplicando tudo o que aprendeste.',
    demonstrationExample: 'Exemplo: Usa início, meio, fim, banco de palavras e lista de verificação.',
    type: 'guided_writing',
    levels: {
      1: [
        {
          id: 'jun-57-1',
          prompt: 'Escreve uma pequena história sobre umas férias divertidas.',
          guidingQuestions: ['Onde se passa?', 'Quem participa?', 'O que acontece?'],
          wordBank: ['Num dia de sol', 'fui', 'descobri', 'brincámos', 'foi divertido'],
          sentenceStarter: 'Num dia de sol, ',
          checklist: ['Tem início e fim?', 'Usei pontuação correta?'],
          hint: 'Pensa num lugar de que gostas muito.',
        },
      ],
      2: [
        {
          id: 'jun-57-2',
          prompt: 'Escreve uma história sobre um tesouro escondido no jardim.',
          guidingQuestions: ['Quem encontrou o mapa?', 'Que pistas seguiram?', 'O que estava dentro do baú?'],
          wordBank: ['Certa tarde', 'encontrámos', 'seguimos as pistas', 'surpresa', 'partilhámos'],
          sentenceStarter: 'Certa tarde, no jardim, ',
          checklist: ['Organizei em início, meio e fim?', 'Revi a ortografia?'],
          hint: 'O tesouro pode ser algo simbólico, como livros ou sementes!',
        },
      ],
      3: [
        {
          id: 'jun-57-3',
          prompt: 'Cria uma narrativa completa com personagem, desafio e solução.',
          guidingQuestions: ['Quem é o protagonista?', 'Que desafio enfrentou?', 'Como resolveu?'],
          wordBank: ['Era uma vez', 'determinado(a)', 'estratégia', 'superou', 'aprendeu que'],
          sentenceStarter: 'Era uma vez ',
          checklist: ['Usei conectores temporais?', 'Verifiquei toda a pontuação?'],
          hint: 'Mostra como a personagem usou uma boa estratégia.',
        },
      ],
    },
  },
  {
    id: 'jun-missao-compreensao',
    number: 59,
    title: 'Tarefas curriculares integradas',
    gameTitle: 'Missão compreensão',
    month: 'junho',
    competency: 'compreensao_textos',
    curriculumArea: 'Transversal',
    pedagogicalObjective: 'Integrar leitura, interpretação de dados e resolução de tarefas.',
    simpleInstruction: 'Lê o desafio curricular e escolhe a resposta correta.',
    demonstrationExample: 'Exemplo: Combina a leitura atenta com o raciocínio lógico.',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'jun-59-1',
          prompt: 'Na horta da escola há 3 canteiros com 4 alfaces em cada um. Quantas alfaces há ao todo?',
          options: ['12 alfaces', '7 alfaces', '4 alfaces'],
          correctAnswer: '12 alfaces',
          hint: 'Soma 4 + 4 + 4.',
        },
      ],
      2: [
        {
          id: 'jun-59-2',
          prompt: 'Qual destes hábitos ajuda a poupar água em casa?',
          options: [
            'Fechar a torneira enquanto lavamos os dentes',
            'Deixar a mangueira aberta no jardim',
            'Tomar banhos muito demorados',
          ],
          correctAnswer: 'Fechar a torneira enquanto lavamos os dentes',
          hint: 'Pensa numa atitude responsável no dia a dia.',
        },
      ],
      3: [
        {
          id: 'jun-59-3',
          prompt: 'Lê: "O comboio parte às 10h15 e a viagem dura 30 minutos." — A que horas chega o comboio?',
          options: ['Às 10h45', 'Às 10h30', 'Às 11h00'],
          correctAnswer: 'Às 10h45',
          hint: 'Soma 30 minutos a 15 minutos.',
        },
      ],
    },
  },
  {
    id: 'jun-mostra-aprendeste',
    number: 61,
    title: 'Consolidação de competências',
    gameTitle: 'Mostra o que aprendeste',
    month: 'junho',
    competency: 'relacoes_semanticas',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Consolidar relações semânticas, sinónimos e antónimos.',
    simpleInstruction: 'Liga cada palavra ao seu sinónimo ou par semântico.',
    demonstrationExample: 'Exemplo: "Alegre" liga com "Contente".',
    type: 'matching',
    levels: {
      1: [
        {
          id: 'jun-61-1',
          prompt: 'Liga os sinónimos:',
          pairs: [
            { left: 'Alegre', right: 'Contente' },
            { left: 'Rápido', right: 'Veloz' },
            { left: 'Bonito', right: 'Lindo' },
          ],
          hint: 'São palavras com o mesmo significado.',
        },
      ],
      2: [
        {
          id: 'jun-61-2',
          prompt: 'Liga os antónimos (contrários):',
          pairs: [
            { left: 'Subir', right: 'Descer' },
            { left: 'Claro', right: 'Escuro' },
            { left: 'Cheio', right: 'Vazio' },
          ],
          hint: 'São palavras com significados opostos.',
        },
      ],
      3: [
        {
          id: 'jun-61-3',
          prompt: 'Liga cada palavra à sua classe ou categoria:',
          pairs: [
            { left: 'Escrever', right: 'Verbo de ação' },
            { left: 'Biblioteca', right: 'Nome de lugar' },
            { left: 'Cuidadoso', right: 'Adjetivo (qualidade)' },
          ],
          hint: 'Pensa na função de cada palavra na frase.',
        },
      ],
    },
  },
  {
    id: 'jun-meu-percurso',
    number: 62,
    title: 'Identificação de competências consolidadas',
    gameTitle: 'O meu percurso de aprendizagem',
    month: 'junho',
    competency: 'autonomia',
    curriculumArea: 'Transversal',
    pedagogicalObjective: 'Reconhecer a sequência de competências desenvolvidas ao longo do ano.',
    simpleInstruction: 'Ordena os marcos do teu percurso de janeiro a junho.',
    demonstrationExample: 'Exemplo: Ler com precisão -> Compreender -> Escrever -> Autonomia.',
    type: 'sequence_order',
    levels: {
      1: [
        {
          id: 'jun-62-1',
          prompt: 'Ordena as etapas do percurso:',
          scrambledItems: [
            'Escrever as minhas histórias.',
            'Ler palavras e frases com precisão.',
            'Ouvir e contar acontecimentos.',
          ],
          correctOrder: [
            'Ler palavras e frases com precisão.',
            'Ouvir e contar acontecimentos.',
            'Escrever as minhas histórias.',
          ],
          hint: 'Janeiro -> Fevereiro -> Abril.',
        },
      ],
      2: [
        {
          id: 'jun-62-2',
          prompt: 'Ordena a evolução das competências:',
          scrambledItems: [
            'Aplicar estratégias com autonomia.',
            'Compreender enunciados e problemas.',
            'Alargar o vocabulário e a leitura.',
          ],
          correctOrder: [
            'Alargar o vocabulário e a leitura.',
            'Compreender enunciados e problemas.',
            'Aplicar estratégias com autonomia.',
          ],
          hint: 'Começa pelo vocabulário e termina na autonomia.',
        },
      ],
      3: [
        {
          id: 'jun-62-3',
          prompt: 'Ordena os 4 pilares do teu sucesso:',
          scrambledItems: [
            'Consolidar e celebrar os progressos.',
            'Ler com precisão e fluência.',
            'Compreender textos e resolver desafios.',
            'Organizar ideias e produzir textos.',
          ],
          correctOrder: [
            'Ler com precisão e fluência.',
            'Compreender textos e resolver desafios.',
            'Organizar ideias e produzir textos.',
            'Consolidar e celebrar os progressos.',
          ],
          hint: 'Segue a ordem dos meses de janeiro a junho.',
        },
      ],
    },
  },
];
