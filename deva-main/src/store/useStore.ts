import { useState } from 'react';
import { UserProfile, AssessmentResult, Theme } from '../types';

interface StoreState {
  profile: UserProfile | null;
  history: AssessmentResult[];
  language: string;
  theme: Theme;
}

const DEFAULT_STATE: StoreState = {
  profile: null,
  history: [],
  language: 'en',
  theme: 'dark',
};

function loadState(): StoreState {
  try {
    const saved = localStorage.getItem('trader_psych_store');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old theme values to new 'dark' | 'light'
      const raw = parsed.theme;
      const theme: Theme = raw === 'light' ? 'light' : 'dark';
      return { ...DEFAULT_STATE, ...parsed, theme };
    }
  } catch {/* ignore */ }
  return { ...DEFAULT_STATE };
}

function saveState(state: StoreState) {
  localStorage.setItem('trader_psych_store', JSON.stringify(state));
  // Immediately apply theme attribute so there's no flash
  document.documentElement.setAttribute('data-theme', state.theme);
}

export function useStore() {
  const [state, setState] = useState<StoreState>(loadState);

  const updateProfile = (profile: UserProfile) => {
    setState(prev => {
      const next = { ...prev, profile };
      saveState(next);
      return next;
    });
  };

  const addAssessment = (result: AssessmentResult) => {
    setState(prev => {
      const next = { ...prev, history: [...prev.history, result] };
      saveState(next);
      return next;
    });
  };

  const setLanguage = (language: string) => {
    setState(prev => {
      const next = { ...prev, language };
      saveState(next);
      return next;
    });
  };

  const setTheme = (theme: Theme) => {
    setState(prev => {
      const next = { ...prev, theme };
      saveState(next);
      return next;
    });
  };

  const reset = () => {
    const next = { ...DEFAULT_STATE };
    saveState(next);
    setState(next);
  };

  return { state, updateProfile, addAssessment, setLanguage, setTheme, reset };
}
