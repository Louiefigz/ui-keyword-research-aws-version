# Sprint 8: Implementation & Updates
**Duration**: Weeks 15-16 (48 hours)
**Goal**: Complete implementation roadmap, build CSV update workflow, add cache management, and implement remaining features

## Epic: Advanced Features & Management
Enable users to follow implementation roadmaps, update keyword data seamlessly, manage cache performance, and access global features throughout the application.

---

## User Stories

### 8.1 Implementation Roadmap (12 hours)
**As a** project manager  
**I want** a clear implementation roadmap  
**So that** I can execute SEO improvements systematically

#### Acceptance Criteria
- [ ] Roadmap displays phased approach
- [ ] Timeline visualization is clear
- [ ] Tasks are actionable and specific
- [ ] Success metrics are defined
- [ ] Progress tracking is available
- [ ] Export roadmap to project management tools
- [ ] Mobile view works properly

#### Components to Build
1. **Roadmap Components**
   - `ImplementationRoadmap.tsx` - Main roadmap view
   - `RoadmapPhase.tsx` - Individual phase display
   - `TaskTimeline.tsx` - Visual timeline
   - `ProgressTracker.tsx` - Track completion

#### Implementation
```typescript
// components/features/strategic-advice/ImplementationRoadmap.tsx
interface ImplementationRoadmapProps {
  roadmap: RoadmapData;
  onTaskComplete: (phaseId: string, taskId: string) => void;
}

export function ImplementationRoadmap({ roadmap, onTaskComplete }: ImplementationRoadmapProps) {
  const [expandedPhases, setExpandedPhases] = useState<string[]>(['week_1_2']);
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');

  const phases = [
    {
      id: 'week_1_2',
      title: 'Weeks 1-2: Quick Wins',
      data: roadmap.week_1_2,
      color: 'green'
    },
    {
      id: 'week_3_4',
      title: 'Weeks 3-4: Technical Optimization',
      data: roadmap.week_3_4,
      color: 'blue'
    },
    {
      id: 'month_2',
      title: 'Month 2: Content Creation',
      data: roadmap.month_2_onwards,
      color: 'purple'
    },
    {
      id: 'month_3_onwards',
      title: 'Month 3+: Ongoing Optimization',
      data: roadmap.month_3_onwards,
      color: 'orange'
    }
  ];

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev =>
      prev.includes(phaseId)
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Implementation Roadmap</h2>
          <p className="text-muted-foreground">
            Step-by-step guide to execute your SEO strategy
          </p>
        </div>
        <div className="flex gap-2">
          <ToggleGroup type="single" value={viewMode} onValueChange={setViewMode}>
            <ToggleGroupItem value="timeline" aria-label="Timeline view">
              <Calendar className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* View Mode */}
      {viewMode === 'timeline' ? (
        <TaskTimeline phases={phases} />
      ) : (
        <div className="space-y-4">
          {phases.map((phase) => (
            <RoadmapPhase
              key={phase.id}
              phase={phase}
              isExpanded={expandedPhases.includes(phase.id)}
              onToggle={() => togglePhase(phase.id)}
              onTaskComplete={(taskId) => onTaskComplete(phase.id, taskId)}
            />
          ))}
        </div>
      )}

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressTracker phases={phases} />
        </CardContent>
      </Card>
    </div>
  );
}

// components/features/strategic-advice/RoadmapPhase.tsx
interface RoadmapPhaseProps {
  phase: Phase;
  isExpanded: boolean;
  onToggle: () => void;
  onTaskComplete: (taskId: string) => void;
}

export function RoadmapPhase({ 
  phase, 
  isExpanded, 
  onToggle, 
  onTaskComplete 
}: RoadmapPhaseProps) {
  const [completedTasks, setCompletedTasks] = useLocalStorage<string[]>(
    `roadmap-${phase.id}-completed`,
    []
  );

  const handleTaskComplete = (taskId: string) => {
    const newCompleted = completedTasks.includes(taskId)
      ? completedTasks.filter(id => id !== taskId)
      : [...completedTasks, taskId];
    
    setCompletedTasks(newCompleted);
    onTaskComplete(taskId);
  };

  const progress = phase.data.tasks 
    ? (completedTasks.length / phase.data.tasks.length) * 100
    : 0;

  return (
    <Card className={cn(
      "transition-all",
      isExpanded && "ring-2 ring-primary ring-offset-2"
    )}>
      <CardHeader 
        className="cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-3 h-3 rounded-full",
              phase.color === 'green' && "bg-green-500",
              phase.color === 'blue' && "bg-blue-500",
              phase.color === 'purple' && "bg-purple-500",
              phase.color === 'orange' && "bg-orange-500"
            )} />
            <div>
              <CardTitle className="text-lg">{phase.title}</CardTitle>
              <CardDescription>{phase.data.focus}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{progress.toFixed(0)}%</p>
              <Progress value={progress} className="w-24 h-2" />
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Tasks */}
          {phase.data.tasks && (
            <div className="space-y-3">
              <h4 className="font-medium">Tasks</h4>
              {phase.data.tasks.map((task, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border",
                    completedTasks.includes(`task-${index}`) && "bg-muted"
                  )}
                >
                  <Checkbox
                    checked={completedTasks.includes(`task-${index}`)}
                    onCheckedChange={() => handleTaskComplete(`task-${index}`)}
                  />
                  <div className="flex-1 space-y-1">
                    <p className={cn(
                      "text-sm",
                      completedTasks.includes(`task-${index}`) && "line-through text-muted-foreground"
                    )}>
                      {task.keyword || task.action || task.description}
                    </p>
                    {task.current_position && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Position: {task.current_position}</span>
                        <span>→</span>
                        <span className="text-green-600">
                          Expected: +{task.expected_improvement}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Success Metrics */}
          {phase.data.success_metrics && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Success Metrics</h4>
              <p className="text-sm text-muted-foreground">
                {phase.data.success_metrics}
              </p>
            </div>
          )}

          {/* Schedule */}
          {phase.data.schedule && (
            <div className="space-y-3">
              <h4 className="font-medium">Content Schedule</h4>
              {phase.data.schedule.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.content}</p>
                    <p className="text-sm text-muted-foreground">{item.type}</p>
                  </div>
                  <Badge variant="outline">Month {item.month}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// components/features/strategic-advice/TaskTimeline.tsx
export function TaskTimeline({ phases }: { phases: Phase[] }) {
  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300" />

      {/* Phases */}
      <div className="space-y-8">
        {phases.map((phase, index) => (
          <div key={phase.id} className="relative flex gap-4">
            {/* Timeline Node */}
            <div className="relative z-10">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center text-white font-bold",
                phase.color === 'green' && "bg-green-500",
                phase.color === 'blue' && "bg-blue-500",
                phase.color === 'purple' && "bg-purple-500",
                phase.color === 'orange' && "bg-orange-500"
              )}>
                {index + 1}
              </div>
            </div>

            {/* Phase Content */}
            <div className="flex-1 pb-8">
              <Card>
                <CardHeader>
                  <CardTitle>{phase.title}</CardTitle>
                  <CardDescription>{phase.data.focus}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {phase.data.tasks?.slice(0, 3).map((task, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Circle className="h-2 w-2 text-muted-foreground" />
                        <span>{task.keyword || task.description}</span>
                      </div>
                    ))}
                    {phase.data.tasks && phase.data.tasks.length > 3 && (
                      <p className="text-sm text-muted-foreground">
                        +{phase.data.tasks.length - 3} more tasks
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 8.2 CSV Update Workflow (20 hours)
**As a** user  
**I want** to update my keyword data with new CSVs  
**So that** I can track changes and maintain current data

#### Acceptance Criteria
- [ ] Update tab shows clear options
- [ ] Preview displays changes clearly
- [ ] Update strategies are explained
- [ ] Deletion detection works
- [ ] Conflict resolution is intuitive
- [ ] History of updates is maintained
- [ ] Rollback functionality exists

#### API Endpoints
```typescript
POST /csv/update
POST /conflicts/resolve
```

#### Components to Build
1. **Update Components**
   - `UpdateTab.tsx` - Enhanced upload tab
   - `UpdatePreview.tsx` - Changes preview
   - `ConflictResolver.tsx` - Conflict UI
   - `UpdateHistory.tsx` - Past updates
   - `DiffViewer.tsx` - Show changes

#### Implementation
```typescript
// components/features/upload/UpdateTab.tsx
interface UpdateTabProps {
  projectId: string;
  onUpdateComplete: () => void;
}

export function UpdateTab({ projectId, onUpdateComplete }: UpdateTabProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [updateStrategy, setUpdateStrategy] = useState<UpdateStrategy>('merge_best');
  const [detectDeletions, setDetectDeletions] = useState(true);
  const [preview, setPreview] = useState<UpdatePreview | null>(null);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [showConflictModal, setShowConflictModal] = useState(false);

  const { mutate: processUpdate } = useUpdateCSV({
    onSuccess: (data) => {
      if (data.conflicts && data.conflicts.length > 0) {
        setConflicts(data.conflicts);
        setShowConflictModal(true);
      } else {
        toast.success('Keywords updated successfully');
        onUpdateComplete();
      }
    }
  });

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    // Generate preview
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', projectId);
    formData.append('preview_only', 'true');
    
    const preview = await api.previewUpdate(formData);
    setPreview(preview);
  };

  const handleUpdate = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('project_id', projectId);
    formData.append('update_strategy', updateStrategy);
    formData.append('detect_deletions', detectDeletions.toString());

    processUpdate(formData);
  };

  return (
    <div className="space-y-6">
      {/* Strategy Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Update Strategy</CardTitle>
          <CardDescription>
            Choose how to handle existing keywords when updating
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={updateStrategy} onValueChange={setUpdateStrategy}>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="merge_best" id="merge_best" />
                <div className="flex-1">
                  <Label htmlFor="merge_best" className="font-medium">
                    Merge Best Data (Recommended)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Keep the best metrics from both old and new data. Updates positions, 
                    traffic, and other metrics while preserving historical data.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem value="replace_all" id="replace_all" />
                <div className="flex-1">
                  <Label htmlFor="replace_all" className="font-medium">
                    Replace All Data
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Completely replace existing data with new CSV. 
                    Use when you want a fresh start.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem value="keep_existing" id="keep_existing" />
                <div className="flex-1">
                  <Label htmlFor="keep_existing" className="font-medium">
                    Keep Existing Data
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Only add new keywords, don't update existing ones. 
                    Use when you want to preserve all current data.
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>

          <Separator />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="detect_deletions"
              checked={detectDeletions}
              onCheckedChange={setDetectDeletions}
            />
            <Label htmlFor="detect_deletions" className="font-normal">
              Detect deleted keywords (mark keywords not in new CSV as removed)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Updated CSV</CardTitle>
          <CardDescription>
            Select a new CSV file with updated keyword data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileDropzone
            onFileSelect={handleFileSelect}
            accept=".csv"
            isProcessing={false}
          />
        </CardContent>
      </Card>

      {/* Update Preview */}
      {preview && (
        <UpdatePreviewCard
          preview={preview}
          updateStrategy={updateStrategy}
          onProceed={handleUpdate}
          onCancel={() => {
            setSelectedFile(null);
            setPreview(null);
          }}
        />
      )}

      {/* Conflict Resolution Modal */}
      <ConflictResolutionModal
        conflicts={conflicts}
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        onResolve={(resolutions) => {
          api.resolveConflicts({
            job_id: preview?.job_id,
            resolutions
          }).then(() => {
            toast.success('Conflicts resolved, update completed');
            onUpdateComplete();
          });
        }}
      />
    </div>
  );
}

// components/features/upload/UpdatePreviewCard.tsx
interface UpdatePreviewCardProps {
  preview: UpdatePreview;
  updateStrategy: UpdateStrategy;
  onProceed: () => void;
  onCancel: () => void;
}

export function UpdatePreviewCard({ 
  preview, 
  updateStrategy, 
  onProceed, 
  onCancel 
}: UpdatePreviewCardProps) {
  const hasChanges = preview.new_keywords > 0 || 
                    preview.updated_keywords > 0 || 
                    preview.deleted_keywords > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Preview</CardTitle>
        <CardDescription>
          Review changes before applying the update
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="text-2xl font-bold text-green-600">
              {preview.new_keywords}
            </p>
            <p className="text-sm text-green-700">New Keywords</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">
              {preview.updated_keywords}
            </p>
            <p className="text-sm text-blue-700">Updated</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-2xl font-bold text-gray-600">
              {preview.unchanged_keywords}
            </p>
            <p className="text-sm text-gray-700">Unchanged</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-2xl font-bold text-red-600">
              {preview.deleted_keywords}
            </p>
            <p className="text-sm text-red-700">Deleted</p>
          </div>
        </div>

        {/* Sample Changes */}
        {preview.sample_changes && (
          <div className="space-y-3">
            <h4 className="font-medium">Sample Changes</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {preview.sample_changes.map((change, index) => (
                <DiffViewer key={index} change={change} />
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {preview.warnings && preview.warnings.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warnings</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {preview.warnings.map((warning, index) => (
                  <li key={index} className="text-sm">{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {!hasChanges && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              No changes detected. The uploaded file matches your current data.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        <Button 
          onClick={onProceed} 
          disabled={!hasChanges}
          className="flex-1"
        >
          Apply Update
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}

// components/features/upload/DiffViewer.tsx
interface DiffViewerProps {
  change: KeywordChange;
}

export function DiffViewer({ change }: DiffViewerProps) {
  const getChangeIcon = () => {
    switch (change.type) {
      case 'new': return <Plus className="h-4 w-4 text-green-600" />;
      case 'updated': return <RefreshCw className="h-4 w-4 text-blue-600" />;
      case 'deleted': return <Trash2 className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
      {getChangeIcon()}
      <div className="flex-1 space-y-1">
        <p className="font-medium text-sm">{change.keyword}</p>
        {change.type === 'updated' && change.changes && (
          <div className="space-y-1">
            {Object.entries(change.changes).map(([field, values]) => (
              <div key={field} className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground capitalize">
                  {field.replace('_', ' ')}:
                </span>
                <span className="line-through text-red-600">
                  {values.old}
                </span>
                <ArrowRight className="h-3 w-3" />
                <span className="text-green-600">
                  {values.new}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### 8.3 Cache Management (8 hours)
**As a** power user  
**I want** to manage application cache  
**So that** I can optimize performance and troubleshoot issues

#### Acceptance Criteria
- [ ] Cache metrics are displayed clearly
- [ ] Clear cache functionality works
- [ ] Performance indicators are shown
- [ ] Cache size is visible
- [ ] Hit rate is calculated
- [ ] Settings are accessible
- [ ] Admin panel is clean

#### API Endpoints
```typescript
GET  /cache/metrics
POST /cache/clear/all
```

#### Components to Build
1. **Cache Components**
   - `CacheManagement.tsx` - Main cache UI
   - `CacheMetrics.tsx` - Statistics display
   - `PerformanceIndicators.tsx` - Performance metrics
   - `CacheActions.tsx` - Clear cache controls

#### Implementation
```typescript
// components/features/settings/CacheManagement.tsx
export function CacheManagement() {
  const { data: metrics, isLoading, refetch } = useCacheMetrics();
  const { mutate: clearCache } = useClearCache();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearCache = () => {
    clearCache(undefined, {
      onSuccess: () => {
        toast.success('Cache cleared successfully');
        refetch();
        setShowConfirm(false);
      },
      onError: () => {
        toast.error('Failed to clear cache');
      }
    });
  };

  if (isLoading) return <CacheMetricsSkeleton />;

  const hitRate = metrics ? (metrics.cache.hit_rate * 100).toFixed(1) : 0;
  const sizeInMB = metrics ? (metrics.cache.size_bytes / 1024 / 1024).toFixed(2) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Cache Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage application cache performance
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={() => setShowConfirm(true)}
          disabled={metrics?.cache.entry_count === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cache
        </Button>
      </div>

      {/* Cache Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Hit Rate"
          value={`${hitRate}%`}
          icon={<Target className="h-4 w-4" />}
          description="Cache effectiveness"
          className={hitRate > 80 ? "border-green-200" : "border-orange-200"}
        />
        <MetricCard
          title="Cache Size"
          value={`${sizeInMB} MB`}
          icon={<HardDrive className="h-4 w-4" />}
          description="Total cache storage"
        />
        <MetricCard
          title="Entries"
          value={metrics?.cache.entry_count || 0}
          icon={<Database className="h-4 w-4" />}
          description="Cached items"
        />
        <MetricCard
          title="Compression"
          value={`${(metrics?.performance.compression_ratio * 100).toFixed(0)}%`}
          icon={<Minimize2 className="h-4 w-4" />}
          description="Data compression ratio"
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cache Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Hits</span>
                <span className="font-medium">
                  {metrics?.cache.hits.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Misses</span>
                <span className="font-medium">
                  {metrics?.cache.misses.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sets</span>
                <span className="font-medium">
                  {metrics?.cache.sets.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Deletes</span>
                <span className="font-medium">
                  {metrics?.cache.deletes.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg Get Time</span>
                <span className="font-medium">
                  {metrics?.performance.avg_get_time_ms.toFixed(1)} ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg Set Time</span>
                <span className="font-medium">
                  {metrics?.performance.avg_set_time_ms.toFixed(1)} ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Memory Used</span>
                <span className="font-medium">{sizeInMB} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Cleared</span>
                <span className="font-medium">
                  {metrics?.last_cleared || 'Never'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cache Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <CachePerformanceChart />
        </CardContent>
      </Card>

      {/* Clear Cache Confirmation */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Cache?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all cached data ({metrics?.cache.entry_count} entries, {sizeInMB} MB). 
              The application may be slower temporarily while the cache rebuilds.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearCache}>
              Clear Cache
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```

---

### 8.4 Global Features (8 hours)
**As a** user  
**I want** quick access to common actions  
**So that** I can work efficiently across the application

#### Acceptance Criteria
- [ ] Keyboard shortcuts work globally
- [ ] Global search finds keywords/projects
- [ ] Help system is accessible
- [ ] User preferences persist
- [ ] Quick actions menu works
- [ ] Command palette functions
- [ ] Notifications display properly

#### Components to Build
1. **Global Components**
   - `CommandPalette.tsx` - Cmd+K interface
   - `GlobalSearch.tsx` - Search overlay
   - `KeyboardShortcuts.tsx` - Shortcut handler
   - `QuickActions.tsx` - Action menu
   - `NotificationCenter.tsx` - Toast system

#### Implementation
```typescript
// components/features/global/CommandPalette.tsx
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { currentProject } = useUIStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const commands = [
    {
      group: 'Navigation',
      items: [
        {
          id: 'dashboard',
          label: 'Go to Dashboard',
          icon: LayoutDashboard,
          shortcut: ['⌘', 'D'],
          action: () => router.push(`/projects/${currentProject?.id}/dashboard`)
        },
        {
          id: 'clusters',
          label: 'View Clusters',
          icon: Network,
          shortcut: ['⌘', 'C'],
          action: () => router.push(`/projects/${currentProject?.id}/clusters`)
        },
        {
          id: 'strategic',
          label: 'Strategic Advice',
          icon: Lightbulb,
          shortcut: ['⌘', 'S'],
          action: () => router.push(`/projects/${currentProject?.id}/strategic-advice`)
        }
      ]
    },
    {
      group: 'Actions',
      items: [
        {
          id: 'upload',
          label: 'Upload CSV',
          icon: Upload,
          action: () => router.push(`/projects/${currentProject?.id}/upload`)
        },
        {
          id: 'export',
          label: 'Export Keywords',
          icon: Download,
          action: () => eventBus.emit('export:open')
        },
        {
          id: 'refresh',
          label: 'Refresh Data',
          icon: RefreshCw,
          action: () => window.location.reload()
        }
      ]
    },
    {
      group: 'Help',
      items: [
        {
          id: 'docs',
          label: 'Documentation',
          icon: FileText,
          action: () => window.open('/docs', '_blank')
        },
        {
          id: 'shortcuts',
          label: 'Keyboard Shortcuts',
          icon: Keyboard,
          shortcut: ['?'],
          action: () => eventBus.emit('shortcuts:show')
        }
      ]
    }
  ];

  const filteredCommands = commands.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.label.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {filteredCommands.map((group) => (
          <CommandGroup key={group.group} heading={group.group}>
            {group.items.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => {
                  item.action();
                  setOpen(false);
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
                {item.shortcut && (
                  <CommandShortcut>
                    {item.shortcut.join('')}
                  </CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

// components/features/global/KeyboardShortcuts.tsx
export function KeyboardShortcuts() {
  const router = useRouter();
  const { currentProject } = useUIStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const cmd = e.metaKey || e.ctrlKey;
      
      // Navigation shortcuts
      if (cmd && e.key === 'd') {
        e.preventDefault();
        router.push(`/projects/${currentProject?.id}/dashboard`);
      } else if (cmd && e.key === 'c') {
        e.preventDefault();
        router.push(`/projects/${currentProject?.id}/clusters`);
      } else if (cmd && e.key === 's') {
        e.preventDefault();
        router.push(`/projects/${currentProject?.id}/strategic-advice`);
      } else if (cmd && e.key === 'e') {
        e.preventDefault();
        eventBus.emit('export:open');
      } else if (e.key === '?') {
        e.preventDefault();
        eventBus.emit('shortcuts:show');
      } else if (e.key === 'Escape') {
        eventBus.emit('modal:close');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [router, currentProject]);

  return null;
}

// components/features/global/GlobalSearch.tsx
export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({
    keywords: [],
    projects: [],
    clusters: []
  });

  const { data: searchResults } = useGlobalSearch(query, {
    enabled: query.length > 2
  });

  useEffect(() => {
    if (searchResults) {
      setResults(searchResults);
    }
  }, [searchResults]);

  return (
    <>
      <Button
        variant="outline"
        className="relative w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <span className="pl-8 pr-12 text-muted-foreground">Search...</span>
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 gap-0">
          <div className="flex items-center border-b px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search keywords, projects, or clusters..."
              className="border-0 focus-visible:ring-0 px-3"
              autoFocus
            />
          </div>

          <ScrollArea className="max-h-[400px]">
            {query.length > 2 ? (
              <div className="p-2">
                {results.keywords.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground px-2 mb-2">
                      Keywords
                    </p>
                    {results.keywords.map((keyword) => (
                      <SearchResultItem
                        key={keyword.id}
                        label={keyword.keyword}
                        description={`Volume: ${keyword.volume} • Position: ${keyword.position || 'N/A'}`}
                        onClick={() => {
                          // Navigate to keyword in dashboard
                          setOpen(false);
                        }}
                      />
                    ))}
                  </div>
                )}

                {results.projects.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground px-2 mb-2">
                      Projects
                    </p>
                    {results.projects.map((project) => (
                      <SearchResultItem
                        key={project.id}
                        label={project.name}
                        description={`${project.total_keywords} keywords`}
                        onClick={() => {
                          router.push(`/projects/${project.id}/dashboard`);
                          setOpen(false);
                        }}
                      />
                    ))}
                  </div>
                )}

                {results.clusters.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground px-2 mb-2">
                      Clusters
                    </p>
                    {results.clusters.map((cluster) => (
                      <SearchResultItem
                        key={cluster.id}
                        label={cluster.name}
                        description={`${cluster.keyword_count} keywords`}
                        onClick={() => {
                          // Open cluster detail
                          setOpen(false);
                        }}
                      />
                    ))}
                  </div>
                )}

                {results.keywords.length === 0 && 
                 results.projects.length === 0 && 
                 results.clusters.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No results found
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Type at least 3 characters to search
              </p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

---

## Definition of Done
- [ ] Implementation roadmap is interactive
- [ ] Update workflow handles all scenarios
- [ ] Conflict resolution is intuitive
- [ ] Cache management displays metrics
- [ ] Global features work across app
- [ ] Keyboard shortcuts are consistent
- [ ] Search finds relevant results
- [ ] All exports work correctly

## Sprint Deliverables
1. Complete implementation roadmap
2. Enhanced CSV update workflow
3. Conflict resolution interface
4. Cache management panel
5. Command palette (Cmd+K)
6. Global search functionality
7. Keyboard shortcuts system
8. Quick actions menu

## Performance Optimizations
- Debounce global search
- Cache command palette results
- Lazy load roadmap phases
- Optimize diff calculations
- Limit search result counts

## Accessibility Features
- All shortcuts have visual indicators
- Command palette is keyboard navigable
- Focus management in modals
- Screen reader announcements
- High contrast mode support

## Next Sprint Preview
- Virtual scrolling implementation
- Performance optimizations
- Loading states and skeletons
- Error boundary setup

## Risks & Mitigations
- **Risk**: Complex update logic
  - **Mitigation**: Clear preview and confirmations
- **Risk**: Global shortcuts conflicts
  - **Mitigation**: Check for input focus
- **Risk**: Search performance
  - **Mitigation**: Debounce and limit results