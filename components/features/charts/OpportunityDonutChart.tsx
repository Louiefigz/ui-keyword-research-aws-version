'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Cluster } from '@/types';
import { getDifficultyColor } from '@/lib/utils';

interface OpportunityDonutChartProps {
  clusters: Cluster[];
}

export function OpportunityDonutChart({ clusters }: OpportunityDonutChartProps) {
  const data = [
    {
      name: 'Easy (<30%)',
      value: clusters.filter(c => c.avg_difficulty < 30).length,
      color: getDifficultyColor(20) // representative easy value
    },
    {
      name: 'Medium (30-60%)',
      value: clusters.filter(c => c.avg_difficulty >= 30 && c.avg_difficulty < 60).length,
      color: getDifficultyColor(50) // representative medium value
    },
    {
      name: 'Hard (60%+)',
      value: clusters.filter(c => c.avg_difficulty >= 60).length,
      color: getDifficultyColor(80) // representative hard value
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