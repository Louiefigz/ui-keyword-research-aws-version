'use client';

import { Card } from '@/components/ui/data-display';
import { Badge } from '@/components/ui/base';
import { Button } from '@/components/ui/base';
import { ChevronRight, TrendingUp, Target } from 'lucide-react';
import type { Cluster } from '@/types';
import { formatNumber } from '@/lib/utils/format';
import { getDifficultyBadgeVariant } from '@/lib/utils';

interface ClusterCardProps {
  cluster: Cluster;
  onViewDetails: (cluster: Cluster) => void;
}

export function ClusterCard({ cluster, onViewDetails }: ClusterCardProps) {
  const { 
    name, 
    description, 
    keywords, 
    keyword_count, 
    total_volume, 
    avg_difficulty, 
    avg_position 
  } = cluster;
  

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewDetails(cluster)}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <Badge variant={getDifficultyBadgeVariant(avg_difficulty)}>
            {Math.round(avg_difficulty)}% Difficulty
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Search Volume</span>
            </div>
            <p className="text-lg font-semibold">{formatNumber(total_volume)}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Target className="w-4 h-4" />
              <span>Keywords</span>
            </div>
            <p className="text-lg font-semibold">{keyword_count}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="outline">
              Avg Position: {Math.round(avg_position)}
            </Badge>
            <Badge variant={getDifficultyBadgeVariant(avg_difficulty)}>
              {Math.round(avg_difficulty)}% KD
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