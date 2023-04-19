import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

///////////////////////////////////////////////////////////////////////////////
// region_start: fetcher
///////////////////////////////////////////////////////////////////////////////

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
///////////////////////////////////////////////////////////////////////////////
// region_end: fetcher
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// region_start: absoluteUrl
///////////////////////////////////////////////////////////////////////////////

/**
 * Returns the absolute URL by concatenating the `process.env.NEXT_PUBLIC_APP_URL`
 * environment variable and the input path.
 *
 * @param path The path to concatenate with the base URL.
 * @returns The absolute URL.
 */
export function absoluteUrl(path: string): string {
  let parsedPath = path;

  // "about" - the resulting URL would be "https://localhost:3000/about".
  // "/about" - the resulting URL would also be "https://localhost:3000/about".
  if (parsedPath.startsWith("/")) {
    parsedPath = parsedPath.slice(1);
  }

  // Concatenate the base URL and the parsed path to create the absolute URL.
  return `${process.env.NEXT_PUBLIC_APP_URL}/${parsedPath}`;
}

///////////////////////////////////////////////////////////////////////////////
// region_end: absoluteUrl
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// region_start: copyToClipboard
///////////////////////////////////////////////////////////////////////////////

export interface CopyToClipboardOptions {
  text: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}
/**
 * Copies the specified text to the clipboard using the Clipboard API.
 * NOTE: consider using `async` if the callback `onSuccess` doesn't work.
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

///////////////////////////////////////////////////////////////////////////////
// region_end: copyToClipboard
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// region_start: formatDate
///////////////////////////////////////////////////////////////////////////////

/**
 * formatDate function accepts a string or a number as input
 * and returns a formatted date string in the format
 * "Month day, year" using the "en-US" locale.
 * It uses the toLocaleDateString method of the Date object
 * to get the formatted date string.
 */
export function formatDate(input: string | number): string {
  /* const date = new Date("2020-01-01T00:00:00.000Z"); */
  /* const result = formatDate(date); */
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

///////////////////////////////////////////////////////////////////////////////
// region_end: formatDate
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// region_start: cn
///////////////////////////////////////////////////////////////////////////////

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
 *   const className = cn( "border", "py-2", "px-4",
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

///////////////////////////////////////////////////////////////////////////////
// region_end: cn
///////////////////////////////////////////////////////////////////////////////
