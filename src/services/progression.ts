import type { UserStats } from '../types/user.types';
import type { DrillStats, DrillId } from '../types/drill.types';
import {
  getLevelFromXP,
  getXPForCurrentLevel,
  getXPRequiredForNextLevel,
  calculateXPReward,
  getDaysBetween,
} from '../utils/calculations';

// Update user XP and level
export const addXP = (userStats: UserStats, xp: number): UserStats => {
  const newTotalXP = userStats.totalPoints + xp;
  const newLevel = getLevelFromXP(newTotalXP);
  const currentLevelXP = getXPForCurrentLevel(newTotalXP, newLevel);

  return {
    ...userStats,
    totalPoints: newTotalXP,
    currentXP: currentLevelXP,
    level: newLevel,
  };
};

// Update streak
export const updateStreak = (userStats: UserStats): UserStats => {
  const today = new Date();
  const lastActive = new Date(userStats.lastActive);
  const daysSinceActive = getDaysBetween(today, lastActive);

  let newStreak = userStats.currentStreak;
  let freezeDays = userStats.freezeDaysAvailable;

  if (daysSinceActive === 0) {
    // Same day, no change
    return userStats;
  } else if (daysSinceActive === 1) {
    // Consecutive day
    newStreak += 1;

    // Award freeze day every 7 days
    if (newStreak % 7 === 0) {
      freezeDays += 1;
    }
  } else if (daysSinceActive > 1) {
    // Missed days
    if (freezeDays > 0) {
      // Use freeze day
      freezeDays -= 1;
    } else {
      // Lost streak
      newStreak = 1; // Start new streak
    }
  }

  return {
    ...userStats,
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, userStats.longestStreak),
    freezeDaysAvailable: freezeDays,
    lastActive: today,
  };
};

// Calculate drill difficulty based on level
export const getDrillDifficulty = (drillLevel: number): number => {
  return Math.min(10, Math.ceil(drillLevel / 2));
};

// Check if drill level up
export const shouldLevelUpDrill = (drillStats: DrillStats): boolean => {
  // Level up every 5 sessions with improving scores
  if (drillStats.sessionsCompleted < drillStats.level * 5) {
    return false;
  }

  // Check if recent scores are improving
  const recentScores = drillStats.recentScores.slice(-5);
  if (recentScores.length < 5) return false;

  const recentAvg =
    recentScores.reduce((sum, s) => sum + s, 0) / recentScores.length;

  return recentAvg >= drillStats.averageScore;
};

// Level up drill
export const levelUpDrill = (drillStats: DrillStats): DrillStats => {
  return {
    ...drillStats,
    level: drillStats.level + 1,
    difficulty: getDrillDifficulty(drillStats.level + 1),
  };
};

// Check daily goal completion
export const checkDailyGoal = (userStats: UserStats): boolean => {
  // Goal: Complete at least 2 sessions in 3 different drills
  const drillsWithSessions = userStats.drillStats.filter(drill => {
    // Check sessions today (simplified - in real app, check today's date)
    return drill.sessionsCompleted > 0;
  });

  return drillsWithSessions.length >= 3 &&
    drillsWithSessions.every(d => d.sessionsCompleted >= 2);
};

// Calculate total session XP with bonuses
export const calculateSessionXP = (
  baseScore: number,
  stars: number,
  difficulty: number,
  currentStreak: number
): number => {
  let xp = calculateXPReward(baseScore, stars, difficulty);

  // Streak bonus
  const streakBonus = Math.min(500, currentStreak * 50);
  xp += streakBonus;

  return xp;
};
