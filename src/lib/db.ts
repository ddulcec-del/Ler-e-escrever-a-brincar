/**
 * The data layer the app uses. With Supabase configured, data is shared in
 * the database (supabaseDb.ts). Without it, the app runs in a local demo
 * mode that keeps everything in this browser (demoDb.ts).
 */
import * as demo from './demoDb';
import * as remote from './supabaseDb';
import { isSupabaseConfigured } from './supabase';

export const isDemoMode = !isSupabaseConfigured;
export { DEMO_PASSWORD, DEMO_USERNAME, resetDemo } from './demoDb';

// Typed as the Supabase module, so the demo must offer exactly the same API.
const impl: typeof remote = isSupabaseConfigured ? remote : demo;

export const {
  TEACHER_EMAIL_DOMAIN,
  usernameToEmail,
  signIn,
  signOut,
  getSession,
  onAuthChange,
  listStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  defaultPlan,
  listPlans,
  getPlan,
  savePlan,
  getAssessment,
  saveAssessment,
  listSessions,
  saveSession,
  deleteSession,
  getReport,
  saveReport,
  listActivities,
  saveActivity,
  setActivityPublished,
  deleteActivity,
  bundledActivities,
  importMissingActivities,
  listResults,
  addResult,
  resetProgress,
  listGlossary,
  addGlossaryEntry,
  deleteGlossaryEntry,
} = impl;
