// Conversational Advice Types (New API)

export interface ConversationalAdviceResponse {
  project_id: string;
  generated_at: string;
  conversation_id: string;
  status: 'success' | 'partial' | 'error';
  data_quality?: {
    has_sufficient_data: boolean;
    quality_score: number;
    missing_data_types?: string[];
    recommendations?: string[];
  };
  advice: ConversationalAdvice;
  metadata?: {
    generation_time_ms: number;
    model_version: string;
    focus_area?: string;
  };
}

export interface ConversationalAdvice {
  executive_summary: string;
  sections: ConversationalSection[];
  action_items: ConversationalActionItem[];
  key_metrics: ConversationalKeyMetric[];
}

export interface ConversationalSection {
  id: string;
  title: string;
  content: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  supporting_data?: {
    charts?: ChartData[];
    tables?: TableData[];
    metrics?: MetricData[];
  };
  subsections?: ConversationalSubsection[];
}

export interface ConversationalSubsection {
  id: string;
  title: string;
  content: string;
  bulletPoints?: string[];
  callouts?: string[];
}

export interface ConversationalActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'immediate' | 'short-term' | 'long-term';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  category: 'content' | 'technical' | 'competitive' | 'strategic';
  timeline?: string;
  dependencies?: string[];
}

export interface ConversationalKeyMetric {
  name: string;
  current_value: string | number;
  target_value?: string | number;
  trend?: 'up' | 'down' | 'stable';
  context?: string;
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'donut' | 'scatter';
  title: string;
  data: any; // Chart-specific data structure
  options?: any; // Chart-specific options
}

export interface TableData {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  sortable?: boolean;
  filterable?: boolean;
}

export interface MetricData {
  label: string;
  value: string | number;
  unit?: string;
  change?: {
    value: number;
    percentage: number;
    direction: 'up' | 'down';
  };
}

// Supporting Types for Conversational API

export interface ConversationalAdviceFilters {
  focus_area?: 'overall' | 'content' | 'technical' | 'competitive' | 'opportunities';
  include_projections?: boolean;
  detail_level?: 'summary' | 'detailed' | 'comprehensive';
}

export interface DataQualityCheckResponse {
  project_id: string;
  has_sufficient_data: boolean;
  quality_score: number;
  data_summary: {
    total_keywords: number;
    keywords_with_data: number;
    data_completeness: number;
    last_updated: string;
  };
  missing_data_types?: string[];
  recommendations?: string[];
}

export interface SupportedFocusAreasResponse {
  focus_areas: FocusArea[];
}

export interface FocusArea {
  id: string;
  name: string;
  description: string;
  available: boolean;
  required_data_types: string[];
}

// Legacy Strategic Advice Types (to be deprecated)

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

// Strategic Advice API Response Types
export interface StrategicAdviceResponse {
  project_id: string;
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
      '30_days': string;
      '90_days': string; 
      '180_days': string;
    };
  };
  current_performance?: {
    top_performers: Array<{
      keyword: string;
      position: number;
      traffic: number;
      value: number;
      intent?: string;
    }>;
    total_top3_keywords: number;
    total_top3_traffic: number;
    total_top3_value: number;
    winning_patterns: {
      dominant_intent: string;
      successful_themes: Record<string, number>;
      average_position: number;
    };
    recommendations: string[];
  };
  // UPDATED: immediate_opportunities now uses AI-enhanced format (with backward compatibility)
  immediate_opportunities: (AIEnhancedOpportunity | OpportunityItem)[];
  content_strategy: ContentStrategyAdvice;
  competitive_analysis?: CompetitiveAnalysisData;
  tracking_framework?: {
    kpis?: Array<{
      metric: string;
      baseline: number | Record<string, number>;
      target_30_days?: number;
      target_90_days?: number;
      target_180_days?: number;
      target_improvements?: Record<string, string>;
    }>;
    kpi_dashboard?: {
      primary_metrics: Array<{
        metric: string;
        current: number | string;
        target: string;
        measurement: string;
      }>;
    };
    tracking_tools?: string[];
    reporting_frequency?: string;
  };
  implementation_roadmap: ImplementationPhase[] | {
    week_1_2?: {
      focus: string;
      tasks: Array<{
        keyword: string;
        current_position: number;
        expected_improvement: string;
      }>;
      success_metrics: string;
    };
    month_2_onwards?: {
      focus: string;
      schedule: Array<{
        month: number;
        content: string;
        type: string;
      }>;
    };
  };
}

// Legacy opportunity structure (for backward compatibility)
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

// NEW: AI-Enhanced Opportunity structure
export interface AIEnhancedOpportunity {
  keyword: string;
  current_state: {
    position: number;
    monthly_traffic: number;
    search_volume: number;
    difficulty: number;
  };
  opportunity_analysis: {
    traffic_capture_rate: string;
    missed_traffic: string;
    position_improvement_needed: string;
  };
  data_driven_insight: string;
  ai_recommendations: {
    priority_actions: PriorityAction[];
    content_strategy: string;
    technical_seo: string;
  };
  insight_type: 'ai_enhanced' | 'rule_based';
  success_metrics: {
    target_position: number;
    expected_total_traffic: number;
    traffic_multiplier: string;
  };
  implementation_priority: {
    level: 'high' | 'medium' | 'low';
    reasoning: string;
    effort_estimate: string;
  };
}

// Priority action structure from AI recommendations
export interface PriorityAction {
  action: string;
  reasoning: string;
  time_estimate: string;
  expected_impact: string;
}

export interface ContentStrategyAdvice {
  priority_clusters?: Array<any>; // Detailed cluster data from API
  content_clusters: ContentClusterAdvice[];
  content_gaps: ContentGap[];
  content_calendar: ContentCalendarItem[] | Array<{
    month: number;
    content_type: string;
    topic: string;
    target_keywords: string[];
    estimated_word_count: number;
    production_time: string;
    expected_impact: {
      keywords_targeted: number;
      total_search_volume?: number;
      search_volume?: number;
      estimated_traffic: number;
    };
  }>;
  content_templates?: Array<any>; // Template data from API
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