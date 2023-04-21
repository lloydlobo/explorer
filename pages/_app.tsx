import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "jotai";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <meta charSet="UTF-8" /> */}
      {/* <meta httpEquiv="X-UA-Compatible" content="IE=edge" /> */}
      {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        // content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />

      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
          @apply font-[var(--font-inter)];
        }
      `}</style>

      <QueryClientProvider client={queryClient}>
        <Provider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ClerkProvider {...pageProps}>
              <Component {...pageProps} />
              <Toaster />
              <Analytics />
            </ClerkProvider>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </Provider>
      </QueryClientProvider>
    </>
  );
}
