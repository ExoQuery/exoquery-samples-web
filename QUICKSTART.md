# Quick Start Guide

## 🎯 Goal

This repository provides **additional examples** that can be loaded dynamically into the ExoQuery website without requiring a site rebuild.

## 📝 Adding a New Example

### 1. Create a Markdown File

Create a new file in `examples/` directory:

```bash
touch examples/my-new-feature.md
```

### 2. Write the Example

Follow this format:

```markdown
## My New Feature
**Icon:** ✨
**Category:** Advanced
**Description:** Brief description of what this demonstrates

### Code
\`\`\`kotlin
import io.exoquery.*

// Your example code here
\`\`\`

### Output
\`\`\`sql
-- Expected SQL output
\`\`\`

### Schema
\`\`\`sql
-- Database setup (optional)
\`\`\`

### Try
- Try modifying X
- Try adding Y
```

### 3. Test Locally

```bash
npm run build
```

Check `dist/examples/my-new-feature.json` and `dist/manifest.json`

### 4. Commit and Push

```bash
git add examples/my-new-feature.md
git commit -m "Add my-new-feature example"
git push origin main
```

GitHub Actions will automatically:
- Build the JSON files
- Deploy to GitHub Pages
- Make it available via CDN

## 🌐 Accessing Your Example

After deployment (takes ~2 minutes):

### Via GitHub Pages
```
https://YOUR_USERNAME.github.io/exoquery-examples-web/examples/my-new-feature.json
```

### Via jsDelivr CDN (Recommended)
```
https://cdn.jsdelivr.net/gh/YOUR_USERNAME/exoquery-examples-web@main/dist/examples/my-new-feature.json
```

### On ExoQuery Website
Navigate to:
```
https://exoquery.io/#home?example=my-new-feature
```

## 🔄 Local Development with Main Site

For rapid iteration with the main site:

### Option 1: Symlink (Recommended)

```bash
# In exoquery-site/public/
ln -s ../../exoquery-examples-web/dist examples-local

# Update exoquery-site to use local examples in dev mode
# See integration docs below
```

### Option 2: Watch & Copy

```bash
# Terminal 1: Watch for changes
cd exoquery-examples-web
npm run dev

# Terminal 2: Run main site
cd exoquery-site
npm run dev
```

## 🔗 Integration with Main Site

The main ExoQuery site should implement:

```typescript
// src/utils/loadExternalExample.ts
import { parseExamples } from './parseExamples';
import type { Example } from './types';

const EXAMPLES_BASE_URL = import.meta.env.DEV
  ? '/examples-local'  // Local symlink in development
  : 'https://cdn.jsdelivr.net/gh/YOUR_USERNAME/exoquery-examples-web@main/dist';

export async function loadExternalExample(slug: string): Promise<Example | null> {
  try {
    // Try JSON first (fastest)
    const response = await fetch(`${EXAMPLES_BASE_URL}/examples/${slug}.json`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn(`Failed to load external example: ${slug}`, error);
  }
  return null;
}

export async function loadExternalManifest() {
  try {
    const response = await fetch(`${EXAMPLES_BASE_URL}/manifest.json`);
    return await response.json();
  } catch (error) {
    console.warn('Failed to load external examples manifest', error);
    return null;
  }
}
```

## 📊 File Structure After Build

```
dist/
├── manifest.json          # Index of all examples
├── examples/
│   ├── advanced-subqueries.json
│   ├── window-functions.json
│   ├── json-operations.json
│   └── recursive-cte.json
└── [TypeScript build artifacts]
```

## ✅ Validation

Your example should have:
- ✅ Unique, descriptive title
- ✅ URL-friendly filename (lowercase, hyphens)
- ✅ Valid Kotlin code
- ✅ Expected SQL output
- ✅ Optional but helpful: schema, try suggestions

## 🐛 Troubleshooting

### Build fails with parsing errors
- Check markdown syntax
- Ensure code blocks use triple backticks
- Verify required sections (Code, Output)

### Example doesn't appear on site
- Check GitHub Actions completed successfully
- Wait 2-5 minutes for GitHub Pages deployment
- Clear browser cache or add `?v=timestamp` to URL

### Slug mismatch warnings
- Filename should match the generated slug
- Use lowercase with hyphens: `my-example.md`

## 📚 Additional Resources

- [Full README](README.md)
- [Example Format Details](README.md#-example-format)
- [TypeScript API](src/types.ts)

