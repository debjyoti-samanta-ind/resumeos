import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AppSettings } from '../types';
import { loadSettings, saveSettings } from '../services/storage';

interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  // Persist whenever settings change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  function updateSettings(patch: Partial<AppSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
