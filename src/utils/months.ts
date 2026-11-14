import { MONTHLY_MODULES } from '../data/curriculumData';
import { MonthId } from '../types/pedagogical';

/** Display name of a month ("marco" → "Março"). */
export function monthName(id: MonthId): string {
  return MONTHLY_MODULES.find((m) => m.id === id)?.name ?? id;
}
