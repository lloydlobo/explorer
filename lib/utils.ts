import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * `cn` merges class names using the `clsx` and `tailwind-merge` utilities.
 *
 * @remarks
 * The `cn` function simplifies the process of merging class names
 * by taking in an array of `ClassValue` inputs, which can be a string,
 * an array of strings, or an object with keys representing class names
 * and values representing boolean values to determine whether to include
 * the class name in the output.
 *
 * Internally, the function first calls `clsx` to merge the input
 * class names into a single string, and then passes the result to
 * `twMerge` to merge the Tailwind classes into the string.
 *
 * The final output is a string of class names that
 * can be applied to an HTML element.
 *
 * @example
 * ```
 * // Merge class names for a button element
 * import { cn } from "./utils";
 *
 * const Button = ({ variant }) => {
 *   const className = cn(
 *     "border",
 *     "py-2",
 *     "px-4",
 *     { "bg-blue-500": variant === "primary" },
 *     { "bg-gray-500": variant === "secondary" },
 *   );
 *
 *   return <button className={className}>Click me</button>;
 * };
 * ```
 *
 * @param inputs - An array of `ClassValue` inputs.
 * @returns The merged string of class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// onSuccess = () => { },
// onError = (err: Error) => { throw err; },
export interface CopyToClipboardOptions {
  text: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}
/**
 * Copies the specified text to the clipboard using the Clipboard API.
 *
 * @param text The text to copy to the clipboard.
 * @param onSuccess An optional callback that will be called if the text is successfully copied to the clipboard.
 * @param onError An optional callback that will be called if there is an error copying the text to the clipboard.
 *                If not provided, any errors will be re-thrown.
 *
 * # Examples
 *
 * ```typescript
 * copyToClipboard({
 *   text: 'Hello, world!',
 *   onSuccess: () => { console.log('Text copied successfully!'); },
 *   onError: (error: Error) => { console.error('Failed to copy text:', error); }
 * });
 * ```
 */
export function copyToClipboard({
  text,
  onSuccess,
  onError,
}: CopyToClipboardOptions): void {
  navigator.clipboard.writeText(text).then(onSuccess).catch(onError);
}

// export function copyToClipboard(options: CopyToClipboardOptions): void {
//   const {
//     text,
//     onSuccess = () => { },
//     onError = (error: Error) => {
//       throw error;
//     },
//   } = options;
//   navigator.clipboard.writeText(text).then(onSuccess).catch(onError);
// }

/**
 * `fetcher` fetches data from the given URL and returns it as JSON.
 *
 * @param options - An object containing the URL to fetch.
 * @returns A promise that resolves to the fetched JSON data.
 * @throws If the fetch request fails or the response is not valid JSON.
 */
export async function fetcher<T>(options: {
  url: RequestInfo | URL;
  // }): Promise<T | Error> {
}): Promise<T> {
  try {
    const response = await fetch(options.url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const json = (await response.json()) as T;
    return json;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to fetch data from ${options.url}: ${error.message}`
      );
    }
    throw new Error(
      `Unexpected error while fetching data from ${options.url}: ${String(
        error
      )}`
    );
  }
}

