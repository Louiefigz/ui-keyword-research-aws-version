import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardPage from '@/app/projects/[projectId]/dashboard/page';
import { getKeywords, getProjectStats } from '@/lib/api/keywords';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useParams: () => ({ projectId: 'test-project-123' }),
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/projects/test-project-123/dashboard',
}));

// Mock API calls
jest.mock('@/lib/api/keywords', () => ({
  getKeywords: jest.fn(),
  getProjectStats: jest.fn(),
  exportKeywords: jest.fn(),
}));

// Mock Zustand store
jest.mock('@/lib/store/dashboard-store', () => {
  const actualStore = jest.requireActual('zustand');
  return {
    useDashboardStore: actualStore.create(() => ({
      filters: {},
      sort: { field: 'total_points', direction: 'desc' },
      search: '',
      currentPage: 1,
      pageSize: 20,
      setFilters: jest.fn(),
      setSort: jest.fn(),
      setSearch: jest.fn(),
      setPage: jest.fn(),
      setPageSize: jest.fn(),
      resetFilters: jest.fn(),
    })),
  };
});

describe('Dashboard Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
          staleTime: 0,
        },
      },
    });
    jest.clearAllMocks();
  });

  const renderDashboard = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    );
  };

  it('should render dashboard with loading state', async () => {
    // Mock delayed responses
    (getProjectStats as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        projectId: 'test-project-123',
        totalKeywords: 0,
        aggregations: {
          totalVolume: 0,
          avgPosition: 0,
          opportunityDistribution: {},
          actionDistribution: {},
          intentDistribution: {},
          pointsDistribution: {},
          relevanceDistribution: {},
          trafficMetrics: {},
        },
      }), 100))
    );

    (getKeywords as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      }), 100))
    );

    renderDashboard();

    // Should show loading indicators
    expect(screen.getByText('Dashboard is loading...')).toBeInTheDocument();
    expect(screen.getByText('Stats loading: Yes, Keywords loading: Yes')).toBeInTheDocument();
  });

  it('should render dashboard with data', async () => {
    // Mock successful responses
    const mockStats = {
      projectId: 'test-project-123',
      totalKeywords: 150,
      aggregations: {
        totalVolume: 75000,
        avgPosition: 12.5,
        opportunityDistribution: {
          low_hanging: 25,
          existing: 40,
          clustering: 20,
          untapped: 15,
        },
        actionDistribution: {
          create: 60,
          optimize: 25,
          leave: 15,
        },
        intentDistribution: {
          informational: 50,
          commercial: 30,
          transactional: 20,
        },
        pointsDistribution: {},
        relevanceDistribution: {},
        trafficMetrics: {},
      },
    };

    const mockKeywords = {
      data: [
        {
          keyword_id: '1',
          keyword: 'test keyword 1',
          volume: 1000,
          kd: 45,
          cpc: 2.5,
          position: 5,
          url: 'https://example.com/page1',
          intent: 'informational',
          opportunity_type: 'low_hanging',
          action: 'optimize',
          sop_score: 85,
          relevance_score: 90,
          cluster_id: 'cluster-1',
          cluster_name: 'Test Cluster',
          is_primary_keyword: true,
          is_secondary_keyword: false,
        },
        {
          keyword_id: '2',
          keyword: 'test keyword 2',
          volume: 500,
          kd: 30,
          cpc: 1.5,
          position: null,
          url: null,
          intent: 'commercial',
          opportunity_type: 'untapped',
          action: 'create',
          sop_score: 70,
          relevance_score: 85,
          cluster_id: null,
          cluster_name: null,
          is_primary_keyword: false,
          is_secondary_keyword: false,
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 2,
        totalPages: 1,
      },
    };

    (getProjectStats as jest.Mock).mockResolvedValue(mockStats);
    (getKeywords as jest.Mock).mockResolvedValue(mockKeywords);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Stats loading: No, Keywords loading: No')).toBeInTheDocument();
    });

    // Check if stats are displayed (in DashboardSummary)
    await waitFor(() => {
      // Stats should be passed to DashboardSummary component
      expect(getProjectStats).toHaveBeenCalledWith('test-project-123');
    });

    // Check if keywords are displayed (in KeywordsDataTable)
    await waitFor(() => {
      expect(screen.getByText('test keyword 1')).toBeInTheDocument();
      expect(screen.getByText('test keyword 2')).toBeInTheDocument();
    });

    // Check if metadata is displayed
    expect(screen.getByText('Keywords Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Project ID: test-project-123')).toBeInTheDocument();
    expect(screen.getByText('Current page: 1, Page size: 20')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    const error = new Error('API Error');
    
    // Mock getProjectStats to return default values on error (as per the API implementation)
    (getProjectStats as jest.Mock).mockResolvedValue({
      projectId: 'test-project-123',
      totalKeywords: 0,
      aggregations: {
        totalVolume: 0,
        avgPosition: 0,
        opportunityDistribution: {},
        actionDistribution: {},
        intentDistribution: {},
        pointsDistribution: {},
        relevanceDistribution: {},
        trafficMetrics: {},
      },
    });
    
    // Mock getKeywords to return empty data on error (as per the API implementation)
    (getKeywords as jest.Mock).mockResolvedValue({
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    });

    renderDashboard();

    // Wait for both to finish loading
    await waitFor(() => {
      const loadingText = screen.getByText(/Stats loading: .*, Keywords loading: .*/);
      expect(loadingText).toHaveTextContent('Stats loading: No, Keywords loading: No');
    });

    // Should show empty state
    expect(screen.getByText('No keywords found')).toBeInTheDocument();
  });

  it('should pass correct parameters to API calls', async () => {
    (getProjectStats as jest.Mock).mockResolvedValue({
      projectId: 'test-project-123',
      totalKeywords: 0,
      aggregations: {
        totalVolume: 0,
        avgPosition: 0,
        opportunityDistribution: {},
        actionDistribution: {},
        intentDistribution: {},
        pointsDistribution: {},
        relevanceDistribution: {},
        trafficMetrics: {},
      },
    });

    (getKeywords as jest.Mock).mockResolvedValue({
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    });

    renderDashboard();

    await waitFor(() => {
      expect(getKeywords).toHaveBeenCalledWith({
        projectId: 'test-project-123',
        filters: { search: '' },
        sort: { field: 'total_points', direction: 'desc' },
        page: 1,
        limit: 20,
      });
    });
  });
});