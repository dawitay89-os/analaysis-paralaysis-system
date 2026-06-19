import React, { useState } from 'react';
import { Button } from '../components/Button';
import { AssessmentAnswers } from '../types';
import { processAssessment } from '../lib/engine';
import { useStore } from '../store/useStore';
import { useTranslation, getLocalizedSections } from '../i18n/context';
import { BrainCircuit } from 'lucide-react';

export function Assessment({ onComplete }: { onComplete: () => void }) {
  const { addAssessment } = useStore();
  const { language, t } = useTranslation();
  const SECTIONS = getLocalizedSections(language);

  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    analysisParalysis: Array(7).fill(5),
    confirmationAddiction: Array(5).fill(5),
    fearAnalysis: Array(5).fill(5),
    executionFriction: Array(5).fill(5),
    fomo: Array(6).fill(5),
    confidence: Array(4).fill(5),
  });

  const section = SECTIONS[currentSection];
  const sectionId = section.id as keyof AssessmentAnswers;

  const handleSliderChange = (qIndex: number, val: number) => {
    setAnswers(prev => {
      const arr = [...prev[sectionId]];
      arr[qIndex] = val;
      return { ...prev, [sectionId]: arr };
    });
  };

  const handleNext = () => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(c => c + 1);
    } else {
      const result = processAssessment(answers);
      addAssessment(result);
      onComplete();
    }
  };

  const currentValues = answers[sectionId];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-3 text-indigo-400 mb-6">
        <BrainCircuit className="w-8 h-8" />
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">{t('weekly_extraction')}</h1>
      </div>

      <div className="flex gap-2 mb-8">
        {SECTIONS.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= currentSection ? 'bg-indigo-500' : 'bg-zinc-800'}`} />
        ))}
      </div>

      <div className="bg-[#121214] border border-zinc-800 p-6 md:p-8 rounded-xl shadow-xl space-y-8">
        <div>
          <h2 className="text-xl font-bold">{section.title}</h2>
          <p className="text-sm text-zinc-400 mt-1">{section.description}</p>
        </div>

        <div className="space-y-8">
          {section.questions.map((q, i) => (
            <div key={i} className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-zinc-300 w-3/4">{q}</label>
                <span className="text-xl font-mono text-indigo-400">{currentValues[i]}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={currentValues[i]}
                onChange={(e) => handleSliderChange(i, Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
              />
              <div className="flex justify-between text-xs text-zinc-500 font-mono">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 flex justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentSection(c => Math.max(0, c - 1))}
            disabled={currentSection === 0}
          >
            {t('btn_back')}
          </Button>
          <Button onClick={handleNext}>
            {currentSection === SECTIONS.length - 1 ? t('btn_generate_diagnostics') : t('btn_next_section')}
          </Button>
        </div>
      </div>
    </div>
  );
}
