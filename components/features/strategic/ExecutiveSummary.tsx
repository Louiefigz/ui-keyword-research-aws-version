'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base';
import { Hash, Users, DollarSign, Trophy } from 'lucide-react';
import type { StrategicAdviceResponse } from '@/types';

interface ExecutiveSummaryProps {
  data: StrategicAdviceResponse['executive_summary'];
}

export function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  // Handle both snake_case and camelCase versions
  const currentState = data?.current_state || data?.currentState;
  const opportunitySummary = data?.opportunity_summary || data?.opportunitySummary;
  const strategicPriorities = data?.strategic_priorities || data?.strategicPriorities || [];
  const expectedResults = data?.expected_results || data?.expectedResults || {};

  if (!currentState) {
    return (
      <Card>
        <CardContent>
          <p className="text-gray-600">No executive summary data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current State Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Performance</CardTitle>
          <CardDescription>
            Your website&apos;s current SEO performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Keywords Tracked</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {(currentState.total_keywords_tracked || currentState.totalKeywordsTracked || 0).toLocaleString()}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Organic Traffic</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {(currentState.current_organic_traffic || currentState.currentOrganicTraffic || 0).toLocaleString()}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Traffic Value</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {currentState.current_traffic_value || currentState.currentTrafficValue || '$0'}
              </div>
            </div>
            
            <div className="space-y-2 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Top 10 Rankings</span>
              </div>
              <div className="text-2xl font-bold text-green-700">
                {currentState.top_ranking_keywords || currentState.topRankingKeywords || 0}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunity Summary */}
      {opportunitySummary && (
        <Card>
          <CardHeader>
            <CardTitle>Opportunity Summary</CardTitle>
            <CardDescription>
              Identified opportunities for growth and optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Immediate Opportunities</span>
                  <Badge variant="secondary" className="bg-green-100">
                    {opportunitySummary.immediate_opportunities || opportunitySummary.immediateOpportunities || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Content Gaps Identified</span>
                  <Badge variant="secondary" className="bg-orange-100">
                    {opportunitySummary.content_gaps_identified || opportunitySummary.contentGapsIdentified || 0}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Potential Traffic Gain</span>
                  <span className="font-semibold text-green-600">
                    +{opportunitySummary.potential_traffic_gain || opportunitySummary.potentialTrafficGain || '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Potential Monthly Value</span>
                  <span className="font-semibold text-green-600">
                    {opportunitySummary.potential_monthly_value || opportunitySummary.potentialMonthlyValue || '$0'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategic Priorities */}
      {strategicPriorities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Strategic Priorities</CardTitle>
            <CardDescription>
              Recommended actions in order of impact and effort
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strategicPriorities.map((priority, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm flex-1">{priority}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expected Results Timeline */}
      {Object.keys(expectedResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expected Results Timeline</CardTitle>
            <CardDescription>
              Projected impact of implementing recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(expectedResults).map(([timeframe, result]) => {
                const progress = getProgressWidth(timeframe, result as string);
                
                return (
                  <div key={timeframe} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {timeframe.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        {result}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function getProgressWidth(timeframe: string, result: string): number {
  // Extract percentage if present in result string
  const percentMatch = result.match(/(\d+)%/);
  if (percentMatch) {
    return parseInt(percentMatch[1]);
  }
  
  // Extract numeric value and estimate progress
  const numMatch = result.match(/\+?([\d,]+)/);
  if (numMatch) {
    const value = parseInt(numMatch[1].replace(/,/g, ''));
    // Scale based on timeframe
    if (timeframe === '3_months') return Math.min(value / 100, 100);
    if (timeframe === '6_months') return Math.min(value / 50, 100);
    if (timeframe === '12_months') return Math.min(value / 25, 100);
  }
  
  // Default progress based on timeframe
  if (timeframe === '3_months') return 30;
  if (timeframe === '6_months') return 60;
  return 90;
}