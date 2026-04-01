import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar, { type NavSection } from './Sidebar';
import Dashboard from '../dashboard/Dashboard';
import ExperienceList from '../repository/ExperienceList';
import ResumeBuilder from '../generator/ResumeBuilder';
import AnalyzerPage from '../analyzer/AnalyzerPage';
import SettingsPage from '../settings/SettingsPage';

export default function AppShell() {
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function handleOpenGenerator() { setActiveSection('generator'); }
    function handleOpenRepository() { setActiveSection('repository'); }
    window.addEventListener('resumeos:open-generator', handleOpenGenerator);
    window.addEventListener('resumeos:open-repository', handleOpenRepository);
    return () => {
      window.removeEventListener('resumeos:open-generator', handleOpenGenerator);
      window.removeEventListener('resumeos:open-repository', handleOpenRepository);
    };
  }, []);

  function renderContent() {
    switch (activeSection) {
      case 'dashboard':  return <Dashboard onNavigate={setActiveSection} />;
      case 'repository': return <ExperienceList />;
      case 'generator':  return <ResumeBuilder />;
      case 'analyzer':   return <AnalyzerPage />;
      case 'settings':   return <SettingsPage />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        active={activeSection}
        onChange={setActiveSection}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <Menu size={20} />
          </button>
          <span className="font-semibold text-gray-800 text-sm">ResumeOS</span>
        </div>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
