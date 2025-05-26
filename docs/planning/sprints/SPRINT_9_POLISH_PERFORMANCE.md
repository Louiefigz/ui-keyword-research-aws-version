# Sprint 9: Polish & Performance
**Duration**: Weeks 17-18 (48 hours)
**Goal**: Implement virtual scrolling, comprehensive error handling, loading states, and performance optimizations

## Epic: Performance & User Experience
Optimize the application for handling large datasets, provide smooth user experience with proper loading states, and ensure robust error handling throughout.

---

## User Stories

### 9.1 Virtual Scrolling (16 hours)
**As a** user with large datasets  
**I want** smooth scrolling performance  
**So that** I can work with 50k+ keywords efficiently

#### Acceptance Criteria
- [ ] Keywords table supports virtual scrolling
- [ ] Cluster keyword lists use virtualization
- [ ] Scroll position is maintained on navigation
- [ ] Dynamic row heights are handled
- [ ] Selection state persists during scroll
- [ ] Performance is smooth with 50k rows
- [ ] Search/filter works with virtual scroll

#### Components to Build
1. **Virtual Table Components**
   - `VirtualKeywordTable.tsx` - Main virtual table
   - `VirtualTableRow.tsx` - Optimized row component
   - `ScrollRestoration.tsx` - Position management
   - `VirtualList.tsx` - Reusable virtual list

#### Implementation
```typescript
// components/features/dashboard/VirtualKeywordTable.tsx
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useRef, useMemo } from 'react';

interface VirtualKeywordTableProps {
  data: Keyword[];
  columns: Column[];
  onSort: (column: string, direction: 'asc' | 'desc') => void;
  selectedRows: Set<string>;
  onRowSelect: (id: string) => void;
}

export function VirtualKeywordTable({
  data,
  columns,
  onSort,
  selectedRows,
  onRowSelect
}: VirtualKeywordTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  // Calculate row height based on content
  const estimateRowHeight = useCallback(() => {
    return 48; // Base height, can be dynamic
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: estimateRowHeight,
    overscan: 10, // Render 10 extra rows outside viewport
    measureElement: (element) => {
      // Support dynamic heights if needed
      return element.getBoundingClientRect().height;
    }
  });

  // Memoize visible data
  const visibleItems = useMemo(() => {
    return rowVirtualizer.getVirtualItems().map(virtualRow => ({
      ...virtualRow,
      data: data[virtualRow.index]
    }));
  }, [rowVirtualizer.getVirtualItems(), data]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const currentIndex = focusedRowIndex;
      const newIndex = e.key === 'ArrowDown' 
        ? Math.min(currentIndex + 1, data.length - 1)
        : Math.max(currentIndex - 1, 0);
      
      setFocusedRowIndex(newIndex);
      rowVirtualizer.scrollToIndex(newIndex, { align: 'auto' });
    }
  }, [focusedRowIndex, data.length, rowVirtualizer]);

  return (
    <div className="relative h-full">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex">
          {columns.map(column => (
            <div
              key={column.key}
              className="flex items-center px-4 py-3 font-medium text-sm"
              style={{ 
                width: columnWidths[column.key] || column.width || 'auto',
                minWidth: column.minWidth
              }}
            >
              {column.sortable ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-medium"
                  onClick={() => onSort(column.key, 'asc')}
                >
                  {column.label}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                column.label
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Virtual Scroll Container */}
      <div
        ref={parentRef}
        className="h-[calc(100%-48px)] overflow-auto"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative'
          }}
        >
          {visibleItems.map((virtualRow) => (
            <VirtualTableRow
              key={virtualRow.data.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
              keyword={virtualRow.data}
              columns={columns}
              isSelected={selectedRows.has(virtualRow.data.id)}
              onSelect={() => onRowSelect(virtualRow.data.id)}
              measureElement={(element) => {
                if (element && virtualRow.measureElement) {
                  virtualRow.measureElement(element);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Scroll Position Indicator */}
      <div className="absolute right-4 bottom-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm">
        {Math.round((rowVirtualizer.scrollOffset / rowVirtualizer.getTotalSize()) * 100)}%
      </div>
    </div>
  );
}

// components/features/dashboard/VirtualTableRow.tsx
const VirtualTableRow = memo(({
  keyword,
  columns,
  isSelected,
  onSelect,
  style,
  measureElement
}: VirtualTableRowProps) => {
  return (
    <div
      ref={measureElement}
      style={style}
      className={cn(
        "flex items-center border-b hover:bg-muted/50 transition-colors",
        isSelected && "bg-primary/5"
      )}
    >
      <div className="flex items-center px-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          aria-label={`Select ${keyword.keyword}`}
        />
      </div>
      
      {columns.map(column => (
        <div
          key={column.key}
          className="px-4 py-3 text-sm"
          style={{ 
            width: column.width || 'auto',
            minWidth: column.minWidth
          }}
        >
          {renderCell(keyword, column)}
        </div>
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom memo comparison
  return (
    prevProps.keyword.id === nextProps.keyword.id &&
    prevProps.keyword.updated_at === nextProps.keyword.updated_at &&
    prevProps.isSelected === nextProps.isSelected
  );
});

// lib/hooks/use-virtual-scroll-restoration.ts
export function useVirtualScrollRestoration(
  virtualizer: Virtualizer<any, any>,
  key: string
) {
  const scrollPositions = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const scrollElement = virtualizer.scrollElement;
    if (!scrollElement) return;

    // Restore position
    const savedPosition = scrollPositions.current.get(key);
    if (savedPosition !== undefined) {
      scrollElement.scrollTop = savedPosition;
    }

    // Save position on scroll
    const handleScroll = () => {
      scrollPositions.current.set(key, scrollElement.scrollTop);
    };

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [virtualizer, key]);

  // Save position on unmount
  useEffect(() => {
    return () => {
      const scrollElement = virtualizer.scrollElement;
      if (scrollElement) {
        scrollPositions.current.set(key, scrollElement.scrollTop);
      }
    };
  }, [virtualizer, key]);
}

// Performance optimization for large datasets
export function useOptimizedKeywordData(
  keywords: Keyword[],
  filters: DashboardFilters,
  sortConfig: SortConfig
) {
  // Use Web Worker for filtering/sorting large datasets
  const worker = useRef<Worker>();

  useEffect(() => {
    worker.current = new Worker('/workers/keyword-processor.js');
    return () => worker.current?.terminate();
  }, []);

  const processedData = useMemo(() => {
    if (keywords.length < 10000) {
      // Process inline for smaller datasets
      return processKeywords(keywords, filters, sortConfig);
    }

    // Use worker for large datasets
    return new Promise<Keyword[]>((resolve) => {
      if (worker.current) {
        worker.current.postMessage({ keywords, filters, sortConfig });
        worker.current.onmessage = (e) => resolve(e.data);
      }
    });
  }, [keywords, filters, sortConfig]);

  return processedData;
}
```

---

### 9.2 Error Handling (12 hours)
**As a** user  
**I want** clear error messages and recovery options  
**So that** I can resolve issues quickly

#### Acceptance Criteria
- [ ] Error boundaries catch component errors
- [ ] API errors show user-friendly messages
- [ ] Network errors are handled gracefully
- [ ] Retry mechanisms work properly
- [ ] Error logs are captured
- [ ] Fallback UI is provided
- [ ] Recovery actions are available

#### Components to Build
1. **Error Components**
   - `ErrorBoundary.tsx` - Global error boundary
   - `ErrorFallback.tsx` - Error UI component
   - `RetryableError.tsx` - Retry functionality
   - `ErrorToast.tsx` - Error notifications

#### Implementation
```typescript
// components/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

export class ErrorBoundary extends Component<
  PropsWithChildren<{ fallback?: ComponentType<ErrorFallbackProps> }>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{ fallback?: ComponentType<ErrorFallbackProps> }>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log to error tracking service
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        tags: { errorBoundary: true },
        extra: { errorId }
      });
    }

    return { 
      hasError: true, 
      error,
      errorId 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('Error Boundary Caught:', error, errorInfo);
    
    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true
      });
    }

    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || ErrorFallback;
      
      return (
        <Fallback
          error={this.state.error!}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          resetError={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

// components/ErrorFallback.tsx
interface ErrorFallbackProps {
  error: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
  resetError: () => void;
}

export function ErrorFallback({ 
  error, 
  errorInfo, 
  errorId, 
  resetError 
}: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    resetError();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>
                An unexpected error occurred. We apologize for the inconvenience.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Error Message</p>
            <p className="text-sm text-muted-foreground font-mono">
              {error.message || 'Unknown error'}
            </p>
          </div>

          {errorId && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>Error ID: {errorId}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(errorId)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleReload} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Page
            </Button>
            <Button variant="outline" onClick={handleGoHome} className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
          </div>

          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full"
            >
              {showDetails ? 'Hide' : 'Show'} Technical Details
              <ChevronDown className={cn(
                "h-4 w-4 ml-2 transition-transform",
                showDetails && "rotate-180"
              )} />
            </Button>

            {showDetails && errorInfo && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-xs font-medium mb-2">Stack Trace</p>
                <pre className="text-xs overflow-auto max-h-48 font-mono">
                  {errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// lib/error-handler.ts
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: any): APIError {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.detail || 
                   error.response.data?.message || 
                   'An error occurred';
    
    return new APIError(
      message,
      error.response.status,
      error.response.data?.code,
      error.response.data?.errors
    );
  } else if (error.request) {
    // Request made but no response
    return new APIError(
      'Unable to connect to server. Please check your internet connection.',
      0,
      'NETWORK_ERROR'
    );
  } else {
    // Something else happened
    return new APIError(
      error.message || 'An unexpected error occurred',
      undefined,
      'UNKNOWN_ERROR'
    );
  }
}

// components/RetryableError.tsx
interface RetryableErrorProps {
  error: Error;
  onRetry: () => void;
  retryCount?: number;
  maxRetries?: number;
}

export function RetryableError({ 
  error, 
  onRetry, 
  retryCount = 0,
  maxRetries = 3 
}: RetryableErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  
  const handleRetry = async () => {
    setIsRetrying(true);
    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
    onRetry();
    setIsRetrying(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="p-3 bg-red-100 rounded-full mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold mb-2">
        Failed to load data
      </h3>
      
      <p className="text-muted-foreground mb-4 max-w-md">
        {error.message || 'An error occurred while loading the data.'}
      </p>

      {retryCount < maxRetries ? (
        <Button
          onClick={handleRetry}
          disabled={isRetrying}
        >
          {isRetrying ? (
            <>
              <LoadingSpinner className="mr-2" />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </>
          )}
        </Button>
      ) : (
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Maximum retry attempts reached. Please refresh the page or contact support.
          </AlertDescription>
        </Alert>
      )}

      {retryCount > 0 && (
        <p className="text-xs text-muted-foreground mt-2">
          Retry attempt {retryCount} of {maxRetries}
        </p>
      )}
    </div>
  );
}
```

---

### 9.3 Loading States (12 hours)
**As a** user  
**I want** smooth loading experiences  
**So that** I know the app is working and responsive

#### Acceptance Criteria
- [ ] Skeleton screens match component layouts
- [ ] Progressive loading for large data
- [ ] Loading indicators are contextual
- [ ] Suspense boundaries work properly
- [ ] Optimistic updates feel instant
- [ ] Loading states don't cause layout shift
- [ ] Timeout handling is implemented

#### Components to Build
1. **Skeleton Components**
   - `DashboardSkeleton.tsx` - Dashboard loading
   - `TableSkeleton.tsx` - Table placeholders
   - `CardSkeleton.tsx` - Card loading states
   - `ChartSkeleton.tsx` - Chart placeholders

#### Implementation
```typescript
// components/skeletons/DashboardSkeleton.tsx
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Summary Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-32 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-32" />
            <div className="h-9 bg-gray-200 rounded w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <TableSkeleton rows={10} columns={8} />
        </CardContent>
      </Card>
    </div>
  );
}

// components/skeletons/TableSkeleton.tsx
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export function TableSkeleton({ 
  rows = 5, 
  columns = 5, 
  showHeader = true 
}: TableSkeletonProps) {
  return (
    <div className="w-full">
      {showHeader && (
        <div className="flex border-b pb-3 mb-3">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1 px-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      )}
      
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex border-b py-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1 px-3">
              <div className={cn(
                "h-4 bg-gray-200 rounded",
                colIndex === 0 && "w-full",
                colIndex === 1 && "w-16",
                colIndex === 2 && "w-12",
                colIndex > 2 && "w-20"
              )} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// components/LoadingOverlay.tsx
interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  fullScreen?: boolean;
}

export function LoadingOverlay({ 
  isLoading, 
  message, 
  fullScreen = false 
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className={cn(
      "absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50",
      fullScreen && "fixed"
    )}>
      <div className="text-center">
        <div className="relative">
          <LoadingSpinner className="h-8 w-8 mx-auto" />
          <div className="absolute inset-0 animate-ping">
            <LoadingSpinner className="h-8 w-8 mx-auto opacity-75" />
          </div>
        </div>
        {message && (
          <p className="mt-4 text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
}

// lib/hooks/use-progressive-loading.ts
export function useProgressiveLoading<T>(
  data: T[],
  options: {
    initialCount?: number;
    increment?: number;
    delay?: number;
  } = {}
) {
  const {
    initialCount = 20,
    increment = 20,
    delay = 100
  } = options;

  const [displayCount, setDisplayCount] = useState(initialCount);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const displayedData = useMemo(() => 
    data.slice(0, displayCount), 
    [data, displayCount]
  );

  const hasMore = displayCount < data.length;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    
    // Simulate progressive loading
    setTimeout(() => {
      setDisplayCount(prev => 
        Math.min(prev + increment, data.length)
      );
      setIsLoadingMore(false);
    }, delay);
  }, [hasMore, isLoadingMore, increment, data.length, delay]);

  // Auto-load on scroll
  useEffect(() => {
    if (!hasMore) return;

    const handleScroll = () => {
      const scrolledToBottom = 
        window.innerHeight + window.scrollY >= 
        document.documentElement.offsetHeight - 100;

      if (scrolledToBottom) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadMore]);

  return {
    displayedData,
    hasMore,
    isLoadingMore,
    loadMore,
    totalCount: data.length,
    displayCount
  };
}

// components/OptimisticUpdate.tsx
export function useOptimisticUpdate<T>() {
  const queryClient = useQueryClient();

  const optimisticUpdate = useCallback((
    queryKey: QueryKey,
    updater: (old: T) => T
  ) => {
    // Cancel in-flight queries
    queryClient.cancelQueries({ queryKey });

    // Snapshot current data
    const previousData = queryClient.getQueryData<T>(queryKey);

    // Optimistically update
    queryClient.setQueryData<T>(queryKey, updater);

    // Return context for rollback
    return { previousData };
  }, [queryClient]);

  const rollback = useCallback((
    queryKey: QueryKey,
    context: { previousData: T }
  ) => {
    queryClient.setQueryData(queryKey, context.previousData);
  }, [queryClient]);

  return { optimisticUpdate, rollback };
}
```

---

### 9.4 Performance Optimization (8 hours)
**As a** developer  
**I want** optimized application performance  
**So that** users have a fast, responsive experience

#### Acceptance Criteria
- [ ] Bundle size is optimized
- [ ] Code splitting is implemented
- [ ] Images are lazy loaded
- [ ] API calls are deduplicated
- [ ] Memory leaks are prevented
- [ ] Re-renders are minimized
- [ ] Performance metrics are tracked

#### Optimization Tasks
1. **Code Splitting**
   - Route-based splitting
   - Component lazy loading
   - Dynamic imports

2. **Bundle Optimization**
   - Tree shaking
   - Minimize dependencies
   - Analyze bundle size

#### Implementation
```typescript
// app/providers.tsx - Lazy load heavy components
const StrategicAdvice = lazy(() => 
  import('@/components/features/strategic-advice').then(mod => ({
    default: mod.StrategicAdviceSection
  }))
);

const ChartsModule = lazy(() => 
  import('@/components/features/charts')
);

// lib/performance/measure.ts
export function measurePerformance(name: string) {
  if (typeof window === 'undefined') return;

  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  const measureName = `${name}-duration`;

  performance.mark(startMark);

  return {
    end: () => {
      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);
      
      const measure = performance.getEntriesByName(measureName)[0];
      
      // Log to analytics
      if (window.gtag) {
        window.gtag('event', 'timing_complete', {
          name,
          value: Math.round(measure.duration)
        });
      }

      // Clean up
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(measureName);

      return measure.duration;
    }
  };
}

// lib/hooks/use-intersection-observer.ts
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<Element | null>(null);

  const updateEntry = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      setEntry(entry);
    },
    []
  );

  useEffect(() => {
    const node = elementRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || !node) return;

    const observer = new IntersectionObserver(updateEntry, options);
    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef.current, updateEntry, options]);

  return { elementRef, entry };
}

// components/LazyImage.tsx
interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function LazyImage({ 
  src, 
  alt, 
  fallback = '/placeholder.png',
  ...props 
}: LazyImageProps) {
  const { elementRef, entry } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  const [imageSrc, setImageSrc] = useState(fallback);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (entry?.isIntersecting && src) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setIsLoading(false);
      };
      img.onerror = () => {
        setIsLoading(false);
      };
    }
  }, [entry?.isIntersecting, src]);

  return (
    <div ref={elementRef} className="relative">
      <img
        {...props}
        src={imageSrc}
        alt={alt}
        className={cn(
          props.className,
          isLoading && "blur-sm",
          "transition-all duration-300"
        )}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </div>
  );
}

// lib/performance/api-deduplication.ts
const requestCache = new Map<string, Promise<any>>();

export function deduplicateRequest<T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> {
  if (requestCache.has(key)) {
    return requestCache.get(key)!;
  }

  const promise = requestFn().finally(() => {
    // Clean up after 100ms to allow for near-simultaneous requests
    setTimeout(() => requestCache.delete(key), 100);
  });

  requestCache.set(key, promise);
  return promise;
}

// Memory leak prevention
export function useCleanup(cleanup: () => void) {
  const cleanupRef = useRef(cleanup);
  cleanupRef.current = cleanup;

  useEffect(() => {
    return () => {
      cleanupRef.current();
    };
  }, []);
}

// Bundle analyzer setup (next.config.js)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // SWC minification
  swcMinify: true,

  // Experimental features
  experimental: {
    optimizeCss: true,
  },
});
```

---

## Definition of Done
- [ ] Virtual scrolling handles 50k+ rows
- [ ] Error boundaries catch all errors
- [ ] Loading states prevent layout shift
- [ ] Bundle size is under 200KB (gzipped)
- [ ] Lighthouse score is 90+
- [ ] Memory usage is stable
- [ ] No console errors in production
- [ ] Performance metrics are tracked

## Sprint Deliverables
1. Virtual scrolling for large datasets
2. Comprehensive error handling
3. Smooth loading states
4. Performance optimizations
5. Code splitting implementation
6. Memory leak prevention
7. Bundle size optimization
8. Performance monitoring

## Performance Benchmarks
- Initial load: < 3s
- Time to interactive: < 5s
- Table render with 10k rows: < 100ms
- Filter application: < 50ms
- Route transitions: < 200ms

## Monitoring Setup
```typescript
// Web Vitals tracking
export function reportWebVitals(metric: any) {
  const { id, name, value } = metric;
  
  // Send to analytics
  window.gtag('event', name, {
    event_category: 'Web Vitals',
    event_label: id,
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    non_interaction: true,
  });
}
```

## Next Sprint Preview
- Comprehensive testing
- Documentation
- Deployment preparation
- Final bug fixes

## Risks & Mitigations
- **Risk**: Virtual scrolling complexity
  - **Mitigation**: Start with basic implementation
- **Risk**: Performance regressions
  - **Mitigation**: Set up monitoring and alerts
- **Risk**: Browser compatibility
  - **Mitigation**: Test on multiple browsers