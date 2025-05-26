import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: 'active' | 'inactive' | 'pending' | 'error';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusColors = {
  active: 'bg-brand-green-500',
  inactive: 'bg-muted-foreground',
  pending: 'bg-brand-orange-500',
  error: 'bg-destructive',
};

const sizeClasses = {
  sm: 'h-2 w-2',
  md: 'h-3 w-3',
  lg: 'h-4 w-4',
};

export function StatusIndicator({
  status,
  label,
  size = 'md',
  className,
}: StatusIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <div
          className={cn(
            'rounded-full',
            statusColors[status],
            sizeClasses[size]
          )}
        />
        {status === 'active' && (
          <div
            className={cn(
              'absolute inset-0 rounded-full animate-pulse',
              statusColors[status],
              'opacity-75'
            )}
          />
        )}
      </div>
      {label && (
        <span className="text-sm text-muted-foreground capitalize">
          {label}
        </span>
      )}
    </div>
  );
}