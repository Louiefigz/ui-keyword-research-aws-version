import { render, screen } from '@/test-utils';
import { ExecutiveSummary } from '@/components/features/strategic/ExecutiveSummary';
import type { StrategicAdviceResponse } from '@/types';

const mockData: StrategicAdviceResponse['executive_summary'] = {
  current_state: {
    total_keywords_tracked: 500,
    current_organic_traffic: 25000,
    current_traffic_value: '$12,500',
    top_ranking_keywords: 45,
  },
  opportunity_summary: {
    immediate_opportunities: 23,
    content_gaps_identified: 15,
    potential_traffic_gain: '+15,000',
    potential_monthly_value: '$7,500',
  },
  strategic_priorities: [
    'Focus on high-volume transactional keywords',
    'Create comprehensive guides for informational queries',
    'Optimize existing content for featured snippets',
  ],
  expected_results: {
    '30_days': '+25% traffic',
    '90_days': '+50% traffic',
    '180_days': '+100% traffic',
  },
};

describe('ExecutiveSummary', () => {
  it('renders current performance metrics', () => {
    render(<ExecutiveSummary data={mockData} />);

    // Check section title
    expect(screen.getByText('Current Performance')).toBeInTheDocument();

    // Check metrics
    expect(screen.getByText('Keywords Tracked')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();

    expect(screen.getByText('Organic Traffic')).toBeInTheDocument();
    expect(screen.getByText('25,000')).toBeInTheDocument();

    expect(screen.getByText('Traffic Value')).toBeInTheDocument();
    expect(screen.getByText('$12,500')).toBeInTheDocument();

    expect(screen.getByText('Top 10 Rankings')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  it('renders opportunity summary', () => {
    render(<ExecutiveSummary data={mockData} />);

    expect(screen.getByText('Opportunity Summary')).toBeInTheDocument();

    // Check opportunities
    expect(screen.getByText('Immediate Opportunities')).toBeInTheDocument();
    expect(screen.getByText('23')).toBeInTheDocument();

    expect(screen.getByText('Content Gaps Identified')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();

    expect(screen.getByText('Potential Traffic Gain')).toBeInTheDocument();
    expect(screen.getByText('+15,000')).toBeInTheDocument();

    expect(screen.getByText('Potential Monthly Value')).toBeInTheDocument();
    expect(screen.getByText('$7,500')).toBeInTheDocument();
  });

  it('renders strategic priorities', () => {
    render(<ExecutiveSummary data={mockData} />);

    expect(screen.getByText('Strategic Priorities')).toBeInTheDocument();

    // Check all priorities are displayed
    mockData.strategic_priorities.forEach(priority => {
      expect(screen.getByText(priority)).toBeInTheDocument();
    });

    // Check numbering
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders expected results timeline', () => {
    render(<ExecutiveSummary data={mockData} />);

    expect(screen.getByText('Expected Results Timeline')).toBeInTheDocument();

    // Check timeframes
    expect(screen.getByText('3 months')).toBeInTheDocument();
    expect(screen.getByText('6 months')).toBeInTheDocument();
    expect(screen.getByText('12 months')).toBeInTheDocument();

    // Check results
    expect(screen.getByText('+25% traffic')).toBeInTheDocument();
    expect(screen.getByText('+50% traffic')).toBeInTheDocument();
    expect(screen.getByText('+100% traffic')).toBeInTheDocument();
  });

  it('renders progress bars for timeline', () => {
    render(<ExecutiveSummary data={mockData} />);

    // Should have progress bars with appropriate widths
    const progressBars = screen.getAllByRole('progressbar', { hidden: true });
    expect(progressBars).toHaveLength(3);
  });

  it('handles empty strategic priorities', () => {
    const dataWithNoPriorities = {
      ...mockData,
      strategic_priorities: [],
    };

    render(<ExecutiveSummary data={dataWithNoPriorities} />);

    // Should still render the section
    expect(screen.getByText('Strategic Priorities')).toBeInTheDocument();
    
    // But no priority items
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('applies correct styling to Top 10 Rankings metric', () => {
    render(<ExecutiveSummary data={mockData} />);

    // Should have special styling (green background)
    const top10Card = screen.getByText('Top 10 Rankings').closest('.space-y-2');
    expect(top10Card).toHaveClass('bg-green-50');
  });

  it('formats large numbers with commas', () => {
    const dataWithLargeNumbers = {
      ...mockData,
      current_state: {
        ...mockData.current_state,
        current_organic_traffic: 1234567,
      },
    };

    render(<ExecutiveSummary data={dataWithLargeNumbers} />);

    expect(screen.getByText('1,234,567')).toBeInTheDocument();
  });
});