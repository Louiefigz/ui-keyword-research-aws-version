'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base';
import { Button } from '@/components/ui/base/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/forms/select';
import { Download, Calculator } from 'lucide-react';
import { MetricCard } from '@/components/ui/data-display/metric-card';
import { ROITimelineChart } from './ROITimelineChart';
import { InvestmentBreakdown } from './InvestmentBreakdown';
import { PaybackAnalysis } from './PaybackAnalysis';
import { ProjectionTable } from './ProjectionTable';
import { roiCalculations, exportUtils } from '@/lib/utils/strategic-advice-utils';
import { formatCurrency } from '@/lib/utils/format';
import type { ROIProjection } from '@/types';

interface ROIProjectionsTabProps {
  projections: ROIProjection[];
  isLoading?: boolean;
  error?: Error | null;
}

export function ROIProjectionsTab({ projections = [], isLoading, error }: ROIProjectionsTabProps) {
  const [selectedScenario, setSelectedScenario] = useState<'best' | 'expected' | 'worst'>('expected');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'3_months' | '6_months' | '12_months'>('12_months');
  const [isExporting, setIsExporting] = useState(false);
  
  // Get current projection based on selections
  const currentProjection = projections?.find(
    p => p.timeframe === selectedTimeframe && (p.scenario === selectedScenario || !p.scenario)
  ) || projections?.[0];

  // Generate timeline data for chart
  const generateTimelineData = () => {
    if (!currentProjection) return [];
    
    const months = parseInt(selectedTimeframe.split('_')[0]);
    const monthlyRevenue = currentProjection.projected_revenue / months;
    const monthlyInvestment = currentProjection.investment_required / Math.min(3, months); // Investment spread over first 3 months
    
    return Array.from({ length: months }, (_, i) => {
      const month = i + 1;
      const investment = month <= 3 ? monthlyInvestment : 0;
      const revenue = monthlyRevenue * (0.5 + (0.5 * month / months)); // Ramp up revenue
      const cumulativeInvestment = Math.min(monthlyInvestment * month, currentProjection.investment_required);
      const cumulativeRevenue = revenue * month * 0.7; // Account for ramp-up
      const cumulativeROI = cumulativeInvestment > 0 ? ((cumulativeRevenue - cumulativeInvestment) / cumulativeInvestment) * 100 : 0;
      
      return {
        month: `Month ${month}`,
        investment,
        revenue,
        cumulativeROI: Math.round(cumulativeROI * 10) / 10
      };
    });
  };

  // Generate investment breakdown data
  const investmentCategories = [
    {
      category: 'Content Creation',
      amount: currentProjection.investment_required * 0.4,
      percentage: 40,
      description: 'Creating new optimized content based on keyword opportunities'
    },
    {
      category: 'Content Optimization',
      amount: currentProjection.investment_required * 0.3,
      percentage: 30,
      description: 'Updating and optimizing existing content'
    },
    {
      category: 'Technical SEO',
      amount: currentProjection.investment_required * 0.2,
      percentage: 20,
      description: 'Site speed, structure, and technical improvements'
    },
    {
      category: 'Link Building',
      amount: currentProjection.investment_required * 0.1,
      percentage: 10,
      description: 'Outreach and relationship building for backlinks'
    }
  ];

  // Generate payback analysis data
  const monthlyReturn = currentProjection.projected_revenue / parseInt(selectedTimeframe.split('_')[0]);
  const paybackPeriod = roiCalculations.calculatePaybackPeriod(
    currentProjection.investment_required,
    monthlyReturn
  );
  
  const cumulativeReturns = Array.from({ length: 24 }, (_, i) => {
    const month = i + 1;
    const cumulative = monthlyReturn * month * (0.5 + (0.5 * Math.min(month, 12) / 12)); // Ramp up factor
    return {
      month,
      cumulative: Math.round(cumulative),
      isBreakeven: cumulative >= currentProjection.investment_required && 
                   (i === 0 || monthlyReturn * i * (0.5 + (0.5 * Math.min(i, 12) / 12)) < currentProjection.investment_required)
    };
  });

  // Generate projection table data
  const generateProjectionTableData = () => {
    const months = parseInt(selectedTimeframe.split('_')[0]);
    return Array.from({ length: months }, (_, i) => {
      const month = i + 1;
      const investment = month <= 3 ? currentProjection.investment_required / 3 : 0;
      const traffic = Math.round(currentProjection.projected_traffic * (month / months) * (0.5 + 0.5 * month / months));
      const conversions = Math.round(currentProjection.projected_conversions * (month / months) * (0.5 + 0.5 * month / months));
      const revenue = conversions * (currentProjection.projected_revenue / currentProjection.projected_conversions);
      const cumulativeInvestment = Math.min(currentProjection.investment_required / 3 * month, currentProjection.investment_required);
      const cumulativeRevenue = Array.from({ length: month }, (_, j) => {
        const m = j + 1;
        const c = Math.round(currentProjection.projected_conversions * (m / months) * (0.5 + 0.5 * m / months));
        return c * (currentProjection.projected_revenue / currentProjection.projected_conversions);
      }).reduce((sum, r) => sum + r, 0);
      
      const roi = cumulativeInvestment > 0 ? ((cumulativeRevenue - cumulativeInvestment) / cumulativeInvestment) * 100 : 0;
      
      return {
        month: `Month ${month}`,
        investment,
        traffic,
        conversions,
        revenue,
        cumulativeRevenue,
        roi,
        notes: month === 3 ? 'Initial optimization complete' : 
               month === 6 ? 'Content strategy showing results' :
               month === 12 ? 'Full year performance achieved' : undefined
      };
    });
  };

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-destructive/10 p-3 mb-4">
            <Calculator className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Failed to Load ROI Projections</h3>
          <p className="text-muted-foreground text-center mb-4 max-w-md">
            {error.message || 'An error occurred while loading ROI projection data. Please try again.'}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse h-96 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleExportAll = async () => {
    try {
      setIsExporting(true);
    // Prepare comprehensive ROI export data
    const allScenariosData = projections.map(proj => ({
      timeframe: proj.timeframe.replace('_', ' '),
      scenario: proj.scenario || 'expected',
      investmentRequired: proj.investment_required,
      projectedRevenue: proj.projected_revenue,
      netProfit: proj.projected_revenue - proj.investment_required,
      roiPercentage: proj.roi_percentage,
      projectedTraffic: proj.projected_traffic,
      projectedConversions: proj.projected_conversions,
      confidenceLevel: proj.confidence_level,
      paybackPeriod: roiCalculations.formatPaybackPeriod(
        roiCalculations.calculatePaybackPeriod(
          proj.investment_required,
          proj.projected_revenue / parseInt(proj.timeframe.split('_')[0])
        )
      ),
    }));

    // Add investment breakdown
    const investmentBreakdownData = investmentCategories.map(cat => ({
      category: cat.category,
      amount: cat.amount,
      percentage: `${cat.percentage}%`,
      description: cat.description,
    }));

    // Add monthly projections
    const monthlyData = generateProjectionTableData();

    // Combine all data for export
    const exportData = [
      { section: 'ROI PROJECTIONS - ALL SCENARIOS' },
      ...allScenariosData,
      {},
      { section: 'INVESTMENT BREAKDOWN' },
      ...investmentBreakdownData,
      {},
      { section: `MONTHLY PROJECTIONS - ${selectedScenario.toUpperCase()} CASE` },
      ...monthlyData.map(m => ({
        month: m.month,
        investment: m.investment,
        traffic: m.traffic,
        conversions: m.conversions,
        revenue: m.revenue,
        cumulativeRevenue: m.cumulativeRevenue,
        roi: `${m.roi.toFixed(1)}%`,
      })),
      {},
      { section: 'KEY ASSUMPTIONS' },
      ...currentProjection.key_assumptions.map((assumption, i) => ({
        assumption: `${i + 1}. ${assumption}`,
      })),
    ];

    exportUtils.exportToCSV(exportData, `roi-projections-${selectedTimeframe}-${selectedScenario}`);
    } catch (error) {
      // Export failed
      // You could add a toast notification here
    } finally {
      setIsExporting(false);
    }
  };

  if (!currentProjection) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">ROI Projections Not Available</h3>
          <p className="text-muted-foreground text-center">
            ROI projections will be generated once strategic analysis is complete.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Scenario and Timeframe Selectors */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-semibold">ROI Projections</h2>
          <p className="text-muted-foreground">
            Expected return on investment based on strategic recommendations
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedScenario} onValueChange={(value: any) => setSelectedScenario(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select scenario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="best">Best Case</SelectItem>
              <SelectItem value="expected">Expected</SelectItem>
              <SelectItem value="worst">Worst Case</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTimeframe} onValueChange={(value: any) => setSelectedTimeframe(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3_months">3 Months</SelectItem>
              <SelectItem value="6_months">6 Months</SelectItem>
              <SelectItem value="12_months">12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={handleExportAll}
            disabled={isExporting}
            aria-label="Export all ROI projections"
          >
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            {isExporting ? 'Exporting...' : 'Export All'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Investment Required"
          value={formatCurrency(currentProjection.investment_required)}
        />
        <MetricCard
          title="Projected Revenue"
          value={formatCurrency(currentProjection.projected_revenue)}
          change={{ value: currentProjection.roi_percentage, type: 'increase' }}
        />
        <MetricCard
          title="Net Profit"
          value={formatCurrency(currentProjection.projected_revenue - currentProjection.investment_required)}
        />
        <MetricCard
          title="Payback Period"
          value={roiCalculations.formatPaybackPeriod(paybackPeriod)}
        />
      </div>

      {/* ROI Timeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Investment Timeline</CardTitle>
          <CardDescription>
            Monthly breakdown showing investment, revenue, and cumulative ROI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ROITimelineChart 
            data={generateTimelineData()} 
            scenario={selectedScenario}
          />
        </CardContent>
      </Card>

      {/* Investment Breakdown and Payback Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        <InvestmentBreakdown 
          categories={investmentCategories}
          totalInvestment={currentProjection.investment_required}
        />
        <PaybackAnalysis
          investment={currentProjection.investment_required}
          monthlyReturn={monthlyReturn}
          cumulativeReturns={cumulativeReturns}
          paybackPeriod={paybackPeriod}
          scenario={selectedScenario}
        />
      </div>

      {/* Month-by-Month Projection Table */}
      <ProjectionTable 
        projections={generateProjectionTableData()}
        scenario={selectedScenario}
      />

      {/* Key Assumptions */}
      <Card>
        <CardHeader>
          <CardTitle>Key Assumptions & Confidence Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Confidence Level</span>
            <Badge 
              variant={currentProjection.confidence_level === 'high' ? 'default' : 
                      currentProjection.confidence_level === 'medium' ? 'secondary' : 'destructive'}
              className="capitalize"
            >
              {currentProjection.confidence_level} confidence
            </Badge>
          </div>
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
  );
}