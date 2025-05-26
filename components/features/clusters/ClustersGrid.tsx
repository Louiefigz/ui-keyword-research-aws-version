'use client';

import { ClusterCard } from './ClusterCard';
import { EmptyState } from '@/components/ui/feedback';
import { Skeleton } from '@/components/ui/base';
import type { Cluster } from '@/types';

interface ClustersGridProps {
  clusters: Cluster[];
  isLoading?: boolean;
  onViewDetails: (cluster: Cluster) => void;
}

export function ClustersGrid({ clusters, isLoading, onViewDetails }: ClustersGridProps) {
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
          key={cluster.id}
          cluster={cluster}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}