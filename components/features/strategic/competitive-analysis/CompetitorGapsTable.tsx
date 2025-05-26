'use client';

import { Badge } from '@/components/ui/base/badge';
import { Button } from '@/components/ui/base/button';
import { ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/data-display/table';
import { formatNumber, formatCurrency } from '@/lib/utils/format';

export interface CompetitorGap {
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

interface CompetitorGapsTableProps {
  gaps: CompetitorGap[];
  selectedCompetitor: string;
  onSort: (field: 'opportunity_score' | 'volume' | 'estimated_value') => void;
  sortBy: 'opportunity_score' | 'volume' | 'estimated_value';
}

export function CompetitorGapsTable({ 
  gaps, 
  selectedCompetitor, 
  onSort, 
  sortBy 
}: CompetitorGapsTableProps) {
  // Filter gaps based on selected competitor
  const filteredGaps = selectedCompetitor === 'all' 
    ? gaps 
    : gaps.filter(gap => 
        Object.keys(gap.competitor_positions).includes(selectedCompetitor)
      );

  // Sort gaps
  const sortedGaps = [...filteredGaps].sort((a, b) => {
    switch (sortBy) {
      case 'opportunity_score':
        return b.opportunity_score - a.opportunity_score;
      case 'volume':
        return b.metrics.volume - a.metrics.volume;
      case 'estimated_value':
        return b.estimated_value - a.estimated_value;
      default:
        return 0;
    }
  });

  const getOpportunityBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "success" => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'default';
    if (score >= 40) return 'secondary';
    return 'destructive';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Keyword</TableHead>
          <TableHead>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSort('volume')}
              className="h-auto p-0 font-medium"
            >
              Volume
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>CPC</TableHead>
          <TableHead>Competitor Positions</TableHead>
          <TableHead>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSort('opportunity_score')}
              className="h-auto p-0 font-medium"
            >
              Opportunity
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead className="text-right">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSort('estimated_value')}
              className="h-auto p-0 font-medium"
            >
              Est. Value
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedGaps.map((gap, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{gap.keyword}</TableCell>
            <TableCell>{formatNumber(gap.metrics.volume)}</TableCell>
            <TableCell>{gap.metrics.difficulty}</TableCell>
            <TableCell>{formatCurrency(gap.metrics.cpc)}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {Object.entries(gap.competitor_positions).map(([competitor, position]) => (
                  <Badge key={competitor} variant="secondary" className="text-xs">
                    {competitor}: #{position}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={getOpportunityBadgeVariant(gap.opportunity_score)}>
                {gap.opportunity} ({gap.opportunity_score})
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(gap.estimated_value)}/mo
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}