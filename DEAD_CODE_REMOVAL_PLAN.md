# Dead Code Removal Plan

## Overview

This document outlines the systematic removal of ~1,100+ lines of dead code identified in the codebase.

## Safety Strategy

1. Create a branch for the entire operation
2. Make atomic commits for each phase
3. Test the application after each phase
4. Document all changes

## Phases

### Phase 1: Remove Unused CSS Classes (Low Risk)

**Files to modify:**

- `/app/globals.css`

**Classes to remove:**

- `.text-balance` (lines 6-8)
- `.section-header` (lines 92-94)
- `.status-success` (lines 105-107)
- `.status-warning` (lines 109-111)
- `.status-info` (lines 113-115)
- `.status-error` (lines 117-119)
- `.focus-ring` (lines 122-124)
- `.transition-base` (lines 127-129)

**Testing:** Visual inspection of all pages

### Phase 2: Remove Unused Components (Medium Risk)

**Files to modify:**

- `/components/features/strategic/StrategicAdviceSkeleton.tsx`
  - Remove `OpportunitiesSkeleton` (lines 86-127)
  - Remove `ContentStrategySkeleton` (lines 129-174)
- `/components/ui/forms/search-input.tsx`
  - Delete entire file
- `/components/ui/forms/index.ts`
  - Remove export for search-input

**Testing:** Check strategic advice page loading states

### Phase 3: Delete Unused Files (Medium Risk)

**Files to delete:**

- `/lib/api/csv.ts`
- `/lib/store/filter-store.ts`
- `/lib/constants/strategic-advice.ts`

**Testing:** Full app functionality check

### Phase 4: Clean Up Store Code (High Risk)

**Files to modify:**

- `/lib/store/dashboard-store.ts`
  - Remove: `visibleColumns`, `setVisibleColumns`, `clearFilters`, `reset`
  - Remove: All selector functions
  - Remove: Sidebar state (duplicate with ui-store)
- `/lib/store/ui-store.ts`
  - Remove: Modal system (`modals`, `openModal`, `closeModal`)
  - Remove: Toast system (`toasts`, `addToast`, `removeToast`)

**Testing:** Dashboard functionality, sidebar toggle

### Phase 5: Remove Unused Types (Medium Risk)

**Files to modify:**

- `/types/component.types.ts`
  - Remove: `NavItemProps`, `FilterBarProps`, `SearchInputProps`, `ProjectCardProps`,
    `ProjectSelectorProps`, `KeywordTableProps`, `KeywordCardProps`, `FileUploadProps`,
    `CSVMappingProps`
- `/types/store.types.ts`
  - Remove: `UploadState`, `ClusterState`, `StrategicAdviceState`
- Various API type files (detailed list in findings)

**Testing:** TypeScript compilation

### Phase 6: Clean Up API Methods (Medium Risk)

**Files to modify:**

- `/lib/api/client.ts`
  - Remove: `handleApiError`, `apiRequest` (make apiClient functions use error handling directly)
- `/lib/api/uploads.ts`
  - Remove: `uploadCSV` method

**Testing:** API calls, error handling

### Phase 7: Final Cleanup

- Remove empty directories
- Update any imports that might have been missed
- Run formatter and linter

## Rollback Strategy

Each phase will be a separate commit. If issues arise:

```bash
git log --oneline  # Find the last working commit
git reset --hard <commit-hash>  # Rollback to that commit
```

## Success Criteria

- Application runs without errors
- All pages load correctly
- No TypeScript errors
- No console errors
- Core functionality intact:
  - Project creation/listing
  - CSV upload
  - Dashboard viewing
  - Clusters viewing
  - Strategic advice

## Commands for Testing

```bash
# Start dev server
npm run dev

# TypeScript check
npm run type-check

# Linting
npm run lint

# Build check
npm run build
```
