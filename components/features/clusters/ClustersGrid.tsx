'use client';

import { ClusterCard } from './ClusterCard';
import { EmptyState } from '@/components/ui/feedback';
import { Skeleton } from '@/components/ui/base';
import type { Cluster, ClusterSummaryResponse } from '@/types';

interface ClustersGridProps {
  clusters: (Cluster | ClusterSummaryResponse)[];
  isLoading?: boolean;
  onViewDetails: (cluster: Cluster | ClusterSummaryResponse) => void;
  selectedClusters?: string[];
  onClusterSelect?: (clusterId: string, selected: boolean) => void;
  showSelection?: boolean;
  onQuickExport?: (clusterId: string) => void;
}

export function ClustersGrid({ 
  clusters, 
  isLoading, 
  onViewDetails,
  selectedClusters = [],
  onClusterSelect,
  showSelection = false,
  onQuickExport
}: ClustersGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (clusters.length === 0) {
    return (
      <EmptyState
        title="No clusters found"
        description="Try adjusting your filters or upload keyword data to see clusters."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clusters.map((cluster) => (
        <ClusterCard
          key={cluster.cluster_id}
          cluster={cluster}
          onViewDetails={onViewDetails}
          isSelected={selectedClusters.includes(cluster.cluster_id)}
          onSelect={(selected) => onClusterSelect?.(cluster.cluster_id, selected)}
          showSelection={showSelection}
          onQuickExport={() => onQuickExport?.(cluster.cluster_id)}
        />
      ))}
    </div>
  );
}