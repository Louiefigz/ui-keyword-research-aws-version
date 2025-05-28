'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Cluster } from '@/types';

interface OpportunityDonutChartProps {
  clusters: Cluster[];
}

export function OpportunityDonutChart({ clusters }: OpportunityDonutChartProps) {
  const data = [
    {
      name: 'Easy (<30%)',
      value: clusters.filter(c => c.avg_difficulty < 30).length,
      color: '#22c55e'
    },
    {
      name: 'Medium (30-60%)',
      value: clusters.filter(c => c.avg_difficulty >= 30 && c.avg_difficulty < 60).length,
      color: '#f59e0b'
    },
    {
      name: 'Hard (60%+)',
      value: clusters.filter(c => c.avg_difficulty >= 60).length,
      color: '#ef4444'
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