import { Card, CardContent } from '@/components/ui/card';
import type { ReactElement } from 'react';
import { getThemeColor } from '../../utils/constants';

interface StatCardProps {
  icon: ReactElement | string | (() => ReactElement);
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
  onClick?: () => void;
}

export const StatCard = ({
  icon,
  label,
  value,
  subtext,
  color = 'primary',
  onClick,
}: StatCardProps) => {
  // Convert color name to CSS custom property, fallback to direct color if it's already a hex
  const themeColor = color.startsWith('#') ? color : getThemeColor(color);

  return (
    <Card
      className={`group ${onClick ? 'cursor-pointer transition-all duration-150 hover:border-primary/30' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6 flex items-center gap-5">
        <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: themeColor + '15' }}>
          <div className="text-3xl" style={{ color: themeColor }}>
            {typeof icon === 'string' ? icon : typeof icon === 'function' ? icon() : icon}
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl font-semibold" style={{ color: themeColor }}>
            {value}
          </div>
          {subtext && <div className="text-xs text-muted-foreground">{subtext}</div>}
        </div>
      </CardContent>
    </Card>
  );
};
