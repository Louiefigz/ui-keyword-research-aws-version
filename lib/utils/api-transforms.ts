/**
 * Utility functions for transforming API responses
 */

/**
 * Map API intent values to frontend expected values
 */
function mapIntentValue(intent: string): string {
  if (!intent) return 'informational';
  
  const normalized = intent.toLowerCase();
  switch (normalized) {
    case 'local':
      return 'local';
    case 'navigational':
      return 'navigational';
    case 'commercial':
      return 'commercial';
    case 'transactional':
      return 'transactional';
    case 'informational':
    default:
      return 'informational';
  }
}

/**
 * Map API action values to frontend expected values
 */
function mapActionValue(action: string): string {
  if (!action) return 'create';
  
  const normalized = action.toLowerCase().replace(/\s+/g, '_');
  switch (normalized) {
    case 'leave_as_is':
    case 'leave-as-is':
    case 'leave':
      return 'leave';
    case 'create':
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
}

/**
 * Map API opportunity values to frontend expected values
 */
function mapOpportunityValue(opportunity: string): string {
  if (!opportunity) return 'untapped';
  
  const normalized = opportunity.toLowerCase().replace(/[\s-]/g, '_');
  switch (normalized) {
    case 'low_hanging_fruit':
    case 'low-hanging_fruit':
      return 'low_hanging';
    case 'existing':
      return 'existing';
    case 'clustering_opportunity':
      return 'clustering';
    case 'untapped':
      return 'untapped';
    case 'success':
      return 'success';
    default:
      return 'untapped';
  }
}

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
  // Check if it's a conversational advice response
  if (response.conversation_id || (response.advice && typeof response.advice === 'object')) {
    // Return conversational advice response as-is
    return response as any;
  }
  
  // Check if it's a data quality check response
  if (response.has_sufficient_data !== undefined && response.quality_score !== undefined) {
    // Return data quality response as-is
    return response as any;
  }
  
  // Check if it's a strategic advice response
  if (response.executive_summary) {
    return transformStrategicAdviceResponse(response) as any;
  }
  
  // Check if it's a clusters response
  if (response.clusters && Array.isArray(response.clusters)) {
    const mappedClusters = response.clusters.map((cluster: any) => ({
      ...cluster,
      // Transform main_keyword if it exists
      main_keyword: cluster.main_keyword ? transformKeyword(cluster.main_keyword) : null,
      // Transform keywords array
      keywords: cluster.keywords ? cluster.keywords.map(transformKeyword) : [],
      // Ensure numeric fields are properly handled
      keyword_count: Number(cluster.keyword_count) || 0,
      total_volume: Number(cluster.total_volume) || 0,
      avg_difficulty: Number(cluster.avg_difficulty) || 0,
      avg_position: Number(cluster.avg_position) || 0
    }));
    
    return {
      clusters: mappedClusters,
      total_count: response.total_count || response.clusters.length,
      page: response.page || 1,
      page_size: response.page_size || 20
    } as any;
  }
  
  // Check if it's a cluster keywords response (has cluster object)
  if (response.cluster && response.keywords && Array.isArray(response.keywords) && response.pagination) {
    // Return cluster keywords response as-is, just transform the keywords
    return {
      cluster: response.cluster,
      keywords: response.keywords.map(transformKeyword),
      pagination: response.pagination
    } as any;
  }
  
  // Check if it's a dashboard keywords response with new pagination structure
  if (response.keywords && Array.isArray(response.keywords) && response.pagination) {
    // Don't transform keywords - use them as-is from API
    const mappedKeywords = response.keywords.map((keyword: any) => ({
      ...keyword,
      // Map fields to match DashboardKeyword interface
      keyword_id: keyword.id,
      sop_score: keyword.total_points || 0,
      // Map opportunity_category to opportunity_type
      opportunity_type: mapOpportunityValue(keyword.opportunity_category),
      // Map action to lowercase
      action: mapActionValue(keyword.action),
      // Ensure numeric fields are numbers
      volume: Number(keyword.volume) || 0,
      kd: Number(keyword.kd) || 0,
      cpc: Number(keyword.cpc) || 0,
      position: keyword.position != null ? Number(keyword.position) : null,
      relevance_score: Number(keyword.relevance_score) || 0
    }));
    
    return {
      data: mappedKeywords,
      pagination: {
        page: response.pagination.page || 1,
        limit: response.pagination.page_size || 25,
        total: response.pagination.total_filtered || response.keywords.length,
        totalPages: Math.ceil((response.pagination.total_filtered || response.keywords.length) / (response.pagination.page_size || 25))
      },
      summary: response.aggregations || {}
    } as any;
  }
  
  // Check if it's a single keyword object
  if (response.keyword && response.volume !== undefined) {
    return transformKeyword(response) as any;
  }
  
  // Check if it's an array response
  if (Array.isArray(response)) {
    return transformKeysSnakeToCamel(response);
  }
  
  // Regular object response
  return transformKeysSnakeToCamel(response);
}

/**
 * Transform a single keyword object from API format to frontend format
 */
function transformKeyword(keyword: any): any {
  return {
    ...keyword,
    // Ensure cluster_name is available
    cluster_name: keyword.cluster_name || (keyword.cluster_id ? `Cluster ${keyword.cluster_id.slice(0, 8)}` : null),
    // Ensure all numeric fields are properly handled
    volume: Number(keyword.volume) || 0,
    kd: Number(keyword.kd) || 0,
    cpc: Number(keyword.cpc) || 0,
    position: keyword.position != null ? Number(keyword.position) : null,
    relevance_score: Number(keyword.relevance_score) || 0,
    // Map intent values from API to frontend expected values
    intent: mapIntentValue(keyword.intent),
    // Map action values from API to frontend expected values  
    action: mapActionValue(keyword.action),
    // Map opportunity values from API to frontend expected values
    opportunity_type: mapOpportunityValue(keyword.opportunity_category),
    url: keyword.url || null
  };
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
 * Transform strategic advice response to match component expectations
 */
function transformStrategicAdviceResponse(response: any): any {
  
  // Transform immediate opportunities to handle both legacy and AI-enhanced formats
  const transformOpportunities = (opportunities: any[]): any[] => {
    if (!opportunities || !Array.isArray(opportunities)) return [];
    
    return opportunities.map((opp, index) => {
      // Handle NEW AI-enhanced format with keyword-based opportunities
      if (opp.keyword && opp.ai_recommendations) {
        // Return AI-enhanced opportunity as-is with minimal transformation
        return {
          ...opp,
          id: `ai_opp_${index}`,
          // Ensure implementation_priority is properly structured
          implementation_priority: typeof opp.implementation_priority === 'string' ? {
            level: opp.implementation_priority,
            reasoning: 'Generated from AI analysis',
            effort_estimate: 'Medium'
          } : opp.implementation_priority
        };
      }
      
      // Handle legacy keyword format (for backward compatibility)
      if (opp.keyword && !opp.ai_recommendations) {
        return {
          id: `legacy_opp_${index}`,
          title: opp.keyword,
          description: opp.data_driven_insight || '',
          type: 'quick_wins' as const,
          impact_score: opp.success_metrics?.traffic_multiplier ? 
            parseFloat(opp.success_metrics.traffic_multiplier.replace('x', '')) * 20 : 50,
          difficulty: 100 - (opp.current_state?.difficulty || 50),
          estimated_traffic: opp.success_metrics?.expected_total_traffic || 0,
          estimated_value: `$${(opp.success_metrics?.expected_total_traffic || 0) * 2}`,
          timeline: typeof opp.implementation_priority === 'object' ? 
            (opp.implementation_priority.level === 'high' ? '0-1 month' : '1-3 months') :
            (opp.implementation_priority === 'high' ? '0-1 month' : '1-3 months'),
          effort_required: typeof opp.implementation_priority === 'object' ?
            opp.implementation_priority.effort_estimate || 'Medium' : 'Medium',
          keywords_affected: [opp.keyword],
          action_steps: [
            `Improve position from ${opp.current_state?.position || 'current'} to ${opp.success_metrics?.target_position || 1}`,
            opp.opportunity_analysis?.position_improvement_needed || '',
            opp.data_driven_insight || ''
          ].filter(Boolean)
        };
      }
      
      // Handle existing OpportunityItem format (already transformed)
      return opp;
    });
  };
  
  // Transform implementation roadmap from object to array format
  const transformImplementationRoadmap = (roadmap: any) => {
    if (!roadmap) return [];
    
    // If it's already an array, return it
    if (Array.isArray(roadmap)) return roadmap;
    
    // Convert object format to array format
    const roadmapArray: any[] = [];
    
    if (roadmap.week_1_2) {
      roadmapArray.push({
        phase: 'Week 1-2',
        duration: '2 weeks',
        priority: 'critical' as const,
        tasks: roadmap.week_1_2.tasks || [],
        dependencies: [],
        expected_outcomes: [roadmap.week_1_2.success_metrics || '']
      });
    }
    
    if (roadmap.month_2_onwards && roadmap.month_2_onwards.schedule) {
      roadmap.month_2_onwards.schedule.forEach((item: any, index: number) => {
        roadmapArray.push({
          phase: `Month ${item.month}`,
          duration: '1 month',
          priority: index === 0 ? 'high' : 'medium' as const,
          tasks: [{
            id: `task-${index}`,
            title: item.content,
            description: `Create ${item.type} for ${item.content}`,
            estimated_hours: 40,
            skills_required: ['SEO', 'Content Writing'],
            deliverables: [`${item.type} published`]
          }],
          dependencies: index > 0 ? [`Month ${item.month - 1}`] : [],
          expected_outcomes: [`${item.type} completed and published`]
        });
      });
    }
    
    return roadmapArray;
  };
  
  // Transform content strategy to match expected format
  const transformContentStrategy = (strategy: any) => {
    if (!strategy) return {
      content_clusters: [],
      content_gaps: [],
      content_calendar: [],
      optimization_recommendations: []
    };
    
    return {
      // Map priority_clusters to content_clusters
      content_clusters: (strategy.priority_clusters || []).map((cluster: any) => ({
        cluster_id: cluster.cluster_id,
        cluster_name: cluster.name,
        priority: 'high' as const,
        content_type: 'Comprehensive Guide',
        target_keywords: (cluster.keywords || []).map((k: any) => k.keyword),
        estimated_impact: {
          traffic_increase: cluster.strategic_metrics?.priority_score || 0,
          ranking_positions: 0,
          conversion_potential: 0,
          roi_estimate: 0
        },
        content_outline: []
      })),
      content_gaps: [],
      content_calendar: strategy.content_calendar || [],
      optimization_recommendations: []
    };
  };
  
  // Return transformed response
  return {
    ...response,
    // Keep executive_summary as is (handled by component)
    executive_summary: response.executive_summary,
    // Transform immediate_opportunities to match OpportunityItem interface
    immediate_opportunities: transformOpportunities(response.immediate_opportunities),
    // Transform content_strategy
    content_strategy: transformContentStrategy(response.content_strategy),
    // Add competitive_analysis if missing
    competitive_analysis: response.competitive_analysis || undefined,
    // Transform implementation_roadmap to array format
    implementation_roadmap: transformImplementationRoadmap(response.implementation_roadmap)
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