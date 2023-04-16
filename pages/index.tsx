import { AccordianGuesses } from "@/components/accordion-guesses";
import Layout from "@/components/layout";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/typography";
import { API_BASE_URL } from "@/lib/constants";
import { useCountrySearch } from "@/lib/hooks/use-country-search";
import { useSearchCount } from "@/lib/hooks/use-search-count";
import { useCountryStore } from "@/lib/state/country-store";
import { gameGuessStateAtom, gameStateAtom } from "@/lib/state/game-store";
import { ICountry } from "@/lib/types/types-country";
import { SearchResult } from "@/lib/types/types-fuse-search-result";
import { cn, fetcher } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import produce from "immer";
import { useAtom } from "jotai";
import { SearchIcon } from "lucide-react";
import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
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
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [gameGuessState, setGameGuessState] = useAtom(gameGuessStateAtom);

  const [randomCountry, setRandomCountry] = useState<null | ICountry>(null);
  const [cache, setCache] = useState<string[]>([]);

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
      setGameGuessState(
        produce((draft) => {
          draft.answer = randCountry;
        })
      );
    }
  }, [cachedCountries]);

  useEffect(() => {
    if (selectedCountry === gameGuessState.answer?.alpha3Code) {
      alert("You guessed right!");
    }
    // if (selectedCountry === randomCountry?.alpha3Code) {
    //   alert("You guessed right!");
    // }

    // setCache((prev) => {
    //   if (prev[cache.length] !== selectedCountry && selectedCountry !== null) {
    //     return [...prev, selectedCountry];
    //   }
    //   return [...prev];
    // });

    // if (cache !== null && cache.length === GUESS_LIMIT) {
    //   alert("You have guessed too many times. Please try again.");
    // }

    // function handleInputGuess() {
    //   if (guessCount < GUESS_LIMIT) {
    //     setGuessCount((prev) => prev + 1);
    //     if (selectedCountry === randomCountry?.alpha3Code) {
    //       alert("You guessed right!");
    //     }
    //   }
    //   if (guessCount === GUESS_LIMIT) {
    //     alert(
    //       JSON.stringify([
    //         GUESS_LIMIT,
    //         guessCount,
    //         "You have guessed too many times. Please try again.",
    //       ])
    //     );
    //   }
    // }
    // handleInputGuess();
  }, [guessCount, cache, randomCountry, selectedCountry]);

  return (
    <Layout title="Home">
      <section className="grid gap-4 justify-center">
        <Heading
          color={"default"}
          fontWeight={"bold"}
          variant="h1"
          className="flex justify-center uppercase"
        >
          Guess the country
        </Heading>

        <div className="py-2">
          <div className="mx-auto w-[250px]">
            <AspectRatio ratio={16 / 9}>
              <Image
                className={cn(
                  ` rounded-md  shadow w-[250px] aspect-video object-cover`
                )}
                fill
                src={randomCountry?.flag ?? ""}
                alt={randomCountry?.name ?? ""}
              />
            </AspectRatio>
            {randomCountry?.name ?? ""}
          </div>
        </div>

        <>
          <HeroSearchBar />
        </>
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

  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [gameGuessState, setGameGuessState] = useAtom(gameGuessStateAtom);

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
              <>
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
                                  className="flex justify-start"
                                  onClick={(
                                    e: React.MouseEvent<
                                      HTMLButtonElement,
                                      MouseEvent
                                    >
                                  ) => {
                                    e.preventDefault();
                                    handleCountryClick(e, country.alpha3Code);
                                  }}
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
                        <div className="grid gap-0 w-full text-sm rounded-md max-h-[300px] overflow-clip">
                          <AccordianGuesses
                            guessLimit={GUESS_LIMIT}
                            guesses={guesses}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex relative items-center">
                    <div className="flex absolute top-0! inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <SearchIcon
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      />
                    </div>
                    <Input
                      type="search"
                      placeholder="Search a country…"
                      value={query}
                      // NOTE: check for off-by-one error here.
                      // TODO: Disable selecting a country which has occured before.
                      disabled={guesses.length === GUESS_LIMIT}
                      autoFocus={true}
                      // onBlur={() => setQuery("")}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        // e.preventDefault();
                        handleInputOnChange(e);
                      }}
                      className={cn(
                        "min-w-[60vw] md:min-w-[45vw]" +
                          "block! p-2.5 py-2 pl-10 w-full! text-sm text-gray-900 bg-white rounded-lg border border-gray-300 dark:placeholder-gray-400 dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      )}
                    />
                  </div>
                </form>
              </>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${
          searchCount === 0 && guesses.length === 0 && "hidden"
        } text-center text-sm text-gray-600 dark:text-gray-400`}
      >
        Showing {searchCount} results.
      </div>
    </div>
  );
}
