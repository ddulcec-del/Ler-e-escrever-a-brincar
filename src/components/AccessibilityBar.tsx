import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AccessibilitySettings } from '../types/pedagogical';
import { Doodle } from './Sketch';

interface AccessibilityBarProps {
  settings: AccessibilitySettings;
  onChange: (updated: Partial<AccessibilitySettings>) => void;
}

const segmentClass = (active: boolean) =>
  `px-2 h-9 inline-flex items-center justify-center font-bold transition-colors whitespace-nowrap ${
    active ? 'bg-ink text-paper' : 'bg-sheet text-ink hover:bg-pencil/40'
  }`;

/** On/off help, drawn as a tick box so the state is unmistakable. */
const TickToggle: React.FC<{
  on: boolean;
  onToggle: () => void;
  label: string;
  hint: string;
  ariaLabel?: string;
}> = ({ on, onToggle, label, hint, ariaLabel }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={on}
    aria-label={ariaLabel}
    title={hint}
    className="group inline-flex items-center gap-2 h-9 text-ink font-semibold whitespace-nowrap"
  >
    <span className="relative inline-block w-5 h-5 border-2 border-ink bg-sheet rounded-[2px] transition-colors group-hover:bg-pencil/40">
      {on && (
        <Doodle
          name="tick"
          strokeWidth={5.5}
          className="absolute -top-2 -left-0.5 w-7 h-7 text-mark"
        />
      )}
    </span>
    <span>{label}</span>
  </button>
);

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  settings,
  onChange,
}) => {
  // On phones the helps are folded away so they don't push the page down.
  const [openOnPhone, setOpenOnPhone] = useState(false);

  return (
    <div
      aria-label="Barra de acessibilidade e apoios visuais"
      className="no-print bg-sheet border-b border-edge px-4 sm:px-6 py-2 text-sm tracking-normal leading-normal font-(family-name:--font-body)"
    >
      <div className="max-w-7xl mx-auto sm:hidden">
        <button
          type="button"
          onClick={() => setOpenOnPhone((o) => !o)}
          aria-expanded={openOnPhone}
          className="w-full flex items-center justify-between h-9 text-ink"
        >
          <span className="hand text-2xl font-bold">Ajudas para ler</span>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${openOnPhone ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <div
        className={`max-w-7xl mx-auto flex-wrap items-center gap-x-3.5 gap-y-2 sm:flex ${
          openOnPhone ? 'flex pt-1 pb-2' : 'hidden'
        }`}
      >
        <span className="hand text-[1.4rem] font-bold text-ink hidden xl:inline whitespace-nowrap">
          Ajudas para ler:
        </span>

        {/* Reading helps: on/off */}
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 xl:flex-nowrap">
          <TickToggle
            on={settings.highlightKeywords}
            onToggle={() =>
              onChange({ highlightKeywords: !settings.highlightKeywords })
            }
            label="Destacar palavras-chave"
            hint="Pinta as palavras mais importantes dos textos"
          />
          <TickToggle
            on={settings.audioEnabled}
            onToggle={() => onChange({ audioEnabled: !settings.audioEnabled })}
            label="Ouvir em voz alta"
            hint="Mostra os botões para ouvir os textos lidos em voz alta"
          />
          <TickToggle
            on={settings.theme === 'dark'}
            onToggle={() =>
              onChange({ theme: settings.theme === 'light' ? 'dark' : 'light' })
            }
            label="Modo escuro"
            hint="Fundo escuro com letras claras"
            ariaLabel={
              settings.theme === 'light'
                ? 'Mudar para modo escuro'
                : 'Mudar para modo claro'
            }
          />
        </div>

        {/* Text appearance */}
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 xl:ml-auto xl:flex-nowrap">
          <div className="flex items-center gap-2">
            <label htmlFor="access-font-select" className="label-print">
              Letra
            </label>
            <select
              id="access-font-select"
              value={settings.fontFamily}
              onChange={(e) =>
                onChange({
                  fontFamily: e.target
                    .value as AccessibilitySettings['fontFamily'],
                })
              }
              className="h-9 w-[7.25rem] rounded-[2px] border-[1.6px] border-ink bg-sheet text-ink px-1.5 font-semibold"
            >
              <option value="default">Padrão</option>
              <option value="arial">Arial</option>
              <option value="verdana">Verdana</option>
              <option value="opendyslexic">OpenDyslexic</option>
            </select>
          </div>

          <div className="flex items-center gap-2" role="group" aria-label="Tamanho da letra">
            <span className="label-print">Tamanho</span>
            <div className="inline-flex border-[1.6px] border-ink rounded-[2px] overflow-hidden divide-x-[1.6px] divide-ink">
              {(
                [
                  { id: 'normal', name: 'Normal', size: 'text-sm' },
                  { id: 'large', name: 'Grande', size: 'text-lg' },
                  { id: 'xlarge', name: 'Muito grande', size: 'text-2xl' },
                ] as const
              ).map((sz) => (
                <button
                  key={sz.id}
                  type="button"
                  onClick={() => onChange({ fontSize: sz.id })}
                  aria-pressed={settings.fontSize === sz.id}
                  aria-label={`Letra ${sz.name.toLowerCase()}`}
                  title={`Letra ${sz.name.toLowerCase()}`}
                  className={`${segmentClass(settings.fontSize === sz.id)} w-9 !px-0 font-display ${sz.size}`}
                >
                  A
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2" role="group" aria-label="Espaço entre letras e linhas">
            <span className="label-print">Espaço</span>
            <div className="inline-flex border-[1.6px] border-ink rounded-[2px] overflow-hidden divide-x-[1.6px] divide-ink">
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
                  aria-pressed={settings.spacing === sp.id}
                  className={`${segmentClass(settings.spacing === sp.id)} text-[0.8rem]`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
