export type NavSectionId =
  | 'inicio'
  | 'percurso'
  | 'janeiro'
  | 'fevereiro'
  | 'marco'
  | 'abril'
  | 'maio'
  | 'junho'
  | 'jogos'
  | 'historias'
  | 'biblioteca'
  | 'progresso'
  | 'professora';

export type MonthId =
  | 'janeiro'
  | 'fevereiro'
  | 'marco'
  | 'abril'
  | 'maio'
  | 'junho';

export type DifficultyLevel = 1 | 2 | 3;

export type InterventionProfile = 'perfil1' | 'perfil2' | 'perfil3';

export type CompetencyId =
  | 'precisao_leitora'
  | 'fluencia_leitora'
  | 'compreensao_instrucoes'
  | 'vocabulario'
  | 'relacoes_semanticas'
  | 'compreensao_oral'
  | 'memoria_verbal'
  | 'organizacao_discurso'
  | 'compreensao_textos'
  | 'producao_escrita'
  | 'autonomia';

export interface CompetencyInfo {
  id: CompetencyId;
  label: string;
  shortLabel: string;
  description: string;
}

export interface GlossaryEntry {
  id: string;
  word: string;
  meaning: string;
  example: string;
  dateAdded: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  age: number;
  schoolYear: '1.º ano' | '2.º ano' | '3.º ano' | '4.º ano';
  profile: InterventionProfile;
  priorityCompetencies: CompetencyId[];
  startDate: string;
  observations: string;
  difficultyLevel: DifficultyLevel;
  points: number;
  earnedMedals: string[];
  personalGlossary: GlossaryEntry[];
}

export interface ActivityResult {
  id: string;
  studentId: string;
  activityId: string;
  activityTitle: string;
  month: MonthId;
  competency: CompetencyId;
  difficultyLevel: DifficultyLevel;
  date: string;
  attempts: number;
  correctCount: number;
  totalCount: number;
  hintsUsed: number;
  autonomyDegree: 'Com apoio total' | 'Com apoio parcial' | 'Autónomo';
  notes?: string;
}

export type AssessmentRating = 'Emergente' | 'Em desenvolvimento' | 'Consolidado';

export interface InitialAssessment {
  studentId: string;
  date: string;
  ratings: Record<CompetencyId, AssessmentRating>;
  qualitativeNotes: string;
}

export interface IndividualPlan {
  studentId: string;
  selectedMonths: MonthId[];
  priorityObjectives: string[];
  selectedActivityIds: string[];
  difficultyLevel: DifficultyLevel;
  frequency: string;
  strategies: string;
  notes: string;
}

export interface SessionRecord {
  id: string;
  date: string;
  studentId: string;
  competencies: CompetencyId[];
  activitiesDone: string[];
  resultsSummary: string;
  supportLevel: 'Apoio total' | 'Apoio moderado' | 'Apoio mínimo' | 'Autónomo';
  autonomyDegree: 'Inicial' | 'Progressiva' | 'Consolidada';
  teacherNotes: string;
  nextSessionPriorities: string;
}

export interface AccessibilitySettings {
  fontFamily: 'default' | 'arial' | 'verdana' | 'opendyslexic';
  fontSize: 'normal' | 'large' | 'xlarge';
  spacing: 'normal' | 'relaxed' | 'wide';
  theme: 'light' | 'dark';
  audioEnabled: boolean;
  highlightKeywords: boolean;
}

export type ExerciseType =
  | 'multiple_choice'
  | 'true_false'
  | 'word_order'
  | 'sequence_order'
  | 'fill_blank'
  | 'matching'
  | 'guided_reading'
  | 'guided_writing';

export interface ExerciseQuestion {
  id: string;
  prompt: string;
  audioText?: string;
  visualEmoji?: string;
  hint: string;
  // For multiple_choice, true_false, fill_blank
  options?: string[];
  correctAnswer?: string;
  // For word_order & sequence_order
  scrambledItems?: string[];
  correctOrder?: string[];
  // For matching
  pairs?: { left: string; right: string }[];
  // For guided_reading
  readingText?: string;
  keywords?: string[];
  comprehensionCheck?: {
    question: string;
    options: string[];
    answer: string;
  };
  // For guided_writing
  writingPrompt?: string;
  guidingQuestions?: string[];
  wordBank?: string[];
  sentenceStarter?: string;
  checklist?: string[];
}

export interface PedagogicalActivity {
  id: string;
  number?: number; // e.g., 14 to 62 for mandatory activities
  title: string;
  gameTitle?: string;
  month: MonthId;
  competency: CompetencyId;
  curriculumArea?: 'Português' | 'Matemática' | 'Estudo do Meio' | 'Transversal';
  pedagogicalObjective: string;
  simpleInstruction: string;
  demonstrationExample: string;
  type: ExerciseType;
  levels: Record<DifficultyLevel, ExerciseQuestion[]>;
}

export interface MonthlyModule {
  id: MonthId;
  name: string;
  navTitle: string;
  subtitle: string;
  priorityFocus: string;
  operationalObjectives: string[];
  mandatoryActivitiesList: { number: number; title: string }[];
  interactiveGamesList: string[];
  evaluationIndicators: string[];
  mainIndicatorsSummary: string;
}

export interface InteractiveStory {
  id: string;
  title: string;
  month: MonthId;
  level: DifficultyLevel;
  readingTime: string;
  themeColor: string;
  illustrationType: 'forest' | 'ocean' | 'school' | 'garden';
  paragraphs: {
    text: string;
    keywords: string[];
  }[];
  comprehensionQuestions: {
    question: string;
    options: string[];
    correctAnswer: string;
    hint: string;
  }[];
  retellingPrompts: string[];
}

export type ResourceCategory =
  | 'Textos curtos'
  | 'Histórias ilustradas'
  | 'Sequências de imagens'
  | 'Imagens para descrição oral'
  | 'Bancos de palavras'
  | 'Glossários'
  | 'Guiões de escrita'
  | 'Organizadores gráficos'
  | 'Exercícios de compreensão'
  | 'Atividades de vocabulário'
  | 'Modelos de frases';

export interface ResourceLibraryItem {
  id: string;
  title: string;
  category: ResourceCategory;
  competency: CompetencyId;
  ageRange: string;
  complexity: DifficultyLevel;
  description: string;
  contentPreview: string[];
  linkedActivityId?: string;
}
