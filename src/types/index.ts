// ============ FUNCTION & INDUSTRY TAGS ============

export type FunctionTag =
  | 'Product Management'
  | 'Strategy'
  | 'Operations'
  | 'Analytics & Insights'
  | 'Program Management'
  | 'General';

export type IndustryTag =
  | 'Healthcare'
  | 'Pharma'
  | 'Tech'
  | 'Finance'
  | 'Consulting'
  | 'Consumer Goods'
  | 'General';

// ============ EXPERIENCE REPOSITORY ============

export interface BulletVariant {
  id: string;
  function: FunctionTag;
  text: string;
}

export interface Achievement {
  id: string;
  coreDescription: string;
  projectContext: {
    problem: string;
    approach: string;
    tools: string[];
    teamSize: string;
    stakeholders: string[];
    timeline: string;
    outcome: string;
  };
  variants: BulletVariant[];
  metrics: string[];
  skills: string[];
  keywords: string[];
  aiKeywords: string[];
  isPolished: boolean;
}

export interface Experience {
  id: string;
  type: 'role' | 'project' | 'education' | 'certification' | 'leadership';
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string | null;
  summary: string;
  achievements: Achievement[];
  functions: FunctionTag[];
  industries: IndustryTag[];
  skills: string[];
  strengthRating: 1 | 2 | 3;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ============ RESUME VERSIONS ============

export interface ResumeHeader {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  location: string;
}

export interface ResumeSectionEntry {
  experienceId: string;
  selectedBulletVariantIds: string[];
  order: number;
}

export interface ResumeSection {
  type: 'education' | 'experience' | 'skills' | 'leadership';
  entries: ResumeSectionEntry[];
}

export interface ResumeVersion {
  id: string;
  name: string;
  targetFunction: FunctionTag;
  targetIndustry: IndustryTag;
  header: ResumeHeader;
  sections: ResumeSection[];
  createdAt: string;
  updatedAt: string;
}

// ============ JD ANALYSIS ============

export interface JobFitAnalysis {
  seniorityMatch: {
    jdLevel: 'intern' | 'entry' | 'mid' | 'senior' | 'lead' | 'director' | 'vp';
    resumeLevel: 'intern' | 'entry' | 'mid' | 'senior' | 'lead' | 'director' | 'vp';
    isMatch: boolean;
    explanation: string;
  };
  functionFit: {
    jdFunction: string;
    closestExperiences: string[];
    transferableAngles: string[];
    gapNarrative: string;
    score: number;
  };
  industryFit: {
    jdIndustry: string;
    relevantExperiences: string[];
    transferableAngles: string[];
    score: number;
  };
  experienceYearsFit: {
    jdRequirement: string;
    candidateYears: number;
    isMatch: boolean;
    explanation: string;
  };
  educationFit: {
    meetsRequirements: boolean;
    strengths: string[];
    gaps: string[];
  };
  narrativeCoherence: {
    score: number;
    currentNarrative: string;
    suggestedNarrative: string;
    narrativeGaps: string[];
  };
  overallFitVerdict: 'strong' | 'moderate' | 'stretch' | 'weak';
  topStrengths: string[];
  topConcerns: string[];
  positioningAdvice: string;
}

export interface Gap {
  area: string;
  severity: 'critical' | 'moderate' | 'minor';
  suggestion: string;
  relevantAchievementIds: string[];
}

export interface SuggestedEdit {
  type: 'rewrite' | 'swap' | 'add' | 'restructure';
  target: string;
  current: string;               // Current text (empty for 'add' type)
  suggested: string;             // Suggested replacement or addition
  reason: string;
  keywordsAdded: string[];
  keywordTiers: number[];        // Tier of each keyword added (1, 2, or 3)
  gapFilled: string;             // Which gap this addresses (empty if none)
  gapSeverity: 'critical' | 'moderate' | 'minor' | 'none';
  impactScore: number;           // (T1×3)+(T2×2)+(T3×1)+gap severity bonus
  source: string;                // Which projectContext field or repo variant used
  impactBreakdown?: { reason: string; points: number }[];  // Itemized point contributions
}

export interface JDAnalysis {
  id: string;
  jobTitle: string;
  company: string;
  jobUrl: string;
  jdText: string;
  resumeSource: 'uploaded_pdf' | 'generated';
  resumeText: string;
  resumeVersionId?: string;
  overallScore: number;
  breakdown: {
    keywordMatch: number;
    jobFit: number;
    skillsAlignment: number;
    experienceRelevance: number;
    formatCompliance: number;
  };
  // Projected scores if ALL suggested edits were accepted (from AI)
  projectedScore?: number;
  projectedBreakdown?: {
    keywordMatch: number;
    jobFit: number;
    skillsAlignment: number;
    experienceRelevance: number;
    formatCompliance: number;
  };
  jobFitAnalysis: JobFitAnalysis;
  matchedKeywords: string[];
  missingKeywords: string[];
  gaps: Gap[];
  suggestedEdits: SuggestedEdit[];
  coverLetter: string;
  keywordAnalysis?: {              // Tier-weighted keyword breakdown from AI (v3 scoring)
    tier1Keywords: Array<{ term: string; found: boolean; placement: string | null; multiplier: number }>;
    tier2Keywords: Array<{ term: string; found: boolean; placement: string | null; multiplier: number }>;
    tier3Keywords: Array<{ term: string; found: boolean; placement: string | null; multiplier: number }>;
    recruiterSearchTerms: string[];
    recruiterSearchPass: boolean;
  };
  createdAt: string;
}

// ============ APPLICATION TRACKER ============

export type ApplicationStatus = 'Applied' | 'Rejected' | 'Interview' | 'Offer';

export interface ApplicationEntry {
  id: string;
  serialNo: number;              // Auto-incrementing (1, 2, 3...) — never reused
  company: string;
  roleName: string;
  dateApplied: string;           // ISO date string (YYYY-MM-DD)
  status: ApplicationStatus;
  originalScore: number;         // AI-enhanced score at time of analysis
  updatedScore: number | null;   // Interpolated score based on accepted edits
  projectedScore: number | null; // AI's projected score if ALL edits accepted
  projectedBreakdown: {
    keywordMatch: number;
    jobFit: number;
    skillsAlignment: number;
    experienceRelevance: number;
    formatCompliance: number;
  } | null;
  acceptedEditCount: number;     // How many suggested edits were accepted
  totalEditCount: number;        // Total suggested edits available
  analysisId: string;            // Reference to JDAnalysis in storage
  docxBase64: string;            // base64 data URL of the resume .docx
  docxFilename: string;
  reportHtml: string;            // Full HTML report (scores + analysis + cover letter)
  createdAt: string;
  updatedAt: string;
}

// ============ APP SETTINGS ============

export interface AppSettings {
  aiMode: 'free' | 'api';
  apiKey: string;
  model: string;
  defaultHeader: ResumeHeader;
  saveFolderName: string;     // Display name of the chosen save folder (empty = not set)
}

// ============ AI SERVICE ============

export interface AIRequest {
  promptType: 'refine_bullets' | 'tailor_resume' | 'analyze_jd' | 'generate_optimized' | 'reframe_ai';
  systemPrompt: string;
  userPrompt: string;
}

export interface AIResponse {
  success: boolean;
  data: unknown;
  raw: string;
  error?: string;
}
