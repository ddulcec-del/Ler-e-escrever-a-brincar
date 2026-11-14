import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { COMPETENCIES, MONTHLY_MODULES } from '../../data/curriculumData';
import * as db from '../../lib/db';
import type {
  CompetencyId,
  ExerciseType,
  IndividualPlan,
  MonthId,
  PedagogicalActivity,
  StudentProfile,
} from '../../types/pedagogical';
import { InteractiveActivityModal } from '../InteractiveActivityModal';
import { ExerciseEditor } from './ExerciseEditor';
import { TYPE_LABELS, newActivity, questionCount } from './exerciseTypes';
import { Card, ErrorText, errorMessage } from './ui';

interface ExerciseListProps {
  activities: PedagogicalActivity[];
  plans: IndividualPlan[];
  students: StudentProfile[];
  onChanged: () => Promise<void> | void;
  audioEnabled: boolean;
  highlightKeywords: boolean;
}

type Visibility = 'todos' | 'visiveis' | 'ocultos';

export const ExerciseList: React.FC<ExerciseListProps> = ({
  activities,
  plans,
  students,
  onChanged,
  audioEnabled,
  highlightKeywords,
}) => {
  const [editing, setEditing] = useState<PedagogicalActivity | null>(null);
  const [previewing, setPreviewing] = useState<PedagogicalActivity | null>(null);
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState<MonthId | 'todos'>('todos');
  const [competency, setCompetency] = useState<CompetencyId | 'todas'>('todas');
  const [type, setType] = useState<ExerciseType | 'todos'>('todos');
  const [visibility, setVisibility] = useState<Visibility>('todos');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const nextSortOrder =
    activities.reduce((m, a) => Math.max(m, a.sortOrder ?? 0), 0) + 10;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activities.filter(
      (a) =>
        (month === 'todos' || a.month === month) &&
        (competency === 'todas' || a.competency === competency) &&
        (type === 'todos' || a.type === type) &&
        (visibility === 'todos' ||
          (visibility === 'visiveis' ? a.published !== false : a.published === false)) &&
        (!q ||
          a.title.toLowerCase().includes(q) ||
          (a.gameTitle ?? '').toLowerCase().includes(q))
    );
  }, [activities, search, month, competency, type, visibility]);

  const studentsWith = (id: string) =>
    plans
      .filter((p) => p.activityIds.includes(id))
      .map((p) => students.find((s) => s.id === p.studentId)?.name)
      .filter(Boolean) as string[];

  const act = async (id: string, fn: () => Promise<void>) => {
    setBusyId(id);
    setError(null);
    try {
      await fn();
      await onChanged();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const remove = (a: PedagogicalActivity) => {
    const inPlans = studentsWith(a.id);
    const warning = inPlans.length
      ? `\n\nEstá no plano de: ${inPlans.join(', ')}. Será retirado desses planos.`
      : '';
    if (
      !window.confirm(
        `Apagar o exercício “${a.gameTitle || a.title}”?${warning}\n\nOs resultados já feitos pelos alunos ficam no histórico. Se só quer escondê-lo, use “Ocultar”.`
      )
    ) {
      return;
    }
    act(a.id, async () => {
      for (const p of plans.filter((p) => p.activityIds.includes(a.id))) {
        await db.savePlan({ ...p, activityIds: p.activityIds.filter((x) => x !== a.id) });
      }
      await db.deleteActivity(a.id);
    });
  };

  const duplicate = (a: PedagogicalActivity) =>
    setEditing({
      ...a,
      id: '',
      number: undefined,
      title: `${a.title} (cópia)`,
      gameTitle: a.gameTitle ? `${a.gameTitle} (cópia)` : undefined,
      published: false,
      sortOrder: (a.sortOrder ?? 0) + 1,
    });

  const importOriginals = async () => {
    setImporting(true);
    setImportMessage(null);
    setError(null);
    try {
      const n = await db.importMissingActivities(activities.map((a) => a.id));
      setImportMessage(
        n === 0
          ? 'Todos os exercícios originais já estão na lista.'
          : `${n} exercício(s) original(is) acrescentado(s).`
      );
      await onChanged();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setImporting(false);
    }
  };

  const previewModal = previewing && (
    <InteractiveActivityModal
      activity={previewing}
      initialLevel={1}
      audioEnabled={audioEnabled}
      highlightKeywords={highlightKeywords}
      studentId=""
      onClose={() => setPreviewing(null)}
      // Preview only: nothing is recorded.
      onComplete={() => {}}
    />
  );

  if (editing) {
    return (
      <>
        <ExerciseEditor
          key={editing.id || 'new'}
          initial={editing}
          onCancel={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await onChanged();
          }}
          onPreview={setPreviewing}
        />
        {previewModal}
      </>
    );
  }

  if (activities.length === 0) {
    return (
      <Card
        title="Ainda não há exercícios"
        subtitle="Comece por importar os 49 exercícios que vêm com a plataforma. Depois pode editá-los, ocultá-los, apagá-los ou criar novos."
      >
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-pen" onClick={importOriginals} disabled={importing}>
            {importing ? 'A importar…' : 'Importar exercícios originais'}
          </button>
          <button
            type="button"
            className="btn btn-paper"
            onClick={() => setEditing(newActivity(nextSortOrder))}
          >
            Criar um exercício novo
          </button>
        </div>
        <ErrorText error={error} />
      </Card>
    );
  }

  const visibleCount = activities.filter((a) => a.published !== false).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink-soft">
          {activities.length} exercício(s) · {visibleCount} visíveis para os alunos ·{' '}
          {activities.length - visibleCount} ocultos
        </p>
        <button
          type="button"
          className="btn btn-pen btn-sm"
          onClick={() => setEditing(newActivity(nextSortOrder))}
        >
          <Plus className="w-4 h-4" />
          Novo exercício
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <input
          className="field lg:col-span-1"
          type="search"
          placeholder="Procurar…"
          aria-label="Procurar exercício"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="field" aria-label="Mês" value={month} onChange={(e) => setMonth(e.target.value as MonthId | 'todos')}>
          <option value="todos">Todos os meses</option>
          {MONTHLY_MODULES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <select
          className="field"
          aria-label="Competência"
          value={competency}
          onChange={(e) => setCompetency(e.target.value as CompetencyId | 'todas')}
        >
          <option value="todas">Todas as competências</option>
          {COMPETENCIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.shortLabel}
            </option>
          ))}
        </select>
        <select className="field" aria-label="Tipo" value={type} onChange={(e) => setType(e.target.value as ExerciseType | 'todos')}>
          <option value="todos">Todos os tipos</option>
          {Object.entries(TYPE_LABELS).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        <select
          className="field"
          aria-label="Visibilidade"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as Visibility)}
        >
          <option value="todos">Visíveis e ocultos</option>
          <option value="visiveis">Só visíveis</option>
          <option value="ocultos">Só ocultos</option>
        </select>
      </div>

      <ErrorText error={error} />

      {filtered.length === 0 && <p className="text-ink-soft">Nenhum exercício com estes filtros.</p>}

      {MONTHLY_MODULES.map((m) => {
        const list = filtered.filter((a) => a.month === m.id);
        if (list.length === 0) return null;
        return (
          <section key={m.id} className="space-y-2">
            <h2 className="label-print">
              {m.name} · {list.length}
            </h2>
            <ul className="space-y-2">
              {list.map((a) => {
                const hidden = a.published === false;
                const [n1, n2, n3] = questionCount(a);
                const inPlans = studentsWith(a.id);
                return (
                  <li
                    key={a.id}
                    className={`sheet bg-sheet border border-edge px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2 ${
                      hidden ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-56">
                      <div className="font-bold text-ink">
                        {a.gameTitle || a.title}
                        {hidden && (
                          <span className="ml-2 text-xs font-bold uppercase tracking-wider text-mark">
                            oculto
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-ink-soft">
                        {TYPE_LABELS[a.type]} ·{' '}
                        {COMPETENCIES.find((c) => c.id === a.competency)?.shortLabel} · perguntas
                        N1 {n1} · N2 {n2} · N3 {n3}
                        {inPlans.length > 0 && ` · no plano de ${inPlans.join(', ')}`}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-paper btn-sm"
                        disabled={busyId === a.id}
                        onClick={() => act(a.id, () => db.setActivityPublished(a.id, hidden))}
                      >
                        {hidden ? 'Mostrar' : 'Ocultar'}
                      </button>
                      <button type="button" className="btn btn-paper btn-sm" onClick={() => setPreviewing(a)}>
                        Pré-visualizar
                      </button>
                      <button type="button" className="btn btn-paper btn-sm" onClick={() => setEditing(a)}>
                        Editar
                      </button>
                      <button type="button" className="btn btn-paper btn-sm" onClick={() => duplicate(a)}>
                        Duplicar
                      </button>
                      <button
                        type="button"
                        className="btn btn-paper btn-sm"
                        disabled={busyId === a.id}
                        onClick={() => remove(a)}
                      >
                        Apagar
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <div className="border-t border-edge pt-4 flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          className="font-bold text-pen underline underline-offset-4"
          onClick={importOriginals}
          disabled={importing}
        >
          {importing ? 'A recuperar…' : 'Recuperar exercícios originais apagados'}
        </button>
        <span className="text-ink-soft">
          Volta a acrescentar os originais que foram apagados. Não altera os que existem.
        </span>
        {importMessage && <span className="font-semibold text-good">{importMessage}</span>}
      </div>

      {previewModal}
    </div>
  );
};
