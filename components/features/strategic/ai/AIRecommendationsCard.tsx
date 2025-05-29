'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base/badge';
import { Clock, Target, Lightbulb, CheckCircle2 } from 'lucide-react';
import type { PriorityAction } from '@/types/api/strategic.types';

interface AIRecommendationsCardProps {
  recommendations: {
    priority_actions: PriorityAction[];
    content_strategy: string;
    technical_seo: string;
  };
  insightType: 'ai_enhanced' | 'rule_based';
  businessContext?: string;
}

export function AIRecommendationsCard({ 
  recommendations, 
  insightType, 
  businessContext 
}: AIRecommendationsCardProps) {
  if (!recommendations || insightType !== 'ai_enhanced') {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            AI-Enhanced Recommendations
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            AI Generated
          </Badge>
        </div>
        {businessContext && (
          <p className="text-sm text-blue-700">
            Tailored for: {businessContext}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Priority Actions */}
        {recommendations.priority_actions && recommendations.priority_actions.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Priority Actions
            </h4>
            <div className="space-y-4">
              {recommendations.priority_actions.map((action, index) => (
                <div 
                  key={index}
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-800">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {action.time_estimate}
                    </div>
                  </div>
                  
                  <div className="ml-10">
                    <h5 className="font-medium text-gray-900 mb-2">
                      {action.action}
                    </h5>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Why: </span>
                        <span className="text-sm text-gray-600">{action.reasoning}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          Expected Impact: 
                        </span>
                        <span className="text-sm text-green-600">{action.expected_impact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Strategy */}
        {recommendations.content_strategy && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Content Strategy</h4>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700">{recommendations.content_strategy}</p>
            </div>
          </div>
        )}

        {/* Technical SEO */}
        {recommendations.technical_seo && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Technical SEO</h4>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700">{recommendations.technical_seo}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}