/**
 * Main entry point for the prompt-fn library.
 *
 * Import from here when consuming the npm module:
 * ```ts
 * import { definePrompt } from 'prompt-fn';
 * ```
 * This surface re-exports the core helper plus the relevant schemas and types
 * documented in the TypeDoc/Docusaurus guides.
 */
export { definePrompt } from './definePrompt';
export * from './schemas';
export * from './types';
