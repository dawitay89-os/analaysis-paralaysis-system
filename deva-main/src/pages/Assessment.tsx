import React, { useState } from 'react';
import { Button } from '../components/Button';
import { AssessmentAnswers } from '../types';
import { processAssessment } from '../lib/engine';
import { useStore } from '../store/useStore';
import { BrainCircuit } from 'lucide-react';

const SECTIONS = [
  {
    id: 'analysisParalysis',
    title: 'Section 1: Analysis Paralysis',
    description: 'Rate the following based on your last week of trading (1 = Never/Low, 10 = Always/High).',
    questions: [
      'Valid setups missed due to hesitation?',
      'Fear prevented execution?',
      'Average delay before entry after setup appeared?',
      'Sought additional non-core confirmations?',
      'Number of unneeded indicators checked?',
      'Time spent analyzing before a forced entry?',
      'Anxiety level when attempting to enter?'
    ]
  },
  {
    id: 'confirmationAddiction',
    title: 'Section 2: Confirmation Addiction',
    description: 'Rate the following based on your last week of trading.',
    questions: [
      'Number of indicators relied upon (1=few, 10=many)?',
      'Number of timeframes flipped through (1=few, 10=many)?',
      'Sought outside opinions before entry (social media)?',
      'Influence level of social media on your setups?',
      'Dependence on news alignment before technical entry?'
    ]
  },
  {
    id: 'fearAnalysis',
    title: 'Section 3: Fear Analysis',
    description: 'Rate the intensity of the following fears.',
    questions: [
      'Fear of taking a loss?',
      'Fear of being proven wrong by the market?',
      'Fear of account drawdown?',
      'Fear of market uncertainty?',
      'Fear of accepting the initial risk?'
    ]
  },
  {
    id: 'executionFriction',
    title: 'Section 4: Execution Friction',
    description: 'Rate the friction in your physical execution.',
    questions: [
      'Delay before pressing the buy/sell button?',
      'Frequency of cancelling pending orders prematurely?',
      'Frequency of modifying entries to less optimal prices?',
      'General hesitation frequency?',
      'Difference in execution ease between demo and live (1=same, 10=huge gap)?'
    ]
  },
  {
    id: 'fomo',
    title: 'Section 5: FOMO & Impulsivity',
    description: 'Rate the frequency of impulsive actions.',
    questions: [
      'Chased price after missing initial entry?',
      'Revenge traded immediately after a loss?',
      'Entered prematurely due to fear of missing out?',
      'Entered late because it "looked safe now"?',
      'Entered purely out of boredom or emotion?',
      'Violated core strategy rules to get into a trade?'
    ]
  },
  {
    id: 'confidence',
    title: 'Section 6: Trader Confidence',
    description: 'Rate your confidence levels.',
    questions: [
      'Trust in your strategy over a 100-trade sample?',
      'Confidence in your ability to execute flawlessly?',
      'Ability to maintain confidence immediately after a loss?',
      'Ability to avoid over-confidence immediately after a win?'
    ]
  }
];

export function Assessment({ onComplete }: { onComplete: () => void }) {
  const { addAssessment } = useStore();
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
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Weekly Psychological Extraction</h1>
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
            Back
          </Button>
          <Button onClick={handleNext}>
            {currentSection === SECTIONS.length - 1 ? 'Generate Diagnostics' : 'Next Section'}
          </Button>
        </div>
      </div>
    </div>
  );
}
