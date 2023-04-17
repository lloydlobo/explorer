import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/typography";
import { useToast } from "@/lib/hooks/ui/use-toast";
import { useCountrySearch } from "@/lib/hooks/use-country-search";
import { ICountry } from "@/lib/types/types-country";
import { SearchResult } from "@/lib/types/types-fuse-search-result";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import produce from "immer";
import { atom, useAtom } from "jotai";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { encode } from "punycode";
import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { AccordianGuesses } from "./accordion-guesses";

const MAX_TRIES = 6;

/** `GameState` enum defines the possible states of the game.
 *
 * @enum {number} */
enum GameState {
  Running,
  Won,
  Lost,
  Canceled,
}

/** `gameStateAtom` is the global state of the game. */
// PrimitiveAtom  is a type of atom that can only be set and read from outside the component.
const gameStateAtom = atom({
  countries: [] as ICountry[],
  triesRemaining: MAX_TRIES,
  selectedCountry: {} as ICountry | null,
  guessedCountries: new Set<ICountry["alpha3Code"]>(), // or just collect country.
  state: GameState.Running,
});

// TODO: Add local support:
// useEffect(() => {
//   const fetchData = async () => {
//     const { countries } = await import("@/lib/data/countries.json");
//     setGameState((state) => produce(state, (draft) => { draft.countries = countries; }));
//   };
//
//   fetchData();
// }, []);

/** `FlagGuessingGame` component renders the flag guessing game.
 *
 * @returns {JSX.Element}
 */
function FlagGuessingGame(): JSX.Element {
  const [guess, setGuess] = useState<ICountry["alpha3Code"]>("");
  const selectRef = useRef<null | HTMLSelectElement>(null);

  const { toast, dismiss } = useToast();

  const [gameState, setGameState] = useAtom(gameStateAtom);

  const { searchResults, isLoading, error, query, setQuery } =
    useCountrySearch();

  // useEffect(() => {
  //   const shouldFocus = false; // Set to true to test.
  //   if ( shouldFocus && searchResults !== null && query.length > 1 && searchResults.length > 0 && selectRef.current) {
  //     selectRef.current.focus();
  //     selectRef.current.click();
  //   }
  // }, [searchResults]);

  /////////////////////////////////////////////////////////////////////////////
  // REGION_START: GAME LOGIC
  /////////////////////////////////////////////////////////////////////////////

  // Select a random countryfrom the list of countries.
  function selectRandomCountry() {
    const randomCountry =
      gameState.countries[
        Math.floor(Math.random() * gameState.countries.length)
      ];
    setGameState(
      produce((draft) => {
        draft.selectedCountry = randomCountry;
      })
    );
  } // NOTE: The state must be manually updated before this component is rendered.

  // Check if the guessed country matches the selected country.
  function checkGuessCountry() {
    const guessedCountry = guess.trim().toLowerCase();
    if (guessedCountry === "") {
      toast({
        title: "Please enter a country name",
      });
      return;
    }
    const selectedCountry = gameState.selectedCountry?.name
      .trim()
      .toLowerCase();
    if (guessedCountry === selectedCountry) {
      setGameState(
        produce((draft) => {
          draft.state = GameState.Won;
        })
      );

      toast({ title: "You won!" });

      resetGame();
    } else {
      // Get an instance of guessedCountries and allocate/add new guessedCountry.
      const guessedCountrySet = new Set<string>(gameState.guessedCountries);
      guessedCountrySet.add(guessedCountry);
      const triesRemaining = gameState.triesRemaining - 1;
      if (triesRemaining === 0) {
        setGameState(
          produce((draft) => {
            draft.state = GameState.Lost;
            draft.triesRemaining = triesRemaining;
            draft.guessedCountries = guessedCountrySet;
          })
        );

        toast({ title: "You lost!" });

        resetGame();
      } else {
        setGameState(
          produce((draft) => {
            draft.triesRemaining = triesRemaining;
            draft.guessedCountries = guessedCountrySet;
          })
        );
      }
    }

    setGuess(""); // Reset the guess.
  } // end of selectRandomCountry.

  function processTurnAndClear() {
    checkGuessCountry();
    setQuery("");
    setGuess("");
  }

  // Reset the game.
  function resetGame(timeout: number = 5000) {
    setTimeout(() => {
      toast({ title: "Resetting game…", duration: 4000 });
      setGameState(
        produce((draft) => {
          draft.triesRemaining = MAX_TRIES;
          draft.guessedCountries = new Set<string>();
          draft.state = GameState.Running;
        })
      );

      selectRandomCountry();

      toast({ title: "Game reset", duration: 1000 });
    }, timeout);
  }

  /////////////////////////////////////////////////////////////////////////////
  // REGION_END: GAME LOGIC
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  // REGION_START: GAME EVENT HANDLERS
  /////////////////////////////////////////////////////////////////////////////

  // Get the list of remaining tries.
  const triesRemaining = gameState.triesRemaining;

  // Get the list of guessed countries.
  const guessedCountries = Array.from(gameState.guessedCountries);

  const randomCountry = gameState.selectedCountry;

  const styleInput = `min-w-[60vw] md:min-w-[45vw] block! p-2.5 py-2 pl-10 w-full!
              text-sm text-gray-900 bg-white rounded-lg
              border border-gray-300
              dark:placeholder-gray-400 dark:text-white dark:bg-gray-700 dark:border-gray-600
              focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500
              `;

  function handleInputOnChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setQuery(e.currentTarget.value);
    setGuess(e.target.value);
  }

  function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    event.preventDefault();
    const selectedOptions = Array.from(
      event?.target.selectedOptions,
      (option) => option.value
    );
    const alpha3Code = selectedOptions[0];

    if (!gameState.countries) {
      toast({
        title: ` Country list is empty.`,
      });
      return;
    }
    const c = gameState.countries.find(
      (country) => country.alpha3Code === alpha3Code
    )?.name;
    if (!c) {
      toast({
        title: `Cannot find country with alpha3Code: ${alpha3Code}`,
      });
      return;
    }
    setGuess(c);
  }

  function handleSelectKeyPress(event: KeyboardEvent<HTMLSelectElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      const alpha3Code = selectRef.current?.value;

      if (!gameState.countries) {
        toast({
          title: ` Country list is empty.`,
        });
        return;
      }
      const c = gameState.countries.find(
        (country) => country.alpha3Code === alpha3Code
      )?.name;
      if (!c) {
        toast({
          title: `Cannot find country with alpha3Code: ${alpha3Code}`,
        });
        return;
      }
      setGuess(c);
      toast({
        title: `Guessing ${c}…`,
        duration: 200,
      });
      processTurnAndClear();
    } else {
      return;
    }
  }

  function handleOptionClick(
    event: MouseEvent<HTMLOptionElement, globalThis.MouseEvent>
  ) {
    event.preventDefault();
    const alpha3Code = event.currentTarget.value;
    const c = gameState.countries.find(
      (country) => country.alpha3Code === alpha3Code
    )?.name;

    if (!c) {
      toast({
        title: `Cannot find country with alpha3Code: ${alpha3Code}`,
      });
      return;
    }

    setGuess(c);
    toast({
      title: `Guessing ${c}…`,
      duration: 200,
    });
    processTurnAndClear();
  }

  function handleSelectCountryInputOptionOnChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
    e.preventDefault();
    const value = e.target.value;
    toast({ title: value });
    setQuery(e.currentTarget.value);
    setGuess(e.target.value);
  }

  function handleInputOnBlur(e: FocusEvent<HTMLInputElement, Element>) {
    e.preventDefault();
    const value = e.target.value;
    toast({ title: `onBlur: ${value}` });
  }

  /////////////////////////////////////////////////////////////////////////////
  // REGION_END: GAME EVENT HANDLERS
  /////////////////////////////////////////////////////////////////////////////

  const { flag, flags } = randomCountry || gameState.selectedCountry || {};
  const imageUrl =
    flag ||
    flags?.png ||
    "/assets/placeholders/flag.jpg" ||
    require("../public/assets/placeholders/flag.jpg");

  /////////////////////////////////////////////////////////////////////////////
  // REGION_START: GAME UI RENDERING REACT COMPONENT
  /////////////////////////////////////////////////////////////////////////////

  return (
    <section className="grid gap-4 justify-center">
      <Heading
        color={"default"}
        fontWeight={"bold"}
        variant="h1"
        className="flex text-2xl lg:text-4xl justify-center uppercase"
      >
        Guess the country
      </Heading>
      <div className="py-2 mx-auto w-[250px]">
        <AspectRatio ratio={3 / 2}>
          {/* Flag ratio is commonly 3/2 or 2/1 :
          https://en.wikipedia.org/wiki/List_of_aspect_ratios_of_national_flags  */}
          <Image // fill
            width={250}
            height={250}
            src={imageUrl}
            alt={randomCountry?.name ?? "Flag"}
            className={`rounded-md shadow w-[250px] aspect-video object-cover`}
          />
        </AspectRatio>
      </div>
      <div className="grid grid-flow-col absolute top-4 text-xs space-x-4 justify-center">
        <p>Tries Remaining: {triesRemaining}</p>
        <p>Guessed Countries: {guessedCountries.join(", ")}</p>
        {/* debug only*/}
        <>
          {gameState.state === GameState.Won && (
            <h2 className="sr-only">You won!</h2>
          )}
          {gameState.state === GameState.Lost && (
            <h2 className="sr-only">You lost!</h2>
          )}
          <pre className="hidden!">
            {" "}
            {gameState.selectedCountry?.name} <br />{" "}
            {JSON.stringify(guess, null, 2)} <br />{" "}
            <div className="hidden">{JSON.stringify(gameState, null, 2)}</div>{" "}
          </pre>
        </>
      </div>
      <div className="grid relative rounded-lg outline outline-slate-200 dark:outline-slate-700 overflow-clip">
        <Button
          onClick={checkGuessCountry}
          className="rounded-none"
          variant="default"
        >
          Guess
        </Button>
        <Button
          onClick={selectRandomCountry}
          className="rounded-none"
          variant="outline"
        >
          Skip
        </Button>

        <div className="relative">
          <div className="relative">
            <div className="flex absolute top-0! inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <SearchIcon
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
              />
            </div>
            <Input
              value={guess}
              onChange={handleInputOnChange}
              placeholder="Search a country…"
              type="search"
              className={cn(styleInput, "rounded-none")}
            />
          </div>

          <select
            multiple={true}
            ref={selectRef}
            onChange={(e) => handleSelectChange(e)}
            onKeyDown={(e) => handleSelectKeyPress(e)}
            className="border h-[300px] absolute w-full bg-transparent z-10 rounded-none"
          >
            {searchResults
              ?.filter((result) => {
                const score = (result.score ?? -1) * 100;
                return score >= 0 && score <= 400 && result.score;
              })
              .map((result, idxResult) => (
                <option
                  key={`option-${query}-${result.item.alpha3Code}-${idxResult}`}
                  value={result.item.alpha3Code}
                  onClick={(e) => handleOptionClick(e)}
                  className={`first-letter:font-medium hover:bg-slate-600 backdrop-blur-[4px]`}
                >
                  {result.item.name}
                </option>
              ))}
          </select>

          <div className="border gap-0 grid -z-10 h-[300px] absolute w-full">
            {Array.from(Array(MAX_TRIES)).map((_, index) => {
              return (
                <Button
                  key={`button-${index}`}
                  variant={"subtle"}
                  // size={"sm"}
                  className="w-full h-full border-b border-t rounded-none pointer-events-none"
                >
                  <div className="grid grid-flow-col items-center gap-2">
                    <div className="sr-only">{index + 1}</div>
                    <div className="capitalize! uppercase tracking-wider">
                      {Array.from(gameState.guessedCountries)[index] &&
                        Array.from(gameState.guessedCountries)
                          [index].toString()
                          .split("")
                          .map((char) => {
                            if (
                              gameState.selectedCountry?.name.includes(char)
                            ) {
                              return (
                                <span className="text-green-500">{char}</span>
                              );
                            }
                            return <span>{char}</span>;
                          })}
                    </div>
                    <div className="distance">
                      {Array.from(gameState.guessedCountries)[index] ===
                      gameState.selectedCountry?.alpha3Code ? (
                        <span className="">✅</span>
                      ) : (
                        <span className="opacity-0">⛔</span>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* HACK: We need the datalist from CountryOptionsList to be rendered
          so that it acts as UI, while `<select>` abouve of positon absolute,
          acts as the UX accessible headless ui. */}
          <div className="h-full pointer-events-none">
            <div className="opacity-5">
              <CountryOptionsList searchResults={searchResults} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  /////////////////////////////////////////////////////////////////////////////
  // REGION_END: GAME UI RENDERING REACT COMPONENT
  /////////////////////////////////////////////////////////////////////////////
}

function getCountryInfo(countries: ICountry[], alpha3Code: string) {
  return countries.find((c) => c.alpha3Code === alpha3Code);
}

type CountryOptionProps = {
  item: ICountry;
  score: number;
  index: number | string;
};

function CountryOption({
  item,
  score,
  index,
}: CountryOptionProps): JSX.Element {
  const value = item.alpha3Code;
  // const value = encodeURIComponent(JSON.stringify(item));
  const label = `${item.name}  (${(score * 100).toFixed(0)})`;
  const id = `country-option-${item.alpha3Code}-${index}`;

  return (
    <option
      // onSelect={(e) => { e.preventDefault(); }}
      id={id}
      key={id}
      value={value}
    >
      {label}
    </option>
  );
}

function CountryOptionsList({
  searchResults,
}: {
  searchResults: SearchResult[] | null;
}): JSX.Element {
  const options = searchResults
    ?.filter((result) => {
      const score = (result.score ?? -1) * 100;
      return score >= 0 && score <= 400 && result.score;
    })
    .map((result, index) => (
      <CountryOption
        item={result.item}
        score={result.score ?? -1}
        index={index}
      />
    ));

  return (
    <div className="grid h-full min-h-[300px] gap-1 overflow-y-auto">
      <datalist id="countries">{options}</datalist>
    </div>
  );
}

export { FlagGuessingGame, gameStateAtom, GameState };

// function endGame(hasWon: boolean) {
// state.update((draft) => {
// draft.state = GameState.Ended;
// draft.hasWon = hasWon;
// });
// toast({
// title: "Game Over",
// message: hasWon ? "Congratulations, you guessed the country!" : The country was ${currentCountry},
// duration: 5000,
// position: "bottom-right",
// variant: hasWon ? "success" : "error",
// });
// }
