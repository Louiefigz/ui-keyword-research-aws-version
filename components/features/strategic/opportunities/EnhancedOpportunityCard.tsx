'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base/badge';
import { Button } from '@/components/ui/base/button';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  Brain,
  Target,
  BarChart3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { AIRecommendationsCard } from '../ai/AIRecommendationsCard';
import type { OpportunityItem, AIEnhancedOpportunity } from '@/types/api/strategic.types';

interface EnhancedOpportunityCardProps {
  opportunity: OpportunityItem | AIEnhancedOpportunity;
  businessContext?: string;
}

// Type guard to check if opportunity is AI-enhanced
function isAIEnhanced(opportunity: any): opportunity is AIEnhancedOpportunity {
  return 'ai_recommendations' in opportunity && 'insight_type' in opportunity;
}

export function EnhancedOpportunityCard({ 
  opportunity, 
  businessContext 
}: EnhancedOpportunityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isAI = isAIEnhanced(opportunity);

  // Handle legacy opportunity format
  if (!isAI) {
    const legacyOpp = opportunity as OpportunityItem;
    
    const getTypeStyles = () => {
      switch (legacyOpp.type) {
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
            <h4 className="font-semibold text-lg">{legacyOpp.title}</h4>
            <p className="text-sm text-muted-foreground">{legacyOpp.description}</p>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                Impact: <span className={getImpactColor(legacyOpp.impact_score)}>
                  {legacyOpp.impact_score}/100
                </span>
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Difficulty: <span className={getDifficultyColor(legacyOpp.difficulty)}>
                  {legacyOpp.difficulty}/100
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
              <p className="font-semibold">{legacyOpp.estimated_traffic.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <DollarSign className="h-4 w-4 mx-auto mb-1 text-gray-500" />
              <p className="text-xs text-muted-foreground">Est. Value</p>
              <p className="font-semibold text-green-600">{legacyOpp.estimated_value}</p>
            </div>
            <div className="text-center">
              <Clock className="h-4 w-4 mx-auto mb-1 text-gray-500" />
              <p className="text-xs text-muted-foreground">Timeline</p>
              <p className="font-semibold">{legacyOpp.timeline}</p>
            </div>
          </div>

          <div className="border-t pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Required Effort</p>
            <p className="text-sm">{legacyOpp.effort_required}</p>
          </div>

          {legacyOpp.keywords_affected.length > 0 && (
            <div className="border-t pt-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">Keywords Affected</p>
              <div className="flex flex-wrap gap-1">
                {legacyOpp.keywords_affected.slice(0, 3).map((keyword, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
                {legacyOpp.keywords_affected.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{legacyOpp.keywords_affected.length - 3} more
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

  // Handle AI-enhanced opportunity format
  const aiOpp = opportunity as AIEnhancedOpportunity;
  const priorityLevel = typeof aiOpp.implementation_priority === 'object' 
    ? aiOpp.implementation_priority.level 
    : aiOpp.implementation_priority;

  const getPriorityStyles = () => {
    switch (priorityLevel) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityColor = () => {
    switch (priorityLevel) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card className={cn('hover:shadow-md transition-shadow', getPriorityStyles())}>
      <CardHeader>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg">{aiOpp.keyword}</h4>
            <div className="flex gap-2">
              {aiOpp.insight_type === 'ai_enhanced' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Enhanced
                </Badge>
              )}
              <Badge variant="secondary" className={getPriorityColor()}>
                {priorityLevel} Priority
              </Badge>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {aiOpp.data_driven_insight}
          </p>

          {/* Current State */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-white/60 rounded-lg border border-gray-100">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Current Position</p>
              <p className="font-semibold text-orange-600">#{aiOpp.current_state.position}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Search Volume</p>
              <p className="font-semibold">{aiOpp.current_state.search_volume.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Success Metrics */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-center">
            <Target className="h-4 w-4 mx-auto mb-1 text-gray-500" />
            <p className="text-xs text-muted-foreground">Target Position</p>
            <p className="font-semibold text-green-600">#{aiOpp.success_metrics.target_position}</p>
          </div>
          <div className="text-center">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-gray-500" />
            <p className="text-xs text-muted-foreground">Expected Traffic</p>
            <p className="font-semibold">{aiOpp.success_metrics.expected_total_traffic.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <BarChart3 className="h-4 w-4 mx-auto mb-1 text-gray-500" />
            <p className="text-xs text-muted-foreground">Traffic Multiplier</p>
            <p className="font-semibold text-green-600">{aiOpp.success_metrics.traffic_multiplier}</p>
          </div>
        </div>

        {/* Implementation Priority Details */}
        {typeof aiOpp.implementation_priority === 'object' && (
          <div className="border-t pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Implementation Details</p>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">Reasoning:</span> {aiOpp.implementation_priority.reasoning}
              </p>
              <p className="text-sm">
                <span className="font-medium">Effort:</span> {aiOpp.implementation_priority.effort_estimate}
              </p>
            </div>
          </div>
        )}

        {/* AI Recommendations Toggle */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Brain className="h-4 w-4 mr-2" />
          {isExpanded ? 'Hide' : 'View'} AI Recommendations
          {isExpanded ? 
            <ChevronUp className="h-4 w-4 ml-2" /> : 
            <ChevronDown className="h-4 w-4 ml-2" />
          }
        </Button>

        {/* Expanded AI Recommendations */}
        {isExpanded && (
          <div className="border-t pt-4">
            <AIRecommendationsCard
              recommendations={aiOpp.ai_recommendations}
              insightType={aiOpp.insight_type}
              businessContext={businessContext}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}