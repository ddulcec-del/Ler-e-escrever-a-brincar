import React, { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { COMPETENCIES, MONTHLY_MODULES } from '../../data/curriculumData';
import * as db from '../../lib/db';
import type {
  CompetencyId,
  DifficultyLevel,
  ExerciseQuestion,
  ExerciseType,
  MonthId,
  PedagogicalActivity,
} from '../../types/pedagogical';
import { LEVEL_NAMES } from './PlanTab';
import { QuestionEditor } from './QuestionEditor';
import {
  EDITABLE_TYPES,
  LEVELS,
  TYPE_LABELS,
  isEditableType,
  makeActivityId,
  newQuestion,
  normaliseQuestion,
  validateActivity,
} from './exerciseTypes';
import { Card, Field, useSaver } from './ui';

const CURRICULUM_AREAS: NonNullable<PedagogicalActivity['curriculumArea']>[] = [
  'Português',
  'Matemática',
  'Estudo do Meio',
  'Transversal',
];

interface ExerciseEditorProps {
  initial: PedagogicalActivity;
  onCancel: () => void;
  onSaved: () => Promise<void> | void;
  onPreview: (a: PedagogicalActivity) => void;
}

export const ExerciseEditor: React.FC<ExerciseEditorProps> = ({
  initial,
  onCancel,
  onSaved,
  onPreview,
}) => {
  const [draft, setDraft] = useState<PedagogicalActivity>(initial);
  const [errors, setErrors] = useState<string[]>([]);
  const saver = useSaver();
  const isNew = !initial.id;
  const editable = isEditableType(draft.type);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  const set = <K extends keyof PedagogicalActivity>(k: K, v: PedagogicalActivity[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const setQuestions = (level: DifficultyLevel, qs: ExerciseQuestion[]) =>
    setDraft((d) => ({ ...d, levels: { ...d.levels, [level]: qs } }));

  const changeType = (type: ExerciseType) => {
    const hasContent = LEVELS.some((l) => draft.levels[l].some((q) => q.prompt.trim()));
    if (
      hasContent &&
      !window.confirm(
        'Mudar o tipo mantém os enunciados e as pistas, mas as respostas têm de ser escritas de novo. Continuar?'
      )
    ) {
      return;
    }
    setDraft((d) => ({
      ...d,
      type,
      levels: {
        1: d.levels[1].map((q) => ({ ...newQuestion(type), id: q.id, prompt: q.prompt, hint: q.hint })),
        2: d.levels[2].map((q) => ({ ...newQuestion(type), id: q.id, prompt: q.prompt, hint: q.hint })),
        3: d.levels[3].map((q) => ({ ...newQuestion(type), id: q.id, prompt: q.prompt, hint: q.hint })),
      },
    }));
  };

  /** The activity as it will be stored. */
  const prepared = (): PedagogicalActivity => {
    const trimmed: PedagogicalActivity = {
      ...draft,
      title: draft.title.trim(),
      gameTitle: draft.gameTitle?.trim() || undefined,
      pedagogicalObjective: draft.pedagogicalObjective.trim(),
      simpleInstruction: draft.simpleInstruction.trim(),
      demonstrationExample: draft.demonstrationExample.trim(),
      levels: editable
        ? {
            1: draft.levels[1].map((q) => normaliseQuestion(q, draft.type)),
            2: draft.levels[2].map((q) => normaliseQuestion(q, draft.type)),
            3: draft.levels[3].map((q) => normaliseQuestion(q, draft.type)),
          }
        : draft.levels,
    };
    return { ...trimmed, id: trimmed.id || makeActivityId(trimmed) };
  };

  const save = () => {
    const problems = validateActivity(draft);
    setErrors(problems);
    if (problems.length > 0) return;
    saver.run(async () => {
      await db.saveActivity(prepared());
      await onSaved();
    });
  };

  const preview = () => {
    const problems = validateActivity(draft);
    setErrors(problems);
    if (problems.length === 0) onPreview(prepared());
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => {
          if (!dirty || window.confirm('Sair sem guardar as alterações?')) onCancel();
        }}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="w-4 h-4" />
        Todos os exercícios
      </button>

      <h2 className="text-2xl font-extrabold text-ink">
        {isNew ? 'Novo exercício' : `Editar: ${initial.gameTitle || initial.title}`}
      </h2>

      <Card title="Dados gerais">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Título (para a professora)">
            <input className="field" value={draft.title} onChange={(e) => set('title', e.target.value)} />
          </Field>
          <Field label="Nome do jogo (o que o aluno vê)" hint="Se ficar vazio, o aluno vê o título.">
            <input
              className="field"
              value={draft.gameTitle ?? ''}
              onChange={(e) => set('gameTitle', e.target.value)}
            />
          </Field>
          <Field label="Mês">
            <select className="field" value={draft.month} onChange={(e) => set('month', e.target.value as MonthId)}>
              {MONTHLY_MODULES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Competência">
            <select
              className="field"
              value={draft.competency}
              onChange={(e) => set('competency', e.target.value as CompetencyId)}
            >
              {COMPETENCIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Área curricular">
            <select
              className="field"
              value={draft.curriculumArea ?? 'Português'}
              onChange={(e) =>
                set('curriculumArea', e.target.value as PedagogicalActivity['curriculumArea'])
              }
            >
              {CURRICULUM_AREAS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </Field>
          <Field
            label="Tipo de exercício"
            hint={editable ? undefined : 'As perguntas deste tipo não se editam aqui.'}
          >
            <select
              className="field"
              value={draft.type}
              disabled={!editable}
              onChange={(e) => changeType(e.target.value as ExerciseType)}
            >
              {(editable ? EDITABLE_TYPES : [draft.type]).map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Instrução para o aluno" hint="Curta e simples; aparece no cartão do jogo.">
          <input
            className="field"
            value={draft.simpleInstruction}
            onChange={(e) => set('simpleInstruction', e.target.value)}
          />
        </Field>
        <Field label="Objetivo pedagógico">
          <textarea
            className="field"
            rows={2}
            value={draft.pedagogicalObjective}
            onChange={(e) => set('pedagogicalObjective', e.target.value)}
          />
        </Field>
        <Field label="Exemplo / demonstração" hint="Mostrado ao aluno antes de começar.">
          <textarea
            className="field"
            rows={2}
            value={draft.demonstrationExample}
            onChange={(e) => set('demonstrationExample', e.target.value)}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            className="w-4 h-4 accent-[#2b37b3]"
            checked={draft.published !== false}
            onChange={(e) => set('published', e.target.checked)}
          />
          Visível para os alunos
        </label>
      </Card>

      {editable ? (
        LEVELS.map((level) => {
          const qs = draft.levels[level];
          return (
            <Card
              key={level}
              title={LEVEL_NAMES[level]}
              subtitle={`${qs.length} pergunta(s)`}
            >
              {qs.map((q, i) => (
                <QuestionEditor
                  key={q.id || i}
                  type={draft.type}
                  question={q}
                  index={i}
                  total={qs.length}
                  onChange={(nq) => setQuestions(level, qs.map((x, j) => (j === i ? nq : x)))}
                  onMove={(d) => {
                    const j = i + d;
                    if (j < 0 || j >= qs.length) return;
                    const next = [...qs];
                    [next[i], next[j]] = [next[j], next[i]];
                    setQuestions(level, next);
                  }}
                  onRemove={() => setQuestions(level, qs.filter((_, j) => j !== i))}
                />
              ))}
              <button
                type="button"
                className="btn btn-paper btn-sm"
                onClick={() => setQuestions(level, [...qs, newQuestion(draft.type)])}
              >
                <Plus className="w-4 h-4" />
                Acrescentar pergunta
              </button>
            </Card>
          );
        })
      ) : (
        <Card title="Perguntas">
          <p className="text-sm text-ink-soft">
            Este exercício é de {TYPE_LABELS[draft.type].toLowerCase()}: as
            perguntas mantêm-se como estão. Pode alterar os dados gerais, a
            visibilidade, ou pré-visualizar.
          </p>
          <ul className="text-sm list-disc pl-5">
            {LEVELS.map((l) => (
              <li key={l}>
                {LEVEL_NAMES[l]}: {draft.levels[l].length} pergunta(s)
                {draft.levels[l][0] && ` — “${draft.levels[l][0].prompt}”`}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {errors.length > 0 && (
        <div role="alert" className="border-l-4 border-mark bg-eraser/20 px-4 py-3">
          <p className="font-bold text-ink">Antes de guardar, corrija:</p>
          <ul className="text-sm list-disc pl-5 mt-1">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="sticky bottom-0 z-10 bg-paper/95 border-t-[1.6px] border-ink py-3 flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-pen btn-sm" onClick={save} disabled={saver.saving}>
          Guardar exercício
        </button>
        <button type="button" className="btn btn-pencil btn-sm" onClick={preview}>
          Pré-visualizar
        </button>
        <button
          type="button"
          className="btn btn-paper btn-sm"
          onClick={() => {
            if (!dirty || window.confirm('Sair sem guardar as alterações?')) onCancel();
          }}
        >
          Cancelar
        </button>
        {saver.status}
      </div>
    </div>
  );
};
