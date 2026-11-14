import React from 'react';
import { MONTHLY_MODULES } from '../data/curriculumData';
import { NavSectionId } from '../types/pedagogical';
import { Doodle } from './Sketch';

type DoodleName = React.ComponentProps<typeof Doodle>['name'];

interface NavLink {
  id: NavSectionId;
  label: string;
  doodle: DoodleName;
}

/**
 * The 13 sections, in four groups. Each group has its own colour so the
 * split is visible at a glance: blue pen, yellow pencil, pink eraser, ink.
 */
const GROUPS: {
  id: string;
  label: string;
  color: string;
  links?: NavLink[];
}[] = [
  {
    id: 'principal',
    label: 'Principal',
    color: 'var(--color-pen)',
    links: [
      { id: 'inicio', label: 'Início', doodle: 'home' },
      { id: 'percurso', label: 'O meu percurso', doodle: 'route' },
    ],
  },
  // The months come from MONTHLY_MODULES and are drawn as a ruled index.
  { id: 'meses', label: 'Planificação mensal', color: 'var(--color-pencil)' },
  {
    id: 'exploracao',
    label: 'Exploração e apoio',
    color: 'var(--color-eraser)',
    links: [
      { id: 'jogos', label: 'Jogos e desafios', doodle: 'dice' },
      { id: 'historias', label: 'Histórias interativas', doodle: 'book' },
      { id: 'biblioteca', label: 'Biblioteca de recursos', doodle: 'folder' },
      { id: 'progresso', label: 'O meu progresso', doodle: 'medal' },
    ],
  },
  {
    id: 'gestao',
    label: 'Gestão pedagógica',
    color: 'var(--color-ink)',
    links: [{ id: 'professora', label: 'Área da professora', doodle: 'apple' }],
  },
];

const itemClass = (active: boolean) =>
  `group/item w-full flex items-center gap-3 px-2.5 py-2 text-left text-[0.95rem] leading-snug text-ink transition-colors ${
    active
      ? 'bg-pencil/70 dark:bg-pencil/30 font-bold shadow-[inset_3px_0_0_0_var(--color-ink)]'
      : 'font-medium hover:bg-ink/[0.07]'
  }`;

export const SideNav: React.FC<{
  active: NavSectionId;
  onSelect: (id: NavSectionId) => void;
}> = ({ active, onSelect }) => (
  <nav className="space-y-7">
    {GROUPS.map((group) => (
      <div key={group.id}>
        <div
          className="hand text-[1.7rem] font-bold text-ink px-1 pb-0.5 mb-2 border-b-[3px]"
          style={{ borderColor: group.color }}
        >
          {group.label}
        </div>

        {group.links ? (
          <div className="space-y-0.5">
            {group.links.map((link) => {
              const isActive = active === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => onSelect(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={itemClass(isActive)}
                >
                  <Doodle
                    name={link.doodle}
                    strokeWidth={2.6}
                    className="w-7 h-7 shrink-0 transition-transform group-hover/item:-rotate-6"
                  />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            {MONTHLY_MODULES.map((mod, idx) => {
              const isActive = active === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => onSelect(mod.id)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={mod.navTitle}
                  className={`${itemClass(isActive)} border-b border-rule last:border-b-0`}
                >
                  <span
                    aria-hidden="true"
                    className="hand text-[1.7rem] font-bold text-pen w-7 shrink-0 text-center leading-none"
                  >
                    {idx + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block">{mod.name}</span>
                    <span
                      className={`block text-[0.8rem] font-normal ${
                        isActive ? 'text-ink' : 'text-ink-soft'
                      }`}
                    >
                      {mod.navTitle.replace(`${mod.name} — `, '')}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    ))}
  </nav>
);
