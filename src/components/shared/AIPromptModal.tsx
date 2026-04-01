import { useState } from 'react';
import { X, Copy, Check, ChevronRight } from 'lucide-react';
import type { AIPrompt } from '../../services/ai';

interface AIPromptModalProps {
  prompt: AIPrompt;
  title?: string;
  onNext: () => void; // user says "I have the response"
  onClose: () => void;
}

export default function AIPromptModal({
  prompt,
  title = 'Analyze with Claude.ai',
  onNext,
  onClose,
}: AIPromptModalProps) {
  const [copied, setCopied] = useState(false);

  // Format the full prompt for display — system first, then user message
  const fullPrompt = `${prompt.system}\n\n---\n\n${prompt.user}`;

  function handleCopy() {
    navigator.clipboard.writeText(fullPrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Free mode — copy this prompt into Claude.ai</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* Instructions */}
        <div className="px-6 pt-4 pb-3 flex-shrink-0">
          <ol className="flex items-center gap-0 text-sm">
            {[
              'Copy the prompt below',
              'Open Claude.ai in a new tab',
              'Paste prompt, let Claude respond',
              'Save the ```json block as response.json',
              'Upload the file (next screen)',
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-gray-600 text-xs">{step}</span>
                {i < 4 && <ChevronRight size={12} className="text-gray-300 mx-1 flex-shrink-0" />}
              </li>
            ))}
          </ol>
        </div>

        {/* Prompt textarea */}
        <div className="px-6 pb-4 flex-1 overflow-hidden flex flex-col gap-2 min-h-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Full prompt ({fullPrompt.length.toLocaleString()} chars)
            </span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                copied
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
          </div>
          <textarea
            readOnly
            value={fullPrompt}
            className="flex-1 w-full px-4 py-3 text-xs font-mono border border-gray-200 rounded-xl bg-gray-50 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 min-h-0"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 font-medium">
            Cancel
          </button>
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            I have the response file <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
