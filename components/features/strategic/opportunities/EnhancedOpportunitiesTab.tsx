'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base/badge';
import { Button } from '@/components/ui/base/button';
import { Select } from '@/components/ui/forms/select';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  ArrowRight, 
  Download, 
  Filter, 
  Brain,
  Zap,
  AlertCircle
} from 'lucide-react';
import { EnhancedOpportunityCard } from './EnhancedOpportunityCard';
import { EffortImpactMatrix } from './EffortImpactMatrix';
import type { OpportunityItem, AIEnhancedOpportunity } from '@/types/api/strategic.types';

interface EnhancedOpportunitiesTabProps {
  opportunities: (OpportunityItem | AIEnhancedOpportunity)[];
  businessContext?: string;
}

// Type guard to check if opportunity is AI-enhanced
function isAIEnhanced(opportunity: any): opportunity is AIEnhancedOpportunity {
  return 'ai_recommendations' in opportunity && 'insight_type' in opportunity;
}

// Type guard to check if opportunity is legacy
function isLegacy(opportunity: any): opportunity is OpportunityItem {
  return 'type' in opportunity && !('ai_recommendations' in opportunity);
}

export function EnhancedOpportunitiesTab({ 
  opportunities, 
  businessContext 
}: EnhancedOpportunitiesTabProps) {
  const [filter, setFilter] = useState<'all' | 'ai_enhanced' | 'quick_wins' | 'high_priority' | 'medium_priority' | 'low_priority'>('all');
  const [showMatrix, setShowMatrix] = useState(false);

  // Separate AI-enhanced and legacy opportunities
  const aiOpportunities = opportunities.filter(isAIEnhanced);
  const legacyOpportunities = opportunities.filter(isLegacy);
  
  // Categorize AI opportunities by priority
  const highPriorityAI = aiOpportunities.filter(opp => {
    const priority = typeof opp.implementation_priority === 'object' 
      ? opp.implementation_priority.level 
      : opp.implementation_priority;
    return priority === 'high';
  });
  
  const mediumPriorityAI = aiOpportunities.filter(opp => {
    const priority = typeof opp.implementation_priority === 'object' 
      ? opp.implementation_priority.level 
      : opp.implementation_priority;
    return priority === 'medium';
  });
  
  const lowPriorityAI = aiOpportunities.filter(opp => {
    const priority = typeof opp.implementation_priority === 'object' 
      ? opp.implementation_priority.level 
      : opp.implementation_priority;
    return priority === 'low';
  });

  // Legacy categorization
  const quickWins = legacyOpportunities.filter(opp => opp.type === 'quick_wins');
  const contentGaps = legacyOpportunities.filter(opp => opp.type === 'content_gaps');
  const technical = legacyOpportunities.filter(opp => opp.type === 'technical');
  const competitive = legacyOpportunities.filter(opp => opp.type === 'competitive');

  // Filter opportunities based on selected filter
  const getFilteredOpportunities = () => {
    switch (filter) {
      case 'ai_enhanced':
        return aiOpportunities;
      case 'high_priority':
        return highPriorityAI;
      case 'medium_priority':
        return mediumPriorityAI;
      case 'low_priority':
        return lowPriorityAI;
      case 'quick_wins':
        return quickWins;
      default:
        return opportunities;
    }
  };

  const filteredOpportunities = getFilteredOpportunities();

  // Calculate total value (handle both formats)
  const totalValue = opportunities.reduce((sum, opp) => {
    if (isLegacy(opp)) {
      const value = parseFloat(opp.estimated_value.replace(/[^0-9.-]+/g, ''));
      return sum + value;
    } else if (isAIEnhanced(opp)) {
      // Estimate value from expected traffic (rough calculation)
      const estimatedValue = opp.success_metrics.expected_total_traffic * 2; // $2 per visitor estimate
      return sum + estimatedValue;
    }
    return sum;
  }, 0);

  const handleExport = () => {
    // Create CSV content for both formats
    const headers = ['Title/Keyword', 'Type/Priority', 'Impact', 'Value', 'AI Enhanced'];
    const rows = filteredOpportunities.map(opp => {
      if (isLegacy(opp)) {
        return [
          opp.title,
          opp.type,
          opp.impact_score,
          opp.estimated_value,
          'No'
        ];
      } else {
        const priority = typeof opp.implementation_priority === 'object' 
          ? opp.implementation_priority.level 
          : opp.implementation_priority;
        return [
          opp.keyword,
          `${priority} priority`,
          opp.success_metrics.traffic_multiplier,
          `$${opp.success_metrics.expected_total_traffic * 2}`,
          'Yes'
        ];
      }
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enhanced-opportunities-${filter}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">AI-Enhanced Opportunity Analysis</h2>
          <p className="text-muted-foreground">
            Total opportunity value: ${Math.round(totalValue).toLocaleString()} 
            {aiOpportunities.length > 0 && (
              <span className="ml-2 text-blue-600">
                • {aiOpportunities.length} AI-enhanced insights
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as typeof filter)}
          >
            <option value="all">All Opportunities</option>
            {aiOpportunities.length > 0 && (
              <>
                <option value="ai_enhanced">AI Enhanced Only</option>
                <option value="high_priority">High Priority AI</option>
                <option value="medium_priority">Medium Priority AI</option>
                <option value="low_priority">Low Priority AI</option>
              </>
            )}
            {legacyOpportunities.length > 0 && (
              <option value="quick_wins">Quick Wins (Legacy)</option>
            )}
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMatrix(!showMatrix)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showMatrix ? 'Hide' : 'Show'} Matrix
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-600" />
              AI Enhanced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{aiOpportunities.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-red-600" />
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highPriorityAI.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              Quick Wins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{quickWins.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${Math.round(totalValue).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Enhancement Notice */}
      {aiOpportunities.length > 0 && businessContext && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">AI-Enhanced Analysis</h4>
                <p className="text-sm text-blue-800">
                  These opportunities have been analyzed by AI and include specific, actionable 
                  recommendations tailored to your business: {businessContext}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Effort vs Impact Matrix (for legacy opportunities) */}
      {showMatrix && legacyOpportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Effort vs Impact Analysis (Legacy Data)</CardTitle>
          </CardHeader>
          <CardContent>
            <EffortImpactMatrix opportunities={legacyOpportunities} />
          </CardContent>
        </Card>
      )}

      {/* Filtered Display */}
      {filter !== 'all' ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold capitalize">
              {filter.replace('_', ' ')} Opportunities
            </h3>
            <Badge variant="secondary">
              {filteredOpportunities.length} items
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredOpportunities.map((opportunity, index) => (
              <EnhancedOpportunityCard 
                key={isLegacy(opportunity) ? opportunity.id : `ai_${index}`}
                opportunity={opportunity} 
                businessContext={businessContext}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* High Priority AI Opportunities */}
          {highPriorityAI.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold">High Priority AI Opportunities</h3>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <Brain className="h-3 w-3 mr-1" />
                  Immediate action required
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {highPriorityAI.map((opportunity, index) => (
                  <EnhancedOpportunityCard 
                    key={`high_${index}`}
                    opportunity={opportunity} 
                    businessContext={businessContext}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Medium Priority AI Opportunities */}
          {mediumPriorityAI.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-semibold">Medium Priority AI Opportunities</h3>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Brain className="h-3 w-3 mr-1" />
                  Plan for next sprint
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {mediumPriorityAI.map((opportunity, index) => (
                  <EnhancedOpportunityCard 
                    key={`medium_${index}`}
                    opportunity={opportunity} 
                    businessContext={businessContext}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quick Wins Section (Legacy) */}
          {quickWins.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Quick Wins</h3>
                <Badge variant="secondary" className="bg-green-100">
                  Low effort, high impact
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {quickWins.map(opportunity => (
                  <EnhancedOpportunityCard 
                    key={opportunity.id} 
                    opportunity={opportunity}
                    businessContext={businessContext}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Low Priority AI Opportunities */}
          {lowPriorityAI.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Low Priority AI Opportunities</h3>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Brain className="h-3 w-3 mr-1" />
                  Future consideration
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {lowPriorityAI.map((opportunity, index) => (
                  <EnhancedOpportunityCard 
                    key={`low_${index}`}
                    opportunity={opportunity} 
                    businessContext={businessContext}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Legacy Content Gaps, Technical, and Competitive sections */}
          {contentGaps.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold">Content Gaps</h3>
                <Badge variant="secondary" className="bg-orange-100">
                  Missing content opportunities
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {contentGaps.map(opportunity => (
                  <EnhancedOpportunityCard 
                    key={opportunity.id} 
                    opportunity={opportunity}
                    businessContext={businessContext}
                  />
                ))}
              </div>
            </div>
          )}

          {technical.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Technical Opportunities</h3>
                <Badge variant="secondary" className="bg-blue-100">
                  Site improvements
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {technical.map(opportunity => (
                  <EnhancedOpportunityCard 
                    key={opportunity.id} 
                    opportunity={opportunity}
                    businessContext={businessContext}
                  />
                ))}
              </div>
            </div>
          )}

          {competitive.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Competitive Opportunities</h3>
                <Badge variant="secondary" className="bg-purple-100">
                  Competitor gaps
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {competitive.map(opportunity => (
                  <EnhancedOpportunityCard 
                    key={opportunity.id} 
                    opportunity={opportunity}
                    businessContext={businessContext}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}