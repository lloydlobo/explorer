import { Region, ViewType } from "@/lib/enums";
import { ICountry } from "@/lib/types/types-country";
import * as z from "zod";

/**
 * Zod schema for validating the selected region.
 */
// const selectedRegionSchema = z.enum(["all", ...Object.values(Region)]);
// https://zod.dev/?id=native-enums
const selectedRegionSchema = z.nativeEnum(Region); // type RegionEnum = z.infer<typeof selectedRegionSchema>;

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
  if (displayedCountries.length === 0) {
    return [];
  }

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

/**
 * Returns the corresponding ViewType for the given value.
 *
 * @param value - The value to convert to a ViewType.
 * @returns The ViewType corresponding to the given value.
 * @throws Error if the given value is not a valid ViewType.
 *
 * @example
 * ```
 * const viewType = getViewType("Cards"); // Returns ViewType.Cards
 * const viewType = getViewType("Default"); // Returns ViewType.Cards
 * ```
 */
export function getViewType(value: ViewType): ViewType {
  switch (value) {
    case ViewType.Default:
    case ViewType.Cards: {
      return ViewType.Cards;
    }
    case ViewType.Table: {
      return ViewType.Table;
    }
    default: {
      throw new InvalidViewTypeError(value);
    }
  }
}

// To provide more useful error messages for invalid input in the handleSelectView function,
// we can use a custom error class that extends the built-in Error class.
// This custom error class can take the invalid value as a parameter and construct a more detailed error message that includes the invalid value and the expected values.
export class InvalidViewTypeError extends Error {
  constructor(value: string) {
    super(`Invalid value '${value}' supplied to 'handleSelectView'.
Value must be one of '${ViewType.Cards}', '${ViewType.Table}', or '${ViewType.Default}'.`);
  }
}
