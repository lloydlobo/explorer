import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useCountryStore } from "@/lib/state/country-store";

const API_BASE_URL = "https://restcountries.com/v3.1";

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
  const { data, isLoading, error } = useQuery({
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

  const handleCountryClick = (countryName: string) => {
    setSelectedCountry(countryName);
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
              id=""
            >
              <option value="all">All</option>
              <option value="America">America</option>
              <option value="Oceania">Oceania</option>
              <option value="Asia">Asia</option>
            </select>
          </div>
        </header>
      </section>
      <section>
        <ul>
          {data &&
            data.map((c: any, idxC: number) => (
              <li
                key={`country-${c}-${idxC}`}
                onClick={() => handleCountryClick(c.name.common)}
                className={`${selectedCountry === c.name.common ? "text-blue-400" : ""
                  }`}
              >
                {c.name.common}
              </li>
            ))}
        </ul>
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
