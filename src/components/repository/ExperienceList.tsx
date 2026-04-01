import { useState, useMemo } from 'react';
import { Plus, Search, X, Database } from 'lucide-react';
import type { Experience, FunctionTag, IndustryTag } from '../../types';
import { FUNCTION_TAGS, INDUSTRY_TAGS } from '../../constants';
import {
  loadExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
} from '../../services/storage';
import ExperienceCard from './ExperienceCard';
import ExperienceForm from './ExperienceForm';
import JsonExportImport from '../shared/JsonExportImport';

function matchesSearch(exp: Experience, q: string): boolean {
  if (!q) return true;
  const lower = q.toLowerCase();
  const topLevel = [
    exp.title, exp.organization, exp.location, exp.summary, exp.notes,
    ...exp.skills, ...exp.functions, ...exp.industries,
  ];
  if (topLevel.some((f) => f.toLowerCase().includes(lower))) return true;
  return exp.achievements.some((ach) => {
    const all = [
      ach.coreDescription,
      ach.projectContext.problem,
      ach.projectContext.approach,
      ach.projectContext.outcome,
      ...ach.projectContext.tools,
      ...ach.projectContext.stakeholders,
      ...ach.metrics,
      ...ach.skills,
      ...ach.keywords,
      ...ach.aiKeywords,
      ...ach.variants.map((v) => v.text),
    ];
    return all.some((f) => f.toLowerCase().includes(lower));
  });
}

export default function ExperienceList() {
  const [experiences, setExperiences] = useState<Experience[]>(loadExperiences);
  const [query, setQuery] = useState('');
  const [filterFn, setFilterFn] = useState<FunctionTag | ''>('');
  const [filterInd, setFilterInd] = useState<IndustryTag | ''>('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Experience | undefined>();

  const filtered = useMemo(
    () =>
      experiences
        .filter((e) => matchesSearch(e, query))
        .filter((e) => !filterFn || e.functions.includes(filterFn))
        .filter((e) => !filterInd || e.industries.includes(filterInd)),
    [experiences, query, filterFn, filterInd]
  );

  const hasFilters = query || filterFn || filterInd;

  function handleSave(exp: Experience) {
    const updated = experiences.some((e) => e.id === exp.id)
      ? updateExperience(exp)
      : addExperience(exp);
    setExperiences(updated);
    setShowForm(false);
    setEditing(undefined);
  }

  function handleDelete(id: string) {
    setExperiences(deleteExperience(id));
  }

  function openEdit(exp: Experience) {
    setEditing(exp);
    setShowForm(true);
  }

  function openAdd() {
    setEditing(undefined);
    setShowForm(true);
  }

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Experience Repository</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {experiences.length} total · {filtered.length} shown
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <JsonExportImport onImportDone={() => setExperiences(loadExperiences())} />
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} /> Add experience
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bullets, project context, keywords, skills..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={filterFn}
          onChange={(e) => setFilterFn(e.target.value as FunctionTag | '')}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
        >
          <option value="">All functions</option>
          {FUNCTION_TAGS.map((fn) => <option key={fn} value={fn}>{fn}</option>)}
        </select>

        <select
          value={filterInd}
          onChange={(e) => setFilterInd(e.target.value as IndustryTag | '')}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
        >
          <option value="">All industries</option>
          {INDUSTRY_TAGS.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
        </select>

        {hasFilters && (
          <button
            onClick={() => { setQuery(''); setFilterFn(''); setFilterInd(''); }}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          {hasFilters ? (
            <>
              <Search size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="text-base font-medium text-gray-500">No matches found</p>
              <p className="text-sm text-gray-400 mt-1">Try a different search or filter</p>
              <button
                onClick={() => { setQuery(''); setFilterFn(''); setFilterInd(''); }}
                className="mt-3 text-sm text-indigo-500 hover:text-indigo-700 font-medium"
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <Database size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="text-base font-medium text-gray-500">No experiences yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Add your first experience or import from a resume PDF
              </p>
              <button
                onClick={openAdd}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
              >
                <Plus size={15} /> Add experience
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((exp) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              onEdit={() => openEdit(exp)}
              onDelete={() => handleDelete(exp.id)}
            />
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <ExperienceForm
          experience={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(undefined); }}
        />
      )}
    </div>
  );
}
