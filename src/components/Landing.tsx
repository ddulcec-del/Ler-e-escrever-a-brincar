import React from 'react';
import { ArrowRight, Volume2 } from 'lucide-react';
import { MONTHLY_MODULES } from '../data/curriculumData';
import {
  ActivityResult,
  NavSectionId,
  StudentProfile,
} from '../types/pedagogical';
import { ProfilePicker } from './ProfilePicker';
import { Doodle, PencilSheet, Scribble } from './Sketch';

interface LandingProps {
  activeStudent?: StudentProfile;
  students: StudentProfile[];
  studentsLoading: boolean;
  studentResults: ActivityResult[];
  audioEnabled: boolean;
  onPickStudent: (id: string) => void;
  onChangeStudent: () => void;
  onSpeakWelcome: () => void;
  onNavigate: (id: NavSectionId) => void;
}

const STEPS = [
  {
    title: 'Escolhe o caminho',
    text: 'Segue o teu percurso personalizado ou abre um dos módulos mensais, de janeiro a junho.',
  },
  {
    title: 'Joga e pratica',
    text: 'Jogos, desafios e histórias interativas. Sem pressa e sem penalizações por tempo.',
  },
  {
    title: 'Vê o que já consegues',
    text: 'Ganha pontos e medalhas e guarda as palavras novas no teu glossário.',
  },
];

const EXPLORE: {
  id: NavSectionId;
  title: string;
  text: string;
  doodle: React.ComponentProps<typeof Doodle>['name'];
  fill: string;
  span: string;
  tilt: string;
}[] = [
  {
    id: 'jogos',
    title: 'Jogos e desafios',
    text: 'Aprende sem pressa e sem penalizações por tempo. Cada tentativa ajuda-te a crescer!',
    doodle: 'dice',
    fill: 'var(--color-pencil)',
    span: 'md:col-span-7',
    tilt: 'md:-rotate-[0.6deg]',
  },
  {
    id: 'historias',
    title: 'Histórias interativas',
    text: 'Lê ou ouve cada história com atenção, explora as palavras-chave e responde às perguntas.',
    doodle: 'book',
    fill: 'var(--color-sheet)',
    span: 'md:col-span-5',
    tilt: 'md:rotate-[0.8deg]',
  },
  {
    id: 'biblioteca',
    title: 'Biblioteca de recursos',
    text: 'Materiais pedagógicos organizados por competência, categoria e grau de complexidade.',
    doodle: 'folder',
    fill: 'var(--color-sheet)',
    span: 'md:col-span-5',
    tilt: 'md:rotate-[0.5deg]',
  },
  {
    id: 'progresso',
    title: 'O meu progresso',
    text: 'Acompanha as tuas conquistas, medalhas e evolução ao longo dos meses.',
    doodle: 'medal',
    fill: 'var(--color-eraser)',
    span: 'md:col-span-7',
    tilt: 'md:-rotate-[0.4deg]',
  },
];

export const Landing: React.FC<LandingProps> = ({
  activeStudent,
  students,
  studentsLoading,
  studentResults,
  audioEnabled,
  onPickStudent,
  onChangeStudent,
  onSpeakWelcome,
  onNavigate,
}) => {
  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="grid-paper overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-12 grid lg:grid-cols-12 gap-x-10 gap-y-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-5">
              <p className="label-print">
                Agrupamento de Escolas de Paço de Arcos · 1.º Ciclo
              </p>
              <h1 className="no-flourish text-[clamp(2.9rem,8.2vw,6rem)] font-extrabold leading-[0.94] tracking-[-0.035em] text-ink">
                Ler e{' '}
                <span className="relative inline-block">
                  escrever
                  <Scribble className="-bottom-[0.16em] h-[0.2em]" color="var(--color-pen)" />
                </span>
                <br />
                <span className="hl">a brincar</span>
                <span className="text-mark">.</span>
              </h1>
            </div>

            {!activeStudent ? (
              <div className="space-y-5 max-w-xl">
                <p className="text-lg sm:text-xl text-ink-soft">
                  Olá! Bem-vindo(a) ao Ler e Escrever a Brincar!
                </p>
                <ProfilePicker
                  students={students}
                  loading={studentsLoading}
                  onPick={onPickStudent}
                />
              </div>
            ) : (
              <div className="space-y-6 max-w-xl">
                <div className="space-y-2">
                  <p className="hand text-5xl sm:text-6xl font-bold text-pen -rotate-2 origin-left">
                    Olá, {activeStudent?.name}!
                  </p>
                  <p className="text-xl sm:text-2xl font-semibold text-ink">
                    Estás preparado(a) para descobrir, aprender e brincar com
                    as palavras?
                  </p>
                  <p className="text-base text-ink-soft">
                    Escolhe o teu percurso personalizado ou explora os módulos
                    mensais de janeiro a junho ao teu próprio ritmo.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigate('percurso')}
                    className="btn btn-pen"
                  >
                    Ir para O meu percurso
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('jogos')}
                    className="btn btn-pencil"
                  >
                    Explorar jogos e desafios
                  </button>
                  {audioEnabled && (
                    <button
                      type="button"
                      onClick={onSpeakWelcome}
                      className="btn-listen"
                    >
                      <Volume2 />
                      Ouvir boas-vindas
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onChangeStudent}
                  className="text-sm font-semibold text-ink-soft underline underline-offset-4 hover:text-ink"
                >
                  Não és {activeStudent.name}? Mudar de aluno
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 relative max-w-md w-full mx-auto lg:max-w-none">
            <PencilSheet />
            <Doodle
              name="star"
              className="absolute -top-3 left-0 w-12 h-12 text-pencil -rotate-12"
              strokeWidth={2.6}
            />
            <Doodle
              name="spiral"
              className="absolute bottom-2 -left-2 w-12 h-12 text-ink-soft hidden sm:block"
            />
            <Doodle
              name="spark"
              className="absolute top-10 -right-1 w-9 h-9 text-mark hidden sm:block"
            />
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-md">
            Três passos, <span className="hl">ao teu ritmo</span>
          </h2>
          <p className="hand text-3xl text-ink-soft -rotate-2 flex items-center gap-2">
            é assim que funciona
            <Doodle name="arrow" className="w-10 h-10 rotate-[70deg]" />
          </p>
        </div>
        <ol className="grid md:grid-cols-3 gap-x-10 gap-y-10">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="relative border-t-2 border-dashed border-ink/40 pt-7"
            >
              <span
                aria-hidden="true"
                className="absolute -top-8 left-0 bg-paper pr-3"
              >
                <span className="relative inline-flex w-14 h-14 items-center justify-center">
                  <svg
                    viewBox="0 0 60 60"
                    className="absolute inset-0 w-full h-full text-mark"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <path d="M33 5C17 3 5 14 6 31c1 15 12 24 26 23 14-1 23-12 22-27C53 13 43 5 28 7" />
                  </svg>
                  <span className="hand text-5xl font-bold text-ink leading-none">
                    {i + 1}
                  </span>
                </span>
              </span>
              <h3 className="text-xl font-bold mt-3">{step.title}</h3>
              <p className="text-base text-ink-soft mt-1.5 max-w-xs">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Monthly plan, as a notebook index ---------- */}
      <section className="border-y border-edge bg-sheet/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-12 gap-x-10 gap-y-8">
          <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-28 self-start">
            <p className="label-print">Planificação Mensal</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              De janeiro
              <br />a junho
            </h2>
            <p className="text-base text-ink-soft max-w-xs">
              Módulos autónomos e interligados de intervenção psicopedagógica.
              Abre qualquer um, pela ordem que quiseres.
            </p>
          </div>

          <div className="lg:col-span-8 sketch sketch-shade">
            <div className="relative pl-10 sm:pl-16">
              {/* margin line and heading of the page */}
              <span
                aria-hidden="true"
                className="absolute left-7 sm:left-12 top-0 bottom-0 w-px bg-mark/60"
              />
              <div className="flex items-baseline justify-between gap-4 px-4 sm:px-6 pt-5 pb-3 border-b-2 border-rule">
                <span className="hand text-4xl font-bold text-ink">Índice</span>
                <span className="label-print">6 módulos</span>
              </div>
              <ul>
                {MONTHLY_MODULES.map((mod, idx) => {
                  const done = studentResults.filter(
                    (r) => r.month === mod.id
                  ).length;
                  return (
                    <li key={mod.id} className="border-b border-rule last:border-b-0">
                      <button
                        type="button"
                        onClick={() => onNavigate(mod.id)}
                        className="group w-full text-left grid grid-cols-[auto_1fr_auto] items-center gap-x-4 sm:gap-x-6 px-4 sm:px-6 py-4 transition-colors hover:bg-pencil/25 focus-visible:bg-pencil/25"
                      >
                        <span
                          aria-hidden="true"
                          className="hand text-4xl sm:text-5xl font-bold text-pen w-10 sm:w-14"
                        >
                          0{idx + 1}
                        </span>
                        <span className="min-w-0">
                          <span className="label-print block">{mod.name}</span>
                          <span className="font-display block text-lg sm:text-xl font-bold tracking-tight text-ink">
                            {mod.navTitle.replace(`${mod.name} — `, '')}
                          </span>
                          <span className="block text-sm text-ink-soft">
                            {mod.subtitle}
                          </span>
                        </span>
                        <span className="flex items-center gap-3 sm:gap-5">
                          <span
                            className={`hidden sm:inline-flex items-center gap-1 text-sm tabular-nums ${
                              done > 0 ? 'text-mark font-bold' : 'text-ink-soft'
                            }`}
                          >
                            {done > 0 && <Doodle name="tick" className="w-5 h-5" strokeWidth={3.4} />}
                            {done} concluída(s)
                          </span>
                          <ArrowRight className="w-5 h-5 text-ink transition-transform group-hover:translate-x-1.5" />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- More to explore ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-9">
          Mais para explorar
        </h2>
        <div className="grid md:grid-cols-12 gap-x-8 gap-y-9">
          {EXPLORE.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              style={{ '--sketch-fill': item.fill } as React.CSSProperties}
              className={`group sketch sketch-shade text-left p-6 sm:p-7 flex items-start gap-5 ${item.span} ${item.tilt} ${
                item.fill === 'var(--color-sheet)' ? 'text-ink' : 'text-[#23201c]'
              }`}
            >
              <Doodle name={item.doodle} className="w-14 h-14 sm:w-16 sm:h-16 shrink-0" />
              <span className="space-y-1.5">
                <span className="font-display block text-2xl font-extrabold tracking-tight">
                  {item.title}
                </span>
                <span className="block text-base opacity-80 max-w-md">
                  {item.text}
                </span>
                <span className="inline-flex items-center gap-2 pt-1 text-sm font-bold">
                  Abrir
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ---------- Teacher ---------- */}
      <section className="bg-ink text-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-14 flex flex-wrap items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <p className="hand text-3xl text-pencil -rotate-1 origin-left">
              para a professora
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Área da professora
            </h2>
            <p className="text-base opacity-80">
              Perfis de alunos, avaliação inicial, plano individual, registo de
              sessões e relatórios. Todos os dados ficam guardados apenas neste
              dispositivo — nada é enviado para a internet.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('professora')}
            className="btn btn-pencil !border-paper !shadow-[3px_3px_0_0_var(--color-paper)]"
          >
            Abrir a área da professora
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
