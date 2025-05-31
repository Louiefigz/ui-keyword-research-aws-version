// Project-related Types

export interface Project {
  id: string;
  name: string;
  business_description: string;
  business_type?: string | null;
  target_location?: string | null;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
  keyword_count: number;
  cluster_count: number;
  last_analysis_at?: string | null;
  settings?: ProjectSettings;
  stats?: ProjectStats;
}

export interface ProjectSettings {
  seo_factors: SEOFactors;
  target_metrics: TargetMetrics;
  export_settings: ExportSettings;
}

export interface SEOFactors {
  authority_weight: number;
  relevance_weight: number;
  experience_weight: number;
  market_demand_weight: number;
  business_impact_weight: number;
}

export interface TargetMetrics {
  min_search_volume: number;
  max_keyword_difficulty: number;
  min_cpc: number;
  target_conversion_rate: number;
  average_order_value: number;
}

export interface ExportSettings {
  include_metrics: boolean;
  include_scores: boolean;
  include_clusters: boolean;
  format: 'csv' | 'xlsx' | 'json';
}

export interface ProjectStats {
  totalKeywords: number;
  totalClusters?: number;
  avgOpportunityScore?: number;
  topOpportunityKeywords?: number;
  lastAnalysisDate?: string | null;
  // Additional fields from dashboard summary
  avgSearchVolume?: number;
  avgKeywordDifficulty?: number;
  avgPosition?: number;
  totalVolume?: number;
  aggregations?: {
    totalVolume?: number;
    avgPosition?: number;
    opportunityDistribution?: Record<string, number>;
    actionDistribution?: Record<string, number>;
    intentDistribution?: Record<string, number>;
    pointsDistribution?: Record<string, number>;
    relevanceDistribution?: Record<string, number>;
    trafficMetrics?: Record<string, number>;
  };
  opportunitiesBreakdown?: {
    lowHanging?: OpportunityBreakdown;
    existing?: OpportunityBreakdown;
    clustering?: OpportunityBreakdown;
    untapped?: OpportunityBreakdown;
    success?: OpportunityBreakdown;
  };
  topOpportunities?: TopOpportunity[];
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