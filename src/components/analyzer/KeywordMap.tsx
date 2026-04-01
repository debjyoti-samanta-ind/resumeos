import { CheckCircle, XCircle, Search } from 'lucide-react';
import { useState } from 'react';
import type { ScoringResult } from '../../services/scoring';

interface KeywordMapProps {
  result: ScoringResult;
}

export default function KeywordMap({ result }: KeywordMapProps) {
  const [filter, setFilter] = useState('');

  const { matchedKeywords, missingKeywords } = result;

  const fLower = filter.toLowerCase();
  const filteredMatched = matchedKeywords.filter((k) => k.includes(fLower));
  const filteredMissing = missingKeywords.filter((k) => k.includes(fLower));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Keyword Map</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {matchedKeywords.length} matched · {missingKeywords.length} missing · {result.jdKeywords.length} total extracted
          </p>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter keywords..."
            className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40"
          />
        </div>
      </div>

      {result.jdKeywords.length === 0 ? (
        <p className="text-sm text-gray-400 italic text-center py-8">
          No keywords extracted from JD. Make sure the JD text is pasted correctly.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* Matched column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={15} className="text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-700">
                Found in resume ({filteredMatched.length})
              </span>
            </div>
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {filteredMatched.length === 0 ? (
                <p className="text-xs text-gray-400 italic">
                  {filter ? 'No matches for this filter' : 'None matched — try improving keyword coverage'}
                </p>
              ) : (
                filteredMatched.map((kw) => (
                  <div
                    key={kw}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg"
                  >
                    <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-xs text-emerald-800 font-medium">{kw}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Missing column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <XCircle size={15} className="text-red-400" />
              <span className="text-sm font-semibold text-red-600">
                Missing ({filteredMissing.length})
              </span>
            </div>
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {filteredMissing.length === 0 ? (
                <p className="text-xs text-gray-400 italic">
                  {filter ? 'No matches for this filter' : 'All keywords found — great coverage!'}
                </p>
              ) : (
                filteredMissing.map((kw) => (
                  <div
                    key={kw}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-lg"
                  >
                    <XCircle size={12} className="text-red-400 flex-shrink-0" />
                    <span className="text-xs text-red-700 font-medium">{kw}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Coverage bar */}
      {result.jdKeywords.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>Keyword coverage</span>
            <span className="font-medium">{result.breakdown.keywordMatch}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                result.breakdown.keywordMatch >= 75
                  ? 'bg-emerald-500'
                  : result.breakdown.keywordMatch >= 60
                  ? 'bg-amber-400'
                  : 'bg-red-400'
              }`}
              style={{ width: `${result.breakdown.keywordMatch}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Adding missing keywords to your resume (where truthful) will increase this score.
            Phase 3b will suggest specific bullet rewrites.
          </p>
        </div>
      )}
    </div>
  );
}
