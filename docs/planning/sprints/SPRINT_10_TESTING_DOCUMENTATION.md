# Sprint 10: Testing & Documentation

**Duration**: Weeks 19-20 (48 hours)
**Goal**: Implement comprehensive testing, create documentation, fix final bugs, and prepare for deployment

## Epic: Production Readiness

Ensure the application is thoroughly tested, well-documented, and ready for production deployment with high quality standards.

---

## User Stories

### 10.1 Testing Implementation (20 hours)

**As a** developer  
**I want** comprehensive test coverage  
**So that** I can ensure application reliability and prevent regressions

#### Acceptance Criteria

- [ ] Unit tests cover critical functions
- [ ] Integration tests verify API calls
- [ ] Component tests check UI behavior
- [ ] E2E tests cover user workflows
- [ ] Test coverage is above 80%
- [ ] CI/CD runs all tests
- [ ] Performance tests are included

#### Testing Strategy

1. **Unit Tests**

   - Utility functions
   - Custom hooks
   - State management
   - Data transformations

2. **Integration Tests**

   - API client functions
   - Data fetching hooks
   - Form submissions
   - File uploads

3. **Component Tests**

   - User interactions
   - Conditional rendering
   - Error states
   - Loading states

4. **E2E Tests**
   - Critical user paths
   - Multi-step workflows
   - Error scenarios

#### Implementation

```typescript
// __tests__/unit/utils/keyword-scoring.test.ts
import { calculateKeywordScores, classifyOpportunity } from '@/utils/keyword-scoring';

describe('Keyword Scoring', () => {
  describe('calculateKeywordScores', () => {
    it('should calculate volume score correctly', () => {
      const keyword = {
        metrics: { volume: 1000 }
      };

      const scores = calculateKeywordScores(keyword);
      expect(scores.volume_score).toBe(4); // Based on SOP formula
    });

    it('should handle edge cases', () => {
      const keyword = {
        metrics: { volume: 0 }
      };

      const scores = calculateKeywordScores(keyword);
      expect(scores.volume_score).toBe(1);
    });

    it('should calculate total points', () => {
      const keyword = {
        metrics: {
          volume: 1000,
          keyword_difficulty: 30,
          cpc: 5.0,
          position: 15
        }
      };

      const scores = calculateKeywordScores(keyword);
      expect(scores.total_points).toBeGreaterThan(0);
      expect(scores.total_points).toBeLessThanOrEqual(40);
    });
  });

  describe('classifyOpportunity', () => {
    it('should classify low hanging fruit correctly', () => {
      const keyword = {
        metrics: { position: 8 },
        scores: { total_points: 25 }
      };

      const classification = classifyOpportunity(keyword);
      expect(classification.opportunity).toBe('low_hanging');
      expect(classification.action).toBe('optimize');
    });
  });
});

// __tests__/integration/api/projects.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProjects, useCreateProject } from '@/lib/hooks/use-projects';
import { server } from '@/test/mocks/server';
import { rest } from 'msw';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Projects API Integration', () => {
  it('should fetch projects list', async () => {
    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0]).toHaveProperty('id');
    expect(result.current.data[0]).toHaveProperty('name');
  });

  it('should handle API errors', async () => {
    server.use(
      rest.get('/api/v1/projects', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );

    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('should create project with optimistic update', async () => {
    const { result } = renderHook(() => useCreateProject(), {
      wrapper: createWrapper()
    });

    const projectData = {
      name: 'Test Project',
      business_description: 'Test description'
    };

    result.current.mutate(projectData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toMatchObject(projectData);
  });
});

// __tests__/components/dashboard/KeywordTable.test.tsx
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KeywordTable } from '@/components/features/dashboard/KeywordTable';
import { mockKeywords } from '@/test/fixtures/keywords';

describe('KeywordTable Component', () => {
  const defaultProps = {
    data: mockKeywords,
    onSort: jest.fn(),
    onRowSelect: jest.fn(),
    selectedRows: new Set<string>()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all keywords', () => {
    render(<KeywordTable {...defaultProps} />);

    mockKeywords.forEach(keyword => {
      expect(screen.getByText(keyword.keyword)).toBeInTheDocument();
    });
  });

  it('handles sorting when clicking column headers', async () => {
    const user = userEvent.setup();
    render(<KeywordTable {...defaultProps} />);

    const volumeHeader = screen.getByRole('button', { name: /volume/i });
    await user.click(volumeHeader);

    expect(defaultProps.onSort).toHaveBeenCalledWith('volume', 'asc');
  });

  it('handles row selection', async () => {
    const user = userEvent.setup();
    render(<KeywordTable {...defaultProps} />);

    const firstCheckbox = screen.getAllByRole('checkbox')[1]; // Skip header checkbox
    await user.click(firstCheckbox);

    expect(defaultProps.onRowSelect).toHaveBeenCalledWith(mockKeywords[0].id);
  });

  it('displays opportunity badges correctly', () => {
    render(<KeywordTable {...defaultProps} />);

    const lowHangingBadge = screen.getByText('low hanging');
    expect(lowHangingBadge).toHaveClass('bg-green-100');
  });

  it('shows loading state', () => {
    render(<KeywordTable {...defaultProps} data={[]} isLoading={true} />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(<KeywordTable {...defaultProps} data={[]} />);

    expect(screen.getByText('No keywords found')).toBeInTheDocument();
  });
});

// __tests__/e2e/keyword-workflow.spec.ts
import { test, expect } from '@playwright/test';
import { mockCSVFile } from '@/test/fixtures/files';

test.describe('Keyword Research Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('complete workflow from project creation to export', async ({ page }) => {
    // Create project
    await page.click('text=New Project');
    await page.fill('[name="name"]', 'E2E Test Project');
    await page.fill('[name="business_description"]', 'Test business for E2E testing');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*\/projects\/.*\/upload/);

    // Upload CSV
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(mockCSVFile);

    await expect(page.locator('text=Schema Detected')).toBeVisible();
    await page.click('text=Proceed with Upload');

    // Wait for processing
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible();
    await page.waitForSelector('text=Processing Complete', { timeout: 30000 });

    // Navigate to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('table')).toBeVisible();

    // Apply filters
    await page.fill('[placeholder="Search keywords..."]', 'water damage');
    await page.waitForTimeout(500); // Debounce

    const table = page.locator('table');
    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(5); // Filtered results

    // Check opportunity filter
    await page.click('text=Low Hanging');
    await expect(rows).toHaveCount(2);

    // Export data
    await page.click('button:has-text("Export")');
    await expect(page.locator('text=Export Keywords')).toBeVisible();

    await page.click('label:has-text("CSV")');
    await page.click('label:has-text("Apply current filters")');

    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Start Export")');
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toContain('.csv');
  });

  test('handles errors gracefully', async ({ page }) => {
    // Simulate network error
    await page.route('**/api/v1/projects', route => route.abort());

    await page.goto('http://localhost:3000/projects');
    await expect(page.locator('text=Unable to connect')).toBeVisible();

    // Test retry
    await page.unroute('**/api/v1/projects');
    await page.click('button:has-text("Try Again")');
    await expect(page.locator('[data-testid="project-card"]')).toBeVisible();
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('http://localhost:3000/projects/test-id/dashboard');

    // Open command palette
    await page.keyboard.press('Meta+k');
    await expect(page.locator('[data-testid="command-palette"]')).toBeVisible();

    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/.*\/clusters/);
  });
});

// test/setup.ts - Test setup and utilities
import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

---

### 10.2 Documentation (12 hours)

**As a** developer/user  
**I want** comprehensive documentation  
**So that** I can understand and use the application effectively

#### Acceptance Criteria

- [ ] README is comprehensive
- [ ] API documentation is complete
- [ ] Component documentation exists
- [ ] Setup guide is clear
- [ ] Deployment guide is detailed
- [ ] Troubleshooting section exists
- [ ] Architecture is documented

#### Documentation Structure

1. **User Documentation**

   - Getting started guide
   - Feature tutorials
   - FAQ section
   - Video walkthroughs

2. **Developer Documentation**
   - Architecture overview
   - API reference
   - Component library
   - Contributing guide

#### Implementation

```markdown
<!-- README.md -->

# Keyword Research Automation UI

A comprehensive Next.js application for automated keyword research, analysis, and strategic SEO planning.

## 🚀 Features

- **Project Management**: Organize multiple SEO campaigns
- **CSV Processing**: Import keywords from Ahrefs, SEMrush, Moz
- **Smart Analysis**: AI-powered keyword scoring and clustering
- **Strategic Advice**: Data-driven recommendations and ROI projections
- **Export Capabilities**: Multiple format exports with filtering

## 📋 Prerequisites

- Node.js 18+
- npm 9+ or yarn 1.22+
- Backend API running on http://localhost:8000

## 🛠️ Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourcompany/keyword-research-ui.git
   cd keyword-research-ui
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create environment file:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. Update environment variables:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   \`\`\`

5. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React Query + Zustand
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

### Project Structure

\`\`\`
src/
├── app/ # Next.js app router pages
├── components/  
│ ├── ui/ # Shadcn/ui components
│ ├── features/ # Feature-specific components
│ └── layout/ # Layout components
├── lib/
│ ├── api/ # API client and types
│ ├── hooks/ # Custom React hooks
│ ├── store/ # Zustand stores
│ └── utils/ # Utility functions
└── types/ # TypeScript type definitions
\`\`\`

## 📖 User Guide

### Creating a Project

1. Click "New Project" on the projects page
2. Enter project name and business description
3. Configure optional settings (min volume, max KD)
4. Click "Create Project"

### Uploading Keywords

1. Navigate to project upload page
2. Drag and drop CSV file or click to browse
3. Review schema detection results
4. Choose update strategy if updating existing data
5. Click "Proceed with Upload"
6. Monitor processing progress

### Using the Dashboard

- **Search**: Type keywords to filter results
- **Filters**: Use sidebar filters for detailed analysis
- **Sort**: Click column headers to sort
- **Export**: Click export button to download data

### Understanding Metrics

#### Opportunity Types

- **Success**: Already ranking #1-2
- **Low Hanging**: Position 3-20, easy wins
- **Existing**: Position 21-50, optimization needed
- **Clustering**: Group related keywords
- **Untapped**: Not ranking, new opportunities

#### Action Recommendations

- **Leave**: Already optimized
- **Optimize**: Minor improvements needed
- **Upgrade**: Significant improvements required
- **Update**: Content refresh needed
- **Create**: New content required

## 🔧 Development

### Running Tests

\`\`\`bash

# Unit tests

npm run test

# Integration tests

npm run test:integration

# E2E tests

npm run test:e2e

# All tests with coverage

npm run test:all
\`\`\`

### Code Quality

\`\`\`bash

# Linting

npm run lint

# Type checking

npm run typecheck

# Format code

npm run format
\`\`\`

### Building for Production

\`\`\`bash

# Build application

npm run build

# Run production build

npm run start
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy with automatic CI/CD

### Docker

\`\`\`dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package\*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package\*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## 🐛 Troubleshooting

### Common Issues

**CSV Upload Fails**

- Ensure CSV is from supported tool (Ahrefs, SEMrush, Moz)
- Check file size is under 50MB
- Verify required columns are present

**Slow Performance**

- Enable virtual scrolling for large datasets
- Check browser console for errors
- Clear cache in settings

**API Connection Issues**

- Verify backend is running
- Check API URL in environment variables
- Look for CORS errors in console

## 📚 API Reference

See [API Documentation](./docs/API.md) for detailed endpoint information.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.
```

```typescript
// docs/ARCHITECTURE.md
# Architecture Overview

## System Design

### Frontend Architecture
```

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ │ │ │ │ │
│ Next.js App │────▶│ API Client │────▶│ Backend API │
│ (App Router) │ │ (Axios) │ │ (FastAPI) │
│ │ │ │ │ │
└─────────────────┘ └─────────────────┘ └─────────────────┘
│ │ │
▼ ▼ ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ │ │ │ │ │
│ React Query │ │ Zustand │ │ PostgreSQL │
│ (Server State) │ │ (Client State) │ │ Database │
│ │ │ │ │ │
└─────────────────┘ └─────────────────┘ └─────────────────┘

```

### Data Flow

1. **User Action** → Component → Custom Hook → API Client
2. **API Response** → React Query Cache → Component Update
3. **UI State Change** → Zustand Store → Component Re-render

### Key Design Decisions

#### State Management Strategy
- **React Query**: All server state (keywords, projects, etc.)
- **Zustand**: UI state (filters, preferences, etc.)
- **React Hook Form**: Form state with validation

#### Performance Optimizations
- Virtual scrolling for large datasets
- Code splitting by route
- Image lazy loading
- API response caching
- Debounced search/filters

#### Security Considerations
- API authentication headers
- Input validation with Zod
- XSS prevention via React
- CORS configuration
- Environment variable protection

## Component Architecture

### Component Hierarchy
```

App
├── Providers (QueryClient, Theme, etc.)
├── Layout
│ ├── Navbar
│ └── Sidebar
└── Routes
├── Projects
│ ├── ProjectList
│ └── ProjectCard
├── Upload
│ ├── FileDropzone
│ └── SchemaPreview
├── Dashboard
│ ├── FilterSidebar
│ ├── KeywordTable
│ └── ExportModal
├── Clusters
│ └── ClusterDetail
└── StrategicAdvice
├── ExecutiveSummary
└── AdviceTabs

```

### Styling Strategy
- Tailwind CSS for utility-first styling
- Shadcn/ui for consistent components
- CSS modules for complex components
- Theme support via CSS variables

### Testing Strategy
- Unit tests for utilities and hooks
- Integration tests for API calls
- Component tests for UI behavior
- E2E tests for critical paths
```

---

### 10.3 Final Polish (16 hours)

**As a** user  
**I want** a polished, bug-free application  
**So that** I have the best possible experience

#### Acceptance Criteria

- [ ] All known bugs are fixed
- [ ] UI consistency is verified
- [ ] Mobile experience is smooth
- [ ] Performance is optimized
- [ ] Accessibility passes audit
- [ ] Security vulnerabilities fixed
- [ ] Final QA is complete

#### Polish Tasks

1. **Bug Fixes**

   - Fix reported issues
   - Edge case handling
   - Cross-browser testing

2. **UI/UX Polish**

   - Consistent spacing
   - Animation smoothness
   - Error message clarity
   - Loading state refinement

3. **Performance Tuning**
   - Lighthouse optimization
   - Bundle size reduction
   - Cache strategy tuning

#### Implementation

```typescript
// Final performance optimizations
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  experimental: {
    optimizeCss: true,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },
};

// Accessibility audit fixes
// components/ui/button.tsx
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        // Accessibility improvements
        aria-busy={props.disabled}
        aria-disabled={props.disabled}
        {...props}
      />
    );
  }
);

// Final bug fixes checklist
const BUG_FIXES = [
  {
    id: 'BUG-001',
    description: 'Table sorting resets pagination',
    fix: 'Preserve pagination state in URL params',
    status: 'fixed'
  },
  {
    id: 'BUG-002',
    description: 'Export modal closes on outside click during export',
    fix: 'Disable backdrop click during processing',
    status: 'fixed'
  },
  {
    id: 'BUG-003',
    description: 'Virtual scroll loses position on filter',
    fix: 'Store and restore scroll position',
    status: 'fixed'
  }
];

// Mobile experience improvements
@media (max-width: 768px) {
  /* Improve touch targets */
  .btn, .checkbox, .radio {
    min-height: 44px;
    min-width: 44px;
  }

  /* Optimize table for mobile */
  .keyword-table {
    font-size: 14px;
  }

  .keyword-table th:not(.essential),
  .keyword-table td:not(.essential) {
    display: none;
  }

  /* Stack filters vertically */
  .filter-sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }

  .filter-sidebar.open {
    transform: translateY(0);
  }
}
```

---

## Definition of Done

- [ ] Test coverage > 80%
- [ ] All tests passing
- [ ] Documentation complete
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] Accessibility audit passed
- [ ] Security scan passed
- [ ] Final QA approved

## Sprint Deliverables

1. Comprehensive test suite
2. Full documentation
3. Bug fixes and polish
4. Performance optimizations
5. Deployment configuration
6. Monitoring setup
7. Launch checklist
8. Handover documentation

## Quality Metrics

- Code coverage: 85%+
- Bundle size: <200KB gzipped
- Lighthouse scores:
  - Performance: 95+
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 100

## Launch Checklist

- [ ] Environment variables configured
- [ ] API endpoints verified
- [ ] SSL certificates installed
- [ ] Monitoring configured
- [ ] Error tracking enabled
- [ ] Analytics implemented
- [ ] Backup strategy defined
- [ ] Rollback plan ready

## Post-Launch Monitoring

```typescript
// monitoring/setup.ts
export function setupMonitoring() {
  // Performance monitoring
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Send to analytics
        analytics.track('performance_metric', {
          name: entry.name,
          value: entry.startTime,
          duration: entry.duration,
        });
      }
    });

    observer.observe({ entryTypes: ['navigation', 'resource'] });
  }

  // Error tracking
  window.addEventListener('error', (event) => {
    Sentry.captureException(event.error);
  });

  // API health check
  setInterval(async () => {
    try {
      await api.healthCheck();
    } catch (error) {
      console.error('API health check failed', error);
      // Alert ops team
    }
  }, 60000); // Every minute
}
```

## Handover Documentation

1. System architecture overview
2. Deployment procedures
3. Monitoring and alerts
4. Common issues and solutions
5. Contact information
6. Future roadmap

## Future Enhancements

- WebSocket support for real-time updates
- Multi-language support
- Advanced visualization options
- Mobile app development
- API v2 preparations
