# API Mismatches Report

## Summary
This report documents all mismatches between the frontend API client calls and the documented API endpoints in `/docs/api/API_DOCUMENTATION.md`.

## Mismatches Found

### 1. Projects API (`/lib/api/projects.ts`)

#### ❌ Missing Query Parameters
- **Endpoint**: `GET /projects`
- **Issue**: Frontend uses `page` parameter, but API expects `offset` for pagination
- **Frontend**: `{ page?: number; limit?: number; status?: 'active' | 'archived' }`
- **API Expects**: `{ status?: string; limit?: number; offset?: number }`

#### ❌ Non-existent Endpoint
- **Endpoint**: `PATCH /projects/{id}/settings`
- **Issue**: This endpoint doesn't exist in the API documentation
- **Frontend Code**: `updateSettings()` method at line 58-67
- **Action Required**: Either remove this method or add the endpoint to the API

#### ❌ Non-existent Endpoint
- **Endpoint**: `DELETE /projects/{id}`
- **Issue**: This endpoint doesn't exist in the API documentation
- **Frontend Code**: `delete()` method at line 53-55
- **Action Required**: Either remove this method or add the endpoint to the API

### 2. Uploads API (`/lib/api/uploads.ts`)

#### ❌ Wrong Endpoint Path
- **Frontend**: `POST /uploads/csv/detect-schema`
- **API Expects**: `POST /csv/detect-schema`
- **Issue**: Frontend has extra `/uploads` prefix

#### ❌ Non-existent Endpoint
- **Frontend**: `POST /uploads/process`
- **API Expects**: `POST /csv/validate`
- **Issue**: Wrong endpoint path and purpose

#### ❌ Non-existent Endpoint
- **Frontend**: `POST /uploads/csv/upload-keywords`
- **Issue**: This endpoint doesn't exist in the API documentation
- **Note**: API has `/csv/validate` for single file upload

#### ❌ Wrong Endpoint Path
- **Frontend**: `GET /uploads/jobs/{jobId}`
- **API Expects**: `GET /jobs/{project_id}/{job_id}`
- **Issue**: Missing project_id parameter and wrong path structure

#### ❌ Non-existent Endpoint
- **Frontend**: `POST /uploads/jobs/{jobId}/cancel`
- **Issue**: This endpoint doesn't exist in the API documentation

### 3. Keywords API (`/lib/api/keywords.ts`)

#### ❌ Wrong Endpoint Path
- **Frontend**: `GET /projects/{projectId}/keywords`
- **API Expects**: `GET /projects/{project_id}/dashboard/keywords`
- **Issue**: Missing `/dashboard` in the path

#### ❌ Wrong Query Parameters
- **Issue**: Frontend uses different parameter names than API
- **Frontend Parameters**:
  - `page`, `limit`, `sort_field`, `sort_direction`
  - `min_volume`, `max_volume`, `min_difficulty`, `max_difficulty`
  - `intent`, `opportunity_level`
- **API Parameters**:
  - `limit`, `offset`, `sort_by`, `sort_order`
  - `volume_min`, `volume_max`, `position_min`, `position_max`
  - `opportunity_type`, `action`, `search`

#### ❌ Non-existent Endpoint
- **Frontend**: `GET /projects/{projectId}/stats`
- **API Expects**: `GET /projects/{project_id}/dashboard/summary`
- **Issue**: Wrong endpoint path

#### ❌ Non-existent Endpoints
- **Frontend**: `GET /projects/{projectId}/keywords/{keywordId}`
- **Frontend**: `PATCH /projects/{projectId}/keywords/{keywordId}`
- **Frontend**: `POST /projects/{projectId}/keywords/bulk-update`
- **Frontend**: `GET /projects/{projectId}/keywords/export`
- **Issue**: None of these endpoints exist in the API documentation

### 4. Clusters API (`/lib/api/clusters.ts`)

#### ❌ Wrong Endpoint Path
- **Frontend**: `GET /projects/{projectId}/clusters`
- **API Expects**: `GET /clusters?project_id={project_id}`
- **Issue**: Project ID should be a query parameter, not in the path

#### ❌ Wrong Query Parameters
- **Frontend Parameters**: `minVolume`, `maxVolume`, `minKeywords`, `maxKeywords`, `intents`, `sortField`, `sortOrder`
- **API Parameters**: `min_size`, `sort_by`
- **Issue**: Most query parameters don't match

#### ❌ Wrong Endpoint Path
- **Frontend**: `GET /projects/{projectId}/clusters/{clusterId}`
- **API Expects**: `GET /clusters/{cluster_id}`
- **Issue**: Project ID shouldn't be in the path

#### ❌ Non-existent Endpoints
- **Frontend**: `GET /projects/{projectId}/clusters/{clusterId}/export`
- **Frontend**: `GET /projects/{projectId}/clusters/export`
- **Issue**: These export endpoints don't exist in the API documentation

### 5. Strategic Advice API (`/lib/api/strategic-advice.ts`)

#### ❌ Wrong Endpoint Path
- **Frontend**: `GET /projects/{projectId}/strategic-advice`
- **API Expects**: `GET /strategic-advice/projects/{project_id}`
- **Issue**: Path structure is reversed

#### ❌ Wrong Query Parameters
- **Frontend**: `timeframe`, `focus_areas`, `priority_level`, `include_projections`
- **API**: `include_competitors`
- **Issue**: Frontend parameters don't match API documentation

#### ❌ Wrong Endpoint Path
- **Frontend**: `GET /projects/{projectId}/opportunities`
- **API Expects**: `GET /strategic-advice/projects/{project_id}/opportunities`
- **Issue**: Missing `/strategic-advice` prefix

#### ❌ Wrong Query Parameters for Opportunities
- **Frontend**: `opportunity_type`, `min_impact_score`, `max_difficulty`, `limit`
- **API**: `limit`, `min_volume`, `opportunity_type`
- **Issue**: Some parameters don't exist in API

#### ❌ Non-existent Endpoints
- **Frontend**: `GET /projects/{projectId}/strategic-advice/export`
- **Frontend**: `GET /projects/{projectId}/strategic-advice/content-strategy`
- **Frontend**: `GET /projects/{projectId}/strategic-advice/competitive-analysis`
- **Frontend**: `GET /projects/{projectId}/strategic-advice/roi-projections`
- **Frontend**: `GET /projects/{projectId}/strategic-advice/{section}/export`
- **Issue**: None of these endpoints exist with this path structure

### 6. CSV API (`/lib/api/csv.ts`)

#### ❌ Wrong Endpoint Path
- **Frontend**: `POST /projects/{projectId}/csv/validate`
- **API Expects**: `POST /csv/validate` (with project_id in form data)
- **Issue**: Project ID should be in form data, not in path

#### ❌ Non-existent Endpoint
- **Frontend**: `POST /projects/{projectId}/csv/process`
- **Issue**: This endpoint doesn't exist. API uses `/csv/validate` for processing

#### ❌ Wrong Endpoint Path
- **Frontend**: `GET /projects/{projectId}/csv/jobs/{jobId}`
- **API Expects**: `GET /jobs/{project_id}/{job_id}`
- **Issue**: Wrong path structure

## Type Mismatches

### 1. Response Wrapping
- **Issue**: Frontend expects all responses wrapped in `ApiResponse<T>` with `data`, `message`, and `status` fields
- **API Documentation**: Shows direct response objects without this wrapper
- **Impact**: All API calls will fail to parse responses correctly

### 2. Field Name Mismatches
- **Frontend Types**: Uses camelCase (e.g., `searchVolume`, `keywordDifficulty`)
- **API Documentation**: Uses snake_case (e.g., `search_volume`, `keyword_difficulty`)
- **Impact**: Data won't map correctly between frontend and backend

### 3. Missing Types in API Responses
- The API documentation shows different response structures than what the frontend expects
- Many fields expected by the frontend types are not present in the documented API responses

## Recommendations

1. **Immediate Actions**:
   - Update all endpoint paths in the frontend to match the API documentation
   - Fix query parameter names to match API expectations
   - Remove or update methods that call non-existent endpoints

2. **Response Handling**:
   - Either update the API to wrap responses in `ApiResponse<T>` format
   - OR update the frontend to handle direct response objects

3. **Field Naming**:
   - Standardize on either camelCase or snake_case throughout the application
   - Add transformation layer if mixed naming is required

4. **Documentation**:
   - Keep API documentation in sync with actual implementation
   - Add missing endpoints to documentation or remove from frontend

5. **Testing**:
   - Add integration tests to catch these mismatches early
   - Consider using API contract testing tools