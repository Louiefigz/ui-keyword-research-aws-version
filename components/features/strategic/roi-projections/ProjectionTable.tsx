'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/data-display/card';
import { Button } from '@/components/ui/base/button';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils/format';
import { exportUtils } from '@/lib/utils/strategic-advice-utils';

interface MonthlyProjection {
  month: string;
  investment: number;
  traffic: number;
  conversions: number;
  revenue: number;
  cumulativeRevenue: number;
  roi: number;
  notes?: string;
}

interface ProjectionTableProps {
  projections: MonthlyProjection[];
  scenario: 'best' | 'expected' | 'worst';
}

export function ProjectionTable({ projections, scenario }: ProjectionTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const handleExport = () => {
    const exportData = projections.map(proj => ({
      Month: proj.month,
      Investment: proj.investment,
      'Traffic (visits)': proj.traffic,
      Conversions: proj.conversions,
      Revenue: proj.revenue,
      'Cumulative Revenue': proj.cumulativeRevenue,
      'ROI %': proj.roi,
      Notes: proj.notes || ''
    }));
    
    exportUtils.exportToCSV(exportData, `roi-projections-${scenario}-case`);
  };

  const getROIColor = (roi: number) => {
    if (roi >= 100) return 'text-green-600';
    if (roi >= 50) return 'text-blue-600';
    if (roi >= 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Month-by-Month Projections</CardTitle>
            <CardDescription>
              Detailed breakdown of expected performance ({scenario} case scenario)
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Month</th>
                <th className="text-right py-3 px-2">Investment</th>
                <th className="text-right py-3 px-2">Traffic</th>
                <th className="text-right py-3 px-2">Conversions</th>
                <th className="text-right py-3 px-2">Revenue</th>
                <th className="text-right py-3 px-2">Cumulative</th>
                <th className="text-right py-3 px-2">ROI %</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {projections.map((projection, index) => (
                <React.Fragment key={index}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{projection.month}</td>
                    <td className="text-right py-3 px-2">
                      {formatCurrency(projection.investment)}
                    </td>
                    <td className="text-right py-3 px-2">
                      {formatNumber(projection.traffic)}
                    </td>
                    <td className="text-right py-3 px-2">
                      {formatNumber(projection.conversions)}
                    </td>
                    <td className="text-right py-3 px-2 font-semibold">
                      {formatCurrency(projection.revenue)}
                    </td>
                    <td className="text-right py-3 px-2 font-semibold text-primary">
                      {formatCurrency(projection.cumulativeRevenue)}
                    </td>
                    <td className={`text-right py-3 px-2 font-bold ${getROIColor(projection.roi)}`}>
                      {projection.roi.toFixed(1)}%
                    </td>
                    <td className="py-3 px-2">
                      {projection.notes && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(index)}
                          className="h-6 w-6 p-0"
                        >
                          {expandedRows.has(index) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </td>
                  </tr>
                  {projection.notes && expandedRows.has(index) && (
                    <tr>
                      <td colSpan={8} className="px-4 py-3 bg-gray-50">
                        <p className="text-sm text-muted-foreground">
                          <strong>Notes:</strong> {projection.notes}
                        </p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 font-semibold">
                <td className="py-3 px-2">Total</td>
                <td className="text-right py-3 px-2">
                  {formatCurrency(projections.reduce((sum, p) => sum + p.investment, 0))}
                </td>
                <td className="text-right py-3 px-2">
                  {formatNumber(projections.reduce((sum, p) => sum + p.traffic, 0))}
                </td>
                <td className="text-right py-3 px-2">
                  {formatNumber(projections.reduce((sum, p) => sum + p.conversions, 0))}
                </td>
                <td className="text-right py-3 px-2">
                  {formatCurrency(projections.reduce((sum, p) => sum + p.revenue, 0))}
                </td>
                <td className="text-right py-3 px-2 text-primary">
                  {formatCurrency(projections[projections.length - 1]?.cumulativeRevenue || 0)}
                </td>
                <td className={`text-right py-3 px-2 ${getROIColor(projections[projections.length - 1]?.roi || 0)}`}>
                  {(projections[projections.length - 1]?.roi || 0).toFixed(1)}%
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}