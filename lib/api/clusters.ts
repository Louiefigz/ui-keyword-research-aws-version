import { apiClient } from './client';
import type { 
  Cluster, 
  ClustersResponse, 
  ClusterSummaryListResponse,
  ClusterKeywordsResponse,
  ClusterListParams,
  SingleClusterExportRequest,
  MultipleClusterExportRequest,
  ClusterFilters, 
  ClusterSortOptions 
} from '@/types';
import { transformApiResponse } from '@/lib/utils/api-transforms';

export const clustersApi = {
  // New paginated clusters list with keyword previews - PAGINATION ONLY
  getClustersList: async (
    projectId: string, 
    params?: ClusterListParams
  ) => {
    const queryParams = new URLSearchParams();
    
    // Set defaults as specified in integration guide
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 6;
    const keywordsPreviewLimit = params?.keywords_preview_limit ?? 10;
    
    // Only pagination parameters - no filters or sort supported
    queryParams.append('page', page.toString());
    queryParams.append('page_size', pageSize.toString());
    queryParams.append('keywords_preview_limit', keywordsPreviewLimit.toString());
    
    const queryString = queryParams.toString();
    const url = `/projects/${projectId}/clusters${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get(url);
    return transformApiResponse<ClusterSummaryListResponse>(response.data);
  },

  // Keep existing method for backward compatibility - uses enhanced endpoint with pagination
  getClusters: async (
    projectId: string, 
    filters?: ClusterFilters, 
    sort?: ClusterSortOptions,
    paginationParams?: { page?: number; page_size?: number }
  ) => {
    const params = new URLSearchParams();
    
    // Pagination parameters
    if (paginationParams?.page) params.append('page', paginationParams.page.toString());
    if (paginationParams?.page_size) params.append('page_size', paginationParams.page_size.toString());
    
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
    const url = `/projects/${projectId}/clusters/enhanced${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get(url);
    return transformApiResponse<ClustersResponse>(response.data);
  },

  getClusterDetails: async (projectId: string, clusterId: string) => {
    const response = await apiClient.get(
      `/projects/${projectId}/clusters/${clusterId}`
    );
    return transformApiResponse<Cluster>(response.data);
  },

  // Get paginated keywords for a specific cluster
  getClusterKeywords: async (
    projectId: string, 
    clusterId: string, 
    params?: { page?: number; page_size?: number }
  ) => {
    const queryParams = new URLSearchParams();
    
    // Default pagination for cluster keywords
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 10;
    
    queryParams.append('page', page.toString());
    queryParams.append('page_size', pageSize.toString());
    
    const queryString = queryParams.toString();
    const url = `/projects/${projectId}/clusters/${clusterId}/keywords${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get(url);
    return transformApiResponse<ClusterKeywordsResponse>(response.data);
  },

  // New export endpoints based on the integration guide
  exportCluster: async (projectId: string, clusterId: string, exportRequest: SingleClusterExportRequest) => {
    const response = await apiClient.post(
      `/projects/${projectId}/clusters/${clusterId}/export`,
      exportRequest,
      { responseType: 'blob' }
    );
    
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cluster_${clusterId}_export.${exportRequest.export_format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  exportClusters: async (projectId: string, exportRequest: MultipleClusterExportRequest) => {
    const response = await apiClient.post(
      `/projects/${projectId}/clusters/export`,
      exportRequest,
      { responseType: 'blob' }
    );
    
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = exportRequest.cluster_ids?.length 
      ? `selected_clusters_export.${exportRequest.export_format}`
      : `all_clusters_export.${exportRequest.export_format}`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};