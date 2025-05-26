# Keyword Research API Documentation

## Base Configuration
- **Base URL**: `http://localhost:8000/api/v1`
- **Content-Type**: `application/json` (except file uploads)
- **Authentication**: Currently using mock auth (header: `X-User-ID: test-user-123`)

## Table of Contents
1. [Projects](#projects)
2. [CSV Upload & Validation](#csv-upload--validation)
3. [Jobs](#jobs)
4. [Keywords Dashboard](#keywords-dashboard)
5. [Clusters](#clusters)
6. [Strategic Advice](#strategic-advice)
7. [Exports](#exports)
8. [Updates](#updates)
9. [Cache Management](#cache-management)

---

## Projects

### Create Project
**POST** `/projects`

Creates a new keyword research project.

**Request Body:**
```json
{
  "name": "My SEO Project",
  "business_description": "We are a water damage restoration company serving the Dallas area",
  "settings": {
    "min_volume": 10,
    "max_kd": 70,
    "target_locations": ["Dallas", "Fort Worth"],
    "competitor_domains": ["competitor1.com", "competitor2.com"]
  }
}
```

**Response (201):**
```json
{
  "id": "proj_abc123",
  "name": "My SEO Project",
  "business_description": "We are a water damage restoration company serving the Dallas area",
  "status": "active",
  "created_at": "2024-05-25T10:00:00Z",
  "updated_at": "2024-05-25T10:00:00Z",
  "settings": {
    "min_volume": 10,
    "max_kd": 70,
    "target_locations": ["Dallas", "Fort Worth"],
    "competitor_domains": ["competitor1.com", "competitor2.com"]
  },
  "stats": {
    "total_keywords": 0,
    "total_clusters": 0,
    "last_updated": null
  }
}
```

### List Projects
**GET** `/projects`

**Query Parameters:**
- `status`: Filter by status (active, archived)
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset (default: 0)

**Response (200):**
```json
[
  {
    "id": "proj_abc123",
    "name": "My SEO Project",
    "status": "active",
    "created_at": "2024-05-25T10:00:00Z",
    "stats": {
      "total_keywords": 1250,
      "total_clusters": 45
    }
  }
]
```

### Get Project Details
**GET** `/projects/{project_id}`

**Response (200):**
```json
{
  "id": "proj_abc123",
  "name": "My SEO Project",
  "business_description": "We are a water damage restoration company...",
  "status": "active",
  "created_at": "2024-05-25T10:00:00Z",
  "updated_at": "2024-05-25T10:00:00Z",
  "settings": {
    "min_volume": 10,
    "max_kd": 70
  },
  "stats": {
    "total_keywords": 1250,
    "total_clusters": 45,
    "opportunities": {
      "low_hanging": 230,
      "existing": 450,
      "clustering": 320,
      "untapped": 250
    }
  }
}
```

### Update Project
**PATCH** `/projects/{project_id}`

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "business_description": "Updated description"
}
```

### Archive Project
**POST** `/projects/{project_id}/archive`

---

## CSV Upload & Validation

### Upload and Validate CSV
**POST** `/csv/validate`

Uploads and validates a CSV file. Creates a processing job.

**Request:** `multipart/form-data`
- `file`: CSV file (required)
- `project_id`: Project ID (required)

**Response (200):**
```json
{
  "job_id": "job_xyz789",
  "status": "processing",
  "validation": {
    "is_valid": true,
    "row_count": 1500,
    "errors": [],
    "warnings": []
  },
  "schema": {
    "detected_tool": "AHREFS",
    "csv_type": "ORGANIC",
    "field_mappings": [
      {
        "source_column": "Keyword",
        "target_field": "keyword",
        "data_type": "string"
      },
      {
        "source_column": "Volume",
        "target_field": "volume",
        "data_type": "integer"
      }
    ]
  }
}
```

### Detect Schema
**POST** `/csv/detect-schema`

Analyzes CSV headers to detect schema without processing.

**Request Body:**
```json
{
  "headers": ["Keyword", "Volume", "KD", "CPC", "Position"],
  "sample_rows": [
    ["water damage", "1900", "21", "15.50", "5"],
    ["flood cleanup", "720", "18", "12.00", "8"]
  ]
}
```

**Response (200):**
```json
{
  "detected_tool": "AHREFS",
  "csv_type": "ORGANIC",
  "confidence_score": 0.95,
  "field_mappings": [
    {
      "source_column": "Keyword",
      "target_field": "keyword",
      "data_type": "string",
      "is_required": true
    }
  ],
  "unmapped_columns": [],
  "missing_required_fields": []
}
```

### Get Supported Tools
**GET** `/csv/supported-tools`

**Response (200):**
```json
{
  "tools": [
    {
      "name": "AHREFS",
      "display_name": "Ahrefs",
      "typical_headers": ["Keyword", "Volume", "KD", "CPC"],
      "indicators": ["Current position", "Traffic potential"]
    },
    {
      "name": "SEMRUSH",
      "display_name": "SEMrush",
      "typical_headers": ["Keyword", "Search Volume", "Keyword Difficulty"],
      "indicators": ["Competitive Density", "SERP Features"]
    }
  ],
  "standard_fields": {
    "keyword": {
      "type": "string",
      "required": true,
      "description": "The search keyword"
    },
    "volume": {
      "type": "integer",
      "required": true,
      "description": "Monthly search volume"
    }
  }
}
```

---

## Jobs

### Get Project Jobs
**GET** `/jobs/{project_id}`

Lists all jobs for a project.

**Response (200):**
```json
[
  {
    "id": "job_xyz789",
    "project_id": "proj_abc123",
    "type": "CSV_UPLOAD",
    "status": "completed",
    "created_at": "2024-05-25T10:00:00Z",
    "updated_at": "2024-05-25T10:05:00Z",
    "progress": {
      "current": 1500,
      "total": 1500,
      "percentage": 100
    },
    "result": {
      "keywords_processed": 1500,
      "keywords_added": 1450,
      "keywords_updated": 50
    }
  }
]
```

### Get Job Status
**GET** `/jobs/{project_id}/{job_id}`

**Response (200):**
```json
{
  "id": "job_xyz789",
  "project_id": "proj_abc123",
  "type": "CSV_UPLOAD",
  "status": "processing",
  "progress": {
    "current": 750,
    "total": 1500,
    "percentage": 50,
    "current_step": "Applying formulas",
    "message": "Processing keywords..."
  }
}
```

---

## Keywords Dashboard

### Get Keywords Dashboard
**GET** `/projects/{project_id}/dashboard/keywords`

Retrieves keywords with filtering, sorting, and pagination.

**Query Parameters:**
- `limit`: Results per page (default: 20, max: 100)
- `offset`: Pagination offset
- `sort_by`: Field to sort by (e.g., "total_points", "volume", "position")
- `sort_order`: "asc" or "desc" (default: "desc")
- `opportunity_type`: Filter by opportunity (low_hanging, existing, clustering, untapped)
- `action`: Filter by action (create, optimize, upgrade, update, leave)
- `position_min`, `position_max`: Position range
- `volume_min`, `volume_max`: Volume range
- `search`: Search term for keywords

**Response (200):**
```json
{
  "keywords": [
    {
      "id": "kw_123",
      "keyword": "water damage restoration",
      "metrics": {
        "volume": 1900,
        "keyword_difficulty": 21,
        "cpc": 15.50,
        "position": 5,
        "url": "https://example.com/water-damage",
        "traffic": 450,
        "lowest_dr": 25
      },
      "scores": {
        "volume_score": 5,
        "kd_score": 4,
        "cpc_score": 5,
        "position_score": 4,
        "intent_score": 3,
        "relevance_score": 5,
        "word_count_score": 3,
        "lowest_dr_score": 4,
        "total_points": 33
      },
      "classification": {
        "opportunity": "low_hanging",
        "action": "optimize",
        "intent": "commercial",
        "priority": 1
      },
      "cluster": {
        "id": "cluster_789",
        "name": "Water Damage Services",
        "size": 25
      },
      "created_at": "2024-05-25T10:00:00Z",
      "updated_at": "2024-05-25T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 1500,
    "limit": 20,
    "offset": 0,
    "pages": 75
  },
  "summary": {
    "total_keywords": 1500,
    "total_volume": 850000,
    "avg_position": 28.5,
    "opportunities": {
      "low_hanging": 230,
      "existing": 450,
      "clustering": 320,
      "untapped": 250,
      "success": 250
    },
    "actions": {
      "create": 400,
      "optimize": 300,
      "upgrade": 200,
      "update": 100,
      "leave": 500
    }
  }
}
```

### Get Dashboard Summary
**GET** `/projects/{project_id}/dashboard/summary`

Returns aggregated statistics without keyword details.

**Response (200):**
```json
{
  "total_keywords": 1500,
  "total_volume": 850000,
  "avg_position": 28.5,
  "avg_kd": 35.2,
  "opportunities_breakdown": {
    "low_hanging": {
      "count": 230,
      "percentage": 15.3,
      "total_volume": 125000
    },
    "existing": {
      "count": 450,
      "percentage": 30.0,
      "total_volume": 280000
    }
  },
  "top_opportunities": [
    {
      "keyword": "emergency water removal",
      "volume": 2900,
      "position": 3,
      "potential_traffic": 1200
    }
  ]
}
```

---

## Clusters

### Get Clusters
**GET** `/clusters`

**Query Parameters:**
- `project_id`: Filter by project (required)
- `min_size`: Minimum cluster size
- `sort_by`: "size", "avg_volume", "total_volume"

**Response (200):**
```json
{
  "clusters": [
    {
      "id": "cluster_789",
      "name": "Water Damage Services",
      "project_id": "proj_abc123",
      "keyword_count": 25,
      "total_volume": 45000,
      "avg_position": 12.5,
      "top_keywords": [
        "water damage restoration",
        "water damage repair",
        "water damage cleanup"
      ],
      "metrics": {
        "avg_kd": 24.5,
        "opportunity_score": 8.2
      }
    }
  ],
  "total": 45
}
```

### Get Cluster Details
**GET** `/clusters/{cluster_id}`

**Response (200):**
```json
{
  "id": "cluster_789",
  "name": "Water Damage Services",
  "project_id": "proj_abc123",
  "keyword_count": 25,
  "keywords": [
    {
      "keyword": "water damage restoration",
      "volume": 1900,
      "position": 5
    }
  ],
  "metrics": {
    "total_volume": 45000,
    "avg_position": 12.5,
    "avg_kd": 24.5,
    "opportunity_score": 8.2,
    "quick_wins": 8,
    "content_gaps": 5
  },
  "recommendations": [
    "Create comprehensive guide targeting main cluster terms",
    "Optimize existing pages for quick win keywords"
  ]
}
```

---

## Strategic Advice

### Get Comprehensive Strategic Advice
**GET** `/strategic-advice/projects/{project_id}`

Generates comprehensive strategic SEO advice based on all project data.

**Query Parameters:**
- `include_competitors`: Include competitive analysis (default: false)

**Response (200):**
```json
{
  "project_id": "proj_abc123",
  "executive_summary": {
    "current_state": {
      "total_keywords_tracked": 1500,
      "current_organic_traffic": 12500,
      "current_traffic_value": "$43,750.00",
      "top_ranking_keywords": 125
    },
    "opportunity_summary": {
      "immediate_opportunities": 45,
      "content_gaps_identified": 320,
      "potential_traffic_gain": "8,500",
      "potential_monthly_value": "$29,750.00"
    },
    "strategic_priorities": [
      "Capture 45 quick wins through optimization (2-4 week impact)",
      "Develop content for top 3 keyword clusters (3-6 month impact)",
      "Fill 10 high-value content gaps",
      "Implement systematic tracking and measurement"
    ],
    "expected_results": {
      "30_days": "+850 organic visits",
      "90_days": "+2,550 organic visits",
      "180_days": "+5,950 organic visits"
    }
  },
  "current_performance": {
    "top_performers": [
      {
        "keyword": "water damage restoration",
        "position": 1,
        "traffic": 850,
        "value": "$2,975/month"
      }
    ],
    "strengths": [
      "Strong presence in commercial intent keywords",
      "Good coverage of local service terms"
    ]
  },
  "immediate_opportunities": [
    {
      "keyword": "emergency water removal",
      "current_state": {
        "position": 3,
        "monthly_traffic": 420,
        "monthly_value": "$1,470.00",
        "search_volume": 2900,
        "difficulty": 18
      },
      "opportunity_analysis": {
        "traffic_capture_rate": "14.5%",
        "missed_traffic": "580 visits/month (20.0% of searches)",
        "revenue_opportunity": "$2,030.00/month",
        "position_improvement_needed": "2 positions"
      },
      "data_driven_insight": "Moving from position 3 to 1 typically results in 2.4x traffic increase",
      "success_metrics": {
        "target_position": 1,
        "expected_total_traffic": 1000,
        "expected_revenue": "$3,500.00",
        "traffic_multiplier": "2.4x"
      },
      "implementation_priority": "HIGH"
    }
  ],
  "content_strategy": {
    "priority_clusters": [
      {
        "cluster_name": "Water Damage Services",
        "keyword_count": 45,
        "total_volume": 68000,
        "strategic_metrics": {
          "commercial_ratio": 0.78,
          "avg_cpc_value": 28.50,
          "competition_score": 0.75,
          "existing_coverage": 0.33,
          "priority_score": 8450.5
        },
        "cluster_analysis": {
          "ranking_keywords": 15,
          "non_ranking_keywords": 30,
          "quick_wins": 8,
          "content_gaps": 12
        },
        "data_driven_strategy": "Create comprehensive guide targeting all 45 keywords. Optimize 8 quick wins first for immediate impact."
      }
    ],
    "content_calendar": [
      {
        "month": 1,
        "content_type": "Comprehensive Guide",
        "topic": "Water Damage Services",
        "target_keywords": ["water damage restoration", "water damage repair", "water damage cleanup"],
        "estimated_word_count": 2500,
        "production_time": "15-20 hours",
        "expected_impact": {
          "keywords_targeted": 45,
          "total_search_volume": 68000,
          "estimated_traffic": 3400
        }
      }
    ],
    "content_templates": [
      {
        "cluster_name": "Water Damage Services",
        "cluster_analysis": {
          "primary_keyword": "water damage restoration",
          "supporting_keywords": ["water damage repair", "flood damage restoration"],
          "content_structure": {
            "introduction": "Overview of water damage types and urgency",
            "main_sections": [
              "Types of Water Damage",
              "Emergency Response Steps",
              "Professional Restoration Process",
              "Cost Factors",
              "Insurance Claims"
            ],
            "calls_to_action": ["Emergency hotline", "Free assessment", "Insurance help"]
          }
        }
      }
    ]
  },
  "tracking_framework": {
    "kpi_dashboard": {
      "primary_metrics": [
        {
          "metric": "Organic Traffic",
          "current": 12500,
          "target": "30% increase",
          "measurement": "Monthly"
        },
        {
          "metric": "Keyword Rankings",
          "current": 125,
          "target": "+20 keywords in top 10",
          "measurement": "Weekly"
        }
      ]
    }
  },
  "roi_projections": {
    "30_days": {
      "traffic": 850,
      "revenue": 2975.0,
      "cumulative_revenue": 2975.0
    },
    "90_days": {
      "traffic": 2550,
      "revenue": 8925.0,
      "cumulative_revenue": 11900.0
    }
  },
  "implementation_roadmap": {
    "week_1_2": {
      "focus": "Quick Win Optimizations",
      "tasks": [
        {
          "keyword": "emergency water removal",
          "current_position": 3,
          "expected_improvement": "2 positions"
        }
      ],
      "success_metrics": "5+ keywords improved rankings"
    },
    "month_2_onwards": {
      "focus": "Content Creation",
      "schedule": [
        {
          "month": 2,
          "content": "Water Damage Services Guide",
          "type": "Comprehensive Guide"
        }
      ]
    }
  }
}
```

### Get Opportunity Analysis
**GET** `/strategic-advice/projects/{project_id}/opportunities`

Provides detailed analysis of SEO opportunities.

**Query Parameters:**
- `limit`: Maximum opportunities per type (default: 20)
- `min_volume`: Minimum search volume filter
- `opportunity_type`: Filter by type (low_hanging, existing, gaps)

**Response (200):**
```json
{
  "project_id": "proj_abc123",
  "low_hanging_fruit": [
    {
      "keyword": "water damage cleanup",
      "search_volume": 1600,
      "current_position": 4,
      "potential_traffic_gain": 450,
      "potential_revenue_gain": 1575.0,
      "difficulty": 15,
      "current_traffic": 200,
      "optimization_type": "On-page SEO",
      "effort_required": "Low"
    }
  ],
  "existing_opportunities": [
    {
      "keyword": "basement flooding",
      "search_volume": 880,
      "current_position": 22,
      "potential_traffic_gain": 88,
      "potential_revenue_gain": 308.0,
      "improvement_potential": "High"
    }
  ],
  "content_gaps": [
    {
      "keyword": "water damage insurance claims",
      "search_volume": 590,
      "difficulty": 32,
      "intent": "informational",
      "estimated_traffic": 59,
      "estimated_monthly_value": 206.5,
      "content_recommendation": "Create comprehensive guide"
    }
  ],
  "total_opportunity_value": 45280.50
}
```

### Get Content Strategy
**GET** `/strategic-advice/projects/{project_id}/content-strategy`

Provides detailed content creation strategy.

**Query Parameters:**
- `max_clusters`: Maximum priority clusters (default: 5)
- `timeline_months`: Calendar timeline in months (default: 6)

**Response (200):**
```json
{
  "project_id": "proj_abc123",
  "priority_clusters": [
    {
      "cluster_name": "Emergency Water Services",
      "keywords": ["24/7 water damage", "emergency water removal", "urgent flood cleanup"],
      "total_volume": 4500,
      "strategic_metrics": {
        "commercial_ratio": 0.85,
        "priority_score": 8920.5
      },
      "content_recommendation": "Create service landing page with city-specific variations"
    }
  ],
  "content_calendar": [
    {
      "month": 1,
      "content_type": "Service Page",
      "topic": "24/7 Emergency Water Damage Services",
      "estimated_word_count": 1500,
      "production_time": "8-10 hours"
    }
  ],
  "content_templates": [
    {
      "cluster_name": "Emergency Water Services",
      "primary_keyword": "emergency water damage restoration",
      "content_outline": {
        "title": "24/7 Emergency Water Damage Restoration Services",
        "meta_description": "Immediate response for water damage emergencies...",
        "h1": "Emergency Water Damage Restoration - Available 24/7",
        "sections": [
          "Why Speed Matters in Water Damage",
          "Our Emergency Response Process",
          "What to Do While Waiting for Help"
        ]
      }
    }
  ],
  "estimated_impact": {
    "total_keywords_targeted": 145,
    "total_search_volume": 125000,
    "estimated_monthly_traffic": 6250,
    "estimated_monthly_value": 21875,
    "timeline_to_results": "3-6 months"
  }
}
```

### Get Competitive Analysis
**GET** `/strategic-advice/projects/{project_id}/competitive-analysis`

Analyzes competitive landscape and opportunities.

**Response (200):**
```json
{
  "project_id": "proj_abc123",
  "competitor_gaps": [
    {
      "keyword": "commercial water damage",
      "metrics": {
        "volume": 720,
        "difficulty": 35,
        "cpc": 42.50
      },
      "competitor_positions": {
        "competitor1.com": 3,
        "competitor2.com": 5
      },
      "opportunity": "No current ranking - high commercial value"
    }
  ],
  "competitive_advantages": [
    {
      "keyword": "water damage restoration dallas",
      "our_position": 2,
      "best_competitor_position": 5,
      "advantage": "3 positions ahead",
      "traffic": 580,
      "value": 2030
    }
  ],
  "market_share_analysis": {
    "total_search_volume": 125000,
    "captured_traffic": 12500,
    "market_share_percentage": 10.0,
    "ranking_keywords": 450,
    "non_ranking_keywords": 1050
  },
  "competitive_strategy": {
    "defend": "Maintain and strengthen 125 top 10 rankings",
    "attack": "Target 1050 competitor-dominated keywords",
    "expand": "Identify new keyword opportunities through competitor research",
    "priority_gaps": [
      {
        "keyword": "water damage restoration cost",
        "volume": 1300,
        "opportunity": "Competitors rank but we don't"
      }
    ]
  }
}
```

### Get ROI Projections
**GET** `/strategic-advice/projects/{project_id}/roi-projections`

Provides detailed ROI projections for SEO improvements.

**Query Parameters:**
- `scenario`: Projection scenario (best, expected, worst) (default: expected)

**Response (200):**
```json
{
  "project_id": "proj_abc123",
  "current_metrics": {
    "monthly_traffic": 12500,
    "monthly_revenue": 43750.0,
    "average_value_per_visit": 3.50
  },
  "projections": {
    "30_days": {
      "traffic": 850,
      "revenue": 2975.0,
      "cumulative_revenue": 2975.0
    },
    "60_days": {
      "traffic": 1700,
      "revenue": 5950.0,
      "cumulative_revenue": 8925.0
    },
    "90_days": {
      "traffic": 2550,
      "revenue": 8925.0,
      "cumulative_revenue": 17850.0
    },
    "180_days": {
      "traffic": 5950,
      "revenue": 20825.0,
      "cumulative_revenue": 58450.0
    }
  },
  "investment_required": {
    "optimization_hours": 90,
    "content_creation_hours": 200,
    "total_hours": 290,
    "estimated_cost": 43500
  },
  "payback_period": "14.6 months",
  "sensitivity_analysis": {
    "current_scenario": "expected",
    "scenarios": {
      "best": "1.5x expected results",
      "expected": "Base case projections",
      "worst": "0.5x expected results"
    }
  }
}
```

---

## Exports

### Create Export
**POST** `/exports`

Creates an export job for project data.

**Request Body:**
```json
{
  "project_id": "proj_abc123",
  "format": "csv",
  "filters": {
    "opportunity_type": ["low_hanging", "existing"],
    "action": ["create", "optimize"],
    "min_volume": 100
  },
  "options": {
    "include_clusters": true,
    "client_format": true
  }
}
```

**Response (202):**
```json
{
  "job_id": "export_job_456",
  "status": "processing",
  "format": "csv",
  "created_at": "2024-05-25T10:00:00Z"
}
```

### Get Export Status
**GET** `/exports/jobs/{job_id}`

**Response (200):**
```json
{
  "job_id": "export_job_456",
  "status": "completed",
  "format": "csv",
  "file_url": "/api/v1/exports/jobs/export_job_456/download",
  "file_size": 125000,
  "created_at": "2024-05-25T10:00:00Z",
  "completed_at": "2024-05-25T10:01:00Z"
}
```

### Download Export
**GET** `/exports/jobs/{job_id}/download`

**Response:** Binary file download with appropriate content-type headers.

---

## Updates

### Process CSV Update
**POST** `/csv/update`

Processes incremental updates from a new CSV file.

**Request:** `multipart/form-data`
- `file`: CSV file
- `project_id`: Project ID
- `update_strategy`: "merge_best", "replace_all", "keep_existing"
- `detect_deletions`: Boolean (default: true)

**Response (202):**
```json
{
  "job_id": "update_job_789",
  "status": "processing",
  "strategy": "merge_best",
  "preview": {
    "new_keywords": 150,
    "updated_keywords": 300,
    "unchanged_keywords": 1000,
    "deleted_keywords": 50
  }
}
```

### Resolve Conflicts
**POST** `/conflicts/resolve`

Manually resolve update conflicts.

**Request Body:**
```json
{
  "job_id": "update_job_789",
  "resolutions": [
    {
      "keyword": "water damage",
      "action": "keep_existing"
    },
    {
      "keyword": "flood cleanup",
      "action": "use_new"
    }
  ]
}
```

---

## Cache Management

### Get Cache Metrics
**GET** `/cache/metrics`

**Response (200):**
```json
{
  "cache": {
    "hits": 15230,
    "misses": 3420,
    "sets": 3420,
    "deletes": 120,
    "hit_rate": 0.816,
    "size_bytes": 52428800,
    "entry_count": 423
  },
  "performance": {
    "avg_get_time_ms": 2.3,
    "avg_set_time_ms": 5.1,
    "compression_ratio": 0.72
  }
}
```

### Clear Cache
**POST** `/cache/clear/all`

Clears all cached data.

**Response (200):**
```json
{
  "message": "Cache cleared successfully",
  "entries_removed": 423
}
```

---

## Error Responses

All endpoints follow a consistent error format:

**400 Bad Request:**
```json
{
  "detail": "Invalid request parameters",
  "errors": [
    {
      "field": "volume_min",
      "message": "Must be a positive integer"
    }
  ]
}
```

**404 Not Found:**
```json
{
  "detail": "Project not found"
}
```

**500 Internal Server Error:**
```json
{
  "detail": "An unexpected error occurred",
  "error_id": "err_abc123"
}
```

---

## Common Headers

**Request Headers:**
- `Content-Type: application/json` (except file uploads)
- `X-User-ID: test-user-123` (mock authentication)

**Response Headers:**
- `Content-Type: application/json`
- `X-Request-ID: req_xyz789` (for tracking)

---

## Rate Limiting

Currently no rate limiting implemented. In production:
- Standard: 100 requests/minute
- Bulk operations: 10 requests/minute

---

## Webhooks (Future)

Webhook support planned for job completion notifications:
```json
{
  "event": "job.completed",
  "job_id": "job_xyz789",
  "project_id": "proj_abc123",
  "type": "CSV_UPLOAD",
  "result": {
    "keywords_processed": 1500
  }
}
```