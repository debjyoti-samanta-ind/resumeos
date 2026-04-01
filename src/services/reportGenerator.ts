import type { JDAnalysis, ResumeHeader } from '../types';
import type { ResumeExportEntry } from './docxExport';
import { buildDateRange } from './docxExport';

type ScoreBreakdown = {
  keywordMatch: number;
  jobFit: number;
  skillsAlignment: number;
  experienceRelevance: number;
  formatCompliance: number;
};

export interface ReportData {
  analysis: JDAnalysis;
  candidateHeader: ResumeHeader;
  dateApplied: string;                 // YYYY-MM-DD
  interpolatedScore: number | null;    // computePostEditScore result (accepted edits)
  interpolatedBreakdown: ScoreBreakdown | null;
  acceptedEditCount: number;
  totalEditCount: number;
  educationEntries: ResumeExportEntry[];
  experienceEntries: ResumeExportEntry[];
  skillsText: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function esc(s: string | undefined | null): string {
  return (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function scoreColor(n: number): string {
  if (n >= 75) return '#16a34a';
  if (n >= 60) return '#d97706';
  return '#dc2626';
}

function delta(before: number, after: number): string {
  const d = after - before;
  if (d === 0) return `<span style="color:#6b7280">—</span>`;
  const color = d > 0 ? '#16a34a' : '#dc2626';
  return `<span style="color:${color};font-weight:700">${d > 0 ? '+' : ''}${d}</span>`;
}

function verdictBadge(v: string): string {
  const map: Record<string, [string, string]> = {
    strong:   ['#d1fae5', '#065f46'],
    moderate: ['#fef3c7', '#92400e'],
    stretch:  ['#fee2e2', '#991b1b'],
    weak:     ['#fce7f3', '#9d174d'],
  };
  const [bg, fg] = map[v] ?? ['#f3f4f6', '#374151'];
  return `<span style="background:${bg};color:${fg};padding:3px 12px;border-radius:9999px;font-size:10pt;font-weight:700;text-transform:capitalize">${esc(v)}</span>`;
}

function gapItem(area: string, severity: string, suggestion: string): string {
  const colors: Record<string, [string, string, string]> = {
    critical: ['#fff1f2', '#f43f5e', '#9f1239'],
    moderate: ['#fffbeb', '#f59e0b', '#92400e'],
    minor:    ['#f0fdf4', '#22c55e', '#14532d'],
  };
  const [bg, border, badgeFg] = colors[severity] ?? colors.minor;
  const badgeBg = severity === 'critical' ? '#fecdd3' : severity === 'moderate' ? '#fde68a' : '#bbf7d0';
  return `
    <div style="margin-bottom:12px;padding:10px 14px;border-radius:6px;border-left:4px solid ${border};background:${bg}">
      <span style="background:${badgeBg};color:${badgeFg};font-size:8pt;font-weight:700;padding:1px 8px;border-radius:4px;text-transform:uppercase;display:inline-block;margin-bottom:6px">${esc(severity)}</span>
      <div style="font-weight:600;font-size:10.5pt;margin-bottom:4px">${esc(area)}</div>
      <div style="font-size:10pt;color:#374151">${esc(suggestion)}</div>
    </div>`;
}

// ─── Main generator ───────────────────────────────────────────────────────────

export function generateReportHtml(data: ReportData): string {
  const {
    analysis, candidateHeader, dateApplied,
    interpolatedScore, interpolatedBreakdown,
    acceptedEditCount, totalEditCount,
    educationEntries, experienceEntries, skillsText,
  } = data;
  const jf   = analysis.jobFitAnalysis;
  const orig = analysis.overallScore;
  const upd  = interpolatedScore;
  const pot  = analysis.projectedScore ?? null;

  const dimLabels: Record<string, string> = {
    keywordMatch:         'Keyword Match',
    skillsAlignment:      'Skills Alignment',
    experienceRelevance:  'Exp. Relevance',
    formatCompliance:     'Format',
    jobFit:               'Job Fit',
  };

  const allDims = ['keywordMatch', 'skillsAlignment', 'experienceRelevance', 'formatCompliance', 'jobFit'] as const;

  // Score rows — all 5 dimensions, 3 columns: Original | Your Score | Potential
  const scoreRows = allDims.map((d) => {
    const b = analysis.breakdown[d] ?? 0;
    const a = interpolatedBreakdown ? (interpolatedBreakdown[d] ?? b) : null;
    const p = analysis.projectedBreakdown ? (analysis.projectedBreakdown[d] ?? b) : null;
    const yourDelta = a !== null ? a - b : null;
    return `
      <tr>
        <td>${dimLabels[d]}</td>
        <td style="text-align:center;font-weight:600;color:${scoreColor(b)}">${b}</td>
        <td style="text-align:center;font-weight:600;color:${a !== null ? scoreColor(a) : '#6b7280'}">${a !== null ? a : '—'}</td>
        <td style="text-align:center;font-weight:600;color:${p !== null ? scoreColor(p) : '#6b7280'}">${p !== null ? p : '—'}</td>
        <td style="text-align:center">${yourDelta !== null ? delta(b, a!) : '—'}</td>
      </tr>`;
  }).join('');

  // Overall row
  const overallRow = `
    <tr style="font-weight:700;font-size:12pt;background:#f0fdf4">
      <td>Overall</td>
      <td style="text-align:center;color:${scoreColor(orig)}">${orig}</td>
      <td style="text-align:center;color:${upd !== null ? scoreColor(upd) : '#6b7280'}">${upd !== null ? upd : '—'}</td>
      <td style="text-align:center;color:${pot !== null ? scoreColor(pot) : '#6b7280'}">${pot !== null ? pot : '—'}</td>
      <td style="text-align:center">${upd !== null ? delta(orig, upd) : '—'}</td>
    </tr>`;

  // Narrative summary banner
  const narrativeParts: string[] = [];
  narrativeParts.push(`You started at <strong>${orig}</strong>.`);
  if (totalEditCount > 0) {
    narrativeParts.push(`You accepted <strong>${acceptedEditCount} of ${totalEditCount}</strong> suggested edits.`);
  }
  if (upd !== null) {
    narrativeParts.push(`Your optimized score is <strong style="color:${scoreColor(upd)}">${upd}</strong>.`);
  }
  if (pot !== null && upd !== pot) {
    narrativeParts.push(`Full potential was <strong>${pot}</strong> if all edits had been accepted.`);
  }
  const narrativeHtml = narrativeParts.length > 0
    ? `<div style="background:#eef2ff;border-left:4px solid #4f46e5;padding:12px 18px;border-radius:0 8px 8px 0;font-size:10.5pt;margin-bottom:20px;line-height:1.7">${narrativeParts.join(' ')}</div>`
    : '';

  // Gaps
  const gapsHtml = (analysis.gaps ?? []).length === 0
    ? '<p style="color:#6b7280">No gaps identified.</p>'
    : (analysis.gaps ?? []).map(g => gapItem(g.area, g.severity, g.suggestion)).join('');

  // Resume sections
  const resumeEduHtml = educationEntries.map(e => `
    <div style="margin-bottom:12px">
      <div style="font-weight:700;text-transform:uppercase;font-size:10pt">${esc(e.organization)}, ${esc(e.location)} <span style="font-weight:400;font-style:italic">${buildDateRange(e.startDate, e.endDate)}</span></div>
      <div style="font-style:italic;color:#374151;margin-bottom:4px">${esc(e.title)}</div>
      ${e.bullets.map(b => `<div style="margin-left:18px;margin-bottom:2px">• ${esc(b)}</div>`).join('')}
    </div>`).join('');

  const resumeExpHtml = experienceEntries.map(e => `
    <div style="margin-bottom:12px">
      <div style="font-weight:700;text-transform:uppercase;font-size:10pt">${esc(e.organization)}, ${esc(e.location)} <span style="font-weight:400;font-style:italic">${buildDateRange(e.startDate, e.endDate)}</span></div>
      <div style="font-style:italic;color:#374151;margin-bottom:4px">${esc(e.title)}</div>
      ${e.bullets.map(b => `<div style="margin-left:18px;margin-bottom:2px">• ${esc(b)}</div>`).join('')}
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Analysis Report — ${esc(analysis.jobTitle)} at ${esc(analysis.company)}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:11pt;color:#111;max-width:900px;margin:0 auto;padding:40px 50px;line-height:1.5}
  @page{margin:.75in}
  @media print{.no-print{display:none!important}body{padding:0}}
  h2{font-size:12pt;font-weight:700;text-transform:uppercase;letter-spacing:.5px;border-bottom:2px solid #111;padding-bottom:4px;margin:28px 0 14px}
  h3{font-size:11pt;font-weight:700;margin-bottom:4px}
  table{width:100%;border-collapse:collapse}
  th{text-align:left;padding:6px 12px;font-size:9pt;font-weight:700;text-transform:uppercase;color:#6b7280;background:#f9fafb;border:1px solid #e5e7eb}
  td{padding:8px 12px;border:1px solid #e5e7eb;font-size:10pt}
  .print-bar{display:flex;gap:10px;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid #e5e7eb}
  .btn{padding:8px 20px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;border:none}
  .btn-primary{background:#4f46e5;color:#fff}
  .btn-secondary{background:#f3f4f6;color:#374151;border:1px solid #d1d5db}
  .cover-box{border:1px solid #c7d2fe;border-radius:8px;padding:20px 24px;background:#f5f3ff;white-space:pre-wrap;font-size:10.5pt;line-height:1.8}
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
  .fit-card{border:1px solid #e5e7eb;border-radius:8px;padding:14px}
  .fit-label{font-size:8pt;font-weight:700;text-transform:uppercase;color:#6b7280;margin-bottom:6px}
  .fit-score{font-size:13pt;font-weight:700}
  ul.plain{list-style:none;padding:0}
  ul.plain li{padding:3px 0 3px 20px;position:relative}
  ul.plain li::before{position:absolute;left:0}
  .strength-li::before{content:"✓";color:#16a34a}
  .concern-li::before{content:"✗";color:#dc2626}
  .advice-box{background:#eef2ff;border-left:4px solid #4f46e5;padding:12px 16px;border-radius:0 8px 8px 0;font-size:10pt;margin-top:12px}
  .note{font-size:8.5pt;color:#9ca3af;margin-top:6px}
</style>
</head>
<body>

<!-- Print / save buttons -->
<div class="print-bar no-print">
  <button class="btn btn-primary" onclick="window.print()">🖨 Print / Save as PDF</button>
  <button class="btn btn-secondary" onclick="window.close()">Close</button>
</div>

<!-- Title -->
<div style="margin-bottom:24px">
  <div style="font-size:20pt;font-weight:700;margin-bottom:4px">${esc(candidateHeader.name)}</div>
  <div style="font-size:13pt;font-weight:600;color:#1f2937">${esc(analysis.jobTitle || 'Role')} — ${esc(analysis.company || 'Company')}</div>
  <div style="color:#6b7280;font-size:10pt;margin-top:6px">
    <span style="margin-right:20px">Applied: ${new Date(dateApplied).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</span>
    <span style="margin-right:20px">${esc(candidateHeader.email)}</span>
    <span>${esc(candidateHeader.linkedin)}</span>
  </div>
</div>

<!-- Scores -->
<h2>Scores</h2>
${narrativeHtml}
<table style="margin-bottom:6px">
  <thead><tr><th>Dimension</th><th style="text-align:center">Original</th><th style="text-align:center">Your Score</th><th style="text-align:center">Potential</th><th style="text-align:center">Delta</th></tr></thead>
  <tbody>
    ${overallRow}
    ${scoreRows}
  </tbody>
</table>
<p class="note">Original = AI score before edits. Your Score = interpolated score based on accepted edits. Potential = projected score if all edits accepted. Delta = Your Score vs Original.</p>

<!-- Job Fit -->
<h2>Job Fit Analysis</h2>
<div style="margin-bottom:16px">
  <span style="font-weight:600">Overall Verdict: </span>${verdictBadge(jf?.overallFitVerdict ?? '')}
</div>

<div class="two-col">
  <div class="fit-card">
    <div class="fit-label">Function Fit</div>
    <div class="fit-score" style="color:${scoreColor(jf?.functionFit?.score ?? 0)}">${jf?.functionFit?.score ?? 0}</div>
    <div style="font-size:10pt;color:#374151;margin-top:4px">${esc(jf?.functionFit?.gapNarrative)}</div>
  </div>
  <div class="fit-card">
    <div class="fit-label">Industry Fit</div>
    <div class="fit-score" style="color:${scoreColor(jf?.industryFit?.score ?? 0)}">${jf?.industryFit?.score ?? 0}</div>
    <div style="font-size:10pt;color:#374151;margin-top:4px">${(jf?.industryFit?.transferableAngles ?? []).join(' · ') || '—'}</div>
  </div>
</div>

<div class="two-col">
  <div class="fit-card">
    <div class="fit-label">Seniority Match</div>
    <div style="font-size:10.5pt;font-weight:600;color:${jf?.seniorityMatch?.isMatch ? '#16a34a' : '#dc2626'}">${jf?.seniorityMatch?.isMatch ? '✓ Match' : '✗ Mismatch'}</div>
    <div style="font-size:10pt;color:#374151;margin-top:4px">${esc(jf?.seniorityMatch?.explanation)}</div>
  </div>
  <div class="fit-card">
    <div class="fit-label">Narrative Coherence</div>
    <div class="fit-score" style="color:${scoreColor(jf?.narrativeCoherence?.score ?? 0)}">${jf?.narrativeCoherence?.score ?? 0}</div>
    <div style="font-size:10pt;color:#374151;margin-top:4px">${esc(jf?.narrativeCoherence?.suggestedNarrative)}</div>
  </div>
</div>

<h3>Strengths</h3>
<ul class="plain" style="margin:8px 0 16px">
  ${(jf?.topStrengths ?? []).map(s => `<li class="strength-li">${esc(s)}</li>`).join('')}
</ul>

<h3>Concerns</h3>
<ul class="plain" style="margin:8px 0 16px">
  ${(jf?.topConcerns ?? []).map(c => `<li class="concern-li">${esc(c)}</li>`).join('')}
</ul>

<h3>Positioning Advice</h3>
<div class="advice-box">${esc(jf?.positioningAdvice)}</div>

<!-- Gap Analysis -->
<h2>Gap Analysis</h2>
${gapsHtml}

<!-- Cover Letter -->
${analysis.coverLetter ? `<h2>Cover Letter</h2><div class="cover-box">${esc(analysis.coverLetter)}</div>` : ''}

<!-- Updated Resume -->
<h2>Updated Resume</h2>
${educationEntries.length > 0 ? `<h3 style="margin:12px 0 8px;text-transform:uppercase;font-size:10pt">Education</h3>${resumeEduHtml}` : ''}
${experienceEntries.length > 0 ? `<h3 style="margin:12px 0 8px;text-transform:uppercase;font-size:10pt">Experience</h3>${resumeExpHtml}` : ''}
${skillsText ? `<h3 style="margin:12px 0 6px;text-transform:uppercase;font-size:10pt">Skills & Activities</h3><div style="font-size:10pt">${esc(skillsText)}</div>` : ''}

<div class="note" style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb">
  Generated by ResumeOS · ${new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
</div>

</body>
</html>`;
}
