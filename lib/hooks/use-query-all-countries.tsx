import { useQuery } from "@tanstack/react-query";
import { ICountry } from "@/lib/types/types-country";
import { API_BASE_URL } from "@/lib/constants";
import { fetcher } from "@/lib/utils";

export function useQueryAllCountries() {
  return useQuery<ICountry[], Error>({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await fetcher<ICountry[]>({
        url: `${API_BASE_URL}/all`,
      });
      return response;
    },
  });
}
