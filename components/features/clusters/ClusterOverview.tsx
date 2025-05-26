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
  const { metrics, opportunities, content_strategy } = cluster;


  const getCompetitionBadgeVariant = (level: string) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Search Volume"
          value={formatNumber(metrics.total_search_volume)}
          icon={TrendingUp}
        />
        <MetricCard
          title="Keywords Count"
          value={metrics.total_keywords}
          icon={Target}
        />
        <MetricCard
          title="Opportunity Score"
          value={`${metrics.opportunity_score}%`}
          icon={BarChart}
        />
        <MetricCard
          title="Market Share Potential"
          value={`${metrics.market_share_potential}%`}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Opportunity Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Competition Level</span>
              <Badge variant={getCompetitionBadgeVariant(opportunities.competition_level)}>
                {opportunities.competition_level}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Ranking Difficulty</span>
              <Badge variant="outline">{opportunities.ranking_difficulty}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Content Gap Score</span>
              <span className="font-semibold">{opportunities.content_gap_score}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Traffic Potential</span>
              <span className="font-semibold">{formatNumber(opportunities.estimated_traffic_potential)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Content Strategy</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Content Type</span>
              <Badge variant="outline">{content_strategy.recommended_content_type}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Primary Intent</span>
              <Badge variant="outline">{content_strategy.primary_intent}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Content Depth</span>
              <span className="font-semibold capitalize">{content_strategy.content_depth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Word Count</span>
              <span className="font-semibold">~{formatNumber(content_strategy.estimated_word_count)} words</span>
            </div>
          </div>
        </Card>
      </div>

      {opportunities.quick_wins.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Wins</h3>
          <ul className="space-y-2">
            {opportunities.quick_wins.map((win, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">{win}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}