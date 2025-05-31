'use client';

import { useParams } from 'next/navigation';
import { useCallback } from 'react';
import { useDashboardStore } from '@/lib/store/dashboard-store';
import { useKeywords, useDashboard } from '@/lib/hooks/use-keywords';
import { DashboardSummary } from '@/components/features/dashboard/dashboard-summary';
import { KeywordsDataTable } from '@/components/features/dashboard/keywords-data-table';

function useDashboardHandlers() {
  const { setFilters, setSort, setPage, setSearch } = useDashboardStore();
  
  const handleFiltersChange = useCallback((newFilters: Record<string, unknown>) => {
    if ('search' in newFilters) {
      const { search: searchValue, ...otherFilters } = newFilters;
      if (searchValue !== undefined) {
        setSearch(searchValue as string);
      }
      setFilters(otherFilters);
    } else {
      setFilters(newFilters);
    }
  }, [setFilters, setSearch]);

  const handleSortChange = useCallback((newSort: Parameters<typeof setSort>[0]) => {
    setSort(newSort);
  }, [setSort]);

  const handlePageChange = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

  return { handleFiltersChange, handleSortChange, handlePageChange };
}

export default function DashboardPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const { filters, sort, search, currentPage, pageSize } = useDashboardStore();
  const { stats, statsLoading } = useDashboard(projectId);
  const keywordsQuery = useKeywords({
    projectId,
    filters: { ...filters, search },
    sort,
    page: currentPage,
    limit: pageSize,
  });

  const { handleFiltersChange, handleSortChange, handlePageChange } = useDashboardHandlers();
  const handleKeywordClick = useCallback((_keyword: { id: string; keyword: string }) => {
    // TODO: Navigate to keyword details or open modal
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Keywords Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Analyze and optimize your keyword performance
        </p>
      </div>
      
      {/* Dashboard Summary */}
      <DashboardSummary 
        stats={stats} 
        loading={statsLoading} 
      />
      
      {/* Keywords Data Table */}
      <KeywordsDataTable
        keywords={keywordsQuery.data?.data || []}
        loading={keywordsQuery.isLoading}
        error={keywordsQuery.error}
        filters={filters}
        sort={sort}
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        onKeywordClick={handleKeywordClick}
        currentPage={currentPage}
        totalPages={keywordsQuery.data?.pagination?.totalPages || 1}
        totalItems={keywordsQuery.data?.pagination?.total || 0}
        onPageChange={handlePageChange}
        pageSize={pageSize}
      />
    </div>
  );
}