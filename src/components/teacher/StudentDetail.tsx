import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { INTERVENTION_PROFILES } from '../../data/curriculumData';
import * as db from '../../lib/db';
import type {
  FinalReport,
  GlossaryEntry,
  InitialAssessment,
  SessionRecord,
  StudentProfile,
} from '../../types/pedagogical';
import { computePoints } from '../../utils/progress';
import { AssessmentTab } from './AssessmentTab';
import { PlanTab } from './PlanTab';
import { ProfileTab } from './ProfileTab';
import { ProgressReportTab } from './ProgressReportTab';
import { SessionsTab } from './SessionsTab';
import type { TeacherData } from './TeacherArea';
import { ErrorText, Loading, Tabs, errorMessage } from './ui';

type StudentTab = 'ficha' | 'avaliacao' | 'plano' | 'sumarios' | 'progresso';

const TABS: { id: StudentTab; label: string }[] = [
  { id: 'ficha', label: 'Ficha' },
  { id: 'avaliacao', label: 'Avaliação inicial' },
  { id: 'plano', label: 'Plano' },
  { id: 'sumarios', label: 'Sumários' },
  { id: 'progresso', label: 'Progresso e relatório' },
];

/** Per-student records that only this screen needs. */
export interface StudentRecords {
  assessment: InitialAssessment | null;
  sessions: SessionRecord[];
  report: FinalReport | null;
  glossary: GlossaryEntry[];
}

interface StudentDetailProps {
  student: StudentProfile;
  data: TeacherData;
  onBack: () => void;
  onChanged: () => Promise<void> | void;
  onDeleted: () => void;
}

export const StudentDetail: React.FC<StudentDetailProps> = ({
  student,
  data,
  onBack,
  onChanged,
  onDeleted,
}) => {
  const [tab, setTab] = useState<StudentTab>('ficha');
  const [records, setRecords] = useState<StudentRecords | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadRecords = useCallback(async () => {
    try {
      const [assessment, sessions, report, glossary] = await Promise.all([
        db.getAssessment(student.id),
        db.listSessions(student.id),
        db.getReport(student.id),
        db.listGlossary(student.id),
      ]);
      setRecords({ assessment, sessions, report, glossary });
      setError(null);
    } catch (e) {
      setError(`Não foi possível carregar os registos: ${errorMessage(e)}`);
    }
  }, [student.id]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const plan =
    data.plans.find((p) => p.studentId === student.id) ?? db.defaultPlan(student);
  const results = data.results.filter((r) => r.studentId === student.id);

  return (
    <div className="space-y-6">
      <div className="no-print">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-ink"
        >
          <ArrowLeft className="w-4 h-4" />
          Todos os alunos
        </button>
      </div>

      <div className="no-print flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="hand text-5xl font-bold text-pen leading-none">
            {student.name}
          </div>
          <div className="label-print mt-2">
            {student.schoolYear} · {student.age} anos ·{' '}
            {INTERVENTION_PROFILES[student.profile].shortTitle} · Nível{' '}
            {plan.difficultyLevel}
          </div>
        </div>
        <div className="flex gap-6 text-sm">
          <div>
            <div className="text-ink-soft">Atividades</div>
            <div className="text-2xl font-bold tabular-nums">{results.length}</div>
          </div>
          <div>
            <div className="text-ink-soft">Pontos</div>
            <div className="text-2xl font-bold tabular-nums">
              {computePoints(results)}
            </div>
          </div>
          <div>
            <div className="text-ink-soft">Sumários</div>
            <div className="text-2xl font-bold tabular-nums">
              {records?.sessions.length ?? '–'}
            </div>
          </div>
        </div>
      </div>

      <Tabs label={`Registos de ${student.name}`} tabs={TABS} active={tab} onChange={setTab} />

      <ErrorText error={error} />

      {tab === 'ficha' && (
        <ProfileTab
          student={student}
          resultsCount={results.length}
          onSaved={onChanged}
          onDeleted={onDeleted}
        />
      )}
      {tab !== 'ficha' && !records && !error && <Loading />}
      {tab === 'avaliacao' && records && (
        <AssessmentTab
          student={student}
          assessment={records.assessment}
          plan={plan}
          onSaved={async () => {
            await loadRecords();
            await onChanged();
          }}
          onGoToPlan={() => setTab('plano')}
        />
      )}
      {tab === 'plano' && (
        <PlanTab
          student={student}
          plan={plan}
          activities={data.activities}
          results={results}
          onSaved={onChanged}
        />
      )}
      {tab === 'sumarios' && records && (
        <SessionsTab
          student={student}
          sessions={records.sessions}
          results={results}
          activities={data.activities}
          plan={plan}
          onChanged={loadRecords}
        />
      )}
      {tab === 'progresso' && records && (
        <ProgressReportTab
          student={student}
          plan={plan}
          results={results}
          records={records}
          activities={data.activities}
          onRecordsChanged={loadRecords}
        />
      )}
    </div>
  );
};
