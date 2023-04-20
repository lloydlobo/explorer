import { API_BASE_URL } from "@/lib/constants";
import { QueryKey } from "@/lib/enums";
import { ICountry } from "@/lib/types/types-country";
import { fetcher } from "@/lib/utils";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches all countries from the API.
 * @returns The list of countries.
 * @throws An error if the API call fails.
 *
 * NOTE: `useQueryResult` is a generic interface from the `@tanstack/react-query`
 *   library that defines the shape of the result object returned by the useQuery hook.
 *   It contains properties such as `isLoading`, `data`, `error`, and more.
 */
export function useQueryAllCountries(): UseQueryResult<ICountry[], Error> {
  return useQuery<ICountry[], Error>({
    queryKey: [QueryKey.Countries],
    queryFn: async () => {
      const response = await fetcher<ICountry[]>({
        url: `${API_BASE_URL}/all`,
      });
      return response;
    },
  });
}
