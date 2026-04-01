import { useState } from 'react';
import { Eye, EyeOff, RotateCcw, Download, Upload, Save, FolderOpen, CheckCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { exportAllData, importAllData, resetToSeedData } from '../../services/storage';
import { isFSAccessSupported, pickSaveFolder, restoreSaveFolder } from '../../services/fileSystem';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const [showKey, setShowKey] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [folderLoading, setFolderLoading] = useState(false);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleExport() {
    const json = exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumeos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup downloaded.');
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const json = ev.target?.result as string;
      const err = importAllData(json);
      if (err) showToast(err);
      else showToast('Data restored successfully. Refresh to see changes.');
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  async function handlePickFolder() {
    setFolderLoading(true);
    try {
      const name = await pickSaveFolder();
      if (name) {
        updateSettings({ saveFolderName: name });
        showToast(`Save folder set: ${name}`);
      }
    } catch (err) {
      showToast('Could not access folder. Try again.');
    } finally {
      setFolderLoading(false);
    }
  }

  async function handleRestoreFolder() {
    setFolderLoading(true);
    try {
      const name = await restoreSaveFolder();
      if (name) {
        updateSettings({ saveFolderName: name });
        showToast(`Folder reconnected: ${name}`);
      } else {
        showToast('Permission not granted. Please re-pick the folder.');
      }
    } finally {
      setFolderLoading(false);
    }
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetToSeedData();
    setConfirmReset(false);
    showToast('Reset to seed data. Refresh to see changes.');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* ── AI Mode ─────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">AI Mode</h2>
        <p className="text-sm text-gray-500">
          Free mode shows copy-paste prompts for Claude.ai. API mode calls the Anthropic API
          directly — faster, but requires an API key.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => updateSettings({ aiMode: 'free' })}
            className={`flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
              settings.aiMode === 'free'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            Free (Copy-Paste)
          </button>
          <button
            onClick={() => updateSettings({ aiMode: 'api' })}
            className={`flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
              settings.aiMode === 'api'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            API Mode
          </button>
        </div>

        {settings.aiMode === 'api' && (
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-medium text-gray-700">
              Anthropic API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={(e) => updateSettings({ apiKey: e.target.value })}
                placeholder="sk-ant-..."
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Stored only in your browser's localStorage. Never sent anywhere except api.anthropic.com.
            </p>
          </div>
        )}
      </section>

      {/* ── Default Header ───────────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Default Resume Header</h2>
        <p className="text-sm text-gray-500">
          Pre-filled on every new resume version you generate.
        </p>

        <div className="grid grid-cols-1 gap-3">
          {(
            [
              { key: 'name', label: 'Full Name', placeholder: 'DEBJYOTI SAMANTA' },
              { key: 'email', label: 'Email', placeholder: 'dsaman@uw.edu' },
              { key: 'phone', label: 'Phone', placeholder: '+1 (206) 786-4075' },
              { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'linkedin.com/in/...' },
              { key: 'location', label: 'Location', placeholder: 'Seattle, Washington' },
            ] as const
          ).map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                value={settings.defaultHeader[key]}
                onChange={(e) =>
                  updateSettings({
                    defaultHeader: { ...settings.defaultHeader, [key]: e.target.value },
                  })
                }
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => showToast('Header settings saved automatically.')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Save size={14} />
          Settings auto-save
        </button>
      </section>

      {/* ── Application Save Folder ──────────────────────────────────────────── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Application Save Folder</h2>
        <p className="text-sm text-gray-500">
          When you click "Mark as Applied", the resume (.docx) and analysis report (.html) are
          saved into a subfolder named <span className="font-mono text-xs bg-gray-100 px-1 rounded">Company_Role</span> inside
          this folder. Chrome/Edge only — you may need to re-grant permission after restarting the browser.
        </p>

        {!isFSAccessSupported() && (
          <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            File System Access API is not supported in this browser. Use Chrome or Edge for local file saves.
          </div>
        )}

        {isFSAccessSupported() && (
          <div className="space-y-3">
            {settings.saveFolderName ? (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-800 truncate">{settings.saveFolderName}</p>
                  <p className="text-xs text-green-600">Save folder configured</p>
                </div>
                <button
                  onClick={handleRestoreFolder}
                  disabled={folderLoading}
                  className="text-xs text-green-700 hover:text-green-900 font-medium underline flex-shrink-0"
                >
                  Re-grant permission
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No save folder configured yet.</p>
            )}

            <button
              onClick={handlePickFolder}
              disabled={folderLoading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors w-fit disabled:opacity-50"
            >
              <FolderOpen size={14} />
              {folderLoading ? 'Requesting access...' : settings.saveFolderName ? 'Change folder' : 'Choose save folder'}
            </button>
          </div>
        )}
      </section>

      {/* ── Data Management ──────────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Data Management</h2>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors w-fit"
          >
            <Download size={14} />
            Export backup (JSON)
          </button>

          <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors w-fit cursor-pointer">
            <Upload size={14} />
            Restore from backup
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-3">
              Reset all experiences to the original seed data. Your resume versions and analyses
              will be cleared. Settings are preserved.
            </p>
            <button
              onClick={handleReset}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors w-fit ${
                confirmReset
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'border border-red-300 text-red-600 hover:bg-red-50'
              }`}
            >
              <RotateCcw size={14} />
              {confirmReset ? 'Click again to confirm reset' : 'Reset to seed data'}
            </button>
            {confirmReset && (
              <button
                onClick={() => setConfirmReset(false)}
                className="ml-2 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Toast ───────────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
