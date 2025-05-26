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
  visibleColumns: string[];
  sidebarCollapsed: boolean;
  
  // Actions
  setFilters: (filters: Partial<KeywordFilters>) => void;
  clearFilters: () => void;
  setSort: (sort: SortOptions) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setVisibleColumns: (columns: string[]) => void;
  toggleSidebar: () => void;
  reset: () => void;
}

const defaultFilters: KeywordFilters = {};

const defaultSort: SortOptions = {
  field: 'opportunity_score',
  direction: 'desc',
};

const defaultVisibleColumns = [
  'keyword',
  'search_volume',
  'keyword_difficulty',
  'opportunity_score',
  'opportunity_level',
  'recommended_action',
  'intent',
];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      // Initial state
      filters: defaultFilters,
      sort: defaultSort,
      search: '',
      currentPage: 1,
      pageSize: 25,
      visibleColumns: defaultVisibleColumns,
      sidebarCollapsed: false,

      // Actions
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          currentPage: 1, // Reset to first page when filters change
        })),

      clearFilters: () =>
        set({
          filters: defaultFilters,
          search: '',
          currentPage: 1,
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

      setVisibleColumns: (visibleColumns) => set({ visibleColumns }),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      reset: () =>
        set({
          filters: defaultFilters,
          sort: defaultSort,
          search: '',
          currentPage: 1,
          pageSize: 25,
          visibleColumns: defaultVisibleColumns,
          sidebarCollapsed: false,
        }),
    }),
    {
      name: 'dashboard-store',
      // Only persist user preferences, not temporary state
      partialize: (state) => ({
        pageSize: state.pageSize,
        visibleColumns: state.visibleColumns,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// Selectors for convenient access to specific state parts
export const useDashboardFilters = () => useDashboardStore((state) => state.filters);
export const useDashboardSort = () => useDashboardStore((state) => state.sort);
export const useDashboardSearch = () => useDashboardStore((state) => state.search);
export const useDashboardPagination = () => 
  useDashboardStore((state) => ({
    currentPage: state.currentPage,
    pageSize: state.pageSize,
  }));
export const useDashboardUI = () =>
  useDashboardStore((state) => ({
    visibleColumns: state.visibleColumns,
    sidebarCollapsed: state.sidebarCollapsed,
  }));

// Action selectors
export const useDashboardActions = () =>
  useDashboardStore((state) => ({
    setFilters: state.setFilters,
    clearFilters: state.clearFilters,
    setSort: state.setSort,
    setSearch: state.setSearch,
    setPage: state.setPage,
    setPageSize: state.setPageSize,
    setVisibleColumns: state.setVisibleColumns,
    toggleSidebar: state.toggleSidebar,
    reset: state.reset,
  })); 