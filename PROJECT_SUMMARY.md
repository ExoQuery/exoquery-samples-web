# ExoQuery Examples Web - Project Summary

## 📋 Overview

This is a TypeScript-based build system that converts Markdown examples into JSON files for dynamic loading by the ExoQuery website. It allows adding new examples without redeploying the main site.

## 🎯 Purpose

**Problem**: Adding new code examples to the ExoQuery site requires:
- Editing the site source code
- Rebuilding the entire site
- Redeploying to production

**Solution**: External examples repository that:
- ✅ Stores examples as Markdown files
- ✅ Automatically builds JSON on every commit
- ✅ Deploys to GitHub Pages / CDN
- ✅ Loads dynamically in the browser
- ✅ Caches for performance

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Development Flow                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
          1. Write Markdown Example
              (examples/*.md)
                          │
                          ▼
          2. Git Push to Main Branch
                          │
                          ▼
          3. GitHub Actions Triggers
              - npm install
              - npm run build
              - Deploy to GitHub Pages
                          │
                          ▼
          4. Available via CDN
              - jsDelivr (recommended)
              - GitHub Pages
                          │
                          ▼
          5. ExoQuery Site Loads Example
              - Checks localStorage cache
              - Fetches if not cached
              - Displays in CodePlayground
```

## 📁 Project Structure

```
exoquery-examples-web/
│
├── examples/                    # Markdown source files
│   ├── advanced-subqueries.md  # Example: Advanced SQL subqueries
│   ├── window-functions.md     # Example: Window functions
│   ├── json-operations.md      # Example: JSON columns
│   └── recursive-cte.md        # Example: Recursive queries
│
├── src/                         # TypeScript source
│   ├── types.ts                # TypeScript interfaces
│   │   └── Example             # Main example interface
│   │   └── ExamplesManifest    # Manifest structure
│   │
│   ├── parseExamples.ts        # Markdown parser
│   │   └── parseExamples()     # Parse markdown → Example[]
│   │   └── parseExampleFile()  # Parse single file
│   │
│   └── build-examples.ts       # Build script (main)
│       └── buildExamples()     # MD → JSON conversion
│       └── Generates:
│           - dist/examples/*.json
│           - dist/manifest.json
│
├── dist/                        # Build output (generated)
│   ├── manifest.json           # Index of all examples
│   └── examples/               # JSON example files
│       ├── advanced-subqueries.json
│       ├── window-functions.json
│       ├── json-operations.json
│       └── recursive-cte.json
│
├── .github/workflows/           # CI/CD
│   └── build-and-deploy.yml    # Auto-build & deploy
│
├── Documentation
│   ├── README.md               # Main documentation
│   ├── QUICKSTART.md           # Quick start guide
│   ├── INTEGRATION.md          # Integration with main site
│   └── PROJECT_SUMMARY.md      # This file
│
└── Configuration
    ├── package.json            # Node.js dependencies
    ├── tsconfig.json           # TypeScript config
    ├── LICENSE                 # Apache 2.0 license
    └── setup-local-dev.sh      # Local dev setup script
```

## 🔄 Data Flow

### 1. Markdown Format (Input)
```markdown
## Advanced Subqueries
**Icon:** 🔍
**Category:** Advanced
**Description:** Using subqueries for complex filtering

### Code
```kotlin
// Kotlin code here
```

### Output
```sql
-- Expected SQL
```

### Schema
```sql
-- Database setup
```

### Try
- Suggestion 1
- Suggestion 2
```

### 2. JSON Format (Output)
```json
{
  "title": "Advanced Subqueries",
  "slug": "advanced-subqueries",
  "icon": "🔍",
  "category": "Advanced",
  "description": "Using subqueries for complex filtering",
  "code": "...",
  "output": "...",
  "schema": "...",
  "try": ["Suggestion 1", "Suggestion 2"]
}
```

### 3. Manifest Format
```json
{
  "version": "1.0.0",
  "generatedAt": "2025-11-20T...",
  "count": 4,
  "examples": {
    "advanced-subqueries": {
      "title": "Advanced Subqueries",
      "description": "...",
      "category": "Advanced",
      "icon": "🔍",
      "path": "examples/advanced-subqueries.json"
    }
  }
}
```

## 🚀 Usage Workflows

### Adding a New Example

```bash
# 1. Create markdown file
vim examples/my-feature.md

# 2. Test locally
npm run build
cat dist/examples/my-feature.json

# 3. Commit and push
git add examples/my-feature.md
git commit -m "Add my-feature example"
git push

# 4. Wait ~2 minutes for deployment
# 5. Access at: https://exoquery.io/#home?example=my-feature
```

### Local Development with Main Site

```bash
# One-time setup
./setup-local-dev.sh

# Workflow
cd exoquery-examples-web
npm run build              # Build examples

cd ../exoquery-site
npm run dev                # Start site

# Navigate to:
# http://localhost:4321/#home?example=window-functions
```

### Production URLs

**Via jsDelivr (Recommended)**
```
https://cdn.jsdelivr.net/gh/USER/exoquery-examples-web@main/dist/manifest.json
https://cdn.jsdelivr.net/gh/USER/exoquery-examples-web@main/dist/examples/SLUG.json
```

**Via GitHub Pages**
```
https://USER.github.io/exoquery-examples-web/manifest.json
https://USER.github.io/exoquery-examples-web/examples/SLUG.json
```

## 🔌 Integration Points

### Main Site Integration

File: `exoquery-site/src/utils/loadExternalExamples.ts`

Key functions:
- `loadExternalExample(slug)` - Load single example with caching
- `loadExternalManifest()` - Get list of all examples
- `isExternalExample(slug)` - Check if slug exists
- `clearExternalCache()` - Clear localStorage

### URL Handling

**Built-in examples** (already in site):
```
/examples/basic-select       → src/content/examples.md
/examples/complex-joins      → src/content/examples.md
```

**External examples** (this repo):
```
/#home?example=window-functions     → External load
/#home?example=advanced-subqueries  → External load
```

### Caching Strategy

1. **First Load**: Fetch from CDN, store in localStorage
2. **Subsequent Loads**: Use localStorage (1 hour TTL)
3. **Cache Invalidation**: Automatic after 1 hour
4. **Manual Clear**: `clearExternalCache()` function

## 📊 Build Process

### TypeScript Compilation
```
src/*.ts → dist/*.js
```

### Example Processing
```
examples/*.md → parseExamples() → dist/examples/*.json
```

### Manifest Generation
```
All examples → aggregate metadata → dist/manifest.json
```

## 🛠️ Technical Details

### Dependencies
- `typescript` - Type checking and compilation
- `@types/node` - Node.js type definitions

### No Runtime Dependencies
All code runs at build time. The output is pure JSON.

### Type Safety
Full TypeScript coverage:
- ✅ Example interface
- ✅ Manifest structure
- ✅ Parser functions
- ✅ Build script

### Performance
- Build time: ~1-2 seconds for 4 examples
- Output size: ~2-5KB per example (JSON)
- CDN caching: Aggressive (jsDelivr)
- Browser caching: 1 hour (localStorage)

## 🔒 Security

### License
Apache 2.0 - Permissive open source license

### No Secrets Required
- No API keys needed
- No authentication required
- GitHub Pages deployment uses `GITHUB_TOKEN` (auto-provided)

### CORS Headers
- ✅ GitHub Pages: CORS enabled by default
- ✅ jsDelivr: CORS enabled by default

## 📈 Scalability

### Current
- 4 examples
- ~20KB total output

### Supports
- Hundreds of examples
- Thousands of requests/day (CDN)
- Automatic CDN scaling

### Limitations
- GitHub Pages: 1GB soft limit
- jsDelivr: No practical limits

## ✅ Testing

### Manual Testing
```bash
npm run build
node -e "console.log(require('./dist/manifest.json'))"
node -e "console.log(require('./dist/examples/window-functions.json'))"
```

### CI Testing
GitHub Actions runs:
- `npm run typecheck` - Type checking
- `npm run build` - Full build
- Upload artifacts
- Deploy to GitHub Pages

## 🎯 Success Metrics

### For Developers
- ✅ Add example in < 5 minutes
- ✅ No site rebuild needed
- ✅ Live in < 2 minutes

### For Users
- ✅ Fast loading (< 100ms from cache)
- ✅ Shareable URLs
- ✅ Always available (CDN)

### For Maintenance
- ✅ Type-safe code
- ✅ Automated deployment
- ✅ Version controlled

## 🔮 Future Enhancements

### Potential Additions
- [ ] Example categories/tags
- [ ] Search functionality
- [ ] Preview images
- [ ] Difficulty ratings
- [ ] Related examples links
- [ ] Multi-language support
- [ ] Interactive tutorials

### Not Planned
- ❌ Database backend (keep it simple)
- ❌ User submissions (security)
- ❌ Real-time updates (not needed)

## 📞 Support

### Quick Links
- [README](README.md) - Full documentation
- [QUICKSTART](QUICKSTART.md) - Getting started
- [INTEGRATION](INTEGRATION.md) - Site integration

### Troubleshooting
See INTEGRATION.md → Troubleshooting section

## 🎉 Summary

**What This Project Does**:
Store ExoQuery code examples in Markdown, automatically convert to JSON, and serve via CDN for dynamic loading.

**Why It Exists**:
Enable adding examples without rebuilding/redeploying the main site.

**How It Works**:
GitHub Actions → Build → GitHub Pages/CDN → Browser Cache → Display

**Key Benefit**:
Examples update in < 2 minutes vs. full site deployment.

