import React from 'react';
import { useTranslation } from '../i18n/context';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LayoutDashboard, FileText, Settings, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

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
      {/* Outer ring */}
      <circle cx="100" cy="115" r="62" stroke="url(#sl)" strokeWidth="3.5" />
      {/* Inner dashed tick ring */}
      <circle cx="100" cy="115" r="54" stroke="url(#sl)" strokeWidth="1.2" strokeDasharray="2 8" strokeLinecap="round" />
      {/* Top hanging loop */}
      <circle cx="100" cy="47" r="7" stroke="url(#sl)" strokeWidth="3" />
      <line x1="100" y1="53" x2="100" y2="54" stroke="url(#sl)" strokeWidth="3" strokeLinecap="round" />
      {/* Chart zigzag */}
      <polyline points="68,135 82,118 93,128 112,98" stroke="url(#sl)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Arrow shaft */}
      <line x1="112" y1="98" x2="136" y2="82" stroke="url(#sl)" strokeWidth="3.5" strokeLinecap="round" />
      {/* Arrow head */}
      <polyline points="122,78 136,82 132,95" stroke="url(#sl)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* NEGADRAS label */}
      <text x="100" y="200" textAnchor="middle" fontFamily="'Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="22" fontWeight="700" letterSpacing="6" fill="url(#st)">NEGADRAS</text>
      {/* GROUP 6 label */}
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
  const { state } = useStore();

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'assessment', label: t('take_assessment'), icon: Activity },
    { id: 'reports', label: t('reports'), icon: FileText },
    { id: 'profile', label: t('profile_setup'), icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Desktop / Navbar Mobile */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-800 bg-[#0c0c0e] flex flex-col">
        <div className="p-4 md:p-6 flex items-center gap-3">
          <NegadrasLogo className="w-10 h-10 flex-shrink-0" />
          <span className="font-bold text-sm leading-tight hidden md:block">
            {t('app_title')}
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto w-full md:w-auto px-2 md:px-4 flex flex-row md:flex-col gap-1 py-3 md:py-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full",
                  activeTab === item.id
                    ? "bg-zinc-800 text-indigo-400"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800 hidden md:block">
          <LanguageSwitcher />
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-[calc(100vh-65px)] md:h-screen overflow-y-auto relative">
        <div className="md:hidden absolute top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
