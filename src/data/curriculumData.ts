import {
  CompetencyId,
  CompetencyInfo,
  InteractiveStory,
  InterventionProfile,
  MonthlyModule,
  MonthId,
  ResourceCategory,
  ResourceLibraryItem,
} from '../types/pedagogical';

export const COMPETENCIES: CompetencyInfo[] = [
  {
    id: 'precisao_leitora',
    label: 'Precisão leitora',
    shortLabel: 'Precisão leitora',
    description: 'Descodificação correta de palavras, sílabas complexas e pequenos textos.',
  },
  {
    id: 'fluencia_leitora',
    label: 'Fluência leitora',
    shortLabel: 'Fluência',
    description: 'Leitura expressiva, ritmo adequado e automatização progressiva.',
  },
  {
    id: 'compreensao_instrucoes',
    label: 'Compreensão de instruções',
    shortLabel: 'Instruções',
    description: 'Interpretação e execução de instruções simples e sequenciadas com vários elementos.',
  },
  {
    id: 'vocabulario',
    label: 'Vocabulário',
    shortLabel: 'Vocabulário',
    description: 'Alargamento lexical, palavras-chave e uso adequado em contexto.',
  },
  {
    id: 'relacoes_semanticas',
    label: 'Relações semânticas',
    shortLabel: 'Semântica',
    description: 'Sinónimos, antónimos, famílias de palavras e categorias semânticas.',
  },
  {
    id: 'compreensao_oral',
    label: 'Compreensão oral',
    shortLabel: 'Compreensão oral',
    description: 'Escuta ativa e identificação de informação essencial em mensagens orais.',
  },
  {
    id: 'memoria_verbal',
    label: 'Memória verbal',
    shortLabel: 'Memória verbal',
    description: 'Retenção e evocação de palavras, sequências e informação significativa.',
  },
  {
    id: 'organizacao_discurso',
    label: 'Organização do discurso',
    shortLabel: 'Discurso',
    description: 'Reconto lógico, sequenciação temporal e produção de enunciados coerentes.',
  },
  {
    id: 'compreensao_textos',
    label: 'Compreensão de textos e enunciados',
    shortLabel: 'Compreensão escrita',
    description: 'Identificação de informação explícita, dados relevantes e o que é pedido.',
  },
  {
    id: 'producao_escrita',
    label: 'Produção escrita',
    shortLabel: 'Escrita',
    description: 'Planificação, construção frásica, organização de ideias e revisão.',
  },
  {
    id: 'autonomia',
    label: 'Autonomia',
    shortLabel: 'Autonomia',
    description: 'Seleção de recursos de apoio, transferência de estratégias e autorregulação.',
  },
];

export const INTERVENTION_PROFILES: Record<
  InterventionProfile,
  {
    title: string;
    shortTitle: string;
    description: string;
    defaultCompetencies: CompetencyId[];
  }
> = {
  perfil1: {
    title: 'Perfil 1 — Intervenção na leitura e escrita',
    shortTitle: 'Leitura e Escrita',
    description:
      'Prioriza precisão e fluência leitora, compreensão, vocabulário, organização de ideias e produção escrita.',
    defaultCompetencies: [
      'precisao_leitora',
      'fluencia_leitora',
      'vocabulario',
      'compreensao_textos',
      'producao_escrita',
    ],
  },
  perfil2: {
    title: 'Perfil 2 — Intervenção na linguagem',
    shortTitle: 'Linguagem',
    description:
      'Prioriza compreensão oral, vocabulário, relações semânticas, memória verbal, construção frásica, sequenciação e organização do discurso.',
    defaultCompetencies: [
      'compreensao_oral',
      'vocabulario',
      'relacoes_semanticas',
      'memoria_verbal',
      'organizacao_discurso',
    ],
  },
  perfil3: {
    title: 'Perfil 3 — Intervenção combinada',
    shortTitle: 'Intervenção Combinada',
    description:
      'Trabalha articuladamente leitura, escrita, linguagem oral, compreensão e autonomia.',
    defaultCompetencies: [
      'precisao_leitora',
      'compreensao_instrucoes',
      'relacoes_semanticas',
      'compreensao_oral',
      'organizacao_discurso',
      'compreensao_textos',
      'producao_escrita',
      'autonomia',
    ],
  },
};

export const POSITIVE_FEEDBACK = [
  'Muito bem! Estás a melhorar!',
  'Excelente esforço!',
  'Conseguiste!',
  'Cada vez estás mais autónomo(a)!',
  'Fantástico! Continuas a descobrir novas palavras!',
];

export const TRY_AGAIN_FEEDBACK = [
  'Vamos pensar mais um bocadinho?',
  'Quase lá! Lê ou ouve novamente com calma.',
  'Boa tentativa! Experimenta usar uma pista.',
  'Não há pressa. Vamos observar outra vez!',
];

export const MONTHLY_MODULES: MonthlyModule[] = [
  {
    id: 'janeiro',
    name: 'Janeiro',
    navTitle: 'Janeiro — Ler com precisão',
    subtitle: 'Fluência leitora, vocabulário e compreensão de instruções',
    priorityFocus:
      'Desenvolver a precisão e a progressiva automatização da leitura, compreender instruções com vários elementos e aprofundar relações semânticas.',
    operationalObjectives: [
      'Desenvolver precisão e progressiva automatização da leitura.',
      'Compreender instruções com vários elementos.',
      'Aprofundar relações semânticas.',
    ],
    mandatoryActivitiesList: [
      { number: 14, title: 'Leitura modelada' },
      { number: 15, title: 'Leitura repetida' },
      { number: 16, title: 'Leitura acompanhada' },
      { number: 17, title: 'Trabalho de sinónimos' },
      { number: 18, title: 'Trabalho de antónimos' },
      { number: 19, title: 'Identificação de categorias semânticas' },
      { number: 20, title: 'Compreensão de instruções segmentadas' },
      { number: 21, title: 'Identificação de verbos de ação' },
      { number: 22, title: 'Identificação de palavras-chave' },
    ],
    interactiveGamesList: [
      'Lê e descobre',
      'O comboio das palavras',
      'Encontra o sinónimo',
      'Descobre o contrário',
      'Famílias de palavras',
      'O detetive das categorias',
      'Segue as instruções',
      'O que tens de fazer?',
      'Descobre a palavra-chave',
    ],
    evaluationIndicators: [
      'Lê pequenos textos com maior precisão.',
      'Explica palavras trabalhadas.',
      'Executa instruções sequenciadas com menor apoio.',
    ],
    mainIndicatorsSummary: 'Precisão leitora, vocabulário e compreensão de instruções',
  },
  {
    id: 'fevereiro',
    name: 'Fevereiro',
    navTitle: 'Fevereiro — Ouvir, compreender e contar',
    subtitle: 'Compreensão oral, memória verbal e organização do discurso',
    priorityFocus:
      'Reter e recuperar informação essencial, organizar acontecimentos e produzir enunciados orais mais completos e coerentes.',
    operationalObjectives: [
      'Reter e recuperar informação essencial.',
      'Organizar acontecimentos.',
      'Produzir enunciados orais mais completos e coerentes.',
    ],
    mandatoryActivitiesList: [
      { number: 23, title: 'Reconto de histórias' },
      { number: 24, title: 'Reconto de experiências' },
      { number: 25, title: 'Ordenação de sequências de imagens' },
      { number: 26, title: 'Repetição e evocação de informação significativa' },
      { number: 27, title: 'Descrição guiada' },
      { number: 28, title: 'Resposta a perguntas de apoio' },
      { number: 29, title: 'Construção de mapas de ideias' },
      { number: 30, title: 'Organização temporal e lógica dos acontecimentos' },
    ],
    interactiveGamesList: [
      'Ouve e responde',
      'A história desordenada',
      'O que aconteceu primeiro?',
      'O que aconteceu depois?',
      'Completa a história',
      'Lembra-te e responde',
      'Quem? Onde? Quando? O quê?',
      'Conta-me o que aconteceu',
      'Organiza as imagens',
    ],
    evaluationIndicators: [
      'Reconta acontecimentos por ordem lógica.',
      'Transmite informação essencial.',
      'Utiliza vocabulário mais diversificado com apoio progressivamente menor.',
    ],
    mainIndicatorsSummary: 'Memória verbal, reconto e organização do discurso',
  },
  {
    id: 'marco',
    name: 'Março',
    navTitle: 'Março — Compreender e resolver',
    subtitle: 'Compreensão de textos e enunciados curriculares',
    priorityFocus:
      'Identificar informação explícita, distinguir dados relevantes e compreender o que é pedido em tarefas e problemas das diferentes áreas curriculares.',
    operationalObjectives: [
      'Identificar informação explícita.',
      'Distinguir dados relevantes.',
      'Compreender o que é pedido em tarefas e problemas das diferentes áreas curriculares.',
    ],
    mandatoryActivitiesList: [
      { number: 31, title: 'Leitura oral dos enunciados' },
      { number: 32, title: 'Divisão em etapas' },
      { number: 33, title: 'Identificação de dados relevantes' },
      { number: 34, title: 'Sublinhado de palavras-chave' },
      { number: 35, title: 'Utilização de esquemas' },
      { number: 36, title: 'Resolução orientada de problemas' },
      { number: 37, title: 'Explicação oral do raciocínio' },
    ],
    interactiveGamesList: [
      'O detetive dos enunciados',
      'Descobre o que é pedido',
      'Encontra os dados importantes',
      'Lê, pensa e responde',
      'Organiza a informação',
      'Resolve passo a passo',
      'Qual é a pergunta?',
      'Explica como pensaste',
    ],
    evaluationIndicators: [
      'Identifica o que é pedido e os dados relevantes.',
      'Seleciona uma estratégia com apoio.',
      'Demonstra conhecimentos sem ficar limitado pela descodificação.',
    ],
    mainIndicatorsSummary: 'Compreensão de textos, identificação de informação e interpretação de enunciados',
  },
  {
    id: 'abril',
    name: 'Abril',
    navTitle: 'Abril — Organizar ideias e escrever',
    subtitle: 'Produção escrita orientada e organização de ideias',
    priorityFocus:
      'Planificar e produzir pequenos textos, estruturar frases, utilizar vocabulário adequado e rever aspetos selecionados da escrita.',
    operationalObjectives: [
      'Planificar e produzir pequenos textos.',
      'Estruturar frases.',
      'Utilizar vocabulário adequado.',
      'Rever aspetos selecionados da escrita.',
    ],
    mandatoryActivitiesList: [
      { number: 38, title: 'Planos de texto' },
      { number: 39, title: 'Sequências de imagens' },
      { number: 40, title: 'Guiões com perguntas orientadoras' },
      { number: 41, title: 'Bancos de palavras' },
      { number: 42, title: 'Escrita partilhada' },
      { number: 43, title: 'Construção de frases' },
      { number: 44, title: 'Utilização de estruturas-modelo' },
      { number: 45, title: 'Processador de texto' },
      { number: 46, title: 'Revisão com lista de verificação' },
    ],
    interactiveGamesList: [
      'Constrói a frase',
      'Organiza as palavras',
      'Completa o texto',
      'Descobre a palavra que falta',
      'Ordena e escreve',
      'Quem? O quê? Onde?',
      'A minha primeira história',
      'Detetives da escrita',
    ],
    evaluationIndicators: [
      'Produz texto curto com sequência lógica.',
      'Utiliza estruturas-modelo.',
      'Revê alguns aspetos da escrita com orientação.',
    ],
    mainIndicatorsSummary: 'Organização de ideias, construção frásica e produção escrita',
  },
  {
    id: 'maio',
    name: 'Maio',
    navTitle: 'Maio — Aprender com autonomia',
    subtitle: 'Autonomia, transferência e aplicação das estratégias',
    priorityFocus:
      'Selecionar recursos de apoio, aplicar estratégias de leitura e compreensão em diferentes áreas e explicar conhecimentos e procedimentos.',
    operationalObjectives: [
      'Selecionar recursos de apoio.',
      'Aplicar estratégias de leitura e compreensão em diferentes áreas.',
      'Explicar conhecimentos e procedimentos.',
    ],
    mandatoryActivitiesList: [
      { number: 47, title: 'Glossário pessoal' },
      { number: 48, title: 'Leitura com apoio áudio' },
      { number: 49, title: 'Organizadores gráficos' },
      { number: 50, title: 'Problemas matemáticos lidos pelo adulto' },
      { number: 51, title: 'Apresentações orais' },
      { number: 52, title: 'Tarefas práticas e cooperativas' },
      { number: 53, title: 'Seleção de estratégias' },
      { number: 54, title: 'Aplicação das aprendizagens em novos contextos' },
    ],
    interactiveGamesList: [
      'Escolhe a melhor estratégia',
      'Descobre o recurso certo',
      'Consulta o teu glossário',
      'Resolve por etapas',
      'Explica como fizeste',
      'O desafio das três etapas',
      'Aprende e aplica',
      'Missões de autonomia',
    ],
    evaluationIndicators: [
      'Escolhe recursos adequados.',
      'Transfere estratégias para novas tarefas.',
      'Explica procedimentos e conhecimentos com menor dependência do adulto.',
    ],
    mainIndicatorsSummary: 'Seleção de recursos, transferência de estratégias e autonomia',
  },
  {
    id: 'junho',
    name: 'Junho',
    navTitle: 'Junho — Consolidar e avaliar',
    subtitle: 'Consolidação, avaliação final e preparação da continuidade',
    priorityFocus:
      'Consolidar aprendizagens, comparar o desempenho com a avaliação inicial e identificar competências adquiridas e necessidades de continuidade.',
    operationalObjectives: [
      'Consolidar aprendizagens.',
      'Comparar o desempenho com a avaliação inicial.',
      'Identificar competências adquiridas e necessidades de continuidade.',
    ],
    mandatoryActivitiesList: [
      { number: 55, title: 'Reaplicação de tarefas comparáveis às iniciais' },
      { number: 56, title: 'Leitura de textos adequados ao nível de desempenho' },
      { number: 57, title: 'Recolha de amostras de escrita' },
      { number: 58, title: 'Reconto' },
      { number: 59, title: 'Tarefas curriculares' },
      { number: 60, title: 'Autoavaliação orientada' },
      { number: 61, title: 'Comparação de resultados' },
      { number: 62, title: 'Identificação de competências consolidadas e dificuldades persistentes' },
    ],
    interactiveGamesList: [
      'O que já consigo fazer?',
      'O desafio da leitura',
      'A minha história',
      'O grande desafio das palavras',
      'Missão compreensão',
      'Mostra o que aprendeste',
      'O meu percurso de aprendizagem',
    ],
    evaluationIndicators: [
      'Progressos documentados.',
      'Identificação de competências consolidadas e persistentes.',
      'Definição de prioridades para o ano seguinte.',
    ],
    mainIndicatorsSummary: 'Consolidação, evolução individual e necessidades de continuidade',
  },
];

export const INTERACTIVE_STORIES: InteractiveStory[] = [
  {
    id: 'historia-esquilo',
    title: 'O Esquilo que Colecionava Palavras',
    month: 'janeiro',
    level: 1,
    readingTime: '3 min',
    themeColor: 'teal',
    illustrationType: 'forest',
    paragraphs: [
      {
        text: 'Num bosque muito tranquilo vivia o Simão, um esquilo curioso que adorava descobrir palavras novas.',
        keywords: ['bosque', 'Simão', 'curioso', 'palavras'],
      },
      {
        text: 'Todos os dias, o Simão guardava no seu caderno palavras doces como "amizade", palavras rápidas como "relâmpago" e palavras alegres como "gargalhada".',
        keywords: ['caderno', 'amizade', 'relâmpago', 'gargalhada'],
      },
      {
        text: 'Quando os seus amigos precisavam de ajuda para escrever uma carta ou contar uma história, o Simão abria o caderno e partilhava o seu tesouro.',
        keywords: ['amigos', 'carta', 'história', 'tesouro'],
      },
    ],
    comprehensionQuestions: [
      {
        question: 'O que colecionava o esquilo Simão?',
        options: ['Palavras novas', 'Pedras coloridas', 'Folhas secas'],
        correctAnswer: 'Palavras novas',
        hint: 'Lê o primeiro parágrafo com atenção.',
      },
      {
        question: 'Como ajudava o Simão os seus amigos?',
        options: [
          'Partilhava palavras do seu caderno para escreverem cartas e histórias',
          'Construía casas nas árvores',
          'Ensinava a saltar muito alto',
        ],
        correctAnswer:
          'Partilhava palavras do seu caderno para escreverem cartas e histórias',
        hint: 'Vê o que acontece no último parágrafo.',
      },
    ],
    retellingPrompts: [
      'Quem é a personagem principal da história?',
      'Onde vivia o Simão e o que guardava no caderno?',
      'Como terminou a história?',
    ],
  },
  {
    id: 'historia-farol',
    title: 'A Mensagem do Farol Azul',
    month: 'fevereiro',
    level: 2,
    readingTime: '4 min',
    themeColor: 'sky',
    illustrationType: 'ocean',
    paragraphs: [
      {
        text: 'Junto à praia de Paço de Arcos erguia-se um farol antigo que guiava os barcos durante a noite.',
        keywords: ['praia', 'farol', 'barcos', 'noite'],
      },
      {
        text: 'Numa tarde de nevoeiro, a Beatriz e o seu avô subiram as escadas em caracol para verificar a lanterna.',
        keywords: ['nevoeiro', 'Beatriz', 'avô', 'lanterna'],
      },
      {
        text: 'Assim que acenderam a luz dourada, um pequeno barco de pesca apitou três vezes em sinal de agradecimento.',
        keywords: ['luz dourada', 'barco', 'agradecimento'],
      },
    ],
    comprehensionQuestions: [
      {
        question: 'Para que servia o farol antigo?',
        options: [
          'Para guiar os barcos durante a noite',
          'Para guardar redes de pesca',
          'Para observar as estrelas',
        ],
        correctAnswer: 'Para guiar os barcos durante a noite',
        hint: 'Procura a resposta logo na primeira frase.',
      },
      {
        question: 'Como agradeceu o barco de pesca?',
        options: [
          'Apitou três vezes',
          'Acendeu uma fogueira',
          'Lançou uma âncora',
        ],
        correctAnswer: 'Apitou três vezes',
        hint: 'Lê o último parágrafo.',
      },
    ],
    retellingPrompts: [
      'Onde se passa esta história?',
      'Quem subiu ao farol e porquê?',
      'O que aconteceu quando acenderam a lanterna?',
    ],
  },
  {
    id: 'historia-horta',
    title: 'O Mistério da Horta Escolar',
    month: 'marco',
    level: 3,
    readingTime: '5 min',
    themeColor: 'amber',
    illustrationType: 'garden',
    paragraphs: [
      {
        text: 'Na segunda-feira de manhã, os alunos do 3.º ano descobriram que as alfaces da horta tinham pequenas dentadas nas folhas.',
        keywords: ['segunda-feira', 'alfaces', 'horta', 'dentadas'],
      },
      {
        text: 'Em vez de adivinharem, decidiram observar as pistas: havia um rasto brilhante junto à terra húmida e nenhuma pegada grande.',
        keywords: ['pistas', 'rasto brilhante', 'terra húmida'],
      },
      {
        text: 'Com a ajuda de uma lupa, encontraram dois caracóis escondidos debaixo de um regador e mudaram-nos cuidadosamente para o jardim.',
        keywords: ['lupa', 'caracóis', 'regador', 'jardim'],
      },
    ],
    comprehensionQuestions: [
      {
        question: 'Que pista ajudou os alunos a descobrir os visitantes da horta?',
        options: [
          'Um rasto brilhante junto à terra húmida',
          'Penas coloridas no chão',
          'Pegadas grandes na lama',
        ],
        correctAnswer: 'Um rasto brilhante junto à terra húmida',
        hint: 'Vê o segundo parágrafo.',
      },
      {
        question: 'O que fizeram os alunos quando encontraram os caracóis?',
        options: [
          'Mudaram-nos cuidadosamente para o jardim',
          'Levaram-nos para casa',
          'Deixaram-nos dentro do regador',
        ],
        correctAnswer: 'Mudaram-nos cuidadosamente para o jardim',
        hint: 'Lê a última frase do texto.',
      },
    ],
    retellingPrompts: [
      'Qual foi o problema encontrado na horta?',
      'Que estratégia usaram os alunos para investigar?',
      'Qual foi a solução encontrada?',
    ],
  },
];

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  'Textos curtos',
  'Histórias ilustradas',
  'Sequências de imagens',
  'Imagens para descrição oral',
  'Bancos de palavras',
  'Glossários',
  'Guiões de escrita',
  'Organizadores gráficos',
  'Exercícios de compreensão',
  'Atividades de vocabulário',
  'Modelos de frases',
];

export const RESOURCE_LIBRARY: ResourceLibraryItem[] = [
  {
    id: 'res-1',
    title: 'Cartões de Leitura Silábica e Palavras Frequentes',
    category: 'Textos curtos',
    competency: 'precisao_leitora',
    ageRange: '6–8 anos',
    complexity: 1,
    description: 'Frases curtas com apoio visual para treino de precisão e fluência.',
    contentPreview: [
      'O sol brilha no céu azul.',
      'A Rita comeu uma pera madura.',
      'O gato dorme na almofada macia.',
    ],
    linkedActivityId: 'jan-leitura-modelada',
  },
  {
    id: 'res-2',
    title: 'Banco de Palavras — Conectores e Ações',
    category: 'Bancos de palavras',
    competency: 'producao_escrita',
    ageRange: '7–10 anos',
    complexity: 2,
    description: 'Lista organizada de conectores temporais e verbos de ação para apoiar a escrita.',
    contentPreview: [
      'Início: Era uma vez, Numa manhã, Certa vez',
      'Meio: De repente, Depois, Então, Entretanto',
      'Fim: Por fim, Finalmente, Assim',
    ],
    linkedActivityId: 'abr-oficina-escrita',
  },
  {
    id: 'res-3',
    title: 'Guião de Reconto — Quem? Onde? Quando? O quê?',
    category: 'Guiões de escrita',
    competency: 'organizacao_discurso',
    ageRange: '6–10 anos',
    complexity: 1,
    description: 'Estrutura visual de apoio ao reconto oral e escrito de histórias.',
    contentPreview: [
      '1. Quem são as personagens?',
      '2. Onde e quando acontece a história?',
      '3. Qual foi o acontecimento principal?',
      '4. Como terminou?',
    ],
    linkedActivityId: 'fev-quem-onde-quando',
  },
  {
    id: 'res-4',
    title: 'Organizador Gráfico — Resolução de Problemas',
    category: 'Organizadores gráficos',
    competency: 'compreensao_textos',
    ageRange: '7–10 anos',
    complexity: 2,
    description: 'Esquema em 4 passos para interpretar enunciados de Matemática e Estudo do Meio.',
    contentPreview: [
      'Passo 1: Ler o enunciado e sublinhar palavras-chave.',
      'Passo 2: Identificar os dados conhecidos.',
      'Passo 3: Compreender qual é a pergunta.',
      'Passo 4: Escolher a estratégia e verificar a resposta.',
    ],
    linkedActivityId: 'mar-detetive-enunciados',
  },
  {
    id: 'res-5',
    title: 'Pares de Sinónimos e Antónimos Ilustrados',
    category: 'Atividades de vocabulário',
    competency: 'relacoes_semanticas',
    ageRange: '6–9 anos',
    complexity: 1,
    description: 'Conjunto de palavras para explorar semelhanças e oposições de significado.',
    contentPreview: [
      'Sinónimos: alegre / contente · rápido / veloz · bonito / lindo',
      'Antónimos: grande / pequeno · abrir / fechar · quente / frio',
    ],
    linkedActivityId: 'jan-sinonimos',
  },
  {
    id: 'res-6',
    title: 'Modelos de Frases Expandidas',
    category: 'Modelos de frases',
    competency: 'producao_escrita',
    ageRange: '6–9 anos',
    complexity: 1,
    description: 'Estruturas-modelo para ajudar a passar da frase simples à frase completa.',
    contentPreview: [
      '[Quem] + [o que faz] -> O cão corre.',
      '[Quem] + [o que faz] + [onde] -> O cão corre no parque.',
      '[Quando] + [quem] + [o que faz] + [onde] -> De manhã, o cão corre no parque.',
    ],
    linkedActivityId: 'abr-constroi-frase',
  },
  {
    id: 'res-7',
    title: 'Sequência de Imagens — O Ciclo da Planta',
    category: 'Sequências de imagens',
    competency: 'organizacao_discurso',
    ageRange: '6–8 anos',
    complexity: 1,
    description: 'Cartões sequenciais para ordenação temporal e descrição oral.',
    contentPreview: [
      '1. Preparar a terra e colocar a semente.',
      '2. Regar com água e apanhar luz do sol.',
      '3. Crescer o caule e as primeiras folhas.',
      '4. Abrir a flor.',
    ],
    linkedActivityId: 'fev-historia-desordenada',
  },
  {
    id: 'res-8',
    title: 'Cenas para Descrição Oral Guiada',
    category: 'Imagens para descrição oral',
    competency: 'compreensao_oral',
    ageRange: '6–10 anos',
    complexity: 2,
    description: 'Cenários do quotidiano escolar e familiar com perguntas orientadoras.',
    contentPreview: [
      'Cena: O recreio da escola — O que estão as crianças a fazer? Que objetos vês?',
      'Cena: A biblioteca — Como está organizado o espaço? Que emoções observas?',
    ],
  },
  {
    id: 'res-9',
    title: 'Glossário Base do 1.º Ciclo',
    category: 'Glossários',
    competency: 'vocabulario',
    ageRange: '7–10 anos',
    complexity: 2,
    description: 'Definições simples e exemplos concretos de palavras curriculares.',
    contentPreview: [
      'Enunciado: Texto que explica o que temos de fazer numa tarefa.',
      'Estratégia: Plano ou caminho que escolhemos para resolver um desafio.',
      'Reconto: Contar uma história por palavras próprias e pela ordem certa.',
    ],
    linkedActivityId: 'mai-estrategias',
  },
  {
    id: 'res-10',
    title: 'Fichas de Compreensão Explícita',
    category: 'Exercícios de compreensão',
    competency: 'compreensao_textos',
    ageRange: '8–10 anos',
    complexity: 3,
    description: 'Pequenos textos informativos de Estudo do Meio com questões diretas.',
    contentPreview: [
      'Tema: Os estados da água na natureza.',
      'Tema: A importância da reciclagem nos ecopontos.',
    ],
    linkedActivityId: 'mar-estudo-meio',
  },
  {
    id: 'res-11',
    title: 'Coleção de Histórias Ilustradas',
    category: 'Histórias ilustradas',
    competency: 'fluencia_leitora',
    ageRange: '6–10 anos',
    complexity: 2,
    description: 'Narrativas curtas com apoio áudio e destaque de palavras-chave.',
    contentPreview: [
      'O Esquilo que Colecionava Palavras',
      'A Mensagem do Farol Azul',
      'O Mistério da Horta Escolar',
    ],
  },
];

export const MEDALS_CATALOG = [
  {
    id: 'primeira-estrela',
    title: 'Primeira Descoberta',
    description: 'Concluíste a tua primeira atividade na plataforma!',
  },
  {
    id: 'explorador-palavras',
    title: 'Explorador de Palavras',
    description: 'Completaste 3 atividades de leitura ou vocabulário.',
  },
  {
    id: 'detetive-atento',
    title: 'Detetive Atento',
    description: 'Identificaste dados importantes e seguiste instruções com sucesso.',
  },
  {
    id: 'contador-historias',
    title: 'Contador de Histórias',
    description: 'Organizaste sequências e exploraste histórias interativas.',
  },
  {
    id: 'escritor-criativo',
    title: 'Escritor Criativo',
    description: 'Construíste frases e produziste o teu próprio texto.',
  },
  {
    id: 'aprendiz-autonomo',
    title: 'Aprendiz Autónomo',
    description: 'Completaste atividades sem precisar de pistas!',
  },
];
