'use client';

import React, { useState, useMemo } from 'react';
import { DataTable, ColumnDef } from '@/components/ui/data-display/data-table';
import { Pagination } from '@/components/ui/data-display/pagination';
import { Badge } from '@/components/ui/base/badge';
import { Button } from '@/components/ui/base/button';
import { Input } from '@/components/ui/forms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/forms/select';
import { Card } from '@/components/ui/data-display/card';
import { Search, Filter, ArrowUpDown, Download, Settings } from 'lucide-react';
import { KeywordFilters, SortOptions } from '@/types/api.types';
import { DashboardKeyword } from '@/types/api/dashboard.types';

type Keyword = DashboardKeyword;
import { getOpportunityBadge, getActionBadge, getIntentBadge } from '@/lib/utils/badge-utils';

interface KeywordsDataTableProps {
  keywords: Keyword[];
  loading?: boolean;
  error?: Error | null;
  onFiltersChange?: (filters: KeywordFilters) => void;
  onSortChange?: (sort: SortOptions) => void;
  onKeywordClick?: (keyword: Keyword) => void;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
}

export function KeywordsDataTable({ 
  keywords, 
  loading = false, 
  error = null,
  onFiltersChange,
  onSortChange,
  onKeywordClick,
  // Pagination props
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  pageSize = 10
}: KeywordsDataTableProps) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<KeywordFilters>({});
  const [sort, setSort] = useState<SortOptions>({ field: 'volume', direction: 'desc' });


  // Filter and sort keywords locally for demo
  const filteredKeywords = useMemo(() => {
    let filtered = keywords;

    if (search) {
      filtered = filtered.filter(keyword => 
        keyword.keyword.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filters.opportunityLevel?.length) {
      filtered = filtered.filter(keyword => {
        // Map opportunity levels to opportunity_type values (after transformation)
        const opportunityMap: Record<string, string[]> = {
          'high': ['low_hanging'],
          'medium': ['existing'],
          'low': ['clustering', 'untapped'],
          'success': ['success']
        };
        
        return filters.opportunityLevel?.some(level => {
          const types = opportunityMap[level] || [];
          return types.includes(keyword.opportunity_type);
        });
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sort.field as keyof Keyword];
      const bValue = b[sort.field as keyof Keyword];
      
      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [keywords, search, filters, sort]);

  const handleFiltersChange = (newFilters: Partial<KeywordFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const handleSortChange = (field: string) => {
    const newSort = {
      field,
      direction: sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc'
    } as SortOptions;
    setSort(newSort);
    onSortChange?.(newSort);
  };

  const columns: ColumnDef<Keyword>[] = [
    {
      id: 'keyword',
      header: 'Keyword',
      accessor: 'keyword',
      sortable: true,
      width: '300px',
      cell: (value: unknown, row: Keyword) => (
        <div>
          <div className="font-medium cursor-pointer hover:text-blue-600" onClick={() => onKeywordClick?.(row)}>
            {value as string}
          </div>
          <div className="text-xs text-gray-500">
            {row.url}
          </div>
        </div>
      )
    },
    {
      id: 'search_volume',
      header: (
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('volume')}>
          Volume <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      accessor: (row: Keyword) => row.volume,
      cell: (value: unknown) => (value as number).toLocaleString(),
      align: 'right'
    },
    {
      id: 'keyword_difficulty',
      header: (
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('kd')}>
          KD <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      accessor: (row: Keyword) => row.kd,
      cell: (value: unknown) => `${value as number}%`,
      align: 'right'
    },
    {
      id: 'cpc',
      header: (
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('cpc')}>
          CPC <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      accessor: (row: Keyword) => row.cpc,
      cell: (value: unknown) => (
        <span className="text-green-600 font-medium">
          ${(value as number).toFixed(2)}
        </span>
      ),
      align: 'right'
    },
    {
      id: 'position',
      header: (
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('position')}>
          Position <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      accessor: (row: Keyword) => row.position,
      cell: (value: unknown) => {
        const position = value as number | null;
        if (position === null || position === undefined) {
          return (
            <Badge className="bg-gray-100 text-gray-800 text-xs font-medium">
              -
            </Badge>
          );
        }
        return (
          <Badge className={`${position <= 3 ? 'bg-green-100 text-green-800' : position <= 10 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'} text-xs font-medium`}>
            #{position}
          </Badge>
        );
      },
      align: 'center'
    },
    // Traffic column removed as it's not in the API response
    {
      id: 'intent',
      header: 'Intent',
      accessor: (row: Keyword) => row.intent,
      cell: (value: unknown) => getIntentBadge(value as string)
    },
    {
      id: 'relevance_score',
      header: (
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('relevance_score')}>
          Relevance <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      accessor: (row: Keyword) => row.relevance_score,
      cell: (value: unknown) => (
        <Badge className="bg-green-100 text-green-800 text-xs font-semibold">
          {Math.round(value as number)}
        </Badge>
      ),
      align: 'center'
    },
    {
      id: 'cluster',
      header: 'Cluster',
      accessor: (row: Keyword) => row.cluster_name,
      cell: (value: unknown) => {
        const clusterName = value as string;
        return clusterName ? (
          <div className="text-sm font-medium text-blue-600">{clusterName}</div>
        ) : (
          <span className="text-gray-400 text-sm">No cluster</span>
        );
      }
    },
    // Total points column removed as it's not directly in the API response
    {
      id: 'opportunity_level',
      header: 'Opportunity',
      accessor: (row: Keyword) => row.opportunity_type,
      cell: (value: unknown) => getOpportunityBadge(value as string),
      align: 'center'
    },
    {
      id: 'keyword_type',
      header: 'Type',
      accessor: (row: Keyword) => {
        if (row.is_primary_keyword) return 'primary';
        if (row.is_secondary_keyword) return 'secondary';
        return 'none';
      },
      cell: (value: unknown) => {
        const type = value as string;
        if (type === 'primary') {
          return <Badge className="bg-purple-100 text-purple-800 text-xs">Primary</Badge>;
        }
        if (type === 'secondary') {
          return <Badge className="bg-blue-100 text-blue-800 text-xs">Secondary</Badge>;
        }
        return <span className="text-gray-400 text-xs">-</span>;
      },
      align: 'center'
    },
    {
      id: 'recommended_action',
      header: 'Action',
      accessor: (row: Keyword) => row.action,
      cell: (value: unknown) => getActionBadge(value as string),
      align: 'center'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search keywords..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Opportunity Filter */}
          <Select 
            value={filters.opportunityLevel?.[0] || 'all'} 
            onValueChange={(value: string) => 
              handleFiltersChange({ 
                opportunityLevel: value === 'all' ? [] : [value] 
              })
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Opportunity Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="high">High (Quick Wins)</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Columns
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredKeywords.length)} of {filteredKeywords.length} keywords
          </span>
          <span>
            {filteredKeywords.filter(k => k.opportunity_type === 'low_hanging').length} quick wins available
          </span>
        </div>
      </Card>

      {/* Data Table */}
      <DataTable
        data={filteredKeywords as any[]}
        columns={columns as any[]}
        loading={loading}
        error={error}
        onRowClick={onKeywordClick as any}
        emptyMessage="No keywords found. Try adjusting your filters."
      />

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <Card className="p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            className="justify-center"
          />
        </Card>
      )}
    </div>
  );
} 