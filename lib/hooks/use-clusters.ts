import { useQuery, useMutation } from '@tanstack/react-query';
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

export function useExportCluster() {
  return useMutation({
    mutationFn: ({ 
      projectId, 
      clusterId, 
      format 
    }: { 
      projectId: string; 
      clusterId: string; 
      format: 'csv' | 'xlsx' 
    }) => clustersApi.exportCluster(projectId, clusterId, format),
    onSuccess: () => {
      // Optionally show success notification
    },
    onError: (error) => {
      console.error('Failed to export cluster:', error);
    }
  });
}

export function useExportAllClusters() {
  return useMutation({
    mutationFn: ({ 
      projectId, 
      format 
    }: { 
      projectId: string; 
      format: 'csv' | 'xlsx' 
    }) => clustersApi.exportAllClusters(projectId, format),
    onSuccess: () => {
      // Optionally show success notification
    },
    onError: (error) => {
      console.error('Failed to export clusters:', error);
    }
  });
}