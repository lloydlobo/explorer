import { useQuery } from "@tanstack/react-query";
import { GetStaticProps, NextPage } from "next";
import { useState } from "react";
import * as z from "zod";

import { CountryList } from "@/components/country/country-list";
import Layout from "@/components/layout";
import Search from "@/components/search";
import SelectRegion from "@/components/select-region";
import { SelectView } from "@/components/select-view";
import { API_BASE_URL } from "@/lib/constants";
import { Region, ViewType } from "@/lib/enums";
import { filterCountryRegion, getViewType } from "@/lib/helpers";
import { useToast } from "@/lib/hooks/ui/use-toast";
import { useAppStore } from "@/lib/state/app-store";
import { useCountryStore } from "@/lib/state/country-store";
import { ICountry } from "@/lib/types/types-country";
import { cn, fetcher } from "@/lib/utils";

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

  const { selectedRegion, setSelectedRegion, selectedView, setSelectedView } =
    useCountryStore();
  const { isOpenBanner } = useAppStore();

  const urlTemplateString = `${API_BASE_URL}/all`;
  const url = new URL(API_BASE_URL);
  url.pathname = "all";
  console.log({
    url,
    urlTemplateString,
    matches: url.toString() === urlTemplateString,
  });

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
      description: "",
    });
  };

  const handleSelectView = (value: string) => {
    const ViewTypeSchema = z.nativeEnum(ViewType); // Define a Zod schema for the ViewType enum
    try {
      const parsedValue = ViewTypeSchema.parse(value); // Validate the input against the schema.
      const selectedView = getViewType(parsedValue); // HACK:debt of not checking if it matches enum. Validate!
      setSelectedView(selectedView);
      toast({ title: `View set to ${value}` });
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

      {countries ? (
        <CountryList
          countries={filteredCountries}
          selectedView={selectedView} // typescript: Type 'string' is not assignable to type 'ViewType'.
        />
      ) : null}
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
