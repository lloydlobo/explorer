/* eslint-disable react/jsx-no-undef */
import { useCountrySearch } from "@/lib/hooks/use-country-search";
import { useCountryStore } from "@/lib/state/country-store";
import { ICountry } from "@/lib/types/types-country";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { useSearchCount } from "@/lib/hooks/use-search-count";
import { SearchResult } from "@/lib/types/types-fuse-search-result";

type SearchProps = {
  setSearchCount?: React.Dispatch<React.SetStateAction<number>>;
};

/**
 * The `Search` component exports a React component that displays a search bar
 * and a list of search results based on the user's query.
 *
 * It makes use of the useCountrySearch hook to handle the search functionality
 * and the useCountryStore hook to set the selected country.
 * It also imports the ICountry type from types-country and the Link component
 * from Next.js.
 *
 * The component renders a search form that contains an input field
 * and a grid that displays the search results. When the user types a
 * query into the input field, the handleInputOnChange function is called,
 * which sets the query state using the setQuery function from the
 * useCountrySearch hook. The useCountrySearch hook then handles the
 * debouncing and searching logic.
 *
 * If the isLoading state is true, the component displays a loading message.
 * If the error state is truthy, it displays an error message.
 * Otherwise, if there are searchResults, it maps over the results and
 * creates a Link component for each country in the results.
 *
 * The handleCountryClick function sets the selected country using the
 * setSelectedCountry function from the useCountryStore hook.
 *
 * The aria-label attribute of the div element containing the search score rank
 * is used to provide an accessibility label for screen readers.
 */
export default function Search({ setSearchCount }: SearchProps) {
  const { setSelectedCountry } = useCountryStore();

  const { searchResults, isLoading, error, query, setQuery } =
    useCountrySearch();

  useSearchCount({ searchResults: searchResults ?? []as SearchResult[], query, setSearchCount });

  function handleCountryClick(alpha3Code: ICountry["alpha3Code"]) {
    setSelectedCountry(alpha3Code);
  }

  function handleInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const updatedQuery: string = e.currentTarget.value;
    setQuery(updatedQuery);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <form action="search">
      <label htmlFor="search" className="sr-only">
        Search countries:
      </label>
      <Input
        type="search"
        placeholder="Search a country…"
        autoFocus={true}
        onChange={(e) => handleInputOnChange(e)}
        className={cn(
          "min-w-[60vw] md:min-w-[45vw]" +
            "block! p-2.5 py-2 pl-10 w-full! text-sm text-gray-900 bg-white rounded-lg border border-gray-300 dark:placeholder-gray-400 dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        )}
      />
      {searchResults !== null &&
      searchResults.length > 0 &&
      query.length > 0 ? (
        <ScrollArea className="p-4 rounded-md border h-[200px] max-w-fit min-w-[350px]">
          <div className="grid">
            {searchResults.map((result, idxResult) => {
              const country = result.item;
              const score = result.score ?? -1;
              if (score * 100 <= 4 && score * 100 >= 0) {
                return (
                  <Link
                    key={`country-search-fuse-${country.alpha3Code}-${idxResult}`}
                    href={`/countries/${country.alpha3Code}`}
                    data-code={country.alpha3Code}
                    onClick={(e) =>
                      handleCountryClick(
                        e.currentTarget.dataset.code ?? country.alpha3Code
                      )
                    }
                  >
                    {country.name}
                    <div aria-label="search score rank" className="sr-only">
                      {(score * 100).toFixed(0)}
                    </div>
                  </Link>
                );
              } else {
                return null;
              }
            })}
          </div>
        </ScrollArea>
      ) : null}
    </form>
  );
}

// import React, { useState } from "react";
// import Link from "next/link";
//
// import Fuse from "fuse.js";
//
// import { useDebounce } from "@/lib/hooks/use-debounce";
// import { useQueryAllCountries } from "@/lib/hooks/use-query-all-countries";
// import { useCountryStore } from "@/lib/state/country-store";
// import { ICountry } from "@/lib/types/types-country";
//
//   // Handle click on a country link to select active country.
//   // isCaseSensitive: false, shouldSort: true, includeMatches: false, findAllMatches: false,
//   // location: 0, threshold: 0.6, distance: 100, useExtendedSearch: false, ignoreLocation: false, ignoreFieldNorm: false, fieldNormWeight: 1,
//   // Call `searchCountries` with debounced query value.
// export default function Search() {
//   const { setSelectedCountry } = useCountryStore();
//
//   const [query, setQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<
//     Fuse.FuseResult<ICountry>[] | null
//   >(null);
//
//   const { data: countries, isLoading, error } = useQueryAllCountries();
//   const debouncedQuery: string = useDebounce({ value: query, delay: 300 }); // Returns a debounced value that updates only after a specified delay.
//
//   function handleCountryClick(alpha3Code: ICountry["alpha3Code"]) {
//     setSelectedCountry(alpha3Code);
//   }
//
//   function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
//     e.preventDefault();
//     const updatedQuery: string = e.currentTarget.value;
//     setQuery(updatedQuery); // searchCountries(updatedQuery);
//   }
//
//   function searchCountries(updatedQuery: string) {
//     if (countries) {
//       const keys: string[] = Object.keys(countries[0]);
//       const options = { includeScore: true, minMatchCharLength: 2, keys: keys };
//       const fuse = new Fuse(countries, options);
//       const result = fuse.search(updatedQuery);
//       setSearchResults(result);
//     }
//   }
//
//   useDebounce({ value: debouncedQuery, delay: 300, callback: searchCountries });
//
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }
//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }
//   return (
//     <form action="search">
//       <input
//         type="search"
//         placeholder="Search a country…"
//         autoFocus={true}
//         value={query}
//         onChange={(e) => handleInputChange(e)}
//       />
//
//       <div className="grid">
//         {debouncedQuery.length > 0 &&
//           searchResults &&
//           searchResults.map((result, idxResult) => {
//             const country = result.item;
//             const score = result.score ?? -1;
//             if (score * 100 <= 4 && score * 100 >= 0) {
//               return (
//                 <Link
//                   key={`country-search-fuse-${country.alpha3Code}-${idxResult}`}
//                   href={`/countries/${country.alpha3Code}`}
//                   onClick={(e) =>
//                     handleCountryClick(
//                       e.currentTarget.dataset.code ?? country.alpha3Code
//                     )
//                   }
//                   data-code={country.alpha3Code}
//                 >
//                   {country.name}
//                   <div aria-label="search score rank" className="sr-only">
//                     {(score * 100).toFixed(0)}
//                   </div>
//                 </Link>
//               );
//             } else {
//               return null;
//             }
//           })}
//       </div>
//     </form>
//   );
// }

// function SimpleResults() {
//   return (
//     <div className="hidden gap-2 py-4 disabled:grid">
//       {countries.map((country, idxCountry) => {
//         if (
//           debouncedQuery.length > 0 &&
//           country.name.toLowerCase().includes(debouncedQuery.toLowerCase())
//         ) {
//           return (
//             <Link
//               key={`country-search-${country.alpha3Code}-${idxCountry}`}
//               href={`/countries/${country.alpha3Code}`}
//               onClick={(e) =>
//                 handleCountryClick(
//                   e.currentTarget.dataset.code ?? country.alpha3Code
//                 )
//               }
//               data-code={country.alpha3Code}
//             >
//               {country.name}
//             </Link>
//           );
//         } else {
//           return null;
//         }
//       })}
//     </div>
//   );
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
