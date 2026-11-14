import React, { useState } from 'react';
import { Play, Printer } from 'lucide-react';
import {
  COMPETENCIES,
  RESOURCE_CATEGORIES,
  RESOURCE_LIBRARY,
} from '../data/curriculumData';
import {
  CompetencyId,
  DifficultyLevel,
  PedagogicalActivity,
  ResourceCategory,
} from '../types/pedagogical';

// Each kind of resource keeps one colour, like the tabs of a card index.
const TAB_COLORS = ['#f6c445', '#f0958a', '#c5cdff', '#bfe3cd'];
const categoryColor = (cat: ResourceCategory) =>
  TAB_COLORS[RESOURCE_CATEGORIES.indexOf(cat) % TAB_COLORS.length];

interface ResourceLibraryViewProps {
  activities: PedagogicalActivity[];
  onLaunchActivity: (activity: PedagogicalActivity) => void;
}

export const ResourceLibraryView: React.FC<ResourceLibraryViewProps> = ({
  activities,
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

  const hasFilters =
    selectedCategory !== 'Todas' ||
    selectedCompetency !== 'Todas' ||
    selectedComplexity !== 'Todos';

  const clearFilters = () => {
    setSelectedCategory('Todas');
    setSelectedCompetency('Todas');
    setSelectedComplexity('Todos');
  };

  const chipClass = (active: boolean) =>
    `px-2.5 py-1 border-[1.6px] border-ink rounded-[2px] text-sm font-semibold whitespace-nowrap transition-colors ${
      active
        ? 'bg-ink text-paper'
        : 'bg-sheet text-ink hover:bg-pencil/40'
    }`;

  const selectClass =
    'h-9 min-w-0 flex-1 rounded-[2px] border-[1.6px] border-ink bg-sheet text-ink px-2 text-sm font-semibold';

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">
            Biblioteca de recursos
          </h1>
          <p className="text-lg text-ink-soft mt-3 max-w-2xl">
            Materiais pedagógicos organizados por competência, categoria e grau
            de complexidade.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="no-print btn btn-paper btn-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir fichas</span>
        </button>
      </div>

      {/* Filters */}
      <div className="no-print space-y-3 border-y-2 border-dashed border-ink/40 py-4">
        <div className="space-y-1.5">
          <div className="hand text-2xl font-bold text-ink">
            Que tipo de ficha procuras?
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategory('Todas')}
              aria-pressed={selectedCategory === 'Todas'}
              className={chipClass(selectedCategory === 'Todas')}
            >
              Todas
            </button>
            {RESOURCE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={chipClass(selectedCategory === cat)}
              >
                <span
                  aria-hidden="true"
                  className="inline-block w-2.5 h-2.5 mr-1.5 border border-ink align-[-1px]"
                  style={{ background: categoryColor(cat) }}
                />
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2 min-w-0 max-w-full">
            <label htmlFor="lib-competency" className="label-print">
              Competência
            </label>
            <select
              id="lib-competency"
              value={selectedCompetency}
              onChange={(e) =>
                setSelectedCompetency(e.target.value as CompetencyId | 'Todas')
              }
              className={selectClass}
            >
              <option value="Todas">Todas as competências</option>
              {COMPETENCIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="lib-level" className="label-print">
              Nível
            </label>
            <select
              id="lib-level"
              value={selectedComplexity}
              onChange={(e) =>
                setSelectedComplexity(
                  e.target.value === 'Todos'
                    ? 'Todos'
                    : (Number(e.target.value) as DifficultyLevel)
                )
              }
              className={selectClass}
            >
              <option value="Todos">Todos os níveis</option>
              <option value={1}>Nível 1 — Iniciação</option>
              <option value={2}>Nível 2 — Desenvolvimento</option>
              <option value={3}>Nível 3 — Consolidação</option>
            </select>
          </div>

          <span className="label-print tabular-nums ml-auto" role="status">
            {filteredResources.length}{' '}
            {filteredResources.length === 1 ? 'ficha' : 'fichas'}
          </span>
        </div>
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-10 space-y-4">
          <p className="hand text-4xl font-bold text-ink">
            Não há fichas com estes filtros.
          </p>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="btn btn-pencil">
              Ver todas as fichas
            </button>
          )}
        </div>
      )}

      {/* Resource cards, drawn as index cards with a coloured tab */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-7 gap-y-9">
        {filteredResources.map((res) => {
          const comp = COMPETENCIES.find((c) => c.id === res.competency);
          // Missing when the teacher has hidden or deleted that activity.
          const linkedAct = activities.find(
            (a) => a.id === res.linkedActivityId
          );
          return (
            <article
              key={res.id}
              className="print-break-inside-avoid relative flex flex-col bg-sheet border-2 border-ink rounded-[3px] shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-ink)_18%,transparent)]"
            >
              <div
                className="hand absolute -top-[1.15rem] left-4 px-3 pt-0.5 text-2xl font-bold text-[#23201c] border-2 border-ink border-b-0 rounded-t-[3px] leading-tight"
                style={{ background: categoryColor(res.category) }}
              >
                {res.category}
              </div>

              <div className="px-5 sm:px-6 pt-7 pb-4 space-y-2">
                <h2 className="text-2xl font-extrabold text-ink leading-tight">
                  {res.title}
                </h2>
                <p className="text-lg text-ink-soft">{res.description}</p>
              </div>

              <ul className="border-y-2 border-rule mx-5 sm:mx-6">
                {res.contentPreview.map((raw, idx) => {
                  const line = raw.replace(/->/g, '→');
                  const cut = line.indexOf(': ');
                  const hasLabel = cut > 0 && cut <= 22;
                  return (
                    <li
                      key={idx}
                      className="py-2.5 text-lg text-ink border-b border-rule last:border-b-0"
                    >
                      {hasLabel ? (
                        <>
                          <strong className="text-pen font-bold">
                            {line.slice(0, cut + 1)}
                          </strong>
                          {line.slice(cut + 1)}
                        </>
                      ) : (
                        line
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto px-5 sm:px-6 pt-4 pb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                <div className="label-print leading-relaxed">
                  {comp?.shortLabel} · {res.ageRange} · Nível {res.complexity}
                </div>
                {linkedAct && (
                  <button
                    type="button"
                    onClick={() => onLaunchActivity(linkedAct)}
                    className="no-print btn btn-pen btn-sm"
                  >
                    <Play className="w-4 h-4" />
                    <span>Praticar atividade</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
