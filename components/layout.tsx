import Head from "next/head";
import React from "react";
import Navbar from "@/components/navbar";
import { Banner } from "./ui/banner";

const CURRENT_YEAR = new Date().getFullYear();

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({ children, title }: LayoutProps) {
  return (
    <>
      <Head>
        <title>
          {title !== "Lloyd Lobo" ? `${title} • Lloyd Lobo` : title}
        </title>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <header>
        <div className="grid w-full">
          <Banner
            title={
              "We have detected that you are from Earth. Parity Price: 50%"
            }
          />
        </div>
        <Navbar />
      </header>

      {children}

      <footer>{CURRENT_YEAR}</footer>
    </>
  );
}
