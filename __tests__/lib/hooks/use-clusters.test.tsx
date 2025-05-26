import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useClusters, useClusterDetails, useExportCluster, useExportAllClusters } from '@/lib/hooks/use-clusters';
import { clustersApi } from '@/lib/api/clusters';
import type { ReactNode } from 'react';

// Mock the API module
jest.mock('@/lib/api/clusters');

const mockedClustersApi = clustersApi as jest.Mocked<typeof clustersApi>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useClusters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches clusters successfully', async () => {
    const mockClusters = {
      data: [
        { id: '1', name: 'Cluster 1' },
        { id: '2', name: 'Cluster 2' }
      ]
    };

    mockedClustersApi.getClusters.mockResolvedValueOnce(mockClusters);

    const { result } = renderHook(
      () => useClusters('project-1'),
      { wrapper: createWrapper() }
    );

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for success
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockClusters);
    });

    expect(mockedClustersApi.getClusters).toHaveBeenCalledWith('project-1', undefined, undefined);
  });

  it('fetches clusters with filters and sort', async () => {
    const filters = { search: 'seo', minVolume: 1000 };
    const sort = { field: 'name' as const, order: 'asc' as const };

    mockedClustersApi.getClusters.mockResolvedValueOnce({ data: [] });

    renderHook(
      () => useClusters('project-1', filters, sort),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(mockedClustersApi.getClusters).toHaveBeenCalledWith('project-1', filters, sort);
    });
  });

  it('does not fetch when projectId is missing', () => {
    renderHook(
      () => useClusters(''),
      { wrapper: createWrapper() }
    );

    expect(mockedClustersApi.getClusters).not.toHaveBeenCalled();
  });
});

describe('useClusterDetails', () => {
  it('fetches cluster details successfully', async () => {
    const mockCluster = { 
      data: { id: '1', name: 'Cluster 1', keywords: [] } 
    };

    mockedClustersApi.getClusterDetails.mockResolvedValueOnce(mockCluster);

    const { result } = renderHook(
      () => useClusterDetails('project-1', 'cluster-1'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockCluster);
    });

    expect(mockedClustersApi.getClusterDetails).toHaveBeenCalledWith('project-1', 'cluster-1');
  });

  it('does not fetch when ids are missing', () => {
    const { result: noProject } = renderHook(
      () => useClusterDetails('', 'cluster-1'),
      { wrapper: createWrapper() }
    );

    const { result: noCluster } = renderHook(
      () => useClusterDetails('project-1', ''),
      { wrapper: createWrapper() }
    );

    expect(mockedClustersApi.getClusterDetails).not.toHaveBeenCalled();
  });
});

describe('useExportCluster', () => {
  it('exports cluster successfully', async () => {
    mockedClustersApi.exportCluster.mockResolvedValueOnce(undefined);

    const { result } = renderHook(
      () => useExportCluster(),
      { wrapper: createWrapper() }
    );

    result.current.mutate({
      projectId: 'project-1',
      clusterId: 'cluster-1',
      format: 'csv'
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedClustersApi.exportCluster).toHaveBeenCalledWith('project-1', 'cluster-1', 'csv');
  });

  it('handles export error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockedClustersApi.exportCluster.mockRejectedValueOnce(new Error('Export failed'));

    const { result } = renderHook(
      () => useExportCluster(),
      { wrapper: createWrapper() }
    );

    result.current.mutate({
      projectId: 'project-1',
      clusterId: 'cluster-1',
      format: 'xlsx'
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to export cluster:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});

describe('useExportAllClusters', () => {
  it('exports all clusters successfully', async () => {
    mockedClustersApi.exportAllClusters.mockResolvedValueOnce(undefined);

    const { result } = renderHook(
      () => useExportAllClusters(),
      { wrapper: createWrapper() }
    );

    result.current.mutate({
      projectId: 'project-1',
      format: 'csv'
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedClustersApi.exportAllClusters).toHaveBeenCalledWith('project-1', 'csv');
  });
});