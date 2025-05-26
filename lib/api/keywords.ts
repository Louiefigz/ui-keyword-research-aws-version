import { apiClient } from './client';
import {
  Keyword,
  KeywordFilters,
  SortOptions,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api.types';

export const keywordsApi = {
  // List keywords with pagination and filters
  list: async (
    projectId: string,
    params: {
      page?: number;
      limit?: number;
      filters?: KeywordFilters;
      sort?: SortOptions;
    } = {}
  ): Promise<PaginatedResponse<Keyword>> => {
    const response = await apiClient.get<PaginatedResponse<Keyword>>(
      `/projects/${projectId}/dashboard/keywords`,
      {
        params: {
          page: params.page || 1,
          limit: params.limit || 50,
          ...params.filters,
          sort_by: params.sort?.field,
          sort_dir: params.sort?.direction,
        },
      }
    );
    return response.data;
  },

  // Get single keyword
  get: async (projectId: string, keywordId: string): Promise<Keyword> => {
    const response = await apiClient.get<ApiResponse<Keyword>>(
      `/projects/${projectId}/keywords/${keywordId}`
    );
    return response.data.data;
  },

  // Update keyword
  update: async (
    projectId: string,
    keywordId: string,
    data: Partial<Keyword>
  ): Promise<Keyword> => {
    const response = await apiClient.patch<ApiResponse<Keyword>>(
      `/projects/${projectId}/keywords/${keywordId}`,
      data
    );
    return response.data.data;
  },

  // Delete keyword
  delete: async (projectId: string, keywordId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/keywords/${keywordId}`);
  },

  // Bulk operations
  bulkUpdate: async (
    projectId: string,
    keywordIds: string[],
    data: Partial<Keyword>
  ): Promise<{ updated: number }> => {
    const response = await apiClient.patch<ApiResponse<{ updated: number }>>(
      `/projects/${projectId}/keywords/bulk`,
      {
        keyword_ids: keywordIds,
        data,
      }
    );
    return response.data.data;
  },

  bulkDelete: async (
    projectId: string,
    keywordIds: string[]
  ): Promise<{ deleted: number }> => {
    const response = await apiClient.delete<ApiResponse<{ deleted: number }>>(
      `/projects/${projectId}/keywords/bulk`,
      {
        data: { keyword_ids: keywordIds },
      }
    );
    return response.data.data;
  },

  // Export keywords
  export: async (
    projectId: string,
    format: 'csv' | 'xlsx' | 'json',
    filters?: KeywordFilters
  ): Promise<Blob> => {
    const response = await apiClient.get(
      `/projects/${projectId}/dashboard/export`,
      {
        params: {
          format,
          ...filters,
        },
        responseType: 'blob',
      }
    );
    return response.data;
  },
};