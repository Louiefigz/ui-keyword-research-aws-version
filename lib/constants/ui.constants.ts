// UI Constants for consistent design system

// Layout dimensions
export const LAYOUT = {
  NAVBAR_HEIGHT: 64,
  SIDEBAR_WIDTH: 256,
  SIDEBAR_COLLAPSED_WIDTH: 64,
  CONTENT_MAX_WIDTH: 1280,
  CONTENT_PADDING: 32,
} as const;

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Animation durations
export const ANIMATION_DURATION = {
  fast: 150,
  base: 200,
  slow: 300,
  slower: 500,
} as const;

// Z-index layers
export const Z_INDEX = {
  dropdown: 50,
  modal: 100,
  modalBackdrop: 90,
  tooltip: 110,
  notification: 120,
  popover: 130,
} as const;

// Icon sizes
export const ICON_SIZE = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

// Status colors mapping
export const STATUS_COLORS = {
  success: 'brand-green-500',
  warning: 'brand-orange-500',
  error: 'destructive',
  info: 'brand-blue-500',
  neutral: 'muted-foreground',
} as const;

// Opportunity level colors
export const OPPORTUNITY_COLORS = {
  high: 'brand-green-500',
  medium: 'brand-orange-500',
  low: 'muted-foreground',
} as const;

// Intent colors
export const INTENT_COLORS = {
  informational: 'brand-blue-500',
  navigational: 'brand-purple-500',
  commercial: 'brand-orange-500',
  transactional: 'brand-green-500',
} as const;

// Badge variants
export const BADGE_VARIANTS = {
  default: 'bg-secondary text-secondary-foreground',
  success: 'bg-brand-green-50 text-brand-green-700',
  warning: 'bg-brand-orange-50 text-brand-orange-700',
  error: 'bg-destructive/10 text-destructive',
  info: 'bg-brand-blue-50 text-brand-blue-700',
  purple: 'bg-brand-purple-50 text-brand-purple-700',
} as const;

// Button sizes
export const BUTTON_SIZES = {
  xs: 'h-7 px-2 text-xs',
  sm: 'h-8 px-3 text-sm',
  md: 'h-9 px-4 text-sm',
  lg: 'h-10 px-6',
  xl: 'h-12 px-8 text-base',
} as const;

// Grid configurations
export const GRID_COLS = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
} as const;