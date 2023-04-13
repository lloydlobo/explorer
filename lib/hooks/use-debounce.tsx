import { useEffect, useState } from "react";

type UseDebounceParams<T> = {
  value: T;
  delay?: number;
  callback?: (value: T) => void;
};

/**
 * Returns a debounced value that updates only after a specified delay.
 *
 * # Examples
 *
 * To use the debounced value for search inputs,  replace the query state
 * variable with the debouncedValue variable in the search filter.
 * This ensures that the filter is only applied after the user has stopped
 * typing for the specified delay period.
 *
 * @param value The value to debounce.
 * @param delay The delay in milliseconds before the value is updated. Default is 500.
 * @param callback A function to execute after the debounced value has been updated.
 * @returns The debounced value.
 *
 * [See also](https://github.com/TomDoesTech/debounce-throttle/blob/main/src/hooks/useDebounce.tsx)
 */
export function useDebounce<T>({
  value,
  delay = 500,
  callback,
}: UseDebounceParams<T>): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  /*
   * The useEffect hook executes an effect after rendering and can include a
   * cleanup function that runs before the effect re-runs or the component unmounts.
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
      if (callback) {
        callback(value);
      }
    }, delay);
    /**
     * The cleanup function clears the setTimeout timer to prevent it from running unnecessarily.
     * Without the cleanup function, the timer would continue running after the component unmounts,
     * potentially causing issues like memory leaks.
     * React automatically executes the cleanup function by returning it from the effect,
     * ensuring any necessary cleanup tasks are performed.
     */
    return function cleanUp(): void {
      clearTimeout(timeoutId);
    };
  }, [value, delay, callback]);

  return debouncedValue;
}
