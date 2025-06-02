'use client';

import { Card } from '@/components/ui/data-display';
import { Badge } from '@/components/ui/base';
import { Button } from '@/components/ui/base';
import { ChevronRight, TrendingUp, Target, Download } from 'lucide-react';
import type { Cluster, ClusterSummaryResponse } from '@/types';
import { useExportCluster } from '@/lib/hooks/use-clusters';
import { formatNumber } from '@/lib/utils/format';
import { getDifficultyBadgeVariant } from '@/lib/utils';

interface ClusterCardProps {
  cluster: Cluster | ClusterSummaryResponse;
  onViewDetails: (cluster: Cluster | ClusterSummaryResponse) => void;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  onQuickExport?: () => void;
  showSelection?: boolean;
}

export function ClusterCard({ 
  cluster, 
  onViewDetails,
  isSelected = false,
  onSelect,
  onQuickExport,
  showSelection = false
}: ClusterCardProps) {
  const { 
    name, 
    description, 
    keyword_count, 
    total_volume, 
    avg_difficulty, 
    avg_position 
  } = cluster;
  
  // Handle both full clusters and summary responses
  const keywords = 'keywords' in cluster ? cluster.keywords : ('preview_keywords' in cluster ? cluster.preview_keywords : []);
  const exportCluster = useExportCluster();

  const handleQuickExport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickExport) {
      onQuickExport();
    } else {
      // Default export behavior using single cluster endpoint
      try {
        await exportCluster.mutateAsync({
          projectId: cluster.project_id,
          clusterId: cluster.cluster_id,
          exportRequest: {
            export_format: 'csv',
            include_all_keywords: true
          }
        });
      } catch (error) {
        console.error('Export failed:', error);
      }
    }
  };
  

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewDetails(cluster)}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3 flex-1">
            {showSelection && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelect?.(e.target.checked);
                }}
                className="w-4 h-4 mt-1"
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQuickExport}
              disabled={exportCluster.isPending}
              className="p-2"
              title="Export this cluster"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Badge variant={getDifficultyBadgeVariant(avg_difficulty)}>
              {Math.round(avg_difficulty)}% Difficulty
            </Badge>
          </div>
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

        {keywords && keywords.length > 0 && (
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">
              {'preview_keywords' in cluster ? 'Preview Keywords:' : 'Top Keywords:'}
            </p>
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
            {'preview_keywords' in cluster && keyword_count > keywords.length && (
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto text-xs mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(cluster);
                }}
              >
                View All {keyword_count} Keywords →
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}