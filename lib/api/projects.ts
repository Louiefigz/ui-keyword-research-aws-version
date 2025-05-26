import { apiClient } from './client';
import { Project, ApiResponse, PaginatedResponse, ProjectSettings } from '@/types/api.types';

interface ProjectCreate {
  name: string;
  business_description: string;
  settings?: Partial<ProjectSettings>;
}

interface ProjectUpdate {
  name?: string;
  business_description?: string;
  status?: 'active' | 'archived';
  settings?: Partial<ProjectSettings>;
}

export const projectsApi = {
  // List all projects with pagination
  list: async (params?: { 
    page?: number; 
    limit?: number; 
    status?: 'active' | 'archived' 
  }): Promise<PaginatedResponse<Project>> => {
    const response = await apiClient.get<PaginatedResponse<Project>>('/projects', { params });
    return response.data;
  },

  // Get single project
  get: async (id: string): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data;
  },

  // Create new project
  create: async (data: ProjectCreate): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>('/projects', data);
    return response.data.data;
  },

  // Update project
  update: async (id: string, data: ProjectUpdate): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(`/projects/${id}`, data);
    return response.data.data;
  },

  // Archive project
  archive: async (id: string): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>(`/projects/${id}/archive`);
    return response.data.data;
  },

  // Delete project (if needed)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  // Update project settings
  updateSettings: async (
    id: string,
    settings: Partial<ProjectSettings>
  ): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(
      `/projects/${id}/settings`,
      settings
    );
    return response.data.data;
  },
};