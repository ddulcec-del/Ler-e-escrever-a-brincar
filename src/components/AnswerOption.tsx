import React from 'react';
import { Doodle } from './Sketch';

const LETTERS = 'ABCDEFGH';

/**
 * One answer in a lettered list, as on a school worksheet. Shared by the
 * exercises and the story questions so a child meets the same pattern
 * everywhere: yellow letter = can pick, green tick = right, struck out = try
 * another one.
 */
export const AnswerOption: React.FC<{
  index: number;
  label: string;
  state: 'idle' | 'right' | 'wrong';
  /** Dim the options that are no longer needed once the question is solved. */
  faded?: boolean;
  onClick: () => void;
}> = ({ index, label, state, faded = false, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left flex items-center gap-4 px-4 py-3 border-2 rounded-[3px] text-lg font-semibold transition-colors ${
      state === 'right'
        ? 'bg-good/15 border-good text-ink'
        : state === 'wrong'
        ? 'bg-eraser/20 border-dashed border-ink/50 text-ink-soft'
        : `bg-sheet border-ink text-ink ${
            faded ? 'opacity-45' : 'hover:bg-pencil/30'
          }`
    }`}
  >
    <span
      aria-hidden="true"
      className={`hand shrink-0 w-10 h-10 flex items-center justify-center text-3xl font-bold border-2 rounded-[3px] ${
        state === 'right'
          ? 'bg-good border-good text-paper'
          : state === 'wrong'
          ? 'border-ink/40 text-ink-soft bg-transparent'
          : 'border-ink bg-pencil text-[#23201c]'
      }`}
    >
      {state === 'right' ? (
        <Doodle name="tick" className="w-7 h-7" strokeWidth={5} />
      ) : (
        LETTERS[index]
      )}
    </span>
    <span
      className={`flex-1 ${state === 'wrong' ? 'line-through decoration-2' : ''}`}
    >
      {label}
    </span>
    {state === 'wrong' && (
      <span className="hand text-2xl font-bold text-mark shrink-0">
        tenta outra
      </span>
    )}
  </button>
);

/** Numbered boxes that fill with a green tick as each step is done. */
export const StepBoxes: React.FC<{
  total: number;
  isDone: (index: number) => boolean;
  current?: number;
}> = ({ total, isDone, current }) => (
  <ol className="flex items-center gap-1.5" aria-hidden="true">
    {Array.from({ length: total }, (_, i) => {
      const done = isDone(i);
      return (
        <li
          key={i}
          className={`hand w-8 h-8 flex items-center justify-center text-2xl font-bold border-2 rounded-[3px] ${
            done
              ? 'bg-good border-good text-paper'
              : i === current
              ? 'bg-pencil border-ink text-[#23201c]'
              : 'border-ink/35 text-ink-soft'
          }`}
        >
          {done ? (
            <Doodle name="tick" className="w-5 h-5" strokeWidth={5.5} />
          ) : (
            i + 1
          )}
        </li>
      );
    })}
  </ol>
);
