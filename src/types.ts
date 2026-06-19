export type Theme = 'dark' | 'light';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type TradingStyle = 'Scalping' | 'Day Trading' | 'Swing Trading' | 'Position Trading';
export type Market = 'Forex' | 'Crypto' | 'Stocks' | 'Indices' | 'Commodities';
export type AccountType = 'Demo' | 'Live' | 'Funded';

export interface UserProfile {
  experience: ExperienceLevel;
  style: TradingStyle;
  market: Market;
  averageTradesPerWeek: number;
  strategyRules: number;
  entryConfirmations: number;
  accountType: AccountType;
  accountSize: number;
  riskPerTrade: number;
  name?: string;
}

export interface AssessmentAnswers {
  analysisParalysis: number[]; // 7 questions
  confirmationAddiction: number[]; // 5 questions
  fearAnalysis: number[]; // 5 questions
  executionFriction: number[]; // 5 questions
  fomo: number[]; // 6 questions
  confidence: number[]; // 4 questions
}

export interface AssessmentResult {
  date: string;
  scores: {
    analysisParalysis: number;
    fomo: number;
    confidence: number;
    discipline: number;
  };
  archetype: Archetype;
  rootCauses: RootCause[];
  recommendations: Recommendation[];
}

export type Archetype =
  | 'Frozen Analyst'
  | 'Perfectionist Trader'
  | 'Reactive Chaser'
  | 'Fear-Based Trader'
  | 'Developing Professional'
  | 'Disciplined Operator';

export interface RootCause {
  cause: string;
  severity: 'High' | 'Medium' | 'Low';
  type: 'Primary' | 'Secondary' | 'Supporting';
}

export interface Recommendation {
  type: 'Task' | 'Challenge' | 'Objective';
  description: string;
}
