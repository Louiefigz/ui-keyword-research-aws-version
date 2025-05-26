import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { KeywordFilters, SortOptions } from '@/types/api.types';

interface FilterState {
  // Keyword filters
  keywordFilters: KeywordFilters;
  setKeywordFilters: (filters: Partial<KeywordFilters>) => void;
  resetKeywordFilters: () => void;

  // Sort options
  sortOptions: SortOptions;
  setSortOptions: (options: SortOptions) => void;

  // View preferences
  viewMode: 'table' | 'grid' | 'compact';
  setViewMode: (mode: 'table' | 'grid' | 'compact') => void;

  // Selected items
  selectedKeywords: Set<string>;
  toggleKeywordSelection: (id: string) => void;
  selectAllKeywords: (ids: string[]) => void;
  clearKeywordSelection: () => void;
}

const defaultFilters: KeywordFilters = {
  search: '',
  minVolume: undefined,
  maxVolume: undefined,
  minDifficulty: undefined,
  maxDifficulty: undefined,
  intent: [],
  opportunityLevel: [],
  clusterId: undefined,
};

const defaultSort: SortOptions = {
  field: 'opportunity_score',
  direction: 'desc',
};

export const useFilterStore = create<FilterState>()(
  devtools((set) => ({
    // Keyword filters
    keywordFilters: defaultFilters,
    setKeywordFilters: (filters) =>
      set((state) => ({
        keywordFilters: { ...state.keywordFilters, ...filters },
      })),
    resetKeywordFilters: () => set({ keywordFilters: defaultFilters }),

    // Sort options
    sortOptions: defaultSort,
    setSortOptions: (options) => set({ sortOptions: options }),

    // View preferences
    viewMode: 'table',
    setViewMode: (mode) => set({ viewMode: mode }),

    // Selected items
    selectedKeywords: new Set(),
    toggleKeywordSelection: (id) =>
      set((state) => {
        const newSet = new Set(state.selectedKeywords);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return { selectedKeywords: newSet };
      }),
    selectAllKeywords: (ids) =>
      set({ selectedKeywords: new Set(ids) }),
    clearKeywordSelection: () =>
      set({ selectedKeywords: new Set() }),
  }))
);