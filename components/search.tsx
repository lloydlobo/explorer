/* eslint-disable react/jsx-no-undef */

import React from "react";
import { useRouter } from "next/router";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCountrySearch } from "@/lib/hooks/use-country-search";
import { useCountryStore } from "@/lib/state/country-store";
import { useSearchCount } from "@/lib/hooks/use-search-count";
import { SearchResult } from "@/lib/types/types-fuse-search-result";
import { Spinner } from "@/components/spinner";
import { ICountry } from "@/lib/types/types-country";
import produce from "immer";

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
  const router = useRouter();

  const [label, setLabel] = React.useState<NonNullable<string>>("");
  const [open, setOpen] = React.useState(false);

  const {
    setSelectedCountry,
    shouldAutoFilterUiOnSearch,
    searchedCountries,
    setSearchedCountries,
  } = useCountryStore();
  const { searchResults, isLoading, error, query, setQuery } =
    useCountrySearch();

  useSearchCount({
    searchResults: searchResults ?? ([] as SearchResult[]), // TODO: can set all cached countries instead of empty array.
    query,
    setSearchCount,
  });

  React.useEffect(() => {
    if (query.length > 0) {
      setOpen(true);
    }
    return () => {
      setOpen(false);
      if (query.length === 0) {
        setSearchedCountries([]);
      }
    };
  }, [setOpen, query, setQuery, setSearchedCountries]);

  function handleInputOnChange(value: string) {
    setQuery(value);
    setLabel(value);
    setSearchedCountries(searchResults ?? []);
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <div className="mt-12">Error: {error.message}</div>;
      </div>
    );
  }

  return (
    <form action="search">
      <label htmlFor="search" className="sr-only">
        Search countries:
      </label>

      <Command>
        <CommandInput
          value={label}
          onValueChange={(search) => handleInputOnChange(search)}
          placeholder="Search a country…"
          autoFocus={true}
        />
        <CommandList hidden={!open} inputMode="search">
          <CommandEmpty>No label found.</CommandEmpty>
          <CommandGroup>
            {searchResults !== null &&
            searchResults.length > 0 &&
            query.length > 0
              ? searchResults?.map((result, idxResult) => {
                  const country = result.item;
                  const score = result.score ?? -1;
                  // HACK: If we are using useSearchCount above, why do we need to filter again?
                  // ... It reduces the count of searched results to display.
                  if (score * 100 <= 4 && score * 100 >= 0) {
                    return (
                      <CommandItem
                        key={`command-query-${country.alpha3Code}-${query}-${idxResult}`}
                        onSelect={(value) => {
                          const countryName: ICountry["name"] =
                            value.charAt(0).toUpperCase() +
                            value.slice(1, value.length);
                          setLabel(countryName); // label is aesthetic confirmation.
                          setOpen(false);
                          setSelectedCountry(country.alpha3Code);
                          router.push(`/countries/${country.alpha3Code}`);
                        }}
                      >
                        {country.name}
                      </CommandItem>
                    );
                  } else {
                    return null;
                  }
                })
              : null}
          </CommandGroup>
        </CommandList>
      </Command>
    </form>
  );
}
// React.useEffect(() => {
//   if (
//     shouldAutoFilterUiOnSearch &&
//     searchResults !== null &&
//     searchResults.length > 0 &&
//     query.length > 0
//   ) {
//     // let countries = searchResults?.filter((result, idxResult) => {
//     //   const score = result.score ?? -1;
//     //   return score * 100 <= 4 && score * 100 >= 0;
//     // });
//     setSearchedCountries(searchResults.map((country) => country.item));
//   }
//   // else {
//   //   setsearchedcountries([]); // cleanup
//   // }
//   return () => {
//     setSearchedCountries([]); // cleanup
//   };
// }, [query, searchResults, setSearchedCountries, shouldAutoFilterUiOnSearch]);
