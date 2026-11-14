import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  Volume2,
  X,
} from 'lucide-react';
import {
  COMPETENCIES,
  POSITIVE_FEEDBACK,
  TRY_AGAIN_FEEDBACK,
} from '../data/curriculumData';
import {
  ActivityResult,
  DifficultyLevel,
  ExerciseQuestion,
  PedagogicalActivity,
} from '../types/pedagogical';
import { speakPt, stopSpeaking } from '../utils/speech';
import { monthName } from '../utils/months';
import { AnswerOption, StepBoxes } from './AnswerOption';
import { Doodle } from './Sketch';

interface InteractiveActivityModalProps {
  activity: PedagogicalActivity;
  initialLevel: DifficultyLevel;
  audioEnabled: boolean;
  highlightKeywords: boolean;
  studentId: string;
  onClose: () => void;
  onComplete: (result: Omit<ActivityResult, 'id' | 'date'>) => void;
}

const LEVEL_LABELS: Record<DifficultyLevel, string> = {
  1: 'Nível 1 — Iniciação',
  2: 'Nível 2 — Desenvolvimento',
  3: 'Nível 3 — Consolidação',
};

const LEVEL_NAMES: Record<DifficultyLevel, string> = {
  1: 'Iniciação',
  2: 'Desenvolvimento',
  3: 'Consolidação',
};

export const InteractiveActivityModal: React.FC<
  InteractiveActivityModalProps
> = ({
  activity,
  initialLevel,
  audioEnabled,
  highlightKeywords,
  studentId,
  onClose,
  onComplete,
}) => {
  const [level, setLevel] = useState<DifficultyLevel>(initialLevel);
  const questions: ExerciseQuestion[] =
    activity.levels[level] || activity.levels[1];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'retry';
    message: string;
  } | null>(null);
  const [isQuestionSolved, setIsQuestionSolved] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  // Bumped on every restart so the question state resets even when
  // the level and question index stay the same.
  const [round, setRound] = useState(0);

  // State for multiple choice / guided reading
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // State for word_order
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  // State for sequence_order
  const [sequenceItems, setSequenceItems] = useState<string[]>([]);

  // State for matching
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [shuffledRight, setShuffledRight] = useState<string[]>([]);

  // State for guided_writing
  const [writtenText, setWrittenText] = useState('');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const pressedOutside = useRef(false);

  const currentQuestion = questions[currentIndex];
  const competencyInfo = COMPETENCIES.find(
    (c) => c.id === activity.competency
  );

  useEffect(() => {
    if (!currentQuestion) return;
    setSelectedOption(null);
    setShowHint(false);
    setFeedback(null);
    setIsQuestionSolved(false);

    if (activity.type === 'word_order' && currentQuestion.scrambledItems) {
      setAvailableWords([...currentQuestion.scrambledItems]);
      setOrderedWords([]);
    }
    if (activity.type === 'sequence_order' && currentQuestion.scrambledItems) {
      setSequenceItems([...currentQuestion.scrambledItems]);
    }
    if (activity.type === 'matching' && currentQuestion.pairs) {
      setSelectedLeft(null);
      setMatchedPairs({});
      const rights = currentQuestion.pairs.map((p) => p.right);
      setShuffledRight([...rights].reverse());
    }
    if (activity.type === 'guided_writing') {
      setWrittenText(currentQuestion.sentenceStarter || '');
      setCheckedItems({});
    }
  }, [currentIndex, level, round, activity.type, currentQuestion]);

  // Parents pass a new onClose on every render; keep the latest in a ref so
  // the effect below runs once and doesn't cut the voice on each re-render.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopSpeaking();
        onCloseRef.current();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      stopSpeaking();
    };
  }, []);

  const handleSpeak = (text: string) => {
    if (!audioEnabled) return;
    speakPt(text);
  };

  const resetActivity = (newLevel?: DifficultyLevel) => {
    stopSpeaking();
    if (newLevel) setLevel(newLevel);
    setCurrentIndex(0);
    setAttempts(0);
    setCorrectCount(0);
    setHintsUsed(0);
    setShowHint(false);
    setFeedback(null);
    setIsQuestionSolved(false);
    setIsFinished(false);
    setRound((prev) => prev + 1);
  };

  const recordSuccess = () => {
    const msg =
      POSITIVE_FEEDBACK[Math.floor(Math.random() * POSITIVE_FEEDBACK.length)];
    setFeedback({ type: 'success', message: msg });
    setIsQuestionSolved(true);
    setCorrectCount((prev) => prev + 1);
    if (audioEnabled) {
      speakPt(msg);
    }
  };

  const recordRetry = () => {
    const msg =
      TRY_AGAIN_FEEDBACK[
        Math.floor(Math.random() * TRY_AGAIN_FEEDBACK.length)
      ];
    setFeedback({ type: 'retry', message: msg });
    if (audioEnabled) {
      speakPt(msg);
    }
  };

  const handleCheckMultipleChoice = (option: string) => {
    if (isQuestionSolved) return;
    setSelectedOption(option);
    setAttempts((prev) => prev + 1);

    const expected =
      activity.type === 'guided_reading'
        ? currentQuestion.comprehensionCheck?.answer
        : currentQuestion.correctAnswer;

    if (option === expected) {
      recordSuccess();
    } else {
      recordRetry();
    }
  };

  const handlePickWord = (word: string, idx: number) => {
    if (isQuestionSolved) return;
    const nextAvailable = [...availableWords];
    nextAvailable.splice(idx, 1);
    setAvailableWords(nextAvailable);
    setOrderedWords([...orderedWords, word]);
    setFeedback(null);
  };

  const handleRemoveWord = (word: string, idx: number) => {
    if (isQuestionSolved) return;
    const nextOrdered = [...orderedWords];
    nextOrdered.splice(idx, 1);
    setOrderedWords(nextOrdered);
    setAvailableWords([...availableWords, word]);
    setFeedback(null);
  };

  const handleCheckWordOrder = () => {
    if (isQuestionSolved || !currentQuestion.correctOrder) return;
    setAttempts((prev) => prev + 1);
    const isMatch =
      orderedWords.length === currentQuestion.correctOrder.length &&
      orderedWords.every((w, i) => w === currentQuestion.correctOrder![i]);

    if (isMatch) {
      recordSuccess();
    } else {
      recordRetry();
    }
  };

  const moveSequenceItem = (index: number, direction: -1 | 1) => {
    if (isQuestionSolved) return;
    const target = index + direction;
    if (target < 0 || target >= sequenceItems.length) return;
    const copy = [...sequenceItems];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setSequenceItems(copy);
    setFeedback(null);
  };

  const handleCheckSequence = () => {
    if (isQuestionSolved || !currentQuestion.correctOrder) return;
    setAttempts((prev) => prev + 1);
    const isMatch = sequenceItems.every(
      (item, i) => item === currentQuestion.correctOrder![i]
    );
    if (isMatch) {
      recordSuccess();
    } else {
      recordRetry();
    }
  };

  const handleMatchRight = (rightItem: string) => {
    if (isQuestionSolved || !selectedLeft || !currentQuestion.pairs) return;
    setAttempts((prev) => prev + 1);
    const pair = currentQuestion.pairs.find((p) => p.left === selectedLeft);
    if (pair && pair.right === rightItem) {
      const nextMatched = { ...matchedPairs, [selectedLeft]: rightItem };
      setMatchedPairs(nextMatched);
      setSelectedLeft(null);
      setFeedback(null);
      if (Object.keys(nextMatched).length === currentQuestion.pairs.length) {
        recordSuccess();
      }
    } else {
      recordRetry();
    }
  };

  const handleCompleteWriting = () => {
    if (isQuestionSolved) return;
    setAttempts((prev) => prev + 1);
    const wordCount = writtenText.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount >= 4) {
      recordSuccess();
    } else {
      setFeedback({
        type: 'retry',
        message:
          'Escreve um pouco mais! Usa as perguntas orientadoras ou o banco de palavras.',
      });
    }
  };

  const handleNextOrFinish = () => {
    stopSpeaking();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      const autonomy: ActivityResult['autonomyDegree'] =
        hintsUsed === 0
          ? 'Autónomo'
          : hintsUsed <= 2
          ? 'Com apoio parcial'
          : 'Com apoio total';

      onComplete({
        studentId,
        activityId: activity.id,
        activityTitle: activity.gameTitle || activity.title,
        month: activity.month,
        competency: activity.competency,
        difficultyLevel: level,
        attempts: Math.max(attempts, questions.length),
        correctCount: questions.length,
        totalCount: questions.length,
        hintsUsed,
        autonomyDegree: autonomy,
      });
    }
  };

  const renderHighlightedText = (text: string, keywords?: string[]) => {
    if (!highlightKeywords || !keywords || keywords.length === 0) {
      return text;
    }
    const escaped = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, idx) => {
      const isKw = keywords.some(
        (k) => k.toLowerCase() === part.toLowerCase()
      );
      return isKw ? (
        <mark
          key={idx}
          className="kw"
        >
          {part}
        </mark>
      ) : (
        <span key={idx}>{part}</span>
      );
    });
  };

  /** Answer options, lettered like a school worksheet. */
  const renderOptions = (options: string[], answer?: string) => (
    <div className="grid grid-cols-1 gap-3">
      {options.map((opt, i) => {
        const state =
          selectedOption !== opt ? 'idle' : opt === answer ? 'right' : 'wrong';
        return (
          <AnswerOption
            key={opt}
            index={i}
            label={opt}
            state={state}
            faded={isQuestionSolved && state !== 'right'}
            onClick={() => handleCheckMultipleChoice(opt)}
          />
        );
      })}
    </div>
  );

  const listenButton = (label: string, text: string) => (
    <button
      type="button"
      onClick={() => handleSpeak(text)}
      className="btn-listen shrink-0"
    >
      <Volume2 />
      <span>{label}</span>
    </button>
  );

  const checkButton = (label: string, onClick: () => void) => (
    <button type="button" onClick={onClick} className="btn btn-pen">
      {label}
    </button>
  );

  const exampleText = activity.demonstrationExample
    .replace(/^Exemplo:\s*/i, '')
    .replace(/->/g, '→');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-modal-title"
      onMouseDown={(e) => {
        pressedOutside.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        // Only when the press both started and ended on the backdrop, so
        // dragging a text selection out of the card does not close it.
        if (pressedOutside.current && e.target === e.currentTarget) {
          stopSpeaking();
          onClose();
        }
      }}
      className="skin fixed inset-0 z-50 bg-[#151310]/70 backdrop-blur-xs flex justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="bg-paper border-2 border-ink rounded-[3px] max-w-3xl w-full my-auto shadow-[8px_8px_0_0_rgb(0_0_0/0.35)]">
        {/* Header: where am I, what is this activity */}
        <div className="px-5 sm:px-8 pt-5 pb-4 flex items-start justify-between gap-4">
          <div>
            <div className="label-print">
              {monthName(activity.month)} · {competencyInfo?.label}
              {activity.number ? ` · Atividade ${activity.number}` : ''}
            </div>
            <h2
              id="activity-modal-title"
              className="text-2xl sm:text-3xl font-extrabold text-ink mt-1.5 leading-tight"
            >
              {activity.gameTitle || activity.title}
            </h2>
            {activity.gameTitle && (
              <p className="text-base text-ink-soft mt-1">{activity.title}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            aria-label="Fechar atividade"
            className="shrink-0 p-2 border-2 border-ink rounded-[3px] bg-sheet text-ink hover:bg-pencil/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress and level */}
        <div className="px-5 sm:px-8 py-3 border-y-2 border-ink bg-sheet flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            <span className="label-print tabular-nums">
              Passo {Math.min(currentIndex + 1, questions.length)} de{' '}
              {questions.length}
            </span>
            <StepBoxes
              total={questions.length}
              current={isFinished ? undefined : currentIndex}
              isDone={(i) =>
                isFinished ||
                i < currentIndex ||
                (i === currentIndex && isQuestionSolved)
              }
            />
          </div>

          <div
            className="flex items-center gap-2"
            role="group"
            aria-label="Nível de dificuldade"
          >
            <span className="label-print">Nível</span>
            <div className="inline-flex border-[1.6px] border-ink rounded-[2px] overflow-hidden divide-x-[1.6px] divide-ink">
              {([1, 2, 3] as DifficultyLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => resetActivity(lvl)}
                  aria-pressed={level === lvl}
                  aria-label={LEVEL_LABELS[lvl]}
                  title={LEVEL_LABELS[lvl]}
                  className={`h-9 px-3 text-sm font-bold whitespace-nowrap transition-colors ${
                    level === lvl
                      ? 'bg-ink text-paper'
                      : 'bg-sheet text-ink hover:bg-pencil/40'
                  }`}
                >
                  {lvl}
                  <span className="hidden sm:inline font-semibold">
                    {' '}
                    · {LEVEL_NAMES[lvl]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 sm:px-8 py-6 sm:py-7 space-y-7">
          {isFinished ? (
            <div className="text-center py-4 space-y-6">
              <Doodle
                name="star"
                className="w-20 h-20 mx-auto text-pencil -rotate-6"
                strokeWidth={2.6}
              />
              <div className="space-y-2">
                <h3 className="hand text-6xl font-bold text-pen -rotate-2">
                  Parabéns!
                </h3>
                <p className="text-xl font-bold text-ink">
                  Concluíste a atividade!
                </p>
                <p className="text-base text-ink-soft max-w-md mx-auto">
                  Cada vez estás mais autónomo(a)! O teu progresso foi guardado
                  no teu percurso individual.
                </p>
              </div>

              <dl className="grid grid-cols-3 max-w-md mx-auto border-2 border-ink rounded-[3px] bg-sheet divide-x-2 divide-ink">
                <div className="p-3">
                  <dt className="label-print">Desafios</dt>
                  <dd className="hand text-4xl font-bold text-ink tabular-nums">
                    {questions.length}/{questions.length}
                  </dd>
                </div>
                <div className="p-3">
                  <dt className="label-print">Pistas usadas</dt>
                  <dd className="hand text-4xl font-bold text-ink tabular-nums">
                    {hintsUsed}
                  </dd>
                </div>
                <div className="p-3 bg-pencil/40">
                  <dt className="label-print !text-ink">Pontos ganhos</dt>
                  <dd className="hand text-4xl font-bold text-ink tabular-nums">
                    +20
                  </dd>
                </div>
              </dl>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => resetActivity()}
                  className="btn btn-paper"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Repetir atividade</span>
                </button>
                <button type="button" onClick={onClose} className="btn btn-pen">
                  <span>Voltar ao percurso</span>
                </button>
              </div>
            </div>
          ) : (
            currentQuestion && (
              <>
                {/* 1 — What to do */}
                <section className="space-y-3">
                  <div className="flex items-start justify-between gap-4 border-l-[5px] border-pen pl-4 py-1">
                    <div className="space-y-0.5">
                      <div className="hand text-2xl font-bold text-pen">
                        O que tens de fazer
                      </div>
                      <p className="text-lg text-ink">
                        {activity.simpleInstruction}
                      </p>
                    </div>
                    {audioEnabled &&
                      listenButton('Ouvir', activity.simpleInstruction)}
                  </div>

                  {level === 1 && (
                    <div className="flex items-start gap-3 bg-pencil/25 border border-dashed border-ink/50 rounded-[3px] px-4 py-3">
                      <Doodle
                        name="spark"
                        className="w-6 h-6 shrink-0 mt-0.5 text-ink"
                      />
                      <p className="text-base text-ink">
                        <span className="hand text-2xl font-bold mr-2">
                          Exemplo:
                        </span>
                        {exampleText}
                      </p>
                    </div>
                  )}
                </section>

                {/* 2 — The challenge */}
                <section className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {currentQuestion.visualEmoji && (
                        <span
                          className="text-4xl select-none leading-none"
                          aria-hidden="true"
                        >
                          {currentQuestion.visualEmoji}
                        </span>
                      )}
                      <div>
                        <div className="label-print">
                          Desafio {currentIndex + 1}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-ink leading-snug mt-0.5">
                          {currentQuestion.prompt}
                        </h3>
                      </div>
                    </div>
                    {audioEnabled &&
                      currentQuestion.audioText &&
                      listenButton('Ouvir desafio', currentQuestion.audioText)}
                  </div>

                  {/* GUIDED READING */}
                  {activity.type === 'guided_reading' &&
                    currentQuestion.readingText && (
                      <div className="space-y-6">
                        <div className="relative bg-sheet border-2 border-ink rounded-[3px] pl-9 sm:pl-12 pr-5 pt-3 pb-4">
                          <span
                            aria-hidden="true"
                            className="absolute left-5 sm:left-8 top-0 bottom-0 w-px bg-mark/60"
                          />
                          <p className="ruled-paper text-xl sm:text-[1.4rem] font-medium text-ink">
                            {renderHighlightedText(
                              currentQuestion.readingText,
                              currentQuestion.keywords
                            )}
                          </p>
                          {audioEnabled && (
                            <div className="pt-3">
                              {listenButton(
                                'Ouvir leitura modelada',
                                currentQuestion.readingText
                              )}
                            </div>
                          )}
                        </div>

                        {currentQuestion.comprehensionCheck && (
                          <div className="space-y-3">
                            <div>
                              <div className="label-print">Pergunta</div>
                              <p className="text-xl font-bold text-ink mt-0.5">
                                {currentQuestion.comprehensionCheck.question}
                              </p>
                            </div>
                            {renderOptions(
                              currentQuestion.comprehensionCheck.options,
                              currentQuestion.comprehensionCheck.answer
                            )}
                          </div>
                        )}
                      </div>
                    )}

                  {/* MULTIPLE CHOICE / TRUE FALSE / FILL BLANK */}
                  {(activity.type === 'multiple_choice' ||
                    activity.type === 'true_false' ||
                    activity.type === 'fill_blank') &&
                    currentQuestion.options &&
                    renderOptions(
                      currentQuestion.options,
                      currentQuestion.correctAnswer
                    )}

                  {/* WORD ORDER */}
                  {activity.type === 'word_order' && (
                    <div className="space-y-5">
                      <div>
                        <div className="label-print mb-1.5">A tua frase</div>
                        <div className="min-h-[4.25rem] px-3 py-3 bg-sheet border-2 border-ink rounded-[3px] flex flex-wrap items-center gap-2">
                          {orderedWords.length === 0 ? (
                            <span className="hand text-2xl text-ink-soft">
                              Clica nas palavras abaixo para construir a frase
                              aqui...
                            </span>
                          ) : (
                            orderedWords.map((word, idx) => (
                              <button
                                key={`${word}-${idx}`}
                                type="button"
                                onClick={() => handleRemoveWord(word, idx)}
                                title="Clica para tirar"
                                className="px-3 py-1.5 rounded-[3px] border-2 border-ink bg-pencil text-[#23201c] font-bold text-lg hover:bg-eraser transition-colors"
                              >
                                {word}
                              </button>
                            ))
                          )}
                        </div>
                      </div>

                      {availableWords.length > 0 && (
                        <div>
                          <div className="label-print mb-1.5">
                            Palavras para usar
                          </div>
                          <div className="flex flex-wrap gap-2.5">
                            {availableWords.map((word, idx) => (
                              <button
                                key={`${word}-${idx}`}
                                type="button"
                                onClick={() => handlePickWord(word, idx)}
                                className="px-3.5 py-2 rounded-[3px] border-2 border-ink bg-sheet text-ink font-bold text-lg shadow-[2px_2px_0_0_var(--color-ink)] hover:bg-pencil/40 transition-colors"
                              >
                                {word}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {!isQuestionSolved &&
                        availableWords.length === 0 &&
                        checkButton('Verificar frase', handleCheckWordOrder)}
                    </div>
                  )}

                  {/* SEQUENCE ORDER */}
                  {activity.type === 'sequence_order' && (
                    <div className="space-y-4">
                      <p className="text-base text-ink-soft">
                        Usa as setas para pôr cada passo no lugar certo.
                      </p>
                      <ol className="space-y-2.5">
                        {sequenceItems.map((item, idx) => (
                          <li
                            key={item}
                            className="flex items-center justify-between gap-3 pl-3 pr-2.5 py-2.5 bg-sheet border-2 border-ink rounded-[3px]"
                          >
                            <div className="flex items-center gap-3.5">
                              <span
                                aria-hidden="true"
                                className="hand w-9 text-center text-4xl font-bold text-pen leading-none shrink-0"
                              >
                                {idx + 1}
                              </span>
                              <span className="text-lg font-semibold text-ink">
                                {item}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0 || isQuestionSolved}
                                onClick={() => moveSequenceItem(idx, -1)}
                                aria-label="Mover para cima"
                                className="p-2 rounded-[3px] border-2 border-ink text-ink bg-paper disabled:opacity-25 enabled:hover:bg-pencil/50"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                disabled={
                                  idx === sequenceItems.length - 1 ||
                                  isQuestionSolved
                                }
                                onClick={() => moveSequenceItem(idx, 1)}
                                aria-label="Mover para baixo"
                                className="p-2 rounded-[3px] border-2 border-ink text-ink bg-paper disabled:opacity-25 enabled:hover:bg-pencil/50"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ol>

                      {!isQuestionSolved &&
                        checkButton('Verificar ordem', handleCheckSequence)}
                    </div>
                  )}

                  {/* MATCHING */}
                  {activity.type === 'matching' && currentQuestion.pairs && (
                    <div className="space-y-4">
                      <p className="text-base text-ink-soft">
                        Clica primeiro num elemento da esquerda e depois no seu
                        par correspondente à direita.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                        <div className="space-y-2.5">
                          <div className="hand text-2xl font-bold text-pen">
                            1.º escolhe aqui
                          </div>
                          {currentQuestion.pairs.map((p) => {
                            const isMatched = !!matchedPairs[p.left];
                            const isSelected = selectedLeft === p.left;
                            return (
                              <button
                                key={p.left}
                                type="button"
                                disabled={isMatched || isQuestionSolved}
                                onClick={() => {
                                  setSelectedLeft(p.left);
                                  setFeedback(null);
                                }}
                                className={`w-full text-left flex items-center justify-between gap-3 px-4 py-3 border-2 rounded-[3px] text-lg font-semibold transition-colors ${
                                  isMatched
                                    ? 'bg-good/15 border-good text-ink'
                                    : isSelected
                                    ? 'bg-pencil border-ink text-[#23201c] shadow-[3px_3px_0_0_var(--color-ink)]'
                                    : 'bg-sheet border-ink text-ink hover:bg-pencil/30'
                                }`}
                              >
                                <span>{p.left}</span>
                                {isMatched && (
                                  <Doodle
                                    name="tick"
                                    className="w-6 h-6 text-good shrink-0"
                                    strokeWidth={5}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        <div className="space-y-2.5">
                          <div className="hand text-2xl font-bold text-pen">
                            2.º encontra o par
                          </div>
                          {shuffledRight.map((rightVal) => {
                            const isMatched =
                              Object.values(matchedPairs).includes(rightVal);
                            return (
                              <button
                                key={rightVal}
                                type="button"
                                disabled={
                                  isMatched || !selectedLeft || isQuestionSolved
                                }
                                onClick={() => handleMatchRight(rightVal)}
                                className={`w-full text-left flex items-center justify-between gap-3 px-4 py-3 border-2 rounded-[3px] text-lg font-semibold transition-colors ${
                                  isMatched
                                    ? 'bg-good/15 border-good text-ink'
                                    : selectedLeft
                                    ? 'bg-sheet border-ink text-ink hover:bg-pencil/40'
                                    : 'bg-transparent border-dashed border-ink/40 text-ink-soft'
                                }`}
                              >
                                <span>{rightVal}</span>
                                {isMatched && (
                                  <Doodle
                                    name="tick"
                                    className="w-6 h-6 text-good shrink-0"
                                    strokeWidth={5}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GUIDED WRITING */}
                  {activity.type === 'guided_writing' && (
                    <div className="space-y-5">
                      {currentQuestion.guidingQuestions && (
                        <div className="border-l-[5px] border-pencil pl-4 py-1 space-y-1.5">
                          <div className="hand text-2xl font-bold text-ink">
                            Perguntas para te ajudar
                          </div>
                          <ul className="text-base text-ink space-y-1">
                            {currentQuestion.guidingQuestions.map((q, i) => (
                              <li key={i} className="flex gap-2">
                                <span aria-hidden="true" className="text-pen font-bold">
                                  ?
                                </span>
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentQuestion.wordBank && (
                        <div className="space-y-2">
                          <div className="label-print">
                            Banco de palavras (clica para inserir)
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {currentQuestion.wordBank.map((w) => (
                              <button
                                key={w}
                                type="button"
                                onClick={() =>
                                  setWrittenText((prev) =>
                                    prev.endsWith(' ') || prev === ''
                                      ? `${prev}${w} `
                                      : `${prev} ${w} `
                                  )
                                }
                                className="px-3 py-1.5 rounded-[3px] border-2 border-ink bg-sheet text-ink text-base font-bold shadow-[2px_2px_0_0_var(--color-ink)] hover:bg-pencil/40 transition-colors"
                              >
                                + {w}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label htmlFor="writing-area" className="label-print block mb-1.5">
                          O teu texto
                        </label>
                        <textarea
                          id="writing-area"
                          rows={4}
                          value={writtenText}
                          onChange={(e) => setWrittenText(e.target.value)}
                          placeholder="Escreve aqui o teu texto..."
                          className="ruled-paper block w-full rounded-[3px] border-2 border-ink bg-sheet text-ink px-4 py-0 text-xl font-medium placeholder:text-ink-soft/70 focus:outline-none focus:border-pen"
                        />
                      </div>

                      {currentQuestion.checklist && (
                        <div className="bg-sheet border border-dashed border-ink/50 rounded-[3px] px-4 py-3 space-y-2">
                          <div className="hand text-2xl font-bold text-ink">
                            Antes de terminar, confirma:
                          </div>
                          {currentQuestion.checklist.map((item, idx) => (
                            <label
                              key={idx}
                              className="flex items-center gap-3 text-base text-ink cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={!!checkedItems[idx]}
                                onChange={(e) =>
                                  setCheckedItems((prev) => ({
                                    ...prev,
                                    [idx]: e.target.checked,
                                  }))
                                }
                                className="w-5 h-5 shrink-0 accent-(--color-good)"
                              />
                              <span>{item}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {!isQuestionSolved &&
                        checkButton('Concluir texto', handleCompleteWriting)}
                    </div>
                  )}
                </section>

                {/* Hint */}
                {showHint && (
                  <div className="flex items-start gap-3 bg-pencil/30 border-2 border-ink rounded-[3px] px-4 py-3 -rotate-[0.4deg]">
                    <Lightbulb className="w-6 h-6 shrink-0 mt-0.5 text-ink" />
                    <p className="text-lg text-ink">
                      <span className="hand text-2xl font-bold mr-2">Pista:</span>
                      {currentQuestion.hint}
                    </p>
                  </div>
                )}

                {/* Immediate, encouraging feedback */}
                {feedback && (
                  <div
                    role="status"
                    className={`flex items-center gap-3 px-4 py-3 border-2 rounded-[3px] ${
                      feedback.type === 'success'
                        ? 'bg-good/15 border-good'
                        : 'bg-eraser/20 border-dashed border-ink/60'
                    }`}
                  >
                    {feedback.type === 'success' ? (
                      <Doodle
                        name="tick"
                        className="w-8 h-8 shrink-0 text-good"
                        strokeWidth={5}
                      />
                    ) : (
                      <RotateCcw className="w-6 h-6 shrink-0 text-ink" />
                    )}
                    <span
                      className={`hand text-3xl font-bold ${
                        feedback.type === 'success' ? 'text-good' : 'text-ink'
                      }`}
                    >
                      {feedback.message}
                    </span>
                  </div>
                )}

                {/* Footer actions */}
                <div className="pt-5 border-t-2 border-dashed border-ink/40 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (!showHint) {
                        setShowHint(true);
                        setHintsUsed((prev) => prev + 1);
                      }
                    }}
                    className="btn btn-paper btn-sm"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Preciso de uma pista</span>
                  </button>

                  {isQuestionSolved && (
                    <button
                      type="button"
                      onClick={handleNextOrFinish}
                      className="btn btn-pen"
                    >
                      {currentIndex + 1 < questions.length
                        ? 'Próximo desafio'
                        : 'Concluir atividade'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};
