import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Award,
  CheckCircle2,
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopSpeaking();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      stopSpeaking();
    };
  }, [onClose]);

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
          className="bg-amber-200/80 dark:bg-amber-700/60 text-slate-900 dark:text-amber-50 px-1 rounded font-semibold"
        >
          {part}
        </mark>
      ) : (
        <span key={idx}>{part}</span>
      );
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-modal-title"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full shadow-xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/80">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="capitalize font-medium text-teal-700 dark:text-teal-400">
                {activity.month}
              </span>
              <span aria-hidden="true">·</span>
              <span>{competencyInfo?.label}</span>
              {activity.number && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Atividade {activity.number}</span>
                </>
              )}
            </div>
            <h2
              id="activity-modal-title"
              className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5"
            >
              {activity.gameTitle ? `${activity.gameTitle} — ` : ''}
              {activity.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            aria-label="Fechar atividade"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Difficulty Selector & Pedagogical Context */}
        <div className="px-6 py-3 bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {([1, 2, 3] as DifficultyLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => resetActivity(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  level === lvl
                    ? 'bg-teal-700 text-white dark:bg-teal-600'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {LEVEL_LABELS[lvl]}
              </button>
            ))}
          </div>

          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 tabular-nums">
            Passo {Math.min(currentIndex + 1, questions.length)} de{' '}
            {questions.length}
          </span>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {isFinished ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto">
                <Award className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Parabéns! Concluíste a atividade!
                </h3>
                <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Cada vez estás mais autónomo(a)! O teu progresso foi guardado
                  no teu percurso individual.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Desafios
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-0.5">
                    {questions.length}/{questions.length}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Pistas usadas
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-0.5">
                    {hintsUsed}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Pontos ganhos
                  </div>
                  <div className="text-lg font-bold text-teal-700 dark:text-teal-400 tabular-nums mt-0.5">
                    +20
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => resetActivity()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Repetir atividade</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold transition-colors"
                >
                  <span>Voltar ao percurso</span>
                </button>
              </div>
            </div>
          ) : (
            currentQuestion && (
              <>
                {/* Instruction & Demonstration Example */}
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/70">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-sky-900 dark:text-sky-300">
                        Instrução
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-200">
                        {activity.simpleInstruction}
                      </p>
                    </div>
                    {audioEnabled && (
                      <button
                        type="button"
                        onClick={() => handleSpeak(activity.simpleInstruction)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-700 text-sky-800 dark:text-sky-200 text-xs font-medium hover:bg-sky-100 dark:hover:bg-slate-700 shrink-0 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Ouvir</span>
                      </button>
                    )}
                  </div>

                  {level === 1 && (
                    <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-800 dark:text-slate-100">
                        Exemplo resolvido:{' '}
                      </strong>
                      {activity.demonstrationExample}
                    </div>
                  )}
                </div>

                {/* Question Prompt */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {currentQuestion.visualEmoji && (
                        <span
                          className="text-3xl select-none"
                          aria-hidden="true"
                        >
                          {currentQuestion.visualEmoji}
                        </span>
                      )}
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {currentQuestion.prompt}
                      </h3>
                    </div>
                    {audioEnabled && currentQuestion.audioText && (
                      <button
                        type="button"
                        onClick={() =>
                          handleSpeak(currentQuestion.audioText!)
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-semibold hover:bg-teal-100 dark:hover:bg-teal-900/60 shrink-0 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Ouvir desafio</span>
                      </button>
                    )}
                  </div>

                  {/* EXERCISE TYPE: GUIDED READING */}
                  {activity.type === 'guided_reading' &&
                    currentQuestion.readingText && (
                      <div className="space-y-4">
                        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                          <p className="text-lg leading-relaxed text-slate-900 dark:text-slate-100">
                            {renderHighlightedText(
                              currentQuestion.readingText,
                              currentQuestion.keywords
                            )}
                          </p>
                          {audioEnabled && (
                            <button
                              type="button"
                              onClick={() =>
                                handleSpeak(currentQuestion.readingText!)
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                            >
                              <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                              <span>Ouvir leitura modelada</span>
                            </button>
                          )}
                        </div>

                        {currentQuestion.comprehensionCheck && (
                          <div className="space-y-2.5">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              {currentQuestion.comprehensionCheck.question}
                            </p>
                            <div className="grid grid-cols-1 gap-2.5">
                              {currentQuestion.comprehensionCheck.options.map(
                                (opt) => {
                                  const isSelected = selectedOption === opt;
                                  const isCorrect =
                                    opt ===
                                    currentQuestion.comprehensionCheck?.answer;
                                  return (
                                    <button
                                      key={opt}
                                      type="button"
                                      onClick={() =>
                                        handleCheckMultipleChoice(opt)
                                      }
                                      className={`w-full text-left px-4 py-3 rounded-xl border font-medium transition-colors ${
                                        isSelected && isCorrect
                                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                                          : isSelected && !isCorrect
                                          ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 text-amber-900 dark:text-amber-200'
                                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-teal-500'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {/* EXERCISE TYPE: MULTIPLE CHOICE / TRUE FALSE / FILL BLANK */}
                  {(activity.type === 'multiple_choice' ||
                    activity.type === 'true_false' ||
                    activity.type === 'fill_blank') &&
                    currentQuestion.options && (
                      <div className="grid grid-cols-1 gap-2.5 pt-1">
                        {currentQuestion.options.map((opt) => {
                          const isSelected = selectedOption === opt;
                          const isCorrect =
                            opt === currentQuestion.correctAnswer;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleCheckMultipleChoice(opt)}
                              className={`w-full text-left px-4 py-3.5 rounded-xl border font-medium transition-colors ${
                                isSelected && isCorrect
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                                  : isSelected && !isCorrect
                                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 text-amber-900 dark:text-amber-200'
                                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-teal-500'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                  {/* EXERCISE TYPE: WORD ORDER */}
                  {activity.type === 'word_order' && (
                    <div className="space-y-4">
                      <div className="min-h-16 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2">
                        {orderedWords.length === 0 ? (
                          <span className="text-sm text-slate-400 dark:text-slate-500">
                            Clica nas palavras abaixo para construir a frase
                            aqui...
                          </span>
                        ) : (
                          orderedWords.map((word, idx) => (
                            <button
                              key={`${word}-${idx}`}
                              type="button"
                              onClick={() => handleRemoveWord(word, idx)}
                              className="px-3 py-1.5 rounded-lg bg-teal-700 text-white font-medium text-sm hover:bg-teal-800 transition-colors"
                            >
                              {word}
                            </button>
                          ))
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {availableWords.map((word, idx) => (
                          <button
                            key={`${word}-${idx}`}
                            type="button"
                            onClick={() => handlePickWord(word, idx)}
                            className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 font-medium text-sm hover:border-teal-500 transition-colors"
                          >
                            {word}
                          </button>
                        ))}
                      </div>

                      {!isQuestionSolved && availableWords.length === 0 && (
                        <button
                          type="button"
                          onClick={handleCheckWordOrder}
                          className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors"
                        >
                          Verificar frase
                        </button>
                      )}
                    </div>
                  )}

                  {/* EXERCISE TYPE: SEQUENCE ORDER */}
                  {activity.type === 'sequence_order' && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        {sequenceItems.map((item, idx) => (
                          <div
                            key={item}
                            className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center tabular-nums">
                                {idx + 1}
                              </span>
                              <span className="font-medium text-slate-800 dark:text-slate-100">
                                {item}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0 || isQuestionSolved}
                                onClick={() => moveSequenceItem(idx, -1)}
                                aria-label="Mover para cima"
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700"
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
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {!isQuestionSolved && (
                        <button
                          type="button"
                          onClick={handleCheckSequence}
                          className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors"
                        >
                          Verificar ordem
                        </button>
                      )}
                    </div>
                  )}

                  {/* EXERCISE TYPE: MATCHING */}
                  {activity.type === 'matching' && currentQuestion.pairs && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Clica primeiro num elemento da esquerda e depois no seu
                        par correspondente à direita:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
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
                                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                                  isMatched
                                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                                    : isSelected
                                    ? 'bg-teal-700 text-white border-teal-700'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-teal-500'
                                }`}
                              >
                                {p.left}
                              </button>
                            );
                          })}
                        </div>

                        <div className="space-y-2">
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
                                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                                  isMatched
                                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                                    : selectedLeft
                                    ? 'bg-white dark:bg-slate-800 border-teal-400 text-slate-800 dark:text-slate-100 hover:bg-teal-50 dark:hover:bg-teal-950/40'
                                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                {rightVal}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* EXERCISE TYPE: GUIDED WRITING */}
                  {activity.type === 'guided_writing' && (
                    <div className="space-y-4">
                      {currentQuestion.guidingQuestions && (
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1.5">
                          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Perguntas orientadoras:
                          </div>
                          <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
                            {currentQuestion.guidingQuestions.map((q, i) => (
                              <li key={i}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentQuestion.wordBank && (
                        <div className="space-y-1.5">
                          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Banco de palavras (clica para inserir):
                          </div>
                          <div className="flex flex-wrap gap-1.5">
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
                                className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-medium hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors"
                              >
                                + {w}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <textarea
                        rows={4}
                        value={writtenText}
                        onChange={(e) => setWrittenText(e.target.value)}
                        placeholder="Escreve aqui o teu texto..."
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-3.5 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />

                      {currentQuestion.checklist && (
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Lista de verificação da escrita:
                          </div>
                          {currentQuestion.checklist.map((item, idx) => (
                            <label
                              key={idx}
                              className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
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
                                className="rounded text-teal-600 focus:ring-teal-500"
                              />
                              <span>{item}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {!isQuestionSolved && (
                        <button
                          type="button"
                          onClick={handleCompleteWriting}
                          className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors"
                        >
                          Concluir texto
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Hint Box */}
                {showHint && (
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-2.5 text-sm text-amber-900 dark:text-amber-200">
                    <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <span>{currentQuestion.hint}</span>
                  </div>
                )}

                {/* Immediate Encouraging Feedback */}
                {feedback && (
                  <div
                    role="status"
                    className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                      feedback.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 font-medium text-sm">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span>{feedback.message}</span>
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!showHint) {
                        setShowHint(true);
                        setHintsUsed((prev) => prev + 1);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Preciso de uma pista</span>
                  </button>

                  {isQuestionSolved && (
                    <button
                      type="button"
                      onClick={handleNextOrFinish}
                      className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors"
                    >
                      {currentIndex + 1 < questions.length
                        ? 'Próximo desafio'
                        : 'Concluir atividade'}
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
