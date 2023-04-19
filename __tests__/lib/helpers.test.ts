import countries from "@/lib/data.json";
import { Region, ViewType } from "@/lib/enums";
import {
  InvalidViewTypeError,
  filterCountryRegion,
  getViewType,
} from "@/lib/helpers";
import type { ICountry } from "@/lib/types/types-country";

///////////////////////////////////////////////////////////////////////////////
// region_start: filterCountryRegion
///////////////////////////////////////////////////////////////////////////////

describe("filterCountryRegion helper function", () => {
  const displayedCountries: ICountry[] = countries;

  describe('when selected region is "All"', () => {
    const selectedRegion = Region.All;

    test("returns all countries", () => {
      const filteredCountries = filterCountryRegion({
        selectedRegion,
        displayedCountries,
      });

      expect(filteredCountries).toEqual(displayedCountries);
    });
  });

  describe("when selected region is a valid region", () => {
    test("returns countries that match the selected region", () => {
      const selectedRegion = Region.Africa;
      const filteredCountries = filterCountryRegion({
        selectedRegion,
        displayedCountries,
      });

      expect(filteredCountries.length).toEqual(60);
    });
  });

  describe("when selected region does not match any countries", () => {
    test("returns an empty array", () => {
      const selectedRegion = Region.Europe;
      const filteredCountries = filterCountryRegion({
        selectedRegion,
        displayedCountries,
      });

      expect(filteredCountries.length).toEqual(53);
    });
  });

  describe("when no countries are passed", () => {
    test("returns an empty array", () => {
      const selectedRegion = Region.Africa;
      const filteredCountries = filterCountryRegion({
        selectedRegion,
        displayedCountries: [],
      });

      expect(filteredCountries.length).toEqual(0);
    });
  });

  describe("when selected region is not a valid region", () => {
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

    test("throws an error", () => {
      expect(() =>
        filterCountryRegion({
          selectedRegion: "asdasd" as Region,
          displayedCountries,
        })
      ).toThrowError(expectedError); // ).toThrowErrorMatchingInlineSnapshot(expectedError);
    });
  });

  describe("when selected region parameter is not a string", () => {
    test("throws an error", () => {
      expect(() =>
        filterCountryRegion({
          selectedRegion: true as unknown as Region,
          displayedCountries,
        })
      ).toThrowError(expect.any(Error));

      expect(() =>
        filterCountryRegion({
          selectedRegion: true as unknown as Region,
          displayedCountries,
        })
      ).toThrowError(
        new Error("selectedRegionInput.toLowerCase is not a function", {
          cause: "TypeError",
        })
      );
    });
  });
});

///////////////////////////////////////////////////////////////////////////////
// region_end: filterCountryRegion
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// region_start: getViewType
///////////////////////////////////////////////////////////////////////////////

describe("getViewType helper function", () => {
  test("returns `ViewType.Cards` for `default`", () => {
    expect(getViewType(ViewType.Default)).toEqual(ViewType.Cards);
  });

  test("returns `ViewType.Cards` for `cards`", () => {
    expect(getViewType(ViewType.Cards)).toEqual(ViewType.Cards);
  });

  test("returns `ViewType.Table` for `table`", () => {
    expect(getViewType(ViewType.Table)).toBe(ViewType.Table);
  });

  describe("when given an invalid value", () => {
    const values = [
      "card" as ViewType,
      "tables" as ViewType,
      "defaul" as ViewType,
      true as unknown as ViewType,
      123 as unknown as ViewType,
    ];

    for (const value of values) {
      test(`throws an error for invalid value '${value}'`, () => {
        expect(() => getViewType(value)).toThrowError(
          new InvalidViewTypeError(value).message
        );
      });
    }
  });
});

///////////////////////////////////////////////////////////////////////////////
// region_end: getViewType
///////////////////////////////////////////////////////////////////////////////
