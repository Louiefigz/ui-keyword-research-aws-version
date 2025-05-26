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

  // Modal states
  modals: {
    createProject: boolean;
    uploadCSV: boolean;
    exportData: boolean;
  };
  openModal: (modal: keyof UIState['modals']) => void;
  closeModal: (modal: keyof UIState['modals']) => void;

  // Toast notifications
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
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

        // Modal states
        modals: {
          createProject: false,
          uploadCSV: false,
          exportData: false,
        },
        openModal: (modal) =>
          set((state) => ({
            modals: { ...state.modals, [modal]: true },
          })),
        closeModal: (modal) =>
          set((state) => ({
            modals: { ...state.modals, [modal]: false },
          })),

        // Toast notifications
        toasts: [],
        addToast: (toast) =>
          set((state) => ({
            toasts: [
              ...state.toasts,
              {
                ...toast,
                id: Math.random().toString(36).substr(2, 9),
              },
            ],
          })),
        removeToast: (id) =>
          set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
          })),
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