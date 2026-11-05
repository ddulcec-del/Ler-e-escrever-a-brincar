import React, { useState } from 'react';
import {
  Award,
  BookMarked,
  CheckCircle2,
  Compass,
  Plus,
  Printer,
  Star,
} from 'lucide-react';
import {
  COMPETENCIES,
  MEDALS_CATALOG,
  MONTHLY_MODULES,
} from '../data/curriculumData';
import {
  ActivityResult,
  GlossaryEntry,
  StudentProfile,
} from '../types/pedagogical';

interface StudentProgressViewProps {
  student: StudentProfile;
  results: ActivityResult[];
  onAddGlossaryEntry: (entry: Omit<GlossaryEntry, 'id' | 'dateAdded'>) => void;
}

export const StudentProgressView: React.FC<StudentProgressViewProps> = ({
  student,
  results,
  onAddGlossaryEntry,
}) => {
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newExample, setNewExample] = useState('');

  const studentLevel = Math.floor(student.points / 60) + 1;
  const levelProgress = student.points % 60;

  const monthlyCounts = MONTHLY_MODULES.map((m) => ({
    month: m.name,
    count: results.filter((r) => r.month === m.id).length,
  }));
  const maxMonthCount = Math.max(1, ...monthlyCounts.map((m) => m.count));

  const handleGlossarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) return;
    onAddGlossaryEntry({
      word: newWord.trim(),
      meaning: newMeaning.trim(),
      example: newExample.trim(),
    });
    setNewWord('');
    setNewMeaning('');
    setNewExample('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            O meu progresso — {student.name}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Acompanha as tuas conquistas, medalhas e evolução ao longo dos meses.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="no-print inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Certificado</span>
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Atividades realizadas
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-1">
            {results.length}
          </div>
          <div className="text-xs text-teal-700 dark:text-teal-400 mt-1">
            Percurso individual
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Pontos de esforço
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-1">
            {student.points}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Nível {studentLevel} ({levelProgress}/60 pts)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Medalhas obtidas
          </div>
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 tabular-nums mt-1">
            {student.earnedMedals.length} / {MEDALS_CATALOG.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Conquistas desbloqueadas
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Glossário pessoal
          </div>
          <div className="text-3xl font-bold text-sky-700 dark:text-sky-400 tabular-nums mt-1">
            {student.personalGlossary.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Palavras guardadas
          </div>
        </div>
      </div>

      {/* Monthly Evolution Chart & Competencies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Evolution */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Evolução ao longo dos meses
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Número de atividades concluídas em cada módulo mensal
            </p>
          </div>

          <div className="pt-4">
            <div className="grid grid-cols-6 gap-3 items-end h-44 border-b border-slate-200 dark:border-slate-800 pb-2">
              {monthlyCounts.map((item) => {
                const heightPct = Math.max(
                  10,
                  Math.round((item.count / maxMonthCount) * 100)
                );
                return (
                  <div
                    key={item.month}
                    className="flex flex-col items-center justify-end h-full gap-2"
                  >
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                      {item.count}
                    </span>
                    <div
                      style={{ height: `${item.count === 0 ? 8 : heightPct}%` }}
                      className={`w-full max-w-10 rounded-t-lg transition-all ${
                        item.count > 0
                          ? 'bg-teal-600 dark:bg-teal-500'
                          : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-6 gap-3 pt-2 text-center">
              {monthlyCounts.map((item) => (
                <span
                  key={item.month}
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate"
                >
                  {item.month.slice(0, 3)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Competencies Worked */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Competências trabalhadas
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Progresso nas áreas prioritárias do teu percurso
            </p>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {COMPETENCIES.filter((c) =>
              student.priorityCompetencies.includes(c.id)
            ).map((comp) => {
              const compResults = results.filter(
                (r) => r.competency === comp.id
              );
              const pct = Math.min(100, compResults.length * 25);
              return (
                <div key={comp.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {comp.label}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                      {compResults.length} atividade(s)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${Math.max(6, pct)}%` }}
                      className="h-full rounded-full bg-teal-600 dark:bg-teal-500 transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Medals & Badges */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Medalhas e distintivos
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Valorizamos o teu esforço, persistência e autonomia!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MEDALS_CATALOG.map((medal) => {
            const earned = student.earnedMedals.includes(medal.id);
            return (
              <div
                key={medal.id}
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition-colors ${
                  earned
                    ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-65'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    earned
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {medal.title}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {medal.description}
                  </p>
                  <div className="text-[11px] font-medium mt-1.5 text-amber-800 dark:text-amber-300">
                    {earned ? 'Conquistada' : 'Próximo desafio'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Glossary (Maio - Atividade 47) */}
      <div className="no-print p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex items-center gap-2.5">
          <BookMarked className="w-5 h-5 text-teal-700 dark:text-teal-400" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              O meu glossário pessoal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Guarda palavras novas que descobriste nas leituras e atividades
            </p>
          </div>
        </div>

        <form
          onSubmit={handleGlossarySubmit}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Palavra nova (ex: explorar)"
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="text"
            value={newMeaning}
            onChange={(e) => setNewMeaning(e.target.value)}
            placeholder="O que significa?"
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newExample}
              onChange={(e) => setNewExample(e.target.value)}
              placeholder="Exemplo numa frase"
              className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold shrink-0 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          </div>
        </form>

        {student.personalGlossary.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {student.personalGlossary.map((entry) => (
              <div
                key={entry.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700"
              >
                <div className="font-bold text-teal-800 dark:text-teal-300 text-sm">
                  {entry.word}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                  {entry.meaning}
                </p>
                {entry.example && (
                  <p className="text-xs italic text-slate-500 dark:text-slate-400 mt-1">
                    “{entry.example}”
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Printable Digital Certificate */}
      <div className="print-break-inside-avoid p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-teal-600/40 dark:border-teal-500/40 text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-400">
          <Compass className="w-4 h-4" />
          <span>Agrupamento de Escolas de Paço de Arcos · Educação Especial</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Certificado Digital de Progresso
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Certifica-se que <strong className="text-slate-900 dark:text-white">{student.name}</strong> ({student.schoolYear}) participou com empenho, persistência e autonomia nas atividades da plataforma{' '}
          <strong>Ler e Escrever a Brincar</strong>, tendo concluído{' '}
          <strong>{results.length}</strong> atividade(s) e conquistado{' '}
          <strong>{student.earnedMedals.length}</strong> medalha(s).
        </p>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              Professora Dulce Lopes
            </div>
            <div>Educação Especial — 1.º Ciclo</div>
          </div>
          <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Nível {studentLevel} alcançado</span>
          </div>
        </div>
      </div>
    </div>
  );
};
