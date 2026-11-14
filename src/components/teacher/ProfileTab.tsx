import React, { useState } from 'react';
import { INTERVENTION_PROFILES } from '../../data/curriculumData';
import * as db from '../../lib/db';
import type {
  InterventionProfile,
  SchoolYear,
  StudentProfile,
} from '../../types/pedagogical';
import { SCHOOL_YEARS } from './StudentList';
import { Card, ErrorText, Field, errorMessage, useSaver } from './ui';

interface ProfileTabProps {
  student: StudentProfile;
  resultsCount: number;
  onSaved: () => Promise<void> | void;
  onDeleted: () => void;
}

/** Ficha: who the student is, plus resetting progress and deleting. */
export const ProfileTab: React.FC<ProfileTabProps> = ({
  student,
  resultsCount,
  onSaved,
  onDeleted,
}) => {
  const [draft, setDraft] = useState<StudentProfile>(student);
  const saver = useSaver();
  const set = <K extends keyof StudentProfile>(k: K, v: StudentProfile[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim()) return;
    await saver.run(async () => {
      await db.updateStudent({ ...draft, name: draft.name.trim() });
      await onSaved();
    });
  };

  return (
    <div className="space-y-6">
      <Card
        title="Ficha do aluno"
        subtitle="O nome e o ano aparecem na página inicial, onde o aluno escolhe o seu perfil."
      >
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Nome">
              <input
                className="field"
                required
                value={draft.name}
                onChange={(e) => set('name', e.target.value)}
              />
            </Field>
            <Field label="Idade">
              <input
                className="field"
                type="number"
                min={5}
                max={14}
                value={draft.age}
                onChange={(e) => set('age', Number(e.target.value))}
              />
            </Field>
            <Field label="Ano">
              <select
                className="field"
                value={draft.schoolYear}
                onChange={(e) => set('schoolYear', e.target.value as SchoolYear)}
              >
                {SCHOOL_YEARS.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </Field>
            <Field label="Início do apoio">
              <input
                className="field"
                type="date"
                value={draft.startDate}
                onChange={(e) => set('startDate', e.target.value)}
              />
            </Field>
          </div>
          <Field
            label="Perfil de intervenção"
            hint={INTERVENTION_PROFILES[draft.profile].description}
          >
            <select
              className="field"
              value={draft.profile}
              onChange={(e) =>
                set('profile', e.target.value as InterventionProfile)
              }
            >
              {Object.entries(INTERVENTION_PROFILES).map(([id, p]) => (
                <option key={id} value={id}>
                  {p.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Observações" hint="Interesses, estratégias que resultam, informação útil para as sessões.">
            <textarea
              className="field"
              rows={4}
              value={draft.observations}
              onChange={(e) => set('observations', e.target.value)}
            />
          </Field>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className="btn btn-pen btn-sm" disabled={saver.saving}>
              Guardar ficha
            </button>
            {saver.status}
          </div>
        </form>
      </Card>

      <DangerZone student={student} resultsCount={resultsCount} onReset={onSaved} onDeleted={onDeleted} />
    </div>
  );
};

const DangerZone: React.FC<{
  student: StudentProfile;
  resultsCount: number;
  onReset: () => Promise<void> | void;
  onDeleted: () => void;
}> = ({ student, resultsCount, onReset, onDeleted }) => {
  const [confirmName, setConfirmName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState(false);

  const reset = async () => {
    if (
      !window.confirm(
        `Repor o progresso de ${student.name}?\n\nApaga os ${resultsCount} resultado(s) de atividades, e com eles os pontos e as medalhas. A ficha, o plano, a avaliação, os sumários, o relatório e o glossário ficam.`
      )
    ) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await db.resetProgress(student.id);
      await onReset();
      setResetDone(true);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    setError(null);
    try {
      await db.deleteStudent(student.id);
      onDeleted();
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <Card title="Zona de cuidado" className="border-mark!">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="font-bold text-ink">Repor progresso</h3>
          <p className="text-sm text-ink-soft">
            Apaga os resultados das atividades ({resultsCount}), os pontos e as
            medalhas. Útil no início de um novo período ou ano letivo.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn btn-paper btn-sm"
              disabled={busy || resultsCount === 0}
              onClick={reset}
            >
              Repor progresso
            </button>
            {resetDone && resultsCount === 0 && (
              <span className="text-sm font-semibold text-good">Progresso reposto ✓</span>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-ink">Apagar aluno</h3>
          <p className="text-sm text-ink-soft">
            Apaga o perfil e todos os registos: plano, avaliação, sumários,
            relatório, resultados e glossário. Não pode ser desfeito.
          </p>
          <Field label={`Escreva "${student.name}" para confirmar`}>
            <input
              className="field"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
            />
          </Field>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            disabled={busy || confirmName.trim() !== student.name}
            onClick={remove}
          >
            Apagar aluno
          </button>
        </div>
      </div>
      <ErrorText error={error} />
    </Card>
  );
};
