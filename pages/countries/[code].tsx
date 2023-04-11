import { API_BASE_URL } from "@/lib/constants";
import { ICountry } from "@/lib/types/types-country";
import { useQuery } from "@tanstack/react-query";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
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

  const displayedCountry = cachedCountry || country;

  return (
    <div>
      <h1>{displayedCountry.name}</h1>
      <Image
        width={180}
        height={140}
        src={displayedCountry.flag}
        alt={`${displayedCountry.name} flag`}
      />
      <p>Population: {displayedCountry.population}</p>
      <p>Region: {displayedCountry.region}</p>
      <p>Capital: {displayedCountry.capital}</p>
    </div>
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
export default CountryPage;
