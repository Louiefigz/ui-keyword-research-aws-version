// Application configuration
export const APP_CONFIG = {
  name: 'Keyword Research Automation',
  description: 'AI-powered keyword research and SEO strategy platform',
  version: '0.1.0',
  
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    timeout: 30000,
  },
  
  // Feature flags
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    debugMode: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === 'true',
  },
  
  // Performance settings
  performance: {
    keywordsPageSize: parseInt(process.env.NEXT_PUBLIC_KEYWORDS_PAGE_SIZE || '50'),
    maxUploadSize: parseInt(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE || '10485760'),
  },
  
  // Routes
  routes: {
    home: '/',
    projects: '/projects',
    newProject: '/projects/new',
    project: (id: string) => `/projects/${id}`,
    upload: (id: string) => `/projects/${id}/upload`,
    dashboard: (id: string) => `/projects/${id}/dashboard`,
    clusters: (id: string) => `/projects/${id}/clusters`,
    strategicAdvice: (id: string) => `/projects/${id}/strategic-advice`,
    settings: (id: string) => `/projects/${id}/settings`,
  },
} as const;