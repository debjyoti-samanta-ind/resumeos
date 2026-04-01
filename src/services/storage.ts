import type { Experience, ResumeVersion, JDAnalysis, AppSettings, ApplicationEntry, ApplicationStatus } from '../types';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../constants';
import { seedData } from '../constants/seedData';

// ─── Generic helpers ──────────────────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Experiences ──────────────────────────────────────────────────────────────

export function loadExperiences(): Experience[] {
  return load<Experience[]>(STORAGE_KEYS.EXPERIENCES, []);
}

export function saveExperiences(experiences: Experience[]): void {
  save(STORAGE_KEYS.EXPERIENCES, experiences);
}

export function addExperience(exp: Experience): Experience[] {
  const all = loadExperiences();
  const updated = [...all, exp];
  saveExperiences(updated);
  return updated;
}

export function updateExperience(exp: Experience): Experience[] {
  const all = loadExperiences();
  const updated = all.map((e) => (e.id === exp.id ? exp : e));
  saveExperiences(updated);
  return updated;
}

export function deleteExperience(id: string): Experience[] {
  const all = loadExperiences();
  const updated = all.filter((e) => e.id !== id);
  saveExperiences(updated);
  return updated;
}

// ─── Resume Versions ──────────────────────────────────────────────────────────

export function loadResumes(): ResumeVersion[] {
  return load<ResumeVersion[]>(STORAGE_KEYS.RESUMES, []);
}

export function saveResumes(resumes: ResumeVersion[]): void {
  save(STORAGE_KEYS.RESUMES, resumes);
}

export function addResume(resume: ResumeVersion): ResumeVersion[] {
  const all = loadResumes();
  const updated = [...all, resume];
  saveResumes(updated);
  return updated;
}

export function updateResume(resume: ResumeVersion): ResumeVersion[] {
  const all = loadResumes();
  const updated = all.map((r) => (r.id === resume.id ? resume : r));
  saveResumes(updated);
  return updated;
}

export function deleteResume(id: string): ResumeVersion[] {
  const all = loadResumes();
  const updated = all.filter((r) => r.id !== id);
  saveResumes(updated);
  return updated;
}

// ─── JD Analyses ─────────────────────────────────────────────────────────────

export function loadAnalyses(): JDAnalysis[] {
  return load<JDAnalysis[]>(STORAGE_KEYS.ANALYSES, []);
}

export function saveAnalyses(analyses: JDAnalysis[]): void {
  save(STORAGE_KEYS.ANALYSES, analyses);
}

export function addAnalysis(analysis: JDAnalysis): JDAnalysis[] {
  const all = loadAnalyses();
  const updated = [...all, analysis];
  saveAnalyses(updated);
  return updated;
}

export function deleteAnalysis(id: string): JDAnalysis[] {
  const all = loadAnalyses();
  const updated = all.filter((a) => a.id !== id);
  saveAnalyses(updated);
  return updated;
}

// ─── Applications ────────────────────────────────────────────────────────

export function loadApplications(): ApplicationEntry[] {
  return load<ApplicationEntry[]>(STORAGE_KEYS.APPLICATIONS, []);
}

export function saveApplications(applications: ApplicationEntry[]): void {
  save(STORAGE_KEYS.APPLICATIONS, applications);
}

export function addApplication(entry: ApplicationEntry): ApplicationEntry[] {
  const all = loadApplications();
  const updated = [...all, entry];
  saveApplications(updated);
  return updated;
}

export function updateApplication(entry: ApplicationEntry): ApplicationEntry[] {
  const all = loadApplications();
  const updated = all.map((a) => (a.id === entry.id ? { ...entry, updatedAt: new Date().toISOString() } : a));
  saveApplications(updated);
  return updated;
}

export function deleteApplication(id: string): ApplicationEntry[] {
  const all = loadApplications();
  const updated = all.filter((a) => a.id !== id);
  saveApplications(updated);
  return updated;
}

export function updateApplicationStatus(id: string, status: ApplicationStatus): ApplicationEntry[] {
  const all = loadApplications();
  const updated = all.map((a) =>
    a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a
  );
  saveApplications(updated);
  return updated;
}

export function nextSerialNo(): number {
  const all = loadApplications();
  return all.length === 0 ? 1 : Math.max(...all.map((a) => a.serialNo)) + 1;
}

// ─── Settings ────────────────────────────────────────────────────────────────

export function loadSettings(): AppSettings {
  return load<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function saveSettings(settings: AppSettings): void {
  save(STORAGE_KEYS.SETTINGS, settings);
}

// ─── Seed & Reset ────────────────────────────────────────────────────────────

/** Called on app startup. Populates experiences from seed data if localStorage is empty. */
export function initializeStorage(): void {
  const existing = localStorage.getItem(STORAGE_KEYS.EXPERIENCES);
  if (existing === null) {
    saveExperiences(seedData);
  }
}

/** Wipes all experience/resume/analysis data and reloads seed data. Settings are preserved. */
export function resetToSeedData(): void {
  saveExperiences(seedData);
  saveResumes([]);
  saveAnalyses([]);
}

/** Exports all data as a JSON string for backup. */
export function exportAllData(): string {
  return JSON.stringify(
    {
      experiences: loadExperiences(),
      resumes: loadResumes(),
      analyses: loadAnalyses(),
      settings: loadSettings(),
      exportedAt: new Date().toISOString(),
    },
    null,
    2
  );
}

/** Restores all data from a JSON backup string. Returns error message or null on success. */
export function importAllData(json: string): string | null {
  try {
    const data = JSON.parse(json) as {
      experiences?: Experience[];
      resumes?: ResumeVersion[];
      analyses?: JDAnalysis[];
      settings?: AppSettings;
    };
    if (data.experiences) saveExperiences(data.experiences);
    if (data.resumes) saveResumes(data.resumes);
    if (data.analyses) saveAnalyses(data.analyses);
    if (data.settings) saveSettings(data.settings);
    return null;
  } catch {
    return 'Invalid JSON file. Please upload a valid ResumeOS backup.';
  }
}
