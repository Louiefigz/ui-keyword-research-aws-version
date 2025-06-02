'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/base';
import { 
  ClustersSummary, 
  ClustersGrid, 
  ClusterFilters, 
  ClusterSortSelector,
  ClusterDetailModal,
  ClusterExportModal
} from '@/components/features/clusters';
import { useClustersList, useExportClusters, useExportCluster } from '@/lib/hooks/use-clusters';
import { ErrorState } from '@/components/ui/feedback';
import { Pagination } from '@/components/ui/data-display';
import { Download, CheckSquare, Square } from 'lucide-react';
import type { 
  Cluster, 
  ClusterSummaryResponse,
  ClusterSummaryListResponse,
  ClustersResponse,
  ClusterFilters as ClusterFiltersType, 
  ClusterSortOptions,
  ClusterListParams
} from '@/types';

export default function ClustersPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const [filters, setFilters] = useState<ClusterFiltersType>({});
  const [sort, setSort] = useState<ClusterSortOptions>({
    field: 'opportunityScore',
    order: 'desc'
  });
  const [selectedCluster, setSelectedCluster] = useState<Cluster | ClusterSummaryResponse | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [keywordsPreviewLimit] = useState(10);
  
  // Selection state
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  
  const exportClusters = useExportClusters();
  const exportSingleCluster = useExportCluster();
  
  const paginationParams: ClusterListParams = {
    page: currentPage,
    page_size: pageSize,
    keywords_preview_limit: keywordsPreviewLimit
  };

  const { data, isLoading, error } = useClustersList(projectId, paginationParams, filters, sort);
  
  // Check if we're using legacy endpoint (filters/non-default sort applied)
  const hasFiltersOrSort = (
    filters && (filters.search || filters.minVolume || filters.maxVolume || filters.minKeywords || filters.maxKeywords || filters.intents?.length) ||
    (sort && sort.field && !(sort.field === 'opportunityScore' && sort.order === 'desc'))
  );

  const handleExportAll = async () => {
    try {
      await exportClusters.mutateAsync({
        projectId,
        exportRequest: {
          export_format: 'csv',
          include_all_keywords: true
        }
      });
    } catch (error) {
      console.error('Export failed:', error);
    }
  };
  
  const handleClusterSelect = (clusterId: string, selected: boolean) => {
    if (selected) {
      setSelectedClusters(prev => [...prev, clusterId]);
    } else {
      setSelectedClusters(prev => prev.filter(id => id !== clusterId));
    }
  };
  
  // Reset page and selection when filters/sort change
  React.useEffect(() => {
    setCurrentPage(1);
    setSelectedClusters([]);
  }, [filters, sort]);
  
  const handleSelectAll = () => {
    const clusters = (data?.clusters || []) as (Cluster | ClusterSummaryResponse)[];
    if (selectedClusters.length === clusters.length) {
      setSelectedClusters([]);
    } else {
      setSelectedClusters(clusters.map((c: Cluster | ClusterSummaryResponse) => c.cluster_id));
    }
  };
  
  const handleQuickExport = async (clusterId: string) => {
    try {
      await exportSingleCluster.mutateAsync({
        projectId,
        clusterId,
        exportRequest: {
          export_format: 'csv',
          include_all_keywords: true
        }
      });
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleViewDetails = (cluster: Cluster | ClusterSummaryResponse) => {
    setSelectedCluster(cluster);
  };

  if (error) {
    return <ErrorState message="Failed to load clusters" />;
  }

  // Show page-level loading while data is being fetched
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-28"></div>
          </div>
        </div>
        
        <div className="h-32 bg-gray-200 rounded"></div>
        
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-8 bg-gray-200 rounded w-40"></div>
          </div>
          
          <div className="h-12 bg-gray-200 rounded"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle different response types based on endpoint used
  const clusters = (data?.clusters || []) as (Cluster | ClusterSummaryResponse)[];
  
  // Both endpoints support pagination, but with different structures
  const pagination = hasFiltersOrSort 
    ? (() => {
        // Legacy endpoint: ClustersResponse format
        const legacyData = data as ClustersResponse;
        if (!legacyData) return null;
        
        const totalPages = Math.ceil((legacyData.total_count || 0) / (legacyData.page_size || 1));
        return {
          page: legacyData.page || 1,
          page_size: legacyData.page_size || 6,
          total_pages: totalPages,
          total_clusters: legacyData.total_count || 0,
          has_next: (legacyData.page || 1) < totalPages,
          has_previous: (legacyData.page || 1) > 1,
        };
      })()
    : ('pagination' in (data || {}) ? (data as ClusterSummaryListResponse).pagination : null);
  
  const allClustersSelected = clusters.length > 0 && selectedClusters.length === clusters.length;

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
            onClick={handleExportAll}
            disabled={exportClusters.isPending}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export All Clusters
          </Button>
          
          {selectedClusters.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Selected ({selectedClusters.length})
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <ClustersSummary 
          clusters={clusters} 
          isLoading={isLoading}
          totalClusters={pagination?.total_clusters}
          isOptimizedView={!hasFiltersOrSort}
        />
        
        {!hasFiltersOrSort && !isLoading && clusters.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded-full flex-shrink-0"></div>
              <p className="text-sm text-green-800">
                <strong>Fast Mode:</strong> Showing {clusters.length} clusters with keyword previews. Click any cluster for complete details, or apply filters/sorting for full data mode.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">All Clusters</h2>
            {clusters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="flex items-center gap-2"
              >
                {allClustersSelected ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                {allClustersSelected ? 'Deselect All' : 'Select All'}
              </Button>
            )}
          </div>
          <ClusterSortSelector sort={sort} onSortChange={setSort} />
        </div>

        {hasFiltersOrSort && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-400 rounded-full flex-shrink-0"></div>
                <p className="text-sm text-amber-800">
                  <strong>Full Data Mode:</strong> Loading all clusters with complete keyword data. This may be slower with large datasets.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters({});
                  setSort({ field: 'opportunityScore', order: 'desc' });
                }}
                className="text-amber-700 border-amber-300 hover:bg-amber-100"
              >
                Return to Fast Mode
              </Button>
            </div>
          </div>
        )}

        <ClusterFilters filters={filters} onFiltersChange={setFilters} />

        <ClustersGrid 
          clusters={clusters} 
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          selectedClusters={selectedClusters}
          onClusterSelect={handleClusterSelect}
          showSelection={true}
          onQuickExport={handleQuickExport}
        />
        
        {pagination && pagination.total_pages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.total_pages}
            onPageChange={setCurrentPage}
            className="mt-6"
          />
        )}
      </div>

      <ClusterDetailModal
        cluster={selectedCluster}
        open={!!selectedCluster}
        onOpenChange={(open) => !open && setSelectedCluster(null)}
      />
      
      <ClusterExportModal
        projectId={projectId}
        selectedClusterIds={selectedClusters}
        open={showExportModal}
        onOpenChange={setShowExportModal}
      />
    </div>
  );
}