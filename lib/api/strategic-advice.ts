import { apiClient } from './client';
import { API_ENDPOINTS } from '@/config/api.constants';
import { transformApiResponse } from '@/lib/utils/api-transforms';
import type { 
  ConversationalAdviceResponse,
  ConversationalAdviceFilters,
  DataQualityCheckResponse,
  SupportedFocusAreasResponse,
  ConversationalSection,
  ConversationalActionItem,
  ConversationalKeyMetric,
  // Legacy types - to be deprecated
  StrategicAdviceResponse, 
  OpportunityAnalysisResponse,
  StrategicAdviceFilters,
  ContentStrategyAdvice,
  CompetitiveAnalysisData
} from '@/types/api.types';

/**
 * ===========================================
 * NEW CONVERSATIONAL ADVICE API
 * ===========================================
 */

/**
 * Fetch conversational strategic advice for a project
 * This is the main endpoint that provides all strategic advice in a conversational format
 */
export async function getConversationalAdvice(
  projectId: string,
  filters?: ConversationalAdviceFilters
): Promise<ConversationalAdviceResponse> {
  const params = new URLSearchParams();
  
  if (filters?.focus_area) {
    params.append('focus_area', filters.focus_area);
  }
  if (filters?.include_projections !== undefined) {
    params.append('include_projections', filters.include_projections.toString());
  }
  if (filters?.detail_level) {
    params.append('detail_level', filters.detail_level);
  }

  const queryString = params.toString();
  const url = `${API_ENDPOINTS.CONVERSATIONAL_ADVICE(projectId)}${queryString ? `?${queryString}` : ''}`;
  
  // Extended timeout for AI processing (up to 5 minutes)
  const response = await apiClient.get(url, {
    timeout: 5 * 60 * 1000 // 5 minutes for AI-enhanced conversational advice
  });
  
  // Transform the response to match the expected format
  const rawData = response.data;
  
  // Check if the response is already in the expected format
  if (rawData.advice && rawData.conversation_id) {
    return transformApiResponse<ConversationalAdviceResponse>(rawData);
  }
  
  // Otherwise, transform the raw conversational data into the expected structure
  const transformedResponse: ConversationalAdviceResponse = {
    project_id: projectId,
    generated_at: rawData._metadata?.generated_at || new Date().toISOString(),
    conversation_id: `conv_${Date.now()}`,
    status: 'success' as const,
    data_quality: rawData._metadata?.data_quality ? {
      has_sufficient_data: rawData._metadata.data_quality.level !== 'poor',
      quality_score: Math.round(parseFloat(rawData._metadata.data_quality.score) * 100),
      missing_data_types: [],
      recommendations: []
    } : undefined,
    advice: {
      executive_summary: formatExecutiveSummary(rawData.executive_overview),
      sections: formatSections(rawData),
      action_items: formatActionItems(rawData),
      key_metrics: formatKeyMetrics(rawData)
    },
    metadata: {
      generation_time_ms: Math.round((rawData._metadata?.generation_time_seconds || 0) * 1000),
      model_version: 'conversational-v1',
      focus_area: rawData._metadata?.options_used?.focus_area
    }
  };
  
  return transformedResponse;
}

/**
 * Check data quality before generating advice
 * Optional - can be used to pre-check if data is sufficient
 */
export async function checkDataQuality(
  projectId: string
): Promise<DataQualityCheckResponse> {
  const url = API_ENDPOINTS.CONVERSATIONAL_ADVICE_DATA_QUALITY(projectId);
  
  const response = await apiClient.get(url);
  return transformApiResponse<DataQualityCheckResponse>(response.data);
}

/**
 * Get supported focus areas
 * Optional - can be used to show available focus area options
 */
export async function getSupportedFocusAreas(): Promise<SupportedFocusAreasResponse> {
  const url = API_ENDPOINTS.CONVERSATIONAL_ADVICE_FOCUS_AREAS;
  
  const response = await apiClient.get(url);
  return transformApiResponse<SupportedFocusAreasResponse>(response.data);
}

/**
 * Test connection to conversational advice service
 * Optional - mainly for debugging/admin purposes
 */
export async function testConversationalAdviceConnection(): Promise<{
  status: string;
  message: string;
}> {
  const url = API_ENDPOINTS.CONVERSATIONAL_ADVICE_TEST_CONNECTION;
  
  const response = await apiClient.get(url);
  return transformApiResponse(response.data);
}

/**
 * Export conversational advice report
 */
export async function exportConversationalAdviceReport(
  projectId: string,
  format: 'pdf' | 'docx' | 'markdown' = 'pdf'
): Promise<Blob> {
  const url = `${API_ENDPOINTS.CONVERSATIONAL_ADVICE(projectId)}/export?format=${format}`;
  
  const response = await apiClient.get(url, {
    responseType: 'blob',
  });

  return response.data;
}

/**
 * ===========================================
 * DEPRECATED LEGACY API - TO BE REMOVED
 * ===========================================
 */

/**
 * @deprecated Use getConversationalAdvice instead
 * Fetch comprehensive strategic advice for a project
 */
export async function getStrategicAdvice(
  projectId: string,
  filters?: StrategicAdviceFilters
): Promise<StrategicAdviceResponse> {
  console.warn('getStrategicAdvice is deprecated. Use getConversationalAdvice instead.');
  
  const params = new URLSearchParams();
  
  // API only supports include_competitors parameter
  if (filters?.include_projections) {
    params.append('include_competitors', 'true');
  }

  const queryString = params.toString();
  const url = `/strategic-advice/projects/${projectId}${queryString ? `?${queryString}` : ''}`;
  
  // UPDATED: Extended timeout for AI processing (up to 5 minutes)
  const response = await apiClient.get(url, {
    timeout: 5 * 60 * 1000 // 5 minutes for AI-enhanced strategic advice
  });
  return transformApiResponse<StrategicAdviceResponse>(response.data);
}

/**
 * @deprecated Use getConversationalAdvice instead
 * Fetch opportunity analysis for a project
 */
export async function getOpportunityAnalysis(
  projectId: string,
  filters?: {
    opportunity_type?: 'low_hanging' | 'existing' | 'gaps';
    min_volume?: number;
    limit?: number;
  }
): Promise<OpportunityAnalysisResponse> {
  console.warn('getOpportunityAnalysis is deprecated. Use getConversationalAdvice instead.');
  
  const params = new URLSearchParams();
  
  if (filters?.limit !== undefined) {
    params.append('limit', filters.limit.toString());
  }
  if (filters?.min_volume !== undefined) {
    params.append('min_volume', filters.min_volume.toString());
  }
  if (filters?.opportunity_type) {
    params.append('opportunity_type', filters.opportunity_type);
  }

  const queryString = params.toString();
  const url = `/strategic-advice/projects/${projectId}/opportunities${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiClient.get(url);
  return transformApiResponse<OpportunityAnalysisResponse>(response.data);
}

/**
 * @deprecated Use exportConversationalAdviceReport instead
 * Export strategic advice report
 */
export async function exportStrategicAdviceReport(
  projectId: string,
  format: 'pdf' | 'excel' = 'pdf'
): Promise<Blob> {
  console.warn('exportStrategicAdviceReport is deprecated. Use exportConversationalAdviceReport instead.');
  
  const url = `/strategic-advice/projects/${projectId}/export?format=${format}`;
  
  const response = await apiClient.get(url, {
    responseType: 'blob',
  });

  return response.data;
}

/**
 * @deprecated Use getConversationalAdvice with focus_area='content' instead
 * Fetch content strategy details
 */
export async function getContentStrategy(
  projectId: string,
  options?: {
    max_clusters?: number;
    timeline_months?: number;
  }
): Promise<ContentStrategyAdvice> {
  console.warn('getContentStrategy is deprecated. Use getConversationalAdvice with focus_area="content" instead.');
  
  const params = new URLSearchParams();
  
  if (options?.max_clusters !== undefined) {
    params.append('max_clusters', options.max_clusters.toString());
  }
  if (options?.timeline_months !== undefined) {
    params.append('timeline_months', options.timeline_months.toString());
  }

  const queryString = params.toString();
  const url = `/strategic-advice/projects/${projectId}/content-strategy${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiClient.get(url);
  return transformApiResponse<ContentStrategyAdvice>(response.data);
}

/**
 * @deprecated Use getConversationalAdvice with focus_area='competitive' instead
 * Fetch competitive analysis data
 */
export async function getCompetitiveAnalysis(
  projectId: string
): Promise<CompetitiveAnalysisData> {
  console.warn('getCompetitiveAnalysis is deprecated. Use getConversationalAdvice with focus_area="competitive" instead.');
  
  // API doesn't support any query parameters for this endpoint
  const url = `/strategic-advice/projects/${projectId}/competitive-analysis`;
  
  const response = await apiClient.get(url);
  return transformApiResponse<CompetitiveAnalysisData>(response.data);
}


/**
 * @deprecated Legacy export - use exportConversationalAdviceReport instead
 * Export specific strategic advice sections
 */
export async function exportStrategicSection(
  projectId: string,
  section: 'competitive' | 'content' | 'opportunities',
  format: 'csv' | 'pdf' | 'xlsx' = 'csv'
): Promise<Blob> {
  console.warn('exportStrategicSection is deprecated. Use exportConversationalAdviceReport instead.');
  
  const url = `/strategic-advice/projects/${projectId}/${section}/export?format=${format}`;
  
  const response = await apiClient.get(url, {
    responseType: 'blob',
  });

  return response.data;
} 

/**
 * ===========================================
 * HELPER FUNCTIONS FOR CONVERSATIONAL FORMAT
 * ===========================================
 */

function formatExecutiveSummary(overview: any): string {
  if (!overview) return 'No executive summary available.';
  
  const { headline, current_reality, opportunity, bottom_line } = overview;
  
  let summary = '';
  
  if (headline) {
    summary += `${headline}\n\n`;
  }
  
  if (current_reality?.description) {
    summary += `**Current State:**\n${current_reality.description}\n\n`;
  }
  
  if (opportunity?.description) {
    summary += `**Opportunity:**\n${opportunity.description}\n\n`;
  }
  
  if (bottom_line) {
    summary += `**Bottom Line:**\n${bottom_line}`;
  }
  
  return summary.trim();
}

function formatSections(data: any): ConversationalSection[] {
  const sections: ConversationalSection[] = [];
  
  // Problem Analysis Section
  if (data.your_three_biggest_problems) {
    const problems = Object.values(data.your_three_biggest_problems) as any[];
    sections.push({
      id: 'problems',
      title: 'Your Three Biggest Problems',
      content: 'Here are the main issues holding back your SEO performance:',
      priority: 'critical',
      subsections: problems.map((problem, idx) => ({
        id: `problem_${idx}`,
        title: problem.name,
        content: `${problem.explanation}\n\n**Evidence:** ${problem.evidence}\n\n**Difficulty to Fix:** ${problem.fix_difficulty}`,
        bulletPoints: [`Impact: ${problem.impact}`]
      }))
    });
  }
  
  // Quick Wins Section
  if (data.phase_1_quick_wins) {
    const quickWins = data.phase_1_quick_wins;
    sections.push({
      id: 'quick_wins',
      title: 'Phase 1: Quick Wins (2-3 weeks)',
      content: quickWins.why_this_first || 'Start with these optimizations for fast results.',
      priority: 'high',
      subsections: [{
        id: 'quick_wins_actions',
        title: 'Immediate Actions',
        content: `Total Opportunity: ${quickWins.total_opportunity}`,
        bulletPoints: quickWins.immediate_actions?.map((action: any) => 
          `${action.task} (${action.time_estimate}): ${action.expected_result}`
        ) || []
      }]
    });
  }
  
  // Content Strategy Section
  if (data.phase_2_content_strategy) {
    const contentStrategy = data.phase_2_content_strategy;
    sections.push({
      id: 'content_strategy',
      title: 'Phase 2: Content Strategy (1-3 months)',
      content: `Create ${contentStrategy.expected_results?.content_pieces || 'new'} optimized pages targeting high-value keywords.`,
      priority: 'high',
      subsections: contentStrategy.content_priorities?.map((priority: any, idx: number) => ({
        id: `content_${idx}`,
        title: priority.topic,
        content: `${priority.content_type} targeting ${priority.volume_opportunity}`,
        bulletPoints: [
          `Difficulty: ${priority.difficulty}`,
          `Timeline: ${priority.timeline}`,
          ...priority.target_keywords.map((kw: string) => `Target: "${kw}"`)
        ]
      })) || []
    });
  }
  
  // Long-term Strategy Section
  if (data.phase_3_long_term) {
    const longTerm = data.phase_3_long_term;
    sections.push({
      id: 'long_term',
      title: 'Phase 3: Long-term Strategy (3-6 months)',
      content: longTerm.competitive_positioning?.strategy || 'Build sustainable competitive advantage.',
      priority: 'medium',
      subsections: longTerm.strategic_initiatives?.map((initiative: any, idx: number) => ({
        id: `initiative_${idx}`,
        title: initiative.initiative,
        content: initiative.reason,
        bulletPoints: initiative.actions
      })) || []
    });
  }
  
  // Investment Reality Check
  if (data.investment_reality_check) {
    const investment = data.investment_reality_check;
    sections.push({
      id: 'investment',
      title: 'Investment Reality Check',
      content: investment.reality_check,
      priority: 'high',
      supporting_data: {
        metrics: [
          {
            label: 'Tools Cost',
            value: investment.money_required?.tools || 'N/A'
          },
          {
            label: 'Content Cost',
            value: investment.money_required?.content || 'N/A'
          },
          {
            label: 'Time Required',
            value: investment.time_required?.phase_1 || 'N/A'
          }
        ]
      }
    });
  }
  
  return sections;
}

function formatActionItems(data: any): ConversationalActionItem[] {
  const actionItems: ConversationalActionItem[] = [];
  let itemId = 0;
  
  // Quick Wins Actions
  if (data.phase_1_quick_wins?.immediate_actions) {
    data.phase_1_quick_wins.immediate_actions.forEach((action: any) => {
      actionItems.push({
        id: `action_${itemId++}`,
        title: action.task,
        description: action.details,
        priority: 'immediate',
        effort: 'low',
        impact: 'high',
        category: 'technical',
        timeline: action.time_estimate
      });
    });
  }
  
  // Content Strategy Actions
  if (data.phase_2_content_strategy?.content_priorities) {
    data.phase_2_content_strategy.content_priorities.forEach((content: any) => {
      actionItems.push({
        id: `action_${itemId++}`,
        title: `Create ${content.topic}`,
        description: `${content.content_type} targeting ${content.volume_opportunity}`,
        priority: 'short-term',
        effort: 'medium',
        impact: 'high',
        category: 'content',
        timeline: content.timeline
      });
    });
  }
  
  // Long-term Initiatives
  if (data.phase_3_long_term?.strategic_initiatives) {
    data.phase_3_long_term.strategic_initiatives.forEach((initiative: any) => {
      actionItems.push({
        id: `action_${itemId++}`,
        title: initiative.initiative,
        description: initiative.reason,
        priority: 'long-term',
        effort: 'high',
        impact: 'high',
        category: 'strategic',
        timeline: '3-6 months'
      });
    });
  }
  
  return actionItems;
}

function formatKeyMetrics(data: any): ConversationalKeyMetric[] {
  const metrics: ConversationalKeyMetric[] = [];
  
  if (data.executive_overview?.current_reality?.key_metrics) {
    const currentMetrics = data.executive_overview.current_reality.key_metrics;
    
    if (currentMetrics.visibility_score) {
      metrics.push({
        name: 'Visibility Score',
        current_value: currentMetrics.visibility_score,
        target_value: '0.8+',
        trend: 'stable'
      });
    }
    
    if (currentMetrics.average_position) {
      metrics.push({
        name: 'Average Position',
        current_value: currentMetrics.average_position,
        target_value: 'Top 10',
        trend: 'stable',
        context: 'Currently on page 6 of Google'
      });
    }
    
    if (currentMetrics.current_traffic) {
      metrics.push({
        name: 'Monthly Traffic',
        current_value: currentMetrics.current_traffic,
        target_value: '2,000+',
        trend: 'up'
      });
    }
  }
  
  if (data.executive_overview?.opportunity?.potential_metrics) {
    const potentialMetrics = data.executive_overview.opportunity.potential_metrics;
    
    if (potentialMetrics.potential_value) {
      metrics.push({
        name: 'Potential Value',
        current_value: potentialMetrics.potential_value,
        trend: 'up',
        context: 'Total addressable market value'
      });
    }
  }
  
  return metrics;
}