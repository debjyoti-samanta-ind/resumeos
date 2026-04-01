import type { FunctionTag, IndustryTag, AppSettings } from '../types';

export const FUNCTION_TAGS: FunctionTag[] = [
  'Product Management',
  'Strategy',
  'Operations',
  'Analytics & Insights',
  'Program Management',
  'General',
];

export const INDUSTRY_TAGS: IndustryTag[] = [
  'Healthcare',
  'Pharma',
  'Tech',
  'Finance',
  'Consulting',
  'Consumer Goods',
  'General',
];

export const TECHNICAL_SKILLS = [
  'Advanced Excel',
  'SQL',
  'R',
  'ETL processes',
  'Tableau',
  'PowerPoint',
  'Jira',
  'Python',
];

export const AI_SKILLS = [
  'GenAI product evaluation',
  'Machine Learning (regression models)',
  'RPA/automation',
  'AI platform migration',
  'Prompt engineering',
  'Claude API',
  'LLM-powered insights',
  'AI adoption',
];

export const SOFT_SKILLS = [
  'Product Management',
  'Process Improvement',
  'Cross-Functional Management',
  'Product Strategy & Implementation',
  'Vendor Management',
  'Strategy Consulting',
  'Stakeholder Management',
  'Storyboarding',
];

export const ALL_SKILLS = [...TECHNICAL_SKILLS, ...AI_SKILLS, ...SOFT_SKILLS];

export const DEFAULT_SETTINGS: AppSettings = {
  aiMode: 'free',
  apiKey: '',
  model: 'claude-sonnet-4-20250514',
  defaultHeader: {
    name: 'DEBJYOTI SAMANTA',
    email: 'dsaman@uw.edu',
    phone: '+1 (206) 786-4075',
    linkedin: 'linkedin.com/in/Debjyoti-Samanta',
    location: 'Seattle, Washington',
  },
  saveFolderName: '',
};

export const STORAGE_KEYS = {
  EXPERIENCES:   'resumeos_experiences',
  RESUMES:       'resumeos_resumes',
  ANALYSES:      'resumeos_analyses',
  SETTINGS:      'resumeos_settings',
  APPLICATIONS:  'resumeos_applications',
} as const;
