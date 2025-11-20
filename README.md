# ExoQuery Examples Web

External examples repository for the ExoQuery website. This repository contains additional code examples that can be dynamically loaded without redeploying the main site.

## 📋 Overview

This repository serves as a CDN-friendly source of ExoQuery code examples. Examples are written in Markdown and automatically converted to JSON files that can be consumed by the main ExoQuery website.

## 🏗️ Structure

```
exoquery-examples-web/
├── examples/           # Markdown example files
│   ├── advanced-subqueries.md
│   ├── window-functions.md
│   ├── json-operations.md
│   └── recursive-cte.md
├── src/                # TypeScript source
│   ├── types.ts        # TypeScript interfaces
│   ├── parseExamples.ts # Markdown parser
│   └── build-examples.ts # Build script
├── dist/               # Generated files (created on build)
│   ├── manifest.json   # Index of all examples
│   └── examples/       # JSON example files
│       ├── advanced-subqueries.json
│       └── ...
└── .github/
    └── workflows/
        └── build-and-deploy.yml # CI/CD pipeline
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

```bash
npm install
```

### Building Examples

```bash
npm run build
```

This will:
1. Compile TypeScript files
2. Parse all markdown files in `examples/`
3. Generate JSON files in `dist/examples/`
4. Create a manifest file at `dist/manifest.json`

### Development

Watch TypeScript files for changes:

```bash
npm run dev
```

## 📝 Example Format

Examples are written in Markdown with the following structure:

```markdown
## Example Title
**Icon:** 🎯
**Category:** CategoryName
**Description:** Short description

### Code
\`\`\`kotlin
// Your Kotlin code here
\`\`\`

### Output
\`\`\`sql
-- Expected SQL output
\`\`\`

### Schema
\`\`\`sql
-- Database schema (optional)
\`\`\`

### Try
- Suggestion 1
- Suggestion 2
```

## 🌐 Accessing Examples

### Via GitHub Pages

Once deployed, examples are available at:
- Manifest: `https://YOUR_USERNAME.github.io/exoquery-examples-web/manifest.json`
- Individual example: `https://YOUR_USERNAME.github.io/exoquery-examples-web/examples/SLUG.json`

### Via jsDelivr CDN

For better performance, use jsDelivr:
- Manifest: `https://cdn.jsdelivr.net/gh/YOUR_USERNAME/exoquery-examples-web@main/dist/manifest.json`
- Individual example: `https://cdn.jsdelivr.net/gh/YOUR_USERNAME/exoquery-examples-web@main/dist/examples/SLUG.json`

## 🔄 CI/CD

The GitHub Actions workflow automatically:
1. Runs on every push to `main`
2. Installs dependencies
3. Type checks the code
4. Builds all examples
5. Deploys to GitHub Pages

## 📦 Output Format

### Manifest (`manifest.json`)

```json
{
  "version": "1.0.0",
  "generatedAt": "2025-01-01T00:00:00.000Z",
  "count": 4,
  "examples": {
    "advanced-subqueries": {
      "title": "Advanced Subqueries",
      "description": "Using subqueries for complex filtering",
      "category": "Advanced",
      "icon": "🔍",
      "path": "examples/advanced-subqueries.json"
    }
  }
}
```

### Example File (`examples/SLUG.json`)

```json
{
  "title": "Advanced Subqueries",
  "slug": "advanced-subqueries",
  "code": "...",
  "output": "...",
  "schema": "...",
  "icon": "🔍",
  "description": "Using subqueries for complex filtering",
  "category": "Advanced",
  "try": [
    "Try using IN with a subquery",
    "Try correlating the subquery"
  ]
}
```

## 🤝 Contributing

1. Add a new Markdown file to `examples/`
2. Follow the example format above
3. Run `npm run build` to test
4. Commit and push to trigger deployment

## 📄 License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.

## 🔗 Related Projects

- [ExoQuery Website](https://github.com/YOUR_USERNAME/exoquery-site) - Main website
- [ExoQuery](https://github.com/ExoQuery/ExoQuery) - Core library

## 💡 Tips

- **Slugs**: Filename becomes the slug (e.g., `advanced-subqueries.md` → `advanced-subqueries`)
- **Testing**: Run `npm run build` locally before pushing
- **CDN Cache**: jsDelivr caches aggressively; force refresh with `?v=timestamp`
- **Local Development**: Use the main site's symlink feature for rapid iteration

