import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heading } from "@/components/ui/typography";
import { useToast } from "@/lib/hooks/ui/use-toast";
import { ICountry } from "@/lib/types/types-country";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import produce from "immer";
import { atom, useAtom } from "jotai";
import { Check, ChevronsUpDown, SearchIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

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
  guessedCountries: new Set<ICountry["name"]>(), // or just collect country.
  state: GameState.Running,
});

// TODO: Add local support:
//
// useEffect(() => {
//   const fetchData = async () => {
//     const { countries } = await import("@/lib/data/countries.json");
//     setGameState((state) => produce(state, (draft) => { draft.countries = countries; }));
//   }; fetchData();
// }, []);
//
//
/** `FlagGuessingGame` component renders the flag guessing game.
 *
 * @returns {JSX.Element}
 */
function FlagGuessingGame(): JSX.Element {
  const { toast, dismiss } = useToast();

  const [guess, setGuess] = useState<ICountry["name"]>("");
  const [gameState, setGameState] = useAtom(gameStateAtom);

  /* REGION_START: ComboBox Search... */

  const [openSearch, setOpenSearch] = useState(false);
  const [selectedOptionSearch, setSelectedOptionSearch] = useState("");
  const [valueSearch, setValueSearch] = useState("");

  /* REGION_END: ComboBox Search... */

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
  function checkGuessCountry(country: ICountry["name"]) {
    const guessedCountry = country; //.trim().toLowerCase();
    if (guessedCountry === "") {
      toast({
        title: "Please enter a country name",
      });
      return;
    }
    const selectedCountry = gameState.selectedCountry?.name;
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

  function processTurnAndClear(country: ICountry["name"]) {
    checkGuessCountry(country);
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

  // Implements combobox user event handling and utilize `processTurnAndClear`
  function handleComboSelectSearch(value: string) {
    setGuess(value);
    processTurnAndClear(value);
  }

  /**
   * Handles the selection of a country and updates the game state and the toast message
   * @param currentValue - the current value of the input field
   * @param country - the selected country object
   */
  // Setting country.name as it is capitalized, while radix it seems b.t.s.
  // it lowercases currentValue or we could have used it instead of country.name.
  function handleOptionSelectSearch(
    currentValue: string | React.SetStateAction<string>,
    country: ICountry
  ) {
    setSelectedOptionSearch(currentValue === valueSearch ? "" : country.name);

    // Reset the search value.
    setValueSearch(currentValue === valueSearch ? "" : currentValue);

    setOpenSearch(false);

    handleComboSelectSearch(country.name);
  }

  /**
   * Checks if the selected country is already guessed
   * @param country - the selected country object
   * @returns A boolean indicating whether the country is already guessed
   */
  function isCountryAlreadyGuessedSearch(country: ICountry): boolean {
    return gameState.guessedCountries.has(country.name);
  }

  /////////////////////////////////////////////////////////////////////////////
  // REGION_END: GAME EVENT HANDLERS
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  // REGION_START: GAME UI RENDERING REACT COMPONENT
  /////////////////////////////////////////////////////////////////////////////

  const triesRemaining = gameState.triesRemaining; // Get the list of remaining tries.
  const guessedCountries = Array.from(gameState.guessedCountries); // Get the list of guessed countries.
  const randomCountry = gameState.selectedCountry;
  const { flag, flags } = randomCountry || gameState.selectedCountry || {};
  const imageUrl = flag || flags?.png || "/assets/placeholders/flag.jpg" || require("../public/assets/placeholders/flag.jpg"); // prettier-ignore

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
      {/* Flag ratio is commonly 3/2 or 2/1 : https://en.wikipedia.org/wiki/List_of_aspect_ratios_of_national_flags  */}
      <div className="py-2 mx-auto w-[250px]">
        <AspectRatio ratio={3 / 2}>
          <Image // fill
            width={250}
            height={250}
            src={imageUrl}
            alt={randomCountry?.name ?? "Flag"}
            className={`rounded-md shadow w-[250px] aspect-video object-cover`}
          />
        </AspectRatio>
      </div>

      <div className="grid relative rounded-lg outline outline-slate-200 dark:outline-slate-700 overflow-clip">
        <Button
          onClick={() => processTurnAndClear(guess)}
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

        {/*
          A CommandCombobox component that allows the user to search and select a country.
          @remarks
          This component uses the useQueryAllCountries hook to fetch the list of countries.
          It renders a button that displays a dropdown of the list of countries in a Command UI.
          The user can search for a country by typing in the input box and select a country by clicking on it.
          @returns The CommandCombobox component.
          @beta
        */}
        <Popover open={openSearch} onOpenChange={setOpenSearch}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openSearch}
              className="min-w-[200px] justify-between"
            >
              {selectedOptionSearch || "Select a country…"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-[200px] w-full max-h-[350px]! p-0">
            <Command>
              {guess}
              <CommandInput
                onValueChange={(search) => {
                  setValueSearch(search);
                  setOpenSearch(true);
                  setGuess(search);
                }}
                placeholder="Search a country…"
              />
              <CommandEmpty>No countries found.</CommandEmpty>
              {gameState.countries ? (
                <CommandGroup>
                  <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
                    {gameState.countries.map((country, idxCountry) => (
                      <CommandItem
                        aria-disabled={isCountryAlreadyGuessedSearch(country)}
                        disabled={isCountryAlreadyGuessedSearch(country)}
                        key={`${country.alpha3Code}-${idxCountry}-countryItem`}
                        onSelect={(value) =>
                          handleOptionSelectSearch(value, country)
                        }
                        className="disabled:opacity-70"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isCountryAlreadyGuessedSearch(country) ||
                              selectedOptionSearch === country.name
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {country.name}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              ) : null}
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <>
        {Array.from(guessedCountries).map((guessed, idxGuessed) => (
          <Heading
            key={`guessed-${guessed}-${idxGuessed}-${gameState.selectedCountry?.name}`}
            className="leading-none my-0 py-0 tracking-widest"
          >
            <>
              {guessed &&
                guessed.split("").map((char, i) => (
                  <span
                    key={`char-${i}-${char}-${idxGuessed}-${guessed.length}`}
                    className={
                      gameState.selectedCountry?.name.includes(char)
                        ? "text-green-500"
                        : ""
                    }
                  >
                    {char}
                  </span>
                ))}
            </>
          </Heading>
        ))}
      </>

      {/* debug only*/}
      <div className="relative">
        <div className="grid opacity-40 grid-flow-col! absolute top-4 text-xs space-x-4! justify-center">
          <p>Tries Remaining: {triesRemaining}</p>
          <p>Guessed Countries: {guessedCountries.join(", ")}</p>
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
        </div>
      </div>
    </section>
  );

  /////////////////////////////////////////////////////////////////////////////
  // REGION_END: GAME UI RENDERING REACT COMPONENT
  /////////////////////////////////////////////////////////////////////////////
} // end of CountryGuessingGame.

export { FlagGuessingGame, gameStateAtom, GameState };
