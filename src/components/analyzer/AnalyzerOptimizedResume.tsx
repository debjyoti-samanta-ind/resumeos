import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import type { JDAnalysis, Experience, FunctionTag, SuggestedEdit } from '../../types';
import { FUNCTION_TAGS } from '../../constants';
import { useSettings } from '../../context/SettingsContext';
import { buildSkillsText, type ResumeExportEntry } from '../../services/docxExport';
import { getVariantText } from '../generator/BulletSelector';
import ResumePreview from '../generator/ResumePreview';
import ResumeExport from '../generator/ResumeExport';

interface Props {
  analysis: JDAnalysis;
  experiences: Experience[];
}

// ─── Fuzzy matching (apply AI rewrites to repo bullets) ───────────────────────

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

function jaccardSimilarity(a: string, b: string): number {
  const wa = new Set(normalize(a).split(' ').filter((w) => w.length > 3));
  const wb = new Set(normalize(b).split(' ').filter((w) => w.length > 3));
  if (wa.size === 0 || wb.size === 0) return 0;
  const intersection = [...wa].filter((w) => wb.has(w)).length;
  return intersection / (wa.size + wb.size - intersection);
}

function findMatchingRewrite(bulletText: string, edits: SuggestedEdit[]): string | null {
  const nb = normalize(bulletText);
  let best: SuggestedEdit | null = null;
  let bestScore = 0.32; // minimum similarity threshold

  for (const edit of edits) {
    if (edit.type !== 'rewrite' || !edit.suggested) continue;
    const nc = normalize(edit.current);
    // Prefer substring containment first, then Jaccard
    const score =
      nc.includes(nb) || nb.includes(nc) ? 0.9 : jaccardSimilarity(bulletText, edit.current);
    if (score > bestScore) {
      bestScore = score;
      best = edit;
    }
  }
  return best?.suggested ?? null;
}

// ─── Match function tag from free-text jdFunction ────────────────────────────

function matchFunctionTag(jdFunction: string): FunctionTag {
  const fn = jdFunction.toLowerCase();
  if (fn.includes('product')) return 'Product Management';
  if (fn.includes('strateg')) return 'Strategy';
  if (fn.includes('operat') || fn.includes('ops')) return 'Operations';
  if (fn.includes('analytic') || fn.includes('insight') || fn.includes('data')) return 'Analytics & Insights';
  if (fn.includes('program')) return 'Program Management';
  const exact = FUNCTION_TAGS.find((t) => t.toLowerCase() === fn);
  return exact ?? 'General';
}

// ─── Assemble optimized resume entries ───────────────────────────────────────

interface AssembledResume {
  educationEntries: ResumeExportEntry[];
  experienceEntries: ResumeExportEntry[];
  rewriteCount: number;
  addCount: number;
}

function assembleOptimizedResume(
  experiences: Experience[],
  analysis: JDAnalysis,
  targetFunction: FunctionTag,
): AssembledResume {
  const edits = analysis.suggestedEdits ?? [];
  let rewriteCount = 0;
  let addCount = 0;

  // Collect add-type edits (new bullets to append)
  const addEdits = edits.filter((e) => e.type === 'add' && e.suggested);

  function toEntry(exp: Experience): ResumeExportEntry {
    const bullets: string[] = [];

    for (const ach of exp.achievements) {
      const repoBullet = getVariantText(ach, targetFunction);
      if (!repoBullet) continue;

      // Try to find an AI rewrite for this bullet
      const rewrite = findMatchingRewrite(repoBullet, edits);
      if (rewrite) {
        bullets.push(rewrite);
        rewriteCount++;
      } else {
        bullets.push(repoBullet);
      }
    }

    // Append add-type edits that reference this experience (by org name match)
    for (const addEdit of addEdits) {
      const orgLower = exp.organization.toLowerCase();
      if (
        addEdit.target?.toLowerCase().includes(orgLower) ||
        addEdit.reason?.toLowerCase().includes(orgLower)
      ) {
        bullets.push(addEdit.suggested);
        addCount++;
      }
    }

    return {
      organization: exp.organization,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      title: exp.title,
      bullets,
    };
  }

  const educationEntries = experiences
    .filter((e) => e.type === 'education')
    .map(toEntry);

  const experienceEntries = experiences
    .filter((e) => e.type !== 'education')
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .map(toEntry)
    .filter((e) => e.bullets.length > 0);

  return { educationEntries, experienceEntries, rewriteCount, addCount };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnalyzerOptimizedResume({ analysis, experiences }: Props) {
  const { settings } = useSettings();
  const [expanded, setExpanded] = useState(false);

  const targetFunction = matchFunctionTag(analysis.jobFitAnalysis?.functionFit?.jdFunction ?? '');

  const { educationEntries, experienceEntries, rewriteCount, addCount } = useMemo(
    () => assembleOptimizedResume(experiences, analysis, targetFunction),
    [experiences, analysis, targetFunction],
  );

  const skillsText = useMemo(() => {
    const all = experiences.flatMap((e) => e.skills);
    const jdKeywords = [...(analysis.matchedKeywords ?? []), ...(analysis.missingKeywords ?? [])];
    return buildSkillsText(all, jdKeywords);
  }, [experiences, analysis]);

  const positioningAdvice = analysis.jobFitAnalysis?.positioningAdvice;

  const exportFilename = `Optimized_${analysis.jobTitle || 'Resume'}_${analysis.company || ''}.docx`
    .replace(/\s+/g, '_').replace(/_+/g, '_');

  return (
    <div className="border border-indigo-200 rounded-xl overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors text-left"
      >
        <Sparkles size={18} className="text-indigo-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">AI-Optimized Resume</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Resume assembled using AI-suggested rewrites from this analysis
            {rewriteCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                {rewriteCount} bullet{rewriteCount !== 1 ? 's' : ''} rewritten
              </span>
            )}
            {addCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                {addCount} added
              </span>
            )}
          </p>
        </div>
        {expanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="p-5 space-y-4 bg-white">
          {/* Positioning advice */}
          {positioningAdvice && (
            <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-amber-600 text-sm flex-shrink-0">💡</span>
              <p className="text-xs text-amber-800">
                <span className="font-semibold">Positioning: </span>{positioningAdvice}
              </p>
            </div>
          )}

          {rewriteCount === 0 && (
            <p className="text-xs text-gray-500 italic">
              No close matches found between AI suggestions and repository bullets — bullets shown are the best repository variants for{' '}
              <span className="font-medium">{targetFunction}</span>. Run AI analysis first for rewrite suggestions.
            </p>
          )}

          {/* Live preview */}
          <ResumePreview
            header={settings.defaultHeader}
            educationEntries={educationEntries}
            experienceEntries={experienceEntries}
            skillsText={skillsText}
          />

          {/* Export */}
          <ResumeExport
            header={settings.defaultHeader}
            educationEntries={educationEntries}
            experienceEntries={experienceEntries}
            skillsText={skillsText}
            filename={exportFilename}
            disabled={educationEntries.length === 0 && experienceEntries.length === 0}
          />
        </div>
      )}
    </div>
  );
}
