import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../../contexts/GameContext';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { calculateFocusScore, calculateDrillStars } from '../../../services/scoring';
import { calculateSessionXP } from '../../../services/progression';
import type { Session, FocusMetrics } from '../../../types/drill.types';

type GameState = 'instructions' | 'active' | 'results';

export const FocusDrill = () => {
  const navigate = useNavigate();
  const { userStats, completeSession } = useGame();

  const drillStats = userStats.drillStats.find(d => d.drillId === 'focus');
  const difficulty = drillStats?.difficulty || 1;

  const sessionDuration = 60000 + difficulty * 10000; // 70s-160s
  const targetRadius = Math.max(30 - difficulty * 2, 15); // 28px-15px
  const distractorCount = Math.min(difficulty * 2, 20); // 2-20 distractors

  const [gameState, setGameState] = useState<GameState>('instructions');
  const [countdown, setCountdown] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(sessionDuration);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  const [cursorInTarget, setCursorInTarget] = useState(false);
  const [focusTime, setFocusTime] = useState(0);
  const [breaks, setBreaks] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [distractors, setDistractors] = useState<Array<{ x: number; y: number; speed: number; angle: number }>>([]);

  const sessionStartTime = useRef<Date>(new Date());
  const lastInTarget = useRef(false);
  const streakStartTime = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Instructions countdown
  useEffect(() => {
    if (gameState === 'instructions' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'instructions' && countdown === 0) {
      startDrill();
    }
  }, [gameState, countdown]);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'active') {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = Math.max(0, prev - 100);
          if (newTime === 0) {
            showResults();
          }
          return newTime;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [gameState]);

  // Track focus time
  useEffect(() => {
    if (gameState === 'active') {
      const interval = setInterval(() => {
        if (cursorInTarget) {
          setFocusTime(prev => prev + 100);
          setCurrentStreak(prev => {
            const newStreak = prev + 100;
            setLongestStreak(curr => Math.max(curr, newStreak));
            return newStreak;
          });
        } else {
          if (currentStreak > 0) {
            setBreaks(prev => prev + 1);
          }
          setCurrentStreak(0);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [gameState, cursorInTarget, currentStreak]);

  // Move target
  useEffect(() => {
    if (gameState === 'active') {
      let time = 0;

      const moveTarget = () => {
        time += 0.016; // ~60fps

        // Smooth circular movement with some randomness
        const radius = 25 + Math.sin(time * 0.3) * 15;
        const angle = time * 0.5 + Math.sin(time * 0.2) * 2;
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;

        setTargetPosition({ x, y });
        animationFrameRef.current = requestAnimationFrame(moveTarget);
      };

      animationFrameRef.current = requestAnimationFrame(moveTarget);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [gameState]);

  // Animate distractors
  useEffect(() => {
    if (gameState === 'active' && distractorCount > 0) {
      const animate = () => {
        setDistractors(prev =>
          prev.map(d => {
            let newX = d.x + Math.cos(d.angle) * d.speed;
            let newY = d.y + Math.sin(d.angle) * d.speed;
            let newAngle = d.angle;

            // Bounce off edges
            if (newX < 0 || newX > 100) {
              newAngle = Math.PI - newAngle;
              newX = Math.max(0, Math.min(100, newX));
            }
            if (newY < 0 || newY > 100) {
              newAngle = -newAngle;
              newY = Math.max(0, Math.min(100, newY));
            }

            return { ...d, x: newX, y: newY, angle: newAngle };
          })
        );

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [gameState, distractorCount]);

  const startDrill = () => {
    setGameState('active');

    // Generate distractors
    const newDistractors = Array.from({ length: distractorCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: 0.2 + Math.random() * 0.3,
      angle: Math.random() * Math.PI * 2,
    }));
    setDistractors(newDistractors);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

    const distance = Math.sqrt(
      Math.pow(mouseX - targetPosition.x, 2) + Math.pow(mouseY - targetPosition.y, 2)
    );

    const inTarget = distance <= (targetRadius / rect.width) * 100;
    setCursorInTarget(inTarget);

    if (inTarget && !lastInTarget.current) {
      streakStartTime.current = Date.now();
    }
    lastInTarget.current = inTarget;
  };

  const showResults = () => {
    setGameState('results');

    // Save session immediately
    const totalTime = sessionDuration;
    const focusPercentage = (focusTime / totalTime) * 100;
    const averageStreakLength = breaks > 0 ? focusTime / breaks : focusTime;

    const metrics: FocusMetrics = {
      focusTime,
      totalTime,
      focusPercentage,
      breaks,
      longestStreak,
      averageStreakLength,
    };

    const score = calculateFocusScore(metrics);
    const stars = calculateDrillStars(score, 'focus', difficulty);
    const xp = calculateSessionXP(score, stars, difficulty, userStats.currentStreak);

    const session: Session = {
      drillId: 'focus',
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
    focusTime,
    totalTime: sessionDuration,
    focusPercentage: (focusTime / sessionDuration) * 100,
    breaks,
    longestStreak,
    averageStreakLength: breaks > 0 ? focusTime / breaks : focusTime,
  } : null;

  const score = metrics ? calculateFocusScore(metrics) : 0;
  const stars = metrics ? calculateDrillStars(score, 'focus', difficulty) : 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {gameState === 'instructions' && (
        <div className="flex flex-col items-center gap-8 text-center max-w-md px-4">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold">Focus Drill</h1>
            <p className="text-base text-muted-foreground">Keep your cursor in the moving target</p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Follow the moving cyan circle with your cursor</p>
            <p>• Stay inside for as long as possible</p>
            <p>• Avoid distractions on screen</p>
            <p>• Duration: {(sessionDuration / 1000).toFixed(0)}s</p>
          </div>
          <div className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 text-5xl font-bold tabular-nums">
            {countdown}
          </div>
        </div>
      )}

      {gameState === 'active' && (
        <div className="flex flex-col gap-6 w-full max-w-4xl px-4">
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-sm px-3 py-1.5 font-medium">
              {(timeRemaining / 1000).toFixed(1)}s
            </Badge>
            <div className="text-sm text-muted-foreground">
              Focus: {((focusTime / (sessionDuration - timeRemaining)) * 100 || 0).toFixed(0)}%
            </div>
          </div>

          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative w-full aspect-square bg-card border rounded-lg overflow-hidden cursor-crosshair"
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            {/* Distractors */}
            {distractors.map((d, i) => (
              <div
                key={i}
                className="absolute w-6 h-6 rounded-full bg-muted-foreground/20 animate-pulse"
                style={{
                  left: `${d.x}%`,
                  top: `${d.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}

            {/* Target */}
            <div
              className={`absolute rounded-full border-4 transition-all duration-100 ${
                cursorInTarget
                  ? 'border-cyan-500 bg-cyan-500/20 shadow-lg shadow-cyan-500/50'
                  : 'border-cyan-500/50 bg-cyan-500/10'
              }`}
              style={{
                left: `${targetPosition.x}%`,
                top: `${targetPosition.y}%`,
                width: `${targetRadius * 2}px`,
                height: `${targetRadius * 2}px`,
                transform: 'translate(-50%, -50%)',
              }}
            />

            {/* Streak indicator */}
            {currentStreak > 3000 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-cyan-500 font-bold text-lg">
                {(currentStreak / 1000).toFixed(1)}s streak!
              </div>
            )}
          </div>

          <div className="flex justify-center gap-6 text-sm">
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground">Breaks</span>
              <span className="text-xl font-semibold tabular-nums">{breaks}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground">Best Streak</span>
              <span className="text-xl font-semibold tabular-nums">{(longestStreak / 1000).toFixed(1)}s</span>
            </div>
          </div>
        </div>
      )}

      {gameState === 'results' && metrics && (
        <div className="flex flex-col items-center gap-6 text-center max-w-lg mx-auto p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Session Complete</h1>
            <p className="text-sm text-muted-foreground">Focus training results</p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-lg border bg-card">
              <span className="text-xs text-muted-foreground">Focus Time</span>
              <span className="text-2xl font-semibold text-cyan-500 tabular-nums">
                {(metrics.focusTime / 1000).toFixed(1)}s
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-lg border bg-card">
              <span className="text-xs text-muted-foreground">Focus %</span>
              <span className="text-2xl font-semibold tabular-nums">
                {metrics.focusPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-lg border bg-card">
              <span className="text-xs text-muted-foreground">Breaks</span>
              <span className="text-2xl font-semibold tabular-nums">{metrics.breaks}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-lg border bg-card">
              <span className="text-xs text-muted-foreground">Best Streak</span>
              <span className="text-2xl font-semibold tabular-nums">
                {(metrics.longestStreak / 1000).toFixed(1)}s
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
