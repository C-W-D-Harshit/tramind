import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../../contexts/GameContext';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  generateDelay,
  calculateReflexMetrics,
  getTotalRounds,
} from '../ReflexDrill/reflexLogic';
import type { ReflexRound } from '../ReflexDrill/reflexLogic';
import { calculateReflexScore, calculateDrillStars } from '../../../services/scoring';
import { calculateSessionXP } from '../../../services/progression';
import type { Session } from '../../../types/drill.types';

type GameState = 'instructions' | 'waiting' | 'active' | 'feedback' | 'results';

export const KeyboardReflexDrill = () => {
  const navigate = useNavigate();
  const { userStats, completeSession } = useGame();

  const drillStats = userStats.drillStats.find(d => d.drillId === 'keyboard-reflex');
  const difficulty = drillStats?.difficulty || 1;
  const totalRounds = getTotalRounds(difficulty);

  const [gameState, setGameState] = useState<GameState>('instructions');
  const [countdown, setCountdown] = useState(3);
  const [currentRound, setCurrentRound] = useState(0);
  const [rounds, setRounds] = useState<ReflexRound[]>([]);
  const [targetVisible, setTargetVisible] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [pressedKey, setPressedKey] = useState('');

  const sessionStartTime = useRef(new Date());

  // Instructions countdown
  useEffect(() => {
    if (gameState === 'instructions' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'instructions' && countdown === 0) {
      startNextRound();
    }
  }, [gameState, countdown]);

  // Round delay timer
  useEffect(() => {
    if (gameState === 'waiting' && currentRound < totalRounds) {
      const round = rounds[currentRound];
      const timer = setTimeout(() => {
        showTarget();
      }, round.delay);

      return () => clearTimeout(timer);
    }
  }, [gameState, currentRound]);

  const startNextRound = () => {
    if (currentRound >= totalRounds) {
      showResults();
      return;
    }

    const delay = generateDelay(difficulty);
    const newRound: ReflexRound = {
      delay,
      clicked: false,
      falseStart: false,
    };

    setRounds(prev => [...prev, newRound]);
    setGameState('waiting');
    setTargetVisible(false);
    setReactionTime(null);
    setPressedKey('');
  };

  const showTarget = () => {
    setTargetVisible(true);
    setRoundStartTime(Date.now());
    setGameState('active');
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    // Only accept spacebar
    if (e.code !== 'Space') return;

    if (gameState === 'waiting') {
      // False start
      setPressedKey('SPACE');
      setRounds(prev => {
        const updated = [...prev];
        updated[currentRound] = { ...updated[currentRound], falseStart: true, clicked: true };
        return updated;
      });
      setReactionTime(-1);
      setGameState('feedback');
      setTimeout(() => {
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        if (nextRound >= totalRounds) {
          showResults();
        } else {
          startNextRound();
        }
      }, 800);
    } else if (gameState === 'active' && targetVisible) {
      const reaction = Date.now() - roundStartTime;
      setPressedKey('SPACE');

      setReactionTime(reaction);
      setTargetVisible(false);

      setRounds(prev => {
        const updated = [...prev];
        updated[currentRound] = {
          ...updated[currentRound],
          reactionTime: reaction,
          clicked: true,
        };
        return updated;
      });

      setGameState('feedback');
      setTimeout(() => {
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        if (nextRound >= totalRounds) {
          showResults();
        } else {
          startNextRound();
        }
      }, 800);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, targetVisible, currentRound]);

  const showResults = () => {
    setGameState('results');

    // Save session immediately when results are shown
    const metrics = calculateReflexMetrics(rounds);
    const score = calculateReflexScore(metrics);
    const stars = calculateDrillStars(score, 'keyboard-reflex', difficulty);
    const xp = calculateSessionXP(score, stars, difficulty, userStats.currentStreak);

    const session: Session = {
      drillId: 'keyboard-reflex',
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

  const metrics = gameState === 'results' ? calculateReflexMetrics(rounds) : null;
  const score = metrics ? calculateReflexScore(metrics) : 0;
  const stars = metrics ? calculateDrillStars(score, 'keyboard-reflex', difficulty) : 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {gameState === 'instructions' && (
        <div className="flex flex-col items-center gap-8 text-center max-w-md">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold">Keyboard Reflex</h1>
            <p className="text-base text-muted-foreground">Press SPACEBAR as fast as you can</p>
          </div>
          <div className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 text-5xl font-bold tabular-nums">
            {countdown}
          </div>
        </div>
      )}

      {(gameState === 'waiting' || gameState === 'active' || gameState === 'feedback') && (
        <div className="flex flex-col items-center justify-center gap-12 w-full">
          <Badge variant="outline" className="text-sm px-3 py-1.5 font-medium">
            Round {currentRound + 1} / {totalRounds}
          </Badge>

          {gameState === 'waiting' && (
            <p className="text-base text-muted-foreground">Wait for the signal...</p>
          )}

          {targetVisible && (
            <div className="flex flex-col items-center gap-4">
              <div className="px-10 py-6 text-4xl font-bold border-2 border-cyan-500 rounded-lg bg-cyan-500/10">
                SPACE
              </div>
              <p className="text-base text-cyan-500 font-medium">Press now!</p>
            </div>
          )}

          {gameState === 'feedback' && reactionTime !== null && (
            <div className="flex flex-col items-center gap-2">
              {reactionTime === -1 ? (
                <>
                  <div className="text-4xl font-bold text-destructive">Too Early!</div>
                  <div className="text-sm text-muted-foreground">Wait for the signal</div>
                </>
              ) : (
                <div className="text-5xl font-bold text-primary tabular-nums">{reactionTime}ms</div>
              )}
            </div>
          )}
        </div>
      )}

      {gameState === 'results' && metrics && (
        <div className="flex flex-col items-center gap-6 text-center max-w-lg mx-auto p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Session Complete</h1>
            <p className="text-sm text-muted-foreground">Great work! Here's your performance</p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-lg border bg-card">
              <span className="text-xs text-muted-foreground">Average</span>
              <span className="text-2xl font-semibold tabular-nums">{Math.round(metrics.averageTime)}ms</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-lg border bg-card">
              <span className="text-xs text-muted-foreground">Best</span>
              <span className="text-2xl font-semibold text-cyan-500 tabular-nums">{Math.round(metrics.bestTime)}ms</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-lg border bg-card">
              <span className="text-xs text-muted-foreground">Score</span>
              <span className="text-2xl font-semibold tabular-nums">{score}</span>
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
