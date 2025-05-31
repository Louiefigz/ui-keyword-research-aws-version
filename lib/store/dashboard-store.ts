import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { KeywordFilters, SortOptions } from '@/types/api.types';

interface DashboardState {
  // Filters and search
  filters: KeywordFilters;
  sort: SortOptions;
  search: string;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  
  // UI preferences
  // Note: Sidebar state moved to ui-store
  
  // Actions
  setFilters: (filters: Partial<KeywordFilters>) => void;
  replaceFilters: (filters: KeywordFilters) => void;
  setSort: (sort: SortOptions) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

const defaultFilters: KeywordFilters = {};

const defaultSort: SortOptions = {
  field: 'total_points', // Changed from opportunity_score - backend uses total_points
  direction: 'desc',
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      // Initial state
      filters: defaultFilters,
      sort: defaultSort,
      search: '',
      currentPage: 1,
      pageSize: 25,

      // Actions
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          currentPage: 1, // Reset to first page when filters change
        })),

      replaceFilters: (filters) =>
        set({
          filters,
          currentPage: 1, // Reset to first page when filters change
        }),

      setSort: (sort) =>
        set({
          sort,
          currentPage: 1, // Reset to first page when sort changes
        }),

      setSearch: (search) =>
        set({
          search,
          currentPage: 1, // Reset to first page when search changes
        }),

      setPage: (currentPage) => set({ currentPage }),

      setPageSize: (pageSize) =>
        set({
          pageSize,
          currentPage: 1, // Reset to first page when page size changes
        }),
    }),
    {
      name: 'dashboard-store',
      // Only persist user preferences, not temporary state
      partialize: (state) => ({
        pageSize: state.pageSize,
      }),
    }
  )
);
 