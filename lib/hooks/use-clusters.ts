import { useQuery } from '@tanstack/react-query';
import { clustersApi } from '@/lib/api/clusters';
import type { ClusterFilters, ClusterSortOptions } from '@/types';

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

export function useClusterDetails(projectId: string, clusterId: string) {
  return useQuery({
    queryKey: ['cluster', projectId, clusterId],
    queryFn: () => clustersApi.getClusterDetails(projectId, clusterId),
    enabled: !!projectId && !!clusterId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Export functions are commented out in the API until endpoints are confirmed
// export function useExportCluster() { ... }
// export function useExportAllClusters() { ... }