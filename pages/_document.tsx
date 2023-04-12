import { Html, Head, Main, NextScript } from "next/document";

// https://www.npmjs.com/package/next-pwa
export default function Document() {
  const icons = [
    { href: "/assets/icons/icon-48x48.png", sizes: "48x48", type: "image/png" },
    { href: "/assets/icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
    { href: "/assets/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
    {
      href: "/assets/icons/icon-128x128.png",
      sizes: "128x128",
      type: "image/png",
    },
    {
      href: "/assets/icons/icon-144x144.png",
      sizes: "144x144",
      type: "image/png",
    },
    {
      href: "/assets/icons/icon-152x152.png",
      sizes: "152x152",
      type: "image/png",
    },
    {
      href: "/assets/icons/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      href: "/assets/icons/icon-384x384.png",
      sizes: "384x384",
      type: "image/png",
    },
    {
      href: "/assets/icons/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ];
  return (
    <Html lang="en">
      <Head>
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Apple */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PWA App" />
        {icons
          .filter((icon) => icon.sizes.startsWith("1"))
          .map((icon) => (
            <link
              key={icon.href}
              rel="apple-touch-icon"
              sizes={icon.sizes}
              href={icon.href}
            />
          ))}
        <link
          rel="apple-touch-startup-image"
          href="/assets/icons/apple_splash_2048.png"
        />

        {/* Microsoft */}
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-TileImage"
          content="/assets/icons/ms-icon-144x144.png"
        />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Favicon */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/assets/icons/favicon-16x16.png"
        />
        <link
          rel="mask-icon"
          href="/assets/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@yourtwitterhandle" />
        <meta name="twitter:title" content="PWA App" />
        <meta name="twitter:description" content="Best PWA App in the world" />
        <meta
          name="twitter:image"
          content="/assets/icons/android-chrome-192x192.png"
        />

        {/* <meta name="application-name" content="PWA App" /> */}
        {/* <meta name="apple-mobile-web-app-capable" content="yes" /> */}
        {/* <meta name="apple-mobile-web-app-status-bar-style" content="default" /> */}
        {/* <meta name="apple-mobile-web-app-title" content="PWA App" /> */}
        {/* <meta name="description" content="Best PWA App in the world" /> */}
        {/* <meta name="format-detection" content="telephone=no" /> */}
        {/* <meta name="mobile-web-app-capable" content="yes" /> */}
        {/* <meta name="msapplication-config" content="/assets/icons/browserconfig.xml" /> */}

        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        {/* <link rel="apple-touch-icon" href="/assets/icons/touch-icon-iphone.png" /> */}
        {/* <link rel="apple-touch-icon" sizes="152x152" href="/assets/icons/touch-icon-ipad.png" /> */}
        {/* <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/touch-icon-iphone-retina.png" /> */}
        {/* <link rel="apple-touch-icon" sizes="167x167" href="/assets/icons/touch-icon-ipad-retina.png" /> */}

        {/* <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png" /> */}
        {/* <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png" /> */}
        {/* <link rel="manifest" href="/manifest.json" /> <link rel="mask-icon" href="/assets/icons/safari-pinned-tab.svg" color="#5bbad5" /> */}
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" /> */}

        {/* Tip: Put the viewport head meta tag into _app.js rather than in _document.js if you need it. */}
        {/* <meta */}
        {/* name='viewport' */}
        {/* content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover' */}
        {/* /> */}

        {/* <meta name="twitter:card" content="summary" /> */}
        {/* <meta name="twitter:url" content="https://twitter.com/" /> */}
        {/* <meta name="twitter:title" content="Explorer PWA" /> */}
        {/* <meta name="twitter:description" content="Explorer countries search API aggregator" /> */}
        {/* <meta name="twitter:image" content="https://yourdomain.com/icons/android-chrome-192x192.png" /> */}
        {/* <meta name="twitter:creator" content="@DavidWShadow" /> */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Explorer PWA App" />
        <meta
          property="og:description"
          content="Explorer countries search API aggregator"
        />
        <meta property="og:site_name" content="Exporer PWA App" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta
          property="og:image"
          content="https://yourdomain.com/icons/apple-touch-icon.png"
        />

        {/* apple splash screen images */}
        {/* <link rel='apple-touch-startup-image' href='/images/apple_splash_2048.png' sizes='2048x2732' /> */}
        {/* <link rel='apple-touch-startup-image' href='/images/apple_splash_1668.png' sizes='1668x2224' /> */}
        {/* <link rel='apple-touch-startup-image' href='/images/apple_splash_1536.png' sizes='1536x2048' /> */}
        {/* <link rel='apple-touch-startup-image' href='/images/apple_splash_1125.png' sizes='1125x2436' /> */}
        {/* <link rel='apple-touch-startup-image' href='/images/apple_splash_1242.png' sizes='1242x2208' /> */}
        {/* <link rel='apple-touch-startup-image' href='/images/apple_splash_750.png' sizes='750x1334' /> */}
        {/* <link rel='apple-touch-startup-image' href='/images/apple_splash_640.png' sizes='640x1136' /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
