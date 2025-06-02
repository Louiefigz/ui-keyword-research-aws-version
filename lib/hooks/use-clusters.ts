import { useQuery, useMutation } from '@tanstack/react-query';
import { clustersApi } from '@/lib/api/clusters';
import type { ClusterFilters, ClusterSortOptions, ClusterListParams, SingleClusterExportRequest, MultipleClusterExportRequest, ClusterSummaryListResponse, ClustersResponse } from '@/types';

// Smart hook that chooses the right endpoint based on filters/sort
export function useClustersList(
  projectId: string,
  params?: ClusterListParams,
  filters?: ClusterFilters,
  sort?: ClusterSortOptions
) {
  // Use legacy endpoint if filters or NON-DEFAULT sort are applied
  const hasFiltersOrSort = (
    filters && (filters.search || filters.minVolume || filters.maxVolume || filters.minKeywords || filters.maxKeywords || filters.intents?.length) ||
    (sort && sort.field && !(sort.field === 'opportunityScore' && sort.order === 'desc'))
  );

  return useQuery({
    queryKey: hasFiltersOrSort 
      ? ['clusters-legacy', projectId, filters, sort, params?.page, params?.page_size]
      : ['clusters-list', projectId, params],
    queryFn: async () => {
      if (hasFiltersOrSort) {
        // Use enhanced endpoint for filters/sort with pagination
        const result = await clustersApi.getClusters(projectId, filters, sort, {
          page: params?.page,
          page_size: params?.page_size
        });
        // Normalize to unified response format
        return {
          clusters: result.clusters,
          pagination: null, // Will be handled by main component
          total_count: result.total_count,
          page: result.page,
          page_size: result.page_size
        };
      } else {
        // Use new paginated endpoint
        return await clustersApi.getClustersList(projectId, params);
      }
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // For smooth pagination
  });
}

// Keep existing hook for backward compatibility
export function useClusters(
  projectId: string,
  filters?: ClusterFilters,
  sort?: ClusterSortOptions
) {
  return useQuery({
    queryKey: ['clusters', projectId, filters, sort],
    queryFn: () => clustersApi.getClusters(projectId, filters, sort),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useClusterDetails(projectId: string, clusterId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['cluster', projectId, clusterId],
    queryFn: () => clustersApi.getClusterDetails(projectId, clusterId),
    enabled: (options?.enabled ?? true) && !!projectId && !!clusterId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useClusterKeywords(
  projectId: string, 
  clusterId: string, 
  params?: { page?: number; page_size?: number },
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['cluster-keywords', projectId, clusterId, params?.page, params?.page_size],
    queryFn: () => clustersApi.getClusterKeywords(projectId, clusterId, params),
    enabled: (options?.enabled ?? true) && !!projectId && !!clusterId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // For smooth pagination
  });
}

// Export hooks
export function useExportCluster() {
  return useMutation({
    mutationFn: ({ projectId, clusterId, exportRequest }: {
      projectId: string;
      clusterId: string;
      exportRequest: SingleClusterExportRequest;
    }) => clustersApi.exportCluster(projectId, clusterId, exportRequest),
  });
}

export function useExportClusters() {
  return useMutation({
    mutationFn: ({ projectId, exportRequest }: {
      projectId: string;
      exportRequest: MultipleClusterExportRequest;
    }) => clustersApi.exportClusters(projectId, exportRequest),
  });
}