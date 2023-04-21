import Head from "next/head";
import React from "react";
import Navbar from "@/components/navbar";
import { Banner } from "./ui/banner";
import { Footer } from "./footer";

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

export default function Layout({ children, title, description }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>{title !== "Explorer" ? `${title} • Explorer` : title}</title>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={description} />
        {/* <meta name="theme-color" content="#000000" /> */}
      </Head>

      <header className="sticky top-0 z-40 w-full bg-white! border-b border-b-slate-200 dark:border-b-slate-700 dark:bg-slate-900!">
        <Banner
          // className="-z-50"
          title={"We have detected that you are from Earth. Parity Price: 50%"}
        />

        <div className="container flex-1">
          <Navbar />
        </div>
      </header>

      <main className="container flex-1">{children}</main>

      <Footer />
    </div>
  );
}
