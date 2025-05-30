# Folder Reorganization Plan

## Overview
This plan addresses organizational improvements to make the codebase cleaner and more maintainable.

## 1. Root Directory Cleanup

### Current Issues:
- 9 documentation files cluttering the root
- Mix of project docs, guides, and status files

### Proposed Structure:
```
/
├── README.md (keep in root - standard practice)
├── docs/
│   ├── guides/
│   │   ├── GETTING_STARTED.md (move)
│   │   ├── PARALLEL_DEVELOPMENT.md (move)
│   │   └── FRONTEND_JOB_INTEGRATION.md (move)
│   ├── project/
│   │   ├── PROJECT_STRUCTURE.md (move)
│   │   ├── SPRINT_STATUS.md (move)
│   │   └── UI_IMPLEMENTATION.md (move)
│   └── technical/
│       ├── TESTING.md (move)
│       └── INFINITE_LOOP_FINDINGS.md (move)
```

## 2. App Directory Consolidation

### Current Issues:
- Root app files (error.tsx, loading.tsx, not-found.tsx) just re-export from _global/
- This indirection is unnecessary

### Actions:
1. **Move content to root**: Copy content from app/_global/ files to root app/ files
2. **Delete _global folder**: Remove the entire app/_global/ directory
3. **Standardize layouts**: Keep layout files with their routes

## 3. Components Organization

### A. Charts Consolidation
Both charts are only used in ClustersSummary component:
- `/components/features/charts/ClusterVolumeChart.tsx` → `/components/features/clusters/ClusterVolumeChart.tsx`
- `/components/features/charts/OpportunityDonutChart.tsx` → `/components/features/clusters/OpportunityDonutChart.tsx`
- Delete the empty `/components/features/charts/` directory

### B. Strategic Components Flattening
Current structure is too deep. Flatten one level:
```
components/features/strategic/
├── ExecutiveSummary.tsx
├── StrategicAdviceSkeleton.tsx
├── ai/                      → Keep as-is (3 files)
├── opportunities/           → Keep as-is (6 files)
├── content-strategy/        → Keep as-is (8 files)
├── competitive-analysis/    → Keep as-is (5 files)
├── implementation/          → Move to opportunities/
├── current-performance/     → Move to root strategic/
└── conversational/          → Keep as-is (new feature)
```

## 4. Library Organization

### Current Structure Issues:
- Utils folder has inconsistent organization
- Some utilities are scattered

### Proposed Utils Structure:
```
lib/utils/
├── api/
│   ├── transforms.ts (rename from api-transforms.ts)
│   └── mappings.ts (rename from keyword-mappings.ts)
├── ui/
│   ├── badge.ts (rename from badge-utils.ts)
│   └── cn.ts
├── format/
│   └── index.ts
├── strategic/
│   └── advice.ts (rename from strategic-advice-utils.ts)
└── validation/
    └── (populate or remove)
```

## 5. Types Organization

### Current Issues:
- api.types.ts at wrong level (should be index)
- Inconsistent naming (keywords-dashboard.types.ts)

### Proposed Structure:
```
types/
├── index.ts (consolidate exports)
├── components.ts (rename from component.types.ts)
├── store.ts (rename from store.types.ts)
└── api/
    ├── index.ts (move content from api.types.ts)
    ├── cluster.ts (rename from cluster.types.ts)
    ├── common.ts
    ├── csv.ts
    ├── dashboard.ts (merge keywords-dashboard.types.ts)
    ├── job.ts
    ├── keyword.ts
    ├── project.ts
    └── strategic.ts
```

## 6. Test Organization

### Current Issues:
- Empty test directories
- Inconsistent test file locations

### Actions:
1. Remove empty test directories under `__tests__/`
2. Create test files next to source files (colocated)
3. Keep integration tests in `__tests__/integration/`

## 7. Empty Directories to Remove

### Delete these empty directories:
- `/app/api/` (empty)
- `/lib/utils/helpers/` (empty)
- `/lib/utils/validation/` (empty or populate)
- `/components/ui/layout/` (empty)
- `/types/common/` (empty)
- `/types/components/` (empty)
- `/__tests__/lib/store/` (empty)
- `/__tests__/lib/utils/` (empty)
- `/__tests__/types/` (empty)

## 8. Naming Standardization

### File Naming Conventions:
1. **Components**: PascalCase (e.g., `ClusterCard.tsx`)
2. **Utilities**: kebab-case (e.g., `api-transforms.ts`)
3. **Types**: kebab-case with `.types.ts` suffix
4. **Tests**: Same name with `.test.ts(x)` suffix
5. **Hooks**: kebab-case starting with `use-`

### Fix These:
- Standardize all type files to remove `.types` from names
- Make utility file names consistent

## 9. Config Files Organization

### Current structure is already good:
```
config/
├── api.constants.ts (keep as-is)
├── ui.constants.ts (keep as-is)
└── app/
    └── index.ts
```
No changes needed - the current structure is clean and well-organized.

## 10. Implementation Priority

### Phase 1 (Low Risk):
1. Move documentation files to docs/ subdirectories
2. Remove empty directories
3. Remove duplicate files in app/_global/

### Phase 2 (Medium Risk):
4. Reorganize utils/ folder
5. Standardize type file names
6. Move charts to feature folders

### Phase 3 (Higher Risk):
7. Flatten strategic components structure
8. Reorganize config files
9. Implement colocated tests

## Benefits
- **Cleaner root**: Only essential files in root
- **Better organization**: Related files grouped together
- **Easier navigation**: Consistent structure and naming
- **Reduced nesting**: Flatter structure where appropriate
- **No dead directories**: Remove all empty folders

## Commands to Execute

### Phase 1 Commands:
```bash
# Create docs subdirectories
mkdir -p docs/guides docs/project docs/technical

# Move documentation files
mv GETTING_STARTED.md docs/guides/
mv PARALLEL_DEVELOPMENT.md docs/guides/
mv FRONTEND_JOB_INTEGRATION.md docs/guides/
mv PROJECT_STRUCTURE.md docs/project/
mv SPRINT_STATUS.md docs/project/
mv UI_IMPLEMENTATION.md docs/project/
mv TESTING.md docs/technical/
mv INFINITE_LOOP_FINDINGS.md docs/technical/

# Remove duplicate files
rm -rf app/_global/

# Remove empty directories
rm -rf app/api/
rm -rf lib/utils/helpers/
rm -rf lib/utils/validation/
rm -rf components/ui/layout/
rm -rf types/common/
rm -rf types/components/
rm -rf __tests__/lib/store/
rm -rf __tests__/lib/utils/
rm -rf __tests__/types/
```

This plan will significantly improve the project's organization and maintainability.