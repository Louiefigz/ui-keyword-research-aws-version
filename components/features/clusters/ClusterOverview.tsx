'use client';

import { Card } from '@/components/ui/data-display';
import { Badge } from '@/components/ui/base';
import { MetricCard } from '@/components/ui/data-display';
import { TrendingUp, Target, Users, BarChart } from 'lucide-react';
import type { Cluster } from '@/types';
import { formatNumber } from '@/utils/format';

interface ClusterOverviewProps {
  cluster: Cluster;
}

export function ClusterOverview({ cluster }: ClusterOverviewProps) {
  const { 
    name, 
    description, 
    main_keyword, 
    keyword_count, 
    total_volume, 
    avg_difficulty, 
    avg_position 
  } = cluster;

  const getDifficultyBadgeVariant = (difficulty: number) => {
    if (difficulty <= 30) return 'success';
    if (difficulty <= 60) return 'warning';
    return 'destructive';
  };

  const getPositionBadgeVariant = (position: number) => {
    if (position <= 10) return 'success';
    if (position <= 30) return 'warning';
    return 'destructive';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Search Volume"
          value={formatNumber(total_volume)}
          icon={TrendingUp}
        />
        <MetricCard
          title="Keywords Count"
          value={keyword_count}
          icon={Target}
        />
        <MetricCard
          title="Avg Difficulty"
          value={`${Math.round(avg_difficulty)}%`}
          icon={BarChart}
        />
        <MetricCard
          title="Avg Position"
          value={Math.round(avg_position)}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cluster Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Difficulty Level</span>
              <Badge variant={getDifficultyBadgeVariant(avg_difficulty)}>
                {avg_difficulty <= 30 ? 'Easy' : avg_difficulty <= 60 ? 'Medium' : 'Hard'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Position</span>
              <Badge variant={getPositionBadgeVariant(avg_position)}>
                #{Math.round(avg_position)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Keywords per Cluster</span>
              <span className="font-semibold">{keyword_count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Volume</span>
              <span className="font-semibold">{formatNumber(total_volume)}</span>
            </div>
          </div>
        </Card>

        {main_keyword && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Main Keyword</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Keyword</span>
                <span className="font-semibold">{main_keyword.keyword}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Volume</span>
                <span className="font-semibold">{formatNumber(main_keyword.volume)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Difficulty</span>
                <span className="font-semibold">{Math.round(main_keyword.kd)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Position</span>
                <Badge variant={getPositionBadgeVariant(main_keyword.position || 0)}>
                  #{main_keyword.position || 'N/A'}
                </Badge>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Description</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </Card>
    </div>
  );
}