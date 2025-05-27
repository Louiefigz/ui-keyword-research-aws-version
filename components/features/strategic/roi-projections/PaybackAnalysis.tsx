'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/data-display/card';
import { ProgressBar } from '@/components/ui/feedback/progress-bar';
import { Badge } from '@/components/ui/base/badge';
import { Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { roiCalculations } from '@/lib/utils/strategic-advice-utils';
import { formatCurrency } from '@/lib/utils/format';

interface PaybackAnalysisProps {
  investment: number;
  monthlyReturn: number;
  cumulativeReturns: Array<{
    month: number;
    cumulative: number;
    isBreakeven: boolean;
  }>;
  paybackPeriod: number;
  scenario: 'best' | 'expected' | 'worst';
}

export function PaybackAnalysis({ 
  investment, 
  monthlyReturn, 
  cumulativeReturns,
  paybackPeriod,
  scenario 
}: PaybackAnalysisProps) {
  const progressPercentage = Math.min(100, (cumulativeReturns[cumulativeReturns.length - 1]?.cumulative / investment) * 100);
  
  const getScenarioColor = () => {
    switch (scenario) {
      case 'best': return 'text-green-600';
      case 'expected': return 'text-blue-600';
      case 'worst': return 'text-orange-600';
    }
  };

  const getScenarioBadgeVariant = (): "default" | "secondary" | "destructive" => {
    switch (scenario) {
      case 'best': return 'default';
      case 'expected': return 'secondary';
      case 'worst': return 'destructive';
    }
  };

  const breakevenMonth = cumulativeReturns.find(r => r.isBreakeven)?.month;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Payback Period Analysis</CardTitle>
            <CardDescription>
              Time to recover your initial investment
            </CardDescription>
          </div>
          <Badge variant={getScenarioBadgeVariant()}>
            {scenario} case
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Payback Period</span>
            </div>
            <p className={`text-2xl font-bold ${getScenarioColor()}`}>
              {roiCalculations.formatPaybackPeriod(paybackPeriod)}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Monthly Return</span>
            </div>
            <p className="text-2xl font-bold">
              {formatCurrency(monthlyReturn)}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Break-even Month</span>
            </div>
            <p className="text-2xl font-bold">
              {breakevenMonth ? `Month ${breakevenMonth}` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Recovery Progress</span>
            <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
          </div>
          <ProgressBar value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(0)}</span>
            <span>{formatCurrency(investment)}</span>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Monthly Cumulative Returns
          </h4>
          <div className="grid gap-2 max-h-[300px] overflow-y-auto">
            {cumulativeReturns.map((data) => (
              <div 
                key={data.month}
                className={`flex justify-between items-center p-2 rounded-lg ${
                  data.isBreakeven ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}
              >
                <span className="text-sm font-medium">
                  Month {data.month}
                  {data.isBreakeven && (
                    <Badge variant="success" className="ml-2 text-xs">
                      Break-even
                    </Badge>
                  )}
                </span>
                <span className={`text-sm font-semibold ${
                  data.cumulative >= investment ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {formatCurrency(data.cumulative)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="p-4 bg-blue-50 rounded-lg space-y-2">
          <h4 className="font-medium text-blue-900">Analysis Summary</h4>
          <p className="text-sm text-blue-800">
            {paybackPeriod <= 6 
              ? 'Excellent payback period. This investment shows strong potential for quick returns.'
              : paybackPeriod <= 12
              ? 'Good payback period. The investment should be recovered within a year.'
              : paybackPeriod <= 24
              ? 'Moderate payback period. Consider the long-term benefits of this investment.'
              : 'Extended payback period. Ensure the long-term strategic value justifies the investment.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}