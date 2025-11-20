import type { Example } from './types';
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
export declare function parseExamples(content: string): Example[];
/**
 * Parses a single markdown file into an Example object
 */
export declare function parseExampleFile(content: string): Example | null;
//# sourceMappingURL=parseExamples.d.ts.map