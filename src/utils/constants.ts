import type { DrillId } from '../types/drill.types';
import type { Achievement } from '../types/user.types';
import type { ReactElement } from 'react';
import { DrillIcons, AchievementIcons } from './icons';

// Color mapping for theme-aware colors
export const getThemeColor = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'primary': 'var(--primary)',
    'secondary': 'var(--secondary)',
    'accent': 'var(--accent)',
    'destructive': 'var(--destructive)',
    'muted': 'var(--muted)',
    'chart-1': 'var(--chart-1)',
    'chart-2': 'var(--chart-2)',
    'chart-3': 'var(--chart-3)',
    'chart-4': 'var(--chart-4)',
    'chart-5': 'var(--chart-5)',
  };
  return colorMap[colorName] || colorMap['primary'];
};

// XP and Leveling
export const XP_PER_LEVEL = (level: number): number => {
  if (level <= 5) return 1000 * level;
  if (level <= 10) return 5000 + 1500 * (level - 5);
  return 12500 + 2000 * (level - 10);
};

export const DAILY_GOAL_BONUS = 100;
export const STREAK_BONUS_PER_DAY = 50;
export const MAX_STREAK_BONUS = 500;

// Drill Configuration
export interface DrillConfig {
  id: DrillId;
  name: string;
  icon: () => ReactElement;
  description: string;
  dailyRecommended: number;
  color: string;
}

export const DRILL_CONFIGS: DrillConfig[] = [
  {
    id: 'reflex',
    name: 'Reflex (Click)',
    icon: DrillIcons.reflex,
    description: 'Click targets fast',
    dailyRecommended: 3,
    color: 'primary',
  },
  {
    id: 'keyboard-reflex',
    name: 'Keyboard Reflex',
    icon: DrillIcons['keyboard-reflex'],
    description: 'Press SPACE fast',
    dailyRecommended: 3,
    color: 'chart-2',
  },
  {
    id: 'awareness',
    name: 'Awareness',
    icon: DrillIcons.awareness,
    description: 'Peripheral vision training',
    dailyRecommended: 3,
    color: 'chart-3',
  },
  {
    id: 'impulse',
    name: 'Impulse Control',
    icon: DrillIcons.impulse,
    description: 'Discipline & resistance',
    dailyRecommended: 3,
    color: 'destructive',
  },
  {
    id: 'focus',
    name: 'Focus',
    icon: DrillIcons.focus,
    description: 'Sustained attention',
    dailyRecommended: 2,
    color: 'chart-1',
  },
];

// Achievements
export const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'progress'>[] = [
  {
    id: 'first_session',
    title: 'First Steps',
    description: 'Complete your first training session',
    icon: AchievementIcons.first_session,
    requirement: { type: 'sessions', value: 1 },
    xpReward: 50,
  },
  {
    id: 'week_streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day training streak',
    icon: AchievementIcons.week_streak,
    requirement: { type: 'streak', value: 7 },
    xpReward: 200,
  },
  {
    id: 'reflex_master',
    title: 'Lightning Reflexes',
    description: 'Average under 200ms in Reflex Drill',
    icon: AchievementIcons.reflex_master,
    requirement: { type: 'reflex_avg', value: 200 },
    xpReward: 300,
  },
  {
    id: 'discipline_iron',
    title: 'Iron Discipline',
    description: 'Resist all urges in 10 consecutive sessions',
    icon: AchievementIcons.discipline_iron,
    requirement: { type: 'urge_perfect', value: 10 },
    xpReward: 500,
  },
  {
    id: 'eagle_eye',
    title: 'Eagle Eye',
    description: '95% accuracy in Awareness Drill',
    icon: AchievementIcons.eagle_eye,
    requirement: { type: 'awareness_accuracy', value: 0.95 },
    xpReward: 400,
  },
  {
    id: 'zen_master',
    title: 'Zen Master',
    description: '100% focus for 180 seconds',
    icon: AchievementIcons.zen_master,
    requirement: { type: 'focus_perfect', value: 180 },
    xpReward: 1000,
  },
  {
    id: 'month_streak',
    title: 'Monthly Monk',
    description: '30-day training streak',
    icon: AchievementIcons.month_streak,
    requirement: { type: 'streak', value: 30 },
    xpReward: 1000,
  },
  {
    id: 'level_10',
    title: 'Mind Athlete',
    description: 'Reach Level 10',
    icon: AchievementIcons.level_10,
    requirement: { type: 'level', value: 10 },
    xpReward: 500,
  },
  {
    id: 'hundred_sessions',
    title: 'Centurion',
    description: 'Complete 100 total sessions',
    icon: AchievementIcons.hundred_sessions,
    requirement: { type: 'sessions', value: 100 },
    xpReward: 750,
  },
];

// Motivational Quotes
export const MOTIVATIONAL_QUOTES = [
  'Your mind is a muscle. Train it like one.',
  'Discipline equals freedom.',
  'Pain is weakness leaving the body.',
  'The only way out is through.',
  'Excellence is a habit, not an act.',
  'Comfort is the enemy of progress.',
  'Every master was once a disaster.',
  'Small daily improvements over time lead to stunning results.',
  'You don\'t have to be great to start, but you have to start to be great.',
  'The difference between who you are and who you want to be is what you do.',
  'Champions aren\'t made in the ring, they\'re made in training.',
  'Embrace the grind. Trust the process.',
  'Your future self will thank you.',
  'Strength doesn\'t come from what you can do. It comes from overcoming what you thought you couldn\'t.',
  'Winter arc mindset: cold, focused, relentless.',
];
