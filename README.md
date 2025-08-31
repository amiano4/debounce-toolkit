# debounce-toolkit

A debounce utility with multiple execution modes.

## Installation

```bash
npm install debounce-toolkit
```

## Usage

```typescript
import { debounce, DebounceMode } from 'debounce-toolkit';

// Basic usage - executes after 1000ms delay
const debouncedFn = debounce(myFunction, 1000);

// Execute immediately, then wait
const leadingFn = debounce(myFunction, 1000, DebounceMode.LEADING);

// Execute immediately AND after delay  
const bothFn = debounce(myFunction, 1000, DebounceMode.BOTH);
```

## Modes

- `TRAILING` (default): Execute after delay
- `LEADING`: Execute immediately, ignore subsequent calls
- `BOTH`: Execute immediately and after delay

## Control Methods

```typescript
const fn = debounce(myFunction, 1000);

fn.cancel();   // Cancel pending execution
fn.flush();    // Execute immediately if pending
fn.pending();  // Returns true if execution is pending
```

## Common Examples

### Auto-save
```typescript
const autoSave = debounce(saveData, 1000);
input.addEventListener('input', autoSave);
```

### Prevent double-clicks
```typescript
const handleClick = debounce(onClick, 2000, DebounceMode.LEADING);
button.addEventListener('click', handleClick);
```

### Search suggestions
```typescript
const search = debounce(fetchSuggestions, 300);
searchInput.addEventListener('input', (e) => search(e.target.value));
```

## API

```typescript
debounce<T>(fn: T, wait?: number, mode?: DebounceMode): DebouncedFunction<T>
debounce<T>(fn: T, wait?: number, options?: DebounceOptions): DebouncedFunction<T>
```

## License

MIT