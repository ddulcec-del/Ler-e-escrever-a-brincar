import React, { useState } from 'react';
import {
  HelpCircle,
  Lightbulb,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  INTERACTIVE_STORIES,
  POSITIVE_FEEDBACK,
  TRY_AGAIN_FEEDBACK,
} from '../data/curriculumData';
import {
  ActivityResult,
  InteractiveStory,
  StudentProfile,
} from '../types/pedagogical';
import { speakPt, stopSpeaking } from '../utils/speech';
import { monthName } from '../utils/months';
import { STORY_RESULT_PREFIX, formatDate } from '../utils/progress';
import { AnswerOption, StepBoxes } from './AnswerOption';
import { ProfilePicker } from './ProfilePicker';
import { Doodle } from './Sketch';

interface InteractiveStoriesViewProps {
  audioEnabled: boolean;
  highlightKeywords: boolean;
  student?: StudentProfile;
  students: StudentProfile[];
  results: ActivityResult[];
  onPickStudent: (id: string) => void;
  /** Saves the handed-in story; rejects if it couldn't be saved. */
  onSubmit: (result: Omit<ActivityResult, 'id' | 'date'>) => Promise<void>;
}

export const InteractiveStoriesView: React.FC<InteractiveStoriesViewProps> = ({
  audioEnabled,
  highlightKeywords,
  student,
  students,
  results,
  onPickStudent,
  onSubmit,
}) => {
  const [selectedStory, setSelectedStory] = useState<InteractiveStory>(
    INTERACTIVE_STORIES[0]
  );
  const [readingParagraphIdx, setReadingParagraphIdx] = useState<number | null>(
    null
  );
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});
  const [retellNotes, setRetellNotes] = useState('');
  // What the teacher gets with the story: how many tries and hints it took.
  const [tries, setTries] = useState(0);
  const [hintsOpened, setHintsOpened] = useState<Set<number>>(new Set());
  const [submitState, setSubmitState] = useState<
    'idle' | 'sending' | 'sent' | 'error'
  >('idle');

  const handleSelectStory = (story: InteractiveStory) => {
    stopSpeaking();
    setReadingParagraphIdx(null);
    setSelectedStory(story);
    setAnswers({});
    setShowHints({});
    setRetellNotes('');
    setTries(0);
    setHintsOpened(new Set());
    setSubmitState('idle');
  };

  const handleReadParagraph = (idx: number, text: string) => {
    if (!audioEnabled) return;
    if (readingParagraphIdx === idx) {
      stopSpeaking();
      setReadingParagraphIdx(null);
      return;
    }
    setReadingParagraphIdx(idx);
    speakPt(text, {
      onEnd: () => setReadingParagraphIdx(null),
    });
  };

  const renderHighlighted = (text: string, keywords: string[]) => {
    if (!highlightKeywords || keywords.length === 0) return text;
    const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
    return text.split(regex).map((part, idx) => {
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

  const questions = selectedStory.comprehensionQuestions;
  const isRight = (i: number) => answers[i] === questions[i].correctAnswer;
  const rightCount = questions.filter((_, i) => isRight(i)).length;
  const allRight = rightCount === questions.length;
  const storyResultId = `${STORY_RESULT_PREFIX}${selectedStory.id}`;
  const lastHandIn = results.find((r) => r.activityId === storyResultId);

  const handleSubmit = async () => {
    if (!student || !allRight) return;
    setSubmitState('sending');
    const hints = hintsOpened.size;
    try {
      await onSubmit({
        studentId: student.id,
        activityId: storyResultId,
        activityTitle: `História: ${selectedStory.title}`,
        month: selectedStory.month,
        competency: 'compreensao_textos',
        difficultyLevel: selectedStory.level,
        attempts: Math.max(tries, questions.length),
        correctCount: questions.length,
        totalCount: questions.length,
        hintsUsed: hints,
        autonomyDegree:
          hints === 0 ? 'Autónomo' : hints <= 2 ? 'Com apoio parcial' : 'Com apoio total',
        notes: retellNotes.trim() || undefined,
      });
      setSubmitState('sent');
      if (audioEnabled) speakPt('Muito bem! Entregaste a tua história.');
    } catch {
      setSubmitState('error');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">
          Histórias interativas
        </h1>
        <p className="text-lg text-ink-soft mt-3">
          Lê ou ouve cada história com atenção, explora as palavras-chave e
          responde às perguntas de compreensão.
        </p>
      </div>

      {/* 1 — Choose a story */}
      <section className="space-y-3">
        <div className="hand text-3xl font-bold text-ink">
          Escolhe uma história
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INTERACTIVE_STORIES.map((story) => {
            const active = selectedStory.id === story.id;
            return (
              <button
                key={story.id}
                type="button"
                onClick={() => handleSelectStory(story)}
                aria-pressed={active}
                className={`text-left flex items-center gap-3.5 px-4 py-3 border-2 border-ink rounded-[3px] transition-colors ${
                  active
                    ? 'bg-pencil text-[#23201c] shadow-[3px_3px_0_0_var(--color-ink)]'
                    : 'bg-sheet text-ink hover:bg-pencil/30'
                }`}
              >
                <Doodle name="book" className="w-10 h-10 shrink-0" />
                <span>
                  <span className="font-display block text-lg font-bold leading-snug">
                    {story.title}
                  </span>
                  <span className="block text-sm opacity-75">
                    {monthName(story.month)} · Nível {story.level} · {story.readingTime}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2 — Read */}
      <section className="relative bg-sheet border-2 border-ink rounded-[3px] shadow-[5px_5px_0_0_color-mix(in_srgb,var(--color-ink)_18%,transparent)]">
        <span
          aria-hidden="true"
          className="absolute left-7 sm:left-12 top-0 bottom-0 w-px bg-mark/60"
        />
        <div className="pl-10 sm:pl-16 pr-5 sm:pr-8 pt-6 pb-7">
          <div className="border-b-2 border-rule pb-4 mb-2">
            <div className="label-print">
              {monthName(selectedStory.month)} · Nível {selectedStory.level} ·{' '}
              {selectedStory.readingTime} de leitura
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1.5 leading-tight">
              {selectedStory.title}
            </h2>
          </div>

          <div>
            {selectedStory.paragraphs.map((para, idx) => {
              const isReading = readingParagraphIdx === idx;
              return (
                <div
                  key={idx}
                  className={`relative py-4 border-b border-dashed border-ink/25 last:border-b-0 last:pb-0 transition-colors ${
                    isReading ? 'bg-pencil/25 -mx-3 px-3' : ''
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="hand absolute -left-8 sm:-left-12 top-4 w-7 sm:w-9 text-center text-3xl sm:text-4xl font-bold text-pen leading-none"
                  >
                    {idx + 1}
                  </span>
                  <p className="text-xl sm:text-[1.35rem] leading-[1.9] font-medium text-ink">
                    {renderHighlighted(para.text, para.keywords)}
                  </p>
                  {audioEnabled && (
                    <button
                      type="button"
                      onClick={() => handleReadParagraph(idx, para.text)}
                      className={`btn-listen mt-3 ${isReading ? 'is-playing' : ''}`}
                    >
                      {isReading ? (
                        <>
                          <VolumeX />
                          <span>Parar leitura</span>
                        </>
                      ) : (
                        <>
                          <Volume2 />
                          <span>Ouvir parágrafo {idx + 1}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3 — Answer */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b-[3px] border-pen pb-2">
          <div>
            <div className="hand text-3xl font-bold text-ink">
              Perguntas sobre a história
            </div>
            <p className="text-base text-ink-soft">
              Podes voltar a ler o texto sempre que precisares.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="label-print tabular-nums">
              {rightCount} de {questions.length} certas
            </span>
            <StepBoxes total={questions.length} isDone={isRight} />
          </div>
        </div>

        {questions.map((q, qIdx) => {
          const chosen = answers[qIdx];
          const solved = isRight(qIdx);
          return (
            <div key={qIdx} className="space-y-3">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="hand text-4xl font-bold text-pen leading-none w-8 shrink-0"
                >
                  {qIdx + 1}.
                </span>
                <h3 className="text-xl font-bold text-ink leading-snug pt-0.5">
                  {q.question}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:pl-11">
                {q.options.map((opt, i) => (
                  <AnswerOption
                    key={opt}
                    index={i}
                    label={opt}
                    state={
                      chosen !== opt
                        ? 'idle'
                        : opt === q.correctAnswer
                        ? 'right'
                        : 'wrong'
                    }
                    faded={solved && opt !== q.correctAnswer}
                    onClick={() => {
                      if (solved) return;
                      setTries((t) => t + 1);
                      setAnswers((prev) => ({ ...prev, [qIdx]: opt }));
                    }}
                  />
                ))}
              </div>

              <div className="sm:pl-11 space-y-3">
                {chosen && (
                  <div
                    role="status"
                    className={`flex items-center gap-3 px-4 py-2.5 border-2 rounded-[3px] ${
                      solved
                        ? 'bg-good/15 border-good'
                        : 'bg-eraser/20 border-dashed border-ink/60'
                    }`}
                  >
                    {solved ? (
                      <Doodle
                        name="tick"
                        className="w-7 h-7 shrink-0 text-good"
                        strokeWidth={5}
                      />
                    ) : (
                      <RotateCcw className="w-5 h-5 shrink-0 text-ink" />
                    )}
                    <span
                      className={`hand text-2xl font-bold ${
                        solved ? 'text-good' : 'text-ink'
                      }`}
                    >
                      {solved ? POSITIVE_FEEDBACK[0] : TRY_AGAIN_FEEDBACK[0]}
                    </span>
                  </div>
                )}

                {!solved && (
                  <button
                    type="button"
                    onClick={() => {
                      setHintsOpened((prev) => new Set(prev).add(qIdx));
                      setShowHints((prev) => ({
                        ...prev,
                        [qIdx]: !prev[qIdx],
                      }));
                    }}
                    aria-expanded={!!showHints[qIdx]}
                    className="btn btn-paper btn-sm"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>
                      {showHints[qIdx] ? 'Esconder pista' : 'Preciso de uma pista'}
                    </span>
                  </button>
                )}

                {showHints[qIdx] && !solved && (
                  <div className="flex items-start gap-3 bg-pencil/30 border-2 border-ink rounded-[3px] px-4 py-3">
                    <Lightbulb className="w-6 h-6 shrink-0 mt-0.5 text-ink" />
                    <p className="text-lg text-ink">
                      <span className="hand text-2xl font-bold mr-2">Pista:</span>
                      {q.hint}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* 4 — Retell */}
      <section className="space-y-4">
        <div className="border-b-[3px] border-pencil pb-2">
          <div className="hand text-3xl font-bold text-ink">
            Agora conta tu a história
          </div>
          <p className="text-base text-ink-soft">Reconto orientado</p>
        </div>
        <ul className="text-lg text-ink space-y-1.5">
          {selectedStory.retellingPrompts.map((p, i) => (
            <li key={i} className="flex gap-3">
              <Doodle
                name="arrow"
                className="w-6 h-6 shrink-0 mt-0.5 text-pen"
                strokeWidth={3}
              />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <div>
          <label htmlFor="retell-notes" className="label-print block mb-1.5">
            As tuas ideias
          </label>
          <textarea
            id="retell-notes"
            rows={4}
            value={retellNotes}
            onChange={(e) => setRetellNotes(e.target.value)}
            placeholder="Conta a história pelas tuas palavras ou regista ideias para o reconto oral..."
            className="ruled-paper block w-full rounded-[3px] border-2 border-ink bg-sheet text-ink px-4 py-0 text-xl font-medium placeholder:text-ink-soft/70 focus:outline-none focus:border-pen"
          />
        </div>
      </section>

      {/* 5 — Hand in to the teacher */}
      <section className="sketch p-5 sm:p-6 space-y-4">
        <div className="hand text-3xl font-bold text-ink">Entregar à professora</div>

        {!student ? (
          <ProfilePicker
            students={students}
            onPick={onPickStudent}
            title="Quem leu esta história?"
          />
        ) : submitState === 'sent' ? (
          <div role="status" className="flex items-center gap-3">
            <Doodle name="tick" className="w-9 h-9 shrink-0 text-good" strokeWidth={5} />
            <p className="text-lg font-semibold text-ink">
              Entregue, {student.name}! A professora já pode ver as tuas
              respostas e o teu reconto. Ganhaste 20 pontos.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-base text-ink-soft">
              {allRight
                ? 'Respondeste a todas as perguntas. Escreve o teu reconto (se quiseres) e entrega.'
                : `Responde certo às ${questions.length} perguntas para poderes entregar (${rightCount} de ${questions.length}).`}
              {lastHandIn && ` Já entregaste esta história a ${formatDate(lastHandIn.date)}.`}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!allRight || submitState === 'sending'}
                className="btn btn-pen"
              >
                {submitState === 'sending' ? 'A entregar…' : 'Entregar história'}
              </button>
              {submitState === 'error' && (
                <span role="alert" className="text-sm font-semibold text-mark">
                  Não foi possível entregar. Tenta outra vez.
                </span>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
