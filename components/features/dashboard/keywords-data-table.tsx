'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { DataTable, ColumnDef } from '@/components/ui/data-display/data-table';
import { Pagination } from '@/components/ui/data-display/pagination';
import { Badge } from '@/components/ui/base/badge';
import { Button } from '@/components/ui/base/button';
import { Input } from '@/components/ui/forms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/forms/select';
import { Card } from '@/components/ui/data-display/card';
import { Search, Filter, ArrowUpDown, Download, Settings, X } from 'lucide-react';
import { KeywordFilters, SortOptions } from '@/types/api.types';
import { DashboardKeyword } from '@/types/api/dashboard.types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/overlays/popover';
import { Label } from '@/components/ui/forms/label';

type Keyword = DashboardKeyword;
import { getOpportunityBadge, getActionBadge, getIntentBadge } from '@/lib/utils/badge-components';

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
  pageSize = 10
}: KeywordsDataTableProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<KeywordFilters>({});
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search handler - directly call parent's onFiltersChange
  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for 300ms debounce
    searchTimeoutRef.current = setTimeout(() => {
      onFiltersChange?.({ search: value });
    }, 300);
  }, [onFiltersChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSortChange = (field: string) => {
    const newDirection = sort?.field === field && sort?.direction === 'asc' ? 'desc' : 'asc';
    onSortChange?.({ field, direction: newDirection } as SortOptions);
  };

  // Initialize temp filters when popover opens
  useEffect(() => {
    if (filtersOpen) {
      // Copy current filters excluding search and opportunityLevel 
      // since those are handled separately outside the popover
      const { search, opportunityLevel, ...popoverFilters } = filters;
      setTempFilters(popoverFilters);
    }
  }, [filtersOpen, filters]);

  const handleApplyFilters = () => {
    console.log('Applying filters - tempFilters:', tempFilters);
    console.log('Existing filters:', filters);
    
    // Get search and opportunityLevel from existing filters (these are managed outside popover)
    const { search, opportunityLevel } = filters;
    
    // Build new filters object
    const newFilters: KeywordFilters = {};
    
    // Add search and opportunityLevel if they exist
    if (search) newFilters.search = search;
    if (opportunityLevel && opportunityLevel.length > 0) newFilters.opportunityLevel = opportunityLevel;
    
    // Add popover filters only if they have values
    if (tempFilters.minVolume !== undefined) newFilters.minVolume = tempFilters.minVolume;
    if (tempFilters.maxVolume !== undefined) newFilters.maxVolume = tempFilters.maxVolume;
    if (tempFilters.minDifficulty !== undefined) newFilters.minDifficulty = tempFilters.minDifficulty;
    if (tempFilters.maxDifficulty !== undefined) newFilters.maxDifficulty = tempFilters.maxDifficulty;
    if (tempFilters.intent && tempFilters.intent.length > 0) newFilters.intent = tempFilters.intent;
    
    console.log('New filters to apply:', newFilters);
    
    // Always call onFiltersChange even if filters are empty to trigger refresh
    onFiltersChange?.(newFilters);
    setFiltersOpen(false);
  };

  const handleResetFilters = () => {
    // Only reset the temporary filters in the popover
    // Don't apply changes until user clicks "Apply Filters"
    setTempFilters({});
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
      cell: (value: unknown) => value != null ? (value as number).toLocaleString() : '0',
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
      cell: (value: unknown) => value != null ? `${value as number}%` : '0%',
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
          ${value != null ? (value as number).toFixed(2) : '0.00'}
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
          {value != null ? Math.round(value as number) : 0}
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
                value={localSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Opportunity Filter */}
          <Select 
            value={filters.opportunityLevel?.[0] || 'all'} 
            onValueChange={(value: string) => 
              onFiltersChange?.({ 
                ...filters,
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
            <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                  {Object.keys(filters).filter(k => k !== 'search' && k !== 'opportunityLevel').length > 0 && (
                    <Badge className="ml-2 bg-blue-100 text-blue-800">
                      {Object.keys(filters).filter(k => k !== 'search' && k !== 'opportunityLevel').length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96" align="end">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Advanced Filters</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setFiltersOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Volume Range */}
                    <div className="space-y-2">
                      <Label>Search Volume</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={tempFilters.minVolume || ''}
                          onChange={(e) => setTempFilters({
                            ...tempFilters,
                            minVolume: e.target.value ? parseInt(e.target.value) : undefined
                          })}
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={tempFilters.maxVolume || ''}
                          onChange={(e) => setTempFilters({
                            ...tempFilters,
                            maxVolume: e.target.value ? parseInt(e.target.value) : undefined
                          })}
                        />
                      </div>
                    </div>

                    {/* Difficulty Range */}
                    <div className="space-y-2">
                      <Label>Keyword Difficulty</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={tempFilters.minDifficulty || ''}
                          onChange={(e) => setTempFilters({
                            ...tempFilters,
                            minDifficulty: e.target.value ? parseInt(e.target.value) : undefined
                          })}
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={tempFilters.maxDifficulty || ''}
                          onChange={(e) => setTempFilters({
                            ...tempFilters,
                            maxDifficulty: e.target.value ? parseInt(e.target.value) : undefined
                          })}
                        />
                      </div>
                    </div>

                    {/* Intent Filter */}
                    <div className="space-y-2">
                      <Label>Search Intent</Label>
                      <Select 
                        value={tempFilters.intent?.[0] || 'all'} 
                        onValueChange={(value) => setTempFilters({
                          ...tempFilters,
                          intent: value === 'all' ? undefined : [value]
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Intents" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Intents</SelectItem>
                          <SelectItem value="informational">Informational</SelectItem>
                          <SelectItem value="navigational">Navigational</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="transactional">Transactional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={handleResetFilters}>
                      Reset
                    </Button>
                    <Button size="sm" onClick={handleApplyFilters}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
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
            {totalItems > 0 ? (
              <>Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems} keywords</>
            ) : (
              'No keywords found'
            )}
          </span>
          <span>
            {keywords.filter(k => k.opportunity_type === 'low_hanging').length} quick wins on this page
          </span>
        </div>
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