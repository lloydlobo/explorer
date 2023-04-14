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
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>
          {title !== "Lloyd Lobo" ? `${title} • Lloyd Lobo` : title}
        </title>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <header className="sticky top-0 z-40 w-full bg-white border-b border-b-slate-200 dark:border-b-slate-700 dark:bg-slate-900">
        <Banner
          title={"We have detected that you are from Earth. Parity Price: 50%"}
        />

        <div className="container flex-1">
          <Navbar />
        </div>
      </header>

      <main className="container flex-1">{children}</main>

      <footer className="container">{CURRENT_YEAR}</footer>
    </div>
  );
}
