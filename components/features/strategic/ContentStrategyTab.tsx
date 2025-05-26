'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base';
import { Button } from '@/components/ui/base';
import { FileText, Calendar, TrendingUp, Users, DollarSign, Download } from 'lucide-react';
import { ContentCalendar } from './ContentCalendar';
import { ContentClusterCard } from './ContentClusterCard';
import type { ContentStrategyAdvice } from '@/types';

interface ContentStrategyTabProps {
  strategy: ContentStrategyAdvice;
}

export function ContentStrategyTab({ strategy }: ContentStrategyTabProps) {
  return (
    <div className="space-y-6">
      {/* Content Strategy Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Content Strategy Overview</CardTitle>
              <CardDescription>
                AI-generated content plan based on keyword clusters and opportunities
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Content Pieces</span>
              </div>
              <div className="text-2xl font-bold">
                {strategy.content_clusters.length}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Keywords Targeted</span>
              </div>
              <div className="text-2xl font-bold">
                {strategy.content_clusters.reduce((sum, cluster) => 
                  sum + cluster.target_keywords.length, 0
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Est. Monthly Traffic</span>
              </div>
              <div className="text-2xl font-bold">
                {strategy.content_calendar.reduce((sum, month) => 
                  sum + month.estimated_traffic, 0
                ).toLocaleString()}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-600">Timeline</span>
              </div>
              <div className="text-2xl font-bold">
                {strategy.content_calendar.length} months
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Content Clusters */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Priority Content Clusters</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {strategy.content_clusters
            .sort((a, b) => {
              const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            .map((cluster, index) => (
              <ContentClusterCard key={cluster.cluster_id} cluster={cluster} rank={index + 1} />
            ))}
        </div>
      </div>

      {/* Content Gaps */}
      {strategy.content_gaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Content Gaps</CardTitle>
            <CardDescription>
              Missing content opportunities based on competitor analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strategy.content_gaps.map((gap, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{gap.topic}</h4>
                      <p className="text-sm text-muted-foreground">
                        {gap.content_type} • {gap.target_keywords.length} keywords
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {gap.search_volume.toLocaleString()} volume
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {gap.competition_level} competition
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Priority Score:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${gap.priority_score}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{gap.priority_score}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Content Publishing Calendar</CardTitle>
          <CardDescription>
            Recommended publishing schedule for maximum impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentCalendar items={strategy.content_calendar} />
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      {strategy.optimization_recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Optimization Recommendations</CardTitle>
            <CardDescription>
              Improvements for existing content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strategy.optimization_recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Badge variant={rec.impact === 'high' ? 'default' : 'secondary'}>
                    {rec.impact} impact
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Type: {rec.type}</span>
                      <span>Effort: {rec.effort}</span>
                      <span>{rec.pages_affected} pages affected</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}