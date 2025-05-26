'use client';

import { Card } from '@/components/ui/data-display';
import { Badge } from '@/components/ui/base';
import { Button } from '@/components/ui/base';
import { ChevronRight, TrendingUp, Target } from 'lucide-react';
import type { Cluster } from '@/types';
import { formatNumber } from '@/utils/format';

interface ClusterCardProps {
  cluster: Cluster;
  onViewDetails: (cluster: Cluster) => void;
}

export function ClusterCard({ cluster, onViewDetails }: ClusterCardProps) {
  const { name, theme, keywords, metrics, opportunities } = cluster;
  
  const getOpportunityBadgeVariant = (score: number) => {
    if (score >= 70) return 'success';
    if (score >= 40) return 'warning';
    return 'secondary';
  };

  const getCompetitionBadgeVariant = (level: string) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewDetails(cluster)}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{theme}</p>
          </div>
          <Badge variant={getOpportunityBadgeVariant(metrics.opportunity_score)}>
            {metrics.opportunity_score}% Score
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Search Volume</span>
            </div>
            <p className="text-lg font-semibold">{formatNumber(metrics.total_search_volume)}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Target className="w-4 h-4" />
              <span>Keywords</span>
            </div>
            <p className="text-lg font-semibold">{metrics.total_keywords}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant={getCompetitionBadgeVariant(opportunities.competition_level)}>
              {opportunities.competition_level} competition
            </Badge>
            <Badge variant="outline">
              {opportunities.ranking_difficulty} difficulty
            </Badge>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(cluster);
            }}
          >
            View Details
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {keywords.length > 0 && (
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">Top Keywords:</p>
            <div className="flex flex-wrap gap-1">
              {keywords.slice(0, 3).map((kw) => (
                <Badge key={kw.id} variant="outline" className="text-xs">
                  {kw.keyword}
                </Badge>
              ))}
              {keywords.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{keywords.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}