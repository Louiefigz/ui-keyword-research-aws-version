import { apiClient } from './client';
import {
  CSVValidationResponse,
  CSVJobResponse,
  CSVMapping,
  ApiResponse,
} from '@/types/api.types';

export const csvApi = {
  // Validate CSV file
  validate: async (
    projectId: string,
    file: File
  ): Promise<CSVValidationResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<CSVValidationResponse>>(
      `/projects/${projectId}/csv/validate`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Process CSV file
  process: async (
    projectId: string,
    file: File,
    mapping: CSVMapping,
    updateMode: 'append' | 'replace' | 'update' = 'append'
  ): Promise<CSVJobResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mapping', JSON.stringify(mapping));
    formData.append('update_mode', updateMode);

    const response = await apiClient.post<ApiResponse<CSVJobResponse>>(
      `/projects/${projectId}/csv/process`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Check job status
  checkJobStatus: async (
    projectId: string,
    jobId: string
  ): Promise<CSVJobResponse> => {
    const response = await apiClient.get<ApiResponse<CSVJobResponse>>(
      `/projects/${projectId}/csv/jobs/${jobId}`
    );
    return response.data.data;
  },
};