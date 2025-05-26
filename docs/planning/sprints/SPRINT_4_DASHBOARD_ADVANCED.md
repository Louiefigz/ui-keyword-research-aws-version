# Sprint 4: Dashboard Advanced & Export
**Duration**: Weeks 7-8 (48 hours)
**Goal**: Complete advanced filtering, implement export functionality, and optimize performance

## Epic: Advanced Dashboard Features
Enhance the dashboard with comprehensive filtering options, export capabilities, and performance optimizations for handling large datasets.

---

## User Stories

### 4.1 Advanced Filters (16 hours)
**As a** power user  
**I want** advanced filtering options  
**So that** I can perform detailed analysis on specific keyword segments

#### Acceptance Criteria
- [ ] Range sliders work smoothly for numeric filters
- [ ] Volume range filter updates table in real-time
- [ ] Position range filter handles 0-100 properly
- [ ] KD range filter shows color indicators
- [ ] Intent filter allows multiple selections
- [ ] Relevance filter uses 1-5 scale
- [ ] Filter presets can be saved and loaded
- [ ] Combined filters work correctly

#### Components to Build
1. **Range Filter Components**
   - `RangeSlider.tsx` - Dual-handle range slider
   - `VolumeRangeFilter.tsx` - Volume-specific formatting
   - `PositionRangeFilter.tsx` - Position with special handling
   - `KDRangeFilter.tsx` - KD with color coding
   - `RelevanceFilter.tsx` - Star-based relevance

2. **Filter Management**
   - `FilterPresets.tsx` - Save/load filter combinations
   - `ActiveFilters.tsx` - Chip display of active filters
   - `FilterStats.tsx` - Show filtered vs total counts

#### Range Slider Implementation
```typescript
// components/ui/RangeSlider.tsx
import * as SliderPrimitive from '@radix-ui/react-slider';

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  formatLabel?: (value: number) => string;
}

export function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onValueChange,
  formatLabel = (v) => v.toString()
}: RangeSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{formatLabel(value[0])}</span>
        <span>{formatLabel(value[1])}</span>
      </div>
      <SliderPrimitive.Root
        className="relative flex w-full touch-none select-none items-center"
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
    </div>
  );
}

// components/features/dashboard/filters/VolumeRangeFilter.tsx
export function VolumeRangeFilter({
  value,
  onChange,
  min = 0,
  max = 100000
}: VolumeRangeFilterProps) {
  const formatVolume = (v: number) => {
    if (v >= 1000) {
      return `${(v / 1000).toFixed(0)}k`;
    }
    return v.toString();
  };

  return (
    <div className="space-y-2">
      <Label>Search Volume</Label>
      <RangeSlider
        min={min}
        max={max}
        step={10}
        value={value}
        onValueChange={onChange}
        formatLabel={formatVolume}
      />
      <div className="flex gap-2">
        <Input
          type="number"
          value={value[0]}
          onChange={(e) => onChange([parseInt(e.target.value) || 0, value[1]])}
          className="h-8"
          placeholder="Min"
        />
        <Input
          type="number"
          value={value[1]}
          onChange={(e) => onChange([value[0], parseInt(e.target.value) || max])}
          className="h-8"
          placeholder="Max"
        />
      </div>
    </div>
  );
}
```

#### Filter Presets
```typescript
// components/features/dashboard/filters/FilterPresets.tsx
interface FilterPreset {
  id: string;
  name: string;
  filters: DashboardFilters;
}

const DEFAULT_PRESETS: FilterPreset[] = [
  {
    id: 'quick-wins',
    name: 'Quick Wins',
    filters: {
      opportunityTypes: ['low_hanging'],
      positionRange: [3, 20],
      volumeRange: [100, 10000],
      kdRange: [0, 30]
    }
  },
  {
    id: 'high-volume',
    name: 'High Volume',
    filters: {
      volumeRange: [1000, 100000],
      kdRange: [0, 50]
    }
  },
  {
    id: 'content-gaps',
    name: 'Content Gaps',
    filters: {
      opportunityTypes: ['untapped'],
      actions: ['create'],
      volumeRange: [50, 100000]
    }
  }
];

export function FilterPresets({
  currentFilters,
  onApplyPreset
}: FilterPresetsProps) {
  const [customPresets, setCustomPresets] = useLocalStorage<FilterPreset[]>(
    'keyword-filter-presets',
    []
  );

  const saveCurrentAsPreset = () => {
    const name = prompt('Enter preset name:');
    if (name) {
      const newPreset: FilterPreset = {
        id: `custom-${Date.now()}`,
        name,
        filters: currentFilters
      };
      setCustomPresets([...customPresets, newPreset]);
      toast.success('Filter preset saved');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Presets</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={saveCurrentAsPreset}
          className="h-7 text-xs"
        >
          <Save className="h-3 w-3 mr-1" />
          Save Current
        </Button>
      </div>
      
      <Select onValueChange={(presetId) => {
        const preset = [...DEFAULT_PRESETS, ...customPresets]
          .find(p => p.id === presetId);
        if (preset) {
          onApplyPreset(preset.filters);
        }
      }}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a preset..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Default Presets</SelectLabel>
            {DEFAULT_PRESETS.map(preset => (
              <SelectItem key={preset.id} value={preset.id}>
                {preset.name}
              </SelectItem>
            ))}
          </SelectGroup>
          {customPresets.length > 0 && (
            <SelectGroup>
              <SelectLabel>Custom Presets</SelectLabel>
              {customPresets.map(preset => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
```

---

### 4.2 Export Functionality (16 hours)
**As a** user  
**I want** to export my keyword data  
**So that** I can share reports with clients or analyze data in other tools

#### Acceptance Criteria
- [ ] Export modal shows format options (CSV, XLSX, JSON)
- [ ] Current filters are preserved in export
- [ ] Export options are clearly explained
- [ ] Progress tracking shows during export
- [ ] Download starts automatically when ready
- [ ] Large exports don't freeze the UI
- [ ] Export history is maintained

#### API Endpoints
```typescript
POST /exports
GET  /exports/jobs/{job_id}
GET  /exports/jobs/{job_id}/download
```

#### Components to Build
1. **Export Components**
   - `ExportModal.tsx` - Main export interface
   - `ExportOptions.tsx` - Format and option selection
   - `ExportProgress.tsx` - Progress tracking
   - `ExportHistory.tsx` - Previous exports

#### Export Modal Implementation
```typescript
// components/features/dashboard/export/ExportModal.tsx
interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  currentFilters: DashboardFilters;
  totalKeywords: number;
  filteredKeywords: number;
}

export function ExportModal({
  isOpen,
  onClose,
  projectId,
  currentFilters,
  totalKeywords,
  filteredKeywords
}: ExportModalProps) {
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'csv',
    includeFilters: true,
    includeClusters: true,
    includeScores: false,
    clientFormat: false
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportJobId, setExportJobId] = useState<string | null>(null);

  const { mutate: createExport } = useCreateExport({
    onSuccess: (data) => {
      setExportJobId(data.job_id);
      setIsExporting(true);
    },
    onError: () => {
      toast.error('Failed to start export');
      setIsExporting(false);
    }
  });

  const handleExport = () => {
    const exportRequest: ExportRequest = {
      project_id: projectId,
      format: exportConfig.format,
      filters: exportConfig.includeFilters ? currentFilters : {},
      options: {
        include_clusters: exportConfig.includeClusters,
        client_format: exportConfig.clientFormat,
        include_scores: exportConfig.includeScores
      }
    };
    
    createExport(exportRequest);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Keywords</DialogTitle>
          <DialogDescription>
            Export your keyword data for external analysis or reporting
          </DialogDescription>
        </DialogHeader>

        {!isExporting ? (
          <>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Export Scope</Label>
                <div className="text-sm text-muted-foreground">
                  {exportConfig.includeFilters ? (
                    <span>
                      Exporting {filteredKeywords.toLocaleString()} filtered keywords
                    </span>
                  ) : (
                    <span>
                      Exporting all {totalKeywords.toLocaleString()} keywords
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Format</Label>
                <RadioGroup
                  value={exportConfig.format}
                  onValueChange={(format) => 
                    setExportConfig(prev => ({ ...prev, format }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="csv" id="csv" />
                    <Label htmlFor="csv" className="font-normal">
                      CSV - Compatible with Excel, Google Sheets
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="xlsx" id="xlsx" />
                    <Label htmlFor="xlsx" className="font-normal">
                      Excel (XLSX) - Native Excel format with formatting
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="json" id="json" />
                    <Label htmlFor="json" className="font-normal">
                      JSON - For developers and data processing
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="filters"
                      checked={exportConfig.includeFilters}
                      onCheckedChange={(checked) =>
                        setExportConfig(prev => ({ 
                          ...prev, 
                          includeFilters: checked as boolean 
                        }))
                      }
                    />
                    <Label htmlFor="filters" className="font-normal">
                      Apply current filters
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="clusters"
                      checked={exportConfig.includeClusters}
                      onCheckedChange={(checked) =>
                        setExportConfig(prev => ({ 
                          ...prev, 
                          includeClusters: checked as boolean 
                        }))
                      }
                    />
                    <Label htmlFor="clusters" className="font-normal">
                      Include cluster information
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="scores"
                      checked={exportConfig.includeScores}
                      onCheckedChange={(checked) =>
                        setExportConfig(prev => ({ 
                          ...prev, 
                          includeScores: checked as boolean 
                        }))
                      }
                    />
                    <Label htmlFor="scores" className="font-normal">
                      Include detailed scoring metrics
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="client"
                      checked={exportConfig.clientFormat}
                      onCheckedChange={(checked) =>
                        setExportConfig(prev => ({ 
                          ...prev, 
                          clientFormat: checked as boolean 
                        }))
                      }
                    />
                    <Label htmlFor="client" className="font-normal">
                      Client-friendly format (simplified columns)
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleExport}>
                Start Export
              </Button>
            </DialogFooter>
          </>
        ) : (
          <ExportProgress
            jobId={exportJobId!}
            onComplete={(downloadUrl) => {
              window.location.href = downloadUrl;
              setTimeout(() => {
                onClose();
                setIsExporting(false);
                setExportJobId(null);
              }, 1000);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// components/features/dashboard/export/ExportProgress.tsx
export function ExportProgress({ 
  jobId, 
  onComplete 
}: { 
  jobId: string; 
  onComplete: (url: string) => void;
}) {
  const { data: job } = useExportJob(jobId, {
    refetchInterval: 1000,
    onSuccess: (data) => {
      if (data.status === 'completed' && data.file_url) {
        onComplete(data.file_url);
      }
    }
  });

  return (
    <div className="py-8 space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <FileDown className="h-12 w-12 text-muted-foreground animate-pulse" />
          {job?.status === 'processing' && (
            <LoadingSpinner className="absolute -bottom-2 -right-2" />
          )}
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="font-medium">
            {job?.status === 'processing' ? 'Preparing Export...' : 'Export Ready!'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {job?.status === 'processing' 
              ? 'This may take a moment for large datasets'
              : 'Your download will start automatically'
            }
          </p>
        </div>

        {job?.status === 'completed' && (
          <CheckCircle className="h-8 w-8 text-green-500" />
        )}
      </div>
    </div>
  );
}
```

---

### 4.3 Performance Optimization (8 hours)
**As a** user  
**I want** the dashboard to remain responsive  
**So that** I can work efficiently with large datasets

#### Acceptance Criteria
- [ ] Table renders smoothly with 500+ rows
- [ ] Filtering doesn't cause UI freezes
- [ ] Sorting is instantaneous on current page
- [ ] Components use React.memo appropriately
- [ ] Re-renders are minimized
- [ ] Memory usage is reasonable

#### Optimization Tasks
1. **Component Optimization**
   - Memoize expensive components
   - Optimize re-render triggers
   - Implement proper key strategies

2. **Data Management**
   - Implement pagination properly
   - Prepare for virtual scrolling
   - Cache filter results

#### Implementation
```typescript
// Memoized table row component
const KeywordRow = memo(({ 
  keyword, 
  onSelect 
}: { 
  keyword: Keyword; 
  onSelect: (id: string) => void;
}) => {
  return (
    <TableRow>
      {/* Row content */}
    </TableRow>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return prevProps.keyword.id === nextProps.keyword.id &&
         prevProps.keyword.updated_at === nextProps.keyword.updated_at;
});

// Optimized filter hook
export function useOptimizedFilters() {
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);
  
  // Memoize filter update functions
  const updateFilter = useCallback((
    key: keyof DashboardFilters,
    value: any
  ) => {
    setFilters(prev => {
      // Only update if value actually changed
      if (JSON.stringify(prev[key]) === JSON.stringify(value)) {
        return prev;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  // Memoize expensive filter calculations
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(
      value => value !== '' && value?.length !== 0
    ).length;
  }, [filters]);

  return {
    filters,
    updateFilter,
    activeFilterCount
  };
}
```

---

### 4.4 Column Customization (8 hours)
**As a** user  
**I want** to customize which columns I see  
**So that** I can focus on the metrics that matter to me

#### Acceptance Criteria
- [ ] Column selector shows all available columns
- [ ] Selected columns persist across sessions
- [ ] Column order can be changed
- [ ] Default columns are sensible
- [ ] Mobile shows essential columns only
- [ ] Export respects column selection

#### Components to Build
1. **Column Management**
   - `ColumnSelector.tsx` - Checkbox list of columns
   - `ColumnReorder.tsx` - Drag to reorder interface
   - `ColumnPresets.tsx` - Quick column sets

#### Implementation
```typescript
// components/features/dashboard/ColumnSelector.tsx
interface Column {
  key: string;
  label: string;
  required?: boolean;
  defaultVisible?: boolean;
}

export function ColumnSelector({
  availableColumns,
  visibleColumns,
  onColumnToggle,
  onColumnReorder
}: ColumnSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-2" />
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Visible Columns</h4>
            <div className="space-y-2">
              {availableColumns.map((column) => (
                <div
                  key={column.key}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={column.key}
                    checked={visibleColumns.includes(column.key)}
                    onCheckedChange={(checked) => {
                      onColumnToggle(column.key, checked as boolean);
                    }}
                    disabled={column.required}
                  />
                  <Label
                    htmlFor={column.key}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {column.label}
                  </Label>
                  {column.required && (
                    <span className="text-xs text-muted-foreground">
                      Required
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const defaults = availableColumns
                  .filter(c => c.defaultVisible || c.required)
                  .map(c => c.key);
                onColumnToggle('reset', defaults);
              }}
            >
              Reset to Defaults
            </Button>
            <span className="text-sm text-muted-foreground">
              {visibleColumns.length} of {availableColumns.length} columns
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

---

## Definition of Done
- [ ] All advanced filters work correctly
- [ ] Export process is smooth and reliable
- [ ] Performance meets requirements
- [ ] Column customization persists
- [ ] Mobile experience is optimized
- [ ] URL state management works
- [ ] Loading states are smooth
- [ ] Error handling is comprehensive

## Sprint Deliverables
1. Complete filter system with ranges
2. Filter presets functionality
3. Full export workflow
4. Performance optimizations
5. Column customization
6. Improved mobile experience

## Performance Benchmarks
- Table should render < 100ms with 500 rows
- Filter changes should apply < 200ms
- Export should start < 1s after click
- No memory leaks with extended use
- Smooth scrolling maintained

## Next Sprint Preview
- Virtual scrolling implementation
- Clusters feature
- Data visualizations
- Strategic advice beginnings

## Risks & Mitigations
- **Risk**: Export might timeout for large datasets
  - **Mitigation**: Implement chunked exports, show progress
- **Risk**: Complex filters might be confusing
  - **Mitigation**: Add filter presets, clear UI
- **Risk**: Performance with many filters
  - **Mitigation**: Debounce, optimize query construction