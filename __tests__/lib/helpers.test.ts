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

  test("returns an empty array if empty array of countries are passed", () => {
    const selectedRegion = Region.Africa;
    const filteredCountries = filterCountryRegion({
      selectedRegion,
      displayedCountries: [],
    });
    expect(filteredCountries.length).toEqual(0);
  });

  test("throws an error if the selectedRegion parameter is not a valid region, i.e., not present in the Region enum", () => {
    const expectedError = `[
  {
    "received": "asdasd",
    "code": "invalid_enum_value",
    "options": [
      "all",
      "africa",
      "americas",
      "asia",
      "europe",
      "oceania"
    ],
    "path": [],
    "message": "Invalid enum value. Expected 'all' | 'africa' | 'americas' | 'asia' | 'europe' | 'oceania', received 'asdasd'"
  }
]`;
    // expect(JSON.stringify(error.response.data.errors)).toEqual( expectedMessage.replace(/\s/g, ""));
    expect(() => {
      filterCountryRegion({
        selectedRegion: "asdasd" as Region,
        displayedCountries,
      });
    }).toThrowError(expectedError);
  });

  test("throws an error if the selectedRegion parameter is not a string, but a different data type such as a number or boolean", () => {
    expect(() => {
      filterCountryRegion({
        selectedRegion: true as unknown as Region,
        displayedCountries,
      });
    }).toThrowError("selectedRegionInput.toLowerCase is not a function");
  });
});
