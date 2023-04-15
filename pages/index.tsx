import Layout from "@/components/layout";
import Search from "@/components/search";
import SelectRegion from "@/components/select-region";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/typography";
import { API_BASE_URL } from "@/lib/constants";
import { Region } from "@/lib/enums";
import { useCountrySearch } from "@/lib/hooks/use-country-search";
import { useSearchCount } from "@/lib/hooks/use-search-count";
import { useCountryStore } from "@/lib/state/country-store";
import { ICountry } from "@/lib/types/types-country";
import { SearchResult } from "@/lib/types/types-fuse-search-result";
import { cn, fetcher } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import {
  SearchIcon,
  ShieldCloseIcon,
  SidebarCloseIcon,
  XIcon,
} from "lucide-react";
import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
const GUESS_LIMIT = 5; // total six guesses. 0..=5

function rand(length: number) {
  return Math.floor(Math.random() * length);
}

// Static Site Generation feature for Next.js.
export const getStaticProps: GetStaticProps = async () => {
  const countries = await fetcher({ url: `${API_BASE_URL}/all` });
  return { props: { countries } };
};

type HomePageProps = {
  countries: ICountry[];
};
// HACK: There is no error handling if getStaticProps returns undefined.
// FIX: Use data from local storage or a json file as backup.
const HomePage: NextPage<HomePageProps> = ({ countries }: HomePageProps) => {
  const [guessCount, setGuessCount] = useState(0);

  const { selectedCountry } = useCountryStore();

  const [randomCountry, setRandomCountry] = useState<null | ICountry>(null);

  const {
    data: cachedCountries, // use default value if there's no cached data yet.
    isLoading,
    error,
  } = useQuery<ICountry[]>({
    queryKey: ["countries"],
    queryFn: () => fetcher({ url: `${API_BASE_URL}/all` }),
    initialData: countries,
  });

  useEffect(() => {
    if (cachedCountries) {
      const r = rand(cachedCountries?.length ?? 2);
      const randCountry = cachedCountries[r];
      setRandomCountry(randCountry);
    }
  }, [cachedCountries]);

  function handleInputGuess() {
    if (guessCount < GUESS_LIMIT) {
      setGuessCount((prev) => prev + 1);
      if (selectedCountry === randomCountry?.alpha3Code) {
        alert("You guessed right!");
      }
    } else {
      alert("You have guessed too many times. Please try again.");
      return;
    }
  }

  return (
    <Layout title="Home">
      <section className="gap-4 grid justify-center">
        <Heading
          color={"default"}
          fontWeight={"bold"}
          variant="h1"
          className="flex uppercase justify-center"
        >
          Guess the country
        </Heading>

        <div className="py-2">
          <div className="w-[250px] mx-auto">
            <AspectRatio ratio={16 / 9}>
              <Image
                className={cn(
                  ` rounded-md w-[250px] aspect-video object-cover`
                )}
                fill
                src={randomCountry?.flag ?? ""}
                alt={randomCountry?.name ?? ""}
              />
            </AspectRatio>
          </div>
        </div>
        <HeroSearchBar />
      </section>
    </Layout>
  );
};

export default HomePage;

export function HeroSearchBar() {
  const [guess, setGuess] = useState<ICountry["alpha3Code"]>("");
  const [guesses, setGuesses] = useState([] as typeof guess[]);

  const [searchCount, setSearchCount] = useState<number>(0);
  const { setSelectedCountry } = useCountryStore();

  const { searchResults, isLoading, error, query, setQuery } =
    useCountrySearch();

  useSearchCount({
    searchResults: searchResults ?? ([] as SearchResult[]),
    query,
    setSearchCount,
  });

  // const alpha3Code: ICountry["alpha3Code"] = e.currentTarget.dataset.code;
  function handleCountryClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    alpha3Code: ICountry["alpha3Code"]
  ) {
    e.preventDefault();
    setSelectedCountry(alpha3Code);
    setGuess(alpha3Code);
    setGuesses((prev) => {
      let arr: typeof guesses = structuredClone(prev);
      return [...arr, alpha3Code];
    });
    setQuery(""); // Reset input after a country is guessed.
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

  const styleSearchBar = cn(
    "relative z-10! flex flex-1 flex-wrap items-start justify-between"
  );

  return (
    <div className="mb-6 w-full">
      <div className={styleSearchBar}>
        <div className="flex flex-col mx-auto justify-between items-center p-4 rounded-lg border! border-gray-200 shadow-sm sm:flex-row dark:bg-gray-800 dark:border-gray-700 bg-gray-45">
          <div className="flex-shrink-0 w-full sm:flex sm:w-auto">
            <div className="relative  gap-4  flex-shrink-0 mb-4 w-full sm:mr-4 sm:mb-0 sm:w-64! lg:w-96!">
              <div className="flex absolute top-0! inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <SearchIcon
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                />
              </div>

              <form action="search" className="relative">
                <label htmlFor="search" className="sr-only">
                  Search countries:
                </label>
                <div className="overflow-y-hidden h-[300px]">
                  {searchResults !== null &&
                  searchResults.length > 0 &&
                  query.length > 1 ? (
                    <ScrollArea // className="p-4! rounded-md border max-w-fit! min-w-[350px]"
                    >
                      <div className="grid">
                        {searchResults.map((result, idxResult) => {
                          const country = result.item;
                          const score = result.score ?? -1;
                          if (score * 100 <= 4 && score * 100 >= 0) {
                            return (
                              <Button
                                key={`country-search-fuse-${country.alpha3Code}-${idxResult}`}
                                data-code={country.alpha3Code}
                                variant={"subtle"}
                                size={"sm"}
                                className="justify-start flex"
                                onClick={(e) =>
                                  handleCountryClick(e, country.alpha3Code)
                                }
                              >
                                {country.name}
                                <div
                                  aria-label="search score rank"
                                  className="sr-only"
                                >
                                  {(score * 100).toFixed(0)}
                                </div>
                              </Button>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </div>
                    </ScrollArea>
                  ) : (
                    <>
                      <div className="max-h-[300px] gap-0 w-full grid rounded-md overflow-clip">
                        {Array.from(Array(GUESS_LIMIT)).map(
                          (guess, idxGuess) => (
                            <Button
                              key={`guess-${idxGuess}`}
                              className="rounded-none"
                            >
                              <span className="sr-only">
                                Guess number: {idxGuess}{" "}
                              </span>
                              {guesses[idxGuess] ?? (
                                <span className="text-red-400">{guess}</span>
                              )}
                            </Button>
                          )
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="relative flex items-center">
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
                  <Button
                    aria-label="Clear search input"
                    onClick={() => setQuery("")}
                    variant={"ghost"}
                    size="sm"
                    className="absolute right-0 scale-[80%] opacity-50"
                  >
                    <XIcon />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${
          searchCount === 0 && "hidden"
        } text-center text-sm text-gray-600 sm:block dark:text-gray-400`}
      >
        Showing {searchCount} results.
      </div>
    </div>
  );
}
