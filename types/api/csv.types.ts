// CSV Processing Types

export type UpdateStrategy = 'append' | 'replace' | 'update';

export interface CSVUploadRequest {
  file: File;
  mapping: CSVMapping;
  update_mode: UpdateStrategy;
}

export interface CSVMapping {
  keyword: string;
  search_volume?: string;
  keyword_difficulty?: string;
  cpc?: string;
  competition?: string;
  intent?: string;
}

export interface SchemaDetection {
  source: 'ahrefs' | 'semrush' | 'moz' | 'unknown';
  columns: SchemaColumn[];
  sample_data: Record<string, any>[];
  confidence: number;
}

export interface SchemaColumn {
  csv_column: string;
  mapped_to: string;
  data_type: 'string' | 'number' | 'date';
  is_required: boolean;
}

export interface CSVValidationResponse {
  is_valid: boolean;
  detected_columns: string[];
  suggested_mapping: CSVMapping;
  sample_data: Record<string, string | number | null>[];
  total_rows: number;
  errors: string[];
}

export interface CSVJobResponse {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  progress?: {
    processed: number;
    total: number;
    percentage: number;
  };
  result?: {
    processed: number;
    created: number;
    updated: number;
    skipped: number;
    errors: string[];
  };
}