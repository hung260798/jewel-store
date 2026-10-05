const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "localhost",
      "upload.wikimedia.org",
      "vivnpay.vn",
      "encrypted-tbn0.gstatic.com",
      "data-server-shop.onrender.com",
      "ip-api.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
    loader: "default",
  },
  env: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_SECRET: process.env.NEXT_PUBLIC_SECRET,
  },
  webpack(config) {
    config.resolve.extensions.push(".ts", ".tsx");

    // Optional: Add alias for shared packages
    // config.resolve.alias['@shared'] = path.resolve(__dirname, '../shared');

    return config;
  },
  experimental: {
    // externalDir: true, // ✅ This is key
  },
};

module.exports = nextConfig;
