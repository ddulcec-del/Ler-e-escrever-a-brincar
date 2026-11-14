import React from 'react';
import { StudentProfile } from '../types/pedagogical';
import { Doodle } from './Sketch';

interface ProfilePickerProps {
  students: StudentProfile[];
  onPick: (id: string) => void;
  loading?: boolean;
  title?: string;
}

const TILTS = ['-rotate-1', 'rotate-1', '-rotate-[0.6deg]', 'rotate-[0.8deg]'];

/** "Quem és tu?" — the student picks their own profile, created by the teacher. */
export const ProfilePicker: React.FC<ProfilePickerProps> = ({
  students,
  onPick,
  loading = false,
  title = 'Quem és tu?',
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Doodle name="star" className="w-6 h-6 text-pencil" strokeWidth={3} />
      <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
        {title}
      </h2>
    </div>

    {loading ? (
      <p className="hand text-3xl text-ink-soft">A carregar perfis…</p>
    ) : students.length === 0 ? (
      <p className="text-base text-ink-soft">
        A professora ainda não criou perfis de alunos. Pede-lhe ajuda para
        começar!
      </p>
    ) : (
      <>
        <p className="text-base text-ink-soft">
          Carrega no teu nome para começar.
        </p>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {students.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onPick(s.id)}
                className={`sketch sketch-shade w-full px-4 pt-3 pb-3.5 text-left ${
                  TILTS[i % TILTS.length]
                }`}
              >
                <span className="block hand text-4xl font-bold text-pen leading-none break-words">
                  {s.name}
                </span>
                <span className="block text-sm font-semibold text-ink-soft mt-1.5">
                  {s.schoolYear}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
);
