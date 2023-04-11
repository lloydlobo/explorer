import { useQuery } from "@tanstack/react-query";
import { useCountryStore } from "@/lib/state/country-store";
import { ICountry } from "@/lib/types/types-country";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/constants";
import Layout from "@/components/layout";
import { fetcher } from "@/lib/utils";
import { GetStaticProps, NextPage } from "next";

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
  // Get the selected country and region from the global store.
  const state = useCountryStore();
  const {
    selectedCountry,
    setSelectedCountry,
    selectedRegion,
    setSelectedRegion,
  } = state;

  // Fetch the list of countries using tanstack-query.
  const {
    data: cachedCountries, // data from cache or server
    isLoading,
    error,
  } = useQuery<ICountry[]>({
    queryKey: ["countries"], // key for caching
    queryFn: () => fetcher({ url: `${API_BASE_URL}/all` }), // function to fetch data
    initialData: countries, // initial data from getStaticProps
    // cacheTime: Infinity, // how long to keep the data in cache, set to Infinity for now
  });

  // Handle click on a country link.
  const handleCountryClick = (alpha3Code: string) => {
    setSelectedCountry(alpha3Code);
  };

  // Handle selection of a region.
  const handleRegionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.currentTarget.value);
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

  // Render the list of countries.
  return (
    <Layout title="Countries">
      <header className="py-2">
        <div>
          <select
            name="Filter by region"
            value={selectedRegion}
            onChange={(e) => handleRegionSelect(e)}
          >
            <option value="all">All</option>
            <option value="Africa">Africa</option>
            <option value="Americas">Americas</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Oceania">Oceania</option>
          </select>
        </div>
      </header>

      <section>
        <div className="grid">
          {filteredCountries &&
            filteredCountries.map((country, idxCountry) => (
              <Link
                href={`/countries/${country.alpha3Code}`}
                key={`country-${country.alpha3Code}-${idxCountry}`}
                onClick={() => handleCountryClick(country.alpha3Code)}
                className={`${
                  selectedCountry === country.alpha3Code ? "text-blue-400" : ""
                }`}
              >
                {country.name}
              </Link>
            ))}
        </div>
      </section>
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
