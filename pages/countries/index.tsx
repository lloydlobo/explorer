import { useQuery } from "@tanstack/react-query";
import { useCountryStore } from "@/lib/state/country-store";
import { ICountry } from "@/lib/types/types-country";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/constants";
import Layout from "@/components/layout";
import { fetcher } from "@/lib/utils";
import { GetStaticProps, NextPage } from "next";

type CountriesPageProps = {
  countries: ICountry[];
};

// 1. Fetch countries by region from API
async function fetchCountriesByRegion(
  region: string
): Promise<unknown | ICountry[]> {
  const URL = `${API_BASE_URL}/region/${region}`;
  const countriesByRegion = await fetcher({ url: URL });
  return countriesByRegion;
}

const CountriesPage: NextPage<CountriesPageProps> = ({ countries }) => {
  // NOTE: PERF: Run useQuery if the `getStaticProp` data is stale.
  const {
    data: cachedCountries,
    isLoading,
    error,
  } = useQuery<ICountry[]>({
    queryKey: ["countries"],
    queryFn: () => fetcher({ url: `${API_BASE_URL}/all` }),
    initialData: countries,
    cacheTime: Infinity,
  });

  const state = useCountryStore();
  const {
    selectedCountry,
    setSelectedCountry,
    selectedRegion,
    setSelectedRegion,
  } = state;

  const handleCountryClick = (alpha3Code: string) => {
    setSelectedCountry(alpha3Code);
  };

  const handleRegionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.currentTarget.value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  const displayedCountries = (cachedCountries as ICountry[]) || countries;

  const filteredCountries =
    selectedRegion === "all"
      ? displayedCountries
      : displayedCountries?.filter(
          (country) => country.region === selectedRegion
        );

  return (
    <>
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
                    selectedCountry === country.alpha3Code
                      ? "text-blue-400"
                      : ""
                  }`}
                >
                  {country.name}
                </Link>
              ))}
          </div>
        </section>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const countries = await fetcher({ url: `${API_BASE_URL}/all` });
  return { props: { countries } };
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
