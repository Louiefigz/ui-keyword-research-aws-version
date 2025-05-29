// Keyword-related Types

export interface Keyword {
  id: string;
  keyword: string;
  metrics: KeywordMetrics;
  scores: KeywordScores;
  classification: KeywordClassification;
  cluster?: ClusterReference;
  created_at: string;
  updated_at: string;
}

// Dashboard Keyword Response - matches API response exactly
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

export interface KeywordMetrics {
  search_volume: number;
  keyword_difficulty: number;
  cpc: number;
  competition: number;
  intent: 'informational' | 'navigational' | 'commercial' | 'transactional';
  trend: 'rising' | 'stable' | 'declining';
  position?: number;
}

export interface KeywordScores {
  authority_score: number;
  relevance_score: number;
  experience_score: number;
  market_demand_score: number;
  business_impact_score: number;
  opportunity_score: number;
  priority_score: number;
  potential_value: number;
}

export interface KeywordClassification {
  opportunity_level: 'high' | 'medium' | 'low';
  recommended_action: 'immediate' | 'short-term' | 'long-term' | 'monitor';
  content_type: 'blog' | 'landing-page' | 'product' | 'category' | 'faq';
  estimated_effort: 'low' | 'medium' | 'high';
}

export interface ClusterReference {
  id: string;
  name: string;
  theme: string;
  keyword_count?: number;
}

// Cluster Keyword type - matches the actual API response for keywords within clusters
export interface ClusterKeyword {
  id: string;
  project_id: string;
  keyword: string;
  volume: number;
  kd: number;
  cpc: number;
  position: number | null;
  url: string;
  traffic: number;
  serp_features: string[];
  volume_score: number;
  kd_score: number;
  cpc_score: number;
  position_score: number;
  intent_score: number;
  relevance_score: number;
  word_count_score: number;
  lowest_dr_score: number;
  total_points: number;
  intent: string;
  opportunity_category: string;
  action: string;
  relevance_explanation: string;
  target_word_count: number | null;
  cluster_id: string;
  is_primary_keyword: boolean;
  is_secondary_keyword: boolean;
  intent_mismatch: boolean;
  intent_mismatch_explanation: string;
  lowest_dr: number | null;
  created_at: string;
  updated_at: string;
  data_version: number;
}

// Dashboard Stats Type
export interface DashboardStats {
  total_keywords: number;
  avg_search_volume: number;
  avg_keyword_difficulty: number;
  high_opportunity_keywords: number;
  previous_total_keywords?: number;
  previous_avg_search_volume?: number;
  previous_avg_keyword_difficulty?: number;
  previous_high_opportunity_keywords?: number;
}

// Filter Types
export interface KeywordFilters {
  search?: string;
  minVolume?: number;
  maxVolume?: number;
  minDifficulty?: number;
  maxDifficulty?: number;
  intent?: string[];
  opportunityLevel?: string[];
  clusterId?: string;
}