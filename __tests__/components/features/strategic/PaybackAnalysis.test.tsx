import React from 'react';
import { render, screen } from '@testing-library/react';
import { PaybackAnalysis } from '@/components/features/strategic/PaybackAnalysis';

describe('PaybackAnalysis', () => {
  const mockProps = {
    investment: 10000,
    monthlyReturn: 2000,
    cumulativeReturns: [
      { month: 1, cumulative: 2000, isBreakeven: false },
      { month: 2, cumulative: 4000, isBreakeven: false },
      { month: 3, cumulative: 6000, isBreakeven: false },
      { month: 4, cumulative: 8000, isBreakeven: false },
      { month: 5, cumulative: 10000, isBreakeven: true },
      { month: 6, cumulative: 12000, isBreakeven: false },
    ],
    paybackPeriod: 5,
    scenario: 'expected' as const,
  };

  it('renders without crashing', () => {
    render(<PaybackAnalysis {...mockProps} />);
    expect(screen.getByText('Payback Period Analysis')).toBeInTheDocument();
  });

  it('displays the correct payback period', () => {
    render(<PaybackAnalysis {...mockProps} />);
    expect(screen.getByText('5 months')).toBeInTheDocument();
  });

  it('displays the monthly return', () => {
    render(<PaybackAnalysis {...mockProps} />);
    expect(screen.getByText('$2,000')).toBeInTheDocument();
  });

  it('shows the break-even month', () => {
    render(<PaybackAnalysis {...mockProps} />);
    expect(screen.getByText('Month 5')).toBeInTheDocument();
  });

  it('displays the correct scenario badge', () => {
    render(<PaybackAnalysis {...mockProps} />);
    expect(screen.getByText('expected case')).toBeInTheDocument();
  });

  it('shows break-even indicator for the correct month', () => {
    render(<PaybackAnalysis {...mockProps} />);
    expect(screen.getByText('Break-even')).toBeInTheDocument();
  });

  it('displays analysis summary for quick payback', () => {
    render(<PaybackAnalysis {...mockProps} />);
    expect(screen.getByText(/Excellent payback period/)).toBeInTheDocument();
  });

  it('shows different summary for longer payback periods', () => {
    const longPaybackProps = {
      ...mockProps,
      paybackPeriod: 18,
    };
    render(<PaybackAnalysis {...longPaybackProps} />);
    expect(screen.getByText(/Moderate payback period/)).toBeInTheDocument();
  });
});