/**
 * All reads and writes to Supabase go through here. Postgres columns are
 * snake_case; the app's types (src/types/pedagogical.ts) are camelCase.
 */
import type { Session } from '@supabase/supabase-js';
import { INTERVENTION_PROFILES } from '../data/curriculumData';
import type {
  ActivityResult,
  AssessmentRating,
  CompetencyId,
  DifficultyLevel,
  ExerciseQuestion,
  FinalReport,
  GlossaryEntry,
  IndividualPlan,
  InitialAssessment,
  InterventionProfile,
  MonthId,
  PedagogicalActivity,
  SessionAutonomy,
  SessionRecord,
  SchoolYear,
  StudentProfile,
  SupportLevel,
} from '../types/pedagogical';
import { supabase } from './supabase';

type Row = Record<string, unknown>;

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

const today = () => new Date().toISOString().slice(0, 10);

// ------------------------------------------------------------------ auth

/**
 * The teacher signs in with a plain username. Supabase Auth needs an e-mail,
 * so "dulce" becomes "dulce@example.com". A full e-mail is used as typed.
 */
export const TEACHER_EMAIL_DOMAIN = 'example.com';

export function usernameToEmail(username: string): string {
  const u = username.trim().toLowerCase();
  return u.includes('@') ? u : `${u}@${TEACHER_EMAIL_DOMAIN}`;
}

export async function signIn(username: string, password: string) {
  const { error } = await supabase().auth.signInWithPassword({
    email: usernameToEmail(username),
    password,
  });
  if (error) throw new Error(error.message);
}

export async function signOut() {
  await supabase().auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase().auth.getSession();
  return data.session;
}

export function onAuthChange(cb: (session: Session | null) => void) {
  const { data } = supabase().auth.onAuthStateChange((_event, session) =>
    cb(session)
  );
  return () => data.subscription.unsubscribe();
}

// -------------------------------------------------------------- students

const toStudent = (r: Row): StudentProfile => ({
  id: r.id as string,
  name: r.name as string,
  age: r.age as number,
  schoolYear: r.school_year as SchoolYear,
  profile: r.profile as InterventionProfile,
  startDate: r.start_date as string,
  observations: (r.observations as string) ?? '',
});

export async function listStudents(): Promise<StudentProfile[]> {
  const data = check(
    await supabase().from('students').select('*').order('name')
  );
  return (data as Row[]).map(toStudent);
}

/** Creates the student together with a starting plan for their profile. */
export async function createStudent(
  s: Omit<StudentProfile, 'id'>
): Promise<StudentProfile> {
  const row = check(
    await supabase()
      .from('students')
      .insert({
        name: s.name,
        age: s.age,
        school_year: s.schoolYear,
        profile: s.profile,
        start_date: s.startDate,
        observations: s.observations,
      })
      .select()
      .single()
  );
  const student = toStudent(row as Row);
  await savePlan(defaultPlan(student));
  return student;
}

export async function updateStudent(s: StudentProfile) {
  check(
    await supabase()
      .from('students')
      .update({
        name: s.name,
        age: s.age,
        school_year: s.schoolYear,
        profile: s.profile,
        start_date: s.startDate,
        observations: s.observations,
      })
      .eq('id', s.id)
  );
}

/** Deletes the student; the database cascades to everything of theirs. */
export async function deleteStudent(id: string) {
  check(await supabase().from('students').delete().eq('id', id));
}

// ----------------------------------------------------------------- plans

export function defaultPlan(student: StudentProfile): IndividualPlan {
  return {
    studentId: student.id,
    priorityCompetencies: [
      ...INTERVENTION_PROFILES[student.profile].defaultCompetencies,
    ],
    difficultyLevel: 1,
    activityIds: [],
    objectives: [],
    frequency: '',
    strategies: '',
    notes: '',
  };
}

const toPlan = (r: Row): IndividualPlan => ({
  studentId: r.student_id as string,
  priorityCompetencies: (r.priority_competencies as CompetencyId[]) ?? [],
  difficultyLevel: (r.difficulty_level as DifficultyLevel) ?? 1,
  activityIds: (r.activity_ids as string[]) ?? [],
  objectives: (r.objectives as string[]) ?? [],
  frequency: (r.frequency as string) ?? '',
  strategies: (r.strategies as string) ?? '',
  notes: (r.notes as string) ?? '',
});

export async function listPlans(): Promise<IndividualPlan[]> {
  const data = check(await supabase().from('plans').select('*'));
  return (data as Row[]).map(toPlan);
}

export async function getPlan(studentId: string): Promise<IndividualPlan | null> {
  const data = check(
    await supabase()
      .from('plans')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle()
  );
  return data ? toPlan(data as Row) : null;
}

export async function savePlan(p: IndividualPlan) {
  check(
    await supabase().from('plans').upsert({
      student_id: p.studentId,
      priority_competencies: p.priorityCompetencies,
      difficulty_level: p.difficultyLevel,
      activity_ids: p.activityIds,
      objectives: p.objectives,
      frequency: p.frequency,
      strategies: p.strategies,
      notes: p.notes,
      updated_at: new Date().toISOString(),
    })
  );
}

// ----------------------------------------------------------- assessments

export async function getAssessment(
  studentId: string
): Promise<InitialAssessment | null> {
  const r = check(
    await supabase()
      .from('assessments')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle()
  ) as Row | null;
  if (!r) return null;
  return {
    studentId,
    date: r.date as string,
    ratings: (r.ratings as Partial<Record<CompetencyId, AssessmentRating>>) ?? {},
    notes: (r.notes as string) ?? '',
  };
}

export async function saveAssessment(a: InitialAssessment) {
  check(
    await supabase().from('assessments').upsert({
      student_id: a.studentId,
      date: a.date || today(),
      ratings: a.ratings,
      notes: a.notes,
      updated_at: new Date().toISOString(),
    })
  );
}

// -------------------------------------------------------------- sessions

const toSession = (r: Row): SessionRecord => ({
  id: r.id as string,
  studentId: r.student_id as string,
  date: r.date as string,
  activityIds: (r.activity_ids as string[]) ?? [],
  otherActivities: (r.other_activities as string) ?? '',
  competencies: (r.competencies as CompetencyId[]) ?? [],
  summary: (r.summary as string) ?? '',
  supportLevel: r.support_level as SupportLevel,
  autonomyDegree: r.autonomy_degree as SessionAutonomy,
  teacherNotes: (r.teacher_notes as string) ?? '',
  nextPriorities: (r.next_priorities as string) ?? '',
});

export async function listSessions(studentId: string): Promise<SessionRecord[]> {
  const data = check(
    await supabase()
      .from('sessions')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
  );
  return (data as Row[]).map(toSession);
}

/** Inserts when `id` is empty, otherwise updates. */
export async function saveSession(s: SessionRecord) {
  const row = {
    student_id: s.studentId,
    date: s.date,
    activity_ids: s.activityIds,
    other_activities: s.otherActivities,
    competencies: s.competencies,
    summary: s.summary,
    support_level: s.supportLevel,
    autonomy_degree: s.autonomyDegree,
    teacher_notes: s.teacherNotes,
    next_priorities: s.nextPriorities,
  };
  if (s.id) {
    check(await supabase().from('sessions').update(row).eq('id', s.id));
  } else {
    check(await supabase().from('sessions').insert(row));
  }
}

export async function deleteSession(id: string) {
  check(await supabase().from('sessions').delete().eq('id', id));
}

// --------------------------------------------------------------- reports

export async function getReport(studentId: string): Promise<FinalReport | null> {
  const r = check(
    await supabase()
      .from('reports')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle()
  ) as Row | null;
  if (!r) return null;
  return {
    studentId,
    strategies: (r.strategies as string) ?? '',
    continuity: (r.continuity as string) ?? '',
    updatedAt: r.updated_at as string,
  };
}

export async function saveReport(r: FinalReport) {
  check(
    await supabase().from('reports').upsert({
      student_id: r.studentId,
      strategies: r.strategies,
      continuity: r.continuity,
      updated_at: new Date().toISOString(),
    })
  );
}

// ------------------------------------------------------------ activities

const toActivity = (r: Row): PedagogicalActivity => ({
  id: r.id as string,
  number: (r.number as number | null) ?? undefined,
  title: r.title as string,
  gameTitle: (r.game_title as string | null) || undefined,
  month: r.month as MonthId,
  competency: r.competency as CompetencyId,
  curriculumArea:
    (r.curriculum_area as PedagogicalActivity['curriculumArea'] | null) ??
    undefined,
  type: r.type as PedagogicalActivity['type'],
  pedagogicalObjective: (r.pedagogical_objective as string) ?? '',
  simpleInstruction: (r.simple_instruction as string) ?? '',
  demonstrationExample: (r.demonstration_example as string) ?? '',
  levels: normaliseLevels(r.levels),
  published: r.published as boolean,
  sortOrder: r.sort_order as number,
});

function normaliseLevels(raw: unknown): PedagogicalActivity['levels'] {
  const obj = (raw ?? {}) as Record<string, ExerciseQuestion[]>;
  return { 1: obj['1'] ?? [], 2: obj['2'] ?? [], 3: obj['3'] ?? [] };
}

const fromActivity = (a: PedagogicalActivity, sortOrder: number) => ({
  id: a.id,
  number: a.number ?? null,
  title: a.title,
  game_title: a.gameTitle || null,
  month: a.month,
  competency: a.competency,
  curriculum_area: a.curriculumArea ?? null,
  type: a.type,
  pedagogical_objective: a.pedagogicalObjective,
  simple_instruction: a.simpleInstruction,
  demonstration_example: a.demonstrationExample,
  levels: a.levels,
  published: a.published ?? true,
  sort_order: sortOrder,
  updated_at: new Date().toISOString(),
});

/**
 * Students only ever see published activities. The filter is explicit
 * because a logged-in teacher browsing the public pages could read all.
 */
export async function listActivities(opts: { includeHidden?: boolean } = {}) {
  let q = supabase().from('activities').select('*');
  if (!opts.includeHidden) q = q.eq('published', true);
  const data = check(await q.order('sort_order').order('id'));
  return (data as Row[]).map(toActivity);
}

export async function saveActivity(a: PedagogicalActivity) {
  check(
    await supabase()
      .from('activities')
      .upsert(fromActivity(a, a.sortOrder ?? 0))
  );
}

export async function setActivityPublished(id: string, published: boolean) {
  check(
    await supabase()
      .from('activities')
      .update({ published, updated_at: new Date().toISOString() })
      .eq('id', id)
  );
}

export async function deleteActivity(id: string) {
  check(await supabase().from('activities').delete().eq('id', id));
}

/** The activities that ship with the app (loaded on demand, not bundled). */
export async function bundledActivities(): Promise<PedagogicalActivity[]> {
  const { PEDAGOGICAL_ACTIVITIES } = await import('../data/seedActivities');
  return PEDAGOGICAL_ACTIVITIES.map((a, i) => ({
    ...a,
    published: true,
    sortOrder: (i + 1) * 10,
  }));
}

/**
 * Adds the bundled activities that are not in the database (all of them the
 * first time; later, the ones the teacher deleted). Never overwrites edits.
 */
export async function importMissingActivities(existingIds: string[]): Promise<number> {
  const have = new Set(existingIds);
  const missing = (await bundledActivities()).filter((a) => !have.has(a.id));
  if (missing.length === 0) return 0;
  check(
    await supabase()
      .from('activities')
      .insert(missing.map((a) => fromActivity(a, a.sortOrder ?? 0)))
  );
  return missing.length;
}

// --------------------------------------------------------------- results

const toResult = (r: Row): ActivityResult => ({
  id: r.id as string,
  studentId: r.student_id as string,
  activityId: r.activity_id as string,
  activityTitle: r.activity_title as string,
  month: r.month as MonthId,
  competency: r.competency as CompetencyId,
  difficultyLevel: r.difficulty_level as DifficultyLevel,
  date: r.created_at as string,
  attempts: r.attempts as number,
  correctCount: r.correct_count as number,
  totalCount: r.total_count as number,
  hintsUsed: r.hints_used as number,
  autonomyDegree: r.autonomy_degree as ActivityResult['autonomyDegree'],
});

/** Results of one student, or of everyone when no id is given. */
export async function listResults(studentId?: string): Promise<ActivityResult[]> {
  let q = supabase().from('activity_results').select('*');
  if (studentId) q = q.eq('student_id', studentId);
  const data = check(await q.order('created_at', { ascending: false }));
  return (data as Row[]).map(toResult);
}

export async function addResult(
  r: Omit<ActivityResult, 'id' | 'date'>
): Promise<ActivityResult> {
  const row = check(
    await supabase()
      .from('activity_results')
      .insert({
        student_id: r.studentId,
        activity_id: r.activityId,
        activity_title: r.activityTitle,
        month: r.month,
        competency: r.competency,
        difficulty_level: r.difficultyLevel,
        attempts: r.attempts,
        correct_count: r.correctCount,
        total_count: r.totalCount,
        hints_used: r.hintsUsed,
        autonomy_degree: r.autonomyDegree,
      })
      .select()
      .single()
  );
  return toResult(row as Row);
}

/** Clears results, and so points and medals. The glossary is kept. */
export async function resetProgress(studentId: string) {
  check(
    await supabase().from('activity_results').delete().eq('student_id', studentId)
  );
}

// -------------------------------------------------------------- glossary

const toGlossary = (r: Row): GlossaryEntry => ({
  id: r.id as string,
  studentId: r.student_id as string,
  word: r.word as string,
  meaning: r.meaning as string,
  example: (r.example as string) ?? '',
  dateAdded: (r.created_at as string).slice(0, 10),
});

export async function listGlossary(studentId: string): Promise<GlossaryEntry[]> {
  const data = check(
    await supabase()
      .from('glossary_entries')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
  );
  return (data as Row[]).map(toGlossary);
}

export async function addGlossaryEntry(
  e: Omit<GlossaryEntry, 'id' | 'dateAdded'>
): Promise<GlossaryEntry> {
  const row = check(
    await supabase()
      .from('glossary_entries')
      .insert({
        student_id: e.studentId,
        word: e.word,
        meaning: e.meaning,
        example: e.example,
      })
      .select()
      .single()
  );
  return toGlossary(row as Row);
}

export async function deleteGlossaryEntry(id: string) {
  check(await supabase().from('glossary_entries').delete().eq('id', id));
}
