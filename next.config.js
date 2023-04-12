/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }
//
// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  // https://github.com/shadowwalker/next-pwa/blob/1e6af5fa9f6a807930f451adb5ab5078d5cda451/examples/offline-fallback-v2/next.config.js
  // fallbacks: {
  //   image: "/static/images/fallback.png",
  //   // document: '/other-offline',  // if you want to fallback to a custom page other than /_offline
  //   // font: '/static/font/fallback.woff2',
  //   // audio: ...,
  //   // video: ...,
  // },
  // disable: process.env.NODE_ENV === 'development',
  // register: true,
  // scope: '/app',
  // sw: 'service-worker.js',
});

module.exports = withPWA({
  reactStrictMode: true,
  // images: {
  //   domains: ["source.unsplash.com"],
  // },
});
