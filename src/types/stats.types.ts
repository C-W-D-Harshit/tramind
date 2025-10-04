export interface PerformanceData {
  date: string;
  score: number;
  drillId: string;
}

export interface GraphData {
  label: string;
  value: number;
}

export interface CalendarDay {
  date: string;
  sessionsCompleted: number;
  intensity: number; // 0-4 for color intensity
}

export interface DrillBreakdown {
  drillId: string;
  name: string;
  icon: string;
  currentLevel: number;
  nextLevel: number;
  progressToNext: number; // 0-1
  totalSessions: number;
  averageScore: number;
  bestScore: number;
  improvement: number; // percentage
  recentTrend: 'up' | 'down' | 'stable';
}
