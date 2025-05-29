import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  useStrategicAdvice, 
  useOpportunityAnalysis, 
  useExportStrategicAdvice,
  useInvalidateStrategicAdvice 
} from '@/lib/hooks/use-strategic-advice';
import * as strategicAdviceApi from '@/lib/api/strategic-advice';
import type { ReactNode } from 'react';

// Mock the API module
jest.mock('@/lib/api/strategic-advice');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  const TestWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

describe('useStrategicAdvice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches strategic advice successfully', async () => {
    const mockAdvice = {
      executive_summary: {
        current_state: { total_keywords_tracked: 500 },
        opportunity_summary: { immediate_opportunities: 23 },
        strategic_priorities: ['Priority 1'],
        expected_results: { '30_days': '+25%', '90_days': '+50%', '180_days': '+100%' }
      },
      immediate_opportunities: [],
      content_strategy: {},
      implementation_roadmap: []
    };

    (strategicAdviceApi.getStrategicAdvice as jest.Mock).mockResolvedValueOnce(mockAdvice);

    const { result } = renderHook(
      () => useStrategicAdvice('project-1'),
      { wrapper: createWrapper() }
    );

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for success
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockAdvice);
    });

    expect(strategicAdviceApi.getStrategicAdvice).toHaveBeenCalledWith('project-1', undefined);
  });

  it('fetches strategic advice with filters', async () => {
    const filters = { timeframe: '6_months' as const, priority_level: 'high' as const };

    (strategicAdviceApi.getStrategicAdvice as jest.Mock).mockResolvedValueOnce({});

    renderHook(
      () => useStrategicAdvice('project-1', filters),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(strategicAdviceApi.getStrategicAdvice).toHaveBeenCalledWith('project-1', filters);
    });
  });

  it('respects enabled option', () => {
    renderHook(
      () => useStrategicAdvice('project-1', undefined, { enabled: false }),
      { wrapper: createWrapper() }
    );

    expect(strategicAdviceApi.getStrategicAdvice).not.toHaveBeenCalled();
  });
});

describe('useOpportunityAnalysis', () => {
  it('fetches opportunity analysis successfully', async () => {
    const mockAnalysis = {
      opportunities: [{ id: '1', title: 'Opportunity 1' }],
      summary: { total_opportunities: 1 }
    };

    (strategicAdviceApi.getOpportunityAnalysis as jest.Mock).mockResolvedValueOnce(mockAnalysis);

    const { result } = renderHook(
      () => useOpportunityAnalysis('project-1'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockAnalysis);
    });

    expect(strategicAdviceApi.getOpportunityAnalysis).toHaveBeenCalledWith('project-1', undefined);
  });

  it('fetches with filters', async () => {
    const filters = { 
      opportunity_type: 'quick_wins' as const,
      min_impact_score: 70,
      limit: 10 
    };

    (strategicAdviceApi.getOpportunityAnalysis as jest.Mock).mockResolvedValueOnce({});

    renderHook(
      () => useOpportunityAnalysis('project-1', filters),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(strategicAdviceApi.getOpportunityAnalysis).toHaveBeenCalledWith('project-1', filters);
    });
  });
});

describe('useExportStrategicAdvice', () => {
  it('exports report successfully and triggers download', async () => {
    const mockBlob = new Blob(['test'], { type: 'application/pdf' });
    (strategicAdviceApi.exportStrategicAdviceReport as jest.Mock).mockResolvedValueOnce(mockBlob);

    // Mock URL and document methods
    const mockCreateObjectURL = jest.fn(() => 'blob:test');
    const mockRevokeObjectURL = jest.fn();
    const mockClick = jest.fn();
    const mockAppendChild = jest.fn();
    const mockRemoveChild = jest.fn();

    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;
    
    const mockLink = { 
      href: '', 
      download: '', 
      click: mockClick,
      setAttribute: jest.fn()
    };
    jest.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLElement);
    jest.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
    jest.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);

    const { result } = renderHook(
      () => useExportStrategicAdvice(),
      { wrapper: createWrapper() }
    );

    result.current.mutate({
      projectId: 'project-1',
      format: 'pdf'
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(strategicAdviceApi.exportStrategicAdviceReport).toHaveBeenCalledWith('project-1', 'pdf');
    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(mockLink.href).toBe('blob:test');
    expect(mockLink.download).toBe('strategic-advice-report.pdf');
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test');
  });

  it('handles export error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (strategicAdviceApi.exportStrategicAdviceReport as jest.Mock).mockRejectedValueOnce(new Error('Export failed'));

    const { result } = renderHook(
      () => useExportStrategicAdvice(),
      { wrapper: createWrapper() }
    );

    result.current.mutate({
      projectId: 'project-1',
      format: 'excel'
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(consoleSpy).toHaveBeenCalledWith('Export failed:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});

describe('useInvalidateStrategicAdvice', () => {
  it('invalidates queries for specific project', async () => {
    const queryClient = new QueryClient();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(
      () => useInvalidateStrategicAdvice(),
      { wrapper }
    );

    act(() => {
      result.current('project-1');
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['strategic-advice', 'project-1'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['opportunity-analysis', 'project-1'] });
  });

  it('invalidates all queries when no project specified', async () => {
    const queryClient = new QueryClient();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(
      () => useInvalidateStrategicAdvice(),
      { wrapper }
    );

    act(() => {
      result.current();
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['strategic-advice'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['opportunity-analysis'] });
  });
});