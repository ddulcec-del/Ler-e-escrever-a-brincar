import React, { useState } from 'react';
import { BookOpen, Play, Printer } from 'lucide-react';
import {
  COMPETENCIES,
  PEDAGOGICAL_ACTIVITIES,
  RESOURCE_CATEGORIES,
  RESOURCE_LIBRARY,
} from '../data/curriculumData';
import {
  CompetencyId,
  DifficultyLevel,
  PedagogicalActivity,
  ResourceCategory,
} from '../types/pedagogical';

interface ResourceLibraryViewProps {
  onLaunchActivity: (activity: PedagogicalActivity) => void;
}

export const ResourceLibraryView: React.FC<ResourceLibraryViewProps> = ({
  onLaunchActivity,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    ResourceCategory | 'Todas'
  >('Todas');
  const [selectedCompetency, setSelectedCompetency] = useState<
    CompetencyId | 'Todas'
  >('Todas');
  const [selectedComplexity, setSelectedComplexity] = useState<
    DifficultyLevel | 'Todos'
  >('Todos');

  const filteredResources = RESOURCE_LIBRARY.filter((item) => {
    if (selectedCategory !== 'Todas' && item.category !== selectedCategory) {
      return false;
    }
    if (
      selectedCompetency !== 'Todas' &&
      item.competency !== selectedCompetency
    ) {
      return false;
    }
    if (
      selectedComplexity !== 'Todos' &&
      item.complexity !== selectedComplexity
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Biblioteca de recursos
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Materiais pedagógicos organizados por competência, categoria e grau
            de complexidade.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="no-print inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir fichas</span>
        </button>
      </div>

      {/* Filters */}
      <div className="no-print p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Tipo de recurso
          </label>
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value as ResourceCategory | 'Todas'
              )
            }
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="Todas">Todas as categorias (11)</option>
            {RESOURCE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Competência
          </label>
          <select
            value={selectedCompetency}
            onChange={(e) =>
              setSelectedCompetency(e.target.value as CompetencyId | 'Todas')
            }
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="Todas">Todas as competências</option>
            {COMPETENCIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Grau de complexidade
          </label>
          <select
            value={selectedComplexity}
            onChange={(e) =>
              setSelectedComplexity(
                e.target.value === 'Todos'
                  ? 'Todos'
                  : (Number(e.target.value) as DifficultyLevel)
              )
            }
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="Todos">Todos os níveis</option>
            <option value={1}>Nível 1 — Iniciação</option>
            <option value={2}>Nível 2 — Desenvolvimento</option>
            <option value={3}>Nível 3 — Consolidação</option>
          </select>
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredResources.map((res) => {
          const comp = COMPETENCIES.find((c) => c.id === res.competency);
          const linkedAct = PEDAGOGICAL_ACTIVITIES.find(
            (a) => a.id === res.linkedActivityId
          );
          return (
            <div
              key={res.id}
              className="print-break-inside-avoid p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-teal-700 dark:text-teal-400">
                    {res.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{comp?.shortLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{res.ageRange}</span>
                  <span aria-hidden="true">·</span>
                  <span>Nível {res.complexity}</span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {res.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {res.description}
                </p>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  {res.contentPreview.map((line, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              {linkedAct && (
                <div className="no-print pt-2">
                  <button
                    type="button"
                    onClick={() => onLaunchActivity(linkedAct)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Praticar atividade associada</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
