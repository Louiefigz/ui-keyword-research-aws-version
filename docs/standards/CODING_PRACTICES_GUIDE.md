# Coding Practices Implementation Guide

## Quick Reference

### Before Writing Any Code

```bash
# 1. Search for existing functionality
grep -r "similar-function" src/
grep -r "ComponentName" src/

# 2. Check file sizes in target directory
find src/components/features/dashboard -name "*.tsx" -exec wc -l {} \; | sort -n

# 3. Look for reusable components
ls src/components/ui/
ls src/lib/utils/
ls src/lib/hooks/
```

---

## Practical Examples

### 1. Converting Inline Styles to Reusable Components

#### ❌ BEFORE (From existing UI components)
```html
<!-- Found in multiple places across UI components -->
<button style="padding: 8px 16px; border-radius: 6px; background-color: #3b82f6; color: white; border: none; cursor: pointer; font-size: 14px; font-weight: 500;">
  Submit
</button>

<button style="padding: 8px 16px; border-radius: 6px; background-color: #10b981; color: white; border: none; cursor: pointer; font-size: 14px; font-weight: 500;">
  Save
</button>

<div style="padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
  <!-- Card content -->
</div>
```

#### ✅ AFTER (DRY Implementation)
```typescript
// src/components/ui/Button.tsx (< 150 lines)
import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { LoadingSpinner } from './LoadingSpinner';

const buttonVariants = {
  base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    success: 'bg-green-500 text-white hover:bg-green-600',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  },
  sizes: {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8',
  }
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variants;
  size?: keyof typeof buttonVariants.sizes;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants.base,
          buttonVariants.variants[variant],
          buttonVariants.sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// src/components/ui/Card.tsx (< 100 lines)
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'ghost';
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-card text-card-foreground',
        variant === 'default' && 'shadow-sm',
        variant === 'bordered' && 'border',
        variant === 'ghost' && 'bg-transparent',
        className
      )}
      {...props}
    />
  );
}
```

### 2. Extracting Shared Logic into Hooks

#### ❌ BEFORE (Duplicated across components)
```typescript
// src/components/features/dashboard/KeywordTable.tsx
export function KeywordTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState('total_points');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({});
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['keywords', page, pageSize, sortBy, sortOrder, filters],
    queryFn: () => fetchKeywords({ page, pageSize, sortBy, sortOrder, ...filters })
  });
  
  // 200+ more lines...
}

// src/components/features/clusters/ClusterList.tsx
export function ClusterList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState('size');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  // Similar pattern repeated...
}
```

#### ✅ AFTER (DRY with custom hook)
```typescript
// src/lib/hooks/usePaginatedData.ts (< 100 lines)
interface UsePaginatedDataOptions<T> {
  queryKey: string;
  fetcher: (params: PaginationParams) => Promise<T>;
  defaultSort?: string;
  defaultPageSize?: number;
}

export function usePaginatedData<T>({
  queryKey,
  fetcher,
  defaultSort = 'id',
  defaultPageSize = 20
}: UsePaginatedDataOptions<T>) {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: defaultPageSize,
    sortBy: defaultSort,
    sortOrder: 'desc' as const
  });
  
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey, pagination],
    queryFn: () => fetcher(pagination),
    keepPreviousData: true
  });
  
  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);
  
  const setSort = useCallback((sortBy: string) => {
    setPagination(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc',
      page: 1 // Reset to first page on sort change
    }));
  }, []);
  
  return {
    data,
    isLoading,
    error,
    pagination,
    goToPage,
    setSort,
    setPageSize: (pageSize: number) => setPagination(prev => ({ ...prev, pageSize, page: 1 }))
  };
}

// Usage in components (now < 200 lines each)
export function KeywordTable() {
  const { data, isLoading, pagination, setSort } = usePaginatedData({
    queryKey: 'keywords',
    fetcher: fetchKeywords,
    defaultSort: 'total_points'
  });
  
  // Component logic focused on rendering
}
```

### 3. Splitting Large Components

#### ❌ BEFORE (600+ lines in one file)
```typescript
// src/components/features/dashboard/Dashboard.tsx
export function Dashboard() {
  // 50+ lines of state
  const [filters, setFilters] = useState({...});
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  // ... more state
  
  // 100+ lines of handlers
  const handleFilterChange = () => { /* ... */ };
  const handleExport = () => { /* ... */ };
  // ... more handlers
  
  return (
    <div>
      {/* Summary section - 80 lines */}
      <div className="grid grid-cols-4 gap-4">
        {/* ... */}
      </div>
      
      {/* Filters section - 150 lines */}
      <div className="filters">
        {/* ... */}
      </div>
      
      {/* Table section - 200 lines */}
      <table>
        {/* ... */}
      </table>
    </div>
  );
}
```

#### ✅ AFTER (Split into manageable files)
```typescript
// src/components/features/dashboard/Dashboard.tsx (< 100 lines)
import { DashboardProvider } from './DashboardContext';
import { DashboardSummary } from './DashboardSummary';
import { DashboardFilters } from './DashboardFilters';
import { DashboardTable } from './DashboardTable';

export function Dashboard() {
  return (
    <DashboardProvider>
      <div className="space-y-6">
        <DashboardSummary />
        <div className="flex gap-6">
          <DashboardFilters className="w-64" />
          <DashboardTable className="flex-1" />
        </div>
      </div>
    </DashboardProvider>
  );
}

// src/components/features/dashboard/DashboardContext.tsx (< 150 lines)
interface DashboardContextValue {
  filters: DashboardFilters;
  setFilters: (filters: DashboardFilters) => void;
  selectedKeywords: string[];
  toggleKeywordSelection: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  
  const toggleKeywordSelection = useCallback((id: string) => {
    setSelectedKeywords(prev => 
      prev.includes(id) 
        ? prev.filter(k => k !== id)
        : [...prev, id]
    );
  }, []);
  
  return (
    <DashboardContext.Provider value={{
      filters,
      setFilters,
      selectedKeywords,
      toggleKeywordSelection
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

// src/components/features/dashboard/DashboardSummary.tsx (< 150 lines)
export function DashboardSummary() {
  const { filters } = useDashboard();
  const { data: summary } = useDashboardSummary(filters);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        title="Total Keywords"
        value={summary?.totalKeywords || 0}
        icon={<Hash className="h-4 w-4" />}
      />
      {/* More cards... */}
    </div>
  );
}
```

### 4. Proper Error Handling Pattern

#### ❌ BEFORE (Inconsistent error handling)
```typescript
// Different error handling in each component
try {
  const data = await fetchData();
  setData(data);
} catch (err) {
  console.error(err);
  alert('Something went wrong!');
}

// Another component
fetch('/api/data')
  .then(res => res.json())
  .then(setData)
  .catch(() => setError('Failed to load'));
```

#### ✅ AFTER (Consistent error handling)
```typescript
// src/lib/errors/handlers.ts
import { toast } from '@/components/ui/toast';
import { AppError, NetworkError, ValidationError } from './types';

export function handleError(error: unknown, context?: string): void {
  const appError = normalizeError(error);
  
  // Log to error tracking service
  if (process.env.NODE_ENV === 'production') {
    logToSentry(appError, { context });
  }
  
  // Show user-friendly message
  showErrorToUser(appError);
}

function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof Error) {
    if (error.message.includes('Network')) {
      return new NetworkError('Connection failed. Please check your internet.');
    }
    return new AppError(error.message, 'UNKNOWN_ERROR');
  }
  
  return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR');
}

function showErrorToUser(error: AppError): void {
  const messages: Record<string, string> = {
    NETWORK_ERROR: 'Connection failed. Please check your internet.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    PERMISSION_ERROR: 'You don\'t have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    DEFAULT: 'Something went wrong. Please try again.'
  };
  
  toast.error(messages[error.code] || messages.DEFAULT);
}

// Usage in components
import { handleError } from '@/lib/errors/handlers';

// In React Query
const { mutate: createProject } = useMutation({
  mutationFn: projectsApi.create,
  onError: (error) => handleError(error, 'Project creation')
});

// In try-catch blocks
try {
  await someAsyncOperation();
} catch (error) {
  handleError(error, 'Operation context');
}
```

### 5. Testing Patterns

#### Unit Test Example
```typescript
// src/lib/utils/__tests__/formatters.test.ts
import { formatCurrency, formatNumber, formatDate } from '../formatters';

describe('formatCurrency', () => {
  it('formats basic currency values', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(-500)).toBe('-$500.00');
  });
  
  it('handles compact format', () => {
    expect(formatCurrency(1000, { compact: true })).toBe('$1K');
    expect(formatCurrency(1500000, { compact: true })).toBe('$1.5M');
  });
  
  it('respects decimal options', () => {
    expect(formatCurrency(10.999, { decimals: 0 })).toBe('$11');
    expect(formatCurrency(10.999, { decimals: 3 })).toBe('$10.999');
  });
});
```

#### Component Test Example
```typescript
// src/components/ui/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('shows loading state', () => {
    render(<Button isLoading>Submit</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
  
  it('applies variant styles', () => {
    const { rerender } = render(<Button variant="primary">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');
    
    rerender(<Button variant="secondary">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-secondary');
  });
});
```

---

## File Size Management

### Monitoring File Sizes

```bash
#!/bin/bash
# scripts/check-file-sizes.sh

echo "Files approaching size limit (400+ lines):"
find src -name "*.tsx" -o -name "*.ts" | while read file; do
  lines=$(wc -l < "$file")
  if [ $lines -gt 400 ]; then
    echo "⚠️  $file: $lines lines"
  fi
done

echo -e "\nFiles exceeding limit (500+ lines):"
find src -name "*.tsx" -o -name "*.ts" | while read file; do
  lines=$(wc -l < "$file")
  if [ $lines -gt 500 ]; then
    echo "❌ $file: $lines lines"
  fi
done
```

### VS Code Settings

```json
// .vscode/settings.json
{
  "editor.rulers": [80, 120],
  "editor.colorDecorators": true,
  "files.exclude": {
    "**/node_modules": true,
    "**/.next": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

---

## Dead Code Detection

### Finding Unused Code

```bash
# Install ts-prune
npm install -g ts-prune

# Run dead code detection
ts-prune

# Example output:
# src/components/OldComponent.tsx:1:0 - default
# src/utils/deprecated.ts:5:2 - oldFunction
```

### Safe Removal Process

```typescript
// 1. Mark as deprecated first
/**
 * @deprecated Will be removed in next version
 * Use NewComponent instead
 */
export function OldComponent() {
  console.warn('OldComponent is deprecated. Use NewComponent instead.');
  return <NewComponent />;
}

// 2. After migration period, remove completely
// git rm src/components/OldComponent.tsx
// git rm src/components/__tests__/OldComponent.test.tsx
```

---

## Common Refactoring Patterns

### 1. Extract Constants

```typescript
// ❌ BEFORE
if (status === 'active' || status === 'pending' || status === 'processing') {
  // ...
}

// ✅ AFTER
// src/lib/constants/status.ts
export const ACTIVE_STATUSES = ['active', 'pending', 'processing'] as const;
export type ActiveStatus = typeof ACTIVE_STATUSES[number];

// Usage
if (ACTIVE_STATUSES.includes(status)) {
  // ...
}
```

### 2. Extract Types

```typescript
// ❌ BEFORE (inline types)
function processKeyword(keyword: {
  id: string;
  text: string;
  volume: number;
  difficulty: number;
}) {
  // ...
}

// ✅ AFTER
// src/types/keyword.types.ts
export interface Keyword {
  id: string;
  text: string;
  volume: number;
  difficulty: number;
}

// Usage
import { Keyword } from '@/types/keyword.types';

function processKeyword(keyword: Keyword) {
  // ...
}
```

### 3. Extract Complex Logic

```typescript
// ❌ BEFORE (complex inline logic)
const isEligible = user.age >= 18 && 
  user.verified && 
  user.accountType !== 'trial' &&
  (user.subscription === 'premium' || user.subscription === 'enterprise') &&
  user.credits > 0;

// ✅ AFTER
// src/lib/utils/user.ts
export function isEligibleUser(user: User): boolean {
  const hasValidAge = user.age >= 18;
  const hasValidAccount = user.verified && user.accountType !== 'trial';
  const hasValidSubscription = ['premium', 'enterprise'].includes(user.subscription);
  const hasCredits = user.credits > 0;
  
  return hasValidAge && hasValidAccount && hasValidSubscription && hasCredits;
}

// Usage
const isEligible = isEligibleUser(user);
```

---

## Pre-commit Validation

```json
// package.json
{
  "scripts": {
    "pre-commit": "lint-staged",
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "bash -c 'if [ $(wc -l < \"$0\") -gt 500 ]; then echo \"Error: $0 exceeds 500 lines\"; exit 1; fi'"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

---

## Team Guidelines

### Code Review Template

```markdown
## PR Checklist

### Code Quality
- [ ] No files exceed 500 lines
- [ ] No duplicate code (checked for existing implementations)
- [ ] Proper error handling implemented
- [ ] Dead code removed
- [ ] Tests added/updated

### Performance
- [ ] Large components are memoized
- [ ] No unnecessary re-renders
- [ ] Images are lazy loaded
- [ ] Bundle size impact checked

### Maintainability
- [ ] Functions have single responsibility
- [ ] Complex logic is extracted
- [ ] Types are properly defined
- [ ] Documentation updated

### Notes for Reviewer
- Key changes:
- Potential impacts:
- Testing approach:
```

Remember: **Better to refactor now than to suffer later!**