import React, { useState } from 'react';
import {
  Calendar,
  ClipboardCheck,
  Download,
  FileText,
  Info,
  Plus,
  Printer,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import {
  COMPETENCIES,
  INTERVENTION_PROFILES,
  MONTHLY_MODULES,
  PEDAGOGICAL_ACTIVITIES,
} from '../data/curriculumData';
import {
  ActivityResult,
  AssessmentRating,
  CompetencyId,
  DifficultyLevel,
  IndividualPlan,
  InitialAssessment,
  InterventionProfile,
  MonthId,
  SessionRecord,
  StudentProfile,
} from '../types/pedagogical';

interface TeacherAreaProps {
  students: StudentProfile[];
  activeStudentId: string;
  onSelectStudent: (id: string) => void;
  onCreateStudent: (student: Omit<StudentProfile, 'id' | 'points' | 'earnedMedals' | 'personalGlossary'>) => void;
  onUpdateStudent: (student: StudentProfile) => void;
  onDeleteStudent: (id: string) => void;
  results: ActivityResult[];
  assessments: Record<string, InitialAssessment>;
  onSaveAssessment: (assessment: InitialAssessment) => void;
  plans: Record<string, IndividualPlan>;
  onSavePlan: (plan: IndividualPlan) => void;
  sessions: SessionRecord[];
  onAddSession: (session: Omit<SessionRecord, 'id'>) => void;
  onClearAllLocalData: () => void;
}

type TeacherTab =
  | 'alunos'
  | 'avaliacao_inicial'
  | 'planificacao'
  | 'sessoes'
  | 'avaliacao_continua'
  | 'avaliacao_final';

export const TeacherArea: React.FC<TeacherAreaProps> = ({
  students,
  activeStudentId,
  onSelectStudent,
  onCreateStudent,
  onUpdateStudent,
  onDeleteStudent,
  results,
  assessments,
  onSaveAssessment,
  plans,
  onSavePlan,
  sessions,
  onAddSession,
  onClearAllLocalData,
}) => {
  const [activeTab, setActiveTab] = useState<TeacherTab>('alunos');

  const activeStudent =
    students.find((s) => s.id === activeStudentId) || students[0];

  // New Student Form State
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState(8);
  const [newYear, setNewYear] =
    useState<StudentProfile['schoolYear']>('2.º ano');
  const [newProfile, setNewProfile] =
    useState<InterventionProfile>('perfil3');
  const [newObs, setNewObs] = useState('');

  // Session Form State
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [sessionCompetencies, setSessionCompetencies] = useState<
    CompetencyId[]
  >(['precisao_leitora']);
  const [sessionActivities, setSessionActivities] = useState('');
  const [sessionResults, setSessionResults] = useState('');
  const [sessionSupport, setSessionSupport] =
    useState<SessionRecord['supportLevel']>('Apoio moderado');
  const [sessionAutonomy, setSessionAutonomy] =
    useState<SessionRecord['autonomyDegree']>('Progressiva');
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionNext, setSessionNext] = useState('');

  // Final Report Notes State
  const [finalStrategies, setFinalStrategies] = useState(
    'Leitura modelada com apoio áudio, segmentação de enunciados em etapas e utilização de bancos de palavras.'
  );
  const [finalContinuity, setFinalContinuity] = useState(
    'Consolidar a fluência leitora e a revisão autónoma da produção escrita no ano letivo seguinte.'
  );

  const studentResults = results.filter(
    (r) => r.studentId === activeStudent?.id
  );
  const studentSessions = sessions.filter(
    (s) => s.studentId === activeStudent?.id
  );

  const currentAssessment: InitialAssessment = assessments[
    activeStudent?.id
  ] || {
    studentId: activeStudent?.id || '',
    date: new Date().toISOString().split('T')[0],
    ratings: COMPETENCIES.reduce(
      (acc, c) => ({ ...acc, [c.id]: 'Em desenvolvimento' }),
      {} as Record<CompetencyId, AssessmentRating>
    ),
    qualitativeNotes: '',
  };

  const currentPlan: IndividualPlan = plans[activeStudent?.id] || {
    studentId: activeStudent?.id || '',
    selectedMonths: ['janeiro', 'fevereiro', 'marco'],
    priorityObjectives: [
      'Desenvolver precisão e progressiva automatização da leitura.',
      'Reter e recuperar informação essencial.',
    ],
    selectedActivityIds: ['jan-leitura-modelada', 'jan-sinonimos'],
    difficultyLevel: activeStudent?.difficultyLevel || 1,
    frequency: '2 sessões semanais (45 min)',
    strategies: 'Apoio visual, leitura modelada e reforço positivo.',
    notes: '',
  };

  const handleCreateStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateStudent({
      name: newName.trim(),
      age: newAge,
      schoolYear: newYear,
      profile: newProfile,
      priorityCompetencies:
        INTERVENTION_PROFILES[newProfile].defaultCompetencies,
      startDate: new Date().toISOString().split('T')[0],
      observations: newObs.trim(),
      difficultyLevel: 1,
    });
    setNewName('');
    setNewObs('');
  };

  const toggleStudentCompetency = (compId: CompetencyId) => {
    if (!activeStudent) return;
    const exists = activeStudent.priorityCompetencies.includes(compId);
    const updated = exists
      ? activeStudent.priorityCompetencies.filter((c) => c !== compId)
      : [...activeStudent.priorityCompetencies, compId];
    onUpdateStudent({
      ...activeStudent,
      priorityCompetencies: updated,
    });
  };

  const handleAddSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent || !sessionActivities.trim()) return;
    onAddSession({
      date: sessionDate,
      studentId: activeStudent.id,
      competencies: sessionCompetencies,
      activitiesDone: sessionActivities
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      resultsSummary: sessionResults.trim() || 'Participação ativa na sessão.',
      supportLevel: sessionSupport,
      autonomyDegree: sessionAutonomy,
      teacherNotes: sessionNotes.trim(),
      nextSessionPriorities: sessionNext.trim(),
    });
    setSessionActivities('');
    setSessionResults('');
    setSessionNotes('');
    setSessionNext('');
  };

  const exportReportText = () => {
    if (!activeStudent) return;
    const lines = [
      'AGRUPAMENTO DE ESCOLAS DE PAÇO DE ARCOS',
      'PLATAFORMA EDUCATIVA: LER E ESCREVER A BRINCAR',
      'RELATÓRIO INDIVIDUAL DE AVALIAÇÃO FINAL (FINALIDADE PEDAGÓGICA)',
      '------------------------------------------------------------',
      `Aluno(a): ${activeStudent.name}`,
      `Idade: ${activeStudent.age} anos | Ano: ${activeStudent.schoolYear}`,
      `Perfil de Intervenção: ${INTERVENTION_PROFILES[activeStudent.profile].title}`,
      `Professora Responsável: Dulce Lopes`,
      `Data do Relatório: ${new Date().toLocaleDateString('pt-PT')}`,
      '',
      '1. ATIVIDADES REALIZADAS NA PLATAFORMA:',
      `Total de atividades concluídas: ${studentResults.length}`,
      ...studentResults.map(
        (r) =>
          `- ${r.activityTitle} (${r.month}) | Nível ${r.difficultyLevel} | Autonomia: ${r.autonomyDegree}`
      ),
      '',
      '2. COMPARAÇÃO COM AVALIAÇÃO INICIAL:',
      ...COMPETENCIES.map((c) => {
        const init = currentAssessment.ratings[c.id];
        const doneCount = studentResults.filter(
          (r) => r.competency === c.id
        ).length;
        return `- ${c.label}: Inicial [${init}] -> Atividades trabalhadas: ${doneCount}`;
      }),
      '',
      '3. ESTRATÉGIAS EFICAZES:',
      finalStrategies,
      '',
      '4. NECESSIDADES DE CONTINUIDADE E PROPOSTAS FUTURAS:',
      finalContinuity,
    ];

    const blob = new Blob([lines.join('\n')], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio_${activeStudent.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    // Revoking immediately can cancel the download in some browsers.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-700 dark:text-teal-400">
            Educação Especial · Professora Dulce Lopes
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            Área Reservada à Professora — Gestão Pedagógica
          </h1>
        </div>

        {/* Active Student Switcher */}
        {activeStudent && (
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2">
            <Users className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <label
              htmlFor="teacher-student-select"
              className="text-xs font-medium text-slate-600 dark:text-slate-400"
            >
              Aluno ativo:
            </label>
            <select
              id="teacher-student-select"
              value={activeStudent.id}
              onChange={(e) => onSelectStudent(e.target.value)}
              className="text-sm font-semibold bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              {students.map((s) => (
                <option
                  key={s.id}
                  value={s.id}
                  className="bg-white dark:bg-slate-900"
                >
                  {s.name} ({s.schoolYear})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Privacy & Local Storage Notice (Section 15 & 17) */}
      <div className="no-print p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/70 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
        <Info className="w-4 h-4 text-sky-700 dark:text-sky-400 shrink-0 mt-0.5" />
        <div>
          <strong>Armazenamento Local e Privacidade:</strong> Todos os perfis,
          avaliações pedagógicas e registos de sessões são guardados
          exclusivamente neste dispositivo (<code>localStorage</code>), sem
          envio para servidores externos nem recolha de dados clínicos. Para
          proteção com palavra-passe entre vários dispositivos, seria necessária
          autenticação no servidor.
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="no-print flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {(
          [
            { id: 'alunos', label: '1. Gestão de Alunos' },
            { id: 'avaliacao_inicial', label: '2. Avaliação Inicial' },
            { id: 'planificacao', label: '3. Planificação Individual' },
            { id: 'sessoes', label: '4. Registo das Sessões' },
            { id: 'avaliacao_continua', label: '5. Avaliação Contínua' },
            { id: 'avaliacao_final', label: '6. Avaliação Final e Relatórios' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: GESTÃO DE ALUNOS */}
      {activeTab === 'alunos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Create Student Form */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-teal-700 dark:text-teal-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Criar novo perfil de aluno
              </h2>
            </div>

            <form onSubmit={handleCreateStudentSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome do aluno(a)
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Beatriz Martins"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Idade (6–10 anos)
                  </label>
                  <input
                    type="number"
                    min={6}
                    max={11}
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ano de escolaridade
                  </label>
                  <select
                    value={newYear}
                    onChange={(e) =>
                      setNewYear(e.target.value as StudentProfile['schoolYear'])
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                  >
                    <option value="1.º ano">1.º ano</option>
                    <option value="2.º ano">2.º ano</option>
                    <option value="3.º ano">3.º ano</option>
                    <option value="4.º ano">4.º ano</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Modalidade / Perfil de intervenção
                </label>
                <select
                  value={newProfile}
                  onChange={(e) =>
                    setNewProfile(e.target.value as InterventionProfile)
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                >
                  <option value="perfil1">
                    Perfil 1 — Leitura e escrita
                  </option>
                  <option value="perfil2">Perfil 2 — Linguagem</option>
                  <option value="perfil3">
                    Perfil 3 — Intervenção combinada
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Observações pedagógicas
                </label>
                <textarea
                  rows={3}
                  value={newObs}
                  onChange={(e) => setNewObs(e.target.value)}
                  placeholder="Interesses do aluno, estratégias que funcionam melhor..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors"
              >
                Adicionar aluno
              </button>
            </form>
          </div>

          {/* Active Student Configuration */}
          <div className="lg:col-span-7 space-y-6">
            {activeStudent && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Perfil de {activeStudent.name}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activeStudent.age} anos · {activeStudent.schoolYear} ·
                      Início em {activeStudent.startDate}
                    </p>
                  </div>

                  {/* Teacher Manual Difficulty Override (Section 7) */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      Nível:
                    </span>
                    {([1, 2, 3] as DifficultyLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() =>
                          onUpdateStudent({
                            ...activeStudent,
                            difficultyLevel: lvl,
                          })
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          activeStudent.difficultyLevel === lvl
                            ? 'bg-teal-700 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Nível {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Competências prioritárias selecionadas (flexível):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {COMPETENCIES.map((comp) => {
                      const selected =
                        activeStudent.priorityCompetencies.includes(comp.id);
                      return (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => toggleStudentCompetency(comp.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            selected
                              ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-400 dark:border-teal-700 text-teal-900 dark:text-teal-200'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {comp.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Observações pedagógicas
                  </label>
                  <textarea
                    rows={2}
                    value={activeStudent.observations}
                    onChange={(e) =>
                      onUpdateStudent({
                        ...activeStudent,
                        observations: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  {students.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteStudent(activeStudent.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover este perfil</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onClearAllLocalData}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Repor todos os dados locais</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AVALIAÇÃO INICIAL */}
      {activeTab === 'avaliacao_inicial' && activeStudent && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Avaliação Inicial Pedagógica — {activeStudent.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Registo do desempenho observado nas 11 competências da planificação
              (finalidade exclusivamente pedagógica, não diagnóstica).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {COMPETENCIES.map((comp) => {
              const currentRating = currentAssessment.ratings[comp.id];
              return (
                <div
                  key={comp.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                      {comp.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {comp.description}
                    </div>
                  </div>
                  <select
                    value={currentRating}
                    onChange={(e) =>
                      onSaveAssessment({
                        ...currentAssessment,
                        ratings: {
                          ...currentAssessment.ratings,
                          [comp.id]: e.target.value as AssessmentRating,
                        },
                      })
                    }
                    className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-100 shrink-0"
                  >
                    <option value="Emergente">Emergente</option>
                    <option value="Em desenvolvimento">
                      Em desenvolvimento
                    </option>
                    <option value="Consolidado">Consolidado</option>
                  </select>
                </div>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observações qualitativas iniciais
            </label>
            <textarea
              rows={3}
              value={currentAssessment.qualitativeNotes}
              onChange={(e) =>
                onSaveAssessment({
                  ...currentAssessment,
                  qualitativeNotes: e.target.value,
                })
              }
              placeholder="Registe pontos fortes, necessidades de apoio visual/auditivo e interesses..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      )}

      {/* TAB 3: PLANIFICAÇÃO INDIVIDUAL */}
      {activeTab === 'planificacao' && activeStudent && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Planificação Individual — {activeStudent.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Seleção flexível de meses, objetivos, atividades, nível de
              dificuldade e estratégias.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Meses de intervenção ativos:
            </div>
            <div className="flex flex-wrap gap-2">
              {MONTHLY_MODULES.map((m) => {
                const active = currentPlan.selectedMonths.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      const next = active
                        ? currentPlan.selectedMonths.filter((id) => id !== m.id)
                        : [...currentPlan.selectedMonths, m.id];
                      onSavePlan({ ...currentPlan, selectedMonths: next });
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      active
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Frequência de realização
              </label>
              <input
                type="text"
                value={currentPlan.frequency}
                onChange={(e) =>
                  onSavePlan({ ...currentPlan, frequency: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estratégias pedagógicas
              </label>
              <input
                type="text"
                value={currentPlan.strategies}
                onChange={(e) =>
                  onSavePlan({ ...currentPlan, strategies: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Atividades selecionadas para o percurso:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PEDAGOGICAL_ACTIVITIES.map((act) => {
                const checked = currentPlan.selectedActivityIds.includes(
                  act.id
                );
                return (
                  <label
                    key={act.id}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-xs cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const next = checked
                          ? currentPlan.selectedActivityIds.filter(
                              (id) => id !== act.id
                            )
                          : [...currentPlan.selectedActivityIds, act.id];
                        onSavePlan({
                          ...currentPlan,
                          selectedActivityIds: next,
                        });
                      }}
                      className="rounded text-teal-600"
                    />
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      <span className="capitalize text-teal-700 dark:text-teal-400">
                        {act.month}:
                      </span>{' '}
                      {act.gameTitle || act.title}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REGISTO DAS SESSÕES */}
      {activeTab === 'sessoes' && activeStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-700 dark:text-teal-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Registar nova sessão
              </h2>
            </div>

            <form onSubmit={handleAddSessionSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Data da sessão
                </label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Atividades realizadas
                </label>
                <input
                  type="text"
                  required
                  value={sessionActivities}
                  onChange={(e) => setSessionActivities(e.target.value)}
                  placeholder="Ex: Leitura modelada, Encontra o sinónimo"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nível de apoio
                  </label>
                  <select
                    value={sessionSupport}
                    onChange={(e) =>
                      setSessionSupport(
                        e.target.value as SessionRecord['supportLevel']
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-2 text-xs text-slate-900 dark:text-slate-100"
                  >
                    <option value="Apoio total">Apoio total</option>
                    <option value="Apoio moderado">Apoio moderado</option>
                    <option value="Apoio mínimo">Apoio mínimo</option>
                    <option value="Autónomo">Autónomo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Grau de autonomia
                  </label>
                  <select
                    value={sessionAutonomy}
                    onChange={(e) =>
                      setSessionAutonomy(
                        e.target.value as SessionRecord['autonomyDegree']
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-2 text-xs text-slate-900 dark:text-slate-100"
                  >
                    <option value="Inicial">Inicial</option>
                    <option value="Progressiva">Progressiva</option>
                    <option value="Consolidada">Consolidada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Observações da professora
                </label>
                <textarea
                  rows={2}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Desempenho observado, atenção, estratégias..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prioridades para a sessão seguinte
                </label>
                <input
                  type="text"
                  value={sessionNext}
                  onChange={(e) => setSessionNext(e.target.value)}
                  placeholder="Ex: Treinar compreensão de instruções"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Guardar registo de sessão</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Histórico de sessões — {activeStudent.name}
            </h2>

            {studentSessions.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">
                Ainda não existem sessões registadas para este aluno.
              </p>
            ) : (
              <div className="space-y-3">
                {studentSessions.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                        {s.date}
                      </span>
                      <span>
                        {s.supportLevel} · Autonomia: {s.autonomyDegree}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-teal-800 dark:text-teal-300">
                      {s.activitiesDone.join(', ')}
                    </div>
                    {s.teacherNotes && (
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {s.teacherNotes}
                      </p>
                    )}
                    {s.nextSessionPriorities && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        <strong>Próxima sessão:</strong>{' '}
                        {s.nextSessionPriorities}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: AVALIAÇÃO CONTÍNUA */}
      {activeTab === 'avaliacao_continua' && activeStudent && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Avaliação Contínua — Registo Automático de Atividades
            </h2>
          </div>

          {studentResults.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">
              O aluno ainda não concluiu atividades interativas na plataforma.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <th className="py-2.5 pr-4 font-semibold">Data</th>
                    <th className="py-2.5 pr-4 font-semibold">Atividade</th>
                    <th className="py-2.5 pr-4 font-semibold">Mês</th>
                    <th className="py-2.5 pr-4 font-semibold">Nível</th>
                    <th className="py-2.5 pr-4 font-semibold">Tentativas</th>
                    <th className="py-2.5 pr-4 font-semibold">Pistas</th>
                    <th className="py-2.5 font-semibold">Autonomia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {studentResults.map((r) => (
                    <tr
                      key={r.id}
                      className="text-slate-800 dark:text-slate-200"
                    >
                      <td className="py-3 pr-4 tabular-nums whitespace-nowrap">
                        {new Date(r.date).toLocaleDateString('pt-PT')}
                      </td>
                      <td className="py-3 pr-4 font-medium">
                        {r.activityTitle}
                      </td>
                      <td className="py-3 pr-4 capitalize">{r.month}</td>
                      <td className="py-3 pr-4 tabular-nums">
                        Nível {r.difficultyLevel}
                      </td>
                      <td className="py-3 pr-4 tabular-nums">{r.attempts}</td>
                      <td className="py-3 pr-4 tabular-nums">{r.hintsUsed}</td>
                      <td className="py-3 font-medium text-teal-700 dark:text-teal-400">
                        {r.autonomyDegree}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: AVALIAÇÃO FINAL E RELATÓRIOS */}
      {activeTab === 'avaliacao_final' && activeStudent && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-700 dark:text-teal-400" />
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Relatório Individual de Avaliação Final (Junho)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comparação entre a avaliação inicial e os progressos observados
                </p>
              </div>
            </div>

            <div className="no-print flex items-center gap-2">
              <button
                type="button"
                onClick={exportReportText}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exportar (.txt)</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / PDF</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPETENCIES.map((comp) => {
              const init = currentAssessment.ratings[comp.id];
              const count = studentResults.filter(
                (r) => r.competency === comp.id
              ).length;
              return (
                <div
                  key={comp.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {comp.label}
                  </span>
                  <div className="text-right">
                    <span className="text-slate-500 dark:text-slate-400">
                      Inicial: {init}
                    </span>
                    <span className="mx-1.5">·</span>
                    <span className="font-semibold text-teal-700 dark:text-teal-400 tabular-nums">
                      {count} atividade(s)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estratégias eficazes identificadas
              </label>
              <textarea
                rows={3}
                value={finalStrategies}
                onChange={(e) => setFinalStrategies(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Necessidades de continuidade e propostas futuras
              </label>
              <textarea
                rows={3}
                value={finalContinuity}
                onChange={(e) => setFinalContinuity(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
