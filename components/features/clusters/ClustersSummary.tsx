'use client';

import { MetricCard, Card } from '@/components/ui/data-display';
import { Skeleton } from '@/components/ui/base';
import { OpportunityDonutChart, ClusterVolumeChart } from '@/components/features/charts';
import type { Cluster } from '@/types';

interface ClustersSummaryProps {
  clusters: Cluster[];
  isLoading?: boolean;
}

export function ClustersSummary({ clusters, isLoading }: ClustersSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  const totalClusters = clusters.length;
  const totalVolume = clusters.reduce(
    (sum, cluster) => sum + cluster.metrics.total_search_volume,
    0
  );
  const avgOpportunityScore = clusters.length
    ? clusters.reduce((sum, cluster) => sum + cluster.metrics.opportunity_score, 0) / clusters.length
    : 0;
  const highOpportunityClusters = clusters.filter(
    (cluster) => cluster.metrics.opportunity_score >= 70
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Clusters"
          value={totalClusters.toLocaleString()}
        />
        <MetricCard
          title="Total Search Volume"
          value={totalVolume.toLocaleString()}
        />
        <MetricCard
          title="Avg Opportunity Score"
          value={`${avgOpportunityScore.toFixed(1)}%`}
        />
        <MetricCard
          title="High Opportunity"
          value={highOpportunityClusters}
          change={highOpportunityClusters > 0 ? { value: 10, type: 'increase' } : undefined}
        />
      </div>

      {clusters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Opportunity Distribution</h3>
            <OpportunityDonutChart clusters={clusters} />
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Clusters by Volume</h3>
            <ClusterVolumeChart clusters={clusters} />
          </Card>
        </div>
      )}
    </div>
  );
}