import { formatCurrency, formatNumber, formatPercent } from './format';

/**
 * Export utilities for strategic advice data
 */
export const exportUtils = {
  exportToCSV(data: any[], filename: string) {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in values
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },

  async exportToPDF(data: any, filename: string) {
    // TODO: Implement PDF export with a library like jsPDF
    throw new Error('PDF export not yet implemented');
  }
};

/**
 * Chart configuration utilities
 */
export const chartConfig = {
  defaultColors: [
    '#3b82f6', // blue
    '#ef4444', // red
    '#f59e0b', // amber
    '#10b981', // emerald
    '#8b5cf6', // violet
    '#f97316', // orange
    '#06b6d4', // cyan
    '#84cc16', // lime
  ],

  getChartColor(index: number): string {
    return this.defaultColors[index % this.defaultColors.length];
  },

  commonAxisProps: {
    tick: { fontSize: 12 },
    tickLine: { stroke: '#e5e7eb' },
    axisLine: { stroke: '#e5e7eb' },
  },

  tooltipStyles: {
    contentStyle: {
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      padding: '8px',
    },
    labelStyle: {
      color: '#111827',
      fontWeight: 600,
    },
  },

  formatTooltipValue(value: number, type: 'currency' | 'number' | 'percent' = 'number') {
    switch (type) {
      case 'currency':
        return formatCurrency(value);
      case 'percent':
        return formatPercent(value / 100);
      default:
        return formatNumber(value);
    }
  }
};

/**
 * Priority and scoring utilities
 */
export const priorityUtils = {
  getPriorityColor(priority: 'critical' | 'high' | 'medium' | 'low'): string {
    const colors = {
      critical: 'text-red-600',
      high: 'text-orange-600',
      medium: 'text-yellow-600',
      low: 'text-green-600',
    };
    return colors[priority] || 'text-gray-600';
  },

  getPriorityBadgeVariant(priority: string): "default" | "secondary" | "destructive" {
    switch (priority) {
      case 'critical':
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  },

  getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  },

  getScoreBadgeVariant(score: number): "default" | "secondary" | "destructive" | "success" {
    if (score >= 80) return 'success';
    if (score >= 60) return 'default';
    if (score >= 40) return 'secondary';
    return 'destructive';
  }
};

/**
 * Calculate ROI and financial metrics
 */
export const roiCalculations = {
  calculatePaybackPeriod(investment: number, monthlyReturn: number): number {
    if (monthlyReturn <= 0) return Infinity;
    return Math.ceil(investment / monthlyReturn);
  },

  calculateROI(investment: number, returns: number): number {
    if (investment === 0) return 0;
    return ((returns - investment) / investment) * 100;
  },

  calculateCompoundGrowth(initial: number, rate: number, periods: number): number {
    return initial * Math.pow(1 + rate, periods);
  },

  formatPaybackPeriod(months: number): string {
    if (months === Infinity) return 'N/A';
    if (months <= 1) return '< 1 month';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  }
};

/**
 * Common button styles for consistency
 */
export const buttonStyles = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};