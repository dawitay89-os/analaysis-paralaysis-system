import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export function DarkModeToggle({ className }: { className?: string }) {
    const { state, setTheme } = useStore();
    const isDark = (state.theme ?? 'dark') === 'dark';

    const toggle = () => setTheme(isDark ? 'light' : 'dark');

    return (
        <button
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
            className={cn(
                'flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors',
                'text-theme-muted hover:text-theme-text hover:bg-theme-hover',
                className
            )}
        >
            {isDark ? (
                <>
                    <Sun className="w-4 h-4 flex-shrink-0" />
                    <span>Light mode</span>
                </>
            ) : (
                <>
                    <Moon className="w-4 h-4 flex-shrink-0" />
                    <span>Dark mode</span>
                </>
            )}
        </button>
    );
}
