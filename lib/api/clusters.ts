import { apiClient } from './client';
import type { Cluster, ApiResponse, ClusterFilters, ClusterSortOptions } from '@/types';

export const clustersApi = {
  getClusters: async (projectId: string, filters?: ClusterFilters, sort?: ClusterSortOptions) => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.minVolume) params.append('minVolume', filters.minVolume.toString());
    if (filters?.maxVolume) params.append('maxVolume', filters.maxVolume.toString());
    if (filters?.minKeywords) params.append('minKeywords', filters.minKeywords.toString());
    if (filters?.maxKeywords) params.append('maxKeywords', filters.maxKeywords.toString());
    if (filters?.intents?.length) params.append('intents', filters.intents.join(','));
    
    if (sort?.field) params.append('sortField', sort.field);
    if (sort?.order) params.append('sortOrder', sort.order);
    
    const queryString = params.toString();
    const url = `/projects/${projectId}/clusters${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<ApiResponse<Cluster[]>>(url);
    return response.data;
  },

  getClusterDetails: async (projectId: string, clusterId: string) => {
    const response = await apiClient.get<ApiResponse<Cluster>>(
      `/projects/${projectId}/clusters/${clusterId}`
    );
    return response.data;
  },

  exportCluster: async (projectId: string, clusterId: string, format: 'csv' | 'xlsx' = 'csv') => {
    const response = await apiClient.get(
      `/projects/${projectId}/clusters/${clusterId}/export?format=${format}`,
      { responseType: 'blob' }
    );
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cluster-${clusterId}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  exportAllClusters: async (projectId: string, format: 'csv' | 'xlsx' = 'csv') => {
    const response = await apiClient.get(
      `/projects/${projectId}/clusters/export?format=${format}`,
      { responseType: 'blob' }
    );
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `all-clusters-${projectId}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};