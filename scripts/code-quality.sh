#!/bin/bash

# Code Quality Check Script
# This script runs various checks to ensure code quality standards are met

echo "🔍 Running Code Quality Checks..."

# Check for files exceeding 500 lines
echo -e "\n📏 Checking file sizes..."
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | \
  grep -v node_modules | \
  grep -v ".next" | \
  while read file; do
    lines=$(wc -l < "$file")
    if [ $lines -gt 500 ]; then
      echo "❌ $file has $lines lines (max: 500)"
    fi
  done

# Check for console.log statements
echo -e "\n🚫 Checking for console.log statements..."
grep -r "console.log" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
  --exclude-dir=node_modules --exclude-dir=.next . || echo "✅ No console.log found"

# Check for any type usage
echo -e "\n🚫 Checking for 'any' type usage..."
grep -r ": any" --include="*.ts" --include="*.tsx" \
  --exclude-dir=node_modules --exclude-dir=.next . || echo "✅ No 'any' types found"

# Check for TODO/FIXME comments
echo -e "\n📝 Checking for TODO/FIXME comments..."
grep -r "TODO\|FIXME" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
  --exclude-dir=node_modules --exclude-dir=.next . || echo "✅ No TODO/FIXME found"

# Check for unused exports
echo -e "\n🔍 Checking TypeScript compilation..."
npx tsc --noEmit

# Run ESLint
echo -e "\n🔍 Running ESLint..."
npm run lint

echo -e "\n✅ Code quality checks complete!"