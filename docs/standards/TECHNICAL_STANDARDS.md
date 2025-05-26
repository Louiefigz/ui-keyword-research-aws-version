# Technical Standards & Best Practices Guide

## Table of Contents
1. [Core Principles](#core-principles)
2. [Code Organization](#code-organization)
3. [File Size Limits](#file-size-limits)
4. [DRY Principles](#dry-principles)
5. [Testing Standards](#testing-standards)
6. [Error Handling](#error-handling)
7. [Code Maintenance](#code-maintenance)
8. [Performance Standards](#performance-standards)
9. [Security Practices](#security-practices)
10. [Code Review Checklist](#code-review-checklist)

---

## Core Principles

### 1. **Code Reusability First**
Before creating any new component, function, or utility:
1. Search existing codebase for similar functionality
2. Check if existing code can be extended
3. Consider extracting shared logic into utilities
4. Document why new code is necessary if proceeding

### 2. **Incremental Refactoring**
- Refactor as you go, not in big batches
- Each PR should leave code better than found
- Remove dead code immediately
- Update related tests when refactoring

### 3. **Explicit Over Implicit**
- Clear naming over clever abbreviations
- Explicit types over inferred types
- Clear error messages over generic ones
- Comments for "why", not "what"

---

## Code Organization

### Directory Structure Standards

```
src/
├── app/                      # Next.js app router (pages only)
│   └── (dashboard)/         # Route groups for layout sharing
├── components/              
│   ├── ui/                  # Base UI components (buttons, cards, etc.)
│   ├── features/            # Feature-specific components
│   │   ├── dashboard/       # Dashboard-related components
│   │   ├── projects/        # Project management components
│   │   ├── upload/          # CSV upload components
│   │   ├── clusters/        # Clustering components
│   │   └── strategic/       # Strategic advice components
│   └── layout/              # Layout components (navbar, sidebar, etc.)
├── lib/                     
│   ├── api/                 # API client and related functions
│   ├── hooks/               # Custom React hooks
│   ├── store/               # Zustand stores
│   ├── utils/               # Utility functions
│   └── constants/           # App-wide constants
├── types/                   # TypeScript type definitions
└── __tests__/               # Test files (mirror src structure)
```

### File Naming Conventions

```typescript
// Components: PascalCase
components/features/dashboard/KeywordTable.tsx
components/ui/Button.tsx

// Hooks: camelCase with 'use' prefix
lib/hooks/useKeywords.ts
lib/hooks/useDebounce.ts

// Utilities: camelCase
lib/utils/formatCurrency.ts
lib/utils/calculateScores.ts

// Types: PascalCase with descriptive suffixes
types/api.types.ts        // API-related types
types/component.types.ts  // Component prop types
types/store.types.ts      // Store state types

// Tests: Same name with .test or .spec
__tests__/components/KeywordTable.test.tsx
__tests__/utils/formatCurrency.test.ts
```

---

## File Size Limits

### Maximum 500 Lines Per File

#### Component Files (< 300 lines recommended)
```typescript
// ❌ BAD: Large monolithic component
// components/features/dashboard/Dashboard.tsx (1000+ lines)
export function Dashboard() {
  // 500+ lines of mixed concerns
  // Multiple responsibilities
  // Hard to test and maintain
}

// ✅ GOOD: Split into focused components
// components/features/dashboard/Dashboard.tsx (< 100 lines)
export function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardSummary />
      <DashboardFilters />
      <DashboardTable />
    </DashboardLayout>
  );
}

// components/features/dashboard/DashboardSummary.tsx (< 150 lines)
// components/features/dashboard/DashboardFilters.tsx (< 200 lines)
// components/features/dashboard/DashboardTable.tsx (< 250 lines)
```

#### Splitting Large Files

```typescript
// When a file approaches 400 lines, split by:

// 1. Extracting Types
// Before: All in one file
interface KeywordTableProps { }
interface ColumnConfig { }
interface FilterState { }
export function KeywordTable() { }

// After: Separate type file
// types/dashboard.types.ts
export interface KeywordTableProps { }
export interface ColumnConfig { }
export interface FilterState { }

// components/KeywordTable.tsx
import type { KeywordTableProps } from '@/types/dashboard.types';

// 2. Extracting Hooks
// Before: Inline complex logic
export function KeywordTable() {
  const [filters, setFilters] = useState();
  const [sort, setSort] = useState();
  // 100+ lines of state logic
}

// After: Custom hook
// lib/hooks/useKeywordTable.ts
export function useKeywordTable() {
  const [filters, setFilters] = useState();
  const [sort, setSort] = useState();
  // State logic here
  return { filters, sort, setFilters, setSort };
}

// 3. Extracting Sub-components
// Before: Everything in one component
export function Dashboard() {
  return (
    <div>
      <div className="summary">...</div> {/* 50 lines */}
      <div className="filters">...</div> {/* 100 lines */}
      <div className="table">...</div>   {/* 200 lines */}
    </div>
  );
}

// After: Separate components
export function Dashboard() {
  return (
    <div>
      <DashboardSummary />
      <DashboardFilters />
      <DashboardTable />
    </div>
  );
}
```

---

## DRY Principles

### 1. Component Reusability

```typescript
// ❌ BAD: Duplicate button implementations
// Found in original UI components - 12 different button variants

// components/SubmitButton.tsx
<button style="padding: 8px 16px; background: #3b82f6; color: white;">
  Submit
</button>

// components/CancelButton.tsx  
<button style="padding: 8px 16px; background: #e5e7eb; color: #374151;">
  Cancel
</button>

// ✅ GOOD: Single reusable component
// components/ui/Button.tsx
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  isLoading,
  children,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size]
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <LoadingSpinner className="mr-2" />}
      {children}
    </button>
  );
}

// Usage
<Button variant="primary">Submit</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost" size="sm">View Details</Button>
```

### 2. Utility Functions

```typescript
// ❌ BAD: Duplicate formatting logic
// components/PriceDisplay.tsx
const formatted = '$' + price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// components/RevenueCard.tsx
const formatted = '$' + revenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// ✅ GOOD: Shared utility function
// lib/utils/formatters.ts
export function formatCurrency(
  amount: number,
  options: {
    currency?: string;
    decimals?: number;
    compact?: boolean;
  } = {}
): string {
  const { currency = 'USD', decimals = 2, compact = false } = options;
  
  if (compact && amount >= 1000) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1
    });
    return formatter.format(amount);
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  
  return formatter.format(amount);
}

// Usage
formatCurrency(1234.56);           // "$1,234.56"
formatCurrency(1234.56, { decimals: 0 }); // "$1,235"
formatCurrency(12345, { compact: true });  // "$12.3K"
```

### 3. Custom Hooks for Shared Logic

```typescript
// ❌ BAD: Duplicate API call logic
// components/Dashboard.tsx
const [data, setData] = useState();
const [loading, setLoading] = useState(true);
const [error, setError] = useState();

useEffect(() => {
  fetch('/api/keywords')
    .then(res => res.json())
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);

// components/KeywordList.tsx
// Same logic repeated...

// ✅ GOOD: Reusable custom hook
// lib/hooks/useApiData.ts
export function useApiData<T>(
  url: string,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!options?.enabled ?? true) return;
    
    const controller = new AbortController();
    
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url, { signal: controller.signal });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        options?.onSuccess?.(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err as Error);
          options?.onError?.(err as Error);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    
    return () => controller.abort();
  }, [url, options?.enabled]);
  
  return { data, loading, error, refetch: fetchData };
}

// Usage
const { data, loading, error } = useApiData<Keyword[]>('/api/keywords');
```

---

## Testing Standards

### Test Coverage Requirements
- Minimum 80% overall coverage
- 90% coverage for utility functions
- 85% coverage for custom hooks
- 75% coverage for components
- 100% coverage for critical business logic

### Test File Organization

```typescript
// Mirror source structure
src/
├── components/features/dashboard/KeywordTable.tsx
└── __tests__/
    └── components/features/dashboard/KeywordTable.test.tsx

// Test file template
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { KeywordTable } from '@/components/features/dashboard/KeywordTable';
import { mockKeywords } from '@/test/fixtures';

describe('KeywordTable', () => {
  // Group related tests
  describe('Rendering', () => {
    it('should render all columns', () => {
      // Test implementation
    });
    
    it('should display loading state', () => {
      // Test implementation
    });
  });
  
  describe('Interactions', () => {
    it('should handle sorting', async () => {
      // Test implementation
    });
    
    it('should handle row selection', async () => {
      // Test implementation
    });
  });
  
  describe('Error States', () => {
    it('should display error message on API failure', () => {
      // Test implementation
    });
  });
});
```

### Testing Utilities

```typescript
// test/utils/render.tsx
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

---

## Error Handling

### Consistent Error Handling Pattern

```typescript
// lib/errors/AppError.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class APIError extends AppError {
  constructor(message: string, statusCode: number, details?: unknown) {
    super(message, 'API_ERROR', statusCode, details);
  }
}

// lib/errors/errorHandler.ts
export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR');
  }
  
  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR');
}
```

### Component Error Boundaries

```typescript
// components/ErrorBoundary.tsx
interface ErrorBoundaryProps {
  fallback?: ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  children: ReactNode;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  { hasError: boolean; error?: Error }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return (
        <Fallback
          error={this.state.error}
          reset={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}
```

### API Error Handling

```typescript
// lib/api/client.ts
import axios, { AxiosError } from 'axios';
import { APIError } from '@/lib/errors';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      throw new APIError(message, error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      throw new APIError('Network error', 0);
    } else {
      // Something else happened
      throw new APIError(error.message, 0);
    }
  }
);
```

---

## Code Maintenance

### Dead Code Removal Process

```typescript
// Before making changes, always:
// 1. Search for usage across codebase
// 2. Check for dynamic imports
// 3. Verify no string references
// 4. Remove associated tests
// 5. Update documentation

// Example: Removing deprecated component
// Step 1: Search for imports
// grep -r "OldComponent" src/

// Step 2: Check for dynamic usage
// grep -r "lazy.*OldComponent" src/

// Step 3: Remove component and tests
// rm src/components/OldComponent.tsx
// rm __tests__/components/OldComponent.test.tsx

// Step 4: Clean up types/interfaces
// Remove from types/component.types.ts
```

### Refactoring Checklist

```typescript
// When refactoring existing code:
// ✅ Search for all usages
// ✅ Update all imports
// ✅ Update tests
// ✅ Update TypeScript types
// ✅ Update documentation
// ✅ Check for breaking changes
// ✅ Add deprecation warnings if needed

// Example: Refactoring a utility function
// lib/utils/formatting.ts

/**
 * @deprecated Use formatCurrency instead
 * Will be removed in v2.0.0
 */
export function formatMoney(amount: number): string {
  console.warn('formatMoney is deprecated. Use formatCurrency instead.');
  return formatCurrency(amount);
}

export function formatCurrency(
  amount: number,
  options: FormatOptions = {}
): string {
  // New implementation
}
```

### Code Update Guidelines

```typescript
// ❌ BAD: Creating duplicate functionality
// lib/utils/newFormatters.ts
export function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

// ✅ GOOD: Updating existing functionality
// lib/utils/formatters.ts
export function formatCurrency(
  amount: number,
  options: FormatOptions = {}
): string {
  // Check if this handles the new use case
  // If not, extend it rather than creating new function
}

// If significant changes needed:
export function formatCurrency(
  amount: number,
  options: FormatOptions & {
    // Add new options here
    showSymbol?: boolean;
    locale?: string;
  } = {}
): string {
  // Extended implementation
}
```

---

## Performance Standards

### Component Optimization

```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = memo(({ data }: Props) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison if needed
  return prevProps.data.id === nextProps.data.id;
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);

// Use useCallback for stable function references
const handleClick = useCallback((id: string) => {
  // Handle click
}, [dependency]);
```

### Bundle Size Optimization

```typescript
// Use dynamic imports for large components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

// Tree-shake imports
// ❌ BAD
import * as utils from '@/lib/utils';

// ✅ GOOD
import { formatCurrency, formatDate } from '@/lib/utils';
```

---

## Security Practices

### Input Validation

```typescript
// Always validate user input
import { z } from 'zod';

const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  settings: z.object({
    minVolume: z.number().min(0).optional(),
    maxKD: z.number().max(100).optional()
  }).optional()
});

export function validateProjectInput(data: unknown) {
  return projectSchema.parse(data);
}
```

### XSS Prevention

```typescript
// React automatically escapes values
// But be careful with dangerouslySetInnerHTML

// ❌ BAD
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ GOOD
import DOMPurify from 'isomorphic-dompurify';

<div 
  dangerouslySetInnerHTML={{ 
    __html: DOMPurify.sanitize(userContent) 
  }} 
/>
```

---

## Code Review Checklist

### Before Submitting PR
- [ ] No files exceed 500 lines
- [ ] No duplicate code (DRY principle followed)
- [ ] All functions have single responsibility
- [ ] Error handling is comprehensive
- [ ] Dead code is removed
- [ ] Tests are included/updated
- [ ] Types are properly defined
- [ ] Documentation is updated

### Review Focus Areas
1. **File Size**: Flag any file > 400 lines
2. **Code Reuse**: Check for similar existing code
3. **Test Coverage**: Verify tests for new code
4. **Error Handling**: Ensure errors are handled
5. **Performance**: Check for optimization opportunities
6. **Security**: Validate user inputs
7. **Accessibility**: Verify ARIA labels and keyboard nav

### Automated Checks

```json
// .eslintrc.json
{
  "rules": {
    "max-lines": ["error", { "max": 500 }],
    "max-lines-per-function": ["error", { "max": 50 }],
    "complexity": ["error", 10],
    "no-duplicate-imports": "error",
    "no-unused-vars": "error",
    "no-console": "warn"
  }
}

// package.json scripts
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "check:size": "find src -name '*.tsx' -o -name '*.ts' | xargs wc -l | sort -n",
    "pre-commit": "npm run lint && npm run typecheck && npm run test"
  }
}
```

---

## Enforcement Tools

### Pre-commit Hooks

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run typecheck
npm run test:changed
```

### GitHub Actions

```yaml
# .github/workflows/code-quality.yml
name: Code Quality

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:coverage
      - name: Check file sizes
        run: |
          for file in $(find src -name "*.tsx" -o -name "*.ts"); do
            lines=$(wc -l < "$file")
            if [ $lines -gt 500 ]; then
              echo "Error: $file has $lines lines (max 500)"
              exit 1
            fi
          done
```

---

## Conclusion

Following these standards ensures:
- Maintainable codebase
- Consistent quality
- Easier onboarding
- Fewer bugs
- Better performance
- Scalable architecture

Remember: **Quality is not negotiable**. Take time to do things right the first time.