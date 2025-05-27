# UI Implementation Guide for Job-Based CSV Processing

## Overview

This guide details the implementation of job-based CSV processing for the frontend. The backend now creates and tracks jobs for CSV processing, allowing the UI to monitor progress and know when data is ready for display.

## API Flow

### 1. Upload CSV Files

**Endpoint**: `POST /api/v1/uploads/csv/upload-keywords`

**Request** (multipart/form-data):
```typescript
{
  project_id: string;
  organic_file?: File;
  content_gap_file?: File;
}
```

**Response** (202 Accepted):
```json
{
  "organic": {
    "status": "valid",
    "job_id": "upload-job-123",
    "filename": "organic.csv",
    "row_count": 1000,
    "headers": ["Keyword", "Search Volume", ...],
    "errors": [],
    "warnings": []
  },
  "content_gap": {
    "status": "valid",
    "job_id": "upload-job-456",
    "filename": "content_gap.csv",
    "row_count": 500,
    "headers": ["Keyword", "Volume", ...],
    "errors": [],
    "warnings": []
  },
  "summary": {
    "files_uploaded": 2,
    "project_id": "project-123",
    "all_valid": true,
    "job_id": "processing-job-789",
    "job_status": "pending",
    "processing_status": "job_created"
  }
}
```

**Key Changes**:
- Returns 202 Accepted (processing started) instead of 200 OK
- Includes `job_id` in the summary for tracking processing status
- `job_status` will be "pending" initially

### 2. Check Job Status

**Endpoint**: `GET /api/v1/jobs/{project_id}/{job_id}`

**Response**:
```json
{
  "id": "processing-job-789",
  "project_id": "project-123",
  "job_type": "CSV_PROCESSING",
  "status": "in_progress",
  "progress": {
    "current_step": "Processing keywords",
    "items_processed": 450,
    "total_items": 1500,
    "percentage": 30,
    "message": "Processing keyword batch 5 of 15"
  },
  "created_at": "2025-01-27T10:00:00Z",
  "updated_at": "2025-01-27T10:02:30Z",
  "started_at": "2025-01-27T10:00:05Z",
  "completed_at": null,
  "error": null,
  "result": null,
  "retry_count": 0,
  "max_retries": 3
}
```

**Status Values**:
- `pending`: Job created but not started
- `in_progress`: Job is actively processing
- `completed`: Job finished successfully
- `failed`: Job failed with error
- `cancelled`: Job was cancelled

### 3. Access Dashboard Data

Once job status is `completed`, dashboard endpoints will have data available:

**Keywords Dashboard**: `GET /api/v1/projects/{project_id}/dashboard/keywords`
**Summary Dashboard**: `GET /api/v1/projects/{project_id}/dashboard/summary`

## Frontend Implementation Steps

### Step 1: Upload Component

```typescript
// 1. Handle file upload
const uploadFiles = async (files: { organic?: File, contentGap?: File }) => {
  const formData = new FormData();
  formData.append('project_id', projectId);
  if (files.organic) formData.append('organic_file', files.organic);
  if (files.contentGap) formData.append('content_gap_file', files.contentGap);

  const response = await fetch('/api/v1/uploads/csv/upload-keywords', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  
  if (result.summary.job_id) {
    // Store job ID for status polling
    localStorage.setItem(`project_${projectId}_job`, result.summary.job_id);
    // Navigate to processing status page or show progress modal
    navigate(`/projects/${projectId}/processing/${result.summary.job_id}`);
  }
};
```

### Step 2: Job Status Polling

```typescript
// 2. Poll job status
const pollJobStatus = async (projectId: string, jobId: string) => {
  const interval = setInterval(async () => {
    try {
      const response = await fetch(`/api/v1/jobs/${projectId}/${jobId}`);
      const job = await response.json();

      // Update UI with progress
      updateProgress({
        step: job.progress.current_step,
        percentage: job.progress.percentage,
        message: job.progress.message
      });

      if (job.status === 'completed') {
        clearInterval(interval);
        // Navigate to dashboard
        navigate(`/projects/${projectId}/dashboard`);
      } else if (job.status === 'failed') {
        clearInterval(interval);
        // Show error message
        showError(job.error || 'Processing failed');
      }
    } catch (error) {
      console.error('Failed to check job status:', error);
    }
  }, 2000); // Poll every 2 seconds

  return interval;
};
```

### Step 3: Progress Display Component

```typescript
// 3. Progress display component
const ProcessingStatus = ({ projectId, jobId }) => {
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const intervalId = pollJobStatus(projectId, jobId);
    return () => clearInterval(intervalId);
  }, [projectId, jobId]);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!job) {
    return <Loading />;
  }

  return (
    <div className="processing-status">
      <h2>Processing CSV Files</h2>
      <ProgressBar value={job.progress.percentage} />
      <p>{job.progress.current_step}</p>
      <p>{job.progress.message}</p>
      <p>Processed: {job.progress.items_processed} / {job.progress.total_items}</p>
    </div>
  );
};
```

### Step 4: Dashboard Component Updates

```typescript
// 4. Update dashboard to check for processing status
const Dashboard = ({ projectId }) => {
  const [isDataReady, setIsDataReady] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if there's an active job
    const jobId = localStorage.getItem(`project_${projectId}_job`);
    
    if (jobId) {
      // Check job status
      checkJobStatus(projectId, jobId).then(job => {
        if (job.status === 'completed') {
          setIsDataReady(true);
          localStorage.removeItem(`project_${projectId}_job`);
        } else if (job.status === 'in_progress') {
          // Redirect to processing page
          navigate(`/projects/${projectId}/processing/${jobId}`);
        }
      });
    } else {
      // No active job, check if data exists
      checkDataAvailability(projectId).then(setIsDataReady);
    }
    
    setIsChecking(false);
  }, [projectId]);

  if (isChecking) return <Loading />;
  if (!isDataReady) return <NoDataMessage />;

  // Normal dashboard rendering
  return <DashboardContent projectId={projectId} />;
};
```

## Error Handling

### Upload Errors
```typescript
if (!result.summary.all_valid) {
  // Show validation errors
  const errors = [];
  if (result.organic?.errors) errors.push(...result.organic.errors);
  if (result.content_gap?.errors) errors.push(...result.content_gap.errors);
  showValidationErrors(errors);
  return;
}
```

### Job Failures
```typescript
if (job.status === 'failed') {
  // Check if retryable
  if (job.retry_count < job.max_retries) {
    // Show retry option
    showRetryOption(job);
  } else {
    // Show final failure message
    showFinalError(job.error);
  }
}
```

## Best Practices

1. **Persist Job IDs**: Store active job IDs in localStorage or state management to survive page refreshes

2. **Progressive Enhancement**: Show partial data as it becomes available if the backend supports it

3. **Timeout Handling**: Set a maximum polling duration (e.g., 10 minutes) to prevent infinite polling

4. **User Feedback**: Always show clear status messages and progress indicators

5. **Error Recovery**: Provide options to retry failed jobs or upload new files

## Example User Flow

1. User uploads CSV files on upload page
2. System creates job and returns job ID
3. UI redirects to processing status page
4. Progress bar shows real-time updates
5. On completion, auto-redirect to dashboard
6. Dashboard shows processed keyword data

## Additional Considerations

### Cancellation
```typescript
const cancelJob = async (projectId: string, jobId: string) => {
  await fetch(`/api/v1/jobs/${projectId}/${jobId}/cancel`, {
    method: 'POST'
  });
};
```

### Resume Failed Jobs
```typescript
const resumeJob = async (projectId: string, jobId: string) => {
  await fetch(`/api/v1/jobs/${projectId}/${jobId}/resume`, {
    method: 'POST'
  });
};
```

### Background Notifications
Consider using browser notifications or toast messages to notify users when long-running jobs complete, especially if they navigate away from the processing page.

## API Endpoints Summary

1. **Upload**: `POST /api/v1/uploads/csv/upload-keywords` → Returns job ID
2. **Job Status**: `GET /api/v1/jobs/{project_id}/{job_id}` → Check progress
3. **Dashboard**: `GET /api/v1/projects/{project_id}/dashboard/keywords` → View results
4. **Summary**: `GET /api/v1/projects/{project_id}/dashboard/summary` → View summary

## Testing the Implementation

1. Upload small test files first to verify the flow
2. Test with larger files to see progress updates
3. Test error scenarios (invalid CSV, network interruption)
4. Test browser refresh during processing
5. Test multiple concurrent uploads