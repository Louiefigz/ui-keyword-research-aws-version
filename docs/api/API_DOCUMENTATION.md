# API Documentation - Frontend Aligned Version

## Overview
This document provides the corrected API documentation that aligns with the actual implementation and addresses frontend usage patterns.

## Recent Changes (May 30, 2025)

### NEW: Conversational Strategic Advice System
1. **Conversational AI Integration**: Completely new strategic advice system using Claude Sonnet 4
   - **NEW ENDPOINT**: `/api/v1/conversational-advice/projects/{project_id}`
   - **Natural Language Format**: Advice is now provided in conversational, expert-level language
   - **Phased Approach**: Recommendations organized into Phase 1 (quick wins), Phase 2 (content), Phase 3 (long-term)
   - **Reality Check**: Includes honest assessment of confidence based on data quality
   - **Large Dataset Support**: Efficiently handles 100 to 50,000+ keywords through intelligent aggregation
   - **Additional Endpoints**:
     - `/api/v1/conversational-advice/projects/{project_id}/data-quality` - Check data quality before analysis
     - `/api/v1/conversational-advice/test-connection` - Test Claude API connection
     - `/api/v1/conversational-advice/supported-focus-areas` - Get list of supported focus areas

### Major Breaking Changes - Strategic Advice AI Enhancement
1. **Legacy Endpoints Deprecated**: Previous strategic advice endpoints are now deprecated
   - **DEPRECATED**: `/api/v1/strategic-advice/projects/{project_id}` (use `/conversational` instead)
   - **DEPRECATED**: `/api/v1/strategic-advice/projects/{project_id}/opportunities`
   - **DEPRECATED**: `/api/v1/strategic-advice/projects/{project_id}/content-strategy`
   - **DEPRECATED**: `/api/v1/strategic-advice/projects/{project_id}/competitive-analysis`

2. **Strategic Advice Response Format Changes**:
   - **NEW**: `ai_recommendations` field in each opportunity containing structured AI advice
   - **NEW**: `insight_type` field indicating "ai_enhanced" vs other types
   - **ENHANCED**: More specific action recommendations with time estimates and reasoning
   - **IMPROVED**: Business-context aware strategic priorities

### Deprecated Features
1. **ROI Projections**: The `roi_projections` field has been removed from strategic advice service implementation
   - **Note**: The `/roi-projections` endpoint still exists but should be considered deprecated

### Infrastructure Improvements
1. **Cluster Endpoints**: Now return full keyword objects within the `keywords` array instead of just `keyword_ids`
2. **Cluster Response**: Added `avg_difficulty` field to cluster responses
3. **LLM Integration**: Backend now uses OpenAI o3-mini model for enhanced AI capabilities
4. **Async Operations**: Strategic advice generation is now fully asynchronous to support AI processing

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
      "avg_difficulty": 35.5,
      "primary_keyword": "water damage restoration",
      "keywords": [
        {
          "keyword_id": "kw_123",
          "keyword": "water damage restoration",
          "volume": 12000,
          "kd": 45,
          "cpc": 8.50,
          "position": 12,
          "url": "/services/water-damage",
          "intent_score": 3,
          "relevance_score": 5,
          "opportunity_category": "Low-Hanging Fruit",
          "action": "optimize"
        }
      ],
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
  "avg_difficulty": 35.5,
  "primary_keyword": "water damage restoration",
  "keywords": [
    {
      "keyword_id": "kw_123",
      "keyword": "water damage restoration",
      "volume": 12000,
      "kd": 45,
      "cpc": 8.50,
      "position": 12,
      "url": "/services/water-damage",
      "intent_score": 3,
      "relevance_score": 5,
      "opportunity_category": "Low-Hanging Fruit",
      "action": "optimize"
    }
  ],
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

### Process CSV Update
**POST** `/api/v1/projects/{project_id}/updates/csv`

**Description**: Process a CSV file to update existing keywords with new data

**Request**: Multipart form data
- `file`: CSV file with updates
- `update_mode`: Update mode ("merge" or "replace")

**Response (202):**
```json
{
  "job_id": "update_123",
  "message": "Update job created",
  "update_mode": "merge",
  "file_info": {
    "row_count": 150,
    "detected_fields": ["keyword", "position", "volume"]
  }
}
```

### Get Update Job Status
**GET** `/api/v1/projects/{project_id}/updates/status/{job_id}`

**Response (200):**
```json
{
  "job_id": "update_123",
  "status": "completed",
  "progress": {
    "processed": 150,
    "updated": 145,
    "skipped": 5,
    "errors": 0
  },
  "conflicts": [],
  "completed_at": "2025-05-29T12:00:00Z"
}
```

### Resolve Update Conflicts
**POST** `/api/v1/projects/{project_id}/updates/conflicts/resolve`

**Request Body:**
```json
{
  "job_id": "update_123",
  "resolutions": [
    {
      "keyword_id": "kw_123",
      "resolution": "keep_existing"
    }
  ]
}
```

**Response (200):**
```json
{
  "resolved": 1,
  "pending_conflicts": 0
}
```

### Get Update History
**GET** `/api/v1/projects/{project_id}/updates/history`

**Query Parameters:**
- `limit`: Number of updates to return
- `offset`: Pagination offset

**Response (200):**
```json
{
  "updates": [
    {
      "update_id": "update_123",
      "job_id": "job_456",
      "timestamp": "2025-05-29T12:00:00Z",
      "source": "csv_upload",
      "keywords_updated": 145,
      "user_id": "user_123"
    }
  ],
  "total": 25,
  "limit": 10,
  "offset": 0
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

### Get Conversational Strategic Advice (NEW - Recommended)
**GET** `/api/v1/conversational-advice/projects/{project_id}`

**Description**: Generate expert-level, conversational SEO strategic advice using Claude Sonnet 4 AI analysis. This endpoint analyzes all keyword data, clusters, and business context to provide actionable strategic recommendations.

**Query Parameters:**
- `include_technical` (boolean, optional): Include technical SEO observations. Default: false
- `focus_area` (string, optional): Specific area to focus on. Options: "quick_wins", "content_gaps", "competitive_analysis"
- `confidence_threshold` (float, optional): Minimum confidence for recommendations (0.0-1.0). Default: 0.6

**Response (200):** See detailed response structure below

### Get Strategic Advice (DEPRECATED - Legacy Format)
**GET** `/api/v1/strategic-advice/projects/{project_id}`

**Description**: [DEPRECATED] Get strategic SEO advice in legacy format. Please use the `/conversational` endpoint for AI-powered insights.

**Query Parameters:**
- `refresh`: Force refresh cache (default: false)

**Response (200):**
```json
{
  "project_id": "5c5d6d05-8c41-49ad-8e4d-a5dc75afecb5",
  "executive_summary": {
    "current_state": {
      "total_keywords_tracked": 55,
      "current_organic_traffic": 178,
      "current_traffic_value": "$7914.07",
      "top_ranking_keywords": 10
    },
    "opportunity_summary": {
      "immediate_opportunities": 15,
      "content_gaps_identified": 12,
      "potential_traffic_gain": "1,536",
      "potential_monthly_value": "$44,113.92"
    },
    "strategic_priorities": [
      "Capture 15 quick wins through optimization (2-4 week impact)",
      "Develop content for top 3 keyword clusters (3-6 month impact)",
      "Fill 12 high-value content gaps",
      "Implement systematic tracking and measurement"
    ],
    "expected_results": {
      "30_days": "+153 organic visits",
      "90_days": "+460 organic visits",
      "180_days": "+1075 organic visits"
    }
  },
  "current_performance": {
    "top_performers": [
      {
        "keyword": "water damage restoration",
        "position": 1,
        "traffic": 89,
        "value": 850.50
      }
    ],
    "total_top3_keywords": 5,
    "total_top3_traffic": 250,
    "total_top3_value": 2150.00,
    "winning_patterns": {
      "dominant_intent": "commercial",
      "successful_themes": {
        "emergency services": 3,
        "location-based": 2
      },
      "average_position": 2.1
    },
    "recommendations": [
      "Maintain top positions with regular content updates",
      "Replicate success patterns for underperforming keywords"
    ]
  },
  "immediate_opportunities": [
    {
      "keyword": "flood cleanup services",
      "current_state": {
        "position": 4,
        "monthly_traffic": 45,
        "search_volume": 2400,
        "difficulty": 32
      },
      "opportunity_analysis": {
        "traffic_capture_rate": "1.9%",
        "missed_traffic": "120 visits/month (5.0% of searches)",
        "position_improvement_needed": "3 positions"
      },
      "data_driven_insight": "Moving from position 4 to 1 typically results in 3-5x traffic increase",
      "ai_recommendations": {
        "priority_actions": [
          {
            "action": "Enhance internal linking structure by adding 3-5 internal links from high-authority pages to the 'flood cleanup services' page",
            "reasoning": "Internal linking from established pages will transfer authority and improve rankings for this medium-competition keyword",
            "time_estimate": "2-3 hours",
            "expected_impact": "Move from position 4 to position 2-3"
          },
          {
            "action": "Add a comprehensive FAQ section addressing common flood cleanup questions and timeline expectations",
            "reasoning": "FAQ content typically ranks well for service-related keywords and addresses user search intent directly",
            "time_estimate": "4-5 hours",
            "expected_impact": "Improve relevance signals and user engagement"
          },
          {
            "action": "Create location-specific landing pages for 'flood cleanup services near me' variations",
            "reasoning": "Local search intent is strong for emergency services, creating geo-targeted pages captures additional search volume",
            "time_estimate": "8-10 hours per location",
            "expected_impact": "Capture additional 500-800 monthly searches"
          }
        ],
        "content_strategy": "Focus on emergency response expertise and local availability - emphasize 24/7 service and rapid response times",
        "technical_seo": "Ensure page loads under 2 seconds and implement local business schema markup"
      },
      "insight_type": "ai_enhanced",
      "success_metrics": {
        "target_position": 1,
        "expected_total_traffic": 165,
        "traffic_multiplier": "3.7x"
      },
      "implementation_priority": {
        "level": "high",
        "reasoning": "High traffic potential with achievable competition level",
        "effort_estimate": "Medium"
      }
    }
  ],
  "content_strategy": {
    "priority_clusters": [
      {
        "cluster_id": "25b1e4b6-93c2-4b34-83cb-1e3698f4d619",
        "name": "Water Damage Restoration Services",
        "strategic_metrics": {
          "commercial_ratio": 0.85,
          "avg_cpc_value": 12.50,
          "competition_score": 0.68,
          "existing_coverage": 0.45,
          "priority_score": 8750.5
        },
        "keyword_count": 23,
        "total_volume": 18500,
        "avg_difficulty": 38.2,
        "keywords": [
          {
            "keyword_id": "kw_001",
            "keyword": "water damage restoration",
            "volume": 6600,
            "kd": 42,
            "cpc": 15.50,
            "position": 3,
            "intent_score": 3,
            "relevance_score": 5,
            "opportunity_category": "Low-Hanging Fruit",
            "action": "optimize"
          }
        ],
        "cluster_analysis": {
          "strengths": ["High commercial intent", "Strong existing foundation"],
          "opportunities": ["Expand geographic coverage", "Add emergency-focused content"],
          "threats": ["Increasing competition", "Seasonal fluctuations"]
        },
        "keyword_targeting": {
          "primary_target": {
            "keyword": "water damage restoration",
            "volume": 6600,
            "position": 3
          },
          "quick_wins": [
            {"keyword": "emergency water damage", "position": 5, "volume": 2400}
          ],
          "content_gaps": [
            {"keyword": "24/7 water damage services", "volume": 1800}
          ]
        }
      }
    ],
    "content_calendar": [
      {
        "month": 1,
        "content_type": "Comprehensive Guide",
        "topic": "Complete Water Damage Restoration Process",
        "target_keywords": [
          "water damage restoration process",
          "flood damage repair steps",
          "water cleanup procedures"
        ],
        "estimated_word_count": 2500,
        "production_time": "15-20 hours",
        "expected_impact": {
          "keywords_targeted": 15,
          "total_search_volume": 8900,
          "estimated_traffic": 445
        }
      }
    ],
    "content_templates": [
      {
        "cluster_name": "Water Damage Services",
        "template_structure": {
          "introduction": "Service overview and immediate steps",
          "main_sections": [
            "Emergency Response Process",
            "Assessment and Documentation",
            "Water Extraction Methods",
            "Drying and Dehumidification",
            "Restoration and Repairs"
          ],
          "cta_sections": ["Free Assessment", "24/7 Emergency Line"]
        }
      }
    ]
  },
  "tracking_framework": {
    "kpis": [
      {
        "metric": "Organic Traffic Growth",
        "baseline": 178,
        "target_30_days": 331,
        "target_90_days": 638,
        "target_180_days": 1253
      },
      {
        "metric": "Keyword Rankings Improvement",
        "baseline": {"top_3": 10, "top_10": 25, "top_50": 40},
        "target_improvements": {
          "top_3": "+15 keywords",
          "top_10": "+20 keywords"
        }
      }
    ],
    "tracking_tools": ["Google Analytics", "Google Search Console", "Rank Tracking Tool"],
    "reporting_frequency": "Weekly for first month, then bi-weekly"
  },
  "implementation_roadmap": {
    "week_1_2": {
      "focus": "Quick Win Optimizations",
      "tasks": [
        "Update title tags for top 15 opportunities",
        "Enhance meta descriptions with CTAs",
        "Add FAQ schema to relevant pages"
      ],
      "expected_impact": "5-10% traffic increase"
    },
    "week_3_4": {
      "focus": "Content Improvements",
      "tasks": [
        "Expand content on position 2-5 pages",
        "Add multimedia elements",
        "Internal linking optimization"
      ],
      "expected_impact": "10-15% traffic increase"
    },
    "month_2_3": {
      "focus": "New Content Creation",
      "tasks": [
        "Develop cluster pillar pages",
        "Create supporting content",
        "Build topical authority"
      ],
      "expected_impact": "25-30% traffic increase"
    }
  }
}
```

**Note**: The `roi_projections` field has been removed from the strategic advice response. The API now focuses on data-driven insights without financial projections.

### Conversational Strategic Advice Response Structure

The new conversational endpoint returns a comprehensive analysis in natural language format:

**Response (200):**
```json
{
  "executive_overview": {
    "headline": "Your attention-grabbing SEO situation summary",
    "current_reality": {
      "description": "Natural language description of current state",
      "key_metrics": {
        "current_traffic": "179 monthly visits",
        "ranking_keywords": "20 out of 30 tracked",
        "top_3_positions": "10 keywords",
        "potential_value": "$106K+ in traffic value"
      }
    },
    "opportunity": {
      "description": "What's possible with your data",
      "potential_metrics": {
        "untapped_search_volume": "7,260+ monthly searches",
        "quick_win_potential": "170+ additional monthly visits",
        "competitive_gaps": "9 solid opportunities"
      }
    },
    "bottom_line": "Direct, actionable summary"
  },
  
  "your_three_biggest_problems": {
    "problem_1": {
      "name": "Primary issue name",
      "explanation": "Why this matters",
      "evidence": "Data supporting this",
      "impact": "Business impact",
      "fix_difficulty": "EASY|MEDIUM|HARD"
    }
    // ... problem_2, problem_3
  },
  
  "phase_1_quick_wins": {
    "timeline": "2-3 weeks",
    "why_this_first": "Reasoning for prioritization",
    "total_opportunity": "Quantified impact",
    "immediate_actions": ["Specific action 1", "Specific action 2", "..."]
  },
  
  "phase_2_content_strategy": {
    "timeline": "1-3 months",
    "content_priorities": ["Priority content pieces with search volumes"],
    "expected_results": {
      "new_traffic_potential": "2,000+ monthly visits",
      "lead_quality_improvement": "Description",
      "authority_building": "Description"
    }
  },
  
  "phase_3_long_term": {
    "timeline": "3-6 months",
    "strategic_initiatives": ["Long-term strategies"],
    "competitive_positioning": {
      "goal": "Market position goal",
      "strategy": "How to achieve it"
    }
  },
  
  "implementation_roadmap": {
    "week_1": {"tasks": "...", "focus": "..."},
    "month_1": {"tasks": "...", "focus": "..."},
    "month_3": {"tasks": "...", "focus": "..."}
  },
  
  "investment_reality_check": {
    "time_required": {
      "phase_1": "10-15 hours total",
      "phase_2": "20-25 hours per month",
      "ongoing": "15-20 hours per month"
    },
    "money_required": {
      "tools": "$100-200/month",
      "content": "$500-1,500/month if outsourcing",
      "technical": "$500-1,000 one-time"
    },
    "reality_check": "Honest assessment with confidence level"
  },
  
  "_metadata": {
    "generated_at": "2025-05-30T03:27:06.016640",
    "generation_time_seconds": 30.17,
    "data_quality": {
      "level": "good|fair|poor",
      "score": 0.76,
      "confidence_impact": 0.48
    },
    "edge_cases": {
      "dataset_type": "small_focused|mature_site|spray_and_pray",
      "business_model": "local_service|ecommerce|b2b|saas",
      "special_scenarios": []
    },
    "validation": {
      "issues_found": 3,
      "confidence_score": 0.44
    },
    "options_used": {
      "include_technical": true,
      "confidence_threshold": 0.6
    }
  }
}
```

**Key Features of Conversational Response:**
- Natural language explanations with context
- Phased approach (quick wins → content → long-term)
- Evidence-based recommendations
- Realistic time and cost estimates
- Confidence scoring based on data quality
- Handles datasets from 100 to 50,000+ keywords efficiently

**Error Responses:**

**404 - Not Found:**
```json
{
  "detail": "Project not found: proj_xyz789"
}
```

**500 - No Data Available:**
```json
{
  "error_explanation": {
    "what_happened": "No keyword data found",
    "why_it_matters": "I need keyword data to analyze your SEO performance and provide strategic advice.",
    "how_to_fix": [
      "Upload a CSV file with your keyword data",
      "Ensure the file includes keyword, search volume, and current position data",
      "Process the file to extract and normalize the data"
    ],
    "next_steps": "Once you've uploaded keyword data, I can provide comprehensive strategic advice tailored to your situation."
  },
  "_metadata": {
    "generated_at": "2025-05-30T03:27:06.016640",
    "error_type": "no_data"
  }
}
```

**Performance Notes:**
- First request: 20-40 seconds (Claude analysis)
- Cached requests: <100ms
- Cache TTL: 1 hour
- Token usage: ~4,000-5,000 tokens per analysis

### Check Data Quality
**GET** `/api/v1/conversational-advice/projects/{project_id}/data-quality`

**Description**: Check data quality before running full analysis. Provides a quick assessment to help understand if data is sufficient for meaningful analysis.

**Response (200):**
```json
{
  "can_analyze": true,
  "quality_score": 0.76,
  "quality_level": "good",
  "confidence_impact": 0.48,
  "completeness": {
    "keyword": 1.0,
    "volume": 0.95,
    "position": 0.67,
    "kd": 0.88,
    "cpc": 0.92
  },
  "issues": ["Missing position data for 33% of keywords"],
  "warnings": ["Low keyword diversity detected"],
  "recommendations": [
    "Add more keyword variations",
    "Include position data for all keywords"
  ],
  "edge_cases": {
    "dataset_type": "small_focused",
    "business_model": "local_service",
    "special_scenarios": [],
    "key_challenges": ["Limited keyword set"]
  }
}
```

### Test Claude Connection
**POST** `/api/v1/conversational-advice/test-connection`

**Description**: Test connection to Claude API. Helps verify that the Claude API is properly configured and accessible.

**Response (200):**
```json
{
  "status": "connected",
  "model": "claude-sonnet-4-20250514",
  "response": {
    "status": "Connection successful"
  }
}
```

### Get Supported Focus Areas
**GET** `/api/v1/conversational-advice/supported-focus-areas`

**Description**: Get list of supported focus areas for analysis.

**Response (200):**
```json
{
  "focus_areas": {
    "quick-wins": {
      "name": "Quick Wins",
      "description": "Focus on keywords ranking on positions 4-15 that can quickly move to page 1",
      "typical_timeline": "2-4 weeks"
    },
    "content-gaps": {
      "name": "Content Gaps",
      "description": "Identify topics and keywords where you have no content",
      "typical_timeline": "1-3 months"
    },
    "cannibalization": {
      "name": "Keyword Cannibalization",
      "description": "Find and fix competing pages targeting the same keywords",
      "typical_timeline": "1-2 weeks"
    },
    "authority-building": {
      "name": "Authority Building",
      "description": "Long-term content strategy for competitive keywords",
      "typical_timeline": "3-6 months"
    },
    "technical-optimization": {
      "name": "Technical Optimization",
      "description": "Technical SEO improvements (requires technical audit data)",
      "typical_timeline": "2-4 weeks",
      "requires": "technical_audit_data"
    }
  }
}
```

### Get Strategic Opportunities (DEPRECATED)
**GET** `/api/v1/strategic-advice/projects/{project_id}/opportunities`

**Description**: [DEPRECATED] Use the conversational endpoint instead. This legacy endpoint provides basic opportunity analysis.

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

### Get Content Strategy (DEPRECATED)
**GET** `/api/v1/strategic-advice/projects/{project_id}/content-strategy`

**Description**: [DEPRECATED] Use the conversational endpoint instead. Content strategy is now integrated into the phase-based recommendations.

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

### Get Competitive Analysis (DEPRECATED)
**GET** `/api/v1/strategic-advice/projects/{project_id}/competitive-analysis`

**Description**: [DEPRECATED] Use the conversational endpoint instead. Competitive insights are now woven throughout the conversational analysis.

**Response (200):**
```json
{
  "project_id": "proj_abc123",
  "competitor_gaps": [...],
  "competitive_advantages": [...],
  "market_opportunities": [...]
}
```


### Archive Project
**POST** `/api/v1/projects/{project_id}/archive`

**Description**: Archive a project (soft delete)

**Response (200):** Updated project object with archived status

---

## Cache Management Endpoints

### Get Cache Metrics
**GET** `/api/v1/cache/metrics`

**Response (200):**
```json
{
  "hit_rate": 0.82,
  "miss_rate": 0.18,
  "total_hits": 12500,
  "total_misses": 2250,
  "total_requests": 14750,
  "cache_size_bytes": 47185920,
  "cache_size_mb": 45.2,
  "avg_response_time_ms": {
    "hit": 5,
    "miss": 150
  },
  "response_time_percentiles": {
    "p50": 8,
    "p95": 125,
    "p99": 250
  }
}
```

### Clear Project Cache
**POST** `/api/v1/cache/clear/project/{project_id}`

**Response (200):**
```json
{
  "message": "Cache cleared for project",
  "project_id": "proj_abc123",
  "cleared_count": 45
}
```

### Clear All Cache
**POST** `/api/v1/cache/clear/all`

**Response (200):**
```json
{
  "message": "All cache cleared",
  "cleared_count": 1250
}
```

### Reset Cache Metrics
**POST** `/api/v1/cache/metrics/reset`

**Response (200):**
```json
{
  "message": "Performance metrics reset"
}
```

### Check Cache Health
**GET** `/api/v1/cache/health`

**Response (200):**
```json
{
  "status": "healthy",
  "cache_enabled": true,
  "backend": "memory",
  "ttl_seconds": 3600
}
```

---

## Dev/Test Endpoints

### Trigger Clustering (Dev)
**POST** `/test/{project_id}/trigger-clustering`

**Description**: Manually trigger clustering job for testing

**Request Body:**
```json
{
  "force_regenerate": false,
  "min_cluster_size": 3
}
```

**Response (200):**
```json
{
  "job_id": "job_789",
  "message": "Clustering job triggered",
  "status": "pending"
}
```

### Check Clustering Status (Dev)
**GET** `/test/{project_id}/clustering-status`

**Response (200):**
```json
{
  "has_clusters": true,
  "cluster_count": 45,
  "last_clustering_job": {
    "job_id": "job_789",
    "status": "completed",
    "completed_at": "2025-05-29T12:00:00Z"
  },
  "keyword_coverage": {
    "total_keywords": 1250,
    "clustered_keywords": 1100,
    "coverage_percentage": 88.0
  }
}
```

### Test Keyword Research Flow (Dev)
**POST** `/test/keyword-research`

**Description**: Test the full keyword research pipeline

**Request Body:**
```json
{
  "keywords": [
    {
      "keyword": "water damage restoration",
      "volume": 12000,
      "kd": 45,
      "cpc": 8.50,
      "position": 12
    }
  ],
  "business_description": "Water damage restoration company",
  "enable_clustering": true,
  "enable_llm_analysis": true
}
```

**Response (200):**
```json
{
  "processed_keywords": [...],
  "clusters": [...],
  "processing_time_ms": 2500,
  "llm_calls_made": 3
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

### Critical Strategic Advice Changes (IMMEDIATE ACTION REQUIRED)

**Frontend components consuming strategic advice endpoints MUST be updated to handle the new AI-enhanced response format:**

1. **New Required Fields to Handle**:
   ```javascript
   // Each opportunity now includes these new fields:
   opportunity.ai_recommendations = {
     priority_actions: [
       {
         action: "Specific action to take",
         reasoning: "Why this will work", 
         time_estimate: "2-3 hours",
         expected_impact: "Move from position X to Y"
       }
     ],
     content_strategy: "Strategic guidance",
     technical_seo: "Technical recommendations"
   }
   opportunity.insight_type = "ai_enhanced" | "rule_based"
   ```

2. **Updated Implementation Priority Structure**:
   ```javascript
   // Old format:
   opportunity.implementation_priority = "high"
   
   // New format:
   opportunity.implementation_priority = {
     level: "high",
     reasoning: "Why this is high priority",
     effort_estimate: "Medium"
   }
   ```

3. **Error Handling for AI Failures**:
   - Strategic advice endpoints may now throw errors if LLM integration fails
   - No more generic fallbacks - implement proper error boundaries
   - Consider retry mechanisms for transient AI service failures

4. **Loading States**:
   - Strategic advice generation now takes longer due to AI processing
   - Implement appropriate loading indicators (expect 5-15 second response times)
   - Consider WebSocket connections for real-time progress updates

### UI Component Recommendations

1. **Strategic Advice Display**:
   ```javascript
   // Example React component structure
   const OpportunityCard = ({ opportunity }) => {
     const { ai_recommendations, insight_type } = opportunity;
     
     return (
       <div className="opportunity-card">
         {insight_type === "ai_enhanced" && (
           <div className="ai-recommendations">
             <h4>AI-Enhanced Recommendations</h4>
             {ai_recommendations.priority_actions.map(action => (
               <div key={action.action} className="priority-action">
                 <strong>Action:</strong> {action.action}
                 <p><strong>Why:</strong> {action.reasoning}</p>
                 <p><strong>Time:</strong> {action.time_estimate}</p>
                 <p><strong>Impact:</strong> {action.expected_impact}</p>
               </div>
             ))}
           </div>
         )}
       </div>
     );
   };
   ```

2. **Priority Action Lists**:
   - Display actions as numbered, actionable checklists
   - Include time estimates for project planning
   - Show reasoning to help users understand the strategy

3. **Business Context Integration**:
   - All AI recommendations are now business-specific
   - No more generic "optimize content" advice
   - Recommendations will reference specific business types and contexts

### Other Migration Items

1. **Cluster Endpoints**: Migrate from query parameter pattern (`/clusters?project_id=...`) to path parameter pattern (`/projects/{project_id}/clusters`)

2. **Filter Parameters**: Ensure using correct parameter names:
   - Use `volume_min`/`volume_max` (not `min_volume`/`max_volume`)
   - Use `kd_min`/`kd_max` (not `min_kd`/`max_kd`)
   - Use `position_min`/`position_max` (not `min_position`/`max_position`)

3. **CSV Upload**: Use `/uploads/csv/upload-keywords` for multi-file uploads instead of separate endpoints

4. **Dashboard Summary**: The `/projects/{id}/dashboard/summary` endpoint exists and should be used for summary views

### Testing Recommendations

1. **Test with Real Data**: Use actual CSV files to verify AI recommendations quality
2. **Error Scenarios**: Test behavior when LLM services are unavailable
3. **Performance**: Verify UI handles longer response times gracefully
4. **Business Context**: Test with different business descriptions to see varied AI advice