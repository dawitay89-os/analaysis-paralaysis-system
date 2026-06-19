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

  const getSyncState = (): StoreState => {
    const saved = localStorage.getItem('trader_psych_store');
    return saved ? JSON.parse(saved) : { profile: null, history: [], language: 'en' };
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

  const reset = () => {
    const next = { profile: null, history: [], language: 'en' };
    localStorage.setItem('trader_psych_store', JSON.stringify(next));
    setState(next);
  };

  return { state, updateProfile, addAssessment, setLanguage, reset };
}
