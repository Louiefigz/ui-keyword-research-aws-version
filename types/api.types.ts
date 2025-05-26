// API Response Types

// Common Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Project Types
export interface Project {
  id: string;
  name: string;
  business_description: string;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
  settings?: ProjectSettings;
  stats: ProjectStats;
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
  total_keywords: number;
  total_clusters: number;
  avg_opportunity_score: number;
  top_opportunity_keywords: number;
  last_analysis_date: string | null;
}

// CSV Processing Types
export interface CSVUploadRequest {
  file: File;
  mapping: CSVMapping;
  update_mode: 'append' | 'replace' | 'update';
}

export interface CSVMapping {
  keyword: string;
  search_volume?: string;
  keyword_difficulty?: string;
  cpc?: string;
  competition?: string;
  intent?: string;
}

export interface CSVValidationResponse {
  is_valid: boolean;
  detected_columns: string[];
  suggested_mapping: CSVMapping;
  sample_data: Record<string, string | number | null>[];
  total_rows: number;
  errors: string[];
}

export interface CSVJobResponse {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  progress?: {
    processed: number;
    total: number;
    percentage: number;
  };
  result?: {
    processed: number;
    created: number;
    updated: number;
    skipped: number;
    errors: string[];
  };
}

// Keyword Types
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

// Cluster Types
export interface Cluster {
  id: string;
  name: string;
  theme: string;
  parent_topic: string;
  keywords: KeywordInCluster[];
  metrics: ClusterMetrics;
  opportunities: ClusterOpportunities;
  content_strategy: ContentStrategy;
  created_at: string;
  updated_at: string;
}

export interface KeywordInCluster {
  id: string;
  keyword: string;
  search_volume: number;
  opportunity_score: number;
  role: 'primary' | 'secondary' | 'supporting';
}

export interface ClusterMetrics {
  total_search_volume: number;
  avg_keyword_difficulty: number;
  total_keywords: number;
  opportunity_score: number;
  market_share_potential: number;
}

export interface ClusterOpportunities {
  content_gap_score: number;
  competition_level: 'low' | 'medium' | 'high';
  estimated_traffic_potential: number;
  ranking_difficulty: 'easy' | 'moderate' | 'hard';
  quick_wins: string[];
}

export interface ContentStrategy {
  recommended_content_type: string;
  primary_intent: string;
  content_depth: 'thin' | 'moderate' | 'comprehensive';
  estimated_word_count: number;
  key_topics_to_cover: string[];
}

// Strategic Advice Types
export interface StrategicAdvice {
  project_id: string;
  generated_at: string;
  market_analysis: MarketAnalysis;
  content_priorities: ContentPriority[];
  keyword_opportunities: KeywordOpportunity[];
  competitive_insights: CompetitiveInsight[];
  action_plan: ActionPlan;
  projected_outcomes: ProjectedOutcomes;
}

export interface MarketAnalysis {
  total_addressable_volume: number;
  market_saturation_level: number;
  growth_trend: 'growing' | 'stable' | 'declining';
  seasonal_patterns: SeasonalPattern[];
  market_gaps: string[];
}

export interface SeasonalPattern {
  month: string;
  relative_volume: number;
  trend: 'peak' | 'normal' | 'low';
}

export interface ContentPriority {
  cluster_id: string;
  cluster_name: string;
  priority_level: 'critical' | 'high' | 'medium' | 'low';
  reasoning: string;
  estimated_impact: EstimatedImpact;
  recommended_actions: string[];
}

export interface EstimatedImpact {
  traffic_increase: number;
  ranking_positions: number;
  conversion_potential: number;
  roi_estimate: number;
}

export interface KeywordOpportunity {
  keyword_id: string;
  keyword: string;
  opportunity_type: 'quick-win' | 'strategic' | 'long-term';
  current_position?: number;
  target_position: number;
  effort_required: 'minimal' | 'moderate' | 'significant';
  expected_timeline: string;
}

export interface CompetitiveInsight {
  competitor_domain: string;
  overlap_percentage: number;
  strengths: string[];
  weaknesses: string[];
  opportunities_to_exploit: string[];
}

export interface ActionPlan {
  immediate_actions: ActionItem[];
  short_term_goals: ActionItem[];
  long_term_strategy: ActionItem[];
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimated_hours: number;
  dependencies: string[];
  expected_outcome: string;
}

export interface ProjectedOutcomes {
  three_month_projection: OutcomeProjection;
  six_month_projection: OutcomeProjection;
  twelve_month_projection: OutcomeProjection;
}

export interface OutcomeProjection {
  estimated_traffic: number;
  estimated_rankings: number;
  estimated_conversions: number;
  estimated_revenue: number;
  confidence_level: 'high' | 'medium' | 'low';
}

// Filter and Sort Types
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

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface ClusterFilters {
  search?: string;
  minVolume?: number;
  maxVolume?: number;
  minKeywords?: number;
  maxKeywords?: number;
  intents?: string[];
}

export interface ClusterSortOptions {
  field: 'name' | 'totalVolume' | 'keywordCount' | 'opportunityScore' | 'difficulty';
  order: 'asc' | 'desc';
}