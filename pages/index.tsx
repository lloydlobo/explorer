import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useCountryStore } from "@/lib/state/country-store";
import { ICountry } from "@/lib/types/types-country";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/constants";

async function fetcher(url: string): Promise<any> {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("axios error", err);
    } else {
      console.error("unexpected error", err);
    }
  }
}

export default function HomePage() {
  const { data, isLoading, error } = useQuery<ICountry[]>({
    queryKey: ["countries"],
    queryFn: () => fetcher(`${API_BASE_URL}/all`),
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

  // `filteredData` is a new array created by filtering data based on the selectedRegion state. If selectedRegion is "all", all countries are included, otherwise only countries with a matching region property are included. This is achieved using the filter method, which iterates through the data array and returns a new array that satisfies the provided callback function.
  const filteredData = data?.filter((country) => {
    if (selectedRegion === "all") {
      return true;
    } else {
      return country.region === selectedRegion;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <section>
        <header>
          <h1 className="font-bold">Explorer</h1>

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
      </section>
      <section>
        <div className="grid">
          {filteredData &&
            filteredData.map((country, idxCountry) => (
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
