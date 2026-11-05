import React from 'react';
import {
  Eye,
  Highlighter,
  Moon,
  Sun,
  Type,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AccessibilitySettings } from '../types/pedagogical';

interface AccessibilityBarProps {
  settings: AccessibilitySettings;
  onChange: (updated: Partial<AccessibilitySettings>) => void;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  settings,
  onChange,
}) => {
  return (
    <div
      aria-label="Barra de acessibilidade e apoios visuais"
      className="no-print bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Font Family */}
          <div className="flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0" />
            <label
              htmlFor="access-font-select"
              className="font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap"
            >
              Letra:
            </label>
            <select
              id="access-font-select"
              value={settings.fontFamily}
              onChange={(e) =>
                onChange({
                  fontFamily: e.target.value as AccessibilitySettings['fontFamily'],
                })
              }
              className="rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="default">Padrão (Plus Jakarta)</option>
              <option value="arial">Arial</option>
              <option value="verdana">Verdana</option>
              <option value="opendyslexic">OpenDyslexic</option>
            </select>
          </div>

          {/* Font Size */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
            <span className="px-2 text-slate-600 dark:text-slate-400 font-medium">
              Tamanho:
            </span>
            {(
              [
                { id: 'normal', label: 'A' },
                { id: 'large', label: 'A+' },
                { id: 'xlarge', label: 'A++' },
              ] as const
            ).map((sz) => (
              <button
                key={sz.id}
                type="button"
                onClick={() => onChange({ fontSize: sz.id })}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
                  settings.fontSize === sz.id
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {sz.label}
              </button>
            ))}
          </div>

          {/* Spacing */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
            <span className="px-2 text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Espaço:
            </span>
            {(
              [
                { id: 'normal', label: 'Normal' },
                { id: 'relaxed', label: 'Médio' },
                { id: 'wide', label: 'Largo' },
              ] as const
            ).map((sp) => (
              <button
                key={sp.id}
                type="button"
                onClick={() => onChange({ spacing: sp.id })}
                className={`px-2 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                  settings.spacing === sp.id
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Controls: Audio, Keywords, Theme */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onChange({ highlightKeywords: !settings.highlightKeywords })
            }
            aria-pressed={settings.highlightKeywords}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors whitespace-nowrap ${
              settings.highlightKeywords
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-medium'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span>Palavras-chave</span>
          </button>

          <button
            type="button"
            onClick={() => onChange({ audioEnabled: !settings.audioEnabled })}
            aria-pressed={settings.audioEnabled}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors whitespace-nowrap ${
              settings.audioEnabled
                ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-300 dark:border-sky-700 text-sky-900 dark:text-sky-200 font-medium'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {settings.audioEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span>{settings.audioEnabled ? 'Áudio ativo' : 'Áudio desligado'}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onChange({
                theme: settings.theme === 'light' ? 'dark' : 'light',
              })
            }
            aria-label={
              settings.theme === 'light'
                ? 'Mudar para modo escuro'
                : 'Mudar para modo claro'
            }
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
          >
            {settings.theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Modo escuro</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Modo claro</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
