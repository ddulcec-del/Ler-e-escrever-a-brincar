'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Menu, Play, UserCheck, X } from 'lucide-react';
import { AccessibilityBar } from './components/AccessibilityBar';
import { Landing } from './components/Landing';
import { ProfilePicker } from './components/ProfilePicker';
import { SideNav } from './components/SideNav';
import { Doodle, PencilMark, SketchDefs } from './components/Sketch';
import { InteractiveActivityModal } from './components/InteractiveActivityModal';
import { InteractiveStoriesView } from './components/InteractiveStoriesView';
import { MonthlyModuleView } from './components/MonthlyModuleView';
import { ResourceLibraryView } from './components/ResourceLibraryView';
import { StudentProgressView } from './components/StudentProgressView';
import { TeacherArea } from './components/teacher/TeacherArea';
import { COMPETENCIES, INTERVENTION_PROFILES } from './data/curriculumData';
import * as db from './lib/db';
import {
  AccessibilitySettings,
  ActivityResult,
  CompetencyId,
  DifficultyLevel,
  GlossaryEntry,
  IndividualPlan,
  MonthId,
  NavSectionId,
  PedagogicalActivity,
  StudentProfile,
} from './types/pedagogical';
import { speakPt } from './utils/speech';
import { monthName } from './utils/months';
import { computeMedals, computePoints } from './utils/progress';

// Only per-device preferences live in the browser; everything else is in
// Supabase.
const STORAGE_KEYS = {
  ACTIVE_STUDENT: 'leb_active_student_v2',
  ACCESSIBILITY: 'leb_accessibility_v1',
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

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or storage disabled: the preference just isn't kept.
  }
}

const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : String(e);

/** Without Supabase, a strip at the top says the data stays in this browser. */
function DemoBanner() {
  return (
    <div className="no-print border-b-[1.6px] border-ink bg-pencil/40 px-4 sm:px-6 py-2 text-sm text-ink">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <span>
          <strong>Modo de demonstração local</strong>: o Supabase não está
          ligado, por isso os dados ficam só neste navegador. Área da
          Professora: utilizador <code>{db.DEMO_USERNAME}</code>, palavra-passe{' '}
          <code>{db.DEMO_PASSWORD}</code>.
        </span>
        <button
          type="button"
          className="font-semibold underline underline-offset-4"
          onClick={() => {
            if (
              window.confirm(
                'Apagar os dados de demonstração deste navegador e recomeçar?'
              )
            ) {
              db.resetDemo();
              window.location.reload();
            }
          }}
        >
          Recomeçar demonstração
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSectionId>('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Shared data (Supabase)
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [activities, setActivities] = useState<PedagogicalActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // The student using this device
  const [activeStudentId, setActiveStudentId] = useState<string | null>(() =>
    loadFromStorage<string | null>(STORAGE_KEYS.ACTIVE_STUDENT, null)
  );
  const [plan, setPlan] = useState<IndividualPlan | null>(null);
  const [studentResults, setStudentResults] = useState<ActivityResult[]>([]);
  const [glossary, setGlossary] = useState<GlossaryEntry[]>([]);
  // Bumped to reload the active student's data (e.g. after the teacher edits).
  const [studentDataVersion, setStudentDataVersion] = useState(0);

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(
    () => loadFromStorage(STORAGE_KEYS.ACCESSIBILITY, DEFAULT_ACCESSIBILITY)
  );

  const [runningActivity, setRunningActivity] =
    useState<PedagogicalActivity | null>(null);
  // Activity chosen before a profile was picked: asks "Quem vai jogar?" first.
  const [pendingActivity, setPendingActivity] =
    useState<PedagogicalActivity | null>(null);

  const [gameCompetencyFilter, setGameCompetencyFilter] = useState<
    CompetencyId | 'Todas'
  >('Todas');
  const [gameLevelFilter, setGameLevelFilter] = useState<
    DifficultyLevel | 'Todos'
  >('Todos');

  const activeStudent = students.find((s) => s.id === activeStudentId);

  const loadShared = useCallback(async () => {
    try {
      const [s, a] = await Promise.all([
        db.listStudents(),
        db.listActivities(),
      ]);
      setStudents(s);
      setActivities(a);
      setLoadedOnce(true);
      setNotice(null);
    } catch (e) {
      setNotice(`Não foi possível carregar os dados: ${errorMessage(e)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShared();
  }, [loadShared]);

  // A profile deleted by the teacher is forgotten on this device (only after
  // a successful load, so a network error doesn't log the student out).
  useEffect(() => {
    if (loadedOnce && activeStudentId && !activeStudent) {
      setActiveStudentId(null);
    }
  }, [loadedOnce, activeStudentId, activeStudent]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACTIVE_STUDENT, activeStudentId);
  }, [activeStudentId]);

  useEffect(() => {
    if (!activeStudentId) {
      setPlan(null);
      setStudentResults([]);
      setGlossary([]);
      return;
    }
    let cancelled = false;
    Promise.all([
      db.getPlan(activeStudentId),
      db.listResults(activeStudentId),
      db.listGlossary(activeStudentId),
    ])
      .then(([p, r, g]) => {
        if (cancelled) return;
        setPlan(p);
        setStudentResults(r);
        setGlossary(g);
      })
      .catch((e) => {
        if (!cancelled) {
          setNotice(`Não foi possível carregar o teu progresso: ${errorMessage(e)}`);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeStudentId, studentDataVersion]);

  // The teacher area is a separate workspace: no student menu, no reading
  // aids, and the students' accessibility choices don't apply to it.
  const onTeacher = activeSection === 'professora';

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACCESSIBILITY, accessibility);
  }, [accessibility]);

  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      !onTeacher && accessibility.theme === 'dark'
    );
    // Tailwind sizes are in rem, so scaling the root font size scales the whole UI.
    document.documentElement.style.fontSize = onTeacher
      ? ROOT_FONT_SIZES.normal
      : ROOT_FONT_SIZES[accessibility.fontSize];
  }, [accessibility, onTeacher]);

  const handleNavSelect = (id: NavSectionId) => {
    // Leaving the teacher area: pick up whatever she changed.
    if (activeSection === 'professora' && id !== 'professora') {
      loadShared();
      setStudentDataVersion((v) => v + 1);
    }
    setActiveSection(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const greet = (name: string) => {
    if (accessibility.audioEnabled) {
      speakPt(
        `Olá, ${name}! Estás preparado para descobrir, aprender e brincar com as palavras?`
      );
    }
  };

  const handlePickStudent = (id: string) => {
    setActiveStudentId(id);
    const picked = students.find((s) => s.id === id);
    if (picked) greet(picked.name);
    if (pendingActivity) {
      setRunningActivity(pendingActivity);
      setPendingActivity(null);
    }
  };

  const launchActivity = (act: PedagogicalActivity) => {
    if (activeStudent) setRunningActivity(act);
    else setPendingActivity(act);
  };

  const handleActivityComplete = async (
    res: Omit<ActivityResult, 'id' | 'date'>
  ) => {
    try {
      const saved = await db.addResult(res);
      setStudentResults((prev) => [saved, ...prev]);
    } catch (e) {
      setNotice(`O resultado não foi guardado: ${errorMessage(e)}`);
    }
  };

  const handleAddGlossaryEntry = async (
    entry: Pick<GlossaryEntry, 'word' | 'meaning' | 'example'>
  ) => {
    if (!activeStudent) return;
    try {
      const saved = await db.addGlossaryEntry({
        ...entry,
        studentId: activeStudent.id,
      });
      setGlossary((prev) => [saved, ...prev]);
    } catch (e) {
      setNotice(`A palavra não foi guardada: ${errorMessage(e)}`);
    }
  };

  // What the plan decides for this student (with sensible defaults).
  const priorityCompetencies: CompetencyId[] =
    plan?.priorityCompetencies ??
    (activeStudent
      ? INTERVENTION_PROFILES[activeStudent.profile].defaultCompetencies
      : []);
  const studentLevel: DifficultyLevel = plan?.difficultyLevel ?? 1;
  const planActivities: PedagogicalActivity[] = plan?.activityIds.length
    ? plan.activityIds
        .map((id) => activities.find((a) => a.id === id))
        .filter((a): a is PedagogicalActivity => Boolean(a))
    : activities.filter((a) => priorityCompetencies.includes(a.competency));
  const usesTeacherSelection = Boolean(plan?.activityIds.length);

  const points = computePoints(studentResults);
  const medalCount = computeMedals(studentResults).length;

  const fontClass = `font-access-${onTeacher ? 'default' : accessibility.fontFamily}`;
  const spacingClass = `spacing-${onTeacher ? 'normal' : accessibility.spacing}`;

  const isMonthSection = (id: NavSectionId): id is MonthId =>
    ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho'].includes(id);

  const quickLinkClass = (id: NavSectionId) =>
    `whitespace-nowrap shrink-0 transition-colors hover:text-ink ${
      activeSection === id
        ? 'text-ink underline decoration-wavy decoration-mark decoration-2 underline-offset-8'
        : 'text-ink-soft'
    }`;

  const onLanding = activeSection === 'inicio';

  const pickerPanel = (title?: string) => (
    <div className="sheet bg-sheet border border-edge p-6 max-w-2xl">
      <ProfilePicker
        students={students}
        loading={loading}
        onPick={handlePickStudent}
        title={title}
      />
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col ${fontClass} ${spacingClass}`}>
      <SketchDefs />

      <div className="skin flex-1 flex flex-col bg-paper">
        {/* Top bar: brand · quick links · teacher area */}
        <header className="no-print sticky top-0 z-30 bg-paper/95 backdrop-blur-xs border-b-[1.6px] border-ink px-4 sm:px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {!onTeacher && (
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
              )}
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

            {onTeacher ? (
              <span className="hidden md:block label-print">Área da Professora</span>
            ) : (
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
            )}

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

        {db.isDemoMode && <DemoBanner />}

        {!onTeacher && (
          <AccessibilityBar
            settings={accessibility}
            onChange={(updated) =>
              setAccessibility((prev) => ({ ...prev, ...updated }))
            }
          />
        )}

        {notice && (
          <div
            role="alert"
            className="no-print border-b-[1.6px] border-ink bg-eraser/30 px-4 sm:px-6 py-2.5 text-sm text-ink"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <span>{notice}</span>
              <span className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    loadShared();
                    setStudentDataVersion((v) => v + 1);
                  }}
                  className="font-semibold underline underline-offset-4"
                >
                  Tentar de novo
                </button>
                <button
                  type="button"
                  onClick={() => setNotice(null)}
                  aria-label="Fechar aviso"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            </div>
          </div>
        )}

        {/* Drawer navigation (small screens, and the landing page) */}
        {mobileMenuOpen && !onTeacher && (
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
              activeStudent={activeStudent}
              students={students}
              studentsLoading={loading}
              studentResults={studentResults}
              audioEnabled={accessibility.audioEnabled}
              onPickStudent={handlePickStudent}
              onChangeStudent={() => setActiveStudentId(null)}
              onSpeakWelcome={() => activeStudent && greet(activeStudent.name)}
              onNavigate={handleNavSelect}
            />
          </main>
        ) : onTeacher ? (
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
            <TeacherArea
              audioEnabled={accessibility.audioEnabled}
              highlightKeywords={accessibility.highlightKeywords}
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
                {activeStudent ? (
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
                              {points}
                            </span>
                          </div>
                        </div>

                        {/* Level, drawn as three steps */}
                        <div className="border-2 border-ink rounded-[2px] bg-sheet text-ink px-2.5 pt-1.5 pb-2 rotate-1">
                          <div className="label-print">Nível</div>
                          <div className="flex items-end gap-2 mt-0.5">
                            <span className="hand text-4xl font-bold leading-none text-pen">
                              {studentLevel}
                            </span>
                            <span
                              className="flex items-end gap-1 pb-0.5"
                              aria-hidden="true"
                            >
                              {[1, 2, 3].map((step) => (
                                <span
                                  key={step}
                                  className={`w-3 border-2 border-ink rounded-[1px] ${
                                    step <= studentLevel
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

                      {medalCount > 0 && (
                        <div className="flex items-center gap-1.5 mt-3 text-sm font-semibold text-ink">
                          <Doodle name="medal" className="w-5 h-5 text-mark" strokeWidth={3} />
                          {medalCount} {medalCount === 1 ? 'medalha' : 'medalhas'}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setActiveStudentId(null)}
                        className="mt-3 text-xs font-semibold text-ink-soft underline underline-offset-4 hover:text-ink"
                      >
                        Mudar de aluno
                      </button>
                    </div>
                  ) : (
                    <div className="sketch px-4 pt-3 pb-4 space-y-2">
                      <span className="label-print">Aluno(a)</span>
                      <p className="text-sm text-ink-soft">
                        Ainda não escolheste o teu perfil.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleNavSelect('inicio')}
                        className="btn btn-pen btn-sm"
                      >
                        Escolher perfil
                      </button>
                    </div>
                  )}

                <SideNav active={activeSection} onSelect={handleNavSelect} />
              </div>
            </aside>

            <main className="flex-1 min-w-0">
          {loading && (
            <p className="hand text-3xl text-ink-soft">A carregar…</p>
          )}

          {/* 2. O MEU PERCURSO */}
          {activeSection === 'percurso' && !loading && !activeStudent &&
            pickerPanel('Quem és tu? Escolhe o teu perfil para veres o teu percurso.')}
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
                    {usesTeacherSelection
                      ? `Atividades escolhidas pela tua professora para ti (Nível ${studentLevel}).`
                      : `Atividades selecionadas para as tuas competências prioritárias (Nível ${studentLevel}).`}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-ink border-b-2 border-pencil pb-1">
                  <UserCheck className="w-4 h-4" />
                  <span>
                    {usesTeacherSelection
                      ? `${planActivities.filter((a) => studentResults.some((r) => r.activityId === a.id)).length} de ${planActivities.length} concluídas`
                      : `${priorityCompetencies.length} competências prioritárias`}
                  </span>
                </div>
              </div>

              {planActivities.length === 0 ? (
                <p className="text-base text-ink-soft">
                  Ainda não há atividades no teu percurso. Explora os jogos e
                  desafios!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {planActivities.map((act) => {
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
                            onClick={() => launchActivity(act)}
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
              )}
            </div>
          )}

          {/* 3–8. MONTHLY MODULES (Janeiro a Junho) */}
          {isMonthSection(activeSection) && !loading && (
            <MonthlyModuleView
              monthId={activeSection}
              activities={activities}
              audioEnabled={accessibility.audioEnabled}
              results={studentResults}
              onLaunchActivity={launchActivity}
              onNavigateMonth={(mId) => handleNavSelect(mId)}
            />
          )}

          {/* 9. JOGOS E DESAFIOS */}
          {activeSection === 'jogos' && !loading && (
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
                {activities.filter(
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
                          onClick={() => launchActivity(act)}
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
          {activeSection === 'biblioteca' && !loading && (
            <ResourceLibraryView
              activities={activities}
              onLaunchActivity={launchActivity}
            />
          )}

          {/* 12. O MEU PROGRESSO */}
          {activeSection === 'progresso' && !loading && !activeStudent &&
            pickerPanel('Quem és tu? Escolhe o teu perfil para veres o teu progresso.')}
          {activeSection === 'progresso' && activeStudent && (
            <StudentProgressView
              student={activeStudent}
              results={studentResults}
              glossary={glossary}
              priorityCompetencies={priorityCompetencies}
              onAddGlossaryEntry={handleAddGlossaryEntry}
            />
          )}            </main>
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

      {/* "Quem vai jogar?" — an activity was chosen before picking a profile */}
      {pendingActivity && (
        <div
          className="no-print fixed inset-0 z-50 bg-[#151310]/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPendingActivity(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Escolher perfil"
            className="sketch bg-paper w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-base text-ink-soft">
                Vais jogar{' '}
                <strong className="text-ink">
                  {pendingActivity.gameTitle || pendingActivity.title}
                </strong>
                .
              </p>
              <button
                type="button"
                onClick={() => setPendingActivity(null)}
                aria-label="Fechar"
                className="p-1 text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ProfilePicker
              students={students}
              onPick={handlePickStudent}
              title="Quem vai jogar?"
            />
          </div>
        </div>
      )}

      {/* Interactive Activity Modal */}
      {runningActivity && activeStudent && (
        <InteractiveActivityModal
          activity={runningActivity}
          initialLevel={
            gameLevelFilter !== 'Todos' ? gameLevelFilter : studentLevel
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
