import { SearchResult } from "@/lib/types/types-fuse-search-result";
import Fuse from "fuse.js";
import { useState } from "react";
import { useDebounce } from "./use-debounce";
import { useQueryAllCountries } from "./use-query-all-countries";

interface SearchResults {
  searchResults: SearchResult[] | null;
  isLoading: boolean;
  error: Error | null;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * `useCountrySearch` is a custom hook that provides search functionality for countries based on a query string.
 * Uses the useQueryAllCountries hook to fetch country data from the API and Fuse.js to perform the search.
 *
 * @returns An object containing the search results, loading state, error state, and a function to update the search query.
 */
export function useCountrySearch(): SearchResults {
  const { data: countries, isLoading, error } = useQueryAllCountries();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NonNullable<
    SearchResult[]
  > | null>(null);

  const debouncedQuery = useDebounce<string>({ value: query, delay: 300 });

  /**
   * Search for countries using Fuse.js based on the given query.
   * @param {string} updatedQuery - The query to search with.
   * @returns {void}
   */
  function searchCountries(updatedQuery: string): void {
    // Check if countries data is available and is not undefined.
    if (countries) {
      const keys: string[] = Object.keys(countries[0]); // Get the keys of the first country object to set them as Fuse.js search keys.
      const options = { includeScore: true, minMatchCharLength: 2, keys: keys }; // Set Fuse.js options object.
      const fuse = new Fuse(countries, options); // Create new instance of Fuse with countries data and options.
      const result = fuse.search(updatedQuery); // Search for countries based on the given query.
      setSearchResults(result); // Update the state with the search results.
    }
  }

  useDebounce({ value: debouncedQuery, delay: 300, callback: searchCountries });

  return { searchResults, isLoading, error, query, setQuery };
}
