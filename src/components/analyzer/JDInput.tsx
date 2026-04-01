import { Link } from 'lucide-react';

interface JDInputProps {
  jdText: string;
  jobTitle: string;
  company: string;
  jobUrl: string;
  onChange: (fields: { jdText?: string; jobTitle?: string; company?: string; jobUrl?: string }) => void;
}

export default function JDInput({ jdText, jobTitle, company, jobUrl, onChange }: JDInputProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h2 className="text-base font-semibold text-gray-800">Job Description</h2>

      {/* Job meta */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Job title *</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => onChange({ jobTitle: e.target.value })}
            placeholder="Product Manager"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Company *</label>
          <input
            type="text"
            value={company}
            onChange={(e) => onChange({ company: e.target.value })}
            placeholder="Acme Corp"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Optional URL */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          <span className="flex items-center gap-1"><Link size={11} /> Job URL (optional)</span>
        </label>
        <input
          type="url"
          value={jobUrl}
          onChange={(e) => onChange({ jobUrl: e.target.value })}
          placeholder="https://..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* JD text */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Paste full job description *
        </label>
        <textarea
          value={jdText}
          onChange={(e) => onChange({ jdText: e.target.value })}
          rows={14}
          placeholder="Paste the complete job description here — include all requirements, responsibilities, and qualifications for best scoring accuracy."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono"
        />
        {jdText && (
          <p className="text-xs text-gray-400 mt-1 text-right">{jdText.length} chars · ~{Math.round(jdText.split(/\s+/).length)} words</p>
        )}
      </div>
    </div>
  );
}
