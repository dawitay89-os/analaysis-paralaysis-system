import { AssessmentAnswers, AssessmentResult, Archetype, RootCause, Recommendation } from '../types';

export function calculateScores(answers: AssessmentAnswers): AssessmentResult['scores'] {
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);

  // Analysis Paralysis (0-100%)
  // High if AP, Confirmation, Fear, Friction are high
  const apBase = avg(answers.analysisParalysis);
  const confBase = avg(answers.confirmationAddiction);
  const fearBase = avg(answers.fearAnalysis);
  const frictionBase = avg(answers.executionFriction);
  
  const apScore = ((apBase * 1.5 + confBase * 1.0 + fearBase * 1.2 + frictionBase * 1.0) / 4.7) * 10;

  // FOMO Score
  // High if FOMO answers are high
  const fomoBase = avg(answers.fomo);
  const fomoScore = fomoBase * 10;

  // Confidence Score
  const confidenceBase = avg(answers.confidence);
  const confidenceScore = confidenceBase * 10;

  // Discipline Score
  // 100 - (Paralysis + FOMO) / 2 roughly, but the formula requested was 100 - (Paralysis + FOMO)
  // Let's use 100 - (apScore + fomoScore) / 2 to keep it bounded 0-100 logically, or apply the exact text "100 - (Paralysis + FOMO)" bounded to 0.
  let disciplineScore = 100 - ((apScore + fomoScore) / 2); // adjusted to avoid negative values constantly
  if (disciplineScore < 0) disciplineScore = 0;
  if (disciplineScore > 100) disciplineScore = 100;

  return {
    analysisParalysis: Math.round(apScore),
    fomo: Math.round(fomoScore),
    confidence: Math.round(confidenceScore),
    discipline: Math.round(disciplineScore),
  };
}

export function detectArchetype(scores: AssessmentResult['scores']): Archetype {
  if (scores.analysisParalysis > 70 && scores.fomo < 40) return 'Frozen Analyst';
  if (scores.analysisParalysis > 60 && scores.confidence < 50) return 'Perfectionist Trader';
  if (scores.fomo > 70) return 'Reactive Chaser';
  if (scores.confidence < 40 && scores.fomo < 50) return 'Fear-Based Trader';
  if (scores.discipline > 60 && scores.discipline < 85) return 'Developing Professional';
  if (scores.discipline >= 85) return 'Disciplined Operator';
  return 'Developing Professional';
}

export function identifyRootCauses(answers: AssessmentAnswers): RootCause[] {
  const causes: { cause: string; score: number }[] = [];
  
  causes.push({ cause: 'Fear of Loss', score: answers.fearAnalysis[0] || 0 });
  causes.push({ cause: 'Fear of Being Wrong', score: answers.fearAnalysis[1] || 0 });
  causes.push({ cause: 'Confirmation Addiction', score: answers.confirmationAddiction.reduce((a,b)=>a+b,0)/5 });
  causes.push({ cause: 'Overthinking / Paralysis', score: answers.analysisParalysis.reduce((a,b)=>a+b,0)/7 });
  causes.push({ cause: 'Impulsivity / FOMO', score: answers.fomo.reduce((a,b)=>a+b,0)/6 });
  causes.push({ cause: 'Lack of Strategy Trust', score: 10 - (answers.confidence[0] || 10) });

  causes.sort((a, b) => b.score - a.score);

  return [
    { cause: causes[0].cause, severity: 'High', type: 'Primary' },
    { cause: causes[1].cause, severity: causes[1].score > 6 ? 'High' : 'Medium', type: 'Secondary' },
    { cause: causes[2].cause, severity: causes[2].score > 5 ? 'Medium' : 'Low', type: 'Supporting' },
  ];
}

export function generateRecommendations(scores: AssessmentResult['scores'], causes: RootCause[]): Recommendation[] {
  const recs: Recommendation[] = [];

  if (scores.analysisParalysis > 50) {
    recs.push({ type: 'Task', description: 'Reduce number of required confirmations to exactly 2 for the next 5 trades.' });
    recs.push({ type: 'Challenge', description: 'Enter the next trade within exactly 60 seconds of your setup forming.' });
  } else if (scores.fomo > 50) {
    recs.push({ type: 'Task', description: 'Use only limit orders for entries this week. No market orders.' });
    recs.push({ type: 'Challenge', description: 'Walk away from the screen for 15 minutes after a closed trade.' });
  } else if (scores.discipline > 70) {
    recs.push({ type: 'Objective', description: 'Maintain current process adherence and slowly scale position sizing.' });
  } else {
    recs.push({ type: 'Objective', description: 'Focus on grading your trades based on rule execution, not PnL.' });
  }

  // Address primary root cause
  if (causes[0].cause === 'Fear of Loss') {
    recs.push({ type: 'Task', description: 'Accept the risk mathematically before clicking buy/sell. Speak your risk out loud.' });
  } else if (causes[0].cause === 'Fear of Being Wrong') {
    recs.push({ type: 'Objective', description: 'Adopt probability thinking: One trade is just 1 data point out of 100.' });
  }

  return recs;
}

export function processAssessment(answers: AssessmentAnswers): AssessmentResult {
  const scores = calculateScores(answers);
  const archetype = detectArchetype(scores);
  const rootCauses = identifyRootCauses(answers);
  const recommendations = generateRecommendations(scores, rootCauses);

  return {
    date: new Date().toISOString(),
    scores,
    archetype,
    rootCauses,
    recommendations,
  };
}
