import { apiClient } from './client';
import { transformApiResponse } from '@/lib/utils/api-transforms';
import { Project, ProjectSettings } from '@/types/api.types';

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
  // List all projects
  list: async (params?: {
    page?: number;
    limit?: number;
    status?: 'active' | 'archived';
  }): Promise<Project[]> => {
    // Convert page to offset for API
    const apiParams = {
      status: params?.status,
      limit: params?.limit || 20,
      offset: params?.page ? (params.page - 1) * (params.limit || 20) : 0,
    };

    const response = await apiClient.get('/projects', { params: apiParams });
    return transformApiResponse<Project[]>(response.data);
  },

  // Get single project
  get: async (id: string): Promise<Project> => {
    const response = await apiClient.get(`/projects/${id}`);
    return transformApiResponse<Project>(response.data);
  },

  // Create new project
  create: async (data: ProjectCreate): Promise<Project> => {
    const response = await apiClient.post('/projects', data);
    return transformApiResponse<Project>(response.data);
  },

  // Update project
  update: async (id: string, data: ProjectUpdate): Promise<Project> => {
    const response = await apiClient.patch(`/projects/${id}`, data);
    return transformApiResponse<Project>(response.data);
  },

  // Archive project
  archive: async (id: string): Promise<Project> => {
    const response = await apiClient.post(`/projects/${id}/archive`);
    return transformApiResponse<Project>(response.data);
  },

  // Delete project
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  // Update project settings - Not documented in API
  // updateSettings: async (
  //   id: string,
  //   settings: Partial<ProjectSettings>
  // ): Promise<Project> => {
  //   const response = await apiClient.patch<Project>(
  //     `/projects/${id}/settings`,
  //     settings
  //   );
  //   return response.data;
  // },
};
