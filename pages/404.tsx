import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function NotFoundError404Page() {
  const router = useRouter();
  return (
    <Layout title="404">
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl font-extrabold tracking-tight lg:text-9xl text-primary-600 dark:text-primary-500">
              404
            </h1>
            <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
              Something&apos;s missing.
            </p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              Sorry, we can&apos;t find that page. You&apos;ll find lots to
              explore on the home page.{" "}
            </p>
            <div className="flex justify-center gap-2">
              <Button variant={"outline"}>
                <Link
                  href="/"
                  // className="inline-flex py-2.5 px-5 my-4 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none bg-primary-600 dark:focus:ring-primary-900 hover:bg-primary-800 focus:ring-primary-300"
                >
                  Back to Homepage
                </Link>
              </Button>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
