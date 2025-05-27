# Frontend Job Processing Integration Guide

## ⚠️ CRITICAL: Job Status Case Sensitivity

**Job status values are ALWAYS lowercase and case-sensitive!**

```typescript
// ✅ CORRECT - will work
if (job.status === 'completed') { }
if (job.status === 'failed') { }
if (job.status === 'pending') { }
if (job.status === 'in_progress') { }
if (job.status === 'cancelled') { }

// ❌ WRONG - will NEVER match!
if (job.status === 'COMPLETED') { }
if (job.status === 'Completed') { }
if (job.status === 'PENDING') { }
```

**This is the #1 cause of infinite polling loops!** If you use the wrong case, your code will never detect when the job completes.

## Overview
The backend now uses a job-based asynchronous processing system for CSV uploads. This guide covers everything the frontend needs to know for proper integration.

## Key Changes from Previous Implementation

### Before (Direct Processing)
- Upload endpoint returned 200 OK immediately
- No way to track processing progress
- No way to know when data was ready

### Now (Job-Based Processing)
- Upload endpoint returns 202 Accepted with job details
- Poll job status endpoint to track progress
- Navigate to dashboard when job completes

## API Endpoints

### 1. Upload CSV Files
```typescript
POST /api/v1/uploads/csv/upload-keywords

// Request (multipart/form-data)
const formData = new FormData();
formData.append('project_id', projectId);
formData.append('organic_file', organicFile);          // Optional
formData.append('content_gap_file', contentGapFile);  // Optional
// Note: At least one file must be provided

// Response (202 Accepted)
{
  "organic": {
    "status": "valid",
    "job_id": "upload-job-123",
    "filename": "organic.csv",
    "row_count": 45,
    "headers": ["Keyword", "Search Volume", "Position", ...],
    "errors": [],
    "warnings": []
  },
  "content_gap": {
    "status": "valid",
    "job_id": "upload-job-456",
    "filename": "content_gap.csv",
    "row_count": 30,
    "headers": ["Keyword", "Search Volume", ...],
    "errors": [],
    "warnings": []
  },
  "summary": {
    "files_uploaded": 2,
    "project_id": "test-project",
    "all_valid": true,
    "job_id": "952c4fc8-7ae6-4d3b-921a-c25844e3cfa1",
    "job_status": "pending",
    "processing_status": "job_created"
  }
}
```

**IMPORTANT**: The response status is `202 Accepted`, not `200 OK`. Update your error handling to accept 202 as a success status.

### 2. Check Job Status
```typescript
GET /api/v1/jobs/{project_id}/{job_id}

// Response
{
  "job_id": "952c4fc8-7ae6-4d3b-921a-c25844e3cfa1",
  "project_id": "test-project",
  "job_type": "csv_processing",
  "status": "completed", // ALWAYS lowercase: "pending" | "in_progress" | "completed" | "failed" | "cancelled"
  "progress": {
    "current_step": "Processing keywords",
    "items_processed": 45,
    "total_items": 45,
    "percentage_complete": 100.0
  },
  "created_at": "2025-05-27T10:30:00Z",
  "updated_at": "2025-05-27T10:30:01Z",
  "result": {
    "processed_keywords": 45,
    "failed_keywords": 0
  },
  "error": null // Will contain error details if status is "failed"
}
```

## Complete Integration Example

```typescript
interface UploadResponse {
  summary: {
    job_id: string;
    job_status: string;
  };
}

interface JobStatus {
  job_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';  // ALWAYS lowercase
  progress?: {
    percentage_complete: number;
    current_step: string;
  };
  error?: any;
}

class CSVUploadService {
  private pollInterval: NodeJS.Timeout | null = null;

  async uploadFiles(projectId: string, organicFile: File, contentGapFile?: File) {
    try {
      // 1. Upload files
      const formData = new FormData();
      formData.append('project_id', projectId);
      formData.append('organic_file', organicFile);
      if (contentGapFile) {
        formData.append('content_gap_file', contentGapFile);
      }

      const uploadResponse = await fetch('/api/v1/uploads/csv/upload-keywords', {
        method: 'POST',
        body: formData,
      });

      // IMPORTANT: Accept 202 status
      if (!uploadResponse.ok && uploadResponse.status !== 202) {
        throw new Error('Upload failed');
      }

      const data: UploadResponse = await uploadResponse.json();
      
      // 2. Start polling job status
      await this.pollJobStatus(projectId, data.summary.job_id);
      
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  private async pollJobStatus(projectId: string, jobId: string) {
    let pollCount = 0;
    const maxPolls = 240; // 2 minutes max (240 * 500ms)
    
    this.pollInterval = setInterval(async () => {
      try {
        pollCount++;
        
        const response = await fetch(`/api/v1/jobs/${projectId}/${jobId}`);
        const job: JobStatus = await response.json();
        
        // Update UI with progress
        this.updateProgress(job);
        
        // Check for terminal states (MUST be lowercase!)
        if (job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') {
          this.stopPolling();
          
          if (job.status === 'completed') {
            this.onJobComplete(projectId);
          } else if (job.status === 'failed') {
            this.onJobFailed(job.error);
          } else if (job.status === 'cancelled') {
            this.onJobCancelled();
          }
          return;
        }
        
        // Timeout check
        if (pollCount >= maxPolls) {
          this.stopPolling();
          this.onJobTimeout();
        }
        
      } catch (error) {
        console.error('Polling error:', error);
        this.stopPolling();
        this.onPollingError(error);
      }
    }, 500); // Poll every 500ms
  }

  private stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  private updateProgress(job: JobStatus) {
    // Update your UI progress bar/status
    if (job.progress) {
      console.log(`Progress: ${job.progress.percentage_complete}% - ${job.progress.current_step}`);
    }
  }

  private onJobComplete(projectId: string) {
    // Navigate to dashboard
    window.location.href = `/dashboard/${projectId}`;
  }

  private onJobFailed(error: any) {
    // Show error message to user
    alert(`Processing failed: ${error?.message || 'Unknown error'}`);
  }

  private onJobTimeout() {
    // Handle timeout
    alert('Processing is taking longer than expected. Please try again.');
  }

  private onPollingError(error: any) {
    // Handle polling errors
    alert('Failed to check processing status. Please refresh the page.');
  }

  private onJobCancelled() {
    // Handle cancelled job
    alert('Processing was cancelled.');
  }
}
```

## Important Integration Notes

### 1. **Accept 202 Status Code**
The upload endpoint returns `202 Accepted`, not `200 OK`. Make sure your error handling doesn't treat 202 as an error.

### 2. **Stop Polling on Completion**
**CRITICAL**: Always check for terminal states (`completed` or `failed`) and stop polling. Not doing this causes the infinite loop issue.

**IMPORTANT - Case Sensitivity**: Job status values are ALWAYS lowercase. The comparison is case-sensitive:
```typescript
// ✅ CORRECT
if (job.status === 'completed') { }
if (job.status === 'failed') { }

// ❌ WRONG - Will never match!
if (job.status === 'COMPLETED') { }
if (job.status === 'Completed') { }
```

### 3. **Handle All Job States**
All status values are **lowercase** and case-sensitive:
- `pending`: Job created, waiting to start
- `in_progress`: Job is actively processing  
- `completed`: Job finished successfully, safe to navigate to dashboard
- `failed`: Job encountered an error, check `error` field
- `cancelled`: Job was cancelled (rare, but possible)

### 4. **Timeout Handling**
Implement a maximum polling duration (e.g., 2 minutes) to prevent infinite polling in case of unexpected issues.

### 5. **Progress Updates**
Use the `progress` field to show meaningful updates to users:
- percentage_complete: 0-100
- current_step: Human-readable description of what's happening
- items_processed: Number of keywords processed so far
- total_items: Total number of keywords to process

### 6. **Error Handling**
- Network errors during polling
- Job failures (check job.error field)
- Timeout scenarios
- Invalid job IDs
- File validation errors (check upload response for validation errors/warnings)

### 7. **File Validation**
The upload endpoint validates files before creating jobs. Check the response:
- If `summary.all_valid` is false, show validation errors to user
- Individual file validation results are in `organic` and `content_gap` objects
- Common validation errors: wrong file type, invalid encoding, missing required columns

### 8. **Authentication**
All endpoints require authentication. Include your auth token in requests:
```typescript
headers: {
  'Authorization': `Bearer ${authToken}`
}
```

## Testing Checklist

- [ ] Upload succeeds with 202 status
- [ ] Polling starts automatically after upload
- [ ] Progress updates show in UI
- [ ] Polling stops when job completes
- [ ] Navigation to dashboard happens after completion
- [ ] Error messages show for failed jobs
- [ ] Timeout handling works after max duration
- [ ] Network errors during polling are handled gracefully

## Common Issues and Solutions

### Issue: "Infinite polling loop"
**Solution**: 
1. Ensure you're checking for `completed` and `failed` states and calling `clearInterval()`
2. **VERIFY CASE**: Job status is lowercase! `'completed'` not `'COMPLETED'` or `'Completed'`
3. Check all terminal states: `'completed'`, `'failed'`, and `'cancelled'`

### Issue: "Upload fails with 202 status"
**Solution**: Update error handling to accept 202 as success: `if (!response.ok && response.status !== 202)`

### Issue: "Can't access dashboard after upload"
**Solution**: Only navigate to dashboard when `job.status === 'completed'`

### Issue: "No progress updates"
**Solution**: Check the `job.progress` field in each poll response

## Dashboard Endpoints

After job completion, you can access the processed data through these endpoints:

### Understanding Opportunity Categories and Actions

The system automatically categorizes keywords based on their current search position:

**Opportunity Categories:**
- `success`: Keywords at position #1 (already winning)
- `low-hanging-fruit`: Keywords at positions #2-15 (easy optimization targets)
- `existing`: Keywords at positions #16-50 (established but need improvement)
- `clustering-opportunity`: Keywords at positions #51-100 (potential for topic clustering)
- `untapped`: Keywords not in top 100 or no position (new content opportunities)

**Recommended Actions:**
- `leave-as-is`: For position #1 keywords (maintain current strategy)
- `optimize`: For positions #2-15 (minor improvements for quick wins)
- `upgrade`: For positions #16-50 (significant content improvements needed)
- `create`: For positions >50 or non-existent (create new content)

### 1. Dashboard Summary
```typescript
GET /api/v1/projects/{project_id}/dashboard/summary

// Response
{
  "project_id": "7fa43150-80f9-4462-91f1-a9560b40ba02",
  "total_keywords": 45,
  "aggregations": {
    "total_volume": 150000,
    "avg_position": 12.3,
    "opportunity_distribution": {
      "success": 5,
      "low-hanging-fruit": 15,
      "existing": 10,
      "clustering-opportunity": 8,
      "untapped": 7
    },
    "action_distribution": {
      "leave-as-is": 5,
      "optimize": 15,
      "upgrade": 10,
      "create": 15
    },
    "intent_distribution": {
      "informational": 20,
      "commercial": 15,
      "transactional": 10
    },
    "points_distribution": {
      "high": 15,
      "medium": 20,
      "low": 10
    },
    "relevance_distribution": {
      "5": 10,
      "4": 15,
      "3": 10,
      "2": 5,
      "1": 5
    },
    "traffic_metrics": {
      "total_traffic": 5000,
      "avg_traffic": 111,
      "traffic_value": 25000
    }
  }
}
```

### 2. Keywords Dashboard (Paginated)
```typescript
GET /api/v1/projects/{project_id}/dashboard/keywords

// Query Parameters
{
  page_size: 25,              // Items per page (1-50)
  cursor: "eyJza19pZC...",    // Pagination cursor (from previous response)
  sort_by: "total_points",     // Sort field (total_points, volume, position, etc.)
  sort_order: "desc",         // asc or desc
  view: "dashboard",          // dashboard (simplified) or detailed (all fields)
  
  // Filters (all optional)
  opportunity_type: ["low-hanging-fruit", "untapped"],
  position_min: 1,
  position_max: 50,
  search: "project management",
  // ... many more filters available
}

// Response
{
  "keywords": [
    {
      "keyword_id": "abc123",
      "keyword": "project management software",
      "volume": 10000,
      "position": 12,
      "total_points": 85,
      "opportunity_category": "low-hanging-fruit",
      "action": "optimize",
      "intent": "commercial",
      "cluster": "project management tools",
      "url": "https://example.com/pm-software"
    }
    // ... more keywords
  ],
  "pagination": {
    "page_size": 25,
    "has_more": true,
    "next_cursor": "eyJza19pZC4uLg==",
    "total_filtered": 45
  },
  "aggregations": {
    "total_volume": 150000,
    "avg_position": 12.3,
    "opportunity_distribution": {
      "success": 5,
      "low-hanging-fruit": 15,
      "existing": 10,
      "clustering-opportunity": 8,
      "untapped": 7
    },
    "action_distribution": {
      "leave-as-is": 5,
      "optimize": 15,
      "upgrade": 10,
      "create": 15
    },
    "intent_distribution": {
      "informational": 20,
      "commercial": 15,
      "transactional": 10
    },
    "points_distribution": {
      "high": 15,
      "medium": 20,
      "low": 10
    },
    "relevance_distribution": {
      "5": 10,
      "4": 15,
      "3": 10,
      "2": 5,
      "1": 5
    },
    "traffic_metrics": {
      "total_traffic": 5000,
      "avg_traffic": 111,
      "traffic_value": 25000
    }
  },
  "filters_applied": {
    "opportunity_type": ["low-hanging-fruit"],
    "position_range": null,
    "volume_range": null,
    "kd_range": null,
    "cpc_range": null,
    "sop_score_range": null,
    "search": null,
    "sort": "total_points:desc"
  }
}
```

### 3. Accessing Dashboard After Job Completion

```typescript
// After job completes successfully
if (job.status === 'completed') {
  clearInterval(interval);
  
  // Option 1: Get summary first
  const summaryRes = await fetch(`/api/v1/projects/${projectId}/dashboard/summary`);
  const summary = await summaryRes.json();
  
  // Option 2: Navigate directly to dashboard
  window.location.href = `/dashboard/${projectId}`;
  
  // Option 3: Load keywords data directly
  const keywordsRes = await fetch(
    `/api/v1/projects/${projectId}/dashboard/keywords?page_size=25&sort_by=total_points&sort_order=desc`
  );
  const keywordsData = await keywordsRes.json();
}
```

### 4. Additional Dashboard Features

**Cursor-Based Pagination:**
```typescript
// First page
const firstPage = await fetch(
  `/api/v1/projects/${projectId}/dashboard/keywords?page_size=25`
);
const data = await firstPage.json();

// Next page using cursor
if (data.pagination.has_more) {
  const nextPage = await fetch(
    `/api/v1/projects/${projectId}/dashboard/keywords?page_size=25&cursor=${data.pagination.next_cursor}`
  );
}
```

**Advanced Filtering:**
```typescript
// Filter for high-value optimization opportunities
const params = new URLSearchParams({
  page_size: '50',
  opportunity_type: 'low-hanging-fruit,existing',
  volume_min: '1000',
  position_min: '2',
  position_max: '20',
  sort_by: 'volume',
  sort_order: 'desc'
});

const filtered = await fetch(
  `/api/v1/projects/${projectId}/dashboard/keywords?${params}`
);
```

**Search Functionality:**
```typescript
// Search across keywords, URLs, and cluster names
const searchResults = await fetch(
  `/api/v1/projects/${projectId}/dashboard/keywords?search=project%20management&page_size=25`
);
```

**Available Sort Fields:**
- `total_points` - Overall opportunity score (default) ⚠️ NOT `opportunity_score`!
- `volume` - Search volume
- `position` - Current SERP position
- `kd` - Keyword difficulty
- `cpc` - Cost per click
- `traffic` - Estimated traffic
- `volume_score` - Volume component score
- `kd_score` - Difficulty component score
- `position_score` - Position component score
- `content_score` - Content quality score
- `created_at` - Creation date
- `updated_at` - Last update date

**⚠️ IMPORTANT**: The sort field is `total_points`, not `opportunity_score`. Using an invalid sort field may cause errors.

## Troubleshooting

### Common Backend Errors

1. **Dashboard endpoints return 500 error**
   - Fixed in latest version - was missing `await` on async calls
   - Check if you're using invalid sort fields (use `total_points` not `opportunity_score`)
   - Ensure you're using the latest backend code

2. **Job completes but no data in dashboard**
   - Check job.result for processing details
   - Verify project_id matches between upload and dashboard calls

3. **CSV validation fails**
   - Check the validation errors in upload response
   - Common issues: wrong delimiter, encoding issues, missing columns

4. **Invalid sort field error**
   - Use `sort_by=total_points` NOT `sort_by=opportunity_score`
   - Check the Available Sort Fields list for valid options

### Performance Tips

1. **Job Processing Time**
   - Typical processing: ~1 second per 50 keywords
   - Large files (1000+ keywords): Consider showing estimated time

2. **Dashboard Loading**
   - Use cursor-based pagination for large datasets
   - Start with page_size=25 for optimal performance

3. **Caching**
   - Dashboard responses are cached for 5 minutes
   - Use cache endpoints to warm/invalidate cache as needed

## Quick Reference

```typescript
// Minimal implementation with error handling
async function uploadAndProcess(projectId: string, file: File, authToken: string) {
  try {
    // 1. Upload
    const formData = new FormData();
    formData.append('project_id', projectId);
    formData.append('organic_file', file);
    
    const uploadRes = await fetch('/api/v1/uploads/csv/upload-keywords', { 
      method: 'POST', 
      body: formData,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (!uploadRes.ok && uploadRes.status !== 202) {
      throw new Error('Upload failed');
    }
    
    const uploadData = await uploadRes.json();
    
    // Check validation
    if (!uploadData.summary.all_valid) {
      throw new Error('File validation failed');
    }
    
    const jobId = uploadData.summary.job_id;
    
    // 2. Poll until complete
    const interval = setInterval(async () => {
      const jobRes = await fetch(`/api/v1/jobs/${projectId}/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const job = await jobRes.json();
      
      // IMPORTANT: Status values are ALWAYS lowercase!
      if (job.status === 'completed') {
        clearInterval(interval);
        window.location.href = `/dashboard/${projectId}`;
      } else if (job.status === 'failed') {
        clearInterval(interval);
        alert('Processing failed: ' + (job.error?.message || 'Unknown error'));
      } else if (job.status === 'cancelled') {
        clearInterval(interval);
        alert('Processing was cancelled');
      }
    }, 500);
    
  } catch (error) {
    console.error('Upload error:', error);
    alert(error.message);
  }
}
```