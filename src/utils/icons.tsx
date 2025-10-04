import { Zap, Keyboard, Eye, Target, Brain, Trophy, Flame, Award, Star } from 'lucide-react';
import type { ReactElement } from 'react';

// Icon components for drills
export const DrillIcons = {
  reflex: () => <Zap size={32} />,
  'keyboard-reflex': () => <Keyboard size={32} />,
  awareness: () => <Eye size={32} />,
  impulse: () => <Target size={32} />,
  focus: () => <Brain size={32} />,
};

// Icon components for achievements
export const AchievementIcons = {
  first_session: () => <Trophy size={24} />,
  week_streak: () => <Flame size={24} />,
  reflex_master: () => <Zap size={24} />,
  discipline_iron: () => <Target size={24} />,
  eagle_eye: () => <Eye size={24} />,
  zen_master: () => <Brain size={24} />,
  month_streak: () => <Flame size={24} />,
  level_10: () => <Award size={24} />,
  hundred_sessions: () => <Star size={24} />,
};
