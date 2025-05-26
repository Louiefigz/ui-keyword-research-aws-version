#!/bin/bash

# Code Quality Enforcement Script
# Run this before committing or as part of CI/CD

set -e

echo "🔍 Running Code Quality Checks..."
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: File Size Limits
echo -e "\n${YELLOW}1. Checking file sizes...${NC}"
LARGE_FILES=$(find src -name "*.tsx" -o -name "*.ts" | while read file; do
  lines=$(wc -l < "$file")
  if [ $lines -gt 500 ]; then
    echo "$file: $lines lines"
  fi
done)

if [ -n "$LARGE_FILES" ]; then
  echo -e "${RED}❌ Files exceeding 500 lines:${NC}"
  echo "$LARGE_FILES"
  exit 1
else
  echo -e "${GREEN}✅ All files within size limits${NC}"
fi

# Check 2: Detect Duplicate Code
echo -e "\n${YELLOW}2. Checking for duplicate code...${NC}"
if command -v jscpd &> /dev/null; then
  jscpd src --min-lines 5 --min-tokens 50 --reporters "console" --format "typescript,tsx" --exitCode 1
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ No significant code duplication found${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  jscpd not installed. Run: npm install -g jscpd${NC}"
fi

# Check 3: Dead Code Detection
echo -e "\n${YELLOW}3. Checking for dead code...${NC}"
if command -v ts-prune &> /dev/null; then
  DEAD_CODE=$(ts-prune 2>/dev/null | grep -v "used in module" | grep -v "node_modules")
  if [ -n "$DEAD_CODE" ]; then
    echo -e "${YELLOW}⚠️  Potential dead code found:${NC}"
    echo "$DEAD_CODE"
  else
    echo -e "${GREEN}✅ No dead code detected${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  ts-prune not installed. Run: npm install -g ts-prune${NC}"
fi

# Check 4: Import Organization
echo -e "\n${YELLOW}4. Checking import statements...${NC}"
RELATIVE_IMPORTS=$(grep -r "from '\.\." src --include="*.ts" --include="*.tsx" | grep -v "test" || true)
if [ -n "$RELATIVE_IMPORTS" ]; then
  echo -e "${YELLOW}⚠️  Found relative imports (use @ alias instead):${NC}"
  echo "$RELATIVE_IMPORTS" | head -5
  echo "... and more"
fi

# Check 5: Console Logs
echo -e "\n${YELLOW}5. Checking for console logs...${NC}"
CONSOLE_LOGS=$(grep -r "console\.\(log\|debug\)" src --include="*.ts" --include="*.tsx" | grep -v "test" || true)
if [ -n "$CONSOLE_LOGS" ]; then
  echo -e "${YELLOW}⚠️  Found console.log statements:${NC}"
  echo "$CONSOLE_LOGS" | head -5
  if [ $(echo "$CONSOLE_LOGS" | wc -l) -gt 5 ]; then
    echo "... and $(($(echo "$CONSOLE_LOGS" | wc -l) - 5)) more"
  fi
fi

# Check 6: TODO Comments
echo -e "\n${YELLOW}6. Checking for TODO comments...${NC}"
TODOS=$(grep -r "TODO\|FIXME\|HACK" src --include="*.ts" --include="*.tsx" || true)
if [ -n "$TODOS" ]; then
  echo -e "${YELLOW}📝 Found TODO/FIXME comments:${NC}"
  echo "$TODOS"
fi

# Check 7: Test Coverage
echo -e "\n${YELLOW}7. Checking test files...${NC}"
SRC_FILES=$(find src -name "*.tsx" -o -name "*.ts" | grep -v "test" | wc -l)
TEST_FILES=$(find src -name "*.test.tsx" -o -name "*.test.ts" -o -name "*.spec.tsx" -o -name "*.spec.ts" | wc -l)
echo "Source files: $SRC_FILES"
echo "Test files: $TEST_FILES"

if [ $TEST_FILES -lt $((SRC_FILES / 3)) ]; then
  echo -e "${YELLOW}⚠️  Low test coverage: Only $TEST_FILES test files for $SRC_FILES source files${NC}"
else
  echo -e "${GREEN}✅ Good test coverage${NC}"
fi

# Check 8: Type Safety
echo -e "\n${YELLOW}8. Checking TypeScript types...${NC}"
ANY_TYPES=$(grep -r ": any" src --include="*.ts" --include="*.tsx" | grep -v "test" | grep -v "eslint-disable" || true)
if [ -n "$ANY_TYPES" ]; then
  echo -e "${YELLOW}⚠️  Found 'any' types:${NC}"
  echo "$ANY_TYPES" | head -5
  if [ $(echo "$ANY_TYPES" | wc -l) -gt 5 ]; then
    echo "... and $(($(echo "$ANY_TYPES" | wc -l) - 5)) more"
  fi
fi

# Check 9: Component Complexity
echo -e "\n${YELLOW}9. Checking component complexity...${NC}"
COMPLEX_COMPONENTS=$(find src/components -name "*.tsx" | while read file; do
  hooks=$(grep -c "use[A-Z]" "$file" || true)
  if [ $hooks -gt 10 ]; then
    echo "$file: $hooks hooks (consider splitting)"
  fi
done)

if [ -n "$COMPLEX_COMPONENTS" ]; then
  echo -e "${YELLOW}⚠️  Complex components found:${NC}"
  echo "$COMPLEX_COMPONENTS"
else
  echo -e "${GREEN}✅ Component complexity within limits${NC}"
fi

# Check 10: Inline Styles
echo -e "\n${YELLOW}10. Checking for inline styles...${NC}"
INLINE_STYLES=$(grep -r "style=" src --include="*.tsx" | grep -v "test" || true)
if [ -n "$INLINE_STYLES" ]; then
  echo -e "${YELLOW}⚠️  Found inline styles (use Tailwind classes instead):${NC}"
  echo "$INLINE_STYLES" | head -3
  if [ $(echo "$INLINE_STYLES" | wc -l) -gt 3 ]; then
    echo "... and $(($(echo "$INLINE_STYLES" | wc -l) - 3)) more"
  fi
fi

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}✅ Code quality check complete!${NC}"
echo -e "${GREEN}================================${NC}"

# Run additional checks if in CI environment
if [ "$CI" = "true" ]; then
  echo -e "\n${YELLOW}Running CI-specific checks...${NC}"
  
  # Run linting
  npm run lint
  
  # Run type checking
  npm run typecheck
  
  # Run tests
  npm run test:ci
fi