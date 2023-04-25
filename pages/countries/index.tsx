// "use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronsRightIcon } from "lucide-react";
import { GetStaticProps, NextPage } from "next";
import * as z from "zod";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CountryCard } from "@/components/country/country-card";
import { CountryTable } from "@/components/country/country-table";
import Layout from "@/components/layout";
import Search from "@/components/search";
import SelectRegion from "@/components/select-region";
import { SelectView } from "@/components/select-view";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API_BASE_URL } from "@/lib/constants";
import { Region, ResultsPerPage, ViewType } from "@/lib/enums";
import { filterCountryRegion, getViewType } from "@/lib/helpers";
import { useToast } from "@/lib/hooks/ui/use-toast";
import { usePagination } from "@/lib/hooks/use-pagination";
import { useAppStore } from "@/lib/state/app-store";
import { useCountryStore } from "@/lib/state/country-store";
import { ICountry } from "@/lib/types/types-country";
import { cn, fetcher } from "@/lib/utils";
import { Spinner } from "@/components/spinner";
import { useCountrySearch } from "@/lib/hooks/use-country-search";
import { SearchResult } from "@/lib/types/types-fuse-search-result";
import React from "react";

type CountriesPageProps = {
  countries: ICountry[];
};

/**
 * The `CountriesPage` function is a Next.js page that displays a list of countries
 * fetched from an external API. It uses the useQuery hook from the @tanstack/react-query
 * library for data fetching and caching.
 */
const CountriesPage: NextPage<CountriesPageProps> = ({ countries }) => {
  const { toast } = useToast();

  const {
    selectedRegion,
    setSelectedRegion,
    selectedView,
    setSelectedView,
    selectedResultsPerPage,
    setSelectedResultsPerPage,
    shouldAutoFilterUiOnSearch,
    setShouldAutoFilterUiOnSearch,
    searchedCountries,
    setSearchedCountries,
  } = useCountryStore();
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
    toast({ title: `Filtering region to ${value}` });
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

  const displayedCountries: ICountry[] =
    shouldAutoFilterUiOnSearch &&
    searchedCountries &&
    searchedCountries.length > 0
      ? searchedCountries.map((results) => results.item)
      : (cachedCountries as ICountry[]) || countries;

  const filteredCountries: ICountry[] = filterCountryRegion({
    selectedRegion,
    displayedCountries,
  });

  const styleHeader = cn(`${isOpenBanner ? "top-20 md:top-16" : "top-8"}
    sticky py-4 mb-2 z-30 w-full bg-white! bg-opacity-90 rounded-b-md backdrop-blur-2xl
    border-b-slate-200 dark:border-b-slate-700 dark:bg-slate-900/80!`);

  const styleSearchBar = cn(
    "relative z-10 flex flex-1 flex-wrap items-start justify-between"
  );

  // Display a loading spinner while data is being fetched.
  if (isLoading) {
    return <Spinner />;
  }
  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  // Render the list of countries.
  return (
    <Layout title="Countries">
      <header className={styleHeader}>
        <div className={styleSearchBar}>
          <Search />
          <SwitchAutoUpdateResultView
            label={`Auto update results`}
            isChecked={shouldAutoFilterUiOnSearch}
            setIsChecked={setShouldAutoFilterUiOnSearch}
            id={"inputAutoUpdateSearchUI"}
          />
          <SelectRegion
            selectedRegion={selectedRegion}
            handleRegionSelect={handleRegionSelect}
          />
          <SelectView
            selectedView={selectedView}
            handleSelectView={handleSelectView}
          />
        </div>
      </header>

      <div className="data">
        {countries ? (
          selectedView === ViewType.Default ||
          selectedView === ViewType.Cards ? (
            <PaginatedCollection data={filteredCountries} />
          ) : selectedView === ViewType.Table ? (
            <PaginatedCollection data={filteredCountries} />
          ) : null
        ) : null}
      </div>
    </Layout>
  );
};

// Static Site Generation feature for Next.js.
// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export const getStaticProps: GetStaticProps = async () => {
  const countries = await fetcher({ url: `${API_BASE_URL}/all` });
  return {
    props: {
      countries,
    },
    // ISR: Incremental Static Regeneration
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
};

// NOTE: getStaticPaths is only allowed for dynamic SSG pages and was found on '/countries'.
// Read more: https://nextjs.org/docs/messages/non-dynamic-getstaticpaths-usage
//
// // This function gets called at build time on server-side.
// // It may be called again, on a serverless function, if
// // the path has not been generated.
// export async function getStaticPaths() {
//   const countries: ICountry[] = await fetcher({ url: `${API_BASE_URL}/all` });

//   // const res = await fetch('https://.../posts')
//   // const posts = await res.json()

//   // Get the paths we want to pre-render based on posts
//   const paths = countries.map((country: ICountry) => ({
//     params: { id: country.alpha3Code },
//   }));

//   // We'll pre-render only these paths at build time.
//   // { fallback: 'blocking' } will server-render pages
//   // on-demand if the path doesn't exist.
//   return { paths, fallback: "blocking" };
// }

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

type CountryCardsProps = {
  cardsData: {
    [key: string]: any;
  }[] extends Array<ICountry>
    ? Array<ICountry>
    : any[];
};
function CountryCards({ cardsData }: CountryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cardsData.map((country: ICountry, idxCountry: number) => (
        <div key={`country-card-${country.alpha3Code}-${idxCountry}`}>
          <CountryCard country={country} />
        </div>
      ))}
    </div>
  );
}

export function PaginatedCollection<T>({
  data,
  ...props
}: PaginatedCollectionProps<T>) {
  const { selectedResultsPerPage, setSelectedResultsPerPage } =
    useCountryStore();
  const { selectedView, setSelectedView } = useCountryStore();
  const pagination = usePagination({
    data,
    initalPageSize: selectedResultsPerPage,
  });

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
      <div className=" scroll-mt-24! pb-8">
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

          <div className="hidden sm:flex sm:flex-1 sm:justify-between sm:items-center">
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

            <SelectResultsPerPage
              selectedValue={selectedResultsPerPage}
              handleSelectResultsPerPage={(value) => {
                setSelectedResultsPerPage(value);
                setPageSize(z.number().parse(Number(value)));
              }}
            />
            <div>
              <nav
                className="inline-flex -space-x-px rounded-md shadow-sm isolate"
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
                  <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
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
                  <ChevronsRightIcon className="w-5 h-5" aria-hidden="true" />
                </Button>
              </nav>
            </div>
          </div>
        </div>

        {/* {page.map(renderItem)} */}
        <div className="relative">
          <ScrollArea className="p-4 w-full rounded-md border h-[78vh] min-w-[350px]">
            {selectedView === ViewType.Default ||
            selectedView === ViewType.Cards ? (
              <CountryCards cardsData={page} />
            ) : selectedView === ViewType.Table ? (
              <CountryTable
                headerData={["Name", "Capital", "Population"]}
                keysToRender={["name", "capital", "population"]}
                tableData={page}
              />
            ) : null}
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

type SelectResultsPerPageProps = {
  selectedValue: ResultsPerPage;
  handleSelectResultsPerPage: (value: ResultsPerPage) => void;
};

export function SelectResultsPerPage({
  selectedValue,
  handleSelectResultsPerPage,
}: SelectResultsPerPageProps) {
  return (
    <Select
      value={z.string().parse(selectedValue.toString())}
      onValueChange={(value) =>
        handleSelectResultsPerPage(value as unknown as ResultsPerPage)
      }
    >
      <SelectTrigger
        title="Select results per page to view"
        className="w-[180px]"
      >
        <SelectValue placeholder="Select results per page" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value={ResultsPerPage.Ten.toString()}>
          <span className="capitalize">{ResultsPerPage.Ten}</span>
        </SelectItem>
        <SelectItem value={ResultsPerPage.Twenty.toString()}>
          <span className="capitalize">{ResultsPerPage.Twenty}</span>
        </SelectItem>
        <SelectItem value={ResultsPerPage.Fifty.toString()}>
          <span className="capitalize">{ResultsPerPage.Fifty}</span>
        </SelectItem>
        <SelectItem value={ResultsPerPage.OneHundred.toString()}>
          <span className="capitalize">{ResultsPerPage.OneHundred}</span>
        </SelectItem>
        <SelectItem value={ResultsPerPage.FiveHundred.toString()}>
          <span className="capitalize">
            {ResultsPerPage.FiveHundred && "All"}
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

type SwitchAutoUpdateResultViewProps = {
  label: string;
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  id: string;
};

export function SwitchAutoUpdateResultView({
  label,
  isChecked,
  setIsChecked,
  id,
  ...props
}: SwitchAutoUpdateResultViewProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isChecked}
        onCheckedChange={(e: boolean) => {
          setIsChecked(z.boolean().parse(e));
        }}
        id={id}
        {...props}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}
