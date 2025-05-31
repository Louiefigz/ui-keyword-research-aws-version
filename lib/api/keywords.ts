import { apiClient } from './client';
import {
  DashboardKeyword,
  ProjectStats,
  KeywordFilters,
  SortOptions,
  PaginatedResponse,
} from '@/types/api.types';
import { transformApiResponse, transformDashboardSummary } from '@/lib/utils/api-transforms';

export interface GetKeywordsParams {
  projectId: string;
  filters?: KeywordFilters;
  sort?: SortOptions;
  page?: number;
  limit?: number;
}

// Map opportunity levels to API categories
const OPPORTUNITY_CATEGORY_MAP: Record<string, string> = {
  'low_hanging': 'Low-Hanging Fruit',
  'existing': 'Existing',
  'clustering': 'Clustering Opportunity',
  'untapped': 'Untapped',
  'success': 'Success'
};

// Helper to add filter params
function addFilterParams(params: URLSearchParams, filters: KeywordFilters) {
  if (filters.search) params.append('search', filters.search);
  if (filters.minVolume) params.append('volume_min', filters.minVolume.toString());
  if (filters.maxVolume) params.append('volume_max', filters.maxVolume.toString());
  if (filters.minDifficulty) params.append('kd_min', filters.minDifficulty.toString());
  if (filters.maxDifficulty) params.append('kd_max', filters.maxDifficulty.toString());
  if (filters.intent?.length) params.append('intent', filters.intent[0]);
  if (filters.clusterId) params.append('cluster_id', filters.clusterId);
  
  if (filters.opportunityLevel?.length) {
    const mappedCategory = OPPORTUNITY_CATEGORY_MAP[filters.opportunityLevel[0]] || filters.opportunityLevel[0];
    params.append('opportunity_category', mappedCategory);
  }
}

// Helper function to build query params
function buildKeywordParams(
  filters: KeywordFilters, 
  sort: SortOptions, 
  page: number, 
  limit: number
): URLSearchParams {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: limit.toString(),
    sort_by: sort.field,
    sort_order: sort.direction === 'asc' ? 'asc' : 'desc',
    include_aggregations: 'true'
  });

  addFilterParams(params, filters);
  
  return params;
}

/**
 * Fetch keywords for a project with optional filtering and sorting
 */
export async function getKeywords({
  projectId,
  filters = {},
  sort = { field: 'total_points', direction: 'desc' },
  page = 1,
  limit = 20,
}: GetKeywordsParams): Promise<PaginatedResponse<DashboardKeyword>> {
  const params = buildKeywordParams(filters, sort, page, limit);

  try {
    const response = await apiClient.get(
      `/projects/${projectId}/dashboard/keywords?${params.toString()}`
    );
    
    return transformApiResponse<PaginatedResponse<DashboardKeyword>>(response.data);
  } catch (error) {
    console.error('Error fetching keywords:', error);
    return {
      data: [],
      pagination: {
        page: page,
        limit: limit,
        total: 0,
        totalPages: 0
      }
    };
  }
}

/**
 * Fetch project statistics for dashboard summary
 */
export async function getProjectStats(projectId: string): Promise<ProjectStats> {
  try {
    const response = await apiClient.get(
      `/projects/${projectId}/dashboard/summary`
    );
    
    // Transform the dashboard summary response
    const summary = transformDashboardSummary(response.data);
    
    // Return as ProjectStats - the transform function already maps the fields
    return summary as ProjectStats;
  } catch (error) {
    console.error('Error fetching project stats:', error);
    // Return default stats to prevent error boundary
    return {
      totalKeywords: 0,
      totalClusters: 0,
      avgOpportunityScore: 0,
      topOpportunityKeywords: 0,
      lastAnalysisDate: null,
      aggregations: {
        totalVolume: 0,
        avgPosition: 0,
        opportunityDistribution: {},
        actionDistribution: {},
        intentDistribution: {},
        pointsDistribution: {},
        relevanceDistribution: {},
        trafficMetrics: {}
      }
    } as ProjectStats;
  }
}

/**
 * Fetch a single keyword by ID
 * NOTE: This endpoint is not implemented in the backend
 * Use the dashboard endpoints to fetch keyword data
 */
// export async function getKeyword(projectId: string, keywordId: string): Promise<Keyword> {
//   const response = await apiClient.get<ApiResponse<Keyword>>(
//     `/projects/${projectId}/keywords/${keywordId}`
//   );
//   
//   return response.data.data;
// }

/**
 * Update keyword scores or classification
 * NOTE: This endpoint is not implemented in the backend
 * Use CSV upload with update strategy for bulk updates
 */
// export async function updateKeyword(
//   projectId: string, 
//   keywordId: string, 
//   updates: Partial<Pick<Keyword, 'scores' | 'classification'>>
// ): Promise<Keyword> {
//   const response = await apiClient.patch<ApiResponse<Keyword>>(
//     `/projects/${projectId}/keywords/${keywordId}`,
//     updates
//   );
//   
//   return response.data.data;
// }

/**
 * Bulk update keywords
 * NOTE: This endpoint is not implemented in the backend
 * Use /projects/{id}/updates/csv endpoint for bulk updates via CSV
 */
// export async function bulkUpdateKeywords(
//   projectId: string,
//   updates: Array<{
//     keywordId: string;
//     updates: Partial<Pick<Keyword, 'scores' | 'classification'>>;
//   }>
// ): Promise<{ updated: number; errors: string[] }> {
//   const response = await apiClient.post<ApiResponse<{ updated: number; errors: string[] }>>(
//     `/projects/${projectId}/keywords/bulk-update`,
//     { updates }
//   );
//   
//   return response.data.data;
// }

/**
 * Export keywords data
 * Note: This uses the general exports endpoint with job-based processing
 */
export async function exportKeywords(
  projectId: string,
  options: {
    format: 'csv' | 'xlsx' | 'json';
    filters?: KeywordFilters;
    columns?: string[];
  }
): Promise<{ jobId: string }> {
  // Build filters object for the API
  const filters: Record<string, string | number | string[]> = {};
  
  if (options.filters?.search) {
    filters.search = options.filters.search;
  }
  if (options.filters?.minVolume) {
    filters.volume_min = options.filters.minVolume;
  }
  if (options.filters?.maxVolume) {
    filters.volume_max = options.filters.maxVolume;
  }
  if (options.filters?.opportunityLevel?.length) {
    // Map to API's opportunity_type values
    filters.opportunity_type = options.filters.opportunityLevel.map(level => 
      level === 'high' ? 'low-hanging-fruit' : 
      level === 'medium' ? 'existing' : 
      level === 'low' ? 'untapped' : level
    );
  }

  const response = await apiClient.post(`/projects/${projectId}/exports`, {
    project_id: projectId,
    format: options.format,
    filters,
    options: {
      include_clusters: true,
      client_format: false
    }
  });
  
  return transformApiResponse<{ jobId: string }>(response.data);
}