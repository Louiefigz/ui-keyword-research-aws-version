'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base';
import type { OptimizationRecommendation } from '@/types';

interface OptimizationRecommendationsProps {
  recommendations: OptimizationRecommendation[];
}

export function OptimizationRecommendations({ recommendations }: OptimizationRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) return null;

  const getImpactVariant = (impact: string): "default" | "secondary" => {
    return impact === 'high' ? 'default' : 'secondary';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimization Recommendations</CardTitle>
        <CardDescription>
          Improvements for existing content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
              <Badge variant={getImpactVariant(rec.impact)}>
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
  );
}