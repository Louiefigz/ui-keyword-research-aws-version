# Sprint 3: Keywords Dashboard - Core
**Duration**: Weeks 5-6 (48 hours)
**Goal**: Build the main keywords dashboard with data table, filtering, and search functionality

## Epic: Keywords Analysis Dashboard
Create a comprehensive dashboard for analyzing keyword data with advanced filtering, sorting, and search capabilities.

---

## User Stories

### 3.1 Dashboard Layout & Summary (12 hours)
**As a** user  
**I want** to see a summary of my keyword data  
**So that** I can quickly understand the overall performance and opportunities

#### Acceptance Criteria
- [ ] Summary cards show key metrics
- [ ] Opportunity distribution is visualized
- [ ] Action summary shows recommended tasks
- [ ] Statistics update when filters change
- [ ] Loading states are smooth
- [ ] Mobile layout stacks cards properly

#### API Endpoints
```typescript
GET /projects/{id}/dashboard/summary
```

#### Components to Build
1. **Summary Components**
   - `DashboardSummary.tsx` - Container for summary cards
   - `MetricCard.tsx` - Individual metric display
   - `OpportunityDistribution.tsx` - Opportunity breakdown
   - `ActionSummary.tsx` - Action recommendations

#### Implementation
```typescript
// components/features/dashboard/DashboardSummary.tsx
interface DashboardSummaryProps {
  projectId: string;
  filters: DashboardFilters;
}

export function DashboardSummary({ projectId, filters }: DashboardSummaryProps) {
  const { data: summary, isLoading } = useDashboardSummary(projectId, filters);

  if (isLoading) {
    return <DashboardSummarySkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <MetricCard
        title="Total Keywords"
        value={summary.total_keywords}
        icon={<Hash className="h-4 w-4" />}
        trend={summary.keyword_growth}
      />
      <MetricCard
        title="Total Search Volume"
        value={summary.total_volume}
        format="number"
        icon={<TrendingUp className="h-4 w-4" />}
      />
      <MetricCard
        title="Avg. Position"
        value={summary.avg_position}
        format="decimal"
        icon={<BarChart3 className="h-4 w-4" />}
        inverse={true} // Lower is better
      />
      <MetricCard
        title="Quick Wins"
        value={summary.opportunities.low_hanging}
        icon={<Zap className="h-4 w-4" />}
        className="border-green-200 bg-green-50"
      />
    </div>
  );
}

// components/features/dashboard/OpportunityDistribution.tsx
export function OpportunityDistribution({ data }: { data: OpportunityData }) {
  const chartData = [
    { name: 'Low Hanging', value: data.low_hanging, color: '#10b981' },
    { name: 'Existing', value: data.existing, color: '#3b82f6' },
    { name: 'Clustering', value: data.clustering, color: '#f59e0b' },
    { name: 'Untapped', value: data.untapped, color: '#ef4444' },
    { name: 'Success', value: data.success, color: '#8b5cf6' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opportunity Distribution</CardTitle>
        <CardDescription>
          Keywords categorized by optimization opportunity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name}</span>
                <span className="text-sm font-medium ml-auto">
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="w-32 h-32">
            {/* Implement donut chart here with Recharts */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### 3.2 Keywords Data Table (20 hours)
**As a** user  
**I want** to view and analyze my keywords in a detailed table  
**So that** I can make data-driven SEO decisions

#### Acceptance Criteria
- [ ] Table displays all required columns
- [ ] Columns can be sorted (where applicable)
- [ ] Row selection works for bulk actions
- [ ] Cell formatting matches data types
- [ ] Opportunity and action badges are color-coded
- [ ] Performance is smooth with 100+ rows

#### API Endpoints
```typescript
GET /projects/{id}/dashboard/keywords
```

#### Table Columns
```typescript
const columns = [
  { key: 'keyword', label: 'Keyword', sortable: false },
  { key: 'volume', label: 'Volume', sortable: true },
  { key: 'keyword_difficulty', label: 'KD', sortable: true },
  { key: 'cpc', label: 'CPC', sortable: true },
  { key: 'position', label: 'Position', sortable: true },
  { key: 'traffic', label: 'Traffic', sortable: true },
  { key: 'intent', label: 'Intent', sortable: false },
  { key: 'relevance_score', label: 'Relevance', sortable: true },
  { key: 'cluster', label: 'Cluster', sortable: false },
  { key: 'total_points', label: 'Points', sortable: true },
  { key: 'opportunity', label: 'Opportunity', sortable: false },
  { key: 'action', label: 'Action', sortable: false }
];
```

#### Implementation
```typescript
// components/features/dashboard/KeywordsTable.tsx
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel,
  ColumnDef,
  flexRender 
} from '@tanstack/react-table';

interface KeywordsTableProps {
  data: Keyword[];
  onSort: (column: string, direction: 'asc' | 'desc') => void;
  isLoading: boolean;
}

export function KeywordsTable({ data, onSort, isLoading }: KeywordsTableProps) {
  const columns: ColumnDef<Keyword>[] = [
    {
      accessorKey: 'keyword',
      header: 'Keyword',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.keyword}</div>
      )
    },
    {
      accessorKey: 'metrics.volume',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Volume
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.metrics.volume.toLocaleString()}
        </div>
      )
    },
    {
      accessorKey: 'metrics.keyword_difficulty',
      header: 'KD',
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant={getKDVariant(row.original.metrics.keyword_difficulty)}>
            {row.original.metrics.keyword_difficulty}
          </Badge>
        </div>
      )
    },
    {
      accessorKey: 'classification.opportunity',
      header: 'Opportunity',
      cell: ({ row }) => (
        <OpportunityBadge opportunity={row.original.classification.opportunity} />
      )
    },
    {
      accessorKey: 'classification.action',
      header: 'Action',
      cell: ({ row }) => (
        <ActionBadge action={row.original.classification.action} />
      )
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' 
        ? updater(table.getState().sorting) 
        : updater;
      if (newSorting.length > 0) {
        onSort(newSorting[0].id, newSorting[0].desc ? 'desc' : 'asc');
      }
    }
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <LoadingSpinner />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No keywords found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

#### Badge Components
```typescript
// components/features/dashboard/badges.tsx
const OPPORTUNITY_STYLES = {
  success: { variant: 'default', className: 'bg-purple-100 text-purple-800' },
  low_hanging: { variant: 'default', className: 'bg-green-100 text-green-800' },
  existing: { variant: 'default', className: 'bg-blue-100 text-blue-800' },
  clustering_opportunity: { variant: 'default', className: 'bg-orange-100 text-orange-800' },
  untapped: { variant: 'default', className: 'bg-red-100 text-red-800' }
};

export function OpportunityBadge({ opportunity }: { opportunity: string }) {
  const style = OPPORTUNITY_STYLES[opportunity] || {};
  return (
    <Badge variant={style.variant} className={style.className}>
      {opportunity.replace(/_/g, ' ')}
    </Badge>
  );
}

const ACTION_STYLES = {
  create: { icon: Plus, className: 'bg-green-100 text-green-800' },
  optimize: { icon: Zap, className: 'bg-blue-100 text-blue-800' },
  upgrade: { icon: TrendingUp, className: 'bg-purple-100 text-purple-800' },
  update: { icon: RefreshCw, className: 'bg-orange-100 text-orange-800' },
  leave: { icon: Circle, className: 'bg-gray-100 text-gray-800' }
};

export function ActionBadge({ action }: { action: string }) {
  const style = ACTION_STYLES[action] || {};
  const Icon = style.icon || Circle;
  
  return (
    <Badge variant="outline" className={style.className}>
      <Icon className="w-3 h-3 mr-1" />
      {action}
    </Badge>
  );
}
```

---

### 3.3 Search & Basic Filters (16 hours)
**As a** user  
**I want** to search and filter my keywords  
**So that** I can find specific keywords and analyze subsets of data

#### Acceptance Criteria
- [ ] Search input has 300ms debounce
- [ ] Search works across keyword text
- [ ] Opportunity filters work as checkboxes
- [ ] Action filters work as multi-select
- [ ] Applied filters show count
- [ ] Clear filters button works
- [ ] URL updates with filter state

#### Components to Build
1. **Filter Components**
   - `FilterSidebar.tsx` - Main filter container
   - `SearchInput.tsx` - Debounced search
   - `OpportunityFilter.tsx` - Opportunity checkboxes
   - `ActionFilter.tsx` - Action multi-select
   - `AppliedFilters.tsx` - Active filter display

#### Implementation
```typescript
// components/features/dashboard/FilterSidebar.tsx
interface FilterSidebarProps {
  filters: DashboardFilters;
  onFilterChange: (key: keyof DashboardFilters, value: any) => void;
  onReset: () => void;
}

export function FilterSidebar({ filters, onFilterChange, onReset }: FilterSidebarProps) {
  const hasActiveFilters = Object.values(filters).some(
    value => value !== '' && value?.length !== 0
  );

  return (
    <div className="w-64 border-r bg-gray-50 p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="search">Search Keywords</Label>
          <SearchInput
            id="search"
            value={filters.search}
            onChange={(value) => onFilterChange('search', value)}
            placeholder="Search..."
          />
        </div>

        <Separator />

        <div>
          <Label>Opportunity Type</Label>
          <OpportunityFilter
            selected={filters.opportunityTypes}
            onChange={(value) => onFilterChange('opportunityTypes', value)}
          />
        </div>

        <Separator />

        <div>
          <Label>Recommended Action</Label>
          <ActionFilter
            selected={filters.actions}
            onChange={(value) => onFilterChange('actions', value)}
          />
        </div>
      </div>
    </div>
  );
}

// components/features/dashboard/SearchInput.tsx
export function SearchInput({ value, onChange, ...props }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        {...props}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}

// lib/hooks/use-dashboard-filters.ts
export function useDashboardFilters() {
  const [filters, setFilters] = useState<DashboardFilters>({
    search: '',
    opportunityTypes: [],
    actions: [],
    positionRange: [0, 100],
    volumeRange: [0, 10000],
    kdRange: [0, 100],
    intent: [],
    relevanceRange: [0, 5]
  });

  const updateFilter = useCallback((
    key: keyof DashboardFilters,
    value: any
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const debouncedFilters = useDebounce(filters, 300);

  return {
    filters,
    debouncedFilters,
    updateFilter,
    resetFilters
  };
}
```

---

## Definition of Done
- [ ] Dashboard loads quickly with skeleton states
- [ ] All filters work correctly
- [ ] Search is responsive with debouncing
- [ ] Table sorting updates URL state
- [ ] Mobile layout is functional
- [ ] Error states are handled
- [ ] Performance is acceptable with 100+ rows
- [ ] Filter combinations work correctly

## Sprint Deliverables
1. Dashboard summary with key metrics
2. Fully functional data table
3. Search with debouncing
4. Basic filtering (opportunity, action)
5. Sorting functionality
6. Responsive mobile layout

## Performance Considerations
- Implement skeleton loading states
- Use React.memo for expensive components
- Debounce all filter inputs
- Consider virtual scrolling preparation
- Optimize re-renders with proper keys

## Technical Debt to Track
- Virtual scrolling not yet implemented
- Advanced filters (ranges) planned for Sprint 4
- Column customization planned for Sprint 4
- Export functionality planned for Sprint 4

## Risks & Mitigations
- **Risk**: Table performance with many rows
  - **Mitigation**: Limit initial page size, prepare for virtualization
- **Risk**: Complex filter state management
  - **Mitigation**: Use URL state for persistence
- **Risk**: Mobile table experience
  - **Mitigation**: Consider card view for mobile