# UI Components Organization

This directory contains all reusable UI components, organized into logical categories:

## Structure

### 📁 base/
Core building blocks and primitive components
- `button.tsx` - Button component with variants
- `badge.tsx` - Badge/tag component with status colors
- `separator.tsx` - Visual separator line
- `skeleton.tsx` - Loading skeleton placeholder

### 📁 data-display/
Components for presenting data and information
- `card.tsx` - Card container component
- `table.tsx` - Basic table component
- `data-table.tsx` - Advanced data table with sorting/filtering
- `metric-card.tsx` - Card for displaying KPIs/metrics
- `tabs-custom.tsx` - Tab navigation component

### 📁 feedback/
User feedback and status components
- `loading-spinner.tsx` - Loading animation
- `error-state.tsx` - Error message display
- `empty-state.tsx` - Empty/no-data state
- `progress-bar.tsx` - Progress indicator
- `status-indicator.tsx` - Status dots/badges

### 📁 forms/
Form input and control components
- `input.tsx` - Text input field
- `label.tsx` - Form label
- `select.tsx` - Dropdown select
- `textarea.tsx` - Multi-line text input
- `search-input.tsx` - Search input with debounce

### 📁 navigation/
Navigation and menu components
- `command.tsx` - Command palette/search
- `dropdown-menu.tsx` - Dropdown menu

### 📁 overlays/
Overlay and modal components
- `dialog.tsx` - Modal dialog
- `popover.tsx` - Popover/floating panel
- `tooltip.tsx` - Tooltip on hover

## Usage

All components can be imported from the main UI index:

```typescript
import { 
  Button, 
  Card, 
  LoadingSpinner,
  Input,
  Dialog 
} from '@/components/ui';
```

Or from specific categories:

```typescript
import { Button, Badge } from '@/components/ui/base';
import { DataTable, MetricCard } from '@/components/ui/data-display';
```

## Adding New Components

1. Place the component in the appropriate category folder
2. Export it from the category's index.ts file
3. The main index.ts will automatically re-export it

## Shadcn/ui Components

Many of these components are built on top of [shadcn/ui](https://ui.shadcn.com/). Custom components follow the same patterns and styling conventions for consistency.