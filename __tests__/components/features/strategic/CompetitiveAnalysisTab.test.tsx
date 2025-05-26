import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CompetitiveAnalysisTab } from '@/components/features/strategic/CompetitiveAnalysisTab';
import { exportUtils } from '@/lib/utils/strategic-advice-utils';

// Mock the export utility
jest.mock('@/lib/utils/strategic-advice-utils', () => ({
  exportUtils: {
    exportToCSV: jest.fn(),
  },
  chartConfig: {
    getChartColor: jest.fn((i) => '#000000'),
  },
  priorityUtils: {},
  roiCalculations: {},
}));

describe('CompetitiveAnalysisTab', () => {
  const mockData = {
    competitor_gaps: {
      'keyword-1': {
        keyword: 'test keyword 1',
        metrics: { volume: 1000, difficulty: 50, cpc: 2.5 },
        competitor_positions: { 'Competitor A': 1, 'Competitor B': 3 },
        opportunity: 'High',
        opportunity_score: 85,
        estimated_traffic: 500,
        estimated_value: 1250,
      },
      'keyword-2': {
        keyword: 'test keyword 2',
        metrics: { volume: 500, difficulty: 30, cpc: 1.5 },
        competitor_positions: { 'Competitor A': 2 },
        opportunity: 'Medium',
        opportunity_score: 65,
        estimated_traffic: 250,
        estimated_value: 375,
      },
    },
    market_share_analysis: {
      market_share_percentage: 15,
      organic_visibility: 12000,
      competitor_comparison: [
        {
          competitor: 'Competitor A',
          market_share: 25,
          organic_visibility: 20000,
          shared_keywords: 150,
        },
        {
          competitor: 'Competitor B',
          market_share: 20,
          organic_visibility: 16000,
          shared_keywords: 120,
        },
      ],
      growth_opportunities: [],
    },
    competitive_advantages: [
      {
        advantage_type: 'Content Quality',
        description: 'Higher quality content than competitors',
        keywords_count: 50,
        impact_score: 75,
      },
    ],
    strategic_recommendations: [
      {
        priority: 'high' as const,
        recommendation: 'Target high-value competitor gaps',
        expected_outcome: '20% traffic increase',
        timeline: '3 months',
      },
    ],
  };

  it('renders loading state correctly', () => {
    render(<CompetitiveAnalysisTab isLoading={true} />);
    expect(screen.getByText('Competitive Analysis')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    const error = new Error('Failed to load data');
    render(<CompetitiveAnalysisTab error={error} />);
    expect(screen.getByText('Failed to Load Competitive Analysis')).toBeInTheDocument();
    expect(screen.getByText(error.message)).toBeInTheDocument();
  });

  it('renders no data state correctly', () => {
    render(<CompetitiveAnalysisTab />);
    expect(screen.getByText('Competitive Analysis Not Available')).toBeInTheDocument();
  });

  it('renders data correctly', () => {
    render(<CompetitiveAnalysisTab data={mockData} />);
    
    // Check header
    expect(screen.getByText('Competitive Analysis')).toBeInTheDocument();
    
    // Check metric cards
    expect(screen.getByText('15%')).toBeInTheDocument(); // Market share
    expect(screen.getByText('2')).toBeInTheDocument(); // Total gaps
    expect(screen.getByText('1')).toBeInTheDocument(); // High-value gaps
    
    // Check competitor gaps table
    expect(screen.getByText('test keyword 1')).toBeInTheDocument();
    expect(screen.getByText('test keyword 2')).toBeInTheDocument();
  });

  it('handles export functionality', async () => {
    render(<CompetitiveAnalysisTab data={mockData} />);
    
    const exportButton = screen.getByLabelText('Export competitive analysis data');
    fireEvent.click(exportButton);
    
    // Button should show loading state
    expect(screen.getByText('Exporting...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(exportUtils.exportToCSV).toHaveBeenCalledWith(
        expect.any(Array),
        'competitive-analysis'
      );
    });
  });

  it('filters competitors correctly', () => {
    render(<CompetitiveAnalysisTab data={mockData} />);
    
    // Open competitor filter
    const filterTrigger = screen.getByRole('combobox');
    fireEvent.click(filterTrigger);
    
    // Select Competitor A
    const competitorOption = screen.getByText('Competitor A');
    fireEvent.click(competitorOption);
    
    // Should only show gaps where Competitor A is present
    expect(screen.getByText('test keyword 1')).toBeInTheDocument();
    expect(screen.getByText('test keyword 2')).toBeInTheDocument();
  });

  it('applies accessibility attributes', () => {
    render(<CompetitiveAnalysisTab data={mockData} />);
    
    // Check region role
    expect(screen.getByRole('region', { name: 'Competitive Analysis' })).toBeInTheDocument();
    
    // Check export button accessibility
    const exportButton = screen.getByLabelText('Export competitive analysis data');
    expect(exportButton).toBeInTheDocument();
  });
});