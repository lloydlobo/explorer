import { AccordianGuesses } from "@/components/accordion-guesses";
import {
  FlagGuessingGame,
  gameStateAtom,
} from "@/components/country-guessing-game";
import Layout from "@/components/layout";
import { API_BASE_URL } from "@/lib/constants";
import { ICountry } from "@/lib/types/types-country";
import { fetcher } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import produce from "immer";
import { useAtom } from "jotai";
import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { cache, useEffect, useState } from "react";
import countriesJSON from "@/lib/data.json";
import { Spinner } from "@/components/spinner";

type HomePageProps = {
  countries: ICountry[];
};

const HomePage: NextPage<HomePageProps> = ({ countries }: HomePageProps) => {
  const [gameState, setGameState] = useAtom(gameStateAtom);

  const {
    data: cachedCountries,
    isLoading,
    error,
  } = useQuery<ICountry[]>({
    queryKey: ["countries"],
    queryFn: async () => await fetcher({ url: `${API_BASE_URL}/all` }),
    initialData: countries, // use static data from staticProps if server error 500.
  });

  const length = cachedCountries?.length ?? 2;
  const random = Math.floor(Math.random() * length);

  // Is this useEffect necessary?
  useEffect(() => {
    try {
      if (cachedCountries) {
        setGameState(
          produce((draft) => {
            draft.countries = cachedCountries;
            draft.selectedCountry = cachedCountries[random];
          })
        );
      }
      // else if (countries) {
      //   setGameState(
      //     produce((draft) => {
      //       draft.countries = countries;
      //       draft.selectedCountry = countries[random];
      //     })
      //   );
      // }
      else {
        setGameState(
          produce((draft) => {
            draft.countries = countriesJSON;
            draft.selectedCountry = countriesJSON[random];
          })
        );
      }
    } catch (err) {
      console.error(err);
      // TODO: Maybe invalidate useQuery?
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedCountries, setGameState]);

  // Display a loading spinner while data is being fetched.
  if (isLoading) {
    return <Spinner />;
  }

  // Display an error message if there was an error fetching the data.
  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Layout title="Home | Flag Guessing Game" description="Flag guessing game.">
      <div className="relative">
        <FlagGuessingGame />
      </div>
    </Layout>
  );
};

// Static Site Generation feature for Next.js.
export const getStaticProps: GetStaticProps = async () => {
  const countries = await fetcher({ url: `${API_BASE_URL}/all` });
  return {
    props: {
      countries,
    },
    // ISR: Incremental Static Regeneration
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
};

export default HomePage;
