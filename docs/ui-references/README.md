# UI Components Structure

This directory contains the split UI components from the original UI_COMPONENTS.md file. Each file focuses on a specific aspect of the application to maintain manageable file sizes and improve organization.

## File Structure

### 1. **01-base-styles.html** (398 lines)
- Reset and base styles
- Common UI components (buttons, badges, cards, forms, tables, modals)
- Grid system
- Responsive design utilities

### 2. **02-feature-styles.html** (343 lines)
- Feature-specific styles for all screens
- Upload screen styles
- Dashboard styles
- Clusters screen styles
- Strategic advice styles
- Projects screen styles

### 3. **03-layout-structure.html** (144 lines)
- Main HTML layout structure
- Navigation bar
- Sidebar navigation
- Content area wrapper
- Project screen template
- Cluster detail modal template

### 4. **04-upload-screen.html** (334 lines)
- Complete CSV upload screen
- New upload tab
- Update existing tab
- Schema detection preview
- Processing status
- Update strategy selection

### 5. **05-dashboard-screen.html** (259 lines)
- Keywords dashboard screen
- Summary statistics cards
- Filters sidebar
- Table controls and column selector
- Keywords table with pagination

### 6. **06-clusters-strategic.html** (265 lines)
- Clusters screen with summary cards
- Cluster grid layout
- Strategic advice screen
- Executive summary
- Tabbed content (Opportunities, Content Strategy, ROI, Roadmap)

### 7. **07-modals.html** (258 lines)
- Export modal with options
- Conflict resolution modal
- Progress indicators
- Success states

### 8. **08-javascript.js** (242 lines)
- Screen navigation functions
- Tab switching
- Modal management
- Export functionality
- Conflict resolution
- Form validation
- Utility functions

## Key Patterns Identified for DRY Architecture

### Repetitive Components to Abstract:
1. **Buttons** - Multiple variants (primary, secondary) with consistent styling
2. **Badges** - Color variants for different states
3. **Cards** - Consistent header/content structure
4. **Form controls** - Input, select, checkbox patterns
5. **Stat cards** - Icon + value + label pattern
6. **Metric rows** - Label/value pairs
7. **Tab navigation** - Reusable tab switching logic
8. **Modal structure** - Header, body, footer pattern
9. **Progress indicators** - Loading states and progress bars
10. **Table structures** - Consistent header/row patterns

### Inline Styles to Extract:
- Repeated margin/padding values
- Font sizes and weights
- Color values for states
- Border and shadow styles
- Grid layouts
- Flexbox patterns

## Next Steps for Tailwind Migration

1. Create a custom Tailwind config with:
   - Custom color palette for opportunity types
   - Consistent spacing scale
   - Typography presets
   - Component variants

2. Build reusable React components:
   - Button (with size/variant props)
   - Badge (with color variants)
   - Card (with optional header)
   - StatCard
   - DataTable
   - Modal
   - FormControl
   - ProgressBar

3. Implement feature modules:
   - Projects
   - Upload
   - Dashboard
   - Clusters
   - StrategicAdvice

4. Create shared hooks:
   - useModal
   - useFilters
   - useExport
   - usePagination
   - useJobPolling