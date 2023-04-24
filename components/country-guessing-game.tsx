import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Indicator } from "@/components/ui/indicator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading } from "@/components/ui/typography";
import dataJSON from "@/lib/data.json";
import { LocalStorageKey } from "@/lib/enums";
import { haversine } from "@/lib/haversine-distance";
import { useToast } from "@/lib/hooks/ui/use-toast";
import { ICountry } from "@/lib/types/types-country";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import produce from "immer";
import { atom, useAtom } from "jotai";
import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";

const MAX_TRIES = 6;
const TIME_LIMIT = 30; // seconds

/** `GameState` enum defines the possible states of the game.
 *
 * @enum {number} */
enum GameState {
  Running,
  Won,
  Lost,
  Canceled,
}

const countriesName: ICountry["name"][] = dataJSON.map(
  (country: ICountry) => country.name
);

const countryNameEnum = countriesName.reduce((acc, name) => {
  return { ...acc, [name]: name };
}, {});

// Alternatively, define the enum object directly:
// const countryNameSchema = z.nativeEnum( countriesName.reduce((acc, name) => { return { ...acc, [name]: name }; }, {}));
const countryNameSchema = z.nativeEnum(countryNameEnum);

type InitialGameState = {
  countries: ICountry[];
  triesRemaining: number;
  selectedCountry: ICountry | null;
  guessedCountries: Set<string>;
  state: GameState;
  remainingTime: number;
  gameStartedAt: Date | null;
  gameResetAt: Date | null;
  readonly maxTries: number;
  readonly gameDuration: number;
  readonly graceTimeAtTry: number; // Add 10 seconds if guessed at a try.
};

const initialGameState: InitialGameState = {
  countries: [] as ICountry[],
  triesRemaining: MAX_TRIES,
  selectedCountry: {} as ICountry | null,
  guessedCountries: new Set<ICountry["name"]>(), // or just collect country.
  state: GameState.Running,
  remainingTime: TIME_LIMIT,
  gameStartedAt: null,
  gameResetAt: null,
  maxTries: MAX_TRIES,
  gameDuration: TIME_LIMIT,
  graceTimeAtTry: z.number().parse(5),
};
/**
 * `gameStateAtom` is the global state of the game.
 *
 * `PrimitiveAtom` is a type of atom that can only be set and read from outside the component.
 */
const gameStateAtom = atom(initialGameState);

/** `FlagGuessingGame` component renders the flag guessing game.
 *
 * @returns {JSX.Element}
 */
function FlagGuessingGame(): JSX.Element {
  const { toast, dismiss } = useToast();

  const [guess, setGuess] = useState<ICountry["name"]>("");

  const [gameState, setGameState] = useAtom(gameStateAtom);

  /* REGION_START: User membership... */
  const [isUserPro, setIsUserPro] = useState(false); // TODO: use useEffect of api route to check membership status, or use sign in data or protected routes to set this.
  /* REGION_END: User membership... */

  /* REGION_START: ComboBox Search... */

  const searchRef = useRef<NonNullable<HTMLButtonElement> | null>(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedOptionSearch, setSelectedOptionSearch] = useState("");
  const [valueSearch, setValueSearch] = useState("");

  /* REGION_END: ComboBox Search... */

  const startGameRef = useRef<HTMLButtonElement | null>(null);

  /* REGION_START: Countdown timer.. */
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [isGameRunning, setIsGameRunning] = useState(false);

  // useEffect(() => {
  //   if (remainingTime <= 0) { handleTimeout(); }
  // }, [remainingTime]);

  const handleTimeout = () => {
    setGameState(
      produce((draft) => {
        draft.gameResetAt = new Date();
      })
    );
    toast({
      title: "Time is up!",
      description: <LinkCountry gameState={gameState} />,
    });
    resetGame();
  };

  /* REGION_END: Contdown timer.. */

  const handleStartGame = () => {
    const gameDataArray = getGameDataArray();
    if (gameDataArray.length > 0 && !isUserPro) {
      toast({
        title: `You have already played today.`,
        description: (
          <div className="grid">
            Please come back tomorrow.{" "}
            <Link className="font-bold underline" href="/pro">
              Get Pro to remove limits.
            </Link>
          </div>
        ),
        action: (
          <Button
            onClick={() => {
              toast({
                title: "Are you sure?",
                description: "You will lose all your progress",
                action: (
                  <Button
                    className=""
                    size={"sm"}
                    onClick={() => {
                      localStorage.clear();
                      // dismiss();
                      toast({
                        title: "Local saved data cleared",
                        description: "You can play the game again.",
                      });
                    }}
                  >
                    Delete
                  </Button>
                ),
              });
            }}
            className="px-4 w-fit"
            size={"sm"}
          >
            Clear data
          </Button>
        ),
      });
      return;
    }

    setGameState(
      produce((draft) => {
        draft.gameStartedAt = new Date();
      })
    );

    setIsGameRunning(true);

    // focus on the input.
    if (searchRef.current) {
      searchRef.current.focus(); // searchRef.current.blur();
    }
  };

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
  function checkGuessCountry(guessedCountry: ICountry["name"]) {
    if (guessedCountry === "") {
      toast({
        title:
          "You entered an empty string. Please enter a valid country name.",
      });
      return;
    }

    try {
      countryNameSchema.safeParse(guessedCountry);
    } catch (error) {
      toast({ title: JSON.stringify(error, null, 2) });
      console.error(`*** ERROR: ${error} ***`);
      return;
    }

    const selectedCountry = gameState.selectedCountry?.name;
    const guessedCountrySet = new Set<string>(gameState.guessedCountries);
    guessedCountrySet.add(guessedCountry);
    const triesRemaining = gameState.triesRemaining - 1;

    if (guessedCountry === selectedCountry) {
      toast({
        title: "You won!",

        description: <LinkCountry gameState={gameState} />,
      });
      setGameState(
        produce(gameState, (draft) => {
          draft.state = GameState.Won;
          draft.guessedCountries = guessedCountrySet;
        })
      );
      toast({
        title: "You won!",
        description: <LinkCountry gameState={gameState} />,
      });
      resetGame();
    } else if (triesRemaining === 0) {
      toast({
        title: "You lost!",
        description: <LinkCountry gameState={gameState} />,
      });
      setGameState(
        produce(gameState, (draft) => {
          draft.state = GameState.Lost;
          draft.triesRemaining = triesRemaining;
          draft.guessedCountries = guessedCountrySet;
        })
      );
      resetGame();
    } else {
      // Play next try.
      setGameState(
        produce(gameState, (draft) => {
          draft.triesRemaining = triesRemaining;
          draft.guessedCountries = guessedCountrySet;
        })
      );
    }

    // Reset the guess.
    setGuess("");
  } // end of selectRandomCountry.

  function handleGuessSubmit(country: ICountry["name"]) {
    toast({ title: `You guessed: ${country}` });
    // setRemainingTime((prev) => prev + 10); // use produce from immer here...
    setGameState(
      produce((draft) => {
        draft.remainingTime += 10;
      })
    );
    checkGuessCountry(country);
    setGuess("");
    setSelectedOptionSearch("");
  }

  // Reset the game.
  function resetGame(timeout: number = 4000) {
    setIsGamePaused(true);
    const gameDataArray = getGameDataArray();
    setTimeout(() => {
      setIsGameRunning(false); // FIXME: Use this later, to avoid sudden shifts of heading and timer.
      setGameState(
        produce((draft) => {
          draft.triesRemaining = gameState.maxTries;
          draft.guessedCountries = new Set<string>();
          draft.state = GameState.Canceled; // HACK: IT works when this is `Playing`.
          draft.gameResetAt = new Date();
        })
      );
      setIsGamePaused(false);
      toast({
        title: "Resetting Game",
        duration: 3500,
      });

      const gameData = {
        countries: gameState.countries,
        triesRemaining: gameState.triesRemaining,
        selectedCountry: gameState.selectedCountry,
        guessedCountries: gameState.guessedCountries,
        state: gameState.state,
        timeRemaining: gameState.remainingTime,
        gameStartedAt: gameState.gameStartedAt,
        gameResetAt: gameState.gameResetAt,
      };

      gameDataArray.push(gameData);
      localStorage.setItem(
        LocalStorageKey.GameState,
        JSON.stringify(gameDataArray)
      );

      selectRandomCountry();

      if (startGameRef.current) {
        startGameRef.current.focus();
      }
    }, timeout);
  }

  /////////////////////////////////////////////////////////////////////////////
  // REGION_END: GAME LOGIC
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  // REGION_START: GAME DATABASES
  /////////////////////////////////////////////////////////////////////////////

  function getGameDataArray() {
    const gameDataJson = localStorage.getItem(LocalStorageKey.GameState);
    if (!gameDataJson) {
      return [];
    }
    return JSON.parse(gameDataJson);
  }

  /////////////////////////////////////////////////////////////////////////////
  // REGION_END: GAME DATABASES
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  // REGION_START: GAME EVENT HANDLERS
  /////////////////////////////////////////////////////////////////////////////

  // Implements combobox user event handling and utilize `processTurnAndClear`
  function handleComboSelectSearch(value: string) {
    try {
      const parsedCountryValue = countryNameSchema.safeParse(value);
      if (!parsedCountryValue.success) {
        throw new Error("Invalid country name");
      }
    } catch (err) {
      toast({ title: JSON.stringify(err, null, 2) });
      return;
    }

    setGuess(value);
    setValueSearch("");
    handleGuessSubmit(value);
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

  function LinkCountry({ gameState }: { gameState: InitialGameState }) {
    return (
      <Link
        href={`/countries/${gameState.selectedCountry?.alpha3Code}`}
        className="flex font-bold underline"
      >
        {gameState.selectedCountry?.name}
      </Link>
    );
  }

  const triesRemaining = gameState.triesRemaining; // Get the list of remaining tries.
  const guessedCountries = Array.from(gameState.guessedCountries); // Get the list of guessed countries.
  const randomCountry = gameState.selectedCountry;
  const { flag, flags } = randomCountry || gameState.selectedCountry || {};
  const imageUrl = flag || flags?.png || "/assets/placeholders/flag.jpg" || require("../public/assets/placeholders/flag.jpg"); // prettier-ignore

  return (
    <section className="flex flex-col gap-8 justify-center mx-auto mt-6 w-[80vw] md:w-[60vw]">
      <div className="grid">
        {isGameRunning ? (
          <div
            className={`${isGamePaused ? "blur-2xl" : "blur-0"}
              scroll-m-20 mt-10 uppercase text-4xl text-center font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1] hidden md:block`}
          >
            <CountdownTimer
              // initialTime={gameState.remainingTime}
              onTimeout={handleTimeout}
            />
          </div>
        ) : (
          <Heading
            color={"default"}
            fontWeight={"bold"}
            variant="h1"
            className="hidden text-3xl font-bold tracking-tighter leading-tight text-center uppercase md:block md:text-5xl lg:text-6xl lg:leading-[1.1]"
          >
            Guess the country
          </Heading>
        )}
      </div>

      {/* Flag ratio is commonly 3/2 or 2/1 : https://en.wikipedia.org/wiki/List_of_aspect_ratios_of_national_flags  */}
      <div className="grid py-2 mx-auto h-auto w-[250px]">
        <AspectRatio ratio={3 / 2}>
          {/* <div className="hidden absolute top-0 right-0 scale-75 -z-50"> <Image className="object-cover flex justify-center opacity-80! pointer-events-none" src={require("@/lib/dev/2023-04-17-1003-explorer.png")} alt={"architecture"} /> </div> */}
          <Image // fill
            width={90 * 3}
            height={90 * 2}
            src={imageUrl}
            alt={randomCountry?.name ?? "Flag"}
            className={`${
              isGameRunning ? "blur-0" : "blur-xl dark:blur-2xl"
            } rounded-md shadow w-[250px] h-auto aspect-video object-cover`}
          />
          <div className="grid place-content-center mt-3 w-full">
            {isGameRunning && (
              <div
                className={`${isGameRunning ? "opacity-100" : "opacity-0"}
                ${isGamePaused ? "blur-2xl" : "blur-0"}
                 md:hidden block font-bold text-lg`}
              >
                <CountdownTimer onTimeout={handleTimeout} />
              </div>
            )}
            <div className="absolute place-self-center h-full">
              <Button
                data-testid="startGameButton"
                ref={startGameRef}
                onClick={handleStartGame}
                className={`${
                  isGameRunning ? "opacity-0" : "opacity-100"
                } relative `}
                variant={"subtle"}
              >
                {!isGameRunning && guessedCountries.length === 0 ? (
                  <div className="absolute -top-2.5 right-3 opacity-90">
                    <Indicator />
                  </div>
                ) : null}
                Start Game
              </Button>
            </div>
          </div>
        </AspectRatio>
      </div>

      {/*
          A CommandCombobox component that allows the user to search and select a country.
          @remarks
          This component uses the useQueryAllCountries hook to fetch the list of countries.
          It renders a button that displays a dropdown of the list of countries in a Command UI.
          The user can search for a country by typing in the input box and select a country by clicking on it.
          @returns The CommandCombobox component.
        */}
      <div
        className="grid relative gap-y-2 min-w-[300px]"
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          e.preventDefault();
          if (!isGameRunning && startGameRef.current) {
            startGameRef.current.focus();
            toast({ title: "You must start the game first!" });
          }
        }}
      >
        <Popover open={openSearch} onOpenChange={setOpenSearch}>
          <PopoverTrigger
            disabled={!isGameRunning}
            data-testid="searchCountryTrigger"
            asChild
          >
            <Button
              id="search-country"
              ref={searchRef}
              data-testid="searchCountryTriggerButton"
              variant="outline"
              role="combobox"
              aria-expanded={openSearch}
              className="relative justify-between min-w-[200px]"
            >
              {isGameRunning && guessedCountries.length === 0 ? (
                <div className="absolute -top-2.5 right-3 opacity-90">
                  <Indicator />
                </div>
              ) : null}
              {selectedOptionSearch || "Select a country…"}
              <ChevronsUpDown className="ml-2 w-4 h-4 opacity-50 shrink-0" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="min-w-[200px] w-full max-h-[350px]! p-0">
            <Command draggable={true}>
              <CommandInput
                autoFocus={true}
                placeholder="Search a country…"
                value={valueSearch}
                onValueChange={(search) => {
                  setOpenSearch(true);
                  setGuess(search);
                  setValueSearch(search);
                }}
              />
              <CommandEmpty>No countries found.</CommandEmpty>
              {gameState.countries ? (
                <CommandGroup>
                  <ScrollArea className="p-4 w-full rounded-md border h-[200px] min-w-[350px]">
                    {gameState.countries.map((country, idxCountry) => (
                      <CommandItem
                        className="disabled:opacity-70"
                        aria-disabled={isCountryAlreadyGuessedSearch(country)}
                        disabled={isCountryAlreadyGuessedSearch(country)}
                        key={`${country.alpha3Code}-${idxCountry}-countryItem`}
                        onSelect={(value) =>
                          handleOptionSelectSearch(value, country)
                        }
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

        <Button
          onClick={() => handleGuessSubmit(guess)}
          className="hidden"
          variant="default"
        >
          Guess
        </Button>
        <Button
          onClick={selectRandomCountry}
          // className="hidden"
          variant="outline"
        >
          Skip
        </Button>
      </div>

      <div className="grid gap-y-2 md:gap-y-3">
        {Array.from(Array(gameState.maxTries).keys()).map((idxGuessed) => {
          const country = guessedCountries[idxGuessed];

          return (
            <div
              key={`guessed-${country}-${idxGuessed}-${gameState.selectedCountry?.name}`}
              className="grid grid-flow-col-dense items-baseline"
            >
              {country ? (
                <>
                  <Heading className="py-0 my-0 tracking-widest leading-none uppercase">
                    {country.split("").map((char, i) => (
                      <span
                        key={`char-${i}-${char}-${idxGuessed}-${country.length}`}
                        className={
                          gameState.selectedCountry?.name.includes(char)
                            ? "text-green-500"
                            : ""
                        }
                      >
                        {char}
                      </span>
                    ))}
                  </Heading>
                  <Directions gameState={gameState} guessed={country} />
                </>
              ) : (
                <Skeleton className="rounded-sm min-w-[100px] min-h-[22px]" />
              )}
            </div>
          );
        })}
      </div>

      {/* debug only*/}
      <div className="relative opacity-0 hover:opacity-40">
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

type DirectionsProps = {
  gameState: InitialGameState;
  guessed: ICountry["name"];
};

export function Directions({ gameState, guessed }: DirectionsProps) {
  const guessedCountry = gameState.countries.find(
    (country) => country.name === guessed
  );
  const guessedCoords = guessedCountry?.latlng ?? [0, 0];

  const selectedCountry = gameState.selectedCountry;
  const targetCoords = selectedCountry?.latlng ?? [0, 0];

  const distance = haversine(
    [guessedCoords[0], guessedCoords[1]],
    [targetCoords[0], targetCoords[1]]
  ).toFixed(0);

  let direction = "";
  const latDiff = targetCoords[0] - guessedCoords[0];
  const lonDiff = targetCoords[1] - guessedCoords[1];
  if (latDiff > 0 && lonDiff > 0) {
    direction = "↗️"; // NE
  } else if (latDiff > 0 && lonDiff < 0) {
    direction = "↖️"; // NW
  } else if (latDiff < 0 && lonDiff < 0) {
    direction = "↙️"; // SW
  } else if (latDiff < 0 && lonDiff > 0) {
    direction = "↘️"; // SE
  }

  return (
    <div className="px-2 text-xs ms-auto">
      {gameState.selectedCountry && (
        <div className="flex items-center">
          <span className="font-bold">{distance}</span>
          <span className="ml-2">{direction}</span>
        </div>
      )}
    </div>
  );
}

type CountdownTimerProps = {
  onTimeout: () => void;
};

function CountdownTimer({ onTimeout }: CountdownTimerProps) {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const { remainingTime, graceTimeAtTry, gameDuration, guessedCountries } =
    gameState;

  const [mounted, setMounted] = useState(true);
  const [guessCount, setGuessCount] = useState(
    Array.from(guessedCountries).length
  );

  useEffect(() => {
    const updatedGuessCount = Array.from(guessedCountries).length;
    if (
      guessCount !== updatedGuessCount &&
      remainingTime + graceTimeAtTry <= gameDuration
    ) {
      setGameState(
        produce((draft) => {
          draft.remainingTime = remainingTime + graceTimeAtTry;
        })
      );
    }
    setGuessCount(updatedGuessCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guessedCountries]);

  useEffect(() => {
    if (mounted) {
      const timer = setInterval(() => {
        // setGameState((prevTime: number) => prevTime - 1);
        setGameState(
          produce((draft) => {
            draft.remainingTime = remainingTime - 1;
          })
        );
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, remainingTime]);

  useEffect(() => {
    if (remainingTime <= 0 && mounted) {
      setMounted(false);
      onTimeout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingTime, mounted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  const getTimeAwareColor = (remainingTime: number) => {
    if (remainingTime <= 5) {
      return cn("text-red-500 animate-pulse dark:text-red-400");
    } else if (remainingTime > 5 && remainingTime <= 10) {
      return cn("text-red-500 dark:text-red-400");
    } else if (remainingTime <= 20) {
      return cn("text-orange-500 dark:text-orange-400");
    } else {
      return cn("");
    }
  };

  return (
    <span className={getTimeAwareColor(remainingTime)}>
      {formatTime(remainingTime)}
    </span>
  );
}

// NOTE: REFACTOR (Optional)
// Use useEffect to check the user's membership status, instead of useState. This will allow you to update the membership status automatically when the component mounts or when the user's membership status changes.
//
// Instead of using separate states for the search button and input box, combine them into one state using an object with openSearch, selectedOptionSearch, and valueSearch properties.
//
// Combine the GameTimeStamps state and the remainingTime state into one state called gameState that has all of the game state information.
//
// Use a separate useEffect hook to update the remaining time and check if the time has run out.
//
// Combine the isGamePaused and isGameRunning states into a single gameState state.
//
// Use useMemo to memoize the gameDataArray and selectedCountry values.
//
// Use useCallback to memoize the selectRandomCountry and checkGuessCountry functions.
//
// Extract the toast notifications into separate components or functions to reduce the complexity of the handleStartGame and checkGuessCountry functions.
//
// Rename the setGameState function to updateGameState to be more descriptive.
//
// Remove any commented-out code that is not being used or needed.
//
// Move the user membership check to a separate function or hook that can be called once the user logs in or the component mounts.
//
// Consolidate the state related to the search box into a single object using useState.
//
// Move the countdown timer related state and functions to a separate file or hook, especially if they are reused elsewhere.
//
// Use the useRef hook to create a ref for the input element instead of relying on a button ref to focus the input.
//
// Use useCallback to memoize the handleStartGame, selectRandomCountry, and checkGuessCountry functions so they are not recreated on each render.
