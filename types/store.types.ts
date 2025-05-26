// Store state types

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface UploadState {
  file: File | null;
  validation: import('@/types/api.types').CSVValidationResponse | null;
  mapping: import('@/types/api.types').CSVMapping | null;
  jobId: string | null;
  progress: {
    processed: number;
    total: number;
    percentage: number;
  } | null;
  error: string | null;
}

export interface DashboardState {
  selectedKeywordIds: Set<string>;
  viewMode: 'table' | 'grid' | 'compact';
  columnVisibility: Record<string, boolean>;
}

export interface ClusterState {
  selectedClusterId: string | null;
  expandedClusters: Set<string>;
}

export interface StrategicAdviceState {
  selectedPriorityLevel: 'all' | 'critical' | 'high' | 'medium' | 'low';
  selectedTimeframe: '3months' | '6months' | '12months';
}