import { apiClient } from './client';
import {
  Keyword,
  ProjectStats,
  KeywordFilters,
  SortOptions,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api.types';

export interface GetKeywordsParams {
  projectId: string;
  filters?: KeywordFilters;
  sort?: SortOptions;
  page?: number;
  limit?: number;
}

/**
 * Fetch keywords for a project with optional filtering and sorting
 */
export async function getKeywords({
  projectId,
  filters = {},
  sort = { field: 'opportunity_score', direction: 'desc' },
  page = 1,
  limit = 25,
}: GetKeywordsParams): Promise<PaginatedResponse<Keyword>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sort_field: sort.field,
    sort_direction: sort.direction,
  });

  // Add filters to params
  if (filters.search) {
    params.append('search', filters.search);
  }
  if (filters.minVolume) {
    params.append('min_volume', filters.minVolume.toString());
  }
  if (filters.maxVolume) {
    params.append('max_volume', filters.maxVolume.toString());
  }
  if (filters.minDifficulty) {
    params.append('min_difficulty', filters.minDifficulty.toString());
  }
  if (filters.maxDifficulty) {
    params.append('max_difficulty', filters.maxDifficulty.toString());
  }
  if (filters.intent?.length) {
    filters.intent.forEach(intent => params.append('intent', intent));
  }
  if (filters.opportunityLevel?.length) {
    filters.opportunityLevel.forEach(level => params.append('opportunity_level', level));
  }
  if (filters.clusterId) {
    params.append('cluster_id', filters.clusterId);
  }

  const response = await apiClient.get<PaginatedResponse<Keyword>>(
    `/projects/${projectId}/keywords?${params.toString()}`
  );
  
  return response.data;
}

/**
 * Fetch project statistics for dashboard summary
 */
export async function getProjectStats(projectId: string): Promise<ProjectStats> {
  const response = await apiClient.get<ApiResponse<ProjectStats>>(
    `/projects/${projectId}/stats`
  );
  
  return response.data.data;
}

/**
 * Fetch a single keyword by ID
 */
export async function getKeyword(projectId: string, keywordId: string): Promise<Keyword> {
  const response = await apiClient.get<ApiResponse<Keyword>>(
    `/projects/${projectId}/keywords/${keywordId}`
  );
  
  return response.data.data;
}

/**
 * Update keyword scores or classification
 */
export async function updateKeyword(
  projectId: string, 
  keywordId: string, 
  updates: Partial<Pick<Keyword, 'scores' | 'classification'>>
): Promise<Keyword> {
  const response = await apiClient.patch<ApiResponse<Keyword>>(
    `/projects/${projectId}/keywords/${keywordId}`,
    updates
  );
  
  return response.data.data;
}

/**
 * Bulk update keywords
 */
export async function bulkUpdateKeywords(
  projectId: string,
  updates: Array<{
    keywordId: string;
    updates: Partial<Pick<Keyword, 'scores' | 'classification'>>;
  }>
): Promise<{ updated: number; errors: string[] }> {
  const response = await apiClient.post<ApiResponse<{ updated: number; errors: string[] }>>(
    `/projects/${projectId}/keywords/bulk-update`,
    { updates }
  );
  
  return response.data.data;
}

/**
 * Export keywords data
 */
export async function exportKeywords(
  projectId: string,
  options: {
    format: 'csv' | 'xlsx' | 'json';
    filters?: KeywordFilters;
    columns?: string[];
  }
): Promise<Blob> {
  const params = new URLSearchParams({
    format: options.format,
  });

  if (options.columns?.length) {
    options.columns.forEach(col => params.append('columns', col));
  }

  // Add filters
  if (options.filters?.search) {
    params.append('search', options.filters.search);
  }
  if (options.filters?.opportunityLevel?.length) {
    options.filters.opportunityLevel.forEach(level => 
      params.append('opportunity_level', level)
    );
  }

  const response = await apiClient.get(
    `/projects/${projectId}/keywords/export?${params.toString()}`,
    { responseType: 'blob' }
  );
  
  return response.data;
}