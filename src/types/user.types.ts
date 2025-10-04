import type { DrillStats } from './drill.types';
import type { ReactElement } from 'react';

export interface UserStats {
  totalPoints: number;
  level: number;
  currentXP: number;
  currentStreak: number;
  longestStreak: number;
  lastActive: Date;
  drillStats: DrillStats[];
  achievements: string[]; // Array of achievement IDs
  freezeDaysAvailable: number;
  sessionsToday: number;
  dailyGoalCompleted: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: (() => ReactElement) | string;
  requirement: AchievementRequirement;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number; // 0-1 for partial progress
}

export interface AchievementRequirement {
  type: 'sessions' | 'streak' | 'reflex_avg' | 'urge_perfect' | 'awareness_accuracy' | 'focus_perfect' | 'level' | 'total_xp';
  value: number;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  sessionsCompleted: number;
  pointsEarned: number;
  drillsCompleted: string[]; // drill IDs
}
