# Coding Standards Overview

This project enforces strict coding standards to ensure maintainability, consistency, and quality.

## 🚨 Key Rules

### 1. **File Size Limit: 500 Lines Maximum**
- Files approaching 400 lines should be refactored
- Use extraction patterns: components, hooks, utilities
- Automated checks prevent commits of oversized files

### 2. **DRY (Don't Repeat Yourself)**
- Search for existing code before creating new
- Extract shared logic into reusable components/utilities
- Minimum 3 occurrences before creating abstraction

### 3. **Testing Requirements**
- Minimum 80% code coverage
- All new features must include tests
- Test files mirror source structure

### 4. **Error Handling**
- Consistent error handling patterns
- User-friendly error messages
- Proper error boundaries for components

### 5. **No Dead Code**
- Remove unused code immediately
- Use deprecation warnings for gradual removal
- Regular dead code scans

## 📁 Project Structure

```
src/
├── app/                    # Next.js pages only (< 100 lines each)
├── components/            
│   ├── ui/                # Reusable UI components (< 150 lines)
│   ├── features/          # Feature components (< 300 lines)
│   └── layout/            # Layout components (< 200 lines)
├── lib/
│   ├── api/              # API functions (< 200 lines)
│   ├── hooks/            # Custom hooks (< 100 lines)
│   ├── utils/            # Utilities (< 100 lines)
│   └── constants/        # Constants and configs
└── types/                # TypeScript definitions
```

## 🛠️ Automated Enforcement

### Pre-commit Hooks
- File size validation
- ESLint checks
- TypeScript compilation
- Test execution
- Console.log detection

### CI/CD Pipeline
- Full test suite
- Coverage reports
- Bundle size analysis
- Performance metrics

## 🚀 Quick Start

### Setup
```bash
# Install dependencies
npm install

# Setup git hooks
npm run prepare

# Run quality checks
npm run quality:check
```

### Daily Workflow
```bash
# Before starting work
git pull
npm install

# Check your code
npm run lint
npm run typecheck
npm run test

# Check file sizes
npm run check:sizes

# Fix issues
npm run lint:fix
npm run format
```

## 📝 Common Patterns

### Creating a Reusable Component
```typescript
// ❌ DON'T: Copy-paste components
// ✅ DO: Extract to src/components/ui/

// src/components/ui/Card.tsx (< 100 lines)
export function Card({ className, ...props }: CardProps) {
  return (
    <div className={cn('rounded-lg bg-white shadow', className)} {...props} />
  );
}
```

### Extracting Complex Logic
```typescript
// ❌ DON'T: Inline complex logic
// ✅ DO: Create custom hooks

// src/lib/hooks/useKeywordFilters.ts (< 100 lines)
export function useKeywordFilters() {
  // Complex filter logic here
  return { filters, updateFilter, resetFilters };
}
```

### Splitting Large Components
```typescript
// ❌ DON'T: 500+ line components
// ✅ DO: Split into smaller parts

// Before: Dashboard.tsx (600 lines)
// After:
// - Dashboard.tsx (50 lines) - Layout only
// - DashboardSummary.tsx (150 lines)
// - DashboardFilters.tsx (200 lines)
// - DashboardTable.tsx (200 lines)
```

## 🔍 Code Review Checklist

Before submitting a PR:
- [ ] No files exceed 500 lines
- [ ] No duplicate code
- [ ] Tests added/updated
- [ ] Error handling in place
- [ ] Dead code removed
- [ ] Types properly defined
- [ ] Documentation updated

## 📊 Monitoring

### Check File Sizes
```bash
./scripts/code-quality.sh
```

### Find Duplicate Code
```bash
jscpd src --min-lines 5
```

### Detect Dead Code
```bash
ts-prune
```

## 🚫 What Gets Blocked

1. **Files over 500 lines** - Split immediately
2. **Any types** - Define proper types
3. **No tests** - Add tests before merge
4. **Console.log** - Use proper logging
5. **Duplicate code** - Extract and reuse
6. **Complex functions** - Simplify or split

## ✅ Best Practices

1. **Think Before Coding**
   - Search for existing solutions
   - Plan component structure
   - Consider reusability

2. **Refactor Continuously**
   - Don't wait for "refactor sprints"
   - Clean as you go
   - Leave code better than you found it

3. **Test Everything**
   - Unit tests for logic
   - Integration tests for APIs
   - Component tests for UI
   - E2E tests for workflows

4. **Document Why, Not What**
   - Code should be self-documenting
   - Comments explain decisions
   - Keep documentation updated

## 🆘 Getting Help

- Run `npm run quality:check` for automated checks
- See `TECHNICAL_STANDARDS.md` for detailed guidelines
- See `CODING_PRACTICES_GUIDE.md` for examples
- Ask team for code review early and often

Remember: **Quality > Speed**. Take time to write clean, maintainable code.