// Common API Types used across domains

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationInfo {
  page: number;
  page_size: number;
  total_pages?: number;
  total_count?: number;
  total_filtered?: number;
  has_next?: boolean;
  has_previous?: boolean;
  has_more?: boolean;
  next_cursor?: string | null;
}