import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../../contexts/GameContext';
import type { AwarenessMetrics } from '../../../types/drill.types';
import { calculateAwarenessScore, calculateDrillStars } from '../../../services/scoring';
import { Button } from '../../ui/button';
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
  const [rounds, setRounds] = useState<Round[]>([]);
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [sessionStartTime] = useState(Date.now());

  const generateTargets = useCallback((): Target[] => {
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
      let x: number = 0;
      let y: number = 0;
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
  }, [numDistractors]);

  const startGame = () => {
    setGameState('countdown');
    setCountdown(3);
  };

  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'countdown' && countdown === 0) {
      // Just transition to waiting state, let the waiting effect handle the rest
      setGameState('waiting');
    }
  }, [gameState, countdown]);

  // Separate effect for waiting -> active transition
  useEffect(() => {
    if (gameState === 'waiting') {
      const waitTime = 500 + Math.random() * 500;
      const waitTimer = setTimeout(() => {
        const newTargets = generateTargets();
        setTargets(newTargets);
        setRoundStartTime(Date.now());
        setGameState('active');
      }, waitTime);

      return () => clearTimeout(waitTimer);
    }
  }, [gameState, generateTargets]);

  const showResults = useCallback(() => {
    setGameState('results');
  }, []);

  // Complete session when results are shown
  useEffect(() => {
    if (gameState === 'results') {
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

      completeSession({
        drillId: 'awareness',
        startTime: new Date(sessionStartTime),
        endTime: new Date(),
        score,
        stars,
        pointsEarned: score,
        metricsCollected: metrics,
      });
    }
  }, [gameState, rounds, totalRounds, difficulty, sessionStartTime, completeSession]);

  const startRound = useCallback(() => {
    setGameState('waiting');
    const waitTime = 500 + Math.random() * 500;

    setTimeout(() => {
      const newTargets = generateTargets();
      setTargets(newTargets);
      setRoundStartTime(Date.now());
      setGameState('active');
    }, waitTime);
  }, [generateTargets]);

  const handleMiss = useCallback(() => {
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
      setCurrentRound(prev => {
        const nextRound = prev + 1;
        if (nextRound >= totalRounds) {
          showResults();
        } else {
          startRound();
        }
        return nextRound;
      });
    }, 500);
  }, [currentRound, totalRounds, showResults, startRound]);

  const handleTargetClick = useCallback((target: Target) => {
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
      setCurrentRound(prev => {
        const nextRound = prev + 1;
        if (nextRound >= totalRounds) {
          showResults();
        } else {
          startRound();
        }
        return nextRound;
      });
    }, 500);
  }, [gameState, roundStartTime, currentRound, totalRounds, showResults, startRound]);

  // Auto-miss timer
  useEffect(() => {
    if (gameState === 'active') {
      const missTimer = setTimeout(() => {
        handleMiss();
      }, displayTime);

      return () => clearTimeout(missTimer);
    }
  }, [gameState, displayTime, handleMiss]);

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-8 text-center max-w-md px-4">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold">Awareness Training</h1>
            <Badge variant="outline" className="text-sm px-3 py-1.5 font-medium">
              Difficulty {difficulty}
            </Badge>
            <p className="text-base text-muted-foreground">
              Test your peripheral vision by identifying target dots among distractors
            </p>
          </div>

          <div className="space-y-4 w-full text-left">
            <div className="space-y-2">
              <h4 className="font-semibold">Instructions:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Keep your eyes on the center cross</li>
                <li>Multiple dots will appear briefly</li>
                <li>Click the <span className="text-cyan-500 font-semibold">cyan</span> target dot</li>
                <li>Avoid clicking distractor dots</li>
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
          </div>

          <Button onClick={startGame} className="w-full" size="lg">
            Start Training
          </Button>
        </div>
      </div>
    );
  }

  if (gameState === 'countdown') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 text-5xl font-bold tabular-nums">
            {countdown}
          </div>
          <p className="text-lg text-muted-foreground">Get ready...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'results') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 text-center max-w-lg mx-auto p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Session Complete</h1>
            <p className="text-sm text-muted-foreground">Awareness training results</p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-lg border bg-card">
              <span className="text-xs text-muted-foreground">Targets Hit</span>
              <span className="text-2xl font-semibold text-cyan-500 tabular-nums">
                {metrics.targetsHit}/{metrics.totalTargets}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-lg border bg-card">
              <span className="text-xs text-muted-foreground">Accuracy</span>
              <span className="text-2xl font-semibold tabular-nums">
                {(metrics.accuracy * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-lg border bg-card">
              <span className="text-xs text-muted-foreground">Wrong Clicks</span>
              <span className="text-2xl font-semibold tabular-nums">{metrics.wrongClicks}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-lg border bg-card">
              <span className="text-xs text-muted-foreground">Avg Reaction</span>
              <span className="text-2xl font-semibold tabular-nums">
                {metrics.averageReactionTime.toFixed(0)}ms
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="text-5xl font-bold text-cyan-500 tabular-nums">{score}</div>
            <div className="text-4xl tracking-wider">
              {'★'.repeat(stars)}
              {'☆'.repeat(5 - stars)}
            </div>
            <div className="text-2xl font-semibold text-cyan-500">
              +{score} XP
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button className="flex-1" onClick={() => navigate('/')}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="text-sm px-3 py-1.5 font-medium">
            Round {currentRound + 1} / {totalRounds}
          </Badge>
          <div className="text-sm text-muted-foreground">
            Difficulty {difficulty}
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={(currentRound / totalRounds) * 100} className="h-2" />

        {/* Game area */}
        <div className="relative w-full aspect-square bg-card border rounded-lg overflow-hidden">
          {/* Center fixation point */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-muted-foreground font-bold select-none pointer-events-none">
            +
          </div>

          {/* Target dots */}
          {gameState === 'active' &&
            targets.map((target) => (
              <div
                key={target.id}
                className={`absolute w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110 z-10 ${
                  target.isTarget
                    ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50'
                    : 'bg-muted-foreground/40'
                }`}
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => handleTargetClick(target)}
              />
            ))}

          {/* Feedback */}
          {gameState === 'feedback' && rounds[currentRound] && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold">
              {rounds[currentRound].targetClicked && <span className="text-green-500">✓ Correct!</span>}
              {rounds[currentRound].wrongClick && <span className="text-red-500">✗ Wrong target</span>}
              {rounds[currentRound].missed && <span className="text-orange-500">✗ Missed</span>}
            </div>
          )}

          {gameState === 'waiting' && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg text-muted-foreground">
              Watch the center...
            </div>
          )}
        </div>

        {/* Instructions reminder */}
        <div className="text-center text-sm text-muted-foreground">
          Keep your eyes on the + and click the <span className="text-cyan-500 font-semibold">cyan</span> target
        </div>
      </div>
    </div>
  );
};
