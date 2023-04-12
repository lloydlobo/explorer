import { useDebounce } from "@/lib/hooks/use-debounce";
import { useQueryAllCountries } from "@/lib/hooks/use-query-all-countries";
import { useCountryStore } from "@/lib/state/country-store";
import { ICountry } from "@/lib/types/types-country";
import Link from "next/link";
import React, { useState } from "react";

export default function Search() {
  const { setSelectedCountry } = useCountryStore();
  const [query, setQuery] = useState("");
  const { data: countries, isLoading, error } = useQueryAllCountries();

  // Returns a debounced value that updates only after a specified delay.
  const debouncedQuery: string = useDebounce({ value: query, delay: 500 });

  function handleInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const updatedQuery = e.currentTarget.value;
    setQuery(updatedQuery);
  }

  // Handle click on a country link.
  const handleCountryClick = (alpha3Code: ICountry["alpha3Code"]) => {
    setSelectedCountry(alpha3Code);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <form action="search">
      <input
        type="search"
        placeholder="Search a country…"
        value={query}
        onChange={(e) => handleInputOnChange(e)}
      />
      <div className="grid gap-2 py-4">
        {countries.map((country, idxCountry) => {
          if (
            debouncedQuery.length > 0 &&
            country.name.toLowerCase().includes(debouncedQuery.toLowerCase())
          ) {
            return (
              <Link
                key={`country-search-${country.alpha3Code}-${idxCountry}`}
                href={`/countries/${country.alpha3Code}`}
                onClick={(e) =>
                  handleCountryClick(
                    e.currentTarget.dataset.code ?? country.alpha3Code
                  )
                }
                data-code={country.alpha3Code}
              >
                {country.name}
              </Link>
            );
          } else {
            return null;
          }
        })}
      </div>
    </form>
  );
}

// formattedResults, which will hold the formatted search results. transformation logic is in formatResults,
// which takes the search results as input and returns the formatted results.
//
// - useCallback hook memoizes the formatResults function, so that it is not recreated unnecessarily on every render.
//
// - useEffect hook updates the formattedResults state whenever the searchResults state changes.
//   This ensures that the formatting logic is only executed when necessary.
//
// - no more updates to the searchResults state in this refactored version.
//   Instead, update the formattedResults state based on the searchResults state.
//   This separation of concerns makes the code easier to reason about and maintain.
//
// function handleInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
//   e.preventDefault();
//   const updatedQuery = e.currentTarget.value.toLowerCase();
//   setQuery(updatedQuery);
//   const results: ICountry[] = searchCountries(updatedQuery, index);
//
//   // Text transform the search result names based on the query
//   const transformedResults = results.map((result) => {
//     const regex = new RegExp(`(${updatedQuery})`, "gi");
//     const name = result.name.replace(regex, (match) => `<mark>${match}</mark>`);
//     return { ...result, name };
//   });
//
//   setSearchResults(transformedResults);
// }

// formattedResults, which will hold the formatted search results. transformation logic is in formatResults,
// which takes the search results as input and returns the formatted results.
//
// - useCallback hook memoizes the formatResults function, so that it is not recreated unnecessarily on every render.
//
// - useEffect hook updates the formattedResults state whenever the searchResults state changes.
//   This ensures that the formatting logic is only executed when necessary.
//
// - no more updates to the searchResults state in this refactored version.
//   Instead, update the formattedResults state based on the searchResults state.
//   This separation of concerns makes the code easier to reason about and maintain.
//
// export default function Search() {
//   const [query, setQuery] = useState("United states");
//   const [searchResults, setSearchResults] = useState([] as ICountry[]);
//   const [formattedResults, setFormattedResults] = useState([] as IFormattedCountry[]); // New state for formatted results
//
//   const { data: countries, isLoading, error } = useCountriesQuery();
//
//   // Use local variable index, which is created using React.useMemo to avoid recomputing the index unnecessarily.
//   const index: TokenIndex = React.useMemo(
//     () => (countries ? createTokenIndex(countries) : {}),
//     [countries]
//   );
//
//   function handleInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
//     // TODO: useDebounce()....
//     e.preventDefault();
//     const updatedQuery = e.currentTarget.value;
//     setQuery(updatedQuery);
//     const results: ICountry[] = searchCountries(updatedQuery, index);
//     setSearchResults(results);
//   }
//
//   // Extract the transformation logic into a separate function
//   const formatResults = useCallback((results: ICountry[]) => {
//     return results.map((country) => {
//       const name = country.name.replace(
//         new RegExp(`(${query})`, "gi"),
//         "<strong>$1</strong>"
//       );
//       const formattedCountry = {
//         ...country,
//         name: name,
//       };
//       return formattedCountry;
//     });
//   }, [query]);
//
//   useEffect(() => {
//     setFormattedResults(formatResults(searchResults));
//   }, [searchResults, formatResults]);
//
//   console.log({ formattedResults });
//
//   return (
//     <form action="search">
//       <input
//         type="search"
//         onChange={(e) => handleInputOnChange(e)}
//         placeholder="Search a country…"
//       />
//     </form>
//   );
// }
