import { AlertTriangle, Minus, AlertCircle } from 'lucide-react';
import type { Gap } from '../../types';

interface GapAnalysisProps {
  gaps: Gap[];
}

const SEVERITY = {
  critical: {
    icon: <AlertCircle size={15} />,
    badge: 'bg-red-100 text-red-700 border-red-200',
    border: 'border-l-red-400',
    bg: 'bg-red-50',
    label: 'Critical',
  },
  moderate: {
    icon: <AlertTriangle size={15} />,
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    border: 'border-l-amber-400',
    bg: 'bg-amber-50',
    label: 'Moderate',
  },
  minor: {
    icon: <Minus size={15} />,
    badge: 'bg-gray-100 text-gray-600 border-gray-200',
    border: 'border-l-gray-300',
    bg: 'bg-gray-50',
    label: 'Minor',
  },
};

const SEVERITY_ORDER = { critical: 0, moderate: 1, minor: 2 } as const;

function normalizeSeverity(s: unknown): Gap['severity'] {
  const lower = String(s ?? '').toLowerCase();
  if (lower === 'critical' || lower === 'high') return 'critical';
  if (lower === 'moderate' || lower === 'medium') return 'moderate';
  return 'minor';
}

export default function GapAnalysis({ gaps: rawGaps }: GapAnalysisProps) {
  const gaps: Gap[] = (Array.isArray(rawGaps) ? rawGaps : []).map((g) => ({
    ...g,
    severity: normalizeSeverity(g.severity),
  }));

  const sorted = [...gaps].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );

  const counts = {
    critical: gaps.filter((g) => g.severity === 'critical').length,
    moderate: gaps.filter((g) => g.severity === 'moderate').length,
    minor: gaps.filter((g) => g.severity === 'minor').length,
  };

  if (gaps.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-400">
        <p className="text-sm">No gaps identified — great match!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">Gap Analysis</h2>
        <div className="flex items-center gap-2">
          {counts.critical > 0 && (
            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
              {counts.critical} critical
            </span>
          )}
          {counts.moderate > 0 && (
            <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
              {counts.moderate} moderate
            </span>
          )}
          {counts.minor > 0 && (
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
              {counts.minor} minor
            </span>
          )}
        </div>
      </div>

      {/* Gap list */}
      <div className="space-y-3">
        {sorted.map((gap, i) => {
          // Normalize severity — Claude may return 'high'/'low' or capitalized values
          const severityKey = (gap.severity?.toLowerCase() ?? 'minor') as keyof typeof SEVERITY;
          const style = SEVERITY[severityKey] ?? SEVERITY.minor;
          return (
            <div
              key={i}
              className={`border-l-4 ${style.border} rounded-r-xl ${style.bg} px-4 py-3 space-y-1.5`}
            >
              <div className="flex items-center gap-2">
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${style.badge}`}>
                  {style.icon}
                  {style.label}
                </span>
                <span className="text-sm font-semibold text-gray-800">{gap.area}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{gap.suggestion}</p>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 pt-1">
        Critical gaps may cause automatic rejection. Address these first before applying.
      </p>
    </div>
  );
}
