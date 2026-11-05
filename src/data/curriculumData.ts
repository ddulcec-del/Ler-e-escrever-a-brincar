import {
  CompetencyId,
  CompetencyInfo,
  InteractiveStory,
  InterventionProfile,
  MonthlyModule,
  MonthId,
  PedagogicalActivity,
  ResourceCategory,
  ResourceLibraryItem,
} from '../types/pedagogical';
import { EXTRA_PEDAGOGICAL_ACTIVITIES } from './extraActivities';

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

export const PEDAGOGICAL_ACTIVITIES: PedagogicalActivity[] = [
  // ================= JANEIRO =================
  {
    id: 'jan-leitura-modelada',
    number: 14,
    title: 'Leitura modelada e acompanhada',
    gameTitle: 'Lê e descobre',
    month: 'janeiro',
    competency: 'precisao_leitora',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Desenvolver precisão e progressiva automatização da leitura.',
    simpleInstruction:
      'Ouve a leitura com atenção, acompanha as palavras destacadas e responde à pergunta.',
    demonstrationExample:
      'Exemplo: Ouve a frase "O gato preto saltou o muro." -> Palavra-chave: saltou.',
    type: 'guided_reading',
    levels: {
      1: [
        {
          id: 'jan-14-1',
          prompt: 'Ouve o pequeno texto e acompanha cada palavra.',
          readingText: 'A Marta tem uma bola azul. Ela joga no recreio com os amigos.',
          keywords: ['bola azul', 'recreio', 'amigos'],
          hint: 'Ouve novamente e procura a cor da bola.',
          comprehensionCheck: {
            question: 'De que cor é a bola da Marta?',
            options: ['Azul', 'Vermelha', 'Amarela'],
            answer: 'Azul',
          },
        },
        {
          id: 'jan-14-2',
          prompt: 'Lê com apoio áudio e descobre onde está o cão.',
          readingText: 'O cão Bobi dorme na casota de madeira junto à árvore.',
          keywords: ['Bobi', 'casota', 'árvore'],
          hint: 'Procura a palavra que indica onde o Bobi dorme.',
          comprehensionCheck: {
            question: 'Onde dorme o cão Bobi?',
            options: ['Na casota de madeira', 'Na cozinha', 'No sofá'],
            answer: 'Na casota de madeira',
          },
        },
      ],
      2: [
        {
          id: 'jan-14-2-1',
          prompt: 'Ouve a leitura modelada e depois lê em voz alta.',
          readingText:
            'Todas as manhãs, o Pedro rega as plantas da varanda antes de ir para a escola.',
          keywords: ['manhãs', 'rega', 'plantas', 'escola'],
          hint: 'Repara no que o Pedro faz antes de ir para a escola.',
          comprehensionCheck: {
            question: 'O que faz o Pedro todas as manhãs?',
            options: [
              'Rega as plantas da varanda',
              'Lava a bicicleta',
              'Lê um livro no jardim',
            ],
            answer: 'Rega as plantas da varanda',
          },
        },
      ],
      3: [
        {
          id: 'jan-14-3-1',
          prompt: 'Lê o parágrafo com fluência e identifica a ideia principal.',
          readingText:
            'Na biblioteca da escola, os alunos escolhem livros de aventuras, ciências e poesia. O silêncio ajuda todos a concentrarem-se na leitura.',
          keywords: ['biblioteca', 'aventuras', 'silêncio', 'leitura'],
          hint: 'Pensa no motivo pelo qual o silêncio é importante na biblioteca.',
          comprehensionCheck: {
            question: 'Para que ajuda o silêncio na biblioteca?',
            options: [
              'Para todos se concentrarem na leitura',
              'Para arrumar as mesas mais depressa',
              'Para ouvir música',
            ],
            answer: 'Para todos se concentrarem na leitura',
          },
        },
      ],
    },
  },
  {
    id: 'jan-sinonimos',
    number: 17,
    title: 'Trabalho de sinónimos',
    gameTitle: 'Encontra o sinónimo',
    month: 'janeiro',
    competency: 'relacoes_semanticas',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Aprofundar relações semânticas através da identificação de sinónimos.',
    simpleInstruction: 'Escolhe a palavra que tem o mesmo significado (sinónimo).',
    demonstrationExample: 'Exemplo: "Contente" significa o mesmo que "alegre".',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'jan-17-1',
          prompt: 'Qual é o sinónimo de "bonito"?',
          audioText: 'Qual é o sinónimo de bonito?',
          visualEmoji: '🌸',
          options: ['Lindo', 'Feio', 'Pequeno'],
          correctAnswer: 'Lindo',
          hint: 'Pensa numa palavra que também usamos para elogiar uma flor.',
        },
        {
          id: 'jan-17-2',
          prompt: 'Qual é o sinónimo de "rápido"?',
          audioText: 'Qual é o sinónimo de rápido?',
          visualEmoji: '🐆',
          options: ['Veloz', 'Lento', 'Pesado'],
          correctAnswer: 'Veloz',
          hint: 'Como corre a chita? Muito...',
        },
      ],
      2: [
        {
          id: 'jan-17-2-1',
          prompt: 'Qual é o sinónimo de "começar"?',
          audioText: 'Qual é o sinónimo de começar?',
          options: ['Iniciar', 'Terminar', 'Esquecer'],
          correctAnswer: 'Iniciar',
          hint: 'Quando damos início a uma tarefa, vamos...',
        },
        {
          id: 'jan-17-2-2',
          prompt: 'Qual é o sinónimo de "auxiliar"?',
          audioText: 'Qual é o sinónimo de auxiliar?',
          options: ['Ajudar', 'Impedir', 'Guardar'],
          correctAnswer: 'Ajudar',
          hint: 'Dar apoio a um colega é o mesmo que...',
        },
      ],
      3: [
        {
          id: 'jan-17-3-1',
          prompt: 'Qual é o sinónimo de "observar atentamente"?',
          audioText: 'Qual é o sinónimo de observar atentamente?',
          options: ['Examinar', 'Ignorar', 'Desenhar'],
          correctAnswer: 'Examinar',
          hint: 'Um detetive faz isso às pistas.',
        },
      ],
    },
  },
  {
    id: 'jan-antonimos',
    number: 18,
    title: 'Trabalho de antónimos',
    gameTitle: 'Descobre o contrário',
    month: 'janeiro',
    competency: 'relacoes_semanticas',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Identificar palavras com significados opostos (antónimos).',
    simpleInstruction: 'Seleciona a palavra que significa o contrário.',
    demonstrationExample: 'Exemplo: O contrário de "quente" é "frio".',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'jan-18-1',
          prompt: 'Qual é o contrário de "grande"?',
          audioText: 'Qual é o contrário de grande?',
          visualEmoji: '🐘',
          options: ['Pequeno', 'Enorme', 'Alto'],
          correctAnswer: 'Pequeno',
          hint: 'Um elefante é grande, mas uma formiga é...',
        },
        {
          id: 'jan-18-2',
          prompt: 'Qual é o contrário de "abrir"?',
          audioText: 'Qual é o contrário de abrir?',
          visualEmoji: '🚪',
          options: ['Fechar', 'Entrar', 'Subir'],
          correctAnswer: 'Fechar',
          hint: 'Quando saímos da sala, devemos ... a porta.',
        },
      ],
      2: [
        {
          id: 'jan-18-2-1',
          prompt: 'Qual é o contrário de "silencioso"?',
          audioText: 'Qual é o contrário de silencioso?',
          options: ['Barulhento', 'Calmo', 'Tranquilo'],
          correctAnswer: 'Barulhento',
          hint: 'Quando há muito ruído, o espaço está...',
        },
      ],
      3: [
        {
          id: 'jan-18-3-1',
          prompt: 'Qual é o contrário de "avançar"?',
          audioText: 'Qual é o contrário de avançar?',
          options: ['Recuar', 'Continuar', 'Saltar'],
          correctAnswer: 'Recuar',
          hint: 'Se não vamos para a frente, vamos para trás, ou seja...',
        },
      ],
    },
  },
  {
    id: 'jan-categorias',
    number: 19,
    title: 'Identificação de categorias semânticas',
    gameTitle: 'O detetive das categorias',
    month: 'janeiro',
    competency: 'vocabulario',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Agrupar palavras por famílias e categorias semânticas.',
    simpleInstruction: 'Descobre a que categoria pertencem as palavras apresentadas.',
    demonstrationExample: 'Exemplo: Maçã, banana e pera pertencem à categoria "Frutas".',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'jan-19-1',
          prompt: 'A que categoria pertencem: cão, gato, cavalo?',
          audioText: 'A que categoria pertencem: cão, gato, cavalo?',
          visualEmoji: '🐾',
          options: ['Animais', 'Transportes', 'Roupas'],
          correctAnswer: 'Animais',
          hint: 'Todos eles são seres vivos com quatro patas.',
        },
      ],
      2: [
        {
          id: 'jan-19-2-1',
          prompt: 'Qual destas palavras NÃO pertence à categoria "Material Escolar"?',
          audioText: 'Qual destas palavras não pertence à categoria Material Escolar?',
          options: ['Almofada', 'Caderno', 'Borracha'],
          correctAnswer: 'Almofada',
          hint: 'O que usas para dormir na cama em vez de levar na mochila?',
        },
      ],
      3: [
        {
          id: 'jan-19-3-1',
          prompt: 'A que categoria pertencem: Lisboa, Porto, Coimbra, Faro?',
          audioText: 'A que categoria pertencem: Lisboa, Porto, Coimbra, Faro?',
          options: ['Cidades de Portugal', 'Rios da Europa', 'Estações do ano'],
          correctAnswer: 'Cidades de Portugal',
          hint: 'São localidades importantes do nosso país.',
        },
      ],
    },
  },
  {
    id: 'jan-instrucoes',
    number: 20,
    title: 'Compreensão de instruções segmentadas',
    gameTitle: 'Segue as instruções',
    month: 'janeiro',
    competency: 'compreensao_instrucoes',
    curriculumArea: 'Transversal',
    pedagogicalObjective: 'Compreender e ordenar instruções com vários elementos.',
    simpleInstruction: 'Lê a instrução com atenção e ordena os passos pela ordem certa.',
    demonstrationExample:
      'Exemplo: "Primeiro abre o caderno, depois escreve a data." -> 1. Abrir o caderno; 2. Escrever a data.',
    type: 'sequence_order',
    levels: {
      1: [
        {
          id: 'jan-20-1',
          prompt: 'Instrução: "Primeiro pega no lápis, depois desenha um sol."',
          audioText: 'Primeiro pega no lápis, depois desenha um sol.',
          scrambledItems: ['Desenha um sol', 'Pega no lápis'],
          correctOrder: ['Pega no lápis', 'Desenha um sol'],
          hint: 'O que precisas de fazer antes de poder desenhar?',
        },
      ],
      2: [
        {
          id: 'jan-20-2-1',
          prompt:
            'Instrução: "Antes de lanchar, lava as mãos, senta-te à mesa e abre a lancheira."',
          audioText:
            'Antes de lanchar, lava as mãos, senta-te à mesa e abre a lancheira.',
          scrambledItems: [
            'Abre a lancheira',
            'Lava as mãos',
            'Senta-te à mesa',
          ],
          correctOrder: [
            'Lava as mãos',
            'Senta-te à mesa',
            'Abre a lancheira',
          ],
          hint: 'Segue a ordem exata da frase: primeiro lavar, depois sentar, por fim abrir.',
        },
      ],
      3: [
        {
          id: 'jan-20-3-1',
          prompt:
            'Instrução: "Sublinha o título a azul, rodeia os verbos a verde e no fim relê a frase."',
          audioText:
            'Sublinha o título a azul, rodeia os verbos a verde e no fim relê a frase.',
          scrambledItems: [
            'Relê a frase',
            'Rodeia os verbos a verde',
            'Sublinha o título a azul',
          ],
          correctOrder: [
            'Sublinha o título a azul',
            'Rodeia os verbos a verde',
            'Relê a frase',
          ],
          hint: 'Repara na expressão "no fim" para saber qual é o último passo.',
        },
      ],
    },
  },

  // ================= FEVEREIRO =================
  {
    id: 'fev-ouve-responde',
    number: 26,
    title: 'Repetição e evocação de informação significativa',
    gameTitle: 'Ouve e responde',
    month: 'fevereiro',
    competency: 'compreensao_oral',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Reter e recuperar informação essencial após audição.',
    simpleInstruction: 'Ouve a mensagem com atenção e responde à pergunta.',
    demonstrationExample:
      'Exemplo: "O Rui foi ao mercado comprar maçãs." -> O que comprou o Rui? Maçãs.',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'fev-26-1',
          prompt: 'Ouve a frase: "A Inês levou o guarda-chuva porque estava a chover."',
          audioText: 'A Inês levou o guarda-chuva porque estava a chover.',
          visualEmoji: '☔',
          options: ['O guarda-chuva', 'Os óculos de sol', 'A bicicleta'],
          correctAnswer: 'O guarda-chuva',
          hint: 'O que usamos quando está a chover?',
        },
      ],
      2: [
        {
          id: 'fev-26-2-1',
          prompt:
            'Ouve com atenção: "No sábado de manhã, o Tomás e o avô foram pescar ao rio e viram três patos."',
          audioText:
            'No sábado de manhã, o Tomás e o avô foram pescar ao rio e viram três patos.',
          options: ['No sábado de manhã', 'No domingo à tarde', 'Na sexta-feira'],
          correctAnswer: 'No sábado de manhã',
          hint: 'Presta atenção ao dia da semana referido no início.',
        },
      ],
      3: [
        {
          id: 'fev-26-3-1',
          prompt:
            'Ouve a notícia: "A feira do livro da escola começa na terça-feira no ginásio e cada turma pode escolher dois livros novos."',
          audioText:
            'A feira do livro da escola começa na terça-feira no ginásio e cada turma pode escolher dois livros novos.',
          options: [
            'No ginásio, na terça-feira',
            'Na cantina, na segunda-feira',
            'No recreio, na quarta-feira',
          ],
          correctAnswer: 'No ginásio, na terça-feira',
          hint: 'Procura o local e o dia em que começa a feira.',
        },
      ],
    },
  },
  {
    id: 'fev-historia-desordenada',
    number: 25,
    title: 'Ordenação de sequências e organização temporal',
    gameTitle: 'A história desordenada',
    month: 'fevereiro',
    competency: 'organizacao_discurso',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Organizar acontecimentos por ordem temporal e lógica.',
    simpleInstruction: 'Coloca os acontecimentos pela ordem em que aconteceram.',
    demonstrationExample:
      'Exemplo: 1. Acordar -> 2. Tomar o pequeno-almoço -> 3. Ir para a escola.',
    type: 'sequence_order',
    levels: {
      1: [
        {
          id: 'fev-25-1',
          prompt: 'Ordena a história da semente:',
          audioText: 'Ordena a história da semente.',
          scrambledItems: [
            'Nasceu uma flor amarela.',
            'O João plantou uma semente na terra.',
            'Regou a terra todos os dias.',
          ],
          correctOrder: [
            'O João plantou uma semente na terra.',
            'Regou a terra todos os dias.',
            'Nasceu uma flor amarela.',
          ],
          hint: 'O que acontece primeiro: plantar a semente ou nascer a flor?',
        },
      ],
      2: [
        {
          id: 'fev-25-2-1',
          prompt: 'Ordena os acontecimentos do passeio:',
          audioText: 'Ordena os acontecimentos do passeio.',
          scrambledItems: [
            'Regressaram à escola muito contentes.',
            'Entraram no autocarro com a professora.',
            'Visitaram o aquário e viram tubarões.',
          ],
          correctOrder: [
            'Entraram no autocarro com a professora.',
            'Visitaram o aquário e viram tubarões.',
            'Regressaram à escola muito contentes.',
          ],
          hint: 'Pensa no início da viagem, na visita e no regresso.',
        },
      ],
      3: [
        {
          id: 'fev-25-3-1',
          prompt: 'Ordena os passos da receita do bolo:',
          audioText: 'Ordena os passos da receita do bolo.',
          scrambledItems: [
            'Retirou o bolo do forno quando ficou dourado.',
            'Misturou os ovos, a farinha e o açúcar numa taça.',
            'Colocou a massa numa forma untada.',
            'Partilhou uma fatia com a família.',
          ],
          correctOrder: [
            'Misturou os ovos, a farinha e o açúcar numa taça.',
            'Colocou a massa numa forma untada.',
            'Retirou o bolo do forno quando ficou dourado.',
            'Partilhou uma fatia com a família.',
          ],
          hint: 'Primeiro preparam-se os ingredientes, depois vai ao forno e só no fim se come.',
        },
      ],
    },
  },
  {
    id: 'fev-quem-onde-quando',
    number: 28,
    title: 'Resposta a perguntas de apoio',
    gameTitle: 'Quem? Onde? Quando? O quê?',
    month: 'fevereiro',
    competency: 'memoria_verbal',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Identificar os elementos essenciais de um enunciado oral ou escrito.',
    simpleInstruction: 'Lê ou ouve a frase e responde à pergunta indicada.',
    demonstrationExample:
      'Exemplo: "Ontem, a Sofia leu no jardim." -> Onde? No jardim.',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'fev-28-1',
          prompt: 'Frase: "O Tiago jogou futebol no parque." — ONDE jogou o Tiago?',
          audioText: 'O Tiago jogou futebol no parque. Onde jogou o Tiago?',
          visualEmoji: '⚽',
          options: ['No parque', 'Na escola', 'Em casa'],
          correctAnswer: 'No parque',
          hint: 'Procura a palavra que indica o lugar.',
        },
      ],
      2: [
        {
          id: 'fev-28-2-1',
          prompt:
            'Frase: "Na segunda-feira, a professora contou uma lenda na biblioteca." — QUANDO aconteceu?',
          audioText:
            'Na segunda-feira, a professora contou uma lenda na biblioteca. Quando aconteceu?',
          options: ['Na segunda-feira', 'Na biblioteca', 'Uma lenda'],
          correctAnswer: 'Na segunda-feira',
          hint: '"Quando" pergunta pelo tempo ou dia.',
        },
      ],
      3: [
        {
          id: 'fev-28-3-1',
          prompt:
            'Frase: "Ao entardecer, os pescadores recolheram as redes no porto." — QUEM realizou a ação?',
          audioText:
            'Ao entardecer, os pescadores recolheram as redes no porto. Quem realizou a ação?',
          options: ['Os pescadores', 'As redes', 'No porto'],
          correctAnswer: 'Os pescadores',
          hint: '"Quem" pergunta pelas pessoas que fazem a ação.',
        },
      ],
    },
  },

  // ================= MARÇO =================
  {
    id: 'mar-detetive-enunciados',
    number: 33,
    title: 'Identificação de dados relevantes e o que é pedido',
    gameTitle: 'O detetive dos enunciados',
    month: 'marco',
    competency: 'compreensao_textos',
    curriculumArea: 'Matemática',
    pedagogicalObjective:
      'Distinguir dados relevantes e compreender o que é pedido em problemas curriculares.',
    simpleInstruction:
      'Lê o problema com calma. Não precisas de fazer contas já: descobre primeiro o que é pedido!',
    demonstrationExample:
      'Exemplo: "A Ana tinha 5 lápis e ganhou 3. Quantos lápis tem agora?" -> O que é pedido: Saber quantos lápis tem agora.',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'mar-33-1',
          prompt:
            'Problema: "O Lucas tem 4 carrinhos vermelhos e 2 carrinhos azuis. Quantos carrinhos tem o Lucas ao todo?" — O que é pedido?',
          audioText:
            'O Lucas tem 4 carrinhos vermelhos e 2 carrinhos azuis. Quantos carrinhos tem o Lucas ao todo? O que é pedido?',
          visualEmoji: '🚗',
          options: [
            'Saber quantos carrinhos tem ao todo',
            'Saber a cor da camisola do Lucas',
            'Saber onde comprou os carrinhos',
          ],
          correctAnswer: 'Saber quantos carrinhos tem ao todo',
          hint: 'Olha para a frase que termina com o ponto de interrogação (?).',
        },
      ],
      2: [
        {
          id: 'mar-33-2-1',
          prompt:
            'Problema: "Numa caixa havia 15 morangos. A Maria comeu 4 morangos ao lanche. Quantos morangos ficaram na caixa?" — Quais são os dados importantes?',
          audioText:
            'Numa caixa havia 15 morangos. A Maria comeu 4 morangos ao lanche. Quantos morangos ficaram na caixa? Quais são os dados importantes?',
          options: [
            'Havia 15 morangos e comeu 4',
            'A Maria lanchou às cinco horas',
            'Os morangos eram doces',
          ],
          correctAnswer: 'Havia 15 morangos e comeu 4',
          hint: 'Procura os números que indicam a quantidade inicial e a quantidade que foi comida.',
        },
      ],
      3: [
        {
          id: 'mar-33-3-1',
          prompt:
            'Problema: "A turma do 3.º ano tem 22 alunos. Hoje faltaram 3 alunos por estarem constipados. Quantos alunos estão presentes na sala?" — Que estratégia resolve o problema?',
          audioText:
            'A turma do 3.º ano tem 22 alunos. Hoje faltaram 3 alunos por estarem constipados. Quantos alunos estão presentes na sala? Que estratégia resolve o problema?',
          options: [
            'Subtrair os 3 alunos que faltaram aos 22 alunos da turma',
            'Somar 22 com 3',
            'Multiplicar 22 por 3',
          ],
          correctAnswer: 'Subtrair os 3 alunos que faltaram aos 22 alunos da turma',
          hint: 'Se alguns alunos faltaram, o número de presentes é menor do que 22.',
        },
      ],
    },
  },
  {
    id: 'mar-estudo-meio',
    number: 34,
    title: 'Sublinhado de palavras-chave em Estudo do Meio',
    gameTitle: 'Encontra os dados importantes',
    month: 'marco',
    competency: 'compreensao_textos',
    curriculumArea: 'Estudo do Meio',
    pedagogicalObjective: 'Identificar informação explícita em textos de Estudo do Meio.',
    simpleInstruction: 'Lê o pequeno texto informativo e identifica a informação explícita.',
    demonstrationExample:
      'Exemplo: "As plantas precisam de água, luz solar e terra para crescer." -> Elementos essenciais: água, luz solar e terra.',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'mar-34-1',
          prompt:
            'Texto: "Os peixes vivem na água, têm o corpo coberto de escamas e respiram por guelras." — Como respiram os peixes?',
          audioText:
            'Os peixes vivem na água, têm o corpo coberto de escamas e respiram por guelras. Como respiram os peixes?',
          visualEmoji: '🐟',
          options: ['Por guelras', 'Por pulmões', 'Pelas barbatanas'],
          correctAnswer: 'Por guelras',
          hint: 'Procura a palavra que aparece logo depois de "respiram por...".',
        },
      ],
      2: [
        {
          id: 'mar-34-2-1',
          prompt:
            'Texto: "A água na natureza pode encontrar-se em três estados: sólido (gelo), líquido (rios e mares) e gasoso (vapor de água)." — Em que estado está a água dos rios?',
          audioText:
            'A água na natureza pode encontrar-se em três estados: sólido, líquido e gasoso. Em que estado está a água dos rios?',
          options: ['Estado líquido', 'Estado sólido', 'Estado gasoso'],
          correctAnswer: 'Estado líquido',
          hint: 'Vê o que está escrito entre parênteses a seguir a "líquido".',
        },
      ],
      3: [
        {
          id: 'mar-34-3-1',
          prompt:
            'Texto: "A reciclagem permite transformar materiais usados em novos produtos. O papel coloca-se no ecoponto azul, o vidro no verde e as embalagens no amarelo." — Onde se coloca uma garrafa de vidro?',
          audioText:
            'O papel coloca-se no ecoponto azul, o vidro no verde e as embalagens no amarelo. Onde se coloca uma garrafa de vidro?',
          options: ['No ecoponto verde', 'No ecoponto azul', 'No ecoponto amarelo'],
          correctAnswer: 'No ecoponto verde',
          hint: 'Associa a palavra "vidro" à cor indicada na frase.',
        },
      ],
    },
  },

  // ================= ABRIL =================
  {
    id: 'abr-constroi-frase',
    number: 43,
    title: 'Construção e ordenação de frases',
    gameTitle: 'Constrói a frase',
    month: 'abril',
    competency: 'producao_escrita',
    curriculumArea: 'Português',
    pedagogicalObjective: 'Estruturar frases simples e complexas com coerência sintática.',
    simpleInstruction: 'Clica nas palavras pela ordem certa para formar uma frase com sentido.',
    demonstrationExample:
      'Exemplo: [O] [gato] [bebe] [leite.] -> "O gato bebe leite."',
    type: 'word_order',
    levels: {
      1: [
        {
          id: 'abr-43-1',
          prompt: 'Ordena as palavras para formar a frase:',
          audioText: 'A menina lê um livro.',
          scrambledItems: ['livro.', 'A', 'um', 'menina', 'lê'],
          correctOrder: ['A', 'menina', 'lê', 'um', 'livro.'],
          hint: 'Começa pela palavra com letra maiúscula ("A") e termina na palavra com ponto final.',
        },
        {
          id: 'abr-43-2',
          prompt: 'Ordena as palavras para formar a frase:',
          audioText: 'O cão corre no jardim.',
          scrambledItems: ['no', 'O', 'jardim.', 'cão', 'corre'],
          correctOrder: ['O', 'cão', 'corre', 'no', 'jardim.'],
          hint: 'Quem faz a ação? "O cão". O que faz? "corre". Onde? "no jardim."',
        },
      ],
      2: [
        {
          id: 'abr-43-2-1',
          prompt: 'Ordena as palavras para formar uma frase completa:',
          audioText: 'Os alunos escrevem histórias divertidas na sala.',
          scrambledItems: [
            'histórias',
            'Os',
            'na',
            'alunos',
            'divertidas',
            'sala.',
            'escrevem',
          ],
          correctOrder: [
            'Os',
            'alunos',
            'escrevem',
            'histórias',
            'divertidas',
            'na',
            'sala.',
          ],
          hint: 'Começa por "Os alunos" e termina em "na sala.".',
        },
      ],
      3: [
        {
          id: 'abr-43-3-1',
          prompt: 'Ordena as palavras para construir a frase:',
          audioText: 'Depois do recreio, a turma resolveu um desafio de leitura.',
          scrambledItems: [
            'um',
            'Depois',
            'resolveu',
            'do',
            'desafio',
            'recreio,',
            'a',
            'de',
            'turma',
            'leitura.',
          ],
          correctOrder: [
            'Depois',
            'do',
            'recreio,',
            'a',
            'turma',
            'resolveu',
            'um',
            'desafio',
            'de',
            'leitura.',
          ],
          hint: 'Começa pela expressão de tempo "Depois do recreio,".',
        },
      ],
    },
  },
  {
    id: 'abr-oficina-escrita',
    number: 45,
    title: 'Processador de texto orientado e revisão',
    gameTitle: 'A minha primeira história',
    month: 'abril',
    competency: 'producao_escrita',
    curriculumArea: 'Português',
    pedagogicalObjective:
      'Planificar, redigir e rever um pequeno texto com apoio de banco de palavras e lista de verificação.',
    simpleInstruction:
      'Usa as perguntas orientadoras e o banco de palavras para escreveres o teu texto. Depois, verifica a lista!',
    demonstrationExample:
      'Exemplo: "Era uma vez um pequeno esquilo que vivia num pinheiro alto. Um dia encontrou uma noz dourada..."',
    type: 'guided_writing',
    levels: {
      1: [
        {
          id: 'abr-45-1',
          prompt: 'Escreve 2 ou 3 frases sobre um animal amigo.',
          audioText: 'Escreve duas ou três frases sobre um animal amigo.',
          hint: 'Podes clicar nas palavras do banco de palavras para as usares no teu texto.',
          writingPrompt: 'Conta quem é o animal, onde vive e o que gosta de fazer.',
          guidingQuestions: [
            'Quem é o animal? (Ex: Um cão, um gato, um pássaro)',
            'Onde vive ele?',
            'O que gosta de fazer?',
          ],
          wordBank: [
            'Era uma vez',
            'pequeno',
            'alegre',
            'jardim',
            'brincar',
            'correr',
            'amigos',
            'muito',
          ],
          sentenceStarter: 'Era uma vez um ',
          checklist: [
            'Comecei as frases com letra maiúscula?',
            'Coloquei ponto final no fim das frases?',
            'Usei pelo menos duas palavras do banco de palavras?',
          ],
        },
      ],
      2: [
        {
          id: 'abr-45-2-1',
          prompt: 'Escreve um pequeno texto sobre um dia especial na escola.',
          audioText: 'Escreve um pequeno texto sobre um dia especial na escola.',
          hint: 'Organiza o texto em início, meio e fim.',
          writingPrompt: 'Descreve o que aconteceu nesse dia especial.',
          guidingQuestions: [
            'Quando aconteceu? (Ex: Na semana passada, ontem)',
            'Quem participou?',
            'O que fizeram e como terminou o dia?',
          ],
          wordBank: [
            'Na semana passada',
            'professora',
            'colegas',
            'descobrimos',
            'entusiasmados',
            'biblioteca',
            'aprendemos',
            'No final',
          ],
          sentenceStarter: 'Na semana passada, na minha escola, ',
          checklist: [
            'O texto tem início, meio e fim?',
            'Utilizei pontuação adequada (vírgulas e pontos finais)?',
            'Reli o texto para verificar se todas as palavras estão completas?',
          ],
        },
      ],
      3: [
        {
          id: 'abr-45-3-1',
          prompt: 'Cria uma pequena história de aventura com resolução de um problema.',
          audioText: 'Cria uma pequena história de aventura com resolução de um problema.',
          hint: 'Usa conectores como "De repente", "Então" e "Por fim".',
          writingPrompt: 'Imagina uma descoberta surpreendente durante um passeio.',
          guidingQuestions: [
            'Onde decorre a aventura e quem são as personagens?',
            'Que desafio ou mistério surgiu?',
            'Como resolveram a situação?',
          ],
          wordBank: [
            'Numa manhã soalheira',
            'exploradores',
            'mapa antigo',
            'De repente',
            'observaram',
            'estratégia',
            'Por fim',
            'conseguiram',
          ],
          sentenceStarter: 'Numa manhã soalheira, ',
          checklist: [
            'Apresentei as personagens e o lugar no início?',
            'Expliquei o problema e a sua solução?',
            'Revi a ortografia e a concordância das frases?',
          ],
        },
      ],
    },
  },

  // ================= MAIO =================
  {
    id: 'mai-estrategias',
    number: 53,
    title: 'Seleção de estratégias e recursos de apoio',
    gameTitle: 'Escolhe a melhor estratégia',
    month: 'maio',
    competency: 'autonomia',
    curriculumArea: 'Transversal',
    pedagogicalObjective:
      'Selecionar recursos de apoio adequados e transferir estratégias para novas tarefas.',
    simpleInstruction:
      'Lê a situação e escolhe a estratégia mais útil para resolver o desafio com autonomia.',
    demonstrationExample:
      'Exemplo: Se não conheces o significado de uma palavra -> Consultar o glossário ou reler a frase.',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'mai-53-1',
          prompt:
            'Estás a ler um texto e encontras uma palavra difícil que não conheces. O que podes fazer primeiro?',
          audioText:
            'Estás a ler um texto e encontras uma palavra difícil que não conheces. O que podes fazer primeiro?',
          visualEmoji: '🧭',
          options: [
            'Ler a frase toda para perceber o sentido ou consultar o glossário',
            'Fechar o livro e desistir',
            'Saltar a página toda sem ler',
          ],
          correctAnswer:
            'Ler a frase toda para perceber o sentido ou consultar o glossário',
          hint: 'Pensa num recurso da nossa plataforma que explica palavras difíceis.',
        },
      ],
      2: [
        {
          id: 'mai-53-2-1',
          prompt:
            'Tens um problema de Matemática com várias frases. Qual é a melhor estratégia?',
          audioText:
            'Tens um problema de Matemática com várias frases. Qual é a melhor estratégia?',
          options: [
            'Dividir em etapas, sublinhar os dados importantes e identificar a pergunta',
            'Somar todos os números sem ler o texto',
            'Responder ao acaso',
          ],
          correctAnswer:
            'Dividir em etapas, sublinhar os dados importantes e identificar a pergunta',
          hint: 'Lembra-te do que aprendeste em Março sobre enunciados!',
        },
      ],
      3: [
        {
          id: 'mai-53-3-1',
          prompt:
            'Vais escrever um texto informativo sobre um animal. Como deves organizar o teu trabalho?',
          audioText:
            'Vais escrever um texto informativo sobre um animal. Como deves organizar o teu trabalho?',
          options: [
            'Fazer um plano de texto com tópicos, escrever o rascunho e rever com a lista de verificação',
            'Escrever tudo seguido sem planear nem reler',
            'Copiar apenas o título',
          ],
          correctAnswer:
            'Fazer um plano de texto com tópicos, escrever o rascunho e rever com a lista de verificação',
          hint: 'Um bom escritor planeia antes de escrever e revê no final.',
        },
      ],
    },
  },

  // ================= JUNHO =================
  {
    id: 'jun-grande-desafio',
    number: 55,
    title: 'Consolidação global e reaplicação de competências',
    gameTitle: 'O grande desafio das palavras',
    month: 'junho',
    competency: 'autonomia',
    curriculumArea: 'Português',
    pedagogicalObjective:
      'Consolidar aprendizagens de leitura, vocabulário, compreensão e escrita.',
    simpleInstruction:
      'Mostra tudo o que aprendeste ao longo dos meses neste desafio final!',
    demonstrationExample:
      'Exemplo: Lê com atenção, usa as tuas estratégias e celebra cada conquista.',
    type: 'multiple_choice',
    levels: {
      1: [
        {
          id: 'jun-55-1',
          prompt:
            'Lê a frase: "O vento forte abanava as folhas secas no outono." — Qual é o verbo de ação nesta frase?',
          audioText:
            'O vento forte abanava as folhas secas no outono. Qual é o verbo de ação nesta frase?',
          visualEmoji: '🍂',
          options: ['Abanava', 'Forte', 'Outono'],
          correctAnswer: 'Abanava',
          hint: 'O verbo indica o que o vento estava a fazer.',
        },
      ],
      2: [
        {
          id: 'jun-55-2-1',
          prompt:
            'Completa a frase com o conector adequado: "A Clara estudou muito, ________ conseguiu resolver todos os exercícios."',
          audioText:
            'Completa a frase com o conector adequado: A Clara estudou muito, por isso conseguiu resolver todos os exercícios.',
          options: ['por isso', 'embora', 'enquanto'],
          correctAnswer: 'por isso',
          hint: 'Procura a expressão que mostra a consequência de ter estudado muito.',
        },
      ],
      3: [
        {
          id: 'jun-55-3-1',
          prompt:
            'Lê o texto: "Os golfinhos comunicam através de assobios e cliques. Vivem em grupos e ajudam-se mutuamente." — Qual é a ideia principal?',
          audioText:
            'Os golfinhos comunicam através de assobios e cliques. Vivem em grupos e ajudam-se mutuamente. Qual é a ideia principal?',
          options: [
            'Os golfinhos são animais sociais que comunicam e cooperam entre si',
            'Os golfinhos vivem apenas em aquários',
            'Os golfinhos não gostam de nadar em grupo',
          ],
          correctAnswer:
            'Os golfinhos são animais sociais que comunicam e cooperam entre si',
          hint: 'Junta as duas informações do texto: comunicam e ajudam-se em grupo.',
        },
      ],
    },
  },
  ...EXTRA_PEDAGOGICAL_ACTIVITIES,
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
