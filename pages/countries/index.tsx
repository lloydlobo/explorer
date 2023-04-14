import { useQuery } from "@tanstack/react-query";
import { useCountryStore } from "@/lib/state/country-store";
import { ICountry } from "@/lib/types/types-country";
import { API_BASE_URL } from "@/lib/constants";
import Layout from "@/components/layout";
import { cn, fetcher } from "@/lib/utils";
import { GetStaticProps, NextPage } from "next";
import SelectRegion from "@/components/select-region";
import Search from "@/components/search";
import { useToast } from "@/lib/hooks/ui/use-toast";
import { useState } from "react";
import { CountryList } from "@/components/country/country-list";

// Static Site Generation feature for Next.js.
export const getStaticProps: GetStaticProps = async () => {
  const countries = await fetcher({ url: `${API_BASE_URL}/all` });
  return { props: { countries } };
};

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
  const [isTable, setIsTable] = useState(false);

  // Get the selected country and region from the global store.
  const { selectedRegion, setSelectedRegion } = useCountryStore();

  // Fetch the list of countries using tanstack-query.
  const {
    data: cachedCountries, // data from cache or server
    isLoading,
    error,
  } = useQuery<ICountry[]>({
    queryKey: ["countries"], // key for caching
    queryFn: () => fetcher({ url: `${API_BASE_URL}/all` }), // function to fetch data
    initialData: countries, // initial data from getStaticProps
  });

  // Handle selection of a region.
  const handleRegionSelect = (value: string) => {
    setSelectedRegion(value);
    toast({
      title: `Filter: Region to ${value}`,
      description: "",
    });
  };

  // Display a loading spinner while data is being fetched.
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Display an error message if there was an error fetching the data.
  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  // Filter the list of countries based on the selected region.
  const displayedCountries = (cachedCountries as ICountry[]) || countries;
  const filteredCountries: ICountry[] =
    selectedRegion === "all"
      ? displayedCountries
      : displayedCountries?.filter(
          (country) => country.region === selectedRegion
        );

  const styleHeader = cn(
    "sticky top-10 z-30 py-2 mb-2 w-full bg-white bg-opacity-90 rounded-b-md backdrop-blur-2xl border-b-slate-200 dark:border-b-slate-700 dark:bg-slate-900/80"
  );
  const styleSearchBar = cn(
    "relative z-10 flex flex-1 flex-wrap items-start justify-between"
  );

  // Render the list of countries.
  return (
    <Layout title="Countries">
      <header className={styleHeader}>
        <div className={styleSearchBar}>
          <Search />
          <SelectRegion
            selectedRegion={selectedRegion}
            handleRegionSelect={handleRegionSelect}
          />
        </div>
      </header>

      {countries ? (
        <CountryList
          countries={filteredCountries}
          isTable={isTable}
          setIsTable={setIsTable}
        />
      ) : null}
    </Layout>
  );
};

export default CountriesPage;

// export default function HomePage() {
//   const [countries, setCountries] = useState<any[] | null>(null);
//
//   async function fetchData() {
//     const data = await fetcher(`${API_BASE_URL}/all`);
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
//               <li key={`country-${c}-${idxC}`}>{c.name.common}</li>
//             ))}
//         </ul>
//       </section>
//     </>
//   );
// }
//
//
//
// {/* <section> */}
// {/*   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"> */}
// {/*     {filteredCountries && */}
// {/*       filteredCountries.map((country, idxCountry) => { */}
// {/*         // For development, debugging use less results for fast load times. */}
// {/*         if (idxCountry < 300) { */}
// {/*           return ( */}
// {/*             <div key={`country-${country.alpha3Code}-${idxCountry}`}> */}
// {/*               <Card */}
// {/*                 padding="none" */}
// {/*                 paddingBody="p-4" */}
// {/*                 linkHref={`/countries/${country.alpha3Code}`} */}
// {/*                 action={ */}
// {/*                   <Button variant={"ghost"} className="ms-auto"> */}
// {/*                     Click Me */}
// {/*                   </Button> */}
// {/*                 } */}
// {/*                 onClick={(_e) => handleCountryClick(country.alpha3Code)} */}
// {/*                 isActive={selectedCountry === country.alpha3Code} */}
// {/*                 activeIndicator={ */}
// {/*                   <div className="absolute -top-2 right-3"> */}
// {/*                     <Indicator /> */}
// {/*                   </div> */}
// {/*                 } */}
// {/*                 title={country.name} */}
// {/*                 description={ */}
// {/*                   <div className="grid stats"> */}
// {/*                     <div className="flex gap-2 stat"> */}
// {/*                       <div className="font-bold">Population</div> */}
// {/*                       <div className="">{country.population}</div> */}
// {/*                     </div> */}
// {/*                     <div className="flex gap-2 stat"> */}
// {/*                       <div className="font-bold">Capital</div> */}
// {/*                       <div className="">{country.capital}</div> */}
// {/*                     </div> */}
// {/*                   </div> */}
// {/*                 } */}
// {/*                 imageUrl={country.flag} */}
// {/*                 imageAlt={`Flag of ${country.name}`} */}
// {/*               /> */}
// {/*             </div> */}
// {/*           ); */}
// {/*         } else { */}
// {/*           return null; */}
// {/*         } */}
// {/*       })} */}
// {/* </div> */}
// {/* </section> */}
