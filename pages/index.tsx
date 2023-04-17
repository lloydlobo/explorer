import { AccordianGuesses } from "@/components/accordion-guesses";
import {
  FlagGuessingGame,
  GameState,
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
    queryFn: () => fetcher({ url: `${API_BASE_URL}/all` }),
    initialData: countries, // use static data from staticProps if server error 500.
  });

  const length = cachedCountries?.length ?? 2;
  const random = Math.floor(Math.random() * length);

  // Is this useEffect necessary?
  useEffect(() => {
    setGameState(
      produce((draft) => {
        draft.countries = cachedCountries;
        draft.selectedCountry = cachedCountries[random];
      })
    );
  }, [cachedCountries, setGameState]);

  return (
    <Layout
      title="Home | Flag Guessring Game"
      description="Flag guessing game."
    >
      <div className="relative">
        <FlagGuessingGame />

        <div className="absolute scale-75 -z-50 top-0 right-0">
          <Image
            className="object-cover flex justify-center opacity-80! pointer-events-none"
            src={require("@/lib/dev/2023-04-17-1003-explorer.png")}
            alt={"architecture"}
          />
        </div>
      </div>
    </Layout>
  );
};

// Static Site Generation feature for Next.js.
export const getStaticProps: GetStaticProps = async () => {
  const countries = await fetcher({ url: `${API_BASE_URL}/all` });
  return { props: { countries } };
};

export default HomePage;
