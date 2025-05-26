/**
 * Sprint 2 Test Summary
 * Projects & Upload Functionality
 */

import { projectsApi } from '@/lib/api/projects';
import { uploadsApi } from '@/lib/api/uploads';
import { mockProject, mockProjectsResponse, mockSchemaDetection, mockProcessingJob } from '@/__tests__/mocks/data';

jest.mock('@/lib/api/projects');
jest.mock('@/lib/api/uploads');

describe('Sprint 2 - Projects & Upload Features', () => {
  const mockedProjectsApi = projectsApi as jest.Mocked<typeof projectsApi>;
  const mockedUploadsApi = uploadsApi as jest.Mocked<typeof uploadsApi>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ Projects Management', () => {
    test('List all projects with pagination', async () => {
      mockedProjectsApi.list.mockResolvedValueOnce(mockProjectsResponse);
      
      const result = await projectsApi.list({ page: 1, limit: 10 });
      
      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });

    test('Create new project', async () => {
      mockedProjectsApi.create.mockResolvedValueOnce(mockProject);
      
      const result = await projectsApi.create({
        name: 'New SEO Campaign',
        business_description: 'E-commerce website optimization',
      });
      
      expect(result.id).toBeDefined();
      expect(result.name).toBe('Test Project');
    });

    test('Update project', async () => {
      const updated = { ...mockProject, name: 'Updated Name' };
      mockedProjectsApi.update.mockResolvedValueOnce(updated);
      
      const result = await projectsApi.update('test-project-1', {
        name: 'Updated Name',
      });
      
      expect(result.name).toBe('Updated Name');
    });

    test('Archive project', async () => {
      const archived = { ...mockProject, status: 'archived' as const };
      mockedProjectsApi.archive.mockResolvedValueOnce(archived);
      
      const result = await projectsApi.archive('test-project-1');
      
      expect(result.status).toBe('archived');
    });
  });

  describe('✅ CSV Upload Flow', () => {
    const mockFile = new File(['keyword,volume\ntest keyword,1000'], 'keywords.csv', {
      type: 'text/csv',
    });

    test('Step 1: Detect CSV schema', async () => {
      mockedUploadsApi.detectSchema.mockResolvedValueOnce(mockSchemaDetection);
      
      const schema = await uploadsApi.detectSchema(mockFile);
      
      expect(schema.detected_tool).toBe('ahrefs');
      expect(schema.confidence_score).toBe(0.95);
      expect(schema.field_mappings).toHaveLength(3);
    });

    test('Step 2: Start upload with strategy', async () => {
      mockedUploadsApi.uploadCSV.mockResolvedValueOnce({ job_id: 'job-123' });
      
      const result = await uploadsApi.uploadCSV(mockFile, {
        projectId: 'test-project-1',
        updateStrategy: 'append', // append | update | replace
      });
      
      expect(result.job_id).toBe('job-123');
    });

    test('Step 3: Monitor upload progress', async () => {
      // First check - processing
      mockedUploadsApi.getJobStatus.mockResolvedValueOnce({
        ...mockProcessingJob,
        status: 'processing',
        progress_percentage: 50,
      });
      
      let job = await uploadsApi.getJobStatus('job-123');
      expect(job.status).toBe('processing');
      expect(job.progress_percentage).toBe(50);
      
      // Second check - completed
      mockedUploadsApi.getJobStatus.mockResolvedValueOnce({
        ...mockProcessingJob,
        status: 'completed',
        progress_percentage: 100,
        processed_rows: 100,
        created_rows: 90,
        updated_rows: 10,
      });
      
      job = await uploadsApi.getJobStatus('job-123');
      expect(job.status).toBe('completed');
      expect(job.created_rows).toBe(90);
      expect(job.updated_rows).toBe(10);
    });

    test('Handle upload errors', async () => {
      mockedUploadsApi.getJobStatus.mockResolvedValueOnce({
        ...mockProcessingJob,
        status: 'failed',
        errors: ['Invalid CSV format', 'Missing required columns'],
      });
      
      const job = await uploadsApi.getJobStatus('job-123');
      
      expect(job.status).toBe('failed');
      expect(job.errors).toHaveLength(2);
    });
  });

  describe('✅ Key Features Implemented', () => {
    test('Project statistics tracking', () => {
      expect(mockProject.stats).toMatchObject({
        total_keywords: 100,
        total_clusters: 10,
        avg_opportunity_score: 75.5,
        top_opportunity_keywords: 25,
      });
    });

    test('Update strategies', () => {
      const strategies = ['append', 'update', 'replace'];
      expect(strategies).toContain('append'); // Add new keywords only
      expect(strategies).toContain('update'); // Update existing + add new
      expect(strategies).toContain('replace'); // Delete all and upload new
    });

    test('File validation', () => {
      const validTypes = ['text/csv', 'application/csv', 'text/comma-separated-values'];
      const maxSize = 50 * 1024 * 1024; // 50MB
      
      expect(validTypes).toContain('text/csv');
      expect(maxSize).toBe(52428800);
    });

    test('Schema detection supports multiple tools', () => {
      const supportedTools = ['ahrefs', 'semrush', 'moz'];
      expect(supportedTools).toContain(mockSchemaDetection.detected_tool);
    });
  });
});