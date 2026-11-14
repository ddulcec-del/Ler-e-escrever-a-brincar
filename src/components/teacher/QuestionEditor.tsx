import React from 'react';
import type { ExerciseQuestion, ExerciseType } from '../../types/pedagogical';
import { TRUE_FALSE_OPTIONS } from './exerciseTypes';
import { Field, IconButton, LinesEditor } from './ui';

interface QuestionEditorProps {
  type: ExerciseType;
  question: ExerciseQuestion;
  index: number;
  total: number;
  onChange: (q: ExerciseQuestion) => void;
  onMove: (d: -1 | 1) => void;
  onRemove: () => void;
}

/** The fields of one question, depending on the exercise type. */
export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  type,
  question: q,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}) => {
  const set = <K extends keyof ExerciseQuestion>(k: K, v: ExerciseQuestion[K]) =>
    onChange({ ...q, [k]: v });

  const promptHint =
    type === 'fill_blank'
      ? 'Marque o espaço a completar com ________ (ex.: Quando temos sede bebemos ________.)'
      : type === 'word_order'
      ? 'Ex.: Ordena as palavras para formar a frase:'
      : type === 'sequence_order'
      ? 'Ex.: Põe os passos pela ordem certa:'
      : type === 'matching'
      ? 'Ex.: Liga cada palavra ao seu contrário.'
      : undefined;

  return (
    <div className="border-[1.6px] border-ink rounded-[2px] bg-paper p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-ink">Pergunta {index + 1}</span>
        <div className="flex gap-1.5">
          <IconButton label="Subir" onClick={() => onMove(-1)} disabled={index === 0}>
            ↑
          </IconButton>
          <IconButton label="Descer" onClick={() => onMove(1)} disabled={index === total - 1}>
            ↓
          </IconButton>
          <IconButton label="Apagar pergunta" onClick={onRemove}>
            ✕
          </IconButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_6rem] gap-3">
        <Field label="Enunciado" hint={promptHint}>
          <input
            className="field"
            value={q.prompt}
            onChange={(e) => set('prompt', e.target.value)}
          />
        </Field>
        <Field label="Emoji">
          <input
            className="field text-center"
            maxLength={8}
            value={q.visualEmoji ?? ''}
            onChange={(e) => set('visualEmoji', e.target.value)}
          />
        </Field>
      </div>

      {(type === 'multiple_choice' || type === 'fill_blank') && (
        <ChoiceOptions q={q} onChange={onChange} />
      )}

      {type === 'true_false' && (
        <fieldset>
          <legend className="field-label">Resposta certa</legend>
          <div className="flex gap-6">
            {TRUE_FALSE_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={`tf-${q.id}`}
                  className="w-4 h-4 accent-[#2b37b3]"
                  checked={(q.correctAnswer ?? 'Verdadeiro') === opt}
                  onChange={() => onChange({ ...q, options: [...TRUE_FALSE_OPTIONS], correctAnswer: opt })}
                />
                {opt}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {(type === 'word_order' || type === 'sequence_order') && (
        <Field
          label={type === 'word_order' ? 'Palavras pela ordem certa' : 'Passos pela ordem certa'}
          hint="Escreva-os pela ordem certa; o aluno recebe-os baralhados."
        >
          <LinesEditor
            values={q.correctOrder ?? []}
            onChange={(v) => set('correctOrder', v)}
            addLabel={type === 'word_order' ? 'Acrescentar palavra' : 'Acrescentar passo'}
            ordered
          />
        </Field>
      )}

      {type === 'matching' && <MatchingPairs q={q} onChange={onChange} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Pista" hint="Mostrada quando o aluno pede ajuda.">
          <input className="field" value={q.hint} onChange={(e) => set('hint', e.target.value)} />
        </Field>
        <Field label="Texto para ouvir (opcional)" hint="Lido em voz alta no botão “Ouvir”.">
          <input
            className="field"
            value={q.audioText ?? ''}
            onChange={(e) => set('audioText', e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
};

const ChoiceOptions: React.FC<{
  q: ExerciseQuestion;
  onChange: (q: ExerciseQuestion) => void;
}> = ({ q, onChange }) => {
  const options = q.options ?? [];
  const setOption = (i: number, v: string) => {
    const old = options[i];
    const next = options.map((o, j) => (j === i ? v : o));
    // Keep the right answer pointing at the same option while it is edited.
    onChange({
      ...q,
      options: next,
      correctAnswer: q.correctAnswer && q.correctAnswer === old ? v : q.correctAnswer,
    });
  };
  return (
    <fieldset className="space-y-2">
      <legend className="field-label">Opções (marque a certa)</legend>
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="radio"
            name={`correct-${q.id}`}
            aria-label={`Opção ${i + 1} é a certa`}
            className="w-4 h-4 shrink-0 accent-[#2b37b3]"
            checked={opt !== '' && q.correctAnswer === opt}
            onChange={() => onChange({ ...q, correctAnswer: opt })}
          />
          <input
            className="field"
            value={opt}
            placeholder={`Opção ${i + 1}`}
            onChange={(e) => setOption(i, e.target.value)}
          />
          <IconButton
            label="Remover opção"
            onClick={() =>
              onChange({
                ...q,
                options: options.filter((_, j) => j !== i),
                correctAnswer: q.correctAnswer === opt ? '' : q.correctAnswer,
              })
            }
          >
            ✕
          </IconButton>
        </div>
      ))}
      <button
        type="button"
        className="text-sm font-bold text-pen underline underline-offset-4"
        onClick={() => onChange({ ...q, options: [...options, ''] })}
      >
        + Acrescentar opção
      </button>
    </fieldset>
  );
};

const MatchingPairs: React.FC<{
  q: ExerciseQuestion;
  onChange: (q: ExerciseQuestion) => void;
}> = ({ q, onChange }) => {
  const pairs = q.pairs ?? [];
  const setPair = (i: number, side: 'left' | 'right', v: string) =>
    onChange({
      ...q,
      pairs: pairs.map((p, j) => (j === i ? { ...p, [side]: v } : p)),
    });
  return (
    <fieldset className="space-y-2">
      <legend className="field-label">Pares (esquerda ↔ direita)</legend>
      {pairs.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className="field"
            placeholder="Esquerda"
            value={p.left}
            onChange={(e) => setPair(i, 'left', e.target.value)}
          />
          <span aria-hidden="true">↔</span>
          <input
            className="field"
            placeholder="Direita"
            value={p.right}
            onChange={(e) => setPair(i, 'right', e.target.value)}
          />
          <IconButton
            label="Remover par"
            onClick={() => onChange({ ...q, pairs: pairs.filter((_, j) => j !== i) })}
          >
            ✕
          </IconButton>
        </div>
      ))}
      <button
        type="button"
        className="text-sm font-bold text-pen underline underline-offset-4"
        onClick={() => onChange({ ...q, pairs: [...pairs, { left: '', right: '' }] })}
      >
        + Acrescentar par
      </button>
    </fieldset>
  );
};
