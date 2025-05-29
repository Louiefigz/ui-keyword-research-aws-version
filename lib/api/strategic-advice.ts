import { apiClient } from './client';
import { transformApiResponse } from '@/lib/utils/api-transforms';
import type { 
  StrategicAdviceResponse, 
  OpportunityAnalysisResponse,
  StrategicAdviceFilters,
  ContentStrategyAdvice,
  CompetitiveAnalysisData
} from '@/types/api.types';

/**
 * Fetch comprehensive strategic advice for a project
 */
export async function getStrategicAdvice(
  projectId: string,
  filters?: StrategicAdviceFilters
): Promise<StrategicAdviceResponse> {
  const params = new URLSearchParams();
  
  // API only supports include_competitors parameter
  if (filters?.include_projections) {
    params.append('include_competitors', 'true');
  }

  const queryString = params.toString();
  const url = `/strategic-advice/projects/${projectId}${queryString ? `?${queryString}` : ''}`;
  
  // UPDATED: Extended timeout for AI processing (up to 5 minutes)
  const response = await apiClient.get(url, {
    timeout: 5 * 60 * 1000 // 5 minutes for AI-enhanced strategic advice
  });
  return transformApiResponse<StrategicAdviceResponse>(response.data);
}

/**
 * Fetch opportunity analysis for a project
 */
export async function getOpportunityAnalysis(
  projectId: string,
  filters?: {
    opportunity_type?: 'low_hanging' | 'existing' | 'gaps';
    min_volume?: number;
    limit?: number;
  }
): Promise<OpportunityAnalysisResponse> {
  const params = new URLSearchParams();
  
  if (filters?.limit !== undefined) {
    params.append('limit', filters.limit.toString());
  }
  if (filters?.min_volume !== undefined) {
    params.append('min_volume', filters.min_volume.toString());
  }
  if (filters?.opportunity_type) {
    params.append('opportunity_type', filters.opportunity_type);
  }

  const queryString = params.toString();
  const url = `/strategic-advice/projects/${projectId}/opportunities${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiClient.get(url);
  return transformApiResponse<OpportunityAnalysisResponse>(response.data);
}

/**
 * Export strategic advice report
 */
export async function exportStrategicAdviceReport(
  projectId: string,
  format: 'pdf' | 'excel' = 'pdf'
): Promise<Blob> {
  const url = `/strategic-advice/projects/${projectId}/export?format=${format}`;
  
  const response = await apiClient.get(url, {
    responseType: 'blob',
  });

  return response.data;
}

/**
 * Fetch content strategy details
 */
export async function getContentStrategy(
  projectId: string,
  options?: {
    max_clusters?: number;
    timeline_months?: number;
  }
): Promise<ContentStrategyAdvice> {
  const params = new URLSearchParams();
  
  if (options?.max_clusters !== undefined) {
    params.append('max_clusters', options.max_clusters.toString());
  }
  if (options?.timeline_months !== undefined) {
    params.append('timeline_months', options.timeline_months.toString());
  }

  const queryString = params.toString();
  const url = `/strategic-advice/projects/${projectId}/content-strategy${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiClient.get(url);
  return transformApiResponse<ContentStrategyAdvice>(response.data);
}

/**
 * Fetch competitive analysis data
 */
export async function getCompetitiveAnalysis(
  projectId: string
): Promise<CompetitiveAnalysisData> {
  // API doesn't support any query parameters for this endpoint
  const url = `/strategic-advice/projects/${projectId}/competitive-analysis`;
  
  const response = await apiClient.get(url);
  return transformApiResponse<CompetitiveAnalysisData>(response.data);
}


/**
 * Export specific strategic advice sections
 */
export async function exportStrategicSection(
  projectId: string,
  section: 'competitive' | 'content' | 'opportunities',
  format: 'csv' | 'pdf' | 'xlsx' = 'csv'
): Promise<Blob> {
  const url = `/strategic-advice/projects/${projectId}/${section}/export?format=${format}`;
  
  const response = await apiClient.get(url, {
    responseType: 'blob',
  });

  return response.data;
} 