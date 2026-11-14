import type {
  DifficultyLevel,
  ExerciseQuestion,
  ExerciseType,
  PedagogicalActivity,
} from '../../types/pedagogical';

export const TYPE_LABELS: Record<ExerciseType, string> = {
  multiple_choice: 'Escolha múltipla',
  true_false: 'Verdadeiro ou falso',
  fill_blank: 'Completar',
  word_order: 'Ordenar palavras',
  sequence_order: 'Ordenar sequência',
  matching: 'Associar pares',
  guided_reading: 'Leitura guiada',
  guided_writing: 'Escrita guiada',
};

/** Types whose questions can be written in the editor. */
export const EDITABLE_TYPES: ExerciseType[] = [
  'multiple_choice',
  'true_false',
  'fill_blank',
  'word_order',
  'sequence_order',
  'matching',
];

export const isEditableType = (t: ExerciseType) => EDITABLE_TYPES.includes(t);

export const TRUE_FALSE_OPTIONS = ['Verdadeiro', 'Falso'];

export const LEVELS: DifficultyLevel[] = [1, 2, 3];

const randomId = () => Math.random().toString(36).slice(2, 8);

export const newQuestion = (type: ExerciseType): ExerciseQuestion => {
  const base = { id: `q-${randomId()}`, prompt: '', hint: '' };
  switch (type) {
    case 'true_false':
      return { ...base, options: [...TRUE_FALSE_OPTIONS], correctAnswer: 'Verdadeiro' };
    case 'word_order':
    case 'sequence_order':
      return { ...base, correctOrder: ['', ''] };
    case 'matching':
      return { ...base, pairs: [{ left: '', right: '' }, { left: '', right: '' }] };
    default:
      return { ...base, options: ['', '', ''], correctAnswer: '' };
  }
};

export const newActivity = (sortOrder: number): PedagogicalActivity => ({
  id: '',
  title: '',
  gameTitle: '',
  month: 'janeiro',
  competency: 'vocabulario',
  curriculumArea: 'Português',
  type: 'multiple_choice',
  pedagogicalObjective: '',
  simpleInstruction: '',
  demonstrationExample: '',
  levels: { 1: [newQuestion('multiple_choice')], 2: [], 3: [] },
  published: true,
  sortOrder,
});

const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32);

export const makeActivityId = (a: PedagogicalActivity) =>
  `${a.month.slice(0, 3)}-${slug(a.gameTitle || a.title) || 'exercicio'}-${randomId()}`;

/** Shuffles until the order differs from the correct one (when possible). */
function scramble(items: string[]): string[] {
  if (items.length < 2 || new Set(items).size < 2) return [...items];
  let out = [...items];
  for (let tries = 0; tries < 10; tries++) {
    out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    if (out.some((x, i) => x !== items[i])) break;
  }
  return out;
}

const clean = (xs: string[] | undefined) =>
  (xs ?? []).map((x) => x.trim()).filter(Boolean);

/** Keeps only the fields the given type uses, trimmed, ready to save. */
export function normaliseQuestion(
  q: ExerciseQuestion,
  type: ExerciseType
): ExerciseQuestion {
  const base: ExerciseQuestion = {
    id: q.id || `q-${randomId()}`,
    prompt: q.prompt.trim(),
    hint: q.hint.trim(),
  };
  if (q.visualEmoji?.trim()) base.visualEmoji = q.visualEmoji.trim();
  if (q.audioText?.trim()) base.audioText = q.audioText.trim();

  switch (type) {
    case 'true_false':
      return {
        ...base,
        options: [...TRUE_FALSE_OPTIONS],
        correctAnswer: TRUE_FALSE_OPTIONS.includes(q.correctAnswer ?? '')
          ? q.correctAnswer
          : 'Verdadeiro',
      };
    case 'word_order':
    case 'sequence_order': {
      const order = clean(q.correctOrder);
      return { ...base, correctOrder: order, scrambledItems: scramble(order) };
    }
    case 'matching':
      return {
        ...base,
        pairs: (q.pairs ?? [])
          .map((p) => ({ left: p.left.trim(), right: p.right.trim() }))
          .filter((p) => p.left || p.right),
      };
    case 'multiple_choice':
    case 'fill_blank':
      return {
        ...base,
        options: clean(q.options),
        correctAnswer: q.correctAnswer?.trim() ?? '',
      };
    default:
      // Guided reading/writing are not edited here: keep them as they are.
      return q;
  }
}

/** Problems that would make the exercise unplayable; empty when fine. */
export function validateActivity(a: PedagogicalActivity): string[] {
  const errors: string[] = [];
  if (!a.title.trim()) errors.push('Falta o título.');
  if (!a.simpleInstruction.trim()) errors.push('Falta a instrução para o aluno.');
  if (!isEditableType(a.type)) return errors;

  for (const level of LEVELS) {
    const qs = a.levels[level];
    if (qs.length === 0) {
      errors.push(`Nível ${level}: acrescente pelo menos uma pergunta.`);
      continue;
    }
    qs.forEach((raw, i) => {
      const q = normaliseQuestion(raw, a.type);
      const where = `Nível ${level}, pergunta ${i + 1}`;
      if (!q.prompt) errors.push(`${where}: falta o enunciado.`);
      switch (a.type) {
        case 'multiple_choice':
        case 'fill_blank':
          if ((q.options?.length ?? 0) < 2)
            errors.push(`${where}: precisa de pelo menos 2 opções.`);
          if (!q.correctAnswer || !q.options?.includes(q.correctAnswer))
            errors.push(`${where}: escolha qual é a opção certa.`);
          if (new Set(q.options).size !== q.options?.length)
            errors.push(`${where}: há opções repetidas.`);
          break;
        case 'word_order':
        case 'sequence_order':
          if ((q.correctOrder?.length ?? 0) < 2)
            errors.push(`${where}: precisa de pelo menos 2 elementos para ordenar.`);
          break;
        case 'matching': {
          const pairs = q.pairs ?? [];
          if (pairs.length < 2) errors.push(`${where}: precisa de pelo menos 2 pares.`);
          if (pairs.some((p) => !p.left || !p.right))
            errors.push(`${where}: há pares incompletos.`);
          if (new Set(pairs.map((p) => p.left)).size !== pairs.length)
            errors.push(`${where}: há elementos da esquerda repetidos.`);
          break;
        }
      }
    });
  }
  return errors;
}

export const questionCount = (a: PedagogicalActivity) =>
  LEVELS.map((l) => a.levels[l]?.length ?? 0);
