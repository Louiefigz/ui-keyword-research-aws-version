'use client';

import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-display';
import { Badge } from '@/components/ui/base';
import { Input } from '@/components/ui/forms';
import type { ClusterKeyword } from '@/types';
import { formatNumber } from '@/lib/utils/format';
import { getOpportunityBadgeVariant, getActionBadgeVariant, getIntentBadgeVariant } from '@/lib/utils';
import { mapOpportunityValue, mapActionValue, mapIntentValue } from '@/lib/utils/keyword-mappings';

interface ClusterKeywordsTableProps {
  keywords: ClusterKeyword[];
}

export function ClusterKeywordsTable({ keywords }: ClusterKeywordsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Ensure keywords is an array
  const keywordsArray = Array.isArray(keywords) ? keywords : [];

  const filteredKeywords = keywordsArray.filter(
    (kw) => kw.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<ClusterKeyword>[] = [
    {
      id: 'keyword',
      header: 'Keyword',
      accessor: 'keyword',
      cell: (value: unknown) => (
        <span className="font-medium">{value as string}</span>
      ),
    },
    {
      id: 'volume',
      header: 'Search Volume',
      accessor: 'volume',
      cell: (value: unknown) => formatNumber(value as number),
    },
    {
      id: 'kd',
      header: 'Difficulty',
      accessor: 'kd',
      cell: (value: unknown) => (
        <Badge variant={(value as number) <= 30 ? 'success' : (value as number) <= 60 ? 'warning' : 'destructive'}>
          {Math.round(value as number)}%
        </Badge>
      ),
    },
    {
      id: 'position',
      header: 'Position',
      accessor: 'position',
      cell: (value: unknown) => {
        const position = value as number | null;
        if (position === null || position === undefined) {
          return <span className="text-gray-400">-</span>;
        }
        return (
          <Badge variant={position <= 3 ? 'success' : position <= 10 ? 'warning' : 'secondary'}>
            #{position}
          </Badge>
        );
      },
    },
    {
      id: 'intent',
      header: 'Intent',
      accessor: 'intent',
      cell: (value: unknown) => {
        const mappedIntent = mapIntentValue(value as string);
        return <Badge variant={getIntentBadgeVariant(mappedIntent)}>{mappedIntent}</Badge>;
      },
    },
    {
      id: 'opportunity_category',
      header: 'Opportunity',
      accessor: 'opportunity_category',
      cell: (value: unknown) => {
        const mappedOpportunity = mapOpportunityValue(value as string);
        return <Badge variant={getOpportunityBadgeVariant(mappedOpportunity)}>{mappedOpportunity}</Badge>;
      },
    },
    {
      id: 'action',
      header: 'Action',
      accessor: 'action',
      cell: (value: unknown) => {
        const mappedAction = mapActionValue(value as string);
        return <Badge variant={getActionBadgeVariant(mappedAction)}>{mappedAction}</Badge>;
      },
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Keywords in Cluster ({keywordsArray.length})</h3>
        <Input
          placeholder="Search keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
      </div>

      {keywordsArray.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No keywords found in this cluster
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredKeywords}
        />
      )}
    </div>
  );
}