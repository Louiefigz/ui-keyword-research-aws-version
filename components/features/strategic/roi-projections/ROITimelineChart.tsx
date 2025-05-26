'use client';

import { memo } from 'react';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { chartConfig } from '@/lib/utils/strategic-advice-utils';
import { formatCurrency } from '@/lib/utils/format';

interface ChartDataPoint {
  month: string;
  investment: number;
  revenue: number;
  cumulativeROI: number;
}

interface ROITimelineChartProps {
  data: ChartDataPoint[];
  scenario: 'best' | 'expected' | 'worst';
}

function ROITimelineChartComponent({ data, scenario }: ROITimelineChartProps) {
  const formatTooltipContent = (value: number, name: string) => {
    if (name === 'Cumulative ROI') return `${value.toFixed(1)}%`;
    return formatCurrency(value);
  };

  const scenarioColors = {
    best: {
      investment: '#ef4444', // red
      revenue: '#10b981', // green
      roi: '#3b82f6', // blue
    },
    expected: {
      investment: '#f59e0b', // amber
      revenue: '#10b981', // green
      roi: '#3b82f6', // blue
    },
    worst: {
      investment: '#ef4444', // red
      revenue: '#f59e0b', // amber
      roi: '#6366f1', // indigo
    }
  };

  const colors = scenarioColors[scenario];

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            {...chartConfig.commonAxisProps}
          />
          <YAxis 
            yAxisId="left"
            {...chartConfig.commonAxisProps}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            {...chartConfig.commonAxisProps}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={formatTooltipContent}
            {...chartConfig.tooltipStyles}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
          />
          <Bar 
            yAxisId="left"
            dataKey="investment" 
            name="Investment" 
            fill={colors.investment}
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            yAxisId="left"
            dataKey="revenue" 
            name="Revenue" 
            fill={colors.revenue}
            radius={[4, 4, 0, 0]}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="cumulativeROI" 
            name="Cumulative ROI" 
            stroke={colors.roi}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export const ROITimelineChart = memo(ROITimelineChartComponent);