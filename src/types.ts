/**
 * Debounce execution modes
 */
export enum DebounceMode {
  /** Execute function after the delay (most common) */
  TRAILING = 'trailing',
  /** Execute function immediately, then wait */  
  LEADING = 'leading',
  /** Execute immediately AND after delay */
  BOTH = 'both'
}

/**
 * A debounced function with additional utility methods
 */
export interface DebouncedFunction<T extends (...args: any[]) => any> {
  /**
   * The debounced version of the original function
   */
  (...args: Parameters<T>): void;
  
  /**
   * Cancels any pending execution
   */
  cancel(): void;
  
  /**
   * Immediately executes any pending call
   */
  flush(): void;
  
  /**
   * Returns true if there's a pending execution
   */
  pending(): boolean;
}

/**
 * Options for configuring debounce behavior
 */
export interface DebounceOptions {
  /** The debounce mode: TRAILING, LEADING, or BOTH */
  mode?: DebounceMode;
}