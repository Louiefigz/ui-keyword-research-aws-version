import { uploadsApi } from '@/lib/api/uploads';
import { apiClient } from '@/lib/api/client';
import { mockSchemaDetection, mockProcessingJob, mockFile } from '@/__tests__/mocks/data';

jest.mock('@/lib/api/client');

describe('uploadsApi', () => {
  const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('detectSchema', () => {
    it('should detect CSV schema', async () => {
      mockedApiClient.post.mockResolvedValueOnce({ 
        data: { data: mockSchemaDetection, status: 'success' } 
      });

      const result = await uploadsApi.detectSchema(mockFile);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        '/uploads/detect-schema',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Check FormData was created correctly
      const formDataCall = mockedApiClient.post.mock.calls[0][1] as FormData;
      expect(formDataCall).toBeInstanceOf(FormData);
      
      expect(result).toEqual(mockSchemaDetection);
    });
  });

  describe('uploadCSV', () => {
    it('should upload CSV file', async () => {
      const uploadOptions = {
        projectId: 'test-project-1',
        updateStrategy: 'append' as const,
      };
      
      mockedApiClient.post.mockResolvedValueOnce({ 
        data: { data: { job_id: 'test-job-1' }, status: 'success' } 
      });

      const result = await uploadsApi.uploadCSV(mockFile, uploadOptions);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        '/uploads/process',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      expect(result).toEqual({ job_id: 'test-job-1' });
    });
  });

  describe('getJobStatus', () => {
    it('should get job status', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ 
        data: { data: mockProcessingJob, status: 'success' } 
      });

      const result = await uploadsApi.getJobStatus('test-job-1');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/uploads/jobs/test-job-1');
      expect(result).toEqual(mockProcessingJob);
    });
  });

  describe('cancelJob', () => {
    it('should cancel a job', async () => {
      mockedApiClient.post.mockResolvedValueOnce({ data: null });

      await uploadsApi.cancelJob('test-job-1');

      expect(mockedApiClient.post).toHaveBeenCalledWith('/uploads/jobs/test-job-1/cancel');
    });
  });
});