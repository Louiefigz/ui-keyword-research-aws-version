'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base';
import { Button } from '@/components/ui/base';
import { TrendingUp, Clock, DollarSign, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { OpportunityItem } from '@/types';

interface OpportunityCardProps {
  opportunity: OpportunityItem;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const getTypeStyles = () => {
    switch (opportunity.type) {
      case 'quick_wins':
        return 'border-green-200 bg-green-50';
      case 'content_gaps':
        return 'border-orange-200 bg-orange-50';
      case 'technical':
        return 'border-blue-200 bg-blue-50';
      case 'competitive':
        return 'border-purple-200 bg-purple-50';
      default:
        return '';
    }
  };

  const getImpactColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 30) return 'text-green-600';
    if (difficulty <= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={cn('hover:shadow-md transition-shadow', getTypeStyles())}>
      <CardHeader>
        <div className="space-y-2">
          <h4 className="font-semibold text-lg">{opportunity.title}</h4>
          <p className="text-sm text-muted-foreground">{opportunity.description}</p>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              Impact: <span className={getImpactColor(opportunity.impact_score)}>
                {opportunity.impact_score}/100
              </span>
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Difficulty: <span className={getDifficultyColor(opportunity.difficulty)}>
                {opportunity.difficulty}/100
              </span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-center">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-gray-500" />
            <p className="text-xs text-muted-foreground">Est. Traffic</p>
            <p className="font-semibold">{opportunity.estimated_traffic.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <DollarSign className="h-4 w-4 mx-auto mb-1 text-gray-500" />
            <p className="text-xs text-muted-foreground">Est. Value</p>
            <p className="font-semibold text-green-600">{opportunity.estimated_value}</p>
          </div>
          <div className="text-center">
            <Clock className="h-4 w-4 mx-auto mb-1 text-gray-500" />
            <p className="text-xs text-muted-foreground">Timeline</p>
            <p className="font-semibold">{opportunity.timeline}</p>
          </div>
        </div>

        <div className="border-t pt-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Required Effort</p>
          <p className="text-sm">{opportunity.effort_required}</p>
        </div>

        {opportunity.keywords_affected.length > 0 && (
          <div className="border-t pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Keywords Affected</p>
            <div className="flex flex-wrap gap-1">
              {opportunity.keywords_affected.slice(0, 3).map((keyword, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {opportunity.keywords_affected.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{opportunity.keywords_affected.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <Button className="w-full" size="sm">
          View Action Steps
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}