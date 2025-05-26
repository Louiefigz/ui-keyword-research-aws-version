import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/lib/api/projects';
import { Project } from '@/types/api.types';
import { useUIStore } from '@/lib/store/ui-store';
import { handleApiError } from '@/lib/api/client';

// Query keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: () => [...projectKeys.lists()] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

// List all projects
export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: projectsApi.list,
  });
}

// Get single project
export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: projectKeys.detail(id!),
    queryFn: () => projectsApi.get(id!),
    enabled: !!id,
  });
}

// Create project
export function useCreateProject() {
  const queryClient = useQueryClient();
  const { addToast, closeModal } = useUIStore();

  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      addToast({
        title: 'Project created',
        description: `${data.name} has been created successfully.`,
        type: 'success',
      });
      closeModal('createProject');
    },
    onError: (error) => {
      addToast({
        title: 'Failed to create project',
        description: handleApiError(error),
        type: 'error',
      });
    },
  });
}

// Update project
export function useUpdateProject() {
  const queryClient = useQueryClient();
  const { addToast } = useUIStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      projectsApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      addToast({
        title: 'Project updated',
        description: 'Your changes have been saved.',
        type: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: 'Failed to update project',
        description: handleApiError(error),
        type: 'error',
      });
    },
  });
}

// Delete project
export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { addToast, setCurrentProject } = useUIStore();

  return useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      // Clear current project if it was deleted
      const currentProject = useUIStore.getState().currentProject;
      if (currentProject?.id === deletedId) {
        setCurrentProject(null);
      }
      addToast({
        title: 'Project deleted',
        description: 'The project has been permanently deleted.',
        type: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: 'Failed to delete project',
        description: handleApiError(error),
        type: 'error',
      });
    },
  });
}