# Keyword Research Automation UI

A Next.js application for automated keyword research, clustering, and strategic SEO advice.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── _global/           # Global pages (error, loading, not-found)
│   └── projects/          # Project routes
├── components/            # React components
│   ├── features/         # Feature-specific components
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components (organized by type)
├── lib/                   # Core libraries
│   ├── api/              # API client and services
│   ├── hooks/            # Custom React hooks
│   ├── store/            # State management (Zustand)
│   └── utils/            # Utility functions
├── types/                 # TypeScript definitions
├── config/               # Configuration files
├── docs/                 # Documentation
└── scripts/              # Build and utility scripts
```

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed organization guide.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **State Management**:
  - [React Query](https://tanstack.com/query) (server state)
  - [Zustand](https://zustand-demo.pmnd.rs/) (client state)
- **API Client**: [Axios](https://axios-http.com/)
- **Forms**: React Hook Form (planned)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🎯 Features

- **Project Management**: Create and manage multiple keyword research projects
- **CSV Upload**: Import keyword data with intelligent schema detection
- **Keywords Dashboard**: Analyze keywords with scores and metrics
- **Clustering**: Automatic keyword grouping with paginated keyword exploration
  - View clusters with keyword previews (10 keywords per cluster)
  - Paginated cluster detail modals (10 keywords per page)
  - Export clusters individually or in bulk
- **Strategic Advice**: AI-powered content recommendations
- **Export**: Download data in multiple formats (CSV, XLSX, JSON)

## 🏗️ Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see API documentation)

### Environment Variables

Create a `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false

# Performance
NEXT_PUBLIC_KEYWORDS_PAGE_SIZE=50
NEXT_PUBLIC_MAX_UPLOAD_SIZE=10485760
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run check-all    # Run all checks

# Testing
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## 📋 Code Standards

- **File Size**: Maximum 500 lines per file
- **Function Size**: Maximum 50 lines per function
- **Component Organization**: Feature-based structure
- **Import Order**: External → Internal → Types → Styles
- **Naming Conventions**:
  - Components: `PascalCase`
  - Utilities: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Types: `PascalCase`

See [docs/standards/](./docs/standards/) for complete coding guidelines.

## 🚦 Git Workflow

```bash
# Feature development
git checkout -b feature/your-feature
git commit -m "feat: your feature description"
git push origin feature/your-feature

# Bug fixes
git checkout -b fix/bug-description
git commit -m "fix: bug fix description"
```

### Commit Convention

- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `docs:` Documentation
- `style:` Formatting changes
- `test:` Test additions/changes
- `chore:` Maintenance tasks

## 📚 Documentation

- [API Documentation](./docs/api/API_DOCUMENTATION.md)
- [Development Guide](./docs/guides/DEVELOPMENT_GUIDE.md)
- [Sprint Planning](./docs/planning/SPRINT_PLAN.md)
- [Technical Standards](./docs/standards/TECHNICAL_STANDARDS.md)
- [UI Component Guide](./components/ui/README.md)

## 🤝 Contributing

1. Check the [Sprint Board](./docs/planning/sprints/)
2. Follow the [Technical Standards](./docs/standards/TECHNICAL_STANDARDS.md)
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Louiefigz/ui-keyword-research-aws-version)

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📝 License

Private - All rights reserved

## 🆘 Support

For issues and questions:

- Check [Troubleshooting Guide](./docs/TROUBLESHOOTING.md)
- Open an [Issue](https://github.com/Louiefigz/ui-keyword-research-aws-version/issues)
- Contact the development team

---

Built with ❤️ using Next.js and TypeScript
