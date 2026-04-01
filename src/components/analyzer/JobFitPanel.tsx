import type { JobFitAnalysis } from '../../types';

interface JobFitPanelProps {
  analysis: JobFitAnalysis;
  jobTitle?: string;
  company?: string;
}

const VERDICT_STYLE = {
  strong:   { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Strong Fit' },
  moderate: { badge: 'bg-amber-100 text-amber-800 border-amber-200',       label: 'Moderate Fit' },
  stretch:  { badge: 'bg-orange-100 text-orange-800 border-orange-200',    label: 'Stretch Role' },
  weak:     { badge: 'bg-red-100 text-red-800 border-red-200',             label: 'Weak Fit' },
};

const SENIORITY_LABELS: Record<string, string> = {
  intern: 'Intern', entry: 'Entry', mid: 'Mid-level', senior: 'Senior',
  lead: 'Lead', director: 'Director', vp: 'VP',
};

function ScoreBar({ score, label }: { score: number; label: string }) {
  const color = score >= 75 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-400' : score >= 45 ? 'bg-orange-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-sm font-bold w-8 text-right ${score >= 75 ? 'text-emerald-600' : score >= 60 ? 'text-amber-500' : score >= 45 ? 'text-orange-500' : 'text-red-500'}`}>{score}</span>
    </div>
  );
}

function TagList({ items, color }: { items: string[]; color: string }) {
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {items.map((item) => (
        <span key={item} className={`text-xs px-2 py-0.5 rounded-full ${color}`}>{item}</span>
      ))}
    </div>
  );
}

export default function JobFitPanel({ analysis, jobTitle, company }: JobFitPanelProps) {
  const v = VERDICT_STYLE[analysis.overallFitVerdict] ?? VERDICT_STYLE.moderate;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Job Fit Analysis</h2>
          {jobTitle && company && <p className="text-xs text-gray-500 mt-0.5">{jobTitle} at {company}</p>}
        </div>
        <span className={`text-sm font-bold px-3 py-1 rounded-full border ${v.badge}`}>{v.label}</span>
      </div>

      {/* Top strengths + concerns */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-emerald-700 mb-2">Top Strengths</p>
          <ul className="space-y-1.5">
            {analysis.topStrengths.map((s) => (
              <li key={s} className="flex items-start gap-2 text-xs text-gray-700">
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>{s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-red-600 mb-2">Top Concerns</p>
          <ul className="space-y-1.5">
            {analysis.topConcerns.map((c) => (
              <li key={c} className="flex items-start gap-2 text-xs text-gray-700">
                <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>{c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Positioning advice */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
        <p className="text-xs font-semibold text-indigo-700 mb-1">Positioning Advice</p>
        <p className="text-sm text-indigo-800 leading-relaxed">{analysis.positioningAdvice}</p>
      </div>

      {/* Sub-assessments */}
      <div className="space-y-5 border-t border-gray-100 pt-5">

        {/* Seniority */}
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">Seniority Match</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">JD expects: <strong className="text-gray-800">{SENIORITY_LABELS[analysis.seniorityMatch.jdLevel] ?? analysis.seniorityMatch.jdLevel}</strong></span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">Your level: <strong className="text-gray-800">{SENIORITY_LABELS[analysis.seniorityMatch.resumeLevel] ?? analysis.seniorityMatch.resumeLevel}</strong></span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${analysis.seniorityMatch.isMatch ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {analysis.seniorityMatch.isMatch ? '✓ Match' : '✗ Mismatch'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{analysis.seniorityMatch.explanation}</p>
        </div>

        {/* Function Fit */}
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">Function Fit — {analysis.functionFit.jdFunction}</p>
          <ScoreBar score={analysis.functionFit.score} label="Function score" />
          {analysis.functionFit.closestExperiences.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">Closest experiences:</p>
              <TagList items={analysis.functionFit.closestExperiences} color="bg-indigo-50 text-indigo-700" />
            </div>
          )}
          {analysis.functionFit.transferableAngles.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">Transferable angles:</p>
              {analysis.functionFit.transferableAngles.map((a) => (
                <p key={a} className="text-xs text-gray-600 mt-0.5">• {a}</p>
              ))}
            </div>
          )}
          <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mt-2">{analysis.functionFit.gapNarrative}</p>
        </div>

        {/* Industry Fit */}
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">Industry Fit — {analysis.industryFit.jdIndustry}</p>
          <ScoreBar score={analysis.industryFit.score} label="Industry score" />
          {analysis.industryFit.transferableAngles.length > 0 && (
            <div className="mt-2">
              {analysis.industryFit.transferableAngles.map((a) => (
                <p key={a} className="text-xs text-gray-600 mt-0.5">• {a}</p>
              ))}
            </div>
          )}
        </div>

        {/* Experience Years */}
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">Experience Years</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">JD requires: <strong className="text-gray-800">{analysis.experienceYearsFit.jdRequirement}</strong></span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">You have: <strong className="text-gray-800">{analysis.experienceYearsFit.candidateYears} yrs</strong></span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${analysis.experienceYearsFit.isMatch ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {analysis.experienceYearsFit.isMatch ? '✓ Match' : '✗ Short'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{analysis.experienceYearsFit.explanation}</p>
        </div>

        {/* Education */}
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">Education Fit</p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${analysis.educationFit.meetsRequirements ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {analysis.educationFit.meetsRequirements ? '✓ Requirements met' : '✗ Gap identified'}
          </span>
          {analysis.educationFit.strengths.length > 0 && (
            <TagList items={analysis.educationFit.strengths} color="bg-emerald-50 text-emerald-700" />
          )}
          {analysis.educationFit.gaps.length > 0 && (
            <TagList items={analysis.educationFit.gaps} color="bg-red-50 text-red-700" />
          )}
        </div>

        {/* Narrative Coherence */}
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">Narrative Coherence</p>
          <ScoreBar score={analysis.narrativeCoherence.score} label="Coherence" />
          <div className="mt-3 space-y-2">
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-xs font-medium text-gray-500">Current narrative</p>
              <p className="text-xs text-gray-700 mt-0.5">{analysis.narrativeCoherence.currentNarrative}</p>
            </div>
            <div className="bg-indigo-50 rounded-lg px-3 py-2">
              <p className="text-xs font-medium text-indigo-600">Suggested narrative</p>
              <p className="text-xs text-indigo-800 mt-0.5">{analysis.narrativeCoherence.suggestedNarrative}</p>
            </div>
            {analysis.narrativeCoherence.narrativeGaps.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Narrative gaps to close:</p>
                {analysis.narrativeCoherence.narrativeGaps.map((g) => (
                  <p key={g} className="text-xs text-gray-600">• {g}</p>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
