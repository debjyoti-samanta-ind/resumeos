import { useMemo, useState } from 'react';
import { Check, X, RotateCcw, Copy, CheckCircle, Mail, ChevronDown, ChevronRight,
  Loader2, Send, ChevronUp, TrendingUp } from 'lucide-react';
import type { JDAnalysis, Experience, SuggestedEdit, FunctionTag } from '../../types';
import { FUNCTION_TAGS } from '../../constants';
import { buildSkillsText, buildDocx, type ResumeExportEntry } from '../../services/docxExport';
import { getVariantText } from '../generator/BulletSelector';
import { useSettings } from '../../context/SettingsContext';
import { computePostEditScore } from '../../services/scoring';
import { generateReportHtml } from '../../services/reportGenerator';
import { saveApplicationFiles } from '../../services/fileSystem';
import { addApplication, nextSerialNo } from '../../services/storage';
import ResumePreview from '../generator/ResumePreview';
import ResumeExport from '../generator/ResumeExport';

// ─── Types ────────────────────────────────────────────────────────────────────

type Decision = 'accepted' | 'declined';
interface AddPlacement { experienceId: string; position: number; }

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function norm(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}
function similarity(a: string, b: string): number {
  const wa = new Set(norm(a).split(' ').filter(w => w.length > 3));
  const wb = new Set(norm(b).split(' ').filter(w => w.length > 3));
  if (!wa.size || !wb.size) return 0;
  const inter = [...wa].filter(w => wb.has(w)).length;
  return inter / (wa.size + wb.size - inter);
}

function matchFunctionTag(jdFunction: string): FunctionTag {
  const fn = jdFunction.toLowerCase();
  if (fn.includes('product')) return 'Product Management';
  if (fn.includes('strateg')) return 'Strategy';
  if (fn.includes('operat')) return 'Operations';
  if (fn.includes('analytic') || fn.includes('insight') || fn.includes('data')) return 'Analytics & Insights';
  if (fn.includes('program')) return 'Program Management';
  return FUNCTION_TAGS.find(t => t.toLowerCase() === fn) ?? 'General';
}

// Fix 3 — detect if an experience's org appears in the uploaded resume text
function isOrgInResume(org: string, resumeText: string): boolean {
  const key = org.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10);
  if (key.length < 3) return false;
  return resumeText.toLowerCase().replace(/[^a-z0-9]/g, '').includes(key);
}

function computeWorkingBullets(
  initial: Record<string, string[]>,
  decisions: Record<number, Decision>,
  placements: Record<number, AddPlacement>,
  edits: SuggestedEdit[],
): Record<string, string[]> {
  const w: Record<string, string[]> = Object.fromEntries(
    Object.entries(initial).map(([k, v]) => [k, [...v]])
  );
  edits.forEach((edit, i) => {
    if (decisions[i] !== 'accepted') return;
    if (edit.type === 'rewrite' || edit.type === 'swap') {
      // Both rewrite and swap: find the current bullet and replace it with suggested
      for (const [expId, bullets] of Object.entries(w)) {
        const idx = bullets.findIndex(b => similarity(b, edit.current) > 0.28);
        if (idx >= 0) { w[expId] = [...bullets]; w[expId][idx] = edit.suggested; break; }
      }
    } else if (edit.type === 'add') {
      const p = placements[i];
      if (p) {
        if (!w[p.experienceId]) w[p.experienceId] = [];
        w[p.experienceId] = [...w[p.experienceId]];
        w[p.experienceId].splice(p.position, 0, edit.suggested);
      }
    } else if (edit.type === 'restructure') {
      // Restructure is structural advice (add summary, reorder roles) — no deterministic
      // live-preview change. The suggestion is shown to the user but not applied automatically.
    } else if (edit.type === 'remove') {
      // Legacy type from old analyses
      for (const [expId, bullets] of Object.entries(w)) {
        const idx = bullets.findIndex(b => similarity(b, edit.current) > 0.28);
        if (idx >= 0) { w[expId] = bullets.filter((_, j) => j !== idx); break; }
      }
    }
  });
  return w;
}

// ─── AddPlacementPicker ───────────────────────────────────────────────────────

function AddPlacementPicker({ experiences, workingBullets, onConfirm, onCancel }: {
  experiences: Experience[];
  workingBullets: Record<string, string[]>;
  onConfirm: (expId: string, position: number) => void;
  onCancel: () => void;
}) {
  const eligible = experiences.filter(e => e.type !== 'education');
  const [expId, setExpId] = useState(eligible[0]?.id ?? '');
  const [pos, setPos] = useState(0);
  const bullets = workingBullets[expId] ?? [];

  return (
    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
      <p className="text-xs font-semibold text-green-800">Where should this bullet go?</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Under experience</label>
          <select value={expId} onChange={e => { setExpId(e.target.value); setPos(0); }}
            className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-400">
            {eligible.map(exp => (
              <option key={exp.id} value={exp.id}>{exp.organization} — {exp.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">At position</label>
          <select value={pos} onChange={e => setPos(Number(e.target.value))}
            className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-400">
            {bullets.map((_, i) => <option key={i} value={i}>Before bullet {i + 1}</option>)}
            <option value={bullets.length}>After last bullet</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onConfirm(expId, pos)}
          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700">
          <Check size={11} /> Confirm Add
        </button>
        <button onClick={onCancel} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700">Cancel</button>
      </div>
    </div>
  );
}

// ─── EditCard ─────────────────────────────────────────────────────────────────

const TYPE_BADGE: Record<string, string> = {
  rewrite:     'bg-purple-100 text-purple-700',
  swap:        'bg-blue-100 text-blue-700',
  add:         'bg-emerald-100 text-emerald-700',
  restructure: 'bg-amber-100 text-amber-700',
  // legacy types from old analyses stored in localStorage
  remove:  'bg-red-100 text-red-700',
  reorder: 'bg-indigo-100 text-indigo-700',
};

function EditCard({ edit, decision, awaitingPlacement, experiences, workingBullets,
  onAccept, onDecline, onUndo, onConfirmAdd, onCancelAdd }: {
  edit: SuggestedEdit; decision?: Decision; awaitingPlacement: boolean;
  experiences: Experience[]; workingBullets: Record<string, string[]>;
  onAccept: () => void; onDecline: () => void; onUndo: () => void;
  onConfirmAdd: (expId: string, pos: number) => void; onCancelAdd: () => void;
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const isAccepted = decision === 'accepted';
  const isDeclined = decision === 'declined';
  const isPending = !decision && !awaitingPlacement;
  const hasBreakdown = (edit.impactBreakdown?.length ?? 0) > 0;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${
      isAccepted ? 'border-green-200' : isDeclined ? 'border-gray-100 opacity-60' : 'border-gray-200'
    }`}>
      <div className={`flex items-center gap-2 px-4 py-2 border-b ${
        isAccepted ? 'bg-green-50 border-green-100' : isDeclined ? 'bg-gray-50 border-gray-100' : 'bg-gray-50 border-gray-100'
      }`}>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE[edit.type] ?? TYPE_BADGE.rewrite}`}>
          {edit.type}
        </span>
        <span className="text-xs text-gray-500 flex-1 truncate">{edit.target}</span>
        {edit.impactScore > 0 && (
          <span className="text-xs font-semibold text-indigo-600 flex-shrink-0">+{edit.impactScore} pts</span>
        )}
        {isAccepted && <span className="text-xs text-green-600 font-semibold flex-shrink-0">✓</span>}
        {isDeclined && <span className="text-xs text-gray-400 font-semibold flex-shrink-0">✗</span>}
      </div>

      <div className="px-4 py-3 space-y-2 bg-white">
        {edit.current && (
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1">Current</p>
            <p className={`text-xs leading-relaxed px-3 py-2 rounded-lg border-l-4 ${
              isAccepted && edit.type === 'rewrite'
                ? 'bg-red-50 border-red-300 line-through text-gray-400'
                : 'bg-gray-50 border-gray-300 text-gray-700'
            }`}>{edit.current}</p>
          </div>
        )}
        {edit.suggested && (
          <div>
            <p className="text-xs font-medium text-emerald-600 mb-1">
              {edit.type === 'add' ? 'New bullet (from repository)' : 'Suggested'}
            </p>
            <p className="text-xs leading-relaxed bg-emerald-50 border-l-4 border-emerald-400 px-3 py-2 rounded-lg text-gray-800">
              {edit.suggested}
            </p>
          </div>
        )}
        {(edit.keywordsAdded?.length ?? 0) > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-gray-400">Adds:</span>
            {edit.keywordsAdded.map(kw => (
              <span key={kw} className="text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">+{kw}</span>
            ))}
          </div>
        )}
        {edit.reason && <p className="text-xs text-gray-400 italic">{edit.reason}</p>}

        {/* Impact breakdown */}
        {hasBreakdown && (
          <div>
            <button
              onClick={() => setShowBreakdown(v => !v)}
              className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700"
            >
              {showBreakdown ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              Why +{edit.impactScore} pts?
            </button>
            {showBreakdown && (
              <ul className="mt-1.5 space-y-1">
                {edit.impactBreakdown!.map((item, i) => (
                  <li key={i} className="flex items-start justify-between gap-2 text-xs text-gray-500 bg-indigo-50 px-2.5 py-1.5 rounded-lg">
                    <span>{item.reason}</span>
                    <span className="font-semibold text-indigo-600 flex-shrink-0">+{item.points}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {isPending && (
          <div className="flex gap-2 pt-1">
            <button onClick={onAccept}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors">
              <Check size={12} /> Accept
            </button>
            <button onClick={onDecline}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-100 border border-red-200 transition-colors">
              <X size={12} /> Decline
            </button>
          </div>
        )}
        {(isAccepted || isDeclined) && (
          <button onClick={onUndo} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 pt-1">
            <RotateCcw size={11} /> Undo
          </button>
        )}
        {awaitingPlacement && (
          <AddPlacementPicker
            experiences={experiences}
            workingBullets={workingBullets}
            onConfirm={onConfirmAdd}
            onCancel={onCancelAdd}
          />
        )}
      </div>
    </div>
  );
}

// ─── Score color helper ───────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 75) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-500';
  if (score >= 45) return 'text-orange-500';
  return 'text-red-500';
}

// ─── Main component ───────────────────────────────────────────────────────────

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror  = reject;
    reader.readAsDataURL(blob);
  });
}

interface EditReviewPanelProps {
  analysis: JDAnalysis;
  experiences: Experience[];
}

export default function EditReviewPanel({ analysis, experiences }: EditReviewPanelProps) {
  const { settings } = useSettings();
  const [decisions, setDecisions] = useState<Record<number, Decision>>({});
  const [placements, setPlacements] = useState<Record<number, AddPlacement>>({});
  const [addPending, setAddPending] = useState<number | null>(null);
  const [showCoverLetter, setShowCoverLetter] = useState(true);
  const [copiedCL, setCopiedCL] = useState(false);
  const [savingApplication, setSavingApplication] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const edits: SuggestedEdit[] = (Array.isArray(analysis.suggestedEdits) ? analysis.suggestedEdits : [])
    .filter(e => !`${e.target} ${e.suggested} ${e.gapFilled ?? ''}`.toLowerCase().includes('professional summary'));
  const targetFunction = matchFunctionTag(analysis.jobFitAnalysis?.functionFit?.jdFunction ?? '');

  // Fix 3 — base = only experiences present in the uploaded resume (education always included)
  const initialBullets = useMemo<Record<string, string[]>>(() => {
    const b: Record<string, string[]> = {};
    const resumeText = analysis.resumeText ?? '';
    for (const exp of experiences) {
      const inResume = exp.type === 'education' || !resumeText || isOrgInResume(exp.organization, resumeText);
      if (inResume) {
        b[exp.id] = exp.achievements.map(a => getVariantText(a, targetFunction)).filter(Boolean);
      }
    }
    return b;
  }, [experiences, targetFunction, analysis.resumeText]);

  const workingBullets = useMemo(
    () => computeWorkingBullets(initialBullets, decisions, placements, edits),
    [initialBullets, decisions, placements, edits]
  );

  const accepted = Object.values(decisions).filter(d => d === 'accepted').length;
  const declined = Object.values(decisions).filter(d => d === 'declined').length;
  const pending  = edits.length - accepted - declined;

  // Live score interpolation — only available when AI provided projected scores
  const liveScoreResult = useMemo(() => {
    if (analysis.projectedScore == null || !analysis.projectedBreakdown) return null;
    const acceptedIndices = Object.entries(decisions)
      .filter(([, d]) => d === 'accepted')
      .map(([i]) => Number(i));
    return computePostEditScore(
      analysis.overallScore,
      analysis.breakdown,
      analysis.projectedBreakdown,
      edits,
      acceptedIndices,
    );
  }, [analysis, decisions, edits]);

  function accept(i: number) {
    if (edits[i]?.type === 'add') setAddPending(i);
    else setDecisions(d => ({ ...d, [i]: 'accepted' }));
  }
  function decline(i: number) {
    setDecisions(d => ({ ...d, [i]: 'declined' }));
    if (addPending === i) setAddPending(null);
  }
  function undo(i: number) {
    setDecisions(d => { const n = { ...d }; delete n[i]; return n; });
    setPlacements(p => { const n = { ...p }; delete n[i]; return n; });
  }
  function confirmAdd(i: number, expId: string, pos: number) {
    setPlacements(p => ({ ...p, [i]: { experienceId: expId, position: pos } }));
    setDecisions(d => ({ ...d, [i]: 'accepted' }));
    setAddPending(null);
  }

  const jdKeywords = [...(analysis.matchedKeywords ?? []), ...(analysis.missingKeywords ?? [])];
  const educationEntries: ResumeExportEntry[] = useMemo(() =>
    experiences.filter(e => e.type === 'education').map(e => ({
      organization: e.organization, location: e.location,
      startDate: e.startDate, endDate: e.endDate, title: e.title,
      bullets: workingBullets[e.id] ?? [],
    })), [experiences, workingBullets]);

  const experienceEntries: ResumeExportEntry[] = useMemo(() =>
    experiences
      .filter(e => e.type !== 'education')
      .sort((a, b) => b.startDate.localeCompare(a.startDate))
      .map(e => ({
        organization: e.organization, location: e.location,
        startDate: e.startDate, endDate: e.endDate, title: e.title,
        bullets: workingBullets[e.id] ?? [],
      }))
      .filter(e => e.bullets.length > 0),
    [experiences, workingBullets]);

  // Skills always present in every resume export, regardless of experience data or char budget
  const PINNED_SKILLS = ['SQL', 'Advanced Excel', 'PowerPoint', 'Claude Code'];

  // Skills text: pinned first, then experience skills + accepted-edit keywords sorted by JD relevance
  const skillsText = useMemo(() => {
    const baseSkills = experiences.flatMap(e => e.skills);
    const acceptedKeywords = edits
      .filter((_, i) => decisions[i] === 'accepted')
      .flatMap(edit => edit.keywordsAdded ?? []);
    return buildSkillsText([...baseSkills, ...acceptedKeywords], jdKeywords, 210, PINNED_SKILLS);
  }, [experiences, jdKeywords, decisions, edits]);

  const exportFilename = `Optimized_${analysis.jobTitle || 'Resume'}_${analysis.company || ''}.docx`
    .replace(/\s+/g, '_').replace(/_+/g, '_');

  async function handleMarkApplied() {
    setSavingApplication(true);
    try {
      const docxBlob    = await buildDocx(settings.defaultHeader, educationEntries, experienceEntries, skillsText);
      const docxBase64  = await blobToBase64(docxBlob);

      const reportHtml = generateReportHtml({
        analysis,
        candidateHeader: settings.defaultHeader,
        dateApplied: (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })(),
        interpolatedScore:    liveScoreResult?.overallScore ?? null,
        interpolatedBreakdown: liveScoreResult?.breakdown   ?? null,
        acceptedEditCount: accepted,
        totalEditCount:    edits.length,
        educationEntries,
        experienceEntries,
        skillsText,
      });

      const company  = analysis.company  || 'Unknown';
      const roleName = analysis.jobTitle || 'Unknown';
      const docxFilename = `${company}_${roleName}_Resume.docx`.replace(/\s+/g, '_').replace(/_+/g, '_');
      const htmlFilename = `${company}_${roleName}_Report.html`.replace(/\s+/g, '_').replace(/_+/g, '_');

      // Try to save to local filesystem
      await saveApplicationFiles(company, roleName, [
        { name: docxFilename, blob: docxBlob },
        { name: htmlFilename, blob: new Blob([reportHtml], { type: 'text/html' }) },
      ]);

      // Save to localStorage tracker
      addApplication({
        id:                crypto.randomUUID(),
        serialNo:          nextSerialNo(),
        company,
        roleName,
        dateApplied:       new Date().toISOString().slice(0, 10),
        status:            'Applied',
        originalScore:     analysis.overallScore,
        updatedScore:      liveScoreResult?.overallScore    ?? null,
        projectedScore:    analysis.projectedScore          ?? null,
        projectedBreakdown: analysis.projectedBreakdown    ?? null,
        acceptedEditCount: accepted,
        totalEditCount:    edits.length,
        analysisId:        analysis.id,
        docxBase64,
        docxFilename,
        reportHtml,
        createdAt:         new Date().toISOString(),
        updatedAt:         new Date().toISOString(),
      });

      setAppliedSuccess(true);
    } finally {
      setSavingApplication(false);
    }
  }

  function copyCoverLetter() {
    if (!analysis.coverLetter) return;
    navigator.clipboard.writeText(analysis.coverLetter).then(() => {
      setCopiedCL(true);
      setTimeout(() => setCopiedCL(false), 2000);
    });
  }

  return (
    <div className="space-y-4">
      {/* Panel header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Build Your Optimized Resume</h2>
          <p className="text-xs text-gray-500 mt-0.5">Accept or decline each suggestion — the preview updates live</p>
        </div>
        <div className="flex gap-2 text-xs">
          {accepted > 0 && <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">{accepted} accepted</span>}
          {declined > 0 && <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full font-medium">{declined} declined</span>}
          {pending  > 0 && <span className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full font-medium">{pending} pending</span>}
        </div>
      </div>

      {/* Fix 2 — Cover letter: full-width card above the two-column layout */}
      {analysis.coverLetter && (
        <div className="border border-blue-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowCoverLetter(v => !v)}
            className="w-full flex items-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors text-left"
          >
            <Mail size={15} className="text-blue-500 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-800 flex-1">Cover Letter</span>
            <button
              onClick={e => { e.stopPropagation(); copyCoverLetter(); }}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2 flex-shrink-0"
            >
              {copiedCL ? <><CheckCircle size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
            </button>
            {showCoverLetter ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
          </button>
          {showCoverLetter && (
            <div className="px-5 py-4 bg-white text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
              {analysis.coverLetter}
            </div>
          )}
        </div>
      )}

      {/* Two-column layout: scrollable edits | live preview */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 items-start">

        {/* Left — suggested edits, independently scrollable */}
        <div className="xl:col-span-2 flex flex-col">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Suggested Edits ({edits.length})
          </p>
          <div
            className="space-y-3 overflow-y-auto pr-1"
            style={{ maxHeight: '580px' }}
          >
            {edits.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No suggested edits generated.</p>
            ) : (
              edits.map((edit, i) => (
                <EditCard
                  key={i} edit={edit}
                  decision={decisions[i]}
                  awaitingPlacement={addPending === i}
                  experiences={experiences}
                  workingBullets={workingBullets}
                  onAccept={() => accept(i)}
                  onDecline={() => decline(i)}
                  onUndo={() => undo(i)}
                  onConfirmAdd={(expId, pos) => confirmAdd(i, expId, pos)}
                  onCancelAdd={() => setAddPending(null)}
                />
              ))
            )}
          </div>

          {/* Live running total */}
          {liveScoreResult != null && (
            <div className="mt-3 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-indigo-500" />
                <span className="text-xs font-semibold text-indigo-700">Live Score Estimate</span>
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className={`text-2xl font-bold ${scoreColor(liveScoreResult.overallScore)}`}>
                  {liveScoreResult.overallScore}
                </span>
                <span className="text-sm text-gray-400">/ 100</span>
                {liveScoreResult.pointsGained !== 0 && (
                  <span className={`text-sm font-semibold ${liveScoreResult.pointsGained > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    ({liveScoreResult.pointsGained > 0 ? '+' : ''}{liveScoreResult.pointsGained} from {analysis.overallScore})
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Accepted {accepted} of {edits.length} edits
                {analysis.projectedScore != null && accepted < edits.length && (
                  <> · Accept all for up to <span className="font-semibold text-indigo-600">{analysis.projectedScore}</span></>
                )}
              </p>
            </div>
          )}

          {/* Static hint when projected score available but no edits accepted yet */}
          {liveScoreResult == null && analysis.projectedScore != null && edits.length > 0 && (
            <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-gray-400" />
                <span className="text-xs text-gray-500">
                  Accept edits to see live score · potential: <span className="font-semibold text-indigo-600">{analysis.projectedScore}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right — live resume preview + export */}
        <div className="xl:col-span-3 space-y-3">
          <ResumePreview
            header={settings.defaultHeader}
            educationEntries={educationEntries}
            experienceEntries={experienceEntries}
            skillsText={skillsText}
          />
          <ResumeExport
            header={settings.defaultHeader}
            educationEntries={educationEntries}
            experienceEntries={experienceEntries}
            skillsText={skillsText}
            filename={exportFilename}
            disabled={educationEntries.length === 0 && experienceEntries.length === 0}
          />
        </div>
      </div>

      {/* ─── Mark as Applied ───────────────────────────────────────────────── */}
      <div className="border-t border-gray-200 pt-5 space-y-3">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleMarkApplied}
            disabled={savingApplication || appliedSuccess}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {savingApplication
              ? <><Loader2 size={16} className="animate-spin" /> Saving...</>
              : appliedSuccess
              ? <><CheckCircle size={16} /> Applied!</>
              : <><Send size={16} /> Mark as Applied</>}
          </button>
          <p className="text-xs text-gray-400">
            Saves resume + report to Applications tracker{settings.saveFolderName ? ` · Files → ${settings.saveFolderName}` : ' · Configure save folder in Settings'}
          </p>
        </div>
        {appliedSuccess && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <CheckCircle size={15} className="flex-shrink-0" />
            Application saved! Check the <strong>Applications</strong> tab in the Dashboard.
          </div>
        )}
      </div>
    </div>
  );
}
