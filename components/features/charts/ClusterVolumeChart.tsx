'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Cluster } from '@/types';

interface ClusterVolumeChartProps {
  clusters: Cluster[];
}

export function ClusterVolumeChart({ clusters }: ClusterVolumeChartProps) {
  const data = clusters
    .slice(0, 10) // Show top 10 clusters
    .map(cluster => ({
      name: cluster.name.length > 20 ? cluster.name.substring(0, 20) + '...' : cluster.name,
      volume: cluster.metrics.total_search_volume,
      score: cluster.metrics.opportunity_score
    }))
    .sort((a, b) => b.volume - a.volume);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => value.toLocaleString()}
            labelFormatter={(label) => `Cluster: ${label}`}
          />
          <Bar 
            dataKey="volume" 
            fill="#3b82f6"
            name="Search Volume"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}