import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../../contexts/GameContext';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { calculateImpulseScore, calculateDrillStars } from '../../../services/scoring';
import { calculateSessionXP } from '../../../services/progression';
import type { Session, ImpulseMetrics } from '../../../types/drill.types';

type GameState = 'instructions' | 'waiting' | 'rising' | 'resisting' | 'feedback' | 'results';

interface Round {
  urgeLevel: number;
  resisted: boolean;
  clickedEarly: boolean;
  resistTime: number;
}

const TEMPTATION_MESSAGES = [
  "Just one click won't hurt...",
  "Everyone else would click...",
  "You deserve to click now...",
  "It's too hard to resist...",
  "Why are you even trying?",
  "Just give in already...",
  "One click and it's over...",
  "You can't resist forever...",
];

export const ImpulseDrill = () => {
  const navigate = useNavigate();
  const { userStats, completeSession } = useGame();

  const drillStats = userStats.drillStats.find(d => d.drillId === 'impulse');
  const difficulty = drillStats?.difficulty || 1;

  const totalRounds = 5 + difficulty; // 6-15 rounds
  const resistDuration = 15000 + difficulty * 2000; // 17s-35s
  const riseSpeed = Math.max(3000 - difficulty * 200, 1500); // 2.8s-1.5s to rise

  const [gameState, setGameState] = useState<GameState>('instructions');
  const [countdown, setCountdown] = useState(3);
  const [currentRound, setCurrentRound] = useState(0);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [urgeLevel, setUrgeLevel] = useState(0);
  const [temptationMessage, setTemptationMessage] = useState('');
  const [resistStartTime, setResistStartTime] = useState(0);
  const [resistTimer, setResistTimer] = useState(0);

  const sessionStartTime = useRef(new Date());
  const animationFrameRef = useRef<number>();

  // Instructions countdown
  useEffect(() => {
    if (gameState === 'instructions' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'instructions' && countdown === 0) {
      startNextRound();
    }
  }, [gameState, countdown]);

  // Urge rising animation
  useEffect(() => {
    if (gameState === 'rising') {
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / riseSpeed, 1);
        setUrgeLevel(progress * 100);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          // Urge has peaked
          startResisting();
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [gameState, riseSpeed]);

  // Resist timer
  useEffect(() => {
    if (gameState === 'resisting') {
      const interval = setInterval(() => {
        const elapsed = Date.now() - resistStartTime;
        const remaining = Math.max(0, resistDuration - elapsed);
        setResistTimer(remaining);

        if (remaining === 0) {
          handleResistSuccess();
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [gameState, resistStartTime, resistDuration]);

  const startNextRound = () => {
    if (currentRound >= totalRounds) {
      showResults();
      return;
    }

    setGameState('waiting');
    setUrgeLevel(0);
    setTemptationMessage(TEMPTATION_MESSAGES[Math.floor(Math.random() * TEMPTATION_MESSAGES.length)]);

    setTimeout(() => {
      setGameState('rising');
    }, 1000 + Math.random() * 1000);
  };

  const startResisting = () => {
    setGameState('resisting');
    setResistStartTime(Date.now());
    setResistTimer(resistDuration);
  };

  const handleClick = () => {
    if (gameState === 'rising') {
      // Clicked before peak - failure
      const newRound: Round = {
        urgeLevel,
        resisted: false,
        clickedEarly: true,
        resistTime: 0,
      };

      setRounds(prev => [...prev, newRound]);
      setGameState('feedback');

      setTimeout(() => {
        setCurrentRound(prev => prev + 1);
        startNextRound();
      }, 1500);
    } else if (gameState === 'resisting') {
      // Clicked during resist period - failure
      const resistTime = Date.now() - resistStartTime;
      const newRound: Round = {
        urgeLevel: 100,
        resisted: false,
        clickedEarly: false,
        resistTime,
      };

      setRounds(prev => [...prev, newRound]);
      setGameState('feedback');

      setTimeout(() => {
        setCurrentRound(prev => prev + 1);
        startNextRound();
      }, 1500);
    }
  };

  const handleResistSuccess = () => {
    const newRound: Round = {
      urgeLevel: 100,
      resisted: true,
      clickedEarly: false,
      resistTime: resistDuration,
    };

    setRounds(prev => [...prev, newRound]);
    setGameState('feedback');

    setTimeout(() => {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      if (nextRound >= totalRounds) {
        showResults();
      } else {
        startNextRound();
      }
    }, 1500);
  };

  const showResults = () => {
    setGameState('results');

    // Save session immediately
    const roundsResisted = rounds.filter(r => r.resisted).length;
    const clickedEarly = rounds.filter(r => r.clickedEarly).length;
    const clickedDuringResist = rounds.filter(r => !r.resisted && !r.clickedEarly).length;
    const perfectResists = rounds.filter(r => r.resisted && r.resistTime >= resistDuration).length;
    const averageResistTime = rounds.length > 0
      ? rounds.reduce((sum, r) => sum + r.resistTime, 0) / rounds.length
      : 0;

    const metrics: ImpulseMetrics = {
      totalRounds: rounds.length,
      roundsResisted,
      clickedEarly,
      clickedDuringResist,
      perfectResists,
      averageResistTime,
    };

    const score = calculateImpulseScore(metrics);
    const stars = calculateDrillStars(score, 'impulse', difficulty);
    const xp = calculateSessionXP(score, stars, difficulty, userStats.currentStreak);

    const session: Session = {
      drillId: 'impulse',
      startTime: sessionStartTime.current,
      endTime: new Date(),
      score,
      stars,
      pointsEarned: xp,
      metricsCollected: metrics,
    };

    completeSession(session);
  };

  const handleFinish = () => {
    navigate('/');
  };

  const metrics = gameState === 'results' ? {
    totalRounds: rounds.length,
    roundsResisted: rounds.filter(r => r.resisted).length,
    clickedEarly: rounds.filter(r => r.clickedEarly).length,
    clickedDuringResist: rounds.filter(r => !r.resisted && !r.clickedEarly).length,
    perfectResists: rounds.filter(r => r.resisted && r.resistTime >= resistDuration).length,
    averageResistTime: rounds.length > 0 ? rounds.reduce((sum, r) => sum + r.resistTime, 0) / rounds.length : 0,
  } : null;

  const score = metrics ? calculateImpulseScore(metrics) : 0;
  const stars = metrics ? calculateDrillStars(score, 'impulse', difficulty) : 0;

  const getUrgeColor = () => {
    if (urgeLevel < 30) return 'from-blue-500 to-cyan-500';
    if (urgeLevel < 60) return 'from-cyan-500 to-yellow-500';
    if (urgeLevel < 90) return 'from-yellow-500 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {gameState === 'instructions' && (
        <div className="flex flex-col items-center gap-8 text-center max-w-md px-4">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold">Impulse Control</h1>
            <p className="text-base text-muted-foreground">Resist the urge to click</p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Watch the urge bar rise</p>
            <p>• Wait for it to reach 100%</p>
            <p>• Then resist clicking for {(resistDuration / 1000).toFixed(0)}s</p>
            <p>• Clicking early = failure</p>
          </div>
          <div className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 text-5xl font-bold tabular-nums">
            {countdown}
          </div>
        </div>
      )}

      {(gameState === 'waiting' || gameState === 'rising' || gameState === 'resisting') && (
        <div className="flex flex-col items-center gap-12 w-full max-w-2xl px-8">
          <Badge variant="outline" className="text-sm px-3 py-1.5 font-medium">
            Round {currentRound + 1} / {totalRounds}
          </Badge>

          {/* Urge Bar */}
          <div className="w-full space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Urge Level</span>
              <span className="tabular-nums">{Math.round(urgeLevel)}%</span>
            </div>
            <div className="h-12 w-full bg-muted rounded-full overflow-hidden relative">
              <div
                className={`h-full bg-gradient-to-r ${getUrgeColor()} transition-all duration-100`}
                style={{ width: `${urgeLevel}%` }}
              />
              {gameState === 'resisting' && (
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg animate-pulse">
                  RESIST
                </div>
              )}
            </div>
          </div>

          {/* Temptation Message */}
          {(gameState === 'rising' || gameState === 'resisting') && (
            <div className="text-center space-y-6">
              <p className="text-xl text-muted-foreground italic animate-pulse">
                {temptationMessage}
              </p>

              {gameState === 'resisting' && (
                <div className="text-3xl font-bold tabular-nums">
                  {(resistTimer / 1000).toFixed(1)}s
                </div>
              )}
            </div>
          )}

          {/* Click Zone (for failure) */}
          <button
            onClick={handleClick}
            className="px-12 py-6 text-2xl font-bold border-2 border-red-500/50 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
          >
            CLICK
          </button>
        </div>
      )}

      {gameState === 'feedback' && rounds.length > 0 && (
        <div className="flex flex-col items-center gap-4">
          {rounds[rounds.length - 1].resisted ? (
            <>
              <div className="text-5xl font-bold text-green-500">✓ Resisted!</div>
              <div className="text-lg text-muted-foreground">
                {(rounds[rounds.length - 1].resistTime / 1000).toFixed(1)}s
              </div>
            </>
          ) : rounds[rounds.length - 1].clickedEarly ? (
            <>
              <div className="text-5xl font-bold text-red-500">✗ Too Early!</div>
              <div className="text-sm text-muted-foreground">Wait for 100%</div>
            </>
          ) : (
            <>
              <div className="text-5xl font-bold text-orange-500">✗ Gave In</div>
              <div className="text-sm text-muted-foreground">
                Lasted {(rounds[rounds.length - 1].resistTime / 1000).toFixed(1)}s
              </div>
            </>
          )}
        </div>
      )}

      {gameState === 'results' && metrics && (
        <div className="flex flex-col items-center gap-6 text-center max-w-lg mx-auto p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Session Complete</h1>
            <p className="text-sm text-muted-foreground">Impulse control results</p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-lg border bg-card">
              <span className="text-xs text-muted-foreground">Resisted</span>
              <span className="text-2xl font-semibold text-green-500 tabular-nums">
                {metrics.roundsResisted}/{metrics.totalRounds}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-lg border bg-card">
              <span className="text-xs text-muted-foreground">Score</span>
              <span className="text-2xl font-semibold tabular-nums">{score}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-lg border bg-card">
              <span className="text-xs text-muted-foreground">Perfect</span>
              <span className="text-2xl font-semibold tabular-nums">{metrics.perfectResists}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-lg border bg-card">
              <span className="text-xs text-muted-foreground">Avg Time</span>
              <span className="text-2xl font-semibold tabular-nums">
                {(metrics.averageResistTime / 1000).toFixed(1)}s
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl tracking-wider">
              {'★'.repeat(stars)}
              {'☆'.repeat(5 - stars)}
            </div>
            <div className="text-2xl font-semibold text-cyan-500">
              +{calculateSessionXP(score, stars, difficulty, userStats.currentStreak)} XP
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button className="flex-1" onClick={handleFinish}>
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
