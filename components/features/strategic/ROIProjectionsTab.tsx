'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base';
import { Select } from '@/components/ui/forms';
import { TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';
import { ROIChart } from './ROIChart';
import type { ROIProjection } from '@/types';

interface ROIProjectionsTabProps {
  projections: ROIProjection[];
}

export function ROIProjectionsTab({ projections }: ROIProjectionsTabProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'3_months' | '6_months' | '12_months'>('6_months');
  
  const currentProjection = projections.find(p => p.timeframe === selectedTimeframe) || projections[0];

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Timeframe Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">ROI Projections</h2>
          <p className="text-muted-foreground">
            Expected return on investment based on strategic recommendations
          </p>
        </div>
        <Select
          value={selectedTimeframe}
          onValueChange={(value) => setSelectedTimeframe(value as typeof selectedTimeframe)}
        >
          <option value="3_months">3 Months</option>
          <option value="6_months">6 Months</option>
          <option value="12_months">12 Months</option>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Investment Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${currentProjection.investment_required.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projected Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${currentProjection.projected_revenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ROI Percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {currentProjection.roi_percentage}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confidence Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold capitalize ${getConfidenceColor(currentProjection.confidence_level)}`}>
              {currentProjection.confidence_level}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROI Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Growth Projection</CardTitle>
          <CardDescription>
            Expected revenue growth over the selected timeframe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ROIChart projections={projections} selectedTimeframe={selectedTimeframe} />
        </CardContent>
      </Card>

      {/* Detailed Projections */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Traffic & Conversion Projections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Projected Traffic</span>
              </div>
              <span className="font-bold">
                {currentProjection.projected_traffic.toLocaleString()} visits/mo
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="font-medium">Projected Conversions</span>
              </div>
              <span className="font-bold">
                {currentProjection.projected_conversions.toLocaleString()} conversions/mo
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Avg. Conversion Value</span>
              </div>
              <span className="font-bold">
                ${Math.round(currentProjection.projected_revenue / currentProjection.projected_conversions).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Assumptions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {currentProjection.key_assumptions.map((assumption, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm">{assumption}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Timeframe Comparison</CardTitle>
          <CardDescription>
            Compare ROI projections across different timeframes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Timeframe</th>
                  <th className="text-right py-2">Investment</th>
                  <th className="text-right py-2">Revenue</th>
                  <th className="text-right py-2">Net Profit</th>
                  <th className="text-right py-2">ROI %</th>
                  <th className="text-center py-2">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((projection) => (
                  <tr key={projection.timeframe} className="border-b">
                    <td className="py-3 font-medium">
                      {projection.timeframe.replace('_', ' ')}
                    </td>
                    <td className="text-right py-3">
                      ${projection.investment_required.toLocaleString()}
                    </td>
                    <td className="text-right py-3 text-green-600">
                      ${projection.projected_revenue.toLocaleString()}
                    </td>
                    <td className="text-right py-3 font-semibold">
                      ${(projection.projected_revenue - projection.investment_required).toLocaleString()}
                    </td>
                    <td className="text-right py-3 font-bold text-primary">
                      {projection.roi_percentage}%
                    </td>
                    <td className="text-center py-3">
                      <Badge 
                        variant={projection.confidence_level === 'high' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {projection.confidence_level}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}