import type { SuggestedEdit } from '../../types';

interface SuggestedEditsProps {
  edits: SuggestedEdit[];
}

const TYPE_STYLE: Record<string, { label: string; color: string }> = {
  rewrite:     { label: 'Rewrite',     color: 'bg-purple-100 text-purple-700' },
  swap:        { label: 'Swap',        color: 'bg-blue-100 text-blue-700' },
  add:         { label: 'Add',         color: 'bg-emerald-100 text-emerald-700' },
  restructure: { label: 'Restructure', color: 'bg-amber-100 text-amber-700' },
  // legacy types from old analyses
  remove:  { label: 'Remove',  color: 'bg-red-100 text-red-700' },
  reorder: { label: 'Reorder', color: 'bg-indigo-100 text-indigo-700' },
};

const GAP_SEVERITY_COLOR: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  moderate: 'bg-amber-100 text-amber-700',
  minor:    'bg-gray-100 text-gray-500',
  none:     '',
};

function EditCard({ edit }: { edit: SuggestedEdit }) {
  const style = TYPE_STYLE[edit.type] ?? TYPE_STYLE.rewrite;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.color}`}>
          {style.label}
        </span>
        <span className="text-xs text-gray-500 flex-1 truncate">{edit.target}</span>
        {typeof edit.impactScore === 'number' && edit.impactScore > 0 && (
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full flex-shrink-0">
            +{edit.impactScore} pts
          </span>
        )}
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* Current */}
        {edit.current && (
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1.5">Current</p>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed border-l-4 border-gray-300">
              {edit.current}
            </p>
          </div>
        )}

        {/* Suggested */}
        {edit.suggested && (
          <div>
            <p className="text-xs font-medium text-emerald-600 mb-1.5">Suggested</p>
            <p className="text-sm text-gray-800 bg-emerald-50 rounded-lg px-3 py-2 leading-relaxed border-l-4 border-emerald-400">
              {edit.suggested}
            </p>
          </div>
        )}

        {/* Keywords added with tier badges */}
        {Array.isArray(edit.keywordsAdded) && edit.keywordsAdded.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400">Keywords added:</span>
            {edit.keywordsAdded.map((kw, idx) => {
              const tier = Array.isArray(edit.keywordTiers) ? edit.keywordTiers[idx] : undefined;
              return (
                <span
                  key={kw}
                  className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium"
                  title={tier ? `Tier ${tier} keyword` : undefined}
                >
                  +{kw}{tier ? ` (T${tier})` : ''}
                </span>
              );
            })}
          </div>
        )}

        {/* Gap filled */}
        {edit.gapFilled && edit.gapSeverity && edit.gapSeverity !== 'none' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Fills gap:</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${GAP_SEVERITY_COLOR[edit.gapSeverity]}`}>
              {edit.gapFilled} ({edit.gapSeverity})
            </span>
          </div>
        )}

        {/* Reason */}
        <p className="text-xs text-gray-500 italic">{edit.reason}</p>

        {/* Source citation */}
        {edit.source && (
          <p className="text-xs text-gray-400">
            <span className="font-medium">Source:</span> {edit.source}
          </p>
        )}
      </div>
    </div>
  );
}

const VALID_TYPES = new Set(['rewrite', 'swap', 'add', 'restructure', 'remove', 'reorder']);

function mentionsProfessionalSummary(e: SuggestedEdit): boolean {
  const hay = `${e.target} ${e.suggested} ${e.gapFilled}`.toLowerCase();
  return hay.includes('professional summary');
}

export default function SuggestedEdits({ edits: rawEdits }: SuggestedEditsProps) {
  const edits: SuggestedEdit[] = (Array.isArray(rawEdits) ? rawEdits : [])
    .map((e) => ({
      ...e,
      type: VALID_TYPES.has(e.type) ? e.type : 'rewrite',
      keywordsAdded: Array.isArray(e.keywordsAdded) ? e.keywordsAdded : [],
      keywordTiers:  Array.isArray(e.keywordTiers)  ? e.keywordTiers  : [],
      gapFilled:     typeof e.gapFilled    === 'string' ? e.gapFilled    : '',
      gapSeverity:   typeof e.gapSeverity  === 'string' ? e.gapSeverity  : 'none',
      impactScore:   typeof e.impactScore  === 'number' ? e.impactScore  : 0,
      source:        typeof e.source       === 'string' ? e.source       : '',
    }))
    // Strip any professional summary edits — this section doesn't exist in the resume
    .filter(e => !mentionsProfessionalSummary(e))
    // Sort by impactScore descending
    .sort((a, b) => (b.impactScore ?? 0) - (a.impactScore ?? 0));

  if (edits.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-400">
        <p className="text-sm">No specific edit suggestions — your resume is already well-matched.</p>
      </div>
    );
  }

  const counts = edits.reduce(
    (acc, e) => ({ ...acc, [e.type]: (acc[e.type] ?? 0) + 1 }),
    {} as Record<string, number>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Suggested Edits</h2>
          <p className="text-xs text-gray-500 mt-0.5">{edits.length} suggestions · sorted by expected impact</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {Object.entries(counts).map(([type, count]) => (
            <span key={type} className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_STYLE[type]?.color ?? ''}`}>
              {count}× {type}
            </span>
          ))}
        </div>
      </div>

      {/* Edit cards */}
      <div className="space-y-4">
        {edits.map((edit, i) => (
          <EditCard key={i} edit={edit} />
        ))}
      </div>

      <p className="text-xs text-gray-400 pt-1">
        Only add keywords where they honestly reflect your experience. These are suggestions, not mandates.
      </p>
    </div>
  );
}
