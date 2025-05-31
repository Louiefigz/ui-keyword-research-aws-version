'use client';

import { useState } from 'react';
import { Zap, TrendingUp, Award, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { ProjectStats } from '@/types/api.types';
import { DashboardStatsCard } from './dashboard-stats-card';
import { ErrorState } from '@/components/ui/feedback/error-state';
import { Button } from '@/components/ui/base/button';
import { DashboardSummaryDetails } from './dashboard-summary-details';

interface DashboardSummaryProps {
  stats?: ProjectStats;
  loading?: boolean;
  error?: Error | null;
}

function calculateMetrics(stats: ProjectStats) {
  const totalVolume = stats.aggregations?.totalVolume || stats.totalVolume || 0;
  const avgPosition = stats.aggregations?.avgPosition || stats.avgPosition || 0;
  const opportunityDistribution = stats.aggregations?.opportunityDistribution || {};
  const actionDistribution = stats.aggregations?.actionDistribution || {};
  const intentDistribution = stats.aggregations?.intentDistribution || {};
  
  const highOpportunityCount = (opportunityDistribution['low_hanging'] || 0) + 
                               (opportunityDistribution['Low-Hanging Fruit'] || 0);
  
  const hasDistributions = Object.keys(opportunityDistribution).length > 0 || 
                          Object.keys(actionDistribution).length > 0 || 
                          Object.keys(intentDistribution).length > 0;
  
  return { totalVolume, avgPosition, highOpportunityCount, hasDistributions };
}

function DashboardSummaryLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  );
}

export function DashboardSummary({ stats, loading, error }: DashboardSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (loading) return <DashboardSummaryLoading />;
  if (error) return <ErrorState message={error.message || 'Failed to load dashboard statistics'} />;
  if (!stats) return null;

  const { totalVolume, avgPosition, highOpportunityCount, hasDistributions } = calculateMetrics(stats);

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatsCard
          title="Total Keywords"
          value={stats.totalKeywords?.toLocaleString() || '0'}
          icon={Zap}
          description="Active keywords in project"
        />
        
        <DashboardStatsCard
          title="Total Volume"
          value={Math.round(totalVolume).toLocaleString()}
          icon={TrendingUp}
          description="Total monthly search volume"
        />
        
        <DashboardStatsCard
          title="Avg. Position"
          value={avgPosition ? avgPosition.toFixed(1) : 'N/A'}
          icon={Award}
          description="Average ranking position"
        />
        
        <DashboardStatsCard
          title="High Opportunity"
          value={highOpportunityCount.toLocaleString()}
          icon={Target}
          description="Low-hanging fruit keywords"
        />
      </div>

      {/* Expandable Details Section */}
      {hasDistributions && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-lg font-semibold">Detailed Breakdown</h3>
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </div>
          
          {isExpanded && <DashboardSummaryDetails stats={stats} />}
        </div>
      )}
    </div>
  );
}