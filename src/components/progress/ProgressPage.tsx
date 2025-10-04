import { useNavigate } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { StatCard } from '../common/StatCard';
import { StreakIcon } from '../common/StreakIcon';
import { formatNumber } from '../../utils/calculations';

export const ProgressPage = () => {
  const navigate = useNavigate();
  const { userStats } = useGame();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Progress & Stats</h1>
          <Button onClick={() => navigate('/')} variant="outline">Back</Button>
        </header>

        {/* Overview Cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<StreakIcon streak={userStats.currentStreak} />}
            label="Current Streak"
            value={`${userStats.currentStreak} Days`}
            subtext={`Longest: ${userStats.longestStreak} days`}
            color="chart-1"
          />
          <StatCard
            icon="💪"
            label="Level"
            value={userStats.level}
            subtext={`${formatNumber(userStats.totalPoints)} Total XP`}
            color="primary"
          />
          <StatCard
            icon="🎯"
            label="Total Sessions"
            value={userStats.drillStats.reduce((sum, d) => sum + d.sessionsCompleted, 0)}
            subtext="All drills combined"
            color="chart-3"
          />
          </div>
        </section>

        {/* Drill Breakdown */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Drill Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userStats.drillStats.map(drill => (
              <Card key={drill.drillId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="uppercase text-lg">{drill.drillId}</CardTitle>
                    <Badge variant="secondary">Level {drill.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sessions</span>
                    <span className="text-lg font-semibold">{drill.sessionsCompleted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Best Score</span>
                    <span className="text-lg font-semibold">{drill.bestScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Score</span>
                    <span className="text-lg font-semibold">{Math.round(drill.averageScore)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Achievements Placeholder */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Achievements</h2>
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Achievement system coming soon! Keep training to unlock badges and rewards.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};
