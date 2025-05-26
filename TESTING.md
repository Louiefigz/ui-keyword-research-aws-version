# Testing Guide

This project uses Jest and React Testing Library for comprehensive testing coverage.

## 🚀 Quick Start

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- path/to/test.ts

# Run tests matching pattern
npm test -- --testPathPattern="projects"
```

## 📁 Test Structure

```
__tests__/
├── components/          # Component tests
│   └── features/       # Feature-specific component tests
├── lib/                # Library tests
│   ├── api/           # API client tests
│   └── hooks/         # React hooks tests
├── integration/        # Integration tests
├── features/          # Feature summary tests
├── mocks/             # Mock data and utilities
└── test-utils.tsx     # Test utilities and custom render
```

## 🧪 Test Types

### Unit Tests
- API functions (`__tests__/lib/api/`)
- React hooks (`__tests__/lib/hooks/`)
- Utility functions
- Individual components

### Integration Tests
- Complete user flows
- API integration scenarios
- Multi-component interactions

### Feature Tests
- Sprint-specific functionality
- End-to-end feature validation

## 📝 Writing Tests

### Basic Component Test

```typescript
import { render, screen } from '@/__tests__/test-utils';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent title="Test" />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### API Test Example

```typescript
import { apiFunction } from '@/lib/api/module';
import { apiClient } from '@/lib/api/client';

jest.mock('@/lib/api/client');

describe('apiFunction', () => {
  it('should fetch data', async () => {
    const mockData = { id: 1, name: 'Test' };
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockData });
    
    const result = await apiFunction();
    
    expect(result).toEqual(mockData);
    expect(apiClient.get).toHaveBeenCalledWith('/endpoint');
  });
});
```

### Hook Test Example

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useCustomHook } from '@/lib/hooks/useCustomHook';

describe('useCustomHook', () => {
  it('should return data', async () => {
    const { result } = renderHook(() => useCustomHook());
    
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

## 🎭 Mocking

### Mock Data
Mock data is centralized in `__tests__/mocks/data.ts`:

```typescript
export const mockProject = {
  id: 'test-1',
  name: 'Test Project',
  // ... other fields
};
```

### Mock Modules
Use Jest's mocking capabilities:

```typescript
// Mock entire module
jest.mock('@/lib/api/projects');

// Mock specific function
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));
```

## 🛠️ Test Utilities

### Custom Render
The project includes a custom render function that wraps components with necessary providers:

```typescript
import { render } from '@/__tests__/test-utils';

// Automatically includes QueryClientProvider
render(<Component />);
```

### Common Matchers

```typescript
// DOM queries
expect(screen.getByText('Text')).toBeInTheDocument();
expect(screen.getByRole('button')).toBeEnabled();
expect(screen.queryByText('Text')).not.toBeInTheDocument();

// Async operations
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// User interactions
await userEvent.click(button);
await userEvent.type(input, 'text');
```

## 📊 Coverage Requirements

- Minimum 80% overall coverage
- Critical paths must have 100% coverage
- New features must include tests

Check coverage report:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## 🐛 Debugging Tests

### Debug Single Test
```typescript
it('should work', () => {
  const { debug } = render(<Component />);
  debug(); // Prints DOM to console
});
```

### Run Specific Test
```bash
npm test -- --testNamePattern="should create project"
```

### Verbose Output
```bash
npm test -- --verbose
```

## ✅ Sprint 2 Test Coverage

### Projects Management
- ✅ List projects with pagination
- ✅ Create new project
- ✅ Update project details
- ✅ Archive/delete projects
- ✅ Project settings management

### CSV Upload
- ✅ File drag & drop
- ✅ Schema detection (Ahrefs, SEMrush, Moz)
- ✅ Upload strategies (append, update, replace)
- ✅ Progress tracking
- ✅ Error handling

### Integration Tests
- ✅ Complete project creation flow
- ✅ Full upload workflow
- ✅ Error scenarios
- ✅ Data validation

## 🚨 Common Issues

### Module Resolution
If you get module resolution errors:
```bash
npm run type-check
```

### React Testing Library Warnings
Wrap async operations in `waitFor`:
```typescript
await waitFor(() => {
  expect(element).toBeInTheDocument();
});
```

### Mock Reset
Always clear mocks between tests:
```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```