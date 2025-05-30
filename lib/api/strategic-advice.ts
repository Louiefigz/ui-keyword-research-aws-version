/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */

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
  CompetitiveAnalysisData,
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
// Helper function to build query string
function buildQueryString(filters?: ConversationalAdviceFilters): string {
  if (!filters) return '';

  const params = new URLSearchParams();

  if (filters.focus_area) {
    params.append('focus_area', filters.focus_area);
  }
  if (filters.include_projections !== undefined) {
    params.append('include_projections', filters.include_projections.toString());
  }
  if (filters.detail_level) {
    params.append('detail_level', filters.detail_level);
  }

  return params.toString();
}

// Helper function to transform response
function transformConversationalResponse(
  rawData: Record<string, any>,
  projectId: string
): ConversationalAdviceResponse {
  return {
    project_id: projectId,
    generated_at: rawData._metadata?.generated_at || new Date().toISOString(),
    conversation_id: `conv_${Date.now()}`,
    status: 'success' as const,
    data_quality: rawData._metadata?.data_quality
      ? {
          has_sufficient_data: rawData._metadata.data_quality.level !== 'poor',
          quality_score: Math.round(parseFloat(rawData._metadata.data_quality.score) * 100),
          missing_data_types: [],
          recommendations: [],
        }
      : undefined,
    advice: {
      executive_summary: formatExecutiveSummary(rawData.executive_overview || rawData),
      sections: formatSections(rawData),
      action_items: formatActionItems(rawData),
      key_metrics: formatKeyMetrics(rawData),
    },
    metadata: {
      generation_time_ms: Math.round((rawData._metadata?.generation_time_seconds || 0) * 1000),
      model_version: 'conversational-v1',
      focus_area: rawData._metadata?.options_used?.focus_area,
    },
  };
}

export async function getConversationalAdvice(
  projectId: string,
  filters?: ConversationalAdviceFilters
): Promise<ConversationalAdviceResponse> {
  const queryString = buildQueryString(filters);
  const url = `${API_ENDPOINTS.CONVERSATIONAL_ADVICE(projectId)}${queryString ? `?${queryString}` : ''}`;

  // Use the default client timeout (5 minutes) for AI processing
  const response = await apiClient.get(url);
  const rawData = response.data;

  // Check if the response is already in the expected format
  if (rawData.advice && rawData.conversation_id) {
    return transformApiResponse<ConversationalAdviceResponse>(rawData);
  }

  // Otherwise, transform the raw conversational data into the expected structure
  return transformConversationalResponse(rawData, projectId);
}

/**
 * Check data quality before generating advice
 * Optional - can be used to pre-check if data is sufficient
 */
export async function checkDataQuality(projectId: string): Promise<DataQualityCheckResponse> {
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

  const response = await apiClient.post(url);
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
    timeout: 5 * 60 * 1000, // 5 minutes for AI-enhanced strategic advice
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
  console.warn(
    'exportStrategicAdviceReport is deprecated. Use exportConversationalAdviceReport instead.'
  );

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
  console.warn(
    'getContentStrategy is deprecated. Use getConversationalAdvice with focus_area="content" instead.'
  );

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
export async function getCompetitiveAnalysis(projectId: string): Promise<CompetitiveAnalysisData> {
  console.warn(
    'getCompetitiveAnalysis is deprecated. Use getConversationalAdvice with focus_area="competitive" instead.'
  );

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
  console.warn(
    'exportStrategicSection is deprecated. Use exportConversationalAdviceReport instead.'
  );

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

function formatExecutiveSummary(data: Record<string, any>): string {
  const overview = data.executive_overview || data;

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

// Helper functions to reduce complexity
function formatProblemSection(problems: Record<string, any>): ConversationalSection | null {
  if (!problems) return null;

  const problemsArray = Object.values(problems);
  return {
    id: 'problems',
    title: 'Your Three Biggest Problems',
    content: 'Here are the main issues holding back your SEO performance:',
    priority: 'critical',
    subsections: problemsArray.map((problem, idx) => ({
      id: `problem_${idx}`,
      title: problem.name,
      content: `${problem.explanation}\n\n**Evidence:** ${problem.evidence}\n\n**Difficulty to Fix:** ${problem.fix_difficulty}`,
      bulletPoints: [`Impact: ${problem.impact}`],
    })),
  };
}

function formatQuickWinsSection(quickWins: Record<string, any>): ConversationalSection | null {
  if (!quickWins) return null;

  return {
    id: 'quick_wins',
    title: `Phase 1: Quick Wins (${quickWins.timeline || '2-3 weeks'})`,
    content: quickWins.why_this_first || 'Start with these optimizations for fast results.',
    priority: 'high',
    subsections: [
      {
        id: 'quick_wins_actions',
        title: 'Immediate Actions',
        content: `Total Opportunity: ${quickWins.total_opportunity || 'Significant traffic gains'}`,
        bulletPoints:
          quickWins.immediate_actions?.map((action: Record<string, any> | string) =>
            typeof action === 'string'
              ? action
              : `${action.task} (${action.time_estimate || action.time_required}): ${action.expected_result || action.expected_impact}`
          ) || [],
      },
    ],
  };
}

function formatContentSection(contentStrategy: Record<string, any>): ConversationalSection | null {
  if (!contentStrategy) return null;

  return {
    id: 'content_strategy',
    title: `Phase 2: Content Strategy (${contentStrategy.timeline || '1-3 months'})`,
    content: 'Strategic content creation to capture high-value search traffic.',
    priority: 'high',
    subsections:
      contentStrategy.content_priorities?.map(
        (priority: Record<string, any> | string, idx: number) => ({
          id: `content_${idx}`,
          title:
            typeof priority === 'string'
              ? `Content Priority ${idx + 1}`
              : priority.cluster || priority.topic || 'Content Priority',
          content:
            typeof priority === 'string'
              ? priority
              : priority.content_needed ||
                `Create content targeting ${priority.potential_traffic || 'high-value keywords'}`,
          bulletPoints:
            typeof priority === 'string'
              ? []
              : [
                  `Priority: ${priority.priority || 'HIGH'}`,
                  `Difficulty: ${priority.difficulty || 'Medium'}`,
                  `Potential Traffic: ${priority.potential_traffic || 'TBD'}`,
                ],
        })
      ) || [],
  };
}

function formatSections(data: Record<string, any>): ConversationalSection[] {
  const sections: ConversationalSection[] = [];

  // Problem Analysis Section
  const problemSection = formatProblemSection(data.your_three_biggest_problems);
  if (problemSection) sections.push(problemSection);

  // Quick Wins Section
  const quickWinsSection = formatQuickWinsSection(data.phase_1_quick_wins);
  if (quickWinsSection) sections.push(quickWinsSection);

  // Content Strategy Section
  const contentSection = formatContentSection(data.phase_2_content_strategy);
  if (contentSection) sections.push(contentSection);

  // Long-term Strategy Section
  if (data.phase_3_long_term) {
    const longTerm = data.phase_3_long_term;
    sections.push({
      id: 'long_term',
      title: `Phase 3: Long-term Strategy (${longTerm.timeline || '3-6 months'})`,
      content:
        longTerm.competitive_positioning?.strategy || 'Build sustainable competitive advantage.',
      priority: 'medium',
      subsections:
        longTerm.strategic_initiatives?.map(
          (initiative: Record<string, any> | string, idx: number) => ({
            id: `initiative_${idx}`,
            title: typeof initiative === 'string' ? `Initiative ${idx + 1}` : initiative.initiative,
            content:
              typeof initiative === 'string'
                ? initiative
                : initiative.description || initiative.rationale || initiative.reason,
            bulletPoints: typeof initiative === 'string' ? [] : initiative.actions || [],
          })
        ) || [],
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
            value:
              investment.money_required?.tools_and_tracking ||
              investment.money_required?.tools ||
              'N/A',
          },
          {
            label: 'Content Cost',
            value:
              investment.money_required?.content_creation ||
              investment.money_required?.content ||
              'N/A',
          },
          {
            label: 'Time Required (Phase 1)',
            value: investment.time_required?.phase_1 || 'N/A',
          },
          {
            label: 'Time Required (Phase 2)',
            value: investment.time_required?.phase_2 || 'N/A',
          },
        ],
      },
    });
  }

  return sections;
}

// Helper functions for action items
function formatQuickWinActions(
  actions: (Record<string, any> | string)[],
  startId: number
): ConversationalActionItem[] {
  return actions.map((action, idx) => ({
    id: `action_${startId + idx}`,
    title: typeof action === 'string' ? action : action.task,
    description: typeof action === 'string' ? '' : action.details || action.expected_impact || '',
    priority: 'immediate' as const,
    effort: 'low' as const,
    impact: 'high' as const,
    category: 'technical' as const,
    timeline:
      typeof action === 'string' ? '' : action.time_estimate || action.time_required || '2-4 hours',
  }));
}

function formatContentActions(
  priorities: (Record<string, any> | string)[],
  startId: number
): ConversationalActionItem[] {
  return priorities.map((content, idx) => ({
    id: `action_${startId + idx}`,
    title:
      typeof content === 'string'
        ? content
        : content.content_needed || `Create content for ${content.cluster}`,
    description:
      typeof content === 'string'
        ? ''
        : `Target: ${content.potential_traffic || 'High-value traffic'} • ${content.difficulty || 'Medium difficulty'}`,
    priority: 'short-term' as const,
    effort: 'medium' as const,
    impact: 'high' as const,
    category: 'content' as const,
    timeline: '1-3 months',
  }));
}

function formatActionItems(data: Record<string, any>): ConversationalActionItem[] {
  const actionItems: ConversationalActionItem[] = [];
  let itemId = 0;

  // Quick Wins Actions
  if (data.phase_1_quick_wins?.immediate_actions) {
    const quickWinItems = formatQuickWinActions(data.phase_1_quick_wins.immediate_actions, itemId);
    actionItems.push(...quickWinItems);
    itemId += quickWinItems.length;
  }

  // Content Strategy Actions
  if (data.phase_2_content_strategy?.content_priorities) {
    const contentItems = formatContentActions(
      data.phase_2_content_strategy.content_priorities,
      itemId
    );
    actionItems.push(...contentItems);
    itemId += contentItems.length;
  }

  // Long-term Initiatives
  if (data.phase_3_long_term?.strategic_initiatives) {
    data.phase_3_long_term.strategic_initiatives.forEach(
      (initiative: Record<string, any> | string) => {
        actionItems.push({
          id: `action_${itemId++}`,
          title: typeof initiative === 'string' ? initiative : initiative.initiative,
          description:
            typeof initiative === 'string'
              ? ''
              : initiative.description || initiative.rationale || '',
          priority: 'long-term',
          effort: 'high',
          impact: 'high',
          category: 'strategic',
          timeline: data.phase_3_long_term.timeline || '3-6 months',
        });
      }
    );
  }

  return actionItems;
}

// Helper functions for metrics
function formatCurrentMetrics(currentMetrics: Record<string, any>): ConversationalKeyMetric[] {
  const metrics: ConversationalKeyMetric[] = [];

  if (currentMetrics.ranking_keywords) {
    metrics.push({
      name: 'Ranking Keywords',
      current_value: currentMetrics.ranking_keywords,
      target_value: '50+',
      trend: 'stable',
    });
  }

  if (currentMetrics.average_position) {
    metrics.push({
      name: 'Average Position',
      current_value: currentMetrics.average_position,
      target_value: 'Top 20',
      trend: 'stable',
      context: `Currently ranking position ${currentMetrics.average_position}`,
    });
  }

  if (currentMetrics.monthly_organic_traffic) {
    metrics.push({
      name: 'Monthly Traffic',
      current_value: currentMetrics.monthly_organic_traffic,
      target_value: '2,000+',
      trend: 'up',
    });
  }

  if (currentMetrics.top_10_rankings) {
    metrics.push({
      name: 'Top 10 Rankings',
      current_value: currentMetrics.top_10_rankings,
      target_value: '50+',
      trend: 'up',
    });
  }

  return metrics;
}

function formatKeyMetrics(data: Record<string, any>): ConversationalKeyMetric[] {
  const metrics: ConversationalKeyMetric[] = [];

  // Current metrics
  if (data.executive_overview?.current_reality?.key_metrics) {
    metrics.push(...formatCurrentMetrics(data.executive_overview.current_reality.key_metrics));
  }

  // Potential metrics
  if (data.executive_overview?.opportunity?.potential_metrics) {
    const potentialMetrics = data.executive_overview.opportunity.potential_metrics;

    if (potentialMetrics.untapped_search_volume) {
      metrics.push({
        name: 'Untapped Volume',
        current_value: potentialMetrics.untapped_search_volume,
        trend: 'up',
        context: 'Monthly searches available',
      });
    }

    if (potentialMetrics.quick_win_potential) {
      metrics.push({
        name: 'Quick Win Potential',
        current_value: potentialMetrics.quick_win_potential,
        trend: 'up',
        context: 'From immediate optimizations',
      });
    }
  }

  return metrics;
}
