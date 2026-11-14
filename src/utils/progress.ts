import type { ActivityResult } from '../types/pedagogical';

/**
 * Points and medals are not stored: they follow from the student's results,
 * so resetting progress (deleting the results) resets them too.
 */
export const POINTS_PER_ACTIVITY = 20;

export function computePoints(results: ActivityResult[]): number {
  return results.length * POINTS_PER_ACTIVITY;
}

export function computeMedals(results: ActivityResult[]): string[] {
  const medals: string[] = [];
  if (results.length >= 1) medals.push('primeira-estrela');
  if (results.length >= 3) medals.push('explorador-palavras');
  if (
    results.some(
      (r) =>
        r.competency === 'compreensao_textos' ||
        r.competency === 'compreensao_instrucoes'
    )
  ) {
    medals.push('detetive-atento');
  }
  if (results.some((r) => r.competency === 'organizacao_discurso')) {
    medals.push('contador-historias');
  }
  if (results.some((r) => r.competency === 'producao_escrita')) {
    medals.push('escritor-criativo');
  }
  if (results.some((r) => r.autonomyDegree === 'Autónomo')) {
    medals.push('aprendiz-autonomo');
  }
  return medals;
}

/** Average attempts per question: 1.0 means every answer was right first time. */
export function attemptsPerQuestion(results: ActivityResult[]): number | null {
  const questions = results.reduce((n, r) => n + r.totalCount, 0);
  if (questions === 0) return null;
  const attempts = results.reduce((n, r) => n + r.attempts, 0);
  return attempts / questions;
}

export const formatDate = (iso: string) =>
  new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString(
    'pt-PT'
  );

/** Local calendar day (YYYY-MM-DD) of a timestamp. */
export const localDay = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const todayLocal = () => localDay(new Date().toISOString());
