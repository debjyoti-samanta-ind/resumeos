import { useState } from 'react';
import { ChevronDown, ChevronRight, Edit2, Trash2, MapPin, Calendar } from 'lucide-react';
import type { Experience, FunctionTag } from '../../types';
import { formatDateRange } from '../../utils/format';

// ─── Org logo helpers ──────────────────────────────────────────────────────────

const LOGO_MAP: [string, string][] = [
  ['zs associates', '/logos/ZS_Logo.png'],
  ['merck', '/logos/Merck_Logo.png'],
  ['university of washington', '/logos/UW_Logo.jpg'],
  ['foster school', '/logos/UW_Logo.jpg'],
  ['iiest', '/logos/IIEST_Logo.png'],
  ['indian institute of engineering science', '/logos/IIEST_Logo.png'],
  ['microsoft', '/logos/Microsoft_Logo.png'],
];

function getLogoUrl(org: string): string | null {
  const lower = org.toLowerCase();
  for (const [key, path] of LOGO_MAP) {
    if (lower.includes(key)) return path;
  }
  return null;
}

const TYPE_BG: Record<Experience['type'], string> = {
  role: 'bg-blue-100 text-blue-600',
  education: 'bg-green-100 text-green-600',
  project: 'bg-purple-100 text-purple-600',
  certification: 'bg-yellow-100 text-yellow-600',
  leadership: 'bg-orange-100 text-orange-600',
};

function OrgLogo({ organization, type }: { organization: string; type: Experience['type'] }) {
  const [error, setError] = useState(false);
  const logoUrl = getLogoUrl(organization);
  const initials = organization
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  if (logoUrl && !error) {
    return (
      <img
        src={logoUrl}
        alt={organization}
        onError={() => setError(true)}
        className="w-9 h-9 rounded-md object-contain bg-white border border-gray-100 flex-shrink-0"
      />
    );
  }
  return (
    <div className={`w-9 h-9 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${TYPE_BG[type]}`}>
      {initials}
    </div>
  );
}

interface ExperienceCardProps {
  experience: Experience;
  onEdit: () => void;
  onDelete: () => void;
}

const TYPE_COLORS: Record<Experience['type'], string> = {
  role: 'bg-blue-100 text-blue-700',
  education: 'bg-green-100 text-green-700',
  project: 'bg-purple-100 text-purple-700',
  certification: 'bg-yellow-100 text-yellow-700',
  leadership: 'bg-orange-100 text-orange-700',
};

const FN_LABEL: Record<FunctionTag, string> = {
  'Product Management': 'PM',
  'Strategy': 'Strategy',
  'Operations': 'Ops',
  'Analytics & Insights': 'Analytics',
  'Program Management': 'Prog Mgmt',
  'General': 'General',
};

const STRENGTH = { 1: { label: 'Needs work', color: 'text-red-500' }, 2: { label: 'Decent', color: 'text-yellow-500' }, 3: { label: 'Polished', color: 'text-green-500' } } as const;

export default function ExperienceCard({ experience, onEdit, onDelete }: ExperienceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [lens, setLens] = useState<FunctionTag>('General');
  const [openCtx, setOpenCtx] = useState<Set<string>>(new Set());
  const [confirmDel, setConfirmDel] = useState(false);

  const str = STRENGTH[experience.strengthRating];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
      {/* Header row */}
      <div className="px-5 py-4 flex items-start gap-3">
        <button onClick={() => setExpanded((e) => !e)} className="mt-1 text-gray-400 hover:text-gray-600 flex-shrink-0">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        <OrgLogo organization={experience.organization} type={experience.type} />

        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[experience.type]}`}>
              {experience.type}
            </span>
            <span className={`text-xs font-medium ${str.color}`}>● {str.label}</span>
            {experience.functions.map((fn) => (
              <span key={fn} className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">{fn}</span>
            ))}
            {experience.industries.map((ind) => (
              <span key={ind} className="text-xs px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full">{ind}</span>
            ))}
          </div>

          {/* Title */}
          <button onClick={() => setExpanded((e) => !e)} className="text-left">
            <h3 className="font-semibold text-gray-900">{experience.organization}</h3>
            <p className="text-sm text-gray-600 mt-0.5">{experience.title}</p>
          </button>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
            {experience.location && (
              <span className="flex items-center gap-1"><MapPin size={11} />{experience.location}</span>
            )}
            <span className="flex items-center gap-1">
              <Calendar size={11} />{formatDateRange(experience.startDate, experience.endDate)}
            </span>
            <span>{experience.achievements.length} achievement{experience.achievements.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
            <Edit2 size={14} />
          </button>
          {confirmDel ? (
            <div className="flex items-center gap-1">
              <button onClick={onDelete} className="px-2 py-1 text-xs bg-red-600 text-white rounded-lg font-medium">Delete</button>
              <button onClick={() => setConfirmDel(false)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDel(true)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4">
          {experience.summary && (
            <p className="text-sm text-gray-600 leading-relaxed">{experience.summary}</p>
          )}

          {experience.achievements.length > 0 && (
            <>
              {/* Lens selector */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">View bullets as:</p>
                <div className="flex flex-wrap gap-1">
                  {(Object.keys(FN_LABEL) as FunctionTag[]).map((fn) => (
                    <button
                      key={fn}
                      onClick={() => setLens(fn)}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                        lens === fn ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {FN_LABEL[fn]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-4">
                {experience.achievements.map((ach) => {
                  const variant =
                    ach.variants.find((v) => v.function === lens) ??
                    ach.variants.find((v) => v.function === 'General');
                  const ctxOpen = openCtx.has(ach.id);

                  return (
                    <div key={ach.id} className="border-l-2 border-indigo-100 pl-4 space-y-1.5">
                      <p className="text-xs text-gray-400 font-medium">{ach.coreDescription}</p>

                      {variant ? (
                        <p className="text-sm text-gray-800 leading-relaxed">• {variant.text}</p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No {lens} variant yet.</p>
                      )}

                      {/* Metrics */}
                      {ach.metrics.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {ach.metrics.map((m) => (
                            <span key={m} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{m}</span>
                          ))}
                        </div>
                      )}

                      {/* AI keywords */}
                      {ach.aiKeywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {ach.aiKeywords.map((kw) => (
                            <span key={kw} className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">{kw}</span>
                          ))}
                        </div>
                      )}

                      {/* Project context toggle */}
                      <button
                        onClick={() => {
                          setOpenCtx((prev) => {
                            const next = new Set(prev);
                            if (next.has(ach.id)) next.delete(ach.id); else next.add(ach.id);
                            return next;
                          });
                        }}
                        className="text-xs text-indigo-500 hover:text-indigo-700 font-medium"
                      >
                        {ctxOpen ? '▲ Hide' : '▼ Show'} project context
                      </button>

                      {ctxOpen && (
                        <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-xs text-gray-600">
                          {ach.projectContext.problem && <div><span className="font-semibold">Problem: </span>{ach.projectContext.problem}</div>}
                          {ach.projectContext.approach && <div><span className="font-semibold">Approach: </span>{ach.projectContext.approach}</div>}
                          {ach.projectContext.outcome && <div><span className="font-semibold">Outcome: </span>{ach.projectContext.outcome}</div>}
                          {ach.projectContext.teamSize && <div><span className="font-semibold">Team: </span>{ach.projectContext.teamSize}</div>}
                          {ach.projectContext.timeline && <div><span className="font-semibold">Timeline: </span>{ach.projectContext.timeline}</div>}
                          {ach.projectContext.tools.length > 0 && <div><span className="font-semibold">Tools: </span>{ach.projectContext.tools.join(', ')}</div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Skills footer */}
          {experience.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-3 border-t border-gray-100">
              {experience.skills.map((s) => (
                <span key={s} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{s}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
