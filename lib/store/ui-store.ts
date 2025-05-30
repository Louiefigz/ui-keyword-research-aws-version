import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Project } from '@/types/api.types';

interface UIState {
  // Sidebar state
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Current project
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        // Sidebar state
        sidebarCollapsed: false,
        toggleSidebar: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

        // Current project
        currentProject: null,
        setCurrentProject: (project) => set({ currentProject: project }),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          currentProject: state.currentProject,
        }),
      }
    )
  )
);