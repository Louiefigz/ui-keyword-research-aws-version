import { apiClient } from './client';
import type { 
  StrategicAdviceResponse, 
  OpportunityAnalysisResponse,
  StrategicAdviceFilters 
} from '@/types/api.types';

/**
 * Fetch comprehensive strategic advice for a project
 */
export async function getStrategicAdvice(
  projectId: string,
  filters?: StrategicAdviceFilters
): Promise<StrategicAdviceResponse> {
  const params = new URLSearchParams();
  
  if (filters?.timeframe) {
    params.append('timeframe', filters.timeframe);
  }
  if (filters?.focus_areas?.length) {
    params.append('focus_areas', filters.focus_areas.join(','));
  }
  if (filters?.priority_level) {
    params.append('priority_level', filters.priority_level);
  }
  if (filters?.include_projections !== undefined) {
    params.append('include_projections', filters.include_projections.toString());
  }

  const queryString = params.toString();
  const url = `/projects/${projectId}/strategic-advice${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiClient.get<StrategicAdviceResponse>(url);
  return response.data;
}

/**
 * Fetch opportunity analysis for a project
 */
export async function getOpportunityAnalysis(
  projectId: string,
  filters?: {
    opportunity_type?: 'quick_wins' | 'content_gaps' | 'technical' | 'all';
    min_impact_score?: number;
    max_difficulty?: number;
    limit?: number;
  }
): Promise<OpportunityAnalysisResponse> {
  const params = new URLSearchParams();
  
  if (filters?.opportunity_type) {
    params.append('opportunity_type', filters.opportunity_type);
  }
  if (filters?.min_impact_score !== undefined) {
    params.append('min_impact_score', filters.min_impact_score.toString());
  }
  if (filters?.max_difficulty !== undefined) {
    params.append('max_difficulty', filters.max_difficulty.toString());
  }
  if (filters?.limit !== undefined) {
    params.append('limit', filters.limit.toString());
  }

  const queryString = params.toString();
  const url = `/projects/${projectId}/opportunities${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiClient.get<OpportunityAnalysisResponse>(url);
  return response.data;
}

/**
 * Export strategic advice report
 */
export async function exportStrategicAdviceReport(
  projectId: string,
  format: 'pdf' | 'excel' = 'pdf'
): Promise<Blob> {
  const url = `/projects/${projectId}/strategic-advice/export?format=${format}`;
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Export failed: ${response.statusText}`);
  }

  return response.blob();
} 