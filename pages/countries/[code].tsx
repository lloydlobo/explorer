import Layout from "@/components/layout";
import { API_BASE_URL } from "@/lib/constants";
import { ICountry } from "@/lib/types/types-country";
import { fetcher } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { GetStaticPaths, GetStaticProps, NextPage } from "next"; // GetServerSideProps,
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type CountryPageProps = {
  country: ICountry;
  borderCountries: ICountry[];
};

const CountryPage: NextPage<CountryPageProps> = ({
  country,
  borderCountries,
}) => {
  const router = useRouter();
  const code = router.query.code as string;

  const { data: cachedCountry } = useQuery({
    queryKey: ["country", code],
    queryFn: async () =>
      await fetcher({ url: `${API_BASE_URL}/alpha/${code}` }),
    initialData: country, // cacheTime: Infinity,
  });

  const displayedCountry = (cachedCountry as ICountry) ?? country;

  return (
    <Layout title={displayedCountry.name}>
      <h1>{displayedCountry.name}</h1>
      <Image
        width={180}
        height={140}
        alt={`${displayedCountry.name} flag`}
        src={displayedCountry.flag}
      />
      <p>Population: {displayedCountry.population}</p>
      <p>Region: {displayedCountry.region}</p>
      <p>Capital: {displayedCountry.capital}</p>

      <div className="flex gap-2 max-w-prose">
        <div className="font-bold">Borders</div>
        <div className="flex flex-wrap gap-2">
          {borderCountries.map((borderCountry, idx) => (
            <Link
              key={`border-${borderCountry.alpha3Code}-${idx}-${displayedCountry.name}`}
              href={`/countries/${borderCountry.alpha3Code}`}
              className="p-2 min-w-max text-xs text-center rounded-lg border"
            >
              {borderCountry.name}
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

/**
 * Fetches an array of `ICountry` objects for the given array of border codes.
 *
 * Uses the Rest Countries API and the `fetcher` utility function to retrieve data.
 *
 * @param borders An array of border `alpha3Code` codes.
 * @returns An array of `ICountry` objects for the borders that are found.
 *
 * NOTE: `filter(Boolean)` removes falsy values from an array in JavaScript.
 * Falsy values include `false`, `0`, `null`, `undefined`, `NaN`, and the empty string `''`.
 * Thus, `filter(Boolean)` creates a new array with only the truthy values.
 */
export const fetchBordersWithCountries = async (
  borders: string[]
): Promise<ICountry[]> => {
  // Fetch all countries from the Rest Countries API.
  const countries = await fetcher<ICountry[]>({ url: `${API_BASE_URL}/all` });

  // Create a lookup object for the countries using their `alpha3Code` as the key.
  const countryMap: Record<string, ICountry> = {};
  for (const country of countries) {
    countryMap[country.alpha3Code] = country;
  }

  // Map the border codes to their corresponding countries in the countryMap object.
  // Filter out any undefined values, which occur when a border code is not found in the countryMap object.
  return borders
    .map((border: ICountry["alpha3Code"]) => countryMap[border])
    .filter(Boolean) as ICountry[];
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${API_BASE_URL}/all`);
  const countries: ICountry[] = await res.json();

  const paths = countries.map((country: ICountry) => ({
    params: { code: country.alpha3Code },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const code = params?.code as string;

  const country = await fetcher<ICountry>({
    url: `${API_BASE_URL}/alpha/${code}`,
  });

  const borderCountries = await fetchBordersWithCountries(
    country.borders ?? []
  );

  return {
    props: {
      country,
      borderCountries,
    },
  };
};

export default CountryPage;

// NOTE: x You can not use getStaticProps or getStaticPaths with getServerSideProps. To use SSG, please remove getServerSideProps
//If you need dynamic data that changes frequently and can't be pre-rendered at build time, then you should use getServerSideProps. This function runs on every request and fetches the data, which means you can always show the most up-to-date information to the user.
//
// On the other hand, if you have data that is relatively static and can be pre-rendered at build time, then you should use getStaticProps. This function fetches the data at build time and generates HTML pages that can be served to users without having to re-fetch the data every time.
//
// If you have a mix of dynamic and static data, you can use a combination of both getStaticProps and getServerSideProps, or use the fallback option in getStaticPaths to generate pages on demand using getServerSideProps when the requested data is not available at build time.
// getStaticProps is used for generating static pages at build time. This means that the page data is pre-rendered and served as static HTML files. This can provide very fast page load times as the files are already generated and don't require any server-side processing. However, getStaticProps is limited by the fact that it can only be used for pages that don't require dynamic data or user-specific content.
//
// getServerSideProps, on the other hand, generates the page data on each request, which can result in slower load times. However, it can be used for pages that require dynamic data or user-specific content, as it can fetch the data on each request.
//
// Both methods are commonly used in Next.js applications, depending on the use case. getStaticProps is generally preferred for pages that can be pre-rendered at build time, while getServerSideProps is used for pages that require dynamic data or user-specific content.
//
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const code = params?.code as string;
//   const res = await fetch(`${API_BASE_URL}/alpha/${code}}`);
//   const country = await res.json();
//
//   return {
//     props: {
//       country,
//     },
//   };
// };

// (
//   const countryMap: TBorderCountryLookup = {};
//   countries.forEach((country) => { countryMap[country.alpha3Code] = country; });
//   const countryMap = countries.reduce((map: TBorderCountryLookup, country) => {
//     map[country.alpha3Code] = country;
//     return map;
//   }, {});
//   const countryMap = countries.reduce(
//     (map: TBorderCountryLookup, country) => ( (map[country.alpha3Code] = country), map), {}
//   );
// )
