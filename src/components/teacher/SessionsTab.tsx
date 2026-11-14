import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { COMPETENCIES } from '../../data/curriculumData';
import * as db from '../../lib/db';
import type {
  ActivityResult,
  CompetencyId,
  IndividualPlan,
  PedagogicalActivity,
  SessionAutonomy,
  SessionRecord,
  StudentProfile,
  SupportLevel,
} from '../../types/pedagogical';
import { formatDate, localDay, todayLocal } from '../../utils/progress';
import { Card, ErrorText, Field, IconButton, errorMessage, useSaver } from './ui';

export const SUPPORT_LEVELS: SupportLevel[] = [
  'Apoio total',
  'Apoio moderado',
  'Apoio mínimo',
  'Autónomo',
];
export const SESSION_AUTONOMY: SessionAutonomy[] = [
  'Inicial',
  'Progressiva',
  'Consolidada',
];

interface SessionsTabProps {
  student: StudentProfile;
  sessions: SessionRecord[];
  results: ActivityResult[];
  activities: PedagogicalActivity[];
  plan: IndividualPlan;
  onChanged: () => Promise<void>;
}

const uniq = <T,>(xs: T[]) => Array.from(new Set(xs));

/** What the student did on the platform on a given day. */
const platformActivitiesOn = (results: ActivityResult[], day: string) =>
  uniq(results.filter((r) => localDay(r.date) === day).map((r) => r.activityId));

/** Sumários: one record per lesson, written after the session. */
export const SessionsTab: React.FC<SessionsTabProps> = ({
  student,
  sessions,
  results,
  activities,
  plan,
  onChanged,
}) => {
  const [editing, setEditing] = useState<SessionRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activityName = (id: string) => {
    const a = activities.find((x) => x.id === id);
    if (a) return a.gameTitle || a.title;
    return results.find((r) => r.activityId === id)?.activityTitle ?? id;
  };

  const startNew = () => {
    const day = todayLocal();
    const ids = platformActivitiesOn(results, day);
    setEditing({
      id: '',
      studentId: student.id,
      date: day,
      activityIds: ids,
      otherActivities: '',
      competencies: competenciesOf(ids, activities),
      summary: '',
      supportLevel: 'Apoio moderado',
      autonomyDegree: 'Progressiva',
      teacherNotes: '',
      nextPriorities: '',
    });
  };

  const remove = async (s: SessionRecord) => {
    if (!window.confirm(`Apagar o sumário de ${formatDate(s.date)}?`)) return;
    try {
      await db.deleteSession(s.id);
      await onChanged();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  // The lesson before the one being written (sessions are newest first).
  const previous = editing
    ? sessions.find(
        (s) => s.id !== editing.id && (!editing.id || s.date <= editing.date)
      )
    : undefined;

  return (
    <div className="space-y-6">
      {editing ? (
        <SessionForm
          key={editing.id || 'new'}
          initial={editing}
          previous={previous}
          results={results}
          activities={activities}
          plan={plan}
          activityName={activityName}
          onCancel={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await onChanged();
          }}
        />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-ink-soft">
            Registe o sumário de cada aula. As atividades feitas na plataforma
            nesse dia são acrescentadas automaticamente.
          </p>
          <button type="button" className="btn btn-pen btn-sm" onClick={startNew}>
            <Plus className="w-4 h-4" />
            Novo sumário
          </button>
        </div>
      )}

      <ErrorText error={error} />

      {sessions.length === 0 ? (
        !editing && (
          <p className="text-ink-soft">Ainda não há sumários para {student.name}.</p>
        )
      ) : (
        <ol className="space-y-4">
          {sessions.map((s) => (
            <li key={s.id} className="sheet bg-sheet border border-edge p-5 space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="hand text-3xl font-bold text-pen leading-none">
                    {formatDate(s.date)}
                  </span>
                  <span className="text-sm text-ink-soft">
                    {s.supportLevel} · Autonomia {s.autonomyDegree.toLowerCase()}
                  </span>
                </div>
                <div className="no-print flex gap-2">
                  <button
                    type="button"
                    className="btn btn-paper btn-sm"
                    onClick={() => setEditing(s)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-paper btn-sm"
                    onClick={() => remove(s)}
                  >
                    Apagar
                  </button>
                </div>
              </div>
              {s.summary && <p className="text-ink whitespace-pre-line">{s.summary}</p>}
              {(s.activityIds.length > 0 || s.otherActivities) && (
                <p className="text-sm">
                  <span className="font-bold">Atividades: </span>
                  {[...s.activityIds.map(activityName), s.otherActivities]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              )}
              {s.competencies.length > 0 && (
                <p className="text-sm text-ink-soft">
                  {s.competencies
                    .map((id) => COMPETENCIES.find((c) => c.id === id)?.shortLabel)
                    .join(' · ')}
                </p>
              )}
              {s.teacherNotes && (
                <p className="text-sm">
                  <span className="font-bold">Observações: </span>
                  {s.teacherNotes}
                </p>
              )}
              {s.nextPriorities && (
                <p className="text-sm">
                  <span className="font-bold">Próxima aula: </span>
                  {s.nextPriorities}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

function competenciesOf(ids: string[], activities: PedagogicalActivity[]) {
  return uniq(
    ids
      .map((id) => activities.find((a) => a.id === id)?.competency)
      .filter((c): c is CompetencyId => Boolean(c))
  );
}

const SessionForm: React.FC<{
  initial: SessionRecord;
  previous?: SessionRecord;
  results: ActivityResult[];
  activities: PedagogicalActivity[];
  plan: IndividualPlan;
  activityName: (id: string) => string;
  onCancel: () => void;
  onSaved: () => Promise<void>;
}> = ({ initial, previous, results, activities, plan, activityName, onCancel, onSaved }) => {
  const [draft, setDraft] = useState<SessionRecord>(initial);
  const saver = useSaver();
  const set = <K extends keyof SessionRecord>(k: K, v: SessionRecord[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const dayIds = platformActivitiesOn(results, draft.date);

  const changeDate = (date: string) => {
    // Bring in what was done on the platform on the new day.
    const added = platformActivitiesOn(results, date).filter(
      (id) => !draft.activityIds.includes(id)
    );
    const activityIds = [...draft.activityIds, ...added];
    setDraft((d) => ({
      ...d,
      date,
      activityIds,
      competencies: uniq([...d.competencies, ...competenciesOf(added, activities)]),
    }));
  };

  const addActivity = (id: string) => {
    if (!id || draft.activityIds.includes(id)) return;
    setDraft((d) => ({
      ...d,
      activityIds: [...d.activityIds, id],
      competencies: uniq([...d.competencies, ...competenciesOf([id], activities)]),
    }));
  };

  const toggleCompetency = (id: CompetencyId) =>
    set(
      'competencies',
      draft.competencies.includes(id)
        ? draft.competencies.filter((c) => c !== id)
        : [...draft.competencies, id]
    );

  const planOptions = plan.activityIds.filter((id) => !draft.activityIds.includes(id));
  const otherOptions = activities.filter(
    (a) => !plan.activityIds.includes(a.id) && !draft.activityIds.includes(a.id)
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    saver.run(async () => {
      await db.saveSession(draft);
      await onSaved();
    });
  };

  return (
    <Card title={draft.id ? `Editar sumário de ${formatDate(initial.date)}` : 'Novo sumário'}>
      {previous?.nextPriorities && (
        <div className="border-l-4 border-pencil bg-pencil/15 px-4 py-2.5 text-sm">
          <span className="font-bold">
            Prioridades definidas na aula de {formatDate(previous.date)}:{' '}
          </span>
          {previous.nextPriorities}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <Field label="Data" className="max-w-56">
          <input
            className="field"
            type="date"
            required
            value={draft.date}
            onChange={(e) => changeDate(e.target.value)}
          />
        </Field>

        <Field label="Sumário" hint="O que se trabalhou na aula.">
          <textarea
            className="field"
            rows={3}
            required
            value={draft.summary}
            onChange={(e) => set('summary', e.target.value)}
          />
        </Field>

        <div className="space-y-2">
          <span className="field-label">Atividades realizadas</span>
          {draft.activityIds.length === 0 ? (
            <p className="text-sm text-ink-soft">
              Nenhuma atividade da plataforma neste dia.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {draft.activityIds.map((id) => (
                <li key={id} className="flex items-center gap-2 text-sm">
                  <span className="flex-1">
                    {activityName(id)}
                    {dayIds.includes(id) && (
                      <span className="ml-2 text-xs font-bold text-good">
                        feita na plataforma neste dia
                      </span>
                    )}
                  </span>
                  <IconButton
                    label="Tirar"
                    onClick={() =>
                      set('activityIds', draft.activityIds.filter((x) => x !== id))
                    }
                  >
                    ✕
                  </IconButton>
                </li>
              ))}
            </ul>
          )}
          <select
            className="field max-w-md"
            value=""
            aria-label="Acrescentar atividade"
            onChange={(e) => addActivity(e.target.value)}
          >
            <option value="">+ Acrescentar atividade…</option>
            {planOptions.length > 0 && (
              <optgroup label="Do plano">
                {planOptions.map((id) => (
                  <option key={id} value={id}>
                    {activityName(id)}
                  </option>
                ))}
              </optgroup>
            )}
            <optgroup label="Outros exercícios">
              {otherOptions.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.gameTitle || a.title}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <Field label="Outras atividades (fora da plataforma)">
          <input
            className="field"
            placeholder="Ex.: leitura do livro “O Principezinho”, jogo de cartas de sílabas"
            value={draft.otherActivities}
            onChange={(e) => set('otherActivities', e.target.value)}
          />
        </Field>

        <fieldset className="space-y-2">
          <legend className="field-label">Competências trabalhadas</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5">
            {COMPETENCIES.map((c) => (
              <label key={c.id} className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 accent-[#2b37b3]"
                  checked={draft.competencies.includes(c.id)}
                  onChange={() => toggleCompetency(c.id)}
                />
                {c.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nível de apoio">
            <select
              className="field"
              value={draft.supportLevel}
              onChange={(e) => set('supportLevel', e.target.value as SupportLevel)}
            >
              {SUPPORT_LEVELS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Autonomia">
            <select
              className="field"
              value={draft.autonomyDegree}
              onChange={(e) => set('autonomyDegree', e.target.value as SessionAutonomy)}
            >
              {SESSION_AUTONOMY.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Observações">
          <textarea
            className="field"
            rows={2}
            value={draft.teacherNotes}
            onChange={(e) => set('teacherNotes', e.target.value)}
          />
        </Field>
        <Field
          label="Prioridades para a próxima aula"
          hint="Aparecem no topo do próximo sumário."
        >
          <textarea
            className="field"
            rows={2}
            value={draft.nextPriorities}
            onChange={(e) => set('nextPriorities', e.target.value)}
          />
        </Field>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="btn btn-pen btn-sm" disabled={saver.saving}>
            Guardar sumário
          </button>
          <button type="button" className="btn btn-paper btn-sm" onClick={onCancel}>
            Cancelar
          </button>
          {saver.status}
        </div>
      </form>
    </Card>
  );
};
