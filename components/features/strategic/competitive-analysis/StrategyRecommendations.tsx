'use client';

import { Target, TrendingUp, Shield, Expand } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base/badge';

interface StrategicRecommendation {
  priority: 'high' | 'medium' | 'low';
  recommendation: string;
  expected_outcome: string;
  timeline: string;
}

interface StrategyRecommendationsProps {
  recommendations: StrategicRecommendation[];
}

export function StrategyRecommendations({ recommendations }: StrategyRecommendationsProps) {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Target className="h-4 w-4" />;
      case 'medium':
        return <TrendingUp className="h-4 w-4" />;
      case 'low':
        return <Shield className="h-4 w-4" />;
      default:
        return <Expand className="h-4 w-4" />;
    }
  };

  const getPriorityVariant = (priority: string): "default" | "secondary" | "destructive" => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategic Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="border-l-4 border-l-primary pl-4 space-y-2">
            <div className="flex items-center gap-2">
              {getPriorityIcon(rec.priority)}
              <Badge variant={getPriorityVariant(rec.priority)}>
                {rec.priority.toUpperCase()} PRIORITY
              </Badge>
              <span className="text-sm text-muted-foreground">{rec.timeline}</span>
            </div>
            <h4 className="font-semibold">{rec.recommendation}</h4>
            <p className="text-sm text-muted-foreground">{rec.expected_outcome}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}