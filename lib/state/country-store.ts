import { atom, useAtom } from "jotai";

interface AppState {
  selectedCountry: string | null;
  selectedRegion: string;
}

const appStateAtom = atom<AppState>({
  selectedCountry: null,
  selectedRegion: "all",
});

/**
 * useCountryStore is a custom hook that returns an object containing:
 *
 * - selectedCountry: the currently selected country from the app state.
 * - setSelectedCountry: a function that takes in a string or null value and updates the selectedCountry value in the app state.
 * - selectedRegion: the currently selected region from the app state.
 * - setSelectedRegion: a function that takes in a string value and updates the selectedRegion value in the app state.
 *
 * It uses the `appStateAtom` atom to store the entire application state, including both selectedCountry and selectedRegion.
 * The `useAtom` hook is used to read and update the state atom. The `setSelectedCountry` and `setSelectedRegion` functions
 * update the app state by creating a new state object with the updated values for `selectedCountry` and `selectedRegion`,
 * respectively, using the Jotai `setAtom` function.
 */
export function useCountryStore() {
  const [appState, setAppState] = useAtom(appStateAtom);

  const setSelectedCountry = (selectedCountry: string | null) =>
    setAppState((state) => ({ ...state, selectedCountry }));

  const setSelectedRegion = (selectedRegion: string) =>
    setAppState((state) => ({ ...state, selectedRegion }));

  return {
    selectedCountry: appState.selectedCountry,
    setSelectedCountry,
    selectedRegion: appState.selectedRegion,
    setSelectedRegion,
  };
}

export type CountryStore = ReturnType<typeof useCountryStore>;
