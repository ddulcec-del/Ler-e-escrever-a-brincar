import React from 'react';
import {
  CheckCircle2,
  Compass,
  Gamepad2,
  ListChecks,
  Play,
  Volume2,
} from 'lucide-react';
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

  return (
    <div className="space-y-8">
      {/* Month Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-teal-700 dark:text-teal-400">
              Módulo de Intervenção · {module.name}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {module.navTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">
              {module.subtitle}
            </p>
          </div>

          {audioEnabled && (
            <button
              type="button"
              onClick={() =>
                speakPt(
                  `${module.navTitle}. Foco prioritário: ${module.priorityFocus}`
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 text-xs font-semibold hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>Ouvir apresentação do mês</span>
            </button>
          )}
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Foco prioritário:
          </div>
          <p className="text-sm text-slate-800 dark:text-slate-200 mt-1">
            {module.priorityFocus}
          </p>
        </div>

        {/* Operational Objectives */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Objetivos operacionais:
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {module.operationalObjectives.map((obj, idx) => (
              <li
                key={idx}
                className="p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/70 dark:border-teal-800/50 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2"
              >
                <Compass className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive Executable Activities */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Atividades interativas executáveis
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Seleciona uma atividade para praticar com apoio visual, áudio e
            correção automática
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {monthActivities.map((act) => {
            const comp = COMPETENCIES.find((c) => c.id === act.competency);
            const isDone = completedIds.has(act.id);
            return (
              <div
                key={act.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      {act.number ? `Atividade ${act.number}` : 'Atividade'} ·{' '}
                      {comp?.shortLabel}
                    </span>
                    {isDone && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Concluída</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {act.gameTitle ? `${act.gameTitle} — ` : ''}
                    {act.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {act.pedagogicalObjective}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onLaunchActivity(act)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Iniciar atividade</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandatory Activities & Interactive Games Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mandatory Activities List (#14 - #62) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Atividades e recursos obrigatórios
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {module.mandatoryActivitiesList.map((item) => (
              <div
                key={item.number}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2.5"
              >
                <span className="w-6 h-6 rounded-md bg-teal-700 text-white font-bold flex items-center justify-center shrink-0 tabular-nums">
                  {item.number}
                </span>
                <span className="font-medium">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Games List */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Jogos interativos do mês
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Clica em qualquer jogo para praticar os objetivos de {module.name}:
          </p>
          <div className="flex flex-wrap gap-2">
            {module.interactiveGamesList.map((game) => (
              <button
                key={game}
                type="button"
                onClick={() => handleLaunchGameByName(game)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{game}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluation Indicators & Interlinked Month Navigation */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Indicadores de avaliação — {module.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {module.evaluationIndicators.map((ind, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <span>{ind}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Navegação rápida entre módulos mensais:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {MONTHLY_MODULES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onNavigateMonth(m.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  m.id === module.id
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
