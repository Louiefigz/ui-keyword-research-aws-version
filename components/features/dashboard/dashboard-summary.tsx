'use client';

import { Zap, TrendingUp, Award, Target } from 'lucide-react';
import { DashboardStats } from '@/types/api.types';
import { DashboardStatsCard } from './dashboard-stats-card';
import { ErrorState } from '@/components/ui/feedback/error-state';

interface DashboardSummaryProps {
  stats?: DashboardStats;
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

  const totalChange = formatChange(stats.total_keywords, stats.previous_total_keywords || 0);
  const avgVolumeChange = formatChange(stats.avg_search_volume, stats.previous_avg_search_volume || 0);
  const avgDifficultyChange = formatChange(stats.avg_keyword_difficulty, stats.previous_avg_keyword_difficulty || 0);
  const opportunitiesChange = formatChange(stats.high_opportunity_keywords, stats.previous_high_opportunity_keywords || 0);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardStatsCard
        title="Total Keywords"
        value={stats.total_keywords.toLocaleString()}
        change={totalChange?.value}
        changeType={totalChange?.type}
        icon={Zap}
        description="Active keywords in project"
      />
      
      <DashboardStatsCard
        title="Avg. Search Volume"
        value={Math.round(stats.avg_search_volume).toLocaleString()}
        change={avgVolumeChange?.value}
        changeType={avgVolumeChange?.type}
        icon={TrendingUp}
        description="Monthly search volume"
      />
      
      <DashboardStatsCard
        title="Avg. Difficulty"
        value={stats.avg_keyword_difficulty.toFixed(1)}
        change={avgDifficultyChange?.value}
        changeType={avgDifficultyChange?.type === 'positive' ? 'negative' : 'positive'}
        icon={Award}
        description="Competition level (0-100)"
      />
      
      <DashboardStatsCard
        title="High Opportunity"
        value={stats.high_opportunity_keywords.toLocaleString()}
        change={opportunitiesChange?.value}
        changeType={opportunitiesChange?.type}
        icon={Target}
        description="Keywords with high potential"
      />
    </div>
  );
}