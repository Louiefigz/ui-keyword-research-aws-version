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

  // Strategic Advice - Conversational API
  CONVERSATIONAL_ADVICE: (projectId: string) => `/conversational-advice/projects/${projectId}`,
  CONVERSATIONAL_ADVICE_DATA_QUALITY: (projectId: string) => `/conversational-advice/projects/${projectId}/data-quality`,
  CONVERSATIONAL_ADVICE_TEST_CONNECTION: '/conversational-advice/test-connection',
  CONVERSATIONAL_ADVICE_FOCUS_AREAS: '/conversational-advice/supported-focus-areas',
  
  // DEPRECATED - To be removed
  STRATEGIC_ADVICE_LEGACY: (projectId: string) => `/strategic-advice/projects/${projectId}`,
} as const;

// Query keys for React Query
export const QUERY_KEYS = {
  PROJECTS: 'projects',
  PROJECT: 'project',
  KEYWORDS: 'keywords',
  CLUSTERS: 'clusters',
  CONVERSATIONAL_ADVICE: 'conversational-advice',
  CONVERSATIONAL_ADVICE_DATA_QUALITY: 'conversational-advice-data-quality',
  STRATEGIC_ADVICE: 'strategic-advice', // DEPRECATED - kept for backward compatibility
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