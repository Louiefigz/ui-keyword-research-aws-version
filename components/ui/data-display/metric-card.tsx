import { Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: LucideIcon;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  className,
}: MetricCardProps) {
  const isPositive = change?.type === 'increase';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const changeColor = isPositive ? 'text-brand-green-600' : 'text-destructive';

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            {change && (
              <div className={cn('flex items-center gap-1 mt-2', changeColor)}>
                <TrendIcon className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {change.value > 0 ? '+' : ''}{change.value}%
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="rounded-lg bg-primary/10 p-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}