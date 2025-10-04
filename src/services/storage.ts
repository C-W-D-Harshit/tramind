import type { UserStats, DailyActivity } from '../types/user.types';
import type { DrillStats, DrillId } from '../types/drill.types';
import { DRILL_CONFIGS } from '../utils/constants';

const STORAGE_KEYS = {
  USER_STATS: 'tramind_user_stats',
  DAILY_ACTIVITY: 'tramind_daily_activity',
  SESSIONS_HISTORY: 'tramind_sessions_history',
};

// Initialize default user stats
const getDefaultUserStats = (): UserStats => ({
  totalPoints: 0,
  level: 1,
  currentXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActive: new Date(),
  drillStats: DRILL_CONFIGS.map(drill => ({
    drillId: drill.id,
    sessionsCompleted: 0,
    bestScore: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    difficulty: 1,
    lastPlayed: new Date(),
    recentScores: [],
    level: 1,
  })),
  achievements: [],
  freezeDaysAvailable: 0,
  sessionsToday: 0,
  dailyGoalCompleted: false,
});

// Local storage helpers
export const storage = {
  // Get user stats
  getUserStats: (): UserStats => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_STATS);
    if (!stored) {
      const defaultStats = getDefaultUserStats();
      storage.saveUserStats(defaultStats);
      return defaultStats;
    }

    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    parsed.lastActive = new Date(parsed.lastActive);
    parsed.drillStats.forEach((drill: DrillStats) => {
      drill.lastPlayed = new Date(drill.lastPlayed);
    });

    // Check if any drills are missing and add them
    const existingDrillIds = new Set(parsed.drillStats.map((d: DrillStats) => d.drillId));
    DRILL_CONFIGS.forEach(config => {
      if (!existingDrillIds.has(config.id)) {
        parsed.drillStats.push({
          drillId: config.id,
          sessionsCompleted: 0,
          bestScore: 0,
          averageScore: 0,
          totalTimeSpent: 0,
          difficulty: 1,
          lastPlayed: new Date(),
          recentScores: [],
          level: 1,
        });
      }
    });

    return parsed;
  },

  // Save user stats
  saveUserStats: (stats: UserStats): void => {
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  },

  // Get drill stats
  getDrillStats: (drillId: DrillId): DrillStats | undefined => {
    const userStats = storage.getUserStats();
    return userStats.drillStats.find(d => d.drillId === drillId);
  },

  // Update drill stats
  updateDrillStats: (drillId: DrillId, updates: Partial<DrillStats>): void => {
    const userStats = storage.getUserStats();
    const drillIndex = userStats.drillStats.findIndex(d => d.drillId === drillId);

    if (drillIndex !== -1) {
      userStats.drillStats[drillIndex] = {
        ...userStats.drillStats[drillIndex],
        ...updates,
      };
      storage.saveUserStats(userStats);
    }
  },

  // Get daily activity
  getDailyActivity: (): DailyActivity[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.DAILY_ACTIVITY);
    return stored ? JSON.parse(stored) : [];
  },

  // Save daily activity
  saveDailyActivity: (activity: DailyActivity[]): void => {
    localStorage.setItem(STORAGE_KEYS.DAILY_ACTIVITY, JSON.stringify(activity));
  },

  // Add today's activity
  recordActivity: (drillId: DrillId, pointsEarned: number): void => {
    const today = new Date().toISOString().split('T')[0];
    const activities = storage.getDailyActivity();
    const todayActivity = activities.find(a => a.date === today);

    if (todayActivity) {
      todayActivity.sessionsCompleted++;
      todayActivity.pointsEarned += pointsEarned;
      if (!todayActivity.drillsCompleted.includes(drillId)) {
        todayActivity.drillsCompleted.push(drillId);
      }
    } else {
      activities.push({
        date: today,
        sessionsCompleted: 1,
        pointsEarned,
        drillsCompleted: [drillId],
      });
    }

    // Keep only last 90 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);
    const filtered = activities.filter(a => new Date(a.date) >= cutoffDate);

    storage.saveDailyActivity(filtered);
  },

  // Clear all data
  clearAllData: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_STATS);
    localStorage.removeItem(STORAGE_KEYS.DAILY_ACTIVITY);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS_HISTORY);
  },
};
