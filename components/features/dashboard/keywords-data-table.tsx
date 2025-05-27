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
import { DashboardKeyword as Keyword } from '@/types/api/dashboard.types';
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
  const [sort, setSort] = useState<SortOptions>({ field: 'total_points', direction: 'desc' });

  // Helper function to get nested values from objects
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Filter and sort keywords locally for demo
  const filteredKeywords = useMemo(() => {
    let filtered = keywords;

    if (search) {
      filtered = filtered.filter(keyword => 
        keyword.keyword.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filters.opportunityLevel?.length) {
      filtered = filtered.filter(keyword => 
        filters.opportunityLevel.includes(keyword.classification.opportunity)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = getNestedValue(a, sort.field);
      const bValue = getNestedValue(b, sort.field);
      
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
      cell: (value: string, row: Keyword) => (
        <div>
          <div className="font-medium cursor-pointer hover:text-blue-600" onClick={() => onKeywordClick?.(row)}>
            {value}
          </div>
          <div className="text-xs text-gray-500">
            {/* TODO: Add URL field when available in data */}
            example.com/{value.replace(/\s+/g, '-').toLowerCase()}
          </div>
        </div>
      )
    },
    {
      id: 'search_volume',
      header: (
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('metrics.volume')}>
          Volume <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      accessor: (row: Keyword) => row.metrics.volume,
      cell: (value: number) => value.toLocaleString(),
      align: 'right'
    },
    {
      id: 'keyword_difficulty',
      header: (
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('metrics.keyword_difficulty')}>
          KD <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      accessor: (row: Keyword) => row.metrics.keyword_difficulty,
      cell: (value: number) => `${value}%`,
      align: 'right'
    },
    {
      id: 'cpc',
      header: (
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('metrics.cpc')}>
          CPC <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      accessor: (row: Keyword) => row.metrics.cpc,
      cell: (value: number) => (
        <span className="text-green-600 font-medium">
          ${value.toFixed(2)}
        </span>
      ),
      align: 'right'
    },
    {
      id: 'position',
      header: (
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('metrics.position')}>
          Position <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      accessor: (row: Keyword) => row.metrics.position || Math.floor(Math.random() * 50) + 1, // TODO: Add position field to data
      cell: (value: number) => (
        <Badge className={`${value <= 3 ? 'bg-green-100 text-green-800' : value <= 10 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'} text-xs font-medium`}>
          #{value}
        </Badge>
      ),
      align: 'center'
    },
    {
      id: 'estimated_traffic',
      header: (
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('metrics.traffic')}>
          Traffic <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      accessor: (row: Keyword) => row.metrics.traffic || 0, // Use actual traffic from metrics
      cell: (value: number) => value.toLocaleString(),
      align: 'right'
    },
    {
      id: 'intent',
      header: 'Intent',
      accessor: (row: Keyword) => row.classification.intent,
      cell: (value: string) => getIntentBadge(value)
    },
    {
      id: 'relevance_score',
      header: (
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('scores.relevance_score')}>
          Relevance <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      accessor: (row: Keyword) => row.scores.relevance_score,
      cell: (value: number) => (
        <Badge className="bg-green-100 text-green-800 text-xs font-semibold">
          {Math.round(value)}
        </Badge>
      ),
      align: 'center'
    },
    {
      id: 'cluster',
      header: 'Cluster',
      accessor: (row: Keyword) => row.cluster,
      cell: (cluster: { name: string; size?: number } | null) => cluster ? (
        <div>
          <div className="text-sm font-medium text-blue-600">{cluster.name}</div>
          <div className="text-xs text-gray-500">({cluster.size || 25} keywords)</div>
        </div>
      ) : (
        <span className="text-gray-400 text-sm">No cluster</span>
      )
    },
    {
      id: 'total_points',
      header: (
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('scores.total_points')}>
          Points <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      accessor: (row: Keyword) => row.scores.total_points,
      cell: (value: number) => (
        <Badge className="bg-green-100 text-green-800 font-semibold">
          {value.toFixed(0)}
        </Badge>
      ),
      align: 'center'
    },
    {
      id: 'opportunity_level',
      header: 'Opportunity',
      accessor: (row: Keyword) => row.classification.opportunity,
      cell: (value: string) => getOpportunityBadge(value),
      align: 'center'
    },
    {
      id: 'recommended_action',
      header: 'Action',
      accessor: (row: Keyword) => row.classification.action,
      cell: (value: string) => getActionBadge(value),
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
            {filteredKeywords.filter(k => k.classification.opportunity === 'low_hanging').length} quick wins available
          </span>
        </div>
      </Card>

      {/* Data Table */}
      <DataTable
        data={filteredKeywords}
        columns={columns}
        loading={loading}
        error={error}
        onRowClick={onKeywordClick}
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