import { useState, useEffect, useCallback, useRef } from 'react';
import { KeywordFilters } from '@/types/api.types';

interface UseKeywordFiltersOptions {
  initialFilters?: KeywordFilters;
  onFiltersChange?: (filters: KeywordFilters) => void;
}

export function useKeywordFilters({ initialFilters = {}, onFiltersChange }: UseKeywordFiltersOptions) {
  const [localSearch, setLocalSearch] = useState('');
  const [tempFilters, setTempFilters] = useState<KeywordFilters>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentFiltersRef = useRef(initialFilters);
  
  // Update the ref whenever initialFilters changes
  useEffect(() => {
    currentFiltersRef.current = initialFilters;
  }, [initialFilters]);

  // Debounced search handler
  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      onFiltersChange?.({ search: value });
    }, 300);
  }, [onFiltersChange]);

  // Initialize temp filters when popover opens
  useEffect(() => {
    if (filtersOpen) {
      const { search, opportunityLevel, ...popoverFilters } = currentFiltersRef.current;
      setTempFilters(popoverFilters);
    }
  }, [filtersOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleApplyFilters = useCallback(() => {
    console.log('Applying filters - tempFilters:', tempFilters);
    console.log('Existing filters:', currentFiltersRef.current);
    
    const { search, opportunityLevel } = currentFiltersRef.current;
    const newFilters: KeywordFilters = {};
    
    if (search) newFilters.search = search;
    if (opportunityLevel && opportunityLevel.length > 0) newFilters.opportunityLevel = opportunityLevel;
    
    if (tempFilters.minVolume !== undefined) newFilters.minVolume = tempFilters.minVolume;
    if (tempFilters.maxVolume !== undefined) newFilters.maxVolume = tempFilters.maxVolume;
    if (tempFilters.minDifficulty !== undefined) newFilters.minDifficulty = tempFilters.minDifficulty;
    if (tempFilters.maxDifficulty !== undefined) newFilters.maxDifficulty = tempFilters.maxDifficulty;
    if (tempFilters.intent && tempFilters.intent.length > 0) newFilters.intent = tempFilters.intent;
    
    console.log('New filters to apply:', newFilters);
    onFiltersChange?.(newFilters);
    setFiltersOpen(false);
  }, [tempFilters, onFiltersChange]);

  const handleResetFilters = useCallback(() => {
    setTempFilters({});
  }, []);

  const handleOpportunityChange = useCallback((value: string) => {
    onFiltersChange?.({ 
      ...currentFiltersRef.current,
      opportunityLevel: value === 'all' ? [] : [value] 
    });
  }, [onFiltersChange]);

  return {
    localSearch,
    tempFilters,
    filtersOpen,
    setTempFilters,
    setFiltersOpen,
    handleSearchChange,
    handleApplyFilters,
    handleResetFilters,
    handleOpportunityChange
  };
}