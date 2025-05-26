'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base';
import type { ContentGap } from '@/types';

interface ContentGapsSectionProps {
  gaps: ContentGap[];
}

export function ContentGapsSection({ gaps }: ContentGapsSectionProps) {
  if (!gaps || gaps.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Gaps</CardTitle>
        <CardDescription>
          Missing content opportunities based on competitor analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {gaps.map((gap, index) => (
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
  );
}