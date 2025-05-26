// API endpoint constants
export const API_ENDPOINTS = {
  // Projects
  PROJECTS: '/projects',
  PROJECT_BY_ID: (id: string) => `/projects/${id}`,
  PROJECT_SETTINGS: (id: string) => `/projects/${id}/settings`,

  // CSV Processing
  CSV_VALIDATE: (projectId: string) => `/projects/${projectId}/csv/validate`,
  CSV_PROCESS: (projectId: string) => `/projects/${projectId}/csv/process`,
  CSV_JOB_STATUS: (projectId: string, jobId: string) =>
    `/projects/${projectId}/csv/jobs/${jobId}`,

  // Keywords
  KEYWORDS: (projectId: string) => `/projects/${projectId}/dashboard/keywords`,
  KEYWORD_BY_ID: (projectId: string, keywordId: string) =>
    `/projects/${projectId}/keywords/${keywordId}`,
  KEYWORDS_BULK: (projectId: string) => `/projects/${projectId}/keywords/bulk`,
  KEYWORDS_EXPORT: (projectId: string) => `/projects/${projectId}/dashboard/export`,

  // Clusters
  CLUSTERS: (projectId: string) => `/projects/${projectId}/clusters`,
  CLUSTER_BY_ID: (projectId: string, clusterId: string) =>
    `/projects/${projectId}/clusters/${clusterId}`,

  // Strategic Advice
  STRATEGIC_ADVICE: (projectId: string) => `/projects/${projectId}/strategic-advice`,
  STRATEGIC_ADVICE_GENERATE: (projectId: string) =>
    `/projects/${projectId}/strategic-advice/generate`,
} as const;

// Query keys for React Query
export const QUERY_KEYS = {
  PROJECTS: 'projects',
  PROJECT: 'project',
  KEYWORDS: 'keywords',
  CLUSTERS: 'clusters',
  STRATEGIC_ADVICE: 'strategic-advice',
  CSV_JOB: 'csv-job',
} as const;

// Default pagination
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 50,
  MAX_LIMIT: 1000,
} as const;

// Job polling intervals
export const POLLING_INTERVALS = {
  CSV_JOB: 2000, // 2 seconds
  MAX_RETRIES: 60, // 2 minutes max polling
} as const;