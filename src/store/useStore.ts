import { useState, useEffect } from 'react';
import { UserProfile, AssessmentResult, Theme } from '../types';

interface StoreState {
  profile: UserProfile | null;
  history: AssessmentResult[];
  language: string;
  theme: Theme;
}

export function useStore() {
  const [state, setState] = useState<StoreState>(() => {
    const saved = localStorage.getItem('trader_psych_store');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { theme: 'negadras-dark', ...parsed };
    }
    return { profile: null, history: [], language: 'en', theme: 'negadras-dark' };
  });

  const getSyncState = (): StoreState => {
    const saved = localStorage.getItem('trader_psych_store');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { theme: 'negadras-dark', ...parsed };
    }
    return { profile: null, history: [], language: 'en', theme: 'negadras-dark' };
  };

  const updateProfile = (profile: UserProfile) => {
    const next = { ...getSyncState(), profile };
    localStorage.setItem('trader_psych_store', JSON.stringify(next));
    setState(next);
  };

  const addAssessment = (result: AssessmentResult) => {
    const currentState = getSyncState();
    const next = { ...currentState, history: [...currentState.history, result] };
    localStorage.setItem('trader_psych_store', JSON.stringify(next));
    setState(next);
  };

  const setLanguage = (language: string) => {
    const next = { ...getSyncState(), language };
    localStorage.setItem('trader_psych_store', JSON.stringify(next));
    setState(next);
  };

  const setTheme = (theme: Theme) => {
    const next = { ...getSyncState(), theme };
    localStorage.setItem('trader_psych_store', JSON.stringify(next));
    setState(next);
  };

  const reset = () => {
    const next = { profile: null, history: [], language: 'en', theme: 'negadras-dark' as Theme };
    localStorage.setItem('trader_psych_store', JSON.stringify(next));
    setState(next);
  };

  return { state, updateProfile, addAssessment, setLanguage, setTheme, reset };
}
