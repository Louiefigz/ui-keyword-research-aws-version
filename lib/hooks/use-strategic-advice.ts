import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStrategicAdvice, getOpportunityAnalysis, exportStrategicAdviceReport } from '@/lib/api/strategic-advice';
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
  });
}

/**
 * Hook to fetch opportunity analysis for a project
 */
export function useOpportunityAnalysis(
  projectId: string,
  filters?: {
    opportunity_type?: 'quick_wins' | 'content_gaps' | 'technical' | 'all';
    min_impact_score?: number;
    max_difficulty?: number;
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
    onError: (error) => {
      console.error('Export failed:', error);
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