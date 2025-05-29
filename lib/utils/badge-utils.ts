// Badge utility functions for consistent styling across the application

export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';

/**
 * Get badge variant based on difficulty level
 */
export function getDifficultyBadgeVariant(difficulty: number): BadgeVariant {
  if (difficulty >= 70) return 'destructive';
  if (difficulty >= 40) return 'warning';
  return 'success';
}

/**
 * Get badge variant based on opportunity type
 */
export function getOpportunityBadgeVariant(opportunity: string): BadgeVariant {
  const opportunityMap: Record<string, BadgeVariant> = {
    'low_hanging': 'success',
    'existing': 'warning',
    'clustering': 'secondary',
    'gaps': 'default',
    'untapped': 'outline',
    'success': 'success',
    'quick_wins': 'success',
    'content_gaps': 'default',
    'technical': 'secondary',
    'competitive': 'warning'
  };
  
  return opportunityMap[opportunity.toLowerCase()] || 'default';
}

/**
 * Get badge variant based on action type
 */
export function getActionBadgeVariant(action: string): BadgeVariant {
  const actionMap: Record<string, BadgeVariant> = {
    'optimize': 'success',
    'create': 'default',
    'improve': 'warning',
    'expand': 'secondary',
    'monitor': 'outline',
    'immediate': 'success',
    'short-term': 'warning',
    'long-term': 'secondary'
  };
  
  return actionMap[action.toLowerCase()] || 'default';
}

/**
 * Get badge variant based on intent type
 */
export function getIntentBadgeVariant(intent: string): BadgeVariant {
  const intentMap: Record<string, BadgeVariant> = {
    'informational': 'outline',
    'navigational': 'secondary',
    'commercial': 'warning',
    'transactional': 'success'
  };
  
  return intentMap[intent.toLowerCase()] || 'default';
}

/**
 * Get badge variant based on priority level
 */
export function getPriorityBadgeVariant(priority: string): BadgeVariant {
  const priorityMap: Record<string, BadgeVariant> = {
    'critical': 'destructive',
    'high': 'warning',
    'medium': 'secondary',
    'low': 'outline'
  };
  
  return priorityMap[priority.toLowerCase()] || 'default';
}

/**
 * Get badge variant based on competition level
 */
export function getCompetitionBadgeVariant(competition: string): BadgeVariant {
  const competitionMap: Record<string, BadgeVariant> = {
    'low': 'success',
    'medium': 'warning',
    'high': 'destructive'
  };
  
  return competitionMap[competition.toLowerCase()] || 'default';
}

/**
 * Get badge color based on difficulty (for charts/visualizations)
 */
export function getDifficultyColor(difficulty: number): string {
  if (difficulty >= 70) return '#ef4444'; // red-500
  if (difficulty >= 40) return '#f59e0b'; // amber-500
  return '#10b981'; // emerald-500
}

/**
 * Get badge color based on opportunity (for charts/visualizations)
 */
export function getOpportunityColor(opportunity: string): string {
  const colorMap: Record<string, string> = {
    'low_hanging': '#10b981', // emerald-500
    'existing': '#f59e0b', // amber-500
    'clustering': '#6366f1', // indigo-500
    'gaps': '#8b5cf6', // violet-500
    'untapped': '#64748b', // slate-500
    'success': '#10b981', // emerald-500
    'quick_wins': '#10b981', // emerald-500
    'content_gaps': '#8b5cf6', // violet-500
    'technical': '#6366f1', // indigo-500
    'competitive': '#f59e0b' // amber-500
  };
  
  return colorMap[opportunity.toLowerCase()] || '#64748b'; // slate-500
}