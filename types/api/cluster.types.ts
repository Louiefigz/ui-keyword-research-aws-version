// Cluster-related Types

import type { ClusterKeyword } from './keyword.types';

export interface Cluster {
  cluster_id: string;
  project_id: string;
  name: string;
  description?: string;
  main_keyword: ClusterKeyword;
  keywords: ClusterKeyword[];
  keyword_count: number;
  total_volume: number;
  avg_difficulty: number;
  avg_position: number;
  created_at: string;
  updated_at: string;
}

// New paginated summary response for the main clusters list
export interface ClusterSummaryResponse {
  cluster_id: string;
  project_id: string;
  name: string;
  description?: string;
  keyword_count: number;
  total_volume: number;
  avg_difficulty: number;
  avg_position: number;
  preview_keywords: ClusterKeyword[]; // Using ClusterKeyword[] for consistency with existing Cluster interface
  created_at: string;
  updated_at: string;
}

export interface ClusterSummaryListResponse {
  clusters: ClusterSummaryResponse[];
  pagination: {
    page: number;
    page_size: number;
    total_pages: number;
    total_clusters: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

// Keep existing response for backward compatibility
export interface ClustersResponse {
  clusters: Cluster[];
  total_count: number;
  page: number;
  page_size: number;
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

// Query parameters for paginated clusters list
export interface ClusterListParams {
  page?: number;
  page_size?: number;
  keywords_preview_limit?: number;
}

// Export request types
export interface SingleClusterExportRequest {
  export_format: 'csv' | 'excel' | 'json';
  include_all_keywords: boolean;
}

export interface MultipleClusterExportRequest {
  export_format: 'csv' | 'excel' | 'json';
  include_all_keywords: boolean;
  cluster_ids?: string[];
}

// Filter Types
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

// Paginated cluster keywords response
export interface ClusterKeywordsResponse {
  cluster: {
    pk: string;
    sk: string;
    cluster_id: string;
    project_id: string;
    name: string;
    description?: string;
    main_keyword: string;
    keyword_ids: string[];
    created_at: string;
    updated_at: string;
    created_by: string | null;
    keyword_count: number;
    total_volume: number | null;
    avg_difficulty: number | null;
    avg_position: number | null;
  };
  keywords: ClusterKeyword[];
  pagination: {
    page: number;
    page_size: number;
    next_cursor: string | null;
    has_more: boolean;
    total_filtered: number;
  };
}