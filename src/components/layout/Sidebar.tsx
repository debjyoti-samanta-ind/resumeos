import { Database, FileText, Search, Settings, Zap, LayoutDashboard, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export type NavSection = 'dashboard' | 'repository' | 'generator' | 'analyzer' | 'settings';

interface SidebarProps {
  active: NavSection;
  onChange: (section: NavSection) => void;
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS: { id: NavSection; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',   label: 'Dashboard',   icon: <LayoutDashboard size={18} /> },
  { id: 'repository',  label: 'Repository',  icon: <Database size={18} /> },
  { id: 'generator',   label: 'Generator',   icon: <FileText size={18} /> },
  { id: 'analyzer',    label: 'Analyzer',    icon: <Search size={18} /> },
  { id: 'settings',    label: 'Settings',    icon: <Settings size={18} /> },
];

export default function Sidebar({ active, onChange, open, onClose }: SidebarProps) {
  const { settings } = useSettings();

  function handleNav(section: NavSection) {
    onChange(section);
    onClose(); // close mobile drawer on nav
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-56 bg-gray-900 flex flex-col transition-transform duration-200
          lg:static lg:translate-x-0 lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-700 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-indigo-400" />
              <span className="text-white font-bold text-lg tracking-tight">ResumeOS</span>
            </div>
            <p className="text-gray-500 text-xs mt-1">Resume Intelligence</p>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                active === id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>

        {/* AI Mode badge */}
        <div className="px-5 py-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                settings.aiMode === 'api' ? 'bg-green-400' : 'bg-yellow-400'
              }`}
            />
            <span className="text-gray-400 text-xs">
              {settings.aiMode === 'api' ? 'API mode' : 'Free mode'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
