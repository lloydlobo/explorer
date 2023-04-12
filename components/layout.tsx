import Head from "next/head";
import React from "react";
import Navbar from "@/components/navbar";
import Search from "./search";

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
        <Navbar />
        <Search />
      </header>

      {children}

      <footer>{CURRENT_YEAR}</footer>
    </>
  );
}
