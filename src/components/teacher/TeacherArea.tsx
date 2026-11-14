import React, { useCallback, useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import * as db from '../../lib/db';
import type {
  ActivityResult,
  IndividualPlan,
  PedagogicalActivity,
  StudentProfile,
} from '../../types/pedagogical';
import { ExerciseList } from './ExerciseList';
import { StudentDetail } from './StudentDetail';
import { StudentList } from './StudentList';
import { TeacherLogin } from './TeacherLogin';
import { ErrorText, Loading, Tabs, errorMessage } from './ui';

interface TeacherAreaProps {
  audioEnabled: boolean;
  highlightKeywords: boolean;
}

/** Everything the teacher screens share, loaded once and refreshed on change. */
export interface TeacherData {
  students: StudentProfile[];
  plans: IndividualPlan[];
  results: ActivityResult[];
  activities: PedagogicalActivity[];
}

type Section = 'alunos' | 'exercicios';

export const TeacherArea: React.FC<TeacherAreaProps> = (props) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    db.getSession().then(setSession);
    return db.onAuthChange(setSession);
  }, []);

  if (session === undefined) return <Loading />;
  if (!session) return <TeacherLogin />;
  return <TeacherWorkspace {...props} email={session.user.email ?? ''} />;
};

const TeacherWorkspace: React.FC<TeacherAreaProps & { email: string }> = ({
  audioEnabled,
  highlightKeywords,
  email,
}) => {
  const [section, setSection] = useState<Section>('alunos');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [data, setData] = useState<TeacherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const [students, plans, results, activities] = await Promise.all([
        db.listStudents(),
        db.listPlans(),
        db.listResults(),
        db.listActivities({ includeHidden: true }),
      ]);
      setData({ students, plans, results, activities });
      setError(null);
    } catch (e) {
      setError(`Não foi possível carregar os dados: ${errorMessage(e)}`);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const username = email.endsWith(`@${db.TEACHER_EMAIL_DOMAIN}`)
    ? email.split('@')[0]
    : email;
  const selectedStudent = data?.students.find((s) => s.id === selectedStudentId);

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="label-print">Área da Professora · {username}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink mt-1">
            {section === 'alunos' ? 'Alunos' : 'Exercícios'}
          </h1>
        </div>
        <button type="button" onClick={() => db.signOut()} className="btn btn-paper btn-sm">
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>

      <Tabs
        label="Secções da área da professora"
        tabs={[
          { id: 'alunos', label: 'Alunos' },
          { id: 'exercicios', label: 'Exercícios' },
        ]}
        active={section}
        onChange={(s) => {
          setSection(s);
          setSelectedStudentId(null);
        }}
      />

      <ErrorText error={error} />
      {!data ? (
        !error && <Loading />
      ) : section === 'alunos' ? (
        selectedStudent ? (
          <StudentDetail
            key={selectedStudent.id}
            student={selectedStudent}
            data={data}
            onBack={() => setSelectedStudentId(null)}
            onChanged={reload}
            onDeleted={() => {
              setSelectedStudentId(null);
              reload();
            }}
          />
        ) : (
          <StudentList
            data={data}
            onOpen={setSelectedStudentId}
            onCreated={async (id) => {
              await reload();
              setSelectedStudentId(id);
            }}
          />
        )
      ) : (
        <ExerciseList
          activities={data.activities}
          plans={data.plans}
          students={data.students}
          onChanged={reload}
          audioEnabled={audioEnabled}
          highlightKeywords={highlightKeywords}
        />
      )}
    </div>
  );
};
