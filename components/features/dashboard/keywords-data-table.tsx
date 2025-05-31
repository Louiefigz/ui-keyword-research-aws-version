'use client';

import React from 'react';
import { DataTable } from '@/components/ui/data-display/data-table';
import { Pagination } from '@/components/ui/data-display/pagination';
import { Card } from '@/components/ui/data-display/card';
import { KeywordFilters, SortOptions } from '@/types/api.types';
import { DashboardKeyword } from '@/types/api/dashboard.types';
import { createKeywordTableColumns } from './keywords-table-columns';
import { KeywordTableControls } from './keywords-table-controls';
import { useKeywordFilters } from '@/lib/hooks/use-keyword-filters';
import { useKeywordExport } from '@/lib/hooks/use-keyword-export';

type Keyword = DashboardKeyword;

interface KeywordsDataTableProps {
  keywords: Keyword[];
  loading?: boolean;
  error?: Error | null;
  filters?: KeywordFilters;
  sort?: SortOptions;
  onFiltersChange?: (filters: KeywordFilters) => void;
  onSortChange?: (sort: SortOptions) => void;
  onKeywordClick?: (keyword: Keyword) => void;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  // Project ID for export
  projectId?: string;
}

export function KeywordsDataTable({ 
  keywords, 
  loading = false, 
  error = null,
  filters = {},
  sort,
  onFiltersChange,
  onSortChange,
  onKeywordClick,
  // Pagination props
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  pageSize = 10,
  projectId
}: KeywordsDataTableProps) {
  // Custom hooks for separated concerns
  const filterHooks = useKeywordFilters({
    initialFilters: filters,
    onFiltersChange
  });
  
  const { isExporting, handleExport } = useKeywordExport({
    projectId,
    filters
  });

  // Handle sort changes
  const handleSortChange = (field: string) => {
    const newDirection = sort?.field === field && sort?.direction === 'asc' ? 'desc' : 'asc';
    onSortChange?.({ field, direction: newDirection } as SortOptions);
  };

  // Create table columns with handlers
  const columns = createKeywordTableColumns({
    onKeywordClick,
    onSortChange: handleSortChange
  });
  
  // Calculate quick wins count for current page
  const quickWinsCount = keywords.filter(k => k.opportunity_type === 'low_hanging').length;


  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-6">
        <KeywordTableControls
          localSearch={filterHooks.localSearch}
          onSearchChange={filterHooks.handleSearchChange}
          filters={filters}
          tempFilters={filterHooks.tempFilters}
          filtersOpen={filterHooks.filtersOpen}
          onFiltersOpenChange={filterHooks.setFiltersOpen}
          onTempFiltersChange={filterHooks.setTempFilters}
          onApplyFilters={filterHooks.handleApplyFilters}
          onResetFilters={filterHooks.handleResetFilters}
          onOpportunityChange={filterHooks.handleOpportunityChange}
          isExporting={isExporting}
          onExport={(format) => handleExport({ format })}
          projectId={projectId}
          totalItems={totalItems}
          currentPage={currentPage}
          pageSize={pageSize}
          quickWinsCount={quickWinsCount}
        />
      </Card>

      {/* Data Table */}
      <DataTable
        data={keywords as any[]}
        columns={columns as any[]}
        loading={loading}
        error={error}
        onRowClick={onKeywordClick as any}
        emptyMessage="No keywords found. Try adjusting your filters."
      />

      {/* Pagination - Always show if we have data or more than one page */}
      {(totalItems > pageSize || totalPages > 1) && onPageChange && (
        <Card className="p-4">
          <div className="flex flex-col space-y-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              className="justify-center"
            />
            <div className="text-center text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
} 