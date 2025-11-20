"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const parseExamples_1 = require("./parseExamples");
/**
 * Build configuration
 */
const CONFIG = {
    examplesDir: path.join(__dirname, '../examples'),
    outputDir: path.join(__dirname, '../dist/examples'),
    manifestPath: path.join(__dirname, '../dist/manifest.json'),
};
/**
 * Ensures a directory exists, creating it if necessary
 */
async function ensureDir(dirPath) {
    try {
        await fs.access(dirPath);
    }
    catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
}
/**
 * Reads all markdown files from the examples directory
 */
async function readExampleFiles() {
    const examples = new Map();
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
    }
    catch (error) {
        console.error('Error reading example files:', error);
        throw error;
    }
    return examples;
}
/**
 * Builds JSON files from markdown examples
 */
async function buildExamples() {
    console.log('🚀 Building examples...');
    // Ensure output directory exists
    await ensureDir(CONFIG.outputDir);
    // Read all markdown files
    const markdownFiles = await readExampleFiles();
    console.log(`📁 Found ${markdownFiles.size} markdown files`);
    const manifest = {
        version: '1.0.0',
        generatedAt: new Date().toISOString(),
        count: 0,
        examples: {},
    };
    // Process each markdown file
    for (const [slug, content] of markdownFiles) {
        try {
            const example = (0, parseExamples_1.parseExampleFile)(content);
            if (!example) {
                console.warn(`⚠️  Skipping ${slug}.md - failed to parse`);
                continue;
            }
            // Validate slug matches
            if (example.slug !== slug) {
                console.warn(`⚠️  Slug mismatch: filename "${slug}" vs generated "${example.slug}". Using filename.`);
                example.slug = slug;
            }
            // Write JSON file
            const jsonPath = path.join(CONFIG.outputDir, `${slug}.json`);
            await fs.writeFile(jsonPath, JSON.stringify(example, null, 2), 'utf-8');
            console.log(`✅ Built: ${slug}.json`);
            // Add to manifest
            const metadata = {
                title: example.title,
                description: example.description,
                category: example.category,
                icon: example.icon,
                path: `examples/${slug}.json`,
            };
            manifest.examples[slug] = metadata;
            manifest.count++;
        }
        catch (error) {
            console.error(`❌ Error processing ${slug}.md:`, error);
        }
    }
    // Write manifest
    await fs.writeFile(CONFIG.manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
    console.log(`\n📋 Manifest created with ${manifest.count} examples`);
    console.log(`✨ Build complete! Output: ${CONFIG.outputDir}`);
}
// Run the build
buildExamples().catch((error) => {
    console.error('❌ Build failed:', error);
    process.exit(1);
});
//# sourceMappingURL=build-examples.js.map