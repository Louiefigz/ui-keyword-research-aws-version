'use client';

import { useParams } from 'next/navigation';
import { DashboardSummary } from '@/components/features/dashboard/dashboard-summary';
import { KeywordsDataTable } from '@/components/features/dashboard/keywords-data-table';
import { useKeywords, useDashboard } from '@/lib/hooks/use-keywords';
import { useDashboardStore } from '@/lib/store/dashboard-store';

export default function DashboardPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  // Get dashboard state and actions
  const { filters, sort, search, currentPage, pageSize } = useDashboardStore();
  const { setFilters, setSort } = useDashboardStore();
  
  // Fetch data using React Query hooks
  const { stats, statsLoading } = useDashboard(projectId);
  
  const keywordsQuery = useKeywords({
    projectId,
    filters: { ...filters, search },
    sort,
    page: currentPage,
    limit: pageSize,
  });

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: typeof sort) => {
    setSort(newSort);
  };

  const handleKeywordClick = (_keyword: { id: string; keyword: string }) => {
    // TODO: Navigate to keyword details or open modal
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Keywords Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Comprehensive analysis of your keyword opportunities and performance metrics.
        </p>
      </div>

      {/* Dashboard Summary */}
      <DashboardSummary 
        stats={stats || {
          total_keywords: 0,
          total_clusters: 0,
          avg_opportunity_score: 0,
          top_opportunity_keywords: 0,
          last_analysis_date: null
        }} 
        loading={statsLoading} 
      />

      {/* Keywords Data Table */}
      <KeywordsDataTable
        keywords={keywordsQuery.data?.data || []}
        loading={keywordsQuery.isLoading}
        error={keywordsQuery.error}
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        onKeywordClick={handleKeywordClick}
      />
    </div>
  );
}