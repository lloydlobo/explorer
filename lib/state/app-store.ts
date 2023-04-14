/**
 * This code defines a Jotai store using the atom function from Jotai
 * to manage the state of a simple application.
 *
 * The appStateAtom contains an object with a single property isOpenBanner
 * that is initialized to true.
 * The useAppStore function is used to access the store and returns an
 * object with two properties: isOpenBanner and setIsOpenBannerToggle.
 * The isOpenBanner property contains the current value of the isOpenBanner
 * property in the store and setIsOpenBannerToggle is a function that can be
 * called to toggle the value of isOpenBanner using the setAppState function
 * from Jotai.
 * setAppState takes a function that produces a new state using the produce
 * function from Immer.
 */

import { atom, useAtom } from "jotai";
import produce from "immer";

interface AppState {
  isOpenBanner: boolean;
}

const appStateAtom = atom<AppState>({
  isOpenBanner: true,
});

/**
 * `useAppStore` is a custom store hook for accessing and updating the app state.
 * It uses the Jotai store to access the state and provide a function to modify it.
 *
 * @returns An object containing the current value of `isOpenBanner`
 * and a function for updating it.
 */
export function useAppStore() {
  const [appState, setAppState] = useAtom(appStateAtom);

  /**
   * A function for toggling the `isOpenBanner` value using `Immer`
   * for immutability.
   */
  const setIsOpenBannerToggle = () =>
    setAppState(
      produce((draft) => {
        draft.isOpenBanner = !draft.isOpenBanner;
      })
    );

  return {
    /**
     * `isOpenBanner` - The current value of `isOpenBanner` in the app state atom.
     */
    isOpenBanner: appState.isOpenBanner,
    /**
     * `setIsOpenBannerToggle` - A function for toggling the `isOpenBanner` value.
     */
    setIsOpenBannerToggle,
  };
}

export type AppStore = ReturnType<typeof useAppStore>;
