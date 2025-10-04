import { XP_PER_LEVEL } from './constants';

// Statistical calculations
export const mean = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
};

export const standardDeviation = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  const avg = mean(numbers);
  const squareDiffs = numbers.map(n => Math.pow(n - avg, 2));
  return Math.sqrt(mean(squareDiffs));
};

// Star rating calculation
export const calculateStars = (score: number, maxScore: number): number => {
  const percentage = score / maxScore;
  if (percentage >= 0.95) return 5;
  if (percentage >= 0.85) return 4;
  if (percentage >= 0.70) return 3;
  if (percentage >= 0.50) return 2;
  return 1;
};

// XP calculation
export const calculateXPReward = (
  score: number,
  stars: number,
  difficulty: number
): number => {
  const baseXP = Math.floor(score / 10);
  const starBonus = stars * 20;
  const difficultyMultiplier = 1 + difficulty * 0.1;

  return Math.floor((baseXP + starBonus) * difficultyMultiplier);
};

// Level progression
export const getLevelFromXP = (xp: number): number => {
  let level = 1;
  let totalXP = 0;

  while (totalXP + XP_PER_LEVEL(level) <= xp) {
    totalXP += XP_PER_LEVEL(level);
    level++;
  }

  return level;
};

export const getXPForCurrentLevel = (xp: number, level: number): number => {
  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    totalXP += XP_PER_LEVEL(i);
  }
  return xp - totalXP;
};

export const getXPRequiredForNextLevel = (level: number): number => {
  return XP_PER_LEVEL(level);
};

// Streak configuration for icon sizing and colors
export const getStreakConfig = (streak: number) => {
  if (streak >= 30) return { size: 32, className: "text-primary" };
  if (streak >= 14) return { size: 28, className: "text-chart-1" };
  if (streak >= 7) return { size: 24, className: "text-chart-2" };
  return { size: 20, className: "text-muted-foreground" };
};

// Date utilities
export const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const getDaysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
};

// Format duration
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};
