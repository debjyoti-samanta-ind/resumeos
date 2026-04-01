import { useRef, useState } from 'react';
import { CheckCircle, XCircle, ChevronLeft, Upload } from 'lucide-react';
import { parseAIJSON, validateJDAnalysisResponse } from '../../services/ai';

interface AIResponseInputProps {
  onParsed: (data: unknown) => void;
  onBack: () => void;
  onCancel: () => void;
  validatorFn?: (data: unknown) => string | null;
}

export default function AIResponseInput({
  onParsed,
  onBack,
  onCancel,
  validatorFn = validateJDAnalysisResponse,
}: AIResponseInputProps) {
  const [raw, setRaw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [valid, setValid] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function processText(text: string) {
    setRaw(text);
    setError(null);
    setValid(false);
    if (!text.trim()) return;
    try {
      const parsed = parseAIJSON(text);
      const err = validatorFn(parsed);
      if (err) setError(err);
      else setValid(true);
    } catch {
      setError('Not valid JSON — make sure you saved Claude\'s full response including the { } braces.');
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => processText((ev.target?.result as string) ?? '');
    reader.readAsText(file);
    // reset so same file can be re-uploaded
    e.target.value = '';
  }

  function handleSubmit() {
    if (!valid) return;
    try {
      onParsed(parseAIJSON(raw));
    } catch {
      setError('Parsing failed — try again.');
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Upload or Paste Claude's Response</h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Save the <code className="text-xs bg-gray-100 px-1 rounded">```json</code> block from Claude.ai as a <strong>.json</strong> file and upload it — or paste the JSON text directly below.
        </p>
      </div>

      {/* File upload zone */}
      <div
        onClick={() => fileRef.current?.click()}
        className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
          fileName && valid
            ? 'border-emerald-300 bg-emerald-50'
            : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
        }`}
      >
        <Upload size={18} className={fileName && valid ? 'text-emerald-500' : 'text-gray-400'} />
        <div className="flex-1 min-w-0">
          {fileName ? (
            <p className="text-sm font-medium text-gray-700 truncate">{fileName}</p>
          ) : (
            <p className="text-sm text-gray-500">Click to upload <strong>response.json</strong></p>
          )}
          <p className="text-xs text-gray-400">Accepts .json files</p>
        </div>
        {fileName && valid && <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />}
      </div>
      <input ref={fileRef} type="file" accept=".json,.txt" className="hidden" onChange={handleFileUpload} />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or paste text</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Paste textarea */}
      <div className="relative">
        <textarea
          value={raw}
          onChange={(e) => { setFileName(null); processText(e.target.value); }}
          rows={10}
          placeholder={`Paste Claude's full response here (the \`\`\`json block or raw JSON)...`}
          className={`w-full px-4 py-3 text-sm font-mono border rounded-xl focus:outline-none focus:ring-2 resize-none ${
            error
              ? 'border-red-300 focus:ring-red-300 bg-red-50'
              : valid
              ? 'border-emerald-300 focus:ring-emerald-300 bg-emerald-50'
              : 'border-gray-300 focus:ring-indigo-500'
          }`}
        />
        {raw.trim() && (
          <div className="absolute top-3 right-3">
            {valid ? <CheckCircle size={18} className="text-emerald-500" /> : <XCircle size={18} className="text-red-400" />}
          </div>
        )}
      </div>

      {/* Validation feedback */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <XCircle size={15} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}
      {valid && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <CheckCircle size={15} /> Valid response — ready to apply.
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium">
          <ChevronLeft size={15} /> Back to prompt
        </button>
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!valid}
            className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Apply analysis
          </button>
        </div>
      </div>
    </div>
  );
}
