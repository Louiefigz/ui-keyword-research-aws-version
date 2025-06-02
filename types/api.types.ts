// API Types - Re-exports from domain-specific files
// This file now serves as a central export point for all API types

// Common types
export type {
  ApiResponse,
  PaginatedResponse,
  SortOptions,
  PaginationInfo,
} from './api/common.types';

// Project types
export type {
  Project,
  ProjectSettings,
  SEOFactors,
  TargetMetrics,
  ExportSettings,
  ProjectStats,
  OpportunityBreakdown,
  TopOpportunity,
} from './api/project.types';

// Keyword types
export type {
  Keyword,
  DashboardKeyword,
  KeywordMetrics,
  KeywordScores,
  KeywordClassification,
  ClusterReference,
  ClusterKeyword,
  DashboardStats,
  KeywordFilters,
} from './api/keyword.types';

// Cluster types
export type {
  Cluster,
  ClustersResponse,
  ClusterSummaryResponse,
  ClusterSummaryListResponse,
  ClusterKeywordsResponse,
  ClusterListParams,
  SingleClusterExportRequest,
  MultipleClusterExportRequest,
  KeywordInCluster,
  ClusterMetrics,
  ClusterOpportunities,
  ContentStrategy,
  ClusterFilters,
  ClusterSortOptions,
} from './api/cluster.types';

// CSV types
export type {
  UpdateStrategy,
  CSVUploadRequest,
  CSVMapping,
  SchemaDetection,
  SchemaColumn,
  CSVValidationResponse,
  CSVJobResponse,
} from './api/csv.types';

// Strategic advice types
export type {
  // Conversational Advice Types (New API)
  ConversationalAdviceResponse,
  ConversationalAdvice,
  ConversationalSection,
  ConversationalSubsection,
  ConversationalActionItem,
  ConversationalKeyMetric,
  ChartData,
  TableData,
  MetricData,
  ConversationalAdviceFilters,
  DataQualityCheckResponse,
  SupportedFocusAreasResponse,
  FocusArea,
  // Legacy Strategic Advice Types (to be deprecated)
  StrategicAdvice,
  MarketAnalysis,
  SeasonalPattern,
  ContentPriority,
  EstimatedImpact,
  KeywordOpportunity,
  CompetitiveInsight,
  ActionPlan,
  ActionItem,
  ProjectedOutcomes,
  OutcomeProjection,
  StrategicAdviceResponse,
  OpportunityItem,
  ContentStrategyAdvice,
  ContentClusterAdvice,
  ContentGap,
  ContentCalendarItem,
  OptimizationRecommendation,
  CompetitiveAnalysisData,
  CompetitorGap,
  MarketShareData,
  ImplementationPhase,
  ImplementationTask,
  OpportunityAnalysisResponse,
  StrategicAdviceFilters,
} from './api/strategic.types';