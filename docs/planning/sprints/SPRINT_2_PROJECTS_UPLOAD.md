# Sprint 2: Projects & CSV Upload
**Duration**: Weeks 3-4 (48 hours)
**Goal**: Complete project management functionality and CSV upload with job monitoring

## Epic: Core Data Management
Enable users to create projects, upload keyword data from CSV files, and monitor processing jobs with real-time progress updates.

---

## User Stories

### 2.1 Project Management Screen (16 hours)
**As a** user  
**I want** to manage my keyword research projects  
**So that** I can organize different client campaigns and track their progress

#### Acceptance Criteria
- [ ] Projects page displays all projects in a grid layout
- [ ] Each project card shows key statistics
- [ ] Create project modal validates input
- [ ] Projects can be updated and archived
- [ ] Empty state guides new users
- [ ] Loading and error states are handled

#### API Endpoints
```typescript
GET    /projects
POST   /projects
GET    /projects/{id}
PATCH  /projects/{id}
POST   /projects/{id}/archive
```

#### Components to Build
1. **Pages**
   - `app/(dashboard)/projects/page.tsx` - Projects listing
   - `app/(dashboard)/projects/new/page.tsx` - Create project

2. **Components**
   - `ProjectCard.tsx` - Individual project display
   - `CreateProjectModal.tsx` - Project creation form
   - `ProjectStats.tsx` - Statistics display
   - `EmptyProjectsState.tsx` - Empty state

#### Implementation Details
```typescript
// components/features/projects/ProjectCard.tsx
interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onArchive: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onArchive }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{project.name}</h3>
            <p className="text-sm text-muted-foreground">
              Created {formatDate(project.created_at)}
            </p>
          </div>
          <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4 line-clamp-2">
          {project.business_description}
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <StatItem 
            label="Keywords" 
            value={project.stats.total_keywords.toLocaleString()} 
          />
          <StatItem 
            label="Clusters" 
            value={project.stats.total_clusters.toLocaleString()} 
          />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild className="flex-1">
          <Link href={`/projects/${project.id}/dashboard`}>
            View Dashboard
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onEdit(project)}>
              Edit Project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onArchive(project)}>
              Archive Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
```

---

### 2.2 CSV Upload Interface (20 hours)
**As a** user  
**I want** to upload keyword data from Ahrefs/SEMrush  
**So that** I can analyze my keyword research data

#### Acceptance Criteria
- [ ] Drag-and-drop file upload works smoothly
- [ ] File validation provides clear feedback
- [ ] Schema detection shows field mappings
- [ ] Update strategy is clearly explained
- [ ] Progress tracking shows real-time updates
- [ ] Conflicts are presented clearly for resolution

#### API Endpoints
```typescript
POST /csv/validate
POST /csv/detect-schema
GET  /csv/supported-tools
POST /csv/update
POST /conflicts/resolve
```

#### Components to Build
1. **Upload Components**
   - `UploadTabs.tsx` - Tab container for new/update
   - `FileDropzone.tsx` - Drag-and-drop area
   - `SchemaPreview.tsx` - Field mapping display
   - `UpdateStrategySelector.tsx` - Strategy options
   - `ConflictResolutionModal.tsx` - Conflict handler

2. **Supporting Components**
   - `SupportedToolsDisplay.tsx` - Show compatible tools
   - `UploadProgress.tsx` - Progress indicator
   - `ValidationErrors.tsx` - Error display
   - `UpdatePreview.tsx` - Update summary

#### Drag-and-Drop Implementation
```typescript
// components/features/upload/FileDropzone.tsx
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  isProcessing?: boolean;
}

export function FileDropzone({ 
  onFileSelect, 
  accept = '.csv', 
  maxSize = 50 * 1024 * 1024,
  isProcessing = false 
}: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    maxSize,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    disabled: isProcessing
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive && "border-primary bg-primary/5",
        isProcessing && "opacity-50 cursor-not-allowed",
        fileRejections.length > 0 && "border-destructive"
      )}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      {isDragActive ? (
        <p className="text-lg">Drop the CSV file here...</p>
      ) : (
        <div>
          <p className="text-lg mb-2">
            Drag & drop your CSV file here, or click to select
          </p>
          <p className="text-sm text-muted-foreground">
            Supports files up to 50MB from Ahrefs, SEMrush, or Moz
          </p>
        </div>
      )}
      {fileRejections.length > 0 && (
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {fileRejections[0].errors[0].message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
```

#### Schema Detection Flow
```typescript
// components/features/upload/SchemaPreview.tsx
interface SchemaPreviewProps {
  schema: SchemaDetection;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SchemaPreview({ schema, onConfirm, onCancel }: SchemaPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schema Detection Results</CardTitle>
        <CardDescription>
          Detected {schema.detected_tool} format with {schema.confidence_score * 100}% confidence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{schema.detected_tool}</Badge>
            <Badge variant="outline">{schema.csv_type}</Badge>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Field Mappings</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CSV Column</TableHead>
                  <TableHead>Maps To</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schema.field_mappings.map((mapping) => (
                  <TableRow key={mapping.source_column}>
                    <TableCell>{mapping.source_column}</TableCell>
                    <TableCell>{mapping.target_field}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{mapping.data_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {mapping.is_required && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {schema.unmapped_columns.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Unmapped columns: {schema.unmapped_columns.join(', ')}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button onClick={onConfirm}>Proceed with Upload</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </CardFooter>
    </Card>
  );
}
```

---

### 2.3 Job Monitoring System (12 hours)
**As a** user  
**I want** to see the progress of my CSV processing  
**So that** I know when my data is ready and if any issues occur

#### Acceptance Criteria
- [ ] Job status updates every 2-3 seconds
- [ ] Progress bar shows percentage complete
- [ ] Current step is displayed clearly
- [ ] Completed jobs show summary
- [ ] Failed jobs show error details
- [ ] User can view job history

#### API Endpoints
```typescript
GET /jobs/{project_id}
GET /jobs/{project_id}/{job_id}
```

#### Components to Build
1. **Job Components**
   - `JobProgress.tsx` - Real-time progress display
   - `JobHistory.tsx` - List of past jobs
   - `JobStatusBadge.tsx` - Status indicator
   - `JobDetails.tsx` - Detailed job information

#### Job Polling Implementation
```typescript
// lib/hooks/use-job-status.ts
export function useJobStatus(projectId: string, jobId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: job, error } = useQuery({
    queryKey: ['jobs', projectId, jobId],
    queryFn: () => jobsApi.getStatus(projectId, jobId),
    refetchInterval: (data) => {
      if (!data) return false;
      if (data.status === 'completed' || data.status === 'failed') {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
    enabled: !!projectId && !!jobId
  });

  useEffect(() => {
    if (job?.status === 'completed') {
      queryClient.invalidateQueries(['projects', projectId]);
      toast.success('CSV processing completed successfully!');
      router.push(`/projects/${projectId}/dashboard`);
    } else if (job?.status === 'failed') {
      toast.error('CSV processing failed. Please check the error details.');
    }
  }, [job?.status]);

  return { job, error };
}

// components/features/jobs/JobProgress.tsx
export function JobProgress({ job }: { job: Job }) {
  const percentage = job.progress.percentage || 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Keywords</CardTitle>
        <CardDescription>{job.progress.message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>{job.progress.current_step}</span>
            <span>{percentage}%</span>
          </div>
          <Progress value={percentage} />
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Processed</p>
            <p className="font-medium">{job.progress.current.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total</p>
            <p className="font-medium">{job.progress.total.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <JobStatusBadge status={job.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## Definition of Done
- [ ] All API endpoints are integrated
- [ ] File upload handles errors gracefully
- [ ] Job polling works reliably
- [ ] Forms have proper validation
- [ ] Loading states are smooth
- [ ] Error messages are helpful
- [ ] Mobile responsive design
- [ ] Unit tests cover critical paths

## Sprint Deliverables
1. Fully functional projects management
2. CSV upload with drag-and-drop
3. Schema detection and validation
4. Real-time job monitoring
5. Update workflow with conflicts
6. Complete error handling

## Technical Considerations
- Use React Hook Form for complex forms
- Implement optimistic updates for better UX
- Cache job status to reduce API calls
- Handle large file uploads properly
- Consider chunked uploads for future

## Risks & Mitigations
- **Risk**: Large CSV files might timeout
  - **Mitigation**: Show upload progress, implement chunking if needed
- **Risk**: Schema detection might fail
  - **Mitigation**: Allow manual mapping as fallback
- **Risk**: Job polling might overwhelm API
  - **Mitigation**: Implement exponential backoff