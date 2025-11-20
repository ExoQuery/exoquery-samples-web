# Getting Started with ExoQuery Examples Web

Welcome! This guide will get you up and running in 5 minutes.

## 🎯 What This Project Does

This repository stores **additional ExoQuery code examples** that can be loaded dynamically by the main website **without requiring a site rebuild**. 

Think of it as a CDN for code examples.

## ⚡ Quick Start (5 minutes)

### 1. Clone and Setup

```bash
cd ~/git
git clone https://github.com/YOUR_USERNAME/exoquery-examples-web.git
cd exoquery-examples-web
npm install
```

### 2. Build Examples

```bash
npm run build
```

This creates:
- `dist/manifest.json` - Index of all examples
- `dist/examples/*.json` - Individual example files

### 3. View Output

```bash
cat dist/manifest.json
cat dist/examples/window-functions.json
```

**That's it!** You've built the examples.

## 📝 Add Your First Example

### 1. Create a Markdown File

```bash
vim examples/my-first-example.md
```

### 2. Add Content

```markdown
## My First Example
**Icon:** ✨
**Category:** Basics
**Description:** A simple example

### Code
\`\`\`kotlin
import io.exoquery.*

val myQuery = sql { Table<User>() }
fun main() = myQuery.buildFor.Postgres().runSample()
\`\`\`

### Output
\`\`\`sql
SELECT * FROM "User"
\`\`\`

### Try
- Try adding a WHERE clause
- Try joining another table
```

### 3. Build and Test

```bash
npm run build
cat dist/examples/my-first-example.json
```

**Success!** Your example is now ready.

## 🌐 Deploy to Production

### Setup GitHub Pages

1. Push your repo to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/exoquery-examples-web.git
git push -u origin main
```

2. Enable GitHub Pages:
   - Go to repo Settings → Pages
   - Source: "GitHub Actions"
   - Save

3. Wait ~2 minutes for deployment

### Verify Deployment

Check these URLs (replace YOUR_USERNAME):

```bash
# Manifest
curl https://YOUR_USERNAME.github.io/exoquery-examples-web/manifest.json

# Example
curl https://YOUR_USERNAME.github.io/exoquery-examples-web/examples/window-functions.json
```

**That's it!** Your examples are live.

## 🔗 Access from ExoQuery Site

Once deployed, examples are accessible at:

```
https://exoquery.io/#home?example=my-first-example
```

## 🛠️ Local Development with Main Site

### One-Time Setup

```bash
./setup-local-dev.sh
```

This creates a symlink so the main site can load your local examples.

### Development Workflow

```bash
# Terminal 1: Build examples when you make changes
cd exoquery-examples-web
npm run build

# Terminal 2: Run the main site
cd ../exoquery-site
npm run dev
```

Visit: `http://localhost:4321/#home?example=my-first-example`

## 📚 Example Format

Every example needs:

| Section | Required | Description |
|---------|----------|-------------|
| Title | ✅ Yes | `## Example Title` |
| Icon | ✅ Yes | `**Icon:** 🎯` |
| Category | ✅ Yes | `**Category:** Advanced` |
| Description | ✅ Yes | `**Description:** What it does` |
| Code | ✅ Yes | Kotlin code in ` ```kotlin ` block |
| Output | ✅ Yes | SQL output in ` ```sql ` block |
| Schema | ❌ No | Database setup (optional) |
| Try | ❌ No | Suggestions for users (optional) |

## 🎓 Learn More

- **[README.md](README.md)** - Full documentation
- **[QUICKSTART.md](QUICKSTART.md)** - Detailed quick start
- **[INTEGRATION.md](INTEGRATION.md)** - Integration with main site
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Architecture overview

## 📋 Available Commands

```bash
npm run build          # Build all examples
npm run dev            # Watch TypeScript files
npm run typecheck      # Type check without building
npm run clean          # Remove dist/ directory
```

## ❓ Common Questions

### Q: How do I update an example?
A: Edit the `.md` file, run `npm run build`, commit and push.

### Q: How long until changes are live?
A: ~2 minutes after pushing to GitHub.

### Q: Can I test before deploying?
A: Yes! Run `npm run build` and check `dist/` directory.

### Q: What if I break something?
A: Just revert the Git commit. The previous version will deploy.

### Q: Where are the built-in examples?
A: In the main site at `exoquery-site/src/content/examples.md`

### Q: What's the difference between built-in and external?
A: Built-in examples are part of the site code. External examples (this repo) load dynamically.

## 🎉 You're Ready!

**Next Steps:**
1. ✅ Add your first example
2. ✅ Build and test locally
3. ✅ Push to GitHub
4. ✅ See it live on the site

**Need Help?**
- Check the other docs in this repo
- Open an issue on GitHub
- Review existing examples for guidance

Happy coding! 🚀

