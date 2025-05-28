import { apiClient } from './client';
import type { Cluster, ClustersResponse, ClusterFilters, ClusterSortOptions } from '@/types';
import { transformApiResponse } from '@/lib/utils/api-transforms';

export const clustersApi = {
  getClusters: async (projectId: string, filters?: ClusterFilters, sort?: ClusterSortOptions) => {
    const params = new URLSearchParams();
    
    // Filters - note API only supports min_size and sort_by according to docs
    if (filters?.minKeywords) params.append('min_size', filters.minKeywords.toString());
    
    // Sort - API expects sort_by field
    if (sort?.field) {
      // Map frontend sort fields to API fields
      const sortFieldMap: Record<string, string> = {
        'name': 'name',
        'totalVolume': 'total_volume',
        'keywordCount': 'size',
        'opportunityScore': 'avg_volume',
        'difficulty': 'avg_volume' // API doesn't have difficulty sort
      };
      params.append('sort_by', sortFieldMap[sort.field] || 'size');
    }
    
    const queryString = params.toString();
    const url = `/projects/${projectId}/clusters${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get(url);
    return transformApiResponse<ClustersResponse>(response.data);
  },

  getClusterDetails: async (projectId: string, clusterId: string) => {
    const response = await apiClient.get(
      `/projects/${projectId}/clusters/${clusterId}`
    );
    return transformApiResponse<Cluster>(response.data);
  },

  // Note: Export endpoints are not documented in the API
  // Commenting out until API documentation confirms these endpoints exist
  
  // exportCluster: async (projectId: string, clusterId: string, format: 'csv' | 'xlsx' = 'csv') => {
  //   const response = await apiClient.get(
  //     `/clusters/${clusterId}/export?format=${format}`,
  //     { responseType: 'blob' }
  //   );
  //   
  //   // Create download link
  //   const url = window.URL.createObjectURL(new Blob([response.data]));
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.setAttribute('download', `cluster-${clusterId}.${format}`);
  //   document.body.appendChild(link);
  //   link.click();
  //   link.remove();
  //   window.URL.revokeObjectURL(url);
  // },

  // exportAllClusters: async (projectId: string, format: 'csv' | 'xlsx' = 'csv') => {
  //   const response = await apiClient.get(
  //     `/clusters/export?project_id=${projectId}&format=${format}`,
  //     { responseType: 'blob' }
  //   );
  //   
  //   // Create download link
  //   const url = window.URL.createObjectURL(new Blob([response.data]));
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.setAttribute('download', `all-clusters-${projectId}.${format}`);
  //   document.body.appendChild(link);
  //   link.click();
  //   link.remove();
  //   window.URL.revokeObjectURL(url);
  // }
};