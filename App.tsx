import React, { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Compass,
  FolderOpen,
  Gamepad2,
  GraduationCap,
  Home,
  Menu,
  Play,
  Sparkles,
  UserCheck,
  Volume2,
  X,
} from 'lucide-react';
import { AccessibilityBar } from './components/AccessibilityBar';
import { InteractiveActivityModal } from './components/InteractiveActivityModal';
import { InteractiveStoriesView } from './components/InteractiveStoriesView';
import { MonthlyModuleView } from './components/MonthlyModuleView';
import { ResourceLibraryView } from './components/ResourceLibraryView';
import { StudentProgressView } from './components/StudentProgressView';
import { TeacherArea } from './components/TeacherArea';
import {
  COMPETENCIES,
  INTERVENTION_PROFILES,
  MONTHLY_MODULES,
  PEDAGOGICAL_ACTIVITIES,
} from './data/curriculumData';
import {
  AccessibilitySettings,
  ActivityResult,
  CompetencyId,
  DifficultyLevel,
  GlossaryEntry,
  IndividualPlan,
  InitialAssessment,
  MonthId,
  NavSectionId,
  PedagogicalActivity,
  SessionRecord,
  StudentProfile,
} from './types/pedagogical';
import { speakPt } from './utils/speech';

const STORAGE_KEYS = {
  STUDENTS: 'leb_students_v1',
  ACTIVE_STUDENT: 'leb_active_student_v1',
  RESULTS: 'leb_results_v1',
  ASSESSMENTS: 'leb_assessments_v1',
  PLANS: 'leb_plans_v1',
  SESSIONS: 'leb_sessions_v1',
  ACCESSIBILITY: 'leb_accessibility_v1',
  GREETED: 'leb_greeted_v1',
};

const DEFAULT_STUDENT: StudentProfile = {
  id: 'student-tiago',
  name: 'Tiago',
  age: 8,
  schoolYear: '2.º ano',
  profile: 'perfil3',
  priorityCompetencies: INTERVENTION_PROFILES.perfil3.defaultCompetencies,
  startDate: '2026-01-12',
  observations:
    'Gosta de histórias sobre animais e beneficia de leitura modelada e instruções segmentadas.',
  difficultyLevel: 1,
  points: 20,
  earnedMedals: ['primeira-estrela'],
  personalGlossary: [
    {
      id: 'gl-1',
      word: 'estratégia',
      meaning: 'Plano ou caminho que escolhemos para resolver um desafio.',
      example: 'Usei a estratégia de sublinhar as palavras-chave.',
      dateAdded: '2026-01-15',
    },
  ],
};

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  fontFamily: 'default',
  fontSize: 'normal',
  spacing: 'normal',
  theme: 'light',
  audioEnabled: true,
  highlightKeywords: true,
};

const ROOT_FONT_SIZES: Record<AccessibilitySettings['fontSize'], string> = {
  normal: '100%',
  large: '112.5%',
  xlarge: '125%',
};

const NAV_ITEMS: {
  id: NavSectionId;
  label: string;
  group: 'principal' | 'meses' | 'exploracao' | 'gestao';
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'inicio', label: 'Início', group: 'principal', icon: Home },
  {
    id: 'percurso',
    label: 'O meu percurso',
    group: 'principal',
    icon: Compass,
  },
  {
    id: 'janeiro',
    label: 'Janeiro — Ler com precisão',
    group: 'meses',
    icon: Calendar,
  },
  {
    id: 'fevereiro',
    label: 'Fevereiro — Ouvir, compreender e contar',
    group: 'meses',
    icon: Calendar,
  },
  {
    id: 'marco',
    label: 'Março — Compreender e resolver',
    group: 'meses',
    icon: Calendar,
  },
  {
    id: 'abril',
    label: 'Abril — Organizar ideias e escrever',
    group: 'meses',
    icon: Calendar,
  },
  {
    id: 'maio',
    label: 'Maio — Aprender com autonomia',
    group: 'meses',
    icon: Calendar,
  },
  {
    id: 'junho',
    label: 'Junho — Consolidar e avaliar',
    group: 'meses',
    icon: Calendar,
  },
  {
    id: 'jogos',
    label: 'Jogos e desafios',
    group: 'exploracao',
    icon: Gamepad2,
  },
  {
    id: 'historias',
    label: 'Histórias interativas',
    group: 'exploracao',
    icon: BookOpen,
  },
  {
    id: 'biblioteca',
    label: 'Biblioteca de recursos',
    group: 'exploracao',
    icon: FolderOpen,
  },
  {
    id: 'progresso',
    label: 'O meu progresso',
    group: 'exploracao',
    icon: Award,
  },
  {
    id: 'professora',
    label: 'Área da professora',
    group: 'gestao',
    icon: GraduationCap,
  },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSectionId>('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [students, setStudents] = useState<StudentProfile[]>(() =>
    loadFromStorage(STORAGE_KEYS.STUDENTS, [DEFAULT_STUDENT])
  );
  const [activeStudentId, setActiveStudentId] = useState<string>(() =>
    loadFromStorage(STORAGE_KEYS.ACTIVE_STUDENT, DEFAULT_STUDENT.id)
  );
  const [results, setResults] = useState<ActivityResult[]>(() =>
    loadFromStorage(STORAGE_KEYS.RESULTS, [])
  );
  const [assessments, setAssessments] = useState<
    Record<string, InitialAssessment>
  >(() => loadFromStorage(STORAGE_KEYS.ASSESSMENTS, {}));
  const [plans, setPlans] = useState<Record<string, IndividualPlan>>(() =>
    loadFromStorage(STORAGE_KEYS.PLANS, {})
  );
  const [sessions, setSessions] = useState<SessionRecord[]>(() =>
    loadFromStorage(STORAGE_KEYS.SESSIONS, [])
  );
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(
    () => loadFromStorage(STORAGE_KEYS.ACCESSIBILITY, DEFAULT_ACCESSIBILITY)
  );
  const [hasGreeted, setHasGreeted] = useState<boolean>(() =>
    loadFromStorage(STORAGE_KEYS.GREETED, false)
  );
  const [welcomeNameInput, setWelcomeNameInput] = useState('');

  // Active Interactive Activity Modal
  const [runningActivity, setRunningActivity] =
    useState<PedagogicalActivity | null>(null);

  // Games filter state
  const [gameCompetencyFilter, setGameCompetencyFilter] = useState<
    CompetencyId | 'Todas'
  >('Todas');
  const [gameLevelFilter, setGameLevelFilter] = useState<
    DifficultyLevel | 'Todos'
  >('Todos');

  const activeStudent =
    students.find((s) => s.id === activeStudentId) || students[0];

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.ACTIVE_STUDENT,
      JSON.stringify(activeStudentId)
    );
  }, [activeStudentId]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  }, [results]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));
  }, [assessments]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }, [plans]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }, [sessions]);
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.ACCESSIBILITY,
      JSON.stringify(accessibility)
    );
    document.documentElement.classList.toggle(
      'dark',
      accessibility.theme === 'dark'
    );
    // Tailwind sizes are in rem, so scaling the root font size scales the whole UI.
    document.documentElement.style.fontSize = ROOT_FONT_SIZES[accessibility.fontSize];
  }, [accessibility]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GREETED, JSON.stringify(hasGreeted));
  }, [hasGreeted]);

  const handleNavSelect = (id: NavSectionId) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWelcomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = welcomeNameInput.trim();
    if (!trimmed) return;

    const existing = students.find(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) {
      setActiveStudentId(existing.id);
    } else {
      const newStudent: StudentProfile = {
        ...DEFAULT_STUDENT,
        id: `student-${Date.now()}`,
        name: trimmed,
        points: 0,
        earnedMedals: [],
        personalGlossary: [],
      };
      setStudents((prev) => [...prev, newStudent]);
      setActiveStudentId(newStudent.id);
    }
    setHasGreeted(true);
    if (accessibility.audioEnabled) {
      speakPt(
        `Olá, ${trimmed}! Estás preparado para descobrir, aprender e brincar com as palavras?`
      );
    }
  };

  const handleActivityComplete = (
    res: Omit<ActivityResult, 'id' | 'date'>
  ) => {
    const newResult: ActivityResult = {
      ...res,
      id: `res-${Date.now()}`,
      date: new Date().toISOString(),
    };
    const updatedResults = [newResult, ...results];
    setResults(updatedResults);

    // Update student points & unlock medals based on effort and consistency
    const studentRes = updatedResults.filter(
      (r) => r.studentId === res.studentId
    );
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== res.studentId) return s;
        const medals = new Set(s.earnedMedals);
        if (studentRes.length >= 1) medals.add('primeira-estrela');
        if (studentRes.length >= 3) medals.add('explorador-palavras');
        if (
          studentRes.some(
            (r) =>
              r.competency === 'compreensao_textos' ||
              r.competency === 'compreensao_instrucoes'
          )
        ) {
          medals.add('detetive-atento');
        }
        if (
          studentRes.some((r) => r.competency === 'organizacao_discurso')
        ) {
          medals.add('contador-historias');
        }
        if (studentRes.some((r) => r.competency === 'producao_escrita')) {
          medals.add('escritor-criativo');
        }
        if (studentRes.some((r) => r.autonomyDegree === 'Autónomo')) {
          medals.add('aprendiz-autonomo');
        }
        return {
          ...s,
          points: s.points + 20,
          earnedMedals: Array.from(medals),
        };
      })
    );
  };

  const handleAddGlossaryEntry = (
    entry: Omit<GlossaryEntry, 'id' | 'dateAdded'>
  ) => {
    if (!activeStudent) return;
    const newEntry: GlossaryEntry = {
      ...entry,
      id: `gl-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setStudents((prev) =>
      prev.map((s) =>
        s.id === activeStudent.id
          ? { ...s, personalGlossary: [newEntry, ...s.personalGlossary] }
          : s
      )
    );
  };

  const handleClearAllLocalData = () => {
    if (
      !window.confirm(
        'Apagar TODOS os dados guardados neste dispositivo (alunos, resultados, avaliações, planos e sessões)? Esta ação não pode ser desfeita.'
      )
    ) {
      return;
    }
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    setAccessibility(DEFAULT_ACCESSIBILITY);
    setStudents([DEFAULT_STUDENT]);
    setActiveStudentId(DEFAULT_STUDENT.id);
    setResults([]);
    setAssessments({});
    setPlans({});
    setSessions([]);
    setHasGreeted(false);
  };

  const studentResults = results.filter(
    (r) => r.studentId === activeStudent?.id
  );

  const fontClass = `font-access-${accessibility.fontFamily}`;
  const spacingClass = `spacing-${accessibility.spacing}`;

  const isMonthSection = (id: NavSectionId): id is MonthId =>
    ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho'].includes(id);

  return (
    <div
      className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${fontClass} ${spacingClass}`}
    >
      {/* Top Bar Contract (1-row, 3-zone) */}
      <header className="no-print sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Zone 1: Brand Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menu de navegação"
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleNavSelect('inicio')}
              className="text-lg sm:text-xl font-bold tracking-tight text-teal-800 dark:text-teal-300 whitespace-nowrap shrink-0"
            >
              Ler e Escrever a Brincar
            </button>
          </div>

          {/* Zone 2: Concise Single-Line Nav Links */}
          <nav
            aria-label="Navegação rápida"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <button
              type="button"
              onClick={() => handleNavSelect('percurso')}
              className={`hover:text-teal-700 dark:hover:text-teal-300 transition-colors whitespace-nowrap shrink-0 ${
                activeSection === 'percurso'
                  ? 'text-teal-700 dark:text-teal-300 font-semibold'
                  : ''
              }`}
            >
              O meu percurso
            </button>
            <button
              type="button"
              onClick={() => handleNavSelect('jogos')}
              className={`hover:text-teal-700 dark:hover:text-teal-300 transition-colors whitespace-nowrap shrink-0 ${
                activeSection === 'jogos'
                  ? 'text-teal-700 dark:text-teal-300 font-semibold'
                  : ''
              }`}
            >
              Jogos e desafios
            </button>
            <button
              type="button"
              onClick={() => handleNavSelect('historias')}
              className={`hover:text-teal-700 dark:hover:text-teal-300 transition-colors whitespace-nowrap shrink-0 ${
                activeSection === 'historias'
                  ? 'text-teal-700 dark:text-teal-300 font-semibold'
                  : ''
              }`}
            >
              Histórias
            </button>
            <button
              type="button"
              onClick={() => handleNavSelect('progresso')}
              className={`hover:text-teal-700 dark:hover:text-teal-300 transition-colors whitespace-nowrap shrink-0 ${
                activeSection === 'progresso'
                  ? 'text-teal-700 dark:text-teal-300 font-semibold'
                  : ''
              }`}
            >
              O meu progresso
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() =>
                handleNavSelect(
                  activeSection === 'professora' ? 'inicio' : 'professora'
                )
              }
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white transition-colors whitespace-nowrap shrink-0"
            >
              {activeSection === 'professora'
                ? 'Área do Aluno'
                : 'Área da Professora'}
            </button>
          </div>
        </div>
      </header>

      {/* Accessibility Bar */}
      <AccessibilityBar
        settings={accessibility}
        onChange={(updated) =>
          setAccessibility((prev) => ({ ...prev, ...updated }))
        }
      />

      {/* Main Workspace Layout: Sidebar (13 sections) + Content Stage */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex gap-8">
        {/* Desktop Sidebar */}
        <aside
          aria-label="Menu principal da plataforma"
          className="no-print hidden lg:block w-72 shrink-0"
        >
          <div className="sticky top-24 space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            {/* Active Student Mini-Card */}
            {activeStudent && (
              <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60">
                <div className="text-[11px] font-medium text-teal-800 dark:text-teal-300">
                  Aluno(a) ativo(a)
                </div>
                <div className="font-bold text-base text-slate-900 dark:text-slate-100">
                  {activeStudent.name}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {activeStudent.schoolYear} · Nível{' '}
                  {activeStudent.difficultyLevel} · {activeStudent.points} pts
                </div>
              </div>
            )}

            {/* Navigation Groups */}
            <nav className="space-y-5">
              <div>
                <div className="px-2.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                  Principal
                </div>
                <div className="space-y-1">
                  {NAV_ITEMS.filter((i) => i.group === 'principal').map(
                    (item) => {
                      const Icon = item.icon;
                      const active = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleNavSelect(item.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                            active
                              ? 'bg-teal-700 text-white font-semibold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div>
                <div className="px-2.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                  Planificação Mensal
                </div>
                <div className="space-y-1">
                  {NAV_ITEMS.filter((i) => i.group === 'meses').map((item) => {
                    const Icon = item.icon;
                    const active = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavSelect(item.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                          active
                            ? 'bg-teal-700 text-white font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="px-2.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                  Exploração e Apoio
                </div>
                <div className="space-y-1">
                  {NAV_ITEMS.filter((i) => i.group === 'exploracao').map(
                    (item) => {
                      const Icon = item.icon;
                      const active = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleNavSelect(item.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                            active
                              ? 'bg-teal-700 text-white font-semibold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div>
                <div className="px-2.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                  Gestão Pedagógica
                </div>
                <div className="space-y-1">
                  {NAV_ITEMS.filter((i) => i.group === 'gestao').map((item) => {
                    const Icon = item.icon;
                    const active = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavSelect(item.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                          active
                            ? 'bg-teal-700 text-white font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>
          </div>
        </aside>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="no-print fixed inset-0 z-40 lg:hidden bg-slate-950/60 backdrop-blur-xs">
            <div className="w-80 max-w-full h-full bg-white dark:bg-slate-900 p-5 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="font-bold text-teal-800 dark:text-teal-300">
                  Menu Principal
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavSelect(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-left ${
                        active
                          ? 'bg-teal-700 text-white font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* 1. INÍCIO */}
          {activeSection === 'inicio' && (
            <div className="space-y-8">
              {/* First-time Greeting or Personalized Welcome (Section 5) */}
              {!hasGreeted ? (
                <div className="p-6 sm:p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
                  <div className="max-w-2xl space-y-3">
                    <div className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                      Agrupamento de Escolas de Paço de Arcos · 1.º Ciclo
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
                      Olá! Bem-vindo(a) ao Ler e Escrever a Brincar! Como te
                      chamas?
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300">
                      Escreve o teu nome para começarmos a tua aventura de
                      leitura, escrita e descoberta das palavras.
                    </p>
                  </div>

                  <form
                    onSubmit={handleWelcomeSubmit}
                    className="flex flex-wrap items-center gap-3 max-w-lg"
                  >
                    <input
                      type="text"
                      required
                      value={welcomeNameInput}
                      onChange={(e) => setWelcomeNameInput(e.target.value)}
                      placeholder="Escreve o teu nome..."
                      className="flex-1 min-w-52 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-base text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold transition-colors"
                    >
                      Começar
                    </button>
                  </form>

                  {students.length > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>Ou seleciona um perfil existente:</span>
                      {students.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setActiveStudentId(s.id);
                            setHasGreeted(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold hover:bg-teal-50 dark:hover:bg-teal-950/50"
                        >
                          {s.name} ({s.schoolYear})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 sm:p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-2xl space-y-2.5">
                      <div className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                        Agrupamento de Escolas de Paço de Arcos · Professora
                        Dulce Lopes
                      </div>
                      <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
                        Olá, {activeStudent?.name}! Estás preparado(a) para
                        descobrir, aprender e brincar com as palavras?
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300">
                        Escolhe o teu percurso personalizado ou explora os
                        módulos mensais de janeiro a junho ao teu próprio ritmo.
                      </p>
                    </div>

                    {accessibility.audioEnabled && (
                      <button
                        type="button"
                        onClick={() =>
                          speakPt(
                            `Olá, ${activeStudent?.name}! Estás preparado para descobrir, aprender e brincar com as palavras?`
                          )
                        }
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 text-xs font-semibold hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Ouvir boas-vindas</span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleNavSelect('percurso')}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Ir para O meu percurso</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavSelect('jogos')}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-semibold transition-colors"
                    >
                      <Gamepad2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Explorar jogos e desafios</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 6 Monthly Modules Overview Grid */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Planificação Mensal — Janeiro a Junho
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Módulos autónomos e interligados de intervenção
                    psicopedagógica
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {MONTHLY_MODULES.map((mod, idx) => {
                    const doneInMonth = studentResults.filter(
                      (r) => r.month === mod.id
                    ).length;
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => handleNavSelect(mod.id)}
                        className="text-left p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 transition-colors flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-teal-700 dark:text-teal-400">
                              0{idx + 1}. {mod.name}
                            </span>
                            <span className="tabular-nums">
                              {doneInMonth} concluída(s)
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {mod.navTitle.replace(`${mod.name} — `, '')}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            {mod.subtitle}
                          </p>
                        </div>

                        <div className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                          Abrir módulo →
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. O MEU PERCURSO */}
          {activeSection === 'percurso' && activeStudent && (
            <div className="space-y-8">
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                      {INTERVENTION_PROFILES[activeStudent.profile].title}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      O meu percurso — {activeStudent.name}
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      Atividades selecionadas para as tuas competências
                      prioritárias (Nível {activeStudent.difficultyLevel}).
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl">
                    <UserCheck className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                    <span>
                      {activeStudent.priorityCompetencies.length} competências
                      prioritárias
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {PEDAGOGICAL_ACTIVITIES.filter((act) =>
                  activeStudent.priorityCompetencies.includes(act.competency)
                ).map((act) => {
                  const comp = COMPETENCIES.find(
                    (c) => c.id === act.competency
                  );
                  const isDone = studentResults.some(
                    (r) => r.activityId === act.id
                  );
                  return (
                    <div
                      key={act.id}
                      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span className="capitalize font-semibold text-teal-700 dark:text-teal-400">
                            {act.month} · {comp?.shortLabel}
                          </span>
                          {isDone && (
                            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Concluída</span>
                            </span>
                          )}
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {act.gameTitle || act.title}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {act.pedagogicalObjective}
                        </p>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => setRunningActivity(act)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          <span>Praticar agora</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3–8. MONTHLY MODULES (Janeiro a Junho) */}
          {isMonthSection(activeSection) && (
            <MonthlyModuleView
              monthId={activeSection}
              audioEnabled={accessibility.audioEnabled}
              results={studentResults}
              onLaunchActivity={(act) => setRunningActivity(act)}
              onNavigateMonth={(mId) => handleNavSelect(mId)}
            />
          )}

          {/* 9. JOGOS E DESAFIOS */}
          {activeSection === 'jogos' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  Jogos e desafios interativos
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-1">
                  Aprende sem pressa e sem penalizações por tempo. Cada tentativa
                  ajuda-te a crescer!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Competência:
                  </label>
                  <select
                    value={gameCompetencyFilter}
                    onChange={(e) =>
                      setGameCompetencyFilter(
                        e.target.value as CompetencyId | 'Todas'
                      )
                    }
                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100"
                  >
                    <option value="Todas">Todas</option>
                    {COMPETENCIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Nível inicial:
                  </label>
                  <select
                    value={gameLevelFilter}
                    onChange={(e) =>
                      setGameLevelFilter(
                        e.target.value === 'Todos'
                          ? 'Todos'
                          : (Number(e.target.value) as DifficultyLevel)
                      )
                    }
                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100"
                  >
                    <option value="Todos">Nível do aluno</option>
                    <option value={1}>Nível 1 — Iniciação</option>
                    <option value={2}>Nível 2 — Desenvolvimento</option>
                    <option value={3}>Nível 3 — Consolidação</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {PEDAGOGICAL_ACTIVITIES.filter(
                  (a) =>
                    gameCompetencyFilter === 'Todas' ||
                    a.competency === gameCompetencyFilter
                ).map((act) => {
                  const comp = COMPETENCIES.find(
                    (c) => c.id === act.competency
                  );
                  return (
                    <div
                      key={act.id}
                      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span className="capitalize font-medium text-teal-700 dark:text-teal-400">
                            {act.month}
                          </span>
                          <span>·</span>
                          <span>{comp?.shortLabel}</span>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {act.gameTitle || act.title}
                        </h2>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {act.simpleInstruction}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setRunningActivity(act)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        <span>Jogar</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 10. HISTÓRIAS INTERATIVAS */}
          {activeSection === 'historias' && (
            <InteractiveStoriesView
              audioEnabled={accessibility.audioEnabled}
              highlightKeywords={accessibility.highlightKeywords}
            />
          )}

          {/* 11. BIBLIOTECA DE RECURSOS */}
          {activeSection === 'biblioteca' && (
            <ResourceLibraryView
              onLaunchActivity={(act) => setRunningActivity(act)}
            />
          )}

          {/* 12. O MEU PROGRESSO */}
          {activeSection === 'progresso' && activeStudent && (
            <StudentProgressView
              student={activeStudent}
              results={studentResults}
              onAddGlossaryEntry={handleAddGlossaryEntry}
            />
          )}

          {/* 13. ÁREA DA PROFESSORA */}
          {activeSection === 'professora' && (
            <TeacherArea
              students={students}
              activeStudentId={activeStudentId}
              onSelectStudent={(id) => setActiveStudentId(id)}
              onCreateStudent={(data) => {
                const created: StudentProfile = {
                  ...data,
                  id: `student-${Date.now()}`,
                  points: 0,
                  earnedMedals: [],
                  personalGlossary: [],
                };
                setStudents((prev) => [...prev, created]);
                setActiveStudentId(created.id);
              }}
              onUpdateStudent={(updated) =>
                setStudents((prev) =>
                  prev.map((s) => (s.id === updated.id ? updated : s))
                )
              }
              onDeleteStudent={(id) => {
                const target = students.find((s) => s.id === id);
                const remaining = students.filter((s) => s.id !== id);
                if (!target || remaining.length === 0) return;
                if (
                  !window.confirm(
                    `Remover o perfil de ${target.name} e todos os seus registos? Esta ação não pode ser desfeita.`
                  )
                ) {
                  return;
                }
                setStudents(remaining);
                setResults((prev) => prev.filter((r) => r.studentId !== id));
                setAssessments(({ [id]: _a, ...rest }) => rest);
                setPlans(({ [id]: _p, ...rest }) => rest);
                setSessions((prev) => prev.filter((x) => x.studentId !== id));
                if (activeStudentId === id) {
                  setActiveStudentId(remaining[0].id);
                }
              }}
              results={results}
              assessments={assessments}
              onSaveAssessment={(a) =>
                setAssessments((prev) => ({ ...prev, [a.studentId]: a }))
              }
              plans={plans}
              onSavePlan={(p) =>
                setPlans((prev) => ({ ...prev, [p.studentId]: p }))
              }
              sessions={sessions}
              onAddSession={(s) =>
                setSessions((prev) => [
                  { ...s, id: `sess-${Date.now()}` },
                  ...prev,
                ])
              }
              onClearAllLocalData={handleClearAllLocalData}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="no-print border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-5 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <strong>Ler e Escrever a Brincar</strong> · Agrupamento de Escolas
            de Paço de Arcos · Professora Dulce Lopes
          </div>
          <div>
            Plataforma educativa de intervenção psicopedagógica (1.º Ciclo ·
            PT-PT)
          </div>
        </div>
      </footer>

      {/* Interactive Activity Modal */}
      {runningActivity && activeStudent && (
        <InteractiveActivityModal
          activity={runningActivity}
          initialLevel={
            gameLevelFilter !== 'Todos'
              ? gameLevelFilter
              : activeStudent.difficultyLevel
          }
          audioEnabled={accessibility.audioEnabled}
          highlightKeywords={accessibility.highlightKeywords}
          studentId={activeStudent.id}
          onClose={() => setRunningActivity(null)}
          onComplete={handleActivityComplete}
        />
      )}
    </div>
  );
}
