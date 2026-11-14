import React, { useState } from 'react';
import { COMPETENCIES } from '../../data/curriculumData';
import * as db from '../../lib/db';
import type {
  AssessmentRating,
  CompetencyId,
  IndividualPlan,
  InitialAssessment,
  StudentProfile,
} from '../../types/pedagogical';
import { todayLocal } from '../../utils/progress';
import { Card, Field, useSaver } from './ui';

export const RATINGS: AssessmentRating[] = [
  'Emergente',
  'Em desenvolvimento',
  'Consolidado',
];

interface AssessmentTabProps {
  student: StudentProfile;
  assessment: InitialAssessment | null;
  plan: IndividualPlan;
  onSaved: () => Promise<void>;
  onGoToPlan: () => void;
}

/** The starting point: used to choose priorities and to compare in the report. */
export const AssessmentTab: React.FC<AssessmentTabProps> = ({
  student,
  assessment,
  plan,
  onSaved,
  onGoToPlan,
}) => {
  const [draft, setDraft] = useState<InitialAssessment>(
    assessment ?? {
      studentId: student.id,
      date: todayLocal(),
      ratings: {},
      notes: '',
    }
  );
  const saver = useSaver();
  const planSaver = useSaver();

  const setRating = (id: CompetencyId, r: AssessmentRating) =>
    setDraft((d) => ({ ...d, ratings: { ...d.ratings, [id]: r } }));

  const emergent = COMPETENCIES.filter(
    (c) => draft.ratings[c.id] === 'Emergente'
  ).map((c) => c.id);
  const missingFromPlan = emergent.filter(
    (id) => !plan.priorityCompetencies.includes(id)
  );

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    saver.run(async () => {
      await db.saveAssessment(draft);
      await onSaved();
    });
  };

  const addEmergentToPlan = () =>
    planSaver.run(async () => {
      await db.savePlan({
        ...plan,
        priorityCompetencies: [...plan.priorityCompetencies, ...missingFromPlan],
      });
      await onSaved();
    });

  return (
    <form onSubmit={save} className="space-y-6">
      <Card
        title="Avaliação inicial"
        subtitle="Ponto de partida de cada competência. Serve para definir as prioridades do plano e é comparada com o progresso no relatório."
      >
        <Field label="Data da avaliação" className="max-w-56">
          <input
            className="field"
            type="date"
            value={draft.date}
            onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
          />
        </Field>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-[1.6px] border-ink text-left">
                <th className="py-2 pr-4 font-bold">Competência</th>
                {RATINGS.map((r) => (
                  <th key={r} className="py-2 px-2 font-bold text-center whitespace-nowrap">
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPETENCIES.map((c) => (
                <tr key={c.id} className="border-b border-edge">
                  <td className="py-2.5 pr-4">
                    <div className="font-semibold text-ink">{c.label}</div>
                  </td>
                  {RATINGS.map((r) => (
                    <td key={r} className="py-2.5 px-2 text-center">
                      <input
                        type="radio"
                        name={`rating-${c.id}`}
                        aria-label={`${c.label}: ${r}`}
                        checked={draft.ratings[c.id] === r}
                        onChange={() => setRating(c.id, r)}
                        className="w-4 h-4 accent-[#2b37b3]"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Field label="Notas da avaliação">
          <textarea
            className="field"
            rows={4}
            value={draft.notes}
            onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
          />
        </Field>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="btn btn-pen btn-sm" disabled={saver.saving}>
            Guardar avaliação
          </button>
          {saver.status}
        </div>
      </Card>

      {emergent.length > 0 && (
        <Card title="Ligar ao plano">
          {missingFromPlan.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-ink-soft">
                {missingFromPlan.length} competência(s) classificadas como
                Emergente ainda não são prioritárias no plano:{' '}
                <strong className="text-ink">
                  {missingFromPlan
                    .map((id) => COMPETENCIES.find((c) => c.id === id)?.shortLabel)
                    .join(', ')}
                </strong>
                .
              </p>
              <button
                type="button"
                className="btn btn-pencil btn-sm"
                onClick={addEmergentToPlan}
                disabled={planSaver.saving}
              >
                Tornar prioritárias
              </button>
              {planSaver.status}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-ink-soft">
                Todas as competências Emergente já são prioritárias no plano.
              </p>
              <button type="button" className="btn btn-paper btn-sm" onClick={onGoToPlan}>
                Ver plano
              </button>
            </div>
          )}
        </Card>
      )}
    </form>
  );
};
