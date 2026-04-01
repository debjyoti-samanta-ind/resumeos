import { useEffect, useState, useMemo } from 'react';
import { Save, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import type { Experience, FunctionTag, IndustryTag, ResumeVersion } from '../../types';
import { FUNCTION_TAGS, INDUSTRY_TAGS } from '../../constants';
import { loadExperiences, addResume, loadResumes, deleteResume } from '../../services/storage';
import { useSettings } from '../../context/SettingsContext';
import { getVariantText } from './BulletSelector';
import BulletSelector from './BulletSelector';
import ResumePreview from './ResumePreview';
import ResumeExport from './ResumeExport';
import type { ResumeExportEntry } from '../../services/docxExport';
import { buildSkillsText } from '../../services/docxExport';

// ─── Preselect seed written by OptimizedResume ────────────────────────────────

const PRESELECT_KEY = 'resumeos_generator_preselect';

interface Preselect {
  targetFunction?: FunctionTag;
  targetIndustry?: IndustryTag;
  suggestedExperienceIds?: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function defaultSelectedAchievements(exp: Experience): Set<string> {
  return new Set(exp.achievements.map((a) => a.id));
}

function toExportEntry(exp: Experience, selectedAchIds: Set<string>, fn: FunctionTag): ResumeExportEntry {
  return {
    organization: exp.organization,
    location: exp.location,
    startDate: exp.startDate,
    endDate: exp.endDate,
    title: exp.title,
    bullets: exp.achievements
      .filter((a) => selectedAchIds.has(a.id))
      .map((a) => getVariantText(a, fn))
      .filter(Boolean),
  };
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ResumeBuilder() {
  const { settings } = useSettings();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [savedVersions, setSavedVersions] = useState<ResumeVersion[]>([]);

  // Draft state
  const [resumeName, setResumeName] = useState('');
  const [targetFunction, setTargetFunction] = useState<FunctionTag>('General');
  const [targetIndustry, setTargetIndustry] = useState<IndustryTag>('General');
  const [includedIds, setIncludedIds] = useState<Set<string>>(new Set());
  const [selectedAchievements, setSelectedAchievements] = useState<Record<string, Set<string>>>({});
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [saveMsg, setSaveMsg] = useState('');
  const [confirmDeleteVersionId, setConfirmDeleteVersionId] = useState<string | null>(null);

  // Load data + auto-include education + apply any preselect
  useEffect(() => {
    const exps = loadExperiences();
    setExperiences(exps);
    setSavedVersions(loadResumes());

    // Education is always pre-selected (mandatory)
    const eduExps = exps.filter((e) => e.type === 'education');
    const initIds = new Set(eduExps.map((e) => e.id));
    const initAch: Record<string, Set<string>> = {};
    for (const exp of eduExps) initAch[exp.id] = defaultSelectedAchievements(exp);

    const raw = localStorage.getItem(PRESELECT_KEY);
    if (raw) {
      localStorage.removeItem(PRESELECT_KEY);
      try {
        const pre = JSON.parse(raw) as Preselect;
        if (pre.targetFunction) setTargetFunction(pre.targetFunction);
        if (pre.targetIndustry) setTargetIndustry(pre.targetIndustry);
        if (pre.suggestedExperienceIds?.length) {
          for (const id of pre.suggestedExperienceIds) initIds.add(id);
          for (const exp of exps) {
            if (pre.suggestedExperienceIds.includes(exp.id)) {
              initAch[exp.id] = defaultSelectedAchievements(exp);
            }
          }
        }
      } catch { /* ignore malformed preselect */ }
    }

    setIncludedIds(initIds);
    setExpandedIds(new Set(initIds));
    setSelectedAchievements(initAch);
  }, []);

  // ─── Toggle helpers ─────────────────────────────────────────────────────────

  function toggleExp(id: string) {
    setIncludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // Auto-expand + select all achievements
        setExpandedIds((e) => new Set([...e, id]));
        const exp = experiences.find((e) => e.id === id);
        if (exp) {
          setSelectedAchievements((sa) => ({ ...sa, [id]: defaultSelectedAchievements(exp) }));
        }
      }
      return next;
    });
  }

  function toggleAchievement(expId: string, achId: string) {
    setSelectedAchievements((prev) => {
      const cur = new Set(prev[expId] ?? []);
      cur.has(achId) ? cur.delete(achId) : cur.add(achId);
      return { ...prev, [expId]: cur };
    });
  }

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // ─── Derived resume data ────────────────────────────────────────────────────

  const educationEntries = useMemo(() =>
    experiences
      .filter((e) => e.type === 'education' && includedIds.has(e.id))
      .map((e) => toExportEntry(e, selectedAchievements[e.id] ?? new Set(), targetFunction)),
    [experiences, includedIds, selectedAchievements, targetFunction]
  );

  const experienceEntries = useMemo(() =>
    experiences
      .filter((e) => e.type !== 'education' && includedIds.has(e.id))
      .sort((a, b) => b.startDate.localeCompare(a.startDate))
      .map((e) => toExportEntry(e, selectedAchievements[e.id] ?? new Set(), targetFunction)),
    [experiences, includedIds, selectedAchievements, targetFunction]
  );

  const skillsText = useMemo(() => {
    const all = experiences.filter((e) => includedIds.has(e.id)).flatMap((e) => e.skills);
    return buildSkillsText(all); // capped at ~2 lines (210 chars)
  }, [experiences, includedIds]);

  const exportFilename = resumeName
    ? `${resumeName.replace(/\s+/g, '_')}.docx`
    : `Resume_${targetFunction.replace(/\s+/g, '_')}_${targetIndustry}.docx`;

  // ─── Save as version ────────────────────────────────────────────────────────

  function handleSave() {
    const version: ResumeVersion = {
      id: crypto.randomUUID(),
      name: resumeName || `${targetFunction} – ${targetIndustry}`,
      targetFunction,
      targetIndustry,
      header: settings.defaultHeader,
      sections: [
        {
          type: 'education',
          entries: experiences
            .filter((e) => e.type === 'education' && includedIds.has(e.id))
            .map((e, i) => ({
              experienceId: e.id,
              selectedBulletVariantIds: e.achievements
                .filter((a) => (selectedAchievements[e.id] ?? new Set()).has(a.id))
                .map((a) => (a.variants.find((v) => v.function === targetFunction) ?? a.variants.find((v) => v.function === 'General') ?? a.variants[0])?.id ?? '')
                .filter(Boolean),
              order: i,
            })),
        },
        {
          type: 'experience',
          entries: experiences
            .filter((e) => e.type !== 'education' && includedIds.has(e.id))
            .sort((a, b) => b.startDate.localeCompare(a.startDate))
            .map((e, i) => ({
              experienceId: e.id,
              selectedBulletVariantIds: e.achievements
                .filter((a) => (selectedAchievements[e.id] ?? new Set()).has(a.id))
                .map((a) => (a.variants.find((v) => v.function === targetFunction) ?? a.variants.find((v) => v.function === 'General') ?? a.variants[0])?.id ?? '')
                .filter(Boolean),
              order: i,
            })),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addResume(version);
    setSavedVersions(loadResumes());
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(''), 2000);
  }

  // ─── Experience list groups ─────────────────────────────────────────────────

  const eduExps = experiences.filter((e) => e.type === 'education');
  const otherExps = experiences.filter((e) => e.type !== 'education');

  function ExperienceRow({ exp }: { exp: Experience }) {
    const included = includedIds.has(exp.id);
    const expanded = expandedIds.has(exp.id);
    const achCount = (selectedAchievements[exp.id]?.size ?? 0);
    return (
      <div className={`border rounded-lg overflow-hidden ${included ? 'border-indigo-200' : 'border-gray-200'}`}>
        <div className={`flex items-center gap-2 px-3 py-2 ${included ? 'bg-indigo-50' : 'bg-white'}`}>
          <input
            type="checkbox"
            checked={included}
            onChange={() => toggleExp(exp.id)}
            className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">{exp.organization}</p>
            <p className="text-xs text-gray-500 truncate">{exp.title}</p>
          </div>
          {included && (
            <span className="text-xs text-indigo-500 flex-shrink-0">{achCount} bullet{achCount !== 1 ? 's' : ''}</span>
          )}
          {included && (
            <button onClick={() => toggleExpanded(exp.id)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
        </div>
        {included && expanded && (
          <div className="px-3 pb-2 border-t border-indigo-100 bg-white">
            <BulletSelector
              experience={exp}
              targetFunction={targetFunction}
              selectedAchievementIds={selectedAchievements[exp.id] ?? new Set()}
              onToggle={(achId) => toggleAchievement(exp.id, achId)}
            />
          </div>
        )}
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resume Generator</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Pick a function + industry, select experiences and bullets, then export as .docx
        </p>
      </div>

      {/* Saved versions */}
      {savedVersions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <BookOpen size={14} className="text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-500">Saved:</span>
          {savedVersions.map((v) => (
            <div key={v.id} className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
              {v.name}
              {confirmDeleteVersionId === v.id ? (
                <>
                  <button
                    onClick={() => { deleteResume(v.id); setSavedVersions(loadResumes()); setConfirmDeleteVersionId(null); }}
                    className="ml-1 text-red-600 font-semibold hover:text-red-800"
                    title="Confirm delete"
                  >✓</button>
                  <button
                    onClick={() => setConfirmDeleteVersionId(null)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Cancel"
                  >✕</button>
                </>
              ) : (
                <button
                  onClick={() => setConfirmDeleteVersionId(v.id)}
                  className="ml-1 text-gray-400 hover:text-red-500"
                  title="Delete"
                >×</button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: Controls + Experience selector */}
        <div className="lg:col-span-2 space-y-4">
          {/* Resume config */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <input
              type="text"
              placeholder="Resume name (e.g. PM – Healthcare)"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Function</label>
                <select
                  value={targetFunction}
                  onChange={(e) => setTargetFunction(e.target.value as FunctionTag)}
                  className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {FUNCTION_TAGS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Industry</label>
                <select
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value as IndustryTag)}
                  className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {INDUSTRY_TAGS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Experience selector */}
          <div className="space-y-3">
            {eduExps.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Education</p>
                <div className="space-y-1.5">
                  {eduExps.map((exp) => <ExperienceRow key={exp.id} exp={exp} />)}
                </div>
              </div>
            )}
            {otherExps.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Experience</p>
                <div className="space-y-1.5">
                  {otherExps.map((exp) => <ExperienceRow key={exp.id} exp={exp} />)}
                </div>
              </div>
            )}
            {experiences.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm font-medium text-gray-500">No experiences yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Add experiences in the Repository tab first
                </p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('resumeos:open-repository'))}
                  className="mt-3 text-xs text-indigo-500 hover:text-indigo-700 font-medium"
                >
                  Go to Repository →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Preview + actions */}
        <div className="lg:col-span-3 space-y-3">
          <ResumePreview
            header={settings.defaultHeader}
            educationEntries={educationEntries}
            experienceEntries={experienceEntries}
            skillsText={skillsText}
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <ResumeExport
                header={settings.defaultHeader}
                educationEntries={educationEntries}
                experienceEntries={experienceEntries}
                skillsText={skillsText}
                filename={exportFilename}
                disabled={includedIds.size === 0}
              />
            </div>
            <button
              onClick={handleSave}
              disabled={includedIds.size === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={15} />
              {saveMsg || 'Save Version'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
