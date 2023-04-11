import { useQuery } from "@tanstack/react-query";
import { useCountryStore } from "@/lib/state/country-store";
import { ICountry } from "@/lib/types/types-country";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/constants";
import Layout from "@/components/layout";
import { fetcher } from "@/lib/utils";

export default function CountriesPage() {
  const { data, isLoading, error } = useQuery<ICountry[]>({
    queryKey: ["countries"],
    queryFn: () => fetcher({ url: `${API_BASE_URL}/all` }),
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

  // PERF: Can improve load time by:
  // 1. Fetching countries by region from API.
  // 2. using conditional `all` to break the filter method and just return the whole data.
  const filteredData = data?.filter((country) => {
    if (selectedRegion === "all") {
      return true;
    } else {
      return country.region === selectedRegion;
    }
  });

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
            {filteredData &&
              filteredData.map((country, idxCountry) => (
                <Link
                  href={`/countries/${country.alpha3Code}`}
                  key={`country-${country.alpha3Code}-${idxCountry}`}
                  onClick={() => handleCountryClick(country.alpha3Code)}
                  className={`${selectedCountry === country.alpha3Code
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
}

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
