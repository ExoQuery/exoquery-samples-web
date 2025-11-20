# Integration Guide: ExoQuery Site + Examples Web

This guide shows how to integrate the external examples repository with the main ExoQuery website.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ExoQuery Website                          │
│                                                              │
│  ┌──────────────────┐         ┌──────────────────────┐     │
│  │  Built-in        │         │  External Examples   │     │
│  │  Examples        │         │  (Dynamic Loading)   │     │
│  │  (examples.md)   │         │                      │     │
│  └──────────────────┘         └──────────────────────┘     │
│         │                              │                    │
│         │                              │                    │
│         ▼                              ▼                    │
│  ┌──────────────────────────────────────────────────┐      │
│  │         Example Display Component                 │      │
│  │  • Checks if slug exists in built-in examples    │      │
│  │  • Falls back to loading from external repo      │      │
│  │  • Caches external examples in localStorage      │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                               │
                               │ Fetches from
                               ▼
        ┌──────────────────────────────────────────┐
        │   External Examples Repository           │
        │                                          │
        │   GitHub Pages / jsDelivr CDN           │
        │   • manifest.json                       │
        │   • examples/*.json                     │
        └──────────────────────────────────────────┘
```

## 📦 Setup

### 1. Install External Examples Utilities

The utility file has been created at:
```
exoquery-site/src/utils/loadExternalExamples.ts
```

### 2. Update HeroSection Component

Modify `src/components/HeroSection.astro` to support dynamic loading:

```typescript
---
import CodePlayground from './CodePlayground.vue';
import HeroCodeLoader from './HeroCodeLoader.vue';

// Default example (fallback)
const defaultHeroCode = `...`;
---

<section class="hero" id="home">
  <div class="hero-content">
    <h1>Stop Writing 300 Queries<br/>When You Need 30</h1>
    <p class="subtitle">The only Kotlin library with true query composition.</p>
    
    <!-- Use new loader component that handles ?example= query param -->
    <HeroCodeLoader 
      client:only="vue" 
      :defaultCode="defaultHeroCode"
      :defaultSqlOutput="heroSqlOutput"
      :defaultSchema="heroCodeSchema"
    />
  </div>
</section>
```

### 3. Create HeroCodeLoader Component

Create `src/components/HeroCodeLoader.vue`:

```vue
<template>
  <CodePlayground 
    :code="currentCode" 
    :initial-sql-code="currentSqlOutput" 
    :schema="currentSchema"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CodePlayground from './CodePlayground.vue';
import { loadExternalExample } from '../utils/loadExternalExamples';

interface Props {
  defaultCode: string;
  defaultSqlOutput: string;
  defaultSchema: string;
}

const props = defineProps<Props>();

const currentCode = ref(props.defaultCode);
const currentSqlOutput = ref(props.defaultSqlOutput);
const currentSchema = ref(props.defaultSchema);

async function loadExampleFromUrl() {
  if (typeof window === 'undefined') return;
  
  const params = new URLSearchParams(window.location.search);
  const exampleSlug = params.get('example');
  
  if (!exampleSlug) return;
  
  console.log(`Loading external example: ${exampleSlug}`);
  
  const example = await loadExternalExample(exampleSlug);
  
  if (example) {
    currentCode.value = example.code;
    currentSqlOutput.value = example.output;
    currentSchema.value = example.schema || '';
    console.log(`Loaded external example: ${example.title}`);
  } else {
    console.warn(`Failed to load external example: ${exampleSlug}`);
  }
}

onMounted(() => {
  loadExampleFromUrl();
  
  // Listen for URL changes
  window.addEventListener('popstate', loadExampleFromUrl);
});
</script>
```

### 4. Update Examples Component (Optional)

To show external examples in the examples browser, update `Examples.vue`:

```typescript
import { ref, onMounted, computed } from 'vue';
import examplesContent from '../content/examples.md?raw';
import { parseExamples, type Example } from '../utils/parseExamples';
import { getAllExternalExamples } from '../utils/loadExternalExamples';

// Parse built-in examples
const builtInExamples: Example[] = parseExamples(examplesContent);
const externalExamples = ref<Example[]>([]);

// Combine both
const examples = computed(() => [...builtInExamples, ...externalExamples.value]);

onMounted(async () => {
  // Load external examples metadata
  const external = await getAllExternalExamples();
  if (external) {
    // Convert manifest entries to Example format
    externalExamples.value = Object.entries(external).map(([slug, meta]) => ({
      slug,
      title: meta.title,
      description: meta.description,
      category: meta.category,
      icon: meta.icon,
      code: '', // Will be loaded on demand
      output: '',
    }));
  }
});
```

## 🔧 Local Development

### Quick Setup

Run the setup script:
```bash
cd exoquery-examples-web
./setup-local-dev.sh
```

This will:
1. Build the examples
2. Create a symlink in `exoquery-site/public/examples-local`
3. Create `.env.development` if needed

### Manual Setup

1. Build examples:
```bash
cd exoquery-examples-web
npm run build
```

2. Create symlink:
```bash
cd exoquery-site/public
ln -s ../../exoquery-examples-web/dist examples-local
```

3. The site will now use local examples in dev mode

### Testing

Start the site:
```bash
cd exoquery-site
npm run dev
```

Test URLs:
- Built-in example: `http://localhost:4321/examples/basic-select`
- External example: `http://localhost:4321/#home?example=window-functions`

## 🚀 Production Deployment

### Update Configuration

In `src/utils/loadExternalExamples.ts`, update the GitHub username:

```typescript
const EXTERNAL_EXAMPLES_CONFIG = {
  baseUrl: import.meta.env.DEV
    ? '/examples-local'
    : 'https://cdn.jsdelivr.net/gh/YOUR_USERNAME/exoquery-examples-web@main/dist',
  // ...
};
```

### Enable GitHub Pages

In the `exoquery-examples-web` repository:

1. Go to Settings → Pages
2. Source: "GitHub Actions"
3. Push to `main` to trigger deployment

### Verify

After ~2 minutes:
- Check manifest: `https://YOUR_USERNAME.github.io/exoquery-examples-web/manifest.json`
- Check example: `https://YOUR_USERNAME.github.io/exoquery-examples-web/examples/window-functions.json`

## 📊 URL Patterns

### Built-in Examples
```
https://exoquery.io/examples/basic-select
https://exoquery.io/examples/complex-joins
```

### External Examples (Hero Section)
```
https://exoquery.io/#home?example=window-functions
https://exoquery.io/#home?example=advanced-subqueries
```

### Sharing Examples
Users can share direct links:
```
https://exoquery.io/#home?example=recursive-cte
```

## 🔍 Troubleshooting

### Examples not loading locally
- Check symlink exists: `ls -la exoquery-site/public/examples-local`
- Rebuild examples: `cd exoquery-examples-web && npm run build`
- Clear cache: Open DevTools → Application → Local Storage → Clear

### 404 in production
- Verify GitHub Pages is enabled
- Check GitHub Actions completed successfully
- Wait 2-5 minutes for CDN propagation
- Try force refresh: Add `?v=timestamp` to URL

### CORS errors
- GitHub Pages: ✅ CORS enabled by default
- jsDelivr: ✅ CORS enabled by default
- Custom domain: May need CORS headers

## 🎯 Benefits

### For Users
- ✅ More examples without site updates
- ✅ Shareable direct links
- ✅ Fast loading (CDN + caching)

### For Developers
- ✅ Add examples without site rebuild
- ✅ Rapid local iteration
- ✅ Version controlled examples
- ✅ TypeScript type safety

### For Maintenance
- ✅ Separate concerns (site vs content)
- ✅ Independent deployment
- ✅ Easy rollback (Git tags)

## 📚 API Reference

See `src/utils/loadExternalExamples.ts` for:
- `loadExternalExample(slug)` - Load single example
- `loadExternalManifest()` - Get all available examples
- `isExternalExample(slug)` - Check if example exists
- `clearExternalCache()` - Clear localStorage cache

