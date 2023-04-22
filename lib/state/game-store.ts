import { atom, useAtom } from "jotai";
import { LocalStorageKey } from "../enums";
import * as z from "zod";
import produce from "immer";

// const gameStateSchema = z.object({ currentRound: z.number(), remainingGuesses: z.number(), currentWord: z.string(), startTime: z.number(), elapsedTime: z.number(), });

const gameStateSchema = z.object({
  currentRound: z.number().min(1),
  remainingGuesses: z.number().min(0),
  currentWord: z.string(),
  startTime: z.number().min(0),
  elapsedTime: z.number().min(0),
});

const gameConfigSchema = z.object({
  maxRounds: z.number(),
  maxGuessesPerRound: z.number(),
  bonusPointsPerSecond: z.number(),
});

type GameState = z.infer<typeof gameStateSchema>;
type GameConfig = z.infer<typeof gameConfigSchema>;

const initialConfig: GameConfig = gameConfigSchema.parse({
  maxRounds: 3,
  maxGuessesPerRound: 6,
  bonusPointsPerSecond: 10,
});

const configAtom = atom<GameConfig>(initialConfig);

const gameStateAtom = atom<GameState>(
  (() => {
    const gameState = localStorage.getItem(LocalStorageKey.GameState);
    if (gameState) {
      const parsedGameState = gameStateSchema.parse(JSON.parse(gameState));
      return parsedGameState;
    } else {
      const updatedState: GameState = {
        currentRound: 1,
        remainingGuesses: initialConfig.maxGuessesPerRound,
        currentWord: "", // TODO: Replace with randomCountry word generation logic.
        startTime: 0,
        elapsedTime: 0,
      };
      // return gameStateSchema.parse(updatedState);
      return gameStateSchema.parse(updatedState);
    }
  })()
);

const lastRoundTimestampAtom = atom<number | null>(
  (() => {
    const timestamp = localStorage.getItem(LocalStorageKey.LastRoundTimestamp);
    return timestamp ? parseInt(timestamp) : null;
  })()
);

function saveGameState(state: GameState): void {
  localStorage.setItem(LocalStorageKey.GameState, JSON.stringify(state));
}

function saveLastRoundTimestamp(timestamp: number): void {
  localStorage.setItem(
    LocalStorageKey.LastRoundTimestamp,
    timestamp.toString()
  );
}

function useGameStateStore() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [lastRoundTimestamp, setLastRoundTimestamp] = useAtom(
    lastRoundTimestampAtom
  );
  const [config, setConfig] = useAtom(configAtom);

  // TODO: Pass in arguments to be used from the above atom getter setters to each functions.
  //
  // function startRound(): void {
  //   setGameState(
  //     produce((draftState: GameState) => {
  //       draftState.startTime = Date.now();
  //       draftState.elapsedTime = 0;
  //     })
  //   );
  //   saveGameState(gameState);
  // }
  //
  // function endRound(): void {
  //   let currentRound = gameState.currentRound;
  //   const elapsedSeconds = Math.round(gameState.elapsedTime / 1000);
  //   const bonusPoints = elapsedSeconds * config.bonusPointsPerSecond;
  //
  //   if (currentRound < config.maxRounds) {
  //     currentRound++;
  //     nextRound(currentRound);
  //   } else {
  //     setGameState(
  //       produce((draft: GameState) => {
  //         draft.currentRound = 1;
  //         draft.remainingGuesses = initialConfig.maxGuessesPerRound;
  //         (draft.currentWord = ""), // reset current word.
  //           (draft.startTime = 0);
  //         draft.elapsedTime = 0;
  //       })
  //     );
  //
  //     setLastRoundTimestamp(Date.now());
  //     saveGameState(gameState);
  //     if (lastRoundTimestamp) saveLastRoundTimestamp(lastRoundTimestamp);
  //   }
  // }
  //
  // function nextRound(currentRound: number): void {
  //   setGameState(
  //     produce((draftState: GameState) => {
  //       draftState.currentRound =
  //         draftState.currentRound === currentRound
  //           ? currentRound
  //           : currentRound + 1;
  //       draftState.remainingGuesses = initialConfig.maxGuessesPerRound;
  //       (draftState.currentWord = ""), // reset current word.
  //         (draftState.startTime = 0);
  //       draftState.elapsedTime = 0;
  //     })
  //   );
  //   saveGameState(gameState);
  // }
  //
  // function playGame(): void {
  //   // Use the gameStateAtom and configAtom from the Jotai store
  //   const [gameState, setGameState] = useAtom(gameStateAtom);
  //   const [config, setConfig] = useAtom(configAtom);
  //
  //   // Call the startRound() function to initialize the state
  //   startRound();
  //
  //   // Listen for user input and update the state accordingly
  //   // ...
  //
  //   if (gameState.currentRound < config.maxRounds) {
  //     // If there are more rounds to play, call nextRound()
  //     nextRound(gameState.currentRound + 1);
  //   } else {
  //     // If all rounds have been played, log a message and reset the game state
  //     console.log("Game Over - You have reached the maximum number of rounds.");
  //     setGameState({
  //       currentRound: 1,
  //       remainingGuesses: config.maxGuessesPerRound,
  //       currentWord: "", // TODO: Replace with randomCountry word generation logic.
  //       startTime: 0,
  //       elapsedTime: 0,
  //     });
  //     saveGameState(gameState);
  //     setLastRoundTimestamp(Date.now());
  //     if (lastRoundTimestamp) saveLastRoundTimestamp(lastRoundTimestamp);
  //   }
  // }
  // return {
  //   // gameState,
  //   // setGameState,
  //   startRound,
  //   endRound,
  //   nextRound,
  //   playGame,
  // };
}
