import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { Experience, Achievement } from '../../types';
import { FUNCTION_TAGS, INDUSTRY_TAGS, ALL_SKILLS } from '../../constants';
import AchievementEditor from './AchievementEditor';
import TagInput from '../shared/TagInput';

interface ExperienceFormProps {
  experience?: Experience;
  onSave: (exp: Experience) => void;
  onClose: () => void;
}

function makeExperience(): Experience {
  return {
    id: crypto.randomUUID(),
    type: 'role',
    title: '',
    organization: '',
    location: '',
    startDate: '',
    endDate: null,
    summary: '',
    achievements: [],
    functions: [],
    industries: [],
    skills: [],
    strengthRating: 2,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function makeAchievement(): Achievement {
  return {
    id: crypto.randomUUID(),
    coreDescription: '',
    projectContext: { problem: '', approach: '', tools: [], teamSize: '', stakeholders: [], timeline: '', outcome: '' },
    variants: [],
    metrics: [],
    skills: [],
    keywords: [],
    aiKeywords: [],
    isPolished: false,
  };
}

export default function ExperienceForm({ experience, onSave, onClose }: ExperienceFormProps) {
  const [draft, setDraft] = useState<Experience>(experience ?? makeExperience);

  function patch(partial: Partial<Experience>) {
    setDraft((d) => ({ ...d, ...partial, updatedAt: new Date().toISOString() }));
  }

  function toggleFn(fn: Experience['functions'][number]) {
    patch({ functions: draft.functions.includes(fn) ? draft.functions.filter((f) => f !== fn) : [...draft.functions, fn] });
  }

  function toggleInd(ind: Experience['industries'][number]) {
    patch({ industries: draft.industries.includes(ind) ? draft.industries.filter((i) => i !== ind) : [...draft.industries, ind] });
  }

  function updateAch(i: number, ach: Achievement) {
    const arr = [...draft.achievements];
    arr[i] = ach;
    patch({ achievements: arr });
  }

  const isValid = draft.title.trim() && draft.organization.trim();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl my-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {experience ? 'Edit Experience' : 'Add Experience'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 max-h-[72vh] overflow-y-auto">

          {/* Type + Strength */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select
                value={draft.type}
                onChange={(e) => patch({ type: e.target.value as Experience['type'] })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {(['role','education','project','certification','leadership'] as const).map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Strength</label>
              <div className="flex gap-1">
                {([1, 2, 3] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => patch({ strengthRating: n })}
                    className={`w-8 h-8 rounded-full text-xs font-bold border-2 transition-colors ${
                      draft.strengthRating >= n ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 text-gray-400'
                    }`}
                  >{n}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Title + Org */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
              <input type="text" value={draft.title} onChange={(e) => patch({ title: e.target.value })}
                placeholder="Decision Analytics Consultant"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Organization *</label>
              <input type="text" value={draft.organization} onChange={(e) => patch({ organization: e.target.value })}
                placeholder="ZS Associates"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          {/* Location + Dates */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
              <input type="text" value={draft.location} onChange={(e) => patch({ location: e.target.value })}
                placeholder="Gurugram, India"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Start</label>
              <input type="month" value={draft.startDate} onChange={(e) => patch({ startDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">End (blank = present)</label>
              <input type="month" value={draft.endDate ?? ''} onChange={(e) => patch({ endDate: e.target.value || null })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Summary</label>
            <textarea value={draft.summary} onChange={(e) => patch({ summary: e.target.value })} rows={2}
              placeholder="Brief description of the role or project"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>

          {/* Functions */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Target functions</label>
            <div className="flex flex-wrap gap-1.5">
              {FUNCTION_TAGS.map((fn) => (
                <button key={fn} onClick={() => toggleFn(fn)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${draft.functions.includes(fn) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {fn}
                </button>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Industries</label>
            <div className="flex flex-wrap gap-1.5">
              {INDUSTRY_TAGS.map((ind) => (
                <button key={ind} onClick={() => toggleInd(ind)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${draft.industries.includes(ind) ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Skills</label>
            <TagInput tags={draft.skills} onChange={(v) => patch({ skills: v })} suggestions={ALL_SKILLS} placeholder="Add skill..." />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Private notes</label>
            <textarea value={draft.notes} onChange={(e) => patch({ notes: e.target.value })} rows={2}
              placeholder="Notes for yourself — not shown on any resume"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>

          {/* Achievements */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-600">
                Achievements ({draft.achievements.length})
              </label>
              <button
                onClick={() => patch({ achievements: [...draft.achievements, makeAchievement()] })}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50"
              >
                <Plus size={12} /> Add achievement
              </button>
            </div>
            <div className="space-y-2">
              {draft.achievements.map((ach, i) => (
                <AchievementEditor
                  key={ach.id}
                  achievement={ach}
                  index={i}
                  onChange={(updated) => updateAch(i, updated)}
                  onDelete={() => patch({ achievements: draft.achievements.filter((_, j) => j !== i) })}
                />
              ))}
              {draft.achievements.length === 0 && (
                <p className="text-sm text-gray-400 italic text-center py-4">
                  No achievements yet. Click "Add achievement" above.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">
            Cancel
          </button>
          <button
            onClick={() => isValid && onSave(draft)}
            disabled={!isValid}
            className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {experience ? 'Save changes' : 'Add experience'}
          </button>
        </div>
      </div>
    </div>
  );
}
