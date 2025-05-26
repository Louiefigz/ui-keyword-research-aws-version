# Sprint 1: Foundation & Core Infrastructure
**Duration**: Weeks 1-2 (40 hours)
**Goal**: Set up Next.js project with core architecture and base components

## Epic: Project Foundation
Establish the technical foundation for the keyword research automation platform with proper architecture, state management, and core UI components.

---

## UI Component References
**Important**: Use these HTML prototypes as design and implementation references when building React components.

### Screen Mapping to UI Components
- **Projects List Screen** → Reference: `ui-components/00-projects-list-screen.html`
- **Upload Screen** → Reference: `ui-components/01-upload-screen.html` 
- **Dashboard Screen** → Reference: `ui-components/02-dashboard-screen.html`
- **Clusters Screen** → Reference: `ui-components/03-clusters-screen.html`
- **Strategic Advice Screen** → Reference: `ui-components/04-strategic-advice-screen.html`

### Supporting Files
- **Base Styles** → Reference: `ui-components/01-base-styles.html` (CSS reset, typography, utilities)
- **Feature Styles** → Reference: `ui-components/02-feature-styles.html` (Component-specific styles)
- **Layout Structure** → Reference: `ui-components/03-layout-structure.html` (Navigation, sidebar patterns)
- **Modals** → Reference: `ui-components/07-modals.html` (Modal patterns and interactions)
- **JavaScript** → Reference: `ui-components/08-javascript.js` (Interaction patterns)

### Key Patterns to Extract
1. **Color Scheme**: Consistent use of blue (#3b82f6), green (#10b981), orange (#ea580c), purple (#7c3aed)
2. **Typography**: Font weights, sizes, and hierarchy patterns
3. **Component Structure**: Card layouts, button styles, form patterns
4. **Grid Systems**: 2-column, 3-column, and 4-column grid patterns
5. **Interactive States**: Hover effects, active states, loading indicators

---

## User Stories

### 1.1 Project Setup (8 hours)
**As a** developer  
**I want** a properly configured Next.js project  
**So that** I can build the application with modern tooling and best practices

#### Acceptance Criteria
- [ ] Next.js 14 with App Router is initialized
- [ ] TypeScript is configured with strict mode
- [ ] Tailwind CSS is installed and configured
- [ ] Shadcn/ui is set up with component registry
- [ ] ESLint and Prettier are configured
- [ ] Folder structure follows feature-based architecture
- [ ] Git repository is initialized with .gitignore

#### Technical Tasks
```bash
# Commands to run
npx create-next-app@latest keyword-research-ui --typescript --tailwind --app --src-dir --import-alias "@/*"
npx shadcn-ui@latest init
npm install -D @types/node eslint-config-prettier prettier
```

#### Folder Structure
```
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   │   ├── projects/
│   │   ├── [projectId]/
│   │   │   ├── upload/
│   │   │   ├── dashboard/
│   │   │   ├── clusters/
│   │   │   └── strategic-advice/
│   ├── api/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/           # Shadcn/ui components
│   ├── layout/      # Layout components
│   └── features/    # Feature-specific components
├── lib/
│   ├── api/         # API client
│   ├── hooks/       # Custom hooks
│   ├── store/       # Zustand stores
│   └── utils/       # Utilities
└── types/           # TypeScript types
```

---

### 1.2 API Client Setup (6 hours)
**As a** developer  
**I want** a configured API client with proper typing  
**So that** I can make type-safe API calls throughout the application

#### Acceptance Criteria
- [ ] Axios is configured with base URL and headers
- [ ] Mock authentication header is added (`X-User-ID: test-user-123`)
- [ ] Request/response interceptors handle errors
- [ ] All API types are defined from documentation
- [ ] Custom hooks wrap API calls
- [ ] Error handling follows consistent pattern

#### Implementation
```typescript
// lib/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': 'test-user-123'
  }
});

// lib/api/types.ts
export interface Project {
  id: string;
  name: string;
  business_description: string;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
  settings?: ProjectSettings;
  stats: ProjectStats;
}

export interface Keyword {
  id: string;
  keyword: string;
  metrics: KeywordMetrics;
  scores: KeywordScores;
  classification: KeywordClassification;
  cluster?: ClusterReference;
  created_at: string;
  updated_at: string;
}
```

---

### 1.3 State Management Setup (8 hours)
**As a** developer  
**I want** properly configured state management  
**So that** I can manage both server and client state efficiently

#### Acceptance Criteria
- [ ] React Query is configured with proper defaults
- [ ] Zustand store manages global UI state
- [ ] Custom hooks provide clean API access
- [ ] Optimistic updates are supported
- [ ] Cache invalidation is properly handled
- [ ] TypeScript types are fully integrated

#### Implementation
```typescript
// lib/store/ui-store.ts
import { create } from 'zustand';

interface UIState {
  sidebarCollapsed: boolean;
  currentProject: Project | null;
  toggleSidebar: () => void;
  setCurrentProject: (project: Project | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  currentProject: null,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setCurrentProject: (project) => set({ currentProject: project })
}));

// lib/hooks/use-projects.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/lib/api/projects';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.list,
    staleTime: 5 * 60 * 1000
  });
};
```

---

### 1.4 Layout Components (12 hours)
**As a** user  
**I want** a consistent navigation experience  
**So that** I can easily access all features of the application

#### Acceptance Criteria
- [ ] Navbar displays project selector and user menu
- [ ] Sidebar shows navigation items based on current context
- [ ] Layout is responsive and works on mobile
- [ ] Loading states are smooth and informative
- [ ] Error states provide clear feedback
- [ ] All components follow design system

#### Components to Build
1. **Layout Shell**
   - `MainLayout.tsx` - Overall application layout
   - `DashboardLayout.tsx` - Project-specific layout

2. **Navigation Components**
   - `Navbar.tsx` - Top navigation bar
   - `Sidebar.tsx` - Side navigation
   - `ProjectSelector.tsx` - Dropdown for project selection
   - `NavItem.tsx` - Individual navigation items

3. **Core UI Components**
   - `Card.tsx` - Reusable card component
   - `Button.tsx` - Extended from Shadcn/ui
   - `Badge.tsx` - Status and category badges
   - `LoadingSpinner.tsx` - Loading indicator
   - `ErrorState.tsx` - Error display component

#### Component Example
```typescript
// components/layout/Sidebar.tsx
import { usePathname } from 'next/navigation';
import { NavItem } from './NavItem';
import { 
  Upload, 
  LayoutDashboard, 
  Network, 
  Lightbulb, 
  Settings 
} from 'lucide-react';

export function Sidebar({ projectId }: { projectId?: string }) {
  const pathname = usePathname();
  
  const navItems = [
    { href: `/projects/${projectId}/upload`, icon: Upload, label: 'Upload CSV' },
    { href: `/projects/${projectId}/dashboard`, icon: LayoutDashboard, label: 'Dashboard' },
    { href: `/projects/${projectId}/clusters`, icon: Network, label: 'Clusters' },
    { href: `/projects/${projectId}/strategic-advice`, icon: Lightbulb, label: 'Strategic Advice' },
  ];

  return (
    <aside className="w-64 border-r bg-white">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavItem 
            key={item.href}
            {...item}
            isActive={pathname === item.href}
          />
        ))}
      </nav>
    </aside>
  );
}
```

---

### 1.5 Routing & Navigation (6 hours)
**As a** user  
**I want** smooth navigation between application sections  
**So that** I can efficiently work with my keyword data

#### Acceptance Criteria
- [ ] All main routes are configured
- [ ] Project context is maintained in URLs
- [ ] Breadcrumbs show current location
- [ ] Navigation guards redirect when needed
- [ ] Loading states work during navigation
- [ ] Back button works correctly

#### Route Structure
```
/                              → Redirect to /projects
/projects                      → Projects list
/projects/new                  → Create project
/projects/[projectId]/upload   → CSV upload
/projects/[projectId]/dashboard → Keywords dashboard
/projects/[projectId]/clusters  → Clusters view
/projects/[projectId]/strategic-advice → Strategic advice
/projects/[projectId]/settings → Project settings
```

---

## Definition of Done
- [ ] All components are typed with TypeScript
- [ ] Components are responsive
- [ ] Tailwind classes follow consistent patterns
- [ ] No ESLint errors or warnings
- [ ] Code is formatted with Prettier
- [ ] Basic unit tests are written
- [ ] Components are documented
- [ ] Git commits follow conventional commits

## Sprint Deliverables
1. Running Next.js application
2. Configured development environment
3. Base layout with navigation
4. Core UI components library
5. API client with type definitions
6. State management setup

## Technical Debt & Notes
- Consider adding Storybook in future sprint
- Plan for i18n support if needed
- Monitor bundle size from the start
- Set up error tracking (Sentry) in production

## Dependencies
- Next.js 14+
- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- Shadcn/ui
- React Query v5
- Zustand 4+
- Axios
- Lucide React (icons)

## Risks & Mitigations
- **Risk**: Shadcn/ui components might need heavy customization
  - **Mitigation**: Extend components rather than modify directly
- **Risk**: State management might become complex
  - **Mitigation**: Keep Zustand stores focused and small
- **Risk**: API types might change
  - **Mitigation**: Generate types from OpenAPI spec if available