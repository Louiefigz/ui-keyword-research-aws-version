'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import type { OpportunityItem } from '@/types';

interface EffortImpactMatrixProps {
  opportunities: OpportunityItem[];
}

export function EffortImpactMatrix({ opportunities }: EffortImpactMatrixProps) {
  // Transform opportunities to chart data
  const chartData = opportunities.map(opp => ({
    id: opp.id,
    name: opp.title,
    x: opp.difficulty, // effort/difficulty on X axis
    y: opp.impact_score, // impact on Y axis
    value: parseFloat(opp.estimated_value.replace(/[^0-9.-]+/g, '')),
    type: opp.type
  }));

  const getQuadrantColor = (effort: number, impact: number) => {
    if (effort <= 50 && impact >= 50) return '#22c55e'; // Low effort, high impact (green) - Quick wins
    if (effort > 50 && impact >= 50) return '#f59e0b'; // High effort, high impact (amber) - Strategic
    if (effort <= 50 && impact < 50) return '#94a3b8'; // Low effort, low impact (gray) - Fill-ins
    return '#ef4444'; // High effort, low impact (red) - Avoid
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-medium text-sm">{data.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Effort: {data.x}/100 • Impact: {data.y}/100
          </p>
          <p className="text-xs font-medium text-green-600 mt-1">
            Value: ${data.value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="relative h-[400px] bg-gray-50 rounded-lg p-4">
        {/* Quadrant Labels */}
        <div className="absolute top-2 left-2 z-10">
          <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
            Quick Wins
          </span>
        </div>
        <div className="absolute top-2 right-2 z-10">
          <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded">
            Strategic Initiatives
          </span>
        </div>
        <div className="absolute bottom-2 left-2 z-10">
          <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
            Fill-ins
          </span>
        </div>
        <div className="absolute bottom-2 right-2 z-10">
          <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded">
            Consider Carefully
          </span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number"
              dataKey="x" 
              name="Effort"
              domain={[0, 100]}
              label={{ value: 'Effort Required →', position: 'insideBottom', offset: -20 }}
            />
            <YAxis 
              type="number"
              dataKey="y" 
              name="Impact"
              domain={[0, 100]}
              label={{ value: 'Potential Impact →', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference lines to divide quadrants */}
            <ReferenceLine x={50} stroke="#e5e7eb" strokeDasharray="5 5" />
            <ReferenceLine y={50} stroke="#e5e7eb" strokeDasharray="5 5" />
            
            <Scatter name="Opportunities" data={chartData}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getQuadrantColor(entry.x, entry.y)}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span>Quick Wins (Low effort, High impact)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500" />
          <span>Strategic (High effort, High impact)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-400" />
          <span>Fill-ins (Low effort, Low impact)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span>Reconsider (High effort, Low impact)</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-700">Quick Wins</p>
          <p className="text-2xl font-bold text-green-900">
            {chartData.filter(d => d.x <= 50 && d.y >= 50).length}
          </p>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm font-medium text-amber-700">Strategic</p>
          <p className="text-2xl font-bold text-amber-900">
            {chartData.filter(d => d.x > 50 && d.y >= 50).length}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700">Fill-ins</p>
          <p className="text-2xl font-bold text-gray-900">
            {chartData.filter(d => d.x <= 50 && d.y < 50).length}
          </p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm font-medium text-red-700">Reconsider</p>
          <p className="text-2xl font-bold text-red-900">
            {chartData.filter(d => d.x > 50 && d.y < 50).length}
          </p>
        </div>
      </div>
    </div>
  );
}