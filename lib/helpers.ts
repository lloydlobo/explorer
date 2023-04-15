import { Region } from "@/lib/enums";
import { ICountry } from "@/lib/types/types-country";

type TFilterCountryRegion<T> = {
  selectedRegion: Region;
  displayedCountries: T[];
};

/**
 * Filters an array of countries based on a selected region.
 *
 * @param selectedRegion - The selected region to filter the countries by.
 * @param displayedCountries - The array of countries to filter.
 * @returns An array of countries that match the selected region, or all countries if the region is set to "All".
 */
export function filterCountryRegion<T extends ICountry>({
  selectedRegion,
  displayedCountries,
}: TFilterCountryRegion<T>): T[] {
  if (selectedRegion === Region.All) {
    return displayedCountries;
  }

  return displayedCountries?.filter(
    (country) => country.region === selectedRegion
  );
}
