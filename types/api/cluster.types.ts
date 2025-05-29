// Cluster-related Types

import type { ClusterKeyword } from './keyword.types';

export interface Cluster {
  cluster_id: string;
  project_id: string;
  name: string;
  description: string;
  main_keyword: ClusterKeyword;
  keywords: ClusterKeyword[];
  keyword_count: number;
  total_volume: number;
  avg_difficulty: number;
  avg_position: number;
  created_at: string;
  updated_at: string;
}

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