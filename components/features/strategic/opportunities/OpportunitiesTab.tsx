'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base';
import { Button } from '@/components/ui/base';
import { Select } from '@/components/ui/forms';
import { TrendingUp, DollarSign, Target, ArrowRight, Download, Filter } from 'lucide-react';
import { OpportunityCard } from './OpportunityCard';
import { EffortImpactMatrix } from './EffortImpactMatrix';
import type { OpportunityItem } from '@/types';

interface OpportunitiesTabProps {
  opportunities: OpportunityItem[];
}

export function OpportunitiesTab({ opportunities }: OpportunitiesTabProps) {
  const [filter, setFilter] = useState<'all' | 'quick_wins' | 'content_gaps' | 'technical' | 'competitive'>('all');
  const [showMatrix, setShowMatrix] = useState(false);
  const quickWins = opportunities.filter(opp => opp.type === 'quick_wins');
  const contentGaps = opportunities.filter(opp => opp.type === 'content_gaps');
  const technical = opportunities.filter(opp => opp.type === 'technical');
  const competitive = opportunities.filter(opp => opp.type === 'competitive');

  const filteredOpportunities = filter === 'all' 
    ? opportunities 
    : opportunities.filter(opp => opp.type === filter);

  const totalValue = opportunities.reduce((sum, opp) => {
    const value = parseFloat(opp.estimated_value.replace(/[^0-9.-]+/g, ''));
    return sum + value;
  }, 0);

  const handleExport = () => {
    // Create CSV content
    const headers = ['Title', 'Type', 'Impact Score', 'Difficulty', 'Estimated Value', 'Timeline'];
    const rows = filteredOpportunities.map(opp => [
      opp.title,
      opp.type,
      opp.impact_score,
      opp.difficulty,
      opp.estimated_value,
      opp.timeline
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `opportunities-${filter}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Opportunity Analysis</h2>
          <p className="text-muted-foreground">
            Total opportunity value: ${totalValue.toLocaleString()}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as typeof filter)}
          >
            <option value="all">All Opportunities</option>
            <option value="quick_wins">Quick Wins Only</option>
            <option value="content_gaps">Content Gaps Only</option>
            <option value="technical">Technical Only</option>
            <option value="competitive">Competitive Only</option>
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunities.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quick Wins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{quickWins.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Content Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{contentGaps.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Effort vs Impact Matrix */}
      {showMatrix && (
        <Card>
          <CardHeader>
            <CardTitle>Effort vs Impact Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <EffortImpactMatrix opportunities={filteredOpportunities} />
          </CardContent>
        </Card>
      )}

      {/* Filtered Opportunities Display */}
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
            {filteredOpportunities.map(opportunity => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Quick Wins Section */}
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
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </div>
      )}

      {/* Content Gaps Section */}
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
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </div>
      )}

      {/* Technical Opportunities Section */}
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
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </div>
      )}

          {/* Competitive Opportunities Section */}
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
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}