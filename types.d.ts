/**
 * Represents a single code example with all its components
 */
export interface Example {
    /** Human-readable title of the example */
    title: string;
    /** URL-friendly slug for routing */
    slug: string;
    /** Kotlin code for the example */
    code: string;
    /** Expected SQL output */
    output: string;
    /** Optional database schema SQL */
    schema?: string;
    /** Optional emoji icon */
    icon?: string;
    /** Optional description text */
    description?: string;
    /** Optional category for grouping */
    category?: string;
    /** Optional list of suggestions to try */
    try?: string[];
}
/**
 * Manifest containing metadata about all available examples
 */
export interface ExamplesManifest {
    /** Version of the manifest format */
    version: string;
    /** Timestamp when manifest was generated */
    generatedAt: string;
    /** Total number of examples */
    count: number;
    /** Map of slug to example metadata */
    examples: Record<string, ExampleMetadata>;
}
/**
 * Lightweight metadata for an example (used in manifest)
 */
export interface ExampleMetadata {
    /** Human-readable title */
    title: string;
    /** Optional description */
    description?: string;
    /** Optional category */
    category?: string;
    /** Optional icon */
    icon?: string;
    /** Path to the example file */
    path: string;
}
//# sourceMappingURL=types.d.ts.map