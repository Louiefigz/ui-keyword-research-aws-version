'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Cluster } from '@/types';

interface OpportunityDonutChartProps {
  clusters: Cluster[];
}

export function OpportunityDonutChart({ clusters }: OpportunityDonutChartProps) {
  const data = [
    {
      name: 'High (70%+)',
      value: clusters.filter(c => c.metrics.opportunity_score >= 70).length,
      color: '#22c55e'
    },
    {
      name: 'Medium (40-69%)',
      value: clusters.filter(c => c.metrics.opportunity_score >= 40 && c.metrics.opportunity_score < 70).length,
      color: '#f59e0b'
    },
    {
      name: 'Low (<40%)',
      value: clusters.filter(c => c.metrics.opportunity_score < 40).length,
      color: '#94a3b8'
    }
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}