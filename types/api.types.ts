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

// Strategic Advice API Types
export interface StrategicAdviceResponse {
  executive_summary: {
    current_state: {
      total_keywords_tracked: number;
      current_organic_traffic: number;
      current_traffic_value: string;
      top_ranking_keywords: number;
    };
    opportunity_summary: {
      immediate_opportunities: number;
      content_gaps_identified: number;
      potential_traffic_gain: string;
      potential_monthly_value: string;
    };
    strategic_priorities: string[];
    expected_results: {
      '3_months': string;
      '6_months': string; 
      '12_months': string;
    };
  };
  immediate_opportunities: OpportunityItem[];
  content_strategy: ContentStrategyAdvice;
  competitive_analysis?: CompetitiveAnalysisData;
  roi_projections: ROIProjection[];
  implementation_roadmap: ImplementationPhase[];
}

export interface OpportunityItem {
  id: string;
  title: string;
  description: string;
  type: 'quick_wins' | 'content_gaps' | 'technical' | 'competitive';
  impact_score: number;
  difficulty: number;
  estimated_traffic: number;
  estimated_value: string;
  timeline: string;
  effort_required: string;
  keywords_affected: string[];
  action_steps: string[];
}

export interface ContentStrategyAdvice {
  content_clusters: ContentClusterAdvice[];
  content_gaps: ContentGap[];
  content_calendar: ContentCalendarItem[];
  optimization_recommendations: OptimizationRecommendation[];
}

export interface ContentClusterAdvice {
  cluster_id: string;
  cluster_name: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  content_type: string;
  target_keywords: string[];
  estimated_impact: EstimatedImpact;
  content_outline: string[];
}

export interface ContentGap {
  topic: string;
  search_volume: number;
  competition_level: 'low' | 'medium' | 'high';
  content_type: string;
  priority_score: number;
  target_keywords: string[];
}

export interface ContentCalendarItem {
  month: string;
  content_pieces: number;
  focus_clusters: string[];
  estimated_traffic: number;
}

export interface OptimizationRecommendation {
  type: 'on_page' | 'technical' | 'content' | 'link_building';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  pages_affected: number;
}

export interface ROIProjection {
  timeframe: '3_months' | '6_months' | '12_months';
  scenario?: 'best' | 'expected' | 'worst';
  investment_required: number;
  projected_traffic: number;
  projected_conversions: number;
  projected_revenue: number;
  roi_percentage: number;
  confidence_level: 'high' | 'medium' | 'low';
  key_assumptions: string[];
  investment_breakdown?: {
    content_creation: number;
    content_optimization: number;
    technical_seo: number;
    link_building: number;
  };
  monthly_projections?: Array<{
    month: number;
    investment: number;
    traffic: number;
    conversions: number;
    revenue: number;
    cumulative_roi: number;
  }>;
}

export interface CompetitiveAnalysisData {
  competitor_gaps: Record<string, CompetitorGap>;
  market_share_analysis: MarketShareData;
  competitive_advantages: Array<{
    advantage_type: string;
    description: string;
    keywords_count: number;
    impact_score: number;
  }>;
  strategic_recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    recommendation: string;
    expected_outcome: string;
    timeline: string;
  }>;
}

export interface CompetitorGap {
  keyword: string;
  metrics: {
    volume: number;
    difficulty: number;
    cpc: number;
  };
  competitor_positions: Record<string, number>;
  opportunity: string;
  opportunity_score: number;
  estimated_traffic: number;
  estimated_value: number;
}

export interface MarketShareData {
  market_share_percentage: number;
  organic_visibility: number;
  competitor_comparison: Array<{
    competitor: string;
    market_share: number;
    organic_visibility: number;
    shared_keywords: number;
  }>;
  growth_opportunities: Array<{
    keyword_category: string;
    potential_gain: number;
    difficulty_score: number;
  }>;
}

export interface ImplementationPhase {
  phase: string;
  duration: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  tasks: ImplementationTask[];
  dependencies: string[];
  expected_outcomes: string[];
}

export interface ImplementationTask {
  id: string;
  title: string;
  description: string;
  estimated_hours: number;
  skills_required: string[];
  deliverables: string[];
}

export interface OpportunityAnalysisResponse {
  opportunities: OpportunityItem[];
  summary: {
    total_opportunities: number;
    quick_wins: number;
    content_gaps: number;
    technical_issues: number;
    competitive_opportunities: number;
    total_potential_traffic: number;
    total_potential_value: string;
  };
}

export interface StrategicAdviceFilters {
  timeframe?: '3_months' | '6_months' | '12_months';
  focus_areas?: ('content' | 'technical' | 'competitive' | 'link_building')[];
  priority_level?: 'critical' | 'high' | 'medium' | 'low';
  include_projections?: boolean;
}