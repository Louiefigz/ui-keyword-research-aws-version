# API Mismatch Resolution Plan

## Summary of Findings

After thorough analysis of the backend implementation vs frontend expectations:

### ✅ Backend is Correct - Frontend Needs Updates

1. **Clusters API** ✅
   - Backend correctly uses: `/projects/{project_id}/clusters`
   - Frontend needs to change from: `/clusters?project_id={id}`

2. **Keywords Dashboard Parameters** ✅
   - Backend correctly uses: `volume_min`, `volume_max`, `kd_min`, `kd_max`
   - Frontend needs to change from: `min_volume`, `max_volume`, `min_kd`, `max_kd`

3. **CSV Upload Endpoint** ✅
   - Backend correctly provides: `/uploads/csv/upload-keywords` for actual uploads
   - Frontend should not use: `/uploads/csv/validate` for uploads (only for validation)

4. **HTTP Methods** ✅
   - Backend correctly uses PATCH for updates
   - Frontend is correct in using PATCH

### ⚠️ Documentation Needs Correction

1. **Projects List Pagination**
   - Backend uses: `offset` parameter
   - API docs incorrectly state: `skip` parameter
   - Frontend correctly uses: `offset`

### ✅ Endpoints That Exist (Documentation Needs Update)

1. **Archive Project**: `/projects/{id}/archive` exists
2. **Strategic Advice Sub-endpoints** all exist:
   - `/strategic-advice/projects/{id}/opportunities`
   - `/strategic-advice/projects/{id}/content-strategy`
   - `/strategic-advice/projects/{id}/competitive-analysis`
   - `/strategic-advice/projects/{id}/roi-projections`

### ❌ Endpoints That Don't Exist

1. **Individual Keyword Operations**:
   - `GET /projects/{id}/keywords/{keyword_id}` - NOT IMPLEMENTED
   - `PATCH /projects/{id}/keywords/{keyword_id}` - NOT IMPLEMENTED
   
2. **Bulk Update**:
   - `/projects/{id}/keywords/bulk-update` - NOT IMPLEMENTED
   - Updates are handled via: `/projects/{id}/updates/csv`

## Implementation Plan

### Phase 1: Documentation Fixes (Backend Team)

1. **Fix API Documentation**:
   ```diff
   - skip: Pagination offset
   + offset: Pagination offset
   ```

2. **Add Missing Documented Endpoints**:
   - Archive project endpoint
   - All strategic advice sub-endpoints

### Phase 2: Frontend Updates (Frontend Team)

1. **Update Clusters API Calls**:
   ```typescript
   // OLD
   const response = await fetch(`/api/v1/clusters?project_id=${projectId}`)
   
   // NEW
   const response = await fetch(`/api/v1/projects/${projectId}/clusters`)
   ```

2. **Update Keywords Filter Parameters**:
   ```typescript
   // OLD
   const params = {
     min_volume: 100,
     max_volume: 1000,
     min_kd: 0,
     max_kd: 50
   }
   
   // NEW
   const params = {
     volume_min: 100,
     volume_max: 1000,
     kd_min: 0,
     kd_max: 50
   }
   ```

3. **Update CSV Upload Endpoint**:
   ```typescript
   // OLD
   const response = await fetch('/api/v1/uploads/csv/validate', {
     method: 'POST',
     body: formData
   })
   
   // NEW
   const response = await fetch('/api/v1/uploads/csv/upload-keywords', {
     method: 'POST',
     body: formData
   })
   ```

### Phase 3: Feature Decisions (Product Team)

Decide whether to implement missing endpoints or update frontend to use existing patterns:

1. **Individual Keyword Operations**:
   - Option A: Implement GET/PATCH for individual keywords
   - Option B: Use bulk operations via dashboard endpoints

2. **Bulk Updates**:
   - Current: Use `/projects/{id}/updates/csv` for CSV-based updates
   - Alternative: Implement `/projects/{id}/keywords/bulk-update` for JSON updates

## Priority Order

1. **Critical (Breaks Functionality)**:
   - Fix Clusters API paths in frontend
   - Fix keyword filter parameter names in frontend
   - Fix CSV upload endpoint in frontend

2. **Medium (Improves Accuracy)**:
   - Fix pagination parameter in API docs
   - Document missing endpoints

3. **Low (Feature Decisions)**:
   - Decide on individual keyword operations
   - Decide on bulk update patterns

## Testing Checklist

After implementing fixes:

- [ ] Clusters listing works correctly
- [ ] Keyword filtering works with all parameters
- [ ] CSV upload creates processing jobs
- [ ] Project pagination works correctly
- [ ] All strategic advice endpoints return data
- [ ] Archive project functionality works

## Notes for Frontend Team

1. The backend API is stable and correctly implemented
2. Most issues are naming/path mismatches that are easy to fix
3. For missing endpoints, use existing batch/dashboard operations
4. Test with the corrected endpoints before requesting new backend features