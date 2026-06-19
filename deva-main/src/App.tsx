import React, { useState } from 'react';
import { I18nProvider } from './i18n/context';
import { useStore } from './store/useStore';
import { Layout } from './components/Layout';
import { Welcome } from './pages/Welcome';
import { Profile } from './pages/Profile';
import { Assessment } from './pages/Assessment';
import { Dashboard } from './pages/Dashboard';
import { Reports } from './pages/Reports';

// Apply saved theme before first paint to avoid flash
(function applyInitialTheme() {
  try {
    const saved = localStorage.getItem('trader_psych_store');
    const theme = saved ? (JSON.parse(saved).theme === 'light' ? 'light' : 'dark') : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

function AppContent() {
  const { state } = useStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assessment' | 'reports' | 'profile'>('dashboard');
  const [showWelcome, setShowWelcome] = useState(!state.profile && state.history.length === 0);

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-theme-bg text-theme-text p-4 md:p-8">
        <Welcome onStart={() => {
          setShowWelcome(false);
          setActiveTab('profile');
        }} />
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} onNavigate={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'assessment' && <Assessment onComplete={() => setActiveTab('dashboard')} />}
      {activeTab === 'reports' && <Reports />}
      {activeTab === 'profile' && <Profile onComplete={() => setActiveTab('dashboard')} />}
    </Layout>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
