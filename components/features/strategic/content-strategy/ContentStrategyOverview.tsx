'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/data-display/card';
import { Button } from '@/components/ui/base';
import { FileText, Calendar, TrendingUp, Users, Download } from 'lucide-react';
import type { ContentStrategyAdvice } from '@/types';

interface ContentStrategyOverviewProps {
  strategy: ContentStrategyAdvice;
  onExport: () => void;
}

export function ContentStrategyOverview({ strategy, onExport }: ContentStrategyOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Content Strategy Overview</CardTitle>
            <CardDescription>
              AI-generated content plan based on keyword clusters and opportunities
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onExport}>
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
  );
}