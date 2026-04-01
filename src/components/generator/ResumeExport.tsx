import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import type { ResumeHeader } from '../../types';
import { buildDocx, downloadBlob, type ResumeExportEntry } from '../../services/docxExport';

interface Props {
  header: ResumeHeader;
  educationEntries: ResumeExportEntry[];
  experienceEntries: ResumeExportEntry[];
  skillsText: string;
  filename?: string;
  disabled?: boolean;
}

export default function ResumeExport({
  header,
  educationEntries,
  experienceEntries,
  skillsText,
  filename = 'resume.docx',
  disabled,
}: Props) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setExporting(true);
    setError(null);
    try {
      const blob = await buildDocx(header, educationEntries, experienceEntries, skillsText);
      downloadBlob(blob, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={disabled || exporting}
        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm w-full justify-center"
      >
        {exporting ? (
          <><Loader2 size={16} className="animate-spin" /> Generating .docx…</>
        ) : (
          <><Download size={16} /> Export .docx</>
        )}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
