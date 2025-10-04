export type DrillId = 'reflex' | 'keyboard-reflex' | 'awareness' | 'impulse' | 'focus';

export interface DrillStats {
  drillId: DrillId;
  sessionsCompleted: number;
  bestScore: number;
  averageScore: number;
  totalTimeSpent: number; // in seconds
  difficulty: number; // 1-10
  lastPlayed: Date;
  recentScores: number[]; // Last 10 sessions
  level: number; // Per-drill level (1-10+)
}

export interface Session {
  drillId: DrillId;
  startTime: Date;
  endTime: Date;
  score: number;
  stars: number; // 1-5
  pointsEarned: number;
  metricsCollected: Record<string, any>;
}

// Drill-specific metrics
export interface ReflexMetrics {
  reactionTimes: number[];
  averageTime: number;
  bestTime: number;
  consistency: number;
  falseStarts: number;
}

export interface AwarenessMetrics {
  targetsHit: number;
  targetsMissed: number;
  wrongClicks: number;
  totalTargets: number;
  hitRate: number;
  accuracy: number;
  averageReactionTime: number;
}

export interface ImpulseMetrics {
  totalRounds: number;
  roundsResisted: number;
  clickedEarly: number;
  clickedDuringResist: number;
  perfectResists: number;
  averageResistTime: number;
}

export interface FocusMetrics {
  focusTime: number;
  totalTime: number;
  focusPercentage: number;
  breaks: number;
  longestStreak: number;
  averageStreakLength: number;
}
