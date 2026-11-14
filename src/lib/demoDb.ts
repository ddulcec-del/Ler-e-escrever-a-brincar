/**
 * Local demo backend: the same functions as supabaseDb.ts, but everything is
 * kept in this browser's localStorage. Used when Supabase isn't configured,
 * so the whole app (including the teacher area) can be tried locally.
 */
import type { Session } from '@supabase/supabase-js';
import type {
  ActivityResult,
  FinalReport,
  GlossaryEntry,
  IndividualPlan,
  InitialAssessment,
  PedagogicalActivity,
  SessionRecord,
  StudentProfile,
} from '../types/pedagogical';
import {
  TEACHER_EMAIL_DOMAIN,
  bundledActivities,
  defaultPlan,
  usernameToEmail,
} from './supabaseDb';

export { TEACHER_EMAIL_DOMAIN, bundledActivities, defaultPlan, usernameToEmail };

export const DEMO_USERNAME = 'professora';
export const DEMO_PASSWORD = 'demo';

const STORE_KEY = 'leb_demo_db_v1';
const SESSION_KEY = 'leb_demo_session_v1';

type StoredSession = SessionRecord & { createdAt: string };

interface Store {
  students: StudentProfile[];
  plans: IndividualPlan[];
  assessments: InitialAssessment[];
  sessions: StoredSession[];
  reports: FinalReport[];
  activities: PedagogicalActivity[];
  results: ActivityResult[];
  glossary: GlossaryEntry[];
}

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
const uuid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
const now = () => new Date().toISOString();

let cache: Store | null = null;
let loading: Promise<Store> | null = null;

/** First visit: the original exercises and one example student. */
async function seed(): Promise<Store> {
  const tiago: StudentProfile = {
    id: uuid(),
    name: 'Tiago',
    age: 8,
    schoolYear: '2.º ano',
    profile: 'perfil3',
    startDate: now().slice(0, 10),
    observations:
      'Aluno de exemplo do modo de demonstração. Gosta de histórias sobre animais.',
  };
  return {
    students: [tiago],
    plans: [defaultPlan(tiago)],
    assessments: [],
    sessions: [],
    reports: [],
    activities: await bundledActivities(),
    results: [],
    glossary: [],
  };
}

async function db(): Promise<Store> {
  if (cache) return cache;
  if (!loading) {
    loading = (async () => {
      try {
        const raw = localStorage.getItem(STORE_KEY);
        if (raw) return JSON.parse(raw) as Store;
      } catch {
        // Unreadable data: start again.
      }
      const fresh = await seed();
      persist(fresh);
      return fresh;
    })();
  }
  cache = await loading;
  return cache;
}

function persist(store: Store) {
  cache = store;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    throw new Error('O navegador não deixou guardar os dados (armazenamento cheio ou bloqueado).');
  }
}

async function update(fn: (s: Store) => void) {
  const s = await db();
  fn(s);
  persist(s);
}

/** Wipes the demo data; the next load starts from the example again. */
export function resetDemo() {
  try {
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // nothing to clear
  }
  cache = null;
  loading = null;
}

// ------------------------------------------------------------------ auth

const listeners = new Set<(s: Session | null) => void>();

const fakeSession = (email: string) =>
  ({ user: { email } }) as unknown as Session;

export async function signIn(username: string, password: string) {
  if (
    username.trim().toLowerCase() !== DEMO_USERNAME ||
    password !== DEMO_PASSWORD
  ) {
    throw new Error('Invalid login credentials');
  }
  const email = usernameToEmail(username);
  localStorage.setItem(SESSION_KEY, email);
  listeners.forEach((cb) => cb(fakeSession(email)));
}

export async function signOut() {
  localStorage.removeItem(SESSION_KEY);
  listeners.forEach((cb) => cb(null));
}

export async function getSession(): Promise<Session | null> {
  const email = localStorage.getItem(SESSION_KEY);
  return email ? fakeSession(email) : null;
}

export function onAuthChange(cb: (session: Session | null) => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

// -------------------------------------------------------------- students

export async function listStudents(): Promise<StudentProfile[]> {
  return clone((await db()).students).sort((a, b) =>
    a.name.localeCompare(b.name, 'pt')
  );
}

export async function createStudent(
  s: Omit<StudentProfile, 'id'>
): Promise<StudentProfile> {
  const student = { ...s, id: uuid() };
  await update((d) => {
    d.students.push(student);
    d.plans.push(defaultPlan(student));
  });
  return clone(student);
}

export async function updateStudent(s: StudentProfile) {
  await update((d) => {
    d.students = d.students.map((x) => (x.id === s.id ? clone(s) : x));
  });
}

export async function deleteStudent(id: string) {
  await update((d) => {
    d.students = d.students.filter((x) => x.id !== id);
    d.plans = d.plans.filter((x) => x.studentId !== id);
    d.assessments = d.assessments.filter((x) => x.studentId !== id);
    d.sessions = d.sessions.filter((x) => x.studentId !== id);
    d.reports = d.reports.filter((x) => x.studentId !== id);
    d.results = d.results.filter((x) => x.studentId !== id);
    d.glossary = d.glossary.filter((x) => x.studentId !== id);
  });
}

// ----------------------------------------------------------------- plans

export async function listPlans(): Promise<IndividualPlan[]> {
  return clone((await db()).plans);
}

export async function getPlan(studentId: string): Promise<IndividualPlan | null> {
  const p = (await db()).plans.find((x) => x.studentId === studentId);
  return p ? clone(p) : null;
}

export async function savePlan(p: IndividualPlan) {
  await update((d) => {
    d.plans = [...d.plans.filter((x) => x.studentId !== p.studentId), clone(p)];
  });
}

// ----------------------------------------------------------- assessments

export async function getAssessment(
  studentId: string
): Promise<InitialAssessment | null> {
  const a = (await db()).assessments.find((x) => x.studentId === studentId);
  return a ? clone(a) : null;
}

export async function saveAssessment(a: InitialAssessment) {
  await update((d) => {
    d.assessments = [
      ...d.assessments.filter((x) => x.studentId !== a.studentId),
      clone(a),
    ];
  });
}

// -------------------------------------------------------------- sessions

export async function listSessions(studentId: string): Promise<SessionRecord[]> {
  return clone(
    (await db()).sessions
      .filter((s) => s.studentId === studentId)
      .sort(
        (a, b) =>
          b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)
      )
  ).map(({ createdAt: _c, ...s }) => s);
}

export async function saveSession(s: SessionRecord) {
  await update((d) => {
    if (s.id) {
      d.sessions = d.sessions.map((x) =>
        x.id === s.id ? { ...clone(s), createdAt: x.createdAt } : x
      );
    } else {
      d.sessions.push({ ...clone(s), id: uuid(), createdAt: now() });
    }
  });
}

export async function deleteSession(id: string) {
  await update((d) => {
    d.sessions = d.sessions.filter((x) => x.id !== id);
  });
}

// --------------------------------------------------------------- reports

export async function getReport(studentId: string): Promise<FinalReport | null> {
  const r = (await db()).reports.find((x) => x.studentId === studentId);
  return r ? clone(r) : null;
}

export async function saveReport(r: FinalReport) {
  await update((d) => {
    d.reports = [
      ...d.reports.filter((x) => x.studentId !== r.studentId),
      { ...clone(r), updatedAt: now() },
    ];
  });
}

// ------------------------------------------------------------ activities

export async function listActivities(opts: { includeHidden?: boolean } = {}) {
  return clone(
    (await db()).activities
      .filter((a) => opts.includeHidden || a.published !== false)
      .sort(
        (a, b) =>
          (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id.localeCompare(b.id)
      )
  );
}

export async function saveActivity(a: PedagogicalActivity) {
  await update((d) => {
    d.activities = [...d.activities.filter((x) => x.id !== a.id), clone(a)];
  });
}

export async function setActivityPublished(id: string, published: boolean) {
  await update((d) => {
    d.activities = d.activities.map((x) => (x.id === id ? { ...x, published } : x));
  });
}

export async function deleteActivity(id: string) {
  await update((d) => {
    d.activities = d.activities.filter((x) => x.id !== id);
  });
}

export async function importMissingActivities(existingIds: string[]): Promise<number> {
  const have = new Set(existingIds);
  const missing = (await bundledActivities()).filter((a) => !have.has(a.id));
  if (missing.length > 0) {
    await update((d) => {
      d.activities.push(...missing);
    });
  }
  return missing.length;
}

// --------------------------------------------------------------- results

export async function listResults(studentId?: string): Promise<ActivityResult[]> {
  return clone(
    (await db()).results
      .filter((r) => !studentId || r.studentId === studentId)
      .sort((a, b) => b.date.localeCompare(a.date))
  );
}

export async function addResult(
  r: Omit<ActivityResult, 'id' | 'date'>
): Promise<ActivityResult> {
  const saved: ActivityResult = { ...r, id: uuid(), date: now() };
  await update((d) => {
    d.results.push(saved);
  });
  return clone(saved);
}

export async function resetProgress(studentId: string) {
  await update((d) => {
    d.results = d.results.filter((x) => x.studentId !== studentId);
  });
}

// -------------------------------------------------------------- glossary

export async function listGlossary(studentId: string): Promise<GlossaryEntry[]> {
  return clone(
    (await db()).glossary
      .filter((g) => g.studentId === studentId)
      .reverse()
  );
}

export async function addGlossaryEntry(
  e: Omit<GlossaryEntry, 'id' | 'dateAdded'>
): Promise<GlossaryEntry> {
  const saved: GlossaryEntry = {
    ...e,
    id: uuid(),
    dateAdded: now().slice(0, 10),
  };
  await update((d) => {
    d.glossary.push(saved);
  });
  return clone(saved);
}

export async function deleteGlossaryEntry(id: string) {
  await update((d) => {
    d.glossary = d.glossary.filter((x) => x.id !== id);
  });
}
