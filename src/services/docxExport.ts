import {
  AlignmentType,
  BorderStyle,
  Document,
  LevelFormat,
  Packer,
  Paragraph,
  TabStopType,
  TextRun,
  convertInchesToTwip,
} from 'docx';
import type { ResumeHeader } from '../types';

export interface ResumeExportEntry {
  organization: string;
  location: string;
  startDate: string;
  endDate: string | null;
  title: string;
  bullets: string[];
}

// ─── Date helpers ────────────────────────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmtDate(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  const m = parseInt(month ?? '1') - 1;
  return `${MONTHS[m] ?? 'Jan'} ${year}`;
}

export function buildDateRange(startDate: string, endDate: string | null): string {
  return `${fmtDate(startDate)}\u2013${endDate ? fmtDate(endDate) : 'Present'}`;
}

// ─── Style constants ──────────────────────────────────────────────────────────

const FONT = 'Calibri';
const BODY_PT = 20;   // 10pt in half-points
const NAME_PT = 28;   // 14pt
const CONTACT_PT = 18; // 9pt
// Content width: 8.5" page - 0.6" left - 0.6" right = 7.3"
const RIGHT_TAB = convertInchesToTwip(7.3);

// ─── Paragraph builders ───────────────────────────────────────────────────────

function sectionHeader(label: string): Paragraph {
  return new Paragraph({
    spacing: { before: 80, after: 30 },
    border: {
      bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 },
    },
    children: [
      new TextRun({ text: label.toUpperCase(), bold: true, size: BODY_PT, font: FONT }),
    ],
  });
}

function orgDateLine(org: string, location: string, dateRange: string): Paragraph {
  return new Paragraph({
    spacing: { before: 30, after: 0 },
    tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
    children: [
      new TextRun({ text: `${org.toUpperCase()}, ${location}`, bold: true, size: BODY_PT, font: FONT }),
      new TextRun({ text: '\t', size: BODY_PT, font: FONT }),
      new TextRun({ text: dateRange, size: BODY_PT, font: FONT }),
    ],
  });
}

function titleLine(title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 0, after: 20 },
    children: [new TextRun({ text: title, italics: true, size: BODY_PT, font: FONT })],
  });
}

function bulletLine(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.BOTH,
    spacing: { before: 0, after: 0 },
    numbering: { reference: 'resume-bullets', level: 0 },
    children: [new TextRun({ text, size: BODY_PT, font: FONT })],
  });
}

function plainLine(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [new TextRun({ text, size: BODY_PT, font: FONT })],
  });
}

// ─── Main export builder ──────────────────────────────────────────────────────

export async function buildDocx(
  header: ResumeHeader,
  educationEntries: ResumeExportEntry[],
  experienceEntries: ResumeExportEntry[],
  skillsText: string,
): Promise<Blob> {
  const children: Paragraph[] = [];

  // Name (centered, bold, large)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 20 },
      children: [
        new TextRun({ text: header.name.toUpperCase(), bold: true, size: NAME_PT, font: FONT }),
      ],
    }),
  );

  // Contact info (centered, smaller)
  const contacts = [header.email, header.location, header.phone, header.linkedin].filter(Boolean);
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [new TextRun({ text: contacts.join(' | '), size: CONTACT_PT, font: FONT })],
    }),
  );

  // Education
  if (educationEntries.length > 0) {
    children.push(sectionHeader('Education'));
    for (const e of educationEntries) {
      children.push(orgDateLine(e.organization, e.location, buildDateRange(e.startDate, e.endDate)));
      children.push(titleLine(e.title));
      for (const b of e.bullets) children.push(bulletLine(b));
    }
  }

  // Experience
  if (experienceEntries.length > 0) {
    children.push(sectionHeader('Experience'));
    for (const e of experienceEntries) {
      children.push(orgDateLine(e.organization, e.location, buildDateRange(e.startDate, e.endDate)));
      children.push(titleLine(e.title));
      for (const b of e.bullets) children.push(bulletLine(b));
    }
  }

  // Skills and Activities
  if (skillsText) {
    children.push(sectionHeader('Skills and Activities'));
    children.push(plainLine(skillsText));
  }

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'resume-bullets',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '\u2022',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: 360, hanging: 360 } },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.6),
              right: convertInchesToTwip(0.6),
              bottom: convertInchesToTwip(0.6),
              left: convertInchesToTwip(0.6),
            },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}

// ─── Skills text builder (max 2 resume lines ≈ 210 chars, JD-prioritized) ─────

export function buildSkillsText(
  allSkills: string[],
  priorityKeywords: string[] = [],
  maxChars = 210,
  pinnedSkills: string[] = [],
): string {
  // Pinned skills always appear first, in order, regardless of char budget
  const pinnedUnique = [...new Set(pinnedSkills.filter(Boolean))];
  const pinnedLower  = new Set(pinnedUnique.map((s) => s.toLowerCase()));

  // Remaining skills — deduped, excluding already-pinned
  const remaining = [...new Set(allSkills.filter(Boolean))].filter(
    (s) => !pinnedLower.has(s.toLowerCase())
  );

  const kwSet = new Set(priorityKeywords.map((k) => k.toLowerCase()));
  const scored = remaining.map((s) => {
    const sl = s.toLowerCase();
    const score = kwSet.has(sl)
      ? 2
      : [...kwSet].some((k) => k.includes(sl) || sl.includes(k))
      ? 1
      : 0;
    return { skill: s, score };
  });
  scored.sort((a, b) => b.score - a.score);

  // Start with pinned skills, then fill remaining budget with sorted skills
  let result = pinnedUnique.join(', ');
  for (const { skill } of scored) {
    const candidate = result ? `${result}, ${skill}` : skill;
    if (candidate.length > maxChars) break;
    result = candidate;
  }
  return result;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
