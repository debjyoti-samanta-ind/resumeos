import { useState } from 'react';
import type { Achievement, FunctionTag, BulletVariant } from '../../types';
import { FUNCTION_TAGS } from '../../constants';

const FN_LABEL: Record<FunctionTag, string> = {
  'Product Management': 'PM',
  'Strategy': 'Strategy',
  'Operations': 'Ops',
  'Analytics & Insights': 'Analytics',
  'Program Management': 'Prog Mgmt',
  'General': 'General',
};

interface BulletEditorProps {
  achievement: Achievement;
  onChange: (updated: Achievement) => void;
  initialFunction?: FunctionTag;
}

export default function BulletEditor({
  achievement,
  onChange,
  initialFunction = 'General',
}: BulletEditorProps) {
  const [activeFunction, setActiveFunction] = useState<FunctionTag>(initialFunction);

  const currentVariant = achievement.variants.find((v) => v.function === activeFunction);
  const text = currentVariant?.text ?? '';

  function handleTextChange(newText: string) {
    let updatedVariants: BulletVariant[];
    if (currentVariant) {
      updatedVariants = achievement.variants.map((v) =>
        v.function === activeFunction ? { ...v, text: newText } : v
      );
    } else {
      updatedVariants = [
        ...achievement.variants,
        { id: crypto.randomUUID(), function: activeFunction, text: newText },
      ];
    }
    onChange({ ...achievement, variants: updatedVariants });
  }

  return (
    <div className="space-y-2">
      {/* Function tabs */}
      <div className="flex flex-wrap gap-1">
        {FUNCTION_TAGS.map((fn) => {
          const filled = achievement.variants.some((v) => v.function === fn && v.text.trim());
          return (
            <button
              key={fn}
              onClick={() => setActiveFunction(fn)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                activeFunction === fn
                  ? 'bg-indigo-600 text-white'
                  : filled
                  ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {FN_LABEL[fn]}
              {filled && activeFunction !== fn && (
                <span className="ml-1 inline-block w-1 h-1 bg-indigo-400 rounded-full align-middle" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bullet textarea */}
      <textarea
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        rows={3}
        placeholder={`Write the ${activeFunction} lens bullet...`}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
      />

      {/* AI Keywords */}
      {achievement.aiKeywords.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-gray-400 mr-1">AI keywords:</span>
          {achievement.aiKeywords.map((kw) => (
            <span key={kw} className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
