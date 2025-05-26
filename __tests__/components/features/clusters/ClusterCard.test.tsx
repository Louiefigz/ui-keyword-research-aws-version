import { render, screen, fireEvent } from '@/test-utils';
import { ClusterCard } from '@/components/features/clusters/ClusterCard';
import type { Cluster } from '@/types';

const mockCluster: Cluster = {
  id: '1',
  name: 'SEO Best Practices',
  theme: 'Technical SEO optimization strategies',
  parent_topic: 'SEO',
  keywords: [
    { id: '1', keyword: 'meta tags', search_volume: 5000, opportunity_score: 85, role: 'primary' },
    { id: '2', keyword: 'title optimization', search_volume: 3000, opportunity_score: 75, role: 'secondary' },
    { id: '3', keyword: 'header tags', search_volume: 2000, opportunity_score: 70, role: 'supporting' },
    { id: '4', keyword: 'alt text', search_volume: 1500, opportunity_score: 65, role: 'supporting' },
  ],
  metrics: {
    total_search_volume: 11500,
    avg_keyword_difficulty: 45,
    total_keywords: 4,
    opportunity_score: 75,
    market_share_potential: 35,
  },
  opportunities: {
    content_gap_score: 65,
    competition_level: 'medium',
    estimated_traffic_potential: 2500,
    ranking_difficulty: 'moderate',
    quick_wins: ['Optimize meta descriptions', 'Add schema markup'],
  },
  content_strategy: {
    recommended_content_type: 'Comprehensive Guide',
    primary_intent: 'informational',
    content_depth: 'comprehensive',
    estimated_word_count: 3000,
    key_topics_to_cover: ['Technical SEO basics', 'On-page optimization', 'Best practices'],
  },
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

describe('ClusterCard', () => {
  const mockOnViewDetails = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders cluster information correctly', () => {
    render(<ClusterCard cluster={mockCluster} onViewDetails={mockOnViewDetails} />);

    // Check basic info
    expect(screen.getByText('SEO Best Practices')).toBeInTheDocument();
    expect(screen.getByText('Technical SEO optimization strategies')).toBeInTheDocument();

    // Check metrics
    expect(screen.getByText('11,500')).toBeInTheDocument(); // Search volume
    expect(screen.getByText('4')).toBeInTheDocument(); // Keywords count
    expect(screen.getByText('75% Score')).toBeInTheDocument(); // Opportunity score

    // Check badges
    expect(screen.getByText('medium competition')).toBeInTheDocument();
    expect(screen.getByText('moderate difficulty')).toBeInTheDocument();
  });

  it('displays top keywords with overflow indicator', () => {
    render(<ClusterCard cluster={mockCluster} onViewDetails={mockOnViewDetails} />);

    // Should show first 3 keywords
    expect(screen.getByText('meta tags')).toBeInTheDocument();
    expect(screen.getByText('title optimization')).toBeInTheDocument();
    expect(screen.getByText('header tags')).toBeInTheDocument();

    // Should show overflow indicator
    expect(screen.getByText('+1 more')).toBeInTheDocument();

    // Should not show 4th keyword
    expect(screen.queryByText('alt text')).not.toBeInTheDocument();
  });

  it('applies correct styling based on opportunity score', () => {
    const { rerender } = render(<ClusterCard cluster={mockCluster} onViewDetails={mockOnViewDetails} />);
    
    // High score (>=70) should have success variant
    expect(screen.getByText('75% Score')).toHaveClass('bg-green-500');

    // Medium score (40-69)
    const mediumCluster = { ...mockCluster, metrics: { ...mockCluster.metrics, opportunity_score: 50 } };
    rerender(<ClusterCard cluster={mediumCluster} onViewDetails={mockOnViewDetails} />);
    expect(screen.getByText('50% Score')).toHaveClass('bg-yellow-500');

    // Low score (<40)
    const lowCluster = { ...mockCluster, metrics: { ...mockCluster.metrics, opportunity_score: 30 } };
    rerender(<ClusterCard cluster={lowCluster} onViewDetails={mockOnViewDetails} />);
    expect(screen.getByText('30% Score')).toHaveClass('bg-gray-500');
  });

  it('applies correct styling based on competition level', () => {
    const { rerender } = render(<ClusterCard cluster={mockCluster} onViewDetails={mockOnViewDetails} />);

    // Medium competition
    expect(screen.getByText('medium competition')).toHaveClass('bg-yellow-500');

    // Low competition
    const lowCompCluster = { 
      ...mockCluster, 
      opportunities: { ...mockCluster.opportunities, competition_level: 'low' } 
    };
    rerender(<ClusterCard cluster={lowCompCluster} onViewDetails={mockOnViewDetails} />);
    expect(screen.getByText('low competition')).toHaveClass('bg-green-500');

    // High competition
    const highCompCluster = { 
      ...mockCluster, 
      opportunities: { ...mockCluster.opportunities, competition_level: 'high' } 
    };
    rerender(<ClusterCard cluster={highCompCluster} onViewDetails={mockOnViewDetails} />);
    expect(screen.getByText('high competition')).toHaveClass('bg-red-500');
  });

  it('handles click on card', () => {
    render(<ClusterCard cluster={mockCluster} onViewDetails={mockOnViewDetails} />);

    const card = screen.getByRole('article');
    fireEvent.click(card);

    expect(mockOnViewDetails).toHaveBeenCalledWith(mockCluster);
  });

  it('handles click on view details button', () => {
    render(<ClusterCard cluster={mockCluster} onViewDetails={mockOnViewDetails} />);

    const button = screen.getByRole('button', { name: /view details/i });
    fireEvent.click(button);

    expect(mockOnViewDetails).toHaveBeenCalledWith(mockCluster);
  });

  it('prevents event bubbling on button click', () => {
    render(<ClusterCard cluster={mockCluster} onViewDetails={mockOnViewDetails} />);

    const button = screen.getByRole('button', { name: /view details/i });
    fireEvent.click(button);

    // Should only be called once (from button, not card)
    expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
  });

  it('handles cluster with no keywords', () => {
    const emptyCluster = { ...mockCluster, keywords: [] };
    render(<ClusterCard cluster={emptyCluster} onViewDetails={mockOnViewDetails} />);

    // Should not show keywords section
    expect(screen.queryByText('Top Keywords:')).not.toBeInTheDocument();
  });
});