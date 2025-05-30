# Getting Started Guide

Welcome to the Keyword Research Automation UI project! This guide will help you get up and running quickly.

## 🚀 Quick Setup (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/Louiefigz/ui-keyword-research-aws-version.git
cd ui-keyword-research-aws-version
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your API URL (default: http://localhost:8000/api/v1)
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) - You should see the projects page!

## 📁 Understanding the Project Structure

### Key Folders

- `app/` - Next.js pages and routes
- `components/` - React components (UI library + features)
- `lib/` - Core functionality (API, hooks, state)
- `config/` - App configuration
- `docs/` - Documentation

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed breakdown.

## 🧩 Component Library

Our UI components are organized by type in `components/ui/`:

- **base/** - Buttons, badges, basic elements
- **data-display/** - Tables, cards, data visualization
- **feedback/** - Loading, error, success states
- **forms/** - Inputs, selects, form controls
- **navigation/** - Menus, breadcrumbs
- **overlays/** - Modals, tooltips, popovers

Import components from `@/components/ui`:

```typescript
import { Button, Card, LoadingSpinner } from '@/components/ui';
```

## 🛠️ Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Follow the coding standards in `docs/standards/`
- Keep files under 500 lines
- Use TypeScript for all new code

### 3. Test Your Changes

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Run all checks
npm run check-all
```

### 4. Commit Your Work

```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

## 🔧 Common Tasks

### Adding a New Page

1. Create file in `app/projects/[projectId]/your-page/page.tsx`
2. Page will automatically be available at `/projects/{id}/your-page`

### Adding a New Component

1. Determine component type (UI or feature-specific)
2. Create in appropriate folder
3. Export from index file
4. Use in your pages/components

### Working with API

```typescript
// Use the pre-configured hooks
import { useProjects } from '@/lib/hooks/use-projects';

function MyComponent() {
  const { data, isLoading, error } = useProjects();
  // Handle states...
}
```

### Managing State

- **Server State**: Use React Query hooks
- **UI State**: Use Zustand stores
- **Form State**: Use local state or React Hook Form

## 📚 Where to Find Help

1. **Documentation**: Check `docs/` folder
2. **API Reference**: `docs/api/API_DOCUMENTATION.md`
3. **Component Examples**: `components/ui/README.md`
4. **Sprint Plans**: `docs/planning/sprints/`

## 🚦 Code Quality Checklist

Before pushing code:

- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Files under 500 lines
- [ ] Functions under 50 lines
- [ ] Imports organized (external → internal → types)
- [ ] Components have proper types

## 🎯 Next Steps

1. Explore the existing pages in `app/projects/`
2. Check out the UI components in Storybook (when available)
3. Review current sprint in `docs/planning/sprints/`
4. Pick a task and start coding!

## 🆘 Getting Help

- **Slack**: #keyword-research-dev
- **Issues**: [GitHub Issues](https://github.com/Louiefigz/ui-keyword-research-aws-version/issues)
- **Documentation**: [docs/README.md](./docs/README.md)

Happy coding! 🎉
