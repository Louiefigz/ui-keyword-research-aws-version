import React from 'react';
import { Badge } from '@/components/ui/base/badge';

export function getOpportunityBadge(level: string) {
  const config = {
    success: { className: 'bg-green-100 text-green-800', text: 'Success' },
    low_hanging: { className: 'bg-emerald-100 text-emerald-800', text: 'Quick Win' },
    existing: { className: 'bg-blue-100 text-blue-800', text: 'Existing' },
    clustering: { className: 'bg-orange-100 text-orange-800', text: 'Clustering' },
    untapped: { className: 'bg-gray-100 text-gray-800', text: 'Untapped' }
  };

  const { className, text } = config[level as keyof typeof config] || config.untapped;
  
  return (
    <Badge className={`${className} text-xs font-medium`}>
      {text}
    </Badge>
  );
}

export function getActionBadge(action: string) {
  const config = {
    leave: { className: 'bg-green-100 text-green-800', text: 'Leave' },
    create: { className: 'bg-blue-100 text-blue-800', text: 'Create' },
    optimize: { className: 'bg-orange-100 text-orange-800', text: 'Optimize' },
    upgrade: { className: 'bg-purple-100 text-purple-800', text: 'Upgrade' },
    update: { className: 'bg-yellow-100 text-yellow-800', text: 'Update' }
  };

  const { className, text } = config[action as keyof typeof config] || config.create;
  
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
    transactional: { className: 'bg-green-100 text-green-800', text: 'Transactional' },
    local: { className: 'bg-yellow-100 text-yellow-800', text: 'Local' }
  };

  const { className, text } = config[intent as keyof typeof config] || config.informational;
  
  return (
    <Badge className={`${className} text-xs font-medium capitalize`}>
      {text}
    </Badge>
  );
} 