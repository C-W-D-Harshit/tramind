import type {
  ReflexMetrics,
  AwarenessMetrics,
  ImpulseMetrics,
  FocusMetrics,
} from '../types/drill.types';
import { mean, standardDeviation, calculateStars } from '../utils/calculations';

// Reflex Drill Scoring
export const calculateReflexScore = (metrics: ReflexMetrics): number => {
  const { reactionTimes, falseStarts } = metrics;

  if (reactionTimes.length === 0) return 0;

  const avgTime = mean(reactionTimes);
  const consistency = 1 - standardDeviation(reactionTimes) / avgTime;

  // Base score (lower time = higher score)
  let score = Math.max(0, 1000 - avgTime);

  // Consistency bonus (up to 30%)
  score *= 1 + consistency * 0.3;

  // Penalty for false starts
  score -= falseStarts * 50;

  return Math.max(0, Math.floor(score));
};

// Awareness Drill Scoring
export const calculateAwarenessScore = (metrics: AwarenessMetrics): number => {
  const { targetsHit, wrongClicks, totalTargets } = metrics;

  if (totalTargets === 0) return 0;

  const hitRate = targetsHit / totalTargets;
  const precision = targetsHit / (targetsHit + wrongClicks);

  let score = targetsHit * 20 - wrongClicks * 10;

  // Bonus for perfect accuracy
  if (hitRate === 1.0 && precision === 1.0) {
    score *= 1.5;
  }

  return Math.max(0, Math.floor(score));
};

// Impulse Control Drill Scoring
export const calculateImpulseScore = (metrics: ImpulseMetrics): number => {
  const {
    totalRounds,
    roundsResisted,
    clickedEarly,
    perfectResists,
  } = metrics;

  let totalScore = 0;

  // Points for resisted rounds
  totalScore += roundsResisted * 100;

  // Bonus for perfect resistance
  totalScore += perfectResists * 50;

  // Penalty for early clicks
  totalScore -= clickedEarly * 50;

  // Perfect session bonus
  if (roundsResisted === totalRounds && totalRounds > 0) {
    totalScore *= 1.5;
  }

  return Math.max(0, Math.floor(totalScore));
};

// Focus Drill Scoring
export const calculateFocusScore = (metrics: FocusMetrics): number => {
  const { focusTime, totalTime, breaks, longestStreak } = metrics;

  if (totalTime === 0) return 0;

  const focusPercent = focusTime / totalTime;

  // Base score from focus percentage
  let score = focusPercent * 1000;

  // Penalty for breaks
  score -= breaks * 20;

  // Bonus for long streaks
  if (longestStreak >= 30) score += 100;
  if (longestStreak >= 60) score += 200;

  // Consistency bonus (fewer breaks = better)
  const avgStreakLength = focusTime / (breaks + 1);
  score += avgStreakLength * 5;

  return Math.max(0, Math.floor(score));
};

// Get max possible score for star calculation
export const getMaxScore = (drillId: string, difficulty: number): number => {
  switch (drillId) {
    case 'reflex':
    case 'keyboard-reflex':
      return 1300 * difficulty;
    case 'awareness':
      return 600 * difficulty;
    case 'impulse':
      return 750 * difficulty;
    case 'focus':
      return 1500 * difficulty;
    default:
      return 1000;
  }
};

// Calculate stars for a drill session
export const calculateDrillStars = (
  score: number,
  drillId: string,
  difficulty: number
): number => {
  const maxScore = getMaxScore(drillId, difficulty);
  return calculateStars(score, maxScore);
};
