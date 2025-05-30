'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base';
import { Hash, Users, DollarSign, Trophy, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import type { StrategicAdviceResponse } from '@/types';

interface ExecutiveSummaryProps {
  data: StrategicAdviceResponse['executive_summary'];
  currentPerformance?: StrategicAdviceResponse['current_performance'];
}

export function ExecutiveSummary({ data, currentPerformance }: ExecutiveSummaryProps) {
  const [expandedSections, setExpandedSections] = useState({
    priorities: true,
    performance: false
  });

  // Handle both snake_case and camelCase versions
  const currentState = data?.current_state;
  const opportunitySummary = data?.opportunity_summary;
  const strategicPriorities = data?.strategic_priorities || [];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
                {(currentState.total_keywords_tracked || 0).toLocaleString()}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Organic Traffic</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {(currentState.current_organic_traffic || 0).toLocaleString()}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Traffic Value</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {currentState.current_traffic_value || '$0'}
              </div>
            </div>
            
            <div className="space-y-2 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Top 10 Rankings</span>
              </div>
              <div className="text-2xl font-bold text-green-700">
                {currentState.top_ranking_keywords || 0}
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
                    {opportunitySummary.immediate_opportunities || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Content Gaps Identified</span>
                  <Badge variant="secondary" className="bg-orange-100">
                    {opportunitySummary.content_gaps_identified || 0}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Potential Traffic Gain</span>
                  <span className="font-semibold text-green-600">
                    +{opportunitySummary.potential_traffic_gain || '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Potential Monthly Value</span>
                  <span className="font-semibold text-green-600">
                    {opportunitySummary.potential_monthly_value || '$0'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Performance Highlights */}
      {currentPerformance && currentPerformance.top_performers.length > 0 && (
        <Card>
          <CardHeader 
            className="cursor-pointer"
            onClick={() => toggleSection('performance')}
          >
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Performance Highlights
                </CardTitle>
                <CardDescription>
                  Top performing keywords and winning patterns
                </CardDescription>
              </div>
              {expandedSections.performance ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </CardHeader>
          {expandedSections.performance && (
            <CardContent>
              <div className="space-y-4">
                {/* Top 3 Performers */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Top 3 Performers</h4>
                  <div className="space-y-2">
                    {currentPerformance.top_performers.slice(0, 3).map((performer, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800">#{performer.position}</Badge>
                          <span className="text-sm font-medium">{performer.keyword}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {performer.traffic.toLocaleString()} visits/mo
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Winning Pattern */}
                {currentPerformance.winning_patterns && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Winning Pattern:</span> Your content performs best for{' '}
                      <span className="font-semibold capitalize">{currentPerformance.winning_patterns.dominant_intent}</span>{' '}
                      intent keywords with an average position of{' '}
                      <span className="font-semibold">{currentPerformance.winning_patterns.average_position.toFixed(1)}</span>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Strategic Priorities */}
      {strategicPriorities.length > 0 && (
        <Card>
          <CardHeader 
            className="cursor-pointer"
            onClick={() => toggleSection('priorities')}
          >
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Strategic Priorities</CardTitle>
                <CardDescription>
                  Recommended actions in order of impact and effort
                </CardDescription>
              </div>
              {expandedSections.priorities ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </CardHeader>
          {expandedSections.priorities && (
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
          )}
        </Card>
      )}

    </div>
  );
}