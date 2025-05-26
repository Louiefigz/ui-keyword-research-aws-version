module.exports = {
  // TypeScript and TSX files
  '*.{ts,tsx}': [
    // Check file size
    (filenames) => {
      const errors = [];
      filenames.forEach((filename) => {
        const fs = require('fs');
        const content = fs.readFileSync(filename, 'utf8');
        const lines = content.split('\n').length;
        if (lines > 500) {
          errors.push(`${filename}: ${lines} lines (max 500)`);
        }
      });
      if (errors.length > 0) {
        throw new Error(`Files exceed size limit:\n${errors.join('\n')}`);
      }
      return [];
    },
    
    // Run ESLint
    'eslint --fix',
    
    // Run Prettier
    'prettier --write',
    
    // Check for any types
    (filenames) => {
      const errors = [];
      filenames.forEach((filename) => {
        if (!filename.includes('.test.') && !filename.includes('.spec.')) {
          const fs = require('fs');
          const content = fs.readFileSync(filename, 'utf8');
          if (content.includes(': any')) {
            errors.push(`${filename}: contains 'any' type`);
          }
        }
      });
      if (errors.length > 0) {
        console.warn(`⚠️  Warning - 'any' types found:\n${errors.join('\n')}`);
      }
      return [];
    },
  ],
  
  // JSON files
  '*.json': [
    'prettier --write',
  ],
  
  // Markdown files
  '*.md': [
    'prettier --write',
  ],
  
  // CSS files
  '*.css': [
    'prettier --write',
  ],
}