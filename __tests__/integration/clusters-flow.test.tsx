import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { useRouter } from 'next/navigation';
import ClustersPage from '@/app/projects/[projectId]/clusters/page';
import { clustersApi } from '@/lib/api/clusters';
import type { Cluster } from '@/types';

jest.mock('next/navigation');
jest.mock('@/lib/api/clusters');

const mockRouter = {
  push: jest.fn(),
  refresh: jest.fn(),
};

const mockClusters: Cluster[] = [
  {
    id: '1',
    name: 'SEO Best Practices',
    theme: 'Technical SEO optimization strategies',
    parent_topic: 'SEO',
    keywords: [
      { id: '1', keyword: 'meta tags', search_volume: 5000, opportunity_score: 85, role: 'primary' },
      { id: '2', keyword: 'title optimization', search_volume: 3000, opportunity_score: 75, role: 'secondary' },
    ],
    metrics: {
      total_search_volume: 8000,
      avg_keyword_difficulty: 45,
      total_keywords: 2,
      opportunity_score: 80,
      market_share_potential: 35,
    },
    opportunities: {
      content_gap_score: 65,
      competition_level: 'low',
      estimated_traffic_potential: 2500,
      ranking_difficulty: 'easy',
      quick_wins: ['Optimize meta descriptions'],
    },
    content_strategy: {
      recommended_content_type: 'Guide',
      primary_intent: 'informational',
      content_depth: 'comprehensive',
      estimated_word_count: 3000,
      key_topics_to_cover: ['Technical SEO basics'],
    },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '2',
    name: 'Content Marketing',
    theme: 'Content creation and strategy',
    parent_topic: 'Marketing',
    keywords: [
      { id: '3', keyword: 'content strategy', search_volume: 4000, opportunity_score: 70, role: 'primary' },
    ],
    metrics: {
      total_search_volume: 4000,
      avg_keyword_difficulty: 55,
      total_keywords: 1,
      opportunity_score: 65,
      market_share_potential: 30,
    },
    opportunities: {
      content_gap_score: 70,
      competition_level: 'medium',
      estimated_traffic_potential: 2000,
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

describe('Clusters Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (clustersApi.getClusters as jest.Mock).mockResolvedValue({ data: mockClusters });
    (clustersApi.exportAllClusters as jest.Mock).mockResolvedValue(undefined);
  });

  it('loads and displays clusters summary and grid', async () => {
    render(<ClustersPage params={{ projectId: 'test-project' }} />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Keyword Clusters')).toBeInTheDocument();
    });

    // Check summary stats
    expect(screen.getByText('Total Clusters')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    
    expect(screen.getByText('Total Search Volume')).toBeInTheDocument();
    expect(screen.getByText('12,000')).toBeInTheDocument(); // 8000 + 4000

    // Check clusters are displayed
    expect(screen.getByText('SEO Best Practices')).toBeInTheDocument();
    expect(screen.getByText('Content Marketing')).toBeInTheDocument();

    // Check opportunity scores
    expect(screen.getByText('80% Score')).toBeInTheDocument();
    expect(screen.getByText('65% Score')).toBeInTheDocument();
  });

  it('handles filtering clusters', async () => {
    render(<ClustersPage params={{ projectId: 'test-project' }} />);

    await waitFor(() => {
      expect(screen.getByText('SEO Best Practices')).toBeInTheDocument();
    });

    // Type in search filter
    const searchInput = screen.getByPlaceholderText('Search clusters...');
    fireEvent.change(searchInput, { target: { value: 'SEO' } });

    // API should be called with search filter
    await waitFor(() => {
      expect(clustersApi.getClusters).toHaveBeenLastCalledWith(
        'test-project',
        expect.objectContaining({ search: 'SEO' }),
        expect.any(Object)
      );
    });
  });

  it('handles sorting clusters', async () => {
    render(<ClustersPage params={{ projectId: 'test-project' }} />);

    await waitFor(() => {
      expect(screen.getByText('Sort by:')).toBeInTheDocument();
    });

    // Change sort order
    const sortSelect = screen.getByDisplayValue('Opportunity Score (High to Low)');
    fireEvent.change(sortSelect, { target: { value: 'totalVolume-desc' } });

    // API should be called with new sort
    await waitFor(() => {
      expect(clustersApi.getClusters).toHaveBeenLastCalledWith(
        'test-project',
        expect.any(Object),
        expect.objectContaining({ field: 'totalVolume', order: 'desc' })
      );
    });
  });

  it('opens cluster detail modal when clicking view details', async () => {
    render(<ClustersPage params={{ projectId: 'test-project' }} />);

    await waitFor(() => {
      expect(screen.getByText('SEO Best Practices')).toBeInTheDocument();
    });

    // Click view details button
    const viewDetailsButtons = screen.getAllByRole('button', { name: /view details/i });
    fireEvent.click(viewDetailsButtons[0]);

    // Modal should open with cluster details
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Technical SEO optimization strategies')).toBeInTheDocument();
    });

    // Check tabs in modal
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Keywords (2)')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
  });

  it('exports clusters data', async () => {
    // Mock URL and document methods for download
    const mockCreateObjectURL = jest.fn(() => 'blob:test');
    const mockRevokeObjectURL = jest.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    const mockLink = { click: jest.fn() };
    jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any);

    render(<ClustersPage params={{ projectId: 'test-project' }} />);

    await waitFor(() => {
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
    });

    // Click export button
    const exportButton = screen.getByRole('button', { name: /export csv/i });
    fireEvent.click(exportButton);

    // Export API should be called
    await waitFor(() => {
      expect(clustersApi.exportAllClusters).toHaveBeenCalledWith('test-project', 'csv');
    });
  });

  it('handles empty state when no clusters', async () => {
    (clustersApi.getClusters as jest.Mock).mockResolvedValueOnce({ data: [] });

    render(<ClustersPage params={{ projectId: 'test-project' }} />);

    await waitFor(() => {
      expect(screen.getByText('No clusters found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your filters or upload keyword data to see clusters.')).toBeInTheDocument();
    });

    // Summary should show zeros
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    (clustersApi.getClusters as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<ClustersPage params={{ projectId: 'test-project' }} />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load clusters')).toBeInTheDocument();
    });
  });

  it('shows charts in summary when clusters exist', async () => {
    render(<ClustersPage params={{ projectId: 'test-project' }} />);

    await waitFor(() => {
      expect(screen.getByText('Opportunity Distribution')).toBeInTheDocument();
      expect(screen.getByText('Top Clusters by Volume')).toBeInTheDocument();
    });
  });
});