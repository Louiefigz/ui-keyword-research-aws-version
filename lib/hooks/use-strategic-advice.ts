import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/api.constants';
import { 
  // New conversational API
  getConversationalAdvice,
  checkDataQuality,
  getSupportedFocusAreas,
  testConversationalAdviceConnection,
  exportConversationalAdviceReport,
  // Legacy API - to be deprecated
  getStrategicAdvice, 
  getOpportunityAnalysis, 
  exportStrategicAdviceReport,
  getContentStrategy,
  getCompetitiveAnalysis,
  exportStrategicSection
} from '@/lib/api/strategic-advice';
import type { 
  ConversationalAdviceFilters,
  // Legacy types
  StrategicAdviceFilters 
} from '@/types/api.types';

/**
 * ===========================================
 * NEW CONVERSATIONAL ADVICE HOOKS
 * ===========================================
 */

/**
 * Hook to fetch conversational strategic advice for a project
 * This is the main hook that provides all strategic advice in a conversational format
 */
export function useConversationalAdvice(
  projectId: string,
  filters?: ConversationalAdviceFilters,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  return useQuery({
    queryKey: [QUERY_KEYS.CONVERSATIONAL_ADVICE, projectId, filters],
    queryFn: () => getConversationalAdvice(projectId, filters),
    enabled: options?.enabled ?? !!projectId,
    refetchInterval: options?.refetchInterval,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // Enhanced retry logic for AI processing failures
    retry: (failureCount, error: any) => {
      // Retry up to 2 times for AI service failures
      if (failureCount < 2) {
        // Check if it's an AI service timeout or failure
        const isAIFailure = error?.message?.includes('timeout') || 
                           error?.message?.includes('AI service') ||
                           error?.message?.includes('conversational') ||
                           error?.code === 'ECONNABORTED';
        return isAIFailure;
      }
      return false;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

/**
 * Hook to check data quality before generating advice
 * Optional - can be used to pre-check if data is sufficient
 */
export function useDataQualityCheck(
  projectId: string,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: [QUERY_KEYS.CONVERSATIONAL_ADVICE_DATA_QUALITY, projectId],
    queryFn: () => checkDataQuality(projectId),
    enabled: options?.enabled ?? !!projectId,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get supported focus areas
 * Optional - can be used to show available focus area options
 */
export function useSupportedFocusAreas(
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: ['conversational-advice-focus-areas'],
    queryFn: getSupportedFocusAreas,
    enabled: options?.enabled ?? true,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (rarely changes)
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

/**
 * Hook to test connection to conversational advice service
 * Optional - mainly for debugging/admin purposes
 */
export function useTestConversationalAdviceConnection() {
  return useMutation({
    mutationFn: testConversationalAdviceConnection,
  });
}

/**
 * Hook to export conversational advice report
 */
export function useExportConversationalAdvice() {
  return useMutation({
    mutationFn: ({ 
      projectId, 
      format 
    }: { 
      projectId: string; 
      format: 'pdf' | 'docx' | 'markdown' 
    }) => exportConversationalAdviceReport(projectId, format),
    onSuccess: (blob, { format }) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const extension = format === 'pdf' ? 'pdf' : format === 'docx' ? 'docx' : 'md';
      link.download = `strategic-advice-report.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Export failed:', error);
    },
  });
}

/**
 * Hook to invalidate conversational advice cache
 */
export function useInvalidateConversationalAdvice() {
  const queryClient = useQueryClient();

  return (projectId?: string) => {
    if (projectId) {
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.CONVERSATIONAL_ADVICE, projectId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.CONVERSATIONAL_ADVICE_DATA_QUALITY, projectId] 
      });
    } else {
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.CONVERSATIONAL_ADVICE] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.CONVERSATIONAL_ADVICE_DATA_QUALITY] 
      });
    }
  };
}

/**
 * ===========================================
 * DEPRECATED LEGACY HOOKS - TO BE REMOVED
 * ===========================================
 */

/**
 * @deprecated Use useConversationalAdvice instead
 * Hook to fetch strategic advice for a project
 */
export function useStrategicAdvice(
  projectId: string,
  filters?: StrategicAdviceFilters,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  console.warn('useStrategicAdvice is deprecated. Use useConversationalAdvice instead.');
  
  return useQuery({
    queryKey: ['strategic-advice', projectId, filters],
    queryFn: () => getStrategicAdvice(projectId, filters),
    enabled: options?.enabled ?? !!projectId,
    refetchInterval: options?.refetchInterval,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // UPDATED: Enhanced retry logic for AI processing failures
    retry: (failureCount, error: any) => {
      // Retry up to 2 times for AI service failures
      if (failureCount < 2) {
        // Check if it's an AI service timeout or failure
        const isAIFailure = error?.message?.includes('timeout') || 
                           error?.message?.includes('AI service') ||
                           error?.code === 'ECONNABORTED';
        return isAIFailure;
      }
      return false;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

/**
 * @deprecated Use useConversationalAdvice instead
 * Hook to fetch opportunity analysis for a project
 */
export function useOpportunityAnalysis(
  projectId: string,
  filters?: {
    opportunity_type?: 'low_hanging' | 'existing' | 'gaps';
    min_volume?: number;
    limit?: number;
  },
  options?: {
    enabled?: boolean;
  }
) {
  console.warn('useOpportunityAnalysis is deprecated. Use useConversationalAdvice instead.');
  
  return useQuery({
    queryKey: ['opportunity-analysis', projectId, filters],
    queryFn: () => getOpportunityAnalysis(projectId, filters),
    enabled: options?.enabled ?? !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * @deprecated Use useExportConversationalAdvice instead
 * Hook to export strategic advice report
 */
export function useExportStrategicAdvice() {
  console.warn('useExportStrategicAdvice is deprecated. Use useExportConversationalAdvice instead.');
  
  return useMutation({
    mutationFn: ({ 
      projectId, 
      format 
    }: { 
      projectId: string; 
      format: 'pdf' | 'excel' 
    }) => exportStrategicAdviceReport(projectId, format),
    onSuccess: (blob, { format }) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `strategic-advice-report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: () => {
      // Export failed - error handling could be added here
    },
  });
}

/**
 * @deprecated Use useInvalidateConversationalAdvice instead
 * Hook to invalidate strategic advice cache
 */
export function useInvalidateStrategicAdvice() {
  console.warn('useInvalidateStrategicAdvice is deprecated. Use useInvalidateConversationalAdvice instead.');
  
  const queryClient = useQueryClient();

  return (projectId?: string) => {
    if (projectId) {
      queryClient.invalidateQueries({ 
        queryKey: ['strategic-advice', projectId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['opportunity-analysis', projectId] 
      });
    } else {
      queryClient.invalidateQueries({ 
        queryKey: ['strategic-advice'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['opportunity-analysis'] 
      });
    }
  };
}

/**
 * @deprecated Use useConversationalAdvice with focus_area='content' instead
 * Hook to fetch content strategy
 */
export function useContentStrategy(
  projectId: string,
  options?: {
    max_clusters?: number;
    timeline_months?: number;
    enabled?: boolean;
  }
) {
  console.warn('useContentStrategy is deprecated. Use useConversationalAdvice with focus_area="content" instead.');
  
  return useQuery({
    queryKey: ['content-strategy', projectId, options],
    queryFn: () => getContentStrategy(projectId, {
      max_clusters: options?.max_clusters,
      timeline_months: options?.timeline_months,
    }),
    enabled: options?.enabled ?? !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * @deprecated Use useConversationalAdvice with focus_area='competitive' instead
 * Hook to fetch competitive analysis
 */
export function useCompetitiveAnalysis(
  projectId: string,
  options?: {
    enabled?: boolean;
  }
) {
  console.warn('useCompetitiveAnalysis is deprecated. Use useConversationalAdvice with focus_area="competitive" instead.');
  
  return useQuery({
    queryKey: ['competitive-analysis', projectId],
    queryFn: () => getCompetitiveAnalysis(projectId),
    enabled: options?.enabled ?? !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}


/**
 * @deprecated Use useExportConversationalAdvice instead
 * Hook to export specific strategic sections
 */
export function useExportStrategicSection() {
  console.warn('useExportStrategicSection is deprecated. Use useExportConversationalAdvice instead.');
  
  return useMutation({
    mutationFn: ({ 
      projectId, 
      section,
      format 
    }: { 
      projectId: string;
      section: 'competitive' | 'content' | 'opportunities';
      format: 'csv' | 'pdf' | 'xlsx';
    }) => exportStrategicSection(projectId, section, format),
    onSuccess: (blob, { section, format }) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const extension = format === 'pdf' ? 'pdf' : format === 'xlsx' ? 'xlsx' : 'csv';
      link.download = `${section}-analysis.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: () => {
      // Export failed - error handling could be added here
    },
  });
} 