/**
 * Utility functions for transforming API responses
 */

/**
 * Convert snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Transform object keys from snake_case to camelCase recursively
 */
export function transformKeysSnakeToCamel<T = any>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => transformKeysSnakeToCamel(item)) as any;
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const transformed: any = {};
    
    Object.keys(obj).forEach(key => {
      const camelKey = snakeToCamel(key);
      transformed[camelKey] = transformKeysSnakeToCamel(obj[key]);
    });
    
    return transformed;
  }

  return obj;
}

/**
 * Transform object keys from camelCase to snake_case recursively
 */
export function transformKeysCamelToSnake<T = any>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => transformKeysCamelToSnake(item)) as any;
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const transformed: any = {};
    
    Object.keys(obj).forEach(key => {
      const snakeKey = camelToSnake(key);
      transformed[snakeKey] = transformKeysCamelToSnake(obj[key]);
    });
    
    return transformed;
  }

  return obj;
}

/**
 * Transform API response to match frontend expectations
 * Handles both individual objects and paginated responses
 */
export function transformApiResponse<T>(response: any): T {
  // Check if it's a dashboard keywords response with new pagination structure
  if (response.keywords && Array.isArray(response.keywords) && response.pagination) {
    // Transform keywords dashboard response - use specialized transform for dashboard keywords
    const transformedData = response.keywords.map((keyword: any) => transformDashboardKeyword(keyword));
    
    return {
      data: transformedData,
      pagination: {
        page: response.pagination.page || 1,
        limit: response.pagination.per_page || 20,
        total: response.pagination.total || transformedData.length,
        totalPages: response.pagination.total_pages || 1
      },
      summary: response.aggregations || {}
    } as any;
  }
  
  // Check if it's an array response
  if (Array.isArray(response)) {
    return transformKeysSnakeToCamel(response);
  }
  
  // Regular object response
  return transformKeysSnakeToCamel(response);
}

/**
 * Transform dashboard summary response to match frontend expectations
 */
export function transformDashboardSummary(response: any): any {
  const transformed = transformKeysSnakeToCamel(response);
  
  // Map dashboard summary fields based on actual API response
  return {
    projectId: transformed.projectId,
    totalKeywords: transformed.totalKeywords || 0,
    aggregations: {
      totalVolume: transformed.aggregations?.totalVolume || 0,
      avgPosition: transformed.aggregations?.avgPosition || 0,
      opportunityDistribution: transformed.aggregations?.opportunityDistribution || {},
      actionDistribution: transformed.aggregations?.actionDistribution || {},
      intentDistribution: transformed.aggregations?.intentDistribution || {},
      pointsDistribution: transformed.aggregations?.pointsDistribution || {},
      relevanceDistribution: transformed.aggregations?.relevanceDistribution || {},
      trafficMetrics: transformed.aggregations?.trafficMetrics || {}
    }
  };
}

/**
 * Transform dashboard keyword from flat API structure to nested frontend structure
 */
export function transformDashboardKeyword(keyword: any): any {
  // Map opportunity_category to opportunity (handle different formats)
  const mapOpportunity = (category: string): string => {
    if (!category) return 'untapped';
    
    // Handle different formats (Title Case, hyphenated, snake_case)
    const normalized = category.toLowerCase().replace(/[\s-]/g, '_');
    
    switch (normalized) {
      case 'low_hanging':
      case 'low_hanging_fruit':
        return 'low_hanging';
      case 'existing':
        return 'existing';
      case 'clustering':
      case 'clustering_opportunity':
        return 'clustering';
      case 'untapped':
        return 'untapped';
      case 'success':
        return 'success';
      default:
        return 'untapped';
    }
  };
  
  // Map action values (handles "Leave As Is" format from API)
  const mapAction = (action: string): string => {
    if (!action) return 'create';
    
    // Handle different formats
    const normalized = action.toLowerCase().replace(/\s+/g, '_');
    
    switch (normalized) {
      case 'leave_as_is':
      case 'leave-as-is':
      case 'leave':
        return 'leave';
      case 'create':
      case 'create_new':
        return 'create';
      case 'optimize':
        return 'optimize';
      case 'upgrade':
        return 'upgrade';
      case 'update':
        return 'update';
      default:
        return 'create';
    }
  };
  
  // Map intent values
  const mapIntent = (intent: string): string => {
    if (!intent) return 'informational';
    
    const normalized = intent.toLowerCase();
    
    switch (normalized) {
      case 'local':
      case 'navigational':
        return 'navigational';
      case 'commercial':
        return 'commercial';
      case 'transactional':
        return 'transactional';
      case 'informational':
        return 'informational';
      case 'uncategorized':
      default:
        return 'informational';
    }
  };
  
  return {
    id: keyword.id || keyword.keyword_id || `${keyword.keyword}-${Date.now()}`,
    keyword: keyword.keyword,
    metrics: {
      volume: keyword.volume || 0,
      keyword_difficulty: keyword.kd || keyword.keyword_difficulty || 0,
      cpc: keyword.cpc || 0,
      position: keyword.position || null,
      url: keyword.url || null,
      traffic: keyword.traffic || 0,
      lowest_dr: keyword.lowest_dr || null
    },
    scores: {
      volume_score: keyword.volume_score || 0,
      kd_score: keyword.kd_score || 0,
      cpc_score: keyword.cpc_score || 0,
      position_score: keyword.position_score || 0,
      intent_score: keyword.intent_score || 0,
      relevance_score: keyword.relevance_score || 0,
      word_count_score: keyword.word_count_score || 0,
      lowest_dr_score: keyword.lowest_dr_score || 0,
      total_points: keyword.total_points || 0
    },
    classification: {
      opportunity: mapOpportunity(keyword.opportunity_category),
      action: mapAction(keyword.action),
      intent: mapIntent(keyword.intent),
      priority: keyword.priority || (keyword.is_primary_keyword ? 1 : 3)
    },
    cluster: keyword.cluster_id ? {
      id: keyword.cluster_id,
      name: keyword.cluster_name || 'Cluster',
      size: keyword.cluster_size || 0
    } : undefined,
    created_at: keyword.created_at || new Date().toISOString(),
    updated_at: keyword.updated_at || new Date().toISOString()
  };
}