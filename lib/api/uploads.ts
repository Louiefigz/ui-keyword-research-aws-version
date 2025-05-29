import { apiClient } from './client';
import { transformApiResponse } from '@/lib/utils/api-transforms';

interface SchemaDetection {
  detected_tool: 'ahrefs' | 'semrush' | 'moz' | 'unknown';
  csv_type: 'keywords' | 'positions' | 'backlinks' | 'unknown';
  confidence_score: number;
  field_mappings: FieldMapping[];
  missing_required_fields: string[];
  unmapped_columns: string[];
  sample_data: Record<string, string | number>[];
}

interface FieldMapping {
  source_column: string;
  target_field: string;
  data_type: string;
  is_required: boolean;
}

import { ProcessingJob } from '@/types/api/job.types';

interface UploadRequest {
  projectId: string;
  updateStrategy: 'append' | 'update' | 'replace';
}

export const uploadsApi = {
  // Detect CSV schema
  detectSchema: async (file: File): Promise<SchemaDetection> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(
      '/uploads/csv/detect-schema',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return transformApiResponse<SchemaDetection>(response.data);
  },

  // Upload and process CSV
  uploadCSV: async (
    file: File, 
    options: UploadRequest
  ): Promise<{ job_id: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', options.projectId);
    // Note: API expects update_mode, not update_strategy
    formData.append('update_mode', options.updateStrategy);
    
    const response = await apiClient.post(
      '/uploads/csv/upload-keywords',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return transformApiResponse<{ job_id: string }>(response.data);
  },

  // Upload organic and/or content gap CSV files
  // Using the new job-based endpoint as per UI_IMPLEMENTATION.md
  uploadDualCSV: async ({
    organicFile,
    contentGapFile,
    projectId,
    updateStrategy,
    _organicMapping,
    _contentGapMapping
  }: {
    organicFile: File | null;
    contentGapFile: File | null;
    projectId: string;
    updateStrategy: 'append' | 'update' | 'replace';
    _organicMapping: Record<string, string>;
    _contentGapMapping: Record<string, string>;
  }): Promise<{
    jobId: string;
    status: string;
    message: string;
    validationSummary: any;
  }> => {
    const formData = new FormData();
    formData.append('project_id', projectId);
    // CRITICAL: Add update strategy to ensure backend knows to replace data
    formData.append('update_mode', updateStrategy);
    
    if (organicFile) {
      formData.append('organic_file', organicFile);
    }
    if (contentGapFile) {
      formData.append('content_gap_file', contentGapFile);
    }
    
    // Use the new endpoint that returns job information
    const response = await apiClient.post('/uploads/csv/upload-keywords', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    // The API returns 202 Accepted with job information
    return transformApiResponse<any>(response.data);
  },

  // Get job status
  // Note: API requires project_id in the path
  getJobStatus: async (projectId: string, jobId: string): Promise<ProcessingJob> => {
    const response = await apiClient.get(
      `/jobs/${projectId}/${jobId}` // Fixed: correct path structure
    );
    return transformApiResponse<ProcessingJob>(response.data);
  },

  // Cancel job - Not documented in API, removing
  // cancelJob: async (jobId: string): Promise<void> => {
  //   await apiClient.post(`/uploads/jobs/${jobId}/cancel`);
  // },
};