import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useKeywords, useDashboard, useProjectStats } from '@/lib/hooks/use-keywords';
import { getKeywords, getProjectStats } from '@/lib/api/keywords';
import React from 'react';

// Mock the API functions
jest.mock('@/lib/api/keywords', () => ({
  getKeywords: jest.fn(),
  getProjectStats: jest.fn(),
  exportKeywords: jest.fn(),
}));

// Create wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useKeywords', () => {
  const mockProjectId = 'test-project-id';
  const mockKeywordsResponse = {
    data: [
      {
        keyword_id: '1',
        keyword: 'test keyword',
        volume: 1000,
        kd: 50,
        cpc: 2.5,
        position: 5,
        url: 'https://example.com',
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
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch keywords with default parameters', async () => {
    (getKeywords as jest.Mock).mockResolvedValue(mockKeywordsResponse);

    const { result } = renderHook(
      () => useKeywords({ projectId: mockProjectId }),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getKeywords).toHaveBeenCalledWith({
      projectId: mockProjectId,
    });
    expect(result.current.data).toEqual(mockKeywordsResponse);
  });

  it('should fetch keywords with filters and pagination', async () => {
    (getKeywords as jest.Mock).mockResolvedValue(mockKeywordsResponse);

    const filters = {
      search: 'test',
      minVolume: 100,
      opportunityLevel: ['low_hanging' as const],
    };
    const sort = { field: 'volume' as const, direction: 'desc' as const };
    const page = 2;
    const limit = 50;

    const { result } = renderHook(
      () => useKeywords({ projectId: mockProjectId, filters, sort, page, limit }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getKeywords).toHaveBeenCalledWith({
      projectId: mockProjectId,
      filters,
      sort,
      page,
      limit,
    });
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('API Error');
    (getKeywords as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(
      () => useKeywords({ projectId: mockProjectId }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 3000 });

    expect(result.current.error).toEqual(error);
  });
});

describe('useProjectStats', () => {
  const mockProjectId = 'test-project-id';
  const mockStatsResponse = {
    projectId: mockProjectId,
    totalKeywords: 100,
    aggregations: {
      totalVolume: 50000,
      avgPosition: 15.5,
      opportunityDistribution: {
        low_hanging: 20,
        existing: 30,
        clustering: 25,
        untapped: 25,
      },
      actionDistribution: {
        create: 40,
        optimize: 30,
        leave: 30,
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch project stats', async () => {
    (getProjectStats as jest.Mock).mockResolvedValue(mockStatsResponse);

    const { result } = renderHook(
      () => useProjectStats(mockProjectId),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getProjectStats).toHaveBeenCalledWith(mockProjectId);
    expect(result.current.data).toEqual(mockStatsResponse);
  });
});

describe('useDashboard', () => {
  const mockProjectId = 'test-project-id';
  const mockStatsResponse = {
    projectId: mockProjectId,
    totalKeywords: 100,
    aggregations: {
      totalVolume: 50000,
      avgPosition: 15.5,
      opportunityDistribution: {},
      actionDistribution: {},
      intentDistribution: {},
      pointsDistribution: {},
      relevanceDistribution: {},
      trafficMetrics: {},
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide dashboard data and operations', async () => {
    (getProjectStats as jest.Mock).mockResolvedValue(mockStatsResponse);

    const { result } = renderHook(
      () => useDashboard(mockProjectId),
      { wrapper: createWrapper() }
    );

    expect(result.current.statsLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.statsLoading).toBe(false);
    });

    expect(result.current.stats).toEqual(mockStatsResponse);
    expect(typeof result.current.exportKeywords).toBe('function');
    expect(typeof result.current.exportKeywordsAsync).toBe('function');
    expect(typeof result.current.refetchStats).toBe('function');
  });
});