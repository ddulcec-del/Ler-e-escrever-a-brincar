import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Histórias interativas
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1">
          Lê ou ouve cada história com atenção, explora as palavras-chave e
          responde às perguntas de compreensão.
        </p>
      </div>

      {/* Story Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {INTERACTIVE_STORIES.map((story) => {
          const active = selectedStory.id === story.id;
          return (
            <button
              key={story.id}
              type="button"
              onClick={() => handleSelectStory(story)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                active
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-teal-500'
              }`}
            >
              {story.title}
            </button>
          );
        })}
      </div>

      {/* Story Reader & Comprehension */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Story Text */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="capitalize font-medium text-teal-700 dark:text-teal-400">
                  {selectedStory.month}
                </span>
                <span aria-hidden="true">·</span>
                <span>Nível {selectedStory.level}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedStory.readingTime}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {selectedStory.title}
              </h2>
            </div>
            <BookOpen className="w-7 h-7 text-teal-700 dark:text-teal-400 shrink-0" />
          </div>

          <div className="space-y-4">
            {selectedStory.paragraphs.map((para, idx) => {
              const isReading = readingParagraphIdx === idx;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-colors ${
                    isReading
                      ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-700'
                      : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <p className="text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-100">
                    {renderHighlighted(para.text, para.keywords)}
                  </p>
                  {audioEnabled && (
                    <button
                      type="button"
                      onClick={() => handleReadParagraph(idx, para.text)}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-teal-700 dark:text-teal-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      {isReading ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Parar leitura</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Ouvir parágrafo</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Comprehension & Retelling */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Compreensão da história
            </h3>

            {selectedStory.comprehensionQuestions.map((q, qIdx) => {
              const chosen = answers[qIdx];
              const isCorrect = chosen === q.correctAnswer;
              return (
                <div
                  key={qIdx}
                  className="space-y-2.5 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0"
                >
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {qIdx + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const active = chosen === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setAnswers((prev) => ({ ...prev, [qIdx]: opt }))
                          }
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors ${
                            active && isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                              : active && !isCorrect
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-500'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {chosen && (
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          isCorrect ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      />
                      <span
                        className={
                          isCorrect
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : 'text-amber-700 dark:text-amber-300'
                        }
                      >
                        {isCorrect
                          ? POSITIVE_FEEDBACK[0]
                          : TRY_AGAIN_FEEDBACK[0]}
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setShowHints((prev) => ({
                        ...prev,
                        [qIdx]: !prev[qIdx],
                      }))
                    }
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Ver pista</span>
                  </button>

                  {showHints[qIdx] && (
                    <p className="text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg">
                      {q.hint}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Guided Retelling */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Reconto orientado
              </h3>
            </div>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
              {selectedStory.retellingPrompts.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
            <textarea
              rows={3}
              value={retellNotes}
              onChange={(e) => setRetellNotes(e.target.value)}
              placeholder="Conta a história pelas tuas palavras ou regista ideias para o reconto oral..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
