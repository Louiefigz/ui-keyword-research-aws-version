'use client';

import { memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/data-display/card';
import { chartConfig } from '@/lib/utils/strategic-advice-utils';
import { formatCurrency } from '@/lib/utils/format';

interface InvestmentCategory {
  category: string;
  amount: number;
  percentage: number;
  description: string;
}

interface InvestmentBreakdownProps {
  categories: InvestmentCategory[];
  totalInvestment: number;
}

function InvestmentBreakdownComponent({ categories, totalInvestment }: InvestmentBreakdownProps) {
  const chartData = categories.map((cat, index) => ({
    name: cat.category,
    value: cat.amount,
    percentage: cat.percentage,
    color: chartConfig.getChartColor(index)
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.value)} ({data.payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label for small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Breakdown</CardTitle>
        <CardDescription>
          Total investment: {formatCurrency(totalInvestment)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pie Chart */}
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={100}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={chartConfig.CHART_ANIMATION_DURATION}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Details */}
          <div className="space-y-3">
            {categories.map((category, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div 
                  className="w-4 h-4 rounded-full mt-0.5" 
                  style={{ backgroundColor: chartConfig.getChartColor(index) }}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{category.category}</h4>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(category.amount)}</p>
                      <p className="text-sm text-muted-foreground">{category.percentage}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const InvestmentBreakdown = memo(InvestmentBreakdownComponent);
