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
import { InteractiveStory } from '../types/pedagogical';
import { speakPt, stopSpeaking } from '../utils/speech';
import { monthName } from '../utils/months';
import { AnswerOption, StepBoxes } from './AnswerOption';
import { Doodle } from './Sketch';

interface InteractiveStoriesViewProps {
  audioEnabled: boolean;
  highlightKeywords: boolean;
}

export const InteractiveStoriesView: React.FC<InteractiveStoriesViewProps> = ({
  audioEnabled,
  highlightKeywords,
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

  const handleSelectStory = (story: InteractiveStory) => {
    stopSpeaking();
    setReadingParagraphIdx(null);
    setSelectedStory(story);
    setAnswers({});
    setShowHints({});
    setRetellNotes('');
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
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [qIdx]: opt }))
                    }
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
                    onClick={() =>
                      setShowHints((prev) => ({
                        ...prev,
                        [qIdx]: !prev[qIdx],
                      }))
                    }
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
    </div>
  );
};
