import { atom, useAtom } from "jotai";
import produce from "immer";
import { ICountry } from "../types/types-country";

// toGuess: null,
// guesses: [],
// toGuess: string | null;
// guesses: string[];

type GameAPIStore = {
  answer: null | ICountry;
  guesses: ICountry[];
};

type GameStore = {
  /**
   * Round would be the round no. at which the game is currently at.
   * HACK: is this neccessary? Are we mutating this initialState, or just using it as a reference?
   */
  currentRound: number;
  /**
   * Score or tries would be the round no. at which the correct guess was made.
   * NOTE: less rating is better. winning at 0 is earlier and better.
   */
  tries: number;
  /**
   * Game mode is the state of the game.
   */
  gameMode: GameMode;

  /**
   *  Game result is the result of the game.
   */
  gameResult: GameResult;
  /**
   * Total rounds would be the total number of rounds in the game.
   */
  readonly totalRounds: number; // NOTE: should this be readonly?
};

enum GameMode {
  Stopped,
  Playing,
  Paused,
}
enum GameResult {
  None,
  Draw,
  Loss,
  Won,
}

///////////////////////////////////////////////////////////////////////////////

const initialGameState: GameStore = {
  currentRound: 0,
  gameMode: GameMode.Stopped,
  gameResult: GameResult.None,
  tries: 0,
  totalRounds: 5,
} as const; // makes it readonly.

const initialGameAPIState: GameAPIStore = {
  answer: null,
  guesses: [],
};

///////////////////////////////////////////////////////////////////////////////

const gameGuessStateAtom = atom<GameAPIStore>(initialGameAPIState);
const gameStateAtom = atom<GameStore>(initialGameState);

export {
  gameGuessStateAtom,
  GameMode,
  GameResult,
  gameStateAtom,
  initialGameAPIState,
  initialGameState,
};

export type { GameStore, GameAPIStore };
