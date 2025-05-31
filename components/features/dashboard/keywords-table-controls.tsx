'use client';

import React from 'react';
import { Search, Filter, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/base/button';
import { Input } from '@/components/ui/forms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/forms/select';
import { Badge } from '@/components/ui/base/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/overlays/popover';
import { KeywordFilters } from '@/types/api.types';
import { KeywordAdvancedFilters } from './keywords-advanced-filters';
import { KeywordExportPopover } from './keywords-export-popover';

interface KeywordTableControlsProps {
  // Search
  localSearch: string;
  onSearchChange: (value: string) => void;
  
  // Filters
  filters: KeywordFilters;
  tempFilters: KeywordFilters;
  filtersOpen: boolean;
  onFiltersOpenChange: (open: boolean) => void;
  onTempFiltersChange: (filters: KeywordFilters) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onOpportunityChange: (value: string) => void;
  
  // Export
  isExporting: boolean;
  onExport: (format: 'csv' | 'excel' | 'json') => void;
  projectId?: string;
  
  // Results
  totalItems: number;
  currentPage: number;
  pageSize: number;
  quickWinsCount: number;
}

export function KeywordTableControls({
  localSearch,
  onSearchChange,
  filters,
  tempFilters,
  filtersOpen,
  onFiltersOpenChange,
  onTempFiltersChange,
  onApplyFilters,
  onResetFilters,
  onOpportunityChange,
  isExporting,
  onExport,
  projectId,
  totalItems,
  currentPage,
  pageSize,
  quickWinsCount
}: KeywordTableControlsProps) {
  const activeFiltersCount = Object.keys(filters).filter(k => k !== 'search' && k !== 'opportunityLevel').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search keywords..."
              value={localSearch}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Opportunity Filter */}
        <Select 
          value={filters.opportunityLevel?.[0] || 'all'} 
          onValueChange={onOpportunityChange}
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
          <Popover open={filtersOpen} onOpenChange={onFiltersOpenChange}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96" align="end">
              <KeywordAdvancedFilters
                tempFilters={tempFilters}
                onTempFiltersChange={onTempFiltersChange}
                onApplyFilters={onApplyFilters}
                onResetFilters={onResetFilters}
                onClose={() => onFiltersOpenChange(false)}
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Columns
          </Button>
          
          <KeywordExportPopover
            isExporting={isExporting}
            onExport={onExport}
            projectId={projectId}
            totalItems={totalItems}
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          {totalItems > 0 ? (
            <>Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems} keywords</>
          ) : (
            'No keywords found'
          )}
        </span>
        <span>
          {quickWinsCount} quick wins on this page
        </span>
      </div>
    </div>
  );
}