import { useEffect } from 'react';
import AppShell from './components/layout/AppShell';
import { SettingsProvider } from './context/SettingsContext';
import { initializeStorage } from './services/storage';

export default function App() {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <SettingsProvider>
      <AppShell />
    </SettingsProvider>
  );
}
