import { apiClient } from './client';
import { Project, ApiResponse } from '@/types/api.types';

export const projectsApi = {
  // List all projects
  list: async (): Promise<Project[]> => {
    const response = await apiClient.get<ApiResponse<Project[]>>('/projects');
    return response.data.data;
  },

  // Get single project
  get: async (id: string): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data;
  },

  // Create new project
  create: async (data: {
    name: string;
    business_description: string;
  }): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>('/projects', data);
    return response.data.data;
  },

  // Update project
  update: async (
    id: string,
    data: Partial<{
      name: string;
      business_description: string;
      status: 'active' | 'archived';
    }>
  ): Promise<Project> => {
    const response = await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, data);
    return response.data.data;
  },

  // Delete project
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  // Update project settings
  updateSettings: async (
    id: string,
    settings: Partial<Project['settings']>
  ): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(
      `/projects/${id}/settings`,
      settings
    );
    return response.data.data;
  },
};