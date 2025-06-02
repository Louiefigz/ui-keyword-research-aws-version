'use client';

import { MetricCard, Card } from '@/components/ui/data-display';
import { Skeleton } from '@/components/ui/base';
import { OpportunityDonutChart } from './OpportunityDonutChart';
import { ClusterVolumeChart } from './ClusterVolumeChart';
import type { Cluster, ClusterSummaryResponse } from '@/types';

interface ClustersSummaryProps {
  clusters: (Cluster | ClusterSummaryResponse)[];
  isLoading?: boolean;
  totalClusters?: number; // Total across all pages
  isOptimizedView?: boolean; // Whether showing preview data
}

export function ClustersSummary({ clusters, isLoading, totalClusters, isOptimizedView }: ClustersSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  const displayTotalClusters = totalClusters ?? clusters.length;
  const totalVolume = clusters.reduce(
    (sum, cluster) => sum + cluster.total_volume,
    0
  );
  const avgDifficulty = clusters.length
    ? clusters.reduce((sum, cluster) => sum + cluster.avg_difficulty, 0) / clusters.length
    : 0;
  const lowDifficultyClusters = clusters.filter(
    (cluster) => cluster.avg_difficulty <= 30
  ).length;

  return (
    <div className="space-y-6">
      {isOptimizedView && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Volume and difficulty metrics are calculated from visible clusters only. Total cluster count reflects the entire project.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Clusters"
          value={displayTotalClusters.toLocaleString()}
        />
        <MetricCard
          title={isOptimizedView ? "Page Search Volume" : "Total Search Volume"}
          value={totalVolume.toLocaleString()}
        />
        <MetricCard
          title={isOptimizedView ? "Page Avg Difficulty" : "Avg Difficulty"}
          value={`${avgDifficulty.toFixed(1)}%`}
        />
        <MetricCard
          title={isOptimizedView ? "Easy Clusters (Page)" : "Easy Clusters"}
          value={lowDifficultyClusters}
          change={lowDifficultyClusters > 0 ? { value: 10, type: 'increase' } : undefined}
        />
      </div>

      {clusters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Difficulty Distribution</h3>
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