import { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import type { Achievement } from '../../types';
import { ALL_SKILLS } from '../../constants';
import BulletEditor from './BulletEditor';
import TagInput from '../shared/TagInput';

interface AchievementEditorProps {
  achievement: Achievement;
  index: number;
  onChange: (updated: Achievement) => void;
  onDelete: () => void;
}

export default function AchievementEditor({
  achievement,
  index,
  onChange,
  onDelete,
}: AchievementEditorProps) {
  const [expanded, setExpanded] = useState(index === 0);
  const [showCtx, setShowCtx] = useState(false);

  function updateCtx(key: keyof Achievement['projectContext'], value: string | string[]) {
    onChange({ ...achievement, projectContext: { ...achievement.projectContext, [key]: value } });
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left"
      >
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span className="text-sm font-medium text-gray-700 flex-1 truncate">
          {achievement.coreDescription || `Achievement ${index + 1}`}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1 text-gray-400 hover:text-red-500 rounded"
        >
          <Trash2 size={14} />
        </button>
      </button>

      {expanded && (
        <div className="px-4 py-4 space-y-4">
          {/* Core description */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Core description (function-neutral)
            </label>
            <input
              type="text"
              value={achievement.coreDescription}
              onChange={(e) => onChange({ ...achievement, coreDescription: e.target.value })}
              placeholder="Brief neutral description of what you achieved"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Bullet variants */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Bullet variants by function lens
            </label>
            <BulletEditor achievement={achievement} onChange={onChange} />
          </div>

          {/* Project context */}
          <div>
            <button
              onClick={() => setShowCtx((c) => !c)}
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800"
            >
              {showCtx ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              Project context (AI superpower)
            </button>
            {showCtx && (
              <div className="mt-3 space-y-3 pl-3 border-l-2 border-indigo-100">
                {(
                  [
                    { key: 'problem', label: 'Problem', rows: 2 },
                    { key: 'approach', label: 'Approach', rows: 2 },
                    { key: 'outcome', label: 'Outcome', rows: 2 },
                    { key: 'teamSize', label: 'Team size', rows: 1 },
                    { key: 'timeline', label: 'Timeline', rows: 1 },
                  ] as const
                ).map(({ key, label, rows }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                    <textarea
                      value={achievement.projectContext[key] as string}
                      onChange={(e) => updateCtx(key, e.target.value)}
                      rows={rows}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tools</label>
                  <TagInput
                    tags={achievement.projectContext.tools}
                    onChange={(v) => updateCtx('tools', v)}
                    placeholder="Add tool..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Metadata tags */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Metrics</label>
              <TagInput
                tags={achievement.metrics}
                onChange={(v) => onChange({ ...achievement, metrics: v })}
                placeholder="e.g. 85 countries"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Skills</label>
              <TagInput
                tags={achievement.skills}
                onChange={(v) => onChange({ ...achievement, skills: v })}
                suggestions={ALL_SKILLS}
                placeholder="Add skill..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">ATS Keywords</label>
              <TagInput
                tags={achievement.keywords}
                onChange={(v) => onChange({ ...achievement, keywords: v })}
                placeholder="e.g. stakeholder management"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">AI/GenAI Keywords</label>
              <TagInput
                tags={achievement.aiKeywords}
                onChange={(v) => onChange({ ...achievement, aiKeywords: v })}
                placeholder="e.g. GenAI, ML model"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={achievement.isPolished}
              onChange={(e) => onChange({ ...achievement, isPolished: e.target.checked })}
              className="w-4 h-4 rounded accent-indigo-600"
            />
            <span className="text-xs text-gray-600">Bullet is polished (ready for resume)</span>
          </label>
        </div>
      )}
    </div>
  );
}
