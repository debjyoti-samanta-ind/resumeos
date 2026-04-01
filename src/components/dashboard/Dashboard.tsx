import { useState } from 'react';
import { Database, FileText, Search, Star, Plus, Zap, ClipboardList } from 'lucide-react';
import { loadExperiences, loadResumes, loadAnalyses } from '../../services/storage';
import type { NavSection } from '../layout/Sidebar';
import ApplicationTracker from './ApplicationTracker';

interface DashboardProps {
  onNavigate: (section: NavSection) => void;
}

type DashTab = 'applications' | 'overview';

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<DashTab>('applications');

  const experiences = loadExperiences();
  const resumes     = loadResumes();
  const analyses    = loadAnalyses();

  const totalAchievements = experiences.reduce((sum, e) => sum + e.achievements.length, 0);
  const polishedCount     = experiences.filter(e => e.strengthRating === 3).length;
  const recentAnalysis    = analyses.length > 0 ? analyses[analyses.length - 1] : null;

  const stats = [
    {
      label: 'Experiences', value: experiences.length,
      sub: `${totalAchievements} achievement${totalAchievements !== 1 ? 's' : ''}`,
      icon: Database, color: 'bg-blue-50 text-blue-600', section: 'repository' as NavSection,
    },
    {
      label: 'Resume Versions', value: resumes.length,
      sub: 'saved builds',
      icon: FileText, color: 'bg-indigo-50 text-indigo-600', section: 'generator' as NavSection,
    },
    {
      label: 'JD Analyses', value: analyses.length,
      sub: 'analyses run',
      icon: Search, color: 'bg-purple-50 text-purple-600', section: 'analyzer' as NavSection,
    },
    {
      label: 'Polished', value: polishedCount,
      sub: `of ${experiences.length} experience${experiences.length !== 1 ? 's' : ''}`,
      icon: Star, color: 'bg-green-50 text-green-600', section: 'repository' as NavSection,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Page header + tabs */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-1 mt-4 border-b border-gray-200">
          {([
            { id: 'applications' as DashTab, label: 'Applications', icon: ClipboardList },
            { id: 'overview'     as DashTab, label: 'Overview',     icon: Zap },
          ]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications tab */}
      {activeTab === 'applications' && <ApplicationTracker />}

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value, sub, icon: Icon, color, section }) => (
              <button
                key={label}
                onClick={() => onNavigate(section)}
                className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </button>
            ))}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onNavigate('repository')}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
              >
                <Plus size={16} className="text-indigo-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Add Experience</p>
                  <p className="text-xs text-gray-400">Expand your repository</p>
                </div>
              </button>
              <button
                onClick={() => onNavigate('analyzer')}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
              >
                <Search size={16} className="text-purple-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Analyze a JD</p>
                  <p className="text-xs text-gray-400">Score + optimize your resume</p>
                </div>
              </button>
              <button
                onClick={() => onNavigate('generator')}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <FileText size={16} className="text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Build Resume</p>
                  <p className="text-xs text-gray-400">Generate a tailored version</p>
                </div>
              </button>
            </div>
          </div>

          {/* Last analysis */}
          {recentAnalysis && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">Last Analysis</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {recentAnalysis.jobTitle || 'Untitled Role'}
                    {recentAnalysis.company ? ` · ${recentAnalysis.company}` : ''}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(recentAnalysis.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    recentAnalysis.overallScore >= 75 ? 'text-green-600'
                    : recentAnalysis.overallScore >= 60 ? 'text-yellow-600'
                    : 'text-red-500'
                  }`}>{recentAnalysis.overallScore}</p>
                  <p className="text-xs text-gray-400">overall score</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('analyzer')}
                className="mt-3 text-xs text-indigo-500 hover:text-indigo-700 font-medium"
              >
                Run a new analysis →
              </button>
            </div>
          )}

          {/* Getting started */}
          {experiences.length === 0 && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
              <div className="flex items-start gap-3">
                <Zap size={20} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Getting started</p>
                  <ol className="mt-2 space-y-1.5 text-xs text-gray-600 list-decimal list-inside">
                    <li>
                      Go to{' '}
                      <button onClick={() => onNavigate('repository')} className="text-indigo-600 font-medium hover:underline">
                        Repository
                      </button>{' '}
                      and add your work experiences
                    </li>
                    <li>
                      Go to{' '}
                      <button onClick={() => onNavigate('analyzer')} className="text-indigo-600 font-medium hover:underline">
                        Analyzer
                      </button>
                      , paste a JD, and upload your resume PDF
                    </li>
                    <li>Review the score, accept suggested edits, and click <strong>Mark as Applied</strong></li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
