import { extractKeywordsFromJD, matchKeywords } from './keywords';
import { ALL_SKILLS } from '../constants';
import type { SuggestedEdit } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScoringResult {
  overallScore: number;
  breakdown: {
    keywordMatch: number;
    skillsAlignment: number;
    experienceRelevance: number;
    formatCompliance: number;
    jobFit: number; // 0 until AI runs in Phase 3b
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  jdKeywords: string[];
  formatIssues: string[];
}

// ─── Format compliance — 20+ deterministic checks ────────────────────────────

export function scoreFormatCompliance(resumeText: string): { score: number; issues: string[] } {
  let score = 100;
  const issues: string[] = [];

  const checks: { test: boolean; penalty: number; reason: string }[] = [
    // Only penalise if there are many pipes — avoids false positives from bullet separators
    { test: resumeText.includes('|') && resumeText.split('|').length > 5, penalty: 10, reason: 'Table separators detected (|) — ATS may misread columns' },
    { test: resumeText.length > 5000,  penalty: 10, reason: 'Resume may exceed 2 pages' },
    { test: resumeText.length < 400,   penalty: 15, reason: 'Resume text too short — PDF extraction may have failed' },
    { test: !resumeText.match(/education/i),  penalty: 5, reason: 'No Education section detected' },
    { test: !resumeText.match(/experience/i), penalty: 5, reason: 'No Experience section detected' },
    { test: !resumeText.match(/skills?/i),    penalty: 3, reason: 'No Skills section detected' },
    { test: !resumeText.match(/[\w.-]+@[\w.-]+/),        penalty: 10, reason: 'No email address found' },
    { test: !resumeText.match(/\d{3}[\s.-]?\d{3}[\s.-]?\d{4}/), penalty: 5, reason: 'No phone number found' },
    { test: !resumeText.match(/linkedin/i),  penalty: 5, reason: 'No LinkedIn URL found' },
    // Multiple-column detection: many consecutive tabs suggest a table layout
    { test: !!(resumeText.match(/\t.*\t.*\t/)), penalty: 5, reason: 'Multiple columns detected — ATS may scramble order' },
    { test: !resumeText.match(/\d{4}/),  penalty: 5, reason: 'No dates found — ATS expects date ranges' },
    { test: !resumeText.match(/\d+%/),   penalty: 3, reason: 'No quantified achievements (%) found' },
    { test: !resumeText.match(/\$[\d,.]+/), penalty: 2, reason: 'No dollar-value metrics found' },
    { test: resumeText.split('\n').filter(l => l.trim().length > 0).length < 15, penalty: 5, reason: 'Too few content lines — resume may be too sparse' },
  ];

  for (const check of checks) {
    if (check.test) {
      score -= check.penalty;
      issues.push(check.reason);
    }
  }

  return { score: Math.max(0, Math.min(100, score)), issues };
}

// ─── Keyword match score (simple ratio — used in initial computeScore) ────────

export function scoreKeywordMatch(matched: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((matched / total) * 100);
}

// ─── Fuzzy keyword preview (used in re-score preview only) ───────────────────
// Handles plurals, -ing, hyphen variants — no tier weighting.
// AI provides the authoritative tier-weighted + placement-weighted score.

export function scoreKeywordMatchPreview(resumeText: string, jdKeywords: string[]): number {
  if (jdKeywords.length === 0) return 0;
  const resumeLower = resumeText.toLowerCase();
  let matched = 0;
  for (const keyword of jdKeywords) {
    const kw = keyword.toLowerCase();
    const variants = [kw, kw + 's', kw + 'ing', kw.replace('-', ' '), kw.replace(' ', '-')];
    if (variants.some(v => resumeLower.includes(v))) matched++;
  }
  return Math.round((matched / jdKeywords.length) * 100);
}

// ─── Skills alignment ─────────────────────────────────────────────────────────
// Checks what % of the known skills mentioned in the JD appear in the resume.

export function scoreSkillsAlignment(jdText: string, resumeText: string): number {
  const jdLower = jdText.toLowerCase();
  const resumeLower = resumeText.toLowerCase();

  const skillsInJD = ALL_SKILLS.filter((s) => jdLower.includes(s.toLowerCase()));
  if (skillsInJD.length === 0) return 70; // No known skills in JD — default neutral

  const matched = skillsInJD.filter((s) => resumeLower.includes(s.toLowerCase()));
  const raw = Math.round((matched.length / skillsInJD.length) * 100);

  // Boost if both have AI skills overlap — high-value signal
  const aiSkillsInJD = skillsInJD.filter((s) =>
    ['machine learning', 'ai', 'generative ai', 'llm', 'automation', 'rpa', 'python', 'sql'].some(
      (ai) => s.toLowerCase().includes(ai)
    )
  );
  const aiBoost = aiSkillsInJD.filter((s) => resumeLower.includes(s.toLowerCase())).length > 0 ? 5 : 0;

  return Math.min(100, raw + aiBoost);
}

// ─── Experience relevance ─────────────────────────────────────────────────────
// Approximates how relevant the resume's experience section is to the JD keywords.

export function scoreExperienceRelevance(jdKeywords: string[], resumeText: string): number {
  if (jdKeywords.length === 0) return 50;

  // Try to isolate the experience section
  const expSectionMatch = resumeText.match(/experience[\s\S]{0,5000}?(?=education|skills|activities|$)/i);
  const sectionText = expSectionMatch ? expSectionMatch[0] : resumeText;
  const lower = sectionText.toLowerCase();

  const foundInSection = jdKeywords.filter((kw) => lower.includes(kw.toLowerCase()));
  const rawScore = Math.round((foundInSection.length / jdKeywords.length) * 100);

  // Penalize lightly if we fell back to full-doc (section not found)
  const penalty = expSectionMatch ? 0 : -5;
  return Math.max(0, Math.min(100, rawScore + penalty));
}

// ─── Overall score (weighted average of 4 deterministic dimensions) ───────────

function weightedScore(breakdown: ScoringResult['breakdown']): number {
  // jobFit not included — requires AI. Weights redistribute to 4 dimensions.
  return Math.round(
    breakdown.keywordMatch * 0.35 +
    breakdown.skillsAlignment * 0.25 +
    breakdown.experienceRelevance * 0.25 +
    breakdown.formatCompliance * 0.15
  );
}

// ─── Re-score preview (instant, deterministic — while AI re-analysis runs) ───

export interface RescorePreview {
  keywordMatch: number;      // Fuzzy-matched, no tier weighting
  formatCompliance: number;  // Fully deterministic
  formatIssues: string[];
  note: string;              // Always shown: "Preview only — AI re-score is authoritative"
}

export function computeRescorePreview(updatedResumeText: string, jdKeywords: string[]): RescorePreview {
  const { score: formatCompliance, issues: formatIssues } = scoreFormatCompliance(updatedResumeText);
  return {
    keywordMatch: scoreKeywordMatchPreview(updatedResumeText, jdKeywords),
    formatCompliance,
    formatIssues,
    note: 'Preview — keyword & format only. Re-analyze with AI above for authoritative scores on all 5 dimensions.',
  };
}

// ─── Post-edit score interpolation ───────────────────────────────────────────
// Computes the interpolated score based on how many edits were accepted.
// newScore = original + (projected − original) × (acceptedImpact / totalImpact)
// Each dimension interpolated proportionally. Format stays locked.

type BreakdownShape = {
  keywordMatch: number;
  jobFit: number;
  skillsAlignment: number;
  experienceRelevance: number;
  formatCompliance: number;
};

export interface PostEditScoreResult {
  overallScore: number;
  breakdown: BreakdownShape;
  pointsGained: number;  // positive = improvement, negative = regression
}

export function computePostEditScore(
  originalScore: number,
  originalBreakdown: BreakdownShape,
  projectedBreakdown: BreakdownShape,
  edits: SuggestedEdit[],
  acceptedIndices: number[],
): PostEditScoreResult {
  const totalImpact = edits.reduce((sum, e) => sum + (e.impactScore ?? 0), 0);
  const acceptedImpact = acceptedIndices.reduce((sum, i) => sum + (edits[i]?.impactScore ?? 0), 0);
  const ratio = totalImpact > 0 ? Math.min(1, acceptedImpact / totalImpact) : 0;

  const interp = (orig: number, proj: number) =>
    Math.round(Math.min(100, Math.max(0, orig + (proj - orig) * ratio)));

  const newBreakdown: BreakdownShape = {
    keywordMatch:        interp(originalBreakdown.keywordMatch,        projectedBreakdown.keywordMatch),
    jobFit:              interp(originalBreakdown.jobFit,              projectedBreakdown.jobFit),
    skillsAlignment:     interp(originalBreakdown.skillsAlignment,     projectedBreakdown.skillsAlignment),
    experienceRelevance: interp(originalBreakdown.experienceRelevance, projectedBreakdown.experienceRelevance),
    formatCompliance:    originalBreakdown.formatCompliance, // locked — not changed by content edits
  };

  const overall = Math.round(
    newBreakdown.keywordMatch        * 0.35 +
    newBreakdown.skillsAlignment     * 0.25 +
    newBreakdown.experienceRelevance * 0.15 +
    newBreakdown.jobFit              * 0.15 +
    newBreakdown.formatCompliance    * 0.10
  );

  return {
    overallScore: Math.min(100, Math.max(0, overall)),
    breakdown: newBreakdown,
    pointsGained: overall - originalScore,
  };
}

// ─── Main scoring entry point ─────────────────────────────────────────────────

export function computeScore(jdText: string, resumeText: string): ScoringResult {
  const jdKeywords = extractKeywordsFromJD(jdText);
  const { matched, missing } = matchKeywords(jdKeywords, resumeText);

  const { score: formatCompliance, issues: formatIssues } = scoreFormatCompliance(resumeText);

  const breakdown: ScoringResult['breakdown'] = {
    keywordMatch: scoreKeywordMatch(matched.length, jdKeywords.length),
    skillsAlignment: scoreSkillsAlignment(jdText, resumeText),
    experienceRelevance: scoreExperienceRelevance(jdKeywords, resumeText),
    formatCompliance,
    jobFit: 0, // populated by AI in Phase 3b
  };

  return {
    overallScore: weightedScore(breakdown),
    breakdown,
    matchedKeywords: matched,
    missingKeywords: missing,
    jdKeywords,
    formatIssues,
  };
}
