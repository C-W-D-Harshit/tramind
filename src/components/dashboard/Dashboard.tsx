import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import { DrillCard } from './DrillCard';
import { StatCard } from '../common/StatCard';
import { StreakIcon } from '../common/StreakIcon';
import { Progress } from '../ui/progress';
import { ModeToggle } from '../mode-toggle';
import { DRILL_CONFIGS, MOTIVATIONAL_QUOTES } from '../../utils/constants';
import { getXPRequiredForNextLevel, formatNumber } from '../../utils/calculations';

export const Dashboard = () => {
  const { userStats } = useGame();
  const navigate = useNavigate();

  // Get random quote (same each day)
  const dailyQuote = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        1000 /
        60 /
        60 /
        24
    );
    return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
  }, []);

  const xpRequired = getXPRequiredForNextLevel(userStats.level);
  const xpProgress = (userStats.currentXP / xpRequired) * 100;

  // Count today's sessions per drill (simplified - using sessionsCompleted)
  const getSessionsToday = (drillId: string) => {
    const drill = userStats.drillStats.find(d => d.drillId === drillId);
    // In a real app, we'd track daily sessions separately
    return drill ? Math.min(drill.sessionsCompleted % 3, 3) : 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-16">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
              <img src="/logo.svg" alt="TRAMIND" className="size-11 object-contain" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              TRAMIND
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-card border">
              <StreakIcon streak={userStats.currentStreak} />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Streak</span>
                <span className="text-base font-semibold tabular-nums">{userStats.currentStreak} Day{userStats.currentStreak !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="px-4 py-2.5 rounded-lg bg-card border">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-muted-foreground">Level</span>
                <span className="text-xl font-semibold tabular-nums">{userStats.level}</span>
              </div>
            </div>
            <ModeToggle />
          </div>
        </header>

        {/* Quote Section */}
        <section className="text-center">
          <div className="max-w-xl mx-auto">
            <p className="text-lg text-muted-foreground/80 leading-relaxed">
              "{dailyQuote}"
            </p>
          </div>
        </section>

        {/* XP Progress */}
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold">Level {userStats.level + 1}</h2>
            <span className="text-sm text-muted-foreground">
              {formatNumber(userStats.currentXP)} / {formatNumber(xpRequired)} XP
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-200"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </section>

        {/* Drills Grid */}
        <section className="space-y-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold">Today's Training</h2>
            <span className="text-sm text-muted-foreground">
              {DRILL_CONFIGS.reduce((acc, drill) => acc + drill.dailyRecommended, 0)} sessions
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DRILL_CONFIGS.map(drill => (
              <DrillCard
                key={drill.id}
                drill={drill}
                sessionsCompleted={getSessionsToday(drill.id)}
                dailyRecommended={drill.dailyRecommended}
              />
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/progress')}
              className="group p-6 rounded-lg bg-card border hover:border-primary/30 transition-colors duration-150 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Sessions Today</div>
                  <div className="text-2xl font-semibold">{userStats.sessionsToday || 0}</div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
                  <svg className="h-5 w-5 text-chart-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </button>
            <button
              onClick={() => navigate('/progress')}
              className="group p-6 rounded-lg bg-card border hover:border-primary/30 transition-colors duration-150 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total XP</div>
                  <div className="text-2xl font-semibold">{formatNumber(userStats.totalPoints)}</div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                  <svg className="h-5 w-5 text-chart-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </button>
            <button
              onClick={() => navigate('/progress')}
              className="group p-6 rounded-lg bg-card border hover:border-primary/30 transition-colors duration-150 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Best Streak</div>
                  <div className="text-2xl font-semibold">{userStats.longestStreak} days</div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
