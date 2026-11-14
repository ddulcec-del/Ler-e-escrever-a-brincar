'use client';

import React, { useEffect, useState } from 'react';
import {
  Menu,
  Play,
  UserCheck,
  X,
} from 'lucide-react';
import { AccessibilityBar } from './components/AccessibilityBar';
import { Landing } from './components/Landing';
import { SideNav } from './components/SideNav';
import { Doodle, PencilMark, SketchDefs } from './components/Sketch';
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
import { monthName } from './utils/months';

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

  const quickLinkClass = (id: NavSectionId) =>
    `whitespace-nowrap shrink-0 transition-colors hover:text-ink ${
      activeSection === id
        ? 'text-ink underline decoration-wavy decoration-mark decoration-2 underline-offset-8'
        : 'text-ink-soft'
    }`;

  const onLanding = activeSection === 'inicio';

  return (
    <div className={`min-h-screen flex flex-col ${fontClass} ${spacingClass}`}>
      <SketchDefs />

      <div className="skin flex-1 flex flex-col bg-paper">
        {/* Top bar: brand · quick links · teacher area */}
        <header className="no-print sticky top-0 z-30 bg-paper/95 backdrop-blur-xs border-b-[1.6px] border-ink px-4 sm:px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Abrir menu de navegação"
                aria-expanded={mobileMenuOpen}
                className={`p-2 border-[1.6px] border-ink text-ink bg-sheet rounded-xs ${
                  onLanding ? '' : 'lg:hidden'
                }`}
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
                className="font-display flex items-center gap-1.5 sm:gap-2 text-[0.95rem] sm:text-xl font-extrabold tracking-tight text-ink whitespace-nowrap min-w-0"
              >
                <PencilMark className="w-8 h-8 -ml-1 hidden min-[26rem]:block" />
                <span>
                  Ler e Escrever <span className="hl">a Brincar</span>
                </span>
              </button>
            </div>

            <nav
              aria-label="Navegação rápida"
              className="hidden md:flex items-center gap-7 text-sm font-semibold"
            >
              <button type="button" onClick={() => handleNavSelect('percurso')} className={quickLinkClass('percurso')}>
                O meu percurso
              </button>
              <button type="button" onClick={() => handleNavSelect('jogos')} className={quickLinkClass('jogos')}>
                Jogos e desafios
              </button>
              <button type="button" onClick={() => handleNavSelect('historias')} className={quickLinkClass('historias')}>
                Histórias
              </button>
              <button type="button" onClick={() => handleNavSelect('progresso')} className={quickLinkClass('progresso')}>
                O meu progresso
              </button>
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() =>
                  handleNavSelect(
                    activeSection === 'professora' ? 'inicio' : 'professora'
                  )
                }
                className="btn btn-paper btn-sm whitespace-nowrap"
              >
                <span>
                  <span className="hidden sm:inline">
                    {activeSection === 'professora' ? 'Área do ' : 'Área da '}
                  </span>
                  {activeSection === 'professora' ? 'Aluno' : 'Professora'}
                </span>
              </button>
            </div>
          </div>
        </header>

        <AccessibilityBar
          settings={accessibility}
          onChange={(updated) =>
            setAccessibility((prev) => ({ ...prev, ...updated }))
          }
        />

        {/* Drawer navigation (small screens, and the landing page) */}
        {mobileMenuOpen && (
          <div
            className={`no-print fixed inset-0 z-40 bg-[#151310]/60 backdrop-blur-xs ${
              onLanding ? '' : 'lg:hidden'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-80 max-w-full h-full bg-paper border-r-[1.6px] border-ink p-5 overflow-y-auto space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-edge pb-3">
                <span className="hand text-3xl font-bold text-ink">Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Fechar menu"
                  className="p-1.5 text-ink"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SideNav active={activeSection} onSelect={handleNavSelect} />
            </div>
          </div>
        )}

        {onLanding ? (
          <main className="flex-1">
            <Landing
              hasGreeted={hasGreeted}
              activeStudent={activeStudent}
              students={students}
              studentResults={studentResults}
              audioEnabled={accessibility.audioEnabled}
              nameInput={welcomeNameInput}
              onNameInputChange={setWelcomeNameInput}
              onNameSubmit={handleWelcomeSubmit}
              onPickStudent={(id) => {
                setActiveStudentId(id);
                setHasGreeted(true);
              }}
              onSpeakWelcome={() =>
                speakPt(
                  `Olá, ${activeStudent?.name}! Estás preparado para descobrir, aprender e brincar com as palavras?`
                )
              }
              onNavigate={handleNavSelect}
            />
          </main>
        ) : (
          <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex gap-10">
            {/* Sidebar */}
            <aside
              aria-label="Menu principal da plataforma"
              className="no-print hidden lg:block w-72 shrink-0"
            >
              <div className="quiet-scroll sticky top-24 space-y-6 max-h-[calc(100vh-6.5rem)] overflow-y-auto overscroll-contain px-1 pt-1 pb-12">
                {activeStudent && (
                  <div className="sketch px-4 pt-3 pb-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="label-print">Aluno(a) ativo(a)</span>
                      <span className="text-sm font-semibold text-ink-soft">
                        {activeStudent.schoolYear}
                      </span>
                    </div>
                    <div className="hand text-4xl font-bold text-pen leading-none mt-1.5">
                      {activeStudent.name}
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 mt-3.5">
                      {/* Points */}
                      <div className="border-2 border-ink rounded-[2px] bg-pencil text-[#23201c] px-2.5 pt-1.5 pb-2 -rotate-1">
                        <div className="text-[0.68rem] font-bold uppercase tracking-[0.09em]">
                          Pontos
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Doodle
                            name="star"
                            strokeWidth={3.2}
                            className="w-7 h-7 shrink-0 fill-[#fffdf8]"
                          />
                          <span className="hand text-4xl font-bold leading-none tabular-nums">
                            {activeStudent.points}
                          </span>
                        </div>
                      </div>

                      {/* Level, drawn as three steps */}
                      <div className="border-2 border-ink rounded-[2px] bg-sheet text-ink px-2.5 pt-1.5 pb-2 rotate-1">
                        <div className="label-print">Nível</div>
                        <div className="flex items-end gap-2 mt-0.5">
                          <span className="hand text-4xl font-bold leading-none text-pen">
                            {activeStudent.difficultyLevel}
                          </span>
                          <span
                            className="flex items-end gap-1 pb-0.5"
                            aria-hidden="true"
                          >
                            {[1, 2, 3].map((step) => (
                              <span
                                key={step}
                                className={`w-3 border-2 border-ink rounded-[1px] ${
                                  step <= activeStudent.difficultyLevel
                                    ? 'bg-pen'
                                    : 'bg-transparent'
                                }`}
                                style={{ height: `${0.45 + step * 0.4}rem` }}
                              />
                            ))}
                          </span>
                        </div>
                      </div>
                    </div>

                    {activeStudent.earnedMedals.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-3 text-sm font-semibold text-ink">
                        <Doodle name="medal" className="w-5 h-5 text-mark" strokeWidth={3} />
                        {activeStudent.earnedMedals.length}{' '}
                        {activeStudent.earnedMedals.length === 1
                          ? 'medalha'
                          : 'medalhas'}
                      </div>
                    )}
                  </div>
                )}

                <SideNav active={activeSection} onSelect={handleNavSelect} />
              </div>
            </aside>

            <main className="flex-1 min-w-0">
          {/* 2. O MEU PERCURSO */}
          {activeSection === 'percurso' && activeStudent && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="label-print">
                    {INTERVENTION_PROFILES[activeStudent.profile].title}
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-ink mt-1">
                    O meu percurso — {activeStudent.name}
                  </h1>
                  <p className="text-base text-ink-soft mt-3">
                    Atividades selecionadas para as tuas competências
                    prioritárias (Nível {activeStudent.difficultyLevel}).
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-ink border-b-2 border-pencil pb-1">
                  <UserCheck className="w-4 h-4" />
                  <span>
                    {activeStudent.priorityCompetencies.length} competências
                    prioritárias
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="sheet p-6 bg-sheet border border-edge flex flex-col justify-between gap-5"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <span className="label-print">
                            {monthName(act.month)} · {comp?.shortLabel}
                          </span>
                          {isDone && (
                            <span className="inline-flex items-center gap-1 text-mark hand text-2xl font-bold -rotate-3">
                              <Doodle name="tick" className="w-5 h-5" strokeWidth={3.4} />
                              <span>Concluída</span>
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl font-bold text-ink">
                          {act.gameTitle || act.title}
                        </h2>
                        <p className="text-sm text-ink-soft">
                          {act.pedagogicalObjective}
                        </p>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => setRunningActivity(act)}
                          className="btn btn-pen btn-sm"
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
                <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">
                  Jogos e desafios interativos
                </h1>
                <p className="text-base text-ink-soft mt-3">
                  Aprende sem pressa e sem penalizações por tempo. Cada tentativa
                  ajuda-te a crescer!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-dashed border-ink/40 py-3.5">
                <div className="flex items-center gap-2">
                  <label htmlFor="game-competency" className="label-print">
                    Competência
                  </label>
                  <select
                    id="game-competency"
                    value={gameCompetencyFilter}
                    onChange={(e) =>
                      setGameCompetencyFilter(
                        e.target.value as CompetencyId | 'Todas'
                      )
                    }
                    className="rounded-xs border-[1.6px] border-ink bg-sheet px-2.5 py-1.5 text-sm text-ink"
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
                  <label htmlFor="game-level" className="label-print">
                    Nível inicial
                  </label>
                  <select
                    id="game-level"
                    value={gameLevelFilter}
                    onChange={(e) =>
                      setGameLevelFilter(
                        e.target.value === 'Todos'
                          ? 'Todos'
                          : (Number(e.target.value) as DifficultyLevel)
                      )
                    }
                    className="rounded-xs border-[1.6px] border-ink bg-sheet px-2.5 py-1.5 text-sm text-ink"
                  >
                    <option value="Todos">Nível do aluno</option>
                    <option value={1}>Nível 1 — Iniciação</option>
                    <option value={2}>Nível 2 — Desenvolvimento</option>
                    <option value={3}>Nível 3 — Consolidação</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                      className="sheet p-6 bg-sheet border border-edge flex flex-col justify-between gap-5"
                    >
                      <div className="space-y-2">
                        <div className="label-print">
                          {monthName(act.month)} · {comp?.shortLabel}
                        </div>
                        <h2 className="text-xl font-bold text-ink">
                          {act.gameTitle || act.title}
                        </h2>
                        <p className="text-sm text-ink-soft">
                          {act.simpleInstruction}
                        </p>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => setRunningActivity(act)}
                          className="btn btn-pencil btn-sm"
                        >
                          <Play className="w-4 h-4" />
                          <span>Jogar</span>
                        </button>
                      </div>
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
        )}

        <footer className="no-print border-t-[1.6px] border-ink px-4 sm:px-6 py-6 text-sm text-ink-soft">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <PencilMark className="w-6 h-6" />
              <span>
                <strong className="text-ink">Ler e Escrever a Brincar</strong> ·
                Agrupamento de Escolas de Paço de Arcos · Professora Dulce
                Lopes
              </span>
            </div>
            <div>
              Plataforma educativa de intervenção psicopedagógica (1.º Ciclo ·
              PT-PT)
            </div>
          </div>
        </footer>
      </div>

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
