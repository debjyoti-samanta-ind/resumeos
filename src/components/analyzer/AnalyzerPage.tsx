import { useState } from 'react';
import { Zap, RotateCcw } from 'lucide-react';
import JDInput from './JDInput';
import ResumeUpload from './ResumeUpload';
import ScoreCard from './ScoreCard';
import KeywordMap from './KeywordMap';
import AIAnalysisSection from './AIAnalysisSection';
import { computeScore, type ScoringResult } from '../../services/scoring';

interface AnalyzerState {
  jdText: string;
  jobTitle: string;
  company: string;
  jobUrl: string;
  resumeText: string;
  fileName: string;
}

const EMPTY: AnalyzerState = {
  jdText: '',
  jobTitle: '',
  company: '',
  jobUrl: '',
  resumeText: '',
  fileName: '',
};

export default function AnalyzerPage() {
  const [form, setForm] = useState<AnalyzerState>(EMPTY);
  const [result, setResult] = useState<ScoringResult | null>(null);
  const [scoring, setScoring] = useState(false);
  const [projectedScore, setProjectedScore] = useState<number | undefined>(undefined);

  function patchForm(fields: Partial<AnalyzerState>) {
    setForm((prev) => ({ ...prev, ...fields }));
    if (result && ('jdText' in fields || 'resumeText' in fields)) {
      setResult(null);
    }
  }

  function handleScore() {
    if (!form.jdText.trim() || !form.resumeText.trim()) return;
    setScoring(true);
    setTimeout(() => {
      try {
        setResult(computeScore(form.jdText, form.resumeText));
      } finally {
        setScoring(false);
      }
    }, 50);
  }

  function handleReset() {
    setForm(EMPTY);
    setResult(null);
    setProjectedScore(undefined);
  }

  const canScore = form.jdText.trim().length > 100 && form.resumeText.trim().length > 100;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">JD Analyzer</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Paste a job description + upload your resume → instant ATS score + AI job fit analysis
          </p>
        </div>
        {(result || form.jdText || form.resumeText) && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <RotateCcw size={14} /> Reset
          </button>
        )}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <JDInput
          jdText={form.jdText}
          jobTitle={form.jobTitle}
          company={form.company}
          jobUrl={form.jobUrl}
          onChange={(fields) => patchForm(fields)}
        />
        <ResumeUpload
          resumeText={form.resumeText}
          fileName={form.fileName}
          onExtracted={(text, name) => patchForm({ resumeText: text, fileName: name })}
          onClear={() => patchForm({ resumeText: '', fileName: '' })}
        />
      </div>

      {/* Score button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleScore}
          disabled={!canScore || scoring}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <Zap size={16} />
          {scoring ? 'Scoring...' : 'Score Resume'}
        </button>

        {!canScore && !scoring && (
          <p className="text-sm text-gray-400">
            {!form.jdText.trim()
              ? 'Paste a job description to continue'
              : !form.resumeText.trim()
              ? 'Upload a resume PDF to continue'
              : 'JD or resume too short for meaningful scoring'}
          </p>
        )}

        {scoring && (
          <div className="flex items-center gap-2 text-sm text-indigo-600">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            Running deterministic analysis...
          </div>
        )}
      </div>

      {/* Deterministic results */}
      {result && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2 border-t border-gray-200">
            <ScoreCard result={result} jobTitle={form.jobTitle} company={form.company} projectedScore={projectedScore} />
            <KeywordMap result={result} />
          </div>

          {/* AI analysis — picks up where deterministic leaves off */}
          <AIAnalysisSection
            jdText={form.jdText}
            resumeText={form.resumeText}
            jobTitle={form.jobTitle}
            company={form.company}
            jobUrl={form.jobUrl}
            scoringResult={result}
            onAnalysisDone={(ps) => setProjectedScore(ps)}
          />
        </>
      )}
    </div>
  );
}
