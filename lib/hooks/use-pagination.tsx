import produce from "immer";
import { useMemo, useState } from "react";

/**
 * The `usePagination` hook returns pagination states and functions to update it.
 *
 * @param data - The data to paginate.
 * @param initalPageSize - The initial page size.
 * @param initalPageIndex - The initial page index.
 * @param manualPagination - If true, the pagination will not be controlled by the pageIndex and pageSize.
 * @returns The pagination state and functions to update it.
 *
 * @description The pagination state consists of the following:
 * - pageSize: The number of items per page.
 * - setPageSize: A function to update the pageSize.
 * - pageIndex: The current page index.
 * - setPageIndex: A function to update the pageIndex.
 * - pageCount: The total number of pages.
 * - page: The current page.
 * - pageOptions: An array of page numbers.
 * - canPreviousPage: A boolean indicating whether the previous page exists.
 * - canNextPage: A boolean indicating whether the next page exists.
 * - previousPage: A function to go to the previous page.
 * - nextPage: A function to go to the next page.
 * - gotoPage: A function to go to a specific page.
 *
 * @example
 * ```typescript
 * function MyTable({ data }) {
 *   const {
 *     pageSize,
 *     setPageSize,
 *     pageIndex,
 *     setPageIndex,
 *     pageCount,
 *     page,
 *     pageOptions,
 *     canPreviousPage,
 *     canNextPage,
 *     previousPage,
 *     nextPage,
 *     gotoPage,
 *   } = usePagination(data);
 *
 *   // Render your table with the "page" array
 *   // Use the pagination controls to update the "pageSize" and "pageIndex" values
 *   // Use the "pageOptions" array to render a list of page numbers for the user to click
 * }
 * ```
 */
export function usePagination<T extends Array<any>>(
  data: T,
  initalPageSize = 10,
  initalPageIndex = 0,
  manualPagination = false
) {
  const [pageSize, setPageSize] = useState(initalPageSize);
  const [pageIndex, setPageIndex] = useState(initalPageIndex);

  const pageCount = useMemo(() => {
    if (manualPagination) {
      return -1; // return data.length / pageSize;
    }
    const count = Math.ceil(data.length / pageSize);
    return count > 0 ? count : 1;
  }, [data.length, pageSize, manualPagination]); // }, [data, manualPagination, pageSize]);

  const page = useMemo(() => {
    const start = pageIndex * pageSize; // 0 * 10 = 0 // 1 * 10 = 10 // 2 * 10 = 20
    const end = start + pageSize; // 0 + 10 = 10 // 10 + 10 = 20 // 20 + 10 = 30
    return data.slice(start, end);
  }, [data, pageIndex, pageSize]);

  const pageOptions = useMemo(() => {
    if (manualPagination || pageCount === -1) {
      return []; // return [...Array(pageCount).keys()];
    }
    return Array.from({ length: pageCount }, (_, i) => i); // [0, 1, 2]
  }, [manualPagination, pageCount]);

  const canPreviousPage = useMemo(() => pageIndex > 0, [pageIndex]);

  const canNextPage = useMemo(() => {
    if (manualPagination) {
      return true;
    }

    const lastPageIndex = Math.max(0, pageCount - 1); // 2
    return pageIndex < lastPageIndex;
  }, [pageIndex, pageCount, manualPagination]);

  const previousPage = () => {
    if (canPreviousPage) {
      setPageIndex(pageIndex - 1);
      // setPageIndex( produce((draft) => { draft = pageIndex - 1; }));
    }
  };

  const nextPage = () => {
    if (canNextPage) {
      setPageIndex(pageIndex + 1);
      // setPageIndex( produce((draft) => { draft = pageIndex + 1; }));
    }
  };

  const gotoPage = (index: number) => {
    if (index >= 0 && index < pageCount) {
      setPageIndex(index);
    }
  };

  return {
    /** pageSize: The number of items per page.*/
    pageSize,
    /** setPageSize: A function to update the pageSize.*/
    setPageSize,
    /** pageIndex: The current page index.*/
    pageIndex,
    /** setPageIndex: A function to update the pageIndex.*/
    setPageIndex,
    /** pageCount: The total number of pages.*/
    pageCount,
    /** page - The current page that is element of the `data` array used as the source of the pagination in `usePagination`. */
    page,
    /** pageOptions: An array of page numbers.*/
    pageOptions,
    /** canPreviousPage: A boolean indicating whether the previous page exists.*/
    canPreviousPage,
    /** canNextPage: A boolean indicating whether the next page exists.*/
    canNextPage,
    /** previousPage: A function to go to the previous page.*/
    previousPage,
    /** nextPage: A function to go to the next page.*/
    nextPage,
    /** gotoPage: A function to go to a specific page.*/
    gotoPage,
  };
  // End of `usePagination` hook.
}
