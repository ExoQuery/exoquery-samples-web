"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExamples = parseExamples;
exports.parseExampleFile = parseExampleFile;
/**
 * Generates a URL-friendly slug from a title
 */
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
}
/**
 * Parses markdown content into Example objects
 *
 * Expected markdown format:
 * ```
 * ## Title
 * **Icon:** 🎯
 * **Category:** CategoryName
 * **Description:** Description text
 *
 * ### Code
 * ```kotlin
 * // code here
 * ```
 *
 * ### Output
 * ```sql
 * -- sql here
 * ```
 *
 * ### Schema
 * ```sql
 * -- schema here
 * ```
 *
 * ### Try
 * - Try this
 * - Try that
 * ```
 */
function parseExamples(content) {
    const examples = [];
    // Normalize line endings and split by horizontal rules
    const normalizedContent = content.replace(/\r\n/g, '\n');
    const sections = normalizedContent
        .split(/\n+---+\n+/)
        .filter(s => s.trim() && !s.trim().startsWith('# '));
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const example = {};
        // Extract title (## Title)
        const titleMatch = section.match(/##\s+(.+)/);
        if (titleMatch) {
            example.title = titleMatch[1].trim();
            example.slug = generateSlug(example.title);
        }
        // Extract icon (**Icon:** emoji)
        const iconMatch = section.match(/\*\*Icon:\*\*\s+(.+)/);
        if (iconMatch) {
            example.icon = iconMatch[1].trim();
        }
        // Extract category (**Category:** value)
        const categoryMatch = section.match(/\*\*Category:\*\*\s+(.+)/);
        if (categoryMatch) {
            example.category = categoryMatch[1].trim();
        }
        // Extract description (**Description:** value)
        const descriptionMatch = section.match(/\*\*Description:\*\*\s+(.+)/);
        if (descriptionMatch) {
            example.description = descriptionMatch[1].trim();
        }
        // Extract code (### Code ... ```)
        const codeMatch = section.match(/###\s+Code\s*\n```(?:kotlin)?\s*\n([\s\S]*?)```/);
        if (codeMatch) {
            example.code = codeMatch[1].trim();
        }
        // Extract output (### Output ... ```)
        const outputMatch = section.match(/###\s+Output\s*\n```(?:sql)?\s*\n([\s\S]*?)```/);
        if (outputMatch) {
            example.output = outputMatch[1].trim();
        }
        else {
            example.output = '';
        }
        // Extract schema if present (### Schema ... ```)
        const schemaMatch = section.match(/###\s+Schema\s*\n```(?:sql)?\s*\n([\s\S]*?)```/);
        if (schemaMatch) {
            example.schema = schemaMatch[1].trim();
        }
        // Extract "Try" section if present (### Try ... list of items)
        const tryMatch = section.match(/###\s+Try\s*\n((?:[-*]\s+.+\n?)+)/);
        if (tryMatch) {
            const tryItems = tryMatch[1]
                .split('\n')
                .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
                .map(line => line.replace(/^[-*]\s+/, '').trim())
                .filter(item => item.length > 0);
            if (tryItems.length > 0) {
                example.try = tryItems;
            }
        }
        // Only add if we have required fields
        if (example.title && example.code) {
            examples.push(example);
        }
        else {
            console.warn(`Skipping section ${i} - missing required fields:`, {
                title: example.title,
                hasCode: !!example.code
            });
        }
    }
    return examples;
}
/**
 * Parses a single markdown file into an Example object
 */
function parseExampleFile(content) {
    const examples = parseExamples(content);
    return examples.length > 0 ? examples[0] : null;
}
//# sourceMappingURL=parseExamples.js.map