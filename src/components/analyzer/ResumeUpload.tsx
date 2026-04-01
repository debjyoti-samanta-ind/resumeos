import { useState, useRef } from 'react';
import { Upload, FileText, X, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { extractTextFromPDF } from '../../services/pdfParser';

interface ResumeUploadProps {
  resumeText: string;
  fileName: string;
  onExtracted: (text: string, fileName: string) => void;
  onClear: () => void;
}

export default function ResumeUpload({ resumeText, fileName, onExtracted, onClear }: ResumeUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showText, setShowText] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    if (!file.name.endsWith('.pdf')) {
      setError('Please upload a PDF file.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const text = await extractTextFromPDF(file);
      if (!text || text.length < 50) {
        setError('Could not extract text from this PDF. It may be image-based or password-protected.');
        return;
      }
      onExtracted(text, file.name);
    } catch (err) {
      setError(`Extraction failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h2 className="text-base font-semibold text-gray-800">Resume to Score</h2>

      {!resumeText ? (
        /* Drop zone */
        <div
          onDragOver={(e) => { e.preventDefault(); if (!loading) setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={loading ? (e) => e.preventDefault() : handleDrop}
          onClick={() => { if (!loading) inputRef.current?.click(); }}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            loading
              ? 'border-indigo-300 bg-indigo-50 cursor-not-allowed'
              : dragging
              ? 'border-indigo-400 bg-indigo-50 cursor-pointer'
              : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50 cursor-pointer'
          }`}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={28} className="text-indigo-500 animate-spin" />
              <p className="text-sm font-medium text-indigo-700">Extracting text...</p>
              <p className="text-xs text-gray-400">This takes a moment for multi-page PDFs.</p>
            </div>
          ) : (
            <>
              <Upload className="mx-auto mb-3 text-gray-400" size={28} />
              <p className="text-sm font-medium text-gray-700">Drop your resume PDF here</p>
              <p className="text-xs text-gray-400 mt-1">or click to browse · PDF only</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        /* File loaded */
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <FileText size={18} className="text-green-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-800 truncate">{fileName}</p>
              <p className="text-xs text-green-600">
                {resumeText.length.toLocaleString()} chars · ~{Math.round(resumeText.split(/\s+/).length).toLocaleString()} words extracted
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowText((v) => !v)}
                className="p-1.5 text-green-600 hover:text-green-800 rounded"
                title={showText ? 'Hide extracted text' : 'Preview extracted text'}
              >
                {showText ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
              <button
                onClick={onClear}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                title="Remove and upload a different file"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {showText && (
            <textarea
              readOnly
              value={resumeText}
              rows={12}
              className="w-full px-3 py-2 text-xs font-mono border border-gray-200 rounded-lg bg-gray-50 resize-none text-gray-600"
            />
          )}

          <button
            onClick={() => inputRef.current?.click()}
            className="text-xs text-indigo-500 hover:text-indigo-700 font-medium"
          >
            Upload a different file
          </button>
          <input ref={inputRef} type="file" accept=".pdf" onChange={handleFileInput} className="hidden" />
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}
    </div>
  );
}
