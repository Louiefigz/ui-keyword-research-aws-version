# Complete UI Development Guide
## Keyword Research Automation Application

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technical Stack & Architecture](#technical-stack--architecture)
3. [API Integration Specifications](#api-integration-specifications)
4. [Component Specifications](#component-specifications)
5. [Styling System](#styling-system)
6. [Screen Specifications](#screen-specifications)
7. [State Management](#state-management)
8. [Data Structures](#data-structures)
9. [User Interactions](#user-interactions)
10. [Error Handling](#error-handling)
11. [Testing Requirements](#testing-requirements)
12. [Implementation Checklist](#implementation-checklist)

---

## Project Overview

### Application Purpose
A comprehensive SEO keyword research automation tool that processes CSV data from tools like Ahrefs/SEMrush, applies SOP-based scoring formulas, provides AI-enhanced clustering and strategic advice, and exports actionable recommendations.

### Core User Journey
1. **Upload CSV data** from SEO tools
2. **Analyze keywords** with automated scoring and categorization
3. **Explore clusters** of semantically related keywords
4. **Receive strategic advice** with ROI projections
5. **Export actionable recommendations** in various formats

### Key Differentiators
- **100% data-driven insights** (no generic SEO advice)
- **AI-enhanced clustering** and relevance scoring
- **Comprehensive SOP formulas** for keyword prioritization
- **Strategic ROI projections** with implementation roadmaps

---

## Technical Stack & Architecture

### Recommended Frontend Stack
```typescript
// Primary Technologies
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- React Query/TanStack Query (API state management)
- Zustand (Client state management)
- React Hook Form (Form handling)
- Recharts (Data visualization)

// Supporting Libraries
- Framer Motion (Animations)
- React Table (Advanced data tables)
- date-fns (Date manipulation)
- React Dropzone (File uploads)
- Lucide React (Icons)
```

### Architecture Patterns
- **Component-Based**: Modular, reusable components
- **Feature-Based Structure**: Organize by business features
- **API-First**: All data operations through API layer
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance

---

## API Integration Specifications

### Base Configuration
```typescript
const API_CONFIG = {
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': 'test-user-123' // Mock auth
  }
}
```

### Critical API Endpoints

#### Project Management
```typescript
// GET /projects - List all projects
interface Project {
  id: string;
  name: string;
  business_description: string;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
  stats: {
    total_keywords: number;
    total_clusters: number;
    last_updated: string | null;
  };
}

// POST /projects - Create new project
interface CreateProjectRequest {
  name: string;
  business_description: string;
  settings?: {
    min_volume?: number;
    max_kd?: number;
    target_locations?: string[];
    competitor_domains?: string[];
  };
}
```

#### CSV Processing
```typescript
// POST /csv/validate - Upload and validate CSV
interface CSVUploadRequest {
  file: File;
  project_id: string;
}

interface CSVValidationResponse {
  job_id: string;
  status: 'processing' | 'completed' | 'failed';
  validation: {
    is_valid: boolean;
    row_count: number;
    errors: string[];
    warnings: string[];
  };
  schema: {
    detected_tool: 'AHREFS' | 'SEMRUSH' | 'MOZ';
    csv_type: 'ORGANIC' | 'CONTENT_GAP';
    field_mappings: FieldMapping[];
  };
}

// POST /csv/update - Update existing keywords
interface CSVUpdateRequest {
  file: File;
  project_id: string;
  update_strategy: 'merge_best' | 'replace_all' | 'keep_existing';
  detect_deletions: boolean;
}
```

#### Dashboard Data
```typescript
// GET /projects/{project_id}/dashboard/keywords
interface KeywordDashboardRequest {
  limit?: number;
  offset?: number;
  sort_by?: 'total_points' | 'volume' | 'position' | 'kd' | 'cpc';
  sort_order?: 'asc' | 'desc';
  opportunity_type?: ('low_hanging' | 'existing' | 'clustering' | 'untapped')[];
  action?: ('create' | 'optimize' | 'upgrade' | 'update' | 'leave')[];
  position_min?: number;
  position_max?: number;
  volume_min?: number;
  volume_max?: number;
  search?: string;
}

interface KeywordDashboardResponse {
  keywords: Keyword[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    pages: number;
  };
  summary: {
    total_keywords: number;
    total_volume: number;
    avg_position: number;
    opportunities: Record<string, number>;
    actions: Record<string, number>;
  };
}
```

#### Strategic Advice
```typescript
// GET /strategic-advice/projects/{project_id}
interface StrategicAdviceResponse {
  project_id: string;
  executive_summary: {
    current_state: CurrentState;
    opportunity_summary: OpportunitySummary;
    strategic_priorities: string[];
    expected_results: Record<string, string>;
  };
  immediate_opportunities: ImmediateOpportunity[];
  content_strategy: ContentStrategy;
  roi_projections: ROIProjections;
  implementation_roadmap: ImplementationRoadmap;
}
```

#### Export Management
```typescript
// POST /exports - Create export
interface ExportRequest {
  project_id: string;
  format: 'csv' | 'xlsx' | 'json';
  filters?: KeywordDashboardRequest;
  options: {
    include_clusters?: boolean;
    client_format?: boolean;
    include_scores?: boolean;
  };
}

interface ExportResponse {
  job_id: string;
  status: 'processing' | 'completed' | 'failed';
  format: string;
  created_at: string;
  file_url?: string;
  file_size?: number;
}
```

### Error Handling
```typescript
interface APIError {
  error: {
    code: string;
    message: string;
    details?: Array<{
      field?: string;
      issue: string;
    }>;
    request_id?: string;
  };
}

// Standard error codes to handle:
// - VALIDATION_ERROR (400)
// - RESOURCE_NOT_FOUND (404)
// - LLM_SERVICE_UNAVAILABLE (503)
// - CSV_PROCESSING_ERROR (400)
```

---

## Component Specifications

### Core Data Structures
```typescript
interface Keyword {
  id: string;
  keyword: string;
  metrics: {
    volume: number;
    keyword_difficulty: number;
    cpc: number;
    position?: number;
    url?: string;
    traffic?: number;
    lowest_dr?: number;
  };
  scores: {
    volume_score: number;
    kd_score: number;
    cpc_score: number;
    position_score: number;
    intent_score: number;
    relevance_score: number;
    word_count_score: number;
    lowest_dr_score: number;
    total_points: number;
  };
  classification: {
    opportunity: 'success' | 'low_hanging' | 'existing' | 'clustering_opportunity' | 'untapped';
    action: 'optimize' | 'upgrade' | 'update' | 'create' | 'leave';
    intent: 'commercial' | 'informational' | 'uncategorized';
    priority: 1 | 2 | 3 | 4;
  };
  cluster?: {
    id: string;
    name: string;
    size: number;
  };
  created_at: string;
  updated_at: string;
}

interface Cluster {
  id: string;
  name: string;
  project_id: string;
  keyword_count: number;
  keywords?: Keyword[];
  metrics: {
    total_volume: number;
    avg_position: number;
    avg_kd: number;
    opportunity_score: number;
    quick_wins: number;
    content_gaps: number;
  };
  recommendations: string[];
}
```

### Component Hierarchy
```
App
├── Layout
│   ├── Navbar
│   │   ├── ProjectSelector
│   │   └── UserMenu
│   └── Sidebar
│       └── NavItem[]
├── ProjectsScreen
│   ├── ProjectCard[]
│   └── CreateProjectModal
├── UploadScreen
│   ├── UploadTabs
│   │   ├── NewUploadTab
│   │   │   ├── FileDropzone
│   │   │   ├── SupportedTools
│   │   │   ├── SchemaPreview
│   │   │   └── ProcessingStatus
│   │   └── UpdateTab
│   │       ├── UpdateDropzone
│   │       ├── UpdateStrategy
│   │       └── UpdatePreview
│   └── ConflictResolutionModal
├── DashboardScreen
│   ├── SummaryCards
│   ├── DashboardLayout
│   │   ├── FiltersSidebar
│   │   └── MainContent
│   │       ├── TableControls
│   │       │   └── ColumnSelector
│   │       ├── KeywordsTable
│   │       └── Pagination
│   └── ExportModal
├── ClustersScreen
│   ├── ClusterSummary
│   ├── ClusterGrid
│   │   └── ClusterCard[]
│   └── ClusterDetailModal
│       ├── ClusterOverview
│       ├── KeywordsTable
│       └── StrategicRecommendation
└── StrategicAdviceScreen
    ├── ExecutiveSummary
    ├── AdviceTabs
    │   ├── OpportunitiesTab
    │   │   ├── QuickWins
    │   │   └── ContentGaps
    │   ├── ContentStrategyTab
    │   │   ├── PriorityClusters
    │   │   └── ContentCalendar
    │   ├── ROITab
    │   │   ├── ProjectionsChart
    │   │   └── TimelineBreakdown
    │   └── RoadmapTab
    │       └── ImplementationPhases[]
    └── AdviceContent[]
```

---

## Styling System

### Design System Foundation
```css
/* Color System */
:root {
  /* Primary Colors */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;

  /* Semantic Colors */
  --color-success-50: #d1fae5;
  --color-success-500: #10b981;
  --color-success-600: #059669;
  
  --color-warning-50: #fef3c7;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  
  --color-error-50: #fecaca;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;

  /* Neutral Colors */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  /* Typography */
  --font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### Component Classes
```css
/* Layout Components */
.layout-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.navbar {
  background: white;
  border-bottom: 1px solid var(--color-gray-200);
  box-shadow: var(--shadow-sm);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
}

.sidebar {
  width: 256px;
  background: white;
  border-right: 1px solid var(--color-gray-200);
  height: calc(100vh - 64px);
  padding-top: 2rem;
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Card Components */
.card {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  box-shadow: var(--shadow-sm);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-gray-200);
}

.card-content {
  padding: 1.5rem;
}

/* Button Components */
.btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background-color: var(--color-primary-500);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-600);
}

.btn-secondary {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
}

.btn-secondary:hover {
  background-color: var(--color-gray-200);
}

/* Badge Components */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-xl);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.badge-green {
  background-color: var(--color-success-50);
  color: var(--color-success-600);
}

.badge-blue {
  background-color: var(--color-primary-50);
  color: var(--color-primary-600);
}

.badge-orange {
  background-color: var(--color-warning-50);
  color: var(--color-warning-600);
}

.badge-red {
  background-color: var(--color-error-50);
  color: var(--color-error-600);
}

/* Form Components */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-700);
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Table Components */
.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--color-gray-200);
}

.table th {
  background-color: var(--color-gray-50);
  font-weight: 600;
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  color: var(--color-gray-500);
}

.table tr:hover {
  background-color: var(--color-gray-50);
}

/* Modal Components */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal.hidden {
  display: none;
}

.modal-content {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
}

.modal-body {
  padding: 1.5rem;
}

/* Loading Components */
.loading-spinner {
  border: 2px solid var(--color-gray-100);
  border-top: 2px solid var(--color-primary-500);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Grid System */
.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--color-gray-200);
  }
}

@media (max-width: 768px) {
  .grid-3,
  .grid-2 {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .navbar {
    padding: 0 1rem;
  }
}
```

---

## Screen Specifications

### 1. Projects Management Screen

**Purpose**: Project overview and management
**Route**: `/projects` or `/`

**Key Components**:
```typescript
// ProjectsScreen.tsx
interface ProjectsScreenProps {}

interface ProjectCardProps {
  project: Project;
  onView: (projectId: string) => void;
  onArchive: (projectId: string) => void;
}

// Required State
const [projects, setProjects] = useState<Project[]>([]);
const [loading, setLoading] = useState(true);
const [showCreateModal, setShowCreateModal] = useState(false);

// Required Actions
- Load all projects on mount
- Create new project
- Archive existing project
- Navigate to project dashboard
```

**Layout Structure**:
```html
<div className="projects-screen">
  <div className="projects-header">
    <h1>Your Projects</h1>
    <button onClick={() => setShowCreateModal(true)}>+ New Project</button>
  </div>
  
  <div className="project-grid">
    {projects.map(project => (
      <ProjectCard key={project.id} project={project} />
    ))}
  </div>
  
  {showCreateModal && <CreateProjectModal />}
</div>
```

### 2. Upload Screen

**Purpose**: CSV upload and data management
**Route**: `/projects/{id}/upload`

**Key Features**:
- Tabbed interface (New Upload / Update Existing)
- File dropzone with drag & drop
- Schema detection and validation
- Progress tracking
- Conflict resolution

**State Management**:
```typescript
const [uploadMode, setUploadMode] = useState<'new' | 'update'>('new');
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [schemaDetection, setSchemaDetection] = useState<SchemaDetection | null>(null);
const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
const [updatePreview, setUpdatePreview] = useState<UpdatePreview | null>(null);
const [conflicts, setConflicts] = useState<Conflict[]>([]);
```

**Critical Interactions**:
- File selection triggers schema detection
- Schema validation shows field mapping
- Upload starts processing job
- Progress polling until completion
- Conflict resolution before final processing

### 3. Dashboard Screen

**Purpose**: Comprehensive keyword analysis
**Route**: `/projects/{id}/dashboard`

**Key Features**:
- Summary statistics cards
- Advanced filtering sidebar
- Customizable data table
- Column visibility controls
- Sorting and pagination
- Export functionality

**Complex State**:
```typescript
interface DashboardState {
  keywords: Keyword[];
  summary: DashboardSummary;
  pagination: PaginationInfo;
  filters: DashboardFilters;
  sortConfig: SortConfig;
  visibleColumns: string[];
  loading: boolean;
  error: APIError | null;
}

interface DashboardFilters {
  search: string;
  opportunityTypes: OpportunityType[];
  actions: ActionType[];
  positionRange: [number, number];
  volumeRange: [number, number];
  kdRange: [number, number];
  intent: IntentType[];
  relevanceRange: [number, number];
}
```

**Table Configuration**:
```typescript
const AVAILABLE_COLUMNS = [
  { key: 'keyword', label: 'Keyword', required: true },
  { key: 'volume', label: 'Volume', sortable: true },
  { key: 'kd', label: 'KD', sortable: true },
  { key: 'cpc', label: 'CPC', sortable: true },
  { key: 'position', label: 'Position', sortable: true },
  { key: 'traffic', label: 'Traffic', sortable: true },
  { key: 'intent', label: 'Intent' },
  { key: 'relevance', label: 'Relevance', sortable: true },
  { key: 'cluster', label: 'Cluster' },
  { key: 'points', label: 'Points', sortable: true },
  { key: 'opportunity', label: 'Opportunity' },
  { key: 'action', label: 'Action' }
];
```

### 4. Clusters Screen

**Purpose**: Keyword clustering analysis
**Route**: `/projects/{id}/clusters`

**Key Features**:
- Cluster overview cards
- Detailed cluster modals
- Keyword filtering within clusters
- Strategic recommendations

**Modal Specifications**:
```typescript
interface ClusterDetailModalProps {
  cluster: Cluster;
  isOpen: boolean;
  onClose: () => void;
}

// Modal should include:
- Cluster metrics overview
- Main keyword identification
- Filterable keywords table
- Strategic recommendations
- Quick wins highlighting
```

### 5. Strategic Advice Screen

**Purpose**: AI-driven strategic recommendations
**Route**: `/projects/{id}/strategic-advice`

**Tabbed Interface**:
```typescript
const ADVICE_TABS = [
  {
    id: 'opportunities',
    label: 'Immediate Opportunities',
    component: OpportunitiesTab
  },
  {
    id: 'content',
    label: 'Content Strategy',
    component: ContentStrategyTab
  },
  {
    id: 'roi',
    label: 'ROI Projections',
    component: ROITab
  },
  {
    id: 'roadmap',
    label: 'Implementation',
    component: RoadmapTab
  }
];
```

**Data Visualization Requirements**:
- Executive summary with key metrics
- Opportunity cards with traffic/revenue projections
- Content calendar with timeline
- ROI progression charts
- Implementation roadmap with phases

---

## State Management

### Global State (Zustand)
```typescript
interface AppState {
  // Current project
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  
  // User preferences
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Global UI state
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

interface UserPreferences {
  defaultPageSize: number;
  visibleColumns: string[];
  defaultSort: SortConfig;
  autoRefresh: boolean;
}
```

### API State (React Query)
```typescript
// Custom hooks for data fetching
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => api.getProjects(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useKeywordDashboard = (
  projectId: string,
  filters: DashboardFilters,
  pagination: PaginationConfig
) => {
  return useQuery({
    queryKey: ['keywords', projectId, filters, pagination],
    queryFn: () => api.getKeywordDashboard(projectId, filters, pagination),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useStrategicAdvice = (projectId: string) => {
  return useQuery({
    queryKey: ['strategic-advice', projectId],
    queryFn: () => api.getStrategicAdvice(projectId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutations for data updates
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    },
  });
};

export const useUploadCSV = () => {
  return useMutation({
    mutationFn: api.uploadCSV,
    onSuccess: (data) => {
      // Start polling for job status
      pollJobStatus(data.job_id);
    },
  });
};
```

### Component State Management
```typescript
// Complex form state (React Hook Form)
interface UploadFormData {
  file: File;
  updateStrategy: 'merge_best' | 'replace_all' | 'keep_existing';
  detectDeletions: boolean;
}

const useUploadForm = () => {
  return useForm<UploadFormData>({
    defaultValues: {
      updateStrategy: 'merge_best',
      detectDeletions: true,
    },
    resolver: zodResolver(uploadFormSchema),
  });
};

// Dashboard filters state
const useDashboardFilters = () => {
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);
  const [debouncedFilters] = useDebounce(filters, 300);
  
  const updateFilter = useCallback((
    key: keyof DashboardFilters,
    value: any
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);
  
  return {
    filters,
    debouncedFilters,
    updateFilter,
    resetFilters,
  };
};
```

---

## Data Structures

### API Response Types
```typescript
// Complete Keyword interface
interface Keyword {
  id: string;
  keyword: string;
  metrics: {
    volume: number;
    keyword_difficulty: number;
    cpc: number;
    position?: number;
    url?: string;
    traffic?: number;
    lowest_dr?: number;
  };
  scores: {
    volume_score: number; // 1-5
    kd_score: number; // 1-5
    cpc_score: number; // 1-5
    position_score: number; // 1-5
    intent_score: number; // 1-3
    relevance_score: number; // 1-5
    word_count_score: number; // 1-5  
    lowest_dr_score: number; // 1-5
    total_points: number; // Sum of all scores
  };
  classification: {
    opportunity: 'success' | 'low_hanging' | 'existing' | 'clustering_opportunity' | 'untapped';
    action: 'optimize' | 'upgrade' | 'update' | 'create' | 'leave';
    intent: 'commercial' | 'informational' | 'uncategorized';
    priority: 1 | 2 | 3 | 4;
  };
  cluster?: {
    id: string;
    name: string;
    size: number;
  };
  created_at: string;
  updated_at: string;
}

// Strategic Advice Types
interface ImmediateOpportunity {
  keyword: string;
  current_state: {
    position: number;
    monthly_traffic: number;
    monthly_value: number;
    search_volume: number;
    difficulty: number;
  };
  opportunity_analysis: {
    traffic_capture_rate: string;
    missed_traffic: string;
    revenue_opportunity: string;
    position_improvement_needed: string;
  };
  data_driven_insight: string;
  success_metrics: {
    target_position: number;
    expected_total_traffic: number;
    expected_revenue: string;
    traffic_multiplier: string;
  };
  implementation_priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface ContentCluster {
  cluster_name: string;
  keyword_count: number;
  total_volume: number;
  strategic_metrics: {
    commercial_ratio: number;
    avg_cpc_value: number;
    competition_score: number;
    existing_coverage: number;
    priority_score: number;
  };
  cluster_analysis: {
    ranking_keywords: number;
    non_ranking_keywords: number;
    quick_wins: number;
    content_gaps: number;
  };
  data_driven_strategy: string;
}

interface ROIProjection {
  '30_days': {
    traffic: number;
    revenue: number;
    cumulative_revenue: number;
  };
  '90_days': {
    traffic: number;
    revenue: number;
    cumulative_revenue: number;
  };
  '180_days': {
    traffic: number;
    revenue: number;
    cumulative_revenue: number;
  };
}
```

### Form Validation Schemas
```typescript
import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  business_description: z.string().min(10, 'Please provide at least 10 characters'),
  settings: z.object({
    min_volume: z.number().min(0).optional(),
    max_kd: z.number().max(100).optional(),
    target_locations: z.array(z.string()).optional(),
    competitor_domains: z.array(z.string()).optional(),
  }).optional(),
});

export const uploadFormSchema = z.object({
  file: z.instanceof(File, { message: 'Please select a file' }),
  updateStrategy: z.enum(['merge_best', 'replace_all', 'keep_existing']),
  detectDeletions: z.boolean(),
});

export const exportFormSchema = z.object({
  format: z.enum(['csv', 'xlsx', 'json']),
  type: z.enum(['all', 'filtered', 'client']),
  includeClusters: z.boolean(),
  includeRecommendations: z.boolean(),
  includeScores: z.boolean(),
});
```

---

## User Interactions

### Critical User Flows

#### 1. New Project Creation
```typescript
const handleCreateProject = async (data: CreateProjectData) => {
  try {
    setLoading(true);
    const project = await createProject.mutateAsync(data);
    
    // Navigate to upload screen
    router.push(`/projects/${project.id}/upload`);
    
    // Show success message
    toast.success('Project created successfully!');
  } catch (error) {
    toast.error('Failed to create project');
  } finally {
    setLoading(false);
  }
};
```

#### 2. CSV Upload Flow
```typescript
const handleFileUpload = async (file: File) => {
  try {
    // Step 1: Upload and validate
    const response = await uploadCSV.mutateAsync({
      file,
      project_id: currentProject.id,
    });
    
    // Step 2: Show schema detection
    setSchemaDetection(response.schema);
    
    // Step 3: Start processing
    if (response.validation.is_valid) {
      pollJobStatus(response.job_id);
    }
  } catch (error) {
    handleUploadError(error);
  }
};

const pollJobStatus = (jobId: string) => {
  const interval = setInterval(async () => {
    try {
      const status = await getJobStatus(jobId);
      setUploadProgress(status.progress);
      
      if (status.status === 'completed') {
        clearInterval(interval);
        router.push(`/projects/${currentProject.id}/dashboard`);
      } else if (status.status === 'failed') {
        clearInterval(interval);
        handleUploadError(status.error);
      }
    } catch (error) {
      clearInterval(interval);
      handleUploadError(error);
    }
  }, 2000);
};
```

#### 3. Dashboard Filtering
```typescript
const handleFilterChange = useCallback((
  filterKey: keyof DashboardFilters,
  value: any
) => {
  // Update filters
  updateFilter(filterKey, value);
  
  // Reset pagination
  setPagination(prev => ({ ...prev, offset: 0 }));
  
  // The useQuery will automatically refetch with new filters
}, [updateFilter]);

const handleSort = useCallback((sortBy: string) => {
  setSortConfig(prev => ({
    sortBy,
    sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'desc' 
      ? 'asc' 
      : 'desc'
  }));
}, []);
```

#### 4. Export Process
```typescript
const handleExport = async (exportConfig: ExportConfig) => {
  try {
    // Start export job
    const response = await createExport.mutateAsync({
      project_id: currentProject.id,
      ...exportConfig,
    });
    
    setExportJobId(response.job_id);
    setShowExportProgress(true);
    
    // Poll for completion
    pollExportStatus(response.job_id);
  } catch (error) {
    toast.error('Failed to start export');
  }
};

const pollExportStatus = (jobId: string) => {
  const interval = setInterval(async () => {
    try {
      const status = await getExportStatus(jobId);
      setExportProgress(status.progress);
      
      if (status.status === 'completed') {
        clearInterval(interval);
        setExportDownloadUrl(status.file_url);
        setShowExportComplete(true);
      }
    } catch (error) {
      clearInterval(interval);
      toast.error('Export failed');
    }
  }, 1000);
};
```

### Keyboard Shortcuts
```typescript
const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K - Global search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setShowGlobalSearch(true);
      }
      
      // Cmd/Ctrl + E - Export
      if ((event.metaKey || event.ctrlKey) && event.key === 'e') {
        event.preventDefault();
        setShowExportModal(true);
      }
      
      // Escape - Close modals
      if (event.key === 'Escape') {
        closeAllModals();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
```

---

## Error Handling

### Error Boundary Component
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<
  PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to error tracking service
    logError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We've been notified of this error and are working to fix it.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### API Error Handling
```typescript
// Custom hook for API error handling
const useErrorHandler = () => {
  const handleError = useCallback((error: unknown) => {
    if (isAPIError(error)) {
      switch (error.status) {
        case 400:
          toast.error(error.data.error.message);
          break;
        case 401:
          toast.error('Please log in to continue');
          // Redirect to login
          break;
        case 403:
          toast.error('You don\'t have permission to perform this action');
          break;
        case 404:
          toast.error('The requested resource was not found');
          break;
        case 503:
          toast.error('Service temporarily unavailable. Please try again later.');
          break;
        default:
          toast.error('An unexpected error occurred');
      }
    } else {
      toast.error('An unexpected error occurred');
    }
    
    // Log error for debugging
    console.error('Error occurred:', error);
  }, []);
  
  return { handleError };
};

// Axios interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { handleError } = useErrorHandler();
    handleError(error);
    return Promise.reject(error);
  }
);
```

### Form Error Handling
```typescript
const useFormErrorHandler = () => {
  const setFieldError = (fieldName: string, message: string) => {
    // Set field-specific error
  };
  
  const handleFormError = (error: APIError) => {
    if (error.data.error.details) {
      // Handle field-specific errors
      error.data.error.details.forEach(detail => {
        if (detail.field) {
          setFieldError(detail.field, detail.issue);
        }
      });
    } else {
      // Handle general form error
      toast.error(error.data.error.message);
    }
  };
  
  return { handleFormError };
};
```

---

## Testing Requirements

### Unit Testing Strategy
```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { KeywordDashboard } from './KeywordDashboard';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (component: ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('KeywordDashboard', () => {
  it('renders keyword data correctly', async () => {
    renderWithProviders(<KeywordDashboard projectId="test-project" />);
    
    await waitFor(() => {
      expect(screen.getByText('water damage restoration')).toBeInTheDocument();
    });
  });
  
  it('filters keywords when search is applied', async () => {
    renderWithProviders(<KeywordDashboard projectId="test-project" />);
    
    const searchInput = screen.getByPlaceholderText('Search keywords...');
    fireEvent.change(searchInput, { target: { value: 'emergency' } });
    
    await waitFor(() => {
      expect(screen.getByText('emergency water removal')).toBeInTheDocument();
      expect(screen.queryByText('water damage restoration')).not.toBeInTheDocument();
    });
  });
});
```

### Integration Testing
```typescript
// API integration tests
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/v1/projects/:projectId/dashboard/keywords', (req, res, ctx) => {
    return res(ctx.json(mockKeywordDashboardResponse));
  }),
  
  rest.post('/api/v1/csv/validate', (req, res, ctx) => {
    return res(ctx.json(mockCSVValidationResponse));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CSV Upload Integration', () => {
  it('completes full upload flow', async () => {
    render(<UploadScreen />);
    
    // Upload file
    const fileInput = screen.getByLabelText(/select file/i);
    const file = new File(['keyword,volume\ntest,100'], 'test.csv', {
      type: 'text/csv',
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Wait for schema detection
    await waitFor(() => {
      expect(screen.getByText('Schema Detected')).toBeInTheDocument();
    });
    
    // Verify processing starts
    await waitFor(() => {
      expect(screen.getByText('Processing Keywords...')).toBeInTheDocument();
    });
  });
});
```

### E2E Testing Requirements
```typescript
// Playwright E2E tests
import { test, expect } from '@playwright/test';

test.describe('Keyword Research Workflow', () => {
  test('complete user journey from project creation to export', async ({ page }) => {
    // Create project
    await page.goto('/projects');
    await page.click('text=New Project');
    await page.fill('[name="name"]', 'Test Project');
    await page.fill('[name="business_description"]', 'Test business description');
    await page.click('text=Create Project');
    
    // Upload CSV
    await page.setInputFiles('[type="file"]', 'test-data/keywords.csv');
    await page.waitForSelector('text=Processing Complete');
    
    // Navigate to dashboard
    await page.click('text=View Dashboard');
    await expect(page.locator('table')).toBeVisible();
    
    // Apply filters
    await page.fill('[placeholder="Search keywords..."]', 'water damage');
    await page.waitForTimeout(500); // Debounce
    
    // Export data
    await page.click('text=Export');
    await page.click('text=CSV');
    await page.click('text=Start Export');
    await page.waitForSelector('text=Export Complete');
    
    // Verify download
    const downloadPromise = page.waitForEvent('download');
    await page.click('text=Download File');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
  });
});
```

---

## Implementation Checklist

### Phase 1: Foundation Setup ✓
- [ ] Create Next.js project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up React Query and Zustand
- [ ] Implement routing structure
- [ ] Create base layout components
- [ ] Implement error boundary
- [ ] Set up API client

### Phase 2: Core Components ✓
- [ ] Build reusable UI components (Button, Card, Modal, etc.)
- [ ] Implement form components with validation
- [ ] Create table component with sorting/filtering
- [ ] Build loading and error states
- [ ] Implement responsive design
- [ ] Add accessibility features

### Phase 3: Screen Implementation ✓
- [ ] Projects management screen
- [ ] CSV upload screen with drag & drop
- [ ] Dashboard screen with advanced filtering
- [ ] Clusters screen with detailed modals
- [ ] Strategic advice screen with tabs
- [ ] Export functionality
- [ ] Conflict resolution workflow

### Phase 4: Advanced Features ✓
- [ ] Real-time job progress tracking
- [ ] Advanced data table features
- [ ] Search and filtering capabilities
- [ ] Data visualization components
- [ ] Export progress tracking
- [ ] Column customization

### Phase 5: Polish & Testing ✓
- [ ] Error handling and user feedback
- [ ] Loading states and skeleton screens
- [ ] Keyboard shortcuts
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Unit test coverage
- [ ] Integration testing
- [ ] E2E testing

### Phase 6: Production Ready ✓
- [ ] Build optimization
- [ ] SEO configuration
- [ ] Analytics integration
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] Security audit
- [ ] Deployment configuration

---

## Additional Implementation Notes

### Performance Considerations
1. **Bundle Splitting**: Implement code splitting for each major screen
2. **Image Optimization**: Use Next.js Image component for any images
3. **Virtualization**: Implement virtual scrolling for large data tables
4. **Memoization**: Use React.memo and useMemo for expensive computations
5. **Debouncing**: Implement debouncing for search and filter inputs

### Accessibility Requirements
1. **Keyboard Navigation**: All interactions must be keyboard accessible
2. **Screen Reader Support**: Proper ARIA labels and descriptions
3. **Color Contrast**: Ensure WCAG 2.1 AA compliance
4. **Focus Management**: Proper focus handling in modals and navigation
5. **Responsive Text**: Support browser text scaling up to 200%

### Browser Support
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

### Mobile Considerations
- Touch-friendly interface elements
- Responsive data tables with horizontal scrolling
- Mobile-optimized modals and navigation
- Gesture support where appropriate

This comprehensive guide provides everything needed to build the complete Keyword Research Automation application UI. The AI agent should have all necessary specifications, code examples, and implementation details to create a robust, professional application that matches the mockups and integrates seamlessly with the backend API.