import { useState } from 'react';
import { PieChart, Target, TrendingUp, Download } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/data-display/card';
import { Button } from '@/components/ui/base/button';
import { Badge } from '@/components/ui/base/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/data-display/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/forms/select';
import { MarketShareChart } from './MarketShareChart';
import { MetricCard } from '@/components/ui/data-display/metric-card';

interface CompetitorGap {
  keyword: string;
  metrics: {
    volume: number;
    difficulty: number;
    cpc: number;
  };
  competitor_positions: Record<string, number>;
  opportunity: string;
  opportunity_score: number;
  estimated_traffic: number;
  estimated_value: number;
}

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
  projectId: string;
  data?: CompetitiveAnalysisData;
}

export function CompetitiveAnalysisTab({ data }: Omit<CompetitiveAnalysisTabProps, 'projectId'>) {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'opportunity_score' | 'volume' | 'estimated_value'>('opportunity_score');

  if (!data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Competitive Analysis Not Available</h3>
          <p className="text-muted-foreground text-center">
            Competitive analysis data will be generated once sufficient keyword data is processed.
          </p>
        </CardContent>
      </Card>
    );
  }

  const competitors = data.market_share_analysis.competitor_comparison.map(c => c.competitor);
  const competitorGaps = Object.values(data.competitor_gaps);

  const filteredGaps = competitorGaps
    .filter(gap => {
      if (selectedCompetitor === 'all') return true;
      return Object.keys(gap.competitor_positions).includes(selectedCompetitor);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return b.metrics.volume - a.metrics.volume;
        case 'estimated_value':
          return b.estimated_value - a.estimated_value;
        default:
          return b.opportunity_score - a.opportunity_score;
      }
    });

  const handleExportGaps = () => {
    const csvData = filteredGaps.map(gap => ({
      keyword: gap.keyword,
      volume: gap.metrics.volume,
      difficulty: gap.metrics.difficulty,
      cpc: gap.metrics.cpc,
      opportunity_score: gap.opportunity_score,
      estimated_traffic: gap.estimated_traffic,
      estimated_value: gap.estimated_value,
      competitors: Object.entries(gap.competitor_positions)
        .map(([comp, pos]) => `${comp}:${pos}`)
        .join('; ')
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'competitive-gaps.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getOpportunityBadgeVariant = (score: number) => {
    if (score >= 8) return 'success';
    if (score >= 6) return 'warning';
    return 'secondary';
  };

  const getDifficultyBadgeVariant = (difficulty: number) => {
    if (difficulty <= 30) return 'success';
    if (difficulty <= 60) return 'warning';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Market Share Analysis</CardTitle>
          <CardDescription>
            Your current position in the competitive landscape
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <MarketShareChart data={data.market_share_analysis} />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  title="Market Share"
                  value={`${data.market_share_analysis.market_share_percentage.toFixed(1)}%`}
                  icon={PieChart}
                />
                <MetricCard
                  title="Organic Visibility"
                  value={`${data.market_share_analysis.organic_visibility.toFixed(1)}%`}
                  icon={TrendingUp}
                />
              </div>

              {/* Top Competitors */}
              <div className="space-y-2">
                <h4 className="font-medium">Top Competitors</h4>
                {data.market_share_analysis.competitor_comparison.slice(0, 5).map((competitor, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{idx + 1}</Badge>
                      <span className="font-medium text-sm">{competitor.competitor}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{competitor.market_share.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">
                        {competitor.shared_keywords} shared keywords
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitive Advantages */}
      <Card>
        <CardHeader>
          <CardTitle>Your Competitive Advantages</CardTitle>
          <CardDescription>
            Areas where you currently outperform competitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {data.competitive_advantages.map((advantage, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-green-900">{advantage.advantage_type}</h4>
                  <Badge variant="success">
                    Score: {advantage.impact_score}/10
                  </Badge>
                </div>
                <p className="text-sm text-green-800 mb-2">{advantage.description}</p>
                <p className="text-xs text-green-600">
                  {advantage.keywords_count} keywords in this category
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitor Gaps */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Competitor Keyword Gaps</CardTitle>
              <CardDescription>
                Keywords where competitors rank but you don't
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCompetitor} onValueChange={setSelectedCompetitor}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Competitors</SelectItem>
                  {competitors.map(competitor => (
                    <SelectItem key={competitor} value={competitor}>
                      {competitor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy as (value: string) => void}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opportunity_score">Opportunity Score</SelectItem>
                  <SelectItem value="volume">Search Volume</SelectItem>
                  <SelectItem value="estimated_value">Estimated Value</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleExportGaps}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-center">Difficulty</TableHead>
                <TableHead className="text-right">CPC</TableHead>
                <TableHead>Competitor Positions</TableHead>
                <TableHead className="text-center">Opportunity</TableHead>
                <TableHead className="text-right">Est. Value</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGaps.slice(0, 20).map((gap, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{gap.keyword}</TableCell>
                  <TableCell className="text-right">
                    {gap.metrics.volume.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getDifficultyBadgeVariant(gap.metrics.difficulty)}>
                      {gap.metrics.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ${gap.metrics.cpc.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(gap.competitor_positions).slice(0, 3).map(([comp, pos]) => (
                        <Badge key={comp} variant="outline" className="text-xs">
                          {comp}: #{pos}
                        </Badge>
                      ))}
                      {Object.keys(gap.competitor_positions).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{Object.keys(gap.competitor_positions).length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getOpportunityBadgeVariant(gap.opportunity_score)}>
                      {gap.opportunity_score}/10
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    ${gap.estimated_value.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button size="sm" variant="outline">
                      <Target className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredGaps.length > 20 && (
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Showing top 20 of {filteredGaps.length} opportunities
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strategic Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Recommendations</CardTitle>
          <CardDescription>
            Priority actions based on competitive analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.strategic_recommendations.map((rec, idx) => (
              <div key={idx} className="p-4 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={rec.priority === 'high' ? 'destructive' : 
                              rec.priority === 'medium' ? 'warning' : 'secondary'}
                    >
                      {rec.priority} priority
                    </Badge>
                    <span className="text-sm text-muted-foreground">{rec.timeline}</span>
                  </div>
                </div>
                <h4 className="font-medium mb-2">{rec.recommendation}</h4>
                <p className="text-sm text-muted-foreground">{rec.expected_outcome}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 