import { useState, useEffect } from 'react';
import { UserProfile, AssessmentResult } from '../types';

interface StoreState {
  profile: UserProfile | null;
  history: AssessmentResult[];
  language: string;
}

export function useStore() {
  const [state, setState] = useState<StoreState>(() => {
    const saved = localStorage.getItem('trader_psych_store');
    if (saved) return JSON.parse(saved);
    return { profile: null, history: [], language: 'en' };
  });

  useEffect(() => {
    localStorage.setItem('trader_psych_store', JSON.stringify(state));
  }, [state]);

  const updateProfile = (profile: UserProfile) => setState(s => ({ ...s, profile }));
  const addAssessment = (result: AssessmentResult) => setState(s => ({ ...s, history: [...s.history, result] }));
  const setLanguage = (language: string) => setState(s => ({ ...s, language }));
  const reset = () => setState({ profile: null, history: [], language: 'en' });

  return { state, updateProfile, addAssessment, setLanguage, reset };
}
