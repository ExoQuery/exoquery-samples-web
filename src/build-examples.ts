import * as fs from 'fs/promises';
import * as path from 'path';
import { parseExampleFile } from './parseExamples';
import type { ExamplesManifest, ExampleMetadata } from './types';

/**
 * Build configuration
 */
const CONFIG = {
  examplesDir: path.join(__dirname, '../examples'),
  outputDir: path.join(__dirname, '../dist/examples'),
  manifestPath: path.join(__dirname, '../dist/manifest.json'),
} as const;

/**
 * Ensures a directory exists, creating it if necessary
 */
async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Reads all markdown files from the examples directory
 */
async function readExampleFiles(): Promise<Map<string, string>> {
  const examples = new Map<string, string>();
  
  try {
    const files = await fs.readdir(CONFIG.examplesDir);
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(CONFIG.examplesDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const slug = file.replace('.md', '');
        examples.set(slug, content);
      }
    }
  } catch (error) {
    console.error('Error reading example files:', error);
    throw error;
  }
  
  return examples;
}

/**
 * Builds JSON files from markdown examples
 */
async function buildExamples(): Promise<void> {
  console.log('🚀 Building examples...');
  
  // Ensure output directory exists
  await ensureDir(CONFIG.outputDir);
  
  // Read all markdown files
  const markdownFiles = await readExampleFiles();
  console.log(`📁 Found ${markdownFiles.size} markdown files`);
  
  const manifest: ExamplesManifest = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    count: 0,
    examples: {},
  };
  
  // Process each markdown file
  for (const [slug, content] of markdownFiles) {
    try {
      const example = parseExampleFile(content);
      
      if (!example) {
        console.warn(`⚠️  Skipping ${slug}.md - failed to parse`);
        continue;
      }
      
      // Validate slug matches
      if (example.slug !== slug) {
        console.warn(
          `⚠️  Slug mismatch: filename "${slug}" vs generated "${example.slug}". Using filename.`
        );
        example.slug = slug;
      }
      
      // Write JSON file
      const jsonPath = path.join(CONFIG.outputDir, `${slug}.json`);
      await fs.writeFile(jsonPath, JSON.stringify(example, null, 2), 'utf-8');
      console.log(`✅ Built: ${slug}.json`);
      
      // Add to manifest
      const metadata: ExampleMetadata = {
        title: example.title,
        description: example.description,
        category: example.category,
        icon: example.icon,
        path: `examples/${slug}.json`,
      };
      
      manifest.examples[slug] = metadata;
      manifest.count++;
      
    } catch (error) {
      console.error(`❌ Error processing ${slug}.md:`, error);
    }
  }
  
  // Write manifest
  await fs.writeFile(
    CONFIG.manifestPath,
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );
  console.log(`\n📋 Manifest created with ${manifest.count} examples`);
  console.log(`✨ Build complete! Output: ${CONFIG.outputDir}`);
}

// Run the build
buildExamples().catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});

