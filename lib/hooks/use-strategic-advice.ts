import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getStrategicAdvice, 
  getOpportunityAnalysis, 
  exportStrategicAdviceReport,
  getContentStrategy,
  getCompetitiveAnalysis,
  getROIProjections,
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
      // Export failed
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
    include_templates?: boolean;
    include_calendar?: boolean;
    timeframe?: '3_months' | '6_months' | '12_months';
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: ['content-strategy', projectId, options],
    queryFn: () => getContentStrategy(projectId, {
      include_templates: options?.include_templates,
      include_calendar: options?.include_calendar,
      timeframe: options?.timeframe,
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
  filters?: {
    competitors?: string[];
    min_gap_score?: number;
    include_market_share?: boolean;
    limit?: number;
  },
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: ['competitive-analysis', projectId, filters],
    queryFn: () => getCompetitiveAnalysis(projectId, filters),
    enabled: options?.enabled ?? !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch ROI projections
 */
export function useROIProjections(
  projectId: string,
  options?: {
    scenarios?: Array<'best' | 'expected' | 'worst'>;
    timeframes?: Array<'3_months' | '6_months' | '12_months'>;
    include_monthly?: boolean;
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: ['roi-projections', projectId, options],
    queryFn: () => getROIProjections(projectId, {
      scenarios: options?.scenarios,
      timeframes: options?.timeframes,
      include_monthly: options?.include_monthly,
    }),
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
      section: 'competitive' | 'content' | 'roi' | 'opportunities';
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
    onError: (error) => {
      // Export failed
    },
  });
} 