/**
 * Types for Dashboard API responses
 */

// Dashboard Summary Response (from /projects/{project_id}/dashboard/summary)
export interface DashboardSummaryResponse {
  total_keywords: number;
  total_volume: number;
  avg_position: number;
  avg_kd: number;
  opportunities_breakdown: {
    low_hanging: OpportunityBreakdown;
    existing: OpportunityBreakdown;
    clustering?: OpportunityBreakdown;
    untapped?: OpportunityBreakdown;
    success?: OpportunityBreakdown;
  };
  top_opportunities: TopOpportunity[];
}

export interface OpportunityBreakdown {
  count: number;
  percentage: number;
  total_volume: number;
}

export interface TopOpportunity {
  keyword: string;
  volume: number;
  position: number;
  potential_traffic: number;
}

// Dashboard Keywords Response (from /projects/{project_id}/dashboard/keywords)
export interface DashboardKeywordsResponse {
  keywords: DashboardKeyword[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    pages: number;
  };
  summary: {
    total_keywords: number;
    total_volume: number;
    avg_position: number;
    opportunities: {
      low_hanging: number;
      existing: number;
      clustering: number;
      untapped: number;
      success: number;
    };
    actions: {
      create: number;
      optimize: number;
      upgrade: number;
      update: number;
      leave: number;
    };
  };
}

export interface DashboardKeyword {
  keyword_id: string;
  keyword: string;
  volume: number;
  kd: number;
  cpc: number;
  position: number;
  url: string;
  intent: 'informational' | 'navigational' | 'commercial' | 'transactional';
  opportunity_type: string;
  action: string;
  sop_score: number;
  relevance_score: number;
  cluster_id: string;
  cluster_name: string;
  is_primary_keyword: boolean;
  is_secondary_keyword: boolean;
}