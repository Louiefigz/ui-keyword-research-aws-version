# Project Structure Guide

## Overview
This document outlines the organization and structure of the Keyword Research Automation project.

## Directory Structure

```
.
├── app/                        # Next.js App Router
│   ├── _global/               # Global app pages (error, loading, not-found)
│   ├── projects/              # Project routes
│   │   ├── [projectId]/       # Dynamic project routes
│   │   └── new/               # Create project page
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page (redirects to /projects)
│
├── components/                 # React components
│   ├── features/              # Feature-specific components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── projects/          # Project management components
│   │   ├── upload/            # CSV upload components
│   │   ├── clusters/          # Clustering components
│   │   └── strategic/         # Strategic advice components
│   ├── layout/                # Layout components (Navbar, Sidebar, etc.)
│   └── ui/                    # Reusable UI components
│       ├── base/              # Core components (Button, Badge, etc.)
│       ├── data-display/      # Data presentation (Table, Card, etc.)
│       ├── feedback/          # User feedback (Loading, Error, etc.)
│       ├── forms/             # Form controls (Input, Select, etc.)
│       ├── navigation/        # Navigation (Menu, Command, etc.)
│       └── overlays/          # Overlays (Dialog, Tooltip, etc.)
│
├── lib/                       # Core libraries and utilities
│   ├── api/                   # API client and services
│   ├── hooks/                 # Custom React hooks
│   ├── providers/             # React context providers
│   ├── store/                 # State management (Zustand)
│   └── utils/                 # Utility functions
│       ├── cn.ts              # Class name utility
│       ├── format/            # Formatting utilities
│       ├── validation/        # Validation utilities
│       └── helpers/           # General helpers
│
├── types/                     # TypeScript type definitions
│   ├── api/                   # API-related types
│   ├── components/            # Component prop types
│   ├── store/                 # Store state types
│   └── common/                # Common/shared types
│
├── config/                    # Configuration files
│   ├── app/                   # Application config
│   ├── eslint/                # ESLint configuration
│   ├── api.constants.ts       # API constants
│   └── ui.constants.ts        # UI constants
│
├── __tests__/                 # Test files
│   ├── components/            # Component tests
│   ├── lib/                   # Library tests
│   │   ├── api/               # API client tests
│   │   └── hooks/             # Hook tests
│   ├── integration/           # Integration tests
│   ├── features/              # Feature tests
│   ├── mocks/                 # Mock data
│   └── test-utils.tsx         # Test utilities
│
├── public/                    # Static assets
├── scripts/                   # Build and utility scripts
└── docs/                      # Documentation
```

## Key Conventions

### Component Organization
- **Feature components** are grouped by feature (projects, dashboard, etc.)
- **UI components** are organized by type (base, forms, feedback, etc.)
- **Layout components** handle app structure (navigation, sidebars)

### File Naming
- Components: `PascalCase.tsx` (e.g., `ProjectCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `kebab-case.types.ts` (e.g., `api.types.ts`)
- Constants: `UPPER_SNAKE_CASE` in `kebab-case.ts` files

### Import Paths
- Use absolute imports with `@/` prefix
- Prefer barrel exports (index.ts) for cleaner imports
- Group imports: external → internal → types → styles

### State Management
- **Server state**: React Query (API data)
- **Client state**: Zustand (UI state, filters)
- **Form state**: React Hook Form (when implemented)

### Routing
- Feature-based routing under `/projects/[projectId]/`
- Global pages in `app/_global/`
- Dynamic routes use `[param]` syntax

## Parallel Development Guide

### By Feature
- **Team A**: Projects & Upload (Sprint 2)
- **Team B**: Dashboard (Sprint 3-4)
- **Team C**: Clusters & Strategic Advice (Sprint 5-7)

### By Layer
- **Frontend Team**: Components & UI
- **Integration Team**: API & State Management
- **Infrastructure Team**: Config, Utils, Testing

### File Ownership
Each team should own specific directories to avoid conflicts:
- Communicate before modifying shared files
- Use feature branches for isolation
- Regular integration to main branch