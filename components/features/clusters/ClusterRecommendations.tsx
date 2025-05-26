'use client';

import { Card } from '@/components/ui/data-display';
import { Badge } from '@/components/ui/base';
import { CheckCircle, AlertCircle, TrendingUp, FileText } from 'lucide-react';
import type { Cluster } from '@/types';

interface ClusterRecommendationsProps {
  cluster: Cluster;
}

export function ClusterRecommendations({ cluster }: ClusterRecommendationsProps) {
  const { content_strategy, opportunities } = cluster;

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <FileText className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Content Recommendations</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Based on cluster analysis and market opportunities
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{content_strategy.recommended_content_type}</Badge>
              <Badge variant="outline">{content_strategy.content_depth}</Badge>
            </div>
            <p className="text-sm mb-2">
              Create a {content_strategy.content_depth} {content_strategy.recommended_content_type.toLowerCase()} 
              {' '}targeting {content_strategy.primary_intent} intent with approximately{' '}
              {content_strategy.estimated_word_count} words.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Key Topics to Cover:</h4>
            <ul className="space-y-2">
              {content_strategy.key_topics_to_cover.map((topic, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm">{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Optimization Priorities</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Actions to maximize cluster performance
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {opportunities.quick_wins.map((win, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
              <p className="text-sm flex-1">{win}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Expected Outcomes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Traffic Potential</span>
            <p className="text-2xl font-bold">
              {opportunities.estimated_traffic_potential.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Monthly visitors</p>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Competition Level</span>
            <div className="flex items-center gap-2">
              <Badge 
                variant={
                  opportunities.competition_level === 'low' ? 'success' :
                  opportunities.competition_level === 'medium' ? 'warning' : 'destructive'
                }
              >
                {opportunities.competition_level}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {opportunities.ranking_difficulty} to rank
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}