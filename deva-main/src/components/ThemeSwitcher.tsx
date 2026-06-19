import React from 'react';
import { useStore } from '../store/useStore';
import { Theme } from '../types';
import { Monitor, Sun, Terminal, Circle } from 'lucide-react';
import { cn } from '../lib/utils';

const THEMES: { id: Theme; label: string; icon: React.ElementType; accent: string }[] = [
    { id: 'negadras-dark', label: 'Dark', icon: Monitor, accent: 'text-indigo-400' },
    { id: 'light', label: 'Light', icon: Sun, accent: 'text-amber-500' },
    { id: 'cyberpunk', label: 'Cyberpunk', icon: Terminal, accent: 'text-green-400' },
    { id: 'amoled', label: 'AMOLED', icon: Circle, accent: 'text-fuchsia-400' },
];

export function ThemeSwitcher() {
    const { state, setTheme } = useStore();
    const current = state.theme ?? 'negadras-dark';

    return (
        <div className="flex items-center gap-1 p-1 rounded-lg bg-theme-surface border border-theme-border">
            {THEMES.map(({ id, label, icon: Icon, accent }) => (
                <button
                    key={id}
                    onClick={() => setTheme(id)}
                    title={label}
                    aria-label={`Switch to ${label} theme`}
                    className={cn(
                        'flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                        current === id
                            ? `bg-theme-active ${accent} shadow-sm`
                            : 'text-theme-muted hover:text-theme-text hover:bg-theme-hover'
                    )}
                >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">{label}</span>
                </button>
            ))}
        </div>
    );
}
