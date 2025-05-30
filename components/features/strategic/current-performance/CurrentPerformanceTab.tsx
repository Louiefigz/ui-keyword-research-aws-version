'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base/badge';
import { Button } from '@/components/ui/base/button';
import { 
  TrendingUp, 
  Trophy, 
  ChevronDown, 
  ChevronUp,
  Target,
  Lightbulb,
  BarChart,
  DollarSign,
  Activity
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

interface TopPerformer {
  keyword: string;
  position: number;
  traffic: number;
  value: number;
  intent?: string;
}

interface WinningPatterns {
  dominant_intent: string;
  successful_themes: Record<string, number>;
  average_position: number;
}

interface CurrentPerformanceData {
  top_performers: TopPerformer[];
  total_top3_keywords: number;
  total_top3_traffic: number;
  total_top3_value: number;
  winning_patterns: WinningPatterns;
  recommendations: string[];
}

interface CurrentPerformanceTabProps {
  data?: CurrentPerformanceData;
}

export function CurrentPerformanceTab({ data }: CurrentPerformanceTabProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [showAllPerformers, setShowAllPerformers] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'patterns' | 'recommendations' | null>('patterns');

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600 text-center">No current performance data available.</p>
        </CardContent>
      </Card>
    );
  }

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const topPerformersToShow = showAllPerformers ? data.top_performers : data.top_performers.slice(0, 5);

  // Sort successful themes by count
  const sortedThemes = Object.entries(data.winning_patterns.successful_themes || {})
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4 text-green-600" />
              Top 3 Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.total_top3_keywords}</div>
            <p className="text-xs text-gray-600 mt-1">Ranking in top 3 positions</p>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              Monthly Traffic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.total_top3_traffic.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">From top 3 rankings</p>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              Traffic Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(data.total_top3_value)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Monthly value</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Keywords */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Top Performing Keywords</CardTitle>
              <CardDescription>Keywords currently driving the most traffic and value</CardDescription>
            </div>
            {data.top_performers.length > 5 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllPerformers(!showAllPerformers)}
              >
                {showAllPerformers ? 'Show Less' : `Show All (${data.top_performers.length})`}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topPerformersToShow.map((performer, index) => (
              <div key={index} className="border rounded-lg">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleRow(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {expandedRows.has(index) ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                        <Badge className="bg-green-100 text-green-800">
                          #{performer.position}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium">{performer.keyword}</p>
                        {performer.intent && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {performer.intent}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="text-gray-600">Traffic</p>
                        <p className="font-semibold">{performer.traffic.toLocaleString()}/mo</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">Value</p>
                        <p className="font-semibold text-green-600">{formatCurrency(performer.value)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {expandedRows.has(index) && (
                  <div className="px-4 pb-4 bg-gray-50 border-t">
                    <div className="pt-3 space-y-2">
                      <p className="text-sm text-gray-600">
                        This keyword is performing exceptionally well at position {performer.position}.
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-600">Monthly searches: ~{Math.round(performer.traffic * 10)}</span>
                        <span className="text-gray-600">CTR: ~{(10 / performer.position).toFixed(1)}%</span>
                      </div>
                      <p className="text-sm text-blue-600 font-medium">
                        💡 Tip: Maintain fresh content and monitor competitors for this keyword.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Winning Patterns - Collapsible */}
      <Card>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setExpandedSection(expandedSection === 'patterns' ? null : 'patterns')}
        >
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-blue-600" />
                Winning Patterns & Insights
              </CardTitle>
              <CardDescription>What&apos;s working well for your rankings</CardDescription>
            </div>
            {expandedSection === 'patterns' ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </CardHeader>
        
        {expandedSection === 'patterns' && (
          <CardContent>
            <div className="space-y-4">
              {/* Dominant Intent */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Dominant Search Intent</p>
                  <p className="text-lg font-semibold text-blue-700 capitalize">
                    {data.winning_patterns.dominant_intent || 'Not specified'}
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              
              {/* Average Position */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Average Top Position</p>
                  <p className="text-lg font-semibold text-green-700">
                    {data.winning_patterns.average_position.toFixed(1)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              
              {/* Successful Themes */}
              {sortedThemes.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Successful Content Themes</h4>
                  <div className="space-y-2">
                    {sortedThemes.map(([theme, count]) => (
                      <div key={theme} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium capitalize">{theme}</span>
                        <Badge variant="secondary">{count} keywords</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Strategic Recommendations - Collapsible */}
      <Card>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setExpandedSection(expandedSection === 'recommendations' ? null : 'recommendations')}
        >
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Strategic Recommendations
              </CardTitle>
              <CardDescription>Action items to maintain and improve performance</CardDescription>
            </div>
            {expandedSection === 'recommendations' ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </CardHeader>
        
        {expandedSection === 'recommendations' && data.recommendations.length > 0 && (
          <CardContent>
            <div className="space-y-3">
              {data.recommendations.map((recommendation, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-yellow-700">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 flex-1">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}