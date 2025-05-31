'use client';

import { ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@/components/ui/data-display/data-table';
import { Badge } from '@/components/ui/base/badge';
import { DashboardKeyword } from '@/types/api/dashboard.types';
import { getOpportunityBadge, getActionBadge, getIntentBadge } from '@/lib/utils/badge-components';

type Keyword = DashboardKeyword;

interface ColumnOptions {
  onKeywordClick?: (keyword: Keyword) => void;
  onSortChange: (field: string) => void;
}

export function createKeywordTableColumns({ onKeywordClick, onSortChange }: ColumnOptions): ColumnDef<Keyword>[] {
  return [
    {
      id: 'keyword',
      header: 'Keyword',
      accessor: 'keyword',
      sortable: true,
      width: '300px',
      cell: (value: unknown, row: Keyword) => (
        <div>
          <div className="font-medium cursor-pointer hover:text-blue-600" onClick={() => onKeywordClick?.(row)}>
            {value as string}
          </div>
          <div className="text-xs text-gray-500">
            {row.url}
          </div>
        </div>
      )
    },
    {
      id: 'search_volume',
      header: (
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => onSortChange('volume')}>
          Volume <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      accessor: (row: Keyword) => row.volume,
      cell: (value: unknown) => value != null ? (value as number).toLocaleString() : '0',
      align: 'right'
    },
    {
      id: 'keyword_difficulty',
      header: (
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => onSortChange('kd')}>
          KD <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      accessor: (row: Keyword) => row.kd,
      cell: (value: unknown) => value != null ? `${value as number}%` : '0%',
      align: 'right'
    },
    {
      id: 'cpc',
      header: (
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => onSortChange('cpc')}>
          CPC <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      accessor: (row: Keyword) => row.cpc,
      cell: (value: unknown) => (
        <span className="text-green-600 font-medium">
          ${value != null ? (value as number).toFixed(2) : '0.00'}
        </span>
      ),
      align: 'right'
    },
    {
      id: 'position',
      header: (
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => onSortChange('position')}>
          Position <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      accessor: (row: Keyword) => row.position,
      cell: (value: unknown) => {
        const position = value as number | null;
        if (position === null || position === undefined) {
          return (
            <Badge className="bg-gray-100 text-gray-800 text-xs font-medium">
              -
            </Badge>
          );
        }
        return (
          <Badge className={`${position <= 3 ? 'bg-green-100 text-green-800' : position <= 10 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'} text-xs font-medium`}>
            #{position}
          </Badge>
        );
      },
      align: 'center'
    },
    {
      id: 'intent',
      header: 'Intent',
      accessor: (row: Keyword) => row.intent,
      cell: (value: unknown) => getIntentBadge(value as string)
    },
    {
      id: 'relevance_score',
      header: (
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => onSortChange('relevance_score')}>
          Relevance <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      accessor: (row: Keyword) => row.relevance_score,
      cell: (value: unknown) => (
        <Badge className="bg-green-100 text-green-800 text-xs font-semibold">
          {value != null ? Math.round(value as number) : 0}
        </Badge>
      ),
      align: 'center'
    },
    {
      id: 'cluster',
      header: 'Cluster',
      accessor: (row: Keyword) => row.cluster_name,
      cell: (value: unknown) => {
        const clusterName = value as string;
        return clusterName ? (
          <div className="text-sm font-medium text-blue-600">{clusterName}</div>
        ) : (
          <span className="text-gray-400 text-sm">No cluster</span>
        );
      }
    },
    {
      id: 'opportunity_level',
      header: 'Opportunity',
      accessor: (row: Keyword) => row.opportunity_type,
      cell: (value: unknown) => getOpportunityBadge(value as string),
      align: 'center'
    },
    {
      id: 'keyword_type',
      header: 'Type',
      accessor: (row: Keyword) => {
        if (row.is_primary_keyword) return 'primary';
        if (row.is_secondary_keyword) return 'secondary';
        return 'none';
      },
      cell: (value: unknown) => {
        const type = value as string;
        if (type === 'primary') {
          return <Badge className="bg-purple-100 text-purple-800 text-xs">Primary</Badge>;
        }
        if (type === 'secondary') {
          return <Badge className="bg-blue-100 text-blue-800 text-xs">Secondary</Badge>;
        }
        return <span className="text-gray-400 text-xs">-</span>;
      },
      align: 'center'
    },
    {
      id: 'recommended_action',
      header: 'Action',
      accessor: (row: Keyword) => row.action,
      cell: (value: unknown) => getActionBadge(value as string),
      align: 'center'
    }
  ];
}