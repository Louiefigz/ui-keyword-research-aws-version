/**
 * Job-related types for CSV processing
 */

export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

export interface JobProgress {
  current_step: string;
  items_processed: number;
  total_items: number;
  percentage_complete: number; // Changed from percentage to match backend
  message?: string; // Made optional as not shown in docs
}

export interface ProcessingJob {
  id: string;
  project_id: string;
  job_type: 'CSV_PROCESSING' | 'ANALYSIS' | 'EXPORT';
  status: JobStatus;
  progress: JobProgress;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  completed_at: string | null;
  error: string | null;
  result: any | null;
  retry_count: number;
  max_retries: number;
}