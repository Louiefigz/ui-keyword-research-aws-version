import { render, screen } from '@/test-utils';
import { ClustersSummary } from '@/components/features/clusters/ClustersSummary';
import type { Cluster } from '@/types';

const mockClusters: Cluster[] = [
  {
    id: '1',
    name: 'SEO Best Practices',
    theme: 'Technical SEO',
    parent_topic: 'SEO',
    keywords: [],
    metrics: {
      total_search_volume: 10000,
      avg_keyword_difficulty: 45,
      total_keywords: 10,
      opportunity_score: 80,
      market_share_potential: 35,
    },
    opportunities: {
      content_gap_score: 65,
      competition_level: 'low',
      estimated_traffic_potential: 2500,
      ranking_difficulty: 'easy',
      quick_wins: [],
    },
    content_strategy: {
      recommended_content_type: 'Guide',
      primary_intent: 'informational',
      content_depth: 'comprehensive',
      estimated_word_count: 3000,
      key_topics_to_cover: [],
    },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '2',
    name: 'Content Marketing',
    theme: 'Marketing Strategies',
    parent_topic: 'Marketing',
    keywords: [],
    metrics: {
      total_search_volume: 15000,
      avg_keyword_difficulty: 55,
      total_keywords: 15,
      opportunity_score: 65,
      market_share_potential: 40,
    },
    opportunities: {
      content_gap_score: 70,
      competition_level: 'medium',
      estimated_traffic_potential: 3000,
      ranking_difficulty: 'moderate',
      quick_wins: [],
    },
    content_strategy: {
      recommended_content_type: 'Blog Series',
      primary_intent: 'informational',
      content_depth: 'moderate',
      estimated_word_count: 2000,
      key_topics_to_cover: [],
    },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

describe('ClustersSummary', () => {
  it('renders loading state', () => {
    render(<ClustersSummary clusters={[]} isLoading={true} />);

    // Should show 4 skeleton cards
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(4);
  });

  it('calculates and displays correct metrics', () => {
    render(<ClustersSummary clusters={mockClusters} />);

    // Total Clusters
    expect(screen.getByText('Total Clusters')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    // Total Search Volume (10000 + 15000 = 25000)
    expect(screen.getByText('Total Search Volume')).toBeInTheDocument();
    expect(screen.getByText('25,000')).toBeInTheDocument();

    // Average Opportunity Score ((80 + 65) / 2 = 72.5)
    expect(screen.getByText('Avg Opportunity Score')).toBeInTheDocument();
    expect(screen.getByText('72.5%')).toBeInTheDocument();

    // High Opportunity Clusters (score >= 70, so only 1)
    expect(screen.getByText('High Opportunity')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('displays visualizations when clusters exist', () => {
    render(<ClustersSummary clusters={mockClusters} />);

    // Should show chart cards
    expect(screen.getByText('Opportunity Distribution')).toBeInTheDocument();
    expect(screen.getByText('Top Clusters by Volume')).toBeInTheDocument();
  });

  it('does not display visualizations when no clusters', () => {
    render(<ClustersSummary clusters={[]} />);

    // Should not show chart cards
    expect(screen.queryByText('Opportunity Distribution')).not.toBeInTheDocument();
    expect(screen.queryByText('Top Clusters by Volume')).not.toBeInTheDocument();
  });

  it('handles empty clusters array correctly', () => {
    render(<ClustersSummary clusters={[]} />);

    // Should show 0 values
    expect(screen.getByText('0')).toBeInTheDocument(); // Total clusters
    expect(screen.getAllByText('0')[1]).toBeInTheDocument(); // Total volume
    expect(screen.getByText('0%')).toBeInTheDocument(); // Avg score
  });

  it('shows trend indicator for high opportunity clusters', () => {
    render(<ClustersSummary clusters={mockClusters} />);

    // Should show positive trend for high opportunity count > 0
    const highOppCard = screen.getByText('High Opportunity').closest('.space-y-2');
    expect(highOppCard).toHaveTextContent('1');
  });

  it('calculates metrics correctly with single cluster', () => {
    render(<ClustersSummary clusters={[mockClusters[0]]} />);

    expect(screen.getByText('1')).toBeInTheDocument(); // Total clusters
    expect(screen.getByText('10,000')).toBeInTheDocument(); // Volume
    expect(screen.getByText('80.0%')).toBeInTheDocument(); // Opportunity score
  });

  it('displays correct descriptions for each metric', () => {
    render(<ClustersSummary clusters={mockClusters} />);

    expect(screen.getByText('Keyword groups identified')).toBeInTheDocument();
    expect(screen.getByText('Combined monthly searches')).toBeInTheDocument();
    expect(screen.getByText('Average cluster potential')).toBeInTheDocument();
    expect(screen.getByText('Clusters with score ≥70')).toBeInTheDocument();
  });
});