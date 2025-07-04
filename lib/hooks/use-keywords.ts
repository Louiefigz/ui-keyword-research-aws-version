import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getKeywords, 
  getProjectStats, 
  exportKeywords,
  GetKeywordsParams 
} from '@/lib/api/keywords';
import { 
  DashboardKeyword, 
  KeywordFilters, 
  SortOptions 
} from '@/types/api.types';

// Query keys for React Query
export const keywordKeys = {
  all: ['keywords'] as const,
  lists: () => [...keywordKeys.all, 'list'] as const,
  list: (projectId: string, filters?: KeywordFilters, sort?: SortOptions, page?: number) => 
    [...keywordKeys.lists(), projectId, filters, sort, page] as const,
  details: () => [...keywordKeys.all, 'detail'] as const,
  detail: (projectId: string, keywordId: string) => 
    [...keywordKeys.details(), projectId, keywordId] as const,
  stats: (projectId: string) => [...keywordKeys.all, 'stats', projectId] as const,
};

/**
 * Hook for fetching keywords with filters, sorting, and pagination
 */
export function useKeywords(params: GetKeywordsParams) {
  return useQuery({
    queryKey: keywordKeys.list(
      params.projectId, 
      params.filters, 
      params.sort, 
      params.page
    ),
    queryFn: () => getKeywords(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1, // Retry once on failure
  });
}

/**
 * Hook for fetching project statistics for dashboard summary
 */
export function useProjectStats(projectId: string) {
  return useQuery({
    queryKey: keywordKeys.stats(projectId),
    queryFn: () => getProjectStats(projectId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * NOTE: The following hooks are commented out because the backend
 * does not implement individual keyword fetch/update endpoints.
 * Use CSV upload with update strategy for bulk updates.
 */

// export function useKeyword(projectId: string, keywordId: string, enabled = true) {
//   return useQuery({
//     queryKey: keywordKeys.detail(projectId, keywordId),
//     queryFn: () => getKeyword(projectId, keywordId),
//     enabled: enabled && !!keywordId,
//     staleTime: 5 * 60 * 1000,
//   });
// }

// export function useUpdateKeyword() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ 
//       projectId, 
//       keywordId, 
//       updates 
//     }: {
//       projectId: string;
//       keywordId: string;
//       updates: Partial<Pick<Keyword, 'scores' | 'classification'>>;
//     }) => updateKeyword(projectId, keywordId, updates),
//     onSuccess: (updatedKeyword, { projectId, keywordId }) => {
//       queryClient.setQueryData(
//         keywordKeys.detail(projectId, keywordId),
//         updatedKeyword
//       );
//       queryClient.invalidateQueries({
//         queryKey: keywordKeys.lists(),
//       });
//       queryClient.invalidateQueries({
//         queryKey: keywordKeys.stats(projectId),
//       });
//     },
//   });
// }

// export function useBulkUpdateKeywords() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ 
//       projectId, 
//       updates 
//     }: {
//       projectId: string;
//       updates: Array<{
//         keywordId: string;
//         updates: Partial<Pick<Keyword, 'scores' | 'classification'>>;
//       }>;
//     }) => bulkUpdateKeywords(projectId, updates),
//     onSuccess: (result, { projectId }) => {
//       queryClient.invalidateQueries({
//         queryKey: keywordKeys.lists(),
//       });
//       queryClient.invalidateQueries({
//         queryKey: keywordKeys.stats(projectId),
//       });
//     },
//   });
// }

/**
 * Hook for exporting keywords
 */
export function useExportKeywords() {
  return useMutation({
    mutationFn: ({ 
      projectId, 
      options 
    }: {
      projectId: string;
      options: {
        format: 'csv' | 'xlsx' | 'json';
        filters?: KeywordFilters;
        columns?: string[];
      };
    }) => exportKeywords(projectId, options),
    onSuccess: (blob, { options }) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `keywords-export.${options.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}

/**
 * Custom hook that provides common dashboard data and operations
 */
export function useDashboard(projectId: string) {
  const statsQuery = useProjectStats(projectId);
  const exportMutation = useExportKeywords();

  return {
    // Data
    stats: statsQuery.data,
    statsLoading: statsQuery.isLoading,
    statsError: statsQuery.error,
    
    // Operations
    // Note: Individual keyword updates are not supported by the backend
    // Use CSV upload with update strategy for bulk updates
    
    exportKeywords: exportMutation.mutate,
    exportKeywordsAsync: exportMutation.mutateAsync,
    isExporting: exportMutation.isPending,
    
    // Utility
    refetchStats: statsQuery.refetch,
  };
} 