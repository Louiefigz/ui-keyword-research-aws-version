import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/lib/api/projects';

// Query keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (params?: { page?: number; limit?: number; status?: 'active' | 'archived' }) => [...projectKeys.lists(), params] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

// List all projects
export function useProjects(params?: { 
  page?: number; 
  limit?: number; 
  status?: 'active' | 'archived' 
}) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => projectsApi.list(params),
  });
}

// Get single project
export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: projectKeys.detail(id || ''),
    queryFn: () => projectsApi.get(id || ''),
    enabled: !!id,
  });
}

// Create project
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      // Toast will be handled by the component
    },
  });
}

// Update project
export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof projectsApi.update>[1]) =>
      projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id || '') });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

// Archive project
export function useArchiveProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.archive,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.setQueryData(projectKeys.detail(data.id), data);
    },
  });
}

// Delete project
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.removeQueries({ queryKey: projectKeys.detail(deletedId) });
    },
  });
}