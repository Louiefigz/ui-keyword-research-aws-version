import React from 'react';
import { Badge } from '@/components/ui/base/badge';

export function getOpportunityBadge(level: string) {
  const config = {
    high: { className: 'bg-green-100 text-green-800', text: 'High' },
    medium: { className: 'bg-yellow-100 text-yellow-800', text: 'Medium' },
    low: { className: 'bg-gray-100 text-gray-800', text: 'Low' }
  };

  const { className, text } = config[level as keyof typeof config] || config.low;
  
  return (
    <Badge className={`${className} text-xs font-medium`}>
      {text}
    </Badge>
  );
}

export function getActionBadge(action: string) {
  const config = {
    immediate: { className: 'bg-red-100 text-red-800', text: 'Immediate' },
    'short-term': { className: 'bg-orange-100 text-orange-800', text: 'Short-term' },
    'long-term': { className: 'bg-blue-100 text-blue-800', text: 'Long-term' },
    monitor: { className: 'bg-gray-100 text-gray-800', text: 'Monitor' }
  };

  const { className, text } = config[action as keyof typeof config] || config.monitor;
  
  return (
    <Badge className={`${className} text-xs font-medium`}>
      {text}
    </Badge>
  );
}

export function getIntentBadge(intent: string) {
  const config = {
    informational: { className: 'bg-blue-100 text-blue-800', text: 'Info' },
    navigational: { className: 'bg-purple-100 text-purple-800', text: 'Nav' },
    commercial: { className: 'bg-orange-100 text-orange-800', text: 'Commercial' },
    transactional: { className: 'bg-green-100 text-green-800', text: 'Buy' }
  };

  const { className, text } = config[intent as keyof typeof config] || config.informational;
  
  return (
    <Badge className={`${className} text-xs font-medium capitalize`}>
      {text}
    </Badge>
  );
} 