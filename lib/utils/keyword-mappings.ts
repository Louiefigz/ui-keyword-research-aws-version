// Keyword value mapping utilities

/**
 * Map opportunity values from API to frontend expected values
 */
export function mapOpportunityValue(opportunity: string): string {
  if (!opportunity) return 'untapped';
  
  const normalized = opportunity.toLowerCase().replace(/[\s-]/g, '_');
  const opportunityMap: Record<string, string> = {
    'low_hanging_fruit': 'low_hanging',
    'existing': 'existing',
    'clustering_opportunity': 'clustering',
    'untapped': 'untapped',
    'success': 'success',
    'quick_wins': 'quick_wins',
    'content_gaps': 'content_gaps',
    'technical': 'technical',
    'competitive': 'competitive'
  };
  
  return opportunityMap[normalized] || 'untapped';
}

/**
 * Map action values from API to frontend expected values
 */
export function mapActionValue(action: string): string {
  if (!action) return 'create';
  
  const normalized = action.toLowerCase().replace(/\s+/g, '_');
  const actionMap: Record<string, string> = {
    'leave_as_is': 'leave',
    'create': 'create',
    'optimize': 'optimize',
    'upgrade': 'upgrade',
    'update': 'update',
    'improve': 'improve',
    'expand': 'expand',
    'monitor': 'monitor'
  };
  
  return actionMap[normalized] || 'create';
}

/**
 * Map intent values from API to frontend expected values
 */
export function mapIntentValue(intent: string): string {
  if (!intent) return 'informational';
  
  const normalized = intent.toLowerCase();
  const intentMap: Record<string, string> = {
    'info': 'informational',
    'informational': 'informational',
    'nav': 'navigational',
    'navigational': 'navigational',
    'comm': 'commercial',
    'commercial': 'commercial',
    'trans': 'transactional',
    'transactional': 'transactional',
    'buy': 'transactional',
    'local': 'local'
  };
  
  return intentMap[normalized] || 'informational';
}