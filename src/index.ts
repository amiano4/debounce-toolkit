/**
 * debounce-toolkit
 * 
 * A powerful, TypeScript-compatible debounce utility with multiple execution modes 
 * and advanced control methods.
 * 
 * @author amiano4
 * @version 1.0.0
 */

// Export types
export type { DebouncedFunction, DebounceOptions } from './types';
export { DebounceMode } from './types';

// Export main function
export { debounce } from './debounce';

// Default export for convenience
export { debounce as default } from './debounce';