import React from 'react';
import { useStore } from '../store/useStore';
import { Theme } from '../types';
import { Monitor, Sun, Terminal, Circle } from 'lucide-react';
import { cn } from '../lib/utils';

const THEMES: { id: Theme; label: string; icon: React.ElementType; accent: string; dot: string }[] = [
    { id: 'negadras-dark', label: 'Dark', icon: Monitor, accent: 'text-indigo-400', dot: 'bg-indigo-500' },
    { id: 'light', label: 'Light', icon: Sun, accent: 'text-amber-500', dot: 'bg-amber-400' },
    { id: 'cyberpunk', label: 'Cyberpunk', icon: Terminal, accent: 'text-green-400', dot: 'bg-green-400' },
    { id: 'amoled', label: 'AMOLED', icon: Circle, accent: 'text-fuchsia-400', dot: 'bg-fuchsia-500' },
];

export function ThemeSwitcher() {
    const { state, setTheme } = useStore();
    const current = state.theme ?? 'negadras-dark';

    return (
        <div className="w-full flex flex-col gap-1">
            {THEMES.map(({ id, label, icon: Icon, accent, dot }) => (
                <button
                    key={id}
                    onClick={() => setTheme(id)}
                    aria-label={`Switch to ${label} theme`}
                    aria-pressed={current === id}
                    className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 text-left',
                        current === id
                            ? `bg-theme-active ${accent}`
                            : 'text-theme-muted hover:text-theme-text hover:bg-theme-hover'
                    )}
                >
                    {/* Colour dot indicator */}
                    <span className={cn('w-2 h-2 rounded-full flex-shrink-0', dot, current === id ? 'opacity-100' : 'opacity-40')} />
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{label}</span>
                    {current === id && (
                        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider opacity-60">on</span>
                    )}
                </button>
            ))}
        </div>
    );
}
