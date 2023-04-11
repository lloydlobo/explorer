import { useState } from "react";
import axios from "axios";

// const inter = Inter({ subsets: ["latin"] });
const API_BASE_URL = "https://restcountries.com/v3.1";

async function fetcher(url: string): Promise<unknown> {
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
  const [countries, setCountries] = useState<any[] | null>(null);

  async function fetchData() {
    const data = await fetcher(`${API_BASE_URL}/all`);
    setCountries(data as any);
  }

  useState(() => {
    fetchData();
  });

  return (
    <>
      <section>
        <h1>Explorer</h1>
      </section>
      <section>
        <ul>
          {countries &&
            countries.map((c, idxC) => (
              <li key={`country-${c}-${idxC}`}>{c.name.common}</li>
            ))}
        </ul>
      </section>
    </>
  );
}
