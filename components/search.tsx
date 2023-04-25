/* eslint-disable react/jsx-no-undef */

import { Spinner } from "@/components/spinner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCountrySearch } from "@/lib/hooks/use-country-search";
import { useSearchCount } from "@/lib/hooks/use-search-count";
import { useCountryStore } from "@/lib/state/country-store";
import { ICountry } from "@/lib/types/types-country";
import { SearchResult } from "@/lib/types/types-fuse-search-result";
import { useRouter } from "next/router";
import React from "react";

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
  const [isOpen, setIsOpen] = React.useState(false);

  const { setSelectedCountry, setSearchedCountries } = useCountryStore();
  const { searchResults, isLoading, error, query, setQuery } =
    useCountrySearch();

  useSearchCount({
    searchResults: searchResults ?? ([] as SearchResult[]), // TODO: can set all cached countries instead of empty array.
    query,
    setSearchCount,
  });

  React.useEffect(() => {
    // we reset label when search input is blurred of not in focus, to bypass this useEffect.
    // And so when input is back in focus, it sets label to the query value.
    if (label.length > 0) {
      setIsOpen(true); // keep dropdown open while label is present.
    }
    return () => {
      setIsOpen(false);
      if (query.length === 0) {
        setSearchedCountries([]);
      }
    };
  }, [setIsOpen, label.length, query.length, setQuery, setSearchedCountries]);

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
          placeholder={query.length > 0 ? query : "Search a country…"}
          autoFocus={true}
          role="search"
          // FIXME: Clicking on CommandGroup dropdown, triggers this and doesn't navigate to the page.
          // onBlur={(e) => {
          //   setIsOpen(false);
          //   setLabel("");
          // }}
          // onFocus={(e) => {
          //   setLabel(query);
          // }}
        />
        <CommandList
          hidden={!isOpen}
          inputMode="search"
          className="absolute bg-background/75 backdrop-blur-md top-12 w-[27ch]"
        >
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
                        // onClick={(e) => {
                        //   setIsOpen(false);
                        //   setSelectedCountry(country.alpha3Code);
                        //   router.push(`/countries/${country.alpha3Code}`);
                        // }}
                        onSelect={(value) => {
                          const countryName: ICountry["name"] =
                            value.charAt(0).toUpperCase() +
                            value.slice(1, value.length);
                          setLabel(countryName); // label is aesthetic confirmation.
                          setIsOpen(false);
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
