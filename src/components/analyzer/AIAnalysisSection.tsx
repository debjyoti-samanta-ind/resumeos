import { useState } from 'react';
import { BrainCircuit, Loader2, AlertCircle } from 'lucide-react';
import type { JDAnalysis, JobFitAnalysis, Gap, SuggestedEdit } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { loadExperiences, addAnalysis } from '../../services/storage';
import { callAI, validateJDAnalysisResponse, type AIPrompt } from '../../services/ai';
import { JD_ANALYSIS_SYSTEM, buildJDAnalysisUserPrompt } from '../../prompts/templates';
import type { ScoringResult } from '../../services/scoring';
import AIPromptModal from '../shared/AIPromptModal';
import AIResponseInput from '../shared/AIResponseInput';
import ErrorBoundary from '../shared/ErrorBoundary';
import JobFitPanel from './JobFitPanel';
import GapAnalysis from './GapAnalysis';
import EditReviewPanel from './EditReviewPanel';

interface AIAnalysisSectionProps {
  jdText: string;
  resumeText: string;
  jobTitle: string;
  company: string;
  jobUrl: string;
  scoringResult: ScoringResult;
  onAnalysisDone?: (projectedScore: number) => void;
}

type AIStep = 'idle' | 'modal' | 'response' | 'loading' | 'done' | 'error';

// ─── Normalize helpers ────────────────────────────────────────────────────────
// Claude occasionally returns null instead of [] for arrays, or omits fields.
// These normalizers ensure every expected field exists with a safe default.

function arr(v: unknown): string[] {
  return Array.isArray(v) ? (v as string[]) : [];
}

function normalizeJobFit(raw: unknown): JobFitAnalysis {
  const jf = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;

  const sm = (typeof jf['seniorityMatch'] === 'object' && jf['seniorityMatch'] !== null
    ? jf['seniorityMatch']
    : {}) as Record<string, unknown>;

  const ff = (typeof jf['functionFit'] === 'object' && jf['functionFit'] !== null
    ? jf['functionFit']
    : {}) as Record<string, unknown>;

  const indF = (typeof jf['industryFit'] === 'object' && jf['industryFit'] !== null
    ? jf['industryFit']
    : {}) as Record<string, unknown>;

  const eyf = (typeof jf['experienceYearsFit'] === 'object' && jf['experienceYearsFit'] !== null
    ? jf['experienceYearsFit']
    : {}) as Record<string, unknown>;

  const ef = (typeof jf['educationFit'] === 'object' && jf['educationFit'] !== null
    ? jf['educationFit']
    : {}) as Record<string, unknown>;

  const nc = (typeof jf['narrativeCoherence'] === 'object' && jf['narrativeCoherence'] !== null
    ? jf['narrativeCoherence']
    : {}) as Record<string, unknown>;

  return {
    seniorityMatch: {
      jdLevel: (sm['jdLevel'] as JobFitAnalysis['seniorityMatch']['jdLevel']) ?? 'mid',
      resumeLevel: (sm['resumeLevel'] as JobFitAnalysis['seniorityMatch']['resumeLevel']) ?? 'mid',
      isMatch: typeof sm['isMatch'] === 'boolean' ? sm['isMatch'] : true,
      explanation: (sm['explanation'] as string) ?? '',
    },
    functionFit: {
      jdFunction: (ff['jdFunction'] as string) ?? '',
      closestExperiences: arr(ff['closestExperiences']),
      transferableAngles: arr(ff['transferableAngles']),
      gapNarrative: (ff['gapNarrative'] as string) ?? '',
      score: typeof ff['score'] === 'number' ? ff['score'] : 0,
    },
    industryFit: {
      jdIndustry: (indF['jdIndustry'] as string) ?? '',
      relevantExperiences: arr(indF['relevantExperiences']),
      transferableAngles: arr(indF['transferableAngles']),
      score: typeof indF['score'] === 'number' ? indF['score'] : 0,
    },
    experienceYearsFit: {
      jdRequirement: (eyf['jdRequirement'] as string) ?? '',
      candidateYears: typeof eyf['candidateYears'] === 'number' ? eyf['candidateYears'] : 0,
      isMatch: typeof eyf['isMatch'] === 'boolean' ? eyf['isMatch'] : true,
      explanation: (eyf['explanation'] as string) ?? '',
    },
    educationFit: {
      meetsRequirements: typeof ef['meetsRequirements'] === 'boolean' ? ef['meetsRequirements'] : true,
      strengths: arr(ef['strengths']),
      gaps: arr(ef['gaps']),
    },
    narrativeCoherence: {
      score: typeof nc['score'] === 'number' ? nc['score'] : 0,
      currentNarrative: (nc['currentNarrative'] as string) ?? '',
      suggestedNarrative: (nc['suggestedNarrative'] as string) ?? '',
      narrativeGaps: arr(nc['narrativeGaps']),
    },
    overallFitVerdict:
      (jf['overallFitVerdict'] as JobFitAnalysis['overallFitVerdict']) ?? 'moderate',
    topStrengths: arr(jf['topStrengths']),
    topConcerns: arr(jf['topConcerns']),
    positioningAdvice: (jf['positioningAdvice'] as string) ?? '',
  };
}

function mergeResults(
  props: AIAnalysisSectionProps,
  scoringResult: ScoringResult,
  aiData: Record<string, unknown>
): JDAnalysis {
  const aiBreakdown = typeof aiData['breakdown'] === 'object' && aiData['breakdown'] !== null
    ? (aiData['breakdown'] as object)
    : {};
  const projBreakdown = typeof aiData['projectedBreakdown'] === 'object' && aiData['projectedBreakdown'] !== null
    ? (aiData['projectedBreakdown'] as Record<string, unknown>)
    : null;

  return {
    id: crypto.randomUUID(),
    jobTitle: props.jobTitle,
    company: props.company,
    jobUrl: props.jobUrl,
    jdText: props.jdText,
    resumeSource: 'uploaded_pdf',
    resumeText: props.resumeText,
    overallScore: typeof aiData['overallScore'] === 'number' ? aiData['overallScore'] : scoringResult.overallScore,
    breakdown: {
      ...scoringResult.breakdown,
      ...aiBreakdown,
      formatCompliance: scoringResult.breakdown.formatCompliance,
    },
    projectedScore: typeof aiData['projectedScore'] === 'number' ? aiData['projectedScore'] : undefined,
    projectedBreakdown: projBreakdown ? {
      keywordMatch:        typeof projBreakdown['keywordMatch']        === 'number' ? projBreakdown['keywordMatch']        : 0,
      jobFit:              typeof projBreakdown['jobFit']              === 'number' ? projBreakdown['jobFit']              : 0,
      skillsAlignment:     typeof projBreakdown['skillsAlignment']     === 'number' ? projBreakdown['skillsAlignment']     : 0,
      experienceRelevance: typeof projBreakdown['experienceRelevance'] === 'number' ? projBreakdown['experienceRelevance'] : 0,
      formatCompliance:    scoringResult.breakdown.formatCompliance,
    } : undefined,
    jobFitAnalysis: normalizeJobFit(aiData['jobFitAnalysis']),
    matchedKeywords: arr(aiData['matchedKeywords']).length ? arr(aiData['matchedKeywords']) : scoringResult.matchedKeywords,
    missingKeywords: arr(aiData['missingKeywords']).length ? arr(aiData['missingKeywords']) : scoringResult.missingKeywords,
    gaps: arr(aiData['gaps']) as unknown as Gap[],
    suggestedEdits: arr(aiData['suggestedEdits']) as unknown as SuggestedEdit[],
    coverLetter: typeof aiData['coverLetter'] === 'string' ? aiData['coverLetter'] : '',
    keywordAnalysis: (typeof aiData['keywordAnalysis'] === 'object' && aiData['keywordAnalysis'] !== null)
      ? aiData['keywordAnalysis'] as JDAnalysis['keywordAnalysis']
      : undefined,
    createdAt: new Date().toISOString(),
  };
}

export default function AIAnalysisSection(props: AIAnalysisSectionProps) {
  const { settings } = useSettings();
  const [step, setStep] = useState<AIStep>('idle');
  const [prompt, setPrompt] = useState<AIPrompt | null>(null);
  const [analysis, setAnalysis] = useState<JDAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const experiences = loadExperiences();

  function buildPrompt(): AIPrompt {
    const experiences = loadExperiences();
    return {
      system: JD_ANALYSIS_SYSTEM,
      user: buildJDAnalysisUserPrompt(props.jdText, props.resumeText, experiences),
    };
  }

  async function handleAnalyzeClick() {
    const p = buildPrompt();
    setPrompt(p);

    if (settings.aiMode === 'free') {
      setStep('modal');
    } else {
      // API mode — call directly
      setStep('loading');
      setError(null);
      const result = await callAI(p, settings);
      if (result.success) {
        applyAIData(result.data);
      } else {
        setError(result.error ?? 'AI call failed.');
        setStep('error');
      }
    }
  }

  function applyAIData(data: unknown) {
    const merged = mergeResults(props, props.scoringResult, data as Record<string, unknown>);
    addAnalysis(merged);
    setAnalysis(merged);
    setStep('done');
    if (merged.projectedScore != null) {
      props.onAnalysisDone?.(merged.projectedScore);
    }
  }

  return (
    <div className="space-y-5">
      {/* "Analyze with AI" button — shown when deterministic results are ready */}
      {step === 'idle' && (
        <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl">
          <BrainCircuit size={24} className="text-indigo-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">Want the full picture?</p>
            <p className="text-xs text-gray-500 mt-0.5">
              AI analysis adds Job Fit scoring — seniority match, career trajectory, narrative
              coherence, gap analysis, and specific bullet rewrites.
              {settings.aiMode === 'free' && ' Uses Claude.ai (free, copy-paste).'}
              {settings.aiMode === 'api' && ' Uses your API key (direct call).'}
            </p>
          </div>
          <button
            onClick={handleAnalyzeClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex-shrink-0"
          >
            <BrainCircuit size={16} /> Analyze with AI
          </button>
        </div>
      )}

      {/* Loading (API mode) */}
      {step === 'loading' && (
        <div className="flex items-center gap-3 p-5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm font-medium">Calling Claude API — this takes 15–30 seconds...</span>
        </div>
      )}

      {/* Error */}
      {step === 'error' && (
        <div className="flex items-start gap-3 p-5 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">AI call failed</p>
            <p className="text-xs mt-0.5">{error}</p>
            <button onClick={() => setStep('idle')} className="text-xs underline mt-2">Try again</button>
          </div>
        </div>
      )}

      {/* Free mode: response input section */}
      {step === 'response' && (
        <AIResponseInput
          onParsed={applyAIData}
          onBack={() => setStep('modal')}
          onCancel={() => setStep('idle')}
          validatorFn={validateJDAnalysisResponse}
        />
      )}

      {/* Full analysis results */}
      {step === 'done' && analysis && (
        <ErrorBoundary fallbackTitle="Error rendering AI analysis — check the console for details">
          <div className="space-y-5 pt-2 border-t-2 border-indigo-100">
            <div className="flex items-center gap-2">
              <BrainCircuit size={16} className="text-indigo-500" />
              <h2 className="text-base font-semibold text-gray-800">AI Analysis</h2>
              <span className="text-xs text-gray-400">· saved to history</span>
            </div>

            <JobFitPanel
              analysis={analysis.jobFitAnalysis}
              jobTitle={props.jobTitle}
              company={props.company}
            />
            <GapAnalysis gaps={analysis.gaps} />

            <div className="border-t border-indigo-100 pt-5">
              <EditReviewPanel
              analysis={analysis}
              experiences={experiences}
            />
            </div>
          </div>
        </ErrorBoundary>
      )}

      {/* Free mode: prompt modal */}
      {step === 'modal' && prompt && (
        <AIPromptModal
          prompt={prompt}
          title="Analyze with Claude.ai — JD + Job Fit"
          onNext={() => setStep('response')}
          onClose={() => setStep('idle')}
        />
      )}
    </div>
  );
}
