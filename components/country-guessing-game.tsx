import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/typography";
import { useToast } from "@/lib/hooks/ui/use-toast";
import { useCountrySearch } from "@/lib/hooks/use-country-search";
import { ICountry } from "@/lib/types/types-country";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import produce from "immer";
import { atom, useAtom } from "jotai";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { AccordianGuesses } from "./accordion-guesses";

const MAX_TRIES = 6;

/** `GameState` enum defines the possible states of the game.
 *
 * @enum {number} */
enum GameState {
  Running,
  Won,
  Lost,
}

/** `gameStateAtom` is the global state of the game. */
// PrimitiveAtom  is a type of atom that can only be set and read from outside the component.
const gameStateAtom = atom({
  countries: [] as ICountry[],
  triesRemaining: MAX_TRIES,
  selectedCountry: {} as ICountry | null,
  guessedCountries: new Set<string>(),
  state: GameState.Running,
});

/** `FlagGuessingGame` component renders the flag guessing game.
 *
 * @returns {JSX.Element}
 */
function FlagGuessingGame(): JSX.Element {
  const { toast, dismiss } = useToast();

  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [guess, setGuess] = useState("");

  const { searchResults, isLoading, error, query, setQuery } =
    useCountrySearch();

  // Select a random countryfrom the list of countries.
  // The state must be manually updated before this component is rendered.
  function selectRandomCountry() {
    const randomCountry =
      gameState.countries[
        Math.floor(Math.random() * gameState.countries.length)
      ];
    console.log(randomCountry);
    setGameState(
      produce((draft) => {
        draft.selectedCountry = randomCountry;
      })
    );
  }

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

      toast({
        title: "You won!",
      });

      resetGame();
    } else {
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

        toast({
          title: "You lost!",
        });

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

  // Reset the game.
  function resetGame(timeout: number = 5000) {
    // toast({ title: "Game reset", duration: 1000, // onClick: () => resetGame(), }); // dismiss("DISMISS_TOAST");
    setTimeout(() => {
      toast({ title: "Resetting game…", duration: 4000 });
      setGameState(
        produce((draft) => {
          draft.triesRemaining = 6;
          draft.guessedCountries = new Set<string>();
          draft.state = GameState.Running;
        })
      );

      selectRandomCountry();
      toast({ title: "Game reset", duration: 1000 });
    }, timeout);
  }

  // Get the list of remaining tries.
  const triesRemaining = gameState.triesRemaining;

  // Get teh list of guessed countries.
  const guessedCountries = Array.from(gameState.guessedCountries);

  // Get the current game state from the hook.
  const state = gameState.state;

  const randomCountry = gameState.selectedCountry;

  const styleInput = `
              min-w-[60vw] md:min-w-[45vw] block!
              p-2.5 py-2 pl-10 w-full!
              text-sm text-gray-900 bg-white rounded-lg
              border border-gray-300
              dark:placeholder-gray-400 dark:text-white
              dark:bg-gray-700 dark:border-gray-600
              focus:border-blue-500 focus:ring-blue-500
              dark:focus:ring-blue-500 dark:focus:border-blue-500
              `;

  function handleInputOnChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setQuery(e.target.value);
    setGuess(e.target.value);
  }

  function handleCountryOnClick(country: ICountry) {
    setQuery(country.name);
    setGuess(country.name);
    checkGuessCountry();
    // setQuery(""); // Clear the search query.
  }

  return (
    <>
      <>
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
                  // fill
                  width={250}
                  height={250}
                  src={
                    randomCountry?.flag ||
                    (randomCountry?.flags && randomCountry?.flags.png) ||
                    ""
                  }
                  alt={randomCountry?.name ?? ""}
                  className={cn(
                    `rounded-md shadow w-[250px] aspect-video object-cover`
                  )}
                />
              </AspectRatio>
            </div>
          </div>

          <div className="flex text-xs space-x-4 justify-center">
            <p>Tries Remaining: {triesRemaining}</p>
            <p>Guessed Countries: {guessedCountries.join(", ")}</p>
          </div>

          <div className="grid relative rounded-lg outline outline-slate-200 dark:outline-slate-700 overflow-clip">
            <div className="grid">
              <Button
                className="rounded-none"
                variant="default"
                onClick={checkGuessCountry}
              >
                Guess
              </Button>
              <Button
                className="rounded-none"
                variant="outline"
                onClick={selectRandomCountry}
              >
                Skip
              </Button>
            </div>
            <div className="relative">
              <div className="flex absolute top-0! inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <SearchIcon
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                />
              </div>
              <Input
                type="search"
                placeholder="Search a country…"
                value={guess}
                autoFocus={true}
                onChange={handleInputOnChange}
                onSubmit={(e) => {
                  if (gameState && gameState.countries) {
                    const found = gameState.countries.find(
                      (c) =>
                        c.name.toLowerCase() ===
                        e.currentTarget.value.trim().toLowerCase()
                    );
                    if (found) handleCountryOnClick(found);
                  }
                }}
                className={cn(styleInput, "rounded-none")}
                disabled={
                  gameState.state === GameState.Won ||
                  gameState.state === GameState.Lost ||
                  gameState.triesRemaining === 0 ||
                  gameState.selectedCountry === null
                }
              />
            </div>
            <div className="grid h-[300px] gap-1 overflow-y-auto">
              <>
                <div className="grid gap-0 w-full text-sm rounded-md max-h-[300px] overflow-clip">
                  <div className="guesses">
                    {guessedCountries.map((country, idx) => {
                      return (
                        <div
                          key={`country-guess-${country}-${idx}`}
                          className="guess"
                        >
                          {country}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
              {searchResults &&
                searchResults.map((result, idxResult) => {
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
                          e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        ) => {
                          e.preventDefault();
                          handleCountryOnClick(country);
                        }}
                      >
                        {country.name}
                        <div aria-label="search score rank" className="sr-only">
                          {(score * 100).toFixed(0)}
                        </div>
                      </Button>
                    );
                  } else {
                    return null;
                  }
                })}
            </div>
          </div>
        </section>
      </>
      <>
        {state === GameState.Won && <h2 className="sr-only">You won!</h2>}
        {state === GameState.Lost && <h2 className="sr-only">You lost!</h2>}
      </>
      {/* debug only*/}
      <pre className="hidden">
        {gameState.selectedCountry?.name}
        <br />
        {JSON.stringify(guess, null, 2)}
        <br />
        {JSON.stringify(gameState, null, 2)}
      </pre>{" "}
    </>
  );
}

export { FlagGuessingGame, gameStateAtom, GameState };
