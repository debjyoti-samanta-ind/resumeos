import { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { exportAllData, importAllData } from '../../services/storage';

interface JsonExportImportProps {
  onImportDone?: () => void;
}

export default function JsonExportImport({ onImportDone }: JsonExportImportProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleExport() {
    const json = exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumeos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const json = ev.target?.result as string;
      const err = importAllData(json);
      if (err) {
        setError(err);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        onImportDone?.();
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Download size={14} /> Export JSON
      </button>

      <label className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
        <Upload size={14} /> Import JSON
        <input type="file" accept=".json" onChange={handleImport} className="hidden" />
      </label>

      {success && <span className="text-sm text-green-600 font-medium">Imported! Refresh to see changes.</span>}
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
