import type { ResumeHeader } from '../../types';
import type { ResumeExportEntry } from '../../services/docxExport';
import { buildDateRange } from '../../services/docxExport';

interface Props {
  header: ResumeHeader;
  educationEntries: ResumeExportEntry[];
  experienceEntries: ResumeExportEntry[];
  skillsText: string;
}

const S = {
  page:    { fontFamily: 'Calibri, Arial, sans-serif', fontSize: '10px', lineHeight: '1.35' } as React.CSSProperties,
  name:    { fontSize: '13px', fontWeight: 'bold', textAlign: 'center' as const, letterSpacing: '0.04em' },
  contact: { fontSize: '9px', textAlign: 'center' as const, color: '#555', marginBottom: '8px' },
  section: { fontWeight: 'bold', borderBottom: '1px solid #222', paddingBottom: '1px', marginTop: '7px', marginBottom: '2px', letterSpacing: '0.03em' },
  orgRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '3px' },
  orgName: { fontWeight: 'bold' },
  date:    { fontSize: '9px', color: '#555', flexShrink: 0, marginLeft: '6px' },
  title:   { fontStyle: 'italic', marginBottom: '1px' },
  bullet:  { paddingLeft: '12px', textIndent: '-7px', textAlign: 'justify' as const },
};

export default function ResumePreview({ header, educationEntries, experienceEntries, skillsText }: Props) {
  const hasContent = educationEntries.length > 0 || experienceEntries.length > 0 || skillsText;

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
        <p>Select experiences on the left</p>
        <p className="text-xs mt-1">Your resume preview will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow border border-gray-200 rounded-lg p-5 overflow-auto" style={S.page}>
      {/* Header */}
      <p style={S.name}>{header.name.toUpperCase()}</p>
      <p style={S.contact}>
        {[header.email, header.location, header.phone, header.linkedin].filter(Boolean).join(' | ')}
      </p>

      {/* Education */}
      {educationEntries.length > 0 && (
        <>
          <p style={S.section}>EDUCATION</p>
          {educationEntries.map((e, i) => (
            <div key={i}>
              <div style={S.orgRow}>
                <span style={S.orgName}>{e.organization.toUpperCase()}, {e.location}</span>
                <span style={S.date}>{buildDateRange(e.startDate, e.endDate)}</span>
              </div>
              <p style={S.title}>{e.title}</p>
              {e.bullets.map((b, j) => (
                <p key={j} style={S.bullet}><span style={{ marginRight: '4px' }}>•</span>{b}</p>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Experience */}
      {experienceEntries.length > 0 && (
        <>
          <p style={S.section}>EXPERIENCE</p>
          {experienceEntries.map((e, i) => (
            <div key={i}>
              <div style={S.orgRow}>
                <span style={S.orgName}>{e.organization.toUpperCase()}, {e.location}</span>
                <span style={S.date}>{buildDateRange(e.startDate, e.endDate)}</span>
              </div>
              <p style={S.title}>{e.title}</p>
              {e.bullets.map((b, j) => (
                <p key={j} style={S.bullet}><span style={{ marginRight: '4px' }}>•</span>{b}</p>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Skills */}
      {skillsText && (
        <>
          <p style={S.section}>SKILLS AND ACTIVITIES</p>
          <p>{skillsText}</p>
        </>
      )}
    </div>
  );
}
