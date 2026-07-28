import { useEffect, useState } from "react";

/**
 * A custom hook that returns a debounced value of a given input.
 * @param value The value to debounce
 * @param delayMs The delay in milliseconds
 * @returns The debounced value
 */
 export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
