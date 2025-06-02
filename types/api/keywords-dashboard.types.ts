/**
 * Types for the new Keywords Dashboard API responses
 */

import type { ClusterKeyword } from './keyword.types';

// Raw API response from /api/keywords/{project_id}/dashboard
export interface KeywordsDashboardAPIResponse {
  keywords: KeywordDashboardItem[];
  pagination: DashboardPagination;
  filters_applied: FiltersApplied;
  aggregations?: DashboardAggregations;
}

// Individual keyword item from API
export interface KeywordDashboardItem {
  id: string;
  keyword: string;
  volume: number;
  kd: number;
  cpc: number;
  position: number | null;
  url: string | null;
  traffic: number;
  total_points: number;
  opportunity_category: string; // "Success", "Low-Hanging Fruit", etc.
  action: string; // "Leave As Is", "Optimize", etc.
  intent: string; // "local", "commercial", "informational", etc.
  cluster_id: string | null;
  is_primary_keyword: boolean;
  is_secondary_keyword: boolean;
  relevance_score: number;
  relevance_explanation: string;
  created_at: string;
  updated_at: string;
}

// Pagination structure
export interface DashboardPagination {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Filters applied
export interface FiltersApplied {
  opportunity_category: string | null;
  action: string | null;
  min_volume: number | null;
  max_volume: number | null;
  min_position: number | null;
  max_position: number | null;
  cluster_id: string | null;
  is_primary_keyword: boolean | null;
}

// Aggregations when include_aggregations=true
export interface DashboardAggregations {
  total_keywords: number;
  opportunity_breakdown: {
    [key: string]: number; // "Success": 45, "Low-Hanging Fruit": 89, etc.
  };
  action_distribution: {
    [key: string]: number; // "Leave As Is": 45, "Optimize": 142, etc.
  };
  intent_distribution: {
    [key: string]: number; // "commercial": 89, "informational": 112, etc.
  };
  score_ranges: {
    high_value: number;    // 20+ points
    medium_value: number;  // 10-19 points
    low_value: number;     // <10 points
  };
  position_metrics: {
    top_3: number;
    top_10: number;
    top_20: number;
    beyond_20: number;
  };
}

// Clusters Dashboard API Response
export interface ClustersDashboardAPIResponse {
  clusters: ClusterDashboardItem[];
  summary: ClustersSummary;
  pagination: DashboardPagination;
}

export interface ClusterDashboardItem {
  cluster_id: string;
  name: string;
  description: string;
  keyword_count: number;
  total_volume: number;
  avg_difficulty: number;
  avg_position: number;
  main_keyword_id: string;
  main_keyword_text: string;
  keywords: ClusterKeyword[];
  opportunity_breakdown: {
    [key: string]: number; // "Success": 3, "Low-Hanging Fruit": 0, etc.
  };
  action_summary: {
    [key: string]: number; // "Leave As Is": 3, "Optimize": 0, etc.
  };
}

export interface SimplifiedClusterKeyword {
  id: string;
  keyword: string;
  volume: number;
  position: number;
  total_points: number;
  is_primary_keyword: boolean;
}

export interface ClustersSummary {
  total_clusters: number;
  total_keywords: number;
  avg_cluster_size: number;
  unclustered_keywords: number;
}