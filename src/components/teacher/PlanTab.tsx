import React, { useState } from 'react';
import { COMPETENCIES, MONTHLY_MODULES } from '../../data/curriculumData';
import * as db from '../../lib/db';
import type {
  ActivityResult,
  CompetencyId,
  DifficultyLevel,
  IndividualPlan,
  PedagogicalActivity,
  StudentProfile,
} from '../../types/pedagogical';
import { monthName } from '../../utils/months';
import { Card, Field, IconButton, LinesEditor, useSaver } from './ui';

export const LEVEL_NAMES: Record<DifficultyLevel, string> = {
  1: 'Nível 1 — Iniciação',
  2: 'Nível 2 — Desenvolvimento',
  3: 'Nível 3 — Consolidação',
};

interface PlanTabProps {
  student: StudentProfile;
  plan: IndividualPlan;
  activities: PedagogicalActivity[];
  results: ActivityResult[];
  onSaved: () => Promise<void> | void;
}

/** The plan decides what the student sees: level, priorities and activities. */
export const PlanTab: React.FC<PlanTabProps> = ({
  student,
  plan,
  activities,
  results,
  onSaved,
}) => {
  const [draft, setDraft] = useState<IndividualPlan>(plan);
  const [onlyPriority, setOnlyPriority] = useState(true);
  const saver = useSaver();
  const dirty = JSON.stringify(draft) !== JSON.stringify(plan);

  const set = <K extends keyof IndividualPlan>(k: K, v: IndividualPlan[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const toggleCompetency = (id: CompetencyId) =>
    set(
      'priorityCompetencies',
      draft.priorityCompetencies.includes(id)
        ? draft.priorityCompetencies.filter((c) => c !== id)
        : [...draft.priorityCompetencies, id]
    );

  const toggleActivity = (id: string) =>
    set(
      'activityIds',
      draft.activityIds.includes(id)
        ? draft.activityIds.filter((a) => a !== id)
        : [...draft.activityIds, id]
    );

  const moveActivity = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= draft.activityIds.length) return;
    const next = [...draft.activityIds];
    [next[i], next[j]] = [next[j], next[i]];
    set('activityIds', next);
  };

  const doneIds = new Set(results.map((r) => r.activityId));
  const byId = new Map(activities.map((a) => [a.id, a]));
  const candidates = activities.filter(
    (a) => !onlyPriority || draft.priorityCompetencies.includes(a.competency)
  );

  const save = () =>
    saver.run(async () => {
      const cleaned = {
        ...draft,
        objectives: draft.objectives.map((o) => o.trim()).filter(Boolean),
      };
      await db.savePlan(cleaned);
      setDraft(cleaned);
      await onSaved();
    });

  const saveBar = (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="btn btn-pen btn-sm"
        onClick={save}
        disabled={saver.saving || !dirty}
      >
        Guardar plano
      </button>
      {saver.status ??
        (dirty && (
          <span className="text-sm font-semibold text-mark">
            Há alterações por guardar
          </span>
        ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <p className="text-ink-soft">
        O que está aqui define o que <strong className="text-ink">{student.name}</strong>{' '}
        vê na plataforma: o nível dos exercícios e as atividades de “O meu
        percurso”.
      </p>

      <Card title="Prioridades e nível">
        <fieldset className="space-y-2">
          <legend className="field-label">Competências prioritárias</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            {COMPETENCIES.map((c) => (
              <label key={c.id} className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 accent-[#2b37b3]"
                  checked={draft.priorityCompetencies.includes(c.id)}
                  onChange={() => toggleCompetency(c.id)}
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="field-label">Nível de dificuldade</legend>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {([1, 2, 3] as DifficultyLevel[]).map((l) => (
              <label key={l} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="plan-level"
                  className="w-4 h-4 accent-[#2b37b3]"
                  checked={draft.difficultyLevel === l}
                  onChange={() => set('difficultyLevel', l)}
                />
                {LEVEL_NAMES[l]}
              </label>
            ))}
          </div>
        </fieldset>
      </Card>

      <Card
        title="Atividades do plano"
        subtitle={
          draft.activityIds.length === 0
            ? 'Sem atividades escolhidas: o aluno vê todas as atividades das suas competências prioritárias.'
            : 'O aluno vê estas atividades, por esta ordem, em “O meu percurso”.'
        }
      >
        {draft.activityIds.length > 0 && (
          <ol className="space-y-2">
            {draft.activityIds.map((id, i) => {
              const act = byId.get(id);
              return (
                <li
                  key={id}
                  className="flex items-center gap-2 border-[1.6px] border-ink rounded-[2px] bg-paper px-3 py-2"
                >
                  <span className="w-6 text-right text-sm font-bold text-ink-soft tabular-nums">
                    {i + 1}.
                  </span>
                  <span className="flex-1 min-w-0">
                    {act ? (
                      <>
                        <span className="font-semibold text-ink">
                          {act.gameTitle || act.title}
                        </span>{' '}
                        <span className="text-xs text-ink-soft">
                          {monthName(act.month)} ·{' '}
                          {COMPETENCIES.find((c) => c.id === act.competency)?.shortLabel}
                        </span>
                        {act.published === false && (
                          <span className="ml-2 text-xs font-bold text-mark">
                            oculto: o aluno não o vê
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-mark">
                        Exercício apagado ({id})
                      </span>
                    )}
                  </span>
                  {doneIds.has(id) && (
                    <span className="text-xs font-bold text-good whitespace-nowrap">
                      feita ✓
                    </span>
                  )}
                  <IconButton label="Subir" onClick={() => moveActivity(i, -1)} disabled={i === 0}>
                    ↑
                  </IconButton>
                  <IconButton
                    label="Descer"
                    onClick={() => moveActivity(i, 1)}
                    disabled={i === draft.activityIds.length - 1}
                  >
                    ↓
                  </IconButton>
                  <IconButton label="Tirar do plano" onClick={() => toggleActivity(id)}>
                    ✕
                  </IconButton>
                </li>
              );
            })}
          </ol>
        )}

        <details className="border-t border-edge pt-3" open={draft.activityIds.length === 0}>
          <summary className="cursor-pointer font-bold text-pen">
            Escolher atividades
          </summary>
          <div className="mt-3 space-y-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#2b37b3]"
                checked={onlyPriority}
                onChange={(e) => setOnlyPriority(e.target.checked)}
              />
              Mostrar só as das competências prioritárias
            </label>
            {MONTHLY_MODULES.map((m) => {
              const list = candidates.filter((a) => a.month === m.id);
              if (list.length === 0) return null;
              return (
                <div key={m.id}>
                  <div className="label-print mb-1.5">{m.name}</div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                    {list.map((a) => (
                      <li key={a.id}>
                        <label className="flex items-start gap-2 text-sm">
                          <input
                            type="checkbox"
                            className="mt-0.5 w-4 h-4 accent-[#2b37b3]"
                            checked={draft.activityIds.includes(a.id)}
                            onChange={() => toggleActivity(a.id)}
                          />
                          <span>
                            {a.gameTitle || a.title}{' '}
                            <span className="text-xs text-ink-soft">
                              ·{' '}
                              {COMPETENCIES.find((c) => c.id === a.competency)?.shortLabel}
                              {a.published === false && ' · oculto'}
                              {doneIds.has(a.id) && ' · feita ✓'}
                            </span>
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {candidates.length === 0 && (
              <p className="text-sm text-ink-soft">
                Não há exercícios para as competências escolhidas.
              </p>
            )}
          </div>
        </details>
      </Card>

      <Card title="Objetivos e organização">
        <Field label="Objetivos prioritários">
          <LinesEditor
            values={draft.objectives}
            onChange={(v) => set('objectives', v)}
            placeholder="Ex.: Ler palavras dissilábicas com autonomia"
            addLabel="Acrescentar objetivo"
          />
        </Field>
        <Field label="Frequência das sessões">
          <input
            className="field"
            placeholder="Ex.: 2 sessões semanais de 45 min"
            value={draft.frequency}
            onChange={(e) => set('frequency', e.target.value)}
          />
        </Field>
        <Field label="Estratégias e apoios">
          <textarea
            className="field"
            rows={3}
            value={draft.strategies}
            onChange={(e) => set('strategies', e.target.value)}
          />
        </Field>
        <Field label="Notas">
          <textarea
            className="field"
            rows={3}
            value={draft.notes}
            onChange={(e) => set('notes', e.target.value)}
          />
        </Field>
      </Card>

      <div className="sticky bottom-0 z-10 bg-paper/95 border-t-[1.6px] border-ink py-3">
        {saveBar}
      </div>
    </div>
  );
};
