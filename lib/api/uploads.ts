import { apiClient } from './client';
import { ApiResponse } from '@/types/api.types';

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

interface ProcessingJob {
  job_id: string;
  project_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_name: string;
  total_rows: number;
  processed_rows: number;
  created_rows: number;
  updated_rows: number;
  failed_rows: number;
  errors: string[];
  started_at: string;
  completed_at?: string;
  progress_percentage: number;
}

interface UploadRequest {
  projectId: string;
  updateStrategy: 'append' | 'update' | 'replace';
}

export const uploadsApi = {
  // Detect CSV schema
  detectSchema: async (file: File): Promise<SchemaDetection> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<ApiResponse<SchemaDetection>>(
      '/uploads/detect-schema',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Upload and process CSV
  uploadCSV: async (
    file: File, 
    options: UploadRequest
  ): Promise<{ job_id: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', options.projectId);
    formData.append('update_strategy', options.updateStrategy);
    
    const response = await apiClient.post<ApiResponse<{ job_id: string }>>(
      '/uploads/process',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Get job status
  getJobStatus: async (jobId: string): Promise<ProcessingJob> => {
    const response = await apiClient.get<ApiResponse<ProcessingJob>>(
      `/uploads/jobs/${jobId}`
    );
    return response.data.data;
  },

  // Cancel job
  cancelJob: async (jobId: string): Promise<void> => {
    await apiClient.post(`/uploads/jobs/${jobId}/cancel`);
  },
};