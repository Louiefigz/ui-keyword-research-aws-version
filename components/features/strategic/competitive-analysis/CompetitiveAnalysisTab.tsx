'use client';

import { useState } from 'react';
import { PieChart, Download } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/data-display/card';
import { Button } from '@/components/ui/base/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/forms/select';
import { MetricCard } from '@/components/ui/data-display/metric-card';
import { MarketShareChart } from './MarketShareChart';
import { CompetitorGapsTable, type CompetitorGap } from './CompetitorGapsTable';
import { StrategyRecommendations } from './StrategyRecommendations';
import { CompetitiveAdvantages } from './CompetitiveAdvantages';
import { formatPercent } from '@/lib/utils/format';
import { exportUtils } from '@/lib/utils/strategic-advice-utils';

interface MarketShareData {
  market_share_percentage: number;
  organic_visibility: number;
  competitor_comparison: Array<{
    competitor: string;
    market_share: number;
    organic_visibility: number;
    shared_keywords: number;
  }>;
  growth_opportunities: Array<{
    keyword_category: string;
    potential_gain: number;
    difficulty_score: number;
  }>;
}

interface CompetitiveAnalysisData {
  competitor_gaps: Record<string, CompetitorGap>;
  market_share_analysis: MarketShareData;
  competitive_advantages: Array<{
    advantage_type: string;
    description: string;
    keywords_count: number;
    impact_score: number;
  }>;
  strategic_recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    recommendation: string;
    expected_outcome: string;
    timeline: string;
  }>;
}

interface CompetitiveAnalysisTabProps {
  data?: CompetitiveAnalysisData;
  isLoading?: boolean;
  error?: Error | null;
}

export function CompetitiveAnalysisTab({ data, isLoading, error }: CompetitiveAnalysisTabProps) {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'opportunity_score' | 'volume' | 'estimated_value'>('opportunity_score');
  const [isExporting, setIsExporting] = useState(false);

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-destructive/10 p-3 mb-4">
            <PieChart className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Failed to Load Competitive Analysis</h3>
          <p className="text-muted-foreground text-center mb-4 max-w-md">
            {error.message || 'An error occurred while loading competitive analysis data. Please try again.'}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="animate-pulse h-6 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Competitive Analysis Not Available</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Competitive analysis data will be generated once sufficient keyword data is processed.
          </p>
        </CardContent>
      </Card>
    );
  }

  const competitors = data.market_share_analysis.competitor_comparison.map(c => c.competitor);
  const gapsArray = Object.values(data.competitor_gaps);

  // Calculate totals
  const totalGaps = gapsArray.length;
  const highValueGaps = gapsArray.filter(gap => gap.opportunity_score >= 70).length;
  const totalPotentialValue = gapsArray.reduce((sum, gap) => sum + gap.estimated_value, 0);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Prepare export data
      const exportData = {
      summary: {
        marketShare: data.market_share_analysis.market_share_percentage,
        totalGaps,
        highValueGaps,
        totalPotentialValue,
      },
      competitorGaps: gapsArray.map(gap => ({
        keyword: gap.keyword,
        volume: gap.metrics.volume,
        difficulty: gap.metrics.difficulty,
        cpc: gap.metrics.cpc,
        competitors: Object.entries(gap.competitor_positions)
          .map(([comp, pos]) => `${comp}: #${pos}`)
          .join(', '),
        opportunity: gap.opportunity,
        opportunityScore: gap.opportunity_score,
        estimatedTraffic: gap.estimated_traffic,
        estimatedValue: gap.estimated_value,
      })),
      competitiveAdvantages: data.competitive_advantages,
      strategicRecommendations: data.strategic_recommendations,
    };

    // Export as CSV
    const csvData = [
      ...exportData.competitorGaps,
      {},
      { keyword: 'Summary Metrics' },
      { keyword: 'Market Share %', volume: exportData.summary.marketShare },
      { keyword: 'Total Gaps', volume: exportData.summary.totalGaps },
      { keyword: 'High-Value Gaps', volume: exportData.summary.highValueGaps },
      { keyword: 'Total Potential Value', volume: exportData.summary.totalPotentialValue },
    ];

    exportUtils.exportToCSV(csvData, 'competitive-analysis');
    } catch (error) {
      // Export failed
      // You could add a toast notification here
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6" role="region" aria-label="Competitive Analysis">
      {/* Header with Export */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Competitive Analysis</h2>
          <p className="text-muted-foreground">
            Identify gaps and opportunities against your competitors
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleExport}
          disabled={isExporting}
          aria-label="Export competitive analysis data"
        >
          <Download className="h-4 w-4 mr-2" aria-hidden="true" />
          {isExporting ? 'Exporting...' : 'Export Analysis'}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Market Share"
          value={formatPercent(data.market_share_analysis.market_share_percentage / 100)}
          change={{ value: 5, type: 'increase' }}
        />
        <MetricCard
          title="Total Gaps"
          value={totalGaps.toString()}
          change={{ value: 12, type: 'increase' }}
        />
        <MetricCard
          title="High-Value Gaps"
          value={highValueGaps.toString()}
        />
        <MetricCard
          title="Potential Value"
          value={`$${(totalPotentialValue / 1000).toFixed(1)}k`}
        />
      </div>

      {/* Market Share Visualization */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Market Share Distribution</CardTitle>
            <CardDescription>
              Your position compared to competitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MarketShareChart data={data.market_share_analysis} />
          </CardContent>
        </Card>
        <CompetitiveAdvantages advantages={data.competitive_advantages} />
      </div>

      {/* Competitor Gaps Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Competitor Keyword Gaps</CardTitle>
              <CardDescription>
                Keywords where competitors rank but you don&apos;t
              </CardDescription>
            </div>
            <Select value={selectedCompetitor} onValueChange={setSelectedCompetitor}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All competitors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All competitors</SelectItem>
                {competitors.map(competitor => (
                  <SelectItem key={competitor} value={competitor}>
                    {competitor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <CompetitorGapsTable
            gaps={gapsArray}
            selectedCompetitor={selectedCompetitor}
            onSort={setSortBy}
            sortBy={sortBy}
          />
        </CardContent>
      </Card>

      {/* Strategic Recommendations */}
      <StrategyRecommendations recommendations={data.strategic_recommendations} />
    </div>
  );
}