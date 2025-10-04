# TRAMIND - Implementation Guide

## 🎯 Current Status

### ✅ Completed (MVP Phase 1)

1. **Project Structure & Setup**
   - React 19 + TypeScript + Vite
   - React Router for navigation
   - Complete folder structure organized by feature

2. **Design System**
   - Winter Arc color palette (dark, cold aesthetic)
   - CSS variables for consistency
   - Animation system
   - Responsive design utilities

3. **Core Components**
   - Button (3 variants: primary, secondary, ghost)
   - Card (with hover and glow effects)
   - ProgressBar (animated with percentage display)
   - StatCard (for displaying stats)

4. **Data Architecture**
   - TypeScript types for all data models
   - Local storage persistence
   - Game context for state management
   - Scoring algorithms for all drills
   - XP and leveling system
   - Streak mechanics

5. **Dashboard**
   - App header with streak and level indicators
   - Daily motivational quotes
   - XP progress bar
   - Drill cards showing daily progress
   - Quick stats summary
   - Navigation to drills and progress page

6. **Reflex Drill** (Fully Functional)
   - Countdown instructions
   - Random target placement
   - Reaction time tracking
   - False start detection
   - Results screen with stars and XP
   - Difficulty scaling
   - Complete scoring algorithm

7. **Progress Page** (Basic)
   - Overview stats (streak, level, total sessions)
   - Per-drill statistics
   - Placeholder for achievements

---

## 🚧 Next Steps

### Phase 2: Complete Core Drills

#### 1. Awareness Drill
**File**: `src/components/drills/AwarenessDrill/`

**Implementation**:
- Create `AwarenessDrill.tsx`, `awarenessLogic.ts`, `AwarenessDrill.css`
- Use Canvas API for performance (multiple moving objects)
- Spawn objects from screen edges
- Track hits, misses, wrong clicks
- Color/shape based targeting
- Progressive difficulty (speed, complexity)

**Key Functions**:
```typescript
// awarenessLogic.ts
- spawnObject(difficulty): Object
- updateObjectPositions(deltaTime): void
- checkCollision(clickPos, objects): Object | null
- calculateAwarenessMetrics(session): AwarenessMetrics
```

#### 2. Impulse Control Drill
**File**: `src/components/drills/ImpulseDrill/`

**Implementation**:
- Rising "urge bar" animation
- Temptation messages that rotate
- Peak detection (bar reaches 100%)
- Resistance timer (15-30s based on difficulty)
- Click = failure, resist = success
- Visual feedback (pulsing, color changes)

**Key Features**:
- 5-10 rounds per session
- Animated bar with gradient (blue → red)
- Audio cues (optional)
- Haptic feedback on mobile

#### 3. Focus Drill
**File**: `src/components/drills/FocusDrill/`

**Implementation**:
- Moving target that user must follow with cursor/finger
- Distraction elements (flashing, moving objects)
- Track focus time vs breaks
- Streak counter for continuous focus
- 60-180 second sessions based on difficulty

**Key Features**:
- Smooth target movement (sine wave, circular paths)
- Proximity detection (cursor within target)
- Visual focus indicator
- Progressive distractions

### Phase 3: Enhanced Progress Page

**Add**:
- Activity calendar (heatmap of last 30 days)
- Performance graphs (using Recharts or Victory)
- Achievement badges system
- Drill-specific trend charts
- Comparison to personal bests

**Files to Create**:
- `ActivityCalendar.tsx` - Visual heatmap
- `PerformanceGraph.tsx` - Line/bar charts
- `AchievementBadge.tsx` - Individual badge component
- `DrillBreakdown.tsx` - Detailed per-drill stats

### Phase 4: Achievements System

**Implementation**:
1. Create achievement checking logic in `services/achievements.ts`
2. Check achievements after each session
3. Show unlock animations
4. Store unlocked achievements in user stats

**File**: `src/services/achievements.ts`
```typescript
- checkAchievements(userStats): Achievement[]
- unlockAchievement(id): void
- getProgress(achievement, userStats): number
```

---

## 📁 File Structure Reference

```
src/
├── components/
│   ├── common/              ✅ Complete
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   └── StatCard.tsx
│   ├── dashboard/           ✅ Complete
│   │   ├── Dashboard.tsx
│   │   └── DrillCard.tsx
│   ├── drills/
│   │   ├── ReflexDrill/     ✅ Complete
│   │   ├── AwarenessDrill/  ❌ TODO
│   │   ├── ImpulseDrill/    ❌ TODO
│   │   └── FocusDrill/      ❌ TODO
│   └── progress/
│       ├── ProgressPage.tsx ⚠️  Basic (needs enhancement)
│       ├── ActivityCalendar.tsx    ❌ TODO
│       ├── PerformanceGraph.tsx    ❌ TODO
│       └── AchievementBadge.tsx    ❌ TODO
├── contexts/
│   └── GameContext.tsx      ✅ Complete
├── hooks/
│   └── useLocalStorage.ts   ✅ Complete
├── services/
│   ├── storage.ts           ✅ Complete
│   ├── scoring.ts           ✅ Complete
│   ├── progression.ts       ✅ Complete
│   └── achievements.ts      ❌ TODO
├── types/                   ✅ Complete
├── utils/                   ✅ Complete
└── styles/                  ✅ Complete
```

---

## 🎨 Design System Reference

### Colors
```css
--bg-primary: #0a0e1a       /* Main background */
--bg-secondary: #141820     /* Secondary surfaces */
--bg-tertiary: #1e2530      /* Cards */

--accent-cyan: #00d4ff      /* Primary actions */
--accent-ice: #b8e6ff       /* Highlights */

--success: #00ff88          /* Positive feedback */
--warning: #ffaa00          /* Caution */
--error: #ff4466            /* Errors */

--drill-reflex: #00d4ff     /* Reflex drill color */
--drill-awareness: #00ff88  /* Awareness drill color */
--drill-impulse: #ff4466    /* Impulse drill color */
--drill-focus: #b8e6ff      /* Focus drill color */
```

### Typography
- Display font: Inter
- Monospace: JetBrains Mono
- Sizes: xs (12px) → 5xl (48px)

### Spacing
- Base unit: 4px (--space-1)
- Standard gaps: 4, 8, 12, 16, 24, 32, 48, 64px

---

## 🔧 Development Commands

```bash
# Development
pnpm dev                    # Start dev server (http://localhost:5173)

# Build
pnpm build                  # Production build

# Lint
pnpm lint                   # Run ESLint

# Preview
pnpm preview                # Preview production build
```

---

## 💾 Data Models

### UserStats
```typescript
{
  totalPoints: number;        // Cumulative XP
  level: number;              // Current level (1+)
  currentXP: number;          // XP in current level
  currentStreak: number;      // Consecutive days
  longestStreak: number;      // Best streak
  lastActive: Date;           // Last session date
  drillStats: DrillStats[];   // Per-drill stats
  achievements: string[];     // Achievement IDs
  freezeDaysAvailable: number;// Streak protection days
  sessionsToday: number;      // Today's count
}
```

### Session
```typescript
{
  drillId: 'reflex' | 'awareness' | 'impulse' | 'focus';
  startTime: Date;
  endTime: Date;
  score: number;              // Calculated score
  stars: number;              // 1-5 rating
  pointsEarned: number;       // XP awarded
  metricsCollected: any;      // Drill-specific data
}
```

---

## 🎮 Scoring Algorithms

### Reflex Drill
```typescript
score = max(0, 1000 - averageTime)
score *= (1 + consistency * 0.3)    // Bonus for consistency
score -= falseStarts * 50            // Penalty
```

### Awareness Drill
```typescript
score = targetsHit * 20 - wrongClicks * 10
if (perfect) score *= 1.5            // Perfect bonus
```

### Impulse Control
```typescript
score = roundsResisted * 100
score += perfectResists * 50         // 15s+ resists
score -= clickedBeforePeak * 50
if (allResisted) score *= 1.5
```

### Focus Drill
```typescript
score = focusPercentage * 1000
score -= breaks * 20
score += longestStreak bonuses
score += avgStreakLength * 5
```

---

## 🎯 Gamification Mechanics

### XP & Levels
- Level 1-5: 1000 XP each
- Level 6-10: 1500 XP each
- Level 11+: 2000 XP each

### Stars (1-5)
- 5★: 95%+ of max score
- 4★: 85-94%
- 3★: 70-84%
- 2★: 50-69%
- 1★: Below 50%

### Streaks
- +1 per active day
- Freeze day earned every 7 days
- Visual: 🔥 (1-6), 🔥🔥 (7-13), 🔥🔥🔥 (14-29), 🔥🔥🔥🔥 (30+)

### Difficulty Scaling
- Drill level increases every 5 sessions with improvement
- Difficulty = ceil(level / 2), capped at 10
- Affects: target size, speed, complexity, duration

---

## 🐛 Known Issues / TODOs

1. **Daily Session Tracking**: Currently using `sessionsCompleted % 3` as placeholder
   - Need to track actual sessions per day
   - Store in DailyActivity with date

2. **Achievement System**: Not yet implemented
   - Create checking logic
   - Add unlock animations
   - Update UI

3. **Drill Placeholders**: Only Reflex Drill is functional
   - Awareness, Impulse, Focus need implementation

4. **Mobile Optimization**: Basic responsive design in place
   - Test touch interactions
   - Add haptic feedback
   - Optimize for small screens

5. **Sound Effects**: Not implemented
   - Add optional audio cues
   - Settings to toggle sound

---

## 📱 Mobile Considerations

- Touch events already supported (click handlers work)
- Add haptic feedback via `navigator.vibrate()`
- Test on actual devices for performance
- Consider PWA manifest for installability
- Adjust hit targets to min 44x44px

---

## 🚀 Deployment

### Build for Production
```bash
pnpm build
```

Output in `dist/` folder. Deploy to:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static host

### Environment Variables
No environment variables needed currently (all local storage).

---

## 📊 Analytics Opportunities

Future enhancements:
- Track session completion rates
- Most popular drills
- Average session duration
- Drop-off points
- Improvement trends

---

## 🎓 Learning Resources

- [React 19 Docs](https://react.dev)
- [React Compiler](https://react.dev/learn/react-compiler)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

## 💡 Future Feature Ideas

1. **Social**
   - Anonymous leaderboards
   - Share achievements
   - Weekly challenges

2. **Customization**
   - Theme variants
   - Drill duration preferences
   - Difficulty presets

3. **Advanced Analytics**
   - Time-of-day performance patterns
   - Correlation between drills
   - Predictive insights

4. **More Drills**
   - Memory exercises
   - Pattern recognition
   - Multi-tasking challenges

---

## 📝 Code Style Notes

- Use functional components with hooks
- Prefer `const` over `let`
- TypeScript strict mode enabled
- CSS Modules for component styles
- Keep components under 300 lines
- Extract complex logic to separate files

---

## 🙏 Credits

Built with:
- React 19 with React Compiler
- TypeScript
- Vite
- React Router
- Local Storage API

Design inspiration: Winter Arc mindset, minimalism, focus on functionality.
