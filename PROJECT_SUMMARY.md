# TRAMIND - Winter Arc Mind Training Web App

## 🎯 Project Overview

**TRAMIND** is a comprehensive brain training web application designed to build superhuman focus, calm, reflexes, and situational awareness. Built with a "Winter Arc" aesthetic - cold, focused, and relentless.

### Tech Stack
- **React 19** with React Compiler for performance
- **TypeScript** for type safety
- **Vite** for fast development and optimized builds
- **React Router** for navigation
- **Local Storage** for persistence
- **CSS Custom Properties** for theming

---

## ✅ What's Built (MVP - Phase 1)

### 1. Core Infrastructure
- ✅ Complete project structure
- ✅ TypeScript type definitions
- ✅ Winter Arc design system (dark theme)
- ✅ Reusable component library
- ✅ Game state management (React Context)
- ✅ Local storage persistence
- ✅ Scoring algorithms for all drills
- ✅ XP and leveling system
- ✅ Streak mechanics

### 2. Dashboard
- ✅ App header with branding
- ✅ Streak indicator with fire emoji intensity
- ✅ Level and XP progress visualization
- ✅ Daily motivational quotes
- ✅ Drill cards showing daily progress
- ✅ Quick stats summary
- ✅ Responsive grid layout

### 3. Reflex Drill (FULLY FUNCTIONAL)
- ✅ Countdown instructions
- ✅ Random target placement and sizing
- ✅ Reaction time measurement (milliseconds)
- ✅ False start detection
- ✅ 10-20 rounds based on difficulty
- ✅ Results screen with:
  - Average reaction time
  - Best reaction time
  - Score calculation
  - Star rating (1-5)
  - XP reward
- ✅ Difficulty progression
- ✅ Returns to dashboard on completion

### 4. Progress Page (Basic)
- ✅ Overview statistics
- ✅ Current streak and level display
- ✅ Per-drill breakdown
- ✅ Sessions, best score, average score
- ✅ Placeholder for achievements

### 5. Design System
- ✅ Color palette (winter arc theme)
- ✅ Typography system
- ✅ Spacing scale
- ✅ Animation library
- ✅ Utility classes
- ✅ Responsive breakpoints

---

## 🚧 What's Not Built Yet

### Remaining Drills (Phase 2)

#### 1. Awareness Drill
**Status**: Designed, not implemented

**Needs**:
- Canvas-based game area
- Moving objects spawning system
- Target vs distractor logic
- Hit/miss/wrong click tracking
- 60-second sessions
- Difficulty scaling (speed, complexity)

**Files to create**:
- `src/components/drills/AwarenessDrill/AwarenessDrill.tsx`
- `src/components/drills/AwarenessDrill/awarenessLogic.ts`
- `src/components/drills/AwarenessDrill/AwarenessDrill.css`

#### 2. Impulse Control Drill
**Status**: Designed, not implemented

**Needs**:
- Rising "urge bar" animation
- Temptation messages
- Peak detection
- Resistance timer
- 5-10 rounds
- Visual feedback system

**Files to create**:
- `src/components/drills/ImpulseDrill/ImpulseDrill.tsx`
- `src/components/drills/ImpulseDrill/impulseLogic.ts`
- `src/components/drills/ImpulseDrill/ImpulseDrill.css`

#### 3. Focus Drill
**Status**: Designed, not implemented

**Needs**:
- Moving target
- Cursor/touch tracking
- Distraction elements
- Focus time tracking
- Break detection
- 60-180 second sessions

**Files to create**:
- `src/components/drills/FocusDrill/FocusDrill.tsx`
- `src/components/drills/FocusDrill/focusLogic.ts`
- `src/components/drills/FocusDrill/FocusDrill.css`

### Progress Page Enhancements (Phase 3)

**Missing Features**:
- Activity calendar (30-day heatmap)
- Performance graphs (line charts)
- Detailed drill trends
- Comparison to personal bests

**Files to create**:
- `src/components/progress/ActivityCalendar.tsx`
- `src/components/progress/PerformanceGraph.tsx`
- `src/components/progress/DrillBreakdown.tsx`

Consider adding charting library:
```bash
pnpm add recharts
# or
pnpm add victory
```

### Achievements System (Phase 4)

**Status**: Data structure defined, logic not implemented

**Needs**:
- Achievement checking after each session
- Unlock animations
- Progress tracking
- Badge display UI

**Files to create**:
- `src/services/achievements.ts`
- `src/components/progress/AchievementBadge.tsx`
- `src/components/progress/AchievementGrid.tsx`

### Additional Features

- **Sound Effects**: Not implemented
- **Haptic Feedback**: Not implemented (mobile)
- **Settings Page**: Not created
- **PWA Manifest**: Not configured

---

## 📊 How It Works

### User Flow

```
1. User lands on Dashboard
   ↓
2. Sees current streak, level, XP progress
   ↓
3. Clicks a drill card (e.g., Reflex)
   ↓
4. Completes drill session
   ↓
5. Views results (score, stars, XP earned)
   ↓
6. Returns to Dashboard (updated stats)
   ↓
7. Can view Progress page for detailed stats
```

### Data Flow

```
Session Completion
   ↓
Calculate Metrics → Calculate Score → Calculate Stars → Calculate XP
   ↓
Update User Stats (XP, Level, Streak)
   ↓
Update Drill Stats (sessions, scores, difficulty)
   ↓
Save to Local Storage
   ↓
Trigger UI Update (React Context)
```

### Scoring System

Each drill has its own scoring algorithm:

**Reflex Drill**:
```
Base Score = 1000 - avgReactionTime
Consistency Bonus = up to +30%
False Start Penalty = -50 per occurrence
```

**Star Rating** (all drills):
```
5 stars: 95%+ of max score
4 stars: 85-94%
3 stars: 70-84%
2 stars: 50-69%
1 star:  <50%
```

**XP Calculation**:
```
Base XP = score / 10
Star Bonus = stars × 20
Difficulty Multiplier = 1 + (difficulty × 0.1)
Streak Bonus = min(500, streak × 50)

Total XP = (Base XP + Star Bonus) × Difficulty Multiplier + Streak Bonus
```

---

## 🎨 Design Philosophy

### Visual Style
- **Dark backgrounds** (#0a0e1a, #141820, #1e2530)
- **Cyan accents** (#00d4ff) for primary actions
- **Minimal UI** - focus on functionality
- **Cold color palette** - ice blue, steel gray
- **High contrast** for readability
- **Smooth animations** for feedback

### UX Principles
- **Immediate feedback** - show results instantly
- **Progress visualization** - bars, stars, numbers
- **Gamification** - XP, levels, streaks, achievements
- **Motivation** - daily quotes, streak fire
- **Simplicity** - one drill at a time, clear instructions

---

## 🚀 Getting Started

### Run the App
```bash
pnpm dev
```
Open http://localhost:5173

### Build for Production
```bash
pnpm build
```

### What You Can Do Now
1. ✅ View dashboard with your stats
2. ✅ Play Reflex Drill (fully functional)
3. ✅ See XP and level progression
4. ✅ Track your streak
5. ✅ View basic progress page

### What You Can't Do Yet
1. ❌ Play Awareness, Impulse, or Focus drills
2. ❌ View activity calendar
3. ❌ See performance graphs
4. ❌ Unlock achievements
5. ❌ Customize settings

---

## 📂 Key Files

### Entry Points
- `src/main.tsx` - App entry
- `src/App.tsx` - Router setup
- `src/index.css` - Global styles

### Core Logic
- `src/contexts/GameContext.tsx` - State management
- `src/services/scoring.ts` - Score calculations
- `src/services/progression.ts` - XP/leveling
- `src/services/storage.ts` - Data persistence

### UI Components
- `src/components/dashboard/Dashboard.tsx` - Main page
- `src/components/drills/ReflexDrill/ReflexDrill.tsx` - Reflex drill
- `src/components/common/` - Reusable components

### Configuration
- `src/utils/constants.ts` - Drill configs, achievements
- `src/utils/calculations.ts` - Helper functions
- `src/styles/variables.css` - Design tokens

---

## 🎯 Next Implementation Steps

### Immediate (Complete MVP)
1. **Implement Awareness Drill**
   - Start with `AwarenessDrill.tsx`
   - Follow same pattern as ReflexDrill
   - Use Canvas API for performance

2. **Implement Impulse Drill**
   - Create rising bar animation
   - Add temptation messages
   - Implement resistance timer

3. **Implement Focus Drill**
   - Moving target with smooth paths
   - Cursor tracking
   - Distraction elements

4. **Add routes to App.tsx**
   ```tsx
   <Route path="/drill/awareness" element={<AwarenessDrill />} />
   <Route path="/drill/impulse" element={<ImpulseDrill />} />
   <Route path="/drill/focus" element={<FocusDrill />} />
   ```

### Short Term (Enhanced Features)
5. **Activity Calendar**
   - Heatmap of last 30 days
   - Color intensity by sessions
   - Click to see day details

6. **Performance Graphs**
   - Install charting library
   - Score trends over time
   - Per-drill comparisons

7. **Achievements System**
   - Implement checking logic
   - Unlock animations
   - Progress indicators

### Medium Term (Polish)
8. **Sound Effects**
   - Add audio feedback
   - Settings to toggle

9. **Mobile Optimization**
   - Test touch interactions
   - Add haptic feedback
   - Optimize for small screens

10. **Settings Page**
    - Sound on/off
    - Haptics on/off
    - Data export/reset

---

## 🐛 Current Issues

1. **Daily Session Tracking**
   - Currently using `sessionsCompleted % 3` as placeholder
   - Need to properly track sessions per day

2. **Date Handling**
   - Some Date objects need better serialization
   - Consider using timestamps instead

3. **Mobile Testing**
   - Not tested on actual devices yet
   - May need touch event optimizations

---

## 💡 Code Examples

### Adding a New Drill

1. Create drill component:
```tsx
// src/components/drills/NewDrill/NewDrill.tsx
import { useState } from 'react';
import { useGame } from '../../../contexts/GameContext';

export const NewDrill = () => {
  const { completeSession } = useGame();

  // Your drill logic here

  return <div>Your UI</div>;
};
```

2. Add scoring function:
```typescript
// src/services/scoring.ts
export const calculateNewDrillScore = (metrics: NewMetrics): number => {
  // Your scoring logic
  return score;
};
```

3. Add route:
```tsx
// src/App.tsx
<Route path="/drill/new" element={<NewDrill />} />
```

4. Add to constants:
```typescript
// src/utils/constants.ts
{
  id: 'new',
  name: 'New Drill',
  icon: '🎯',
  description: 'Description',
  dailyRecommended: 3,
  color: '#00d4ff',
}
```

---

## 📚 Documentation

- `CLAUDE.md` - Claude Code specific guidance
- `IMPLEMENTATION_GUIDE.md` - Detailed development guide
- `PROJECT_SUMMARY.md` - This file
- `README.md` - Original Vite template readme

---

## 🎓 Learning Points

This project demonstrates:
- React 19 with React Compiler
- TypeScript for type safety
- Context API for state management
- Local Storage for persistence
- CSS Custom Properties
- Responsive design
- Animation techniques
- Game development patterns
- Gamification mechanics

---

## 🙌 Credits

**Designed and implemented by Claude Code**

Technologies:
- React 19 + React Compiler
- TypeScript 5.9
- Vite 7
- React Router 7
- Modern CSS

Inspiration:
- Winter Arc mindset
- Minimalist design
- Focus on functionality over fluff

---

## 📞 Support

For issues or questions:
1. Check `IMPLEMENTATION_GUIDE.md`
2. Review type definitions in `src/types/`
3. Examine existing drill (RefleXDrill) as reference
4. All scoring logic is in `src/services/scoring.ts`

---

## 🎉 Current Status

**The app is functional!**

You can:
- ✅ Use the dashboard
- ✅ Play Reflex Drill
- ✅ Track progress
- ✅ See XP and leveling
- ✅ Build on this foundation

**Server running at**: http://localhost:5173

**Next step**: Implement the remaining 3 drills to complete the vision!
