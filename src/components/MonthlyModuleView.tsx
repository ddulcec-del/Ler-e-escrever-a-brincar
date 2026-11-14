import React from 'react';
import { ArrowLeft, ArrowRight, Play, Volume2 } from 'lucide-react';
import {
  COMPETENCIES,
  MONTHLY_MODULES,
  PEDAGOGICAL_ACTIVITIES,
} from '../data/curriculumData';
import {
  ActivityResult,
  MonthId,
  PedagogicalActivity,
} from '../types/pedagogical';
import { speakPt } from '../utils/speech';
import { Doodle } from './Sketch';

interface MonthlyModuleViewProps {
  monthId: MonthId;
  audioEnabled: boolean;
  results: ActivityResult[];
  onLaunchActivity: (activity: PedagogicalActivity) => void;
  onNavigateMonth: (monthId: MonthId) => void;
}

export const MonthlyModuleView: React.FC<MonthlyModuleViewProps> = ({
  monthId,
  audioEnabled,
  results,
  onLaunchActivity,
  onNavigateMonth,
}) => {
  const module =
    MONTHLY_MODULES.find((m) => m.id === monthId) || MONTHLY_MODULES[0];
  const monthActivities = PEDAGOGICAL_ACTIVITIES.filter(
    (a) => a.month === module.id
  );
  const completedIds = new Set(results.map((r) => r.activityId));

  const handleLaunchGameByName = (gameName: string) => {
    const exact = monthActivities.find(
      (a) => a.gameTitle?.toLowerCase() === gameName.toLowerCase()
    );
    if (exact) {
      onLaunchActivity(exact);
      return;
    }
    // Fallback to the primary interactive activity of this month
    if (monthActivities.length > 0) {
      onLaunchActivity({
        ...monthActivities[0],
        gameTitle: gameName,
      });
    }
  };

  const moduleIndex = MONTHLY_MODULES.findIndex((m) => m.id === module.id);
  const theme = module.navTitle.replace(`${module.name} — `, '');
  const doneCount = monthActivities.filter((a) => completedIds.has(a.id)).length;
  const prevModule = MONTHLY_MODULES[moduleIndex - 1];
  const nextModule = MONTHLY_MODULES[moduleIndex + 1];

  const sectionHeading = (title: string, kicker: string, color: string) => (
    <div className="border-b-[3px] pb-2" style={{ borderColor: color }}>
      <div className="label-print">{kicker}</div>
      <h2 className="hand text-[2.1rem] font-bold text-ink leading-tight">
        {title}
      </h2>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Month header: title, main goal and what we will learn */}
      <header className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="hand text-[4.5rem] font-bold text-pen leading-[0.82] -rotate-3 shrink-0"
            >
              {moduleIndex + 1}
            </span>
            <div>
              <div className="label-print">
                Módulo {moduleIndex + 1} de {MONTHLY_MODULES.length} ·{' '}
                {module.name}
              </div>
              <h1 className="no-flourish text-3xl sm:text-4xl font-extrabold text-ink mt-0.5 leading-[1.08]">
                {theme}
              </h1>
              <p className="text-lg text-ink-soft mt-1.5">{module.subtitle}</p>
            </div>
          </div>

          {audioEnabled && (
            <button
              type="button"
              onClick={() =>
                speakPt(
                  `${module.navTitle}. Foco prioritário: ${module.priorityFocus}`
                )
              }
              className="btn-listen"
            >
              <Volume2 />
              <span>Ouvir apresentação do mês</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6 border-y-2 border-dashed border-ink/40 py-5">
          <div className="border-l-[5px] border-pen pl-4">
            <div className="hand text-2xl font-bold text-pen leading-tight">
              O grande objetivo deste mês
            </div>
            <p className="text-lg font-semibold text-ink leading-snug mt-1">
              {module.priorityFocus}
            </p>
          </div>

          <div>
            <div className="hand text-2xl font-bold text-ink leading-tight">
              O que vamos aprender
            </div>
            <ol className="mt-2 space-y-2">
              {module.operationalObjectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="hand shrink-0 w-7 h-7 flex items-center justify-center text-2xl font-bold bg-pencil text-[#23201c] border-2 border-ink rounded-[2px] leading-none"
                  >
                    {idx + 1}
                  </span>
                  <span className="text-base font-semibold text-ink leading-snug pt-0.5">
                    {obj}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </header>

      {/* Activities */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b-[3px] border-pencil pb-2">
          <div>
            <div className="label-print">Atividades interativas</div>
            <h2 className="hand text-[2.1rem] font-bold text-ink leading-tight">
              Atividades para praticar
            </h2>
          </div>
          <div className="flex items-center gap-2 text-base font-bold text-ink tabular-nums">
            {doneCount > 0 && (
              <Doodle name="tick" className="w-6 h-6 text-good" strokeWidth={5} />
            )}
            {doneCount} de {monthActivities.length} concluídas
          </div>
        </div>
        <p className="text-lg text-ink-soft">
          Seleciona uma atividade para praticar com apoio visual, áudio e
          correção automática.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {monthActivities.map((act) => {
            const comp = COMPETENCIES.find((c) => c.id === act.competency);
            const isDone = completedIds.has(act.id);
            return (
              <div
                key={act.id}
                className="sheet p-6 bg-sheet border border-edge flex flex-col justify-between gap-5"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="label-print">
                      {act.number ? `Atividade ${act.number}` : 'Atividade'} ·{' '}
                      {comp?.shortLabel}
                    </span>
                    {isDone && (
                      <span className="inline-flex items-center gap-1 text-good hand text-2xl font-bold -rotate-3">
                        <Doodle name="tick" className="w-5 h-5" strokeWidth={5} />
                        <span>Concluída</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-ink leading-tight">
                    {act.gameTitle || act.title}
                  </h3>
                  {act.gameTitle && (
                    <p className="text-base font-semibold text-ink">
                      {act.title}
                    </p>
                  )}
                  <p className="text-base text-ink-soft">
                    {act.pedagogicalObjective}
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => onLaunchActivity(act)}
                    className={`btn ${isDone ? 'btn-paper' : 'btn-pen'}`}
                  >
                    <Play className="w-4 h-4" />
                    <span>{isDone ? 'Praticar outra vez' : 'Iniciar atividade'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Games of the month */}
      <section className="space-y-5">
        {sectionHeading(
          'Jogos interativos do mês',
          `Para praticar os objetivos de ${module.name}`,
          'var(--color-eraser)'
        )}
        <div className="flex flex-wrap gap-3">
          {module.interactiveGamesList.map((game) => (
            <button
              key={game}
              type="button"
              onClick={() => handleLaunchGameByName(game)}
              className="btn btn-pencil"
            >
              <Play className="w-4 h-4" />
              <span>{game}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Planned activities and how learning is checked */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-12">
        <section className="space-y-4">
          {sectionHeading(
            'Atividades e recursos obrigatórios',
            'Plano do mês',
            'var(--color-ink)'
          )}
          <ol>
            {module.mandatoryActivitiesList.map((item) => (
              <li
                key={item.number}
                className="flex items-baseline gap-4 py-2.5 border-b border-rule"
              >
                <span
                  aria-hidden="true"
                  className="hand w-9 shrink-0 text-right text-3xl font-bold text-pen leading-none tabular-nums"
                >
                  {item.number}
                </span>
                <span className="text-lg text-ink">{item.title}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-4">
          {sectionHeading(
            'Como sabemos que aprendeste',
            `Indicadores de avaliação — ${module.name}`,
            'var(--color-good)'
          )}
          <ul className="space-y-3.5">
            {module.evaluationIndicators.map((ind, i) => (
              <li key={i} className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className="relative shrink-0 mt-0.5 w-6 h-6 border-2 border-ink bg-sheet rounded-[2px]"
                >
                  <Doodle
                    name="tick"
                    strokeWidth={5.5}
                    className="absolute -top-2.5 -left-0.5 w-8 h-8 text-good"
                  />
                </span>
                <span className="text-lg text-ink leading-snug">{ind}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Previous / next month */}
      <nav
        aria-label="Navegação entre módulos mensais"
        className="no-print pt-6 border-t-2 border-dashed border-ink/40 space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          {prevModule ? (
            <button
              type="button"
              onClick={() => onNavigateMonth(prevModule.id)}
              className="btn btn-paper"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{prevModule.name}</span>
            </button>
          ) : (
            <span />
          )}
          {nextModule && (
            <button
              type="button"
              onClick={() => onNavigateMonth(nextModule.id)}
              className="btn btn-pen"
            >
              <span>Mês seguinte: {nextModule.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="label-print mr-1">Todos os meses</span>
          {MONTHLY_MODULES.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onNavigateMonth(m.id)}
              aria-current={m.id === module.id ? 'page' : undefined}
              className={`px-2.5 py-1 border-[1.6px] border-ink rounded-[2px] text-sm font-semibold transition-colors ${
                m.id === module.id
                  ? 'bg-ink text-paper'
                  : 'bg-sheet text-ink hover:bg-pencil/40'
              }`}
            >
              {i + 1} · {m.name}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
