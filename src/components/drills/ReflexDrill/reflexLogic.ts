import type { ReflexMetrics } from '../../../types/drill.types';

export interface ReflexRound {
  delay: number;
  reactionTime?: number;
  clicked: boolean;
  falseStart: boolean;
}

export const generateDelay = (difficulty: number): number => {
  // Higher difficulty = more varied, shorter delays
  const minDelay = Math.max(500, 1000 - difficulty * 100);
  const maxDelay = Math.max(minDelay + 1000, 4000 - difficulty * 200);
  return Math.random() * (maxDelay - minDelay) + minDelay;
};

export const getTargetSize = (difficulty: number): number => {
  // Size decreases with difficulty
  return Math.max(30, 80 - difficulty * 5);
};

export const getTargetPosition = (
  containerWidth: number,
  containerHeight: number,
  targetSize: number
): { x: number; y: number } => {
  // 10% margin from edges
  const margin = Math.min(containerWidth, containerHeight) * 0.1;
  const maxX = containerWidth - targetSize - margin;
  const maxY = containerHeight - targetSize - margin;

  return {
    x: margin + Math.random() * (maxX - margin),
    y: margin + Math.random() * (maxY - margin),
  };
};

export const calculateReflexMetrics = (rounds: ReflexRound[]): ReflexMetrics => {
  const validRounds = rounds.filter(r => r.clicked && !r.falseStart && r.reactionTime);
  const reactionTimes = validRounds
    .map(r => r.reactionTime!)
    .filter(t => t !== undefined);

  const averageTime =
    reactionTimes.length > 0
      ? reactionTimes.reduce((sum, t) => sum + t, 0) / reactionTimes.length
      : 0;

  const bestTime = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0;

  const falseStarts = rounds.filter(r => r.falseStart).length;

  // Calculate consistency (inverse of coefficient of variation)
  const stdDev = reactionTimes.length > 1
    ? Math.sqrt(
        reactionTimes
          .map(t => Math.pow(t - averageTime, 2))
          .reduce((sum, v) => sum + v, 0) / reactionTimes.length
      )
    : 0;
  const consistency = averageTime > 0 ? 1 - stdDev / averageTime : 0;

  return {
    reactionTimes,
    averageTime,
    bestTime,
    consistency,
    falseStarts,
  };
};

export const getTotalRounds = (difficulty: number): number => {
  return Math.min(20, 10 + difficulty);
};
