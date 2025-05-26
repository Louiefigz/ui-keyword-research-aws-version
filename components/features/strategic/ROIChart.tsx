'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import type { ROIProjection } from '@/types';

interface ROIChartProps {
  projections: ROIProjection[];
  selectedTimeframe: '3_months' | '6_months' | '12_months';
}

export function ROIChart({ projections, selectedTimeframe }: ROIChartProps) {
  const currentProjection = projections.find(p => p.timeframe === selectedTimeframe) || projections[0];
  
  // Generate monthly data points
  const months = selectedTimeframe === '3_months' ? 3 : selectedTimeframe === '6_months' ? 6 : 12;
  const monthlyData = Array.from({ length: months }, (_, i) => {
    const month = i + 1;
    const progress = month / months;
    
    return {
      month: `Month ${month}`,
      investment: Math.round(currentProjection.investment_required * progress),
      revenue: Math.round(currentProjection.projected_revenue * Math.pow(progress, 1.2)), // Exponential growth
      roi: Math.round(
        ((currentProjection.projected_revenue * Math.pow(progress, 1.2) - currentProjection.investment_required * progress) / 
        (currentProjection.investment_required * progress)) * 100
      ),
      traffic: Math.round(currentProjection.projected_traffic * progress),
      conversions: Math.round(currentProjection.projected_conversions * progress)
    };
  });

  return (
    <div className="space-y-6">
      {/* Revenue vs Investment Chart */}
      <div>
        <h4 className="text-sm font-medium mb-4">Revenue vs Investment Over Time</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="investment" 
                fill="#94a3b8" 
                name="Investment"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                stroke="#22c55e" 
                strokeWidth={2}
                name="Revenue"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="roi" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="ROI %"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traffic & Conversions Chart */}
      <div>
        <h4 className="text-sm font-medium mb-4">Traffic & Conversion Growth</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => value.toLocaleString()} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="traffic" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Monthly Traffic"
              />
              <Line 
                type="monotone" 
                dataKey="conversions" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Monthly Conversions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Break-even Analysis */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Break-even Analysis</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Break-even Point:</span>
            <span className="font-semibold ml-2">
              Month {monthlyData.findIndex(d => d.revenue >= d.investment) + 1 || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Total Profit:</span>
            <span className="font-semibold ml-2 text-green-600">
              ${(currentProjection.projected_revenue - currentProjection.investment_required).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}