import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  useProjects, 
  useProject, 
  useCreateProject,
  useUpdateProject,
  useArchiveProject,
  useDeleteProject 
} from '@/lib/hooks/use-projects';
import { projectsApi } from '@/lib/api/projects';
import { mockProject, mockProjectsResponse } from '@/__tests__/mocks/data';

// Mock the API
jest.mock('@/lib/api/projects');

describe('useProjects hooks', () => {
  let queryClient: QueryClient;
  const mockedProjectsApi = projectsApi as jest.Mocked<typeof projectsApi>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('useProjects', () => {
    it('should fetch projects list', async () => {
      mockedProjectsApi.list.mockResolvedValueOnce(mockProjectsResponse);

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProjectsResponse);
      expect(mockedProjectsApi.list).toHaveBeenCalledWith(undefined);
    });

    it('should fetch projects with params', async () => {
      mockedProjectsApi.list.mockResolvedValueOnce(mockProjectsResponse);

      const params = { page: 2, limit: 20 };
      const { result } = renderHook(() => useProjects(params), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedProjectsApi.list).toHaveBeenCalledWith(params);
    });
  });

  describe('useProject', () => {
    it('should fetch a single project', async () => {
      mockedProjectsApi.get.mockResolvedValueOnce(mockProject);

      const { result } = renderHook(() => useProject('test-project-1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProject);
      expect(mockedProjectsApi.get).toHaveBeenCalledWith('test-project-1');
    });

    it('should not fetch if id is undefined', () => {
      const { result } = renderHook(() => useProject(undefined), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(mockedProjectsApi.get).not.toHaveBeenCalled();
    });
  });

  describe('useCreateProject', () => {
    it('should create a project', async () => {
      mockedProjectsApi.create.mockResolvedValueOnce(mockProject);

      const { result } = renderHook(() => useCreateProject(), { wrapper });

      await result.current.mutateAsync({
        name: 'New Project',
        business_description: 'New description',
      });

      expect(mockedProjectsApi.create).toHaveBeenCalledWith({
        name: 'New Project',
        business_description: 'New description',
      });

      // Check that the API was called
      expect(mockedProjectsApi.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('useUpdateProject', () => {
    it('should update a project', async () => {
      const updatedProject = { ...mockProject, name: 'Updated Name' };
      mockedProjectsApi.update.mockResolvedValueOnce(updatedProject);

      const { result } = renderHook(() => useUpdateProject('test-project-1'), { wrapper });

      await result.current.mutateAsync({ name: 'Updated Name' });

      expect(mockedProjectsApi.update).toHaveBeenCalledWith('test-project-1', {
        name: 'Updated Name',
      });
    });
  });

  describe('useArchiveProject', () => {
    it('should archive a project', async () => {
      const archivedProject = { ...mockProject, status: 'archived' as const };
      mockedProjectsApi.archive.mockResolvedValueOnce(archivedProject);

      const { result } = renderHook(() => useArchiveProject(), { wrapper });

      await result.current.mutateAsync('test-project-1');

      expect(mockedProjectsApi.archive).toHaveBeenCalledWith('test-project-1');
    });
  });

  describe('useDeleteProject', () => {
    it('should delete a project', async () => {
      mockedProjectsApi.delete.mockResolvedValueOnce();

      const { result } = renderHook(() => useDeleteProject(), { wrapper });

      await result.current.mutateAsync('test-project-1');

      expect(mockedProjectsApi.delete).toHaveBeenCalledWith('test-project-1');
    });
  });
});