'use client';

import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-display';
import { Badge } from '@/components/ui/base';
import { Input } from '@/components/ui/forms';
import type { KeywordInCluster } from '@/types';
import { formatNumber } from '@/utils/format';

interface ClusterKeywordsTableProps {
  keywords: KeywordInCluster[];
}

export function ClusterKeywordsTable({ keywords }: ClusterKeywordsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredKeywords = keywords.filter(
    (kw) => kw.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'primary': return 'default';
      case 'secondary': return 'secondary';
      case 'supporting': return 'outline';
      default: return 'outline';
    }
  };

  const getOpportunityBadgeVariant = (score: number) => {
    if (score >= 70) return 'success';
    if (score >= 40) return 'warning';
    return 'secondary';
  };

  const columns: Column<KeywordInCluster>[] = [
    {
      id: 'keyword',
      header: 'Keyword',
      accessor: 'keyword',
      cell: (value: string) => (
        <span className="font-medium">{value}</span>
      ),
    },
    {
      id: 'search_volume',
      header: 'Search Volume',
      accessor: 'search_volume',
      cell: (value: number) => formatNumber(value),
    },
    {
      id: 'opportunity_score',
      header: 'Opportunity Score',
      accessor: 'opportunity_score',
      cell: (value: number) => (
        <Badge variant={getOpportunityBadgeVariant(value)}>
          {value}%
        </Badge>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      accessor: 'role',
      cell: (value: string) => (
        <Badge variant={getRoleBadgeVariant(value)}>
          {value}
        </Badge>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Keywords in Cluster</h3>
        <Input
          placeholder="Search keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredKeywords}
      />
    </div>
  );
}