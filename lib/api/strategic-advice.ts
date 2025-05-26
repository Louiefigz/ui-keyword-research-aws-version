import { apiClient } from './client';
import type { 
  StrategicAdviceResponse, 
  OpportunityAnalysisResponse,
  StrategicAdviceFilters,
  ContentStrategyAdvice,
  CompetitiveAnalysisData,
  ROIProjection
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

/**
 * Fetch content strategy details
 */
export async function getContentStrategy(
  projectId: string,
  options?: {
    include_templates?: boolean;
    include_calendar?: boolean;
    timeframe?: '3_months' | '6_months' | '12_months';
  }
): Promise<ContentStrategyAdvice> {
  const params = new URLSearchParams();
  
  if (options?.include_templates) {
    params.append('include_templates', 'true');
  }
  if (options?.include_calendar) {
    params.append('include_calendar', 'true');
  }
  if (options?.timeframe) {
    params.append('timeframe', options.timeframe);
  }

  const queryString = params.toString();
  const url = `/projects/${projectId}/strategic-advice/content-strategy${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiClient.get<ContentStrategyAdvice>(url);
  return response.data;
}

/**
 * Fetch competitive analysis data
 */
export async function getCompetitiveAnalysis(
  projectId: string,
  filters?: {
    competitors?: string[];
    min_gap_score?: number;
    include_market_share?: boolean;
    limit?: number;
  }
): Promise<CompetitiveAnalysisData> {
  const params = new URLSearchParams();
  
  if (filters?.competitors?.length) {
    params.append('competitors', filters.competitors.join(','));
  }
  if (filters?.min_gap_score !== undefined) {
    params.append('min_gap_score', filters.min_gap_score.toString());
  }
  if (filters?.include_market_share !== undefined) {
    params.append('include_market_share', filters.include_market_share.toString());
  }
  if (filters?.limit !== undefined) {
    params.append('limit', filters.limit.toString());
  }

  const queryString = params.toString();
  const url = `/projects/${projectId}/strategic-advice/competitive-analysis${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiClient.get<CompetitiveAnalysisData>(url);
  return response.data;
}

/**
 * Fetch ROI projections
 */
export async function getROIProjections(
  projectId: string,
  options?: {
    scenarios?: Array<'best' | 'expected' | 'worst'>;
    timeframes?: Array<'3_months' | '6_months' | '12_months'>;
    include_monthly?: boolean;
  }
): Promise<ROIProjection[]> {
  const params = new URLSearchParams();
  
  if (options?.scenarios?.length) {
    params.append('scenarios', options.scenarios.join(','));
  }
  if (options?.timeframes?.length) {
    params.append('timeframes', options.timeframes.join(','));
  }
  if (options?.include_monthly !== undefined) {
    params.append('include_monthly', options.include_monthly.toString());
  }

  const queryString = params.toString();
  const url = `/projects/${projectId}/strategic-advice/roi-projections${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiClient.get<ROIProjection[]>(url);
  return response.data;
}

/**
 * Export specific strategic advice sections
 */
export async function exportStrategicSection(
  projectId: string,
  section: 'competitive' | 'content' | 'roi' | 'opportunities',
  format: 'csv' | 'pdf' | 'xlsx' = 'csv'
): Promise<Blob> {
  const url = `/projects/${projectId}/strategic-advice/${section}/export?format=${format}`;
  
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