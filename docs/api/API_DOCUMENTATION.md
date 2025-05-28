# API Documentation - Frontend Aligned Version

## Overview
This document provides the corrected API documentation that aligns with the actual implementation and addresses frontend usage patterns.

## Base URL
- Development: `http://localhost:8000/api/v1`
- Production: `https://api.yourdomain.com/api/v1`

## Authentication
All API requests require authentication headers:
```
X-API-Key: your-api-key
```

---

## CSV Upload Endpoints

### Upload Keywords (Multi-file Upload)
**POST** `/api/v1/uploads/csv/upload-keywords`

**Description**: Upload organic and content gap CSV files for keyword analysis

**Request**: Multipart form data
- `organic_file`: Organic keywords CSV file (required)
- `content_gap_file`: Content gap analysis CSV file (optional)
- `project_id`: Project ID (required)
- `enable_llm_analysis`: Boolean (default: true)
- `enable_clustering`: Boolean (default: true)

**Response (202):**
```json
{
  "job_id": "job_123",
  "project_id": "proj_abc123",
  "status": "pending",
  "message": "CSV processing job created"
}
```

### Detect CSV Schema
**POST** `/api/v1/uploads/csv/detect-schema`

**Description**: Automatically detects CSV schema and field mappings

**Request**: Multipart form data
- `file`: CSV file to analyze

**Response (200):**
```json
{
  "detected_fields": {
    "keyword": "Keyword",
    "volume": "Search Volume",
    "kd": "Keyword Difficulty",
    "cpc": "CPC",
    "position": "Position",
    "url": "URL"
  },
  "confidence_scores": {
    "keyword": 0.95,
    "volume": 0.92,
    "kd": 0.89
  },
  "headers": ["Keyword", "Search Volume", "Keyword Difficulty", "CPC", "Position", "URL"],
  "sample_rows": [
    ["water damage restoration", "12000", "45", "8.50", "12", "/services/water-damage"]
  ]
}
```

### Validate CSV Upload
**POST** `/api/v1/uploads/csv/validate`

**Description**: Validates CSV file structure and content

**Request**: Multipart form data
- `file`: CSV file
- `project_id`: Project ID

**Response (200):**
```json
{
  "is_valid": true,
  "row_count": 1500,
  "headers": ["Keyword", "Volume", "KD", "CPC", "Position", "URL"],
  "detected_delimiter": ",",
  "detected_encoding": "utf-8",
  "file_size_mb": 0.15,
  "errors": [],
  "warnings": [],
  "validation_summary": {
    "total_fields": 6,
    "required_fields_present": 6,
    "optional_fields_present": 0,
    "missing_fields": []
  }
}
```

### Validate Local CSV File
**POST** `/api/v1/uploads/csv/local/validate`

**Description**: Validate a local CSV file (development only)

**Request Body:**
```json
{
  "file_path": "sample/keywords.csv",
  "project_id": "proj_abc123"
}
```

**Response (200):** Same as validate CSV upload

### List Sample Files
**GET** `/api/v1/uploads/csv/sample-files`

**Description**: List available sample CSV files (development only)

**Response (200):**
```json
[
  "sample/organic.csv",
  "sample/content_gap.csv"
]
```

### Manual Field Mapping
**POST** `/api/v1/uploads/csv/manual-mapping`

**Description**: Apply manual field mapping corrections

**Request Body:**
```json
{
  "project_id": "proj_abc123",
  "upload_job_id": "upload_123",
  "field_mappings": [
    {
      "source_column": "KW",
      "target_field": "keyword",
      "data_type": "string",
      "is_required": true
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "updated_mappings": [...],
  "validation_errors": []
}
```

### Get Supported Tools
**GET** `/api/v1/uploads/csv/supported-tools`

**Description**: Get information about supported SEO tools and standard fields

**Response (200):**
```json
{
  "tools": ["ahrefs", "semrush", "moz", "generic"],
  "standard_fields": {
    "keyword": {
      "required": true,
      "type": "string",
      "description": "The search keyword or phrase"
    },
    "volume": {
      "required": true,
      "type": "integer",
      "description": "Monthly search volume"
    }
  }
}
```

### Multi-file Upload
**POST** `/api/v1/multi-upload`

**Description**: Upload multiple CSV files for batch processing

**Request**: Multipart form data
- `project_id`: Project ID (required)
- `user_id`: User ID (required)
- `files`: Multiple CSV files

**Response (200):**
```json
{
  "status": "accepted",
  "message": "Processing 3 files asynchronously",
  "summary": {
    "job_id": "job_123",
    "job_status": "pending",
    "files_count": 3,
    "files": ["organic.csv", "gap1.csv", "gap2.csv"]
  }
}
```

### Trigger Clustering
**POST** `/api/v1/trigger-clustering`

**Description**: Manually trigger clustering job for a project

**Request**: Form data
- `project_id`: Project ID (required)

**Response (200):**
```json
{
  "status": "accepted",
  "message": "Clustering job started",
  "job_id": "job_456",
  "job_status": "pending"
}
```

---

## Keywords Endpoints

### Get Keywords List
**GET** `/api/v1/projects/{project_id}/keywords`

**Description**: Get paginated keywords for a project (basic view)

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 25, max: 50)
- `sort_field` (string): Field to sort by (default: "opportunity_score")
- `sort_direction` (string): Sort direction ("asc" or "desc")
- `opportunity_type` (string[]): Filter by opportunity types
- `position_min` (int): Minimum position
- `position_max` (int): Maximum position

**Response (200):**
```json
{
  "keywords": [...],
  "pagination": {
    "page": 1,
    "limit": 25,
    "total": 1250,
    "total_pages": 50
  },
  "aggregations": {
    "total_keywords": 1250,
    "avg_opportunity_score": 3.2,
    "avg_position": 28.5,
    "total_search_volume": 850000
  },
  "filters_applied": {
    "sort_field": "opportunity_score",
    "sort_direction": "desc"
  }
}
```

### Get Keywords Dashboard
**GET** `/api/v1/projects/{project_id}/keywords/dashboard`

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 50)
- `search` (string): Search keywords
- `volume_min` (int): Minimum search volume
- `volume_max` (int): Maximum search volume
- `kd_min` (float): Minimum keyword difficulty
- `kd_max` (float): Maximum keyword difficulty
- `cpc_min` (float): Minimum CPC
- `cpc_max` (float): Maximum CPC
- `position_min` (int): Minimum position
- `position_max` (int): Maximum position
- `sop_score_min` (float): Minimum SOP score
- `sop_score_max` (float): Maximum SOP score
- `relevance_score` (float): Minimum relevance score
- `action` (string): Filter by action type
- `intent` (string): Filter by search intent
- `opportunity_type` (string[]): Filter by opportunity types
- `sort_by` (string): Sort field
- `sort_order` (string): Sort direction (asc/desc)
- `cluster_id` (string): Filter by cluster
- `has_cluster` (boolean): Filter clustered/unclustered keywords
- `view` (string): View type (simple/detailed/export)

**Response (200):**
```json
{
  "keywords": [
    {
      "keyword_id": "kw_123",
      "keyword": "water damage restoration",
      "volume": 12000,
      "kd": 45,
      "cpc": 8.50,
      "position": 12,
      "url": "/services/water-damage",
      "intent": "commercial",
      "opportunity_type": "Low-Hanging Fruit",
      "action": "optimize",
      "sop_score": 23,
      "relevance_score": 5,
      "cluster_id": "cluster_789",
      "cluster_name": "Water Damage Services",
      "is_primary_keyword": true,
      "is_secondary_keyword": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total_items": 1250,
    "total_pages": 25,
    "has_next": true,
    "has_previous": false
  },
  "summary": {
    "total_keywords": 1250,
    "total_volume": 850000,
    "avg_position": 28.5,
    "keywords_in_top_10": 145,
    "keywords_in_top_20": 287
  },
  "filters_applied": {
    "volume_min": 100,
    "action": "optimize"
  }
}
```

### Get Dashboard Summary
**GET** `/api/v1/projects/{project_id}/dashboard/summary`

**Description**: Get summarized dashboard metrics and statistics

**Query Parameters:** Same as Keywords Dashboard

**Response (200):**
```json
{
  "metrics": {
    "total_keywords": 1250,
    "total_search_volume": 850000,
    "average_position": 28.5,
    "average_kd": 42.3,
    "average_cpc": 5.25
  },
  "opportunities": {
    "success": 45,
    "low_hanging_fruit": 230,
    "existing": 350,
    "clustering_opportunities": 125,
    "untapped": 500
  },
  "actions": {
    "optimize": 230,
    "upgrade": 350,
    "create": 500,
    "update": 75,
    "leave_as_is": 95
  },
  "intents": {
    "informational": 625,
    "commercial": 312,
    "transactional": 188,
    "navigational": 125
  },
  "top_performing": {
    "keywords": [...],
    "pages": [...]
  }
}
```

---

## Clusters Endpoints

### List Clusters
**GET** `/api/v1/projects/{project_id}/clusters`

**Note**: The frontend currently uses `/api/v1/clusters?project_id=...` but should migrate to this path-based approach.

**Query Parameters:**
- `page` (int): Page number
- `limit` (int): Items per page
- `search` (string): Search cluster names

**Response (200):**
```json
{
  "clusters": [
    {
      "cluster_id": "cluster_789",
      "project_id": "proj_abc123",
      "name": "Water Damage Services",
      "description": "Keywords related to water damage restoration and repair",
      "keyword_count": 25,
      "total_volume": 45000,
      "avg_position": 12.5,
      "primary_keyword": "water damage restoration",
      "created_at": "2025-05-28T12:00:00Z",
      "updated_at": "2025-05-28T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 45,
    "total_pages": 3
  }
}
```

### Get Cluster Details
**GET** `/api/v1/projects/{project_id}/clusters/{cluster_id}`

**Response (200):**
```json
{
  "cluster_id": "cluster_789",
  "project_id": "proj_abc123",
  "name": "Water Damage Services",
  "description": "Keywords related to water damage restoration and repair",
  "keyword_count": 25,
  "total_volume": 45000,
  "avg_position": 12.5,
  "primary_keyword": "water damage restoration",
  "keywords": [...],
  "metrics": {
    "total_impressions": 125000,
    "total_clicks": 3500,
    "avg_ctr": 2.8
  },
  "created_at": "2025-05-28T12:00:00Z",
  "updated_at": "2025-05-28T12:00:00Z"
}
```

### Create Cluster
**POST** `/api/v1/projects/{project_id}/clusters`

**Request Body:**
```json
{
  "name": "Water Damage Services",
  "description": "Keywords related to water damage restoration",
  "keyword_ids": ["kw_123", "kw_456", "kw_789"]
}
```

**Response (201):** Created cluster object

### Update Cluster
**PUT** `/api/v1/projects/{project_id}/clusters/{cluster_id}`

**Request Body:**
```json
{
  "name": "Updated Cluster Name",
  "description": "Updated description",
  "keyword_ids": ["kw_123", "kw_456"]
}
```

**Response (200):** Updated cluster object

### Delete Cluster
**DELETE** `/api/v1/projects/{project_id}/clusters/{cluster_id}`

**Response (204):** No content

### Get Cluster Keywords
**GET** `/api/v1/projects/{project_id}/clusters/{cluster_id}/keywords`

**Query Parameters:** Same as Keywords Dashboard

**Response (200):** Same format as Keywords Dashboard

### Get Keywords Dashboard (Alternative)
**GET** `/api/v1/projects/{project_id}/dashboard/keywords`

**Description**: Alternative endpoint for keyword dashboard with cursor-based pagination

**Query Parameters:** Same as main Keywords Dashboard endpoint plus:
- `cursor` (string): Pagination cursor
- `page_size` (int): Items per page (replaces `limit`)

**Response (200):** Same format as Keywords Dashboard with cursor-based pagination

### Get Clusters Dashboard
**GET** `/api/v1/projects/{project_id}/clusters/dashboard`

**Response (200):**
```json
{
  "clusters": [...],
  "summary": {
    "total_clusters": 45,
    "total_keywords": 1250,
    "avg_cluster_size": 27.8,
    "largest_cluster": 85,
    "smallest_cluster": 3
  }
}
```

### Get Clusters Visualization
**GET** `/api/v1/projects/{project_id}/clusters/visualization`

**Response (200):**
```json
{
  "nodes": [
    {
      "id": "cluster_789",
      "name": "Water Damage Services",
      "size": 25,
      "metrics": {
        "total_volume": 45000,
        "avg_position": 12.5
      }
    }
  ],
  "edges": [
    {
      "source": "cluster_789",
      "target": "cluster_790",
      "weight": 0.85
    }
  ]
}
```

---

## Projects Endpoints

### List Projects
**GET** `/api/v1/projects`

**Query Parameters:**
- `offset` (int): Offset for pagination
- `limit` (int): Number of items

**Response (200):**
```json
{
  "projects": [
    {
      "project_id": "proj_abc123",
      "name": "Water Damage SEO",
      "business_description": "Leading water damage restoration company",
      "created_at": "2025-05-28T12:00:00Z",
      "updated_at": "2025-05-28T12:00:00Z",
      "stats": {
        "total_keywords": 1250,
        "total_clusters": 45,
        "last_import": "2025-05-28T10:00:00Z"
      }
    }
  ],
  "total": 5,
  "skip": 0,
  "limit": 10
}
```

### Get Project
**GET** `/api/v1/projects/{project_id}`

**Response (200):** Single project object

### Create Project
**POST** `/api/v1/projects`

**Request Body:**
```json
{
  "name": "Water Damage SEO",
  "business_description": "Leading water damage restoration company specializing in emergency services"
}
```

**Response (201):** Created project object

### Update Project
**PATCH** `/api/v1/projects/{project_id}`

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "business_description": "Updated business description"
}
```

**Response (200):** Updated project object

### Delete Project
**DELETE** `/api/v1/projects/{project_id}`

**Response (204):** No content

### Get Project Stats
**GET** `/api/v1/projects/{project_id}/stats`

**Response (200):**
```json
{
  "project_id": "proj_abc123",
  "total_keywords": 1250,
  "total_clusters": 45,
  "keywords_by_opportunity": {
    "success": 45,
    "low_hanging_fruit": 230,
    "existing": 350,
    "clustering_opportunities": 125,
    "untapped": 500
  },
  "keywords_by_action": {
    "optimize": 230,
    "upgrade": 350,
    "create": 500,
    "update": 75,
    "leave_as_is": 95
  },
  "last_import": "2025-05-28T10:00:00Z",
  "last_analysis": "2025-05-28T11:00:00Z"
}
```

---

## Jobs Endpoints

### Get Job Status
**GET** `/api/v1/jobs/{project_id}/{job_id}`

**Response (200):**
```json
{
  "job_id": "job_123",
  "project_id": "proj_abc123",
  "job_type": "CSV_PROCESSING",
  "name": "Process Keywords",
  "status": "in_progress",
  "created_at": "2025-05-28T12:00:00Z",
  "updated_at": "2025-05-28T12:05:00Z",
  "progress": {
    "current_step": "Processing keywords",
    "items_processed": 750,
    "total_items": 1500,
    "percentage": 50,
    "messages": [
      "Started processing",
      "Validated 1500 keywords",
      "Applied scoring formulas"
    ]
  },
  "result": null,
  "error": null
}
```

### List Jobs
**GET** `/api/v1/jobs`

**Query Parameters:**
- `project_id`: Filter by project (required)
- `job_type`: Filter by type
- `status`: Filter by status
- `skip`: Pagination offset
- `limit`: Page size (default: 10)

**Response (200):** Array of job objects

---

## Updates Endpoints

### Process Keyword Updates
**POST** `/api/v1/projects/{project_id}/keywords/updates`

**Request Body:**
```json
{
  "updates": [
    {
      "keyword_id": "kw_123",
      "position": 8,
      "volume": 15000
    },
    {
      "keyword_id": "kw_456",
      "position": 22,
      "volume": 8000
    }
  ],
  "update_source": "manual",
  "apply_formulas": true
}
```

**Response (200):**
```json
{
  "updated": 2,
  "failed": 0,
  "results": [
    {
      "keyword_id": "kw_123",
      "success": true,
      "message": "Updated successfully"
    }
  ]
}
```

---

## Export Endpoints

### Create Export Job
**POST** `/api/v1/projects/{project_id}/exports`

**Request Body:**
```json
{
  "export_type": "keywords",
  "format": "csv",
  "filters": {
    "opportunity_type": ["Low-Hanging Fruit", "Existing"],
    "volume_min": 100
  },
  "fields": ["keyword", "volume", "position", "action", "cluster_name"]
}
```

**Response (202):**
```json
{
  "job_id": "export_123",
  "status": "pending",
  "format": "csv",
  "message": "Export job created"
}
```

### Get Export Job Status
**GET** `/api/v1/projects/{project_id}/exports/jobs/{job_id}`

**Response (200):**
```json
{
  "job_id": "export_123",
  "status": "completed",
  "format": "csv",
  "created_at": "2025-05-28T12:00:00Z",
  "completed_at": "2025-05-28T12:01:00Z",
  "file_size": 125000,
  "row_count": 450,
  "download_url": "/api/v1/projects/proj_abc123/exports/jobs/export_123/download"
}
```

### Download Export
**GET** `/api/v1/projects/{project_id}/exports/jobs/{job_id}/download`

**Response (200):** File download (CSV, Excel, or JSON)

### List Export Jobs
**GET** `/api/v1/projects/{project_id}/exports/jobs`

**Query Parameters:**
- `status`: Filter by job status
- `format`: Filter by export format

**Response (200):** Array of export job objects

---

## Strategic Advice Endpoints

### Get Strategic Advice
**GET** `/api/v1/strategic-advice/projects/{project_id}`

**Query Parameters:**
- `refresh`: Force refresh cache (default: false)

**Response (200):**
```json
{
  "project_id": "proj_abc123",
  "generated_at": "2025-05-28T12:00:00Z",
  "summary": {
    "total_keywords": 1250,
    "total_clusters": 45,
    "opportunities": {
      "quick_wins": 230,
      "content_gaps": 295,
      "optimization_targets": 350
    }
  },
  "key_insights": [
    {
      "type": "opportunity",
      "priority": "high",
      "insight": "45 keywords ranking #2-#5 could reach #1 with minor optimizations",
      "action": "Focus on title tag and content improvements for these pages",
      "potential_impact": "Estimated 2,500 additional monthly visits"
    }
  ],
  "cluster_priorities": [...],
  "content_calendar": [...],
  "content_templates": [...]
}
```

### Get Strategic Opportunities
**GET** `/api/v1/strategic-advice/projects/{project_id}/opportunities`

**Description**: Get detailed opportunity analysis for quick wins and content gaps

**Response (200):**
```json
{
  "project_id": "proj_abc123",
  "low_hanging_fruit": [
    {
      "keyword": "water damage cleanup",
      "current_position": 3,
      "volume": 8000,
      "difficulty": 25,
      "estimated_traffic_gain": 450,
      "recommended_actions": ["Update title tag", "Add FAQ section"]
    }
  ],
  "content_gaps": [...],
  "total_opportunity_value": 125000
}
```

### Get Content Strategy
**GET** `/api/v1/strategic-advice/projects/{project_id}/content-strategy`

**Description**: Get comprehensive content strategy recommendations

**Response (200):**
```json
{
  "project_id": "proj_abc123",
  "content_clusters": [...],
  "content_calendar": [...],
  "content_templates": [...],
  "pillar_pages": [...]
}
```

### Get Competitive Analysis
**GET** `/api/v1/strategic-advice/projects/{project_id}/competitive-analysis`

**Description**: Get competitive landscape analysis

**Response (200):**
```json
{
  "project_id": "proj_abc123",
  "competitor_gaps": [...],
  "competitive_advantages": [...],
  "market_opportunities": [...]
}
```

### Get ROI Projections
**GET** `/api/v1/strategic-advice/projects/{project_id}/roi-projections`

**Description**: Get traffic and revenue projections

**Response (200):**
```json
{
  "project_id": "proj_abc123",
  "traffic_projections": {
    "3_month": 25000,
    "6_month": 45000,
    "12_month": 85000
  },
  "revenue_projections": {
    "3_month": 125000,
    "6_month": 225000,
    "12_month": 425000
  },
  "investment_required": 15000,
  "roi_percentage": 2833
}
```

### Archive Project
**POST** `/api/v1/projects/{project_id}/archive`

**Description**: Archive a project (soft delete)

**Response (200):** Updated project object with archived status

---

## Cache Management Endpoints

### Clear Project Cache
**DELETE** `/api/v1/cache/projects/{project_id}`

**Response (200):**
```json
{
  "message": "Cache cleared successfully",
  "cleared_keys": 45
}
```

### Get Cache Stats
**GET** `/api/v1/cache/stats`

**Response (200):**
```json
{
  "total_keys": 1250,
  "total_size_mb": 45.2,
  "hit_rate": 0.82,
  "miss_rate": 0.18,
  "avg_response_time_ms": 12
}
```

### Warm Cache
**POST** `/api/v1/cache/projects/{project_id}/warm`

**Request Body:**
```json
{
  "cache_types": ["dashboard", "clusters", "strategic_advice"]
}
```

**Response (202):**
```json
{
  "job_id": "warm_123",
  "status": "pending",
  "message": "Cache warming job created"
}
```

---

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "volume_min",
      "issue": "Must be a positive integer"
    }
  },
  "request_id": "req_abc123"
}
```

Common error codes:
- `VALIDATION_ERROR`: Invalid request parameters
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: Insufficient permissions
- `CONFLICT`: Resource conflict (e.g., duplicate)
- `INTERNAL_ERROR`: Server error

---

## Migration Notes for Frontend

1. **Cluster Endpoints**: Migrate from query parameter pattern (`/clusters?project_id=...`) to path parameter pattern (`/projects/{project_id}/clusters`)

2. **Filter Parameters**: Ensure using correct parameter names:
   - Use `volume_min`/`volume_max` (not `min_volume`/`max_volume`)
   - Use `kd_min`/`kd_max` (not `min_kd`/`max_kd`)
   - Use `position_min`/`position_max` (not `min_position`/`max_position`)

3. **CSV Upload**: Use `/uploads/csv/upload-keywords` for multi-file uploads instead of separate endpoints

4. **Dashboard Summary**: The `/projects/{id}/dashboard/summary` endpoint exists and should be used for summary views