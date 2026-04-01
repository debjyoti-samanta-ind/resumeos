import { AlertCircle } from 'lucide-react';
import type { ScoringResult } from '../../services/scoring';

interface ScoreCardProps {
  result: ScoringResult;
  jobTitle: string;
  company: string;
  projectedScore?: number;
}

function scoreColor(score: number): string {
  if (score >= 75) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-500';
  if (score >= 45) return 'text-orange-500';
  return 'text-red-500';
}

function scoreBg(score: number): string {
  if (score >= 75) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-400';
  if (score >= 45) return 'bg-orange-400';
  return 'bg-red-500';
}

function scoreRingColor(score: number): string {
  if (score >= 75) return 'stroke-emerald-500';
  if (score >= 60) return 'stroke-amber-400';
  if (score >= 45) return 'stroke-orange-400';
  return 'stroke-red-500';
}

function verdict(score: number): { label: string; desc: string } {
  if (score >= 75) return { label: 'Strong Match', desc: 'Apply with confidence.' };
  if (score >= 60) return { label: 'Decent Match', desc: 'Worth applying with targeted edits.' };
  if (score >= 45) return { label: 'Stretch Role', desc: 'Needs significant reframing.' };
  return { label: 'Poor Fit', desc: 'Consider whether this role is realistic.' };
}

interface DimensionBarProps {
  label: string;
  score: number;
  description: string;
  pending?: boolean;
}

function DimensionBar({ label, score, description, pending = false }: DimensionBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
        {pending ? (
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium">
            AI required
          </span>
        ) : (
          <span className={`text-sm font-bold ${scoreColor(score)}`}>{score}</span>
        )}
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        {pending ? (
          <div className="h-full bg-gray-200 rounded-full w-full" />
        ) : (
          <div
            className={`h-full rounded-full transition-all duration-500 ${scoreBg(score)}`}
            style={{ width: `${score}%` }}
          />
        )}
      </div>
    </div>
  );
}

// Circular SVG score dial
function ScoreDial({ score }: { score: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          className={`transition-all duration-700 ${scoreRingColor(score)}`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-4xl font-bold ${scoreColor(score)}`}>{score}</span>
        <span className="text-xs text-gray-400 font-medium">/100</span>
      </div>
    </div>
  );
}

export default function ScoreCard({ result, jobTitle, company, projectedScore }: ScoreCardProps) {
  const v = verdict(result.overallScore);
  const { breakdown, formatIssues } = result;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-gray-800">Score Report</h2>
        {jobTitle && company && (
          <p className="text-sm text-gray-500 mt-0.5">{jobTitle} at {company}</p>
        )}
      </div>

      {/* Dial + verdict */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <ScoreDial score={result.overallScore} />
          {projectedScore != null && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1">
              <span>{result.overallScore}</span>
              <span className="text-gray-400">→</span>
              <span className="font-bold">{projectedScore}</span>
              <span className="text-gray-400">potential</span>
            </div>
          )}
        </div>
        <div>
          <p className={`text-xl font-bold ${scoreColor(result.overallScore)}`}>{v.label}</p>
          <p className="text-sm text-gray-500 mt-1">{v.desc}</p>
          {projectedScore != null && (
            <p className="text-xs text-indigo-600 mt-1">
              AI edits could raise score to <span className="font-semibold">{projectedScore}</span>
            </p>
          )}
          <div className="mt-3 flex flex-col gap-1 text-xs text-gray-400">
            <span>75+ → Strong Match</span>
            <span>60–74 → Decent Match</span>
            <span>45–59 → Stretch Role</span>
            <span>{'<'}45 → Poor Fit</span>
          </div>
        </div>
      </div>

      {/* Dimension bars */}
      <div className="space-y-4 border-t border-gray-100 pt-5">
        <DimensionBar
          label="Keyword Match"
          score={breakdown.keywordMatch}
          description={`${result.matchedKeywords.length} of ${result.jdKeywords.length} JD keywords found`}
        />
        <DimensionBar
          label="Skills Alignment"
          score={breakdown.skillsAlignment}
          description="Known skill terms from JD found in resume"
        />
        <DimensionBar
          label="Experience Relevance"
          score={breakdown.experienceRelevance}
          description="JD keywords present in experience section"
        />
        <DimensionBar
          label="Format Compliance"
          score={breakdown.formatCompliance}
          description="ATS-friendly formatting checks"
        />
        <DimensionBar
          label="Job Fit"
          score={0}
          description="Seniority, trajectory, and narrative coherence"
          pending
        />
      </div>

      {/* Note about AI */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3 text-xs text-indigo-700">
        <strong>Job Fit</strong> analysis (career trajectory, seniority match, narrative coherence) requires AI.
        Enable AI mode in Settings to unlock the full analysis in Phase 3b.
      </div>

      {/* Format issues */}
      {formatIssues.length > 0 && (
        <div className="space-y-2 border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Format Issues</p>
          {formatIssues.map((issue) => (
            <div key={issue} className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
              <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
              {issue}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
