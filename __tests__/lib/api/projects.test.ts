import { projectsApi } from '@/lib/api/projects';
import { apiClient } from '@/lib/api/client';
import { mockProject, mockProjectsResponse } from '@/__tests__/mocks/data';

// Mock the API client
jest.mock('@/lib/api/client');

describe('projectsApi', () => {
  const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should fetch projects list without params', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ data: mockProjectsResponse });

      const result = await projectsApi.list();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/projects', { params: undefined });
      expect(result).toEqual(mockProjectsResponse);
    });

    it('should fetch projects list with params', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ data: mockProjectsResponse });

      const params = { page: 2, limit: 20, status: 'active' as const };
      const result = await projectsApi.list(params);

      expect(mockedApiClient.get).toHaveBeenCalledWith('/projects', { params });
      expect(result).toEqual(mockProjectsResponse);
    });
  });

  describe('get', () => {
    it('should fetch a single project', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ 
        data: { data: mockProject, status: 'success' } 
      });

      const result = await projectsApi.get('test-project-1');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/projects/test-project-1');
      expect(result).toEqual(mockProject);
    });
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const createData = {
        name: 'New Project',
        business_description: 'New description',
      };
      
      mockedApiClient.post.mockResolvedValueOnce({ 
        data: { data: mockProject, status: 'success' } 
      });

      const result = await projectsApi.create(createData);

      expect(mockedApiClient.post).toHaveBeenCalledWith('/projects', createData);
      expect(result).toEqual(mockProject);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const updateData = {
        name: 'Updated Project',
        status: 'archived' as const,
      };
      
      mockedApiClient.patch.mockResolvedValueOnce({ 
        data: { data: { ...mockProject, ...updateData }, status: 'success' } 
      });

      const result = await projectsApi.update('test-project-1', updateData);

      expect(mockedApiClient.patch).toHaveBeenCalledWith('/projects/test-project-1', updateData);
      expect(result.name).toBe('Updated Project');
    });
  });

  describe('archive', () => {
    it('should archive a project', async () => {
      const archivedProject = { ...mockProject, status: 'archived' as const };
      
      mockedApiClient.post.mockResolvedValueOnce({ 
        data: { data: archivedProject, status: 'success' } 
      });

      const result = await projectsApi.archive('test-project-1');

      expect(mockedApiClient.post).toHaveBeenCalledWith('/projects/test-project-1/archive');
      expect(result.status).toBe('archived');
    });
  });

  describe('delete', () => {
    it('should delete a project', async () => {
      mockedApiClient.delete.mockResolvedValueOnce({ data: null });

      await projectsApi.delete('test-project-1');

      expect(mockedApiClient.delete).toHaveBeenCalledWith('/projects/test-project-1');
    });
  });
});