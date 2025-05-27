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
  id: string;
  keyword: string;
  metrics: KeywordMetrics;
  scores: KeywordScores;
  classification: KeywordClassification;
  cluster?: {
    id: string;
    name: string;
    size: number;
  };
  created_at: string;
  updated_at: string;
}

export interface KeywordMetrics {
  volume: number;
  keyword_difficulty: number;
  cpc: number;
  position?: number;
  url?: string;
  traffic?: number;
  lowest_dr?: number;
}

export interface KeywordScores {
  volume_score: number;
  kd_score: number;
  cpc_score: number;
  position_score: number;
  intent_score: number;
  relevance_score: number;
  word_count_score: number;
  lowest_dr_score: number;
  total_points: number;
}

export interface KeywordClassification {
  opportunity: 'low_hanging' | 'existing' | 'clustering' | 'untapped' | 'success';
  action: 'create' | 'optimize' | 'upgrade' | 'update' | 'leave';
  intent: 'informational' | 'navigational' | 'commercial' | 'transactional';
  priority: number;
}