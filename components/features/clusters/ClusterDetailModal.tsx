'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/overlays';
import { Button, Skeleton } from '@/components/ui/base';
import { Tabs } from '@/components/ui/data-display/tabs-custom';
import { ClusterOverview } from './ClusterOverview';
import { ClusterKeywordsTable } from './ClusterKeywordsTable';
import { ClusterRecommendations } from './ClusterRecommendations';
import { useClusterDetails, useClusterKeywords } from '@/lib/hooks/use-clusters';
import { Download, X } from 'lucide-react';
import type { Cluster, ClusterSummaryResponse } from '@/types';

interface ClusterDetailModalProps {
  cluster: Cluster | ClusterSummaryResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClusterDetailModal({ cluster, open, onOpenChange }: ClusterDetailModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [keywordsPage, setKeywordsPage] = useState(1);
  
  // Reset tab to overview and keywords page when modal opens
  React.useEffect(() => {
    if (open) {
      setActiveTab('overview');
      setKeywordsPage(1);
    }
  }, [open]);

  // Determine if we need to fetch full cluster details
  const shouldFetchDetails = cluster && 'preview_keywords' in cluster;
  
  // Fetch full cluster details if we only have a summary response
  const { data: fullClusterData, isLoading, error: fetchError } = useClusterDetails(
    cluster?.project_id || '',
    cluster?.cluster_id || '',
    { enabled: Boolean(shouldFetchDetails && open) }
  );
  
  // Fetch paginated keywords for this cluster
  const { data: keywordsData, isLoading: isLoadingKeywords } = useClusterKeywords(
    cluster?.project_id || '',
    cluster?.cluster_id || '',
    { page: keywordsPage, page_size: 10 },
    { enabled: Boolean(cluster && open) }
  );
  
  
  // Use full cluster data if we fetched it, otherwise use what was passed
  const clusterData: Cluster | null = shouldFetchDetails 
    ? fullClusterData || null 
    : (cluster as Cluster) || null;

  if (!cluster) return null;
  
  // Show error state if fetching full cluster details failed
  if (shouldFetchDetails && fetchError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <div className="max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-semibold">Error Loading Cluster Details</h2>
              <p className="text-muted-foreground mt-1">Failed to load full cluster information</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 p-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">
                {fetchError instanceof Error ? fetchError.message : 'Unable to load cluster details. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
  
  // Show loading state while fetching full cluster details
  if (shouldFetchDetails && (isLoading || !clusterData)) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <div className="max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24" />
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
  
  if (!clusterData) return null;

  const handleExport = (_format: 'csv' | 'xlsx') => {
    // Export functionality will be implemented when API endpoints are available
    // TODO: Implement export when API endpoints are available
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: <ClusterOverview cluster={clusterData} />
    },
    {
      id: 'keywords',
      label: `Keywords (${cluster.keyword_count || clusterData.keywords?.length || 0})`,
      content: (
        <ClusterKeywordsTable 
          keywords={keywordsData?.keywords || clusterData.keywords || []} 
          pagination={keywordsData?.pagination}
          isLoading={isLoadingKeywords}
          onPageChange={setKeywordsPage}
        />
      )
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      content: <ClusterRecommendations cluster={clusterData} />
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold">{clusterData.name}</h2>
            <p className="text-muted-foreground mt-1">{clusterData.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              disabled={false}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            tabs={tabs}
            className="w-full"
          />
        </div>
      </div>
    </Dialog>
  );
}