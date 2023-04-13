import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

// async function fetcherAxios(url: string): Promise<any> {
//   try {
//     const response = await axios.get(url);
//     return response.data;
//   } catch (err) {
//     if (axios.isAxiosError(err)) { console.error("axios error", err);
//     } else { console.error("unexpected error", err); }
//   }
// }
