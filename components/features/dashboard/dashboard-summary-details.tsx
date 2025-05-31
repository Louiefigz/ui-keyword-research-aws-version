'use client';

import { ProjectStats } from '@/types/api.types';

interface DistributionCardProps {
  label: string;
  count: number;
  color: 'blue' | 'green' | 'purple';
}

export function DistributionCard({ label, count, color }: DistributionCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
  };
  
  const labelColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-4 text-center`}>
      <div className="text-3xl font-bold mb-1">{count}</div>
      <div className={`text-xs ${labelColorClasses[color]} font-medium capitalize`}>
        {label.replace(/[-_]/g, ' ')}
      </div>
    </div>
  );
}

interface DashboardSummaryDetailsProps {
  stats: ProjectStats;
}

export function DashboardSummaryDetails({ stats }: DashboardSummaryDetailsProps) {
  const opportunityDistribution = stats.aggregations?.opportunityDistribution || {};
  const actionDistribution = stats.aggregations?.actionDistribution || {};
  const intentDistribution = stats.aggregations?.intentDistribution || {};

  return (
    <div className="p-6 space-y-8">
      {/* Opportunity Distribution */}
      {Object.keys(opportunityDistribution).length > 0 && (
        <div className="border-b pb-6 last:border-b-0">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
            Opportunity Distribution
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Object.entries(opportunityDistribution).map(([opportunity, count]) => (
              <DistributionCard key={opportunity} label={opportunity} count={count} color="blue" />
            ))}
          </div>
        </div>
      )}

      {/* Action Distribution */}
      {Object.keys(actionDistribution).length > 0 && (
        <div className="border-b pb-6 last:border-b-0">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
            Recommended Actions
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Object.entries(actionDistribution).map(([action, count]) => (
              <DistributionCard key={action} label={action} count={count} color="green" />
            ))}
          </div>
        </div>
      )}

      {/* Intent Distribution */}
      {intentDistribution && Object.keys(intentDistribution).length > 0 && (
        <div className="pb-6 last:pb-0">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
            Search Intent Distribution
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Object.entries(intentDistribution).map(([intent, count]) => (
              <DistributionCard key={intent} label={intent} count={count} color="purple" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}