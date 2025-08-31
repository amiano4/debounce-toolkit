import { debounce, DebounceMode } from '../src';

// Mock timers
jest.useFakeTimers();

describe('debounce', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
  });

  describe('parameter validation', () => {
    it('should throw error for non-function first argument', () => {
      expect(() => debounce('not a function' as any)).toThrow('Expected fn to be a function');
    });

    it('should throw error for negative wait time', () => {
      expect(() => debounce(() => {}, -1)).toThrow('Expected wait to be a non-negative number');
    });

    it('should throw error for invalid mode', () => {
      expect(() => debounce(() => {}, 100, 'invalid' as any)).toThrow('Invalid debounce mode');
    });
  });

  describe('TRAILING mode (default)', () => {
    it('should execute function after delay', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should reset timer on multiple calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      jest.advanceTimersByTime(50);
      debouncedFn();
      jest.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should pass correct arguments', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2');
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should preserve context', () => {
      const context = { value: 42 };
      const mockFn = jest.fn(function(this: typeof context) {
        return this.value;
      });
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn.call(context);
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('LEADING mode', () => {
    it('should execute function immediately', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, DebounceMode.LEADING);

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should ignore subsequent calls during cooldown', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, DebounceMode.LEADING);

      debouncedFn();
      debouncedFn();
      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should allow execution after cooldown', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, DebounceMode.LEADING);

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('BOTH mode', () => {
    it('should execute function immediately and after delay', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, DebounceMode.BOTH);

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should reset trailing timer on multiple calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, DebounceMode.BOTH);

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(50);
      debouncedFn();
      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('utility methods', () => {
    describe('cancel()', () => {
      it('should cancel pending execution', () => {
        const mockFn = jest.fn();
        const debouncedFn = debounce(mockFn, 100);

        debouncedFn();
        debouncedFn.cancel();
        jest.advanceTimersByTime(100);
        expect(mockFn).not.toHaveBeenCalled();
      });

      it('should reset leading mode state', () => {
        const mockFn = jest.fn();
        const debouncedFn = debounce(mockFn, 100, DebounceMode.LEADING);

        debouncedFn();
        expect(mockFn).toHaveBeenCalledTimes(1);
        
        debouncedFn.cancel();
        debouncedFn();
        expect(mockFn).toHaveBeenCalledTimes(2);
      });
    });

    describe('flush()', () => {
      it('should immediately execute pending function', () => {
        const mockFn = jest.fn();
        const debouncedFn = debounce(mockFn, 100);

        debouncedFn('test');
        debouncedFn.flush();
        expect(mockFn).toHaveBeenCalledWith('test');
        expect(mockFn).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(100);
        expect(mockFn).toHaveBeenCalledTimes(1);
      });

      it('should do nothing if no pending execution', () => {
        const mockFn = jest.fn();
        const debouncedFn = debounce(mockFn, 100);

        debouncedFn.flush();
        expect(mockFn).not.toHaveBeenCalled();
      });
    });

    describe('pending()', () => {
      it('should return true when execution is pending', () => {
        const mockFn = jest.fn();
        const debouncedFn = debounce(mockFn, 100);

        expect(debouncedFn.pending()).toBe(false);
        debouncedFn();
        expect(debouncedFn.pending()).toBe(true);

        jest.advanceTimersByTime(100);
        expect(debouncedFn.pending()).toBe(false);
      });

      it('should return false after cancel', () => {
        const mockFn = jest.fn();
        const debouncedFn = debounce(mockFn, 100);

        debouncedFn();
        expect(debouncedFn.pending()).toBe(true);
        debouncedFn.cancel();
        expect(debouncedFn.pending()).toBe(false);
      });

      it('should return false after flush', () => {
        const mockFn = jest.fn();
        const debouncedFn = debounce(mockFn, 100);

        debouncedFn();
        expect(debouncedFn.pending()).toBe(true);
        debouncedFn.flush();
        expect(debouncedFn.pending()).toBe(false);
      });
    });
  });

  describe('options object', () => {
    it('should accept mode via options object', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, { mode: DebounceMode.LEADING });

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should use default mode when options is empty', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, {});

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});