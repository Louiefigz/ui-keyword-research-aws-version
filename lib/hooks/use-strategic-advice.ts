import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getStrategicAdvice, 
  getOpportunityAnalysis, 
  exportStrategicAdviceReport,
  getContentStrategy,
  getCompetitiveAnalysis,
  exportStrategicSection
} from '@/lib/api/strategic-advice';
import type { StrategicAdviceFilters } from '@/types/api.types';

/**
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
  return useQuery({
    queryKey: ['opportunity-analysis', projectId, filters],
    queryFn: () => getOpportunityAnalysis(projectId, filters),
    enabled: options?.enabled ?? !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to export strategic advice report
 */
export function useExportStrategicAdvice() {
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
 * Hook to invalidate strategic advice cache
 */
export function useInvalidateStrategicAdvice() {
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
 * Hook to fetch competitive analysis
 */
export function useCompetitiveAnalysis(
  projectId: string,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: ['competitive-analysis', projectId],
    queryFn: () => getCompetitiveAnalysis(projectId),
    enabled: options?.enabled ?? !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}


/**
 * Hook to export specific strategic sections
 */
export function useExportStrategicSection() {
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