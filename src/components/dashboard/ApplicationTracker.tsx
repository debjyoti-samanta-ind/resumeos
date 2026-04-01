import { useState } from 'react';
import { Download, ExternalLink, Trash2, ChevronUp, ChevronDown, ChevronsUpDown, ClipboardList, Search } from 'lucide-react';
import type { ApplicationEntry, ApplicationStatus } from '../../types';
import { loadApplications, deleteApplication, updateApplicationStatus } from '../../services/storage';
import { downloadBlob } from '../../services/docxExport';

const STATUSES: ApplicationStatus[] = ['Applied', 'Rejected', 'Interview', 'Offer'];

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Applied:   'bg-blue-100 text-blue-700',
  Rejected:  'bg-red-100 text-red-700',
  Interview: 'bg-yellow-100 text-yellow-700',
  Offer:     'bg-green-100 text-green-700',
};

type SortKey = 'serialNo' | 'company' | 'roleName' | 'dateApplied' | 'status' | 'originalScore';

function scoreColor(n: number) {
  if (n >= 75) return 'text-green-600';
  if (n >= 60) return 'text-yellow-600';
  return 'text-red-500';
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: 'asc' | 'desc' }) {
  if (col !== sortKey) return <ChevronsUpDown size={13} className="text-gray-300 inline ml-1" />;
  return sortDir === 'asc'
    ? <ChevronUp size={13} className="text-indigo-500 inline ml-1" />
    : <ChevronDown size={13} className="text-indigo-500 inline ml-1" />;
}

export default function ApplicationTracker() {
  const [applications, setApplications] = useState<ApplicationEntry[]>(loadApplications);
  const [sortKey, setSortKey]   = useState<SortKey>('dateApplied');
  const [sortDir, setSortDir]   = useState<'asc' | 'desc'>('desc');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  function handleSort(col: SortKey) {
    if (sortKey === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(col);
      setSortDir(col === 'dateApplied' ? 'desc' : 'asc');
    }
  }

  const filtered = search.trim()
    ? applications.filter(a => a.company.toLowerCase().includes(search.toLowerCase()))
    : applications;

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'serialNo')      cmp = a.serialNo - b.serialNo;
    else if (sortKey === 'company')  cmp = a.company.localeCompare(b.company);
    else if (sortKey === 'roleName') cmp = a.roleName.localeCompare(b.roleName);
    else if (sortKey === 'dateApplied') cmp = a.dateApplied.localeCompare(b.dateApplied);
    else if (sortKey === 'status')   cmp = a.status.localeCompare(b.status);
    else if (sortKey === 'originalScore') cmp = a.originalScore - b.originalScore;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  function handleStatusChange(id: string, status: ApplicationStatus) {
    const updated = updateApplicationStatus(id, status);
    setApplications(updated);
  }

  function handleDelete(id: string) {
    const updated = deleteApplication(id);
    setApplications(updated);
    setConfirmDeleteId(null);
  }

  function handleDownloadDocx(entry: ApplicationEntry) {
    const base64 = entry.docxBase64.split(',')[1] ?? entry.docxBase64;
    const bytes   = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const blob    = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    downloadBlob(blob, entry.docxFilename);
  }

  function handleViewReport(entry: ApplicationEntry) {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(entry.reportHtml);
    win.document.close();
  }

  function Th({ col, label }: { col: SortKey; label: string }) {
    return (
      <th
        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-800 select-none whitespace-nowrap"
        onClick={() => handleSort(col)}
      >
        {label}<SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />
      </th>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-16">
        <ClipboardList size={36} className="mx-auto mb-3 text-gray-300" />
        <p className="text-base font-medium text-gray-500">No applications tracked yet</p>
        <p className="text-sm text-gray-400 mt-1">
          After analyzing a JD and accepting edits, click <strong>"Mark as Applied"</strong> in the Analyzer to add an entry here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-gray-500">
          {filtered.length !== applications.length
            ? `${filtered.length} of ${applications.length} applications`
            : `${applications.length} application${applications.length !== 1 ? 's' : ''} tracked`}
        </p>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 w-48"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <Th col="serialNo"     label="#" />
                <Th col="company"      label="Company" />
                <Th col="roleName"     label="Role" />
                <Th col="dateApplied"  label="Date Applied" />
                <Th col="status"       label="Status" />
                <Th col="originalScore" label="Score" />
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((entry, idx) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  {/* S.No. — display-only row index so gaps don't appear after deletion */}
                  <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>

                  {/* Company */}
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{entry.company}</td>

                  {/* Role */}
                  <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate" title={entry.roleName}>{entry.roleName}</td>

                  {/* Date */}
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {new Date(entry.dateApplied).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  {/* Status dropdown */}
                  <td className="px-4 py-3">
                    <select
                      value={entry.status}
                      onChange={e => handleStatusChange(entry.id, e.target.value as ApplicationStatus)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 ${STATUS_COLORS[entry.status]}`}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>

                  {/* Score */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`font-bold ${scoreColor(entry.originalScore)}`}>{entry.originalScore}</span>
                      {entry.updatedScore !== null && (
                        <>
                          <span className="text-gray-300">→</span>
                          <span className={`font-bold ${scoreColor(entry.updatedScore)}`}>{entry.updatedScore}</span>
                          <span className={`text-xs font-semibold ${entry.updatedScore >= entry.originalScore ? 'text-green-600' : 'text-red-500'}`}>
                            ({entry.updatedScore >= entry.originalScore ? '+' : ''}{entry.updatedScore - entry.originalScore})
                          </span>
                        </>
                      )}
                    </div>
                    {entry.projectedScore !== null && entry.projectedScore !== undefined && (
                      <div className="text-xs text-indigo-500 mt-0.5" title="Projected score if all suggested edits were accepted">
                        {entry.projectedScore} potential
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewReport(entry)}
                        title="View analysis report"
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button
                        onClick={() => handleDownloadDocx(entry)}
                        title="Download resume (.docx)"
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Download size={14} />
                      </button>
                      {confirmDeleteId === entry.id ? (
                        <div className="flex items-center gap-1 ml-1">
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="px-2 py-1 text-xs bg-red-600 text-white rounded-lg font-medium"
                          >Delete</button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                          >Cancel</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(entry.id)}
                          title="Delete"
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
