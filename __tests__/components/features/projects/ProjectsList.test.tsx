import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectsList } from '@/components/features/projects/ProjectsList';
import { useProjects, useArchiveProject, useDeleteProject } from '@/lib/hooks/use-projects';
import { mockProjectsResponse } from '@/__tests__/mocks/data';
import { render } from '@/__tests__/test-utils';

// Mock the hooks
jest.mock('@/lib/hooks/use-projects');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
    forward: jest.fn(),
    back: jest.fn(),
    reload: jest.fn(),
  }),
}));

describe('ProjectsList', () => {
  const mockUseProjects = useProjects as jest.MockedFunction<typeof useProjects>;
  const mockUseArchiveProject = useArchiveProject as jest.MockedFunction<typeof useArchiveProject>;
  const mockUseDeleteProject = useDeleteProject as jest.MockedFunction<typeof useDeleteProject>;

  const mockArchiveMutate = jest.fn();
  const mockDeleteMutate = jest.fn();

  beforeEach(() => {
    mockUseArchiveProject.mockReturnValue({
      mutateAsync: mockArchiveMutate,
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
      data: undefined,
      isSuccess: false,
      reset: jest.fn(),
      status: 'idle',
      isIdle: true,
      variables: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      submittedAt: 0,
      context: undefined,
    } as ReturnType<typeof useArchiveProject>);
    
    mockUseDeleteProject.mockReturnValue({
      mutateAsync: mockDeleteMutate,
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
      data: undefined,
      isSuccess: false,
      reset: jest.fn(),
      status: 'idle',
      isIdle: true,
      variables: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      submittedAt: 0,
      context: undefined,
    } as ReturnType<typeof useDeleteProject>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading state', () => {
    mockUseProjects.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
      isError: false,
      isSuccess: false,
      status: 'pending',
      isPending: true,
      isFetching: true,
      isRefetching: false,
      isStale: false,
      isPlaceholderData: false,
      errorUpdateCount: 0,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      isInitialLoading: true,
      isFetchedAfterMount: false,
      isFetched: false,
      isLoading: true,
      isLoadingError: false,
      isRefetchError: false,
      isPaused: false,
      fetchStatus: 'fetching',
      promise: Promise.resolve(undefined),
    } as ReturnType<typeof useProjects>);

    render(<ProjectsList />);
    expect(screen.getByTestId('projects-loading')).toBeInTheDocument();
  });

  it('should display error state', () => {
    mockUseProjects.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load projects'),
      refetch: jest.fn(),
      isError: true,
      isSuccess: false,
      status: 'error',
      isPending: false,
      isFetching: false,
      isRefetching: false,
      isStale: false,
      isPlaceholderData: false,
      errorUpdateCount: 1,
      dataUpdatedAt: 0,
      errorUpdatedAt: Date.now(),
      failureCount: 1,
      failureReason: new Error('Failed to load projects'),
      isInitialLoading: false,
      isFetchedAfterMount: true,
      isFetched: true,
      isLoading: false,
      isLoadingError: true,
      isRefetchError: false,
      isPaused: false,
      fetchStatus: 'idle',
      promise: Promise.resolve(undefined),
    } as ReturnType<typeof useProjects>);

    render(<ProjectsList />);
    expect(screen.getByText('Failed to load projects')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should display empty state when no projects', () => {
    mockUseProjects.mockReturnValue({
      data: { data: [], total: 0, page: 1, limit: 10 },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isError: false,
      isSuccess: true,
      status: 'success',
      isPending: false,
      isFetching: false,
      isRefetching: false,
      isStale: false,
      isPlaceholderData: false,
      errorUpdateCount: 0,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      isInitialLoading: false,
      isFetchedAfterMount: true,
      isFetched: true,
      isLoading: false,
      isLoadingError: false,
      isRefetchError: false,
      isPaused: false,
      fetchStatus: 'idle',
      promise: Promise.resolve({ data: [], total: 0, page: 1, limit: 10 }),
    } as ReturnType<typeof useProjects>);

    render(<ProjectsList />);
    expect(screen.getByText('No projects yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first project to get started')).toBeInTheDocument();
  });

  it('should display projects grid', () => {
    mockUseProjects.mockReturnValue({
      data: mockProjectsResponse,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isError: false,
      isSuccess: true,
      status: 'success',
      isPending: false,
      isFetching: false,
      isRefetching: false,
      isStale: false,
      isPlaceholderData: false,
      errorUpdateCount: 0,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      isInitialLoading: false,
      isFetchedAfterMount: true,
      isFetched: true,
      isLoading: false,
      isLoadingError: false,
      isRefetchError: false,
      isPaused: false,
      fetchStatus: 'idle',
      promise: Promise.resolve(mockProjectsResponse),
    } as ReturnType<typeof useProjects>);

    render(<ProjectsList />);
    
    // Check if projects are displayed
    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText('Test business description 1')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument(); // keywords count
  });

  it('should handle project archive', async () => {
    const user = userEvent.setup();
    mockUseProjects.mockReturnValue({
      data: mockProjectsResponse,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isError: false,
      isSuccess: true,
      status: 'success',
      isPending: false,
      isFetching: false,
      isRefetching: false,
      isStale: false,
      isPlaceholderData: false,
      errorUpdateCount: 0,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      isInitialLoading: false,
      isFetchedAfterMount: true,
      isFetched: true,
      isLoading: false,
      isLoadingError: false,
      isRefetchError: false,
      isPaused: false,
      fetchStatus: 'idle',
      promise: Promise.resolve(mockProjectsResponse),
    } as ReturnType<typeof useProjects>);

    render(<ProjectsList />);

    // Click archive button
    const archiveButtons = screen.getAllByText('Archive');
    await user.click(archiveButtons[0]);

    expect(mockArchiveMutate).toHaveBeenCalledWith('project-1');
  });

  it('should handle project delete', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn().mockReturnValue(true);
    
    mockUseProjects.mockReturnValue({
      data: mockProjectsResponse,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isError: false,
      isSuccess: true,
      status: 'success',
      isPending: false,
      isFetching: false,
      isRefetching: false,
      isStale: false,
      isPlaceholderData: false,
      errorUpdateCount: 0,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      isInitialLoading: false,
      isFetchedAfterMount: true,
      isFetched: true,
      isLoading: false,
      isLoadingError: false,
      isRefetchError: false,
      isPaused: false,
      fetchStatus: 'idle',
      promise: Promise.resolve(mockProjectsResponse),
    } as ReturnType<typeof useProjects>);

    render(<ProjectsList />);

    // Click delete button
    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete this project? This action cannot be undone.'
    );
    expect(mockDeleteMutate).toHaveBeenCalledWith('project-1');
  });
});