import { Flame } from 'lucide-react';
import { getStreakConfig } from '../../utils/calculations';

interface StreakIconProps {
  streak: number;
}

export const StreakIcon = ({ streak }: StreakIconProps) => {
  const config = getStreakConfig(streak);
  return <Flame size={config.size} className={config.className} />;
};
