'use client';

import { useParams } from 'next/navigation';
import { useCallback } from 'react';
import { useDashboardStore } from '@/lib/store/dashboard-store';
import { useKeywords, useDashboard } from '@/lib/hooks/use-keywords';
import { DashboardSummary } from '@/components/features/dashboard/dashboard-summary';
import { KeywordsDataTable } from '@/components/features/dashboard/keywords-data-table';

export default function DashboardPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  // Test store import
  const { filters, sort, search, currentPage, pageSize } = useDashboardStore();
  
  // Test hooks import
  const { stats, statsLoading } = useDashboard(projectId);
  const keywordsQuery = useKeywords({
    projectId,
    filters: { ...filters, search },
    sort,
    page: currentPage,
    limit: pageSize,
  });

  // Handlers for KeywordsDataTable
  const { setFilters, setSort, setPage, setSearch } = useDashboardStore();

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    if ('search' in newFilters) {
      const { search: searchValue, ...otherFilters } = newFilters;
      if (searchValue !== undefined) {
        setSearch(searchValue);
      }
      setFilters(otherFilters);
    } else {
      setFilters(newFilters);
    }
  }, [setFilters, setSearch]);

  const handleSortChange = useCallback((newSort: typeof sort) => {
    setSort(newSort);
  }, [setSort]);

  const handleKeywordClick = useCallback((_keyword: { id: string; keyword: string }) => {
    // TODO: Navigate to keyword details or open modal
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Keywords Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Project ID: {projectId}
        </p>
        <p className="text-sm text-gray-500">
          Current page: {currentPage}, Page size: {pageSize}
        </p>
        <p className="text-sm text-blue-500">
          Stats loading: {statsLoading ? 'Yes' : 'No'}, Keywords loading: {keywordsQuery.isLoading ? 'Yes' : 'No'}
        </p>
      </div>
      <div className="p-8 bg-gray-100 rounded">
        <p>Dashboard is loading...</p>
      </div>
      
      {/* Test DashboardSummary */}
      <DashboardSummary 
        stats={stats} 
        loading={statsLoading} 
      />
      
      {/* Test KeywordsDataTable */}
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