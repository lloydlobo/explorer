import { useQueryAllCountries } from "@/lib/hooks/use-query-all-countries";
import { ICountry } from "@/lib/types/types-country";
import { useState } from "react";

/**
 * An index of country objects that maps lowercase tokens to the countries that contain those tokens.
 * The keys of the index are the lowercase tokens, and the values are arrays of country objects.
 */
interface TokenIndex {
  [token: string]: ICountry[];
}

/**
 * Utility function to convert a value to its string representation.
 * If the value is a string, it is converted to lowercase.
 * If the value is a number, it is converted to a string.
 * If the value is any other type, it is converted to a JSON string.
 */
function convertToString(value: any): string {
  if (typeof value === "string") {
    return value.toLowerCase();
  } else if (typeof value === "number") {
    return value.toString();
  }
  return JSON.stringify(value);
}

/**
 * Tokenizes a country object into an array of lowercase tokens based on a set of configurable fields.
 * @param country - The country object to tokenize.
 * @returns An array of lowercase tokens.
 */
function tokenizeCountry(country: ICountry): string[] {
  const TOKENIZABLE_FIELDS: (keyof ICountry)[] = [
    "name",
    "capital",
    "region",
    "alpha2Code",
    "alpha3Code",
    "nativeName",
    "languages",
  ];
  const tokens: string[] = [];
  for (const field of TOKENIZABLE_FIELDS) {
    const fieldValue = country[field];
    if (fieldValue !== undefined && fieldValue !== null) {
      const fieldTokens: string[] = convertToString(fieldValue).split(" ");
      tokens.push(...fieldTokens);
    }
  }
  return tokens;
}

/**
 * Tokenizes a string into an array of lowercase tokens.
 * @param str - The string to tokenize.
 * @returns An array of lowercase tokens.
 */
function tokenize(str: string): string[] {
  return str.toLowerCase().split(" ");
}

/**
 * Creates an index of countries based on their lowercase tokens.
 * @param countries - The array of countries to index.
 * @returns An object whose keys are the lowercase tokens and whose values are arrays of country objects.
 */
function createTokenIndex(countries: ICountry[]): TokenIndex {
  const index: TokenIndex = {};
  for (const country of countries) {
    const tokensCountry = tokenizeCountry(country);
    for (const token of tokensCountry) {
      if (!(token in index)) {
        index[token] = [country];
      } else {
        index[token].push(country);
      }
    }
  }
  return index;
}

/**
 * Searches an index of countries for those that contain all of the given lowercase tokens.
 * @param query - The search query, a string of lowercase tokens separated by spaces.
 * @param index - The index of countries to search.
 * @returns An array of country objects that contain all of the given lowercase tokens.
 */
function searchCountries(query: string, index: TokenIndex): ICountry[] {
  const queryTokens: string[] = tokenize(query);
  let results: ICountry[] = [];
  for (const token of queryTokens) {
    const tokenResults: ICountry[] = index[token] || [];
    results = [...results, ...tokenResults];
  }
  const uniqueResults: ICountry[] = Array.from(new Set(results));
  return uniqueResults;
}

/**
 * A hook that provides a search query, a function to update the search query, and an array of filtered country objects.
 * The country objects are filtered based on a search query that matches all of the given tokens in the object's name, capital, region, alpha2Code, alpha3Code, nativeName, and languages fields.
 * @returns An object containing the search query, setQuery function, and filtered country objects array.
 */
function useCountrySearch() {
  const { data: countries } = useQueryAllCountries();
  const [query, setQuery] = useState("");

  const index = countries ? createTokenIndex(countries) : {};

  const filteredCountries = countries ? searchCountries(query, index) : [];

  return { query, setQuery, filteredCountries };
}

export default useCountrySearch;
