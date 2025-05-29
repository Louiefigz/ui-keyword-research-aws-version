'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base';
import { Button } from '@/components/ui/base';
import { FileText, TrendingUp } from 'lucide-react';
import type { ContentClusterAdvice } from '@/types';

interface ContentClusterCardProps {
  cluster: ContentClusterAdvice;
  rank: number;
}

export function ContentClusterCard({ cluster, rank }: ContentClusterCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">#{rank}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{cluster.cluster_name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getPriorityColor(cluster.priority)}>
                  {cluster.priority} priority
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {cluster.content_type}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Target Keywords */}
        <div>
          <p className="text-sm font-medium mb-2">Target Keywords ({cluster.target_keywords?.length || 0})</p>
          <div className="flex flex-wrap gap-1">
            {(cluster.target_keywords || []).slice(0, 5).map((keyword, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {(cluster.target_keywords?.length || 0) > 5 && (
              <Badge variant="outline" className="text-xs">
                +{cluster.target_keywords.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        {/* Estimated Impact */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Traffic Increase</p>
            <p className="font-semibold flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              +{(cluster.estimated_impact?.traffic_increase || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Conversion Potential</p>
            <p className="font-semibold text-green-600">
              {(cluster.estimated_impact?.conversion_potential || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Ranking Positions</p>
            <p className="font-semibold">+{cluster.estimated_impact?.ranking_positions || 0}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">ROI Estimate</p>
            <p className="font-semibold">{cluster.estimated_impact?.roi_estimate || 0}%</p>
          </div>
        </div>

        {/* Content Outline Preview */}
        <div className="border-t pt-3">
          <p className="text-sm font-medium mb-2">Content Outline</p>
          <ul className="space-y-1">
            {(cluster.content_outline || []).slice(0, 3).map((section, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{section}</span>
              </li>
            ))}
            {(cluster.content_outline?.length || 0) > 3 && (
              <li className="text-sm text-muted-foreground">
                ...and {(cluster.content_outline?.length || 0) - 3} more sections
              </li>
            )}
          </ul>
        </div>

        <Button className="w-full" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          View Full Template
        </Button>
      </CardContent>
    </Card>
  );
}