import React, { useState } from 'react';
import { ArrowRight, UserPlus } from 'lucide-react';
import { INTERVENTION_PROFILES } from '../../data/curriculumData';
import * as db from '../../lib/db';
import type {
  InterventionProfile,
  SchoolYear,
} from '../../types/pedagogical';
import { computePoints, formatDate, todayLocal } from '../../utils/progress';
import type { TeacherData } from './TeacherArea';
import { Card, ErrorText, Field, errorMessage } from './ui';

export const SCHOOL_YEARS: SchoolYear[] = ['1.º ano', '2.º ano', '3.º ano', '4.º ano'];

interface StudentListProps {
  data: TeacherData;
  onOpen: (id: string) => void;
  onCreated: (id: string) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  data,
  onOpen,
  onCreated,
}) => {
  const [showForm, setShowForm] = useState(data.students.length === 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink-soft">
          {data.students.length === 0
            ? 'Ainda não há alunos. Crie o primeiro perfil.'
            : `${data.students.length} aluno(s). Abra um aluno para ver a ficha, o plano, os sumários e o progresso.`}
        </p>
        {!showForm && (
          <button type="button" className="btn btn-pen btn-sm" onClick={() => setShowForm(true)}>
            <UserPlus className="w-4 h-4" />
            Novo aluno
          </button>
        )}
      </div>

      {showForm && (
        <NewStudentForm
          onCancel={data.students.length > 0 ? () => setShowForm(false) : undefined}
          onCreated={(id) => {
            setShowForm(false);
            onCreated(id);
          }}
        />
      )}

      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {data.students.map((s) => {
          const results = data.results.filter((r) => r.studentId === s.id);
          const plan = data.plans.find((p) => p.studentId === s.id);
          const last = results[0];
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onOpen(s.id)}
                aria-label={`Abrir ${s.name}`}
                className="group sketch sketch-shade w-full text-left p-5 space-y-3 transition-transform duration-150 hover:-translate-y-1 hover:[--sketch-fill:color-mix(in_srgb,var(--color-pencil)_22%,var(--color-sheet))] focus-visible:-translate-y-1"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="hand text-4xl font-bold text-pen leading-none">
                    {s.name}
                  </span>
                  <span className="text-sm font-semibold text-ink-soft whitespace-nowrap">
                    {s.schoolYear}
                  </span>
                </div>
                <div className="label-print">
                  {INTERVENTION_PROFILES[s.profile].shortTitle} · Nível{' '}
                  {plan?.difficultyLevel ?? 1}
                </div>
                <dl className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <dt className="text-ink-soft">Atividades</dt>
                    <dd className="text-xl font-bold tabular-nums">{results.length}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">Pontos</dt>
                    <dd className="text-xl font-bold tabular-nums">
                      {computePoints(results)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">No plano</dt>
                    <dd className="text-xl font-bold tabular-nums">
                      {plan?.activityIds.length ?? 0}
                    </dd>
                  </div>
                </dl>
                <p className="text-xs text-ink-soft">
                  {last
                    ? `Última atividade: ${last.activityTitle} (${formatDate(last.date)})`
                    : 'Ainda sem atividades.'}
                </p>
                <span className="flex items-center gap-1 text-sm font-bold text-pen group-hover:underline underline-offset-4">
                  Abrir ficha
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const NewStudentForm: React.FC<{
  onCancel?: () => void;
  onCreated: (id: string) => void;
}> = ({ onCancel, onCreated }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(8);
  const [schoolYear, setSchoolYear] = useState<SchoolYear>('2.º ano');
  const [profile, setProfile] = useState<InterventionProfile>('perfil3');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const created = await db.createStudent({
        name: name.trim(),
        age,
        schoolYear,
        profile,
        startDate: todayLocal(),
        observations: '',
      });
      onCreated(created.id);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <Card
      title="Novo aluno"
      subtitle="O aluno passa a aparecer na página inicial para escolher o seu perfil. O plano começa com as competências do perfil de intervenção."
    >
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <Field label="Nome" className="lg:col-span-1">
          <input
            className="field"
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="Idade">
          <input
            className="field"
            type="number"
            min={5}
            max={14}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          />
        </Field>
        <Field label="Ano">
          <select
            className="field"
            value={schoolYear}
            onChange={(e) => setSchoolYear(e.target.value as SchoolYear)}
          >
            {SCHOOL_YEARS.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </Field>
        <Field label="Perfil de intervenção">
          <select
            className="field"
            value={profile}
            onChange={(e) => setProfile(e.target.value as InterventionProfile)}
          >
            {Object.entries(INTERVENTION_PROFILES).map(([id, p]) => (
              <option key={id} value={id}>
                {p.shortTitle}
              </option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap items-center gap-3">
          <button type="submit" className="btn btn-pen btn-sm" disabled={busy}>
            {busy ? 'A criar…' : 'Criar aluno'}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-paper btn-sm" onClick={onCancel}>
              Cancelar
            </button>
          )}
          <ErrorText error={error} />
        </div>
      </form>
    </Card>
  );
};
