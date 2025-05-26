'use client';

import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';
import { Progress } from '@/components/ui/feedback/progress-bar';

interface CompetitiveAdvantage {
  advantage_type: string;
  description: string;
  keywords_count: number;
  impact_score: number;
}

interface CompetitiveAdvantagesProps {
  advantages: CompetitiveAdvantage[];
}

export function CompetitiveAdvantages({ advantages }: CompetitiveAdvantagesProps) {
  const getImpactColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Competitive Advantages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {advantages.map((advantage, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  {advantage.advantage_type}
                </h4>
                <p className="text-sm text-muted-foreground">{advantage.description}</p>
                <p className="text-xs text-muted-foreground">
                  {advantage.keywords_count} keywords affected
                </p>
              </div>
              <span className={`text-2xl font-bold ${getImpactColor(advantage.impact_score)}`}>
                {advantage.impact_score}
              </span>
            </div>
            <Progress value={advantage.impact_score} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}