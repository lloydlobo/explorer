import { Region } from "@/lib/enums";
import { filterCountryRegion } from "@/lib/helpers";
import { ICountry } from "@/lib/types/types-country";
import countries from "@/lib/data.json";

describe("filterCountryRegion function", () => {
  const displayedCountries: ICountry[] = countries;

  test("returns all 250 countries", () => {
    expect(displayedCountries.length).toBe(250);
  });

  test("returns all countries when the selected region is 'All'", () => {
    const selectedRegion = Region.All;
    const filteredCountries = filterCountryRegion({
      selectedRegion,
      displayedCountries,
    });
    expect(filteredCountries).toEqual(displayedCountries);
  });

  test("returns countries that match the selected region", () => {
    const selectedRegion = Region.Africa;
    const filteredCountries = filterCountryRegion({
      selectedRegion,
      displayedCountries,
    });
    expect(filteredCountries.length).toEqual(60);
  });

  test("returns an empty array if no countries match the selected region", () => {
    const selectedRegion = Region.Europe;
    const filteredCountries = filterCountryRegion({
      selectedRegion,
      displayedCountries,
    });
    expect(filteredCountries.length).toEqual(53);
  });
});
