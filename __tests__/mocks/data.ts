import { Project, PaginatedResponse } from '@/types/api.types';

export const mockProject: Project = {
  id: 'test-project-1',
  name: 'Test Project',
  business_description: 'Test business description',
  status: 'active',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  stats: {
    total_keywords: 100,
    total_clusters: 10,
    avg_opportunity_score: 75.5,
    top_opportunity_keywords: 25,
    last_analysis_date: '2024-01-01T00:00:00Z',
  },
};

export const mockProjects: Project[] = [
  mockProject,
  {
    ...mockProject,
    id: 'test-project-2',
    name: 'Another Project',
    business_description: 'Another test description',
    stats: {
      ...mockProject.stats,
      total_keywords: 200,
      total_clusters: 20,
    },
  },
];

export const mockProjectsResponse: PaginatedResponse<Project> = {
  data: mockProjects,
  pagination: {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1,
  },
};

export const mockSchemaDetection = {
  detected_tool: 'ahrefs' as const,
  csv_type: 'keywords' as const,
  confidence_score: 0.95,
  field_mappings: [
    {
      source_column: 'Keyword',
      target_field: 'keyword',
      data_type: 'string',
      is_required: true,
    },
    {
      source_column: 'Volume',
      target_field: 'search_volume',
      data_type: 'number',
      is_required: true,
    },
    {
      source_column: 'KD',
      target_field: 'keyword_difficulty',
      data_type: 'number',
      is_required: false,
    },
  ],
  missing_required_fields: [],
  unmapped_columns: ['Country'],
  sample_data: [
    {
      Keyword: 'test keyword',
      Volume: 1000,
      KD: 30,
      Country: 'US',
    },
  ],
};

export const mockProcessingJob = {
  job_id: 'test-job-1',
  project_id: 'test-project-1',
  status: 'processing' as const,
  file_name: 'test.csv',
  total_rows: 100,
  processed_rows: 50,
  created_rows: 40,
  updated_rows: 10,
  failed_rows: 0,
  errors: [],
  started_at: '2024-01-01T00:00:00Z',
  progress_percentage: 50,
};

export const mockFile = new File(['test,csv,content'], 'test.csv', {
  type: 'text/csv',
});