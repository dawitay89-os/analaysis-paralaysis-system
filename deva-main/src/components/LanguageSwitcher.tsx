import React from 'react';
import { useTranslation, LANGUAGES, Language } from '../i18n/context';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-zinc-400" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-theme-surface border focus:ring-2 focus:ring-theme-accent focus:border-theme-accent border-theme-border text-sm rounded-md py-1 px-2 text-theme-text outline-none transition-colors"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
