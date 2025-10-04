import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useGame } from '../../../context/GameContext';
import type { AwarenessMetrics } from '../../../types/drill.types';
import { calculateAwarenessScore, calculateDrillStars } from '../../../services/scoring';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';

type GameState = 'intro' | 'countdown' | 'waiting' | 'active' | 'feedback' | 'results';

interface Target {
  id: number;
  x: number;
  y: number;
  isTarget: boolean;
}

interface Round {
  targetClicked: boolean;
  wrongClick: boolean;
  missed: boolean;
  reactionTime: number;
}

export const AwarenessDrill = () => {
  const navigate = useNavigate();
  const { userStats, completeSession } = useGame();
  const drillStats = userStats.drillStats.find((d) => d.drillId === 'awareness');
  const difficulty = drillStats?.difficulty || 1;

  const totalRounds = 10 + difficulty * 2;
  const numDistractors = Math.min(2 + difficulty, 8); // 3-9 distractors
  const displayTime = Math.max(1500 - difficulty * 100, 800); // 1500ms down to 800ms

  const [gameState, setGameState] = useState<GameState>('intro');
  const [countdown, setCountdown] = useState(3);
  const [currentRound, setCurrentRound] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const [rounds, setRounds] = useState<Round[]>(
    Array(totalRounds).fill({ targetClicked: false, wrongClick: false, missed: false, reactionTime: 0 })
  );
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [sessionStartTime] = useState(Date.now());

  const generateTargets = (): Target[] => {
    const newTargets: Target[] = [];
    const centerX = 50;
    const centerY = 50;
    const minDistance = 20; // Minimum distance from center

    // Generate target position
    const angle = Math.random() * 2 * Math.PI;
    const distance = minDistance + Math.random() * (45 - minDistance);
    const targetX = centerX + Math.cos(angle) * distance;
    const targetY = centerY + Math.sin(angle) * distance;

    newTargets.push({
      id: 0,
      x: targetX,
      y: targetY,
      isTarget: true,
    });

    // Generate distractors
    for (let i = 0; i < numDistractors; i++) {
      let x, y;
      let attempts = 0;
      do {
        const distAngle = Math.random() * 2 * Math.PI;
        const distDistance = minDistance + Math.random() * (45 - minDistance);
        x = centerX + Math.cos(distAngle) * distDistance;
        y = centerY + Math.sin(distAngle) * distDistance;
        attempts++;
      } while (
        attempts < 10 &&
        newTargets.some((t) => Math.hypot(t.x - x, t.y - y) < 10)
      );

      newTargets.push({
        id: i + 1,
        x,
        y,
        isTarget: false,
      });
    }

    return newTargets;
  };

  const startGame = () => {
    setGameState('countdown');
    setCountdown(3);
  };

  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'countdown' && countdown === 0) {
      startRound();
    }
  }, [gameState, countdown]);

  const startRound = () => {
    setGameState('waiting');
    const waitTime = 500 + Math.random() * 500;

    setTimeout(() => {
      const newTargets = generateTargets();
      setTargets(newTargets);
      setRoundStartTime(Date.now());
      setGameState('active');

      // Auto-miss after displayTime
      setTimeout(() => {
        if (gameState === 'active') {
          handleMiss();
        }
      }, displayTime);
    }, waitTime);
  };

  const handleTargetClick = (target: Target) => {
    if (gameState !== 'active') return;

    const reactionTime = Date.now() - roundStartTime;

    if (target.isTarget) {
      // Correct target clicked
      setRounds((prev) => {
        const updated = [...prev];
        updated[currentRound] = {
          targetClicked: true,
          wrongClick: false,
          missed: false,
          reactionTime,
        };
        return updated;
      });
    } else {
      // Wrong target clicked
      setRounds((prev) => {
        const updated = [...prev];
        updated[currentRound] = {
          targetClicked: false,
          wrongClick: true,
          missed: false,
          reactionTime,
        };
        return updated;
      });
    }

    setTargets([]);
    setGameState('feedback');

    setTimeout(() => {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      if (nextRound >= totalRounds) {
        showResults();
      } else {
        startRound();
      }
    }, 500);
  };

  const handleMiss = () => {
    setRounds((prev) => {
      const updated = [...prev];
      updated[currentRound] = {
        targetClicked: false,
        wrongClick: false,
        missed: true,
        reactionTime: 0,
      };
      return updated;
    });

    setTargets([]);
    setGameState('feedback');

    setTimeout(() => {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      if (nextRound >= totalRounds) {
        showResults();
      } else {
        startRound();
      }
    }, 500);
  };

  const showResults = () => {
    setGameState('results');

    const targetsHit = rounds.filter((r) => r.targetClicked).length;
    const targetsMissed = rounds.filter((r) => r.missed).length;
    const wrongClicks = rounds.filter((r) => r.wrongClick).length;
    const totalTargets = totalRounds;
    const hitRate = targetsHit / totalTargets;
    const accuracy = targetsHit / (targetsHit + wrongClicks + targetsMissed);
    const reactionTimes = rounds.filter((r) => r.targetClicked).map((r) => r.reactionTime);
    const averageReactionTime = reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 0;

    const metrics: AwarenessMetrics = {
      targetsHit,
      targetsMissed,
      wrongClicks,
      totalTargets,
      hitRate,
      accuracy,
      averageReactionTime,
    };

    const score = calculateAwarenessScore(metrics);
    const stars = calculateDrillStars(score, 'awareness', difficulty);
    const sessionTime = (Date.now() - sessionStartTime) / 1000;

    completeSession({
      drillId: 'awareness',
      startTime: new Date(sessionStartTime),
      endTime: new Date(),
      score,
      stars,
      pointsEarned: score,
      metricsCollected: metrics,
    });
  };

  const metrics = useMemo(() => {
    const targetsHit = rounds.filter((r) => r.targetClicked).length;
    const targetsMissed = rounds.filter((r) => r.missed).length;
    const wrongClicks = rounds.filter((r) => r.wrongClick).length;
    const totalTargets = totalRounds;
    const hitRate = targetsHit / totalTargets;
    const accuracy = targetsHit / (targetsHit + wrongClicks + targetsMissed);
    const reactionTimes = rounds.filter((r) => r.targetClicked).map((r) => r.reactionTime);
    const averageReactionTime = reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 0;

    return {
      targetsHit,
      targetsMissed,
      wrongClicks,
      totalTargets,
      hitRate,
      accuracy,
      averageReactionTime,
    };
  }, [rounds]);

  const score = useMemo(() => calculateAwarenessScore(metrics), [metrics]);
  const stars = useMemo(() => calculateDrillStars(score, 'awareness', difficulty), [score, difficulty]);

  if (gameState === 'intro') {
    return (
      <div className="drill-container">
        <Card className="drill-intro">
          <CardHeader>
            <CardTitle>Awareness Training</CardTitle>
            <Badge>Difficulty {difficulty}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Test your peripheral vision by identifying target dots among distractors.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold">Instructions:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Keep your eyes on the center cross</li>
                <li>Multiple dots will appear briefly</li>
                <li>Click the <span className="text-primary font-semibold">target</span> dot</li>
                <li>Avoid clicking white distractor dots</li>
                <li>You have {displayTime}ms to respond</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Scoring:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>+20 points per correct target</li>
                <li>-10 points per wrong click</li>
                <li>Bonus for perfect accuracy</li>
              </ul>
            </div>
            <Button onClick={startGame} className="w-full">
              Start Training
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'countdown') {
    return (
      <div className="drill-container">
        <div className="drill-countdown">
          <div className="countdown-number">{countdown}</div>
          <p className="text-muted-foreground">Get ready...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'results') {
    return (
      <div className="drill-container">
        <Card className="drill-results">
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < stars ? 'star-filled' : 'star-empty'}>
                  ★
                </span>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{score}</div>
              <p className="text-muted-foreground">Total Score</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Targets Hit</span>
                <span className="font-semibold">{metrics.targetsHit}/{metrics.totalTargets}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Accuracy</span>
                <span className="font-semibold">{(metrics.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wrong Clicks</span>
                <span className="font-semibold">{metrics.wrongClicks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Reaction</span>
                <span className="font-semibold">{metrics.averageReactionTime.toFixed(0)}ms</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex-1">
                Dashboard
              </Button>
              <Button onClick={() => window.location.reload()} className="flex-1">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="drill-container">
      <div className="drill-header">
        <Progress value={(currentRound / totalRounds) * 100} />
        <div className="drill-progress-text">
          Round {currentRound + 1} / {totalRounds}
        </div>
      </div>

      <div className="awareness-game-area">
        {/* Center fixation point */}
        <div className="fixation-point">+</div>

        {/* Target dots */}
        {gameState === 'active' &&
          targets.map((target) => (
            <div
              key={target.id}
              className={`awareness-target ${target.isTarget ? 'target' : 'distractor'}`}
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
              }}
              onClick={() => handleTargetClick(target)}
            />
          ))}

        {/* Feedback */}
        {gameState === 'feedback' && (
          <div className="feedback-message">
            {rounds[currentRound].targetClicked && '✓ Correct!'}
            {rounds[currentRound].wrongClick && '✗ Wrong target'}
            {rounds[currentRound].missed && '✗ Missed'}
          </div>
        )}
      </div>
    </div>
  );
};
