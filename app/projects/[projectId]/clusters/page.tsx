'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/base';
import { 
  ClustersSummary, 
  ClustersGrid, 
  ClusterFilters, 
  ClusterSortSelector,
  ClusterDetailModal
} from '@/components/features/clusters';
import { useClusters } from '@/lib/hooks/use-clusters';
import { ErrorState } from '@/components/ui/feedback';
import { Download } from 'lucide-react';
import type { Cluster, ClusterFilters as ClusterFiltersType, ClusterSortOptions } from '@/types';

export default function ClustersPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const [filters, setFilters] = useState<ClusterFiltersType>({});
  const [sort, setSort] = useState<ClusterSortOptions>({
    field: 'opportunityScore',
    order: 'desc'
  });
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);

  const { data, isLoading, error } = useClusters(projectId, filters, sort);

  const handleExport = (format: 'csv' | 'xlsx') => {
    // Export functionality will be implemented when API endpoints are available
    // TODO: Implement export functionality
  };

  const handleViewDetails = (cluster: Cluster) => {
    setSelectedCluster(cluster);
  };

  if (error) {
    return <ErrorState message="Failed to load clusters" />;
  }

  const clusters = data?.clusters || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Keyword Clusters</h1>
          <p className="text-muted-foreground mt-2">
            Explore keyword groupings and content opportunities.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('csv')}
            disabled={clusters.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('xlsx')}
            disabled={clusters.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <ClustersSummary clusters={clusters} isLoading={isLoading} />

      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-xl font-semibold">All Clusters</h2>
          <ClusterSortSelector sort={sort} onSortChange={setSort} />
        </div>

        <ClusterFilters filters={filters} onFiltersChange={setFilters} />

        <ClustersGrid 
          clusters={clusters} 
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
        />
      </div>

      <ClusterDetailModal
        cluster={selectedCluster}
        open={!!selectedCluster}
        onOpenChange={(open) => !open && setSelectedCluster(null)}
      />
    </div>
  );
}