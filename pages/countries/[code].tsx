import Layout from "@/components/layout";
import { API_BASE_URL } from "@/lib/constants";
import { ICountry } from "@/lib/types/types-country";
import { useQuery } from "@tanstack/react-query";
import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

/* 
*List of codes

Search by cca2, ccn3, cca3 or cioc country code (yes, any!)

https://restcountries.com/v3.1/alpha?codes={code},{code},{code}

https://restcountries.com/v3.1/alpha?codes=170,no,est,pe */

type CountryPageProps = {
  country: {
    name: string;
    flag: string;
    population: number;
    region: string;
    capital: string;
  };
};

const CountryPage: NextPage<CountryPageProps> = ({ country }) => {
  const router = useRouter();
  const code = router.query.code as string;

  const { data: cachedCountry } = useQuery({
    queryKey: ["country", code],
    queryFn: () =>
      fetch(`${API_BASE_URL}/alpha/${code}`).then((res) => res.json()),
    initialData: country,
    cacheTime: Infinity,
  });

  const displayedCountry = (cachedCountry as ICountry) || country;

  return (
    <Layout title={displayedCountry.name}>
      <h1>{displayedCountry.name}</h1>
      <Image
        width={180}
        height={140}
        alt={`${displayedCountry.name} flag`}
        // src={displayedCountry.flags?.png ?? displayedCountry.flag}
        src={displayedCountry.flag}
      />
      <p>Population: {displayedCountry.population}</p>
      <p>Region: {displayedCountry.region}</p>
      <p>Capital: {displayedCountry.capital}</p>
    </Layout>
  );
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
  const res = await fetch(`${API_BASE_URL}/alpha/${code}}`);
  const country = await res.json();

  return {
    props: {
      country,
    },
  };
};

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

export default CountryPage;
