import { atom, useAtom } from "jotai";
import produce from "immer";
import { ViewType } from "../enums";

interface AppState {
  selectedCountry: string | null;
  selectedRegion: string;
  selectedView: ViewType;
}

const appStateAtom = atom<AppState>({
  selectedCountry: null,
  selectedRegion: "all",
  selectedView: ViewType.Cards,
});

/**
 * Returns an object containing the following properties:
 *
 * - `selectedCountry`: The currently selected country from the app state.
 * - `setSelectedCountry(selectedCountry: string | null)`: A function that updates the selectedCountry value in the app state.
 * - `selectedRegion`: The currently selected region from the app state.
 * - `setSelectedRegion(selectedRegion: string)`: A function that updates the selectedRegion value in the app state.
 * - `selectedView`: The currently selected view from the app state.
 * - `setSelectedView(selectedView: ViewType)`: A function that updates the selectedView value in the app state.
 *
 * This hook uses the `appStateAtom` atom to store the entire application state, including `selectedCountry`,
 * `selectedRegion`, and `selectedView`. The `useAtom` hook is used to read and update the state atom. The `setSelectedCountry`,
 * `setSelectedRegion`, and `setSelectedView` functions update the app state by creating a new state object with the updated
 * values for `selectedCountry`, `selectedRegion`, and `selectedView`, respectively, using the Jotai `setAtom` function.
 *
 * The `setSelectedCountry`, `setSelectedRegion`, and `setSelectedView` functions use Immer's `produce` function to create a
 * draft copy of the app state. The function can directly modify this draft copy. Once the function has completed, Immer compares
 * the draft copy to the original state, and generates a new immutable state based on the changes made to the draft. This allows us
 * to write code that looks like we're directly mutating the state, but in reality, Immer is doing the heavy lifting to ensure
 * that our state updates are handled correctly.
 */
// NOTE: Without `Immer`: `const setSelectedCountry = (selectedCountry: string | null) => setAppState((state) => ({ ...state, selectedCountry }));`
export function useCountryStore() {
  const [appState, setAppState] = useAtom(appStateAtom);

  const setSelectedCountry = (selectedCountry: string | null) =>
    setAppState(
      produce((draft) => {
        draft.selectedCountry = selectedCountry;
      })
    );

  const setSelectedRegion = (selectedRegion: string) =>
    setAppState(
      produce((draft) => {
        draft.selectedRegion = selectedRegion;
      })
    );

  const setSelectedView = (selectedView: ViewType) =>
    setAppState(
      produce((draft) => {
        draft.selectedView = selectedView;
      })
    );

  return {
    /**
     * `selectedCountry`: The currently selected country from the app state.
     */
    selectedCountry: appState.selectedCountry,
    /**
     * `setSelectedCountry(selectedCountry: string | null)`: A function that updates the
     * `selectedCountry` value in the app state.
     */
    setSelectedCountry,
    /**
     * `selectedRegion`: The currently selected region from the app state.
     */
    selectedRegion: appState.selectedRegion,
    /**
     * `setSelectedRegion(selectedRegion: string)`: A function that takes in a string value
     *
     *and updates the selectedRegion value in the app state.
     */
    setSelectedRegion,
    /**
     * selectedView: The currently selected view from the app state.
     */
    selectedView: appState.selectedView,
    /**
     * setSelectedView(selectedView: ViewType): A function that takes in a ViewType value
     * and updates the selectedView value in the app state.
     */
    setSelectedView,
  };
}

/**
 * CountryStore is a type alias for the return type of the useCountryStore hook, which
 * contains the following properties:
 * - selectedCountry: The currently selected country from the app state.
 * - setSelectedCountry(selectedCountry: string | null): A function that updates the
 *   selectedCountry value in the app state.
 * - selectedRegion: The currently selected region from the app state.
 * - setSelectedRegion(selectedRegion: string): A function that takes in a string value
 *   and updates the selectedRegion value in the app state.
 * - selectedView: The currently selected view from the app state.
 * - setSelectedView(selectedView: ViewType): A function that takes in a ViewType value
 *   and updates the selectedView value in the app state.
 */
export type CountryStore = ReturnType<typeof useCountryStore>;
