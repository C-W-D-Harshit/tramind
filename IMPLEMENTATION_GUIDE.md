# TRAMIND - Implementation Guide

## 🎯 Current Status

### ✅ Completed (MVP Phases 1 & 2)

1. **Project Structure & Setup**
   - React 19 + TypeScript + Vite
   - React Router for navigation
   - Complete folder structure organized by feature
   - All drill routes configured

2. **Design System**
   - Winter Arc color palette (dark, cold aesthetic)
   - CSS variables for consistency
   - Animation system
   - Responsive design utilities (mobile-optimized)
   - Dark/Light theme toggle

3. **Core Components**
   - Button (3 variants: primary, secondary, ghost)
   - Card (with hover and glow effects)
   - ProgressBar (animated with percentage display)
   - StatCard (for displaying stats)
   - Badge components

4. **Data Architecture**
   - TypeScript types for all data models
   - Local storage persistence
   - Game context for state management
   - Scoring algorithms for ALL drills
   - XP and leveling system
   - Streak mechanics
   - Session completion tracking (fixed data loss issue)

5. **Dashboard**
   - Mobile-responsive header
   - App header with streak and level indicators
   - Daily motivational quotes
   - XP progress bar
   - Drill cards showing daily progress
   - Quick stats summary
   - Navigation to drills and progress page

6. **All Core Drills** (Fully Functional)
   - ✅ Reflex Drill (Click)
   - ✅ Keyboard Reflex Drill
   - ✅ Awareness Drill
   - ✅ Impulse Control Drill
   - ✅ Focus Drill
   - All with countdown, gameplay, feedback, results
   - Difficulty scaling
   - Complete scoring algorithms
   - Session saving on completion

7. **Progress Page** (Basic)
   - Overview stats (streak, level, total sessions)
   - Per-drill statistics
   - Placeholder for achievements

---

## ✅ Phase 2: Complete Core Drills (COMPLETED)

### 1. Awareness Drill ✅
**File**: `src/components/drills/AwarenessDrill/AwarenessDrill.tsx`

**Implementation**:
- ✅ Peripheral vision training with target dots
- ✅ Cyan target among gray distractors
- ✅ Fixed center cross for eye focus
- ✅ Brief display time (1500ms-800ms based on difficulty)
- ✅ Track hits, misses, wrong clicks
- ✅ Progressive difficulty (more distractors, less time)
- ✅ Session completion and scoring

**Features**:
- 10-22 rounds based on difficulty
- 3-9 distractor dots
- Real-time feedback (✓ Correct, ✗ Wrong, ✗ Missed)
- Accuracy and reaction time tracking

### 2. Impulse Control Drill ✅
**File**: `src/components/drills/ImpulseDrill/ImpulseDrill.tsx`

**Implementation**:
- ✅ Rising "urge bar" animation with gradient (blue → red)
- ✅ Rotating temptation messages
- ✅ Peak detection (bar reaches 100%)
- ✅ Resistance timer (17-35s based on difficulty)
- ✅ Click = failure, resist = success
- ✅ Visual feedback with status messages

**Features**:
- 6-15 rounds based on difficulty
- Animated urge bar with color transitions
- Early click detection (clicked before peak)
- Perfect resist tracking
- Real-time countdown timer

### 3. Focus Drill ✅
**File**: `src/components/drills/FocusDrill/FocusDrill.tsx`

**Implementation**:
- ✅ Moving target with smooth circular motion
- ✅ Animated distractor elements
- ✅ Real-time cursor proximity detection
- ✅ Track focus time vs breaks
- ✅ Streak counter for continuous focus
- ✅ 70-160 second sessions based on difficulty

**Features**:
- Dynamic target size (28px-15px)
- 2-20 animated distractors
- Focus percentage tracking
- Longest streak display
- Break counting

---

## 🚧 Next Steps

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
│   ├── dashboard/           ✅ Complete (mobile-responsive)
│   │   ├── Dashboard.tsx
│   │   └── DrillCard.tsx
│   ├── drills/
│   │   ├── ReflexDrill/     ✅ Complete
│   │   ├── KeyboardReflexDrill/ ✅ Complete
│   │   ├── AwarenessDrill/  ✅ Complete
│   │   ├── ImpulseDrill/    ✅ Complete
│   │   └── FocusDrill/      ✅ Complete
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
│   ├── scoring.ts           ✅ Complete (all drills)
│   ├── progression.ts       ✅ Complete
│   └── achievements.ts      ❌ TODO
├── types/                   ✅ Complete (all drill types)
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

3. **Mobile Optimization**: ✅ Header fixed
   - ✅ Responsive header layout
   - ⚠️ Test touch interactions on all drills
   - ❌ Add haptic feedback
   - ⚠️ Optimize drill screens for small screens

4. **Sound Effects**: Not implemented
   - Add optional audio cues
   - Settings to toggle sound

5. **Session Persistence**: ✅ Fixed
   - ✅ All drills now save immediately when results are shown
   - No data loss on page refresh

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
