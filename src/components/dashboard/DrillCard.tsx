import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import type { DrillConfig } from '../../utils/constants';
import { getThemeColor } from '../../utils/constants';

interface DrillCardProps {
  drill: DrillConfig;
  sessionsCompleted: number;
  dailyRecommended: number;
}

export const DrillCard = ({
  drill,
  sessionsCompleted,
  dailyRecommended,
}: DrillCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/drill/${drill.id}`);
  };

  const progress = (sessionsCompleted / dailyRecommended) * 100;

  return (
    <Card
      className="group cursor-pointer transition-all duration-150 hover:border-primary/30"
      onClick={handleClick}
    >
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: getThemeColor(drill.color) + '15' }}>
            <div style={{ color: getThemeColor(drill.color) }}>
              {drill.icon()}
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-md text-xs font-medium ${
            progress >= 100
              ? 'bg-chart-3/10 text-chart-3'
              : 'bg-muted text-muted-foreground'
          }`}>
            {sessionsCompleted}/{dailyRecommended}
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold mb-1">{drill.name}</h3>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">{drill.description}</p>
          </div>
          <div className="space-y-2">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${Math.min(100, progress)}%`,
                  backgroundColor: getThemeColor(drill.color)
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
