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
  studentId: string;
  word: string;
  meaning: string;
  example: string;
  dateAdded: string;
}

export type SchoolYear = '1.º ano' | '2.º ano' | '3.º ano' | '4.º ano';

/** Identity of a student. What they work on lives in their IndividualPlan. */
export interface StudentProfile {
  id: string;
  name: string;
  age: number;
  schoolYear: SchoolYear;
  profile: InterventionProfile;
  startDate: string;
  observations: string;
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
  ratings: Partial<Record<CompetencyId, AssessmentRating>>;
  notes: string;
}

/**
 * The individual plan drives what the student sees: their level, their
 * priority competencies and the activities listed in "O meu percurso".
 */
export interface IndividualPlan {
  studentId: string;
  priorityCompetencies: CompetencyId[];
  difficultyLevel: DifficultyLevel;
  activityIds: string[];
  objectives: string[];
  frequency: string;
  strategies: string;
  notes: string;
}

export type SupportLevel =
  | 'Apoio total'
  | 'Apoio moderado'
  | 'Apoio mínimo'
  | 'Autónomo';
export type SessionAutonomy = 'Inicial' | 'Progressiva' | 'Consolidada';

/** Lesson summary (sumário) written by the teacher after each session. */
export interface SessionRecord {
  id: string;
  studentId: string;
  date: string;
  activityIds: string[];
  otherActivities: string;
  competencies: CompetencyId[];
  summary: string;
  supportLevel: SupportLevel;
  autonomyDegree: SessionAutonomy;
  teacherNotes: string;
  nextPriorities: string;
}

/** The teacher's own text for the end-of-year report. */
export interface FinalReport {
  studentId: string;
  strategies: string;
  continuity: string;
  updatedAt?: string;
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
  /** Hidden activities are kept for the teacher but not shown to students. */
  published?: boolean;
  sortOrder?: number;
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
