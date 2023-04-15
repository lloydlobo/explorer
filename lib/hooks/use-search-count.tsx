import { useEffect } from "react";
import { SearchResult } from "../types/types-fuse-search-result";

/**
 * Props for the `useSearchCount` hook.
 */
interface Props {
  /**
   * The search results to count.
   */
  searchResults: SearchResult[];
  /**
   * The search query string.
   */
  query: string;
  /**
   * A callback function to set the search count.
   */
  setSearchCount?: React.Dispatch<React.SetStateAction<number>>;
  /**
   * The score cap or cutoff to use for filtering search results.
   */
  searchScoreCutoff?: SearchResult["score"];
}

/**
 * A custom hook that counts the number of search results with good scores.
 * @param props - The props for the hook.
 */
export function useSearchCount({
  searchResults,
  query,
  setSearchCount,
  searchScoreCutoff = 4,
}: Props) {
  /**
   * Determines whether a score is good, based on the score cap.
   * @param score - The score to check.
   * @param rating - The score cap.
   * @returns Whether the score is good.
   */
  const isGoodScore = (score: number, rating: number = 4) =>
    score * 100 >= 0 && score * 100 <= rating;

  useEffect(() => {
    const goodScoreResultsCount =
      searchResults?.filter((result) =>
        isGoodScore(result.score ?? 0, searchScoreCutoff)
      )?.length ?? 0;

    if (setSearchCount) {
      if (query.length > 0) {
        setSearchCount(goodScoreResultsCount || searchResults.length || 0);
      } else {
        setSearchCount(0);
      }
    }

    /**
     * Resets the search count when the component unmounts.
     * This is a common practice to prevent memory leaks and avoid updating state on unmounted components.
     */
    return () => {
      if (setSearchCount) {
        setSearchCount(0);
      }
    };
  }, [searchResults, query, setSearchCount, searchScoreCutoff]);
}
