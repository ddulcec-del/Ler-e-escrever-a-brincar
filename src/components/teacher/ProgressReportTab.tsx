import React, { useState } from 'react';
import { Printer } from 'lucide-react';
import {
  COMPETENCIES,
  INTERVENTION_PROFILES,
  MEDALS_CATALOG,
} from '../../data/curriculumData';
import * as db from '../../lib/db';
import type {
  ActivityResult,
  FinalReport,
  IndividualPlan,
  PedagogicalActivity,
  StudentProfile,
} from '../../types/pedagogical';
import { monthName } from '../../utils/months';
import {
  attemptsPerQuestion,
  computeMedals,
  computePoints,
  formatDate,
} from '../../utils/progress';
import { LEVEL_NAMES } from './PlanTab';
import type { StudentRecords } from './StudentDetail';
import { Card, ErrorText, Field, errorMessage, useSaver } from './ui';

interface ProgressReportTabProps {
  student: StudentProfile;
  plan: IndividualPlan;
  results: ActivityResult[];
  records: StudentRecords;
  activities: PedagogicalActivity[];
  onRecordsChanged: () => Promise<void>;
}

const AUTONOMY = ['Autónomo', 'Com apoio parcial', 'Com apoio total'] as const;

const fmtAttempts = (v: number | null) =>
  v === null ? '–' : v.toFixed(1).replace('.', ',');

function competencyRows(results: ActivityResult[], records: StudentRecords, plan: IndividualPlan) {
  return COMPETENCIES.map((c) => {
    const rs = results.filter((r) => r.competency === c.id);
    return {
      competency: c,
      priority: plan.priorityCompetencies.includes(c.id),
      initial: records.assessment?.ratings[c.id],
      count: rs.length,
      attempts: attemptsPerQuestion(rs),
      autonomous: rs.filter((r) => r.autonomyDegree === 'Autónomo').length,
    };
  }).filter((row) => row.priority || row.count > 0 || row.initial);
}

/** Progress review plus the end-of-year report (screen and print). */
export const ProgressReportTab: React.FC<ProgressReportTabProps> = ({
  student,
  plan,
  results,
  records,
  activities,
  onRecordsChanged,
}) => {
  const [report, setReport] = useState<FinalReport>(
    records.report ?? { studentId: student.id, strategies: '', continuity: '' }
  );
  const [error, setError] = useState<string | null>(null);
  const saver = useSaver();

  const rows = competencyRows(results, records, plan);
  const medals = computeMedals(results);

  const saveReport = () =>
    saver.run(async () => {
      await db.saveReport(report);
      await onRecordsChanged();
    });

  const removeWord = async (id: string, word: string) => {
    if (!window.confirm(`Apagar “${word}” do glossário?`)) return;
    try {
      await db.deleteGlossaryEntry(id);
      await onRecordsChanged();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  return (
    <>
      <div className="no-print space-y-6">
        <Card title="Resumo">
          <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <Stat label="Atividades" value={results.length} />
            <Stat label="Pontos" value={computePoints(results)} />
            <Stat label="Medalhas" value={`${medals.length}/${MEDALS_CATALOG.length}`} />
            <Stat
              label="Tentativas por pergunta"
              value={fmtAttempts(attemptsPerQuestion(results))}
              hint="1,0 = tudo certo à primeira"
            />
            <Stat label="Pistas usadas" value={results.reduce((n, r) => n + r.hintsUsed, 0)} />
            <Stat label="Sumários" value={records.sessions.length} />
          </dl>
          {results.length > 0 && (
            <p className="text-sm text-ink-soft">
              Autonomia nas atividades:{' '}
              {AUTONOMY.map(
                (a) => `${a} ${results.filter((r) => r.autonomyDegree === a).length}`
              ).join(' · ')}
            </p>
          )}
        </Card>

        <Card
          title="Por competência"
          subtitle="Avaliação inicial comparada com o trabalho feito na plataforma."
        >
          <CompetencyTable rows={rows} />
        </Card>

        <Card title="Histórico de atividades">
          {results.length === 0 ? (
            <p className="text-ink-soft">Ainda não há atividades feitas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-[1.6px] border-ink text-left">
                    <th className="py-2 pr-4">Data</th>
                    <th className="py-2 pr-4">Atividade</th>
                    <th className="py-2 pr-4">Mês</th>
                    <th className="py-2 pr-4">Nível</th>
                    <th className="py-2 pr-4">Tentativas</th>
                    <th className="py-2 pr-4">Pistas</th>
                    <th className="py-2">Autonomia</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.id} className="border-b border-edge">
                      <td className="py-2 pr-4 tabular-nums whitespace-nowrap">
                        {formatDate(r.date)}
                      </td>
                      <td className="py-2 pr-4 font-semibold">{r.activityTitle}</td>
                      <td className="py-2 pr-4">{monthName(r.month)}</td>
                      <td className="py-2 pr-4 tabular-nums">{r.difficultyLevel}</td>
                      <td className="py-2 pr-4 tabular-nums">
                        {r.attempts} / {r.totalCount}
                      </td>
                      <td className="py-2 pr-4 tabular-nums">{r.hintsUsed}</td>
                      <td className="py-2">{r.autonomyDegree}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card
          title="Glossário do aluno"
          subtitle="Palavras que o aluno guardou em “O meu progresso”."
        >
          {records.glossary.length === 0 ? (
            <p className="text-ink-soft">Ainda não há palavras.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {records.glossary.map((g) => (
                <li key={g.id} className="flex items-start justify-between gap-3 border border-edge rounded-[2px] p-3">
                  <div>
                    <div className="font-bold">{g.word}</div>
                    <div className="text-sm text-ink-soft">{g.meaning}</div>
                    {g.example && <div className="text-sm italic text-ink-soft">“{g.example}”</div>}
                  </div>
                  <button
                    type="button"
                    className="text-xs font-bold text-mark underline underline-offset-4"
                    onClick={() => removeWord(g.id, g.word)}
                  >
                    Apagar
                  </button>
                </li>
              ))}
            </ul>
          )}
          <ErrorText error={error} />
        </Card>

        <Card
          title="Relatório final"
          subtitle="O relatório impresso junta a ficha, a avaliação inicial, o plano, os sumários, o progresso e este texto."
          actions={
            <button type="button" className="btn btn-pencil btn-sm" onClick={() => window.print()}>
              <Printer className="w-4 h-4" />
              Imprimir / PDF
            </button>
          }
        >
          <Field label="Estratégias eficazes">
            <textarea
              className="field"
              rows={4}
              value={report.strategies}
              onChange={(e) => setReport((r) => ({ ...r, strategies: e.target.value }))}
            />
          </Field>
          <Field label="Necessidades de continuidade e propostas">
            <textarea
              className="field"
              rows={4}
              value={report.continuity}
              onChange={(e) => setReport((r) => ({ ...r, continuity: e.target.value }))}
            />
          </Field>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-pen btn-sm" onClick={saveReport} disabled={saver.saving}>
              Guardar relatório
            </button>
            {saver.status ??
              (records.report?.updatedAt && (
                <span className="text-sm text-ink-soft">
                  Guardado a {formatDate(records.report.updatedAt)}
                </span>
              ))}
          </div>
        </Card>
      </div>

      <PrintableReport
        student={student}
        plan={plan}
        results={results}
        records={records}
        activities={activities}
        report={report}
        rows={rows}
      />
    </>
  );
};

const Stat: React.FC<{ label: string; value: React.ReactNode; hint?: string }> = ({
  label,
  value,
  hint,
}) => (
  <div>
    <dt className="text-sm text-ink-soft">{label}</dt>
    <dd className="text-2xl font-bold tabular-nums">{value}</dd>
    {hint && <dd className="text-xs text-ink-soft">{hint}</dd>}
  </div>
);

const CompetencyTable: React.FC<{ rows: ReturnType<typeof competencyRows> }> = ({ rows }) =>
  rows.length === 0 ? (
    <p className="text-ink-soft">
      Sem dados: faça a avaliação inicial ou escolha competências no plano.
    </p>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-[1.6px] border-ink text-left">
            <th className="py-2 pr-4">Competência</th>
            <th className="py-2 pr-4">Avaliação inicial</th>
            <th className="py-2 pr-4">Atividades</th>
            <th className="py-2 pr-4">Tentativas por pergunta</th>
            <th className="py-2">Autónomas</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.competency.id} className="border-b border-edge">
              <td className="py-2 pr-4">
                <span className="font-semibold">{row.competency.label}</span>
                {row.priority && (
                  <span className="ml-2 text-xs font-bold text-pen">prioritária</span>
                )}
              </td>
              <td className="py-2 pr-4">{row.initial ?? '–'}</td>
              <td className="py-2 pr-4 tabular-nums">{row.count}</td>
              <td className="py-2 pr-4 tabular-nums">{fmtAttempts(row.attempts)}</td>
              <td className="py-2 tabular-nums">
                {row.count > 0 ? `${row.autonomous} de ${row.count}` : '–'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

/** Only shown when printing: the full report on paper. */
const PrintableReport: React.FC<{
  student: StudentProfile;
  plan: IndividualPlan;
  results: ActivityResult[];
  records: StudentRecords;
  activities: PedagogicalActivity[];
  report: FinalReport;
  rows: ReturnType<typeof competencyRows>;
}> = ({ student, plan, results, records, activities, report, rows }) => {
  const done = new Set(results.map((r) => r.activityId));
  const name = (id: string) => {
    const a = activities.find((x) => x.id === id);
    return a ? a.gameTitle || a.title : id;
  };
  const H = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-bold border-b border-ink pb-1 mt-6 mb-2">{children}</h3>
  );

  return (
    <article className="hidden print:block text-[11pt] leading-snug text-black">
      <header className="text-center space-y-1 mb-4">
        <div className="text-sm uppercase tracking-wider">
          Agrupamento de Escolas de Paço de Arcos · Ler e Escrever a Brincar
        </div>
        <h2 className="text-2xl font-bold">Relatório individual de intervenção</h2>
      </header>

      <table className="w-full text-sm mb-2">
        <tbody>
          <tr>
            <td><strong>Aluno(a):</strong> {student.name}</td>
            <td><strong>Idade / ano:</strong> {student.age} anos · {student.schoolYear}</td>
          </tr>
          <tr>
            <td><strong>Perfil:</strong> {INTERVENTION_PROFILES[student.profile].title}</td>
            <td><strong>Início do apoio:</strong> {formatDate(student.startDate)}</td>
          </tr>
          <tr>
            <td><strong>Professora:</strong> Dulce Lopes</td>
            <td><strong>Data do relatório:</strong> {formatDate(new Date().toISOString())}</td>
          </tr>
        </tbody>
      </table>
      {student.observations && <p className="text-sm"><strong>Observações:</strong> {student.observations}</p>}

      <H>1. Avaliação inicial{records.assessment && ` (${formatDate(records.assessment.date)})`}</H>
      {records.assessment ? (
        <>
          <ul className="text-sm columns-2">
            {COMPETENCIES.filter((c) => records.assessment?.ratings[c.id]).map((c) => (
              <li key={c.id}>
                {c.label}: <strong>{records.assessment?.ratings[c.id]}</strong>
              </li>
            ))}
          </ul>
          {records.assessment.notes && <p className="text-sm mt-1">{records.assessment.notes}</p>}
        </>
      ) : (
        <p className="text-sm">Não registada.</p>
      )}

      <H>2. Plano individual</H>
      <p className="text-sm">
        <strong>Nível:</strong> {LEVEL_NAMES[plan.difficultyLevel]}
        {plan.frequency && <> · <strong>Frequência:</strong> {plan.frequency}</>}
      </p>
      <p className="text-sm">
        <strong>Competências prioritárias:</strong>{' '}
        {plan.priorityCompetencies
          .map((id) => COMPETENCIES.find((c) => c.id === id)?.label)
          .join('; ') || '–'}
      </p>
      {plan.objectives.length > 0 && (
        <>
          <p className="text-sm font-bold mt-1">Objetivos:</p>
          <ul className="text-sm list-disc pl-5">
            {plan.objectives.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </>
      )}
      {plan.activityIds.length > 0 && (
        <p className="text-sm mt-1">
          <strong>Atividades do plano ({plan.activityIds.filter((id) => done.has(id)).length} de{' '}
          {plan.activityIds.length} realizadas):</strong>{' '}
          {plan.activityIds.map((id) => `${name(id)}${done.has(id) ? ' ✓' : ''}`).join('; ')}
        </p>
      )}
      {plan.strategies && <p className="text-sm mt-1"><strong>Estratégias:</strong> {plan.strategies}</p>}

      <H>3. Sumários ({records.sessions.length})</H>
      {records.sessions.length === 0 ? (
        <p className="text-sm">Sem sumários registados.</p>
      ) : (
        <ul className="text-sm space-y-1">
          {[...records.sessions].reverse().map((s) => (
            <li key={s.id} className="break-inside-avoid">
              <strong>{formatDate(s.date)}</strong> — {s.summary}{' '}
              <span className="italic">({s.supportLevel}; autonomia {s.autonomyDegree.toLowerCase()})</span>
            </li>
          ))}
        </ul>
      )}

      <H>4. Progresso na plataforma</H>
      <p className="text-sm">
        {results.length} atividade(s) concluída(s) · {computeMedals(results).length} medalha(s) ·
        tentativas por pergunta: {fmtAttempts(attemptsPerQuestion(results))} · pistas usadas:{' '}
        {results.reduce((n, r) => n + r.hintsUsed, 0)}
      </p>
      <div className="mt-2">
        <CompetencyTable rows={rows} />
      </div>

      <H>5. Estratégias eficazes</H>
      <p className="text-sm whitespace-pre-line">{report.strategies || '–'}</p>

      <H>6. Necessidades de continuidade e propostas</H>
      <p className="text-sm whitespace-pre-line">{report.continuity || '–'}</p>

      <div className="mt-12 grid grid-cols-2 gap-12 text-sm text-center">
        <div className="border-t border-black pt-1">A professora</div>
        <div className="border-t border-black pt-1">O(A) encarregado(a) de educação</div>
      </div>
    </article>
  );
};
