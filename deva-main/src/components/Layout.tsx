import React from 'react';
import { useTranslation } from '../i18n/context';
import { LanguageSwitcher } from './LanguageSwitcher';
import { DarkModeToggle } from './ThemeSwitcher';
import { LayoutDashboard, FileText, Settings, Activity } from 'lucide-react';
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

type Tab = 'dashboard' | 'assessment' | 'reports' | 'profile';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  onNavigate: (tab: Tab) => void;
}

export function Layout({ children, activeTab, onNavigate }: LayoutProps) {
  const { t } = useTranslation();

  const navItems = [
    { id: 'dashboard' as Tab, label: t('dashboard'), icon: LayoutDashboard },
    { id: 'assessment' as Tab, label: t('take_assessment'), icon: Activity },
    { id: 'reports' as Tab, label: t('reports'), icon: FileText },
    { id: 'profile' as Tab, label: t('profile_setup'), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col md:flex-row font-sans transition-colors duration-200">

      {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
      <aside className="hidden md:flex w-64 flex-shrink-0 border-r border-theme-border bg-theme-surface flex-col h-screen sticky top-0 transition-colors duration-200">

        {/* Brand */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-theme-border">
          <NegadrasLogo className="w-9 h-9 flex-shrink-0" />
          <span className="font-bold text-sm leading-tight text-theme-text">{t('app_title')}</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full text-left',
                activeTab === id
                  ? 'bg-theme-active text-theme-accent'
                  : 'text-theme-muted hover:text-theme-text hover:bg-theme-hover'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom: language + dark-mode toggle */}
        <div className="px-3 py-4 border-t border-theme-border flex flex-col gap-1">
          <div className="px-3 py-2">
            <LanguageSwitcher />
          </div>
          <DarkModeToggle />
        </div>
      </aside>

      {/* ── Mobile Header ───────────────────────────────────────────── */}
      <div className="md:hidden flex flex-col min-h-screen w-full">
        <header className="flex items-center justify-between px-4 py-3 border-b border-theme-border bg-theme-surface sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <NegadrasLogo className="w-8 h-8" />
            <span className="font-bold text-sm text-theme-text">{t('app_title')}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <DarkModeToggle className="!w-auto !px-2 !py-1.5" />
          </div>
        </header>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-10 flex border-t border-theme-border bg-theme-surface px-2 py-2 gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-md text-xs font-medium transition-colors',
                activeTab === id
                  ? 'bg-theme-active text-theme-accent'
                  : 'text-theme-muted hover:text-theme-text hover:bg-theme-hover'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="truncate text-[10px] leading-none">{label}</span>
            </button>
          ))}
        </nav>

        {/* Mobile content — pad bottom for fixed nav */}
        <main className="flex-1 overflow-y-auto pb-20">
          <div className="p-4 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* ── Desktop main content ────────────────────────────────────── */}
      <main className="hidden md:block flex-1 h-screen overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

    </div>
  );
}
