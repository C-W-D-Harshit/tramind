import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserStats } from '../types/user.types';
import type { Session } from '../types/drill.types';
import { storage } from '../services/storage';
import { addXP, updateStreak, levelUpDrill, shouldLevelUpDrill } from '../services/progression';

interface GameContextType {
  userStats: UserStats;
  updateUserStats: (updates: Partial<UserStats>) => void;
  completeSession: (session: Session) => void;
  refreshStats: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [userStats, setUserStats] = useState<UserStats>(() => storage.getUserStats());

  // Sync to localStorage whenever stats change
  useEffect(() => {
    storage.saveUserStats(userStats);
  }, [userStats]);

  const updateUserStats = (updates: Partial<UserStats>) => {
    setUserStats(prev => ({ ...prev, ...updates }));
  };

  const completeSession = (session: Session) => {
    setUserStats(prev => {
      // Update streak
      let updated = updateStreak(prev);

      // Add XP
      updated = addXP(updated, session.pointsEarned);

      // Update drill stats
      const drillIndex = updated.drillStats.findIndex(
        d => d.drillId === session.drillId
      );

      if (drillIndex !== -1) {
        const drill = updated.drillStats[drillIndex];

        // Update drill statistics
        const newRecentScores = [...drill.recentScores, session.score].slice(-10);
        const allScores = [...drill.recentScores, session.score];
        const newAverage = allScores.reduce((sum, s) => sum + s, 0) / allScores.length;

        let updatedDrill = {
          ...drill,
          sessionsCompleted: drill.sessionsCompleted + 1,
          bestScore: Math.max(drill.bestScore, session.score),
          averageScore: newAverage,
          totalTimeSpent:
            drill.totalTimeSpent +
            (session.endTime.getTime() - session.startTime.getTime()) / 1000,
          lastPlayed: session.endTime,
          recentScores: newRecentScores,
        };

        // Check for level up
        if (shouldLevelUpDrill(updatedDrill)) {
          updatedDrill = levelUpDrill(updatedDrill);
        }

        updated.drillStats[drillIndex] = updatedDrill;
      }

      // Record daily activity
      storage.recordActivity(session.drillId, session.pointsEarned);

      // Increment today's sessions
      updated.sessionsToday = (updated.sessionsToday || 0) + 1;

      return updated;
    });
  };

  const refreshStats = () => {
    setUserStats(storage.getUserStats());
  };

  return (
    <GameContext.Provider
      value={{
        userStats,
        updateUserStats,
        completeSession,
        refreshStats,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
