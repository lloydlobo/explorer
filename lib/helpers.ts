import { Region } from "@/lib/enums";
import { ICountry } from "@/lib/types/types-country";
import * as z from "zod";

/**
 * Zod schema for validating the selected region.
 */
const selectedRegionSchema = z.enum(["all", ...Object.values(Region)]);

/**
 * Defines the parameters for the `filterCountryRegion` function.
 */
type FilterCountryRegionParams<T> = {
  /** The selected region to filter the countries by. */
  selectedRegion: Region;
  /** The array of countries to filter. */
  displayedCountries: T[];
};

/**
 * Filters an array of countries based on a selected region.
 *
 * @param {FilterCountryRegionParams<T>} params - The parameters for the function.
 * @returns {T[]} - An array of countries that match the selected region, or all countries if the region is set to "All".
 */
export function filterCountryRegion<T extends ICountry>({
  selectedRegion: selectedRegionInput,
  displayedCountries,
}: FilterCountryRegionParams<T>): T[] {
  // Validate the selected region using the Zod schema
  const selectedRegion = selectedRegionSchema.parse(
    selectedRegionInput.toLowerCase()
  );

  // Return all countries if the selected region is "all".
  if (selectedRegion === Region.All.toLowerCase()) {
    return displayedCountries;
  }

  // Filter the countries by the selected region.
  return displayedCountries.filter(
    (country) => country.region.toLowerCase() === selectedRegion
  );
}
