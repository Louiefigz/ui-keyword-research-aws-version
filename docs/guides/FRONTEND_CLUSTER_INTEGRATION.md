# Frontend Cluster Pagination Integration Guide

## Overview

This document outlines the implementation of cluster pagination for better performance and user experience. The system now supports paginated cluster listings and keyword exploration, replacing the previous approach that loaded all keywords for all clusters in a single request.

**Status: ✅ IMPLEMENTED**

## Problem Solved

The previous implementation had performance issues:
- Loaded ALL clusters for a project in a single request
- Loaded ALL keywords for each cluster simultaneously
- For a project with 55 keywords across multiple clusters, this resulted in 50+ database calls
- Performance degraded significantly with larger datasets

## Implemented Solution

✅ **Cluster Pagination**: 6 clusters per page (configurable, max 20)
✅ **Keyword Previews**: 10 keyword preview maximum per cluster
✅ **Paginated Keyword Details**: 10 keywords per page in cluster detail modal
✅ **Export Functionality**: Individual and bulk cluster exports
✅ **Performance Optimization**: Reduced initial load from all keywords to max 66 keywords

## Proposed Solution

### Core Pagination Strategy
- **Clusters:** 6 clusters per page (configurable, max 20)
- **Keywords per cluster:** 10 keyword preview maximum (configurable, max 25)
- **Full keyword access:** Available via dedicated cluster detail endpoints

## API Changes

### 1. New Cluster Export Endpoints

**Single Cluster Export:**
```typescript
POST /api/v1/projects/{project_id}/clusters/{cluster_id}/export
{
  export_format: "csv" | "excel" | "json",
  include_all_keywords: boolean
}
```

**Multiple Clusters Export:**
```typescript
POST /api/v1/projects/{project_id}/clusters/export
{
  cluster_ids?: string[],        // Optional: specific clusters, omit for all clusters
  export_format: "csv" | "excel" | "json",
  include_all_keywords: boolean
}
```

### 2. Updated Main Clusters Endpoint

**Endpoint:** `GET /api/v1/projects/{project_id}/clusters`

**New Query Parameters:**
```typescript
interface ClusterListParams {
  page?: number;                    // Default: 1
  page_size?: number;              // Default: 6, max: 20
  keywords_preview_limit?: number; // Default: 10, max: 25
}
```

**New Response Format:**
```typescript
interface ClusterSummaryResponse {
  cluster_id: string;
  project_id: string;
  name: string;
  description?: string;
  keyword_count: number;           // Total keywords in cluster
  total_volume: number;
  avg_difficulty: number;
  avg_position: number;
  preview_keywords: Keyword[];     // Limited to keywords_preview_limit
  created_at: string;
  updated_at: string;
}

interface ClusterSummaryListResponse {
  clusters: ClusterSummaryResponse[];
  pagination: {
    page: number;
    page_size: number;
    total_pages: number;
    total_clusters: number;
    has_next: boolean;
    has_previous: boolean;
  };
}
```

### 3. Existing Endpoints (No Changes)

These endpoints remain unchanged and provide full functionality:

**Get Single Cluster:** `GET /api/v1/projects/{project_id}/clusters/{cluster_id}`
- Returns full cluster details with ALL keywords

**Get Cluster Keywords:** `GET /api/v1/projects/{project_id}/clusters/{cluster_id}/keywords`
- Paginated keywords for a specific cluster (already implemented)
- Page size: 25 keywords (configurable, max 100)

**Cluster Dashboard:** `GET /api/v1/projects/{project_id}/clusters/dashboard`
- Already properly paginated (no changes needed)

## Frontend Implementation Guide

### 1. Clusters List Page

**Initial Load:**
```typescript
// Load first page of clusters with keyword previews
const response = await fetch(`/api/v1/projects/${projectId}/clusters?page=1&page_size=6&keywords_preview_limit=10`);
```

**Display Strategy:**
```tsx
function ClusterCard({ cluster }: { cluster: ClusterSummaryResponse }) {
  return (
    <div className="cluster-card">
      <h3>{cluster.name}</h3>
      <div className="cluster-stats">
        <span>Keywords: {cluster.keyword_count}</span>
        <span>Volume: {cluster.total_volume}</span>
        <span>Avg Difficulty: {cluster.avg_difficulty}</span>
      </div>
      
      {/* Show preview keywords */}
      <div className="preview-keywords">
        <h4>Top Keywords Preview</h4>
        {cluster.preview_keywords.map(keyword => (
          <KeywordPreview key={keyword.id} keyword={keyword} />
        ))}
        
        {/* Show "View All" if there are more keywords */}
        {cluster.keyword_count > cluster.preview_keywords.length && (
          <button onClick={() => navigateToClusterDetail(cluster.cluster_id)}>
            View All {cluster.keyword_count} Keywords →
          </button>
        )}
      </div>
    </div>
  );
}
```

**Pagination Controls:**
```tsx
function ClustersPagination({ pagination, onPageChange }: PaginationProps) {
  return (
    <div className="pagination">
      <button 
        disabled={!pagination.has_previous}
        onClick={() => onPageChange(pagination.page - 1)}
      >
        Previous
      </button>
      
      <span>Page {pagination.page} of {pagination.total_pages}</span>
      
      <button 
        disabled={!pagination.has_next}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        Next
      </button>
    </div>
  );
}
```

### 2. Cluster Detail Page

**Full Keyword Loading:**
```typescript
// For detailed cluster view - load all keywords with pagination
const response = await fetch(`/api/v1/projects/${projectId}/clusters/${clusterId}/keywords?page=1&page_size=25`);
```

### 3. State Management

**Recommended State Structure:**
```typescript
interface ClustersState {
  // Main clusters list (paginated)
  clusters: ClusterSummaryResponse[];
  pagination: PaginationInfo;
  loading: boolean;
  
  // Individual cluster details (cached)
  clusterDetails: Record<string, {
    cluster: ClusterResponse;
    keywords: Keyword[];
    keywordsPagination: PaginationInfo;
  }>;
}
```

**Data Fetching Strategy:**
```typescript
// Main clusters list
const { data: clustersData } = useQuery({
  queryKey: ['clusters', projectId, page],
  queryFn: () => fetchClusters(projectId, page),
  keepPreviousData: true, // For smooth pagination
});

// Individual cluster details (cached)
const { data: clusterDetail } = useQuery({
  queryKey: ['cluster', projectId, clusterId],
  queryFn: () => fetchClusterDetail(projectId, clusterId),
  enabled: !!clusterId, // Only fetch when cluster is selected
});
```

## Export Functionality

### Export Strategy

**Three Export Options:**

1. **Export All Clusters:**
   - Exports ALL clusters and their keywords regardless of pagination
   - Uses cluster export endpoint without cluster_ids parameter

2. **Export Selected Clusters:**
   - Exports only user-selected clusters from the UI
   - Uses cluster export endpoint with specific cluster_ids

3. **Export Single Cluster:**
   - From individual cluster detail page
   - Exports just that one cluster with all its keywords

### Export User Flows

**From Main Clusters Page:**
1. **"Export All Clusters" Button** - Always visible, exports entire project's clusters
2. **Select clusters** (checkboxes) → **"Export Selected" Button** - Exports chosen clusters
3. **Individual cluster "Export" icon** - Quick export of single cluster

**From Cluster Detail Page:**
- **"Export This Cluster" Button** - Exports the current cluster with all keywords

### Export API Implementation

All cluster exports now use the dedicated cluster export endpoints:

**Export All Clusters:**
```typescript
// POST /api/v1/projects/{project_id}/clusters/export
{
  // cluster_ids omitted = export all clusters
  export_format: "csv" | "excel" | "json",
  include_all_keywords: boolean
}
```

**Export Selected Clusters:**
```typescript
// POST /api/v1/projects/{project_id}/clusters/export
{
  cluster_ids: string[],           // Specific clusters to export
  export_format: "csv" | "excel" | "json",
  include_all_keywords: boolean
}
```

**Export Single Cluster:**
```typescript
// POST /api/v1/projects/{project_id}/clusters/{cluster_id}/export
{
  export_format: "csv" | "excel" | "json",
  include_all_keywords: boolean
}
```

### Frontend Export Implementation

**Main Clusters Page Export Controls:**
```tsx
function ClustersListPage() {
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <div className="clusters-page">
      {/* Export Controls */}
      <div className="export-controls">
        <button 
          className="btn-primary"
          onClick={() => handleExportAll()}
        >
          Export All Clusters
        </button>
        
        {selectedClusters.length > 0 && (
          <button 
            className="btn-secondary"
            onClick={() => setShowExportModal(true)}
          >
            Export Selected ({selectedClusters.length})
          </button>
        )}
      </div>

      {/* Clusters Grid with Selection */}
      <div className="clusters-grid">
        {clusters.map(cluster => (
          <ClusterCard 
            key={cluster.cluster_id}
            cluster={cluster}
            isSelected={selectedClusters.includes(cluster.cluster_id)}
            onSelect={(selected) => handleClusterSelect(cluster.cluster_id, selected)}
            onQuickExport={() => handleSingleClusterExport(cluster.cluster_id)}
          />
        ))}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal 
          selectedClusterIds={selectedClusters}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}

function ClusterCard({ cluster, isSelected, onSelect, onQuickExport }) {
  return (
    <div className="cluster-card">
      {/* Selection Checkbox */}
      <div className="cluster-header">
        <input 
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
        />
        <h3>{cluster.name}</h3>
        <button 
          className="export-icon-btn"
          onClick={onQuickExport}
          title="Export this cluster"
        >
          📤
        </button>
      </div>
      
      {/* Rest of cluster card content */}
    </div>
  );
}
```

**Export Modal Component:**
```tsx
function ExportModal({ selectedClusterIds, onClose }) {
  const [exportType, setExportType] = useState<'all' | 'selected'>('selected');
  const [format, setFormat] = useState<'csv' | 'excel' | 'json'>('csv');
  const [includeAllKeywords, setIncludeAllKeywords] = useState(true);

  const handleExport = async () => {
    let endpoint: string;
    let body: any;

    if (exportType === 'all') {
      // Export all clusters
      endpoint = `/api/v1/projects/${projectId}/clusters/export`;
      body = {
        export_format: format,
        include_all_keywords: includeAllKeywords
        // cluster_ids omitted = all clusters
      };
    } else {
      // Export selected clusters
      endpoint = `/api/v1/projects/${projectId}/clusters/export`;
      body = {
        cluster_ids: selectedClusterIds,
        export_format: format,
        include_all_keywords: includeAllKeywords
      };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    // Handle file download
    const blob = await response.blob();
    downloadFile(blob, `clusters_export.${format}`);
    onClose();
  };

  return (
    <Modal>
      <h3>Export Clusters</h3>
      
      <div className="export-options">
        <label>
          <input 
            type="radio" 
            value="all" 
            checked={exportType === 'all'}
            onChange={(e) => setExportType('all')}
          />
          Export All Clusters
        </label>
        
        <label>
          <input 
            type="radio" 
            value="selected" 
            checked={exportType === 'selected'}
            onChange={(e) => setExportType('selected')}
          />
          Export Selected Only ({selectedClusterIds.length} clusters)
        </label>
      </div>

      <div className="format-options">
        <label>Format:</label>
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="csv">CSV</option>
          <option value="excel">Excel</option>
          <option value="json">JSON</option>
        </select>
      </div>

      <div className="keyword-options">
        <label>
          <input 
            type="checkbox" 
            checked={includeAllKeywords}
            onChange={(e) => setIncludeAllKeywords(e.target.checked)}
          />
          Include all keywords (not just previews)
        </label>
      </div>

      <div className="modal-actions">
        <button onClick={handleExport}>Export</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}
```

**Single Cluster Export (from detail page):**
```tsx
function ClusterDetailPage({ clusterId }) {
  const handleExportCluster = async () => {
    const response = await fetch(
      `/api/v1/projects/${projectId}/clusters/${clusterId}/export`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          export_format: 'csv',
          include_all_keywords: true
        })
      }
    );

    const blob = await response.blob();
    downloadFile(blob, `cluster_${clusterId}_export.csv`);
  };

  return (
    <div className="cluster-detail">
      <div className="cluster-header">
        <h1>{cluster.name}</h1>
        <button onClick={handleExportCluster}>
          Export This Cluster
        </button>
      </div>
      {/* Rest of cluster detail content */}
    </div>
  );
}
```

## Performance Benefits

### Before Optimization:
- Single request loads all clusters + all keywords
- 55 keywords = ~55+ database calls
- Slow initial page load
- Memory usage grows with project size

### After Optimization:
- Initial load: 6 clusters + (6 × 10) preview keywords = max 66 keywords
- Faster initial page load
- Predictable memory usage
- Better user experience with progressive loading

## Migration Strategy

### Phase 1: Backend Implementation
1. **Add new cluster export endpoints**
   - `POST /projects/{project_id}/clusters/export`
   - `POST /projects/{project_id}/clusters/{cluster_id}/export`
2. **Update cluster response models** for pagination
3. **Modify main clusters endpoint** with keyword preview limits
4. **Maintain backward compatibility** with existing endpoints

### Phase 2: Frontend Updates
1. **Update clusters list component** with pagination and selection
2. **Implement new pagination controls** for clusters and keywords
3. **Add export UI components** (buttons, modal, selection checkboxes)
4. **Update state management** for pagination and selection
5. **Integrate new export endpoints** with proper user flows

### Phase 3: Optimization
1. Add caching strategies
2. Implement prefetching for better UX
3. Add loading states and skeleton screens

## Backward Compatibility

- Current enhanced endpoint available at `/api/v1/projects/{project_id}/clusters/enhanced`
- All existing functionality preserved through dedicated endpoints
- Gradual migration path for existing frontend code

## Testing Considerations

1. **Load Testing:** Verify performance with large datasets (1000+ clusters)
2. **Pagination Testing:** Ensure correct page boundaries and navigation
3. **Export Testing:** Verify both full and selective exports work correctly
4. **Edge Cases:** Empty states, single cluster, single keyword scenarios

## Implementation Status

### ✅ Completed Features

1. **Cluster Detail Modal Pagination**
   - Implemented `useClusterKeywords` hook for paginated keyword fetching
   - Added pagination controls with Previous/Next buttons
   - Fixed data transformation to prevent double-mapping issues
   - Display shows "Page X of Y" with proper total count calculation

2. **API Integration**
   - Updated `ClusterKeywordsResponse` type to match actual API structure
   - Fixed `transformApiResponse` to handle cluster keywords responses correctly
   - Implemented proper field mapping (`opportunity_category` → `opportunity_type`)
   - Removed duplicate action/intent transformations

3. **Performance Optimization**
   - Reduced keyword page size from 25 to 10 keywords per page
   - Implemented cursor-based pagination with `has_more` detection
   - Added loading states and skeleton screens for smooth UX

4. **Data Accuracy**
   - Fixed action mapping so position #1 keywords show "leave" instead of "create"
   - Corrected opportunity and intent badge display
   - Ensured consistent data transformation across the application

### 📋 Implementation Details

**Files Modified:**
- `components/features/clusters/ClusterDetailModal.tsx` - Added pagination state and data fetching
- `components/features/clusters/ClusterKeywordsTable.tsx` - Implemented pagination UI and fixed data mapping
- `lib/api/clusters.ts` - Added `getClusterKeywords` method with 10-keyword page size
- `lib/hooks/use-clusters.ts` - Added `useClusterKeywords` hook
- `lib/utils/api-transforms.ts` - Fixed cluster keywords response handling
- `types/api/cluster.types.ts` - Updated type definitions for paginated responses
- `types/api/common.types.ts` - Added flexible `PaginationInfo` interface

**Key Technical Decisions:**
- Used cursor-based pagination (`has_more`, `next_cursor`) instead of page-based
- Maintained backward compatibility with existing cluster endpoints
- Implemented smart endpoint selection in cluster list (optimized vs enhanced)
- Added proper error handling and loading states

### 🚀 Performance Impact

**Before:**
- Loaded all 19 keywords at once in cluster detail modal
- No pagination controls
- Heavy memory usage for large clusters

**After:**
- Loads 10 keywords per page
- Smooth pagination with Previous/Next controls
- Reduced initial load time and memory usage
- Better user experience for exploring large clusters

## Timeline - COMPLETED

**Actual Development Time:**
- ✅ Frontend integration: 3 days
- ✅ Bug fixes and data mapping: 1 day
- ✅ Testing and refinement: 1 day
- **Total: 5 days**