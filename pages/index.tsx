import Link from "next/link";
import Layout from "@/components/layout";

export default function HomePage() {
  return (
    <>
      <Layout title="Home">
        <section className="bg-white dark:bg-gray-900">
          <div className="grid py-8 px-4 mx-auto max-w-screen-xl lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
            <div className="place-self-center mr-auto lg:col-span-7">
              <h1 className="mb-4 max-w-2xl text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
                Get fair prices worldwide with Parity Price Checker
              </h1>
              <p className="mb-6 max-w-2xl font-light text-gray-500 md:text-lg lg:mb-8 lg:text-xl dark:text-gray-400">
                Our simple web app, powered by REST Countries API, lets you
                compare product prices across different countries. Choose the
                country and product you want to compare and we&apos;ll handle
                the rest.
              </p>
              <a
                href="#"
                className="inline-flex justify-center items-center py-3 px-5 mr-3 text-base font-medium text-center text-white rounded-lg focus:ring-4 bg-primary-700 dark:focus:ring-primary-900 hover:bg-primary-800 focus:ring-primary-300"
              >
                Get started
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 dark:text-white dark:border-gray-700 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                Get API
              </a>
            </div>
            <div className="hidden lg:flex lg:col-span-5 lg:mt-0">
              <img
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png"
                alt="mockup"
              />
            </div>
          </div>
          <div className="sr-only">
            With our easy-to-use web app, you can quickly check the prices of
            different products across different countries to ensure you&apos;re
            getting a fair deal.
          </div>
          <HeroSearchBar />
        </section>

        <section className="bg-white dark:bg-gray-900">
          <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
            <div className="mb-8 max-w-screen-md lg:mb-16">
              <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Global pricing made easy
              </h2>
              <p className="text-gray-500 sm:text-xl dark:text-gray-400">
                Determine the correct price to pay in each country, simplifying
                the process for companies of all sizes.
              </p>
            </div>
            <div className="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
              <div>
                <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full lg:w-12 lg:h-12 bg-primary-100 dark:bg-primary-900">
                  <svg
                    className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600 dark:text-primary-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold dark:text-white">
                  Marketing collaboration
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Collaborate seamlessly with your team to plan, create, and
                  launch successful marketing campaigns each month using our
                  marketing plan.
                </p>
              </div>
              <div>
                <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full lg:w-12 lg:h-12 bg-primary-100 dark:bg-primary-900">
                  <svg
                    className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600 dark:text-primary-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold dark:text-white">
                  Legal compliance
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Stay protected and compliant with our structured workflows and
                  custom permissions designed specifically for your organization
                  and devices.
                </p>
              </div>
              <div>
                <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full lg:w-12 lg:h-12 bg-primary-100 dark:bg-primary-900">
                  <svg
                    className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600 dark:text-primary-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold dark:text-white">
                  Business Automation
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Automate tasks, send notifications, and more with our
                  customizable templates that make it easy to get started.
                </p>
              </div>
              <div>
                <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full lg:w-12 lg:h-12 bg-primary-100 dark:bg-primary-900">
                  <svg
                    className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600 dark:text-primary-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold dark:text-white">
                  Finance management
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Ensure financial operations are audit-proof with our software
                  built for critical tasks like month-end close and quarterly
                  budgeting.
                </p>
              </div>
              <div>
                <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full lg:w-12 lg:h-12 bg-primary-100 dark:bg-primary-900">
                  <svg
                    className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600 dark:text-primary-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold dark:text-white">
                  Seamless enterprise design
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Craft beautiful, seamless experiences for marketing and
                  product teams with our real cross-company collaboration.
                </p>
              </div>
              <div>
                <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full lg:w-12 lg:h-12 bg-primary-100 dark:bg-primary-900">
                  <svg
                    className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600 dark:text-primary-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold dark:text-white">
                  Operations
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Efficiently manage, track and monitor parity prices for each
                  country in real-time, ensuring your company always stays
                  up-to-date with the latest pricing information.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900">
          <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl sm:py-16 md:grid md:grid-cols-2 lg:px-6 xl:gap-16">
            <img
              className="w-full dark:hidden"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg"
              alt="dashboard image"
            />
            <img
              className="hidden w-full dark:block"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup-dark.svg"
              alt="dashboard image"
            />
            <div className="mt-4 md:mt-0">
              <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Let&apos;s build together and create a more connected world.
              </h2>
              <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
                Join Explorer today and start using our online tool and API to
                check parity prices for countries and access all the details
                about each country.
              </p>
              <a
                href="#"
                className="inline-flex items-center py-2.5 px-5 text-sm font-medium text-center text-white rounded-lg focus:ring-4 bg-primary-700 dark:focus:ring-primary-900 hover:bg-primary-800 focus:ring-primary-300"
              >
                Get started
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

export function HeroSearchBar() {
  return (
    <div className="mb-6 w-full">
      <div className="flex flex-col justify-between items-center p-4 rounded-lg border border-gray-200 shadow-sm sm:flex-row dark:bg-gray-800 dark:border-gray-700 bg-gray-45">
        <div className="flex-shrink-0 w-full sm:flex sm:w-auto">
          <div className="relative flex-shrink-0 mb-4 w-full sm:mr-4 sm:mb-0 sm:w-64 lg:w-96">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <label htmlFor="search" className="hidden">
              Search block sections:
            </label>
            <input
              id="search"
              type="text"
              className="block p-2.5 py-2 pl-10 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 dark:placeholder-gray-400 dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search block sections"
              defaultValue=""
            />
          </div>
          <label htmlFor="category" className="hidden">
            Select category:
          </label>
          <select
            id="category"
            className="block p-2.5 py-2 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 sm:w-40 dark:placeholder-gray-400 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="all">All categories</option>
            <option value="marketing">Marketing UI</option>
            <option value="application">Application UI</option>
            <option value="publisher">Publisher UI</option>
          </select>
        </div>
        <div className="hidden text-sm text-gray-600 sm:block dark:text-gray-400">
          Showing 52 results.
        </div>
      </div>
    </div>
  );
}
