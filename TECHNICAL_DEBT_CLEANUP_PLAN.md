# Technical Debt Cleanup Plan

## Overview

This plan addresses technical practice violations found during code audit on 5/28/2025.

## Priority 1: Critical Violations (Immediate)

### 1.1 File Size Violations

- **Split `types/api.types.ts`** (645 lines → multiple files)
  - Create domain-specific type files:
    - `types/api/keyword.types.ts`
    - `types/api/cluster.types.ts`
    - `types/api/project.types.ts`
    - `types/api/strategic.types.ts`
  - Keep only shared base types in `api.types.ts`

### 1.2 Remove Console Logs

- Remove all 11 console.log statements from production code
- Replace with proper logging service or remove entirely
- Critical files: `job-provider.tsx`, `api/client.ts`

### 1.3 Consolidate Format Utilities

- Delete `/utils/format.ts`
- Use only `/lib/utils/format/index.ts`
- Update all imports to use the consolidated version

## Priority 2: High Impact (This Week)

### 2.1 Extract Shared Badge Logic

- Create `/lib/utils/badge-utils.ts` with:
  - `getDifficultyBadgeVariant()`
  - `getOpportunityBadgeVariant()`
  - `getActionBadgeVariant()`
- Remove duplicate implementations from components

### 2.2 Create Base Table Component

- Build `/components/ui/data-display/base-table.tsx`
- Extract common table logic (filtering, sorting, pagination)
- Refactor existing tables to use base component

### 2.3 Fix TypeScript Any Types

- Replace all `any` types with proper types
- Priority files:
  - `keywords-data-table.tsx` (12 instances)
  - `api-transforms.ts` (6 instances)
  - `FileDropzone.tsx` (1 instance)

### 2.4 Implement Error Handling

- Create `/lib/errors/app-error.ts` class hierarchy
- Add error boundaries for each feature section
- Replace console.error with proper error handling

## Priority 3: Code Organization (Next Sprint)

### 3.1 Split Large Components

- **ROIProjectionsTab.tsx** (402 lines)
  - Extract calculation logic to hooks
  - Split into smaller sub-components
- **KeywordsDataTable.tsx** (347 lines)
  - Extract filter/sort logic
  - Create separate export component

### 3.2 Extract Business Logic

- Move calculations from components to utils/hooks
- Examples:
  - `getProgressWidth()` from ExecutiveSummary
  - Color logic from OpportunityCard
  - Timeline calculations from ROIProjectionsTab

### 3.3 Component Reorganization

- Move `DashboardStatsCard` to `ui/data-display/`
- Review all components for proper categorization

## Priority 4: Long-term Improvements

### 4.1 Create Shared Abstractions

- Filter components for consistent filtering UI
- Export functionality abstraction
- Chart wrapper components for consistent config

### 4.2 Add Missing TypeScript Features

- Add return type annotations to all functions
- Enable stricter TypeScript config
- Add JSDoc for complex types

### 4.3 Testing & Documentation

- Add tests for new shared utilities
- Document new patterns and abstractions
- Update coding standards with examples

## Implementation Order

### Week 1: Critical & Quick Wins

1. Split api.types.ts
2. Remove console.logs
3. Consolidate format utilities
4. Fix any types in critical paths

### Week 2: Shared Utilities

1. Create badge utilities
2. Build base table component
3. Implement AppError class
4. Add error boundaries

### Week 3: Component Refactoring

1. Split large components
2. Extract business logic
3. Reorganize misplaced components

### Week 4: Polish & Documentation

1. Add TypeScript improvements
2. Create remaining abstractions
3. Update documentation
4. Add tests

## Success Metrics

- Zero files over 500 lines
- No console.log in production
- No any types in TypeScript
- 80%+ test coverage maintained
- All components follow single responsibility

## Notes

- Run `npm run lint` after each change
- Update tests as code is refactored
- Consider using automated tools for some refactoring
- Track progress in project management tool
