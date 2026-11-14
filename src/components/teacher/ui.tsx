import React, { useState } from 'react';

/** Small building blocks shared by the teacher area screens. */

export const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : String(e);

export const Field: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ label, hint, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="field-label">{label}</span>
    {children}
    {hint && <span className="block text-xs text-ink-soft mt-1">{hint}</span>}
  </label>
);

export const Card: React.FC<{
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, actions, children, className = '' }) => (
  <section
    className={`sheet bg-sheet border border-edge p-5 sm:p-6 space-y-4 ${className}`}
  >
    {(title || actions) && (
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {title && <h2 className="text-xl font-bold text-ink">{title}</h2>}
          {subtitle && <p className="text-sm text-ink-soft mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    )}
    {children}
  </section>
);

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
  label,
}: {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
  label: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="no-print flex flex-wrap gap-x-6 gap-y-2 border-b-[1.6px] border-ink"
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          type="button"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={`-mb-[1.6px] pb-2 pt-1 text-sm sm:text-base font-bold border-b-4 transition-colors ${
            active === t.id
              ? 'border-pencil text-ink'
              : 'border-transparent text-ink-soft hover:text-ink'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/** "Guardar" button with a saved/error message next to it. */
export function useSaver() {
  const [state, setState] = useState<
    { kind: 'idle' } | { kind: 'saving' } | { kind: 'saved' } | { kind: 'error'; message: string }
  >({ kind: 'idle' });

  const run = async (fn: () => Promise<void>) => {
    setState({ kind: 'saving' });
    try {
      await fn();
      setState({ kind: 'saved' });
      setTimeout(
        () => setState((s) => (s.kind === 'saved' ? { kind: 'idle' } : s)),
        2500
      );
      return true;
    } catch (e) {
      setState({ kind: 'error', message: errorMessage(e) });
      return false;
    }
  };

  const status =
    state.kind === 'saving' ? (
      <span className="text-sm text-ink-soft">A guardar…</span>
    ) : state.kind === 'saved' ? (
      <span className="text-sm font-semibold text-good">Guardado ✓</span>
    ) : state.kind === 'error' ? (
      <span className="text-sm font-semibold text-mark">
        Não foi guardado: {state.message}
      </span>
    ) : null;

  return { run, status, saving: state.kind === 'saving' };
}

export const ErrorText: React.FC<{ error: string | null }> = ({ error }) =>
  error ? (
    <p role="alert" className="text-sm font-semibold text-mark">
      {error}
    </p>
  ) : null;

export const Loading: React.FC = () => (
  <p className="hand text-3xl text-ink-soft">A carregar…</p>
);

/** Editable list of short lines (objectives, options, items…). */
export const LinesEditor: React.FC<{
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  ordered?: boolean;
}> = ({ values, onChange, placeholder, addLabel = 'Acrescentar', ordered }) => {
  const set = (i: number, v: string) =>
    onChange(values.map((x, j) => (j === i ? v : x)));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          {ordered && (
            <span className="w-6 text-right text-sm font-bold text-ink-soft tabular-nums">
              {i + 1}.
            </span>
          )}
          <input
            className="field"
            value={v}
            placeholder={placeholder}
            onChange={(e) => set(i, e.target.value)}
          />
          {ordered && (
            <>
              <IconButton label="Subir" onClick={() => move(i, -1)} disabled={i === 0}>
                ↑
              </IconButton>
              <IconButton
                label="Descer"
                onClick={() => move(i, 1)}
                disabled={i === values.length - 1}
              >
                ↓
              </IconButton>
            </>
          )}
          <IconButton
            label="Remover"
            onClick={() => onChange(values.filter((_, j) => j !== i))}
          >
            ✕
          </IconButton>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, ''])}
        className="text-sm font-bold text-pen underline underline-offset-4"
      >
        + {addLabel}
      </button>
    </div>
  );
};

export const IconButton: React.FC<{
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ label, onClick, disabled, children }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    disabled={disabled}
    className="shrink-0 w-8 h-8 inline-flex items-center justify-center border-[1.6px] border-ink rounded-[2px] bg-sheet text-ink text-sm font-bold disabled:opacity-30"
  >
    {children}
  </button>
);
