import { useQuery } from "@tanstack/react-query";
import { GetStaticProps, NextPage } from "next";
import { ReactNode, useState } from "react";
import * as z from "zod";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CountryList } from "@/components/country/country-list";
import Layout from "@/components/layout";
import Search from "@/components/search";
import SelectRegion from "@/components/select-region";
import { SelectView } from "@/components/select-view";
import { API_BASE_URL } from "@/lib/constants";
import { Region, ResultsPerPage, ViewType } from "@/lib/enums";
import { filterCountryRegion, getViewType } from "@/lib/helpers";
import { useToast } from "@/lib/hooks/ui/use-toast";
import { useAppStore } from "@/lib/state/app-store";
import { useCountryStore } from "@/lib/state/country-store";
import { ICountry } from "@/lib/types/types-country";
import { cn, fetcher } from "@/lib/utils";
import produce from "immer";
import { SelectResultsPerPage } from "./SelectResultsPerPageProps";
import { usePagination } from "@/lib/hooks/use-pagination";
import { CountryCard } from "@/components/country/country-card";
import { ChevronLeftIcon, ChevronsRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type CountriesPageProps = {
  countries: ICountry[];
};
type PaginateState = {
  // resultsPerPage: number;
  currentPage: number;
  totalPages: number;
};

/**
 * The `CountriesPage` function is a Next.js page that displays a list of countries
 * fetched from an external API. It uses the useQuery hook from the @tanstack/react-query
 * library for data fetching and caching.
 */
const CountriesPage: NextPage<CountriesPageProps> = ({ countries }) => {
  const { toast } = useToast();

  const { selectedRegion, setSelectedRegion, selectedView, setSelectedView } =
    useCountryStore();
  const { isOpenBanner } = useAppStore();

  const {
    data: cachedCountries, // use default value if there's no cached data yet.
    isLoading,
    error,
  } = useQuery<ICountry[]>({
    queryKey: ["countries"], // key for caching
    queryFn: () => fetcher({ url: `${API_BASE_URL}/all` }), // function to fetch data
    initialData: countries, // initial data from getStaticProps
  }); // Fetch the list of countries using tanstack-query.

  const handleRegionSelect = (value: Region) => {
    setSelectedRegion(value);
    toast({
      title: `Filtering region to ${value}`,
      // description: `Reverting to page ${paginateState.currentPage}`,
    });
  };

  const handleSelectView = (value: string) => {
    const ViewTypeSchema = z.nativeEnum(ViewType); // Define a Zod schema for the ViewType enum
    try {
      const parsedValue = ViewTypeSchema.parse(value); // Validate the input against the schema.
      const selectedView = getViewType(parsedValue); // HACK:debt of not checking if it matches enum. Validate!
      setSelectedView(selectedView);
      toast({
        title: `View set to ${value}`,
        description: `${value} is a valid view type`,
      });
    } catch (err) {
      toast({
        title: `Failed to set view to ${value} as it is not a valid type`,
        description: `ERROR: ${err}`,
      });
      toast({
        title: `Reverting to ${getViewType(ViewType.Default)} view`,
      });
      setSelectedView(ViewType.Default);
      throw new Error(`${err}: ${value} is not a valid view type`);
    }
  };

  // Filter the list of countries based on the selected region.
  const displayedCountries = (cachedCountries as ICountry[]) || countries;
  const filteredCountries: ICountry[] = filterCountryRegion({
    selectedRegion,
    displayedCountries,
  });

  const styleHeader = cn(`${isOpenBanner ? "top-20 md:top-16" : "top-8"}
    sticky py-4 mb-2 z-30 w-full bg-white bg-opacity-90 rounded-b-md backdrop-blur-2xl
    border-b-slate-200 dark:border-b-slate-700 dark:bg-slate-900/80`);

  const styleSearchBar = cn(
    "relative z-10 flex flex-1 flex-wrap items-start justify-between"
  );

  // Display a loading spinner while data is being fetched.
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Display an error message if there was an error fetching the data.
  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }
  // Render the list of countries.
  return (
    <Layout title="Countries">
      <header className={styleHeader}>
        <div className={styleSearchBar}>
          <Search />
          <SelectView
            selectedView={selectedView}
            handleSelectView={handleSelectView}
          />
          <SelectRegion
            selectedRegion={selectedRegion}
            handleRegionSelect={handleRegionSelect}
          />
        </div>
      </header>

      {/* {countries ? (
        <CountryList
          countries={filteredCountries}
          selectedView={selectedView} // typescript: Type 'string' is not assignable to type 'ViewType'.
        />
      ) : null} */}

      {countries ? <PaginatedCollection data={filteredCountries} /> : null}
    </Layout>
  );
};

// Static Site Generation feature for Next.js.
export const getStaticProps: GetStaticProps = async () => {
  const countries = await fetcher({ url: `${API_BASE_URL}/all` });
  return { props: { countries } };
};

export default CountriesPage;

// export default function HomePage() {
//   const [countries, setCountries] = useState<any[] | null>(null);
//
//   async function fetchData() {
//     const data = await fetcher(`${ API_BASE_URL } / all`);
//     setCountries(data as any);
//   }
//
//   useState(() => {
//     fetchData();
//   });
//
//   return (
//     <>
//       <section>
//         <h1>Explorer</h1>
//       </section>
//       <section>
//         <ul>
//           {countries &&
//             countries.map((c, idxC) => (
//               <li key={`country - ${ c } - ${ idxC }`}>{c.name.common}</li>
//             ))}
//         </ul>
//       </section>
//     </>
//   );
// }

type PaginatedCollectionProps<T> = {
  data: Array<T>;
};

export function PaginatedCollection<T>({
  data,
  ...props
}: PaginatedCollectionProps<T>) {
  const pagination = usePagination(data);

  const {
    pageSize,
    setPageSize,
    pageIndex,
    setPageIndex,
    pageCount,
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    gotoPage,
  } = pagination;

  const pageButtons: React.ReactNode[] = [];
  const start = Math.max(0, pageIndex - 2);
  const end = Math.min(pageCount, pageIndex + 3);

  for (let i = start; i < end; i++) {
    const isCurrent = i === pageIndex;
    pageButtons.push(
      renderPageButton(i, isCurrent, () => {
        gotoPage(i);
      })
    );
  }

  // Render your table with the "page" array
  return (
    <>
      <div className=" scroll-mt-24!">
        <div className="flex top-24! sticky! items-center justify-between border-t border-gray-200! bg-white! px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              title={"Previous"}
              onClick={previousPage}
              disabled={!canPreviousPage}
              variant={"link"}
              className="relative inline-flex items-center rounded-md border border-gray-300! bg-white! px-4 py-2 text-sm font-medium text-gray-700! hover:bg-gray-50!"
            >
              Previous
            </Button>
            <Button
              title={"Next"}
              onClick={nextPage}
              disabled={!canNextPage}
              variant={"link"}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300! bg-white! px-4 py-2 text-sm font-medium text-gray-700! hover:bg-gray-50!"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium">{pageIndex * pageSize}</span> to{" "}
                <span className="font-medium">
                  {pageIndex * pageSize + pageSize}
                </span>{" "}
                of <span className="font-medium">{pageCount * pageSize}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <Button
                  title={"Previous"}
                  onClick={previousPage}
                  variant={"link"}
                  disabled={!canPreviousPage}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400! ring-1! ring-inset ring-gray-300! hover:bg-gray-50! focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </Button>
                {pageButtons}
                <Button
                  title={"Next"}
                  onClick={nextPage}
                  disabled={!canNextPage}
                  variant={"link"}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400! ring-1! ring-inset ring-gray-300! hover:bg-gray-50! focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Next</span>
                  <ChevronsRightIcon className="h-5 w-5" aria-hidden="true" />
                </Button>
              </nav>
            </div>
          </div>
        </div>

        <div className="relative">
          <ScrollArea className="h-[75vh] w-full min-w-[350px] rounded-md border p-4">
            <div
              className={"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"}
              {...props}
            >
              {/* {page.map(renderItem)} */}
              {page.map((country: ICountry, idxCountry) => (
                <div key={`country-card-${country.alpha3Code}-${idxCountry}`}>
                  <CountryCard country={country} />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
  // Use the pagination controls to update the "pageSize" and "pageIndex" values
  // Use the "pageOptions" array to render a list of page numbers for the user to click
}

function renderPageButton(
  idx: number,
  isCurrent: boolean,
  onClick: () => void
) {
  const humanReadableIdx = idx + 1;

  return isCurrent ? (
    <div key={`${idx}-button-current`}>
      <span
        key={`${idx}-current`}
        title={z.string().parse(humanReadableIdx.toString())}
        className="cursor-default relative z-10 inline-flex items-center bg-indigo-600! px-4 py-2 text-sm font-semibold text-white!"
      >
        ...
      </span>
    </div>
  ) : (
    <Button
      key={`${idx}-button`}
      onClick={onClick}
      variant={"link"}
      className={
        "relative z-10 rounded-sm inline-flex items-center bg-indigo-600! px-4 py-2 text-sm font-semibold text-white! focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      }
      disabled={isCurrent}
    >
      {humanReadableIdx}
    </Button>
  );
}
