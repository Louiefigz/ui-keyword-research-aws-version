# Keyword Research UI

A comprehensive Next.js application for automated keyword research, analysis, and strategic SEO planning.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd keyword-research-ui
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Requirements

- **Node.js 18+** (LTS version)
- **npm 9+** or yarn 1.22+
- **8GB RAM** (for handling large datasets)
- **Backend API** running on http://localhost:8000

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui
- **State**: React Query + Zustand
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## 📁 Project Structure

```
.
├── src/                    # Source code (to be created)
├── docs/                   # All documentation
│   ├── api/               # API documentation
│   ├── guides/            # Development guides
│   ├── planning/          # Sprint plans
│   ├── standards/         # Coding standards
│   └── ui-references/     # UI prototypes
├── config/                # Configuration files
├── scripts/               # Utility scripts
├── .husky/                # Git hooks
└── README.md              # This file
```

## 🧑‍💻 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run typecheck    # Run TypeScript compiler
npm run format       # Format with Prettier

# Testing
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Quality Checks
npm run quality:check # Run all quality checks
./scripts/code-quality.sh # Comprehensive code analysis
```

### Documentation

All documentation is organized in the `docs/` directory:

- **[Documentation Index](./docs/README.md)** - Complete documentation overview
- **[API Reference](./docs/api/API_DOCUMENTATION.md)** - Backend API endpoints
- **[Development Standards](./docs/standards/)** - Coding standards and best practices
- **[Sprint Planning](./docs/planning/)** - Development roadmap
- **[UI References](./docs/ui-references/)** - Original design prototypes

### Key Development Files

- **Environment**: `.env.example` - Environment variables template
- **ESLint**: `config/eslint/.eslintrc.js` - Linting rules
- **Git Hooks**: `.husky/pre-commit` - Pre-commit checks
- **Code Quality**: `scripts/code-quality.sh` - Quality analysis

## 🚀 Getting Started with Development

1. **Read the standards**: Start with [Technical Standards](./docs/standards/TECHNICAL_STANDARDS.md)
2. **Check current sprint**: See [Sprint Plans](./docs/planning/sprints/)
3. **Review UI designs**: Check [UI References](./docs/ui-references/)
4. **Understand the API**: Read [API Documentation](./docs/api/API_DOCUMENTATION.md)

## 📏 Code Quality Standards

This project enforces strict quality standards:
- **File size limit**: 500 lines maximum
- **Test coverage**: 80% minimum
- **No dead code**: Regular cleanup required
- **DRY principle**: Reuse over duplication

Run quality checks before committing:
```bash
./scripts/code-quality.sh
```

## 🚀 Deployment

Recommended deployment on **Vercel**:

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

## 🐛 Troubleshooting

### Common Issues

**Backend connection failed**
- Ensure backend is running on port 8000
- Check CORS settings
- Verify API_URL in .env.local

**Large file upload fails**
- Check MAX_FILE_SIZE in .env.local
- Ensure backend accepts large files
- Verify network timeout settings

**Performance issues with large datasets**
- Enable virtual scrolling
- Use pagination
- Clear browser cache

## 📄 License

[Your License Here]

---

For detailed documentation, see the [docs directory](./docs/README.md).# ui-keyword-research-aws-version
