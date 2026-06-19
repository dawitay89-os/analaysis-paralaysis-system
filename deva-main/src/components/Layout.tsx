import React from 'react';
import { useTranslation } from '../i18n/context';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Brain, LayoutDashboard, FileText, Settings, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

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
          <div className="bg-indigo-600/20 p-2 rounded-lg text-indigo-400">
            <Brain className="w-6 h-6" />
          </div>
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
