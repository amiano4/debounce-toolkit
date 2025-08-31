import { DebounceMode, DebouncedFunction, DebounceOptions } from "./types";

/**
 * Creates a debounced version of a function that delays invoking func until
 * after wait milliseconds have elapsed since the last time the debounced
 * function was invoked.
 *
 * @param fn - The function to debounce
 * @param wait - The number of milliseconds to delay (default: 0)
 * @param mode - The debounce mode: TRAILING, LEADING, or BOTH (default: TRAILING)
 * @returns The debounced function with additional methods:
 *   - cancel(): Cancels any pending execution
 *   - flush(): Immediately executes any pending call
 *   - pending(): Returns true if there's a pending execution
 *
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait?: number,
  mode?: DebounceMode
): DebouncedFunction<T>;

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait?: number,
  options?: DebounceOptions
): DebouncedFunction<T>;

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait?: number,
  modeOrOptions?: DebounceMode | DebounceOptions
): DebouncedFunction<T> {
  // Handle default values
  wait = wait ?? 0;

  // Handle both function signatures
  const mode =
    typeof modeOrOptions === "string"
      ? modeOrOptions
      : modeOrOptions?.mode ?? DebounceMode.TRAILING;

  // Validate parameters
  if (typeof fn !== "function") {
    throw new TypeError("Expected fn to be a function");
  }

  if (typeof wait !== "number" || wait < 0) {
    throw new TypeError("Expected wait to be a non-negative number");
  }

  if (!Object.values(DebounceMode).includes(mode)) {
    throw new TypeError("Invalid debounce mode");
  }

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: ThisParameterType<T> | null = null;
  let leadingCalled = false;

  const cleanup = (): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const debounced = function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ): void {
    lastArgs = args;
    lastThis = this;

    const shouldCallLeading =
      (mode === DebounceMode.LEADING || mode === DebounceMode.BOTH) &&
      !leadingCalled;
    const shouldCallTrailing =
      mode === DebounceMode.TRAILING || mode === DebounceMode.BOTH;

    // Clear existing timeout
    cleanup();

    // Execute immediately for leading mode
    if (shouldCallLeading) {
      fn.apply(lastThis, lastArgs);
      leadingCalled = true;
    }

    // Set up delayed execution
    timeoutId = setTimeout(() => {
      if (shouldCallTrailing && (!shouldCallLeading || leadingCalled)) {
        fn.apply(lastThis, lastArgs!);
      }
      timeoutId = null;
      leadingCalled = false;
    }, wait);
  };

  // Add utility methods to the debounced function
  debounced.cancel = (): void => {
    cleanup();
    leadingCalled = false;
  };

  debounced.flush = (): void => {
    if (timeoutId && lastArgs) {
      cleanup();
      fn.apply(lastThis, lastArgs);
      leadingCalled = false;
    }
  };

  debounced.pending = (): boolean => timeoutId !== null;

  return debounced as DebouncedFunction<T>;
}
