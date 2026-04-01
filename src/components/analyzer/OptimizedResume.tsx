import { Wand2 } from 'lucide-react';
import type { JDAnalysis, Experience, FunctionTag, IndustryTag } from '../../types';
import { FUNCTION_TAGS, INDUSTRY_TAGS } from '../../constants';

interface Props {
  analysis: JDAnalysis;
  experiences: Experience[];
  onNavigateToGenerator: () => void;
}

// ─── Tag matching helpers ─────────────────────────────────────────────────────

function matchFunctionTag(jdFunction: string): FunctionTag {
  const fn = jdFunction.toLowerCase();
  if (fn.includes('product')) return 'Product Management';
  if (fn.includes('strateg')) return 'Strategy';
  if (fn.includes('operat') || fn.includes('ops')) return 'Operations';
  if (fn.includes('analytic') || fn.includes('insight') || fn.includes('data')) return 'Analytics & Insights';
  if (fn.includes('program')) return 'Program Management';
  // Check if it already matches a known tag
  const exact = FUNCTION_TAGS.find((t) => t.toLowerCase() === fn);
  return exact ?? 'General';
}

function matchIndustryTag(jdIndustry: string): IndustryTag {
  const ind = jdIndustry.toLowerCase();
  if (ind.includes('health')) return 'Healthcare';
  if (ind.includes('pharma') || ind.includes('life science')) return 'Pharma';
  if (ind.includes('tech') || ind.includes('software') || ind.includes('saas')) return 'Tech';
  if (ind.includes('financ') || ind.includes('bank') || ind.includes('invest')) return 'Finance';
  if (ind.includes('consult')) return 'Consulting';
  if (ind.includes('consumer') || ind.includes('retail') || ind.includes('fmcg')) return 'Consumer Goods';
  const exact = INDUSTRY_TAGS.find((t) => t.toLowerCase() === ind);
  return exact ?? 'General';
}

// Find which experience IDs contain achievements mentioned in gaps
function inferExperienceIds(analysis: JDAnalysis, experiences: Experience[]): string[] {
  // Collect achievement IDs referenced in gaps
  const achIds = new Set(analysis.gaps.flatMap((g) => g.relevantAchievementIds ?? []));

  // Find which experiences contain those achievements
  const fromGaps = experiences
    .filter((e) => e.achievements.some((a) => achIds.has(a.id)))
    .map((e) => e.id);

  // Also include all experiences (we'll let the user pare down in the generator)
  // but prioritize the ones referenced in gaps
  const all = experiences.map((e) => e.id);
  const prioritized = [...new Set([...fromGaps, ...all])];
  // Return top 6 to keep the resume to 1 page
  return prioritized.slice(0, 6);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OptimizedResume({ analysis, experiences, onNavigateToGenerator }: Props) {
  const jfa = analysis.jobFitAnalysis;
  const targetFunction = matchFunctionTag(jfa.functionFit.jdFunction);
  const targetIndustry = matchIndustryTag(jfa.industryFit.jdIndustry);
  const suggestedExperienceIds = inferExperienceIds(analysis, experiences);

  function handleBuild() {
    const preselect = { targetFunction, targetIndustry, suggestedExperienceIds };
    localStorage.setItem('resumeos_generator_preselect', JSON.stringify(preselect));
    onNavigateToGenerator();
  }

  return (
    <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
      <Wand2 size={22} className="text-green-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">Build an optimized resume for this role</p>
        <p className="text-xs text-gray-600 mt-0.5">
          Opens the Resume Generator pre-loaded with{' '}
          <span className="font-medium text-green-700">{targetFunction}</span> bullets,{' '}
          <span className="font-medium text-green-700">{targetIndustry}</span> framing, and{' '}
          {suggestedExperienceIds.length} suggested experience{suggestedExperienceIds.length !== 1 ? 's' : ''} selected.
          You can adjust before exporting.
        </p>
        {jfa.positioningAdvice && (
          <p className="text-xs text-gray-500 mt-1.5 italic border-l-2 border-green-300 pl-2">
            Tip: {jfa.positioningAdvice}
          </p>
        )}
      </div>
      <button
        onClick={handleBuild}
        className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors flex-shrink-0"
      >
        <Wand2 size={15} /> Build Resume
      </button>
    </div>
  );
}
