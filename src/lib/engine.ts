import { AssessmentAnswers, AssessmentResult, Archetype, RootCause, Recommendation } from '../types';

// ─── Helpers ────────────────────────────────────────────────────────────────
const avg = (arr: number[]) =>
  arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;

// ─── Score Calculation ───────────────────────────────────────────────────────
export function calculateScores(answers: AssessmentAnswers): AssessmentResult['scores'] {
  const apBase = avg(answers.analysisParalysis);    // 7 Qs, scale 1-10
  const confBase = avg(answers.confirmationAddiction); // 5 Qs
  const fearBase = avg(answers.fearAnalysis);          // 5 Qs
  const frictionBase = avg(answers.executionFriction); // 5 Qs
  const fomoBase = avg(answers.fomo);                  // 6 Qs
  const confScoreBase = avg(answers.confidence);       // 4 Qs (higher = better)

  // Analysis Paralysis – weighted composite (0-100)
  const apScore = Math.min(
    100,
    Math.round(((apBase * 1.5 + confBase * 1.0 + fearBase * 1.2 + frictionBase * 1.0) / 4.7) * 10)
  );

  // FOMO – direct mapping
  const fomoScore = Math.min(100, Math.round(fomoBase * 10));

  // Confidence – direct mapping (higher raw = more confident = good)
  const confidenceScore = Math.min(100, Math.round(confScoreBase * 10));

  // Discipline – inverse of paralysis+fomo pressure, min 0
  const disciplineScore = Math.max(0, Math.min(100, Math.round(100 - (apScore + fomoScore) / 2)));

  // Granular scores exposed for coaching engine
  const fearScore = Math.min(100, Math.round(fearBase * 10));
  const frictionScore = Math.min(100, Math.round(frictionBase * 10));
  const addictionScore = Math.min(100, Math.round(confBase * 10));

  return {
    analysisParalysis: apScore,
    fomo: fomoScore,
    confidence: confidenceScore,
    discipline: disciplineScore,
    fear: fearScore,
    friction: frictionScore,
    addictionScore,
  };
}

// ─── Archetype Detection ─────────────────────────────────────────────────────
export function detectArchetype(scores: AssessmentResult['scores']): Archetype {
  const { analysisParalysis, fomo, confidence, discipline } = scores;

  if (discipline >= 85) return 'Disciplined Operator';
  if (discipline >= 60 && analysisParalysis < 40 && fomo < 40) return 'Developing Professional';
  if (analysisParalysis > 70 && fomo < 40) return 'Frozen Analyst';
  if (analysisParalysis > 55 && confidence < 50) return 'Perfectionist Trader';
  if (fomo > 65) return 'Reactive Chaser';
  if (confidence < 45 && fomo < 55) return 'Fear-Based Trader';
  if (discipline >= 60) return 'Developing Professional';
  return 'Fear-Based Trader';
}

// ─── Archetype Descriptions ──────────────────────────────────────────────────
export const ARCHETYPE_META: Record<Archetype, { traits: string[]; description: string; color: string }> = {
  'Frozen Analyst': {
    traits: ['Missed opportunities', 'Overthinking', 'Hesitation'],
    description:
      'You possess strong analytical skills but are held back by the compulsive need to gather more data before committing to a trade. Every valid setup triggers a cascade of "what-ifs" that delay or prevent execution. The market moves while you calculate. You are not lacking knowledge — you are lacking the willingness to act under uncertainty, which is the fundamental requirement of trading.',
    color: 'text-red-400',
  },
  'Perfectionist Trader': {
    traits: ['Too many confirmations', 'Excessive analysis'],
    description:
      'You set an impossibly high bar for trade entry, demanding confirmation from multiple indicators, timeframes, and external sources before pulling the trigger. This behavior is rooted in a deep fear of being wrong, causing you to build a wall of "confirmations" that almost never aligns perfectly. Perfectionism in trading is not a virtue — it is a disguised form of fear-avoidance.',
    color: 'text-amber-400',
  },
  'Reactive Chaser': {
    traits: ['FOMO', 'Impulsive entries'],
    description:
      'Your trading is dominated by emotional reactivity. You enter trades after price has already moved, chase setups that have lost their edge, and revenge-trade after losses to recover emotionally. The market does not respond to your need for validation. Impulsive entries, driven by FOMO or frustration, consistently violate your strategy and erode both capital and confidence.',
    color: 'text-orange-400',
  },
  'Fear-Based Trader': {
    traits: ['Fear of loss', 'Risk avoidance'],
    description:
      'Fear governs every aspect of your trading. Fear of losing, fear of drawdowns, fear of the market proving you wrong — these forces cause chronic hesitation, premature exits, and avoidance of valid setups. You treat each loss as evidence that trading is unsafe rather than as a statistical outcome of a probabilistic process. Until you accept risk as the cost of participation, fear will remain your primary driver.',
    color: 'text-purple-400',
  },
  'Developing Professional': {
    traits: ['Improving consistency'],
    description:
      'You are on the right trajectory. Your psychological profile shows meaningful improvement in process adherence and emotional regulation. You still face challenges with consistency — there are occasional lapses into old patterns — but the trend is positive. Focus now on solidifying your edge by maintaining strict journal discipline, grading your trades by process rather than profit, and continuing to build evidence-based confidence.',
    color: 'text-blue-400',
  },
  'Disciplined Operator': {
    traits: ['Strong execution', 'Process-driven'],
    description:
      'You represent the psychological standard all traders aspire to. Your execution is consistent, your process-adherence is strong, and you are able to absorb losses without emotional disruption. At this level, the primary focus shifts to refining your edge statistically, scaling your position sizing systematically, and protecting your psychological capital during extended drawdown periods. Complacency is your only real risk.',
    color: 'text-emerald-400',
  },
};

// ─── Root Cause Identification ───────────────────────────────────────────────
export function identifyRootCauses(answers: AssessmentAnswers): RootCause[] {
  const rawCauses: { cause: string; score: number; category: string }[] = [
    {
      cause: 'Emotional Instability',
      score:
        (avg(answers.fearAnalysis) * 1.3 +
          avg(answers.fomo) * 1.1 +
          (avg(answers.confidence.map(v => 10 - v))) * 1.0) /
        3.4,
      category: 'Psychological',
    },
    {
      cause: 'Lack of Process Trust',
      score:
        ((10 - (answers.confidence[0] ?? 5)) * 1.5 +
          avg(answers.confirmationAddiction) * 1.0 +
          avg(answers.executionFriction) * 0.8) /
        3.3,
      category: 'Behavioral',
    },
    {
      cause: 'Fear of Being Wrong',
      score: (answers.fearAnalysis[1] ?? 5) * 1.0,
      category: 'Cognitive',
    },
    {
      cause: 'Fear of Loss',
      score: (answers.fearAnalysis[0] ?? 5) * 1.0,
      category: 'Emotional',
    },
    {
      cause: 'Confirmation Addiction',
      score: avg(answers.confirmationAddiction),
      category: 'Behavioral',
    },
    {
      cause: 'Impulsivity / FOMO',
      score: avg(answers.fomo),
      category: 'Emotional',
    },
    {
      cause: 'Overthinking / Paralysis',
      score: avg(answers.analysisParalysis),
      category: 'Cognitive',
    },
  ];

  rawCauses.sort((a, b) => b.score - a.score);

  const toSeverity = (score: number): 'High' | 'Medium' | 'Low' =>
    score >= 7 ? 'High' : score >= 4.5 ? 'Medium' : 'Low';

  return [
    { cause: rawCauses[0].cause, severity: toSeverity(rawCauses[0].score), type: 'Primary' },
    { cause: rawCauses[1].cause, severity: toSeverity(rawCauses[1].score), type: 'Secondary' },
    { cause: rawCauses[2].cause, severity: toSeverity(rawCauses[2].score), type: 'Supporting' },
  ];
}

// ─── Knowledge Base ──────────────────────────────────────────────────────────
export interface KnowledgeConcept {
  trigger: string;
  lesson: string;
  exercise: string;
  insight: string;
}

export const KNOWLEDGE_BASE: KnowledgeConcept[] = [
  {
    trigger: 'Fear of Being Wrong',
    lesson: 'Probability Thinking',
    exercise:
      'Before every trade, write down: "This is one event out of my next 100. The outcome of this trade does not define my edge." After 20 trades, review the written record to observe patterns separate from outcomes.',
    insight:
      'Elite traders do not predict; they execute. A single loss is statistically meaningless — it is the 100-trade sample that reveals the truth about your edge. Detaching identity from individual outcomes is the first step to psychological freedom in trading.',
  },
  {
    trigger: 'Fear of Loss',
    lesson: 'Risk Acceptance Training',
    exercise:
      'Every session, before placing your first trade, write the maximum dollar amount you are willing to lose and say aloud: "I accept this loss as the cost of participating in this opportunity." Close the trade only at your pre-defined stop.',
    insight:
      'The pain of a loss is not caused by the loss itself — it is caused by the resistance to the loss. Traders who are pre-committed to their risk experience losses as neutral data points rather than personal failures.',
  },
  {
    trigger: 'Overthinking',
    lesson: 'Simplification Framework',
    exercise:
      'Limit your entry checklist to exactly 3 conditions. Write them down and physically check each one. If all 3 are met, you enter. No additional confirmation is permitted. Practice this for 10 consecutive trades before modifying.',
    insight:
      'Complexity is the enemy of execution. The best strategies in trading history are rooted in simple, repeatable rules. Additional indicators beyond your core setup do not add accuracy — they add noise and hesitation.',
  },
  {
    trigger: 'FOMO',
    lesson: 'Process Discipline',
    exercise:
      'After missing a setup, write in your journal: "I missed this trade. The next valid setup will come. I commit to waiting for my criteria rather than chasing this move." Set a 30-minute timer before looking at any other trade.',
    insight:
      'FOMO is the market\'s most effective trap. When you chase a missed move, you enter at the worst possible location with maximum emotional exposure. The mindset shift: the market owes you nothing, but your process owes you consistency.',
  },
  {
    trigger: 'Revenge Trading',
    lesson: 'Emotional Recovery Routine',
    exercise:
      'Create a 3-step post-loss routine: (1) Close your platform for 15 minutes. (2) Write what emotion you feel and why. (3) Return only when you can state your next trade\'s full rationale calmly. No exceptions.',
    insight:
      'Revenge trading is the attempt to use the market as an emotional vending machine — inserting frustration to receive vindication. The market does not respond to your emotional state. Every revenge trade compounds the original error.',
  },
  {
    trigger: 'Confidence Issues',
    lesson: 'Evidence-Based Confidence Building',
    exercise:
      'For 30 days, grade every trade on a 1–5 scale for process adherence only (not PnL). Calculate your weekly process score. At 80% adherence over 3 weeks, your evidence base for confidence becomes mathematically undeniable.',
    insight:
      'Real trading confidence is not a feeling — it is the logical conclusion of a documented record. Traders who build confidence from win streaks lose it equally fast. Confidence rooted in verifiable process adherence is unshakable.',
  },
];

// ─── Recommendation Generation ───────────────────────────────────────────────
export function generateRecommendations(
  scores: AssessmentResult['scores'],
  causes: RootCause[],
  profile?: { strategyRules?: number; entryConfirmations?: number }
): Recommendation[] {
  const recs: Recommendation[] = [];

  // ── Daily Task ────────────────────────────────────────────────────────────
  if (scores.analysisParalysis > 50) {
    const maxConf = profile?.entryConfirmations
      ? Math.max(2, Math.min(profile.entryConfirmations - 1, 3))
      : 2;
    recs.push({
      type: 'Task',
      description: `Reduce your required confirmations to exactly ${maxConf} for the next 5 trades. Set a 90-second timer from setup formation — if criteria are met when the timer ends, execute without further analysis.`,
    });
  } else if (scores.fomo > 50) {
    recs.push({
      type: 'Task',
      description:
        'Use only limit orders for all entries this week. Pre-plan your exact entry price before the market reaches that level. No market orders, no chasing. Walk away from the screen for 15 minutes after every completed trade.',
    });
  } else if (scores.discipline > 70) {
    recs.push({
      type: 'Task',
      description:
        'Continue your current process adherence. This week, begin tracking your process score on a 1–5 scale per trade. Target 80%+ adherence before considering any increase in position size.',
    });
  } else {
    recs.push({
      type: 'Task',
      description:
        'Grade every trade this week on rule execution, not PnL. A trade that followed all rules and lost is a quality trade. A trade that broke rules and won is a dangerous trade. Build your process score first.',
    });
  }

  // ── Weekly Challenge ──────────────────────────────────────────────────────
  if (scores.analysisParalysis > 50) {
    recs.push({
      type: 'Challenge',
      description:
        'For the next 7 days, limit yourself to a maximum of 3 indicators on your chart. Remove all others. Journal what you notice about your execution speed and trade quality.',
    });
  } else if (scores.fomo > 50) {
    recs.push({
      type: 'Challenge',
      description:
        'This week, for every setup you miss, write it down instead of chasing it. At the end of the week, review: how many of those missed setups would have been profitable had you entered? Use this as data, not regret.',
    });
  } else {
    recs.push({
      type: 'Challenge',
      description:
        'Select one rule from your strategy and track every instance of adherence and violation this week. Count them. Aim for zero violations. Consistency in one rule compounds into full-system discipline over time.',
    });
  }

  // ── Improvement Objective (from root causes) ──────────────────────────────
  const primaryCause = causes[0]?.cause ?? '';

  if (primaryCause.includes('Emotional Instability') || primaryCause.includes('Fear of Loss')) {
    recs.push({
      type: 'Objective',
      description:
        'Over the next 30 days, practice pre-accepting your trade risk before every entry. Use the Risk Acceptance ritual: state your max loss in dollars before clicking. Track how many trades you completed without premature exits.',
    });
  } else if (primaryCause.includes('Lack of Process Trust') || primaryCause.includes('Fear of Being Wrong')) {
    recs.push({
      type: 'Objective',
      description:
        'Build your evidence base over the next 30 days by documenting your 3-criteria checklist for every trade. At month end, calculate what percentage of your setups met all 3 criteria. This becomes your baseline confidence anchor.',
    });
  } else if (primaryCause.includes('FOMO') || primaryCause.includes('Impulsivity')) {
    recs.push({
      type: 'Objective',
      description:
        'Establish a strict pre-trade checklist this week: (1) Setup formed at pre-defined level, (2) Risk is pre-set at stop, (3) Reward is at least 2R. Only proceed if all 3 are confirmed in writing before entry.',
    });
  } else {
    recs.push({
      type: 'Objective',
      description:
        'Maintain process adherence as your primary metric for the next 30 days. Track each trade as a process score (1–5). When your rolling 20-trade average reaches 4.0, you have earned the right to scale position size by 25%.',
    });
  }

  // ── Additional task from primary root cause ────────────────────────────────
  const knowledgeConcept = KNOWLEDGE_BASE.find(
    (k) => primaryCause.includes(k.trigger.split(' ')[0])
  );
  if (knowledgeConcept && recs.length < 5) {
    recs.push({
      type: 'Task',
      description: `${knowledgeConcept.lesson}: ${knowledgeConcept.exercise}`,
    });
  }

  return recs;
}

// ─── Educational Concept Mapping ─────────────────────────────────────────────
export function mapEducationalConcepts(
  scores: AssessmentResult['scores'],
  causes: RootCause[]
): KnowledgeConcept[] {
  const selected: KnowledgeConcept[] = [];
  const addedTriggers = new Set<string>();

  const addConcept = (trigger: string) => {
    const concept = KNOWLEDGE_BASE.find(
      (k) => k.trigger.toLowerCase() === trigger.toLowerCase()
    );
    if (concept && !addedTriggers.has(concept.trigger)) {
      selected.push(concept);
      addedTriggers.add(concept.trigger);
    }
  };

  // Map causes → concepts
  for (const cause of causes) {
    if (cause.cause.includes('Fear of Loss')) addConcept('Fear of Loss');
    if (cause.cause.includes('Fear of Being Wrong')) addConcept('Fear of Being Wrong');
    if (cause.cause.includes('Overthinking') || cause.cause.includes('Paralysis')) addConcept('Overthinking');
    if (cause.cause.includes('FOMO') || cause.cause.includes('Impulsivity')) addConcept('FOMO');
    if (cause.cause.includes('Emotional')) addConcept('Revenge Trading');
    if (cause.cause.includes('Confidence') || cause.cause.includes('Trust')) addConcept('Confidence Issues');
  }

  // Score-based additions
  if (scores.analysisParalysis > 50 && !addedTriggers.has('Overthinking')) addConcept('Overthinking');
  if (scores.fomo > 50 && !addedTriggers.has('FOMO')) addConcept('FOMO');
  if (scores.confidence < 50 && !addedTriggers.has('Confidence Issues')) addConcept('Confidence Issues');

  // Always include at least 2 concepts
  if (selected.length === 0) {
    addConcept('Confidence Issues');
    addConcept('Overthinking');
  } else if (selected.length === 1) {
    const next = KNOWLEDGE_BASE.find((k) => !addedTriggers.has(k.trigger));
    if (next) { selected.push(next); addedTriggers.add(next.trigger); }
  }

  return selected.slice(0, 3);
}

// ─── Main Assessment Processor ───────────────────────────────────────────────
export function processAssessment(
  answers: AssessmentAnswers,
  profile?: { strategyRules?: number; entryConfirmations?: number }
): AssessmentResult {
  const scores = calculateScores(answers);
  const archetype = detectArchetype(scores);
  const rootCauses = identifyRootCauses(answers);
  const recommendations = generateRecommendations(scores, rootCauses, profile);
  const educationalConcepts = mapEducationalConcepts(scores, rootCauses);

  return {
    date: new Date().toISOString(),
    scores,
    archetype,
    rootCauses,
    recommendations,
    educationalConcepts,
  };
}
