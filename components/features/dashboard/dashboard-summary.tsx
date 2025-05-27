'use client';

import { Zap, TrendingUp, Award, Target } from 'lucide-react';
import { ProjectStats } from '@/types/api.types';
import { DashboardStatsCard } from './dashboard-stats-card';
import { ErrorState } from '@/components/ui/feedback/error-state';

interface DashboardSummaryProps {
  stats?: ProjectStats;
  loading?: boolean;
  error?: Error | null;
}

export function DashboardSummary({ stats, loading, error }: DashboardSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!stats) {
    return null;
  }

  const formatChange = (current: number, previous: number) => {
    if (!previous || previous === 0) return undefined;
    const change = ((current - previous) / previous) * 100;
    const formatted = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
    return {
      value: formatted,
      type: change >= 0 ? 'positive' : 'negative' as const,
    };
  };

  // Note: The API doesn't provide previous values, so we can't show changes for now
  const totalChange = undefined;
  const avgVolumeChange = undefined;
  const avgDifficultyChange = undefined;
  const opportunitiesChange = undefined;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardStatsCard
        title="Total Keywords"
        value={stats.totalKeywords?.toLocaleString() || '0'}
        change={totalChange?.value}
        changeType={totalChange?.type}
        icon={Zap}
        description="Active keywords in project"
      />
      
      <DashboardStatsCard
        title="Avg. Search Volume"
        value={Math.round(stats.avgSearchVolume || 0).toLocaleString()}
        change={avgVolumeChange?.value}
        changeType={avgVolumeChange?.type}
        icon={TrendingUp}
        description="Monthly search volume"
      />
      
      <DashboardStatsCard
        title="Avg. Difficulty"
        value={(stats.avgKeywordDifficulty || 0).toFixed(1)}
        change={avgDifficultyChange?.value}
        changeType={avgDifficultyChange?.type === 'positive' ? 'negative' : 'positive'}
        icon={Award}
        description="Competition level (0-100)"
      />
      
      <DashboardStatsCard
        title="High Opportunity"
        value={(stats.topOpportunityKeywords || stats.opportunitiesBreakdown?.lowHanging?.count || 0).toLocaleString()}
        change={opportunitiesChange?.value}
        changeType={opportunitiesChange?.type}
        icon={Target}
        description="Keywords with high potential"
      />
    </div>
  );
}