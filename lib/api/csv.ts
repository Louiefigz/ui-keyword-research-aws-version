import { apiClient } from './client';
import { transformApiResponse } from '@/lib/utils/api-transforms';
import {
  CSVValidationResponse,
  CSVJobResponse,
  CSVMapping,
} from '@/types/api.types';

export const csvApi = {
  // Validate CSV file
  validate: async (
    projectId: string,
    file: File
  ): Promise<CSVValidationResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', projectId); // API expects project_id in form data

    const response = await apiClient.post(
      '/csv/validate', // Fixed: top-level endpoint
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return transformApiResponse<CSVValidationResponse>(response.data);
  },

  // Process CSV file - Note: API uses /csv/validate for processing
  process: async (
    projectId: string,
    file: File,
    mapping: CSVMapping,
    updateMode: 'append' | 'replace' | 'update' = 'append'
  ): Promise<CSVJobResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', projectId);
    // Note: API might not support mapping and update_mode parameters
    // Check API documentation for exact parameters

    const response = await apiClient.post(
      '/csv/validate', // Same endpoint for validation and processing
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return transformApiResponse<CSVJobResponse>(response.data);
  },

  // Check job status
  checkJobStatus: async (
    projectId: string,
    jobId: string
  ): Promise<CSVJobResponse> => {
    const response = await apiClient.get(
      `/jobs/${projectId}/${jobId}` // Fixed: correct path structure
    );
    return transformApiResponse<CSVJobResponse>(response.data);
  },
};