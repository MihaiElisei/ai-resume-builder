import { useEffect, useState } from "react";

/**
 * A custom React hook to debounce a value. It delays updating the value until after a specified delay period.
 * Useful for scenarios like debouncing search inputs or API calls.
 * 
 * @template T
 * @param {T} value - The value to debounce.
 * @param {number} delay - The debounce delay in milliseconds. Defaults to 250ms.
 * @returns {T} - The debounced value.
 */
export default function useDepounce<T>(value: T, delay: number = 250) {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear the timer when the value or delay changes
    return () => clearTimeout(handler);
  }, [value, delay]); // Dependency array ensures the effect runs when `value` or `delay` changes.

  // Return the debounced value to the caller
  return debouncedValue;
}