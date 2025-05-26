/**
 * Strategic Advice Constants
 */

export const STRATEGIC_ADVICE_TABS = {
  OPPORTUNITIES: 'opportunities',
  CONTENT: 'content',
  ROI: 'roi',
  IMPLEMENTATION: 'implementation',
  COMPETITIVE: 'competitive',
} as const;

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export const PRIORITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const TIMELINE_PERIODS = {
  IMMEDIATE: '0-1 month',
  SHORT_TERM: '1-3 months',
  MEDIUM_TERM: '3-6 months',
  LONG_TERM: '6-12 months',
} as const;

export const CONTENT_TYPES = {
  BLOG_POST: 'Blog Post',
  LANDING_PAGE: 'Landing Page',
  GUIDE: 'Comprehensive Guide',
  TUTORIAL: 'Tutorial',
  FAQ: 'FAQ Page',
  CASE_STUDY: 'Case Study',
  INFOGRAPHIC: 'Infographic',
  VIDEO: 'Video Content',
} as const;

export const ROI_SCENARIOS = {
  BEST_CASE: 'best',
  EXPECTED: 'expected',
  WORST_CASE: 'worst',
} as const;

export const COMPETITION_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const DEFAULT_SEO_GUIDELINES = {
  KEYWORD_DENSITY: 1.5,
  MIN_WORD_COUNT: 1500,
  MAX_WORD_COUNT: 2500,
  READABILITY_TARGET: 'Grade 8-10',
  MIN_INTERNAL_LINKS: 3,
  MAX_INTERNAL_LINKS: 7,
  MIN_EXTERNAL_LINKS: 2,
  MAX_EXTERNAL_LINKS: 5,
} as const;

export const CHART_ANIMATION_DURATION = 600;

export const EXPORT_FORMATS = {
  CSV: 'csv',
  XLSX: 'xlsx',
  PDF: 'pdf',
  JSON: 'json',
} as const;

export const API_ENDPOINTS = {
  STRATEGIC_ADVICE: '/api/strategic-advice',
  OPPORTUNITIES: '/api/strategic-advice/opportunities',
  CONTENT_STRATEGY: '/api/strategic-advice/content-strategy',
  ROI_PROJECTIONS: '/api/strategic-advice/roi-projections',
  COMPETITIVE_ANALYSIS: '/api/strategic-advice/competitive-analysis',
  IMPLEMENTATION_ROADMAP: '/api/strategic-advice/implementation-roadmap',
} as const;