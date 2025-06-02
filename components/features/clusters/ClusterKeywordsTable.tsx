'use client';

import { useState } from 'react';
import { DataTable, Column, Pagination } from '@/components/ui/data-display';
import { Badge, Skeleton, Button } from '@/components/ui/base';
import { Input } from '@/components/ui/forms';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ClusterKeyword, PaginationInfo } from '@/types';
import { formatNumber } from '@/lib/utils/format';
import { getOpportunityBadgeVariant, getActionBadgeVariant, getIntentBadgeVariant } from '@/lib/utils';

interface ClusterKeywordsTableProps {
  keywords: ClusterKeyword[];
  pagination?: PaginationInfo;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
}

export function ClusterKeywordsTable({ keywords, pagination, isLoading, onPageChange }: ClusterKeywordsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Ensure keywords is an array
  const keywordsArray = Array.isArray(keywords) ? keywords : [];

  // If pagination is available, don't filter locally (server-side pagination)
  // Otherwise filter locally for non-paginated data
  const filteredKeywords = pagination 
    ? keywordsArray 
    : keywordsArray.filter((kw) => kw.keyword.toLowerCase().includes(searchTerm.toLowerCase()));

  const columns: Column<ClusterKeyword>[] = [
    {
      id: 'keyword',
      header: 'Keyword',
      accessor: 'keyword',
      cell: (value: unknown) => (
        <span className="font-medium">{value as string}</span>
      ),
    },
    {
      id: 'volume',
      header: 'Search Volume',
      accessor: 'volume',
      cell: (value: unknown) => formatNumber(value as number),
    },
    {
      id: 'kd',
      header: 'Difficulty',
      accessor: 'kd',
      cell: (value: unknown) => (
        <Badge variant={(value as number) <= 30 ? 'success' : (value as number) <= 60 ? 'warning' : 'destructive'}>
          {Math.round(value as number)}%
        </Badge>
      ),
    },
    {
      id: 'position',
      header: 'Position',
      accessor: 'position',
      cell: (value: unknown) => {
        const position = value as number | null;
        if (position === null || position === undefined) {
          return <span className="text-gray-400">-</span>;
        }
        return (
          <Badge variant={position <= 3 ? 'success' : position <= 10 ? 'warning' : 'secondary'}>
            #{position}
          </Badge>
        );
      },
    },
    {
      id: 'intent',
      header: 'Intent',
      accessor: 'intent',
      cell: (value: unknown) => {
        return <Badge variant={getIntentBadgeVariant(value as string)}>{value as string}</Badge>;
      },
    },
    {
      id: 'opportunity_type',
      header: 'Opportunity',
      accessor: 'opportunity_type',
      cell: (value: unknown) => {
        return <Badge variant={getOpportunityBadgeVariant(value as string)}>{value as string}</Badge>;
      },
    },
    {
      id: 'action',
      header: 'Action',
      accessor: 'action',
      cell: (value: unknown) => {
        return <Badge variant={getActionBadgeVariant(value as string)}>{value as string}</Badge>;
      },
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Keywords in Cluster ({pagination?.total_filtered || pagination?.total_count || keywordsArray.length})
        </h3>
        {!pagination && (
          <Input
            placeholder="Search keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : keywordsArray.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No keywords found in this cluster
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filteredKeywords}
          />
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(Math.max(1, (pagination?.page || 1) - 1))}
                disabled={!pagination || !onPageChange || (pagination?.page || 1) <= 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <span className="text-sm text-gray-600">
                Page {pagination?.page || 1}
                {pagination?.total_filtered && pagination?.page_size ? 
                  ` of ${Math.ceil(pagination.total_filtered / pagination.page_size)}` : 
                  ''
                }
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.((pagination?.page || 1) + 1)}
                disabled={!pagination || !onPageChange || !pagination?.has_more}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}