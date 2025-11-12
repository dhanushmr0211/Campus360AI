/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Optional: Configure image domains if using next/image
  images: {
    domains: [],
  },
  
  // Optional: Enable standalone output for Docker deployments
  // output: 'standalone',
};

module.exports = nextConfig;
