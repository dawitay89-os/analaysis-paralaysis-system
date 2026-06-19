import React from 'react';
import { useTranslation } from '../i18n/context';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LayoutDashboard, FileText, Settings, Activity, Palette } from 'lucide-react';
import { cn } from '../lib/utils';

function NegadrasLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="40%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#b0b8c8" />
          <stop offset="100%" stopColor="#8892a0" />
        </linearGradient>
        <linearGradient id="st" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#d0d8e8" />
          <stop offset="100%" stopColor="#8892a0" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="115" r="62" stroke="url(#sl)" strokeWidth="3.5" />
      <circle cx="100" cy="115" r="54" stroke="url(#sl)" strokeWidth="1.2" strokeDasharray="2 8" strokeLinecap="round" />
      <circle cx="100" cy="47" r="7" stroke="url(#sl)" strokeWidth="3" />
      <line x1="100" y1="53" x2="100" y2="54" stroke="url(#sl)" strokeWidth="3" strokeLinecap="round" />
      <polyline points="68,135 82,118 93,128 112,98" stroke="url(#sl)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="112" y1="98" x2="136" y2="82" stroke="url(#sl)" strokeWidth="3.5" strokeLinecap="round" />
      <polyline points="122,78 136,82 132,95" stroke="url(#sl)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="100" y="200" textAnchor="middle" fontFamily="'Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="22" fontWeight="700" letterSpacing="6" fill="url(#st)">NEGADRAS</text>
      <text x="100" y="216" textAnchor="middle" fontFamily="'Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="9" fontWeight="400" letterSpacing="4" fill="url(#st)">GROUP 6</text>
    </svg>
  );
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'assessment' | 'reports' | 'profile';
  onNavigate: (tab: 'dashboard' | 'assessment' | 'reports' | 'profile') => void;
}

export function Layout({ children, activeTab, onNavigate }: LayoutProps) {
  const { t } = useTranslation();

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'assessment', label: t('take_assessment'), icon: Activity },
    { id: 'reports', label: t('reports'), icon: FileText },
    { id: 'profile', label: t('profile_setup'), icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col md:flex-row font-sans transition-colors duration-300">

      {/* ── Desktop Sidebar ──────────────────────────────────────────── */}
      <aside className="hidden md:flex w-64 border-r border-theme-border bg-theme-surface flex-col transition-colors duration-300">

        {/* Brand */}
        <div className="p-6 flex items-center gap-3 border-b border-theme-border">
          <NegadrasLogo className="w-10 h-10 flex-shrink-0" />
          <span className="font-bold text-sm leading-tight text-theme-text">{t('app_title')}</span>
        </div>

        {/* ── Theme Switcher — top of sidebar, vertical ── */}
        <div className="px-4 pt-4 pb-2">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-theme-muted mb-2 px-1">
            <Palette className="w-3 h-3" />
            Theme
          </p>
          <ThemeSwitcher />
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-theme-border" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full text-left',
                  activeTab === item.id
                    ? 'bg-theme-active text-theme-accent'
                    : 'text-theme-muted hover:text-theme-text hover:bg-theme-hover'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Language switcher at the bottom */}
        <div className="p-4 border-t border-theme-border">
          <LanguageSwitcher />
        </div>
      </aside>

      {/* ── Mobile layout ────────────────────────────────────────────── */}
      <div className="md:hidden flex flex-col min-h-screen">

        {/* Mobile top bar: logo + language */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-theme-border bg-theme-surface">
          <div className="flex items-center gap-2">
            <NegadrasLogo className="w-8 h-8" />
            <span className="font-bold text-sm text-theme-text">{t('app_title')}</span>
          </div>
          <LanguageSwitcher />
        </header>

        {/* Mobile theme switcher — full-width horizontal row */}
        <div className="px-3 py-2 border-b border-theme-border bg-theme-surface">
          <MobileThemeSwitcher />
        </div>

        {/* Mobile nav tabs */}
        <nav className="flex border-b border-theme-border bg-theme-surface px-2 gap-1 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-md text-xs font-medium transition-colors',
                  activeTab === item.id
                    ? 'bg-theme-active text-theme-accent'
                    : 'text-theme-muted hover:text-theme-text hover:bg-theme-hover'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="truncate text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* ── Desktop main content ─────────────────────────────────────── */}
      <main className="hidden md:flex flex-1 flex-col h-screen overflow-y-auto">
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

    </div>
  );
}

// Compact horizontal theme switcher for mobile — shows dot + label
function MobileThemeSwitcher() {
  const { state, setTheme } = useStore();
  const current = state.theme ?? 'negadras-dark';

  const THEMES: { id: import('../types').Theme; label: string; dot: string }[] = [
    { id: 'negadras-dark', label: 'Dark', dot: 'bg-indigo-500' },
    { id: 'light', label: 'Light', dot: 'bg-amber-400' },
    { id: 'cyberpunk', label: 'Cyberpunk', dot: 'bg-green-400' },
    { id: 'amoled', label: 'AMOLED', dot: 'bg-fuchsia-500' },
  ];

  return (
    <div className="flex items-center gap-1 w-full">
      {THEMES.map(({ id, label, dot }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          aria-pressed={current === id}
          aria-label={`Switch to ${label} theme`}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200',
            current === id
              ? 'bg-theme-active text-theme-text'
              : 'text-theme-muted hover:bg-theme-hover'
          )}
        >
          <span className={cn('w-2 h-2 rounded-full flex-shrink-0', dot, current === id ? 'opacity-100' : 'opacity-40')} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

// Import useStore here so MobileThemeSwitcher can use it
import { useStore } from '../store/useStore';
